# 스텝 분리(액션/시나리오) 판정·분해 계약

## 목표
한 스텝의 `result_state` 안에 **서로 다른 사용자 액션 또는 시나리오**가 섞여 있으면,
"한 스텝 = 한 목적" 원칙에 맞게 스텝을 분리한다. 단, **과분해를 엄격히 금지**한다.

## 분리해야 하는 경우 (SPLIT)
- 서로 다른 **사용자 조작**이 순차로 있는 경우:
  예) "다운로드 시 …", "전달(공유) 시 …" → 다운로드 시도 / 전달 시도 = 별개 액션
  예) "재시도 시 …", "삭제 시 …" → 재시도 / 삭제 = 별개 액션
  예) 원본 절차가 여러 조작(전송 → 확인 → 편집)인데 한 스텝에 뭉친 경우
- 즉, **각 조각이 자기만의 액션(TAP/INPUT/LONG_PRESS 등)을 요구**하면 분리.

## 분리하면 안 되는 경우 (KEEP) — 매우 중요
- **단일 화면의 여러 UI 요소 확인**(관찰 1회):
  예) "상단에 뒤로가기·채팅방명·검색·사이드메뉴 아이콘이 노출됨" → 목적은 '상단 렌더 확인' 하나. 유지.
- **OS 분기**("Android: … / iOS: …") → 같은 검증의 플랫폼 변형. 유지.
- **조건 분기**("생일자 1명: … / 0명: …", "이력 있음/없음") → 같은 검증의 조건 변형. 유지.
- **한 액션의 여러 결과 속성**(전송됨 + 유효기간 표시 + 용량 표시) → 액션 1개. 유지.

판단 기준: "이 조각들이 **각각 다른 조작(action)** 을 필요로 하는가?" YES → SPLIT, NO → KEEP.

## 입력 (스텝 하나)
```
{ new_tc_id, step_no, title, action, action_parameter, target, target_name,
  target_parameter, start_screen, result_screen, original_step_text, tc_purpose,
  current_result_state }
```

## 출력 (스텝 하나)
```json
{ "new_tc_id":"CHAT_NEW_0464", "step_no":1, "decision":"split",
  "substeps":[
    {"action":"TAP","action_parameter":{"scenario":"다운로드 시도"},
     "result_state":"신뢰할 수 없는 파일 경고 얼럿이 노출됨 - \"친구가 아닌 사용자가 보낸 파일은 안전하지 않을 수 있습니다. 다운로드하시겠습니까?\""},
    {"action":"TAP","action_parameter":{"scenario":"전달(공유) 시도"},
     "result_state":"신뢰할 수 없는 파일 경고 얼럿이 노출됨 - \"친구가 아닌 사용자가 보낸 파일은 안전하지 않을 수 있습니다. 공유하시겠습니까?\""}
  ]
}
```
KEEP 인 경우:
```json
{ "new_tc_id":"CHAT_NEW_0001", "step_no":1, "decision":"keep", "substeps":[] }
```

## 규칙
1. **기본값은 KEEP**. 확실히 서로 다른 액션일 때만 SPLIT. 애매하면 KEEP.
2. SPLIT 시 substeps 는 2개 이상. 각 substep:
   - `action`: 다음 중 하나 — TAP, DOUBLE_TAP, LONG_PRESS, INPUT, CLEAR, SWIPE, SCROLL, DRAG,
     SELECT, BACK, WAIT, OPEN, CLOSE, SWITCH, VERIFY. (원 스텝 action 을 기준으로, 조작이 다르면 맞게.)
   - `action_parameter`: 그 substep 을 구분하는 시나리오/값. 객체(JSON) 또는 문자열. 없으면 "해당없음".
   - `result_state`: 그 substep 의 결론적 검증문(따옴표 실측 문구 원문 보존).
   - target/화면은 원 스텝 값을 그대로 상속하므로 substep 에 넣지 않는다.
3. OS/조건 분기는 substep 으로 쪼개지 말 것(그대로 한 result_state 안에 유지 = KEEP).
4. 없는 조작/검증을 지어내지 말 것. 원본(original_step_text, tc_purpose, current_result_state)에
   근거가 있는 분리만.
5. result_state 는 절대 빈 문자열 금지.

## 출력 형식
`{"results":[ <스텝 판정>, ... ]}` — 입력 배치의 모든 스텝을 순서대로 포함(KEEP 도 반드시 포함).
