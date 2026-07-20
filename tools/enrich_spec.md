# 사전조건/파라미터 강화 추출 계약 (5.일반채팅)

## 목표
각 원본 TC의 **검증목적(expected)** 과 **사전조건(precond)**, **단계(steps) 문장**을 의미 분석하여,
구조화 TC에 필요한 **사전조건(precondition)** 과 **파라미터(parameter)** 를 알맞은 스텝에 부여한다.
원본에 명시된 사전조건이 있으면 반드시 반영하고, 없더라도 검증목적/단계에서 필수 전제(예: 특정 채팅방 종류,
특정 미디어 수신 상태)가 도출되면 추가한다.

## 입력 (TC 하나)
```
{ new_tc_id, cat_path, cat4, precond, steps:[{step_no,text}], expected }
```

## 출력 (TC 하나) — 이 스키마를 정확히 지킬 것
```json
{
  "new_tc_id": "CHAT_NEW_0464",
  "preconditions": [
    {
      "step_no": 1,
      "bucket": "data",
      "state_key": "non_friend_relation",
      "label": "상대가 친구가 아닌(비친구) 관계 상태",
      "evidence": "친구가 아닌 사람과의 1:1 채팅"
    }
  ],
  "parameters": [
    {"step_no": 1, "field": "target_parameter", "value": {"media_type": "파일"}, "evidence": "파일 말풍선 탭"}
  ]
}
```

## 규칙
1. **bucket** 은 `data` | `ui` | `permission` 중 하나. 관계/네트워크/계정/데이터 존재 상태 = `data`,
   화면 진입·모드·설정 UI 상태 = `ui`, OS/앱 권한 = `permission`.
2. **state_key**: `enrich_seed_vocab.json` 의 `seed_states` 에서 의미가 맞는 key 를 **우선 사용**한다.
   맞는 것이 없을 때만 새 `snake_case` key 를 만들되 접두어 `x_` 를 붙인다(예: `x_scroll_lock_on`).
   임의로 변형하지 말고 시드에 있으면 그대로 쓸 것.
3. **label**: 해당 상태의 간결한 한국어 정의(시드에 있으면 시드 label 재사용).
4. **step_no**: 그 사전조건이 성립해야 하는 스텝 번호. TC 공통 전제는 보통 `1`.
   다단계 TC에서 특정 스텝에만 필요한 전제는 해당 스텝 번호로.
5. **evidence**: 판단 근거가 된 원문 조각(precond/step/expected 중에서 짧게 인용).
6. **parameters**: 미디어 타입(사진/동영상/파일/음성), 콘텐츠 타입(스티커/이모티콘/움직이는 스티커 등),
   용량·개수·용량기준, 입력 텍스트 등 **구체 값**이 명시되면 추출한다. `field` 는 `target_parameter`
   또는 `action_parameter`. 없으면 빈 배열.
7. 원본 사전조건 문장에 **OR / 여러 케이스**가 있으면 대표 전제들을 각각 precondition 으로 나열한다.
8. `cat4`(분류4) 에 미디어/콘텐츠 타입이 있으면(예: 사진/동영상) target_parameter 로 승격 고려.
   단, cat_path 맥락과 step 문장이 그 타입과 **모순되면** 넣지 않는다(오분류 방지).
9. 사전조건이 정말 없고 도출도 불가하면 `preconditions: []`. 억지로 만들지 말 것.
10. 확실한 것만. 근거 없는 추측 금지.

## 출력 형식
`{"results": [ <TC 출력>, ... ]}` — 입력 배치의 모든 TC를 순서대로 포함.
```
