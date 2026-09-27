## Codex ChatGPT-login WebSocket 2-turn → canonical openai (pool)

Runs: (a) `cxn-pool-ws-a`  (b) `cxn-pool-ws-b`  (c) `cxn-pool-ws-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/backend-api/codex/responses (ws) | /v1/responses (ws) | /backend-api/codex/responses | /v1/responses (ws) | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"ebd2d603-f55c-47e9-8655-90e6ebf5f8b0","s… | {"installation_id":"920ff871-a71b-4d32-996f-86dc4ecb928f","s… | {"installation_id":"920ff871-a71b-4d32-996f-86dc4ecb928f","s… ✅ kept | {"installation_id":"7609982b-82f9-4d50-9595-1ab9541987f7","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-c483-7342-93c7-d1c19b158b40:0 | 01a0e481-ccf5-7660-b410-28b888c33478:0 | 01a0e481-ccf5-7660-b410-28b888c33478:0 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 ✅ kept | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | 01a0e481-d4f7-7ae0-81ef-d41003076284 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 ✅ kept |
| body `client_metadata` | {"root_turn_id":"01a0e481-c4a3-7992-a7f2-f2e68d5e3250","x-co… | {"x-codex-installation-id":"920ff871-a71b-4d32-996f-86dc4ecb… | {"x-codex-installation-id":"920ff871-a71b-4d32-996f-86dc4ecb… ✅ kept | {"turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-codex-t… | {"turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-codex-t… ✅ kept | {"turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-codex-t… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium","summary":"auto"} | {"effort":"medium","summary":"auto"} ✅ kept | {"effort":"medium","summary":"auto"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | — | —  | —  |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | — | —  | —  |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21420) | string(21420) ✅ kept | string(16979) | string(16979) ✅ kept | string(16979) ✅ kept |
| probe `tools(types)` | function,custom,namespace,tool_search,web_search | custom,function,namespace,web_search | custom,function,namespace,web_search ✅ kept | function,namespace,web_search | function,web_search ✏️ changed | function,web_search ✏️ changed |
| probe `tools(count)` | 14 | 6 | 6 ✅ kept | 13 | 17 ✏️ changed | 17 ✏️ changed |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message | message,message,message | message,message,message ✅ kept | message,message,message | message,message,message ✅ kept | message,message,message ✅ kept |

### request #2  (/backend-api/codex/responses (ws) | /v1/responses (ws) | /backend-api/codex/responses | /v1/responses (ws) | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"ebd2d603-f55c-47e9-8655-90e6ebf5f8b0","s… | {"installation_id":"920ff871-a71b-4d32-996f-86dc4ecb928f","s… | {"installation_id":"920ff871-a71b-4d32-996f-86dc4ecb928f","s… ✅ kept | {"installation_id":"7609982b-82f9-4d50-9595-1ab9541987f7","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-c483-7342-93c7-d1c19b158b40:0 | 01a0e481-ccf5-7660-b410-28b888c33478:0 | 01a0e481-ccf5-7660-b410-28b888c33478:0 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 ✅ kept | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-c483-7342-93c7-d1c19b158b40 | 01a0e481-ccf5-7660-b410-28b888c33478 | 01a0e481-ccf5-7660-b410-28b888c33478 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 | 01a0e481-d4f7-7ae0-81ef-d41003076284 ✅ kept | 01a0e481-d4f7-7ae0-81ef-d41003076284 ✅ kept |
| body `client_metadata` | {"x-codex-window-id":"01a0e481-c483-7342-93c7-d1c19b158b40:0… | {"turn_id":"01a0e481-cd0f-7501-ab5e-e55393bcf950","x-codex-w… | {"turn_id":"01a0e481-cd0f-7501-ab5e-e55393bcf950","x-codex-w… ✅ kept | {"root_turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-co… | {"root_turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-co… ✅ kept | {"root_turn_id":"01a0e481-d521-75a0-83f2-b0d18266cf5f","x-co… ✅ kept |
| body `previous_response_id` | resp_TRACE_cxn-pool-ws-a-2 | resp_TRACE_cxn-pool-ws-b-1 | — ❌ dropped | resp_TRACE_cxn-pool-ws-c-1 | — ❌ dropped | — ❌ dropped |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium","summary":"auto"} | {"effort":"medium","summary":"auto"} ✅ kept | {"effort":"medium","summary":"auto"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | — | —  | —  |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | — | —  | —  |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21420) | string(21420) ✅ kept | string(16979) | string(16979) ✅ kept | string(16979) ✅ kept |
| probe `tools(types)` | function,custom,namespace,tool_search,web_search | custom,function,namespace,web_search | custom,function,namespace,web_search ✅ kept | function,namespace,web_search | function,web_search ✏️ changed | function,web_search ✏️ changed |
| probe `tools(count)` | 14 | 6 | 6 ✅ kept | 13 | 17 ✏️ changed | 17 ✏️ changed |
| probe `input[].reasoning.encrypted_content` | — | — | ENC_TRACE_cxn-pool-ws-b-1 ➕ added | — | ENC_TRACE_cxn-pool-ws-c-1 ➕ added | ENC_TRACE_cxn-pool-ws-c-1 ➕ added |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | function_call_output | function_call_output | message,message,message,reasoning,function_call,function_cal… ✏️ changed | function_call_output | message,message,message,reasoning,function_call,function_cal… ✏️ changed | message,message,message,reasoning,function_call,function_cal… ✏️ changed |

