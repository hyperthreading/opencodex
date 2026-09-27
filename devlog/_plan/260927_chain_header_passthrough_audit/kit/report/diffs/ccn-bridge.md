## Claude Code 2-turn → canonical anthropic OAuth (hub), bridge

Runs: (a) `cc-2t-a`  (b) `ccn-bridge-b`  (c) `ccn-bridge-c`  — inference requests: a=2, b=2→2, c=2→2→2

### request #1  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | cc65c255-7f90-4129-8b67-24da32ef55c7 ➕ added | — | —  | 155027f8-9d6d-452d-81a7-5745bff0dac0 ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20 ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5de34196-1f1b-4255-9cb9-bc2101f606e8 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | 8470230b-8d9f-4751-9e30-a25c6c21004b | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"7765931cf65059bec22bad20d45b95d… | — ❌ dropped | {"user_id":"{\"device_id\":\"2bbf5a6bc3ed8ad4b2161cfb8270bca… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"7765931cf65059bec22bad20d45b95d6a23243905e3c82… | — ❌ dropped | {"device_id":"2bbf5a6bc3ed8ad4b2161cfb8270bca33166e6b9916577… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | — ❌ dropped | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(2) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(2) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[0].content[9] | system[1],system[2],messages[0].content[9] | system[1],tools[23],top-level ✏️ changed | system[1],system[2],messages[0].content[9] | system[0],messages[0].content[9],tools[23] ✏️ changed | system[1],tools[23],top-level ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages(count)` | 1 | 1 | 1 ✅ kept | 1 | 1 ✅ kept | 1 ✅ kept |
| body `cache_control` (other) | — | — | {"type":"ephemeral"} ➕ added | — | —  | {"type":"ephemeral"} ➕ added |

### request #2  (/v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages | /v1/messages)

| item | (a) client→mock | (b) client sent | (b) upstream got | (c) client sent | (c) local→hub | (c) upstream got |
|---|---|---|---|---|---|---|
| hdr `authorization` | — | — | Bearer sk-ant… ➕ added | — | —  | Bearer sk-ant… ➕ added |
| hdr `x-api-key` | dummy-client-key-TRACE | ocx_<REDACTED> | — ❌ dropped | dummy-client-key-TRACE | ocx_<REDACTED> ✏️ changed | — ❌ dropped |
| hdr `user-agent` | claude-cli/2.1.283 (external, sdk-cli) | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | claude-cli/2.1.283 (external, sdk-cli) | @anthropic-ai/sdk/0.74.0 ✏️ changed | @anthropic-ai/sdk/0.74.0 ✏️ changed |
| hdr `x-client-request-id` | — | — | ba6aeebf-3338-430a-8549-099920032232 ➕ added | — | —  | 792bc4d2-bad3-43e1-9b97-a4f9d2baba38 ➕ added |
| hdr `anthropic-version` | 2023-06-01 | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 | 2023-06-01 ✅ kept | 2023-06-01 ✅ kept |
| hdr `anthropic-beta` | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | claude-code-20250219,oauth-2025-04-20 ✏️ changed | claude-code-20250219,interleaved-thinking-2025-05-14,thinkin… | — ❌ dropped | claude-code-20250219,oauth-2025-04-20 ✏️ changed |
| hdr `anthropic-dangerous-direct-browser-access` | true | true | — ❌ dropped | true | — ❌ dropped | — ❌ dropped |
| hdr `x-app` | cli | cli | cli ✅ kept | cli | — ❌ dropped | cli ✅ kept |
| hdr `x-claude-code-session-id` | 3d7af41a-3e79-483e-b425-c9017897d372 | 5de34196-1f1b-4255-9cb9-bc2101f606e8 | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed | 8470230b-8d9f-4751-9e30-a25c6c21004b | — ❌ dropped | 53a5196e-0b73-4999-99d8-4089e6e6191f ✏️ changed |
| hdr `x-stainless-*` | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed | arch=x64;lang=js;os=Linux;package-version=0.112.1;retry-coun… | — ❌ dropped | arch=x64;lang=js;os=linux;package-version=0.74.0;retry-count… ✏️ changed |
| hdr `accept` | application/json | application/json | text/event-stream ✏️ changed | application/json | text/event-stream ✏️ changed | text/event-stream ✏️ changed |
| hdr `accept-encoding` | gzip, deflate, br, zstd | gzip, deflate, br, zstd | identity ✏️ changed | gzip, deflate, br, zstd | identity ✏️ changed | identity ✏️ changed |
| hdr `content-type` | application/json | application/json | application/json ✅ kept | application/json | application/json ✅ kept | application/json ✅ kept |
| body `model` | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 | claude-sonnet-4-6 ✅ kept | claude-sonnet-4-6 ✅ kept |
| body `stream` | true | true | true ✅ kept | true | true ✅ kept | true ✅ kept |
| body `metadata` | {"user_id":"{\"device_id\":\"c192ceeef03addf4f0ff3ca4699a88b… | {"user_id":"{\"device_id\":\"7765931cf65059bec22bad20d45b95d… | — ❌ dropped | {"user_id":"{\"device_id\":\"2bbf5a6bc3ed8ad4b2161cfb8270bca… | — ❌ dropped | — ❌ dropped |
| body `metadata.user_id` | {"device_id":"c192ceeef03addf4f0ff3ca4699a88b07ffd1262e8c450… | {"device_id":"7765931cf65059bec22bad20d45b95d6a23243905e3c82… | — ❌ dropped | {"device_id":"2bbf5a6bc3ed8ad4b2161cfb8270bca33166e6b9916577… | — ❌ dropped | — ❌ dropped |
| body `thinking` | {"type":"adaptive","display":"omitted"} | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"adaptive","display":"omitted"} | {"type":"enabled","budget_tokens":16384} ✏️ changed | {"type":"enabled","budget_tokens":8192} ✏️ changed |
| body `context_management` | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | {"edits":[{"type":"clear_thinking_20251015","keep":"all"}]} | — ❌ dropped | — ❌ dropped |
| body `max_tokens` | 32000 | 32000 | 32000 ✅ kept | 32000 | 32000 ✅ kept | 32000 ✅ kept |
| body `output_config` | {"effort":"high"} | {"effort":"high"} | — ❌ dropped | {"effort":"high"} | — ❌ dropped | — ❌ dropped |
| body `system` | blocks(3) | blocks(3) | blocks(2) ✏️ changed | blocks(3) | blocks(1) ✏️ changed | blocks(2) ✏️ changed |
| probe `cache_control@` | system[1],system[2],messages[2].content[0] | system[1],system[2],messages[2].content[0] | system[1],messages[0].content[9],tools[23],top-level ✏️ changed | system[1],system[2],messages[2].content[0] | system[0],messages[0].content[9],messages[2].content[0],tool… ✏️ changed | system[1],messages[0].content[9],tools[23],top-level ✏️ changed |
| probe `tools(types)` | custom-def | custom-def | custom-def ✅ kept | custom-def | custom-def ✅ kept | custom-def ✅ kept |
| probe `tools(count)` | 24 | 24 | 24 ✅ kept | 24 | 24 ✅ kept | 24 ✅ kept |
| probe `messages[].thinking.signature` | SIG_TRACE_cc-2t-a-1 | SIG_TRACE_ccn-bridge-b-1 | SIG_TRACE_ccn-bridge-b-1 ✅ kept | SIG_TRACE_ccn-bridge-c-1 | SIG_TRACE_ccn-bridge-c-1 ✅ kept | SIG_TRACE_ccn-bridge-c-1 ✅ kept |
| probe `messages(count)` | 3 | 3 | 3 ✅ kept | 3 | 3 ✅ kept | 3 ✅ kept |
| body `cache_control` (other) | — | — | {"type":"ephemeral"} ➕ added | — | —  | {"type":"ephemeral"} ➕ added |

