## Codex WebSocket 2-turn → custom (hub/local websockets:true)

Runs: (a) `cx-ws-2t-a`  (b) `cx-ws-2t-b`  (c) `cx-ws-2t-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/responses (ws) | /v1/responses (ws) | /v1/responses | /v1/responses (ws) | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"d9808854-2aca-4aca-9721-c496fc80c00b","s… | {"installation_id":"8725d594-1147-4b17-a8d4-84772182c321","s… | — ❌ dropped | {"installation_id":"3165d252-00b3-4e2f-b871-ff514f6489a4","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1:0 | 01a0e481-8d20-7913-85e4-7aeda32c8252:0 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | — ❌ dropped | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | 01a0e481-8d20-7913-85e4-7aeda32c8252 ✅ kept | 01a0e481-8fa6-75b3-97f8-135d42d45321 | 01a0e481-8fa6-75b3-97f8-135d42d45321 ✅ kept | 01a0e481-8fa6-75b3-97f8-135d42d45321 ✅ kept |
| body `client_metadata` | {"x-codex-window-id":"01a0e481-8ad7-7062-9db5-ab96460f7ab1:0… | {"session_id":"01a0e481-8d20-7913-85e4-7aeda32c8252","x-code… | {"session_id":"01a0e481-8d20-7913-85e4-7aeda32c8252","x-code… ✅ kept | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… ✅ kept | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… ✅ kept |
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

### request #2  (/v1/responses (ws) | /v1/responses (ws) | /v1/responses | /v1/responses (ws) | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"d9808854-2aca-4aca-9721-c496fc80c00b","s… | {"installation_id":"8725d594-1147-4b17-a8d4-84772182c321","s… | — ❌ dropped | {"installation_id":"3165d252-00b3-4e2f-b871-ff514f6489a4","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1:0 | 01a0e481-8d20-7913-85e4-7aeda32c8252:0 | — ❌ dropped | 01a0e481-8fa6-75b3-97f8-135d42d45321:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `openai-beta` | responses_websockets=2026-02-06 | responses_websockets=2026-02-06 | — ❌ dropped | responses_websockets=2026-02-06 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | — | — | */* ➕ added | — | */* ➕ added | */* ➕ added |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | — | — | application/json ➕ added | — | application/json ➕ added | application/json ➕ added |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-8ad7-7062-9db5-ab96460f7ab1 | 01a0e481-8d20-7913-85e4-7aeda32c8252 | 01a0e481-8d20-7913-85e4-7aeda32c8252 ✅ kept | 01a0e481-8fa6-75b3-97f8-135d42d45321 | 01a0e481-8fa6-75b3-97f8-135d42d45321 ✅ kept | 01a0e481-8fa6-75b3-97f8-135d42d45321 ✅ kept |
| body `client_metadata` | {"x-codex-window-id":"01a0e481-8ad7-7062-9db5-ab96460f7ab1:0… | {"session_id":"01a0e481-8d20-7913-85e4-7aeda32c8252","x-code… | {"session_id":"01a0e481-8d20-7913-85e4-7aeda32c8252","x-code… ✅ kept | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… ✅ kept | {"session_id":"01a0e481-8fa6-75b3-97f8-135d42d45321","x-code… ✅ kept |
| body `previous_response_id` | resp_TRACE_cx-ws-2t-a-2 | resp_TRACE_cx-ws-2t-b-1 | — ❌ dropped | resp_TRACE_cx-ws-2t-c-1 | — ❌ dropped | — ❌ dropped |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | low ✅ kept | low ✅ kept |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} ✅ kept |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` | function,custom,tool_search,web_search | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,web_search ✏️ changed |
| probe `tools(count)` | 10 | 10 | 10 ✅ kept | 10 | 10 ✅ kept | 10 ✅ kept |
| probe `input[].reasoning.encrypted_content` | — | — | ENC_TRACE_cx-ws-2t-b-1 ➕ added | — | ENC_TRACE_cx-ws-2t-c-1 ➕ added | ENC_TRACE_cx-ws-2t-c-1 ➕ added |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | function_call_output | function_call_output | message,message,message,reasoning,function_call,function_cal… ✏️ changed | function_call_output | message,message,message,reasoning,function_call,function_cal… ✏️ changed | message,message,message,reasoning,function_call,function_cal… ✏️ changed |

