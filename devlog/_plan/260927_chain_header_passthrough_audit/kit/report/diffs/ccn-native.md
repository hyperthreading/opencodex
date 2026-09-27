## Claude Code 2-turn → canonical anthropic OAuth, hub native(+OAuth) on, local off

Runs: (a) `cc-2t-a`  (b) `ccn-native-b`  (c) `ccn-native-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | ee5e55a9-6984-45f7-9851-da0ddbf04c08 ➕ added | — | —  | acb60527-d68a-4ca3-b478-e7f9c2ac181c ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2… ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5bc666f9-e7d7-4c74-9b8a-124bed01d614 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | e9007126-ea9f-4570-bdfc-459aec0ca752 | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… ✅ kept | {"user_id":"{\"device_id\":\"e854e961bf30a25bab3ca8d8925e2f3… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… ✅ kept | {"device_id":"e854e961bf30a25bab3ca8d8925e2f36eb2c7cc6589b33… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":16384} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(4) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(2) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[2],system[3],messages[0].content[9] ✏️ changed | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[1],messages[0].content[9],tools[23] ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |

### request #2  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | 55cf59eb-377c-4f5f-9a5d-2d45864fa815 ➕ added | — | —  | 5e2c7554-10db-46c5-9b4e-b036ab3f0ac1 ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2… ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5bc666f9-e7d7-4c74-9b8a-124bed01d614 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | e9007126-ea9f-4570-bdfc-459aec0ca752 | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… | {"user_id":"{\"device_id\":\"1106191499807457225af376171ea76… ✅ kept | {"user_id":"{\"device_id\":\"e854e961bf30a25bab3ca8d8925e2f3… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… | {"device_id":"1106191499807457225af376171ea7648fb7081cd04f69… ✅ kept | {"device_id":"e854e961bf30a25bab3ca8d8925e2f36eb2c7cc6589b33… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} ✅ kept | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":16384} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | {"effort":"high"} ✅ kept | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(4) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(2) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] | system[2],system[3],messages[2].content[0] ✏️ changed | system[1],system[2],messages[2].content[0] | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed | system[1],messages[0].content[9],messages[2].content[0],tool… ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages[].thinking.signature` | SIG_TRACE_cc-2t-a-1 | SIG_TRACE_ccn-native-b-1 | SIG_TRACE_ccn-native-b-1 ✅ kept | SIG_TRACE_ccn-native-c-1 | SIG_TRACE_ccn-native-c-1 ✅ kept | SIG_TRACE_ccn-native-c-1 ✅ kept |
| probe `messages(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |

