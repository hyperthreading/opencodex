## Claude Code 2-turn → canonical anthropic OAuth, hub+local native on

Runs: (a) `cc-2t-a`  (b) `ccn-native-b`  (c) `ccn-nativeHL-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | ee5e55a9-6984-45f7-9851-da0ddbf04c08 ➕ added | — | —  | c741f988-ad16-4648-9025-fbd07e159f43 ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2… ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5bc666f9-e7d7-4c74-9b8a-124bed01d614 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | 52b82960-5fc3-4c83-b10c-3f2ce607d973 | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… ✅ kept | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… ✅ kept | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… ✅ kept |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… ✅ kept | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… ✅ kept | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… ✅ kept |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} ✅ kept |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} ✅ kept |
| body `system` | blocks(3) | blocks(3) | blocks(4) ✏️ changed | blocks(3) | blocks(3) ✅ kept | blocks(4) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[2],system[3],messages[0].content[9] ✏️ changed | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] ✅ kept | system[2],system[3],messages[0].content[9] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |

### request #2  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | 55cf59eb-377c-4f5f-9a5d-2d45864fa815 ➕ added | — | —  | 4a7c7916-bcd7-4589-8965-f7772030f194 ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2… ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5bc666f9-e7d7-4c74-9b8a-124bed01d614 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | 52b82960-5fc3-4c83-b10c-3f2ce607d973 | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… ✅ kept | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… ✅ kept | {"user_id":"{\"device_id\":\"dd814a68c529019fae3666cd4754273… ✅ kept |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… ✅ kept | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… ✅ kept | {"device_id":"dd814a68c529019fae3666cd4754273b570f0eef62c05c… ✅ kept |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} ✅ kept |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} ✅ kept |
| body `system` | blocks(3) | blocks(3) | blocks(4) ✏️ changed | blocks(3) | blocks(3) ✅ kept | blocks(4) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] | system[2],system[3],messages[2].content[0] ✏️ changed | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] ✅ kept | system[2],system[3],messages[2].content[0] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages[].thinking.signature` | SIG_TRACE_cc-2t-a-1 | SIG_TRACE_ccn-native-b-1 | SIG_TRACE_ccn-native-b-1 ✅ kept | SIG_TRACE_ccn-nativeHL-c-1 |  ✏️ changed |  ✏️ changed |
| probe `messages(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |

