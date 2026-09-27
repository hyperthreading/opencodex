## Claude Code 2-turn → custom anthropic, bridge, x-api-key

Runs: (a) `cc-2t-a`  (b) `cc-2t-b`  (c) `cc-2t-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | mock-ant-key-TRACE ✏️ changed | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | mock-ant-key-TRACE ✏️ changed |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | — ❌ dropped |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | — ❌ dropped | cli | — ❌ dropped | — ❌ dropped |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 31de9913-6228-4945-bb01-9fb24ebdebd0 | — ❌ dropped | 35ba7b59-fb35-4277-9f5b-2a586bff0ab1 | — ❌ dropped | — ❌ dropped |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"8904da0750c190ba4089adc9d76e931… | — ❌ dropped | {"user_id":"{\"device_id\":\"6db7823f7793fd7f654ae7141849816… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"8904da0750c190ba4089adc9d76e931fe39fc07fb7f5cd… | — ❌ dropped | {"device_id":"6db7823f7793fd7f654ae7141849816d88171d83cb9bab… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | — ❌ dropped | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(1) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(1) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[0],messages[0].content[9],tools[23] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |

### request #2  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | mock-ant-key-TRACE ✏️ changed | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | mock-ant-key-TRACE ✏️ changed |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | — ❌ dropped |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | — ❌ dropped | cli | — ❌ dropped | — ❌ dropped |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 31de9913-6228-4945-bb01-9fb24ebdebd0 | — ❌ dropped | 35ba7b59-fb35-4277-9f5b-2a586bff0ab1 | — ❌ dropped | — ❌ dropped |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"8904da0750c190ba4089adc9d76e931… | — ❌ dropped | {"user_id":"{\"device_id\":\"6db7823f7793fd7f654ae7141849816… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"8904da0750c190ba4089adc9d76e931fe39fc07fb7f5cd… | — ❌ dropped | {"device_id":"6db7823f7793fd7f654ae7141849816d88171d83cb9bab… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | — ❌ dropped | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(1) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(1) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed | system[1],system[2],messages[2].content[0] | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages[].thinking.signature` | SIG_TRACE_cc-2t-a-1 | SIG_TRACE_cc-2t-b-1 | SIG_TRACE_cc-2t-b-1 ✅ kept | SIG_TRACE_cc-2t-c-1 | SIG_TRACE_cc-2t-c-1 ✅ kept | SIG_TRACE_cc-2t-c-1 ✅ kept |
| probe `messages(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |

