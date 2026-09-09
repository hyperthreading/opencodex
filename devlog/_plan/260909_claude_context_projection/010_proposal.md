# Claude Code → Codex Auth: Astra 장문 컨텍스트 projection 제안

- 작성일: 2026-09-09
- 상태: **PROPOSED — 문서화만 완료, 구현·실환경 검증 전**
- 조사 기준: `9a27e86992d7a014e0aa92c046199b9fac148201`
- 대상: 실제 모델 한도, Claude Code 모델 선택 목록, 실행 환경변수의 일관성
- 관련 제안: [ToolSearch 지연 로딩 브리지](../260909_claude_tool_search_bridge/010_proposal.md)
- 논의: [Open in Delta](https://delta.dev/join/thread_01m237czt4b73gssta1v3dkt5r)

## 한눈에 보는 결론

**실제 context가 200k보다 크고, OpenCodex가 여유를 남겨 계산한 압축 예산 안에서
Claude Code가 압축하도록 설정되어 있으면, 200k 계산 제한을 풀기 위해 `[1m]`을 붙인다.**
이것이 질의응답에서 합의한 sub-1M 모델의 추가 표기 원칙이다.

```text
200k < Claude Code의 실제 압축 임곗값 ≤ OpenCodex의 압축 예산 < 모델의 실제 한도
```

- **사용자:** 지금처럼 `claude` 직접 실행 + auto connect를 사용하고 장문 사용을 설정한다.
  모델마다 압축 숫자를 계산하거나 `[1m]`을 수동으로 붙일 필요가 없게 만든다.
- **OpenCodex:** 모델의 실제 한도와 압축 예산을 계산하고, 모델 선택 정보와 압축 설정을
  함께 전달한다. 실행 환경에 실제 적용됐는지 확인하는 방법은 구현 전에 확정해야 한다.
- **Claude Code:** 적용된 임곗값에 따라 대화 압축을 시작하고 결과로 이력을 정리한다.
  Codex endpoint가 긴 입력을 알아서 압축한다는 뜻이 아니다.
- **`[1m]`:** 클라이언트 계산을 위한 호환 표식이다. Astra의 실제 한도를 1M으로 늘리지 않는다.
- **상태:** 위 원칙은 합의했지만 구현·실환경 검증은 아직 하지 않았다.
  기본 90% 예산은 초기 정책이지 한도 초과가 절대 없다는 보증이 아니다.

## 1. 요구사항과 완료 목표

사용자는 다음 설정 후에도 Astra 카탈로그 모델에 `[1m]`이 붙지 않아 Claude Code가
컨텍스트를 200k로 인식한다고 보고했다.

```sh
ocx models context provider openai on --value 1000000
```

목표는 `[1m]` 문자열을 추가하는 것 자체가 아니다. **Claude Code가 선택한 모델의
장문 컨텍스트를 활용하면서 실제 upstream 한도 전에 압축하도록, 모델 선택 정보와
압축 설정을 일치시키는 것**이다.

사용자는 **`claude`를 직접 실행하며 OpenCodex의 auto connect를 켠다**고 확인했다.
따라서 `ocx claude` 전용 기능으로 설계하지 않는다. 기준은 실행 명령의 이름이 아니라
**Claude Code 프로세스가 OpenCodex의 모델·압축 설정을 실제로 전달받는가**이다.
auto connect 활성화와 auto-context 활성화는 별개이며, 사용자 환경변수와 이미 실행 중인
shell/process 때문에 설정의 전달 여부는 추가 확인이 필요하다.

## 2. 소스에서 확인한 현재 동작

| 항목 | 현재 값 또는 규칙 | 근거 |
| --- | --- | --- |
| CLI 명령 | provider context cap 변경 API를 호출한다. | [context 명령](../../../src/cli/models-runtime.ts#L364-L405) |
| Astra 기본 window | 272,000 | [native 메타데이터](../../../src/codex/catalog/metadata.ts#L176-L181) |
| Astra 장문 상한 | 872,000 | 같은 메타데이터의 `maxContextWindow`/`maxInputTokens` |
| 설정 후 유효 한도 | 다른 낮은 override가 없다면 1,000,000 요청도 872,000으로 제한된다. | [narrowToLimits](../../../src/codex/catalog/metadata.ts#L289-L310) |
| discovery의 `[1m]` 행 | 유효 window가 실제 1M 이상인 경우만 추가한다. | [push1mVariant](../../../src/claude/model-info.ts#L141-L170) |
| 실행 모델 슬롯의 `[1m]` | auto-context가 켜져 있고 압축 임곗값을 감당하면 1M 미만에도 붙일 수 있다. | [shouldMarkOneMillion](../../../src/claude/context-windows.ts#L89-L99) |
| 실행 압축 설정 | 사용자 환경변수를 고려하여 auto-context 값을 주입한다. | [buildClaudeEnv의 압축 설정](../../../src/cli/claude.ts#L312-L329) |
| macOS auto connect | 모델 슬롯과 압축 임곗값을 계산하고 launchctl 및 shell env 파일에 전달한다. | [injectSystemEnv](../../../src/server/system-env.ts#L203-L228) |
| 직접 실행용 shell hook | 모델 env와 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`를 export한다. 사용자가 이미 설정한 압축 값은 덮어쓰지 않는다. | [writeShellEnvFile](../../../src/server/system-env-shell.ts#L87-L115) |

872k는 현재 저장소가 채택한 모델 한도이며 이번 조사에서 실측한 수치가 아니다.
이 제안은 upstream 한도를 새로 1M으로 인정하거나 모델 entitlement를 변경하지 않는다.

현재 규칙은 단순한 캐시 누락으로 설명되지 않는다. 카탈로그에서는 872k가
`>= 1M` 조건을 통과하지 못하지만, 실행 슬롯에서는 현재 기본 압축 임곗값
829,800을 통과할 수 있다. 이 차이가 사용자에게는 같은 모델의 불일치로 드러난다.

카탈로그의 보수적 조건에는 이유가 있다. `[1m]`을 본 Claude Code가 1M으로 계산하는데
압축 설정이 함께 적용되지 않으면 실제로는 더 작은 모델을 과하게 채울 수 있다.
기존 [sub-1M picker 회귀 테스트](../../../tests/claude-integration/claude-model-info.test.ts#L147-L170)도
이 조건을 보호한다. 조건을 삭제하거나 테스트 기대값만 바꾸는 수정은 하지 않는다.

## 3. 대안과 권장 방향

| 대안 | 평가 |
| --- | --- |
| Astra 한도를 무조건 1M으로 변경 | 실제 한도와 표시를 혼동한다. 채택하지 않는다. |
| 모든 200k 초과 모델에 `[1m]` 추가 | 압축 설정이 없는 클라이언트와 작은 window에서 기존 문제를 되살린다. |
| `max_input_tokens`만 수정 | 현재 Claude Code가 그 필드를 컨텍스트 계산에 사용하는지 검증이 필요하며, 표시 문제의 단독 해결책으로 가정할 수 없다. |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS`와 `DISABLE_COMPACT` 강제 | 현재 legacy 경로에서는 압축까지 꺼진다. 장문 세션의 기본 해결책으로 부적절하다. |
| 실제 한도와 관리 실행용 selector를 분리하여 파생 | **권장.** 모델의 사실은 유지하고, 보장 가능한 클라이언트 환경에서만 호환 표기를 제공한다. |

일반 discovery와 관리 실행이 반드시 같은 행을 내보내야 하는 것은 아니다.
**같은 유효 한도를 사용하되, 확인된 실행 환경에 따라 표현만 달라져야 한다.**

## 4. 제안하는 동작 계약

### 압축의 주체

이 제안에서 auto-compaction은 **Claude Code가 시작하고 대화 이력에 적용하는 압축**이다.
OpenCodex는 Claude Code가 읽을 모델 selector와 압축 임곗값을 제공한다. 요약 생성에는
모델 호출이 쓰일 수 있지만, Codex Auth endpoint가 길어진 입력을 알아서 압축하여
한도를 보장한다는 의미는 아니다. endpoint 자동 압축이나 별도 compact API의 도입은
이 제안에 포함하지 않는다.

### `[1m]` 추가 모델의 선정 기준

모델 이름이나 “1M에 가까운 크기”로 선정하지 않는다. 아래 규칙은 **실제 유효 한도가
1M 미만인 모델에 호환 표식을 추가하는 조건**이다. 실제 1M 이상 모델의 기존 discovery
행은 유지하며, native Anthropic passthrough는 이 호환 처리에 포함하지 않는다.

| 기호 | 의미 |
| --- | --- |
| `H` — 실제 유효 한도 | canonical 메타데이터와 사용자 설정을 적용한 context 한도 및 알려진 input 한도 중 작은 값 |
| `B` — OpenCodex 압축 예산 | 기본 `floor(H × 0.9)`. 기존 모델별 예산이나 사용자 설정이 더 낮으면 그 값을 사용 |
| `T` — Claude Code 압축 임곗값 | 해당 Claude Code 실행에 실제 적용하는 공통 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 값 |

다음 조건을 **모두** 만족하는 모델만 추가 대상으로 삼는다.

1. `H`를 신뢰할 수 있는 메타데이터로 알 수 있고 `200,000 < H < 1,000,000`이다.
2. Claude Code 자동 압축이 켜져 있고 해당 실행에 `T`를 적용하는 경로가 확인되어 있다.
3. **`200,000 < T ≤ B < H`**이다.
4. `[1m]`이 upstream 기능 선택까지 바꾸는 native Anthropic passthrough 등의 경로가 아니다.

“Claude Code의 예산”은 표시되는 200k/1M context 크기가 아니라 **실제 압축 임곗값 `T`**를
뜻한다. provider cap은 `H`를 정하는 입력이지, 그 provider의 모든 모델에 표식을 붙이라는
명령이 아니다. `T ≤ 200k`라면 장문 표식의 이점이 없어 추가 대상으로 삼지 않는다.

[nativeContextLimits](../../../src/codex/catalog/metadata.ts#L242-L263)와
[nativeOpenAiAutoCompactTokenLimit](../../../src/codex/catalog/metadata.ts#L361-L373) 등
기존 계산을 재사용한다. 현재 [공통 soft budget 함수](../../../src/providers/auto-compact-budget.ts#L10-L23)는
context의 90%에 input 한도와 사용자 예산을 적용한다. 위 제안은 별도 input 한도가 더
작을 때도 `B < H`의 여유를 유지하도록 **유효 한도 `H`의 90% 이하**로 제한한다.
현재 함수가 이미 모든 경우에 이 제안과 같다고 간주하지 않으며, 공통 계산을 변경한다면
다른 소비자에 미치는 영향도 검증한다. Claude 카탈로그에 Astra 전용 숫자 표는 복제하지 않는다.

### Astra 예시: `T = 784,800`인 실행

아래는 낮은 별도 예산 설정이 없고 자동 압축과 설정 전달 조건도 충족한 경우다.
`784,800`은 `872,000 × 90%`로 구한 초기 후보이며 실측으로 확정한 값은 아니다.

| 모델의 실제 한도 `H` | OpenCodex 예산 `B` | `[1m]` 추가 | 이유 |
| ---: | ---: | --- | --- |
| 922,000 | 829,800 | 가능 | `T ≤ B` |
| **872,000 — Astra** | **784,800** | **가능** | `T = B` |
| 500,000 | 450,000 | 불가 | `T > B` |
| 272,000 | 244,800 | 불가 | `T > B` |
| 알 수 없음 | 계산 불가 | 불가 | 실제 한도를 확인할 수 없음 |

같은 Astra라도 실제 적용된 `T`가 900,000이면 불가하다. 현재 전역 기본값인
829,800도 이 예시의 Astra 예산 784,800보다 커서 **새 선정 규칙으로는 통과하지 않는다.**
기존 실행 슬롯의 `window >= compactWindow` 조건과 새 규칙을 구분해야 한다.
반대로 500k 모델은 공통 `T`를 450k 이하이면서 200k 초과로 적용하는 실행에서는
대상이 될 수 있다. “800k 이상만 허용” 같은 고정 모델 목록을 만들지 않는다.

### 관리 실행과 일반 gateway의 구분

1. **OpenCodex가 실행 환경까지 관리하는 경우**
   - `ocx claude`뿐 아니라 auto connect의 shell hook/env를 적용받아 직접 실행한
     `claude`도 포함한다. auto connect를 켰다는 설정만으로 실제 적용을 단정하지 않는다.
   - 검증한 Claude Code 버전에서 장문 계산과 auto-compaction을 함께 설정한다.
   - 모델 슬롯, picker, 서브에이전트 selector가 같은 유효 한도 및 압축 조건을 사용한다.
   - 1M 미만 모델의 `[1m]`은 클라이언트 계산용 호환 표식으로만 취급한다.
   - 모델 설명과 `max_input_tokens`에는 실제 유효 한도를 유지한다.
2. **일반 gateway discovery 또는 실행 조건이 불명확한 경우**
   - 기존의 실제 1M 이상 모델만 `[1m]` 행을 만드는 규칙을 유지한다.
   - 서버의 `autoContext: true`나 Claude Code User-Agent만으로 클라이언트에
     압축 환경변수가 적용되었다고 추정하지 않는다.
   - 안전한 장문 설정이 필요함을 설명하되, 없는 보장을 카탈로그로 광고하지 않는다.

관리 실행용 picker를 전달하는 방법은 아직 확정하지 않는다. 사용 중인 Claude Code의
기존 모델 선택/설정 기능으로 제공 가능한지 먼저 확인한다. 구분할 수 없는 공용
`/v1/models` 응답을 넓혀서 해결하지 않는다. 관리 실행과 selector를 묶을 수 없다면
sub-1M discovery 확대는 보류하고 실행 모델 슬롯의 일관성부터 개선한다.

auto connect가 env를 제공해도 picker는 별도 discovery 규칙을 따른다.
현재 [auto connect의 gateway cache 갱신](../../../src/server/system-env.ts#L230-L235)은
proxy의 모델 목록을 사용하므로, 압축 env가 설정됐다는 사실만으로 Astra의 `[1m]`
행이 생기지는 않는다. 사용자의 직접 실행 + auto connect 경로를 이 연결의 우선
검증 대상으로 삼는다.

### 전역 환경변수의 제약

`CLAUDE_CODE_AUTO_COMPACT_WINDOW`는 모델별 값이 아니라 실행 환경의 값이다.
따라서 카탈로그 행마다 다른 압축 예산을 계산해 놓고 단일 환경변수가 이를 모두
적용한다고 주장할 수 없다. **하나의 실제 적용값 `T`에 대해 각 모델의 `B`를 비교한다.**
모델별로 `T = B`를 다시 계산하여 모든 행을 통과시키는 것은 잘못된 구현이다.

- 해당 실행에 적용된 동일한 임곗값으로 각 모델의 표기 가능 여부를 평가한다.
- 사용자 환경변수, auto-context off, legacy override를 계산에 반영한다.
- `/model` 전환과 서로 다른 window의 서브에이전트를 포함해 작은 한도에서도
  장문 표기가 잘못 활성화되지 않는지 확인한다.
- 실행 중 cap/설정이 변경되면 기존 프로세스의 환경변수까지 갱신되었다고 표시하지
  않는다. 재시작 또는 명시적인 설정 재적용이 필요한 범위를 정의한다.
- native Anthropic passthrough의 모델 ID와 beta 의미는 기존 보호 규칙을 유지한다.

## 5. 누가 무엇을 어디에 설정하는가

### 완성 후 사용 흐름

1. 사용자는 auto connect를 켜 두고 기존 provider context 명령으로 장문 사용을 설정한다.
2. OpenCodex가 `H`와 `B`를 계산하고 해당 실행의 공통 `T`를 정한다.
3. auto connect가 모델 env와 압축 임곗값을 전달하고, picker도 같은 선정 규칙을 따른다.
4. 사용자는 새 설정을 읽은 shell에서 `claude`를 직접 실행해 Astra를 선택한다.

| 설정 | 누가/어디서 처리하는가 | 사용자에게 요구할 일 |
| --- | --- | --- |
| provider context cap | 기존 `ocx models context provider openai on --value 1000000` | 장문 사용 의사를 설정 |
| auto connect | 기존 OpenCodex 설정 | 현재처럼 켜 둠 |
| `H`, `B` 및 공통 `T` 계산 | OpenCodex의 한도 계산 및 Claude 연동 | 모델별 숫자 계산은 요구하지 않음 |
| 압축 임곗값 전달 | auto connect의 launchctl/shell env, 또는 `ocx claude`의 spawn env | 설정이 바뀌면 적용된 새 shell/process 사용 |
| `[1m]` selector | OpenCodex의 모델 선택 정보 | suffix를 직접 입력하게 하지 않음 |
| 대화 압축 | Claude Code | 정상 자동 압축 사용 |

auto connect와 auto-context는 별도 설정이다. 사용자가 자동 압축을 껐으면 임의로 다시
켜지 않는다. [현재 CLI 설정](../../../src/cli/integrations.ts#L16-L23)에는
`--auto-context`와 `--compact-window`가 있고, 이를 통한 사용자 설정도 존중한다.
단, `--compact-window default`가 현재 모델별 자동 계산을 뜻하는 것은 아니다.
현재 [resolveAutoContext](../../../src/claude/context-windows.ts#L76-L86)는 기본값 829,800을 사용한다.

위 자동 계산과 picker 연결은 **구현 목표**다. 현재 사용자가 명령을 다시 실행하거나
임곗값만 수동으로 바꾼다고 누락된 Astra 카탈로그 행까지 해결되는 것은 아니다.

### 표시와 진단

“설정 생성 완료”와 “실제 프로세스에 적용 확인”을 구분한다. Astra 예시의 진단은
다음 정보를 담되, 확인하지 못한 상태를 적용 완료라고 표시하지 않는다.

```text
요청한 provider cap: 1,000,000
모델의 유효 context/input 한도: 872,000
제한 이유: 모델 메타데이터의 장문 상한
OpenCodex 압축 예산: 784,800 (초기 90% 정책)
Claude Code 자동 압축 임곗값: 실제 적용한 T 또는 적용 미확인
[1m] 추가: 선정 조건 충족 여부와 제외 이유
```

모델 표시명은 `Astra · 872k`처럼 실제 한도만 설명하고, 적용 상태는 별도로
`Claude Code 자동 압축 임곗값: …`라고 표시하는 방향을 권장한다. 처음 제안한
`Astra · 872k · Auto compact`는 endpoint나 모델의 자체 기능으로 오해될 수 있어
사용하지 않는다. 정확한 문구는 UI 작업 시 결정한다. `[1m]` suffix가 필요하더라도
표시명을 무조건 `1M`으로 바꾸거나 suffix를 실제 wire 모델 ID의 일부로 보내지 않는다.

## 6. 구현 순서

1. **실행 환경 확인**
   - 직접 실행 + auto connect를 기준으로 Claude Code 버전, shell hook/env 적용,
     auto-context 설정, 실제 선택한 모델 alias를 확인한다. `ocx claude`도 함께 검증한다.
   - 해당 버전의 `[1m]`, discovery, 환경변수 우선순위를 검증한다.
   - 최신 클라이언트가 실제 한도를 직접 지정하는 방식을 제공한다면 현재 alias와
     자동 압축을 유지할 수 있는지 비교한다. 버전 확인 없이 이를 전제하지 않는다.
2. **공통 한도 계산과 실행 projection 정리**
   - 실제 한도와 압축 예산의 기존 소스를 재사용한다.
   - 관리 실행 여부와 실제 적용 임곗값을 입력으로 selector를 파생한다.
   - 공용 discovery의 보수적 동작은 유지한다.
3. **노출 경로 일치**
   - 관리 실행의 모델 슬롯, picker, 서브에이전트와 선택 후 inbound 해석을 연결한다.
   - cap 변경, 사용자 override, 캐시, 프로세스 재시작의 적용 시점을 일치시킨다.
4. **진단과 공개 문서**
   - 요청값과 유효값의 차이를 CLI/기존 관리 화면에서 설명한다.
   - 관리 실행과 직접 gateway 연결의 지원 범위 및 설정 반영 시점을 문서화한다.

## 7. 검증 계획과 완료 기준

### “안전함”을 검증하는 세 단계

1. **숫자상 조건:** 메타데이터·cap·input 한도를 반영한 `H`인지, `B < H`인지,
   `200k < T ≤ B`인지 검사한다. 이 계산과 조건의 경계값은 단위 테스트로 검증한다.
2. **클라이언트 동작:** 개발 과정에서 실제 Claude Code로 auto connect 적용,
   picker 선택, 장문 계산, 압축 시작 시점과 이후 요청 성공을 확인한다. 큰 도구 결과,
   출력·압축 요청의 여유, 모델 전환, resume, 서브에이전트도 포함한다.
3. **실행 설정 적용:** 서버 설정이나 생성된 env 파일만으로 기존 Claude Code 프로세스의
   적용 상태를 확정하지 않는다. 사용자 override, 오래된 shell 값, 자동 압축 off를
   구분하고 실제 적용을 확인할 수 없는 경우에는 그 한계를 알린다.

90%는 **초기 여유 정책이지 안전성의 증명은 아니다.** Astra 예시의 여유는 87,200토큰이다.
한 번의 큰 도구 결과가 그보다 크거나 토큰 계산이 다르면 한도를 넘을 수 있다.
실측상 부족하면 예산을 더 낮추고, 입력 증가량이 제한되지 않은 상태에서 모든 요청이
절대 한도를 넘지 않는다고 보장하지 않는다. 추가 여유나 초과 시 처리 계약이 필요한지는
클라이언트 검증 결과로 결정한다. 임곗값 벤치마크를 일반 사용자에게 떠넘기지 않는다.

### 회귀 및 실사용 시나리오

| 시나리오 | 기대 결과 |
| --- | --- |
| Astra 기본값 | 현재 272k 메타데이터를 유지하고 1M이라고 광고하지 않는다. |
| Astra에 provider cap 1M | 다른 낮은 override가 없으면 context/input은 872k로 계산한다. |
| `H=872000`, `B=784800`, `T=784800` | 다른 조건도 충족하면 sub-1M 표식 추가 대상이다. |
| 같은 모델에서 `T=829800` 또는 `900000` | `T > B`이므로 새 규칙에서는 추가 대상이 아니다. |
| `T=200000`, 알 수 없는 `H`, 압축 off | 추가 대상이 아니며 제외 이유를 알린다. |
| 더 낮은 provider/per-model 설정 | 실제 한도, 압축 예산, selector가 함께 제한된다. |
| 관리 실행의 장문 Astra 선택 | 200k에 묶이지 않고, 실제 한도보다 충분히 일찍 압축된다. |
| 직접 실행 + auto connect | shell env와 picker를 함께 검증하며 `ocx claude`로 실행을 바꾸지 않아도 지원한다. |
| auto connect on + auto-context off, 기존 shell/env | 연결 성공을 압축 설정 적용으로 오인하지 않고 실제 조건을 알린다. |
| 일반 discovery | 실행 압축 조건을 모르는 sub-1M 행에 표식을 새로 붙이지 않는다. |
| auto-context off/legacy override/사용자 env | 환경변수 우선순위와 selector 판단이 일치한다. |
| 압축 임곗값이 모델 한도에 비해 너무 큼 | 장문 표기를 거절하거나 명시적으로 안전한 설정을 요구한다. |
| `/model`, resume, 서브에이전트, Fast 변형 | 한도와 선택한 모델의 대응이 유지된다. |
| 설정 변경 및 캐시된 picker | 새 설정의 실제 적용 시점을 정확히 알린다. |
| 실제 1M 모델과 native Anthropic | 기존 discovery 및 passthrough 계약이 유지된다. |

기존 focused test 확장 후보:

- [claude-context-windows.test.ts](../../../tests/claude-integration/claude-context-windows.test.ts#L1)
- [claude-model-info.test.ts](../../../tests/claude-integration/claude-model-info.test.ts#L1)
- [claude-desktop-native-context.test.ts](../../../tests/claude-integration/claude-desktop-native-context.test.ts#L1)
- [claude-messages-endpoint.test.ts](../../../tests/claude-integration/claude-messages-endpoint.test.ts#L1)

구현 시에는 native 한도 계산, CLI env 및 cap 변경의 기존 테스트도 찾아 함께 실행한다.
모델 목록이나 환경변수 snapshot만으로 완료 처리하지 않는다. 실제 Claude Code에서
선택한 모델의 컨텍스트 계산과 압축 시작 지점을 확인하고, 작은 window로의 전환도
검증해야 한다. 실환경 장문 호출은 비용이 발생하므로 합성 테스트 이후 별도로 합의한다.

구현 중 focused tests/typecheck와 필요한 `test:changed`, PR review-ready 전 전체 테스트는
저장소 규칙을 따른다. 이 문서 작성 단계에서는 제품 동작을 변경하거나 검증하지 않았다.

## 8. 합의한 원칙과 구현 전에 남은 결정

**합의한 것:** `200k < T ≤ B < H`라는 추가 표기 원칙, 직접 실행 + auto connect 지원,
사용자 대신 OpenCodex가 계산·전달하는 UX, Claude Code가 압축의 주체라는 역할 분담이다.

**아직 확정하지 않은 것:**

- 여러 모델 중 어떤 사용 대상 집합을 기준으로 공통 `T`의 자동 기본값을 정할 것인가.
  낮추면 더 작은 모델도 대상이 되지만 큰 모델의 압축도 빨라지는 비용이 있다.
  “모든 카탈로그 모델의 최솟값”을 무조건 택하거나 모델마다 다른 `T`를 적용한다고
  가정하지 않는다. 사용자 override가 있으면 자동 기본값과 구분해야 한다.
- auto connect의 실제 설정 적용을 어떻게 확인하고 picker와 연결할 것인가.
  User-Agent나 서버 설정만으로 해결됐다고 간주하지 않는다.
- 지원할 Claude Code 버전과 실측에 따른 추가 여유·초과 시 처리 범위는 무엇인가.

선정 원칙에 대한 동의와 위 전달 방식·안전성 검증의 완료는 별개다. 이 결정들이
끝나기 전에는 공용 discovery의 sub-1M 행을 일괄 확대하지 않는다.
