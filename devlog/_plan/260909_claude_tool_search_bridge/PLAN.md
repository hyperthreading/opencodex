# Claude ToolSearch 지연로딩 브리지

## 범위와 상태

Claude Code Messages → Responses → Codex Auth 번역 경로에서 client-executed 검색을 지원한다.
context-projection / `[1m]` / H/B/T 진단과는 독립적이며 그 작업을 포함하지 않는다.

- 구현: 요청별 활성 도구 투영, reference 결과 변환, 형식별 compatibility admission.
- 검증: 격리 CLI 계약 확인, production adapter 최종 body 검사, SSE/JSON 숨겨진 도구 guard.
- 미검증: 실제 Codex upstream 수락·토큰 절감, 직접 auto-connect 실행 경로, `ocx claude`를 통한 실제 검색.
- 이 문서는 완료되지 않은 검증을 포함하므로 `_plan`에 유지한다.

## P0 관측

Claude Code **2.1.263**, 임시 HOME/config, 합성 stdio MCP alpha/beta/gamma, loopback mock Messages,
dummy API key, 프로세스 한정 `ENABLE_TOOL_SEARCH=true`로 확인했다. 원본 요청·도구 설명은
저장소에 넣지 않았다. 수동 축약 fixture는 `tests/fixtures/claude-tool-search-client.json`이다.

1. `--bare`: ToolSearch 비활성화, 모든 합성 MCP 도구가 upfront로 선언됨. 검색 성공 근거가 아니다.
2. 격리 일반 CLI: 최초 요청은 일반 `ToolSearch` function과 `defer_loading:true` placeholder만 선언.
   미검색 도구 이름은 system 메시지에 있고 실제 정의는 없다.
3. 검색 후: 선택된 beta 정의가 현재 최상위 tools에 `defer_loading:true`로 추가되고,
   user `tool_result.content`에 `{type:"tool_reference",tool_name:"mcp__synthetic__beta"}`가 온다.
4. 다음 scripted beta 호출이 합성 MCP에서 성공하며 `synthetic-ok` 결과를 재생했다.

이 관측은 CLI 계약 증거다. 실제 LLM의 검색 선택 능력이나 실제 Codex 서비스 수락 증거는 아니다.

## 구현 원칙

`src/claude/tool-discovery.ts`의 순수 analyzer가 현재 선언과 제공된 메시지 이력만 사용한다.

- 일반 function인지 타입과 schema로 확인하되, 검색 의미를 이름/설명으로 추측하지 않는다.
- 현재 nondeferred 도구는 유지한다. 성공한 user result를 앞선 assistant tool_use에 정확한 ID로 연결하고
  그 결과의 protocol-position reference가 현재 선언을 가리킬 때만 도구를 활성화한다.
- 중복 call/result ID, failed/orphan 결과, schema/arguments/텍스트 속 가짜 reference는 활성화 근거가 아니다.
- 현재 schema가 유일한 정의 출처다. 삭제된 도구와 과거 schema를 복구하지 않는다.
- compact/resume으로 검색 이력을 잃으면 재검색한다. 과거 실행 사실만으로 활성화하지 않는다.
- 출력은 현재 선언 순서의 nondeferred + 발견 도구다. 숨겨진 정의와 deferred marker를 upstream에 보내지 않는다.
- reference를 간결한 tool available/unavailable 텍스트로 변환하며 기존 call/result와 text/image를 보존한다.
- 강제 tool_choice가 숨겨진/없는 도구를 선택하면 400. `any`에 활성 도구가 없어도 400.

초기 제안의 `defer_loading` 단순 전달 및 특별한 search 타입 필수 조건은 폐기했다.
client custom function은 기존 `function_call` ↔ `tool_use` 왕복을 그대로 쓴다.
`additional_tools`/native `tool_search_output` 합성, 새 검색엔진·세션 registry·전역 cache는 추가하지 않는다.

## 호환성과 guard

`compatibility.ts`는 feature 감지를 유지하되 구현한 client 형태만 허용한다.
hosted regex/bm25, server-executed 결과, 미구현 deferred carrier는 enforce 거부 / shadow 관찰을 유지한다.
shadow에서도 숨겨진 선언을 전체 공개하지 않는다.

`responses/core.ts`의 기존 최종 wire catalog guard를 translated Anthropic ingress에도 적용한다.
투영된 catalog 밖의 호출은 SSE/JSON 모두 차단한다. native Responses forward 및 native Anthropic
passthrough는 변경하지 않는다. explicit empty catalog도 유지한다.

shape별 admission 판정은 shadow log에서 재생성되는 reason에도 반영한다.
사용자 본문·도구 설명·임의 reason은 로그에 추가하지 않는다.

## 검증

- 기존 Claude inbound/compatibility/endpoint 테스트에 검색 전·후 집합, 실제 CLI 축약 fixture,
  현재 schema, 삭제, 실패·orphan·중복, forced choice, SSE/JSON 왕복을 추가한다.
- endpoint 통합은 실제 Messages → Responses parser → production OpenAI Responses adapter를 지나며
  외부 transport만 mock한다. 최초 ToolSearch만, 검색 후 ToolSearch+beta만 직렬화되는지 검사한다.
- 숨겨진 alpha schema sentinel은 최종 body에 없어야 하며 alpha 호출도 guard에서 실패해야 한다.
- 기존 Responses search/passthrough, Claude outbound, Lab import 경계 및 usage log 회귀를 확인한다.
### 실행 결과 (2026-09-10)

- Claude inbound/outbound/compatibility/endpoint, Responses passthrough/search repair, Lab 경계: **419 pass, 0 fail**.
- fixture 및 shape별 shadow log 보강 후 inbound/compatibility/usage log/request log: **194 pass, 0 fail**.
- 마지막 다중·병렬 검색 및 선택 도구 후속 결과 보강 후 inbound/endpoint: **102 pass, 0 fail**.
- `bun run typecheck`, `bun run privacy:scan`, `git diff --check`: 통과.
- `bun run test:changed`: 로컬 `dev`, `origin/dev`, `upstream/dev`가 없어 비교 ref 해석 단계에서 중단.
  대신 작업 시작 커밋을 지정한 `bun scripts/test.ts --changed=8a32adadd` 실행:
  **13,740 pass, 4 skip, 0 fail — 643 files**, exit 0.
- `bun run --cwd docs-site build`: **425 pages**, 성공. 500 kB 이상 chunk 경고는 있음.
- PR-ready 전체 `bun run test`: 실행하지 않음. 위 변경 영향 suite와 구분한다.

## 남은 실사용 gate

1. 직접 auto-connect와 `ocx claude`에서 동일한 합성 검색→실행→후속턴 확인.
2. 승인된 실제 provider 테스트 환경에서 Codex upstream 수락과 cache/토큰 영향 확인.
3. 실측 없이 byte 감소를 토큰 절감률로 설명하지 않으며 미검증 경로를 지원 검증 완료로 표기하지 않음.
