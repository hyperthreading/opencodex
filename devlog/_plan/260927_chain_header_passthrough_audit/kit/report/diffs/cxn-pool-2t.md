## Codex ChatGPT-login HTTP 2-turn → canonical openai (pool)

Runs: (a) `cxn-pool-2t-a`  (b) `cxn-pool-2t-b`  (c) `cxn-pool-2t-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"38826b72-6835-4a7a-b5d0-b04b85658391","s… | {"installation_id":"bb274e55-cfcd-4f90-b20b-84b036b95cef","s… | {"installation_id":"bb274e55-cfcd-4f90-b20b-84b036b95cef","s… ✅ kept | {"installation_id":"581eebdd-35cc-4f09-bdfd-78084b40a9a2","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4:0 | 01a0e481-b334-7951-b5f7-b38f79bc068f:0 | 01a0e481-b334-7951-b5f7-b38f79bc068f:0 ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-aad3-7d62-8b80-530100ab9ce4","turn_i… | {"root_turn_id":"01a0e481-b353-74c3-9c64-961e23753ce9","x-co… | {"root_turn_id":"01a0e481-b353-74c3-9c64-961e23753ce9","x-co… ✅ kept | {"thread_id":"01a0e481-bbc5-7731-ac1a-c9b7f037a6f6","turn_id… | {"thread_id":"01a0e481-bbc5-7731-ac1a-c9b7f037a6f6","turn_id… ✅ kept | {"thread_id":"01a0e481-bbc5-7731-ac1a-c9b7f037a6f6","turn_id… ✅ kept |
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
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"38826b72-6835-4a7a-b5d0-b04b85658391","s… | {"installation_id":"bb274e55-cfcd-4f90-b20b-84b036b95cef","s… | {"installation_id":"bb274e55-cfcd-4f90-b20b-84b036b95cef","s… ✅ kept | {"installation_id":"581eebdd-35cc-4f09-bdfd-78084b40a9a2","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-aad3-7d62-8b80-530100ab9ce4:0 | 01a0e481-b334-7951-b5f7-b38f79bc068f:0 | 01a0e481-b334-7951-b5f7-b38f79bc068f:0 ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-aad3-7d62-8b80-530100ab9ce4 | 01a0e481-b334-7951-b5f7-b38f79bc068f | 01a0e481-b334-7951-b5f7-b38f79bc068f ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 ✅ kept | 01a0e481-bbc5-7731-ac1a-c9b7f037a6f6 ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-aad3-7d62-8b80-530100ab9ce4","thread… | {"thread_id":"01a0e481-b334-7951-b5f7-b38f79bc068f","turn_id… | {"thread_id":"01a0e481-b334-7951-b5f7-b38f79bc068f","turn_id… ✅ kept | {"turn_id":"01a0e481-bc0d-7723-bbcc-455e8e87a249","session_i… | {"turn_id":"01a0e481-bc0d-7723-bbcc-455e8e87a249","session_i… ✅ kept | {"turn_id":"01a0e481-bc0d-7723-bbcc-455e8e87a249","session_i… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium","summary":"auto"} | {"effort":"medium","summary":"auto"} ✅ kept | {"effort":"medium","summary":"auto"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | — | —  | —  |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | — | —  | —  |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21420) | string(21420) ✅ kept | string(16979) | string(16979) ✅ kept | string(16979) ✅ kept |
| probe `tools(types)` | function,custom,namespace,tool_search,web_search | custom,function,namespace,web_search | custom,function,namespace,web_search ✅ kept | function,namespace,web_search | function,web_search ✏️ changed | function,web_search ✏️ changed |
| probe `tools(count)` | 14 | 6 | 6 ✅ kept | 13 | 17 ✏️ changed | 17 ✏️ changed |
| probe `input[].reasoning.encrypted_content` | ENC_TRACE_cxn-pool-2t-a-1 | ENC_TRACE_cxn-pool-2t-b-1 | ENC_TRACE_cxn-pool-2t-b-1 ✅ kept | ENC_TRACE_cxn-pool-2t-c-1 | ENC_TRACE_cxn-pool-2t-c-1 ✅ kept | ENC_TRACE_cxn-pool-2t-c-1 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… ✅ kept |

