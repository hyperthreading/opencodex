# ocx 2단 체이닝 헤더·메타데이터 보존 검증 (1단계, credential 없음)

> Unit layout: `kit/` in this directory corresponds to `$W` (`.tmp/chain-audit/`) below — `scripts/…` = `kit/scripts/…`, `report/…`, `captures/…`, `diffs/…` = `kit/report/…`. Companion: [`020_handoff.md`](./020_handoff.md) (= `HANDOFF.md`). Captures in `kit/report/captures/` are redacted/slimmed, see [`000_README.md`](./000_README.md).

- 대상: `lidge-jun/opencodex` **`93f4231e4b9314f746902b336e7a77762643eaf1`** (upstream `main` HEAD, v2.68.0, 2026-09-27)
- 클라이언트: `codex-cli 0.157.1` (`@openai/codex`), `Claude Code 2.1.283` (`@anthropic-ai/claude-code`). 둘 다 실제 바이너리를 비대화형으로 실행했습니다.
- 런타임: Bun 1.3.11, Linux 컨테이너. hub는 non-loopback `192.0.2.2`에 바인드했습니다.
- 결과 등급
  - **확인**: mock 업스트림 캡처로 확인
  - **네이티브 확인**: `chatgpt.com` / `api.anthropic.com` 요청을 fetch·WebSocket 가로채기로 mock에 보낸 캡처로 확인
  - **미검증**: 실제 업스트림이 받아주는지, 서버가 발급한 상태값이 유효한지 등
  - 소스 판독만으로 적은 내용은 **(소스)**로 표시했습니다.

## 결론 요약 (3줄)

1. **local → hub 구간에서 클라이언트 헤더는 하나도 살아남지 않습니다.** local의 `hub` 프로바이더는 키 인증 커스텀 프로바이더라서, 업스트림 헤더를 `Content-Type`, `Authorization: Bearer <hub 키>`, `User-Agent: Bun/…`로 새로 만듭니다. Codex의 `session-id`·`x-codex-*`·`originator`와 Claude의 `anthropic-beta`·`x-claude-code-session-id`·`x-stainless-*`가 모두 여기서 사라집니다. 이를 바꾸는 설정 키는 없습니다.
2. **바디는 대부분 보존됩니다.** Codex의 `client_metadata`(`x-codex-turn-metadata` 사본 포함), `prompt_cache_key`, `include`, `reasoning.encrypted_content` 왕복은 (b)와 (c) 모두 끝까지 도달했습니다. 예외는 다음과 같습니다.
   - native compaction(`compaction_trigger`, `/responses/compact`)은 local이 자체 요약 턴으로 바꿔 버립니다.
   - custom·namespace 도구가 function으로 평탄화됩니다.
   - Claude는 기본(번역) 경로에서 `metadata.user_id`, `context_management`, `output_config`, `cache_control` 위치를 잃습니다.
   - `managedMessagesNative`를 hub와 local 양쪽에서 켜면 `metadata.user_id`, `thinking`, `output_config`, `cache_control`은 보존됩니다. 다만 thinking 서명이 제거됩니다.
3. **보안:** 업스트림 캡처 181건 전체에서 ocx admission 비밀값 형태(`ocx_data_…`/`ocx_admin_…`/`ocx_session_…`) 검색 결과는 **0건**입니다. hub 키와 admin 토큰 원문도 0건입니다. ocx admission 키는 local → hub 구간에만 나타납니다(61건, 설계상 정상).

**판정: 토폴로지 (c)는 NO-GO, (b)는 조건부 GO.** 근거와 2단계 계획은 `HANDOFF.md` (`020_handoff.md`)에 있습니다.

---

## 1. 실제로 돌린 토폴로지

```
(a) client ──────────────────────────────────────────────▶ mock :10300
(b) client ─▶ tee:10400 ─▶ hub 192.0.2.2:10200 ─────────▶ mock   (canonical: fetch/WS 가로채기 → mock /__chatgpt, /__anthropic)
(c) client ─▶ tee:10400 ─▶ local 127.0.0.1:10100 ─▶ tee 192.0.2.2:10401 ─▶ hub ─▶ mock
```

- **tee 두 개(`scripts/ingress-tee.ts`)는 요청을 기록하는 투명 리버스 프록시입니다.** 요청마다 "클라이언트가 보낸 것", "local이 hub에 보낸 것", "hub가 업스트림에 보낸 것"을 같은 실행 안에서 직접 비교하려고 넣었습니다.
  - Host만 대상 주소로 바꾸고 hop-by-hop 헤더만 제거합니다. 나머지 헤더와 바디는 그대로 넘깁니다.
  - local 프로바이더의 `baseUrl`은 명세의 `http://<hub-ip>:<hub-port>/v1` 대신 `http://<hub-ip>:10401/v1`(tee)입니다. hub는 non-loopback 바인드에서 Host 검사를 하지 않으므로(`src/server/auth-cors.ts:97-104`) admission 경로는 동일합니다.
- **hub와 local 모두 `scripts/ocx-launcher.ts`로 기동했습니다.** 런처는 `globalThis.fetch`와 `WebSocket`을 먼저 패치한 뒤 `src/cli/index.ts start`를 import합니다. 실제 `ocx start` 경로 전체(서비스 토큰 로드, 플러그인 등)를 그대로 거칩니다.
- **ocx admission 키는 실제 CLI로 발급했습니다.** `ocx access key create` → `POST /api/keys`, 결과는 `ocx_data_…`입니다.
- **모든 클라이언트는 `scripts/hermetic.sh`로 실행했습니다.** 환경변수를 전부 비우고(`env -i`), 외부 egress는 죽은 프록시(`127.0.0.1:9`)로 돌렸습니다.
  - Codex의 `chatgpt.com/backend-api/plugins`와 `ps/mcp` 호출이 이 때문에 실패했습니다(로그에 남음).
- **자격증명은 모두 합성값입니다.**
  - canonical `openai`: 서명 없는 가짜 JWT(`alg:none`, account id claim 포함). 풀 계정은 `saveCodexAccountCredential`로, main 계정은 `$CODEX_HOME/auth.json`으로 넣었습니다.
  - canonical `anthropic`: 테스트와 같은 `saveCredential("anthropic", …)`로 합성 OAuth를 넣었습니다.
- **모델 셀렉터는 토폴로지마다 다릅니다.** hub는 bare `gpt-*`를 canonical `openai`에만 라우팅합니다(`src/router.ts:785-813`). 그래서 다음과 같이 썼습니다.
  - 커스텀 경로: 클라이언트 모델 `mock-oai/gpt-5.5`
  - canonical (c): `hub/gpt-5.5`
  - 이 셀렉터 prefix 제거는 표에서 `model` 변형으로 나타납니다.

**재현 방법:** `scripts/run-matrix.sh` 한 번으로 기동부터 정리까지 전체를 재실행합니다(약 3분). 최종 캡처는 이 스크립트를 처음부터 다시 돌린 결과입니다.

- 원본 캡처: `captures/<run>.jsonl`(업스트림), `<run>.ingress.jsonl`(클라이언트 송신), `<run>.mid.jsonl`(local → hub)
- 시나리오별 자동 diff 표: `diffs/*.md` (26개)
- 보안 스캔: `security-scan.txt`
- admission 음성 테스트: `admission-negatives.txt`

## 2. 항목 × (a/b/c) 표

### 2.1 Codex → Responses (HTTP/SSE, WS, compaction)

기호: ✅ 보존 / ✏️ 변형(전→후) / ❌ 삭제 / ➕ 추가.

- (b)와 (c)의 "커스텀"은 hub 최종 프로바이더가 `mock-oai`(openai-responses, 키 인증)인 경우입니다.
- "canonical"은 hub 최종 프로바이더가 `openai`(forward, pool/direct)인 경우입니다.
- (c)의 local → hub 구간은 모든 경우에 커스텀 키 인증 경로입니다.

| 항목 | (a) 클라이언트 원본 | (b) 커스텀 | (b) canonical | (c) local→hub 구간 | (c) 최종 (커스텀 / canonical) | 등급 |
|---|---|---|---|---|---|---|
| `authorization` | 클라이언트 키 또는 ChatGPT JWT | ✏️ hub 프로바이더 키 | ✏️ pool: 풀 계정 토큰 / direct: 클라이언트 JWT ✅ | ✏️ `Bearer ocx_data_…` | ✏️ 프로바이더 키 / pool 토큰 / **direct: hub main 토큰으로 대체** | 확인 / 네이티브 확인 |
| `chatgpt-account-id` | `acct-client` | ❌ | pool ✏️`acct-pool` / direct ✅ | ❌ | ❌ / ✏️ `acct-pool` 또는 `acct-hubmain` | 네이티브 확인 |
| `x-codex-turn-metadata` | JSON (request_kind, session_id, turn_id …) | ❌ | ✅ | ❌ | ❌ / ❌ | 확인 / 네이티브 확인 |
| `session-id`, `thread-id`, `x-client-request-id`, `x-codex-window-id`, `x-codex-beta-features` | 있음 | ❌ | ✅ | ❌ | ❌ / ❌ | 확인 / 네이티브 확인 |
| `session_id`, `x-codex-turn-state`, `x-codex-installation-id`, `x-codex-parent-thread-id`, `x-openai-subagent`, `openai-beta`, `x-oai-attestation`, `x-responsesapi-include-timing-metrics` (curl 프로브) | 있음 | ❌ | ✅ | ❌ | ❌ / ❌ | 확인 / 네이티브 확인 |
| `originator` | `codex_exec` | ❌ | ✅ | ❌ | ❌ / ❌ | 확인 |
| `user-agent` | `codex_exec/0.157.1 (…)` | ✏️ `Bun/1.3.11` | ✏️ `Bun/1.3.11` | ✏️ `Bun/1.3.11` | ✏️ `Bun/1.3.11` | 확인 |
| `version`, `conversation_id`, `x-openai-memgen-request`, `x-openai-internal-codex-residency` (프로브) | 있음 | ❌ | ❌ | ❌ | ❌ | 확인 |
| `x-codex-routing-hint` | 없음 | — | ➕ `model=gpt-5.5[;tier=…]` | — | — / ➕ | 네이티브 확인 |
| `accept` / `accept-encoding` | `text/event-stream` / 없음 | ✏️ `*/*` / ➕ `identity` | 동일 | 동일 | 동일 | 확인 |
| WS 핸드셰이크 `openai-beta: responses_websockets=…` | 있음 | ❌ (hub → mock은 HTTP) | ❌ (HTTP, 아래 참고) | ❌ (local → hub는 HTTP) | ❌ | 확인 |
| body `model` | `mock-oai/gpt-5.5` (canonical (c)는 `hub/gpt-5.5`) | ✏️ `gpt-5.5` | ✅ `gpt-5.5` | 커스텀 ✅ `mock-oai/gpt-5.5` 유지 / canonical ✏️ `hub/` 제거 | ✏️ `gpt-5.5` | 확인 |
| body `prompt_cache_key` | 세션 UUID | ✅ | ✅ | ✅ | ✅ / ✅ | 확인 / 네이티브 확인 |
| body `client_metadata` (`x-codex-turn-metadata`, session_id, turn_id 등 사본) | 있음 | ✅ | ✅ | ✅ | ✅ / ✅ | 확인 / 네이티브 확인 |
| body `store` | `false` (프로브 `true`) | ✅ | ✅ | ✅ | ✅ | 확인 |
| body `include: ["reasoning.encrypted_content"]` | 있음 | ✅ | ✅ | ✅ | ✅ | 확인 |
| body `reasoning`, `text.verbosity`, `parallel_tool_calls`, `tool_choice`, `instructions` | 있음 | ✅ | ✅ | ✅ | ✅ | 확인 |
| body `service_tier` (프로브) | `priority` | ✅ | ✅ | ✅ | ✅ | 확인 |
| body `metadata` (프로브) | 있음 | ✅ | ❌ | ✅ | ✅ / ❌ | 확인 |
| `input[].reasoning.encrypted_content` 왕복 (`ENC_TRACE_…`) | 2턴에 반송 | ✅ | ✅ | ✅ | ✅ / ✅ | 확인 (서버 유효성은 **미검증**) |
| `input[].id` (store=false) | 있음 | ❌ | ❌ | ❌ | ❌ | 확인 |
| `previous_response_id` (WS에서 Codex가 증분 전송) | `resp_TRACE_…` | ✏️ hub가 로컬 replay로 전체 input을 펼친 뒤 삭제 | 동일 | ✏️ local이 펼친 뒤 삭제 | 삭제 | 확인 |
| `previous_response_id` (HTTP, ocx가 모르는 id, 프로브) | 있음 | ✅ 그대로 전달 | ⛔ 400 `previous_response_not_found` | ✅ 전달 | ✅ / ⛔ 400 | 확인 |
| tools: `tool_search` | 있음 | ✏️ function으로 lowering | ✅ | ✏️ function | ✏️ | 확인 |
| tools: custom `exec`, `namespace` (ChatGPT 로그인 Codex) | custom / namespace | — | ✅ | ✏️ function / `clock__sleep` 평탄화 | ✏️ (ChatGPT가 평탄화된 도구를 받음) | 네이티브 확인 |
| tools: custom `apply_patch` (freeform), `web_search` | 있음 | ✅ | ✅ | ✅ | ✅ | 확인 |
| 인라인 compaction (`request_kind=compaction`, `implementation=responses`) | 일반 `/responses` 턴 | ✅ (메타데이터는 `client_metadata`로만 전달) | ✅ | ✅ | ✅ | 확인 / 네이티브 확인 |
| 원격 compaction v2 (`compaction_trigger` 아이템) | 있음 | ✏️ ocx 요약 프롬프트로 치환(`COMPACT_PROMPT`), `ocx1` blob 반환 | ✅ **네이티브 전달** | ✏️ local이 치환 | ✏️ / ✏️ **native compaction 상실** | 확인 / 네이티브 확인 |
| `POST /v1/responses/compact` | compact 엔드포인트 | ✏️ `/responses` 요약 턴으로 변환 | ✅ `/backend-api/codex/responses/compact` 네이티브 | ✏️ `/responses` 요약 턴 | ✏️ / ✏️ **ChatGPT가 받는 건 일반 턴** | 확인 / 네이티브 확인 |

**Responses WebSocket 표면.** 클라이언트 → ocx 구간의 WS는 hub와 local 모두 `websockets:true`에서 정상 동작했습니다. 업스트림으로는 항상 HTTP/SSE로 나갔습니다.

- 커스텀 프로바이더는 설계상 그렇습니다(`src/server/responses/ws-upstream.ts:119-149`).
- canonical은 Bun ≥ 1.4.0이 필요합니다(`MIN_BOUNDED_CODEX_WS_BUN_VERSION`, `ws-upstream.ts:30`). 이번 실행은 1.3.11이라 SSE로 폴백했습니다.
- 따라서 **chatgpt.com으로 가는 업스트림 WS 핸드셰이크는 미검증**입니다.
- Codex prewarm 프레임(`generate:false`)은 ocx가 자체 처리하며 업스트림으로 나가지 않습니다.

### 2.2 Claude Code → Messages

- (b)와 (c)는 hub 최종 프로바이더가 `mock-ant`(anthropic, 키 인증)인 경우입니다.
- 열 이름의 "번역"은 기본 브리지 경로, "native"는 `protocols.rollout.managedMessagesNative=true`입니다.
- (c)의 local → hub 구간은 local 프로바이더 `hub-ant`(anthropic, 키 인증)를 거칩니다.

| 항목 | (a) 원본 | (b) 번역 | (b) native(hub) | (c) 번역 / 번역 | (c) native(local) / 번역(hub) | (c) native / native | 등급 |
|---|---|---|---|---|---|---|---|
| `x-api-key` 또는 `authorization` | 클라이언트 키 | ✏️ hub 프로바이더 키 | ✏️ 동일 | ✏️ local → hub `ocx_…`, 최종 hub 키 | 동일 | 동일 | 확인 |
| `anthropic-version` | `2023-06-01` | ✅ (고정값 재설정) | ✅ | ✅ | ✅ | ✅ | 확인 |
| `anthropic-beta` | `claude-code-20250219,interleaved-thinking-2025-05-14,thinking-token-count-2026-05-13,context-management-2025-06-27,prompt-caching-scope-2026-01-05,effort-2025-11-24` | ❌ | ❌ (호환 호스트 allowlist가 비어 있음) | ❌ | ❌ | ❌ | 확인 |
| `x-claude-code-session-id` | UUID | ❌ | ❌ | ❌ | ❌ | ❌ | 확인 |
| `x-stainless-*` (8종), `x-app`, `anthropic-dangerous-direct-browser-access` | 있음 | ❌ | ❌ | ❌ | ❌ | ❌ | 확인 |
| `user-agent` | `claude-cli/2.1.283 (external, sdk-cli)` | ✏️ `@anthropic-ai/sdk/0.74.0` | ✏️ | ✏️ | ✏️ | ✏️ | 확인 |
| `accept` / `accept-encoding` | `application/json` / `gzip, …` | ✏️ `text/event-stream` / `identity` | 동일 | 동일 | 동일 | 동일 | 확인 |
| body `metadata.user_id` (device_id, session_id JSON) | 있음 | ❌ | ✅ | ❌ | ✅ local → hub, ❌ 최종 | ✅ | 확인 |
| body `thinking` | `{type:adaptive, display:omitted}` | ✏️ `{enabled, budget 16384}` | ✅ | ✏️ 16384 → **8192** (이중 번역 드리프트) | ✅ → ✏️ 16384 | ✅ | 확인 |
| body `output_config` | `{effort:"high"}` | ❌ | ✅ | ❌ | ✅ → ❌ | ✅ | 확인 |
| body `context_management` | `clear_thinking_20251015` | ❌ | ❌ | ❌ | ❌ | ❌ | 확인 |
| body `system` (블록 3개, `x-anthropic-billing-header: …` 텍스트 블록 포함) | blocks(3) | ✏️ 1블록으로 병합 | ✅ | ✏️ 1블록 | ✅ → ✏️ | ✅ | 확인 |
| `cache_control` 위치 | `system[1]`, `system[2]`, `messages[2].content[0]` | ✏️ ocx 자체 브레이크포인트(`system[0]`, 마지막 user, `tools[23]`) | ✅ | ✏️ | ✅ → ✏️ | ✅ | 확인 |
| `tools` (24개, 클라이언트 정의) | 있음 | ✅ | ✅ | ✅ | ✅ | ✅ | 확인 |
| `max_tokens`, `stream`, `model` | 32000 / true / `claude-sonnet-4-6` | ✅ | ✅ | ✅ | ✅ | ✅ | 확인 |
| assistant `thinking.signature` 반송 (`SIG_TRACE_…`) | 2턴에 반송 | ✅ | ❌ (필드 제거) | ✅ | local이 제거, hub 번역 경로가 thinking 블록 자체를 버림 | ❌ (서명 없는 thinking 블록 전송) | 확인 |

**표에 없는 조합: (c) local 번역 + hub native** (`diffs/cc-2t-natH.md`). local이 이미 번역하므로 `metadata.user_id`, `output_config`, `system` 블록 구조, `cache_control` 위치는 local에서 사라집니다. thinking은 `budget 16384`로 바뀌고, 서명은 local에서는 유지되지만 hub native lane(비-first-party)에서 제거됩니다. **확인**

**local `apiKeyTransport`.** `x-api-key`든 `bearer`든 결과는 같습니다. local → hub 구간이 `x-api-key: ocx_…` 또는 `Authorization: Bearer ocx_…`로 바뀔 뿐이고, 둘 다 hub가 admit합니다(`resolveApiAuth`, `auth-cors.ts:571-582`). 클라이언트가 (b)에 `ANTHROPIC_AUTH_TOKEN`(Bearer)으로 붙어도 동일합니다. **확인** (`diffs/cc-2t-bearer.md`)

**hub 최종 프로바이더가 canonical `anthropic` OAuth인 경우**(가로채기, `diffs/ccn-*.md`)

- 업스트림 헤더는 클라이언트 값이 아니라 **ocx가 합성**한 값입니다.
  - `authorization: Bearer <hub OAuth>`
  - `anthropic-beta: claude-code-20250219,oauth-2025-04-20`. hub native lane에서는 클라이언트가 보낸 `interleaved-thinking-2025-05-14`만 allowlist로 추가됩니다.
  - `x-app: cli`, `x-stainless-*` (package-version `0.74.0`)
  - `x-claude-code-session-id`: OAuth 토큰 해시에서 파생한 **고정값**(`src/adapters/client-fingerprint.ts:35-41`). 클라이언트 세션과 무관합니다.
  - `user-agent: @anthropic-ai/sdk/0.74.0`
  - system에 "You are a Claude agent, built on Anthropic's Claude Agent SDK." 블록이 앞에 붙고, 도구 이름에 `custom_` prefix가 붙습니다.
- **(c) 기준 hub native + local native**에서는 `metadata.user_id`, `thinking`, `output_config`, `cache_control`이 first-party까지 도달합니다. 하지만 thinking 서명이 local에서 이미 제거된 상태입니다. **네이티브 확인**
- 실제 API가 서명 없는 thinking 블록을 받아주는지는 **미검증**이고, 거부될 가능성이 높다고 봅니다.

**Claude passthrough lane(설계된 우회).** 클라이언트 자격증명이 `sk-ant-…`이면 local이 hub를 거치지 않고 `api.anthropic.com`으로 직행합니다. `sk-ant-api03-…`의 x-api-key와 `sk-ant-oat01-…`의 Bearer(Claude 로그인 형태) 둘 다 해당하고, 모델명이 `claude*`이면서 alias가 없을 때입니다(`src/server/claude-messages.ts:225-252`). **확인** (`cc-skant-c`, `cc-oat-c`: mid 캡처 0건, 업스트림 origin=anthropic)

- 이 lane에서는 모든 헤더와 바디가 보존됩니다. `x-opencodex-api-key`, `host`, `origin`, `accept-encoding`만 제거됩니다(`claude-messages.ts:206-210`).
- local에 `claudeCode.nativePassthrough=false`를 두면 hub로 갑니다. **확인** (`cc-skant-nopt-c`)
- hub도 `x-opencodex-api-key`와 `sk-ant-*` 조합이면 같은 lane으로 직행합니다. **확인** (`cc-skant-b`)

## 3. 손실·변형 원인 (file:line, 모두 SHA 93f4231e 기준) 및 설정 키

| # | 현상 | 원인 코드 | 관련 설정 키 |
|---|---|---|---|
| R1 | 키 인증 커스텀 openai-responses 프로바이더가 클라이언트 헤더를 **하나도** 전달하지 않음 (b-커스텀, c의 local→hub) | `src/adapters/openai-responses/passthrough.ts:242-251` (헤더 새로 구성). `FORWARD_HEADERS` 전달은 canonical forward에서만 함: `:205-236`, `mayForwardCallerCredentials = isCanonicalOpenAiForwardProvider(...)` | 없음. `headers`는 정적이며 `authorization`, `x-api-key`, `cookie`는 금지(`src/config/provider-validation.ts:19-27`). `authMode:"forward"`도 canonical이 아니면 헤더를 전달하지 않음(`:206-224`) |
| R2 | canonical도 `FORWARD_HEADERS` 18종만 전달. `version`, `conversation_id`, `x-openai-memgen-request`, residency 등은 삭제 | `passthrough.ts:64-83` (목록), `src/codex/auth-context.ts:1556-1560` (선별), WS: `src/server/index/serve-options.ts:590-596` | 없음 |
| R3 | `user-agent`가 모든 hop에서 `Bun/1.3.11`. 폴백 코드가 있으나 입력이 이미 선별된 상태라 동작하지 않음 | `auth-context.ts:1556-1560`에서 UA가 빠짐 → `passthrough.ts:86-93,255`의 폴백이 UA를 찾지 못함. 문서(`structure/transports/responses.md`, `docs-site/.../reference/adapters.md`)는 UA 보존을 주장함 **(소스)** | 프로바이더 `headers: {"User-Agent": …}`로 정적 지정만 가능 |
| R4 | canonical에서 `metadata`와 `max_output_tokens` 삭제 | `src/adapters/openai-responses/canonical-forward.ts:81-88` | 없음 |
| R5 | `x-codex-routing-hint` 추가 (canonical) | `passthrough.ts:511-521`, `src/codex/forward-transport-headers.ts:16-25` | 없음 |
| R6 | pool: `authorization`/`chatgpt-account-id`를 풀 계정으로 교체. direct+ocx bearer: hub main으로 교체 → **(c)에서 업스트림 신원이 클라이언트에서 hub 계정으로 바뀜** | `auth-context.ts:1561-1564` (pool), `:1578-1597` (main substitution), `src/server/responses/core-auth.ts:281-296` | `providers.openai.codexAccountMode: pool / direct` |
| R7 | 원격 compaction v2와 `/responses/compact`가 커스텀 경로에서 요약 턴으로 치환됨 → (c)에서 native compaction 상실 | `src/server/responses/compact.ts:1411-1438`, `passthrough.ts:117-133,445-447`, `src/responses/compaction.ts:25` (`COMPACT_PROMPT`). native compact 판정: `src/providers/openai-tiers-destination.ts:64-72` | `compactionRouting` (라우팅만 바꿈) |
| R8 | custom·tool_search·namespace 도구 lowering (비-canonical 목적지) | `passthrough.ts:391-413` | 프로바이더 `supportsResponsesCustomTools` (apply_patch만 예외 유지) |
| R9 | `previous_response_id`를 로컬 replay로 펼친 뒤 삭제. canonical은 모르는 id를 400으로 거부 | `src/server/responses/request-prepare.ts:276-282,1057-1066`, `passthrough.ts:264-270` | `statelessResponses` |
| R10 | store=false일 때 input item `id` 제거 | `src/adapters/openai-responses/request-strips.ts:199-237` | 없음 |
| R11 | model 셀렉터 prefix 제거 | `src/server/responses/core-normalize.ts:135-140` | — |
| R12 | Anthropic 어댑터(번역)가 클라이언트 헤더를 읽지 않음. 헤더를 고정값으로 재구성 | `src/adapters/anthropic.ts:533-547` (base 헤더, UA 고정), `:1197-1201` | `apiKeyTransport`, `headers` |
| R13 | 번역 경로 바디 손실: `system` 병합, `metadata`·`context_management`·`output_config` 삭제, thinking 재구성, ocx 자체 `cache_control` | `src/claude/inbound-content-options.ts:4-14` (system), `src/claude/inbound.ts:466-477` (`metadata.user_id` → `user` / `prompt_cache_key`, 어댑터가 미사용), `anthropic.ts:1096-1136` (thinking), `:113-178` (applyPromptCaching), `:387-393` (api.anthropic.com이면 top-level cache_control 추가) | `protocols.rollout.managedMessagesNative`, `cacheRetention` |
| R14 | native lane: 바디 필드 allowlist(`context_management` 제외), `anthropic-beta` allowlist(호환 호스트는 비어 있음, first-party는 `interleaved-thinking`만) | `src/adapters/anthropic/passthrough.ts:37-53,205-211`, `src/adapters/anthropic/beta-allowlist.ts:25-37` | 없음 |
| R15 | native lane: 비-first-party 목적지면 thinking 서명과 `redacted_thinking` 제거 → (c)에서 local이 서명을 잃음 | `src/protocols/opaque-state.ts:105-111` | 없음 |
| R16 | native lane 적용 조건: anthropic 어댑터만, OAuth는 `managedMessagesNativeOAuth` + `api.anthropic.com` + pool 비활성일 때만 | `src/server/messages-native-eligibility.ts:132-152` | `protocols.rollout.managedMessagesNative(OAuth)`, `anthropicAccountPool.enabled` |
| R17 | Claude `sk-ant-*` 자격증명이면 hub를 우회해 api.anthropic.com 직행 | `src/server/claude-messages.ts:225-252` | `claudeCode.nativePassthrough` (false로 차단), `claudeCode.anthropicBaseUrl` |
| R18 | canonical anthropic OAuth 헤더 합성 (세션 id 고정, stainless 0.74.0) | `src/adapters/client-fingerprint.ts:17-41`, `src/oauth/anthropic.ts:14` | 없음 |

손실이 **없는** 항목: `prompt_cache_key`, `client_metadata`, `include`, `reasoning`, `text.verbosity`, `store`, `service_tier`, `parallel_tool_calls`, `tool_choice`, `instructions`, `encrypted_content` 왕복(Codex 전 경로). `tools` 개수와 정의(Claude 전 경로).

## 4. 보안 불변식

`security-scan.txt` 전문 요약입니다(run-matrix 최종 실행).

- 업스트림 캡처 63파일 / 181레코드 (커밋된 kit으로 처음부터 다시 돌린 최종 실행)
  - admission 비밀값 형태 `ocx_(data|admin|session)_…`: **0**
  - (참고) 문맥 무관 `ocx_` 부분문자열도 0건입니다. 중간 실행 하나에서는 39건이 잡혔는데, 전부 Claude Code가 system prompt에 넣은 저장소 `git status` 출력 속 경로 문자열(당시 이 devlog 디렉터리명)이었고 자격증명이 아니었습니다. 그래서 불변식 기준을 비밀값 형태로 좁혔습니다.
  - hub 클라이언트 키 원문, hub admin 토큰, hub 서비스(data) 토큰, local admin 토큰: 모두 **0** **확인**
- local → hub(mid) 캡처의 admission 비밀값 형태: 61. 설계상 이 구간의 자격증명입니다.
- b/c 실행에서 클라이언트의 더미 키(`sk-client-dummy-TRACE`, `dummy-client-key-TRACE`)가 업스트림에 도달: **0**. 프로바이더, 풀, main 자격증명으로 치환됩니다.
- 업스트림에 도달한 클라이언트 자격증명은 두 경우뿐이며 둘 다 설계된 동작입니다.
  - Codex direct (b): 클라이언트 JWT와 `acct-client`
  - Claude passthrough lane: `sk-ant-*` (`cc-skant-b/c`, `cc-oat-c`)
  - 어느 경우에도 `x-opencodex-api-key`는 제거됐습니다.
- ocx 프로세스 로그(hub.log, local.log)의 admission 비밀값 형태: 0
- admission 음성 테스트(`admission-negatives.txt`, hub non-loopback)

  | 요청 | 결과 |
  |---|---|
  | `/v1/responses` 무인증 | 401 |
  | `/v1/responses` + `x-api-key: ocx_…` | **401** (Responses는 x-api-key를 받지 않음, `auth-cors.ts:610`) |
  | `/v1/responses` + `Bearer ocx_…` | 200 (#1686) |
  | `/v1/responses` + `x-opencodex-api-key` | 200 |
  | 모르는 `ocx_data_` 키 | 401 |
  | `/v1/messages` 무인증 | 401 |
  | `/v1/messages` + `x-api-key: ocx_…` | 200 |
  | `/api/keys`에 data 키 | 401 (관리 평면과 분리) |
  | Host 위조 (hub) | 200 (non-loopback은 Host 검사 없음, 설계) |
  | Host 위조 (loopback local) | 403 |

- **참고: 공식 문서와의 차이.** 공식 문서 표는 `/v1/responses`의 Bearer ocx 키 허용(#1686)을 반영하지 않았습니다. 실측으로는 허용됩니다(`auth-cors.ts:598-612`).

## 5. 부가 발견 (확인)

1. **direct 모드에서 (c)는 업스트림 신원을 바꿉니다.** 클라이언트가 ChatGPT로 로그인했어도 local → hub 구간에는 `ocx_` bearer만 가므로, hub가 **자기 main 계정 토큰으로 대체**합니다(`acct-hubmain-TRACE`). pool 모드에서는 (b)와 (c) 모두 풀 계정입니다.
2. **thinking 예산 드리프트.** Claude 번역 경로를 두 번 거치면 `adaptive(effort high)` → `budget_tokens 16384`(local) → `8192`(hub)가 됩니다.
3. **Codex 0.157의 compaction 방식은 두 가지입니다.**
   - 커스텀 프로바이더(API 키나 ChatGPT 로그인이어도 커스텀 provider id)는 **인라인** 방식입니다. 일반 `/responses` 턴에 `request_kind=compaction`을 붙입니다.
   - 내장 `openai` 프로바이더는 **원격 v2** 방식으로, WS 위에서 `compaction_trigger`와 `previous_response_id`를 씁니다.
   - `/v1/responses/compact`는 0.157이 스스로 호출하지 않아서 curl로 재현했습니다(`fixtures/compact-*`).
   - (c)와 커스텀 (b)에서는 v2 trigger를 ocx가 가로채 요약 턴으로 만들고 `ocx1:` blob을 돌려줍니다. 클라이언트는 다음 턴에 이 blob을 다시 보내며, ocx가 user text로 풀어서 전달합니다.
4. **내장 openai 프로바이더의 WS 턴 수.** (a)는 4요청, (b)/(c)는 3요청입니다. 차이는 mock이 돌려준 native `compaction` 아이템과 ocx의 `ocx1` 요약에 대한 Codex의 후속 동작 차이입니다. 스크립트 응답에 의존하므로 실업스트림 동작은 **미검증**입니다.

## 6. 실행 중 사고 기록

첫 Claude Code 탐색 실행(`probe-claude-a`)에서, 이 작업 컨테이너 자체의 환경변수가 자식 프로세스로 상속됐습니다. 그 결과 컨테이너 세션용 Anthropic OAuth 토큰이 **loopback mock**에 전송되어 로컬 캡처 파일 1개에 기록됐습니다.

- 네트워크 밖으로는 나가지 않았습니다(127.0.0.1:10300).
- 파일은 즉시 `shred -u`로 삭제했습니다.
- 이후 모든 클라이언트는 `env -i` 기반 `hermetic.sh`로만 실행했습니다.
- 작업 디렉터리 전체를 다시 검색해 실제 토큰과 환경 비밀값이 0건임을 확인했습니다.
- 2단계(집)에서도 클라이언트를 반드시 깨끗한 환경으로 실행하십시오.

## 7. 미검증 목록

`HANDOFF.md` (`020_handoff.md`) §4에 항목별 확인 방법과 함께 정리했습니다.
