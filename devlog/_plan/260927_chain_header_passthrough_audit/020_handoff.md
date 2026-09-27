# HANDOFF: ocx 2단 체이닝 검증, 2단계(집, 실제 OAuth)용

> Unit layout: `kit/` in this directory corresponds to `$W` (`.tmp/chain-audit/`) below. Companion: [`010_report.md`](./010_report.md) (= `REPORT.md`). §7: the committed captures are already redacted; the note applies to a fresh local re-run.

## 1. 판정

### 토폴로지 (c) client → local ocx → hub ocx → upstream: **NO-GO**

**local → hub 구간에서 헤더로 전달되는 클라이언트 메타데이터가 전부 사라집니다.** 설정으로 되돌릴 수 없습니다. 1단계 mock 캡처로 확인했습니다.

| 사라지는 것 | 원인 |
|---|---|
| Codex `session-id`/`session_id`, `thread-id`, `x-codex-turn-metadata`, `x-codex-window-id`, `x-codex-beta-features`, `x-codex-turn-state`, `x-codex-installation-id`, `x-codex-parent-thread-id`, `x-openai-subagent`, `originator`, `openai-beta`, `chatgpt-account-id`, 클라이언트 UA | `src/adapters/openai-responses/passthrough.ts:242-251`: 키 인증 프로바이더는 헤더를 새로 만듭니다. `FORWARD_HEADERS` 전달은 canonical `chatgpt.com` forward 행에만 있습니다(`:205-236`). |
| Claude `anthropic-beta`, `x-claude-code-session-id`, `x-stainless-*`, `x-app`, 클라이언트 UA | `src/adapters/anthropic.ts:533-547,1197-1201`, native lane `src/adapters/anthropic/passthrough.ts:205-211` + `beta-allowlist.ts:25-37` |
| Codex native compaction (`compaction_trigger`, `/responses/compact`). local이 요약 턴으로 치환 | `src/server/responses/compact.ts:1411-1438`, `passthrough.ts:445-447` |
| Claude `metadata.user_id`, `output_config`, `cache_control` 위치 (local 기본 번역 경로) | `src/claude/inbound.ts:466-477`, `src/claude/inbound-content-options.ts:4-14`, `anthropic.ts:113-178` |
| Claude thinking 서명 (local native lane은 비-first-party 목적지로 보냄) | `src/protocols/opaque-state.ts:105-111` |

**살아남는 것.** Codex 바디의 `client_metadata`(`x-codex-turn-metadata` 사본 포함), `prompt_cache_key`, `include`, `reasoning`, `text`, `service_tier`, `encrypted_content` 왕복입니다. `managedMessagesNative`를 hub와 local 모두 켜면 Claude 바디의 대부분도 살아남습니다.

추가 위험(확인): 이 구조에서는 **업스트림이 보는 신원이 바뀝니다.**

- canonical direct 모드: (c)에서는 hub main 계정으로 바뀝니다.
- canonical pool 모드: (c)에서는 풀 계정입니다.
- Claude Code가 `sk-ant-*` 자격증명을 쓰면 local이 **hub를 우회**합니다. OAuth 로그인 상태의 `sk-ant-oat01-…` bearer도 포함됩니다.

(c)를 살리려면 코드 변경이 필요합니다. 예를 들어 ocx 간 hop에 한해 `FORWARD_HEADERS`와 anthropic 헤더를 전달하는 provider opt-in, 그리고 compaction trigger 투과가 필요합니다. 이번 작업 범위 밖이라 패치 브랜치는 만들지 않았습니다.

### 토폴로지 (b) client → hub ocx → upstream: **조건부 GO**

canonical `openai` forward에서는 Codex 헤더 18종(`FORWARD_HEADERS`)과 바디, native compaction이 보존되는 것을 **네이티브 확인**했습니다. 문서가 설명하는 remote-hub 설계(클라이언트가 hub에 직접 접속)도 이 구조입니다. **2단계는 (b)를 주 대상으로 하고, (c)는 NO-GO 원인을 실제 환경에서 재확인하는 용도로만 돌리길 권합니다.**

## 2. 고정 버전

| 항목 | 값 |
|---|---|
| opencodex | `lidge-jun/opencodex` **`93f4231e4b9314f746902b336e7a77762643eaf1`** (main, v2.68.0). `stage2.sh`가 HEAD를 검사합니다. |
| Codex CLI | `codex-cli 0.157.1` (`npm i -g @openai/codex@0.157.1`) |
| Claude Code | `2.1.283` (`npm i -g @anthropic-ai/claude-code@2.1.283`) |
| Bun | 1.3.11 |

**Bun 버전 주의:** Bun ≥ 1.4.0이면 canonical 업스트림이 **WebSocket**으로 바뀝니다(`src/server/responses/ws-upstream.ts:30,119-149`). 1단계에서는 검증하지 못한 경로입니다. 둘 다 보고 싶으면 1.3.x와 1.4.x에서 각각 실행하십시오.

## 3. 토폴로지와 설정 (포트는 변수)

```
HUB_IP=<hub의 non-loopback IP>  HUB_PORT=10200  LOCAL_PORT=10100  MOCK_PORT=10300
TEE_PORT=10400 (클라이언트 → 첫 ocx 기록)   MID_PORT=10401 (local → hub 기록, HUB_IP에 바인드)
```

**hub** (`OPENCODEX_HOME=$W/hub`, `CODEX_HOME=$W/hub/codex-home`)

- 설정 값: `{"hostname":"$HUB_IP","port":$HUB_PORT,"runtimeRole":"hub","hub":{},"websockets":true, …}`
- data-plane 토큰: `OPENCODEX_API_AUTH_TOKEN=<openssl rand -hex 32>`. `$W/hub/.service-token`에 두고 런처가 주입합니다.
- 클라이언트 키: 첫 실행 때 `scripts/issue-hub-key.sh`가 `ocx access key create local-chain --json`(→ `POST /api/keys`)으로 `ocx_data_…`를 발급합니다. `hub/.client-key`와 `hub/.apikeys.json`에 저장하고, 설정 교체 후에도 유지합니다.
- 2단계 프로바이더(`stage2.sh`가 생성)
  - `openai`: `{adapter:"openai-responses", baseUrl:"https://chatgpt.com/backend-api/codex", authMode:"forward", codexAccountMode:"pool"|"direct"}`
  - `anthropic`: `{adapter:"anthropic", baseUrl:"https://api.anthropic.com", authMode:"oauth"}` + `anthropicAccountPool.enabled=false`
  - native 변형은 `protocols.rollout.managedMessagesNative=true`, `managedMessagesNativeOAuth=true`를 추가합니다.
- 실제 자격증명 넣기(한 번만, 클라이언트와 **다른** 계정 권장)
  ```bash
  export OPENCODEX_HOME=$W/hub CODEX_HOME=$W/hub/codex-home
  bun $REPO/src/cli/index.ts login codex        # pool 계정. 실행 중인 hub 필요: 먼저 stage2.sh openai-pool을 한 번 띄우거나 start-hub.sh 사용
  cp ~/.codex-hub-account/auth.json $W/hub/codex-home/auth.json   # direct 모드의 main 대체용 (hub 계정의 Codex 로그인)
  bun $REPO/src/cli/index.ts login anthropic    # Claude OAuth
  ```
  OAuth 코드나 토큰을 argv, 로그, 스크린샷에 남기지 마십시오(remote-hub 문서의 Headless OAuth 절차).

**local** (`OPENCODEX_HOME=$W/local`, `127.0.0.1:$LOCAL_PORT`, standalone)

- `hub`: `{adapter:"openai-responses", baseUrl:"http://$HUB_IP:$MID_PORT/v1", apiKey:"<ocx_data_…>", allowPrivateNetwork:true}`. tee를 빼려면 `$HUB_PORT`로 바꾸면 됩니다.
- `hub-ant`: `{adapter:"anthropic", baseUrl:"http://$HUB_IP:$MID_PORT", apiKey:"<ocx_data_…>", apiKeyTransport:"x-api-key"|"bearer", allowPrivateNetwork:true}`
- `allowPrivateNetwork`는 필수입니다. 192.0.2.x처럼 사설·예약 대역도 해당합니다(`src/lib/destination-policy.ts:63`).
- 변형 설정: `protocols.rollout.managedMessagesNative=true` (`local-ant-native.json`), `claudeCode.nativePassthrough=false` (`local-ant-nopt.json`)

**클라이언트 설정**

- Codex (`scripts/lib.sh` `codex_chatgpt_run`)
  - 임시 `CODEX_HOME`, `model_provider="chain"`, `base_url=http://127.0.0.1:$TEE_PORT/v1`, `requires_openai_auth=true`
  - (b)에는 `http_headers={"x-opencodex-api-key"="<ocx key>"}`를 둡니다. 클라이언트의 ChatGPT bearer와 admission이 분리됩니다.
  - 모델: (b)는 `gpt-5.5`, (c)는 `hub/gpt-5.5`. local이 bare `gpt-*`를 canonical로만 라우팅하기 때문입니다(`src/router.ts:785-813`).
- Claude Code
  - `ANTHROPIC_BASE_URL=http://127.0.0.1:$TEE_PORT`
  - `ANTHROPIC_API_KEY`: (b)는 ocx 키, (c)는 `sk-ant-`로 시작하지 않는 더미. `sk-ant-*`면 passthrough lane으로 hub를 우회합니다.
  - `--allowedTools "Bash(echo:*)"`

**모든 프로세스는 `scripts/hermetic.sh`로 실행합니다** (`env -i`, HOME 분리).

- 2단계는 `ALLOW_EGRESS=1`(`stage2.sh`가 설정)로 죽은 프록시를 해제합니다. 필요하면 `EGRESS_PROXY=<url>`을 지정합니다.
- **클라이언트를 셸 환경 그대로 실행하지 마십시오.** 1단계에서 상속된 세션 토큰이 mock으로 전송된 사고가 있었습니다(REPORT §6).

## 4. 미검증 항목과 확인 방법

| # | 항목 | 왜 미검증인가 | 2단계에서 확인하는 방법 |
|---|---|---|---|
| U1 | ChatGPT 백엔드가 ocx가 보낸 요청을 받아주는가: UA `Bun/…`, `x-codex-routing-hint` 추가, (c)에서 `session-id`/`originator`/`x-codex-turn-metadata` 헤더 없음 | mock은 무엇이든 수락함 | `stage2.sh openai-pool`. `s2-cxn-pool-2t-{b,c}.tee.jsonl`의 요청과 클라이언트 로그(`logs/client-s2-*.log`)의 성공/오류를 대조합니다. 4xx면 해당 레코드 헤더를 기록합니다. |
| U2 | 서버가 발급한 `reasoning.encrypted_content`가 hub를 거쳐 되돌아와도 유효한가 | mock 문자열은 검증 불가 | 2턴 도구 호출 케이스에서 2번째 요청이 "encrypted content could not be verified" 류 오류 없이 성공하는지 봅니다. pool 모드에서 계정이 도중에 바뀌면 ocx가 암호문을 제거합니다(`src/server/responses/account-change-state.ts:260`, `core-replay.ts:139-150`). `.tee.jsonl`의 `input[].encrypted_content` 유무를 확인합니다. |
| U3 | 프롬프트 캐시 적중: `prompt_cache_key`는 보존되지만 (c)에서 `session_id` 헤더가 없음 | 캐시는 실서버에만 있음 | 같은 대화를 3턴 이상 진행하고, 클라이언트가 받은 `response.completed.usage.input_tokens_details.cached_tokens`를 (b)와 (c)에서 비교합니다. ingress tee에 응답 본문은 없으므로 Codex 로그의 `tokens used`나 ocx 요청 로그를 봅니다. |
| U4 | native compaction v2 (`compaction_trigger`)와 `/responses/compact`를 실제로 받아주는가, (c)의 ocx 요약 대체 품질 | mock이 compaction 아이템을 만들어 냄 | `s2-cxn-trigger-*`, `s2-cxn-compact-*`(curl, `encrypted_content` 없는 fixture). (b)는 응답에 `type:"compaction"` 아이템이 있어야 하고, (c)는 ocx `ocx1:` 요약이 옵니다. 실제 Codex로 재현하려면 내장 `openai` 프로바이더와 ChatGPT 로그인이 필요한데, 이 조합은 hub를 base URL로 쓸 수 없습니다. 참고용으로만 보십시오. |
| U5 | canonical 업스트림 **WebSocket** 핸드셰이크 헤더, `response.create` 프레임의 `client_metadata` 접기 | Bun 1.3.11에서는 WS 미사용 | Bun ≥ 1.4.0에서 `stage2.sh openai-pool`을 실행합니다. 런처 tee가 `ws-handshake`와 `ws-frame`(send)을 기록합니다. `openai-beta`에 `responses_websockets=2026-02-06`, `x-codex-turn-metadata`가 있는지 봅니다(`src/server/responses/codex-ws-request.ts:27-86`). |
| U6 | direct 모드의 신원 전환: (b)는 클라이언트 계정, (c)는 hub main 계정 | 합성 JWT로만 확인 | `s2-cxn-direct-2t-{b,c}.tee.jsonl`의 `chatgpt-account-id`, 그리고 ChatGPT 사용량 화면에서 어느 계정이 차감됐는지 확인합니다. |
| U7 | Anthropic OAuth 번역·native 경로를 실제 API가 받아주는가: 합성 헤더(`x-claude-code-session-id` 해시값, stainless 0.74.0), identity system 블록, `custom_` 도구 prefix, 번역 경로의 `thinking.budget_tokens` | mock은 무엇이든 수락함 | `stage2.sh anthropic anthropic-native`. 클라이언트 로그의 성공/오류, `.tee.jsonl` 헤더와 바디를 확인합니다. |
| U8 | **서명 없는 thinking 블록**: (c) local native, hub native → first-party | local이 서명을 제거함(`opaque-state.ts:105-111`) | `s2-ccn-nativeHL-c`. 2번째 요청(도구 결과 포함)이 400이면 확정입니다. 400이 아니면 Anthropic이 서명 없는 블록을 허용한다는 뜻이니 기록합니다. |
| U9 | `anthropic-beta` 삭제의 영향: `context-management-2025-06-27`, `effort-2025-11-24`, `prompt-caching-scope-2026-01-05`, `thinking-token-count-2026-05-13` | mock은 beta를 해석하지 않음 | (b) native의 `output_config.effort`가 beta 없이 받아들여지는지(400 여부)를 봅니다. `cache_read_input_tokens`는 U3과 같은 방식으로 봅니다. |
| U10 | Claude Code를 **OAuth 로그인** 상태로 쓸 때의 헤더 집합 | 1단계는 API 키 모드만 봄 | 로그인한 Claude Code로 (b)를 실행하면 bearer `sk-ant-oat…`이 되어 passthrough lane을 탑니다. `x-opencodex-api-key`를 쓰려면 `ANTHROPIC_CUSTOM_HEADERS`로 넣습니다. ingress tee(`TEE_REDACT=1`)에서 `anthropic-beta`와 `x-claude-code-session-id` 차이를 기록합니다. |
| U11 | 로그인한 Codex의 헤더 집합 (`chatgpt-account-id` 형식, `x-codex-*` 추가분, `/backend-api/codex/models` 호출) | 1단계는 가짜 JWT | `CODEX_AUTH_JSON=~/.codex/auth.json`으로 실행한 뒤 `s2-*.ingress.jsonl` 헤더 키 목록을 §6 목록과 비교합니다. |
| U12 | 실제 계정의 모델 가용성 (`gpt-5.5`, `claude-sonnet-4-6`) | mock은 모든 모델을 수락함 | `MODEL_OAI` / `MODEL_ANT` 환경변수로 바꿉니다. |

## 5. 재사용할 스크립트 (`$W/scripts/`)

| 파일 | 역할 |
|---|---|
| `run-matrix.sh` (`report/run-matrix.sh`는 진입점) | 1단계 전체 재실행. mock, 합성 자격증명, 기동부터 정리까지 |
| `stage2.sh` | **2단계.** 실제 OAuth, hub 런처 tee 모드, 캡처 자격증명 마스킹. `STAGE2_REHEARSAL=1`이면 같은 흐름을 오프라인 mock으로 리허설합니다(이 컨테이너에서 통과 확인). |
| `ocx-launcher.ts` | fetch와 WebSocket 패치 후 `src/cli/index.ts start` import |
| `ingress-tee.ts` | 투명 기록 프록시 (클라이언트 → ocx, local → hub). `TEE_REDACT=1`이면 자격증명을 마스킹합니다. |
| `mock-upstream.ts` | 1단계 mock. `/v1/responses`, `/responses/compact`, `/v1/messages`, `/models`, WS |
| `lib.sh` | `set_run`, `restart_hub`/`restart_local`, `codex_run`, `codex_oa_run`, `codex_chatgpt_run`, `claude_run`, `curl_run` |
| `diff-captures.ts` | ingress / mid / egress 비교 표. `EGRESS_SUFFIX=.tee`, `BASELINE_SUFFIX=.ingress` 지원 |
| `security-scan.sh` | `ocx_`와 토큰 원문 스캔 (값은 출력하지 않음) |
| `issue-hub-key.sh`, `seed-hub-codex.ts`, `seed-hub-anthropic.ts`, `fake-jwt.ts` | 키 발급, 합성 자격증명 (1단계와 리허설 전용) |
| `hub-*.json`, `local-*.json` | 설정 템플릿. `render()`가 IP와 포트를 치환합니다. |

### 런처를 "mock 리다이렉트"에서 "기록 후 원래 fetch로 전달(tee)"로 바꾸는 방법

이미 구현했고 리허설에서 동작을 확인했습니다. 기존 코드와 달라지는 점은 다음뿐입니다.

```bash
LAUNCH_MODE=tee                      # redirect(기본) → tee
TEE_CAPTURE_DIR=$W/report/captures   # <run>.tee.jsonl 로 기록 (mock 캡처와 같은 스키마)
TEE_RUN_FILE=$W/report/captures/.current-run   # lib.sh set_run 이 run 이름을 기록
TEE_REDACT=1                         # 기본값. authorization / x-api-key / x-opencodex-api-key / cookie → "앞 12자…<sha256:12>"
# 필요 시 TEE_HOSTS=chatgpt.com,api.anthropic.com  (기본 목록에 auth.openai.com 등 포함)
scripts/start-hub.sh <cfg.json> tee  # start-hub.sh 가 위 변수를 모두 넘깁니다
```

- **구현:** `ocx-launcher.ts`의 tee 분기는 먼저 `teeWrite()`로 method, path, 헤더(마스킹), JSON 바디를 기록합니다. 그다음 `realFetch(input, init)`를 **원래 인자 그대로** 호출합니다. WebSocket은 핸드셰이크 헤더를 기록하고, 생성된 소켓의 `send`를 감싸 송신 프레임도 기록합니다.
- **한계:** tee는 ocx가 `fetch`에 넘긴 헤더만 봅니다. Bun이 전송 시 자동으로 붙이는 기본값(`User-Agent: Bun/…`, `Accept: */*`, `Host`, `Content-Length`)은 레코드에 없습니다. 1단계 mock 캡처에서 이 값들이 실제로 전송됨을 확인했습니다.
- **(c)의 local:** local은 hub로만 나가므로 tee가 필요 없고, mid tee가 그 구간을 기록합니다.

## 6. 클라우드에서 관찰한 클라이언트 헤더 (로그인하지 않은 상태 기준)

실제 계정 로그인 상태가 아닙니다. Codex는 API 키 또는 **가짜 JWT** 로그인 형태, Claude Code는 **API 키 모드**입니다. 실제 로그인 상태에서는 달라질 수 있습니다(U10, U11).

- **Codex 0.157.1, 커스텀 프로바이더, HTTP `POST /v1/responses`:** `accept: text/event-stream`, `authorization`, `content-type`, `originator: codex_exec`, `session-id`, `thread-id`, `user-agent: codex_exec/0.157.1 (Ubuntu 24.4.0; x86_64) dumb (codex_exec; 0.157.1)`, `x-client-request-id`, `x-codex-beta-features: remote_compaction_v2`, `x-codex-turn-metadata`, `x-codex-window-id`
  - `session-id`는 하이픈 표기이며, 밑줄 `session_id` 헤더는 없었습니다.
  - `x-codex-turn-metadata` 키: `agent_name, analytics_enabled, auto_review_enabled, context_window_id, installation_id, model, node_repl_auto_review_required, node_repl_disabled, reasoning_effort, request_kind, root_turn_id, sandbox, sandbox_mode, session_id, thread_id, thread_source, turn_id, turn_started_at_unix_ms, turn_trigger, window_id, window_number, workspaces`. compaction 턴에서는 `request_kind:"compaction"`과 `compaction:{trigger, reason, implementation, phase, strategy}`가 붙습니다.
  - 바디에는 `client_metadata`가 들어갑니다(`x-codex-turn-metadata` JSON 사본, `session_id`, `thread_id`, `turn_id`, `root_turn_id`, `x-codex-installation-id`, `x-codex-window-id`).
- **Codex WS 핸드셰이크** (`supports_websockets=true`): 위 헤더에서 `accept`와 `content-type`을 빼고 `openai-beta: responses_websockets=2026-02-06`과 `sec-websocket-*`를 더합니다. 첫 프레임은 `generate:false` prewarm이고, 이후 `previous_response_id`로 증분 전송합니다.
- **Codex 내장 `openai` 프로바이더 (API 키):** WS 기본이며 위 헤더에 `version`이 추가됩니다.
- **Codex ChatGPT 로그인 형태 (가짜 JWT):** 위 헤더에 `chatgpt-account-id`가 추가됩니다. `GET <base>/models`(`accept, authorization, chatgpt-account-id, originator, user-agent`)도 호출합니다. 도구 셋이 달라집니다(custom `exec`, `namespace` `clock`).
- **Codex 바이너리 문자열에만 있고 이번 실행에서는 보지 못한 헤더:** `x-codex-turn-state`, `x-codex-installation-id`, `x-codex-parent-thread-id`, `x-openai-subagent`, `x-oai-attestation`, `x-codex-routing-hint`, `x-responsesapi-include-timing-metrics`, `x-openai-internal-codex-responses-lite`, `x-openai-memgen-request`, `x-openai-internal-codex-residency`, `x-openai-account-routing-override`, `x-openai-actor-authorization`, `x-codex-ws-stream-request-start-ms`. 이 중 일부는 curl 프로브(`fixtures/codex-extra-headers.txt`)로 경로만 시험했습니다.
- **Claude Code 2.1.283 (API 키), `POST /v1/messages`:** `accept: application/json`, `accept-encoding: gzip, deflate, br, zstd`, `anthropic-beta: claude-code-20250219,interleaved-thinking-2025-05-14,thinking-token-count-2026-05-13,context-management-2025-06-27,prompt-caching-scope-2026-01-05,effort-2025-11-24`, `anthropic-dangerous-direct-browser-access: true`, `anthropic-version: 2023-06-01`, `content-type`, `user-agent: claude-cli/2.1.283 (external, sdk-cli)`, `x-api-key`, `x-app: cli`, `x-claude-code-session-id`, `x-stainless-{arch=x64, lang=js, os=Linux, package-version=0.112.1, retry-count=0, runtime=node, runtime-version=v26.3.0, timeout=600}`
  - 바디: `metadata.user_id` (`{"device_id","account_uuid","session_id"}` JSON 문자열), `thinking:{type:"adaptive",display:"omitted"}`, `output_config:{effort:"high"}`, `context_management:{edits:[{type:"clear_thinking_20251015",keep:"all"}]}`
  - system 3블록 중 첫 블록이 `x-anthropic-billing-header: cc_version=…` 텍스트입니다. `cache_control`은 `system[1]`, `system[2]`, 마지막 user 블록에 있습니다.
  - `-p` 모드에서는 `count_tokens` 호출이 없었습니다.

## 7. 캡처 취급

`report/captures/*.ingress.jsonl`과 `*.mid.jsonl`에는 이 일회용 hub 인스턴스의 `ocx_data_…` 키가 **원문으로** 들어 있습니다(1단계는 마스킹하지 않음). 다른 비밀값은 합성값입니다. 공유하기 전에 삭제하거나 hub 홈을 폐기하십시오. 2단계는 기본으로 마스킹합니다.
