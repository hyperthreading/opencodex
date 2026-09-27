// Mock upstream for the ocx chaining header audit.
// Records every request (method, path, full headers, raw body) to
// $CAPTURE_DIR/<run>.jsonl and answers with minimal scripted responses.
// Opaque state values are unique trace strings so their round trip is visible.
//
//   GET  /__ctl/run?name=<run>   switch the capture file (returns previous)
//   GET  /__ctl/health
//
// Paths prefixed /__chatgpt or /__anthropic are requests the ocx launcher
// redirected away from chatgpt.com / api.anthropic.com; the prefix is stripped
// before dispatch and kept in the capture as `origin`.
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.MOCK_PORT ?? 10300);
const HOST = process.env.MOCK_HOST ?? "0.0.0.0";
const CAPTURE_DIR = process.env.CAPTURE_DIR ?? "./captures";
mkdirSync(CAPTURE_DIR, { recursive: true });

let run = "default";
let seq = 0;
const tag = () => `${run}-${++seq}`;

function record(entry: Record<string, unknown>) {
  appendFileSync(join(CAPTURE_DIR, `${run}.jsonl`), JSON.stringify({ ts: new Date().toISOString(), run, ...entry }) + "\n");
}

function headerObject(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => { out[k] = v; });
  return out;
}

// ---------------- Responses API ----------------
type Json = any;

function lastUserText(body: Json): string {
  const input = Array.isArray(body?.input) ? body.input : typeof body?.input === "string" ? [{ role: "user", content: body.input }] : [];
  for (let i = input.length - 1; i >= 0; i--) {
    const it = input[i];
    if (it?.role !== "user") continue;
    if (typeof it.content === "string") return it.content;
    if (Array.isArray(it.content)) return it.content.map((c: Json) => c?.text ?? "").join(" ");
  }
  return "";
}

function responsesToolCall(body: Json, t: string): Json | null {
  const input = Array.isArray(body?.input) ? body.input : [];
  if (input.some((i: Json) => /_call_output$/.test(i?.type ?? ""))) return null;
  if (!lastUserText(body).includes("USE_TOOL")) return null;
  const tools: Json[] = Array.isArray(body?.tools) ? body.tools : [];
  const names = tools.map((x) => x?.name ?? x?.type);
  const callId = `call_TRACE_${t}`;
  if (names.includes("exec_command")) return { type: "function_call", id: `fc_TRACE_${t}`, call_id: callId, name: "exec_command", arguments: JSON.stringify({ cmd: "echo TOOL_RAN" }), status: "completed" };
  if (names.includes("shell_command")) return { type: "function_call", id: `fc_TRACE_${t}`, call_id: callId, name: "shell_command", arguments: JSON.stringify({ command: "echo TOOL_RAN" }), status: "completed" };
  if (names.includes("shell")) return { type: "function_call", id: `fc_TRACE_${t}`, call_id: callId, name: "shell", arguments: JSON.stringify({ command: ["echo", "TOOL_RAN"] }), status: "completed" };
  const fn = tools.find((x) => x?.type === "function" && x?.name);
  if (fn) return { type: "function_call", id: `fc_TRACE_${t}`, call_id: callId, name: fn.name, arguments: "{}", status: "completed" };
  return null;
}

function responsesOutput(body: Json, t: string): Json[] {
  const input = Array.isArray(body?.input) ? body.input : [];
  if (input.some((i: Json) => i?.type === "compaction_trigger")) {
    return [{ type: "compaction", id: `cmp_TRACE_${t}`, encrypted_content: `CMP_TRACE_${t}` }];
  }
  const reasoning = { type: "reasoning", id: `rs_TRACE_${t}`, summary: [{ type: "summary_text", text: `reasoning ${t}` }], encrypted_content: `ENC_TRACE_${t}` };
  const call = responsesToolCall(body, t);
  if (call) return [reasoning, call];
  return [reasoning, { type: "message", id: `msg_TRACE_${t}`, role: "assistant", status: "completed", content: [{ type: "output_text", text: `MOCK_REPLY ${t}`, annotations: [] }] }];
}

function bigUsage(body: Json): boolean {
  // Large usage only until the history has been compacted once, so the client's
  // auto-compaction fires exactly once instead of looping.
  const input = Array.isArray(body?.input) ? body.input : [];
  if (input.some((i: Json) => i?.type === "compaction" || i?.type === "compaction_summary")) return false;
  if (JSON.stringify(input).includes("compacted user")) return false;
  if (input.some((i: Json) => i?.type === "compaction_trigger")) return false;
  const text = JSON.stringify(input);
  return text.includes("BIG_USAGE") && !text.includes("MOCK_REPLY");
}

function responseObject(body: Json, t: string, output: Json[], status: string): Json {
  const big = bigUsage(body);
  return {
    id: `resp_TRACE_${t}`, object: "response", created_at: Math.floor(Date.now() / 1000), status,
    model: body?.model ?? "mock-model", output,
    usage: status === "completed" ? { input_tokens: big ? 190000 : 10, input_tokens_details: { cached_tokens: 0 }, output_tokens: 5, output_tokens_details: { reasoning_tokens: 1 }, total_tokens: big ? 190005 : 15 } : null,
    store: body?.store ?? false, previous_response_id: body?.previous_response_id ?? null,
  };
}

function responsesEvents(body: Json): Json[] {
  const t = tag();
  const output = responsesOutput(body, t);
  const ev: Json[] = [];
  let n = 0;
  const push = (e: Json) => ev.push({ ...e, sequence_number: n++ });
  push({ type: "response.created", response: responseObject(body, t, [], "in_progress") });
  push({ type: "response.in_progress", response: responseObject(body, t, [], "in_progress") });
  output.forEach((item, idx) => {
    push({ type: "response.output_item.added", output_index: idx, item: item.type === "message" ? { ...item, status: "in_progress", content: [] } : item });
    if (item.type === "message") {
      push({ type: "response.content_part.added", item_id: item.id, output_index: idx, content_index: 0, part: { type: "output_text", text: "", annotations: [] } });
      push({ type: "response.output_text.delta", item_id: item.id, output_index: idx, content_index: 0, delta: item.content[0].text });
      push({ type: "response.output_text.done", item_id: item.id, output_index: idx, content_index: 0, text: item.content[0].text });
      push({ type: "response.content_part.done", item_id: item.id, output_index: idx, content_index: 0, part: item.content[0] });
    }
    if (item.type === "function_call") {
      push({ type: "response.function_call_arguments.done", item_id: item.id, output_index: idx, arguments: item.arguments });
    }
    push({ type: "response.output_item.done", output_index: idx, item });
  });
  push({ type: "response.completed", response: responseObject(body, t, output, "completed") });
  return ev;
}

function sse(events: Json[], named = true): Response {
  const text = events.map((e) => (named ? `event: ${e.type}\n` : "") + `data: ${JSON.stringify(e)}\n\n`).join("");
  return new Response(text, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache", "x-request-id": `req_TRACE_${run}_${seq}` } });
}

function handleResponses(body: Json): Response {
  const events = responsesEvents(body);
  if (body?.stream === false) return Response.json(events[events.length - 1].response, { headers: { "x-request-id": `req_TRACE_${run}_${seq}` } });
  return sse(events);
}

function handleCompact(body: Json): Response {
  const t = tag();
  return Response.json({
    output: [
      { type: "message", role: "user", content: [{ type: "input_text", text: `compacted user ${t}` }] },
      { type: "compaction", encrypted_content: `CMP_TRACE_${t}` },
    ],
  });
}

// ---------------- Anthropic Messages ----------------
function anthropicHasToolResult(body: Json): boolean {
  const msgs: Json[] = Array.isArray(body?.messages) ? body.messages : [];
  const last = msgs[msgs.length - 1];
  return Array.isArray(last?.content) && last.content.some((c: Json) => c?.type === "tool_result");
}
function anthropicLastUserText(body: Json): string {
  const msgs: Json[] = Array.isArray(body?.messages) ? body.messages : [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m?.role !== "user") continue;
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) return m.content.map((c: Json) => c?.text ?? "").join(" ");
  }
  return "";
}

function anthropicContent(body: Json, t: string): Json[] {
  const blocks: Json[] = [];
  if (body?.thinking && body.thinking.type && body.thinking.type !== "disabled") {
    blocks.push({ type: "thinking", thinking: `thinking ${t}`, signature: `SIG_TRACE_${t}` });
  }
  const tools: Json[] = Array.isArray(body?.tools) ? body.tools : [];
  const bash = tools.find((x) => /(^|_)Bash$/.test(x?.name ?? ""));
  if (!anthropicHasToolResult(body) && anthropicLastUserText(body).includes("USE_TOOL") && bash) {
    blocks.push({ type: "tool_use", id: `toolu_TRACE_${t}`, name: bash.name, input: { command: "echo TOOL_RAN", description: "trace" } });
  } else {
    blocks.push({ type: "text", text: `MOCK_REPLY ${t}` });
  }
  return blocks;
}

function handleMessages(body: Json): Response {
  const t = tag();
  const content = anthropicContent(body, t);
  const stop = content.some((b) => b.type === "tool_use") ? "tool_use" : "end_turn";
  const usage = { input_tokens: 10, output_tokens: 5, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
  const msg = { id: `msg_TRACE_${t}`, type: "message", role: "assistant", model: body?.model ?? "mock", content, stop_reason: stop, stop_sequence: null, usage };
  const hdrs = { "request-id": `req_TRACE_${run}_${seq}` };
  if (!body?.stream) return Response.json(msg, { headers: hdrs });
  const ev: Json[] = [];
  ev.push({ type: "message_start", message: { ...msg, content: [], stop_reason: null, usage: { ...usage, output_tokens: 1 } } });
  content.forEach((b, i) => {
    if (b.type === "thinking") {
      ev.push({ type: "content_block_start", index: i, content_block: { type: "thinking", thinking: "", signature: "" } });
      ev.push({ type: "content_block_delta", index: i, delta: { type: "thinking_delta", thinking: b.thinking } });
      ev.push({ type: "content_block_delta", index: i, delta: { type: "signature_delta", signature: b.signature } });
    } else if (b.type === "text") {
      ev.push({ type: "content_block_start", index: i, content_block: { type: "text", text: "" } });
      ev.push({ type: "content_block_delta", index: i, delta: { type: "text_delta", text: b.text } });
    } else if (b.type === "tool_use") {
      ev.push({ type: "content_block_start", index: i, content_block: { type: "tool_use", id: b.id, name: b.name, input: {} } });
      ev.push({ type: "content_block_delta", index: i, delta: { type: "input_json_delta", partial_json: JSON.stringify(b.input) } });
    }
    ev.push({ type: "content_block_stop", index: i });
  });
  ev.push({ type: "message_delta", delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 5 } });
  ev.push({ type: "message_stop" });
  const text = ev.map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join("");
  return new Response(text, { headers: { "content-type": "text/event-stream", ...hdrs } });
}

// ---------------- Models ----------------
const MODEL_IDS = ["mock-model", "gpt-5.5", "gpt-5.4", "claude-sonnet-4-6", "claude-opus-4-7", "claude-haiku-4-5"];
function handleModels(origin: string): Response {
  if (origin === "anthropic") {
    return Response.json({ data: MODEL_IDS.filter((m) => m.startsWith("claude")).map((id) => ({ id, type: "model", display_name: id, created_at: "2026-01-01T00:00:00Z" })), has_more: false, first_id: null, last_id: null });
  }
  return Response.json({
    object: "list",
    data: MODEL_IDS.map((id) => ({ id, object: "model", created: 1_700_000_000, owned_by: "mock", type: "model", display_name: id })),
    models: [],
    has_more: false,
  });
}

// ---------------- Server ----------------
type WsData = { path: string; origin: string };

const server = Bun.serve<WsData, {}>({
  port: PORT,
  hostname: HOST,
  idleTimeout: 120,
  async fetch(req, srv) {
    const url = new URL(req.url);
    if (url.pathname === "/__ctl/health") return new Response("ok");
    if (url.pathname === "/__ctl/run") {
      const prev = run;
      run = url.searchParams.get("name") ?? "default";
      seq = 0;
      return Response.json({ prev, run });
    }
    let path = url.pathname;
    let origin = "direct";
    for (const o of ["chatgpt", "anthropic"]) {
      if (path.startsWith(`/__${o}/`)) { origin = o; path = path.slice(o.length + 3); }
    }
    const headers = headerObject(req.headers);
    if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
      record({ kind: "ws-handshake", method: req.method, path, query: url.search, origin, headers });
      if (srv.upgrade(req, { data: { path, origin } })) return undefined as unknown as Response;
      return new Response("upgrade failed", { status: 400 });
    }
    const raw = await req.text();
    let body: Json = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }
    record({ kind: "http", method: req.method, path, query: url.search, origin, headers, body: body ?? undefined, rawBody: body ? undefined : raw });

    const p = path.replace(/\/+$/, "");
    if (req.method === "GET" && /(^|\/)models$/.test(p)) return handleModels(origin === "anthropic" || req.headers.has("anthropic-version") ? "anthropic" : "openai");
    if (req.method === "POST" && /\/responses\/compact$/.test(p)) return handleCompact(body);
    if (req.method === "POST" && /\/responses$/.test(p)) return handleResponses(body);
    if (req.method === "POST" && /\/messages\/count_tokens$/.test(p)) return Response.json({ input_tokens: 42 });
    if (req.method === "POST" && /\/messages$/.test(p)) return handleMessages(body);
    return Response.json({ ok: true, mock: "unhandled", path }, { status: 200 });
  },
  websocket: {
    open(ws) { record({ kind: "ws-open", path: ws.data.path, origin: ws.data.origin }); },
    message(ws, msg) {
      const text = typeof msg === "string" ? msg : new TextDecoder().decode(msg);
      let frame: Json = null;
      try { frame = JSON.parse(text); } catch { /* raw */ }
      record({ kind: "ws-frame", path: ws.data.path, origin: ws.data.origin, body: frame ?? undefined, rawBody: frame ? undefined : text });
      if (frame?.type === "response.create") {
        const { type: _t, ...body } = frame;
        for (const e of responsesEvents(body)) ws.send(JSON.stringify(e));
      }
    },
    close(ws, code, reason) { record({ kind: "ws-close", path: ws.data.path, code, reason }); },
  },
});
console.log(`mock upstream listening on ${server.hostname}:${server.port}, captures in ${CAPTURE_DIR}`);
