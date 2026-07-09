/* =================================================================
   Integrity Dashboard — Browser-side Excel Export  (xlsx-js-style)
   ================================================================= */

// ── 색상 팔레트 (ARGB) ───────────────────────────────────────────
var C = {
  // 헤더 배경
  H_ORIG : 'FF2D3A5A',  // 원본 헤더: 네이비 블루
  H_AI   : 'FF1B3A2A',  // AI 헤더: 다크 그린
  H_ANA  : 'FF2D1A40',  // Analysis 헤더: 다크 퍼플
  H_INT  : 'FF1A2840',  // Intent 헤더: 다크 블루
  H_SEM  : 'FF1A1A35',  // Semantic 헤더: 다크 네이비
  H_CTX  : 'FF1A3A2A',  // Context 헤더: 다크 에메랄드
  H_NORM : 'FF3A2A00',  // Norm 헤더: 다크 앰버

  // 데이터 배경 — 원본: 연한 블루그레이 (밝게)
  B_ORIG : 'FFEEF2FA',  // 원본 셀: 연한 파란빛 흰색

  // AI Standard TC — 변경 없음
  B_AI_SAME : 'FFF8FFF8', // 동일: 거의 흰색 (연한 그린)

  // 변경 유형별 하이라이트 (밝은 색상)
  B_FILLED : 'FFE8F5E9', // 빈칸 채움: 연한 초록 (신규 추론/추가)
  B_INFER  : 'FFEDE7F6', // 추론으로 채움: 연한 보라
  B_CHANGED: 'FFFFF3CD', // 내용 변경: 연한 노랑
  B_DELETED: 'FFFDECEA', // 삭제됨: 연한 빨강

  // 텍스트
  T_ORIG   : 'FF1E2A4A', // 원본 텍스트: 진한 네이비
  T_BRIGHT : 'FFFFFFFF', // 헤더 텍스트: 흰색
  T_DARK   : 'FF1A1A1A', // 일반 데이터 텍스트: 거의 검정
  T_FILLED : 'FF1B5E20', // 추가: 진한 초록
  T_INFER  : 'FF4A148C', // 추론: 진한 보라
  T_CHANGED: 'FF6B4C00', // 변경: 진한 앰버
  T_DELETED: 'FFB71C1C', // 삭제: 진한 빨강

  // Analysis / Context / Norm 배경
  B_ANA  : 'FFF3EEF8',
  B_INT  : 'FFEEF3F8',
  B_SEM  : 'FFEEEEF8',
  B_CTX  : 'FFEEF8F3',
  B_NORM : 'FFFFF8EE',

  // Semantic score 배경
  S_HIGH : 'FFE8F5E9',
  S_MID  : 'FFFFF3CD',
  S_LOW  : 'FFFDECEA',

  SEP    : 'FFD0D5E8', // 구분열: 연한 회색
};

// ── 스타일 빌더 ──────────────────────────────────────────────────
function mkFill(argb) {
  return { patternType: 'solid', fgColor: { argb: argb } };
}
function mkFont(argb, bold, sz, italic) {
  var f = { color: { argb: argb }, sz: sz || 9 };
  if (bold)   f.bold   = true;
  if (italic) f.italic = true;
  return f;
}
function mkBorder() {
  var s = { style: 'thin', color: { argb: 'FFCDD5E8' } };
  return { top: s, bottom: s, left: s, right: s };
}
function mkAlign(h, v, wrap) {
  return { horizontal: h || 'left', vertical: v || 'top', wrapText: wrap !== false };
}
function mkCell(val, fill, font, align, noBorder) {
  var c = { v: (val === null || val === undefined) ? '' : String(val), t: 's' };
  c.s = {
    fill:      { fgColor: { argb: fill || C.B_ORIG } },
    font:      font  || mkFont(C.T_DARK),
    alignment: align || mkAlign('left', 'top', true),
  };
  if (!noBorder) c.s.border = mkBorder();
  return c;
}

// ── 변경 유형 판별 ────────────────────────────────────────────────
// 반환: { fill, fontColor, bold }
function diffStyle(orig, ai, normType) {
  var o = (orig || '').trim(), a = (ai || '').trim();
  if (o === a) {
    return { fill: C.B_AI_SAME, fontColor: C.T_DARK, bold: false };
  }
  if (!o && a) {
    // 빈칸 → 채움
    var isInfer = normType && normType.indexOf('추론') >= 0;
    return {
      fill: isInfer ? C.B_INFER : C.B_FILLED,
      fontColor: isInfer ? C.T_INFER : C.T_FILLED,
      bold: true
    };
  }
  if (o && !a) {
    return { fill: C.B_DELETED, fontColor: C.T_DELETED, bold: true };
  }
  // 둘 다 있는데 다름 → 변경
  return { fill: C.B_CHANGED, fontColor: C.T_CHANGED, bold: true };
}

// ── AI_STD 컬럼 인덱스 ────────────────────────────────────────────
var SC = {
  svc:0, row:1,
  oC1:2,oC2:3,oC3:4,oC4:5,oPre:6,oStp:7,oExp:8,oPri:9,
  aC1:10,aC2:11,aC3:12,aC4:13,aPre:14,aStp:15,aExp:16,aPri:17,
  preNorm:18, preEv:19, stepNorm:20, stepReason:21,
  expNorm:22, expReason:23, qi:24,
  origIntent:25, aiIntent:26, fcp:27,
  match:28, status:29, semReason:30,
  ctxFeature:31, ctxScreen:32, ctxScenario:33, ctxUserGoal:34, ctxFlowPos:35,
  normSummary:36,
};

// 열 레이아웃 (0-based)
// 0~7: Original TC  |  8: sep  |  9~16: AI Standard TC
// 17~18: sep  |  19~22: AI Analysis  |  23~24: sep
// 25~27: Intent  |  28~29: sep  |  30~32: Semantic
// 33: sep  |  34~38: Context Summary  |  39~40: sep  |  41: Norm Summary

var COL_DEFS = [
  [0 ,'orig','분류1',    function(r){return r[SC.oC1];}],
  [1 ,'orig','분류2',    function(r){return r[SC.oC2];}],
  [2 ,'orig','분류3',    function(r){return r[SC.oC3];}],
  [3 ,'orig','화면전개', function(r){return r[SC.oC4];}],
  [4 ,'orig','사전조건', function(r){return r[SC.oPre];}],
  [5 ,'orig','Test Step',function(r){return r[SC.oStp];}],
  [6 ,'orig','기대결과', function(r){return r[SC.oExp];}],
  [7 ,'orig','Priority', function(r){return r[SC.oPri];}],

  [9 ,'ai','분류1',    function(r){return r[SC.aC1];}, function(r){return '';}],
  [10,'ai','분류2',    function(r){return r[SC.aC2];}, function(r){return '';}],
  [11,'ai','분류3',    function(r){return r[SC.aC3];}, function(r){return '';}],
  [12,'ai','화면전개', function(r){return r[SC.aC4];}, function(r){return '';}],
  [13,'ai','사전조건', function(r){return r[SC.aPre];},function(r){return r[SC.preNorm];}],
  [14,'ai','Test Step',function(r){return r[SC.aStp];},function(r){return r[SC.stepNorm];}],
  [15,'ai','기대결과', function(r){return r[SC.aExp];},function(r){return r[SC.expNorm];}],
  [16,'ai','Priority', function(r){return r[SC.aPri];},function(r){return '';}],

  [19,'ana','사전조건 분석', function(r){
    var p=[];
    if(r[SC.preNorm]) p.push('[Type]\n'+r[SC.preNorm]);
    if(r[SC.preEv])   p.push('[근거]\n'+r[SC.preEv]);
    return p.join('\n\n');
  }],
  [20,'ana','Test Step 분석', function(r){
    var p=[];
    if(r[SC.stepNorm])   p.push('[Type]\n'+r[SC.stepNorm]);
    if(r[SC.stepReason]) p.push('[이유]\n'+r[SC.stepReason]);
    return p.join('\n\n');
  }],
  [21,'ana','기대결과 분석', function(r){
    var p=[];
    if(r[SC.expNorm])   p.push('[Type]\n'+r[SC.expNorm]);
    if(r[SC.expReason]) p.push('[이유]\n'+r[SC.expReason]);
    return p.join('\n\n');
  }],
  [22,'ana','품질 이슈', function(r){return r[SC.qi];}],

  [25,'int','Original Intent',   function(r){return r[SC.origIntent];}],
  [26,'int','AI Intent',         function(r){return r[SC.aiIntent];}],
  [27,'int','Final Check Point', function(r){return r[SC.fcp];}],

  [30,'sem','Match %',        function(r){return r[SC.match]+'%';}],
  [31,'sem','Meaning Status', function(r){
    return (r[SC.status]||'').indexOf('Preserved')>=0
      ? '✔ Meaning Preserved' : '✘ Meaning Changed';
  }],
  [32,'sem','판단 근거', function(r){return r[SC.semReason];}],

  [34,'ctx','Feature',       function(r){return r[SC.ctxFeature]||'';}],
  [35,'ctx','Screen',        function(r){return r[SC.ctxScreen]||'';}],
  [36,'ctx','Scenario',      function(r){return r[SC.ctxScenario]||'';}],
  [37,'ctx','User Goal',     function(r){return r[SC.ctxUserGoal]||'';}],
  [38,'ctx','Flow Position', function(r){return r[SC.ctxFlowPos]||'';}],

  [41,'norm','Normalization Summary', function(r){return r[SC.normSummary]||'';}],
];

var GRP_H_BG = {
  orig:C.H_ORIG, ai:C.H_AI, ana:C.H_ANA,
  int:C.H_INT, sem:C.H_SEM, ctx:C.H_CTX, norm:C.H_NORM
};
var SEP_COLS = [8,17,18,23,24,28,29,33,39,40];

function addr(col, row) {
  return XLSX.utils.encode_cell({ c: col, r: row });
}

// ── 시트 빌드 ─────────────────────────────────────────────────────
function buildSheet(rows) {
  var ws = {};

  // 열 너비
  var widths = [];
  for (var i = 0; i <= 42; i++) widths.push({ wch: 1 });
  [0,1,2,3,9,10,11,12].forEach(function(c){ widths[c]={wch:14}; });
  [4,13].forEach(function(c){ widths[c]={wch:28}; });
  [5,6,14,15].forEach(function(c){ widths[c]={wch:38}; });
  [7,16].forEach(function(c){ widths[c]={wch:9}; });
  [19,20,21].forEach(function(c){ widths[c]={wch:32}; });
  [22].forEach(function(c){ widths[c]={wch:28}; });
  [25,26].forEach(function(c){ widths[c]={wch:30}; });
  [27].forEach(function(c){ widths[c]={wch:50}; });
  [30].forEach(function(c){ widths[c]={wch:9}; });
  [31].forEach(function(c){ widths[c]={wch:16}; });
  [32].forEach(function(c){ widths[c]={wch:32}; });
  [34,35,36].forEach(function(c){ widths[c]={wch:22}; });
  [37,38].forEach(function(c){ widths[c]={wch:36}; });
  [41].forEach(function(c){ widths[c]={wch:44}; });
  ws['!cols'] = widths;

  // ── 행 1: 그룹 헤더 ────────────────────────────────────────────
  var grpDefs = [
    {s:0,  e:7,  bg:C.H_ORIG, label:'Original TC'},
    {s:9,  e:16, bg:C.H_AI,   label:'AI Standard TC'},
    {s:19, e:22, bg:C.H_ANA,  label:'AI Analysis'},
    {s:25, e:27, bg:C.H_INT,  label:'Intent'},
    {s:30, e:32, bg:C.H_SEM,  label:'Semantic Validation'},
    {s:34, e:38, bg:C.H_CTX,  label:'Context Summary'},
    {s:41, e:41, bg:C.H_NORM, label:'Normalization Summary'},
  ];
  ws['!merges'] = [];
  grpDefs.forEach(function(g){
    ws[addr(g.s,0)] = mkCell(g.label, g.bg,
      mkFont(C.T_BRIGHT, true, 10), mkAlign('center','center'));
    for (var c = g.s+1; c <= g.e; c++) {
      ws[addr(c,0)] = mkCell('', g.bg, mkFont(C.T_BRIGHT), mkAlign('center','center'));
    }
    if (g.s < g.e) ws['!merges'].push({s:{c:g.s,r:0},e:{c:g.e,r:0}});
  });
  SEP_COLS.forEach(function(c){
    ws[addr(c,0)] = mkCell('', C.SEP, null, null, true);
  });

  // ── 행 2: 컬럼 헤더 ────────────────────────────────────────────
  COL_DEFS.forEach(function(cd){
    ws[addr(cd[0],1)] = mkCell(cd[2], GRP_H_BG[cd[1]],
      mkFont(C.T_BRIGHT, true, 9), mkAlign('center','center'));
  });
  SEP_COLS.forEach(function(c){
    ws[addr(c,1)] = mkCell('', C.SEP, null, null, true);
  });

  // ── 데이터 행 ──────────────────────────────────────────────────
  rows.forEach(function(r, ri){
    var exRow = ri + 2;

    COL_DEFS.forEach(function(cd){
      var col   = cd[0];
      var grp   = cd[1];
      var val   = cd[3](r);
      var normFn= cd[4];
      var cellFill, cellFont, cellAlign;

      if (grp === 'orig') {
        // 원본 영역: 연한 블루 배경 + 진한 텍스트
        cellFill  = C.B_ORIG;
        cellFont  = mkFont(C.T_ORIG, false, 9);
        cellAlign = (col === 7) ? mkAlign('center','center') : mkAlign('left','top');

      } else if (grp === 'ai') {
        // AI Standard TC: 변경 여부에 따라 배경색 강조
        var origIdx = col - 9;
        var origDef = COL_DEFS.filter(function(x){ return x[0]===origIdx && x[1]==='orig'; })[0];
        var origVal = origDef ? origDef[3](r) : '';
        var nt      = normFn ? normFn(r) : '';
        var ds      = diffStyle(origVal, val, nt);
        cellFill  = ds.fill;
        cellFont  = mkFont(ds.fontColor, ds.bold, 9);
        cellAlign = (col === 16) ? mkAlign('center','center') : mkAlign('left','top');

      } else if (grp === 'ana') {
        cellFill  = C.B_ANA;
        cellFont  = mkFont(C.T_DARK, false, 8);
        cellAlign = mkAlign('left','top');

      } else if (grp === 'int') {
        var isFcp = (col === 27);
        cellFill  = C.B_INT;
        cellFont  = mkFont(C.T_DARK, isFcp, isFcp ? 9 : 8);
        cellAlign = mkAlign('left','top');

      } else if (grp === 'sem') {
        var matchPct = parseInt(r[SC.match] || 100);
        if (col === 30) {
          cellFill  = matchPct >= 90 ? C.S_HIGH : matchPct >= 75 ? C.S_MID : C.S_LOW;
          cellFont  = mkFont(C.T_DARK, true, 12);
          cellAlign = mkAlign('center','center');
        } else if (col === 31) {
          var ok = (r[SC.status]||'').indexOf('Preserved') >= 0;
          cellFill  = C.B_SEM;
          cellFont  = mkFont(ok ? C.T_FILLED : C.T_DELETED, true, 9);
          cellAlign = mkAlign('center','center');
        } else {
          cellFill  = C.B_SEM;
          cellFont  = mkFont(C.T_DARK, false, 8);
          cellAlign = mkAlign('left','top');
        }

      } else if (grp === 'ctx') {
        cellFill  = C.B_CTX;
        cellFont  = mkFont(C.T_DARK, false, 8);
        cellAlign = mkAlign('left','top');

      } else { // norm
        cellFill  = C.B_NORM;
        cellFont  = mkFont(C.T_DARK, false, 8);
        cellAlign = mkAlign('left','top');
      }

      ws[addr(col, exRow)] = mkCell(val || '', cellFill, cellFont, cellAlign);
    });

    // 구분열
    SEP_COLS.forEach(function(c){
      ws[addr(c, exRow)] = mkCell('', C.SEP, null, null, true);
    });
  });

  ws['!ref'] = XLSX.utils.encode_range({
    s:{c:0,r:0}, e:{c:41, r:rows.length+1}
  });
  ws['!rows'] = [{hpt:22},{hpt:20}];

  return ws;
}

// ── 메인 Export ───────────────────────────────────────────────────
function exportAIReview() {
  if (typeof XLSX === 'undefined') {
    alert('xlsx-js-style 라이브러리가 로드되지 않았습니다.');
    return;
  }
  if (typeof AI_STD === 'undefined' || !AI_STD.length) {
    alert('AI_STD 데이터가 없습니다.');
    return;
  }

  var btn = document.getElementById('btn-export');
  if (btn) { btn.textContent = '생성 중...'; btn.disabled = true; }

  setTimeout(function(){
    try {
      var wb = XLSX.utils.book_new();

      // 서비스별 그룹화 (순서 유지)
      var groups = {}, order = [];
      AI_STD.forEach(function(r){
        var svc = r[0];
        if (!groups[svc]){ groups[svc]=[]; order.push(svc); }
        groups[svc].push(r);
      });

      order.forEach(function(svc){
        var ws = buildSheet(groups[svc]);
        XLSX.utils.book_append_sheet(wb, ws, svc.slice(0,31));
      });

      XLSX.writeFile(wb, 'ai_review2.xlsx');
      if (btn){ btn.textContent = '⬇ Export Excel (ai_review2)'; btn.disabled = false; }
    } catch(e){
      console.error('Export 오류:', e);
      alert('Excel 생성 오류: ' + e.message);
      if (btn){ btn.textContent = '⬇ Export Excel (ai_review2)'; btn.disabled = false; }
    }
  }, 50);
}
