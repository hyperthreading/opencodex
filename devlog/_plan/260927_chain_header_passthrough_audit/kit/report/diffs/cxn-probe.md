## Header/body probe (curl) → canonical (pool)

Runs: (a) `cxn-probe-a`  (b) `cxn-probe-b`  (c) `cxn-probe-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session_id` | SID_PROBE_TRACE_UNDERSCORE | SID_PROBE_TRACE_UNDERSCORE | SID_PROBE_TRACE_UNDERSCORE ✅ kept | SID_PROBE_TRACE_UNDERSCORE | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | SID_PROBE_TRACE | SID_PROBE_TRACE | SID_PROBE_TRACE ✅ kept | SID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | SID_PROBE_TRACE | SID_PROBE_TRACE | SID_PROBE_TRACE ✅ kept | SID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | XCRID_PROBE_TRACE | XCRID_PROBE_TRACE | XCRID_PROBE_TRACE ✅ kept | XCRID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… ✅ kept | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | SID_PROBE_TRACE:0 | SID_PROBE_TRACE:0 | SID_PROBE_TRACE:0 ✅ kept | SID_PROBE_TRACE:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-state` | TURNSTATE_PROBE_TRACE | TURNSTATE_PROBE_TRACE | TURNSTATE_PROBE_TRACE ✅ kept | TURNSTATE_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-installation-id` | INSTALL_PROBE_TRACE | INSTALL_PROBE_TRACE | INSTALL_PROBE_TRACE ✅ kept | INSTALL_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-parent-thread-id` | PARENT_PROBE_TRACE | PARENT_PROBE_TRACE | PARENT_PROBE_TRACE ✅ kept | PARENT_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5;tier=priority ➕ added | — | —  | model=gpt-5.5;tier=priority ➕ added |
| hdr `x-openai-subagent` | review | review | review ✅ kept | review | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses=experimental | responses=experimental | responses=experimental ✅ kept | responses=experimental | — ❌ dropped | — ❌ dropped |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | */* | */* | */* ✅ kept | */* | */* ✅ kept | */* ✅ kept |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `prompt_cache_key` | PCK_PROBE_TRACE | PCK_PROBE_TRACE | PCK_PROBE_TRACE ✅ kept | PCK_PROBE_TRACE | PCK_PROBE_TRACE ✅ kept | PCK_PROBE_TRACE ✅ kept |
| body `client_metadata` | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} ✅ kept | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} ✅ kept | {"k":"CM_PROBE_TRACE"} ✅ kept |
| body `metadata` | {"k":"MD_PROBE_TRACE"} | {"k":"MD_PROBE_TRACE"} | — ❌ dropped | {"k":"MD_PROBE_TRACE"} | {"k":"MD_PROBE_TRACE"} ✅ kept | — ❌ dropped |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"high","summary":"auto"} | {"effort":"high","summary":"auto"} | {"effort":"high","summary":"auto"} ✅ kept | {"effort":"high","summary":"auto"} | {"effort":"high","summary":"auto"} ✅ kept | {"effort":"high","summary":"auto"} ✅ kept |
| body `service_tier` | priority | priority | priority ✅ kept | priority | priority ✅ kept | priority ✅ kept |
| body `text.verbosity` | high | high | high ✅ kept | high | high ✅ kept | high ✅ kept |
| body `text` | {"verbosity":"high"} | {"verbosity":"high"} | {"verbosity":"high"} ✅ kept | {"verbosity":"high"} | {"verbosity":"high"} ✅ kept | {"verbosity":"high"} ✅ kept |
| body `parallel_tool_calls` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(5) | string(5) | string(5) ✅ kept | string(5) | string(5) ✅ kept | string(5) ✅ kept |
| probe `tools(types)` | custom,web_search,function | custom,web_search,function | custom,web_search,function ✅ kept | custom,web_search,function | custom,web_search,function ✅ kept | custom,web_search,function ✅ kept |
| probe `tools(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |
| probe `input(types)` | message | message | message ✅ kept | message | message ✅ kept | message ✅ kept |
| hdr `conversation_id` (other) | CONV_PROBE_TRACE | CONV_PROBE_TRACE | — ❌ dropped | CONV_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `version` (other) | 0.157.1 | 0.157.1 | — ❌ dropped | 0.157.1 | — ❌ dropped | — ❌ dropped |
| hdr `x-oai-attestation` (other) | ATTEST_PROBE_TRACE | ATTEST_PROBE_TRACE | ATTEST_PROBE_TRACE ✅ kept | ATTEST_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-internal-codex-residency` (other) | us | us | — ❌ dropped | us | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-memgen-request` (other) | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-responsesapi-include-timing-metrics` (other) | true | true | true ✅ kept | true | — ❌ dropped | — ❌ dropped |

