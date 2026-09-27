// Produce a shareable copy of a captures directory:
//  - ocx admission secrets  → ocx_<kind>_REDACTED
//  - JWTs (synthetic here)  → <jwt acct=…> (ChatGPT account claim kept, token dropped)
//  - long strings (instructions, message/input text, system text) → first 120 chars + length
//  - tools → type / name / nested namespace names / cache_control only
// Headers and every other body field stay verbatim, so diff-captures.ts on the export
// reproduces the tables except the `instructions` length row.
//
//   bun export-captures.ts <src-captures-dir> <dst-dir>
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [src, dst] = process.argv.slice(2);
if (!src || !dst) throw new Error("usage: export-captures.ts <src> <dst>");
mkdirSync(dst, { recursive: true });

function jwtLabel(jwt: string): string {
  try {
    const claims = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString("utf8"));
    const acct = claims?.["https://api.openai.com/auth"]?.chatgpt_account_id;
    return acct ? `<jwt acct=${acct}>` : "<jwt>";
  } catch { return "<jwt>"; }
}
const scrub = (s: string) => s
  .replace(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g, jwtLabel)
  .replace(/ocx_(data|admin|session)_[A-Za-z0-9_-]+/g, "ocx_$1_REDACTED");
const cut = (v: unknown) => typeof v === "string" && v.length > 300 ? `${v.slice(0, 120)}…<${v.length} chars>` : v;

function slimText(v: any): any {
  if (Array.isArray(v)) return v.map(slimText);
  if (v && typeof v === "object") {
    const o: any = {};
    for (const [k, x] of Object.entries(v)) o[k] = k === "text" ? cut(x) : slimText(x);
    return o;
  }
  return v;
}
function slimBody(b: any): any {
  if (!b || typeof b !== "object") return b;
  const o = { ...b };
  if (typeof o.instructions === "string") o.instructions = cut(o.instructions);
  if (Array.isArray(o.tools)) {
    o.tools = o.tools.map((t: any) => {
      const r: any = { type: t?.type, name: t?.name };
      if (Array.isArray(t?.tools)) r.tools = t.tools.map((n: any) => ({ type: n?.type, name: n?.name }));
      if (t?.cache_control) r.cache_control = t.cache_control;
      return Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined));
    });
  }
  if (Array.isArray(o.input)) o.input = slimText(o.input);
  if (Array.isArray(o.messages)) o.messages = slimText(o.messages);
  if (Array.isArray(o.system)) o.system = slimText(o.system);
  else if (typeof o.system === "string") o.system = cut(o.system);
  return o;
}

let files = 0;
for (const name of readdirSync(src).filter((n) => n.endsWith(".jsonl")).sort()) {
  const out = readFileSync(join(src, name), "utf8").split("\n").filter(Boolean).map((line) => {
    const rec = JSON.parse(scrub(line));
    if (rec.body) rec.body = slimBody(rec.body);
    if (typeof rec.rawBody === "string") rec.rawBody = cut(rec.rawBody);
    return JSON.stringify(rec);
  });
  writeFileSync(join(dst, name), out.join("\n") + "\n");
  files++;
}
console.log(`exported ${files} capture files to ${dst}`);
