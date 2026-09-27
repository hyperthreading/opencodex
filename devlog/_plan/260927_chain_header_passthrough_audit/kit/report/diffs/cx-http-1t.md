## Codex HTTP 1-turn → custom openai-responses (mock-oai)

Runs: (a) `cx-http-1t-a`  (b) `cx-http-1t-b`  (c) `cx-http-1t-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses | /v1/responses)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | Bearer sk-cli… | Bearer ocx_<REDACTED> | Bearer mock-oai-key-TRACE ✏️ changed | Bearer sk-cli… | Bearer ocx_<REDACTED> ✏️ changed | Bearer mock-oai-key-TRACE ✏️ changed |
| hdr `user-agent` | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec;… | Bun/1.3.11 ✏️ changed | Bun/1.3.11 ✏️ changed |
| hdr `originator` | codex_exec | codex_exec | — ❌ dropped | codex_exec | — ❌ dropped | — ❌ dropped |
| hdr `session-id` | 01a0e481-7dc7-7b60-a7b5-7ddd64190aad | 01a0e481-7f83-74d0-9391-9d2b69a27996 | — ❌ dropped | 01a0e481-8198-7190-bc65-fff77101ce88 | — ❌ dropped | — ❌ dropped |
| hdr `thread-id` | 01a0e481-7dc7-7b60-a7b5-7ddd64190aad | 01a0e481-7f83-74d0-9391-9d2b69a27996 | — ❌ dropped | 01a0e481-8198-7190-bc65-fff77101ce88 | — ❌ dropped | — ❌ dropped |
| hdr `x-client-request-id` | 01a0e481-7dc7-7b60-a7b5-7ddd64190aad | 01a0e481-7f83-74d0-9391-9d2b69a27996 | — ❌ dropped | 01a0e481-8198-7190-bc65-fff77101ce88 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-turn-metadata` | {"installation_id":"99dbc100-d4d7-4718-858e-ca06979d11a5","s… | {"installation_id":"96c0646e-30db-4dac-ba16-2177116fb7f8","s… | — ❌ dropped | {"installation_id":"df0312f4-d168-4a91-a406-ec2f6545ef89","s… | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-window-id` | 01a0e481-7dc7-7b60-a7b5-7ddd64190aad:0 | 01a0e481-7f83-74d0-9391-9d2b69a27996:0 | — ❌ dropped | 01a0e481-8198-7190-bc65-fff77101ce88:0 | — ❌ dropped | — ❌ dropped |
| hdr `x-codex-beta-features` | remote_compaction_v2 | remote_compaction_v2 | — ❌ dropped | remote_compaction_v2 | — ❌ dropped | — ❌ dropped |
| hdr `accept` | text/event-stream | text/event-stream | */* ✏️ changed | text/event-stream | */* ✏️ changed | */* ✏️ changed |
| hdr `accept-encoding` | — | — | identity ➕ added | — | identity ➕ added | identity ➕ added |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 | gpt-5.5 ✏️ changed | mock-oai/gpt-5.5 | mock-oai/gpt-5.5 ✅ kept | gpt-5.5 ✏️ changed |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `store` | false | false | false ✅ kept | false | false ✅ kept | false ✅ kept |
| body `prompt_cache_key` | 01a0e481-7dc7-7b60-a7b5-7ddd64190aad | 01a0e481-7f83-74d0-9391-9d2b69a27996 | 01a0e481-7f83-74d0-9391-9d2b69a27996 ✅ kept | 01a0e481-8198-7190-bc65-fff77101ce88 | 01a0e481-8198-7190-bc65-fff77101ce88 ✅ kept | 01a0e481-8198-7190-bc65-fff77101ce88 ✅ kept |
| body `client_metadata` | {"x-codex-installation-id":"99dbc100-d4d7-4718-858e-ca06979d… | {"root_turn_id":"01a0e481-7f99-7650-ad13-c2d9cab7e364","thre… | {"root_turn_id":"01a0e481-7f99-7650-ad13-c2d9cab7e364","thre… ✅ kept | {"session_id":"01a0e481-8198-7190-bc65-fff77101ce88","root_t… | {"session_id":"01a0e481-8198-7190-bc65-fff77101ce88","root_t… ✅ kept | {"session_id":"01a0e481-8198-7190-bc65-fff77101ce88","root_t… ✅ kept |
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

