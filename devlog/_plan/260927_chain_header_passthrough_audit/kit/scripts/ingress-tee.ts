// Transparent recording reverse proxy placed between a real client and the
// first ocx hop, so each run records exactly what the client sent (ingress)
// next to what the mock upstream received (egress).
//
//   GET /__ctl/run?name=<run>&target=<http://host:port>
//
// HTTP (incl. SSE) is streamed through; WebSocket upgrades are proxied frame
// by frame. Only Host is rewritten (to the target authority); hop-by-hop
// headers are dropped as any proxy would.
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.TEE_PORT ?? 10400);
const HOST = process.env.TEE_HOST ?? "127.0.0.1";
const SUFFIX = process.env.TEE_SUFFIX ?? "ingress";
const CAPTURE_DIR = process.env.CAPTURE_DIR ?? "./captures";
mkdirSync(CAPTURE_DIR, { recursive: true });
let run = "default";
let target = process.env.TEE_TARGET ?? "http://127.0.0.1:10100";

const HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "proxy-connection", "te", "trailer", "host", "content-length",
  "sec-websocket-key", "sec-websocket-version", "sec-websocket-extensions", "sec-websocket-accept"]);

function record(entry: Record<string, unknown>) {
  appendFileSync(join(CAPTURE_DIR, `${run}.${SUFFIX}.jsonl`), JSON.stringify({ ts: new Date().toISOString(), run, ...entry }) + "\n");
}
// TEE_REDACT=1 (use it with real credentials): same redaction format as ocx-launcher.ts.
const REDACT = process.env.TEE_REDACT === "1";
const SECRET = new Set(["authorization", "x-api-key", "x-opencodex-api-key", "cookie", "proxy-authorization"]);
function redactValue(v: string): string {
  const digest = new Bun.CryptoHasher("sha256").update(v).digest("hex").slice(0, 12);
  const m = /^(Bearer\s+)?(.*)$/i.exec(v)!;
  return `${m[1] ?? ""}${m[2].slice(0, 12)}…<redacted sha256:${digest}>`;
}
function headerObject(h: Headers, forRecord = true): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => { out[k] = forRecord && REDACT && SECRET.has(k) ? redactValue(v) : v; });
  return out;
}

type WsData = { url: string; headers: Record<string, string>; protocols: string[]; upstream?: WebSocket; queue: (string | ArrayBuffer)[] };

Bun.serve<WsData, {}>({
  port: PORT,
  hostname: HOST,
  idleTimeout: 255,
  async fetch(req, srv) {
    const url = new URL(req.url);
    if (url.pathname === "/__ctl/run") {
      run = url.searchParams.get("name") ?? run;
      target = url.searchParams.get("target") ?? target;
      return Response.json({ run, target });
    }
    const headers = headerObject(req.headers);
    const rawHeaders = headerObject(req.headers, false);
    const dest = new URL(url.pathname + url.search, target).toString();
    const fwd = new Headers();
    for (const [k, v] of Object.entries(rawHeaders)) if (!HOP.has(k)) fwd.set(k, v);
    if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
      record({ kind: "ws-handshake", method: req.method, path: url.pathname, query: url.search, headers });
      const protocols = (req.headers.get("sec-websocket-protocol") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      fwd.delete("sec-websocket-protocol");
      const data: WsData = { url: dest.replace(/^http/, "ws"), headers: Object.fromEntries(fwd.entries()), protocols, queue: [] };
      if (srv.upgrade(req, { data })) return undefined as unknown as Response;
      return new Response("upgrade failed", { status: 400 });
    }
    const raw = req.method === "GET" || req.method === "HEAD" ? "" : await req.text();
    let body: unknown = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }
    record({ kind: "http", method: req.method, path: url.pathname, query: url.search, headers, body: body ?? undefined, rawBody: body ? undefined : raw || undefined });
    const res = await fetch(dest, { method: req.method, headers: fwd, body: raw || undefined, redirect: "manual", decompress: false } as RequestInit);
    record({ kind: "http-response", path: url.pathname, status: res.status, headers: headerObject(res.headers) });
    const rh = new Headers(res.headers);
    rh.delete("content-length"); rh.delete("transfer-encoding"); rh.delete("connection");
    return new Response(res.body, { status: res.status, headers: rh });
  },
  websocket: {
    open(ws) {
      const d = ws.data;
      // Bun's client WebSocket accepts a headers option.
      const up = new WebSocket(d.url, { headers: d.headers, protocols: d.protocols } as any);
      d.upstream = up;
      up.onopen = () => { for (const m of d.queue) up.send(m); d.queue = []; };
      up.onmessage = (ev) => { ws.send(typeof ev.data === "string" ? ev.data : new Uint8Array(ev.data as ArrayBuffer)); };
      up.onclose = (ev) => { record({ kind: "ws-upstream-close", code: ev.code, reason: ev.reason }); try { ws.close(); } catch {} };
      up.onerror = () => { record({ kind: "ws-upstream-error" }); try { ws.close(1011, "upstream error"); } catch {} };
    },
    message(ws, msg) {
      const text = typeof msg === "string" ? msg : new TextDecoder().decode(msg);
      let frame: unknown = null;
      try { frame = JSON.parse(text); } catch { /* raw */ }
      record({ kind: "ws-frame", body: frame ?? undefined, rawBody: frame ? undefined : text });
      const up = ws.data.upstream;
      if (up && up.readyState === WebSocket.OPEN) up.send(text); else ws.data.queue.push(text);
    },
    close(ws) { try { ws.data.upstream?.close(); } catch {} },
  },
});
console.log(`${SUFFIX} tee on ${HOST}:${PORT} -> ${target}`);
