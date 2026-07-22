/* ============================================================================
 * precond.js — 사전조건(Precondition) 분류·병합 사전
 * ----------------------------------------------------------------------------
 * 목적: TC 사전조건 529종을 "세팅 속성(카테고리)"으로 분류하고, 같은 의미의
 *   표현(그룹채팅방/그룹 채팅방/단체채팅방/팀채팅방 등)을 canonical 로 병합.
 *   → "한 번의 환경 세팅으로 커버되는 체크포인트"를 파악하기 위함.
 *
 *   Precond.build(model) => {
 *     categories: [{key,label,icon,persistent, conditions:[condKey...], count}],
 *     conditions: { condKey: {label, category, persistent, count, locs:[{fi,gi,ii,ci}]} },
 *     byCategory: { catKey: [condKey...] }
 *   }
 *   Precond.classify(rawPrecond) => { category, canonical }
 * ==========================================================================*/
(function (global) {
  'use strict';

  var CATS = {
    os:         { label: 'OS·단말',          icon: '📱', persistent: true },
    account:    { label: '계정·로그인',       icon: '👤', persistent: true },
    roomType:   { label: '채팅방 유형',       icon: '💬', persistent: true },
    relation:   { label: '상대와의 관계',     icon: '🤝', persistent: true },
    permission: { label: '권한',              icon: '🔐', persistent: true },
    toggle:     { label: '기능 설정(ON/OFF)', icon: '⚙️', persistent: true },
    network:    { label: '네트워크',          icon: '📶', persistent: false },
    dataState:  { label: '데이터 상태',       icon: '🗂', persistent: false },
    entryState: { label: '진입·화면 상태',    icon: '➡️', persistent: false },
    etc:        { label: '기타',              icon: '•',  persistent: false }
  };

  // 순서 = 우선순위. [정규식, 카테고리, canonical(문자열 | null=원문유지)]
  var RULES = [
    [/iOS\s*16/i, 'os', 'iOS 16'],
    [/OS\s*=?\s*iOS|(^|[^a-z])iOS/i, 'os', 'iOS'],
    [/Android/i, 'os', 'Android'],
    [/라이브\s*텍스트 지원/i, 'os', '라이브텍스트 지원 단말'],
    [/다이내믹\s*아일랜드 지원/i, 'os', '다이내믹아일랜드 지원 단말'],

    [/미로그인|비로그인|로그아웃/i, 'account', '미로그인 상태'],
    [/톡클라우드|대용량 파일 공유 계정/i, 'account', '특수 계정 플랜(톡클라우드/대용량)'],
    [/로그인 계정|로그인 상태/i, 'account', '로그인 상태'],

    [/나와의 채팅방/i, 'roomType', '나와의 채팅방'],
    [/1:1 또는 그룹|1:1\/그룹/i, 'roomType', '1:1 또는 그룹 채팅방'],
    [/오픈채팅|오픈 채팅/i, 'roomType', '오픈채팅방'],
    [/프리채팅/i, 'roomType', '프리채팅방'],
    [/그룹\s?채팅방|단체채팅방|단체 채팅방|팀채팅방|팀 채팅방|종류:\s*팀|종류=팀|다인/i, 'roomType', '그룹·단체 채팅방'],
    [/1:1|종류=1:1|종류:\s*1:1|일대일/i, 'roomType', '1:1 채팅방'],

    [/차단/i, 'relation', '상대 차단 상태'],
    [/친구\s*아(님|닌)|친구로 등록되지 않|친구가 아닌|친구 아님/i, 'relation', '상대와 친구 아님'],
    [/친구 관계|친구로 등록|친구인/i, 'relation', '상대와 친구 관계'],

    [/카메라.*권한/i, 'permission', '카메라 권한'],
    [/마이크.*권한/i, 'permission', '마이크 권한'],
    [/미디어.*권한|사진.*권한|앨범.*권한/i, 'permission', '미디어(앨범) 권한'],
    [/위치.*권한/i, 'permission', '위치 권한'],
    [/권한 허용|권한 있음/i, 'permission', '기타 권한 허용'],

    [/미니플레이어 (활성|재생)/i, 'entryState', '미니플레이어 활성화'],
    [/(\bON\b|\bOFF\b|=사용|설정=|사용중|잠금 상태|비활성 상태|활성 상태)/i, 'toggle', null],

    [/Wi-?Fi/i, 'network', 'Wi-Fi 연결'],
    [/네트워크 불안정|연결 불안정|약한 네트워크/i, 'network', '네트워크 불안정'],
    [/네트워크|데이터 연결|오프라인|비행기/i, 'network', '네트워크 연결'],

    [/진입 상태|진입한|진입$/i, 'entryState', null],
    [/노출 상태|페이지 노출|화면 노출|표시 상태/i, 'entryState', null],
    [/존재|있음|수신 상태|발신|발송|공유됨|등록된|등록되어|설정 상태|설정 있음|데이터/i, 'dataState', null]
  ];

  function classify(raw) {
    var p = String(raw || '').trim();
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(p)) return { category: RULES[i][1], canonical: RULES[i][2] || p };
    }
    return { category: 'etc', canonical: p };
  }

  function build(model) {
    var conditions = {}, byCategory = {};
    (model.functions || []).forEach(function (f, fi) {
      (f.validation_groups || []).forEach(function (g, gi) {
        (g.items || []).forEach(function (it, ii) {
          (it.checkpoints || []).forEach(function (c, ci) {
            var seen = {};  // 한 체크포인트가 같은 canonical을 중복 카운트하지 않도록
            (c.preconditions || []).forEach(function (p) {
              var cl = classify(p), key = cl.canonical;
              if (seen[key]) return; seen[key] = 1;
              if (!conditions[key]) {
                conditions[key] = { label: key, category: cl.category, persistent: CATS[cl.category].persistent, count: 0, locs: [] };
                (byCategory[cl.category] = byCategory[cl.category] || []).push(key);
              }
              conditions[key].count++;
              conditions[key].locs.push({ fi: fi, gi: gi, ii: ii, ci: ci, label: c.check_point });
            });
          });
        });
      });
    });
    var categories = Object.keys(CATS).filter(function (k) { return byCategory[k]; }).map(function (k) {
      var conds = byCategory[k].sort(function (a, b) { return conditions[b].count - conditions[a].count; });
      var cnt = conds.reduce(function (s, c) { return s + conditions[c].count; }, 0);
      return { key: k, label: CATS[k].label, icon: CATS[k].icon, persistent: CATS[k].persistent, conditions: conds, condCount: conds.length, count: cnt };
    });
    return { categories: categories, conditions: conditions, byCategory: byCategory, catMeta: CATS };
  }

  global.Precond = { build: build, classify: classify, CATS: CATS };
})(typeof window !== 'undefined' ? window : globalThis);
