# Claude Code → Codex Auth: ToolSearch 지연 로딩 브리지 제안

- 작성일: 2026-09-09
- 상태: **PROPOSED — 문서화만 완료, 구현·실환경 검증 전**
- 조사 기준: `9a27e86992d7a014e0aa92c046199b9fac148201`
- 대상: Claude Code의 Anthropic Messages 요청을 Responses로 번역하여 Codex Auth provider로 보내는 경로
- 관련 제안: [Astra 장문 컨텍스트 projection](../260909_claude_context_projection/010_proposal.md)
- 논의: [Open in Delta](https://delta.dev/join/thread_01m237czt4b73gssta1v3dkt5r)

## 한눈에 보는 결론

**Claude Code가 검색을 실행하고, OpenCodex가 검색 결과에 해당하는 도구만 모델에
노출하도록 번역을 완성한다.** 검색 전부터 모든 도구 정의를 전달하면 요구사항을
해결한 것이 아니다.

- 현재 번역에서 빠지는 `defer_loading`과 `tool_reference` 의미를 함께 연결한다.
- 첫 범위는 클라이언트 실행형 ToolSearch이며, 별도 검색 엔진이나 세션 저장소는 만들지 않는다.
- 사용자 주 경로인 **`claude` 직접 실행 + auto connect**에서 검색부터 실제 도구 실행까지
  검증한다. 해당 Claude Code 버전의 ToolSearch 활성화 조건도 확인해야 한다.
- 완료 기준은 검색 호출 성공뿐 아니라 **실제 모델 컨텍스트의 도구 정의 감소**다.
- 장문 컨텍스트 확대와는 별도 작업이다. `[1m]`으로 큰 window를 제공하는 것은
  도구 정의가 불필요하게 차지하는 토큰을 줄이는 대안이 아니다.

## 1. 요구사항과 완료 목표

Claude Code에서 ToolSearch를 사용해도 전체 도구 정의가 컨텍스트를 차지한다는
사용자 보고를 해결한다. 목표는 검색 도구를 호출 가능하게 만드는 것에 그치지 않고,
**검색 전에는 deferred 도구의 전체 스키마를 모델에 노출하지 않고, 검색 후에는
선택된 도구만 실제 호출 가능한 상태로 추가하는 것**이다.

이 문서는 구현 제안이다. 실제 사용 중인 Claude Code 버전, 요청 형식, 토큰 사용량은
아직 확인하지 않았다. Codex Auth upstream 자체가 ToolSearch를 지원하지 않는다고
단정하지 않는다.

## 2. 소스에서 확인한 현재 동작

| 위치 | 확인 내용 | 영향 |
| --- | --- | --- |
| [Messages 진입점](../../../src/server/claude-messages.ts#L1-L7) | Anthropic 요청을 Responses로 번역한 뒤 기존 요청 처리 경로에서 재실행한다. | 새 provider 전송 경로보다 번역 경계 보완이 우선이다. |
| [toolsToResponses](../../../src/claude/inbound-content-options.ts#L16-L43) | `input_schema`가 있는 도구를 function으로 바꾸면서 `defer_loading`을 옮기지 않는다. | deferred 도구도 일반 활성 도구처럼 전달된다. |
| [toolResultOutput](../../../src/claude/inbound.ts#L43-L66) | text/image/document를 처리하지만 `tool_reference`는 처리하지 않는다. | 검색 결과가 도구 활성화 의미로 이어지지 않는다. |
| [호환성 정책](../../../src/claude/compatibility.ts#L4-L16) | tool search/reference/deferred tools를 미지원 기능으로 분류한다. | enforce에서는 거절 대상이고, shadow는 의미 보존을 보장하지 않는다. |
| [Responses 도구 활성화](../../../src/adapters/openai-responses.ts#L755-L858) | `tool_search_output.tools`에 담긴 정의를 기존 목록에 병합하고 deferred 표시를 제거하는 로직이 있다. | 활성화 규칙의 재사용 후보이며, Claude reference를 바로 처리하는 구현은 아니다. |

따라서 `ENABLE_TOOL_SEARCH=true`만 강제하거나 미지원 표시만 해제하는 변경은 부족하다.
선언, 검색 호출, 검색 결과, 다음 요청의 활성 도구 집합을 함께 연결해야 한다.

## 3. 대안과 권장 방향

| 대안 | 평가 |
| --- | --- |
| 모든 도구를 일반 function으로 전달 | 구현은 단순하지만 컨텍스트 절약 요구를 해결하지 못한다. |
| `defer_loading`만 그대로 전달 | reference 처리와 다음 턴 활성화가 빠지고, upstream별 지원 차이도 남는다. |
| OpenCodex에 별도 검색 엔진·세션 레지스트리 추가 | 검색 실행, 상태 보관, 만료까지 새로 소유하게 된다. 클라이언트 검색형의 첫 구현에는 불필요하다. |
| Claude Code의 검색 실행을 유지하고 지연 로딩 의미를 번역 | **권장.** 기존 실행 주체와 Responses 도구 처리 규칙을 최대한 유지한다. |

첫 범위는 **Claude Code의 클라이언트 실행형 ToolSearch**로 제한한다.
Anthropic의 서버 실행형 `tool_search_tool_regex`/`tool_search_tool_bm25`까지 같은
기능으로 간주하지 않는다. 사용자 버전이 서버 실행형 요청을 보내는 것으로 확인되면
이 범위를 다시 결정해야 한다.

## 4. 제안하는 동작 계약

### 요청별 활성 도구 계산

```text
현재 요청의 도구 선언 + 대화 이력
  → 기본 활성 도구 / 아직 발견하지 않은 deferred 도구 분류
  → 유효한 검색 결과로 발견된 도구 확인
  → upstream에 노출할 활성 도구 집합 계산
```

1. 첫 요청에서는 기본 활성 도구와 검색 도구를 노출한다.
   발견하지 않은 deferred 도구의 전체 스키마가 모델 컨텍스트에 들어가면 안 된다.
2. 모델의 검색 호출을 Claude Code가 실행할 수 있는 `tool_use`로 반환한다.
   입력 스키마와 호출 ID를 보존하며 검색 도구 이름만 보고 의미를 추측하지 않는다.
3. 다음 요청의 `tool_result`에서 `tool_reference`를 읽고 현재 요청의 선언과 매칭한다.
   reference 자체를 도구 정의로 취급하거나 임의의 스키마를 만들어 넣지 않는다.
4. 발견된 도구만 활성화한다. 기존 Responses의 병합·중복 제거 규칙을 재사용할 수
   있는지는 실제 내부 표현을 확인한 뒤 결정한다.
5. 검색 결과의 의미와 호출/결과 쌍을 이력에도 보존한다. SSE와 buffered JSON에서
   같은 도구 이름, 인자, ID, 종료 의미를 유지한다.

내부에서 Responses의 `tool_search_call`/`tool_search_output`으로 정규화할지,
일반 function 호출을 유지하면서 Claude 전용 reference 활성화를 덧붙일지는
첫 wire fixture로 결정한다. 두 프로토콜의 검색 인자와 실행 주체가 같다고 가정해
이름만 치환하지 않는다.

### 상태와 호환성 범위

- 현재 요청에 선언된 도구와 재생된 이력으로 상태를 재구성하는 방식을 우선한다.
  전역 캐시나 별도 세션 저장소는 첫 설계에 추가하지 않는다.
- 검색 완료 이력뿐 아니라 이후 실제 도구 호출의 재생도 검증한다. compact/resume으로
  검색 이력이 빠졌을 때 재검색이 필요한지, 남은 호출에서 복원 가능한지는 실제
  Claude Code 요청을 기준으로 규정한다. 정보가 없다고 모든 deferred 도구를 풀지 않는다.
- 참조되지 않은 도구, 중복 결과, 존재하지 않는 참조, 변경된 선언에 대한 동작을 명시한다.
- Codex Auth의 native deferred protocol과 일반 routed upstream의 활성 도구 투영은
  wire 표현이 다를 수 있다. 어느 쪽도 “필드가 남았다”를 지연 로딩의 증거로 삼지 않는다.
- native Anthropic passthrough는 변경하지 않는다. 아직 검증하지 않은 다른 translated
  경로를 전부 지원으로 표시하지 않는다.
- 호환성 검사는 구현한 요청 형태만 허용하도록 조정한다. 현재의 기능 코드 전체를
  일괄 지원으로 뒤집지 않는다.

## 5. 구현 순서

1. **클라이언트 계약 확인**
   - 직접 실행 + auto connect를 기준으로 Claude Code 버전, 실제 ToolSearch 선언과
     반환 형식을 확인한다. `ocx claude` 경로의 기존 동작도 유지한다.
   - 외부 gateway의 ToolSearch 활성화 조건과 experimental beta 설정을 함께 확인한다.
   - 원본 요청이나 사용자 도구 설명을 저장소에 남기지 않고 합성 fixture를 만든다.
2. **번역 및 활성화**
   - 선언의 deferred 의미, reference 결과, 검색 호출의 왕복을 구현한다.
   - 기존 Responses 활성화 로직에서 공유할 순수 규칙만 재사용한다.
   - 다음 요청에 필요한 도구만 활성화되는지 실제 전송 직전 body까지 검사한다.
3. **호환성 정책 연결**
   - 지원하는 client-executed 형태와 미지원 hosted 형태를 구분한다.
   - shadow/enforce가 실제 번역 능력과 일치하는지 확인한다.
4. **실사용 검증과 문서 반영**
   - 실제 Claude Code → Codex Auth 경로에서 검색, 도구 실행, 후속 턴을 검증한다.
   - 지원 범위와 필요한 클라이언트 설정을 공개 문서 및 번역 문서에 반영한다.

## 6. 검증 계획과 완료 기준

| 시나리오 | 기대 결과 |
| --- | --- |
| deferred 도구가 많은 첫 요청 | 미발견 도구의 전체 스키마가 모델 컨텍스트에서 제외된다. |
| 도구 하나를 찾는 검색 결과 | 해당 도구만 추가되고 실제 호출까지 성공한다. |
| 검색 결과가 없거나 중복됨 | 전체 로딩으로 바뀌지 않고 활성 집합이 안정적으로 유지된다. |
| 일반 도구와 검색 도구의 이름 충돌 | 일반 도구를 검색 프로토콜로 오인하지 않는다. |
| 후속 턴·여러 검색·선언 변경 | 필요한 도구를 유지하되 오래된 정의를 임의 복원하지 않는다. |
| compact/resume | 남은 요청 정보로 복원하거나 정상적으로 재검색한다. |
| SSE/JSON, 병렬 호출, 취소, 오류 | 호출/결과 pairing과 기존 응답 계약을 유지한다. |
| native Anthropic, ToolSearch 없는 요청 | 기존 경로와 동작을 유지한다. |

기존 focused test 확장 후보:

- [claude-inbound.test.ts](../../../tests/claude-integration/claude-inbound.test.ts#L1)
- [claude-outbound.test.ts](../../../tests/claude-integration/claude-outbound.test.ts#L1)
- [claude-compatibility.test.ts](../../../tests/claude-integration/claude-compatibility.test.ts#L1)
- [claude-messages-endpoint.test.ts](../../../tests/claude-integration/claude-messages-endpoint.test.ts#L1)
- [openai-responses-passthrough.test.ts](../../../tests/responses/openai-responses-passthrough.test.ts#L1)
- [responses-tool-search-repair.test.ts](../../../tests/responses/responses-tool-search-repair.test.ts#L1)

같은 합성 도구 목록으로 전체 로딩과 지연 로딩을 비교한다. 전송 body의 스키마 집합,
가능하면 upstream 입력 토큰 사용량까지 확인한다. 본문 byte 감소만으로 실제 모델
컨텍스트 절약을 확정하지 않고, 검색 왕복 비용과 prompt cache 영향도 별도로 기록한다.

구현 중에는 해당 focused tests와 typecheck, 변경 범위에 맞는 `test:changed`를 실행한다.
새 테스트 파일이 필요하면 test-layout 등록도 함께 한다. PR review-ready 전에는
저장소 규칙의 전체 테스트 게이트를 따른다. 이 문서는 그 검증을 실행한 기록이 아니다.

## 7. 구현 전에 남은 결정

- 사용 중인 Claude Code 버전의 ToolSearch가 위 client-executed 계약에 해당하는가?
- Codex Auth upstream에는 native deferred 표현과 활성 도구만 보내는 표현 중 어느 쪽이
  호출 정확성·토큰 절약·이력 재생을 함께 만족하는가?
- 지원되지 않는 요청 형태의 처리는 기존 shadow/enforce 정책 안에서 어떻게 표현할 것인가?

컨텍스트 확장 제안과 독립적으로 구현·검증할 수 있어야 한다. 큰 window를 제공해
전체 도구 로딩 비용을 숨기는 것은 이 요구사항의 해결로 보지 않는다.
