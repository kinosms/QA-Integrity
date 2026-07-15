/* =========================================================
   QA Dashboard — app.js  (Phase 1·2·3)
   모든 데이터는 output/ 파일에서 직접 임베드됩니다.
   ========================================================= */

// ── 임베드 데이터 ─────────────────────────────────────────

// output/coverage.json  (Phase 1 + 2 attributes + 3 quality)

// output/tc_master.csv — 컬럼 순서:
//  [0]svc [1]row [2]cat1 [3]cat2 [4]priority [5]os
//  [6]ui_visibility [7]data_change [8]function_behavior [9]permission_auth
//  [10]exception_error [11]network_server [12]notification [13]multi_device_os
//  [14]state_persistence [15]content_media [16]has_precondition
//  [17]automation_candidate [18]manual_required [19]compound_attribute
//  [0]svc [1]row [2]issue_type [3]issue_reason
//  [4]priority [5]os [6]category_path [7]test_step [8]expected_result
const ATTR_KEYS = [
  'ui_visibility','data_change','function_behavior','permission_auth',
  'exception_error','network_server','notification','multi_device_os',
  'state_persistence','content_media','has_precondition',
  'automation_candidate','manual_required',
];
const ATTR_LABELS = {
  ui_visibility:       'UI 노출 확인',
  data_change:         '데이터 변경 확인',
  function_behavior:   '기능 동작 확인',
  permission_auth:     '권한/인증 확인',
  exception_error:     '예외/에러 확인',
  network_server:      '네트워크/서버 연동',
  notification:        '알림/푸시 확인',
  multi_device_os:     '멀티디바이스/OS 차이',
  state_persistence:   '설정/상태 유지 확인',
  content_media:       '콘텐츠/미디어 확인',
  has_precondition:    '사전조건 있음',
  automation_candidate:'자동화 후보',
  manual_required:     '수동 확인 필요',
};
// tc_master 배열에서 속성의 컬럼 인덱스
const ATTR_COL = {
  ui_visibility:6, data_change:7, function_behavior:8, permission_auth:9,
  exception_error:10, network_server:11, notification:12, multi_device_os:13,
  state_persistence:14, content_media:15, has_precondition:16,
  automation_candidate:17, manual_required:18,
};

// ── 품질 이슈 메타데이터 ─────────────────────────────────

const ISSUE_KEYS = [
  'ambiguous_test_step','ambiguous_expected_result','missing_precondition',
  'duplicated_step_expected','multiple_purpose','invalid_priority',
  'invalid_os','invalid_category',
];
const ISSUE_LABELS = {
  ambiguous_test_step:       'Test Step 모호',
  ambiguous_expected_result: '기대결과 모호',
  missing_precondition:      '사전조건 누락',
  duplicated_step_expected:  'Step=Expected 중복',
  multiple_purpose:          '복수 목적 혼재',
  invalid_priority:          'Priority 이상값',
  invalid_os:                'OS 이상값',
  invalid_category:          '분류 누락/불일치',
};
const ISSUE_COLORS = [
  '#f97316','#eab308','#6366f1','#a855f7',
  '#ec4899','#ef4444','#14b8a6','#64748b',
];

// ── 컬러 팔레트 ───────────────────────────────────────────

const P_COLORS = {P0:'#ef4444',P1:'#f97316',P2:'#eab308',P3:'#22c55e',P4:'#3b82f6',P5:'#a855f7'};
const SVC_COLORS = ['#6366f1','#22d3ee','#f97316'];
const ATTR_COLORS = [
  '#6366f1','#22d3ee','#f97316','#ef4444','#22c55e','#a855f7',
  '#ec4899','#14b8a6','#f59e0b','#64748b','#0ea5e9','#84cc16','#e879f9',
];

// ── Supabase 설정 (단일 선언) ──────────────────────────────
const SUPA_URL = 'https://fnuvsxkytoycdhgkqykw.supabase.co';
const SUPA_KEY = 'sb_publishable_H_fiKjJsX13kBe9dM3Y6vg_r-QEnHgt';

// ── 동적 데이터 globals (data_*.js 대체) ──────────────────
let COVERAGE         = { total_tc: 0, services: [], quality: {} };
let TC_RAW           = [];
let QI_RAW           = [];
let AI_STD           = [];           // 비교 뷰에서만 페이지 단위로 사용
let CATEGORY_SUMMARY = [];

// ── 현재 문서 ─────────────────────────────────────────────
let currentDocId = null;

// ── 상태 ─────────────────────────────────────────────────

let currentSvc = 'all';
const PAGE = 20;
let tcPage = 1, qiPage = 1;
let tcFilter  = { priority:'all', os:'all', attr:'all' };
let qiFilter  = { svc:'all', type:'all', priority:'all', os:'all' };

// ── 헬퍼: 현재 서비스 데이터 ─────────────────────────────

function svcData() {
  if (currentSvc === 'all') return COVERAGE.services;
  return COVERAGE.services.filter(s => s.service_name === currentSvc);
}
function totalTC() { return svcData().reduce((a,b)=>a+b.total_tc, 0); }
function mergedPri() {
  const m = {P0:0,P1:0,P2:0,P3:0,P4:0,P5:0};
  svcData().forEach(s => Object.entries(s.priority||{}).forEach(([k,v]) => { if(k in m) m[k]+=v; }));
  return m;
}
function mergedOS() {
  const m = {android:0,ios:0,common:0,other:0};
  svcData().forEach(s => Object.entries(s.os||{}).forEach(([k,v]) => { if(k in m) m[k]+=v; }));
  return m;
}
function mergedAttr() {
  const m = {};
  ATTR_KEYS.forEach(k => m[k]=0);
  svcData().forEach(s => ATTR_KEYS.forEach(k => { m[k] += (s.attributes?.[k] ?? 0); }));
  return m;
}
function mergedQuality() {
  if (currentSvc === 'all') return COVERAGE.quality ?? {};
  const s = COVERAGE.services.find(x => x.service_name === currentSvc);
  if (!s?.quality) return {};
  // 최상위 issue_type_counts에서 서비스 필터링된 QI_RAW로 재계산
  const typeCounts = {};
  ISSUE_KEYS.forEach(k => typeCounts[k] = 0);
  QI_RAW.filter(r => r[0]===currentSvc).forEach(r => { if(r[2] in typeCounts) typeCounts[r[2]]++; });
  return {
    total_issues: s.quality.issue_count ?? 0,
    affected_tc_count: s.quality.affected_tc_count ?? 0,
    issue_type_counts: typeCounts,
    service_issue_counts: {[currentSvc]: s.quality.issue_count ?? 0},
    top_issue_type: Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '',
    top_issue_service: currentSvc,
  };
}

// ── TC 필터링 ─────────────────────────────────────────────

function tcFiltered() {
  return TC_RAW.filter(t => {
    if (currentSvc !== 'all' && t[0] !== currentSvc) return false;
    if (tcFilter.priority !== 'all' && t[4] !== tcFilter.priority) return false;
    if (tcFilter.os !== 'all' && t[5] !== tcFilter.os) return false;
    if (tcFilter.attr !== 'all' && t[ATTR_COL[tcFilter.attr]] !== 1) return false;
    return true;
  });
}

// ── QI 필터링 ─────────────────────────────────────────────

function qiFiltered() {
  return QI_RAW.filter(r => {
    if (currentSvc !== 'all' && r[0] !== currentSvc) return false;
    if (qiFilter.svc !== 'all' && r[0] !== qiFilter.svc) return false;
    if (qiFilter.type !== 'all' && r[2] !== qiFilter.type) return false;
    if (qiFilter.priority !== 'all' && r[4] !== qiFilter.priority) return false;
    if (qiFilter.os !== 'all' && r[5] !== qiFilter.os) return false;
    return true;
  });
}

// ── Canvas 도넛 차트 ──────────────────────────────────────

function drawDonut(id, values, colors, label) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 180;
  const H = canvas.offsetHeight || 180;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  const total = values.reduce((a,b)=>a+b, 0);
  if (!total) { return; }
  const cx=W/2, cy=H/2, r=Math.min(W,H)*.38, inner=r*.58;
  let angle = -Math.PI/2;
  values.forEach((v,i) => {
    if (!v) return;
    const s = (v/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+s); ctx.closePath();
    ctx.fillStyle = colors[i % colors.length]; ctx.fill();
    angle += s;
  });
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle = '#1a1d27'; ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `bold ${Math.round(r*.32)}px -apple-system,sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - r*.08);
  ctx.font = `${Math.round(r*.18)}px -apple-system,sans-serif`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(label || 'TC', cx, cy + r*.2);
}

// ── 페이지네이션 ──────────────────────────────────────────


// ══════════════════════════════════════════════════════════════
// Supabase 연동 — 검수 의견 저장/불러오기
// ══════════════════════════════════════════════════════════════
var reviewStore = {};  // { 'svc|row': { note, savedAt } }

// 전체 의견 불러오기 (문서 전환 시 호출)
function loadAllReviews() {
  if (!currentDocId) return Promise.resolve();
  reviewStore = {};

  return fetch(
    SUPA_URL + '/rest/v1/tc_reviews' +
    '?document_id=eq.' + currentDocId +
    '&select=svc,row_number,note,issue_types,target_fields,updated_at',
    {
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY
      }
    }
  )
  .then(function(r) { return r.json(); })
  .then(function(rows) {
    if (!Array.isArray(rows)) return;
    rows.forEach(function(r) {
      reviewStore[r.svc + '|' + r.row_number] = {
        note: r.note || '',
        issue_types: r.issue_types || [],
        target_fields: r.target_fields || [],
        savedAt: r.updated_at ? new Date(r.updated_at).toLocaleString('ko-KR') : ''
      };
    });
    Object.keys(reviewStore).forEach(function(key) {
      var panel = document.querySelector('.sv-review-panel[data-rv-key="' + key + '"]');
      if (!panel) return;
      var ta = panel.querySelector('.rv-note');
      if (ta) ta.value = reviewStore[key].note;
      var sa = panel.querySelector('.rv-saved-at');
      if (sa) sa.textContent = reviewStore[key].savedAt ? reviewStore[key].savedAt + ' 저장됨' : '';
    });
  })
  .catch(function(e) { console.warn('리뷰 불러오기 실패:', e); });
}

// 저장 (upsert)
// rv-save-btn 이벤트 위임 제거 — buildReviewPanel에서 직접 addEventListener 사용

function buildReviewPanelEl(svc, row) {
  var rvKey   = svc + '|' + row;
  var saved   = reviewStore[rvKey] || {};
  var selTypes  = saved.issue_types  || [];
  var selFields = saved.target_fields || [];

  var ISSUE_TYPES  = ['의미변경','문맥오판','잘못된정보추가','정보누락','용어표준화미흡','기타'];
  var TARGET_FIELDS = ['분류1','분류2','분류3','화면전개','사전조건','Test Step','기대결과'];

  // 패널 컨테이너
  var div = document.createElement('div');
  div.className = 'sv-review-panel';
  div.setAttribute('data-rv-key', rvKey);

  // 제목
  var title = document.createElement('div');
  title.className = 'sv-review-title'; title.textContent = '검수 의견';

  // 이슈 유형 버블
  var row1 = document.createElement('div'); row1.className = 'rv-row';
  var lbl1 = document.createElement('span'); lbl1.className = 'rv-label'; lbl1.textContent = '이슈 유형';
  var grp1 = document.createElement('div'); grp1.className = 'rv-type-group';
  ISSUE_TYPES.forEach(function(t) {
    var b = document.createElement('button');
    b.className = 'rv-type-btn' + (selTypes.indexOf(t) >= 0 ? ' active' : '');
    b.textContent = t;
    b.addEventListener('click', function() { b.classList.toggle('active'); });
    grp1.appendChild(b);
  });
  row1.appendChild(lbl1); row1.appendChild(grp1);

  // 대상 항목 버블
  var row2 = document.createElement('div'); row2.className = 'rv-row';
  var lbl2 = document.createElement('span'); lbl2.className = 'rv-label'; lbl2.textContent = '대상 항목';
  var grp2 = document.createElement('div'); grp2.className = 'rv-field-group';
  TARGET_FIELDS.forEach(function(f) {
    var b = document.createElement('button');
    b.className = 'rv-field-btn' + (selFields.indexOf(f) >= 0 ? ' active' : '');
    b.textContent = f;
    b.addEventListener('click', function() { b.classList.toggle('active'); });
    grp2.appendChild(b);
  });
  row2.appendChild(lbl2); row2.appendChild(grp2);

  // 의견 텍스트
  var row3 = document.createElement('div'); row3.className = 'rv-row rv-note-row';
  var lbl3 = document.createElement('span'); lbl3.className = 'rv-label'; lbl3.textContent = '의견';
  var ta   = document.createElement('textarea');
  ta.className = 'rv-note'; ta.rows = 3;
  ta.placeholder = '의견을 입력하세요...';
  // 브라우저 자동완성/맞춤법 검사가 한글 IME 커서 위치를 간섭하므로 모두 끔
  ta.setAttribute('autocomplete',    'off');
  ta.setAttribute('autocorrect',     'off');
  ta.setAttribute('autocapitalize',  'off');
  ta.setAttribute('spellcheck',      'false');
  ta.value = saved.note || '';
  // 한글 IME 조합 중 이벤트 중복 방지
  ta.addEventListener('compositionstart', function() { ta._composing = true; });
  ta.addEventListener('compositionend',   function() { ta._composing = false; });
  row3.appendChild(lbl3); row3.appendChild(ta);

  // 푸터
  var footer  = document.createElement('div'); footer.className = 'rv-footer';
  var savedAt = document.createElement('span'); savedAt.className = 'rv-saved-at';
  savedAt.textContent = saved.savedAt ? saved.savedAt + ' 저장됨' : '';
  var btn = document.createElement('button');
  btn.className = 'rv-save-btn'; btn.textContent = '저장';

  btn.addEventListener('click', function() {
    // IME 조합 완료 대기 후 저장 (한글 마지막 글자 누락 방지)
    if (ta._composing) { setTimeout(function(){ btn.click(); }, 50); return; }
    var note       = ta.value;
    var issueTypes  = Array.from(grp1.querySelectorAll('.rv-type-btn.active')).map(function(b){return b.textContent;});
    var targetFields= Array.from(grp2.querySelectorAll('.rv-field-btn.active')).map(function(b){return b.textContent;});
    btn.textContent = '저장 중...'; btn.disabled = true;
    fetch(SUPA_URL + '/rest/v1/tc_reviews?on_conflict=document_id,svc,row_number', {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        document_id: currentDocId,
        svc: svc, row_number: row, note: note,
        issue_types: issueTypes, target_fields: targetFields,
        updated_at: new Date().toISOString()
      })
    })
    .then(function(r) {
      if (!r.ok) return r.text().then(function(t){ throw new Error('HTTP ' + r.status + ' — ' + t); });
      var now = new Date().toLocaleString('ko-KR');
      reviewStore[rvKey] = { note: note, issue_types: issueTypes, target_fields: targetFields, savedAt: now };
      btn.textContent = '✓ 저장됨'; btn.disabled = false;
      btn.style.background = 'rgba(34,197,94,.3)';
      setTimeout(function(){ btn.textContent = '저장'; btn.style.background = ''; }, 2500);
      savedAt.textContent = now + ' 저장됨'; savedAt.style.color = '#4ade80';
      var toast = document.createElement('div');
      toast.textContent = '✓ 저장되었습니다';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:rgba(34,197,94,.9);'
        +'color:#fff;font-weight:700;font-size:13px;padding:10px 20px;border-radius:8px;'
        +'z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.3)';
      document.body.appendChild(toast);
      setTimeout(function(){
        toast.style.opacity='0'; toast.style.transition='opacity .5s';
        setTimeout(function(){ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
      }, 2000);
    })
    .catch(function(e) {
      console.error('[저장 실패]', e);
      alert('저장 실패: ' + e.message);
      btn.textContent = '✗ 실패 — 재시도'; btn.disabled = false;
      btn.style.background = 'rgba(239,68,68,.3)';
    });
  });

  footer.appendChild(savedAt); footer.appendChild(btn);
  div.appendChild(title);
  div.appendChild(row1); div.appendChild(row2); div.appendChild(row3);
  div.appendChild(footer);
  return div;
}

// saveReview 기능은 buildReviewPanelEl에 통합됨


function renderPagination(containerId, current, total, cb) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const btn = (label, p, disabled, active) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = disabled;
    if (active) b.classList.add('active-page');
    b.onclick = () => cb(p);
    el.appendChild(b);
  };
  btn('‹', current-1, current<=1, false);
  const s = Math.max(1,current-2), e = Math.min(total, s+4);
  for (let p=s; p<=e; p++) btn(p, p, false, p===current);
  btn('›', current+1, current>=total, false);
}

// ── KPI 렌더 ─────────────────────────────────────────────

function renderKPI() {
  const tot  = totalTC();
  const pri  = mergedPri();
  const attr = mergedAttr();
  const q    = mergedQuality();
  const pct  = v => tot ? Math.round(v/tot*100) : 0;

  // Priority 원본값 중 존재하는 것만 나열 (0이면 제외)
  const priExist = Object.entries(pri)
    .filter(([,v]) => v > 0)
    .map(([k,v]) => `${k}: ${v}`)
    .join(' / ');

  const cards = [
    { label:'전체 TC',       val:tot.toLocaleString(),
      sub:(()=>{ const svcs=svcData(); const cnt=svcs.length; if(cnt===1&&svcs[0].first_row) return `행${svcs[0].first_row}~${svcs[0].last_row}`; return `${cnt}개 서비스`; })(),
      cls:'' },
    { label:'Priority 분포', val:priExist||'-',                                   sub:'원본값 기준',                        cls:'' },
    { label:'자동화 후보',    val:(attr.automation_candidate||0).toLocaleString(), sub:`전체의 ${pct(attr.automation_candidate||0)}%`, cls:'', click:'scrollToAutoAnalysis' },
    { label:'품질 이슈 TC',  val:(q.affected_tc_count||0).toLocaleString(),       sub:`이슈 ${q.total_issues||0}건 탐지`,  cls:'kpi-danger' },
  ];
  document.getElementById('kpi-row').innerHTML = cards.map(c=>`
    <div class="kpi-card ${c.cls}${c.click ? ' kpi-clickable' : ''}"${c.click ? ` onclick="${c.click}()"` : ''}>
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value" style="${c.label==='Priority 분포'?'font-size:14px;letter-spacing:0':''}">${c.val}</div>
      <div class="kpi-sub">${c.sub}${c.click ? ' <span class="kpi-hint">▸ 상세 보기</span>' : ''}</div>
    </div>`).join('');
}

// ── Phase 1: 서비스 도넛 ─────────────────────────────────

function renderServiceDonut() {
  const svcs = COVERAGE.services;
  drawDonut('donut-service', svcs.map(s=>s.total_tc), SVC_COLORS, 'TC');
  document.getElementById('legend-service').innerHTML = svcs.map((s,i) => `
    <div class="legend-row">
      <span class="legend-dot" style="background:${SVC_COLORS[i%SVC_COLORS.length]}"></span>
      <span class="legend-name" title="${s.service_name}">${s.service_name}</span>
      <span class="legend-val">${s.total_tc}</span>
    </div>`).join('');
}

// ── Phase 1: 우선순위 도넛 + 막대 ────────────────────────

function renderPriorityDonut() {
  const pri     = mergedPri();
  // 0인 항목 제외하고 도넛 + 범례 표시
  const entries = Object.entries(pri).filter(([,v]) => v > 0);
  const vals    = entries.map(([,v]) => v);
  const cols    = entries.map(([k]) => P_COLORS[k]);
  drawDonut('donut-priority', vals, cols, 'TC');
  document.getElementById('legend-priority').innerHTML = entries.map(([k,v]) => `
    <div class="legend-row">
      <span class="legend-dot" style="background:${P_COLORS[k]}"></span>
      <span class="legend-name">${k}</span>
      <span class="legend-val">${v}</span>
    </div>`).join('');
}

function renderPriorityBars() { /* 막대 제거 — 도넛+범례로 대체 */ }

// ── Phase 1: OS 그리드 ────────────────────────────────────

function renderOS() {
  const os  = mergedOS();
  const tot = Object.values(os).reduce((a,b)=>a+b, 0);
  const items = [
    {k:'common',  label:'공통',    color:'#6366f1'},
    {k:'android', label:'Android', color:'#78c257'},
    {k:'ios',     label:'iOS',     color:'#888'},
    {k:'other',   label:'기타',    color:'#64748b'},
  ];
  document.getElementById('os-grid').innerHTML = items.map(it=>{
    const pct = tot ? Math.round(os[it.k]/tot*100) : 0;
    return `<div class="os-card">
      <div class="os-label">${it.label}</div>
      <div class="os-val" style="color:${it.color}">${os[it.k]}</div>
      <div class="os-pct">${pct}%</div>
    </div>`;
  }).join('');
}

// ── Phase 1: 카테고리 테이블 ──────────────────────────────

function renderCategory() {
  // card-cat 섹션 제거됨 — 비교 뷰(renderCompare)로 대체
}

// ── Phase 1: TC 목록 테이블 ───────────────────────────────

function renderTC() {
  const rows = tcFiltered();
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total/PAGE));
  tcPage = Math.min(tcPage, pages);
  const page = rows.slice((tcPage-1)*PAGE, tcPage*PAGE);

  document.getElementById('tc-tbody').innerHTML = page.length ? page.map(t=>{
    const tags = ATTR_KEYS.filter(k=>t[ATTR_COL[k]]===1)
      .map(k=>`<span class="attr-tag">${ATTR_LABELS[k]}</span>`).join('');
    return `<tr>
      <td class="td-muted wd-no-wrap">${t[0]}</td>
      <td class="wd-no-wrap">${t[1]||'-'}</td>
      <td>${t[2]}</td>
      <td>${t[3]}</td>
      <td><span class="pchip pchip-${t[4]}">${t[4]}</span></td>
      <td><span class="oschip os-${t[5]}">${t[5]}</span></td>
      <td class="tags-cell">${tags}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="7" class="empty-cell">데이터 없음</td></tr>';

  document.getElementById('tc-page-info').textContent =
    `${total}건 중 ${total?Math.min((tcPage-1)*PAGE+1,total):0}–${Math.min(tcPage*PAGE,total)} 표시`;
  renderPagination('tc-pager', tcPage, pages, p=>{ tcPage=p; renderTC(); });
}

// ── Phase 2: 속성 막대 ────────────────────────────────────

function renderAttrBars() {
  const attr = mergedAttr();
  const tot  = totalTC();
  const max  = Math.max(...Object.values(attr), 1);
  document.getElementById('attr-bars').innerHTML = ATTR_KEYS.map((k,i)=>{
    const cnt = attr[k] || 0;
    const pct = tot ? Math.round(cnt/tot*100) : 0;
    return `<div class="attr-row">
      <div class="attr-label">${ATTR_LABELS[k]}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${cnt/max*100}%;background:${ATTR_COLORS[i]}"></div></div>
      <div class="attr-stat">${cnt} <span class="pct-muted">(${pct}%)</span></div>
    </div>`;
  }).join('');
}

// ── Phase 2: 속성 히트맵 ─────────────────────────────────

function renderHeatmap() {
  const svcs = COVERAGE.services;
  const rows = ATTR_KEYS.map(k=>{
    const mx = Math.max(...svcs.map(s=>s.attributes?.[k]??0), 1);
    return `<tr>
      <td class="heat-label">${ATTR_LABELS[k]}</td>
      ${svcs.map(s=>{
        const cnt = s.attributes?.[k]??0;
        const pct = s.total_tc ? (cnt/s.total_tc*100).toFixed(0) : 0;
        const int = Math.round(cnt/mx*100);
        return `<td class="heat-cell" style="--i:${int}">
          <div class="heat-n">${cnt}</div>
          <div class="heat-p">${pct}%</div>
        </td>`;
      }).join('')}
    </tr>`;
  }).join('');
  document.getElementById('heatmap-wrap').innerHTML = `
    <table class="htable">
      <thead><tr>
        <th class="heat-label">속성</th>
        ${svcs.map(s=>`<th>${s.service_name}</th>`).join('')}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ── Phase 2: 복합 속성 조합 막대 ────────────────────────
// 현재 서비스 기준으로 compound_attributes 집계 표시

function renderCompoundAttrs() {
  const svcs = svcData();   // svcData()는 이미 services 배열을 반환
  // 서비스 합산
  const combined = {};
  svcs.forEach(s => {
    Object.entries(s.compound_attributes || {}).forEach(([combo, cnt]) => {
      combined[combo] = (combined[combo] || 0) + cnt;
    });
  });
  const sorted = Object.entries(combined).sort((a,b)=>b[1]-a[1]).slice(0, 20);
  const tot = totalTC();
  const max = sorted[0]?.[1] || 1;

  const el = document.getElementById('compound-attr-bars');
  if (!el) return;
  if (!sorted.length) {
    el.innerHTML = '<div class="empty-cell">데이터 없음</div>';
    return;
  }
  el.innerHTML = sorted.map(([combo, cnt], i) => {
    const pct = tot ? Math.round(cnt/tot*100) : 0;
    const color = `hsl(${(i * 23) % 360}, 65%, 60%)`;
    return `<div class="attr-row">
      <div class="attr-label" style="font-size:11px">${combo}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${cnt/max*100}%;background:${color}"></div></div>
      <div class="attr-stat">${cnt} <span class="pct-muted">(${pct}%)</span></div>
    </div>`;
  }).join('');
}

// ── Phase 4: 사전조건 속성 분포 ──────────────────────────

const PRECOND_COLORS = [
  '#a78bfa','#60a5fa','#34d399','#fbbf24','#f87171',
  '#c084fc','#38bdf8','#4ade80','#fb923c','#f472b6',
  '#818cf8','#2dd4bf','#facc15','#94a3b8','#e879f9',
];

function getPrecondData() {
  // 현재 서비스 필터에 맞는 사전조건 카테고리 집계
  const svcs = svcData().map(s => s.service_name);
  const merged = {};
  svcs.forEach(svc => {
    const items = getSvcPrecond(svc) || [];
    items.forEach(item => {
      if (!merged[item.cat]) merged[item.cat] = { label: item.label, cnt: 0 };
      merged[item.cat].cnt += item.cnt;
    });
  });
  return Object.entries(merged)
    .sort((a, b) => b[1].cnt - a[1].cnt);
}

function renderPrecondBars() {
  const data = getPrecondData();
  if (!data.length) return;
  const max  = data[0][1].cnt;
  const tot  = svcData().reduce((a, b) => a + b.total_tc, 0);
  const bars = data.map(([cat, d], i) => {
    const pct = tot ? Math.round(d.cnt / tot * 100) : 0;
    return `<div class="attr-row">
      <div class="attr-label">${d.label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${d.cnt/max*100}%;background:${PRECOND_COLORS[i%PRECOND_COLORS.length]}"></div>
      </div>
      <div class="attr-stat">${d.cnt} <span class="pct-muted">(${pct}%)</span></div>
    </div>`;
  }).join('');
  const el = document.getElementById('precond-bars');
  if (el) el.innerHTML = bars || '<div class="empty-cell">데이터 없음</div>';
}

function renderPrecondSvcHeatmap() {
  // 전체 기준 상위 5 카테고리 × 서비스 히트맵
  const allData = getPrecondData().slice(0, 8);
  if (!allData.length) return;

  const topCats  = allData.map(([cat]) => cat);
  const catLabel = Object.fromEntries(allData.map(([c, d]) => [c, d.label]));
  const svcs     = svcData().map(s => s.service_name);

  const maxVal = Math.max(...svcs.flatMap(svc =>
    topCats.map(cat => (getSvcPrecond(svc) || []).find(i => i.cat === cat)?.cnt || 0)
  ), 1);

  const headerCols = svcs.map(s => `<th title="${s}">${s.replace(/^\d+\./, '')}</th>`).join('');
  const rows = topCats.map(cat => {
    const cells = svcs.map(svc => {
      const item = (getSvcPrecond(svc) || []).find(i => i.cat === cat);
      const cnt  = item ? item.cnt : 0;
      const int  = Math.round(cnt / maxVal * 100);
      return `<td class="heat-cell" style="--i:${int}">
        <div class="heat-n">${cnt || ''}</div>
      </td>`;
    }).join('');
    return `<tr><td class="heat-label">${catLabel[cat]}</td>${cells}</tr>`;
  }).join('');

  const el = document.getElementById('precond-svc-heatmap');
  if (el) el.innerHTML = `
    <table class="htable">
      <thead><tr>
        <th class="heat-label">사전조건</th>${headerCols}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ── Phase 3: 품질 KPI 카드 + 막대 ────────────────────────

function renderQualitySummary() {
  const q   = mergedQuality();
  const tot = totalTC();
  const pct = v => tot ? Math.round(v/tot*100) : 0;

  // KPI 카드 4개
  document.getElementById('q-kpis').innerHTML = [
    { label:'총 이슈 건수',    val:(q.total_issues||0),            sub:'탐지된 전체 이슈',               color:'#ef4444' },
    { label:'영향 받은 TC',    val:(q.affected_tc_count||0),        sub:`전체의 ${pct(q.affected_tc_count||0)}%`, color:'#f97316' },
    { label:'최다 이슈 유형',  val:ISSUE_LABELS[q.top_issue_type]||'-', sub:`${q.issue_type_counts?.[q.top_issue_type]||0}건`, color:'#eab308' },
    { label:'최다 이슈 서비스',val:q.top_issue_service||'-',        sub:`${q.service_issue_counts?.[q.top_issue_service]||0}건`, color:'#a855f7' },
  ].map(c=>`
    <div class="q-card">
      <div class="q-card-label">${c.label}</div>
      <div class="q-card-val" style="color:${c.color}">${c.val}</div>
      <div class="q-card-sub">${c.sub}</div>
    </div>`).join('');

  // 이슈 유형별 막대
  const tc = q.issue_type_counts || {};
  const mx = Math.max(...Object.values(tc), 1);
  document.getElementById('q-type-bars').innerHTML = ISSUE_KEYS.map((k,i)=>{
    const n = tc[k]||0;
    return `<div class="bar-item">
      <div class="bar-label">${ISSUE_LABELS[k]}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${n/mx*100}%;background:${ISSUE_COLORS[i]}"></div></div>
      <div class="bar-val">${n}</div>
    </div>`;
  }).join('');

  // 서비스별 막대
  const sc = q.service_issue_counts || {};
  const mxs = Math.max(...Object.values(sc), 1);
  document.getElementById('q-svc-bars').innerHTML = Object.entries(sc).map(([svc,n],i)=>{
    return `<div class="bar-item">
      <div class="bar-label">${svc}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${n/mxs*100}%;background:${SVC_COLORS[i%SVC_COLORS.length]}"></div></div>
      <div class="bar-val">${n}</div>
    </div>`;
  }).join('') || '<div class="empty-cell">데이터 없음</div>';
}

// ── Phase 3: 품질 이슈 목록 ──────────────────────────────

function renderQI() {
  const rows = qiFiltered();
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total/PAGE));
  qiPage = Math.min(qiPage, pages);
  const page = rows.slice((qiPage-1)*PAGE, qiPage*PAGE);

  document.getElementById('qi-tbody').innerHTML = page.length ? page.map(r=>`
    <tr style="cursor:pointer" onclick="scrollToCompare('${r[0].replace(/'/g,"\\'")}',${r[1]})">
      <td class="td-muted wd-no-wrap">${r[0]}</td>
      <td class="wd-no-wrap">${r[1]||'-'}</td>
      <td><span class="issue-chip ic-${r[2]}">${ISSUE_LABELS[r[2]]||r[2]}</span></td>
      <td class="td-sm td-muted" style="max-width:220px">${r[3]}</td>
      <td class="td-sm td-muted" style="max-width:200px">${r[6]}</td>
      <td><span class="pchip pchip-${r[4]}">${r[4]}</span></td>
      <td><span class="oschip os-${r[5]}">${r[5]}</span></td>
    </tr>`).join('') : '<tr><td colspan="7" class="empty-cell">데이터 없음</td></tr>';

  document.getElementById('qi-page-info').textContent =
    `${total}건 중 ${total?Math.min((qiPage-1)*PAGE+1,total):0}–${Math.min(qiPage*PAGE,total)} 표시`;
  renderPagination('qi-pager', qiPage, pages, p=>{ qiPage=p; renderQI(); });
}

// ── 사이드바 ─────────────────────────────────────────────

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const mk = (svc, label, cnt, rowRange) =>
    `<div class="sidebar-item ${currentSvc===svc?'active':''}" data-svc="${svc}">
      <span class="svc-name">${label}</span>
      <span class="svc-cnt">${cnt}</span>
    </div>`;
  nav.innerHTML =
    mk('all','전체 서비스', COVERAGE.total_tc) +
    COVERAGE.services.map(s=>mk(
      s.service_name, s.service_name, s.total_tc,
      (s.first_row && s.last_row) ? `행${s.first_row}~${s.last_row}` : null
    )).join('');
  nav.querySelectorAll('.sidebar-item').forEach(el =>
    el.addEventListener('click', ()=>{
      currentSvc = el.dataset.svc;
      tcPage=1; qiPage=1;
      buildSidebar();
      renderAll();
    })
  );
}

// ── 필터 바인딩 ───────────────────────────────────────────

// ── 이슈 유형 레이블 (비교 뷰 필터 표시용) ──────────────────
var CMP_ISSUE_LABELS = {
  has_issue:                   '이슈 있는 TC만',
  ambiguous_test_step:         'Test Step 모호',
  ambiguous_expected_result:   '기대결과 모호',
  missing_precondition:        '사전조건 누락',
  duplicated_step_expected:    'Step=Expected 중복',
  multiple_purpose:            '복수 목적 혼재',
  invalid_priority:            'Priority 이상값',
  invalid_os:                  'OS 이상값',
  invalid_category:            '분류 누락',
};

// 특정 서비스(또는 전체)에 실제 존재하는 이슈 유형 목록 반환
function getCmpIssueTypes(svc) {
  if (!qi_idx) buildCmpIndexes();
  var typeSet = {};
  QI_RAW.forEach(function(r) {
    if (svc === 'all' || r[0] === svc) {
      typeSet[r[2]] = true;
    }
  });
  return Object.keys(typeSet);
}

// cmp-issue 드롭다운을 현재 서비스 기준으로 재생성
function rebuildCmpIssueSelect(svc) {
  var el = document.getElementById('cmp-issue');
  if (!el) return;
  var prevVal = el.value;
  el.innerHTML = '';

  // 전체 옵션
  var all = document.createElement('option');
  all.value = 'all'; all.textContent = '이슈 유형 전체';
  el.appendChild(all);

  // 이슈 있는 TC만
  var has = document.createElement('option');
  has.value = 'has_issue'; has.textContent = '이슈 있는 TC만';
  el.appendChild(has);

  // 실제 존재하는 이슈 유형만
  getCmpIssueTypes(svc).forEach(function(type) {
    var opt = document.createElement('option');
    opt.value = type;
    opt.textContent = CMP_ISSUE_LABELS[type] || type;
    el.appendChild(opt);
  });

  // 이전 선택값 복원 (없으면 'all')
  var exists = Array.from(el.options).some(function(o) { return o.value === prevVal; });
  el.value = exists ? prevVal : 'all';
  cmpFilter.issue = el.value;
}

var _filtersWired = false;

function bindFilters() {
  // ── 서비스 옵션 clear-and-repopulate (문서 전환 시 재호출 가능) ──────
  const qiSvcEl = document.getElementById('f-qi-svc');
  if (qiSvcEl) {
    qiSvcEl.innerHTML = '<option value="all">서비스 전체</option>';
    COVERAGE.services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.service_name;
      opt.textContent = s.service_name;
      qiSvcEl.appendChild(opt);
    });
  }

  var cmpSvcEl = document.getElementById('cmp-svc');
  if (cmpSvcEl) {
    cmpSvcEl.innerHTML = '<option value="all">서비스 전체</option>';
    COVERAGE.services.forEach(function(s) {
      var opt = document.createElement('option');
      opt.value = s.service_name;
      opt.textContent = s.service_name;
      cmpSvcEl.appendChild(opt);
    });
  }
  rebuildCmpIssueSelect('all');

  // ── 이벤트 리스너는 최초 1회만 등록 ─────────────────────────────────
  if (_filtersWired) return;
  _filtersWired = true;

  if (cmpSvcEl) {
    cmpSvcEl.addEventListener('change', function(e) {
      cmpFilter.svc = e.target.value;
      cmpPage = 1;
      rebuildCmpIssueSelect(cmpFilter.svc);
      renderCompare();
    });
  }
  var cmpIssueEl = document.getElementById('cmp-issue');
  if (cmpIssueEl) {
    cmpIssueEl.addEventListener('change', function(e) {
      cmpFilter.issue = e.target.value;
      cmpPage = 1;
      renderCompare();
    });
  }

  const on = (id, fn) => { const el=document.getElementById(id); if(el) el.addEventListener('change', fn); };
  on('f-tc-pri',  e=>{ tcFilter.priority=e.target.value; tcPage=1; renderTC(); });
  on('f-tc-os',   e=>{ tcFilter.os=e.target.value;       tcPage=1; renderTC(); });
  on('f-tc-attr', e=>{ tcFilter.attr=e.target.value;     tcPage=1; renderTC(); });
  on('f-qi-svc',  e=>{ qiFilter.svc=e.target.value;      qiPage=1; renderQI(); });
  on('f-qi-type', e=>{ qiFilter.type=e.target.value;     qiPage=1; renderQI(); });
  on('f-qi-pri',  e=>{ qiFilter.priority=e.target.value; qiPage=1; renderQI(); });
  on('f-qi-os',   e=>{ qiFilter.os=e.target.value;       qiPage=1; renderQI(); });
}

// ── 섹션 접기/펼치기 ─────────────────────────────────────

function bindToggles() {
  document.querySelectorAll('.section-header').forEach(h=>{
    h.addEventListener('click', ()=>{
      const card = h.closest('.section-card');
      if (!card) return;
      card.classList.toggle('collapsed');
      if (!card.classList.contains('collapsed')) {
        if (card.id==='card-svc-donut')  renderServiceDonut();
        if (card.id==='card-pri-donut')  renderPriorityDonut();
      }
    });
  });
}

// ── 전체 렌더 ────────────────────────────────────────────


// ── FULL_TC 데이터 ─────────────────────────────────────────
// 컬럼: [0]svc [1]row [2]cat1 [3]cat2 [4]cat3 [5]cat4
//       [6]precondition [7]test_step [8]expected_result
//       [9]priority [10]priority_raw [11]os [12]compound_attribute

// ══════════════════════════════════════════════════════════════
// ORIG_MAP: 엑셀 원본 raw 값 (AI 처리 전)
// key  = "서비스명|엑셀행번호"
// value = [precond_raw, step_raw, expected_raw, priority_raw, os_raw]
// ══════════════════════════════════════════════════════════════
// ── 원본 TC raw 데이터 (엑셀에서 직접 추출) ─────────────────
// key = "서비스명|엑셀행번호"
// value = [precond_raw, step_raw, expected_raw, priority_raw, os_raw]
// ── 원본 TC raw 데이터 (엑셀 직접 추출, AI 처리 전) ──────────
// key = "서비스명|엑셀행번호"
// value = [cat1,cat2,cat3,cat4,precond,step,expected,prio_raw,os_raw]
// ── 원본 TC raw 데이터 (엑셀 직접 추출) ──────────────────
// ── 원본 TC raw 데이터 (엑셀 직접 추출) ──────────────────
// ── 원본 TC raw 데이터 (엑셀 직접 추출) ──────────────────


// ── 원본 TC raw 데이터 (엑셀 직접 추출) ──────────────────
// ── 원본 TC raw 데이터 (엑셀 직접 추출) ──────────────────
// ── 원본 TC raw 데이터 ──────────────────────────────
// ── 원본 TC raw 데이터 ──────────────────────────────
// ── AI Standard TC 공통 데이터 (ai_standard_tc.csv 기반) ────
// 컬럼: [0]svc [1]row | [2~9]Original TC | [10~17]AI Standard TC
//        [18~24]AI Analysis | [25~27]Intent | [28~30]Semantic Validation
// ================================================================
// Integrity Dashboard — TC 비교 뷰 (Compare Section)
// 공통 데이터 소스: AI_STD (ai_standard_tc.csv 기반)
//
// AI_STD 컬럼 인덱스:
//  [0]svc  [1]row
//  Original TC: [2]cat1 [3]cat2 [4]cat3 [5]cat4 [6]precond [7]step [8]expected [9]priority
//  AI Standard: [10]cat1 [11]cat2 [12]cat3 [13]cat4 [14]precond [15]step [16]expected [17]priority
//  AI Analysis: [18]precond_norm [19]precond_ev [20]step_norm [21]step_reason
//               [22]exp_norm [23]exp_reason [24]quality_issues
//  Intent:      [25]orig_intent [26]ai_intent [27]final_check_point
//  Semantic:    [28]match_pct [29]meaning_status [30]sem_reason
// ================================================================

// ── 상태 ──────────────────────────────────────────────────────
var cmpPage  = 1;
var CMP_PAGE = 15;
var cmpFilter = { svc: 'all', issue: 'all' };

// ── QI 인덱스 ─────────────────────────────────────────────────
var qi_idx = null;

// TC_RAW 자동화 인덱스
var tc_auto_idx = null;
function buildTCAutoIndex() {
  if (tc_auto_idx) return;
  tc_auto_idx = new Map();
  TC_RAW.forEach(function(t) {
    tc_auto_idx.set(t[0] + '|' + t[1], { auto: t[17], manual: t[18] });
  });
}

function buildCmpIndexes() {
  qi_idx = new Map();
  QI_RAW.forEach(function(r) {
    var k = r[0] + '|' + r[1];
    if (!qi_idx.has(k)) qi_idx.set(k, []);
    qi_idx.get(k).push(r);
  });
}

// ── 필터링 ────────────────────────────────────────────────────
function cmpFiltered() {
  if (!qi_idx) buildCmpIndexes();
  return AI_STD.filter(function(t) {
    if (currentSvc !== 'all' && t[0] !== currentSvc) return false;
    if (cmpFilter.svc !== 'all' && t[0] !== cmpFilter.svc) return false;
    if (cmpFilter.issue === 'all') return true;
    var issues = qi_idx.get(t[0] + '|' + t[1]) || [];
    if (cmpFilter.issue === 'has_issue') return issues.length > 0;
    return issues.some(function(q) { return q[2] === cmpFilter.issue; });
  });
}

// ── 유틸 ─────────────────────────────────────────────────────
function hesc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}
function pchip(raw) {
  if (!raw && raw !== 0) return '<span class="sv-empty">—</span>';
  var n = parseFloat(String(raw));
  var p = (!isNaN(n) && n>=0 && n<=5 && n===Math.floor(n)) ? 'P'+Math.floor(n) : String(raw);
  return '<span class="pchip pchip-'+p+'">'+p+'</span>';
}

// ── diff 클래스 결정 ──────────────────────────────────────────
// 원본과 AI 값을 비교해 색상 클래스 반환
function diffCls(orig, ai, normType) {
  var o = (orig||'').trim(), a = (ai||'').trim();
  if (o === a) return 'sv-ai-same';
  if (!o && a) return (normType && normType.indexOf('추론')>=0) ? 'sv-ai-infer' : 'sv-ai-add';
  if (o && !a) return 'sv-ai-del';
  return 'sv-ai-mod';
}

// ── 필드 행 렌더 ──────────────────────────────────────────────
// 원본 셀 + AI 셀을 한 행으로 렌더
function fieldRow(label, origVal, aiVal, normType) {
  var oCls  = 'sv-orig-val';
  var aCls  = diffCls(origVal, aiVal, normType);
  var oDisp = (origVal||'').trim() ? hesc((origVal||'').trim()) : '<span class="sv-empty">—</span>';
  var aDisp = (aiVal  ||'').trim() ? hesc((aiVal  ||'').trim()) : '<span class="sv-empty">—</span>';
  return '<div class="sv-field">' +
    '<div class="sv-label">' + label + '</div>' +
    '<div class="' + oCls + '">' + oDisp + '</div>' +
    '<div class="' + aCls + '">' + aDisp + '</div>' +
  '</div>';
}

// Priority 행 (chip 형태)
function priorityRow(origPri, aiPri) {
  return '<div class="sv-field">' +
    '<div class="sv-label">Priority</div>' +
    '<div class="sv-orig-val">' + pchip(origPri) + '</div>' +
    '<div class="sv-ai-same">'  + pchip(aiPri)   + '</div>' +
  '</div>';
}

// ── Normalization Type 배지 ───────────────────────────────────
var NORM_TYPE_MAP = {
  '사전조건 추론'    : 'nt-infer',
  '수행 절차 재구성' : 'nt-recon',
  '문맥 보완'        : 'nt-context',
  '기대결과 명확화'  : 'nt-exp',
  '기대결과 재작성 필요': 'nt-warn',
  '표현 표준화'      : 'nt-std',
  '분류 보완'        : 'nt-cat',
};

function normTypeBadges(normTypeStr) {
  if (!normTypeStr) return '';
  return normTypeStr.split(',').map(function(t) {
    var s = t.trim();
    var cls = NORM_TYPE_MAP[s] || 'nt-default';
    return '<span class="nt-badge ' + cls + '">' + hesc(s) + '</span>';
  }).join('');
}

// ── AI Analysis 패널 ──────────────────────────────────────────
function analysisPanel(normType, evidence, reason) {
  if (!normType && !evidence && !reason) return '';
  var parts = [];
  if (normType) {
    parts.push('<div class="ana-row"><span class="ana-label">Normalization Type</span>' +
      '<div class="ana-badges">' + normTypeBadges(normType) + '</div></div>');
  }
  if (evidence) {
    parts.push('<div class="ana-row"><span class="ana-label">근거</span>' +
      '<div class="ana-text">' + hesc(evidence) + '</div></div>');
  }
  if (reason) {
    parts.push('<div class="ana-row"><span class="ana-label">수정 이유</span>' +
      '<div class="ana-text">' + hesc(reason) + '</div></div>');
  }
  return parts.length ? '<div class="sv-ana-block">' + parts.join('') + '</div>' : '';
}

// ── 단일 TC 블록 ─────────────────────────────────────────────
function buildTCBlock(t) {
  var key    = t[0] + '|' + t[1];
  var issues = qi_idx ? (qi_idx.get(key) || []) : [];

  // 컬럼 인덱스 접근
  var O = { cat1:2,cat2:3,cat3:4,cat4:5,pre:6,step:7,exp:8,pri:9 };
  var A = { cat1:10,cat2:11,cat3:12,cat4:13,pre:14,step:15,exp:16,pri:17 };
  var AN = { preNorm:18,preEv:19,stepNorm:20,stepReason:21,expNorm:22,expReason:23,qi:24 };
  var I  = { orig:25,ai:26,fcp:27 };
  var S  = { match:28,status:29,reason:30 };
  var CTX = { feature:31,screen:32,scenario:33,userGoal:34,flowPos:35 };
  var NORM = { summary:36 };

  var blockId = 'cmp-row-' + (t[0]+'-'+t[1]).replace(/[\s.()\/]/g,'-');

  // ── TC 패널 (분류1~Priority) ──────────────────────────────
  var tcPanel =
    '<div class="sv-tc-panel">' +
      '<div class="sv-tc-header">' +
        '<div class="sv-tc-col-hdr sv-orig-hdr">Original TC</div>' +
        '<div class="sv-tc-col-hdr sv-ai-hdr">AI Standard TC</div>' +
      '</div>' +
      fieldRow('분류1',    t[O.cat1],t[A.cat1]) +
      fieldRow('분류2',    t[O.cat2],t[A.cat2]) +
      fieldRow('분류3',    t[O.cat3],t[A.cat3]) +
      fieldRow('화면전개', t[O.cat4],t[A.cat4]) +
      fieldRow('사전조건', t[O.pre], t[A.pre],  t[AN.preNorm]) +
      fieldRow('Test Step',t[O.step],t[A.step], t[AN.stepNorm]) +
      fieldRow('기대결과', t[O.exp], t[A.exp],  t[AN.expNorm]) +
      priorityRow(t[O.pri], t[A.pri]) +
    '</div>';

  // ── AI Analysis 패널 ─────────────────────────────────────
  var preAna  = analysisPanel(t[AN.preNorm],  t[AN.preEv], '');
  var stepAna = analysisPanel(t[AN.stepNorm], '', t[AN.stepReason]);
  var expAna  = analysisPanel(t[AN.expNorm],  '', t[AN.expReason]);
  var qiBadges = t[AN.qi] ? '<div class="ana-qi">' + hesc(t[AN.qi]) + '</div>' : '';

  var anaPanel = (preAna || stepAna || expAna || qiBadges)
    ? '<div class="sv-analysis-panel">' +
        '<div class="sv-analysis-title">AI Analysis</div>' +
        (preAna  ? '<div class="ana-section"><div class="ana-field-label">사전조건</div>' + preAna  + '</div>' : '') +
        (stepAna ? '<div class="ana-section"><div class="ana-field-label">Test Step</div>' + stepAna + '</div>' : '') +
        (expAna  ? '<div class="ana-section"><div class="ana-field-label">기대결과</div>' + expAna  + '</div>' : '') +
        (qiBadges? '<div class="ana-section"><div class="ana-field-label">품질 이슈</div>' + qiBadges + '</div>' : '') +
      '</div>'
    : '';

  // ── Context Summary 패널 ──────────────────────────────────
  var ctxFeature = t[CTX.feature] || '';
  var ctxScreen  = t[CTX.screen]  || '';
  var ctxScenario= t[CTX.scenario]|| '';
  var ctxFlow    = t[CTX.flowPos] || '';
  var ctxGoal    = t[CTX.userGoal]|| '';
  var ctxPanel = (ctxFeature || ctxScreen || ctxScenario)
    ? '<div class="sv-ctx-panel">' +
        '<div class="sv-ctx-title">Context Summary</div>' +
        '<div class="sv-ctx-body">' +
          (ctxFeature  ? '<div class="ctx-chip"><span class="ctx-label">Feature</span><span class="ctx-val">' + hesc(ctxFeature) + '</span></div>' : '') +
          (ctxScreen   ? '<div class="ctx-chip"><span class="ctx-label">Screen</span><span class="ctx-val">'  + hesc(ctxScreen)  + '</span></div>' : '') +
          (ctxScenario ? '<div class="ctx-chip"><span class="ctx-label">Scenario</span><span class="ctx-val">'+ hesc(ctxScenario)+ '</span></div>' : '') +
          (ctxFlow     ? '<div class="ctx-chip"><span class="ctx-label">Flow</span><span class="ctx-val">'    + hesc(ctxFlow)    + '</span></div>' : '') +
          (ctxGoal     ? '<div class="ctx-goal"><span class="ctx-label">User Goal</span> ' + hesc(ctxGoal) + '</div>' : '') +
        '</div>' +
      '</div>'
    : '';

  // ── Normalization Summary 패널 ───────────────────────────
  var normSummary = t[NORM.summary] || '';
  var normPanel = normSummary
    ? '<div class="sv-norm-panel">' +
        '<div class="sv-norm-title">Normalization Summary</div>' +
        '<div class="sv-norm-body">' +
          normSummary.split('\n').map(function(line){
            return line ? '<div class="norm-item">' + hesc(line) + '</div>' : '';
          }).join('') +
        '</div>' +
      '</div>'
    : '';

  var reviewPanel = '';  // DOM은 renderCompare에서 buildReviewPanelEl로 삽입

  // ── Semantic Validation ───────────────────────────────────
  var matchPct = parseInt(t[S.match] || 100);
  var status   = t[S.status] || '';
  var matchCls = matchPct >= 90 ? 'sem-high' : matchPct >= 75 ? 'sem-mid' : 'sem-low';
  var preserved = status.indexOf('Preserved') >= 0;

  var semPanel =
    '<div class="sv-sem-panel">' +
      '<div class="sv-sem-title">Semantic Validation</div>' +
      '<div class="sv-sem-body">' +
        '<div class="sv-sem-intent">' +
          '<div class="sem-int-col">' +
            '<div class="sem-label">Original Intent</div>' +
            '<div class="sem-text">' + (t[I.orig] ? hesc(t[I.orig]) : '<span class="sv-empty">—</span>') + '</div>' +
          '</div>' +
          '<div class="sem-int-col">' +
            '<div class="sem-label">AI Intent</div>' +
            '<div class="sem-text">' + (t[I.ai] ? hesc(t[I.ai]) : '<span class="sv-empty">—</span>') + '</div>' +
          '</div>' +
          '<div class="sv-sem-score">' +
            '<div class="sem-pct ' + matchCls + '">' + matchPct + '%</div>' +
            '<div class="sem-verdict ' + (preserved?'sv-ok':'sv-ng') + '">' +
              (preserved?'✔ Meaning Preserved':'✘ Meaning Changed') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sv-fcp">' +
          '<span class="fcp-label">Final Check Point</span>' +
          '<div class="fcp-box">' + (t[I.fcp] ? hesc(t[I.fcp]) : '<span class="sv-empty">—</span>') + '</div>' +
        '</div>' +
        '<div class="sv-sem-reason">' +
          '<span class="sem-reason-label">판단 근거</span> ' +
          hesc(t[S.reason] || '—') +
        '</div>' +
      '</div>' +
    '</div>';

  // ── 이슈 뱃지 (헤더) ─────────────────────────────────────
  var issueBadges = issues.map(function(q){
    return '<span class="cmp-issue-badge ic-'+q[2]+'"' +
      ' onclick="scrollToCompare(\''+q[0].replace(/'/g,"\\'")+'\','+q[1]+')"' +
      ' title="'+hesc(q[3])+'">'+( ISSUE_LABELS[q[2]]||q[2] )+'</span>';
  }).join('');

  // ── 자동화 태그 ──────────────────────────────────────────
  buildTCAutoIndex();
  var autoInfo = tc_auto_idx ? tc_auto_idx.get(t[0] + '|' + t[1]) : null;
  var autoTag = '';
  if (autoInfo) {
    if (autoInfo.auto === 1) {
      autoTag = '<span class="auto-tag auto-yes" title="기대결과에 명확한 상태 변화 키워드가 있어 자동화 검증이 가능합니다.">⚡ 자동화 가능</span>';
    } else if (autoInfo.manual === 1) {
      autoTag = '<span class="auto-tag auto-manual" title="시각적 판단, 하드웨어, 음성 등 수동 확인이 필요합니다.">👁 수동 필요</span>';
    } else {
      autoTag = '<span class="auto-tag auto-no" title="기대결과가 서술형이거나 조건부여서 자동화 단언 작성이 어렵습니다.">✗ 자동화 어려움</span>';
    }
  }

  // ── 헤더 ─────────────────────────────────────────────────
  var hdrBlock =
    '<div class="sv-hdr">' +
      '<span class="cmp-row-id">' + hesc(t[0]) + '</span>' +
      '<span class="cmp-row-num">행 ' + t[1] + '</span>' +
      autoTag +
      (issueBadges ? '<div class="cmp-issue-wrap">' + issueBadges + '</div>' : '') +
    '</div>';

  return '<div class="sv-block" id="' + blockId + '">' +
    hdrBlock + ctxPanel + tcPanel + anaPanel + normPanel + semPanel + reviewPanel +
  '</div>';
}

// ── renderCompare ─────────────────────────────────────────────
function renderCompare() {
  if (!qi_idx) buildCmpIndexes();
  var filtered = cmpFiltered();
  var total    = filtered.length;
  var pages    = Math.max(1, Math.ceil(total / CMP_PAGE));
  cmpPage = Math.min(cmpPage, pages);
  var page = filtered.slice((cmpPage-1)*CMP_PAGE, cmpPage*CMP_PAGE);

  var el = document.getElementById('cmp-body');
  if (!el) return;

  if (page.length) {
    el.innerHTML = page.map(buildTCBlock).join('');
    // 검수 의견 패널 DOM 삽입
    page.forEach(function(t) {
      var blockId = 'cmp-row-' + (t[0]+'-'+t[1]).replace(/[\s.()\/-]/g,'-');
      var block = document.getElementById(blockId);
      if (block) block.appendChild(buildReviewPanelEl(t[0], t[1]));
    });
    // DB에서 불러온 의견 반영
    if (Object.keys(reviewStore).length > 0) {
      Object.keys(reviewStore).forEach(function(key) {
        var panel = document.querySelector('.sv-review-panel[data-rv-key="' + key + '"]');
        if (!panel) return;
        var ta = panel.querySelector('.rv-note');
        if (ta) ta.value = reviewStore[key].note;
        var sa = panel.querySelector('.rv-saved-at');
        if (sa) sa.textContent = reviewStore[key].savedAt ? reviewStore[key].savedAt + ' 저장됨' : '';
      });
    }
  } else {
    el.innerHTML = '<div class="empty-cell" style="padding:40px;text-align:center">데이터 없음</div>';
  }

  var cnt = document.getElementById('cmp-count');
  if (cnt) cnt.textContent = total + '건';
  var info = document.getElementById('cmp-page-info');
  if (info) info.textContent = total + '건 중 ' +
    (total ? Math.min((cmpPage-1)*CMP_PAGE+1,total) : 0) + '–' +
    Math.min(cmpPage*CMP_PAGE, total);
  renderPagination('cmp-pager', cmpPage, pages, function(p){
    cmpPage = p;
    renderCompare();
    // 페이지 이동 시 '원본 TC vs AI 분석 결과' 섹션 상단으로 스크롤
    var card = document.getElementById('card-compare');
    var content = document.querySelector('.content');
    if (card && content) {
      var cardTop = card.getBoundingClientRect().top
                  - content.getBoundingClientRect().top
                  + content.scrollTop;
      content.scrollTo({ top: cardTop - 16, behavior: 'smooth' });
    }
  });
}

// ── scrollToCompare ───────────────────────────────────────────
function scrollToCompare(svc, row) {
  cmpFilter.svc = svc;
  var sel = document.getElementById('cmp-svc');
  if (sel) sel.value = svc;
  if (typeof rebuildCmpIssueSelect === 'function') rebuildCmpIssueSelect(svc);
  currentSvc = svc;
  buildSidebar();
  cmpPage = 1;

  var filtered = cmpFiltered();
  var idx = filtered.findIndex(function(t){ return t[0]===svc && t[1]===row; });
  if (idx >= 0) cmpPage = Math.floor(idx / CMP_PAGE) + 1;
  renderCompare();

  var card = document.getElementById('card-compare');
  if (card) card.classList.remove('collapsed');

  // .content 가 실제 스크롤 컨테이너 — card 의 .content 내 상대 위치 계산
  var content = document.querySelector('.content');
  if (card && content) {
    var cardTop = card.getBoundingClientRect().top
                - content.getBoundingClientRect().top
                + content.scrollTop;
    content.scrollTo({ top: cardTop - 16, behavior: 'smooth' });
  }

  // 해당 행 하이라이트 (렌더링 + 스크롤 완료 후)
  setTimeout(function() {
    var id = 'cmp-row-' + (svc+'-'+row).replace(/[\s.()\/-]/g,'-');
    var el = document.getElementById(id);
    if (el) {
      // cmp-body 기준 상대 top → content 스크롤 위치로 변환
      var elTop = el.getBoundingClientRect().top
                - content.getBoundingClientRect().top
                + content.scrollTop;
      content.scrollTo({ top: elTop - 16, behavior: 'smooth' });
      el.classList.remove('cmp-highlight');
      void el.offsetWidth;
      el.classList.add('cmp-highlight');
    }
  }, 400);
}


// ── 자동화 가능성 분석 ──────────────────────────────────────

function scrollToAutoAnalysis() {
  const card = document.getElementById('card-automation');
  if (!card) return;
  card.classList.remove('collapsed');
  renderAutomationAnalysis();
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function renderAutomationAnalysis() {
  const el = document.getElementById('auto-analysis-body');
  if (!el) return;

  // TC_RAW: [svc, row, cat1, cat2, priority, os, ui, data, func, perm, exc, net, notif, multi, state, content, hasPrecond, autoCandidate, manualReq]
  // 필터: 현재 서비스 필터 적용
  const tcs = svcData().length < COVERAGE.services.length
    ? TC_RAW.filter(t => t[0] === currentSvc)
    : TC_RAW;

  const total   = tcs.length;
  const autoCnt = tcs.filter(t => t[17] === 1).length;
  const manualCnt = tcs.filter(t => t[18] === 1).length;
  const notAutoCnt = total - autoCnt;
  const autoPct  = total ? Math.round(autoCnt / total * 100) : 0;
  const nAutoPct = total ? Math.round(notAutoCnt / total * 100) : 0;

  // ── 자동화 가능 유형 분류 ──
  const AUTO_GROUPS = [
    { label: '요소 표시 / 노출 확인',      desc: '화면에 특정 요소나 텍스트가 표시·노출되는지 검증. UI 테스트 프레임워크로 요소 존재 여부를 단언할 수 있음.', kws: ['표시됨','노출됨','표시된다','노출된다','표시됩니다','노출됩니다','확인됨','확인된다'] },
    { label: '화면 이동 / 전환',           desc: '특정 액션 후 올바른 화면으로 이동하는지 검증. URL·화면 전환 여부를 자동으로 단언할 수 있음.', kws: ['이동됨','이동된다','이동됩니다','전환됨','전환된다','랜딩됨','랜딩된다','진입됨','진입된다'] },
    { label: '데이터 변경 / 저장',         desc: '입력값이 저장·반영·변경되는지 검증. DB 또는 API 응답으로 자동 검증 가능.', kws: ['변경됨','변경된다','저장됨','저장된다','추가됨','추가된다','삭제됨','삭제된다','반영됨','반영된다','업데이트됨'] },
    { label: '상태 활성화 / 비활성화',     desc: '버튼·토글·설정의 상태 전환을 검증. 속성 값으로 자동 단언 가능.', kws: ['활성화됨','활성화된다','비활성화됨','비활성화된다','설정됨','설정된다','해제됨','해제된다'] },
    { label: '처리 완료 / 생성',           desc: '특정 프로세스가 완료되거나 항목이 생성되는지 검증. 결과물 존재 여부로 자동 단언 가능.', kws: ['완료됨','완료된다','생성됨','생성된다','처리됨','전송됨','취소됨'] },
  ];

  const autoGroupCnt = AUTO_GROUPS.map(g => {
    const cnt = tcs.filter(t => {
      if (t[17] !== 1) return false;
      const exp = (AI_STD.find(a => a[0]===t[0] && a[1]===t[1]) || [])[16] || '';
      return g.kws.some(kw => exp.includes(kw));
    }).length;
    return { ...g, cnt };
  });
  const autoOther = autoCnt - autoGroupCnt.reduce((s,g)=>s+g.cnt,0);

  // ── 자동화 어려운 이유 분류 ──
  const HARD_GROUPS = [
    { label: '서술형 · 설명형 기대결과',   icon: '📝', color: '#6366f1', desc: '기대결과가 "~ 확인한다", "~ 등이 있다" 처럼 검증 기준이 명확하지 않은 문장으로 작성됨. 자동화 스크립트가 Pass/Fail을 판단하기 어려움.' },
    { label: '조건부 · 복수 시나리오',     icon: '🔀', color: '#8b5cf6', desc: '"경우에 따라", "케이스별로" 등 분기 조건이 있는 TC. 단일 자동화 스크립트로 모든 경우를 커버하기 복잡함.' },
    { label: '모호한 기대결과',            icon: '❓', color: '#f59e0b', desc: '"정상 동작", "확인 필요" 등 구체적인 기준값이 없는 표현. 자동화 단언(assertion) 작성이 불가능함.' },
    { label: '다중 기기 · OS 차이 확인',   icon: '📱', color: '#10b981', desc: 'Android/iOS 또는 다중 기기 동시 확인이 필요한 TC. 단일 디바이스 자동화로는 커버 불가.' },
    { label: '기대결과 미입력',            icon: '⚠️', color: '#ef4444', desc: '기대결과가 비어 있거나 미완성 상태. 자동화의 전제 조건인 검증 기준이 없음.' },
    { label: '외부 서버 · 실시간 데이터', icon: '🌐', color: '#3b82f6', desc: '어드민 설정, 서버 응답, 실시간 데이터에 의존하는 TC. 테스트 환경 구성이 복잡함.' },
    { label: '카메라 · 음성 · 하드웨어',  icon: '🎙️', color: '#ec4899', desc: '카메라 촬영, 음성 인식, 진동 등 하드웨어 직접 제어가 필요. 에뮬레이터/시뮬레이터 한계.' },
    { label: '시각적 · UX 판단 필요',     icon: '👁️', color: '#64748b', desc: '"자연스럽게", "매끄럽게" 등 사람의 시각적 판단이 필요한 항목. 픽셀/애니메이션 자동 비교로 부분 대체 가능.' },
  ];

  const HARD_KWS = {
    '서술형 · 설명형 기대결과':  [],  // fallback
    '조건부 · 복수 시나리오':    ['경우','조건','케이스','시나리오','분기'],
    '모호한 기대결과':           ['확인 필요','등','기타','참고','적절','정상 동작'],
    '다중 기기 · OS 차이 확인':  ['멀티디바이스','다른 기기','iOS','Android','OS 차이'],
    '기대결과 미입력':           [],
    '외부 서버 · 실시간 데이터': ['어드민','서버에서','내려주는','실시간','API'],
    '카메라 · 음성 · 하드웨어':  ['카메라','음성','촬영','마이크','GPS','진동'],
    '시각적 · UX 판단 필요':     ['자연스럽게','버벅임','깨지지','느낌'],
  };

  const hardGroupCnt = HARD_GROUPS.map(g => {
    let cnt = 0;
    const kws = HARD_KWS[g.label] || [];
    tcs.forEach(t => {
      if (t[17] === 1) return;
      const exp  = t[3] || ''; // cat2 임시 — 실제는 AI_STD에서 가져와야 하나 성능상 TC_RAW 기준
      const aiRow = AI_STD.find(a => a[0]===t[0] && a[1]===t[1]);
      const expText = aiRow ? (aiRow[16]||'') + ' ' + (aiRow[15]||'') : '';
      if (g.label === '기대결과 미입력') {
        if (!expText.trim()) cnt++;
      } else if (kws.length && kws.some(kw => expText.includes(kw))) {
        cnt++;
      }
    });
    return { ...g, cnt };
  });
  // 서술형은 나머지로 계산
  const hardAssigned = hardGroupCnt.filter(g=>g.label!=='서술형 · 설명형 기대결과').reduce((s,g)=>s+g.cnt,0);
  const hardDescCnt  = notAutoCnt - hardAssigned;
  const hardGroupFinal = hardGroupCnt.map(g =>
    g.label === '서술형 · 설명형 기대결과' ? { ...g, cnt: Math.max(0, hardDescCnt) } : g
  ).filter(g => g.cnt > 0)
   .sort((a,b) => b.cnt - a.cnt);

  // ── 렌더링 ──
  const bar = (val, max, color) => {
    const w = max ? Math.round(val/max*100) : 0;
    return `<div class="auto-bar-track"><div class="auto-bar-fill" style="width:${w}%;background:${color}"></div></div>`;
  };

  el.innerHTML = `
    <div class="auto-summary-row">
      <div class="auto-gauge-wrap">
        <svg viewBox="0 0 120 60" class="auto-gauge">
          <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#2e3350" stroke-width="12"/>
          <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#6366f1"
            stroke-width="12" stroke-dasharray="${autoPct * 1.57} 157"
            stroke-linecap="round"/>
          <text x="60" y="52" text-anchor="middle" font-size="18" font-weight="800" fill="#e2e8f0">${autoPct}%</text>
        </svg>
        <div class="auto-gauge-label">자동화 가능</div>
      </div>
      <div class="auto-kpi-grid">
        <div class="auto-kpi-item">
          <div class="auto-kpi-val" style="color:#6366f1">${autoCnt.toLocaleString()}</div>
          <div class="auto-kpi-lbl">자동화 후보</div>
        </div>
        <div class="auto-kpi-item">
          <div class="auto-kpi-val" style="color:#f87171">${notAutoCnt.toLocaleString()}</div>
          <div class="auto-kpi-lbl">자동화 어려움</div>
        </div>
        <div class="auto-kpi-item">
          <div class="auto-kpi-val" style="color:#fbbf24">${manualCnt.toLocaleString()}</div>
          <div class="auto-kpi-lbl">수동 확인 필요</div>
        </div>
        <div class="auto-kpi-item">
          <div class="auto-kpi-val">${total.toLocaleString()}</div>
          <div class="auto-kpi-lbl">전체 TC</div>
        </div>
      </div>
    </div>

    <div class="auto-two-col">

      <!-- 자동화 가능 유형 -->
      <div class="auto-panel">
        <div class="auto-panel-title"><span class="auto-dot" style="background:#6366f1"></span>자동화 가능한 이유</div>
        <div class="auto-panel-desc">기대결과에 명확한 상태 변화 키워드가 있어 테스트 프레임워크가 Pass/Fail을 자동으로 판단할 수 있는 케이스입니다.</div>
        ${autoGroupCnt.filter(g=>g.cnt>0).map(g=>`
          <div class="auto-group-item">
            <div class="auto-group-hdr">
              <span class="auto-group-name">${g.label}</span>
              <span class="auto-group-cnt">${g.cnt}건 (${total?Math.round(g.cnt/total*100):0}%)</span>
            </div>
            ${bar(g.cnt, autoCnt, '#6366f1')}
            <div class="auto-group-desc">${g.desc}</div>
          </div>`).join('')}
        ${autoOther > 0 ? `<div class="auto-group-item">
          <div class="auto-group-hdr"><span class="auto-group-name">기타 명확 결과</span><span class="auto-group-cnt">${autoOther}건</span></div>
          ${bar(autoOther, autoCnt, '#818cf8')}
          <div class="auto-group-desc">위 유형 외 명확한 단언이 가능한 케이스.</div>
        </div>` : ''}
      </div>

      <!-- 자동화 어려운 이유 -->
      <div class="auto-panel">
        <div class="auto-panel-title"><span class="auto-dot" style="background:#f87171"></span>자동화가 어려운 이유</div>
        <div class="auto-panel-desc">기대결과가 모호하거나, 하드웨어·사람의 판단이 필요하거나, 복잡한 테스트 환경이 요구되는 케이스입니다.</div>
        ${hardGroupFinal.map(g=>`
          <div class="auto-group-item">
            <div class="auto-group-hdr">
              <span class="auto-group-name">${g.icon} ${g.label}</span>
              <span class="auto-group-cnt">${g.cnt}건 (${total?Math.round(g.cnt/total*100):0}%)</span>
            </div>
            ${bar(g.cnt, notAutoCnt, g.color)}
            <div class="auto-group-desc">${g.desc}</div>
          </div>`).join('')}
      </div>

    </div>
  `;
}


function getSvcPrecond(svc) {
  var s = COVERAGE.services.find(function(x){ return x.service_name === svc; });
  if (!s || !s.precond_distribution) return [];
  return Object.entries(s.precond_distribution).map(function(kv){
    return { cat: kv[0], label: kv[0], cnt: kv[1] };
  }).sort(function(a,b){ return b.cnt - a.cnt; });
}

function renderAll() {
  // 각 섹션을 독립 실행 — 한 함수 오류가 나머지를 막지 않도록 격리
  const run = (name, fn) => {
    try { fn(); }
    catch(e) { console.error(`[renderAll] ${name} 오류:`, e); }
  };

  // 데이터 로딩 건수 콘솔 확인
  console.log(
    `category_summary rows: ${CATEGORY_SUMMARY.length}`,
    `| tc_master rows: ${TC_RAW.length}`,
    `| quality_issues rows: ${QI_RAW.length}`
  );

  run('KPI',            renderKPI);
  run('ServiceDonut',   renderServiceDonut);
  run('PriorityDonut',  renderPriorityDonut);
  run('PriorityBars',   renderPriorityBars);
  run('OS',             renderOS);
  run('AttrBars',       renderAttrBars);
  run('Heatmap',        renderHeatmap);
  run('CompoundAttrs',   renderCompoundAttrs);
  run('PrecondBars',     renderPrecondBars);
  run('PrecondHeatmap',  renderPrecondSvcHeatmap);
  run('QualitySummary',  renderQualitySummary);
  run('QI',             renderQI);
  run('Compare',        renderCompare);
  run('TC',             renderTC);
  run('AutoAnalysis',   renderAutomationAnalysis);
}

// ══════════════════════════════════════════════════════════════
// 멀티 문서 지원 — 데이터 로딩
// ══════════════════════════════════════════════════════════════

function supaFetch(path) {
  return fetch(SUPA_URL + '/rest/v1/' + path, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  }).then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

// Supabase 1000행 제한 우회 — 전체 데이터를 페이지 단위로 반복 fetch
async function supaFetchAll(basePath) {
  var sep = basePath.includes('?') ? '&' : '?';
  var all = [], offset = 0, PAGE_SIZE = 1000;
  while (true) {
    var chunk = await supaFetch(basePath + sep + 'limit=' + PAGE_SIZE + '&offset=' + offset);
    all = all.concat(chunk);
    if (chunk.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

function buildCoverage(rows) {
  // 서비스 이름 앞 번호 기준 정렬 ("1.가입" → 1, "15. 알림센터" → 15)
  rows.sort(function(a, b) {
    var na = parseInt(a.service_name) || 999;
    var nb = parseInt(b.service_name) || 999;
    return na - nb;
  });

  var services = rows.map(function(r) {
    return {
      service_name:         r.service_name,
      total_tc:             r.total_tc,
      first_row:            r.first_row,
      last_row:             r.last_row,
      priority:             r.priority_dist          || {},
      os:                   r.os_dist                || {},
      attributes:           r.attributes             || {},
      precond_distribution: r.precond_distribution   || {},
      quality: {
        issue_count:        r.issue_count            || 0,
        affected_tc_count:  r.affected_tc_count      || 0,
        issue_type_counts:  r.issue_type_counts      || {},
      },
    };
  });

  var total_tc = services.reduce(function(s, x) { return s + x.total_tc; }, 0);

  var typeCounts = {};
  ISSUE_KEYS.forEach(function(k) { typeCounts[k] = 0; });
  var svcIssueCounts = {};
  var totalIssues = 0, totalAffected = 0;
  services.forEach(function(s) {
    var q = s.quality || {};
    totalIssues   += q.issue_count        || 0;
    totalAffected += q.affected_tc_count  || 0;
    svcIssueCounts[s.service_name] = q.issue_count || 0;
    Object.entries(q.issue_type_counts || {}).forEach(function(_ref) {
      var k = _ref[0], v = _ref[1];
      if (k in typeCounts) typeCounts[k] += v;
    });
  });
  var topType = Object.entries(typeCounts).sort(function(a,b){return b[1]-a[1];})[0];
  var topSvc  = Object.entries(svcIssueCounts).sort(function(a,b){return b[1]-a[1];})[0];

  return {
    total_tc: total_tc,
    services: services,
    quality: {
      total_issues:         totalIssues,
      affected_tc_count:    totalAffected,
      issue_type_counts:    typeCounts,
      service_issue_counts: svcIssueCounts,
      top_issue_type:       topType ? topType[0] : '',
      top_issue_service:    topSvc  ? topSvc[0]  : '',
    },
  };
}

async function switchDocument(docId) {
  docId = Number(docId);
  if (!docId || docId === currentDocId) return;

  var overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'flex';

  // 비교 뷰 상태 초기화
  cmpPage = 1; cmpFilter = { svc: 'all', issue: 'all' };
  AI_STD = []; qi_idx = null; tc_auto_idx = null;

  try {
    currentDocId = docId;

    var results = await Promise.all([
      supaFetch('coverage_service?document_id=eq.' + docId),
      supaFetchAll('tc_master?document_id=eq.' + docId +
        '&select=service_name,row_number,category_1,category_2,category_3,category_4,' +
        'priority,os,compound_attribute,ui_visibility,data_change,function_behavior,' +
        'permission_auth,exception_error,network_server,notification,multi_device_os,' +
        'state_persistence,content_media,has_precondition,automation_candidate,manual_required' +
        '&order=service_name,row_number'),
      supaFetchAll('quality_issues?document_id=eq.' + docId +
        '&select=service_name,row_number,issue_type,issue_reason,priority,os,category_path,test_step,expected_result' +
        '&order=service_name,row_number'),
      supaFetchAll('ai_standard_tc?document_id=eq.' + docId +
        '&select=service_name,row_number,' +
        'orig_cat1,orig_cat2,orig_cat3,orig_cat4,orig_precond,orig_step,orig_expected,orig_priority,' +
        'ai_cat1,ai_cat2,ai_cat3,ai_cat4,ai_precond,ai_step,ai_expected,ai_priority,' +
        'precond_norm_type,precond_evidence,step_norm_type,step_reason,' +
        'expected_norm_type,expected_reason,quality_issues,original_intent,ai_intent,' +
        'final_check_point,meaning_match_pct,meaning_status,sem_reason,' +
        'ctx_feature,ctx_screen,ctx_scenario,ctx_user_goal,ctx_flow_position,norm_summary' +
        '&order=service_name,row_number'),
    ]);
    var covRows = results[0], tcRows = results[1], qiRows = results[2], aiRows = results[3];

    COVERAGE = buildCoverage(covRows);

    TC_RAW = tcRows.map(function(r) {
      return [
        r.service_name, r.row_number,
        r.category_1, r.category_2, r.priority, r.os,
        r.ui_visibility, r.data_change, r.function_behavior, r.permission_auth,
        r.exception_error, r.network_server, r.notification, r.multi_device_os,
        r.state_persistence, r.content_media, r.has_precondition,
        r.automation_candidate, r.manual_required, r.compound_attribute,
      ];
    });

    QI_RAW = qiRows.map(function(r) {
      return [
        r.service_name, r.row_number, r.issue_type, r.issue_reason,
        r.priority, r.os, r.category_path, r.test_step, r.expected_result,
      ];
    });

    // AI_STD positional array — buildTCBlock() 인덱스 순서 맞춤
    // [0]svc [1]row [2]orig_cat1 [3]orig_cat2 [4]orig_cat3 [5]orig_cat4
    // [6]orig_precond [7]orig_step [8]orig_expected [9]orig_priority
    // [10]ai_cat1 [11]ai_cat2 [12]ai_cat3 [13]ai_cat4
    // [14]ai_precond [15]ai_step [16]ai_expected [17]ai_priority
    // [18]precond_norm_type [19]precond_evidence [20]step_norm_type [21]step_reason
    // [22]expected_norm_type [23]expected_reason [24]quality_issues
    // [25]original_intent [26]ai_intent [27]final_check_point
    // [28]meaning_match_pct [29]meaning_status [30]sem_reason
    // [31]ctx_feature [32]ctx_screen [33]ctx_scenario [34]ctx_user_goal
    // [35]ctx_flow_position [36]norm_summary
    AI_STD = aiRows.map(function(r) {
      return [
        r.service_name, r.row_number,
        r.orig_cat1, r.orig_cat2, r.orig_cat3, r.orig_cat4,
        r.orig_precond, r.orig_step, r.orig_expected, r.orig_priority,
        r.ai_cat1, r.ai_cat2, r.ai_cat3, r.ai_cat4,
        r.ai_precond, r.ai_step, r.ai_expected, r.ai_priority,
        r.precond_norm_type, r.precond_evidence,
        r.step_norm_type, r.step_reason,
        r.expected_norm_type, r.expected_reason,
        r.quality_issues,
        r.original_intent, r.ai_intent, r.final_check_point,
        r.meaning_match_pct, r.meaning_status, r.sem_reason,
        r.ctx_feature, r.ctx_screen, r.ctx_scenario,
        r.ctx_user_goal, r.ctx_flow_position, r.norm_summary,
      ];
    });

    // 필터/상태 초기화
    currentSvc = 'all';
    tcPage = 1; qiPage = 1;
    tcFilter = { priority:'all', os:'all', attr:'all' };
    qiFilter = { svc:'all', type:'all', priority:'all', os:'all' };

    // badge 업데이트
    var badge = document.getElementById('doc-badge');
    if (badge) badge.textContent = COVERAGE.total_tc.toLocaleString() + ' TC · Phase 1~4';

    await loadAllReviews();
    buildSidebar();
    bindFilters();
    renderAll();

  } catch(e) {
    console.error('문서 전환 실패:', e);
    var body = document.querySelector('.content');
    if (body) body.innerHTML = '<div style="padding:40px;color:#f87171">문서 로드 실패: ' + e.message + '</div>';
  } finally {
    if (overlay) overlay.style.display = 'none';
  }
}

async function loadDocumentList() {
  var sel = document.getElementById('doc-select');
  if (!sel) return;

  try {
    // Supabase documents 테이블에서 직접 조회 (server.py 불필요)
    var docs = await supaFetch('documents?select=id,name,filename,total_tc&order=created_at');

    sel.innerHTML = '';
    if (!docs.length) {
      var opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '분석된 문서 없음';
      sel.appendChild(opt);
      return;
    }

    docs.forEach(function(d) {
      var opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      sel.appendChild(opt);
    });

    // 가장 최근 문서 자동 로드
    var latest = docs[docs.length - 1];
    sel.value = latest.id;
    await switchDocument(latest.id);

  } catch(e) {
    console.error('[loadDocumentList] 실패:', e.message);
    sel.innerHTML = '<option value="">문서 로드 실패</option>';
  }
}

// ── 분석 실행 모달 ─────────────────────────────────────────

window.openAnalyzeModal = async function() {
  var modal = document.getElementById('analyze-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('analyze-progress').style.display = 'none';
  document.getElementById('analyze-log').textContent = '';
  var runBtn = document.getElementById('analyze-run-btn');
  if (runBtn) { runBtn.disabled = false; runBtn.textContent = '분석 시작'; }

  // server.py 없이는 파일 목록 조회 불가 — 안내 메시지 표시
  try {
    var r = await fetch('/api/input-files');
    if (!r.ok) throw new Error();
    var files = await r.json();
    var sel = document.getElementById('analyze-file-select');
    sel.innerHTML = '';
    files.forEach(function(f) {
      var opt = document.createElement('option');
      opt.value = f.filename;
      opt.textContent = f.filename + (f.analyzed ? ' ✓ 분석됨' : '');
      sel.appendChild(opt);
    });
    sel.dispatchEvent(new Event('change'));
  } catch(e) {
    var body = document.getElementById('analyze-modal-body');
    if (body) body.innerHTML =
      '<div style="padding:20px;color:#94a3b8;font-size:13px;line-height:1.8">' +
      '새 문서 분석은 로컬 환경에서만 가능합니다.<br><br>' +
      '터미널에서 실행하세요:<br>' +
      '<code style="background:#0f1117;padding:8px 12px;border-radius:6px;display:block;margin-top:8px;font-size:12px;color:#67e8f9">' +
      'python3 upload_to_db.py</code></div>';
  }
};

window.closeAnalyzeModal = function() {
  var modal = document.getElementById('analyze-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

window.runAnalysis = async function() {
  var filename = document.getElementById('analyze-file-select').value;
  var name     = document.getElementById('analyze-name-input').value.trim() || filename;
  if (!filename) return;

  var runBtn = document.getElementById('analyze-run-btn');
  runBtn.disabled = true;
  runBtn.textContent = '분석 중...';
  document.getElementById('analyze-progress').style.display = 'block';

  try {
    var r = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: filename, name: name }),
    });
    var _ref = await r.json();
    var jobId = _ref.job_id;

    var logEl = document.getElementById('analyze-log');
    var bar   = document.getElementById('analyze-progress-bar');

    var pollId = setInterval(async function() {
      try {
        var sr = await fetch('/api/analyze/status/' + jobId);
        var st = await sr.json();
        if (st.log) logEl.textContent = st.log.slice(-30).join('\n');
        if (bar) bar.style.width = st.status === 'done' ? '100%' : '60%';

        if (st.status === 'done') {
          clearInterval(pollId);
          runBtn.textContent = '완료 ✓';
          await loadDocumentList();
          if (st.document_id) {
            var docSel = document.getElementById('doc-select');
            if (docSel) docSel.value = st.document_id;
            await switchDocument(st.document_id);
          }
          setTimeout(function() { window.closeAnalyzeModal(); }, 1200);

        } else if (st.status === 'error') {
          clearInterval(pollId);
          runBtn.textContent = '실패';
          runBtn.disabled = false;
        }
      } catch(_e) { /* 일시적 네트워크 오류 무시 */ }
    }, 2000);

  } catch(e) {
    runBtn.textContent = '요청 실패';
    runBtn.disabled = false;
    console.error(e);
  }
};

// ── 초기화 ───────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', function() {
  bindToggles();

  // 문서 드롭다운 change 이벤트
  var docSel = document.getElementById('doc-select');
  if (docSel) {
    docSel.addEventListener('change', function(e) {
      if (e.target.value) switchDocument(e.target.value);
    });
  }

  // 분석 파일 선택 시 이름 자동입력
  var fileSel = document.getElementById('analyze-file-select');
  if (fileSel) {
    fileSel.addEventListener('change', function(e) {
      var nameInput = document.getElementById('analyze-name-input');
      if (nameInput && !nameInput.value) {
        nameInput.value = e.target.value.replace(/\.xlsx$/i, '');
      }
    });
  }

  loadDocumentList();

  var rt;
  window.addEventListener('resize', function() {
    clearTimeout(rt);
    rt = setTimeout(function() { renderServiceDonut(); renderPriorityDonut(); }, 150);
  });
});
