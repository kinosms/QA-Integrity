# Integrity Dashboard — 전체 정책 문서

이 문서는 QA-Integrity 프로젝트의 분석 정책, 출력 파일 구조, Dashboard 정책,
Excel Export 정책, 공식 용어 정의를 모두 포함합니다.
새 세션에서 작업을 이어받을 때 이 문서를 기준으로 삼습니다.

---

## 프로젝트 개요

- **목적**: 원본 TC를 AI가 분석·정규화하여 자동화 적합 표준 TC로 변환하고,
  사람이 그 결과를 검수할 수 있도록 하는 Explainable AI 기반 QA 도구
- **입력**: `input/Regression TestCase.xlsx`
- **출력**: `output/` 디렉터리의 CSV/JSON/MD 파일 + `dashboard/` + `output/ai_review.xlsx`
- **구현 상태**: Phase 1·2·3·4(A·B·C) 완료

---

## 공식 용어 정의 (Glossary)

모든 화면(Dashboard, Excel)에서 동일한 용어를 사용합니다.

| 용어 | 정의 |
|---|---|
| **Original TC** | 원본 테스트케이스. 절대 수정하지 않음 |
| **AI Standard TC** | AI가 의미를 유지한 채 자동화 적합하도록 정규화한 최종 TC. TC 값만 포함, 설명 없음 |
| **AI Analysis** | AI가 어떻게 해석하고 왜 수정했는지 설명하는 분석 영역 |
| **Normalization Type** | AI가 Original → Standard TC로 만드는 과정에서 수행한 정규화 작업 유형 (기존 "보정 유형" 용어 폐기) |
| **Original Intent** | Original TC가 궁극적으로 무엇을 검증하는지 AI가 해석한 테스트 목적 |
| **AI Intent** | AI Standard TC의 테스트 목적. Original Intent와 동일해야 함 |
| **Final Check Point** | 이 TC에서 최종 Pass/Fail을 결정하는 확인 사항 한 문장 |
| **Semantic Validation** | Original TC와 AI Standard TC가 동일한 테스트 목적을 유지했는지 검증하는 영역 |

**Normalization Type 예시:**
표현 표준화 / 문맥 보완 / 사전조건 추론 / 기대결과 명확화 / 수행 절차 재구성 / 분류 보완

---

## 분석 대상 시트

`input/Regression TestCase.xlsx`의 아래 27개 시트:

```
1.가입 / 2.친구 / 3.프로필 / 4.채팅목록 / 5.일반채팅 / 6.비밀채팅 /
7.팀채팅_채팅방 / 8.팀채팅_홈상세 / 9.숏폼 / 10.통화 / 11.톡뮤직 /
12.이모티콘플러스(+키보드) / 13.검색 / 14.이모티콘스토어 / 15. 알림센터 /
16.톡클라우드_연락처 / 17.지갑 / 18.톡캘린더 / 19.톡클라우드_백복(로직) /
20.톡클라우드_인물분류 / 21.톡클라우드_버티컬(무료) / 22.톡클라우드_버티컬(유료) /
23.죠르디 / 24. 더보기 / 25. 설정 / 26.기타 / 27.카나나템플릿
```

시트 이름 앞의 숫자는 서비스 순서이며 임의로 변경하지 않습니다.

---

## Excel 구조 해석 규칙

### 컬럼 매핑 (전 시트 공통)

| 컬럼 인덱스 | 헤더명 | 비고 |
|---|---|---|
| 0 | 분류1 | Forward Fill 적용 |
| 1 | 분류2 | Forward Fill 적용 |
| 2 | 분류3 | Forward Fill 적용 |
| 3 | 분류4(기능) | Forward Fill 적용 |
| 4 | 사전 조건 | |
| 5 | Test Step | |
| 6 | 기대결과 | |
| 27 | Priority(P) | 0~5 정수, `-`=없음, 기타=집계/헤더행 |
| 28 | OS Category(C) | A=Android, I/iOS=iOS, app=공통 |
| 29 | Version(V) | 버전 문자열 |

헤더 행: 행2 — 데이터는 행5부터 시작

### Forward Fill

분류 컬럼은 계단식 구조로, 첫 행에만 값이 입력되고 이후 행은 비어있음.
분석 전에 반드시 Forward Fill(아래 방향 채우기) 적용.

---

## TC 판별 규칙

### Step 1 — 통계 영역 경계 감지

분류1(col0)에 `"행 추가시 이 라인 위 영역을 선택하고..."` 문자열이 나타나면
해당 행과 이후 모든 행은 통계 영역으로 간주해 분석에서 **완전 제외**.

### Step 2 — 개별 행 판별

**TC로 인정하는 조건 (모두 충족):**
1. 기대결과(col6) 비어있지 않음
2. Priority(col27) 정수 0~5 범위
3. Test Step(col5) 또는 분류(col0~3) 중 하나 이상 존재

**제외 사유 분류:**
| 코드 | 설명 |
|---|---|
| STAT_BOUNDARY | 경계 마커 이후 행 |
| STAT_ROW | 기대결과 컬럼에 통계 키워드(OS/Browser, Pass Rate, Total 등) |
| NO_PRIORITY | Priority 비어있거나 '-' |
| INVALID_PRIORITY | Priority 비정수 또는 0~5 범위 밖 |
| NO_EXPECTED | 기대결과 공란 |
| NO_CONTENT | Test Step과 분류 모두 없음 |
| EMPTY_ROW | 완전 공백 행 |

---

## 구현 Phase 구조

### Phase 1 — 기본 집계 ✅

- TC 판별 및 집계 (Priority / OS / 분류체계)
- Forward Fill 적용
- 출력 파일:
  - `tc_master.csv` — 전체 TC 행 (속성 플래그 포함)
  - `service_summary.csv` — 서비스별 집계
  - `category_summary.csv` — 분류체계 집계
  - `coverage.json` — 대시보드용 JSON
  - `summary.md` — 전체 요약

### Phase 2 — TC 속성 자동 분류 ✅

- 검증 대상 속성 10종 자동 태깅 (복수 태깅 가능)
- 복합 속성 조합(compound_attribute) 계산
- 사전조건 자동 추출 (기대결과/Step 내 조건 분기 패턴)
- 출력 파일:
  - `attribute_summary.csv` — 단일/복합 속성 분포
  - `tc_master.csv`에 속성 플래그 컬럼 추가
  - `coverage.json`에 attributes + compound_attributes 추가

### Phase 3 — 품질 점검 ✅

- 8가지 품질 이슈 탐지
- 출력 파일:
  - `quality_issues.csv` — 이슈 목록
  - `coverage.json`에 quality 블록 추가

### Phase 4-A — 사전조건 AI 분석 (규칙 기반) ✅

- 17개 사전조건 카테고리 규칙으로 TC 전체 텍스트 분석
- 사전조건 없어도 Step/기대결과/분류에서 필요 상태 추론
- 출력 파일:
  - `precondition_summary.csv` — 서비스×카테고리 분포
  - `precondition_detail.csv` — TC별 추론 상세 (근거·키워드·Confidence 포함)
  - `tc_master.csv`에 `precond_categories` 컬럼 추가
  - `coverage.json`에 `precond_distribution` 블록 추가

### Phase 4-B — TC 문맥 분석 및 절차/기대결과 재구성 ✅

- 기대결과에 섞인 절차를 분리하거나 명확화
- 탐지 패턴:
  - `A - B - C` 형태 경로 → 절차로 이동
  - 행위 동사 종결 문장 → 절차로 이동
  - 상태 표현 → 기대결과 유지
- 재구성 유형:
  - `separated`: 절차/기대결과 분리
  - `clarified`: 기대결과 전체가 절차였음
- 출력 파일: `tc_reconstruction.csv`

### Phase 4-C — Context Linking (문맥 연계 분석) ✅

- Step의 생략 표현("다음 화면", "결과 확인" 등)을 Expected에서 찾아 연결
- 생략 패턴 키워드: 다음_화면, 랜딩_확인, 화면_확인, 팝업_확인, 노출_확인, 동작_확인 등
- 출력 파일: `tc_context_linking.csv`

### Phase 4 공통 — AI Standard TC 데이터 레이어 ✅

**핵심 원칙: Dashboard와 Excel Export는 동일한 데이터(`ai_standard_tc.csv`)를 사용**

- 출력 파일: `ai_standard_tc.csv` (7002행, 30개 컬럼)
- 컬럼 그룹:
  - Original TC: `orig_cat1~orig_priority` (원본 raw 값 그대로)
  - AI Standard TC: `ai_cat1~ai_priority` (TC 값만, 설명 없음)
  - AI Analysis: `precond_norm_type, precond_evidence, step_norm_type, step_reason, expected_norm_type, expected_reason, quality_issues`
  - Intent: `original_intent, ai_intent, final_check_point`
  - Semantic Validation: `meaning_match_pct, meaning_status, sem_reason`

---

## TC 속성 분류 상세 (Phase 2)

분석 대상 컬럼: 사전조건(col4) + Test Step(col5) + 기대결과(col6)

### 검증 대상 속성 (10종)

| 키 | 이름 | 키워드 예시 |
|---|---|---|
| ui_visibility | UI 노출 확인 | 노출됨, 표시됨, 화면 진입 |
| data_change | 데이터 변경 확인 | 변경됨, 저장됨, 추가됨, 삭제됨 |
| function_behavior | 기능 동작 확인 | 이동됨, 전송됨, 전환됩니다 |
| permission_auth | 권한/인증 확인 | 권한, 허용, 로그인, 인증 |
| exception_error | 예외/에러 확인 | 실패, 오류, 제한, 차단 |
| network_server | 네트워크/서버 연동 | 서버, API, 동기화, TMS |
| notification | 알림/푸시 확인 | 푸시, 알림, 배지, 팝업 |
| multi_device_os | 멀티디바이스/OS 차이 | Android, iOS, 기기 |
| state_persistence | 설정/상태 유지 | 유지, 재실행, 백그라운드 |
| content_media | 콘텐츠/미디어 확인 | 이미지, 사진, 동영상 |

### 테스트 조건 속성 (3종)

- `has_precondition`: 사전조건 컬럼 또는 자동 추출 결과가 있는 경우
- `automation_candidate`: 기대결과에 명확한 검증 키워드 포함 + 모호 표현 없음
  - **주의**: 이 수치는 "기대결과 동사 패턴 매칭 통과 비율"이며 실제 자동화 가능성 판단이 아님
  - 자동화 판단 기준이 미확정된 상태 — 추후 기준 정의 후 재계산 필요
- `manual_required`: 시각적, 음성 확인, 카메라 등 자동화 어려운 케이스

### 복합 속성

검증 대상 속성 10종 중 2개 이상 활성화 → `compound_attribute` 필드에 `"UI노출확인+기능동작확인"` 형태로 기록

---

## 품질 점검 기준 (Phase 3)

| 이슈 유형 | 조건 |
|---|---|
| ambiguous_test_step | Step이 비어있거나 목적어 없이 동사 단독 |
| ambiguous_expected_result | 기대결과가 "정상 동작" 등 모호 단어만으로 구성 |
| missing_precondition | 기대결과 내 조건 분기 패턴 존재하고 사전조건 없음 |
| duplicated_step_expected | 공백 제거 후 유사도 85% 이상 |
| multiple_purpose | Step/Expected 모두 4단계 이상 + compound_attribute 없음 + 경계값 패턴도 아님 |
| invalid_priority | normalize 결과 empty/other |
| invalid_os | android, ios, common, web, pc 이외 |
| invalid_category | 분류2가 비어있는 경우 |

**복수 목적 판단 상세:**
1. compound_attribute 있음 → 목적 명확 → **이슈 아님**
2. 단계들의 과반수에 공통 의미 단어 2개 이상 → 경계값 테스트 → **이슈 아님**
3. 위 모두 해당 없음 → **이슈**

---

## Priority 표기 원칙

- **원본 값 기준**으로 집계 (P0+P1 합산 같은 파생 지표 사용 금지)
- 존재하는 Priority 값만 표시 (0건인 값 제외)
- 대시보드 KPI에 "P0+P1 Critical" 표시 제거됨

---

## 출력 파일 전체 목록

| 파일 | Phase | 설명 |
|---|---|---|
| `tc_master.csv` | 1 | TC 전체 (속성 플래그, precond_categories 포함) |
| `service_summary.csv` | 1 | 서비스별 집계 |
| `category_summary.csv` | 1 | 분류체계 집계 |
| `coverage.json` | 1~3 | 대시보드용 JSON (attributes, quality, precond_distribution 포함) |
| `summary.md` | 1~4 | 전체 요약 리포트 |
| `attribute_summary.csv` | 2 | 단일/복합 속성 분포 |
| `quality_issues.csv` | 3 | 품질 이슈 목록 |
| `precondition_summary.csv` | 4-A | 서비스×카테고리 사전조건 분포 |
| `precondition_detail.csv` | 4-A | TC별 사전조건 추론 상세 |
| `tc_reconstruction.csv` | 4-B | 절차/기대결과 재구성 결과 |
| `tc_context_linking.csv` | 4-C | Context Linking 결과 |
| `ai_standard_tc.csv` | 4 | **공통 데이터 레이어** (Dashboard + Excel 공유) |
| `ai_review.xlsx` | 4 | AI 검수용 Excel Export |

---

## Dashboard 정책

### 구조 원칙

- **원본 TC 영역과 AI Standard TC 영역은 항상 1:1 Row Matching 유지**
- 원본 영역: 엑셀 raw 값을 그대로 표시. AI 결과로 절대 덮어쓰지 않음
- AI Standard TC 영역: TC 값만 표시. 설명·분석 내용 포함 금지
- AI Analysis: 별도 패널로 분리
- 사이드바 서비스 필터 → 비교 뷰 이슈 드롭다운 연동 (서비스별 실제 존재 이슈만 표시)

### 비교 뷰 (TC 비교 화면) 구조

```
헤더: 서비스명 · 행번호 · 이슈 뱃지
─────────────────────────────────────
TC 패널 (3열 그리드)
  라벨(75px) │ 원본 TC │ AI Standard TC
  분류1
  분류2
  분류3
  화면전개
  사전조건
  Test Step
  기대결과
  Priority
─────────────────────────────────────
AI Analysis 패널 (변경 있는 경우)
  사전조건 / Test Step / 기대결과별 분석
  Normalization Type 배지 + 근거 + 수정 이유
─────────────────────────────────────
Semantic Validation 패널
  Original Intent │ AI Intent │ Match%
  Final Check Point
  판단 근거
```

### Diff 색상 규칙

| 상황 | 색상 |
|---|---|
| 원본과 동일 | 연한 회색 |
| 빈칸→AI 추가 (보완) | 🟢 초록 |
| 수정 | 🟡 노란 |
| 삭제 | 🔴 빨강 |
| AI 추론 | 🟣 보라 |

### Semantic Validation

- `Meaning Match %`: 원본-AI 핵심 키워드 중복률 (75% 이상 = Preserved)
- `✔ Meaning Preserved` / `✘ Meaning Changed`
- **판단 근거**: 실제 변경 내용 기반으로 생성 (고정 문구 사용 금지)
  - 변경 없음 → "원본과 동일 — Normalization 없음."
  - 변경 있음 → 구체적 내용 기술

### 이슈 설명 문구

각 이슈 유형마다 고정 설명 문구를 헤더 하단에 표시:
- `ambiguous_test_step`: Test Step이 비어 있거나 목적어 없이 동사만으로 구성
- `missing_precondition`: 사전조건이 없으나 특정 상태나 계정이 필요한 것으로 판단
- `invalid_category`: 분류2가 비어 있어 이 TC가 속한 기능 영역을 특정할 수 없음
- (기타 이슈 유형 각각 정의됨)

### 정상 판정 문구

- 이슈 없음 + 복합 속성 있음: `✓ 테스트 목적이 명확하고 실행 및 결과 판단이 가능한 TC입니다.`
- 이슈 없음 + 보완만 있음: `→ 분류 정보가 AI에 의해 자동 보완되었습니다. 내용을 확인해 주세요.`
- 변경 없음: `– 원본 그대로 유지됩니다. 별도 처리가 필요하지 않습니다.`

---

## Excel Export 정책 (`output/ai_review.xlsx`)

### 시트 구성

서비스별 1개 시트 (시트명 = 서비스명)

### 열 구성

| 열 범위 | 그룹 | 내용 |
|---|---|---|
| A~H | Original TC | 원본 값 그대로 |
| J~Q | AI Standard TC | TC 값만 (설명 없음) |
| T~W | AI Analysis | Normalization Type / 근거 / 수정 이유 / 품질 이슈 |
| Z~AB | Intent | Original Intent / AI Intent / Final Check Point |
| AE~AG | Semantic Validation | Match% / Meaning Status / 판단 근거 |

### AI Standard TC 작성 규칙

- 각 셀에는 최종 TC 값만 기록
- 설명·분석 내용 절대 포함 금지
- 원본과 AI가 동일하면 동일하게 표시 (불필요한 변경 없음)

### diff 색상

| 상황 | 배경색 |
|---|---|
| 원본과 동일 | 어두운 기본 배경 |
| 빈칸→AI 추가 | 초록 |
| 수정 | 노랑 |
| 삭제 | 빨강 |
| 추론 (보라) | 보라 |

### Semantic Validation 색상

| Match% | 배경색 |
|---|---|
| ≥ 90% | 초록 |
| 75~89% | 주황 |
| < 75% | 빨강 |

---

## ORIG_MAP 구조

엑셀에서 직접 추출한 원본 raw 값 (AI 처리 전).
Dashboard 비교 뷰의 "원본 TC" 열에 사용.

```
key = "서비스명|엑셀행번호"
value = [cat1_raw, cat2_raw, cat3_raw, cat4_raw,
         precond_raw, step_raw, expected_raw, priority_raw, os_raw]
```

---

## 자동화 후보 수치에 대한 주의

현재 `automation_candidate` 수치(약 17%)는 **실제 자동화 가능 여부가 아님**.
기대결과 문장에 특정 동사 패턴이 있는지만 체크하는 규칙 기반 추정치임.

실제 자동화 가능 여부는 아래 조건을 추가 검토해야 함:
- `manual_required = 0` (시각적 판단 불필요)
- Phase 3 이슈 없음
- 사전조건 카테고리 중 자동 준비 불가 항목 없음 (멀티디바이스, 특정_OS 등)
- OS = common

**자동화 판단 기준 미확정 상태 — 추후 별도 정의 필요**

---

## 분석 원칙

- 단순 문자열 매칭만 하지 말고 문맥을 함께 판단
- TC 속성은 복수 태깅 가능
- 통계는 반드시 원본 TC 수와 합계가 맞는지 검증
- "템플릿", "카나나", "채팅", "프로필", "친구" 등 카카오톡 서비스 용어는 임의로 변경 금지
- 시트 이름 앞의 숫자는 서비스 순서로 유지
- **원본 TC는 어떤 경우에도 AI 결과로 덮어쓰지 않음**
- **Dashboard와 Excel Export는 `ai_standard_tc.csv`를 공통 데이터로 사용 — 내용이 반드시 동일해야 함**

---

## 파일 구조 (프로젝트 루트)

```
qa-analyzer/
├── input/
│   └── Regression TestCase.xlsx
├── output/
│   ├── tc_master.csv              # Phase 1 (속성 포함)
│   ├── service_summary.csv        # Phase 1
│   ├── category_summary.csv       # Phase 1
│   ├── coverage.json              # Phase 1~3
│   ├── summary.md                 # Phase 1~4
│   ├── attribute_summary.csv      # Phase 2
│   ├── quality_issues.csv         # Phase 3
│   ├── precondition_summary.csv   # Phase 4-A
│   ├── precondition_detail.csv    # Phase 4-A
│   ├── tc_reconstruction.csv      # Phase 4-B
│   ├── tc_context_linking.csv     # Phase 4-C
│   ├── ai_standard_tc.csv         # Phase 4 공통 (★ Dashboard + Excel 공유)
│   └── ai_review.xlsx             # Excel Export
├── tools/
│   ├── analyzer.py                # 분석 실행 (Phase 1~4)
│   └── export_excel.py            # Excel Export
├── dashboard/
│   ├── index.html
│   ├── app.js
│   └── style.css
└── prompt/
    └── analyzer.md                # 이 문서
```

---

## 재실행 방법

```bash
# 분석 전체 재실행 (Phase 1~4 모두)
python3 tools/analyzer.py

# Excel Export
python3 tools/export_excel.py

# Dashboard 데이터 갱신 (analyzer.py 실행 후)
# → app.js의 AI_STD / COVERAGE / QI_RAW 등 데이터 블록 재생성 필요
# → tools/export_excel.py 참고하여 Python 스크립트로 교체 가능
```
