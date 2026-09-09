# Claude ToolSearch 지연로딩 브리지 — 구현 계획

- 기준: `010_proposal.md` (PROPOSED, 조사 기준 `9a27e86992d7a014e0aa92c046199b9fac148201`)
- 제안서 원본 경로:
  `/Users/jun/workspace/opencodex/.delta/worktrees/9mbxn0b5e8gn/opencodex/devlog/_plan/260909_claude_tool_search_bridge/010_proposal.md`
  (이 worktree에는 없음. `010_proposal.md`와 관련 제안 `260909_claude_context_projection/010_proposal.md`는 해당 worktree에서 참조)
- 현재 worktree 커밋: `9a27e8699` (제안서 조사 기준과 동일)
- 상태: **계획만 수립, 미구현**
- 민감정보: 조사 과정에서 비밀·개인정보를 다루지 않았음 (P0 실측 시에도 원본 요청·도구 설명을 저장소에 남기지 않고 합성 fixture만 사용)
- 범위: Claude Code의 Anthropic Messages 요청을 Responses로 번역해 Codex Auth provider로 보내는 경로

## 0. 목표 / 비목표

- 목표: 검색 전에는 deferred 도구 전체 스키마를 모델 컨텍스트에 노출하지 않고,
  검색 후 선택된 도구만 호출 가능하게 활성화한다.
- 비목표:
  - `ENABLE_TOOL_SEARCH=true` 강제나 미지원 표시 해제로 끝내기 (선언-호출-결과-다음턴 활성집합을 함께 연결해야 함).
  - 별도 검색엔진·세션 레지스트리·전역캐시 추가 금지. 현재 요청 선언 + 재생 이력으로 재구성 우선.
  - 서버실행형(`tool_search_tool_regex`/`bm25`)을 동일 기능으로 간주 금지. 첫 범위는 클라이언트 실행형만.
  - native Anthropic passthrough 변경 금지.
  - 장문 컨텍스트(`[1m]`) 확대를 대안으로 삼지 않음.
- 완료 기준은 검색 호출 성공이 아니라 **전송 직전 body의 도구 정의 감소**다.

## 1. 사전 확인 (P0, 코드 건드리기 전)

제안서 §7의 남은 결정:

1. 사용 중인 Claude Code 버전·실행경로 확인: `claude` 직접실행 + auto connect에서 실제 선언 캡처.
   - 도구 선언에 `defer_loading`/`defer`가 있는가, 검색 도구의 `type`은 무엇인가
     (client function vs `tool_search_tool_*`).
   - 모델의 검색 호출이 `tool_use`로 오는가, `server_tool_use`로 오는가.
   - 결과 블록이 `tool_result > tool_reference`인가, `tool_search_tool_result`인가.
   - 외부 gateway beta/실험 설정이 필요한가.
   - 원본 요청·도구 설명은 저장소에 남기지 않고 합성 fixture로 재작성.
2. Codex Auth upstream 표현 결정:
   - native deferred(`defer_loading` 유지) vs 활성도구만 투영 중 어느 쪽이
     호출 정확성·토큰절약·이력재생을 만족하는가.
   - `src/adapters/openai-responses.ts`의 `mergeLoadedTools`/`promoteClientLoadedTools`를
     재사용할지, Claude 전용 활성화로 둘지. 첫 wire fixture로 결정, 이름만 치환 금지.
3. `ocx claude` 기존 동작 유지 확인.

## 2. 설계

요청별 계산 (제안서 §4):

```text
선언 + 대화이력 → 기본활성/deferred 분류 → 유효 검색결과 매칭 → upstream 노출 집합
```

- 첫 요청: 기본활성 + 검색도구만 노출. 미발견 deferred 전체 스키마 제외.
- 검색 호출: 스키마·호출ID 보존해서 Claude Code가 실행 가능한 `tool_use`로 반환.
  검색도구 이름으로 의미 추측 금지, 일반도구와 이름 충돌 시 오인 금지.
- 다음 요청: `tool_result` 내 `tool_reference`를 현재 선언과 매칭.
  reference를 정의로 취급하거나 임의 스키마 생성 금지. 발견된 것만 활성화.
- 참조없음·중복·미존재참조·선언변경·compact/resume(검색이력 소실 시 재검색 vs 복원) 동작 명시.
  정보가 없다고 전체 deferred를 풀지 않음.
- SSE/buffered JSON에서 이름·인자·ID·종료의미 동일 유지. 호출/결과 pairing 유지.
- 호환성 검사는 구현한 형태만 허용. 기능코드 일괄 뒤집기 금지.

## 3. 파일별 변경 예상

| 파일 | 변경 |
| --- | --- |
| `src/claude/inbound-content-options.ts` (`toolsToResponses`) | `defer_loading` 전달. 검색도구 식별(타입+이름 동시 확인). hosted 선언은 별도 처리, 일반 function과 혼동 금지 |
| `src/claude/inbound.ts` (`toolResultOutput`, history 변환) | `tool_reference` 파싱 + 선언 매칭 + 활성집합 계산. `tool_search_tool_result`(hosted)가 섞이면 분리 |
| `src/claude/outbound.ts` (`function_call` 역변환) | 검색 호출 왕복 확인. 필요 시 `tool_search_call` 정규화 여부 결정 (P0 fixture 결과에 따름) |
| `src/claude/compatibility.ts` | 현재 `tool_search`/`tool_reference`/`deferred_tools=true`인 거부 정책을 client-executed 허용 / hosted 거부로 세분화. shadow/enforce가 실제 번역능력과 일치하는지 맞춤 |
| `src/adapters/openai-responses.ts` (`activateDeferredTool`/`mergeLoadedTools`) | 순수규칙만 재사용. Codex Auth native vs routed 투영 분기 |
| `src/server/claude-messages.ts` | 번역경계 유지, 새 전송경로 추가 금지. translate-and-replay 상속 유지 |

주의:

- `compatibility.ts`는 이미 `tool_search`/`tool_reference`/`defer_loading`/`defer_tools`
  감지를 구분하고 있어 정책 세분화 기반이 있다.
- `openai-responses.ts`의 Spark 호환층은 `defer_loading` 제거·`tool_search_call/output` 제거를
  하므로, Claude 경로 변경이 Spark 경로와 충돌하지 않게 분리 확인 필요.
- `src/router.ts`, `src/server/lifecycle.ts`, `src/server/responses/core.ts`는 Lab 경계 파일이다.
  이번 변경에서 `src/lab/`으로의 신규 의존을 만들지 않는다
  (`tests/lab/core-lab-boundary.test.ts` 강제).

## 4. 테스트 계획

기존 focused 확장 (새 파일 필요 시 test-layout 등록:
`scripts/test-layout/layout.json` + `tests/fixtures/test-layout-expected.json`):

- `tests/claude-integration/claude-inbound.test.ts` — 선언 변환, reference 매칭
- `tests/claude-integration/claude-outbound.test.ts` — 검색호출 왕복
- `tests/claude-integration/claude-compatibility.test.ts` — client 허용 / hosted 거부 분리
- `tests/claude-integration/claude-messages-endpoint.test.ts` — enforce/shadow + 전송직전 body 검사
- `tests/responses/openai-responses-passthrough.test.ts`, `responses-tool-search-repair.test.ts` — 활성화 규칙 재사용분

시나리오 (제안서 §6): 첫요청 제외확인, 1개 검색→1개 활성화·실호출, 빈/중복결과 안정성,
이름충돌, 후속턴·다중검색·선언변경, compact/resume, SSE/JSON·병렬·취소·오류,
native/검색없음 회귀.

측정: 동일 합성 도구목록으로 전체로딩 vs 지연로딩 비교.
전송 body 스키마집합 + 가능하면 upstream 입력토큰.
byte 감소만으로 확정하지 않고 검색왕복·prompt cache 영향 별도 기록.

실행:

```bash
bun test tests/claude-integration/claude-inbound.test.ts
bun test tests/claude-integration/claude-compatibility.test.ts
bun test tests/claude-integration/claude-messages-endpoint.test.ts
bun run typecheck
bun run test:changed
```

PR ready 전에만 전체 `bun run test`. `privacy:scan`은 로그에 도구설명이 들어가지 않는지 확인용.

## 5. 순서

1. P0 계약 fixture (요청 2~3턴 합성) — 정규화 방향 결정.
2. P1 번역+활성화 (inbound 중심).
3. P2 호환성정책 연결.
4. P3 실사용 검증(`claude` + auto connect, 검색→실행→후속턴) + 문서 반영.

다음 입력 필요: 실제 Claude Code 버전과 캡처한 선언/반환 형태(민감정보 제외).
둘 중 무엇을 먼저 확보할지 정하면 P0 fixture부터 시작한다.

## 부록 A. 조사 메모 (계획 수립 시 확인한 현황)

제안서 §2의 표를 이 worktree 코드에서 재확인한 결과. 상세는 제안서 원본 참조, 아래는 다음 작업자가 바로 찾을 수 있는 위치다.

- `src/server/claude-messages.ts` — Anthropic 요청을 Responses로 번역 후 내부 `handleResponses`로
  재실행하는 translate-and-replay 경계. 새 전송경로보다 번역경계 보완이 우선.
- `src/claude/inbound-content-options.ts` (`toolsToResponses`, L16-43) — `input_schema`가 있는
  도구를 function으로 바꾸면서 `defer_loading`을 옮기지 않음. deferred 도구도 일반 활성 도구처럼 전달됨.
- `src/claude/inbound.ts` (`toolResultOutput`, L43-67) — text/image/document만 처리하고
  `tool_reference`는 처리하지 않음. 검색 결과가 도구 활성화로 이어지지 않음.
- `src/claude/compatibility.ts` — `tool_search`/`tool_reference`/`deferred_tools` 플래그가 `true`
 (= 미지원 → enforce 거부, shadow 관찰). client function 이름과 hosted 선언을 구분하는 탐지
  (`tool_search_tool_*` 정규식, `server_tool_use` 이름 분기) 기반이 이미 있음.
- `src/claude/outbound.ts` — `function_call` → `tool_use` 역변환(L848-862),
  `web_search_call` → `server_tool_use` + 결과 pair(L863-870). 검색 호출 왕복 설계 시 참조.
- `src/adapters/openai-responses.ts` — `activateDeferredTool`/`mergeLoadedTools`/
  `promoteClientLoadedTools`(L755-859, 재사용 후보), Spark 호환층의 `defer_loading` 제거·
  `tool_search_call/output` 제거(L488~). Claude 경로 변경이 Spark 경로와 충돌하지 않게 분리 확인 필요.
- Responses 측 관련 장치 (P0/P1에서 상호작용 확인 필요, 이번 조사에서는 목록까지만 파악):
  `src/responses/tool-search-compat.ts`, `src/server/responses-tool-search-repair.ts`,
  `src/responses/parser-tools.ts`, `src/bridge.ts`의 `tool_search_call` 중계,
  `src/server/responses-undeclared-tool-guard.ts`.
- 기존 테스트 (동작 변경 시 함께 갱신): `tests/claude-integration/claude-compatibility.test.ts`
  (거부/허용 매트릭스), `claude-messages-endpoint.test.ts` L1391-1452의 enforce 균일성 테스트.

## 부록 B. 인수인계 (다음 작업자가 읽어야 할 것)

- 제안서 원본(상단 경로)과 관련 제안 `260909_claude_context_projection/010_proposal.md`
  (장문 컨텍스트 확대 — 독립 작업이며 대안이 아님).
- `AGENTS.md`: focused 테스트 우선 (`bun test tests/<domain>/<name>.test.ts`),
  새 테스트 파일은 `layout.json` + `test-layout-expected.json` 등록,
  PR ready 전 `bun run typecheck` + `bun run test`.
- 공유 서브시스템을 건드리면 `structure/`의 maintainer invariant를 먼저 읽는다.
- Suggested skills: 이번 세션에서 스킬 카탈로그를 조회하지 않아 지명할 스킬 없음.
  다음 에이전트가 스킬 목록에서 ToolSearch/Claude 관련 스킬이 있으면 그때 적용하고,
  없으면 본 계획과 제안서만으로 진행한다.
