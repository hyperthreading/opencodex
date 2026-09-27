// Launch an ocx server with globalThis.fetch / globalThis.WebSocket patched
// BEFORE any ocx module is imported, then run the real CLI entry
// (`src/cli/index.ts start …`), so the full `ocx start` path is exercised.
//
//   LAUNCH_MODE=redirect (default)  requests to an intercepted host are rewritten to
//                                   $MOCK_URL/__<origin>/<path> (nothing leaves the machine)
//   LAUNCH_MODE=tee                 requests to an intercepted host are RECORDED and then sent
//                                   to the ORIGINAL destination unchanged (stage 2, real OAuth).
//
// Tee recording (same record schema as mock-upstream.ts, so diff-captures.ts reads it):
//   TEE_CAPTURE_DIR   directory for per-run files      (default ./captures)
//   TEE_RUN_FILE      file whose content is the current run name (written by lib.sh set_run);
//                     records go to $TEE_CAPTURE_DIR/<run>.tee.jsonl
//   TEE_REDACT=0      disable credential redaction (default: redacted — authorization,
//                     x-api-key, x-opencodex-api-key, cookie keep only a prefix + sha256/12)
//   TEE_HOSTS         comma list overriding the intercepted hosts (e.g. add 127.0.0.1 to
//                     exercise tee mode offline against the mock)
//
// usage: bun ocx-launcher.ts <path-to-opencodex/src/cli/index.ts> start --port N ...
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const MODE = process.env.LAUNCH_MODE ?? "redirect";
const MOCK_URL = process.env.MOCK_URL ?? "http://127.0.0.1:10300";
const TEE_CAPTURE_DIR = process.env.TEE_CAPTURE_DIR ?? "./captures";
const TEE_RUN_FILE = process.env.TEE_RUN_FILE ?? "";
const TEE_REDACT = process.env.TEE_REDACT !== "0";
const DEFAULT_INTERCEPT: Record<string, string> = {
  "chatgpt.com": "chatgpt",
  "api.anthropic.com": "anthropic",
  "auth.openai.com": "openai-auth",
  "console.anthropic.com": "anthropic-console",
  "platform.claude.com": "anthropic-platform",
};
const INTERCEPT: Record<string, string> = process.env.TEE_HOSTS
  ? Object.fromEntries(process.env.TEE_HOSTS.split(",").map((h) => h.trim()).filter(Boolean)
      .map((h) => [h, DEFAULT_INTERCEPT[h] ?? h.replace(/[^a-z0-9]+/gi, "-")]))
  : DEFAULT_INTERCEPT;

const realFetch = globalThis.fetch;
const RealWebSocket = globalThis.WebSocket;

// ---------------- redirect mode ----------------
function redirectUrl(u: URL): URL {
  const base = new URL(MOCK_URL);
  const out = new URL(`/__${INTERCEPT[u.hostname]}${u.pathname}${u.search}`, base);
  if (u.protocol === "wss:" || u.protocol === "ws:") out.protocol = "ws:";
  return out;
}

// ---------------- tee mode ----------------
const SECRET_HEADERS = new Set(["authorization", "x-api-key", "x-opencodex-api-key", "cookie", "proxy-authorization"]);
function redactValue(v: string): string {
  const digest = createHash("sha256").update(v).digest("hex").slice(0, 12);
  const m = /^(Bearer\s+)?(.*)$/i.exec(v)!;
  return `${m[1] ?? ""}${m[2].slice(0, 12)}…<redacted sha256:${digest}>`;
}
function headerRecord(h: Headers): Record<string, string> {
  const o: Record<string, string> = {};
  h.forEach((v, k) => { o[k] = TEE_REDACT && SECRET_HEADERS.has(k) ? redactValue(v) : v; });
  return o;
}
function currentRun(): string {
  try { if (TEE_RUN_FILE && existsSync(TEE_RUN_FILE)) return readFileSync(TEE_RUN_FILE, "utf8").trim() || "default"; } catch {}
  return "default";
}
function teeWrite(entry: Record<string, unknown>) {
  mkdirSync(TEE_CAPTURE_DIR, { recursive: true });
  const run = currentRun();
  appendFileSync(join(TEE_CAPTURE_DIR, `${run}.tee.jsonl`), JSON.stringify({ ts: new Date().toISOString(), run, ...entry }) + "\n", { mode: 0o600 });
}
async function bodyText(input: RequestInfo | URL, init?: RequestInit): Promise<string | undefined> {
  try {
    const b = init?.body;
    if (typeof b === "string") return b;
    if (b instanceof Uint8Array || b instanceof ArrayBuffer) return new TextDecoder().decode(b as ArrayBuffer);
    if (!b && input instanceof Request) return await input.clone().text();
    if (b) return `<${Object.prototype.toString.call(b)}>`;
  } catch { return "<unreadable>"; }
  return undefined;
}
function parseJson(s: string | undefined): unknown {
  if (!s) return undefined;
  try { return JSON.parse(s); } catch { return undefined; }
}
function frameRecord(data: unknown) {
  const text = typeof data === "string" ? data : data instanceof Uint8Array || data instanceof ArrayBuffer ? new TextDecoder().decode(data as ArrayBuffer) : String(data);
  const body = parseJson(text);
  return body !== undefined ? { body } : { rawBody: text };
}

// ---------------- patches ----------------
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const raw = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  let u: URL;
  try { u = new URL(raw); } catch { return realFetch(input, init); }
  if (!INTERCEPT[u.hostname]) return realFetch(input, init);
  if (MODE === "tee") {
    const h = new Headers(input instanceof Request ? input.headers : undefined);
    if (init?.headers) new Headers(init.headers).forEach((v, k) => h.set(k, v));
    const text = await bodyText(input, init);
    const body = parseJson(text);
    teeWrite({ kind: "http", method: init?.method ?? (input instanceof Request ? input.method : "GET"), path: u.pathname, query: u.search,
      origin: INTERCEPT[u.hostname], headers: headerRecord(h), body, rawBody: body === undefined ? text : undefined });
    return realFetch(input, init);
  }
  // An explicit per-request proxy / TLS option would otherwise send the rewritten
  // plain-HTTP loopback request into the operator's egress proxy.
  const nextInit: any = init ? { ...init } : undefined;
  if (nextInit) { delete nextInit.proxy; delete nextInit.tls; delete nextInit.unix; }
  const target = redirectUrl(u);
  if (input instanceof Request) return realFetch(new Request(target, input), nextInit);
  return realFetch(target, nextInit);
}) as typeof fetch;
Object.assign(globalThis.fetch, realFetch);

globalThis.WebSocket = new Proxy(RealWebSocket, {
  construct(target, args, newTarget) {
    let u: URL | null = null;
    try { u = new URL(String(args[0])); } catch { /* not a URL */ }
    if (!u || !INTERCEPT[u.hostname]) return Reflect.construct(target, args, newTarget);
    const opts = args[1];
    if (MODE === "tee") {
      const hdrs = opts && typeof opts === "object" && !Array.isArray(opts) ? (opts as any).headers : undefined;
      teeWrite({ kind: "ws-handshake", method: "GET", path: u.pathname, query: u.search, origin: INTERCEPT[u.hostname], headers: headerRecord(new Headers(hdrs ?? {})) });
      const ws = Reflect.construct(target, args, newTarget) as WebSocket;
      const send = ws.send.bind(ws);
      const path = u.pathname, origin = INTERCEPT[u.hostname];
      ws.send = (data: any) => { teeWrite({ kind: "ws-frame", path, origin, ...frameRecord(data) }); return send(data); };
      return ws;
    }
    const rewritten = [redirectUrl(u).toString(), ...args.slice(1)];
    if (rewritten[1] && typeof rewritten[1] === "object" && !Array.isArray(rewritten[1])) {
      const o = { ...(rewritten[1] as any) }; delete o.proxy; delete o.tls; rewritten[1] = o;
    }
    return Reflect.construct(target, rewritten, newTarget);
  },
});

const [entry, ...rest] = process.argv.slice(2);
if (!entry) throw new Error("usage: ocx-launcher.ts <src/cli/index.ts> <args...>");
process.argv = [process.argv[0], entry, ...rest];
console.error(`[launcher] mode=${MODE} hosts=${Object.keys(INTERCEPT).join(",")} ${MODE === "tee" ? `capture=${TEE_CAPTURE_DIR} redact=${TEE_REDACT}` : `mock=${MOCK_URL}`} args=${rest.join(" ")}`);
await import(entry);
