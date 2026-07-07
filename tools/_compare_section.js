// ── 비교 뷰 상태 ──────────────────────────────────────────────
let cmpPage = 1;
const CMP_PAGE = 20;
let cmpFilter = { svc: 'all', issue: 'all' };

// ── 인덱스 ────────────────────────────────────────────────────
// qi_idx : Map<"svc|row" → QI[]>
let qi_idx = null;

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
  return FULL_TC.filter(function(t) {
    if (currentSvc !== 'all' && t[0] !== currentSvc) return false;
    if (cmpFilter.svc !== 'all' && t[0] !== cmpFilter.svc) return false;
    if (cmpFilter.issue === 'all') return true;
    var issues = qi_idx.get(t[0] + '|' + t[1]) || [];
    if (cmpFilter.issue === 'has_issue') return issues.length > 0;
    return issues.some(function(q) { return q[2] === cmpFilter.issue; });
  });
}

// ── HTML 이스케이프 ──────────────────────────────────────────
function hesc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ── Priority raw → chip ──────────────────────────────────────
function pchipRaw(raw) {
  if (!raw && raw !== 0) return '<span class="cmp-empty">—</span>';
  var pn = parseFloat(String(raw));
  var norm = (!isNaN(pn) && pn >= 0 && pn <= 5 && pn === Math.floor(pn))
    ? 'P' + Math.floor(pn) : String(raw);
  return '<span class="pchip pchip-' + norm + '">' + norm + '</span>';
}

// ── OS raw 정규화 (표시용) ──────────────────────────────────
function osNorm(raw) {
  var s = String(raw || '').toLowerCase().trim();
  if (s === 'app') return '공통';
  if (s === 'a' || s === 'android') return 'Android';
  if (s === 'i' || s === 'ios') return 'iOS';
  if (s === '-' || s === '') return '—';
  return raw || '—';
}

// ── Diff 분류 ───────────────────────────────────────────────
// 반환: 'same' | 'added' | 'modified' | 'conflict'
var FIELD_ISSUE_MAP = {
  precond:  ['missing_precondition'],
  step:     ['ambiguous_test_step', 'duplicated_step_expected', 'multiple_purpose'],
  expected: ['ambiguous_expected_result', 'duplicated_step_expected'],
  priority: ['invalid_priority'],
  os:       ['invalid_os'],
  cat1:     [],                  // invalid_category는 cat2 누락이 원인 → cat2에만 연결
  cat2:     ['invalid_category'],
};

// ── 이슈 유형별 한 줄 설명 ────────────────────────────────────
var ISSUE_DESC = {
  ambiguous_test_step:
    'Test Step이 비어 있거나 목적어 없이 동사만으로 구성되어 실행 방법을 파악할 수 없습니다.',
  ambiguous_expected_result:
    '기대결과가 "정상 동작" 등 모호한 표현만으로 구성되어 합격 기준을 판단할 수 없습니다.',
  missing_precondition:
    '사전조건이 없으나 특정 상태나 계정이 필요한 것으로 판단됩니다. 사전조건을 명시해야 합니다.',
  duplicated_step_expected:
    'Test Step과 기대결과의 내용이 거의 동일합니다. 검증 목적이 불명확합니다.',
  multiple_purpose:
    '하나의 TC에 독립된 목적이 여러 개 혼재합니다. TC를 목적별로 분리하는 것을 권장합니다.',
  invalid_priority:
    'Priority 값이 허용 범위(P0~P5)를 벗어납니다. 올바른 우선순위를 지정해야 합니다.',
  invalid_os:
    'OS 분류값이 표준 값(공통·Android·iOS)에 해당하지 않습니다. OS 항목을 확인해 주세요.',
  invalid_category:
    '분류2가 비어 있어 이 TC가 속한 기능 영역을 특정할 수 없습니다. 분류 체계를 보완해야 합니다.',
};

function classifyDiff(orig, ai, fname, issues) {
  var o = (orig || '').trim();
  var a = (ai   || '').trim();
  var relTypes = FIELD_ISSUE_MAP[fname] || [];
  var hasConflict = relTypes.length > 0 &&
    issues.some(function(q) { return relTypes.indexOf(q[2]) >= 0; });

  // 이슈가 있는 필드는 값이 있든 없든 conflict 표시
  // (빈 값이 이슈의 원인인 경우도 포함: Test Step 모호, 사전조건 누락 등)
  if (hasConflict) return 'conflict';

  if (!o && !a) return 'same';
  if (!o &&  a) return 'added';
  if ( o && !a) return 'same';
  if (o === a)  return 'same';
  return 'modified';
}

// ── 셀 HTML 쌍 생성 ─────────────────────────────────────────
// 원본: 항상 raw 그대로, 연한 색
// AI  : diff 색상 적용
function makeCells(orig, ai, fname, issues) {
  var o = (orig || '').trim();
  var a = (ai   || '').trim();
  var kind = classifyDiff(orig, ai, fname, issues);

  // 원본: conflict면 이슈 강조(빨간 점선 테두리), 아니면 연한 색
  var origHtml;
  if (kind === 'conflict') {
    origHtml = o
      ? '<span class="cmp-orig-val orig-conflict">' + hesc(o) + '</span>'
      : '<span class="cmp-empty orig-conflict">—</span>';
  } else {
    origHtml = o
      ? '<span class="cmp-orig-val">' + hesc(o) + '</span>'
      : '<span class="cmp-empty">—</span>';
  }

  // AI 결과
  var aiHtml;
  if (kind === 'same') {
    var display = a || o;
    aiHtml = display
      ? '<span class="cmp-val cmp-same">' + hesc(display) + '</span>'
      : '<span class="cmp-empty">—</span>';
  } else if (kind === 'added') {
    aiHtml = '<span class="cmp-val diff-add">' + hesc(a) + '</span>';
  } else if (kind === 'modified') {
    aiHtml = '<span class="cmp-val diff-mod">' + hesc(a) + '</span>';
  } else {
    // conflict: 빈칸이면 빈칸 강조, 값 있으면 값 강조
    aiHtml = a
      ? '<span class="cmp-val diff-conflict">' + hesc(a) + '</span>'
      : '<span class="cmp-empty diff-conflict">—</span>';
  }
  return { origHtml: origHtml, aiHtml: aiHtml, kind: kind };
}

// ── 변경 요약 계산 ───────────────────────────────────────────
function calcSummary(tc, orig, issues) {
  // orig = ORIG_MAP["svc|row"] = [precond, step, expected, priority_raw, os_raw]
  var checks = [
    { fname: 'cat1',     o: orig ? orig[0] : tc[2], a: tc[2] },
    { fname: 'cat2',     o: orig ? orig[1] : tc[3], a: tc[3] },
    { fname: 'cat3',     o: orig ? orig[2] : tc[4], a: tc[4] },
    { fname: 'cat4',     o: orig ? orig[3] : tc[5], a: tc[5] },
    { fname: 'precond',  o: orig ? orig[4] : '',    a: tc[6] },
    { fname: 'step',     o: orig ? orig[5] : tc[7], a: tc[7] },
    { fname: 'expected', o: orig ? orig[6] : tc[8], a: tc[8] },
    { fname: 'priority', o: orig ? orig[7] : '',    a: tc[10] },
  ];
  var added = 0, modified = 0, conflict = 0;
  checks.forEach(function(c) {
    var k = classifyDiff(c.o, c.a, c.fname, issues);
    if (k === 'added')    added++;
    if (k === 'modified') modified++;
    if (k === 'conflict') conflict++;
  });
  return { added: added, modified: modified, conflict: conflict };
}

function statusLabel(sum, isSplit) {
  if (isSplit) return '<span class="cmp-status status-split">TC 분리</span>';
  var parts = [];
  if (sum.conflict > 0) parts.push('<span class="cmp-status status-conflict">충돌 ' + sum.conflict + '건</span>');
  if (sum.modified > 0) parts.push('<span class="cmp-status status-mod">수정 ' + sum.modified + '건</span>');
  if (sum.added    > 0) parts.push('<span class="cmp-status status-add">보완 ' + sum.added + '건</span>');
  if (parts.length === 0) return '<span class="cmp-status status-same">변경 없음</span>';
  return parts.join(' ');
}

// ── TC 블록 생성 ─────────────────────────────────────────────
// FULL_TC 컬럼: [0]svc [1]row [2]cat1 [3]cat2 [4]cat3 [5]cat4
//               [6]precond(AI추출) [7]step [8]expected
//               [9]priority(norm) [10]priority_raw [11]os [12]compound
// ORIG_MAP["svc|row"]: [0]precond_raw [1]step_raw [2]expected_raw [3]prio_raw [4]os_raw
function buildTCBlock(tc, isSplit) {
  if (!qi_idx) buildCmpIndexes();
  var key    = tc[0] + '|' + tc[1];
  var issues = qi_idx.get(key) || [];
  var orig   = ORIG_MAP[key];   // undefined if not found

  // 원본 raw 값 (ORIG_MAP v2 구조)
  // [0]cat1 [1]cat2 [2]cat3 [3]cat4 [4]precond [5]step [6]expected [7]prio [8]os
  var rawPrecond  = orig ? orig[4] : '';
  var rawStep     = orig ? orig[5] : tc[7];
  var rawExpected = orig ? orig[6] : tc[8];
  var rawPrioRaw  = orig ? orig[7] : tc[10];
  var rawOsRaw    = orig ? orig[8] : tc[11];

  var sum       = calcSummary(tc, orig, issues);
  var blockId   = 'cmp-row-' + (tc[0] + '-' + tc[1]).replace(/[\s.()/]/g, '-');

  // 이슈 뱃지
  var issueBadges = issues.map(function(q) {
    return '<span class="cmp-issue-badge ic-' + q[2] + '"' +
      ' title="' + hesc(q[3]) + '"' +
      ' onclick="scrollToCompare(\'' + q[0].replace(/'/g, "\\'") + '\',' + q[1] + ')">' +
      (ISSUE_LABELS[q[2]] || q[2]) + '</span>';
  }).join('');

  // 8개 필드 정의
  // ORIG_MAP 컬럼: [0]cat1_raw [1]cat2_raw [2]cat3_raw [3]cat4_raw
  //               [4]precond_raw [5]step_raw [6]expected_raw [7]prio_raw [8]os_raw
  // 원본은 엑셀 raw값(공란이면 공란), AI는 tc_master 처리 후 값
  var rawCat1 = orig ? orig[0] : tc[2];
  var rawCat2 = orig ? orig[1] : tc[3];
  var rawCat3 = orig ? orig[2] : tc[4];
  var rawCat4 = orig ? orig[3] : tc[5];

  // Phase 4: 사전조건 추론 상세 (PRECOND_DETAIL 에서 조회)
  var precondInferences = (typeof PRECOND_DETAIL !== 'undefined')
    ? (PRECOND_DETAIL[key] || []) : [];

  // 추론 결과 HTML (AI 사전조건 셀 하단에 표시)
  var precondInferHtml = '';
  if (precondInferences.length > 0) {
    var inferItems = precondInferences.map(function(inf) {
      var confBadge = inf.conf === 'high'
        ? '<span class="pc-conf conf-high">high</span>'
        : '<span class="pc-conf conf-med">mid</span>';
      return '<div class="pc-infer-item">' +
        '<span class="pc-label">' + hesc(inf.label) + '</span>' +
        confBadge +
        '<div class="pc-evidence">근거: ' + hesc(inf.ev) + '</div>' +
        '<div class="pc-reason">' + hesc(inf.reason) + '</div>' +
      '</div>';
    }).join('');
    precondInferHtml =
      '<div class="pc-infer-wrap">' +
        '<div class="pc-infer-title">AI 추론 사전조건</div>' +
        inferItems +
      '</div>';
  }

  var fields = [
    { label: '분류1',    orig: rawCat1,     ai: tc[2],  fname: 'cat1' },
    { label: '분류2',    orig: rawCat2,     ai: tc[3],  fname: 'cat2' },
    { label: '분류3',    orig: rawCat3,     ai: tc[4],  fname: 'cat3' },
    { label: '화면전개', orig: rawCat4,     ai: tc[5],  fname: 'cat4' },
    { label: '사전조건', orig: rawPrecond,  ai: tc[6],  fname: 'precond',
      extraAi: precondInferHtml },  // Phase 4 추론 결과 추가
    { label: 'Test Step',orig: rawStep,     ai: tc[7],  fname: 'step' },
    { label: '기대결과', orig: rawExpected, ai: tc[8],  fname: 'expected' },
    { label: 'Priority', orig: rawPrioRaw,  ai: tc[9],  fname: 'priority', isPriority: true },
  ];

  var fieldRows = '';

  if (isSplit) {
    // TC 분리: numbered step/expected 기반으로 AI쪽만 분리 표시
    var stepLines = tc[7].split('\n').filter(function(l) { return /^\d+[.)]\s/.test(l.trim()); });
    var expLines  = tc[8].split('\n').filter(function(l) { return /^\d+[.)]\s/.test(l.trim()); });
    var subCnt    = Math.max(stepLines.length, expLines.length, 2);

    fields.forEach(function(f) {
      var origHtml = (f.orig || '').trim()
        ? '<span class="cmp-orig-val">' + hesc((f.orig || '').trim()) + '</span>'
        : '<span class="cmp-empty">—</span>';

      var aiContent;
      if (f.fname === 'step' || f.fname === 'expected') {
        var lines = f.fname === 'step' ? stepLines : expLines;
        var subs = [];
        for (var i = 0; i < subCnt; i++) {
          var sub = lines[i] ? lines[i].replace(/^\d+[.)]\s*/, '').trim() : '';
          subs.push(
            '<div class="cmp-ai-sub diff-split">' +
            (sub ? hesc(sub) : '<span class="cmp-empty">—</span>') +
            '<span class="cmp-sub-id">' + tc[1] + '-' + (i+1) + '</span></div>'
          );
        }
        aiContent = '<div class="cmp-ai-split">' + subs.join('') + '</div>';
      } else if (f.isPriority) {
        var subs2 = [];
        for (var j = 0; j < subCnt; j++) {
          subs2.push(
            '<div class="cmp-ai-sub">' + pchipRaw(f.ai) +
            '<span class="cmp-sub-id">' + tc[1] + '-' + (j+1) + '</span></div>'
          );
        }
        aiContent = '<div class="cmp-ai-split">' + subs2.join('') + '</div>';
      } else {
        var cells = makeCells(f.orig, f.ai, f.fname, issues);
        aiContent = '<div class="cmp-ai-cell-wrap"><div class="cmp-ai-cell">' + cells.aiHtml + '</div></div>';
      }

      fieldRows +=
        '<div class="cmp-field-row">' +
          '<div class="cmp-label">' + f.label + '</div>' +
          '<div class="cmp-orig-cell">' + origHtml + '</div>' +
          aiContent +
        '</div>';
    });

  } else {
    // 일반 1:1
    fields.forEach(function(f) {
      var origHtml, aiHtml;
      if (f.isPriority) {
        var kind = classifyDiff(f.orig, f.ai, f.fname, issues);
        origHtml = '<span class="cmp-orig-val">' + pchipRaw(f.orig) + '</span>';
        var cls = kind === 'same'     ? 'cmp-same'
                : kind === 'added'    ? 'diff-add'
                : kind === 'conflict' ? 'diff-conflict'
                : 'diff-mod';
        aiHtml = '<span class="' + cls + '">' + pchipRaw(f.ai) + '</span>';
      } else {
        var c = makeCells(f.orig, f.ai, f.fname, issues);
        origHtml = c.origHtml;
        aiHtml   = c.aiHtml;
      }
      fieldRows +=
        '<div class="cmp-field-row">' +
          '<div class="cmp-label">' + f.label + '</div>' +
          '<div class="cmp-orig-cell">' + origHtml + '</div>' +
          '<div class="cmp-ai-cell-wrap"><div class="cmp-ai-cell">' +
            aiHtml +
            (f.extraAi || '') +
          '</div></div>' +
        '</div>';
    });

    // compound_attribute 행 (AI 전용)
    if (tc[12]) {
      fieldRows +=
        '<div class="cmp-field-row cmp-compound-row">' +
          '<div class="cmp-label">복합 속성</div>' +
          '<div class="cmp-orig-cell"><span class="cmp-empty">—</span></div>' +
          '<div class="cmp-ai-cell-wrap"><div class="cmp-ai-cell">' +
            '<span class="cmp-val diff-add">' + hesc(tc[12]) + '</span>' +
          '</div></div>' +
        '</div>';
    }
  }

  // 헤더: 전체 너비 1행 (3열 병합)
  // "서비스 · 행번호  |  상태 레이블  |  이슈 뱃지"

  // ── 판정 및 설명 멘트 ────────────────────────────────────────
  var hasIssue = issues.length > 0;
  var hasAttr  = !!(tc[12]);

  // 이슈별 설명 (이슈가 있을 때)
  var issueDescLines = '';
  if (hasIssue) {
    // 중복 제거 후 설명 나열
    var seenTypes = {};
    issues.forEach(function(q) {
      if (!seenTypes[q[2]] && ISSUE_DESC[q[2]]) {
        seenTypes[q[2]] = true;
        issueDescLines +=
          '<div class="cmp-desc desc-issue">' +
            '<span class="desc-bullet issue-bullet">!</span> ' +
            hesc(ISSUE_DESC[q[2]]) +
          '</div>';
      }
    });
  }

  // 정상 판정 멘트 (이슈 없을 때)
  var judgmentHtml = '';
  if (!hasIssue && !isSplit) {
    if (hasAttr) {
      judgmentHtml =
        '<div class="cmp-desc desc-ok">' +
          '<span class="desc-bullet ok-bullet">✓</span> ' +
          '테스트 목적이 명확하고 실행 및 결과 판단이 가능한 TC입니다.' +
        '</div>';
    } else if (sum.added > 0 && sum.conflict === 0 && sum.modified === 0) {
      judgmentHtml =
        '<div class="cmp-desc desc-info">' +
          '<span class="desc-bullet info-bullet">→</span> ' +
          '분류 정보가 AI에 의해 자동 보완되었습니다. 내용을 확인해 주세요.' +
        '</div>';
    } else if (sum.added === 0 && sum.modified === 0 && sum.conflict === 0) {
      judgmentHtml =
        '<div class="cmp-desc desc-neutral">' +
          '<span class="desc-bullet">–</span> ' +
          '원본 그대로 유지됩니다. 별도 처리가 필요하지 않습니다.' +
        '</div>';
    }
  }

  var hdrHtml =
    '<div class="cmp-hdr-unified">' +
      // 상단: 서비스명·행번호 + 상태 레이블 + 이슈 뱃지
      '<div class="cmp-hdr-top">' +
        '<div class="cmp-hdr-left">' +
          '<span class="cmp-row-id">' + hesc(tc[0]) + '</span>' +
          '<span class="cmp-row-num">행 ' + tc[1] + '</span>' +
        '</div>' +
        '<div class="cmp-hdr-right">' +
          (isSplit || sum.added + sum.modified + sum.conflict > 0
            ? statusLabel(sum, isSplit) : '') +
          (issueBadges ? '<div class="cmp-issue-wrap">' + issueBadges + '</div>' : '') +
        '</div>' +
      '</div>' +
      // 하단: 설명 한 줄 (이슈 설명 또는 정상 판정)
      (issueDescLines || judgmentHtml
        ? '<div class="cmp-hdr-desc">' + issueDescLines + judgmentHtml + '</div>'
        : '') +
    '</div>';

  return '<div class="cmp-block" id="' + blockId + '">' + hdrHtml + fieldRows + '</div>';
}

// ── renderCompare ─────────────────────────────────────────────
function renderCompare() {
  if (!qi_idx) buildCmpIndexes();
  var filtered = cmpFiltered();
  var total    = filtered.length;
  var pages    = Math.max(1, Math.ceil(total / CMP_PAGE));
  cmpPage = Math.min(cmpPage, pages);
  var page = filtered.slice((cmpPage - 1) * CMP_PAGE, cmpPage * CMP_PAGE);

  var el = document.getElementById('cmp-body');
  if (!el) return;

  if (!page.length) {
    el.innerHTML = '<div class="empty-cell" style="padding:40px;text-align:center">데이터 없음</div>';
  } else {
    el.innerHTML = page.map(function(tc) {
      var key    = tc[0] + '|' + tc[1];
      var issues = qi_idx.get(key) || [];
      var isSplit = issues.some(function(q) { return q[2] === 'multiple_purpose'; });
      return buildTCBlock(tc, isSplit);
    }).join('');
  }

  var cnt = document.getElementById('cmp-count');
  if (cnt) cnt.textContent = total + '건';
  var info = document.getElementById('cmp-page-info');
  if (info) info.textContent = total + '건 중 ' +
    (total ? Math.min((cmpPage-1)*CMP_PAGE+1, total) : 0) + '–' +
    Math.min(cmpPage * CMP_PAGE, total);
  renderPagination('cmp-pager', cmpPage, pages, function(p) { cmpPage = p; renderCompare(); });
}

// ── scrollToCompare ───────────────────────────────────────────
function scrollToCompare(svc, row) {
  cmpFilter.svc = svc;
  var sel = document.getElementById('cmp-svc');
  if (sel) sel.value = svc;
  currentSvc = svc;
  buildSidebar();
  cmpPage = 1;

  var filtered = cmpFiltered();
  var idx = filtered.findIndex(function(t) { return t[0] === svc && t[1] === row; });
  if (idx >= 0) cmpPage = Math.floor(idx / CMP_PAGE) + 1;
  renderCompare();

  var card = document.getElementById('card-compare');
  if (card) card.classList.remove('collapsed');

  setTimeout(function() {
    var id = 'cmp-row-' + (svc + '-' + row).replace(/[\s.()/]/g, '-');
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.remove('cmp-highlight');
      void el.offsetWidth;
      el.classList.add('cmp-highlight');
    }
  }, 150);
}
