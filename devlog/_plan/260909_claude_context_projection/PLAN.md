# Claude 장문 Context Projection 수정 계획

- 원 제안: `010_proposal.md` (상태 PROPOSED, 조사 기준 `9a27e86992d7a014e0aa92c046199b9fac148201`)
- 관련 제안: ToolSearch 지연 로딩 브리지 `010_proposal.md` (배경만 참조, 내용 중복 없음)
- 작성일: 2026-09-09
- 상태: **PLAN — 미구현 (문서만 작성, 코드·테스트·typecheck 미실행)**
- 목표: Claude Code가 선택 모델의 장문 컨텍스트를 활용하면서 실제 upstream 한도 전에
  압축하도록, 모델 선택 정보와 압축 설정을 일치시킨다. `[1m]` 문자열 추가 자체가 목표가 아니다.

## 작업 컨텍스트 (다음 작업자용)

- 현재 브랜치: `fix/claude-dispaly-sub-1m-models`. 작업 트리 상태 clean
  (본 PLAN.md 디렉터리만 untracked, 코드 변경 없음).
- 원 제안서는 **이 워크트리에 없음**. 절대경로로 열람할 것:
  - `/Users/jun/workspace/opencodex/.delta/worktrees/9mbxn0b5e8gn/opencodex/devlog/_plan/260909_claude_context_projection/010_proposal.md`
  - 관련 제안: `/Users/jun/workspace/opencodex/.delta/worktrees/9mbxn0b5e8gn/opencodex/devlog/_plan/260909_claude_tool_search_bridge/010_proposal.md`
- 배경 설명은 원 제안서에 있고 본 파일에 중복하지 않는다. 아래는 실행에 필요한
  계약·순서·검증·미결정만 담는다.
- 민감정보: 본 계획 수립 과정에서 API 키·자격증명·개인정보를 다루지 않음.

## 0. 동작 계약 (구현 전제)

- `H` = 실제 유효 한도. canonical 메타데이터 + 사용자 설정(cap/override) 적용 후
  context 한도와 알려진 input 한도 중 작은 값.
- `B` = OpenCodex 압축 예산. 기본 `floor(H × 0.9)`, 기존 모델별 예산·사용자 설정은
  더 낮을 때만 반영. 항상 `B < H` 유지.
- `T` = 해당 Claude Code 실행에 실제 적용되는 **공통**
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 값 하나. 모델별로 `T = B`를 다시 계산하지 않는다.
- sub-1M `[1m]` 추가는 아래 4조건을 **모두** 만족할 때만:
  1. `H`를 신뢰할 수 있는 메타데이터로 알 수 있고 `200,000 < H < 1,000,000`.
  2. Claude Code 자동 압축이 켜져 있고 해당 실행에 `T`를 적용하는 경로가 확인됨.
  3. `200,000 < T ≤ B < H`.
  4. native Anthropic passthrough 등 upstream 기능 선택까지 바꾸는 경로가 아님.
- `[1m]`은 클라이언트 계산용 호환 표식. wire 모델 ID·`max_input_tokens`·표시명의
  실제 한도는 바꾸지 않는다. 압축 주체는 Claude Code이며, Codex endpoint 자동 압축이나
  별도 compact API는 본 계획에 포함하지 않는다.

### 하지 않을 것

- Astra 한도를 무조건 1M으로 변경.
- 모든 200k 초과 모델에 `[1m]` 일괄 추가.
- `max_input_tokens`만 수정하고 표시 문제 해결로 가정.
- `CLAUDE_CODE_MAX_CONTEXT_TOKENS` + `DISABLE_COMPACT` 강제 (legacy 경로에서 압축까지 꺼짐).
- 공용 `/v1/models` discovery의 보수적 규칙 변경.
  `push1mVariant`의 `>= 1M` 조건과 `#854` 회귀 테스트는 유지한다.

### Astra 예시 (낮은 별도 예산·자동 압축·전달 조건 충족 가정)

| H | B | T | `[1m]` | 이유 |
| ---: | ---: | ---: | --- | --- |
| 922,000 | 829,800 | 784,800 | 가능 | `T ≤ B` |
| 872,000 (Astra) | 784,800 | 784,800 | 가능 | `T = B` |
| 500,000 | 450,000 | 784,800 | 불가 | `T > B` |
| 272,000 | 244,800 | 784,800 | 불가 | `T > B` |
| 알 수 없음 | 계산 불가 | — | 불가 | 실제 한도 확인 불가 |

현재 전역 기본값 829,800은 Astra 예산 784,800보다 크므로 새 규칙에서 탈락한다.
기존 실행 슬롯 조건(`window >= compactWindow`)과 새 규칙을 혼동하지 않는다.

## 1. 단계 0 — 실행 환경 확인 (코드 변경 전)

직접 실행 `claude` + auto connect를 1순위 기준으로, `ocx claude`를 병행 검증한다.
`ocx claude` 전용 기능으로 설계하지 않는다.

확인 항목:

- Claude Code 버전별 `[1m]` 계산·discovery·환경변수 우선순위.
- shell hook / launchctl env의 실제 적용 여부 (설정 생성됨 vs 프로세스 적용됨 구분).
- auto-context on/off, 사용자 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`,
  legacy `maxContextTokens` 조합의 동작.
- 실제 선택한 모델 alias와 서브에이전트 selector.
- 최신 클라이언트가 실제 한도 직접 지정 방식을 제공하는지 (제공해도 alias+자동 압축 유지 가능성은
  버전 확인 후 비교, 전제하지 않음).

관련 파일:

- `src/cli/claude.ts` (buildClaudeEnv 압축 설정)
- `src/server/system-env.ts` (injectSystemEnv, gateway cache 갱신)
- `src/server/system-env-shell.ts` (writeShellEnvFile)
- `src/cli/integrations.ts` (`--auto-context`, `--compact-window`)

산출: 지원 버전 범위 + “적용 확인” 판별 방법 확정. 이것 없이 단계 1~2에 진입하지 않는다.

## 2. 단계 1 — 공통 한도 계산과 실행 projection 분리

- 기존 계산 재사용: `nativeContextLimits`, `nativeOpenAiContextWindow`,
  `nativeOpenAiMaxInputTokens`, `nativeOpenAiAutoCompactTokenLimit`
  (`src/codex/catalog/metadata.ts`), `clampAutoCompactTokenLimit`
  (`src/providers/auto-compact-budget.ts`).
  공통 계산 변경 시 다른 소비자 영향도 함께 검증한다. 현재 함수가 제안과
  모든 경우에 같다고 간주하지 않는다.
- 신설 예시: `resolveManagedProjection(H, B, T, { autoEnabled, verifiedDelivery, passthrough })`
  → 표기 가능 여부 + 제외 이유 반환. 모델명·“800k 이상” 같은 고정 목록 하드코딩 금지.
- 기존 `shouldMarkOneMillion` (`src/claude/context-windows.ts`) 조건은 그대로 둔다.
  관리 실행용 selector에만 새 predicate를 적용한다.
- Claude 카탈로그에 Astra 전용 숫자 표를 복제하지 않는다.

경계값 단위 테스트 (제안 §7 시나리오):

- `H=872000, B=784800, T=784800` → 대상.
- 같은 모델 `T=829800` 또는 `900000` → `T > B`로 탈락.
- `T=200000`, `H` 알 수 없음, 압축 off → 탈락 + 제외 이유.
- 더 낮은 provider/per-model 설정 → H·B·selector 함께 제한.

## 3. 단계 2 — 노출 경로 일치 (관리 실행만)

- 적용 범위: 모델 슬롯(`effectiveModelEnv`), picker, 서브에이전트 selector,
  선택 후 inbound 해석. 세 경로가 같은 유효 한도·압축 조건을 사용한다.
- 공용 discovery는 손대지 않는다. auto connect의 gateway cache 갱신은 proxy 모델 목록을
  사용하므로, 압축 env 설정만으로 Astra `[1m]` 행이 생기지 않는 현상은 단계 0의
  우선 검증 대상이다.
- 관리 실행용 picker 전달 방법은 미확정: 사용 중인 Claude Code의 기존 모델 선택/설정 기능으로
  제공 가능한지 먼저 확인한다. 구분할 수 없는 공용 `/v1/models` 응답을 넓혀서 해결하지 않는다.
  묶을 수 없으면 discovery 확대는 보류하고 슬롯 일관성부터 개선한다.
- cap 변경·사용자 override·캐시·프로세스 재시작의 적용 시점을 일치시킨다.
  기존 프로세스 env까지 갱신됐다고 표시하지 않는다.

## 4. 단계 3 — 진단과 공개 문서

- `ocx models context` 변경 후 진단 출력 예시:

```text
요청한 provider cap: 1,000,000
모델의 유효 context/input 한도: 872,000
제한 이유: 모델 메타데이터의 장문 상한
OpenCodex 압축 예산: 784,800 (초기 90% 정책)
Claude Code 자동 압축 임곗값: 실제 적용한 T 또는 적용 미확인
[1m] 추가: 선정 조건 충족 여부와 제외 이유
```

- 표시명 `Astra · 872k`처럼 실제 한도만 설명. `Auto compact` suffix 사용 금지
  (endpoint·모델 자체 기능으로 오해 가능). `[1m]`이 필요해도 표시명을 `1M`으로
  바꾸거나 suffix를 wire 모델 ID에 포함하지 않는다.
- 관리 실행 vs 직접 gateway 연결의 지원 범위·설정 반영 시점을 문서화한다.
- 사용자 auto-context off는 임의로 다시 켜지 않는다.

## 5. 테스트·검증 계획

기존 focused test 확장 후보:

- `tests/claude-integration/claude-context-windows.test.ts`
- `tests/claude-integration/claude-model-info.test.ts` (#854 계약 유지)
- `tests/claude-integration/claude-desktop-native-context.test.ts`
- `tests/claude-integration/claude-messages-endpoint.test.ts`
- native 한도 계산, CLI env, cap 변경 관련 기존 테스트도 함께 실행.

검증 3단계:

1. 숫자 조건 단위 테스트 (H·B·T 경계값).
2. 실제 Claude Code 확인: auto connect 적용, picker 선택, 장문 계산, 압축 시작 시점과
   이후 요청 성공. 큰 도구 결과·출력/압축 여유·모델 전환·resume·서브에이전트 포함.
3. 실행 설정 적용 확인: 서버 설정·env 파일만으로 기존 프로세스 적용을 확정하지 않음.
   사용자 override·오래된 shell 값·자동 압축 off 구분, 미확인 상태는 한계 명시.

모델 목록·env snapshot만으로 완료 처리하지 않는다. 작은 window 전환도 검증한다.
실환경 장문 호출은 비용 발생하므로 합성 테스트 이후 별도 합의한다.
저장소 규칙에 따라 focused tests/typecheck → 필요 시 `test:changed` →
PR review-ready 전 전체 테스트를 따른다.

## 6. 미결정 사항 (합의 후 구현)

1. 공통 `T` 자동 기본값의 기준 집합. “전체 카탈로그 최솟값” 채택 금지,
   사용자 override와 자동 기본값 구분 필요.
2. auto connect 실제 적용 확인 + picker 연결 방법.
   User-Agent·서버 설정만으로 해결 간주 금지.
3. 지원 Claude Code 버전 + 실측 여유·초과 시 처리 범위.
   90%는 초기 정책이지 보증이 아님. 실측 부족 시 예산 하향, 무제한 입력 증가 가정 하의
   절대 보장 주장 금지.

선정 원칙 동의와 전달 방식·안전성 검증 완료는 별개다. 미결정 해소 전에는
공용 discovery의 sub-1M 행을 일괄 확대하지 않는다.

## 7. 완료 기준 체크리스트

- [ ] 단계 0 확인 결과 (버전·적용 판별법) 기록.
- [ ] `200k < T ≤ B < H` 판정 + 제외 이유 단위 테스트 통과.
- [ ] 공용 discovery 보수 동작 유지 (#854 테스트 포함 기존 테스트 green).
- [ ] 관리 실행 슬롯/picker/서브에이전트/inbound 일치 확인.
- [ ] cap 변경·override·캐시·재시작 적용 시점 문서화.
- [ ] 실제 Claude Code 장문 계산·압축 시작·작은 window 전환 검증.
- [ ] typecheck + test:changed + PR 전 전체 테스트 (저장소 규칙).

## 8. 인계 — 바로 다음 할 일과 권장 스킬

현재 상태: 단계 0 미착수. 코드·테스트 변경 없음. 다음 작업자는 단계 0
(§1 실행 환경 확인)부터 시작하고, 그 산출(지원 버전 + 적용 판별법)이 나오기 전에는
§2~§3에 진입하지 않는다.

조사済 근거 (본 세션에서 열람 확인, 구현 시 재확인용):

- `src/claude/context-windows.ts` — `resolveAutoContext`, `shouldMarkOneMillion`
- `src/claude/model-info.ts` — `push1mVariant`의 `>= 1M` 조건
- `src/codex/catalog/metadata.ts` — Astra 272k/872k 메타데이터, `narrowToLimits`,
  `nativeOpenAiAutoCompactTokenLimit`
- `src/cli/claude.ts` — `buildClaudeEnv` 압축 설정 주입
- `src/server/system-env.ts` — `injectSystemEnv`, gateway cache 갱신
- `src/server/system-env-shell.ts` — `writeShellEnvFile` (사용자 설정 미덮어쓰기)
- `src/providers/auto-compact-budget.ts` — `clampAutoCompactTokenLimit` 90% envelope
- `src/cli/models-runtime.ts` — `context` 명령의 cap 변경 API 호출
- `tests/claude-integration/claude-context-windows.test.ts`,
  `tests/claude-integration/claude-model-info.test.ts` (#854 계약)
- 미열람: `src/cli/integrations.ts` (제안서 인용만, 구현 전 직접 확인할 것)

Suggested skills (Skill tool 로드 대상):

- 해당 없음 — 구현·테스트는 저장소 규칙(`AGENTS.md`, focused tests → `test:changed`)
  그대로 따르면 되고, 전용 스킬이 필요한 작업이 아니다.
- 실환경 검증(§5 2단계)에서 실행 중 프록시를 다뤄야 할 때만 `skills/ocx/`
  operating reference를 읽는다 (Skill tool 스킬이 아닌 저장소 내 문서).
- 다음 세션에서 커밋·푸시까지 한다면 그때 `bundled:git`을 먼저 로드한다.

주의:

- `src/lab/` 경계 테스트(`tests/lab/core-lab-boundary.test.ts`)와 무관한 변경이지만,
  새 모듈 추가 시 `src/router.ts`·`src/server/lifecycle.ts`·
  `src/server/responses/core.ts`에서 `src/lab/`으로의 import 체인이 생기지 않게 한다.
- 새 테스트 파일은 `scripts/test-layout/layout.json` `explicit` +
  `tests/fixtures/test-layout-expected.json`에 등록한다 (정규식 시드 임시 배치 후
  등록 누락 주의).
