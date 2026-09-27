## Codex inline auto-compaction (request_kind=compaction) → custom

Runs: (a) `cx-compact-inline-a`  (b) `cx-compact-inline-b`  (c) `cx-compact-inline-c`  — inference requests: a=3, b=3→3, c=3→3→3

### request #1  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"373229c3-c258-4795-ba39-7495fa514871","s… | {"installation_id":"4a12395a-c351-4f41-84e7-f8f284c3dac6","s… | — ❌ dropped | {"installation_id":"7ce088f2-844d-4086-b41f-146b9458edc6","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-920a-77b3-9788-2c23cb140f74:0 | 01a0e481-94ad-7ce0-ab07-43352a737f7a:0 | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | 01a0e481-94ad-7ce0-ab07-43352a737f7a ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-920a-77b3-9788-2c23cb140f74","x-code… | {"root_turn_id":"01a0e481-94c5-76a2-ac70-be8f4647c51c","x-co… | {"root_turn_id":"01a0e481-94c5-76a2-ac70-be8f4647c51c","x-co… ✅ kept | {"x-codex-turn-metadata":"{\"installation_id\":\"7ce088f2-84… | {"x-codex-turn-metadata":"{\"installation_id\":\"7ce088f2-84… ✅ kept | {"x-codex-turn-metadata":"{\"installation_id\":\"7ce088f2-84… ✅ kept |
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
| hdr `session-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"373229c3-c258-4795-ba39-7495fa514871","s… | {"installation_id":"4a12395a-c351-4f41-84e7-f8f284c3dac6","s… | — ❌ dropped | {"installation_id":"7ce088f2-844d-4086-b41f-146b9458edc6","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-920a-77b3-9788-2c23cb140f74:0 | 01a0e481-94ad-7ce0-ab07-43352a737f7a:0 | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | 01a0e481-94ad-7ce0-ab07-43352a737f7a ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept |
| body `client_metadata` | {"x-codex-turn-metadata":"{\"installation_id\":\"373229c3-c2… | {"x-codex-installation-id":"4a12395a-c351-4f41-84e7-f8f284c3… | {"x-codex-installation-id":"4a12395a-c351-4f41-84e7-f8f284c3… ✅ kept | {"x-codex-installation-id":"7ce088f2-844d-4086-b41f-146b9458… | {"x-codex-installation-id":"7ce088f2-844d-4086-b41f-146b9458… ✅ kept | {"x-codex-installation-id":"7ce088f2-844d-4086-b41f-146b9458… ✅ kept |
| body `include` | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] | ["reasoning.encrypted_content"] ✅ kept | ["reasoning.encrypted_content"] ✅ kept |
| body `reasoning` | {"effort":"medium"} | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} | {"effort":"medium"} ✅ kept | {"effort":"medium"} ✅ kept |
| body `text.verbosity` | low | low | low ✅ kept | low | low ✅ kept | low ✅ kept |
| body `text` | {"verbosity":"low"} | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} | {"verbosity":"low"} ✅ kept | {"verbosity":"low"} ✅ kept |
| body `parallel_tool_calls` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `tool_choice` | auto | auto | auto ✅ kept | auto | auto ✅ kept | auto ✅ kept |
| body `instructions` | string(21299) | string(21299) | string(21299) ✅ kept | string(21299) | string(21299) ✅ kept | string(21299) ✅ kept |
| probe `tools(types)` |  |  |  ✅ kept |  |  ✅ kept |  ✅ kept |
| probe `tools(count)` | 0 | 0 | 0 ✅ kept | 0 | 0 ✅ kept | 0 ✅ kept |
| probe `input[].reasoning.encrypted_content` | ENC_TRACE_cx-compact-inline-a-1 | ENC_TRACE_cx-compact-inline-b-1 | ENC_TRACE_cx-compact-inline-b-1 ✅ kept | ENC_TRACE_cx-compact-inline-c-1 | ENC_TRACE_cx-compact-inline-c-1 ✅ kept | ENC_TRACE_cx-compact-inline-c-1 ✅ kept |
| probe `input[].id kept` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| probe `input(types)` | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… | message,message,message,reasoning,function_call,function_cal… ✅ kept | message,message,message,reasoning,function_call,function_cal… ✅ kept |

### request #3  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"373229c3-c258-4795-ba39-7495fa514871","s… | {"installation_id":"4a12395a-c351-4f41-84e7-f8f284c3dac6","s… | — ❌ dropped | {"installation_id":"7ce088f2-844d-4086-b41f-146b9458edc6","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-920a-77b3-9788-2c23cb140f74:1 | 01a0e481-94ad-7ce0-ab07-43352a737f7a:1 | — ❌ dropped | 01a0e481-9723-7930-9a8f-fdd9826f940f:1 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-920a-77b3-9788-2c23cb140f74 | 01a0e481-94ad-7ce0-ab07-43352a737f7a | 01a0e481-94ad-7ce0-ab07-43352a737f7a ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept | 01a0e481-9723-7930-9a8f-fdd9826f940f ✅ kept |
| body `client_metadata` | {"session_id":"01a0e481-920a-77b3-9788-2c23cb140f74","turn_i… | {"x-codex-window-id":"01a0e481-94ad-7ce0-ab07-43352a737f7a:1… | {"x-codex-window-id":"01a0e481-94ad-7ce0-ab07-43352a737f7a:1… ✅ kept | {"turn_id":"01a0e481-973c-7840-b578-1a4a92e6bfd2","root_turn… | {"turn_id":"01a0e481-973c-7840-b578-1a4a92e6bfd2","root_turn… ✅ kept | {"turn_id":"01a0e481-973c-7840-b578-1a4a92e6bfd2","root_turn… ✅ kept |
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
| probe `input(types)` | message,message,message,message | message,message,message,message | message,message,message,message ✅ kept | message,message,message,message | message,message,message,message ✅ kept | message,message,message,message ✅ kept |

