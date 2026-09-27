## compaction_trigger turn (curl) → canonical (pool)

Runs: (a) `cxn-pool-trigger-a`  (b) `cxn-pool-trigger-b`  (c) `cxn-pool-trigger-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | Bearer ocx_<REDACTED> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | SID_COMPACT_TRACE | SID_COMPACT_TRACE | SID_COMPACT_TRACE ✅ kept | SID_COMPACT_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… ✅ kept | {"request_kind":"compaction","session_id":"SID_COMPACT_TRACE… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | SID_COMPACT_TRACE:0 | SID_COMPACT_TRACE:0 | SID_COMPACT_TRACE:0 ✅ kept | SID_COMPACT_TRACE:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | — | — | acct-pool-TRACE ➕ added | — | —  | acct-pool-TRACE ➕ added |
| hdr `accept` | */* | */* | */* ✅ kept | */* | */* ✅ kept | */* ✅ kept |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | PCK_TRIGGER_TRACE | PCK_TRIGGER_TRACE | PCK_TRIGGER_TRACE ✅ kept | PCK_TRIGGER_TRACE | PCK_TRIGGER_TRACE ✅ kept | PCK_TRIGGER_TRACE ✅ kept |
| body `client_metadata` | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept | {"x-codex-turn-metadata":"{\"request_kind\":\"compaction\",\… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `instructions` | string(18) | string(18) | string(18) ✅ kept | string(18) | string(18) ✅ kept | string(18) ✅ kept |
| probe `tools(types)` |  |  |  ✅ kept |  | — ❌ dropped | — ❌ dropped |
| probe `tools(count)` | 0 | 0 | 0 ✅ kept | 0 | — ❌ dropped | — ❌ dropped |
| probe `input[].reasoning.encrypted_content` | ENC_CLIENT_TRACE_2 | ENC_CLIENT_TRACE_2 | ENC_CLIENT_TRACE_2 ✅ kept | ENC_CLIENT_TRACE_2 | — ❌ dropped | — ❌ dropped |
| probe `input[] compaction_trigger` | true | true | true ✅ kept | true | — ❌ dropped | — ❌ dropped |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,reasoning,function_call,function_call_output,compact… | message,reasoning,function_call,function_call_output,compact… | message,reasoning,function_call,function_call_output,compact… ✅ kept | message,reasoning,function_call,function_call_output,compact… | message,reasoning,function_call,function_call_output,message ✏️ changed | message,reasoning,function_call,function_call_output,message ✏️ changed |

