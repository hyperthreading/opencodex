## Claude Code 2-turn, sk-ant-* key, local claudeCode.nativePassthrough=false

Runs: (a) `cc-2t-a`  (b) `cc-skant-b`  (c) `cc-skant-nopt-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `x-api-key` | dummy-client-key-TRACE | sk-ant… | sk-ant… ✅ kept | sk-ant… | ocx_<REDACTED> ✏️ changed | mock-ant-key-TRACE ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) ✅ kept | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… ✅ kept | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | — ❌ dropped |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | true ✅ kept | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | — ❌ dropped |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5ddd2626-b761-4693-81cb-315caebc5d5e | 5ddd2626-b761-4693-81cb-315caebc5d5e ✅ kept | aed909f4-0e58-425a-bdf9-c5b641b7605d | — ❌ dropped | — ❌ dropped |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… ✅ kept | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | application/json ✅ kept | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | gzip, deflate, br, zstd ✅ kept | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"b9a987922668f7f08161c1d58e68016… | {"user_id":"{\"device_id\":\"b9a987922668f7f08161c1d58e68016… ✅ kept | {"user_id":"{\"device_id\":\"8d69450285624948621a6b24b2e91b3… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"b9a987922668f7f08161c1d58e68016f7c585262f03c21… | {"device_id":"b9a987922668f7f08161c1d58e68016f7c585262f03c21… ✅ kept | {"device_id":"8d69450285624948621a6b24b2e91b3844d97fc10139f0… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} ✅ kept | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(3) ✅ kept | blocks(3) | blocks(1) ✏️ changed | blocks(1) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] ✅ kept | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[0],messages[0].content[9],tools[23] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |

### request #2  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `x-api-key` | dummy-client-key-TRACE | sk-ant… | sk-ant… ✅ kept | sk-ant… | ocx_<REDACTED> ✏️ changed | mock-ant-key-TRACE ✏️ changed |
| hdr `x-opencodex-api-key` | — | ocx_<REDACTED> | — ❌ dropped | — | —  | —  |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) ✅ kept | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… ✅ kept | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | — ❌ dropped |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | true ✅ kept | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | — ❌ dropped |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5ddd2626-b761-4693-81cb-315caebc5d5e | 5ddd2626-b761-4693-81cb-315caebc5d5e ✅ kept | aed909f4-0e58-425a-bdf9-c5b641b7605d | — ❌ dropped | — ❌ dropped |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… ✅ kept | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | — ❌ dropped |
| hdr `accept` | application/json | application/json | application/json ✅ kept | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | gzip, deflate, br, zstd ✅ kept | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"b9a987922668f7f08161c1d58e68016… | {"user_id":"{\"device_id\":\"b9a987922668f7f08161c1d58e68016… ✅ kept | {"user_id":"{\"device_id\":\"8d69450285624948621a6b24b2e91b3… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"b9a987922668f7f08161c1d58e68016f7c585262f03c21… | {"device_id":"b9a987922668f7f08161c1d58e68016f7c585262f03c21… ✅ kept | {"device_id":"8d69450285624948621a6b24b2e91b3844d97fc10139f0… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} ✅ kept | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(3) ✅ kept | blocks(3) | blocks(1) ✏️ changed | blocks(1) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] ✅ kept | system[1],system[2],messages[2].content[0] | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages[].thinking.signature` | SIG_TRACE_cc-2t-a-1 | SIG_TRACE_cc-skant-b-1 | SIG_TRACE_cc-skant-b-1 ✅ kept | SIG_TRACE_cc-skant-nopt-c-1 | SIG_TRACE_cc-skant-nopt-c-1 ✅ kept | SIG_TRACE_cc-skant-nopt-c-1 ✅ kept |
| probe `messages(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |

