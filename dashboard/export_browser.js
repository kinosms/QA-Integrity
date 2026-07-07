/* =================================================================
   Integrity Dashboard — Browser-side Excel Export  (xlsx-js-style)
   ai_review2.xlsx 생성
   ================================================================= */

// ── 색상 팔레트 (ARGB 형식 — xlsx-js-style 요구) ─────────────────
var C = {
  // 배경
  H_ORIG : 'FF1E2235', H_AI   : 'FF0D1F0D', H_ANA  : 'FF1A1227',
  H_INT  : 'FF111827', H_SEM  : 'FF0F172A',
  B_ORIG : 'FF12151F', B_AI   : 'FF0A120A', B_ANA  : 'FF13102A',
  B_INT  : 'FF0C1020', B_SEM  : 'FF0A0F1E',
  B_ADD  : 'FF052E16', B_MOD  : 'FF422006', B_DEL  : 'FF450A0A',
  B_INF  : 'FF2E1065',
  S_HIGH : 'FF14532D', S_MID  : 'FF713F12', S_LOW  : 'FF7F1D1D',
  SEP    : 'FF0A0C15',
  // 텍스트
  T_BRIGHT: 'FFE2E8F0', T_MUTED: 'FF94A3B8', T_ORIG: 'FF64748B',
  T_GREEN : 'FF4ADE80', T_YELLOW: 'FFFBBF24', T_RED : 'FFF87171',
  T_PURPLE: 'FFC084FC',
};

// ── 스타일 빌더 ───────────────────────────────────────────────────
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
  var s = { style: 'thin', color: { argb: 'FF2E3350' } };
  return { top: s, bottom: s, left: s, right: s };
}
function mkAlign(h, v, wrap) {
  return { horizontal: h || 'left', vertical: v || 'top', wrapText: wrap !== false };
}

// ── 셀 생성 ───────────────────────────────────────────────────────
function mkCell(val, fill, font, align, noBorder) {
  var c = { v: (val === null || val === undefined) ? '' : String(val), t: 's' };
  c.s = {
    fill:      { fgColor: { argb: fill || C.B_ORIG } },
    font:      font  || mkFont(C.T_BRIGHT),
    alignment: align || mkAlign('left', 'top', true),
  };
  if (!noBorder) c.s.border = mkBorder();
  return c;
}

// ── diff 판단 ─────────────────────────────────────────────────────
function diffFillArgb(orig, ai, normType) {
  var o = (orig || '').trim(), a = (ai || '').trim();
  if (o === a)   return C.B_AI;
  if (!o &&  a)  return (normType && normType.indexOf('추론') >= 0) ? C.B_INF : C.B_ADD;
  if ( o && !a)  return C.B_DEL;
  return C.B_MOD;
}
function diffFontArgb(orig, ai, normType) {
  var o = (orig || '').trim(), a = (ai || '').trim();
  if (o === a) return C.T_BRIGHT;
  if (!o && a) return (normType && normType.indexOf('추론') >= 0) ? C.T_PURPLE : C.T_GREEN;
  if ( o && !a) return C.T_RED;
  return C.T_YELLOW;
}
function diffFontBold(orig, ai) {
  return (orig || '').trim() !== (ai || '').trim();
}

// ── AI_STD 컬럼 인덱스 ────────────────────────────────────────────
var SC = {
  svc:0, row:1,
  oC1:2,oC2:3,oC3:4,oC4:5,oPre:6,oStp:7,oExp:8,oPri:9,
  aC1:10,aC2:11,aC3:12,aC4:13,aPre:14,aStp:15,aExp:16,aPri:17,
  preNorm:18, preEv:19, stepNorm:20, stepReason:21,
  expNorm:22,  expReason:23, qi:24,
  origIntent:25, aiIntent:26, fcp:27,
  match:28, status:29, semReason:30,
};

// 열 레이아웃 (0-based 열 인덱스)
// A~H(0~7): Original TC
// J~Q(9~16): AI Standard TC
// T~W(19~22): AI Analysis
// Z~AB(25~27): Intent
// AE~AG(30~32): Semantic Validation
// 구분열: 8,17,18,23,24,28,29

var COL_DEFS = [
  // [엑셀열, 그룹, 헤더, 원본값fn, normType fn (AI열만)]
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
    if(r[SC.preNorm]) p.push('[Normalization Type]\n'+r[SC.preNorm]);
    if(r[SC.preEv])   p.push('[근거]\n'+r[SC.preEv]);
    return p.join('\n\n');
  }],
  [20,'ana','Test Step 분석', function(r){
    var p=[];
    if(r[SC.stepNorm])   p.push('[Normalization Type]\n'+r[SC.stepNorm]);
    if(r[SC.stepReason]) p.push('[수정 이유]\n'+r[SC.stepReason]);
    return p.join('\n\n');
  }],
  [21,'ana','기대결과 분석', function(r){
    var p=[];
    if(r[SC.expNorm])   p.push('[Normalization Type]\n'+r[SC.expNorm]);
    if(r[SC.expReason]) p.push('[수정 이유]\n'+r[SC.expReason]);
    return p.join('\n\n');
  }],
  [22,'ana','품질 이슈', function(r){return r[SC.qi];}],

  [25,'int','Original Intent',   function(r){return r[SC.origIntent];}],
  [26,'int','AI Intent',         function(r){return r[SC.aiIntent];}],
  [27,'int','Final Check Point', function(r){return r[SC.fcp];}],

  [30,'sem','Match %',        function(r){return r[SC.match]+'%';}],
  [31,'sem','Meaning Status', function(r){
    return (r[SC.status]||'').indexOf('Preserved')>=0
      ? '✔ Meaning Preserved':'✘ Meaning Changed';
  }],
  [32,'sem','판단 근거', function(r){return r[SC.semReason];}],
];

var GRP_H_BG = { orig:C.H_ORIG, ai:C.H_AI, ana:C.H_ANA, int:C.H_INT, sem:C.H_SEM };
var GRP_B_BG = { orig:C.B_ORIG, ai:C.B_AI,  ana:C.B_ANA, int:C.B_INT, sem:C.B_SEM };

// ── 열→엑셀 주소 변환 ────────────────────────────────────────────
function addr(col, row) {
  return XLSX.utils.encode_cell({ c: col, r: row });
}

// ── 시트 빌드 ─────────────────────────────────────────────────────
function buildSheet(rows) {
  var ws = {};

  // 열 너비
  var widths = [];
  for (var i = 0; i <= 32; i++) widths.push({ wch: 2 }); // 기본 구분
  [0,1,2,3,9,10,11,12].forEach(function(c){ widths[c]={wch:14}; });
  [4,13].forEach(function(c){ widths[c]={wch:26}; });
  [5,6,14,15].forEach(function(c){ widths[c]={wch:36}; });
  [7,16].forEach(function(c){ widths[c]={wch:8}; });
  [19,20,21].forEach(function(c){ widths[c]={wch:32}; });
  [22].forEach(function(c){ widths[c]={wch:28}; });
  [25,26,27].forEach(function(c){ widths[c]={wch:30}; });
  [30].forEach(function(c){ widths[c]={wch:9}; });
  [31].forEach(function(c){ widths[c]={wch:14}; });
  [32].forEach(function(c){ widths[c]={wch:32}; });
  ws['!cols'] = widths;

  // ── 행 1: 그룹 헤더 ────────────────────────────────────────────
  var grpDefs = [
    {s:0, e:7,  bg:C.H_ORIG, label:'Original TC'},
    {s:9, e:16, bg:C.H_AI,   label:'AI Standard TC'},
    {s:19,e:22, bg:C.H_ANA,  label:'AI Analysis'},
    {s:25,e:27, bg:C.H_INT,  label:'Intent'},
    {s:30,e:32, bg:C.H_SEM,  label:'Semantic Validation'},
  ];
  ws['!merges'] = [];
  grpDefs.forEach(function(g){
    ws[addr(g.s,0)] = mkCell(g.label, g.bg,
      mkFont(C.T_BRIGHT,true,10), mkAlign('center','center'));
    for(var c=g.s+1;c<=g.e;c++){
      ws[addr(c,0)] = mkCell('', g.bg, mkFont(C.T_BRIGHT), mkAlign('center','center'));
    }
    if(g.s<g.e) ws['!merges'].push({s:{c:g.s,r:0},e:{c:g.e,r:0}});
  });
  // 구분 열 행1
  [8,17,18,23,24,28,29].forEach(function(c){
    ws[addr(c,0)] = mkCell('', C.SEP, null, null, true);
  });

  // ── 행 2: 컬럼 헤더 ────────────────────────────────────────────
  COL_DEFS.forEach(function(cd){
    ws[addr(cd[0],1)] = mkCell(cd[2], GRP_H_BG[cd[1]],
      mkFont(C.T_BRIGHT,true,9), mkAlign('center','center'));
  });
  [8,17,18,23,24,28,29].forEach(function(c){
    ws[addr(c,1)] = mkCell('', C.SEP, null, null, true);
  });

  // ── 데이터 행 ──────────────────────────────────────────────────
  rows.forEach(function(r, ri){
    var exRow = ri + 2;

    COL_DEFS.forEach(function(cd){
      var col    = cd[0];
      var grp    = cd[1];
      var valFn  = cd[3];
      var normFn = cd[4];
      var val    = valFn(r);
      var cellFill, cellFont, cellAlign;

      if (grp === 'orig') {
        cellFill  = C.B_ORIG;
        cellFont  = mkFont(C.T_ORIG);
        cellAlign = (col===7) ? mkAlign('center','center') : mkAlign('left','top');

      } else if (grp === 'ai') {
        // diff 계산: 같은 순서의 orig 컬럼 값
        var origIdx = col - 9; // J(9)→A(0) 대응
        var origDef = COL_DEFS.find(function(x){ return x[0]===origIdx && x[1]==='orig'; });
        var origVal = origDef ? origDef[3](r) : '';
        var nt      = normFn ? normFn(r) : '';
        cellFill  = diffFillArgb(origVal, val, nt);
        cellFont  = mkFont(diffFontArgb(origVal, val, nt), diffFontBold(origVal, val));
        cellAlign = (col===16) ? mkAlign('center','center') : mkAlign('left','top');

      } else if (grp === 'ana') {
        cellFill  = C.B_ANA;
        cellFont  = mkFont(C.T_BRIGHT, false, 8);
        cellAlign = mkAlign('left','top');

      } else if (grp === 'int') {
        cellFill  = C.B_INT;
        cellFont  = mkFont(col===27 ? C.T_BRIGHT : C.T_MUTED, col===27);
        cellAlign = mkAlign('left','top');

      } else { // sem
        var matchPct = parseInt(r[SC.match] || 100);
        if (col === 30) {
          cellFill  = matchPct>=90 ? C.S_HIGH : matchPct>=75 ? C.S_MID : C.S_LOW;
          cellFont  = mkFont(C.T_BRIGHT, true, 12);
          cellAlign = mkAlign('center','center');
        } else if (col === 31) {
          var ok = (r[SC.status]||'').indexOf('Preserved')>=0;
          cellFill  = C.B_SEM;
          cellFont  = mkFont(ok ? C.T_GREEN : C.T_RED, true, 9);
          cellAlign = mkAlign('center','center');
        } else {
          cellFill  = C.B_SEM;
          cellFont  = mkFont(C.T_MUTED, false, 8);
          cellAlign = mkAlign('left','top');
        }
      }

      ws[addr(col, exRow)] = mkCell(val||'', cellFill, cellFont, cellAlign);
    });

    // 구분 열
    [8,17,18,23,24,28,29].forEach(function(c){
      ws[addr(c,exRow)] = mkCell('', C.SEP, null, null, true);
    });
  });

  // ── !ref 설정 ─────────────────────────────────────────────────
  ws['!ref'] = XLSX.utils.encode_range({
    s:{c:0,r:0}, e:{c:32, r:rows.length+1}
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
