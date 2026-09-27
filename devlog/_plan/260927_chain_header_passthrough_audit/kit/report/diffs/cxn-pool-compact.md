## POST /v1/responses/compact (curl) → canonical (pool)

Runs: (a) `cx-compact-endpoint-a`  (b) `cxn-pool-compact-b`  (c) `cxn-pool-compact-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/v1/responses/compact | /v1/responses/compact | /backend-api/codex/responses/compact | /v1/responses/compact | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… ✅ kept | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | SID_COMPACT_TRACE:0 | SID_COMPACT_TRACE:0 | SID_COMPACT_TRACE:0 ✅ kept | SID_COMPACT_TRACE:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | —  | — | —  | model=gpt-5.5 ➕ added |
| hdr `x-openai-subagent` | compact | compact | compact ✅ kept | compact | — ❌ dropped | — ❌ dropped |
| hdr `chatgpt-account-id` | — | — | acct-pool-TRACE ➕ added | — | —  | acct-pool-TRACE ➕ added |
| hdr `accept` | application/json | application/json | */* ✏️ changed | application/json | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | gzip, deflate, br, zstd ➕ added | — | gzip, deflate, br, zstd ➕ added | gzip, deflate, br, zstd ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | — | — | —  | — | false ➕ added | false ➕ added |
| body `store` | — | — | —  | — | —  | false ➕ added |
| body `prompt_cache_key` | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE ✅ kept | PCK_COMPACT_TRACE | PCK_COMPACT_TRACE ✅ kept | PCK_COMPACT_TRACE ✅ kept |
| body `client_metadata` | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | — ❌ dropped | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | — ❌ dropped | — ❌ dropped |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | — ❌ dropped | — ❌ dropped |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | — ❌ dropped | — ❌ dropped |
| body `instructions` | string(35) | string(35) | string(35) ✅ kept | string(35) | string(35) ✅ kept | string(35) ✅ kept |
| probe `tools(types)` |  |  |  ✅ kept |  | — ❌ dropped | — ❌ dropped |
| probe `tools(count)` | 0 | 0 | 0 ✅ kept | 0 | — ❌ dropped | — ❌ dropped |
| probe `input[].reasoning.encrypted_content` | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 ✅ kept | ENC_CLIENT_TRACE_1 | ENC_CLIENT_TRACE_1 ✅ kept | ENC_CLIENT_TRACE_1 ✅ kept |
| probe `input[].id kept` | true | true | true ✅ kept | true | true ✅ kept | — ❌ dropped |
| probe `input(types)` | message,reasoning,message | message,reasoning,message | message,reasoning,message ✅ kept | message,reasoning,message | message,reasoning,message,message ✏️ changed | message,reasoning,message,message ✏️ changed |

