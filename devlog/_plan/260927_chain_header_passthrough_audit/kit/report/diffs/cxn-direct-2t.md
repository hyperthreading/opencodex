## Codex ChatGPT-login HTTP 2-turn → canonical openai (direct)

Runs: (a) `cxn-direct-2t-a`  (b) `cxn-direct-2t-b`  (c) `cxn-direct-2t-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> ✅ kept | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-hubmain-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"088895e1-a6c5-4eda-863c-98fff88eff2b","s… | {"installation_id":"6776bfd1-2d40-4360-bd57-d672ded5ffd8","s… | {"installation_id":"6776bfd1-2d40-4360-bd57-d672ded5ffd8","s… ✅ kept | {"installation_id":"5934c2e8-dc01-4d19-b168-c6748c31b14c","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0:0 | 01a0e482-088d-75b1-9c67-facec4d919cb:0 | 01a0e482-088d-75b1-9c67-facec4d919cb:0 ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-client-TRACE ✅ kept | acct-client-TRACE | — ❌ dropped | acct-hubmain-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | 01a0e482-1148-7841-96b2-03ebeacb87df ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df ✅ kept |
| body `client_metadata` | {"session_id":"01a0e482-0066-7993-9a55-b2eba8b095b0","turn_i… | {"turn_id":"01a0e482-08c5-7b72-8001-e95e9cc0e96c","x-codex-i… | {"turn_id":"01a0e482-08c5-7b72-8001-e95e9cc0e96c","x-codex-i… ✅ kept | {"x-codex-turn-metadata":"{\"installation_id\":\"5934c2e8-dc… | {"x-codex-turn-metadata":"{\"installation_id\":\"5934c2e8-dc… ✅ kept | {"x-codex-turn-metadata":"{\"installation_id\":\"5934c2e8-dc… ✅ kept |
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

### request #2  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> ✅ kept | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-hubmain-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"088895e1-a6c5-4eda-863c-98fff88eff2b","s… | {"installation_id":"6776bfd1-2d40-4360-bd57-d672ded5ffd8","s… | {"installation_id":"6776bfd1-2d40-4360-bd57-d672ded5ffd8","s… ✅ kept | {"installation_id":"5934c2e8-dc01-4d19-b168-c6748c31b14c","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e482-0066-7993-9a55-b2eba8b095b0:0 | 01a0e482-088d-75b1-9c67-facec4d919cb:0 | 01a0e482-088d-75b1-9c67-facec4d919cb:0 ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-client-TRACE ✅ kept | acct-client-TRACE | — ❌ dropped | acct-hubmain-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e482-0066-7993-9a55-b2eba8b095b0 | 01a0e482-088d-75b1-9c67-facec4d919cb | 01a0e482-088d-75b1-9c67-facec4d919cb ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df | 01a0e482-1148-7841-96b2-03ebeacb87df ✅ kept | 01a0e482-1148-7841-96b2-03ebeacb87df ✅ kept |
| body `client_metadata` | {"thread_id":"01a0e482-0066-7993-9a55-b2eba8b095b0","x-codex… | {"x-codex-window-id":"01a0e482-088d-75b1-9c67-facec4d919cb:0… | {"x-codex-window-id":"01a0e482-088d-75b1-9c67-facec4d919cb:0… ✅ kept | {"x-codex-window-id":"01a0e482-1148-7841-96b2-03ebeacb87df:0… | {"x-codex-window-id":"01a0e482-1148-7841-96b2-03ebeacb87df:0… ✅ kept | {"x-codex-window-id":"01a0e482-1148-7841-96b2-03ebeacb87df:0… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium","summary":"auto"} | {"effort":"medium","summary":"auto"} ✅ kept | {"effort":"medium","summary":"auto"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | — | —  | —  |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | — | —  | —  |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21420) | string(21420) ✅ kept | string(16979) | string(16979) ✅ kept | string(16979) ✅ kept |
| probe `tools(types)` | function,custom,namespace,tool_search,web_search | custom,function,namespace,web_search | custom,function,namespace,web_search ✅ kept | function,namespace,web_search | function,web_search ✏️ changed | function,web_search ✏️ changed |
| probe `tools(count)` | 14 | 6 | 6 ✅ kept | 13 | 17 ✏️ changed | 17 ✏️ changed |
| probe `input[].reasoning.encrypted_content` | ENC_TRACE_cxn-direct-2t-a-1 | ENC_TRACE_cxn-direct-2t-b-1 | ENC_TRACE_cxn-direct-2t-b-1 ✅ kept | ENC_TRACE_cxn-direct-2t-c-1 | ENC_TRACE_cxn-direct-2t-c-1 ✅ kept | ENC_TRACE_cxn-direct-2t-c-1 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… ✅ kept |

