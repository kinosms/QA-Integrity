/* =========================================================
   review-stats.js — 검수 의견 통계 분석 모달
   ========================================================= */

(function() {

var RS_URL = 'https://fnuvsxkytoycdhgkqykw.supabase.co';
var RS_KEY = 'sb_publishable_H_fiKjJsX13kBe9dM3Y6vg_r-QEnHgt';

var ISSUE_TYPE_LABELS = ['의미변경','문맥오판','잘못된정보추가','정보누락','용어표준화미흡','기타'];
var TARGET_FIELD_LABELS = ['분류1','분류2','분류3','화면전개','사전조건','Test Step','기대결과'];

var ISSUE_COLORS = ['#6366f1','#22d3ee','#f97316','#ef4444','#22c55e','#a855f7'];
var FIELD_COLORS  = ['#6366f1','#22d3ee','#f97316','#ef4444','#22c55e','#a855f7','#f59e0b'];

// 전체 행 데이터 (클릭 필터용)
var allRows = [];
var listenerAttached = false;

// ── 모달 열기/닫기 ────────────────────────────────────────

window.openReviewStats = function() {
  var modal = document.getElementById('review-stats-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // 이벤트 위임 — rs-body는 교체되지 않으므로 1회만 등록
  if (!listenerAttached) {
    var rsBody = document.getElementById('rs-body');
    if (rsBody) {
      rsBody.addEventListener('click', onBodyClick);
      listenerAttached = true;
    }
  }

  fetchAndRender();
};

window.closeReviewStats = function() {
  var modal = document.getElementById('review-stats-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') window.closeReviewStats();
});

// ── 클릭 이벤트 위임 ─────────────────────────────────────

function onBodyClick(e) {
  // 리셋 버튼
  if (e.target.closest('.rs-detail-reset')) {
    document.querySelectorAll('.rs-bar-clickable').forEach(function(el) {
      el.classList.remove('rs-bar-active');
    });
    updateDetailSection(null, null, null);
    return;
  }

  // 클릭 가능한 막대 행
  var row = e.target.closest('.rs-bar-clickable');
  if (!row) return;

  var ft    = row.getAttribute('data-filter-type');
  var fv    = row.getAttribute('data-filter-value');
  var color = row.getAttribute('data-filter-color') || '#6366f1';

  // 같은 항목 재클릭 시 선택 해제
  if (row.classList.contains('rs-bar-active')) {
    row.classList.remove('rs-bar-active');
    updateDetailSection(null, null, null);
    return;
  }

  document.querySelectorAll('.rs-bar-clickable').forEach(function(el) {
    el.classList.remove('rs-bar-active');
  });
  row.classList.add('rs-bar-active');
  updateDetailSection(ft, fv, color);
}

// ── 데이터 Fetch ─────────────────────────────────────────

function fetchAndRender() {
  var body = document.getElementById('rs-body');
  if (!body) return;
  body.innerHTML = '<div class="rs-loading">데이터 불러오는 중...</div>';

  fetch(RS_URL + '/rest/v1/tc_reviews?select=svc,row_number,note,issue_types,target_fields,updated_at&limit=10000', {
    headers: { 'apikey': RS_KEY, 'Authorization': 'Bearer ' + RS_KEY }
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(function(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      body.innerHTML = '<div class="rs-empty">저장된 의견 데이터가 없습니다.</div>';
      return;
    }
    allRows = rows;
    renderStats(rows);
  })
  .catch(function(e) {
    body.innerHTML = '<div class="rs-error">데이터 로드 실패: ' + e.message + '</div>';
  });
}

// ── 통계 계산 ─────────────────────────────────────────────

function calcStats(rows) {
  var total    = rows.length;
  var withNote = rows.filter(function(r) { return r.note && r.note.trim(); }).length;
  var withTypes = rows.filter(function(r) { return r.issue_types && r.issue_types.length > 0; }).length;

  var typeCounts = {};
  ISSUE_TYPE_LABELS.forEach(function(t) { typeCounts[t] = 0; });
  rows.forEach(function(r) {
    (r.issue_types || []).forEach(function(t) { typeCounts[t] = (typeCounts[t] || 0) + 1; });
  });

  var fieldCounts = {};
  TARGET_FIELD_LABELS.forEach(function(f) { fieldCounts[f] = 0; });
  rows.forEach(function(r) {
    (r.target_fields || []).forEach(function(f) { fieldCounts[f] = (fieldCounts[f] || 0) + 1; });
  });

  var svcCounts = {};
  rows.forEach(function(r) {
    var s = r.svc || '미분류';
    svcCounts[s] = (svcCounts[s] || 0) + 1;
  });

  var comboCounts = {};
  rows.forEach(function(r) {
    (r.issue_types || []).forEach(function(t) {
      (r.target_fields || []).forEach(function(f) {
        var key = t + ' × ' + f;
        comboCounts[key] = (comboCounts[key] || 0) + 1;
      });
    });
  });

  var svcTypeMatrix = {};
  rows.forEach(function(r) {
    var s = r.svc || '미분류';
    if (!svcTypeMatrix[s]) {
      svcTypeMatrix[s] = {};
      ISSUE_TYPE_LABELS.forEach(function(t) { svcTypeMatrix[s][t] = 0; });
    }
    (r.issue_types || []).forEach(function(t) { svcTypeMatrix[s][t] = (svcTypeMatrix[s][t] || 0) + 1; });
  });

  return {
    total: total, withNote: withNote, withTypes: withTypes,
    typeCounts: typeCounts, fieldCounts: fieldCounts,
    svcCounts: svcCounts, comboCounts: comboCounts,
    svcTypeMatrix: svcTypeMatrix,
  };
}

// ── 렌더링 메인 ───────────────────────────────────────────

function renderStats(rows) {
  var st = calcStats(rows);
  var body = document.getElementById('rs-body');

  var typeEntries  = Object.entries(st.typeCounts).sort(function(a,b){ return b[1]-a[1]; });
  var typeMax      = typeEntries.length ? typeEntries[0][1] : 1;
  var fieldEntries = Object.entries(st.fieldCounts).sort(function(a,b){ return b[1]-a[1]; });
  var fieldMax     = fieldEntries.length ? fieldEntries[0][1] : 1;
  var svcEntries   = Object.entries(st.svcCounts).sort(function(a,b){ return b[1]-a[1]; }).slice(0, 10);
  var svcMax       = svcEntries.length ? svcEntries[0][1] : 1;
  var comboEntries = Object.entries(st.comboCounts).sort(function(a,b){ return b[1]-a[1]; }).slice(0, 10);
  var comboMax     = comboEntries.length ? comboEntries[0][1] : 1;

  body.innerHTML =
    '<div class="rs-kpi-row">' +
      rsKpi('총 의견 수', st.total + '건', '저장된 전체 검수 의견') +
      rsKpi('의견 텍스트 작성', st.withNote + '건', pct(st.withNote, st.total) + '% 작성 완료') +
      rsKpi('이슈 유형 태그', st.withTypes + '건', pct(st.withTypes, st.total) + '% 태그 선택') +
      rsKpi('검수 서비스 수', Object.keys(st.svcCounts).length + '개', '의견 있는 서비스') +
    '</div>' +

    '<div class="rs-two-col">' +
      '<div class="rs-card">' +
        '<div class="rs-card-title">이슈 유형별 분포 <span class="rs-card-hint">항목 클릭 시 필터</span></div>' +
        typeEntries.map(function(e) {
          var color = ISSUE_COLORS[ISSUE_TYPE_LABELS.indexOf(e[0]) % ISSUE_COLORS.length] || '#6366f1';
          return rsBarRow(e[0], e[1], typeMax, color, st.total, 'type');
        }).join('') +
      '</div>' +
      '<div class="rs-card">' +
        '<div class="rs-card-title">대상 항목별 분포 <span class="rs-card-hint">항목 클릭 시 필터</span></div>' +
        fieldEntries.map(function(e) {
          var color = FIELD_COLORS[TARGET_FIELD_LABELS.indexOf(e[0]) % FIELD_COLORS.length] || '#22d3ee';
          return rsBarRow(e[0], e[1], fieldMax, color, st.total, 'field');
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="rs-card">' +
      '<div class="rs-card-title">서비스별 의견 수 (상위 10)</div>' +
      '<div class="rs-svc-bars">' +
        svcEntries.map(function(e) { return rsSvcBar(e[0], e[1], svcMax, st.total); }).join('') +
      '</div>' +
    '</div>' +

    '<div class="rs-card">' +
      '<div class="rs-card-title">서비스 × 이슈 유형 히트맵</div>' +
      renderHeatmap(st.svcTypeMatrix) +
    '</div>' +

    (comboEntries.length > 0 ?
      '<div class="rs-card">' +
        '<div class="rs-card-title">이슈 유형 × 대상 항목 조합 (상위 10)</div>' +
        '<div class="rs-combo-list">' +
          comboEntries.map(function(e, i) { return rsComboBar(e[0], e[1], comboMax, i); }).join('') +
        '</div>' +
      '</div>'
    : '') +

    // 필터 결과 섹션 (초기: 최근 저장 내역)
    '<div class="rs-card" id="rs-detail-section">' +
      renderDetailInner(null, null, null) +
    '</div>';
}

// ── 필터 상세 섹션 업데이트 ───────────────────────────────

function updateDetailSection(filterType, filterValue, color) {
  var section = document.getElementById('rs-detail-section');
  if (!section) return;
  section.innerHTML = renderDetailInner(filterType, filterValue, color);
}

function renderDetailInner(filterType, filterValue, color) {
  // 필터 없음 → 최근 저장 내역
  if (!filterType) {
    var recent = allRows.slice()
      .filter(function(r) { return r.updated_at; })
      .sort(function(a, b) { return new Date(b.updated_at) - new Date(a.updated_at); })
      .slice(0, 15);
    return (
      '<div class="rs-card-title">최근 저장 내역</div>' +
      renderDetailTable(recent)
    );
  }

  // 필터 적용
  var filtered = allRows.filter(function(r) {
    if (filterType === 'type') {
      return r.issue_types && r.issue_types.indexOf(filterValue) >= 0;
    }
    return r.target_fields && r.target_fields.indexOf(filterValue) >= 0;
  }).sort(function(a, b) { return new Date(b.updated_at || 0) - new Date(a.updated_at || 0); });

  var kindLabel = filterType === 'type' ? '이슈 유형' : '대상 항목';

  return (
    '<div class="rs-detail-header">' +
      '<span class="rs-detail-chip" style="border-color:' + color + ';color:' + color + '">' + esc(filterValue) + '</span>' +
      '<span class="rs-detail-count">' + kindLabel + ' · ' + filtered.length + '건</span>' +
      '<button class="rs-detail-reset">전체 보기</button>' +
    '</div>' +
    renderDetailTable(filtered)
  );
}

function renderDetailTable(rows) {
  if (!rows.length) {
    return '<div class="rs-empty" style="padding:24px">해당하는 데이터가 없습니다.</div>';
  }
  return (
    '<div class="rs-tbl-wrap">' +
      '<table class="rs-table">' +
        '<thead><tr>' +
          '<th>서비스</th><th>행</th><th>이슈 유형</th><th>대상 항목</th><th>의견</th><th>저장 시각</th>' +
        '</tr></thead>' +
        '<tbody>' +
          rows.map(function(r) {
            var types  = (r.issue_types  || []).map(function(t) { return '<span class="rs-tag rs-tag-type">'  + esc(t) + '</span>'; }).join('');
            var fields = (r.target_fields || []).map(function(f) { return '<span class="rs-tag rs-tag-field">' + esc(f) + '</span>'; }).join('');
            var note   = r.note ? esc(r.note).replace(/\n/g, '<br>') : '<span class="rs-empty-cell">-</span>';
            var time   = r.updated_at ? new Date(r.updated_at).toLocaleString('ko-KR') : '-';
            return '<tr>' +
              '<td class="rs-td-muted">' + esc(r.svc || '-') + '</td>' +
              '<td class="rs-td-num">' + (r.row_number || '-') + '</td>' +
              '<td>' + (types  || '<span class="rs-empty-cell">-</span>') + '</td>' +
              '<td>' + (fields || '<span class="rs-empty-cell">-</span>') + '</td>' +
              '<td class="rs-td-note">' + note + '</td>' +
              '<td class="rs-td-time">' + time + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>'
  );
}

// ── 히트맵 ───────────────────────────────────────────────

function renderHeatmap(matrix) {
  var svcs = Object.keys(matrix);
  if (!svcs.length) return '<div class="rs-empty" style="padding:16px">데이터 없음</div>';

  svcs.sort(function(a, b) {
    var ta = Object.values(matrix[a]).reduce(function(s,v){return s+v;}, 0);
    var tb = Object.values(matrix[b]).reduce(function(s,v){return s+v;}, 0);
    return tb - ta;
  });

  var maxVal = 0;
  svcs.forEach(function(s) {
    ISSUE_TYPE_LABELS.forEach(function(t) { if (matrix[s][t] > maxVal) maxVal = matrix[s][t]; });
  });

  var html = '<div class="rs-heatmap-wrap"><table class="rs-heatmap"><thead><tr><th class="rs-hm-th-svc"></th>';
  ISSUE_TYPE_LABELS.forEach(function(t) { html += '<th class="rs-hm-th">' + t + '</th>'; });
  html += '</tr></thead><tbody>';
  svcs.forEach(function(s) {
    html += '<tr><td class="rs-hm-td-svc">' + esc(s) + '</td>';
    ISSUE_TYPE_LABELS.forEach(function(t) {
      var v = matrix[s][t] || 0;
      var intensity = maxVal ? v / maxVal : 0;
      var alpha     = intensity ? (0.12 + intensity * 0.65).toFixed(2) : 0;
      var bg        = v ? 'rgba(99,102,241,' + alpha + ')' : 'transparent';
      var textColor = intensity > 0.5 ? '#e2e8f0' : (v ? '#a5b4fc' : '#2e3350');
      html += '<td class="rs-hm-cell" style="background:' + bg + ';color:' + textColor + '">' + (v || '') + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

// ── 컴포넌트 헬퍼 ─────────────────────────────────────────

function rsKpi(label, val, sub) {
  return '<div class="rs-kpi-card">' +
    '<div class="rs-kpi-label">' + label + '</div>' +
    '<div class="rs-kpi-val">' + val + '</div>' +
    '<div class="rs-kpi-sub">' + sub + '</div>' +
  '</div>';
}

// 클릭 가능한 막대 행 (이슈 유형 / 대상 항목용)
function rsBarRow(label, cnt, max, color, total, filterType) {
  var w = max ? Math.round(cnt / max * 100) : 0;
  var p = pct(cnt, total);
  return '<div class="rs-bar-row rs-bar-clickable"' +
    ' data-filter-type="' + esc(filterType) + '"' +
    ' data-filter-value="' + esc(label) + '"' +
    ' data-filter-color="' + color + '">' +
    '<div class="rs-bar-label">' + esc(label) + '</div>' +
    '<div class="rs-bar-track"><div class="rs-bar-fill" style="width:' + w + '%;background:' + color + '"></div></div>' +
    '<div class="rs-bar-stat">' + cnt + ' <span class="rs-pct">(' + p + '%)</span></div>' +
  '</div>';
}

function rsSvcBar(label, cnt, max, total) {
  var w = max ? Math.round(cnt / max * 100) : 0;
  var p = pct(cnt, total);
  return '<div class="rs-svc-row">' +
    '<div class="rs-svc-label">' + esc(label) + '</div>' +
    '<div class="rs-bar-track"><div class="rs-bar-fill" style="width:' + w + '%;background:#6366f1"></div></div>' +
    '<div class="rs-bar-stat">' + cnt + ' <span class="rs-pct">(' + p + '%)</span></div>' +
  '</div>';
}

function rsComboBar(label, cnt, max, idx) {
  var colors = ['#6366f1','#22d3ee','#f97316','#ef4444','#22c55e','#a855f7','#ec4899','#14b8a6','#f59e0b','#64748b'];
  var w = max ? Math.round(cnt / max * 100) : 0;
  return '<div class="rs-combo-row">' +
    '<div class="rs-combo-label">' + esc(label) + '</div>' +
    '<div class="rs-bar-track rs-bar-track-thin"><div class="rs-bar-fill" style="width:' + w + '%;background:' + colors[idx % colors.length] + '"></div></div>' +
    '<div class="rs-bar-stat">' + cnt + '</div>' +
  '</div>';
}

// ── 유틸 ─────────────────────────────────────────────────

function pct(val, total) { return total ? Math.round(val / total * 100) : 0; }

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

})();
