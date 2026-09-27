## Codex built-in openai provider (WS + remote compaction v2) → custom

Runs: (a) `cx-oa-ws-compact-a`  (b) `cx-oa-ws-compact-b`  (c) `cx-oa-ws-compact-c`  — inference requests: a=4, b=3→3, c=3→3→3

### request #1  (/v1/responses (ws) | /v1/responses (ws) | /v1/responses | /v1/responses (ws) | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"cdfd3450-918a-4bd4-8c75-41b33803f13f","s… | {"installation_id":"3309c768-dd26-491a-8c7e-72f6ea043ac0","s… | — ❌ dropped | {"installation_id":"8f7f85e6-6607-46e4-a93c-64f08ca3ea07","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-99d5-7643-a6b2-52610c941b65:0 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe:0 | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | — ❌ dropped | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept |
| body `client_metadata` | {"turn_id":"01a0e481-99f1-7140-bdf2-454b457c12db","root_turn… | {"turn_id":"01a0e481-9cb5-71f0-bc01-375a41593e57","thread_id… | {"turn_id":"01a0e481-9cb5-71f0-bc01-375a41593e57","thread_id… ✅ kept | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… ✅ kept | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | low ✅ kept | low ✅ kept |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} ✅ kept |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` | function,custom,tool_search,web_search | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,web_search ✏️ changed |
| probe `tools(count)` | 10 | 10 | 10 ✅ kept | 10 | 10 ✅ kept | 10 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message | message,message,message | message,message,message ✅ kept | message,message,message | message,message,message ✅ kept | message,message,message ✅ kept |
| hdr `version` (other) | 0.157.1 | 0.157.1 | — ❌ dropped | 0.157.1 | — ❌ dropped | — ❌ dropped |

### request #2  (/v1/responses (ws) | /v1/responses (ws) | /v1/responses | /v1/responses (ws) | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"cdfd3450-918a-4bd4-8c75-41b33803f13f","s… | {"installation_id":"3309c768-dd26-491a-8c7e-72f6ea043ac0","s… | — ❌ dropped | {"installation_id":"8f7f85e6-6607-46e4-a93c-64f08ca3ea07","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-99d5-7643-a6b2-52610c941b65:0 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe:0 | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | — ❌ dropped | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept |
| body `client_metadata` | {"x-codex-window-id":"01a0e481-99d5-7643-a6b2-52610c941b65:0… | {"turn_id":"01a0e481-9cb5-71f0-bc01-375a41593e57","session_i… | {"turn_id":"01a0e481-9cb5-71f0-bc01-375a41593e57","session_i… ✅ kept | {"x-codex-window-id":"01a0e481-9f90-7461-ab70-6d6871e60fca:0… | {"x-codex-window-id":"01a0e481-9f90-7461-ab70-6d6871e60fca:0… ✅ kept | {"x-codex-window-id":"01a0e481-9f90-7461-ab70-6d6871e60fca:0… ✅ kept |
| body `previous_response_id` | resp_TRACE_cx-oa-ws-compact-a-2 | resp_TRACE_cx-oa-ws-compact-b-1 | — ❌ dropped | resp_TRACE_cx-oa-ws-compact-c-1 | — ❌ dropped | — ❌ dropped |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | — ❌ dropped | low | — ❌ dropped | — ❌ dropped |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | — ❌ dropped | {"verbosity":"low"} | — ❌ dropped | — ❌ dropped |
| body `parallel_tool_calls` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| body `tool_choice` | auto | auto | — ❌ dropped | auto | — ❌ dropped | — ❌ dropped |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` | function,custom,tool_search,web_search | function,custom,tool_search,web_search | — ❌ dropped | function,custom,tool_search,web_search | — ❌ dropped | — ❌ dropped |
| probe `tools(count)` | 10 | 10 | — ❌ dropped | 10 | — ❌ dropped | — ❌ dropped |
| probe `input[].reasoning.encrypted_content` | — | — | ENC_TRACE_cx-oa-ws-compact-b-1 ➕ added | — | ENC_TRACE_cx-oa-ws-compact-c-1 ➕ added | ENC_TRACE_cx-oa-ws-compact-c-1 ➕ added |
| probe `input[] compaction_trigger` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | function_call_output,compaction_trigger | function_call_output,compaction_trigger | message,message,message,reasoning,function_call,function_cal… ✏️ changed | function_call_output,compaction_trigger | message,message,message,reasoning,function_call,function_cal… ✏️ changed | message,message,message,reasoning,function_call,function_cal… ✏️ changed |
| hdr `version` (other) | 0.157.1 | 0.157.1 | — ❌ dropped | 0.157.1 | — ❌ dropped | — ❌ dropped |

### request #3  (/v1/responses (ws) | /v1/responses (ws) | /v1/responses | /v1/responses (ws) | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"cdfd3450-918a-4bd4-8c75-41b33803f13f","s… | {"installation_id":"3309c768-dd26-491a-8c7e-72f6ea043ac0","s… | — ❌ dropped | {"installation_id":"8f7f85e6-6607-46e4-a93c-64f08ca3ea07","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-99d5-7643-a6b2-52610c941b65:0 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe:0 | — ❌ dropped | 01a0e481-9f90-7461-ab70-6d6871e60fca:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | — ❌ dropped | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-99d5-7643-a6b2-52610c941b65 | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe | 01a0e481-9c97-7992-bbb4-3aa4f632c2fe ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept | 01a0e481-9f90-7461-ab70-6d6871e60fca ✅ kept |
| body `client_metadata` | {"thread_id":"01a0e481-99d5-7643-a6b2-52610c941b65","x-codex… | {"x-codex-window-id":"01a0e481-9c97-7992-bbb4-3aa4f632c2fe:1… | {"x-codex-window-id":"01a0e481-9c97-7992-bbb4-3aa4f632c2fe:1… ✅ kept | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… ✅ kept | {"session_id":"01a0e481-9f90-7461-ab70-6d6871e60fca","x-code… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | low ✅ kept | low ✅ kept |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} ✅ kept |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` | function,custom,tool_search,web_search | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,web_search ✏️ changed |
| probe `tools(count)` | 10 | 10 | 10 ✅ kept | 10 | 10 ✅ kept | 10 ✅ kept |
| probe `input[].compaction` | CMP_TRACE_cx-oa-ws-compact-a-3 | ocx1:TU9DS19SRVBMWSBjeC1vYS13cy1jb21wYWN0LWItMg== | — ❌ dropped | ocx1:TU9DS19SRVBMWSBjeC1vYS13cy1jb21wYWN0LWMtMg== | — ❌ dropped | — ❌ dropped |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,compaction | message,message,message,compaction | message,message,message,message ✏️ changed | message,message,message,compaction | message,message,message,message ✏️ changed | message,message,message,message ✏️ changed |
| hdr `version` (other) | 0.157.1 | 0.157.1 | — ❌ dropped | 0.157.1 | — ❌ dropped | — ❌ dropped |

### request #4  (/v1/responses (ws) | ∅ | ∅ | ∅ | ∅ | ∅)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | — | —  | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | — | —  | — | —  | —  |
| hdr `originator` | codex_exec | — | —  | — | —  | —  |
| hdr `session-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | — | —  | — | —  | —  |
| hdr `thread-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | — | —  | — | —  | —  |
| hdr `x-client-request-id` | 01a0e481-99d5-7643-a6b2-52610c941b65 | — | —  | — | —  | —  |
| hdr `x-codex-turn-metadata` | {"installation_id":"cdfd3450-918a-4bd4-8c75-41b33803f13f","s… | — | —  | — | —  | —  |
| hdr `x-codex-window-id` | 01a0e481-99d5-7643-a6b2-52610c941b65:0 | — | —  | — | —  | —  |
| hdr `x-codex-beta-features` | remote_compaction_v2 | — | —  | — | —  | —  |
| hdr `openai-beta` | responses_websockets=2026-02-06 | — | —  | — | —  | —  |
| body `model` | mock-oai/gpt-5.5 | — | —  | — | —  | —  |
| body `stream` | true | — | —  | — | —  | —  |
| body `store` | false | — | —  | — | —  | —  |
| body `prompt_cache_key` | 01a0e481-99d5-7643-a6b2-52610c941b65 | — | —  | — | —  | —  |
| body `client_metadata` | {"session_id":"01a0e481-99d5-7643-a6b2-52610c941b65","x-code… | — | —  | — | —  | —  |
| body `previous_response_id` | resp_TRACE_cx-oa-ws-compact-a-4 | — | —  | — | —  | —  |
| body `include` | ["reasoning.encrypted_content"] | — | —  | — | —  | —  |
| body `reasoning` | {"effort":"medium"} | — | —  | — | —  | —  |
| body `text.verbosity` | low | — | —  | — | —  | —  |
| body `text` | {"verbosity":"low"} | — | —  | — | —  | —  |
| body `parallel_tool_calls` | true | — | —  | — | —  | —  |
| body `tool_choice` | auto | — | —  | — | —  | —  |
| body `instructions` | string(21299) | — | —  | — | —  | —  |
| probe `tools(types)` | function,custom,tool_search,web_search | — | —  | — | —  | —  |
| probe `tools(count)` | 10 | — | —  | — | —  | —  |
| probe `input[].id kept` | true | — | —  | — | —  | —  |
| probe `input(types)` | function_call_output | — | —  | — | —  | —  |
| hdr `version` (other) | 0.157.1 | — | —  | — | —  | —  |

