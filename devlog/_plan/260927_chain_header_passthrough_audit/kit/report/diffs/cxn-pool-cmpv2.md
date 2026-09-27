## Codex ChatGPT-login inline auto-compaction → canonical (pool)

Runs: (a) `cxn-pool-cmpv2-a`  (b) `cxn-pool-cmpv2-b`  (c) `cxn-pool-cmpv2-c`  — inference requests: a=3, b=3→3, c=3→3→3

### request #1  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"8a4c28de-f1ae-40af-bca7-a976015b4be1","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… ✅ kept | {"installation_id":"14be89bb-5c9c-4b08-9564-82b850cb815a","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051:0 | 01a0e481-e675-7971-8cb1-cd15077a198a:0 | 01a0e481-e675-7971-8cb1-cd15077a198a:0 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-dd78-75d2-b886-2d29b84d8051","x-code… | {"x-codex-window-id":"01a0e481-e675-7971-8cb1-cd15077a198a:0… | {"x-codex-window-id":"01a0e481-e675-7971-8cb1-cd15077a198a:0… ✅ kept | {"x-codex-window-id":"01a0e481-eedc-7f13-82cd-cd6b1a456ee7:0… | {"x-codex-window-id":"01a0e481-eedc-7f13-82cd-cd6b1a456ee7:0… ✅ kept | {"x-codex-window-id":"01a0e481-eedc-7f13-82cd-cd6b1a456ee7:0… ✅ kept |
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
| hdr `session-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"8a4c28de-f1ae-40af-bca7-a976015b4be1","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… ✅ kept | {"installation_id":"14be89bb-5c9c-4b08-9564-82b850cb815a","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051:0 | 01a0e481-e675-7971-8cb1-cd15077a198a:0 | 01a0e481-e675-7971-8cb1-cd15077a198a:0 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-dd78-75d2-b886-2d29b84d8051","root_t… | {"thread_id":"01a0e481-e675-7971-8cb1-cd15077a198a","turn_id… | {"thread_id":"01a0e481-e675-7971-8cb1-cd15077a198a","turn_id… ✅ kept | {"x-codex-installation-id":"14be89bb-5c9c-4b08-9564-82b850cb… | {"x-codex-installation-id":"14be89bb-5c9c-4b08-9564-82b850cb… ✅ kept | {"x-codex-installation-id":"14be89bb-5c9c-4b08-9564-82b850cb… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium","summary":"auto"} | {"effort":"medium","summary":"auto"} ✅ kept | {"effort":"medium","summary":"auto"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | — | —  | —  |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | — | —  | —  |
| body `parallel_tool_calls` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21420) | string(21420) ✅ kept | string(16979) | string(16979) ✅ kept | string(16979) ✅ kept |
| probe `tools(types)` |  |  |  ✅ kept |  |  ✅ kept |  ✅ kept |
| probe `tools(count)` | 0 | 0 | 0 ✅ kept | 0 | 0 ✅ kept | 0 ✅ kept |
| probe `input[].reasoning.encrypted_content` | ENC_TRACE_cxn-pool-cmpv2-a-1 | ENC_TRACE_cxn-pool-cmpv2-b-1 | ENC_TRACE_cxn-pool-cmpv2-b-1 ✅ kept | ENC_TRACE_cxn-pool-cmpv2-c-1 | ENC_TRACE_cxn-pool-cmpv2-c-1 ✅ kept | ENC_TRACE_cxn-pool-cmpv2-c-1 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… ✅ kept |

### request #3  (/backend-api/codex/responses | /v1/responses | /backend-api/codex/responses | /v1/responses | /v1/responses | /backend-api/codex/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-client-TRACE> | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed | Bearer <jwt acct=acct-client-TRACE> | Bearer ocx_<REDACTED> ✏️ changed | Bearer <jwt acct=acct-pool-TRACE> ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | codex_exec ✅ kept | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"8a4c28de-f1ae-40af-bca7-a976015b4be1","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… | {"installation_id":"e1e86328-9acd-4e5d-afef-c63be0962488","s… ✅ kept | {"installation_id":"14be89bb-5c9c-4b08-9564-82b850cb815a","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-dd78-75d2-b886-2d29b84d8051:1 | 01a0e481-e675-7971-8cb1-cd15077a198a:1 | 01a0e481-e675-7971-8cb1-cd15077a198a:1 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7:1 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | remote_compaction_v2 ✅ kept | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-routing-hint` | — | — | model=gpt-5.5 ➕ added | — | —  | model=gpt-5.5 ➕ added |
| hdr `chatgpt-account-id` | acct-client-TRACE | acct-client-TRACE | acct-pool-TRACE ✏️ changed | acct-client-TRACE | — ❌ dropped | acct-pool-TRACE ✏️ changed |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | gpt-5.5 | gpt-5.5 | gpt-5.5 ✅ kept | hub/gpt-5.5 | gpt-5.5 ✏️ changed | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-dd78-75d2-b886-2d29b84d8051 | 01a0e481-e675-7971-8cb1-cd15077a198a | 01a0e481-e675-7971-8cb1-cd15077a198a ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept | 01a0e481-eedc-7f13-82cd-cd6b1a456ee7 ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-dd78-75d2-b886-2d29b84d8051","turn_i… | {"root_turn_id":"01a0e481-e697-7a72-96a1-cddcebf18fe7","sess… | {"root_turn_id":"01a0e481-e697-7a72-96a1-cddcebf18fe7","sess… ✅ kept | {"turn_id":"01a0e481-ef06-7d00-a39c-fe0bb99103b4","thread_id… | {"turn_id":"01a0e481-ef06-7d00-a39c-fe0bb99103b4","thread_id… ✅ kept | {"turn_id":"01a0e481-ef06-7d00-a39c-fe0bb99103b4","thread_id… ✅ kept |
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
| probe `input(types)` | message,message,message,message | message,message,message,message | message,message,message,message ✅ kept | message,message,message,message | message,message,message,message ✅ kept | message,message,message,message ✅ kept |

