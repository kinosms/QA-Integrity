/* =================================================================
   CSV Export — Google Sheets 임포트용
   AI_STD 데이터를 UTF-8 BOM CSV로 다운로드
   ================================================================= */

var HEADERS = [
  '서비스', '행',
  '[원본] 분류1', '[원본] 분류2', '[원본] 분류3', '[원본] 화면전개',
  '[원본] 사전조건', '[원본] Test Step', '[원본] 기대결과', '[원본] Priority',
  '[AI] 분류1', '[AI] 분류2', '[AI] 분류3', '[AI] 화면전개',
  '[AI] 사전조건', '[AI] Test Step', '[AI] 기대결과', '[AI] Priority',
  '사전조건 NormType', '사전조건 근거',
  'Step NormType', 'Step 수정이유',
  '기대결과 NormType', '기대결과 수정이유',
  '품질이슈',
  'Original Intent', 'AI Intent', 'Final Check Point',
  'Match%', 'Meaning Status', '판단근거',
];

function escapeCSV(val) {
  var s = (val === null || val === undefined) ? '' : String(val);
  // 줄바꿈·쉼표·큰따옴표가 있으면 큰따옴표로 감싸기
  if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0 || s.indexOf('\r') >= 0) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function rowToCSV(r) {
  var cols = [
    r[0],  r[1],
    r[2],  r[3],  r[4],  r[5],  r[6],  r[7],  r[8],  r[9],
    r[10], r[11], r[12], r[13], r[14], r[15], r[16], r[17],
    r[18], r[19], r[20], r[21], r[22], r[23], r[24],
    r[25], r[26], r[27],
    r[28] !== undefined ? r[28] + '%' : '',
    r[29] || '',
    r[30] || '',
  ];
  return cols.map(escapeCSV).join(',');
}

function exportCSV() {
  if (typeof AI_STD === 'undefined' || !AI_STD.length) {
    alert('AI_STD 데이터가 없습니다.');
    return;
  }

  var btn = document.getElementById('btn-csv-export');
  if (btn) { btn.textContent = '생성 중...'; btn.disabled = true; }

  setTimeout(function() {
    try {
      var lines = [HEADERS.map(escapeCSV).join(',')];
      AI_STD.forEach(function(r) {
        lines.push(rowToCSV(r));
      });

      // UTF-8 BOM 추가 → Excel·Google Sheets 한글 깨짐 방지
      var bom = '﻿';
      var csv = bom + lines.join('\n');

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ai_review.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (btn) { btn.textContent = '⬇ CSV 다운로드 (Google Sheets용)'; btn.disabled = false; }
    } catch(e) {
      console.error('CSV 생성 오류:', e);
      alert('CSV 생성 오류: ' + e.message);
      if (btn) { btn.textContent = '⬇ CSV 다운로드 (Google Sheets용)'; btn.disabled = false; }
    }
  }, 20);
}
