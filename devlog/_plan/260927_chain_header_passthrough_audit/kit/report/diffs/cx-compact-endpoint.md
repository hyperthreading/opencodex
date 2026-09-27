## POST /v1/responses/compact (curl, Codex-shaped) → custom

Runs: (a) `cx-compact-endpoint-a`  (b) `cx-compact-endpoint-b`  (c) `cx-compact-endpoint-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/v1/responses/compact | /v1/responses/compact | /v1/responses | /v1/responses/compact | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | — ❌ dropped | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | — ❌ dropped | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | — ❌ dropped | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | — ❌ dropped | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | SID_COMPACT_TRACE:0 | SID_COMPACT_TRACE:0 | — ❌ dropped | SID_COMPACT_TRACE:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-subagent` | compact | compact | — ❌ dropped | compact | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | */* ✏️ changed | application/json | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | gzip, deflate, br, zstd ➕ added | — | gzip, deflate, br, zstd ➕ added | gzip, deflate, br, zstd ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | — | — | false ➕ added | — | false ➕ added | false ➕ added |
| body `prompt_cache_key` | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE ✅ kept | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE ✅ kept | PCK_COMPACT_TRACE ✅ kept |
| body `client_metadata` | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | — ❌ dropped | low | — ❌ dropped | — ❌ dropped |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | — ❌ dropped | {"verbosity":"low"} | — ❌ dropped | — ❌ dropped |
| body `parallel_tool_calls` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| body `instructions` | string(35) | string(35) | string(35) ✅ kept | string(35) | string(35) ✅ kept | string(35) ✅ kept |
| probe `tools(types)` |  |  | — ❌ dropped |  | — ❌ dropped | — ❌ dropped |
| probe `tools(count)` | 0 | 0 | — ❌ dropped | 0 | — ❌ dropped | — ❌ dropped |
| probe `input[].reasoning.encrypted_content` | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 ✅ kept | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 ✅ kept | ENC_CLIENT_TRACE_1 ✅ kept |
| probe `input[].id kept` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| probe `input(types)` | message,reasoning,message | message,reasoning,message | message,reasoning,message,message ✏️ changed | message,reasoning,message | message,reasoning,message,message ✏️ changed | message,reasoning,message,message ✏️ changed |

