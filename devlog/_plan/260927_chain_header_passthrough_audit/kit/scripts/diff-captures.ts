// Compare what the client sent (ingress tee) against what each downstream hop
// received (mid tee = local→hub, egress = mock upstream), request by request.
//
//   bun diff-captures.ts <captures-dir> <scenario> <runA> <runB> <runC>  > table.md
//
// runA: client → mock directly  (egress only; ingress == egress by construction)
// runB: client → tee → hub → mock          (ingress + egress)
// runC: client → tee → local → tee → hub → mock   (ingress + mid + egress)
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type Rec = { kind: string; method?: string; path?: string; headers?: Record<string, string>; body?: any; rawBody?: string; origin?: string };
type Req = { path: string; transport: "http" | "ws"; headers: Record<string, string>; body: any };

const [dir, scenario, runA, runB, runC] = process.argv.slice(2);

function load(file: string): Rec[] {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
}

const INFERENCE = /\/(responses|responses\/compact|messages)$/;
function inference(recs: Rec[]): Req[] {
  const out: Req[] = [];
  let wsHeaders: Record<string, string> = {};
  let wsPath = "";
  for (const r of recs) {
    if (r.kind === "ws-handshake") { wsHeaders = r.headers ?? {}; wsPath = r.path ?? ""; continue; }
    if (r.kind === "ws-frame" && r.body?.type === "response.create") {
      if (r.body.generate === false) continue; // Codex prewarm frame
      out.push({ path: `${wsPath} (ws)`, transport: "ws", headers: wsHeaders, body: r.body });
      continue;
    }
    if (r.kind === "http" && r.method === "POST" && r.path && INFERENCE.test(r.path) && !/count_tokens/.test(r.path)) {
      out.push({ path: r.path, transport: "http", headers: r.headers ?? {}, body: r.body });
    }
  }
  return out;
}

// JWTs (all synthetic here) are shown as their ChatGPT account claim only.
function jwtLabel(jwt: string): string {
  try {
    const claims = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString("utf8"));
    const acct = claims?.["https://api.openai.com/auth"]?.chatgpt_account_id;
    return acct ? `<jwt acct=${acct}>` : "<jwt>";
  } catch { return "<jwt>"; }
}
const REDACT = (s: string) => s.replace(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g, jwtLabel).replace(/ocx_[A-Za-z0-9_]+/g, "ocx_<REDACTED>").replace(/(sk-[A-Za-z0-9-]{3})[A-Za-z0-9_-]{6,}/g, "$1…");
function short(v: unknown, n = 60): string {
  if (v === undefined) return "—";
  let s = typeof v === "string" ? v : JSON.stringify(v);
  s = REDACT(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function get(obj: any, path: string): unknown {
  let cur = obj;
  for (const k of path.split(".")) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// Derived body probes: where cache_control sits, which tool types, opaque state round trip.
function probes(body: any): Record<string, unknown> {
  if (!body || typeof body !== "object") return {};
  const p: Record<string, unknown> = {};
  const cc: string[] = [];
  if (Array.isArray(body.system)) body.system.forEach((b: any, i: number) => b?.cache_control && cc.push(`system[${i}]`));
  if (Array.isArray(body.messages)) body.messages.forEach((m: any, i: number) => Array.isArray(m?.content) && m.content.forEach((c: any, j: number) => c?.cache_control && cc.push(`messages[${i}].content[${j}]`)));
  if (Array.isArray(body.tools)) body.tools.forEach((t: any, i: number) => t?.cache_control && cc.push(`tools[${i}]`));
  if (body.cache_control) cc.push("top-level");
  if (body.messages || body.system) p["cache_control@"] = cc.length ? cc.join(",") : undefined;
  if (Array.isArray(body.tools)) p["tools(types)"] = [...new Set(body.tools.map((t: any) => t?.type ?? "custom-def"))].join(",");
  if (Array.isArray(body.tools)) p["tools(count)"] = body.tools.length;
  const inp = Array.isArray(body.input) ? body.input : [];
  const enc = inp.filter((i: any) => i?.type === "reasoning").map((i: any) => i.encrypted_content).filter(Boolean);
  if (inp.length) p["input[].reasoning.encrypted_content"] = enc.length ? enc.join(",") : undefined;
  const cmp = inp.filter((i: any) => i?.type === "compaction" || i?.type === "compaction_summary").map((i: any) => i.encrypted_content);
  if (inp.length) p["input[].compaction"] = cmp.length ? cmp.join(",") : undefined;
  if (inp.length) p["input[] compaction_trigger"] = inp.some((i: any) => i?.type === "compaction_trigger") || undefined;
  if (inp.length) p["input[].id kept"] = inp.some((i: any) => typeof i?.id === "string") || undefined;
  if (inp.length) p["input(types)"] = inp.map((i: any) => i?.type ?? i?.role).join(",");
  const sigs: string[] = [];
  if (Array.isArray(body.messages)) body.messages.forEach((m: any) => Array.isArray(m?.content) && m.content.forEach((c: any) => c?.type === "thinking" && sigs.push(c.signature)));
  if (body.messages) p["messages[].thinking.signature"] = sigs.length ? sigs.join(",") : undefined;
  if (body.messages) p["messages(count)"] = body.messages.length;
  return p;
}

const HEADER_ITEMS = [
  "authorization", "x-api-key", "x-opencodex-api-key", "user-agent", "originator", "session_id", "session-id", "thread-id",
  "x-client-request-id", "x-codex-turn-metadata", "x-codex-window-id", "x-codex-beta-features", "x-codex-turn-state",
  "x-codex-installation-id", "x-codex-parent-thread-id", "x-codex-routing-hint", "x-openai-subagent", "openai-beta", "chatgpt-account-id",
  "anthropic-version", "anthropic-beta", "anthropic-dangerous-direct-browser-access", "x-app", "x-claude-code-session-id",
  "x-stainless-*", "accept", "accept-encoding", "content-type",
];
const BODY_ITEMS = [
  "model", "stream", "store", "prompt_cache_key", "client_metadata", "metadata", "metadata.user_id", "previous_response_id", "include",
  "reasoning", "service_tier", "text.verbosity", "text", "parallel_tool_calls", "tool_choice", "instructions",
  "thinking", "context_management", "max_tokens", "max_output_tokens", "output_config", "temperature", "system",
];

function headerVal(h: Record<string, string>, name: string): unknown {
  if (name === "x-stainless-*") {
    const ks = Object.keys(h).filter((k) => k.startsWith("x-stainless-")).sort();
    return ks.length ? ks.map((k) => `${k.slice(12)}=${h[k]}`).join(";") : undefined;
  }
  return h[name];
}
function bodyVal(b: any, name: string): unknown {
  const v = get(b, name);
  if (name === "system" && v !== undefined) return typeof v === "string" ? `string(${v.length})` : `blocks(${Array.isArray(v) ? v.length : "?"})`;
  if (name === "instructions" && typeof v === "string") return `string(${v.length})`;
  return v;
}

function status(src: unknown, dst: unknown): string {
  const s = JSON.stringify(src), d = JSON.stringify(dst);
  if (src === undefined && dst === undefined) return "";
  if (src === undefined) return "➕ added";
  if (dst === undefined) return "❌ dropped";
  if (s === d) return "✅ kept";
  return "✏️ changed";
}

const capture = (run: string, suffix: string) => inference(load(join(dir, `${run}${suffix}.jsonl`)));
// Stage 2 (launcher tee mode) records the hub's real upstream sends as <run>.tee.jsonl.
const EGRESS = process.env.EGRESS_SUFFIX ?? "";
const A = capture(runA, process.env.BASELINE_SUFFIX ?? "");
const Bin = capture(runB, ".ingress"), Bout = capture(runB, EGRESS);
const Cin = capture(runC, ".ingress"), Cmid = capture(runC, ".mid"), Cout = capture(runC, EGRESS);

const n = Math.max(A.length, Bout.length, Cout.length, Bin.length, Cin.length);
console.log(`## ${scenario}\n`);
console.log(`Runs: (a) \`${runA}\`  (b) \`${runB}\`  (c) \`${runC}\`  — inference requests: a=${A.length}, b=${Bin.length}→${Bout.length}, c=${Cin.length}→${Cmid.length}→${Cout.length}\n`);
for (let i = 0; i < n; i++) {
  const a = A[i], bi = Bin[i], bo = Bout[i], ci = Cin[i], cm = Cmid[i], co = Cout[i];
  console.log(`### request #${i + 1}  (${[a?.path, bi?.path, bo?.path, ci?.path, cm?.path, co?.path].map((x) => x ?? "∅").join(" | ")})\n`);
  console.log("| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |");
  console.log("|---|---|---|---|---|---|---|");
  const row = (label: string, f: (r?: Req) => unknown) => {
    const va = f(a), vbi = f(bi), vbo = f(bo), vci = f(ci), vcm = f(cm), vco = f(co);
    if ([va, vbi, vbo, vci, vcm, vco].every((v) => v === undefined)) return;
    console.log(`| ${label} | ${short(va)} | ${short(vbi)} | ${short(vbo)} ${status(vbi, vbo)} | ${short(vci)} | ${short(vcm)} ${status(vci, vcm)} | ${short(vco)} ${status(vci, vco)} |`);
  };
  for (const h of HEADER_ITEMS) row(`hdr \`${h}\``, (r) => (r ? headerVal(r.headers, h) : undefined));
  for (const b of BODY_ITEMS) row(`body \`${b}\``, (r) => (r ? bodyVal(r.body, b) : undefined));
  const keys = new Set<string>();
  for (const r of [a, bi, bo, ci, cm, co]) for (const k of Object.keys(probes(r?.body))) keys.add(k);
  for (const k of keys) row(`probe \`${k}\``, (r) => (r ? probes(r.body)[k] : undefined));
  // Any other header present anywhere that the fixed list did not cover.
  const seen = new Set<string>();
  for (const r of [a, bi, bo, ci, cm, co]) for (const k of Object.keys(r?.headers ?? {})) seen.add(k);
  const extra = [...seen].filter((k) => !HEADER_ITEMS.includes(k) && !k.startsWith("x-stainless-") && !["host", "content-length", "connection", "upgrade", "sec-websocket-key", "sec-websocket-version", "sec-websocket-extensions"].includes(k)).sort();
  for (const h of extra) row(`hdr \`${h}\` (other)`, (r) => (r ? r.headers[h] : undefined));
  const otherBody = new Set<string>();
  for (const r of [a, bi, bo, ci, cm, co]) for (const k of Object.keys(r?.body ?? {})) otherBody.add(k);
  for (const k of [...otherBody].filter((k) => !BODY_ITEMS.includes(k) && !["input", "messages", "tools", "type"].includes(k)).sort()) row(`body \`${k}\` (other)`, (r) => (r ? r.body?.[k] : undefined));
  console.log("");
}
