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

  var blockId = 'cmp-row-' + (t[0]+'-'+t[1]).replace(/[\s.()/]/g,'-');

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
          '<span class="fcp-text">' + (t[I.fcp] ? hesc(t[I.fcp]) : '<span class="sv-empty">—</span>') + '</span>' +
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

  // ── 헤더 ─────────────────────────────────────────────────
  var hdrBlock =
    '<div class="sv-hdr">' +
      '<span class="cmp-row-id">' + hesc(t[0]) + '</span>' +
      '<span class="cmp-row-num">행 ' + t[1] + '</span>' +
      (issueBadges ? '<div class="cmp-issue-wrap">' + issueBadges + '</div>' : '') +
    '</div>';

  return '<div class="sv-block" id="' + blockId + '">' +
    hdrBlock + tcPanel + anaPanel + semPanel +
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

  el.innerHTML = page.length
    ? page.map(buildTCBlock).join('')
    : '<div class="empty-cell" style="padding:40px;text-align:center">데이터 없음</div>';

  var cnt = document.getElementById('cmp-count');
  if (cnt) cnt.textContent = total + '건';
  var info = document.getElementById('cmp-page-info');
  if (info) info.textContent = total + '건 중 ' +
    (total ? Math.min((cmpPage-1)*CMP_PAGE+1,total) : 0) + '–' +
    Math.min(cmpPage*CMP_PAGE, total);
  renderPagination('cmp-pager', cmpPage, pages, function(p){ cmpPage=p; renderCompare(); });
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

  setTimeout(function() {
    var id = 'cmp-row-' + (svc+'-'+row).replace(/[\s.()/]/g,'-');
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior:'smooth', block:'center' });
      el.classList.remove('cmp-highlight');
      void el.offsetWidth;
      el.classList.add('cmp-highlight');
    }
  }, 150);
}
