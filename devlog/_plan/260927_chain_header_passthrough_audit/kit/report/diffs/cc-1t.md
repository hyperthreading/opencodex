## Claude Code 1-turn → custom anthropic (mock-ant), bridge

Runs: (a) `cc-1t-a`  (b) `cc-1t-b`  (c) `cc-1t-c`  — inference requests: a=1, b=1→1, c=1→1→1

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | mock-ant-key-TRACE ✏️ changed | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | mock-ant-key-TRACE ✏️ changed |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | — ❌ dropped |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | — ❌ dropped | cli | — ❌ dropped | — ❌ dropped |
| hdr `x-claude-code-session-id` | 67f60068-c04a-4ef3-80bb-5f02fe0812fe | d780e705-cc93-43f7-bb47-1b101ee5dc20 | — ❌ dropped | 3211c1d4-560a-4628-b621-059ccaaefdb6 | — ❌ dropped | — ❌ dropped |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c5dba508c30afa062b20c1fae2a0f22… | {"user_id":"{\"device_id\":\"9bd47f09a49d4f6ce5c9d4ec9decd45… | — ❌ dropped | {"user_id":"{\"device_id\":\"4aa1d124274cbed3901eac6fcd67286… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c5dba508c30afa062b20c1fae2a0f22c83ca669bb94b52… | {"device_id":"9bd47f09a49d4f6ce5c9d4ec9decd45d746d3e6881849e… | — ❌ dropped | {"device_id":"4aa1d124274cbed3901eac6fcd672864d56cbb8cc6b8c4… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | — ❌ dropped | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(1) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(1) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[0],messages[0].content[9],tools[23] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |

