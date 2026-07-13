"""
기존 output/ CSV → Supabase 업로드 전용 스크립트
실행: python upload_to_db.py

documents 테이블에 이미 id=1 이 있으므로 DOCUMENT_ID=1 로 업로드합니다.
"""

import os, csv, json, urllib.request, urllib.error, ssl

# macOS Python 3.13 SSL 인증서 문제 우회
_ssl_ctx = ssl.create_default_context()
_ssl_ctx.check_hostname = False
_ssl_ctx.verify_mode = ssl.CERT_NONE

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR  = os.path.join(BASE_DIR, 'output')
SUPA_URL    = 'https://fnuvsxkytoycdhgkqykw.supabase.co'
SUPA_KEY    = 'sb_publishable_H_fiKjJsX13kBe9dM3Y6vg_r-QEnHgt'
DOCUMENT_ID = 1
BATCH       = 500

def headers(prefer='return=minimal'):
    return {
        'apikey':        SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Content-Type':  'application/json',
        'Prefer':        prefer,
    }

def post(table, rows, upsert_on=None):
    if not rows:
        print(f'  [{table}] 행 없음, 건너뜀')
        return
    url = SUPA_URL + '/rest/v1/' + table
    if upsert_on:
        url += '?on_conflict=' + upsert_on
        pref = 'resolution=merge-duplicates,return=minimal'
    else:
        pref = 'return=minimal'
    h = headers(pref)
    total = len(rows)
    for i in range(0, total, BATCH):
        chunk = rows[i:i+BATCH]
        body  = json.dumps(chunk, ensure_ascii=False, default=str).encode()
        req   = urllib.request.Request(url, data=body, headers=h, method='POST')
        try:
            with urllib.request.urlopen(req, timeout=30, context=_ssl_ctx) as r:
                r.read()
            print(f'  [{table}] {min(i+BATCH, total)}/{total}', end='\r')
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', errors='replace')
            raise RuntimeError(f'[{table}] HTTP {e.code}: {msg}')
    print(f'  [{table}] {total}/{total} 완료          ')

def read_csv(filename):
    path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(path):
        print(f'  파일 없음: {path}')
        return []
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def v(d, k):
    val = d.get(k, '') or ''
    return val.strip() or None

def vi(d, k):
    val = d.get(k, '')
    try:    return int(float(val)) if val and str(val).strip() else None
    except: return None

# ── 1. coverage_service ──────────────────────────────────────────────────────
print('\n[1/4] coverage_service 업로드...')
with open(os.path.join(OUTPUT_DIR, 'coverage.json'), encoding='utf-8') as f:
    cov = json.load(f)

cov_rows = []
for s in cov.get('services', []):
    q = s.get('quality') or {}
    cov_rows.append({
        'document_id':          DOCUMENT_ID,
        'service_name':         s['service_name'],
        'total_tc':             s['total_tc'],
        'first_row':            s.get('first_row'),
        'last_row':             s.get('last_row'),
        'priority_dist':        s.get('priority')             or {},
        'os_dist':              s.get('os')                   or {},
        'attributes':           s.get('attributes')           or {},
        'precond_distribution': s.get('precond_distribution') or {},
        'issue_count':          q.get('issue_count',       0),
        'affected_tc_count':    q.get('affected_tc_count', 0),
        'issue_type_counts':    q.get('issue_type_counts') or {},
    })
post('coverage_service', cov_rows, 'document_id,service_name')

# ── 2. tc_master ─────────────────────────────────────────────────────────────
print('\n[2/4] tc_master 업로드...')
tc_rows = []
for r in read_csv('tc_master.csv'):
    tc_rows.append({
        'document_id':          DOCUMENT_ID,
        'service_name':         v(r, 'service_name'),
        'row_number':           vi(r, 'row_number'),
        'category_1':           v(r, 'category_1'),
        'category_2':           v(r, 'category_2'),
        'category_3':           v(r, 'category_3'),
        'category_4':           v(r, 'category_4'),
        'precondition':         v(r, 'precondition'),
        'test_step':            v(r, 'test_step'),
        'expected_result':      v(r, 'expected_result'),
        'priority':             v(r, 'priority'),
        'priority_raw':         v(r, 'priority_raw'),
        'os':                   v(r, 'os'),
        'os_raw':               v(r, 'os_raw'),
        'version':              v(r, 'version'),
        'compound_attribute':   v(r, 'compound_attribute'),
        'precond_categories':   v(r, 'precond_categories'),
        'ui_visibility':        vi(r, 'ui_visibility')        or 0,
        'data_change':          vi(r, 'data_change')          or 0,
        'function_behavior':    vi(r, 'function_behavior')    or 0,
        'permission_auth':      vi(r, 'permission_auth')      or 0,
        'exception_error':      vi(r, 'exception_error')      or 0,
        'network_server':       vi(r, 'network_server')       or 0,
        'notification':         vi(r, 'notification')         or 0,
        'multi_device_os':      vi(r, 'multi_device_os')      or 0,
        'state_persistence':    vi(r, 'state_persistence')    or 0,
        'content_media':        vi(r, 'content_media')        or 0,
        'has_precondition':     vi(r, 'has_precondition')     or 0,
        'automation_candidate': vi(r, 'automation_candidate') or 0,
        'manual_required':      vi(r, 'manual_required')      or 0,
    })
post('tc_master', tc_rows, 'document_id,service_name,row_number')

# ── 3. quality_issues ────────────────────────────────────────────────────────
print('\n[3/4] quality_issues 업로드...')
qi_rows = []
for r in read_csv('quality_issues.csv'):
    qi_rows.append({
        'document_id':   DOCUMENT_ID,
        'service_name':  v(r, 'service_name'),
        'row_number':    vi(r, 'row_number'),
        'issue_type':    v(r, 'issue_type'),
        'issue_reason':  v(r, 'issue_reason'),
        'priority':      v(r, 'priority'),
        'os':            v(r, 'os'),
        'category_path': v(r, 'category_path'),
        'test_step':     v(r, 'test_step'),
        'expected_result': v(r, 'expected_result'),
    })
post('quality_issues', qi_rows)

# ── 4. ai_standard_tc ────────────────────────────────────────────────────────
print('\n[4/4] ai_standard_tc 업로드 (101,704행 — 가장 오래 걸림)...')
ai_rows = []
for r in read_csv('ai_standard_tc.csv'):
    ai_rows.append({
        'document_id':        DOCUMENT_ID,
        'service_name':       v(r, 'service_name'),
        'row_number':         vi(r, 'row_number'),
        'orig_cat1':          v(r, 'orig_cat1'),
        'orig_cat2':          v(r, 'orig_cat2'),
        'orig_cat3':          v(r, 'orig_cat3'),
        'orig_cat4':          v(r, 'orig_cat4'),
        'orig_precond':       v(r, 'orig_precond'),
        'orig_step':          v(r, 'orig_step'),
        'orig_expected':      v(r, 'orig_expected'),
        'orig_priority':      v(r, 'orig_priority'),
        'ai_cat1':            v(r, 'ai_cat1'),
        'ai_cat2':            v(r, 'ai_cat2'),
        'ai_cat3':            v(r, 'ai_cat3'),
        'ai_cat4':            v(r, 'ai_cat4'),
        'ai_precond':         v(r, 'ai_precond'),
        'ai_step':            v(r, 'ai_step'),
        'ai_expected':        v(r, 'ai_expected'),
        'ai_priority':        v(r, 'ai_priority'),
        'precond_norm_type':  v(r, 'precond_norm_type'),
        'precond_evidence':   v(r, 'precond_evidence'),
        'step_norm_type':     v(r, 'step_norm_type'),
        'step_reason':        v(r, 'step_reason'),
        'expected_norm_type': v(r, 'expected_norm_type'),
        'expected_reason':    v(r, 'expected_reason'),
        'quality_issues':     v(r, 'quality_issues'),
        'original_intent':    v(r, 'original_intent'),
        'ai_intent':          v(r, 'ai_intent'),
        'final_check_point':  v(r, 'final_check_point'),
        'meaning_match_pct':  vi(r, 'meaning_match_pct'),
        'meaning_status':     v(r, 'meaning_status'),
        'sem_reason':         v(r, 'sem_reason'),
        'ctx_feature':        v(r, 'ctx_feature'),
        'ctx_screen':         v(r, 'ctx_screen'),
        'ctx_scenario':       v(r, 'ctx_scenario'),
        'ctx_user_goal':      v(r, 'ctx_user_goal'),
        'ctx_flow_position':  v(r, 'ctx_flow_position'),
        'norm_summary':       v(r, 'norm_summary'),
    })
post('ai_standard_tc', ai_rows, 'document_id,service_name,row_number')

print('\n✅ 모든 업로드 완료!')
print(f'   coverage_service : {len(cov_rows)}행')
print(f'   tc_master        : {len(tc_rows)}행')
print(f'   quality_issues   : {len(qi_rows)}행')
print(f'   ai_standard_tc   : {len(ai_rows)}행')
