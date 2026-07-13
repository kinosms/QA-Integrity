-- ================================================================
-- QA Analyzer — Supabase 멀티 문서 지원 마이그레이션
-- Supabase Dashboard > SQL Editor 에서 순서대로 실행하세요.
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- STEP 1. 신규 테이블 생성
-- ────────────────────────────────────────────────────────────────

-- 1-1. documents (문서 레지스트리)
CREATE TABLE documents (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL,
  filename   text NOT NULL UNIQUE,
  total_tc   int  NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1-2. tc_master (TC 목록)
CREATE TABLE tc_master (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id          bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  service_name         text NOT NULL,
  row_number           int  NOT NULL,
  category_1           text,
  category_2           text,
  category_3           text,
  category_4           text,
  precondition         text,
  test_step            text,
  expected_result      text,
  priority             text,
  priority_raw         text,
  os                   text,
  os_raw               text,
  version              text,
  compound_attribute   text,
  precond_categories   text,
  ui_visibility        smallint DEFAULT 0,
  data_change          smallint DEFAULT 0,
  function_behavior    smallint DEFAULT 0,
  permission_auth      smallint DEFAULT 0,
  exception_error      smallint DEFAULT 0,
  network_server       smallint DEFAULT 0,
  notification         smallint DEFAULT 0,
  multi_device_os      smallint DEFAULT 0,
  state_persistence    smallint DEFAULT 0,
  content_media        smallint DEFAULT 0,
  has_precondition     smallint DEFAULT 0,
  automation_candidate smallint DEFAULT 0,
  manual_required      smallint DEFAULT 0,
  UNIQUE (document_id, service_name, row_number)
);
CREATE INDEX tc_master_doc_svc ON tc_master (document_id, service_name);

-- 1-3. quality_issues (품질 이슈)
CREATE TABLE quality_issues (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id     bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  service_name    text NOT NULL,
  row_number      int  NOT NULL,
  issue_type      text NOT NULL,
  issue_reason    text,
  priority        text,
  os              text,
  category_path   text,
  test_step       text,
  expected_result text
);
CREATE INDEX qi_doc_svc ON quality_issues (document_id, service_name);

-- 1-4. ai_standard_tc (AI 분석 결과, 36컬럼)
CREATE TABLE ai_standard_tc (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id          bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  service_name         text NOT NULL,
  row_number           int  NOT NULL,
  -- 원본 TC
  orig_cat1            text,
  orig_cat2            text,
  orig_cat3            text,
  orig_cat4            text,
  orig_precond         text,
  orig_step            text,
  orig_expected        text,
  orig_priority        text,
  -- AI 표준화 결과
  ai_cat1              text,
  ai_cat2              text,
  ai_cat3              text,
  ai_cat4              text,
  ai_precond           text,
  ai_step              text,
  ai_expected          text,
  ai_priority          text,
  -- 분석 메타
  precond_norm_type    text,
  precond_evidence     text,
  step_norm_type       text,
  step_reason          text,
  expected_norm_type   text,
  expected_reason      text,
  quality_issues       text,
  original_intent      text,
  ai_intent            text,
  final_check_point    text,
  meaning_match_pct    int  DEFAULT 100,
  meaning_status       text,
  sem_reason           text,
  -- 컨텍스트
  ctx_feature          text,
  ctx_screen           text,
  ctx_scenario         text,
  ctx_user_goal        text,
  ctx_flow_position    text,
  norm_summary         text,
  UNIQUE (document_id, service_name, row_number)
);
CREATE INDEX ai_std_doc_svc ON ai_standard_tc (document_id, service_name);

-- 1-5. coverage_service (서비스별 집계)
CREATE TABLE coverage_service (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id          bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  service_name         text NOT NULL,
  total_tc             int  NOT NULL DEFAULT 0,
  first_row            int,
  last_row             int,
  priority_dist        jsonb DEFAULT '{}',
  os_dist              jsonb DEFAULT '{}',
  attributes           jsonb DEFAULT '{}',
  precond_distribution jsonb DEFAULT '{}',
  issue_count          int  DEFAULT 0,
  affected_tc_count    int  DEFAULT 0,
  issue_type_counts    jsonb DEFAULT '{}',
  UNIQUE (document_id, service_name)
);

-- ────────────────────────────────────────────────────────────────
-- STEP 2. 기존 tc_reviews 에 document_id 추가
-- ────────────────────────────────────────────────────────────────

-- 2-1. 기존 문서를 documents 테이블에 먼저 등록 (id=1 생성)
INSERT INTO documents (name, filename, total_tc)
VALUES ('Regression TestCase', 'Regression TestCase.xlsx', 7260);

-- 2-2. tc_reviews 에 document_id 컬럼 추가
ALTER TABLE tc_reviews ADD COLUMN document_id bigint REFERENCES documents(id);

-- 2-3. 기존 데이터를 문서 1번으로 귀속
UPDATE tc_reviews SET document_id = 1;

-- 2-4. NOT NULL 설정
ALTER TABLE tc_reviews ALTER COLUMN document_id SET NOT NULL;

-- 2-5. unique 제약 교체 (기존: svc+row → 신규: document_id+svc+row)
--      ※ 아래 tc_reviews_svc_row_number_key 는 실제 제약 이름과 다를 수 있습니다.
--        Supabase > Table Editor > tc_reviews > Constraints 에서 확인 후 교체하세요.
ALTER TABLE tc_reviews DROP CONSTRAINT IF EXISTS tc_reviews_svc_row_number_key;
ALTER TABLE tc_reviews ADD CONSTRAINT tc_reviews_doc_svc_row
  UNIQUE (document_id, svc, row_number);
