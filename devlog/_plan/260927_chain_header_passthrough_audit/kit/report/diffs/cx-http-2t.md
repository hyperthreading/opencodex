## Codex HTTP 2-turn (tool) → custom

Runs: (a) `cx-http-2t-a`  (b) `cx-http-2t-b`  (c) `cx-http-2t-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"a2581c68-751f-4045-b9b6-2f22d252bf56","s… | {"installation_id":"1a6b6522-c4f0-43a5-8a6b-7309a8b2c180","s… | — ❌ dropped | {"installation_id":"a8f5b3ad-3fff-423b-ba7c-430a21bfdfbc","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd:0 | 01a0e481-85f3-7542-9acb-84677f81911c:0 | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | 01a0e481-85f3-7542-9acb-84677f81911c ✅ kept | 01a0e481-8852-7b20-9f64-c5a74298589a | 01a0e481-8852-7b20-9f64-c5a74298589a ✅ kept | 01a0e481-8852-7b20-9f64-c5a74298589a ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-83cc-7da2-8f2c-231cc2327cbd","x-code… | {"x-codex-turn-metadata":"{\"installation_id\":\"1a6b6522-c4… | {"x-codex-turn-metadata":"{\"installation_id\":\"1a6b6522-c4… ✅ kept | {"thread_id":"01a0e481-8852-7b20-9f64-c5a74298589a","turn_id… | {"thread_id":"01a0e481-8852-7b20-9f64-c5a74298589a","turn_id… ✅ kept | {"thread_id":"01a0e481-8852-7b20-9f64-c5a74298589a","turn_id… ✅ kept |
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

### request #2  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"a2581c68-751f-4045-b9b6-2f22d252bf56","s… | {"installation_id":"1a6b6522-c4f0-43a5-8a6b-7309a8b2c180","s… | — ❌ dropped | {"installation_id":"a8f5b3ad-3fff-423b-ba7c-430a21bfdfbc","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd:0 | 01a0e481-85f3-7542-9acb-84677f81911c:0 | — ❌ dropped | 01a0e481-8852-7b20-9f64-c5a74298589a:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-83cc-7da2-8f2c-231cc2327cbd | 01a0e481-85f3-7542-9acb-84677f81911c | 01a0e481-85f3-7542-9acb-84677f81911c ✅ kept | 01a0e481-8852-7b20-9f64-c5a74298589a | 01a0e481-8852-7b20-9f64-c5a74298589a ✅ kept | 01a0e481-8852-7b20-9f64-c5a74298589a ✅ kept |
| body `client_metadata` | {"turn_id":"01a0e481-83ee-7551-ab18-c283d5faac79","x-codex-i… | {"x-codex-installation-id":"1a6b6522-c4f0-43a5-8a6b-7309a8b2… | {"x-codex-installation-id":"1a6b6522-c4f0-43a5-8a6b-7309a8b2… ✅ kept | {"x-codex-installation-id":"a8f5b3ad-3fff-423b-ba7c-430a21bf… | {"x-codex-installation-id":"a8f5b3ad-3fff-423b-ba7c-430a21bf… ✅ kept | {"x-codex-installation-id":"a8f5b3ad-3fff-423b-ba7c-430a21bf… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | low ✅ kept | low ✅ kept |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} ✅ kept |
| body `parallel_tool_calls` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` | function,custom,tool_search,web_search | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,tool_search,web_search | function,custom,web_search ✏️ changed | function,custom,web_search ✏️ changed |
| probe `tools(count)` | 10 | 10 | 10 ✅ kept | 10 | 10 ✅ kept | 10 ✅ kept |
| probe `input[].reasoning.encrypted_content` | ENC_TRACE_cx-http-2t-a-1 | ENC_TRACE_cx-http-2t-b-1 | ENC_TRACE_cx-http-2t-b-1 ✅ kept | ENC_TRACE_cx-http-2t-c-1 | ENC_TRACE_cx-http-2t-c-1 ✅ kept | ENC_TRACE_cx-http-2t-c-1 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… ✅ kept |

