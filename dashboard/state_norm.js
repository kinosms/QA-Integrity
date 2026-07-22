/* ============================================================================
 * state_norm.js — 검증 술어/기대상태 정규화 사전
 * ----------------------------------------------------------------------------
 * TC 체크포인트는 "노출된다 / 표시된다 / 제공된다 / 활성화된다 …" 처럼 작성자마다
 * 다른 한국어 술어를 쓰고, expected_state 도 "Shown / Visible / Displayed …" 로
 * 흩어져 있습니다. 이 모듈은 두 소스를 하나의 canonical 상태로 정규화하고,
 * (텍스트 술어) ↔ (expected_state) 가 서로 어긋나는 경우를 conflict 로 표시합니다.
 *
 *   StateNorm.normalize(checkpoint) => {
 *     canonical, canonical_ko, verify, normalized_state,
 *     source_verb, from_text, from_es, agree, conflict, confidence
 *   }
 * ==========================================================================*/
(function (global) {
  'use strict';

  // canonical 상태 정의 (정규화 목표 어휘)
  var CANON = {
    Visible:   { ko: '노출',      verify: '요소가 화면에 보임 (element.Visible)' },
    Hidden:    { ko: '미노출',    verify: '요소가 화면에 없음/사라짐 (element.Hidden)' },
    Available: { ko: '제공·활성', verify: '기능이 사용 가능 (enabled/available)' },
    Disabled:  { ko: '비활성',    verify: '기능 비활성/잠금 (disabled/locked)' },
    Launched:  { ko: '실행',      verify: '대상이 실행/열림 (launched/opened)' },
    Navigate:  { ko: '화면 이동', verify: '다른 화면으로 전환·진입 (currentScreen 변경)' },
    Sent:      { ko: '전송',      verify: '메시지/데이터 전송됨 (sent/delivered)' },
    Added:     { ko: '추가',      verify: '항목이 추가됨 (added)' },
    Removed:   { ko: '삭제·제거', verify: '항목이 삭제/제거/해제됨 (removed)' },
    Playing:   { ko: '재생',      verify: '미디어 재생 중 (playing)' },
    Updated:   { ko: '변경·반영', verify: '값/상태가 변경·갱신·반영됨 (updated)' },
    Saved:     { ko: '저장',      verify: '저장/다운로드됨 (saved/downloaded)' },
    Closed:    { ko: '닫힘·종료', verify: '팝업/화면이 닫힘·종료됨 (closed/dismissed)' },
    Selected:  { ko: '선택',      verify: '항목이 선택/강조됨 (selected/highlighted)' },
    Persisted: { ko: '유지',      verify: '상태가 유지됨 (persisted)' },
    Completed: { ko: '완료',      verify: '동작이 완료/처리됨 (completed)' },
    Blocked:   { ko: '차단',      verify: '차단됨 (blocked)' },
    Layout:    { ko: '레이아웃',  verify: '뷰 모드/레이아웃 상태 (half/full 등)' },
    Other:     { ko: '기타',      verify: '정규화 미정 — 검수 필요' }
  };

  // 체크포인트 "텍스트 술어" → canonical (순서 = 우선순위: 부정·구체 먼저)
  var TEXT_RULES = [
    [/미노출|노출되지\s*않|표시되지\s*않|보이지\s*않|안\s*보|숨겨|가려진/, 'Hidden'],
    [/사라진|사라진다|없어진|없어진다/, 'Hidden'],
    [/비활성|잠금|잠긴|눌리지\s*않|입력되지\s*않|수\s*없다|불가능/, 'Disabled'],
    [/수\s*있다|가능하다|사용\s*가능|이용\s*가능|편집할\s*수/, 'Available'],
    [/닫힌|닫힘|닫혀|종료된|종료된다/, 'Closed'],
    [/삭제|제거|해제된|해제된다|취소된/, 'Removed'],
    [/전송|발송|발신|전달된|전달된다|공유된|공유된다/, 'Sent'],
    [/이동|전환|진입|랜딩|돌아간|돌아온|복귀/, 'Navigate'],
    [/실행|열린다|열림|열려|기동/, 'Launched'],
    [/재생|플레이/, 'Playing'],
    [/저장|다운로드/, 'Saved'],
    [/추가된|추가된다/, 'Added'],
    [/선택된|선택된다|하이라이트|강조/, 'Selected'],
    [/변경|갱신|반영|적용|초기화|소팅|정렬|업데이트/, 'Updated'],
    [/유지된|유지된다/, 'Persisted'],
    [/제공|활성화|활성|사용\s*가능|가능하다/, 'Available'],
    [/완료|처리된|동작한다|발생한다|성공/, 'Completed'],
    [/차단/, 'Blocked'],
    [/노출|표시|표출|보인다|나타난|노출된|표시된|팝업/, 'Visible']
  ];

  // expected_state RHS 토큰 → canonical (contains 매칭)
  var ES_RULES = [
    [/NotShown|Invisible|NotTriggered/i, 'Hidden'],
    [/Shown|Displayed|Visible|Exposed|Appeared|Popup/i, 'Visible'],
    [/Hidden|Gone/i, 'Hidden'],
    [/Disabled|Locked|Inactive|\bOff\b/i, 'Disabled'],
    [/Enabled|Available|Active|\bOn\b|True/i, 'Available'],
    [/Launched|Opened|Running/i, 'Launched'],
    [/Landed|Entered|Navigated|Moved|Navigate/i, 'Navigate'],
    [/MessageSent|Sent|Delivered|Shared|Forwarded/i, 'Sent'],
    [/Added/i, 'Added'],
    [/Removed|Deleted|Cleared|Cancelled|Canceled/i, 'Removed'],
    [/Playing|Played|Paused/i, 'Playing'],
    [/Updated|Applied|Changed|Replaced|Reflected|Sorted|Reset/i, 'Updated'],
    [/Saved|Downloaded|Stored/i, 'Saved'],
    [/Closed|Dismissed|Ended|Exited/i, 'Closed'],
    [/Selected|Highlighted|Checked/i, 'Selected'],
    [/Persisted|Maintained|Kept/i, 'Persisted'],
    [/Completed|Done|Success|Triggered|Processed/i, 'Completed'],
    [/Blocked/i, 'Blocked'],
    [/^(?:HalfView|FullView)$/i, 'Layout']
  ];

  // 텍스트 정규화: 문장 "최종 술어"를 먼저 판정(명사·부사절 오인 방지), 실패 시 전체 문장 스캔
  function textCanon(text) {
    text = String(text || '');
    var fv = sourceVerb(text);
    if (fv) { for (var i = 0; i < TEXT_RULES.length; i++) if (TEXT_RULES[i][0].test(fv)) return TEXT_RULES[i][1]; }
    for (var j = 0; j < TEXT_RULES.length; j++) if (TEXT_RULES[j][0].test(text)) return TEXT_RULES[j][1];
    return null;
  }
  function esRHS(es) {
    var parts = String(es || '').split(/[=.]/);
    return (parts[parts.length - 1] || '').trim();
  }
  function esCanon(es) {
    var rhs = esRHS(es);
    if (!rhs) return null;
    for (var i = 0; i < ES_RULES.length; i++) if (ES_RULES[i][0].test(rhs)) return ES_RULES[i][1];
    return null;
  }
  // 텍스트에서 매칭된 원문 술어(표시용)
  function sourceVerb(text) {
    var m = String(text || '').replace(/[.\s]+$/, '').match(/([가-힣]+(?:된다|한다|되다|하다|진다|린다|힌다|난다|긴다|는다|다))$/);
    return m ? m[1] : '';
  }

  function normalize(cp) {
    var textC = textCanon(cp.check_point);
    var esC = esCanon(cp.expected_state);
    var canonical, conf, conflict = false, agree = false;
    if (textC && esC) {
      if (textC === esC) { canonical = esC; conf = 0.95; agree = true; }
      else { canonical = esC; conf = 0.60; conflict = true; }   // 불일치 → expected_state 우선, 검수 플래그
    } else if (esC) { canonical = esC; conf = 0.85; }
    else if (textC) { canonical = textC; conf = 0.80; }
    else { canonical = 'Other'; conf = 0.40; }
    var meta = CANON[canonical] || CANON.Other;
    var target = cp.target || 'State';
    return {
      canonical: canonical, canonical_ko: meta.ko, verify: meta.verify,
      normalized_state: target + '.' + canonical,
      source_verb: sourceVerb(cp.check_point),
      from_text: textC, from_es: esC, es_rhs: esRHS(cp.expected_state),
      agree: agree, conflict: conflict, confidence: conf
    };
  }

  global.StateNorm = { normalize: normalize, CANON: CANON, textCanon: textCanon, esCanon: esCanon };
})(typeof window !== 'undefined' ? window : globalThis);
