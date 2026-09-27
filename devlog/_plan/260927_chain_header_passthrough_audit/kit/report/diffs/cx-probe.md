## Header/body probe (curl) → custom

Runs: (a) `cx-probe-a`  (b) `cx-probe-b`  (c) `cx-probe-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session_id` | SID_PROBE_TRACE_UNDERSCORE | SID_PROBE_TRACE_UNDERSCORE | — ❌ dropped | SID_PROBE_TRACE_UNDERSCORE | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | SID_PROBE_TRACE | SID_PROBE_TRACE | — ❌ dropped | SID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | SID_PROBE_TRACE | SID_PROBE_TRACE | — ❌ dropped | SID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | XCRID_PROBE_TRACE | XCRID_PROBE_TRACE | — ❌ dropped | XCRID_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | — ❌ dropped | {"request_kind":"turn","session_id":"SID_PROBE_TRACE","turn_… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | SID_PROBE_TRACE:0 | SID_PROBE_TRACE:0 | — ❌ dropped | SID_PROBE_TRACE:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-state` | TURNSTATE_PROBE_TRACE | TURNSTATE_PROBE_TRACE | — ❌ dropped | TURNSTATE_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-installation-id` | INSTALL_PROBE_TRACE | INSTALL_PROBE_TRACE | — ❌ dropped | INSTALL_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-parent-thread-id` | PARENT_PROBE_TRACE | PARENT_PROBE_TRACE | — ❌ dropped | PARENT_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-subagent` | review | review | — ❌ dropped | review | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses=experimental | responses=experimental | — ❌ dropped | responses=experimental | — ❌ dropped | — ❌ dropped |
| hdr `accept` | */* | */* | */* ✅ kept | */* | */* ✅ kept | */* ✅ kept |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `prompt_cache_key` | PCK_PROBE_TRACE | PCK_PROBE_TRACE | PCK_PROBE_TRACE ✅ kept | PCK_PROBE_TRACE | PCK_PROBE_TRACE ✅ kept | PCK_PROBE_TRACE ✅ kept |
| body `client_metadata` | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} ✅ kept | {"k":"CM_PROBE_TRACE"} | {"k":"CM_PROBE_TRACE"} ✅ kept | {"k":"CM_PROBE_TRACE"} ✅ kept |
| body `metadata` | {"k":"MD_PROBE_TRACE"} | {"k":"MD_PROBE_TRACE"} | {"k":"MD_PROBE_TRACE"} ✅ kept | {"k":"MD_PROBE_TRACE"} | {"k":"MD_PROBE_TRACE"} ✅ kept | {"k":"MD_PROBE_TRACE"} ✅ kept |
| body `previous_response_id` | resp_UNKNOWN_TO_OCX_TRACE | resp_UNKNOWN_TO_OCX_TRACE | resp_UNKNOWN_TO_OCX_TRACE ✅ kept | resp_UNKNOWN_TO_OCX_TRACE | resp_UNKNOWN_TO_OCX_TRACE ✅ kept | resp_UNKNOWN_TO_OCX_TRACE ✅ kept |
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
| hdr `x-oai-attestation` (other) | ATTEST_PROBE_TRACE | ATTEST_PROBE_TRACE | — ❌ dropped | ATTEST_PROBE_TRACE | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-internal-codex-residency` (other) | us | us | — ❌ dropped | us | — ❌ dropped | — ❌ dropped |
| hdr `x-openai-memgen-request` (other) | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-responsesapi-include-timing-metrics` (other) | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |

