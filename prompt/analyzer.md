==================================================
Excel 구조 해석 규칙
==================================================

이 Excel은 사람이 관리하는 Regression TestCase 문서입니다.

분류 컬럼은 계단식(Hierarchical) 구조로 작성되어 있습니다.
같은 기능에 속하는 TC는 첫 번째 행에만 분류값이 입력되고,
이후 행은 해당 셀을 비워 둡니다.

빈 셀은 "값이 없음"이 아니라 "바로 위 행의 값을 상속"합니다.

따라서 분석 전에 반드시 Forward Fill(아래 방향 채우기)을 적용하세요.

예시 — 원본:
  분류1     분류2
  친구      친구추가
  (빈칸)    (빈칸)
  (빈칸)    프로필

Forward Fill 후:
  친구      친구추가
  친구      친구추가
  친구      프로필

모든 통계와 분류는 복원된 데이터를 기준으로 계산하세요.


==================================================
분석 대상 시트
==================================================

input/Regression TestCase.xlsx의 아래 시트를 분석합니다.

1.가입 / 2.친구 / 3.프로필 / 4.채팅목록 / 5.일반채팅 / 6.비밀채팅 /
7.팀채팅_채팅방 / 8.팀채팅_홈상세 / 9.숏폼 / 10.통화 / 11.톡뮤직 /
12.이모티콘플러스(+키보드) / 13.검색 / 14.이모티콘스토어 / 15. 알림센터 /
16.톡클라우드_연락처 / 17.지갑 / 18.톡캘린더 / 19.톡클라우드_백복(로직) /
20.톡클라우드_인물분류 / 21.톡클라우드_버티컬(무료) / 22.톡클라우드_버티컬(유료) /
23.죠르디 / 24. 더보기 / 25. 설정 / 26.기타 / 27.카나나템플릿

시트 이름 앞의 번호는 서비스 순서이며 임의로 변경하지 않습니다.


==================================================
컬럼 매핑 (전 시트 공통)
==================================================

| 컬럼 인덱스 | 헤더명             | 비고                                |
|------------|-------------------|-------------------------------------|
| 0          | 분류1             | Forward Fill 적용                   |
| 1          | 분류2             | Forward Fill 적용                   |
| 2          | 분류3             | Forward Fill 적용                   |
| 3          | 분류4 (기능)       | Forward Fill 적용                   |
| 4          | 사전 조건         |                                     |
| 5          | Test Step         |                                     |
| 6          | 기대결과          |                                     |
| 27         | Priority (P)      | 0~5 정수, `-`=없음, 기타=집계/헤더행 |
| 28         | OS Category (C)   | A=Android, I/iOS=iOS, app=공통      |
| 29         | Version (V)       | 버전 문자열                         |

헤더 행: 행2 (0-based index 1) — 데이터는 행5(index 4)부터 시작
(단, 시트별로 담당자 안내 행이 1행에 있는 경우 포함)


==================================================
TC 판별 규칙 (2단계)
==================================================

Step 1 — 통계 영역 경계 감지
  분류1(col0)에 "행 추가시 이 라인 위 영역을 선택하고..." 문자열이 나타나면
  해당 행과 이후 모든 행은 통계 영역으로 간주해 분석에서 제외합니다.

Step 2 — 개별 행 판별 (경계 이전 행에 적용)

  TC로 인정하는 조건 (모두 충족해야 함):
    1. 기대결과(col6) 비어있지 않음
    2. Priority(col27) 정수 0~5 범위
    3. Test Step(col5) 또는 분류(col0~3) 중 하나 이상 존재

  TC로 인정하지 않는 경우 (제외 사유):
    - STAT_BOUNDARY : 경계 마커 이후 행 (통계/집계 영역)
    - STAT_ROW      : 기대결과 컬럼에 통계 키워드가 있는 행
                      (OS / Browser, Iteration, 환경(테스트 수행),
                       Priority, 범위 지정, Pass Rate, Total, 비율,
                       p, f, b, n, nr 등)
    - NO_PRIORITY   : Priority 비어있거나 '-'
    - INVALID_PRIORITY : Priority 비정수 또는 0~5 범위 밖
    - NO_EXPECTED   : 기대결과 공란
    - NO_CONTENT    : Test Step과 분류 모두 없음
    - EMPTY_ROW     : 완전 공백 행


==================================================
0. 구현 원칙
==================================================

Phase 단위로 나누어 구현합니다. 현재 구현 완료 Phase: 1, 2, 3

## Phase 1 — 기본 집계
- TC 판별 및 집계 (Priority / OS / 분류체계)
- Forward Fill 적용
- 출력: tc_master.csv, service_summary.csv, category_summary.csv,
        coverage.json, summary.md

## Phase 2 — TC 속성 자동 분류
- 검증 대상 속성 10종 자동 태깅 (복수 태깅 가능)
- 복합 속성 조합(compound_attribute) 계산
- 사전조건 자동 추출 (기대결과/Step 내 조건 분기 패턴)
- 출력: attribute_summary.csv, service_summary.csv 속성 컬럼 추가,
        coverage.json attributes + compound_attributes 추가

## Phase 3 — 품질 점검
- 8가지 품질 이슈 탐지
- 출력: quality_issues.csv, coverage.json quality 블록 추가,
        summary.md 갱신

## Phase 4 (미구현)
- recommendations.md


==================================================
1. TC 속성 분류 (Phase 2)
==================================================

분석 대상 컬럼: 사전조건(col4) + Test Step(col5) + 기대결과(col6)

A. 검증 대상 속성 (10종, 복수 태깅 가능)

1. UI 노출 확인 (ui_visibility)
   노출됨, 표시됨, 화면 진입, 문구 표시, 아이콘 표시, 배너가 표시 등

2. 데이터 변경 확인 (data_change)
   변경됨, 저장됨, 추가됨, 삭제됨, 수정됨, 반영됨, 생성됨, 해제됨 등

3. 기능 동작 확인 (function_behavior)
   이동됨, 실행됨, 전송됨, 검색됨, 진입됨, 전환됩니다, 랜딩됩니다 등

4. 권한/인증 확인 (permission_auth)
   권한, 허용, 거부, 로그인, 인증, 약관, 동의 등

5. 예외/에러 확인 (exception_error)
   실패, 오류, 에러, 불가, 제한, 차단, 팝업이 표시, 안내 등

6. 네트워크/서버 연동 (network_server)
   서버, API, 네트워크, 동기화, 폴링, 응답, 재시도, 로딩, TMS 등

7. 알림/푸시 확인 (notification)
   푸시, 알림, 배지, 토스트, 팝업, N뱃지, 빨간점, 모달 등

8. 멀티디바이스/OS 차이 (multi_device_os)
   Android, iOS, 기기, 디바이스, 서브디바이스 등

9. 설정/상태 유지 (state_persistence)
   유지, 재실행, 백그라운드, 복귀, 캐시, 이전 상태 등

10. 콘텐츠/미디어 확인 (content_media)
    이미지, 사진, 동영상, 파일, 썸네일, 이모티콘, 미디어 등

B. 테스트 조건 속성 (3종)

- 사전조건 있음 (has_precondition)
  사전조건 컬럼 또는 기대결과/Step에서 추출된 조건이 있는 경우
  
- 자동화 후보 (automation_candidate)
  기대결과가 명확한 키워드 포함 + 모호 표현 없음

- 수동 확인 필요 (manual_required)
  시각적, 자연스럽게, 음성 확인, 카메라 등 자동화 어려운 케이스

C. 복합 속성 (compound_attribute)
  검증 대상 속성 10종 중 2개 이상 활성화된 경우
  예: "UI노출확인+기능동작확인"

D. 사전조건 자동 추출
  precondition 컬럼이 비어있고 기대결과 또는 Step에
  "~ 인 경우\n  ㄴ ..." 형태의 조건 분기 패턴이 있으면
  해당 조건 줄을 추출해 precondition에 자동 기입


==================================================
2. 품질 점검 기준 (Phase 3)
==================================================

1. Test Step 모호 (ambiguous_test_step)
   - Step이 비어있는 경우
   - 목적어 없이 동사 단독 ("확인한다", "수행한다" 등 완전 일치)
   - 모호한 구문 포함 ("정상 동작 확인" 등)

2. 기대결과 모호 (ambiguous_expected_result)
   - 기대결과가 비어있는 경우
   - 기대결과 전체가 "정상 노출", "정상 동작" 등 모호 단어만으로 구성

3. 사전조건 누락 (missing_precondition)
   - 기대결과 내 조건 분기 패턴 ("기존 설정이 ~ 인 경우") 존재하고 사전조건 없음
   - Step/기대결과에 사전 상태 키워드가 있고 사전조건 없음
   ※ 기대결과/Step에서 자동 추출한 사전조건이 있으면 이슈 없음

4. Step ≈ Expected 중복 (duplicated_step_expected)
   공백 제거 후 유사도 85% 이상

5. 복수 목적 혼재 (multiple_purpose)
   판단 기준:
   - Step 4단계 이상 AND 기대결과 4단계 이상
   - compound_attribute 있음 → 목적 명확히 분류됨 → 이슈 아님
   - compound_attribute 없음 + 경계값 테스트 패턴
     (단계들의 과반수에 공통 의미 단어 2개 이상) → 이슈 아님
   - 위 조건 모두 해당 없음 → 이슈

6. Priority 이상값 (invalid_priority)
   TC 판별을 통과했으나 normalize 결과가 empty/other

7. OS 이상값 (invalid_os)
   android, ios, common, web, pc 이외의 값

8. 분류 누락/불일치 (invalid_category)
   분류1 또는 분류2가 비어있는 경우


==================================================
3. 출력 파일 구조
==================================================

Phase 1:
  output/tc_master.csv
    컬럼: service_name, row_number, category_1~4, precondition,
          test_step, expected_result, priority, priority_raw,
          os, os_raw, version, compound_attribute,
          [속성 플래그 13개: ui_visibility ... manual_required]

  output/service_summary.csv
    컬럼: service_name, total_tc, p0~p5_count, priority_empty_count,
          priority_other_count, android_count, ios_count, common_count,
          web_count, pc_count, os_empty_count, os_other_count,
          [속성 count 13개]

  output/category_summary.csv
    컬럼: service_name, category_1~4, tc_count

  output/coverage.json
    구조: total_tc, services[].{service_name, total_tc, priority, os,
          attributes, compound_attributes, quality}

  output/summary.md
    내용: TC 판별 통계, 서비스별 TC 수, Priority 분포, OS 분포,
          TC 속성 분포, 복합 속성, 품질 점검 결과

Phase 2:
  output/attribute_summary.csv
    컬럼: service_name, attribute_name, tc_count, ratio
    ※ attribute_name: 단일 속성 키 또는 "compound:조합명"

Phase 3:
  output/quality_issues.csv
    컬럼: service_name, row_number, issue_type, issue_reason,
          priority, os, category_path, test_step, expected_result

Phase 4 (미구현):
  output/recommendations.md


==================================================
4. Priority 표기 원칙
==================================================

- Priority는 원본 값 기준으로 집계합니다.
- P0+P1 합산 같은 파생 지표는 summary에 포함하지 않습니다.
- 존재하는 Priority 값만 표시합니다.
  예: 1.가입 시트에 P1, P3만 있으면 P1: 102, P3: 194 만 표시


==================================================
5. 분석 원칙
==================================================

- 단순 문자열 매칭만 하지 말고 문맥을 함께 판단하세요.
- TC 속성은 복수 태깅 가능합니다.
- 통계는 반드시 원본 TC 수와 합계가 맞는지 검증하세요.
- "템플릿", "카나나", "채팅", "프로필", "친구" 등
  카카오톡 서비스 용어는 임의로 바꾸지 마세요.
- 시트 이름 앞의 숫자는 서비스 순서로 유지하세요.
