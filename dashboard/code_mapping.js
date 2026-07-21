/* ============================================================================
 * code_mapping.js — TC 기반 "가상 Code Mapping" 생성기
 * ----------------------------------------------------------------------------
 * ⚠️ 여기서 만드는 Activity / Fragment / Screen ID / Target ID 는 실제 Android
 *    소스코드 값이 아니라, TC 문서(검증 모델)를 분석해 추론한 "가상(virtual)"
 *    구조입니다. 모든 값은 mapping_source='virtual_tc' 로 표시되며, 나중에 실제
 *    코드가 연결되면 build() 를 actual 로더로 교체/병합하면 됩니다.
 *
 * 산출물 (CheckpointCodeMapping / ScreenMapping / TargetMapping 데이터 모델):
 *   CodeMapping.build(model) => {
 *     version, source, screens:{id:ScreenMapping}, targets:{id:TargetMapping},
 *     checkpoints:{cpId:CheckpointCodeMapping},
 *     byScreen:{screen_id:[loc]}, byTarget:{target_id:[loc]}
 *   }
 * ==========================================================================*/
(function (global) {
  'use strict';

  /* ---------- 문자열 유틸 ---------- */
  function upperSnake(s) {
    return String(s || '')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')   // camelCase 경계
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/_+/g, '_').replace(/^_|_$/g, '')
      .toUpperCase();
  }
  function pascal(s) {
    return String(s || '').replace(/[^A-Za-z0-9]+/g, ' ').trim()
      .split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }

  /* ---------- 화면(Screen) 추론 규칙 ----------
   * 순서 = 우선순위. haystack(기능+그룹+항목+경로+체크텍스트+target)에 대해
   * 첫 매칭 규칙을 사용. independent=true 는 전용 Activity 후보.               */
  var SCREEN_RULES = [
    { re: /앨범|피커|MediaPicker|FilePicker|하프뷰|풀뷰/, id: 'SCR_MEDIA_PICKER', name: '미디어 피커', activity: 'MediaPickerActivity', fragment: 'AlbumPickerFragment', independent: true, conf: 0.84 },
    { re: /미디어 편집|이미지 편집|MediaEdit|크롭|자르기/, id: 'SCR_MEDIA_EDIT', name: '미디어 편집', activity: 'MediaEditActivity', fragment: 'MediaEditFragment', independent: true, conf: 0.82 },
    { re: /카카오TV|인앱플레이어|미니플레이어|플레이어 뷰|MiniPlayer|플로팅 플레이어/, id: 'SCR_INAPP_PLAYER', name: '인앱 플레이어', activity: 'MainActivity', fragment: 'InAppPlayerFragment', conf: 0.80 },
    { re: /톡게시판|게시글|게시물|TalkBoard|Post/, id: 'SCR_TALK_BOARD', name: '톡게시판', activity: 'TalkBoardActivity', fragment: 'TalkBoardFragment', independent: true, conf: 0.83 },
    { re: /톡캘린더|일정|캘린더|Schedule|Calendar/, id: 'SCR_TALK_CALENDAR', name: '톡캘린더 일정', activity: 'TalkCalendarActivity', fragment: 'CalendarFragment', independent: true, conf: 0.80 },
    { re: /친구위치|위치공유|카카오맵|LocationShare/, id: 'SCR_LOCATION_SHARE', name: '친구 위치공유', activity: 'LocationShareActivity', fragment: 'FriendLocationFragment', independent: true, conf: 0.80 },
    { re: /미니게임|돌림판|사다리|당첨뽑기|포춘쿠키|MiniGame/, id: 'SCR_MINI_GAME', name: '미니게임', activity: 'MiniGameActivity', fragment: 'MiniGameFragment', independent: true, conf: 0.78 },
    { re: /스팸뷰|스팸|SpamView|친구 아닌/, id: 'SCR_SPAM_VIEW', name: '스팸뷰(친구 아님)', activity: 'MainActivity', fragment: 'SpamChatRoomFragment', conf: 0.78 },
    { re: /프리채팅|오픈채팅 프리/, id: 'SCR_FREE_CHAT', name: '프리채팅방', activity: 'MainActivity', fragment: 'FreeChatRoomFragment', conf: 0.72 },
    { re: /챗봇|Chatbot/, id: 'SCR_CHATBOT_ROOM', name: '챗봇 대화방', activity: 'MainActivity', fragment: 'ChatbotRoomFragment', conf: 0.78 },
    { re: /프로필 조회|프로필 사진|ProfileSheet|대화상대 프로필/, id: 'SCR_PROFILE', name: '대화상대 프로필', activity: 'MainActivity', fragment: 'ProfileFragment', conf: 0.76 },
    { re: /사이드 메뉴|서랍|Drawer|사이드메뉴/, id: 'SCR_CHAT_ROOM_SIDE_MENU', name: '채팅방 사이드 메뉴', activity: 'MainActivity', fragment: 'ChatRoomDrawerFragment', conf: 0.80 },
    { re: /설정|알림|즐겨찾기|나가기|배경화면|데이터 관리|내보내기|정보 편집|재생성|잠금/, id: 'SCR_CHAT_ROOM_SETTINGS', name: '채팅방 설정', activity: 'MainActivity', fragment: 'ChatRoomSettingsFragment', conf: 0.80 },
    { re: /태그/, id: 'SCR_CHAT_TAG', name: '태그 관리', activity: 'MainActivity', fragment: 'ChatTagFragment', conf: 0.79 },
    { re: /검색/, id: 'SCR_CHAT_SEARCH', name: '채팅방 검색', activity: 'MainActivity', fragment: 'ChatSearchFragment', conf: 0.82 },
    { re: /채팅방 생성|비밀채팅 생성/, id: 'SCR_CHAT_CREATE', name: '채팅방 생성', activity: 'ChatCreateActivity', fragment: 'ChatCreateFragment', independent: true, conf: 0.76 },
    { re: /이모티콘|스티커|Emoticon|Sticker/, id: 'SCR_GENERAL_CHAT_ROOM', name: '일반채팅 대화방', activity: 'MainActivity', fragment: 'GeneralChatRoomFragment', conf: 0.72 }
  ];
  // 최종 폴백(대화방). 신뢰도는 함수 맥락으로 조정.
  var DEFAULT_SCREEN = { id: 'SCR_GENERAL_CHAT_ROOM', name: '일반채팅 대화방', activity: 'MainActivity', fragment: 'GeneralChatRoomFragment', conf: 0.78 };
  // 화면이 불명확하다고 볼 함수(추가 검수 필요)
  var AMBIGUOUS_FN = /예외|특수케이스/;

  /* ---------- 오버레이(팝업/시트/토스트) target ---------- */
  var OVERLAY_RE = /(Alert|Dialog|Toast|BottomSheet|ActionSheet|ContextMenu|Sheet|Modal|Popup|Picker|Menu$|Snackbar)/;
  /* ---------- 영역(구조도) 분류 ---------- */
  function region(target) {
    var t = String(target || '');
    if (/(Back|Header|Title|More|Nav(?!igate)|Appbar|Toolbar(?!$)|SearchButton|TopBar)/.test(t)) return 'top';
    if (/(Input|Send|Keyboard|Toolbar$|Attach|Voice|PlusMenu|Mention|Emoticon|InputArea)/.test(t)) return 'input';
    if (OVERLAY_RE.test(t)) return 'overlay';
    return 'body';
  }
  function targetType(target) {
    var t = String(target || '');
    if (/Button$/.test(t)) return 'button';
    if (/Banner$/.test(t)) return 'banner';
    if (OVERLAY_RE.test(t)) return 'overlay';
    if (/(List|Feed)$/.test(t)) return 'list';
    if (/(Input|Keyboard)$/.test(t)) return 'input';
    if (/(Bubble|Message)/.test(t)) return 'bubble';
    return 'view';
  }

  /* ---------- 화면 추론 ---------- */
  function inferScreen(ctx) {
    var hay = [ctx.fn, ctx.group, ctx.item, ctx.path, ctx.check, ctx.target].join(' ');
    for (var i = 0; i < SCREEN_RULES.length; i++) {
      if (SCREEN_RULES[i].re.test(hay)) return { rule: SCREEN_RULES[i], matched: true };
    }
    var d = Object.assign({}, DEFAULT_SCREEN);
    if (AMBIGUOUS_FN.test(ctx.fn)) d.conf = 0.62;  // 검수 필요 후보
    return { rule: d, matched: false };
  }

  function statusFor(conf, hasTarget) {
    if (!hasTarget) return 'unmapped';
    if (conf >= 0.70) return 'virtual_suggested';
    if (conf >= 0.50) return 'review_required';
    return 'unmapped';
  }
  function confBand(conf) { return conf >= 0.90 ? 'High' : conf >= 0.70 ? 'Medium' : 'Low'; }

  /* ---------- 메인 빌드 ---------- */
  function build(model) {
    var screens = {}, targets = {}, checkpoints = {}, byScreen = {}, byTarget = {};

    (model.functions || []).forEach(function (f, fi) {
      var fn = f.function_name || f.function;
      (f.validation_groups || []).forEach(function (g, gi) {
        (g.items || []).forEach(function (it, ii) {
          (it.checkpoints || []).forEach(function (c, ci) {
            var cpId = 'CP_' + fi + '_' + gi + '_' + ii + '_' + ci;
            var path = (c.execution_path || []).join(' › ');
            var target = c.target || '';
            var sc = inferScreen({ fn: fn, group: g.group, item: it.item, path: path, check: c.check_point, target: target });
            var rule = sc.rule;
            var screenKey = rule.id.replace(/^SCR_/, '');

            /* --- Screen registry --- */
            if (!screens[rule.id]) {
              screens[rule.id] = {
                screen_id: rule.id, screen_name: rule.name, service_name: model.service || '일반채팅',
                activity_candidate: rule.activity, fragment_candidate: rule.fragment,
                route_candidate: 'route://' + screenKey.toLowerCase(),
                independent: !!rule.independent, mapping_source: 'virtual_tc',
                mapping_status: 'virtual_suggested', confidence: rule.conf,
                targets: []
              };
            }
            var screen = screens[rule.id];

            /* --- Target registry --- */
            var tId = null, tType = null, overlay = null;
            if (target) {
              tId = 'TGT_' + screenKey + '_' + upperSnake(target);
              tType = targetType(target);
              if (region(target) === 'overlay') overlay = 'OVL_' + screenKey + '_' + upperSnake(target);
              if (!targets[tId]) {
                targets[tId] = {
                  target_id: tId, screen_id: rule.id, target_name: target, target_type: tType,
                  parent_target_id: null, overlay_candidate: overlay,
                  mapping_source: 'virtual_tc', mapping_status: 'virtual_suggested',
                  confidence: Math.min(0.88, rule.conf), region: region(target), count: 0
                };
                if (screen.targets.indexOf(target) < 0) screen.targets.push(target);
              }
              targets[tId].count++;
            }

            /* --- 신뢰도/상태 --- */
            var conf = rule.conf;
            if (target && sc.matched) conf = Math.min(0.88, conf + 0.02);
            if (!target) conf = Math.min(conf, 0.45);
            var status = statusFor(conf, !!target);

            /* --- 근거 --- */
            var basis = [];
            basis.push('검증 그룹: ' + g.group);
            basis.push('검증 항목: ' + it.item);
            if (path) basis.push('실행 경로: ' + path);
            if ((c.preconditions || []).length) basis.push('사전조건: ' + c.preconditions.join(', '));
            if (target) basis.push('대상(Target): ' + target);
            if (c.expected_state) basis.push('기대 상태: ' + c.expected_state);

            /* --- CheckpointCodeMapping --- */
            checkpoints[cpId] = {
              checkpoint_id: cpId, loc: { fi: fi, gi: gi, ii: ii, ci: ci },
              check_point: c.check_point,
              screen_id: rule.id, target_id: tId,
              activity_candidate: rule.activity, fragment_candidate: rule.fragment,
              overlay_candidate: overlay, route_candidate: screen.route_candidate,
              expected_state: c.expected_state || '', target_name: target, target_type: tType,
              mapping_source: 'virtual_tc', mapping_status: status,
              confidence: conf, confidence_band: confBand(conf), mapping_basis: basis
            };

            (byScreen[rule.id] = byScreen[rule.id] || []).push({ fi: fi, gi: gi, ii: ii, ci: ci, cpId: cpId, label: c.check_point });
            if (tId) (byTarget[tId] = byTarget[tId] || []).push({ fi: fi, gi: gi, ii: ii, ci: ci, cpId: cpId, label: c.check_point });
          });
        });
      });
    });

    return {
      version: 'vmap-1', source: 'virtual_tc', generated_from: 'validation_model (TC)',
      screens: screens, targets: targets, checkpoints: checkpoints,
      byScreen: byScreen, byTarget: byTarget
    };
  }

  global.CodeMapping = {
    build: build,
    cpId: function (fi, gi, ii, ci) { return 'CP_' + fi + '_' + gi + '_' + ii + '_' + ci; },
    region: region, upperSnake: upperSnake, pascal: pascal
  };
})(typeof window !== 'undefined' ? window : globalThis);
