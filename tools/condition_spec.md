# result_state 속 조건 → precondition 분리 계약

## 목표
result_state 문장 안에 **결과를 결정하는 gating 조건**(OS, 특정 상황)이 들어 있으면,
그 조건을 **precondition** 으로 분리한다. 결과가 조건값에 따라 갈리면 **케이스(스텝)로 분리**한다.
단, 특정 UI 요소의 **표시 조건**은 gating 이 아니므로 result_state 에 그대로 둔다(오분리 금지).

## gating vs 표시조건 구분 (핵심)
- **gating (분리 대상)**: 그 조건이 TC 전체(또는 스텝) 결과의 성립/분기를 결정.
  - OS별로 결과가 다름: "iOS는 … 미노출", "Android만 …" → OS precondition + 케이스 분리
  - TC 전제 상황: "일반 그룹채팅에서 내가 차단한 경우 …", "등록된 게시물이 있는 경우 [펑] 노출"
    → 해당 상황을 precondition 으로.
- **표시조건 (유지)**: 특정 요소 하나의 노출 규칙. 결과 전체를 가르지 않음.
  - "(iOS) 안읽은 메시지 갯수(안읽은 메시지 있는 경우만)" → 아이콘 표시 규칙. result_state 유지.
  - "공지(있는 경우만 노출)" 같은 부수 요소 조건 → 유지.
- 애매하면 **유지(keep)**.

## 입력 (스텝 하나)
```
{ new_tc_id, step_no, title, os, action, action_parameter, target, target_name,
  precondition_data, precondition_ui, precondition_permission,
  result_screen, current_result_state }
```

## 출력 (스텝 하나) — 셋 중 하나
### 1) 유지
```json
{ "new_tc_id":"...", "step_no":1, "decision":"keep" }
```
### 2) annotate — 조건을 precondition 으로 추가(스텝 분리는 안 함)
```json
{ "new_tc_id":"CHAT_NEW_0018", "step_no":1, "decision":"annotate",
  "add_preconditions":[ {"bucket":"data","state_key":"board_post_exists","label":"등록된 게시물이 존재하는 상태"} ],
  "result_state":"(조건 문구를 뺀, 정리된 결론적 검증문)" }
```
### 3) split — 결과가 조건값에 따라 갈려 케이스(스텝)로 분리
```json
{ "new_tc_id":"CHAT_NEW_0028", "step_no":1, "decision":"split",
  "cases":[
    {"add_preconditions":[{"bucket":"data","state_key":"os_android","label":"Android OS 환경"}],
     "action":"TAP","action_parameter":{"os":"Android"},
     "result_state":"상대방 프로필이 노출되고 [1:1채팅] [통화하기] [페이스톡] [펑](등록된 게시물이 있는 경우) 버튼이 노출됨"},
    {"add_preconditions":[{"bucket":"data","state_key":"os_ios","label":"iOS 환경"}],
     "action":"TAP","action_parameter":{"os":"iOS"},
     "result_state":"상대방 프로필이 노출되나 1:1 채팅방 내에서 탭한 경우 [1:1채팅] 버튼은 미노출됨"}
  ] }
```

## 규칙
1. **기본값 keep.** gating 이 확실할 때만 annotate/split. 표시조건은 유지.
2. OS state_key 는 반드시 다음 표준 사용: iOS=`os_ios`(label "iOS 환경"), Android=`os_android`(label "Android OS 환경").
   bucket 은 항상 `data`.
3. 그 외 조건 state_key 는 의미 있는 snake_case. 기존 강화 사전(enrich_seed_vocab.json)에 맞는 게
   있으면 그 key 재사용(예: board_post_exists, one_on_one_chatroom, blocked_relation). 없으면 새로.
4. split 시:
   - 각 case 는 `add_preconditions`(그 케이스의 조건), `action`, `action_parameter`, `result_state` 를 가짐.
   - 화면/타깃/기존 precondition 은 원 스텝에서 상속되므로 넣지 않는다(add_preconditions 만 추가분).
   - case 는 2개 이상. 공통 결과는 각 case 에 간결히 포함하되 문장 전체 복제는 피한다.
5. annotate/ split 의 result_state 에서 **따옴표 실측 UI 문구는 원문 보존**, 결론형(…됨/노출됨/않음)으로.
   추출한 조건 문구는 result_state 에서 제거하되, 표시조건 문구는 남긴다.
6. 없는 조건/결과 지어내기 금지. result_state 빈 문자열 금지.

## 출력 형식
`{"results":[ <스텝 판정>, ... ]}` — 입력 배치의 모든 스텝을 순서대로(keep 포함).
