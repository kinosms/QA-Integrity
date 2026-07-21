#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
convert_chat.py — '5.일반채팅' 시트 전용 신규 구조화 TC 변환기 (규칙 기반·결정론적)

목적:
  기존 Excel TC 문서 중 '5.일반채팅' 시트만 대상으로,
  기존 테스트 항목을 신규 구조화 TC 체계(Screen/Target/State/Transition Dictionary +
  구조화 Step)로 변환한다. 다른 시트는 절대 건드리지 않는다.

설계 원칙:
  - 기존 analyzer.py 의 규칙 기반 철학을 그대로 따른다 (LLM API 미사용).
  - 사전(카탈로그)의 '키워드 규칙'은 큐레이션하되,
    실제로 등장한 항목 / 출처 행번호 / 사용 TC 수는 100% 실데이터에서 산출한다.
    → 하드코딩된 샘플 데이터가 아니라 실 Excel 분석 결과다.
  - 모든 원본 행이 최소 하나의 신규 TC에 연결됨을 보장한다 (unmapped=0).

실행:
  python tools/convert_chat.py --input "Regression TestCase.xlsx"

출력: output/chat_conversion/
  screen_dictionary.csv, target_dictionary.csv, state_dictionary.csv,
  transition_dictionary.csv, converted_tc_master.csv, converted_tc_steps.csv,
  source_tc_mapping.csv, conversion_summary.json, conversion.json
"""

import os
import re
import csv
import sys
import json
import argparse

import openpyxl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'tools'))

from analyzer import (  # noqa: E402
    load_sheet, is_tc_row, cell,
    normalize_priority, normalize_os, classify_attributes,
    COL_CAT1, COL_CAT2, COL_CAT3, COL_CAT4,
    COL_PRECOND, COL_STEP, COL_EXPECTED, COL_PRIORITY, COL_OS,
    ATTR_LABEL_KO, _AUTO_CLEAR, _AUTO_VAGUE, _MANUAL_SIGNALS,
)

SHEET_NAME = '5.일반채팅'
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
NA = '해당없음'

# ══════════════════════════════════════════════════════════════════════════════
# 사전 카탈로그 (키워드 규칙) — 실제 매칭된 항목만 최종 사전에 등록됨
# ══════════════════════════════════════════════════════════════════════════════

DEFAULT_SCREEN = 'SCR_CHATROOM'

# id, 화면명, 식별 기준, [키워드...]  (default 는 맨 뒤)
SCREEN_CATALOG = [
    ('SCR_CHAT_LIST', '채팅 목록', '채팅방 리스트 항목과 상단 탭이 표시됨',
     ['채팅목록', '채팅 목록', '채팅 리스트', '채팅탭', '채팅 탭', '채팅방 목록', '대화방 목록']),
    ('SCR_CHAT_SEARCH', '채팅방 검색(타임머신)', '검색 입력란과 검색 결과 목록이 표시됨',
     ['검색 화면', '검색화면', '검색 결과', '검색결과', '타임머신', '검색 입력', '검색 옵션']),
    ('SCR_CHATROOM_SIDE_MENU', '채팅방 사이드 메뉴', '채팅방 우측에서 슬라이드되는 메뉴 목록이 표시됨',
     ['사이드 메뉴', '사이드메뉴']),
    ('SCR_MEDIA_PICKER', '미디어/앨범 피커', '이미지 썸네일 목록과 전송 버튼이 표시됨',
     ['앨범 피커', '앨범피커', '미디어 피커', '사진 선택', '이미지 선택', '사진첩', '갤러리', '앨범 화면']),
    ('SCR_IMAGE_VIEWER', '이미지 뷰어', '선택한 이미지가 원본 비율로 확대 표시됨',
     ['이미지 뷰어', '사진 뷰어', '이미지뷰어', '원본 이미지', '이미지 확대', '이미지 상세']),
    ('SCR_EMOTICON_PICKER', '이모티콘 선택', '이모티콘 탭과 이모티콘 목록이 표시됨',
     ['이모티콘 키보드', '이모티콘 탭', '이모티콘 선택', '+키보드', '이모티콘 스토어']),
    ('SCR_PLUS_MENU', '플러스(+) 메뉴', '첨부/기능 아이콘 그리드가 표시됨',
     ['플러스 메뉴', '+ 메뉴', '첨부 메뉴', '플러스메뉴']),
    ('SCR_CHATROOM_SETTINGS', '채팅방 설정/관리', '채팅방 설정 및 관리 항목 목록이 표시됨',
     ['채팅방 설정', '설정 영역', '채팅방 관리', '채팅방 공통 설정']),
    ('SCR_TALK_CLOUD', '톡클라우드', '톡클라우드 파일/폴더 목록이 표시됨',
     ['톡클라우드', '톡 클라우드']),
    ('SCR_CHATBOT', '챗봇 화면', '챗봇 대화 UI가 표시됨',
     ['챗봇']),
    ('SCR_CHATROOM', '채팅방', '상단에 대화 상대 이름이 표시되고 메시지 목록과 메시지 입력 영역이 존재함',
     ['채팅방', '대화방', '채팅 영역', '말풍선', '입력창', '입력 영역', '메시지 입력']),
]

# id, 대상명, Screen ID, 식별 기준, [키워드...]  (구체 → 일반 순서)
TARGET_CATALOG = [
    ('TGT_BACK_BUTTON', '뒤로 가기 아이콘', 'SCR_CHATROOM', '채팅방 상단 좌측의 뒤로 가기 아이콘',
     ['뒤로 가기', '뒤로가기']),
    ('TGT_SEARCH_BUTTON', '채팅방 검색 아이콘', 'SCR_CHATROOM', '채팅방 상단의 검색(돋보기) 아이콘',
     ['검색 아이콘', '검색 버튼', '검색버튼']),
    ('TGT_SIDE_MENU_BUTTON', '사이드 메뉴 버튼', 'SCR_CHATROOM', '채팅방 상단 우측의 메뉴(햄버거) 아이콘',
     ['사이드 메뉴 아이콘', '사이드 메뉴 버튼', '사이드메뉴 아이콘', '햄버거']),
    ('TGT_SEND_BUTTON', '전송 버튼', 'SCR_CHATROOM', '메시지 입력 영역 우측의 전송 버튼',
     ['전송 버튼', '전송버튼', '보내기 버튼', '전송 아이콘', 'send 버튼']),
    ('TGT_ATTACH_BUTTON', '첨부(+) 버튼', 'SCR_CHATROOM', '메시지 입력 영역 좌측의 첨부(+) 아이콘',
     ['첨부 버튼', '첨부버튼', '첨부 아이콘', '플러스 버튼', '+ 버튼', '+버튼']),
    ('TGT_EMOTICON_BUTTON', '이모티콘 버튼', 'SCR_CHATROOM', '메시지 입력 영역의 이모티콘 아이콘',
     ['이모티콘 버튼', '이모티콘 아이콘']),
    ('TGT_MESSAGE_INPUT', '메시지 입력창', 'SCR_CHATROOM', '채팅방 하단의 텍스트 입력 영역',
     ['입력창', '입력란', '입력 영역', '메시지 입력', '텍스트 입력']),
    ('TGT_IMAGE_ITEM', '이미지 항목(썸네일)', 'SCR_MEDIA_PICKER', '피커의 이미지 썸네일 항목',
     ['이미지 항목', '사진 항목', '이미지 썸네일', '사진 썸네일', '이미지 선택', '사진 선택']),
    ('TGT_SENT_IMAGE_BUBBLE', '송신 이미지 말풍선', 'SCR_CHATROOM', '전송한 이미지가 담긴 송신 말풍선',
     ['송신 이미지 말풍선', '보낸 이미지', '송신 사진 말풍선']),
    ('TGT_RECEIVED_IMAGE_BUBBLE', '수신 이미지 말풍선', 'SCR_CHATROOM', '수신한 이미지가 담긴 수신 말풍선',
     ['수신 이미지 말풍선', '받은 이미지', '수신 사진 말풍선']),
    ('TGT_IMAGE_BUBBLE', '이미지 말풍선', 'SCR_CHATROOM', '이미지가 담긴 말풍선',
     ['이미지 말풍선', '사진 말풍선']),
    ('TGT_SENT_BUBBLE', '송신 말풍선', 'SCR_CHATROOM', '내가 보낸 메시지 말풍선(우측 정렬)',
     ['송신 말풍선', '보낸 말풍선', '송신측 말풍선', '송신 : 말풍선']),
    ('TGT_RECEIVED_BUBBLE', '수신 말풍선', 'SCR_CHATROOM', '상대가 보낸 메시지 말풍선(좌측 정렬)',
     ['수신 말풍선', '받은 말풍선', '수신측 말풍선', '수신 : 말풍선']),
    ('TGT_MESSAGE_BUBBLE', '메시지 말풍선', 'SCR_CHATROOM', '채팅 영역의 메시지 말풍선',
     ['말풍선']),
    ('TGT_RESEND_BUTTON', '재전송/재시도 버튼', 'SCR_CHATROOM', '전송 실패 말풍선 옆 재시도 아이콘',
     ['재시도', '재전송']),
    ('TGT_DELETE_BUTTON', '삭제 버튼', 'SCR_CHATROOM', '삭제 아이콘 또는 [삭제] 버튼',
     ['삭제 아이콘', '삭제 버튼', '[삭제]']),
    ('TGT_DOWNLOAD_BUTTON', '다운로드 버튼', 'SCR_IMAGE_VIEWER', '이미지/파일 저장(다운로드) 버튼',
     ['다운로드 버튼', '저장 버튼', '다운로드 아이콘']),
    ('TGT_PROFILE_IMAGE', '프로필 이미지', 'SCR_CHATROOM', '수신 말풍선 좌측의 상대 프로필 이미지',
     ['프로필 이미지', '프로필 사진']),
    ('TGT_ALERT_POPUP', '얼럿/팝업', 'SCR_CHATROOM', '확인/취소 버튼을 가진 얼럿 또는 모달',
     ['얼럿', '알럿', '팝업', '모달']),
    ('TGT_BOTTOM_SHEET', '바텀시트', 'SCR_CHATROOM', '하단에서 올라오는 바텀시트 메뉴',
     ['바텀시트', '바텀 시트']),
    ('TGT_TOAST', '토스트 메시지', 'SCR_CHATROOM', '화면 하단에 잠시 표시되는 토스트',
     ['토스트']),
    ('TGT_CHATROOM_MENU_BUTTON', '채팅방 메뉴 버튼', 'SCR_CHATROOM', '채팅방 상단/영역의 메뉴 아이콘',
     ['메뉴 아이콘', '메뉴 버튼', '메뉴버튼']),
    ('TGT_CHATROOM_LIST_ITEM', '채팅방 목록 항목', 'SCR_CHAT_LIST', '채팅 목록의 개별 대화방 항목',
     ['채팅방 목록 항목', '대화방 항목', '채팅방 항목', '리스트 항목']),
    ('TGT_EMOTICON_ITEM', '이모티콘 항목', 'SCR_EMOTICON_PICKER', '이모티콘 목록의 개별 이모티콘',
     ['이모티콘 항목', '이모티콘 선택']),
]

# id, State Type, 정의, 판정 기준, bucket(precondition 매핑), [키워드...]
STATE_CATALOG = [
    ('STA_ACCOUNT_LOGGED_IN', 'Account State', '카카오 계정 로그인 완료 상태',
     '앱 진입 시 로그인 화면이 아닌 서비스 화면으로 진입 가능', 'data', ['로그인', '로그인된', '로그인 상태']),
    ('STA_ONE_ON_ONE_CHATROOM', 'Data State', '1:1 채팅방이 존재하는 상태',
     '대상 1:1 채팅방이 채팅 목록에 존재', 'data', ['1:1 채팅방', '1:1채팅방', '1:1 대화방']),
    ('STA_GROUP_CHATROOM', 'Data State', '그룹(단체) 채팅방이 존재하는 상태',
     '대상 그룹 채팅방이 채팅 목록에 존재', 'data', ['그룹채팅방', '그룹 채팅방', '단체방', '그룹채팅']),
    ('STA_CHATROOM_READY', 'UI State', '채팅방 진입 및 로딩이 완료되어 메시지 송수신이 가능한 상태',
     '채팅방 상단·채팅 영역·입력 영역이 모두 노출됨', 'ui',
     ['채팅방 진입', '채팅방 로딩', '대화방 진입', '채팅방 입장']),
    ('STA_NETWORK_CONNECTED', 'Network State', '정상 Wi-Fi/데이터 네트워크에 연결된 상태',
     '네트워크 상태 표시줄에 오프라인 안내가 없음', 'data',
     ['정상 네트워크', 'wi-fi', 'wifi', '네트워크 정상', '정상적인 wi-fi']),
    ('STA_NETWORK_UNSTABLE', 'Network State', '네트워크가 불안정하거나 약한 상태',
     '전송 시 지연·재시도가 발생', 'data', ['네트워크 불안정', '약한 네트워크', '불안정한 네트워크']),
    ('STA_AIRPLANE_MODE', 'Network State', '비행기 모드(오프라인) 상태',
     '기기 설정의 비행기 모드가 ON', 'data', ['비행기모드', '비행기 모드', '에어플레인']),
    ('STA_MEDIA_PERMISSION_ALLOWED', 'Permission State', '사진/미디어 접근 권한이 허용된 상태',
     '앨범 피커 진입 시 권한 요청 팝업 없이 이미지 목록 노출', 'permission',
     ['사진 권한', '미디어 권한', '저장소 권한', '사진 접근', '권한 허용']),
    ('STA_MEDIA_PERMISSION_DENIED', 'Permission State', '사진/미디어 접근 권한이 거부된 상태',
     '앨범 피커 진입 시 권한 안내 화면이 노출', 'permission', ['권한 거부', '권한 미허용', '접근 권한 없음']),
    ('STA_LARGE_IMAGE_SELECTED', 'UI State', '전송할 (대용량) 이미지가 선택된 상태',
     '전송 버튼이 활성화되고 선택 수가 표시됨', 'ui',
     ['이미지 선택됨', '사진 선택됨', '이미지 선택 완료', '대용량 이미지가 선택', '이미지가 선택된']),
    ('STA_UPLOAD_IN_PROGRESS', 'Data State', '이미지/파일 업로드가 진행 중인 상태',
     '송신 말풍선에 진행 인디케이터(종이비행기 등)가 표시됨', 'data',
     ['업로드 중', '전송 중', '종이비행기']),
    ('STA_UPLOAD_COMPLETED', 'Data State', '이미지/파일 업로드가 완료된 상태',
     '서버 전송용 데이터 업로드가 완료됨', 'data', ['업로드 완료', '업로드가 완료']),
    ('STA_MESSAGE_SEND_COMPLETED', 'Data State', '메시지/이미지 전송이 완료된 상태',
     '송신 말풍선이 정상 노출되고 실패 아이콘이 없음', 'data',
     ['전송 완료', '전송됨', '전송되었', '전송 성공']),
    ('STA_MESSAGE_SEND_FAILED', 'Data State', '메시지/이미지 전송에 실패한 상태',
     '송신 말풍선 좌측에 재시도/삭제 아이콘이 노출됨', 'data', ['전송 실패', '전송에 실패']),
    ('STA_MESSAGE_RECEIVED', 'Data State', '수신 계정이 메시지를 수신한 상태',
     '수신 대화방에 수신 말풍선이 노출됨', 'data', ['수신됨', '수신 완료', '수신되었', '메시지 수신']),
]

# 도착 화면 감지용 이동 동사
_TRANSITION_VERBS = ['이동', '전환', '진입', '랜딩', '복귀', '노출']

# Action 정규화 규칙 (구체 → 일반)
_ACTION_RULES = [
    (['더블 탭', '더블탭', '두 번 탭', '두번 탭'], 'DOUBLE_TAP'),
    (['롱프레스', '롱 프레스', '길게 누르', '길게 탭', '꾹 누르'], 'LONG_PRESS'),
    (['입력 후 전송'], 'INPUT'),
    (['입력', '작성'], 'INPUT'),
    (['지우', '삭제 입력', '내용 삭제', '클리어'], 'CLEAR'),
    (['스와이프', 'swipe'], 'SWIPE'),
    (['스크롤', 'scroll'], 'SCROLL'),
    (['드래그', 'drag'], 'DRAG'),
    (['선택'], 'SELECT'),
    (['뒤로', '백'], 'BACK'),
    (['대기', '기다', '재접속', '재실행'], 'WAIT'),
    (['진입', '입장', '열기', '오픈'], 'OPEN'),
    (['닫기', '종료'], 'CLOSE'),
    (['전환', '변경'], 'SWITCH'),
    (['탭', '터치', '클릭', '누르', '눌러', '선택'], 'TAP'),
    (['전송', '보내'], 'TAP'),
    (['확인', '노출', '표시', '체크'], 'VERIFY'),
]


# ══════════════════════════════════════════════════════════════════════════════
# 해석 헬퍼
# ══════════════════════════════════════════════════════════════════════════════

def resolve_screen(text, default=DEFAULT_SCREEN):
    """텍스트에서 화면을 판별. 매칭 없으면 default."""
    t = (text or '')
    for sid, _name, _crit, kws in SCREEN_CATALOG:
        if sid == DEFAULT_SCREEN:
            continue
        for kw in kws:
            if kw in t:
                return sid
    # default 화면 키워드도 확인 (없어도 default 반환)
    return default


def resolve_screen_strict(text):
    """default(SCR_CHATROOM) 를 제외하고 명시적으로 매칭된 화면만 반환. 없으면 None."""
    t = (text or '')
    for sid, _name, _crit, kws in SCREEN_CATALOG:
        if sid == DEFAULT_SCREEN:
            continue
        for kw in kws:
            if kw in t:
                return sid
    return None


def resolve_targets(text):
    """텍스트에서 매칭되는 Target ID 목록(등장 순서, 중복 제거)."""
    t = (text or '')
    found = []
    for tid, _name, _scr, _crit, kws in TARGET_CATALOG:
        for kw in kws:
            if kw in t:
                if tid not in found:
                    found.append(tid)
                break
    return found


def resolve_states(text, bucket=None):
    """텍스트에서 매칭되는 State ID 목록. bucket 지정 시 해당 bucket 만."""
    t = (text or '')
    found = []
    for sid, _typ, _defn, _crit, bkt, kws in STATE_CATALOG:
        if bucket and bkt != bucket:
            continue
        for kw in kws:
            if kw in t:
                if sid not in found:
                    found.append(sid)
                break
    return found


def normalize_action(text):
    """스텝 문장을 표준 Action Type 으로 정규화."""
    t = (text or '')
    for kws, act in _ACTION_RULES:
        for kw in kws:
            if kw in t:
                return act
    return 'VERIFY'


def split_numbered(text):
    """'1. ... 2. ...' 형태를 세그먼트 리스트로 분할. 없으면 [text]."""
    t = (text or '').strip()
    if not t:
        return []
    parts = re.split(r'(?:\n|^|\s)\d+[.)]\s+', t)
    parts = [p.strip() for p in parts if p and p.strip()]
    if len(parts) <= 1:
        return [t]
    return parts


def clean_text(s):
    """줄바꿈/제어문자 정리."""
    if not s:
        return ''
    s = s.replace('\x08', ' ').replace('_x0008_', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def detect_transition(expected_text, start_screen):
    """기대결과에서 화면 이동을 감지 → 도착 화면 ID (없으면 None)."""
    t = expected_text or ''
    for verb in _TRANSITION_VERBS:
        idx = t.find(verb)
        while idx != -1:
            window = t[max(0, idx - 25):idx]
            dest = resolve_screen_strict(window)
            if dest and dest != start_screen:
                return dest
            idx = t.find(verb, idx + 1)
    return None


def build_result_state(expected_seg, target_ids, result_screen, is_generated):
    """검증 가능한 자연어 result_state 생성. Dictionary ID를 가능하면 앞에 명시."""
    seg = clean_text(expected_seg)
    if is_generated or not seg:
        return f'{result_screen} 화면이 정상 노출되어야 함'
    return seg


# ══════════════════════════════════════════════════════════════════════════════
# 강화(enrichment) — LLM 의미 분석으로 추출한 사전조건/파라미터
# ══════════════════════════════════════════════════════════════════════════════

def load_enrichment():
    """build_enrichment.py 가 생성한 enrichment.json 을 로드(없으면 None)."""
    path = os.path.join(OUT_DIR, 'enrichment.json')
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:  # noqa: BLE001
        print(f'[warn] enrichment.json 로드 실패({e}) — 규칙 기반으로만 진행')
        return None


def load_refinement():
    """build_refinement.py 가 생성한 result_refinement.json 로드(없으면 None).
    { 'steps': { '<new_tc_id>|<step_no>': '재작성된 result_state' } }"""
    path = os.path.join(OUT_DIR, 'result_refinement.json')
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f).get('steps', {})
    except Exception as e:  # noqa: BLE001
        print(f'[warn] result_refinement.json 로드 실패({e}) — 원본 result_state 유지')
        return None


def load_split():
    """build_split.py 가 생성한 step_split.json 로드(없으면 None).
    { 'splits': { '<new_tc_id>|<orig_step_no>': [ {action, action_parameter, result_state}, ... ] } }"""
    path = os.path.join(OUT_DIR, 'step_split.json')
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f).get('splits', {})
    except Exception as e:  # noqa: BLE001
        print(f'[warn] step_split.json 로드 실패({e}) — 스텝 분리 생략')
        return None


def load_conditions():
    """build_conditions.py 가 생성한 condition_override.json 로드(없으면 None)."""
    path = os.path.join(OUT_DIR, 'condition_override.json')
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:  # noqa: BLE001
        print(f'[warn] condition_override.json 로드 실패({e}) — 조건 분리 생략')
        return None


def _merge_precondition(step, add_pcs, states_meta):
    """add_pcs(=[{bucket,state_key,...}]) 의 state_id 를 step 의 precondition 필드에 병합."""
    used = []
    field = {'data': 'precondition_data_state', 'ui': 'precondition_ui_state',
             'permission': 'precondition_permission_state'}
    for pc in add_pcs or []:
        meta = states_meta.get(pc['state_key'])
        if not meta:
            continue
        sid = meta['state_id']
        f = field.get(meta['bucket'], 'precondition_data_state')
        cur = step.get(f, NA)
        ids = [] if cur == NA else cur.split(' / ')
        if sid not in ids:
            ids.append(sid)
        step[f] = ' / '.join(ids)
        used.append(sid)
    return used


def apply_conditions(tc_steps, COND):
    """조건→precondition 분리 적용(annotate/split). TC별 step_no 재부여.
    반환: (새 tc_steps, {state_id: set(new_tc_id)})."""
    from collections import OrderedDict
    states_meta = COND.get('states', {})
    overrides = COND.get('steps', {})
    usage = {}

    by_tc = OrderedDict()
    for s in tc_steps:
        by_tc.setdefault(s['new_tc_id'], []).append(s)

    out = []
    for tcid, slist in by_tc.items():
        new_no = 0
        for s in slist:
            rec = overrides.get(f"{tcid}|{s['step_no']}")
            if not rec:
                new_no += 1
                ns = dict(s); ns['step_no'] = new_no
                out.append(ns)
                continue
            if rec['decision'] == 'annotate':
                new_no += 1
                ns = dict(s); ns['step_no'] = new_no
                for sid in _merge_precondition(ns, rec.get('add_preconditions'), states_meta):
                    usage.setdefault(sid, set()).add(tcid)
                if rec.get('result_state', '').strip():
                    ns['result_state'] = rec['result_state'].strip()
                out.append(ns)
            elif rec['decision'] == 'split':
                for case in rec['cases']:
                    new_no += 1
                    ns = dict(s); ns['step_no'] = new_no
                    for sid in _merge_precondition(ns, case.get('add_preconditions'), states_meta):
                        usage.setdefault(sid, set()).add(tcid)
                    ns['action'] = case.get('action', ns['action'])
                    ap = case.get('action_parameter')
                    if ap in (None, '', NA):
                        pass  # 원 스텝 action_parameter 유지
                    elif isinstance(ap, str):
                        ns['action_parameter'] = ap
                    else:
                        ns['action_parameter'] = json.dumps(ap, ensure_ascii=False)
                    rs = (case.get('result_state') or '').strip()
                    if rs:
                        ns['result_state'] = rs
                    out.append(ns)
            else:
                new_no += 1
                ns = dict(s); ns['step_no'] = new_no
                out.append(ns)
    return out, usage


def expand_splits(tc_steps, SPLIT):
    """액션/시나리오 분리 대상 스텝을 하위 스텝으로 확장하고 TC별 step_no 재부여.
    하위 스텝은 원 스텝의 화면/타깃/사전조건을 상속하되 action/action_parameter/result_state 를 교체.
    사전조건은 분리 그룹의 첫 하위 스텝에만 유지(나머지는 해당없음)."""
    from collections import OrderedDict
    by_tc = OrderedDict()
    for s in tc_steps:
        by_tc.setdefault(s['new_tc_id'], []).append(s)

    out = []
    for tcid, slist in by_tc.items():
        new_no = 0
        for s in slist:
            subs = SPLIT.get(f"{tcid}|{s['step_no']}")
            if not subs:
                new_no += 1
                ns = dict(s)
                ns['step_no'] = new_no
                out.append(ns)
                continue
            for i, sub in enumerate(subs):
                new_no += 1
                ns = dict(s)
                ns['step_no'] = new_no
                ns['action'] = sub['action']
                ap = sub.get('action_parameter')
                if ap in (None, '', NA):
                    ns['action_parameter'] = NA
                elif isinstance(ap, str):
                    ns['action_parameter'] = ap
                else:
                    ns['action_parameter'] = json.dumps(ap, ensure_ascii=False)
                ns['result_state'] = sub['result_state'].strip()
                if i > 0:  # 사전조건은 첫 하위 스텝에만
                    ns['precondition_data_state'] = NA
                    ns['precondition_ui_state'] = NA
                    ns['precondition_permission_state'] = NA
                out.append(ns)
    return out


# ══════════════════════════════════════════════════════════════════════════════
# 변환 본체
# ══════════════════════════════════════════════════════════════════════════════

def convert():
    input_name = ARGS.input
    input_path = input_name if os.path.isabs(input_name) else os.path.join(BASE_DIR, 'input', input_name)
    if not os.path.exists(input_path):
        print(f'[error] 입력 파일 없음: {input_path}')
        sys.exit(1)

    print(f'[1/8] Excel 로드: {input_path}')
    wb = openpyxl.load_workbook(input_path, read_only=True, data_only=True)
    if SHEET_NAME not in wb.sheetnames:
        print(f'[error] 시트 없음: {SHEET_NAME}')
        sys.exit(1)

    rows, excl, first_row, last_row = load_sheet(wb, SHEET_NAME)
    print(f'[2/8] 시트 로드 완료 — 후보 {len(rows)}행, Excel 범위 {first_row}~{last_row}')

    ENRICHMENT = load_enrichment()
    if ENRICHMENT:
        print(f'[2.5/8] 강화 데이터 로드 — TC {len(ENRICHMENT["tcs"])} / '
              f'State 종류 {len(ENRICHMENT["states"])}')
    else:
        print('[2.5/8] 강화 데이터 없음 — 규칙 기반 사전조건만 사용')

    REFINEMENT = load_refinement()
    if REFINEMENT:
        print(f'[2.6/8] result_state 재작성 데이터 로드 — {len(REFINEMENT)} 스텝')

    SPLIT = load_split()
    if SPLIT:
        print(f'[2.7/8] 스텝 분리 데이터 로드 — {len(SPLIT)} 스텝 분리 대상')

    CONDITIONS = load_conditions()
    if CONDITIONS:
        print(f'[2.8/8] 조건 분리 데이터 로드 — {len(CONDITIONS.get("steps", {}))} 스텝 / '
              f'신규 State {len(CONDITIONS.get("states", {}))}')

    # ── 원본 TC 수집 (Excel 행번호 부여) ─────────────────────────────────────
    # load_sheet 는 header 다음 행부터 반환. Excel 행번호 = first_row + index
    source_tcs = []
    seq = 0
    for i, r in enumerate(rows):
        if not is_tc_row(r):
            continue
        seq += 1
        excel_row = first_row + i
        source_tcs.append({
            'seq': seq,
            'row': excel_row,
            'src_id': f'CHAT_{seq:03d}',
            'cat1': clean_text(cell(r, COL_CAT1)),
            'cat2': clean_text(cell(r, COL_CAT2)),
            'cat3': clean_text(cell(r, COL_CAT3)),
            'cat4': clean_text(cell(r, COL_CAT4)),
            'precond': clean_text(cell(r, COL_PRECOND)),
            'step': clean_text(cell(r, COL_STEP)),
            'expected': clean_text(cell(r, COL_EXPECTED)),
            'priority': normalize_priority(cell(r, COL_PRIORITY)),
            'os': normalize_os(cell(r, COL_OS)),
            '_raw_precond': cell(r, COL_PRECOND),
            '_raw_step': cell(r, COL_STEP),
            '_raw_expected': cell(r, COL_EXPECTED),
        })
    print(f'[3/8] 원본 TC 추출 완료 — {len(source_tcs)}건')

    # ── 신규 TC / Step 변환 ───────────────────────────────────────────────────
    tc_master = []
    tc_steps = []
    mapping = []      # source_row -> new_tc_ids
    tc_counter = 0

    # 사전 사용 집계
    screen_rows = {}      # sid -> set(row)
    screen_use_tc = {}    # sid -> set(new_tc_id)
    target_rows = {}
    target_use_tc = {}
    state_rows = {}
    state_use_tc = {}
    transitions = {}      # (start,dest,action,target) -> {rows:set, desc}

    for src in source_tcs:
        tc_counter += 1
        new_tc_id = f'CHAT_NEW_{tc_counter:04d}'

        cat_path = ' > '.join([c for c in [src['cat1'], src['cat2'], src['cat3'], src['cat4']] if c])
        full_text = ' '.join([src['precond'], src['step'], src['expected'], cat_path])

        start_screen = resolve_screen(' '.join([src['cat1'], src['cat2'], src['step']]))

        # 스텝 분할
        step_segs = split_numbered(src['step'])
        if not step_segs:
            # step 이 비면 카테고리 기반 단일 검증 스텝
            step_segs = [src['cat4'] or src['cat3'] or src['cat2'] or 'UI 확인']

        exp_segs = split_numbered(src['expected'])
        aligned = (len(step_segs) > 1 and len(exp_segs) == len(step_segs)
                   and '[' not in src['expected'])

        conversion_type = 'SPLIT' if len(step_segs) > 1 else 'ONE_TO_ONE'
        conversion_note = (
            '원본 수행 절차를 Step 단위로 세분화' if conversion_type == 'SPLIT'
            else '원본 TC를 1:1로 구조화 변환'
        )

        # ── 사전조건/파라미터: 강화(enrichment) 우선, 없으면 규칙 기반 fallback ──
        enr = ENRICHMENT['tcs'].get(new_tc_id) if ENRICHMENT else None

        # 규칙 기반 fallback (강화 자체가 없는 TC 에서만 첫 스텝에 사용)
        rule_data = resolve_states(src['precond'] + ' ' + full_text, 'data')
        rule_ui = resolve_states(src['precond'] + ' ' + full_text, 'ui')
        rule_perm = resolve_states(src['precond'] + ' ' + full_text, 'permission')

        # 강화 사전조건/파라미터를 step_no 별로 정리
        enr_pre = {}    # step_no -> {'data':[state_id...], 'ui':[...], 'permission':[...]}
        enr_param = {}  # step_no -> {'target_parameter':str, 'action_parameter':str}
        if enr:
            for pc in enr['preconditions']:
                d = enr_pre.setdefault(pc['step_no'], {'data': [], 'ui': [], 'permission': []})
                sid = pc['state_id']
                if sid not in d[pc['bucket']]:
                    d[pc['bucket']].append(sid)
            for pr in enr['parameters']:
                val = pr.get('value')
                if val is None or (isinstance(val, str) and not val.strip()):
                    continue
                d = enr_param.setdefault(pr['step_no'], {})
                d[pr['field']] = val if isinstance(val, str) else json.dumps(val, ensure_ascii=False)

        cur_screen = start_screen
        used_targets_tc = set()
        used_states_tc = set()
        used_screens_tc = {start_screen}
        generated_flag = False

        for si, seg in enumerate(step_segs):
            step_no = si + 1
            action = normalize_action(seg)
            tgts = resolve_targets(seg)
            target_id = tgts[0] if tgts else NA

            # 기대결과 세그먼트
            if aligned:
                exp_seg = exp_segs[si]
            elif si == len(step_segs) - 1:
                exp_seg = src['expected']
            else:
                exp_seg = ''

            result_screen = detect_transition(exp_seg or src['expected'], cur_screen) or cur_screen
            is_generated = not clean_text(exp_seg)
            if is_generated:
                generated_flag = True
            result_state = build_result_state(exp_seg, tgts, result_screen, is_generated)
            # 재작성(refinement) 우선 적용 — 결론적 검증문으로 다듬은 값이 있으면 교체
            if REFINEMENT:
                refined = REFINEMENT.get(f'{new_tc_id}|{step_no}')
                if refined and refined.strip():
                    result_state = refined.strip()

            # action_parameter (규칙 기반 기본값)
            action_param = NA
            if action == 'INPUT':
                m = re.search(r"['\"“”\[]([^'\"“”\]]{1,30})['\"“”\]]", seg)
                if m:
                    action_param = json.dumps({'value': m.group(1)}, ensure_ascii=False)
            elif action == 'WAIT':
                action_param = json.dumps({'timeout': '30s'}, ensure_ascii=False)

            # precondition 부여: 강화 우선 → (강화 없는 TC 한정) 첫 스텝 규칙 fallback
            step_pre = enr_pre.get(step_no)
            if step_pre is not None:
                d_ids, u_ids, p_ids = step_pre['data'], step_pre['ui'], step_pre['permission']
            elif step_no == 1 and not enr:
                d_ids, u_ids, p_ids = rule_data, rule_ui, rule_perm
            else:
                d_ids = u_ids = p_ids = []
            p_data = ' / '.join(d_ids) if d_ids else NA
            p_ui = ' / '.join(u_ids) if u_ids else NA
            p_perm = ' / '.join(p_ids) if p_ids else NA
            used_states_tc.update(d_ids)
            used_states_tc.update(u_ids)
            used_states_tc.update(p_ids)

            # target/action parameter: 강화 우선
            step_param = enr_param.get(step_no, {})
            target_param = step_param.get('target_parameter', NA)
            if step_param.get('action_parameter'):
                action_param = step_param['action_parameter']

            tc_steps.append({
                'new_tc_id': new_tc_id,
                'step_no': step_no,
                'start_screen': cur_screen,
                'precondition_data_state': p_data,
                'precondition_ui_state': p_ui,
                'precondition_permission_state': p_perm,
                'target': target_id,
                'target_parameter': target_param,
                'action': action,
                'action_parameter': action_param,
                'result_screen': result_screen,
                'result_state': result_state,
            })

            # 집계
            for s in (cur_screen, result_screen):
                screen_rows.setdefault(s, set()).add(src['row'])
                screen_use_tc.setdefault(s, set()).add(new_tc_id)
                used_screens_tc.add(s)
            if target_id != NA:
                target_rows.setdefault(target_id, set()).add(src['row'])
                target_use_tc.setdefault(target_id, set()).add(new_tc_id)
                used_targets_tc.add(target_id)

            # transition 등록
            if result_screen != cur_screen:
                key = (cur_screen, result_screen, action, target_id)
                tr = transitions.setdefault(key, {'rows': set()})
                tr['rows'].add(src['row'])

            cur_screen = result_screen

        # state 집계 (precondition 사용)
        for sid in used_states_tc:
            state_rows.setdefault(sid, set()).add(src['row'])
            state_use_tc.setdefault(sid, set()).add(new_tc_id)

        # 자동화 준비 상태
        readiness, reason = assess_readiness(full_text, src['expected'], generated_flag)

        # TC 속성
        attrs = classify_attributes(src['precond'], src['step'], src['expected'])
        attr_labels = [ATTR_LABEL_KO[k] for k in ATTR_LABEL_KO if attrs.get(k)]
        if attrs.get('automation_candidate'):
            attr_labels.append('자동화후보')
        if attrs.get('manual_required'):
            attr_labels.append('수동확인필요')

        title = clean_text((cat_path + ' - ' + (step_segs[0][:30] if step_segs else '')).strip(' -')) or cat_path or new_tc_id
        purpose = clean_text(src['expected'][:80]) or (cat_path + ' 검증') or '검증'

        tc_master.append({
            'new_tc_id': new_tc_id,
            'title': title,
            'purpose': purpose,
            'source_sheet': SHEET_NAME,
            'source_row_numbers': [src['row']],
            'source_tc_ids': [src['src_id']],
            'conversion_type': conversion_type,
            'conversion_note': conversion_note,
            'priority': src['priority'],
            'os': src['os'],
            'tc_attributes': attr_labels,
            'automation_readiness': readiness,
            'review_reason': reason,
            '_min_row': src['row'],
        })

        mapping.append({
            'source_row_number': src['row'],
            'source_tc_id': src['src_id'],
            'mapped_new_tc_ids': [new_tc_id],
            'conversion_type': conversion_type,
            'status': 'mapped',
            'reason': '',
        })

    # 액션/시나리오 스텝 분리 확장 (있을 때만)
    if SPLIT:
        before = len(tc_steps)
        tc_steps = expand_splits(tc_steps, SPLIT)
        split_delta = len(tc_steps) - before
    else:
        split_delta = 0

    # 조건→precondition 분리 적용 (annotate/split)
    cond_delta = 0
    if CONDITIONS:
        before = len(tc_steps)
        tc_steps, cond_usage = apply_conditions(tc_steps, CONDITIONS)
        cond_delta = len(tc_steps) - before
        # 조건 State 사용 집계 (state_dict 등록용)
        tc_row = {t['new_tc_id']: t['_min_row'] for t in tc_master}
        for sid, tcids in cond_usage.items():
            for tcid in tcids:
                state_rows.setdefault(sid, set()).add(tc_row.get(tcid, 0))
                state_use_tc.setdefault(sid, set()).add(tcid)

    print(f'[4/8] 신규 TC 변환 완료 — {len(tc_master)} TC / {len(tc_steps)} Step '
          f'(스텝 분리 +{split_delta} / 조건 분리 +{cond_delta})')

    # 기본 정렬: 최소 원본행 → new_tc_id
    tc_master.sort(key=lambda t: (t['_min_row'], t['new_tc_id']))

    # ── 사전 최종 구성 (실제 등장 항목만) ─────────────────────────────────────
    screen_dict = []
    for sid, name, crit, _kws in SCREEN_CATALOG:
        if sid in screen_rows:
            screen_dict.append({
                'screen_id': sid, 'name': name, 'criteria': crit,
                'source_rows': sorted(screen_rows[sid]),
                'used_tc_count': len(screen_use_tc.get(sid, set())),
            })

    target_dict = []
    for tid, name, scr, crit, _kws in TARGET_CATALOG:
        if tid in target_rows:
            target_dict.append({
                'target_id': tid, 'name': name, 'screen_id': scr, 'criteria': crit,
                'source_rows': sorted(target_rows[tid]),
                'used_tc_count': len(target_use_tc.get(tid, set())),
            })

    state_dict = []
    catalog_state_ids = set()
    for sid, typ, defn, crit, _bkt, _kws in STATE_CATALOG:
        catalog_state_ids.add(sid)
        if sid in state_rows:
            state_dict.append({
                'state_id': sid, 'state_type': typ, 'definition': defn, 'criteria': crit,
                'source_rows': sorted(state_rows[sid]),
                'used_tc_count': len(state_use_tc.get(sid, set())),
            })

    # 강화(enrichment)/조건분리로 도입된 State 도 사전에 등록 (카탈로그 중복 제외)
    if ENRICHMENT or CONDITIONS:
        BKT_TYPE = {'data': 'Data State', 'ui': 'UI State', 'permission': 'Permission State'}
        id_meta = {}
        if ENRICHMENT:
            id_meta.update({m['state_id']: m for m in ENRICHMENT['states'].values()})
        if CONDITIONS:  # 조건분리 State 가 우선(OS 등 신규 정의)
            id_meta.update({m['state_id']: m for m in CONDITIONS['states'].values()})
        for sid in sorted(state_rows):
            if sid in catalog_state_ids:
                continue
            meta = id_meta.get(sid)
            if not meta:
                continue
            crit = ('[검토 필요] ' if meta.get('review') else '') + meta['label']
            state_dict.append({
                'state_id': sid,
                'state_type': BKT_TYPE.get(meta['bucket'], 'Data State'),
                'definition': meta['label'],
                'criteria': crit,
                'source_rows': sorted(state_rows[sid]),
                'used_tc_count': len(state_use_tc.get(sid, set())),
            })

    trans_dict = []
    tr_counter = 0
    for (start, dest, action, target), info in sorted(transitions.items()):
        tr_counter += 1
        s_name = next((n for i, n, c, k in SCREEN_CATALOG if i == start), start)
        d_name = next((n for i, n, c, k in SCREEN_CATALOG if i == dest), dest)
        trans_dict.append({
            'transition_id': f'TR_{start.replace("SCR_", "")}_TO_{dest.replace("SCR_", "")}',
            'start_screen': start,
            'action': action,
            'target_id': target,
            'dest_screen': dest,
            'description': f'{s_name}에서 {d_name}(으)로 이동',
            'source_rows': sorted(info['rows']),
        })
    # transition_id 중복 제거(동일 start/dest 통합)
    trans_merged = {}
    for tr in trans_dict:
        k = tr['transition_id']
        if k in trans_merged:
            trans_merged[k]['source_rows'] = sorted(set(trans_merged[k]['source_rows']) | set(tr['source_rows']))
        else:
            trans_merged[k] = tr
    trans_dict = list(trans_merged.values())

    print(f'[5/8] 사전 구성 — Screen {len(screen_dict)} / Target {len(target_dict)} / '
          f'State {len(state_dict)} / Transition {len(trans_dict)}')

    # ── 분포 통계 (유지 항목 재계산: 5.일반채팅 기준) ─────────────────────────
    dist = build_distributions(tc_master)

    # ── 품질 검증 ─────────────────────────────────────────────────────────────
    validation = run_validations(
        source_tcs, tc_master, tc_steps, mapping,
        screen_dict, target_dict, state_dict, first_row, last_row,
    )
    print(f'[6/8] 품질 검증 완료 — {sum(1 for v in validation if v["pass"])}/{len(validation)} 통과')

    # ── summary ───────────────────────────────────────────────────────────────
    mapped = sum(1 for m in mapping if m['status'] == 'mapped')
    unmapped = sum(1 for m in mapping if m['status'] != 'mapped')
    summary = {
        'source_sheet': SHEET_NAME,
        'source_tc_count': len(source_tcs),
        'converted_tc_count': len(tc_master),
        'converted_step_count': len(tc_steps),
        'screen_dictionary_count': len(screen_dict),
        'target_dictionary_count': len(target_dict),
        'state_dictionary_count': len(state_dict),
        'transition_dictionary_count': len(trans_dict),
        'mapped_source_tc_count': mapped,
        'unmapped_source_tc_count': unmapped,
        'split_source_tc_count': sum(1 for t in tc_master if t['conversion_type'] == 'SPLIT'),
        'merged_source_tc_count': sum(1 for t in tc_master if t['conversion_type'] == 'MERGED'),
        'automation_ready_count': sum(1 for t in tc_master if t['automation_readiness'] == 'READY'),
        'review_required_count': sum(1 for t in tc_master if t['automation_readiness'] == 'REVIEW_REQUIRED'),
        'manual_only_count': sum(1 for t in tc_master if t['automation_readiness'] == 'MANUAL_ONLY'),
        'validation_passed': sum(1 for v in validation if v['pass']),
        'validation_total': len(validation),
        'status': 'success' if unmapped == 0 and all(v['pass'] for v in validation) else 'warning',
        'first_source_row': first_row,
        'last_source_row': last_row,
    }

    unmapped_list = [m for m in mapping if m['status'] != 'mapped']

    # ── 파일 출력 ─────────────────────────────────────────────────────────────
    write_outputs(screen_dict, target_dict, state_dict, trans_dict,
                  tc_master, tc_steps, mapping, summary, validation,
                  unmapped_list, dist)
    print(f'[7/8] 결과 파일 저장 완료 → {OUT_DIR}')
    print(f'[8/8] status={summary["status"]} | unmapped={unmapped} | '
          f'READY={summary["automation_ready_count"]} '
          f'REVIEW={summary["review_required_count"]} '
          f'MANUAL={summary["manual_only_count"]}')
    print('CONVERSION_DONE')


def assess_readiness(full_text, expected, generated_flag):
    """자동화 준비 상태 판정."""
    if any(kw in full_text for kw in _MANUAL_SIGNALS):
        return 'MANUAL_ONLY', '시각/음성/카메라 등 사람의 직접 확인이 필요한 표현이 포함됨'
    vague = [kw for kw in _AUTO_VAGUE if kw in full_text]
    has_clear = any(kw in expected for kw in _AUTO_CLEAR)
    if vague:
        return 'REVIEW_REQUIRED', f"판정 기준이 불명확한 표현 포함: {', '.join(vague)}"
    if generated_flag:
        return 'REVIEW_REQUIRED', '일부 Step의 기대결과가 원본에 명시되지 않아 화면 노출 기준으로 보완됨'
    if not has_clear:
        return 'REVIEW_REQUIRED', '기대결과에 결론적 검증 표현(…됨/…되어야 함)이 부족하여 검토 필요'
    return 'READY', ''


def build_distributions(tc_master):
    pri = {}
    os_ = {}
    attr = {}
    for t in tc_master:
        pri[t['priority']] = pri.get(t['priority'], 0) + 1
        os_[t['os']] = os_.get(t['os'], 0) + 1
        for a in t['tc_attributes']:
            attr[a] = attr.get(a, 0) + 1
    return {
        'service': {SHEET_NAME: len(tc_master)},
        'priority': pri,
        'os': os_,
        'attributes': attr,
    }


# ══════════════════════════════════════════════════════════════════════════════
# 품질 검증 (섹션 15)
# ══════════════════════════════════════════════════════════════════════════════

def run_validations(source_tcs, tc_master, tc_steps, mapping,
                    screen_dict, target_dict, state_dict, first_row, last_row):
    checks = []

    def add(name, ok, detail=''):
        checks.append({'name': name, 'pass': bool(ok), 'detail': detail})

    scr_ids = {s['screen_id'] for s in screen_dict}
    tgt_ids = {t['target_id'] for t in target_dict}
    sta_ids = {s['state_id'] for s in state_dict}
    tgt_scr = {t['target_id']: t['screen_id'] for t in target_dict}

    # 1. 다른 시트 미포함
    add('1. 5.일반채팅 외 시트 미포함',
        all(t['source_sheet'] == SHEET_NAME for t in tc_master))

    # 2. 필수 항목 공란 아님
    req = ['start_screen', 'precondition_data_state', 'precondition_ui_state',
           'precondition_permission_state', 'target', 'target_parameter',
           'action', 'action_parameter', 'result_screen', 'result_state']
    blanks = [s['new_tc_id'] for s in tc_steps if any(not str(s.get(f, '')).strip() for f in req)]
    add('2. 모든 Step 필수 항목 비공란', not blanks,
        f'{len(blanks)}개 위반' if blanks else '')

    # 3. 값 없음은 해당없음 (공란/None 없음)
    bad = [s['new_tc_id'] for s in tc_steps for f in req
           if str(s.get(f, '')).strip().lower() in ('', 'none', 'nan', 'null')]
    add('3. 빈 값은 해당없음 처리', not bad, f'{len(bad)}건' if bad else '')

    # 4. 모든 start/result_screen 이 Screen Dictionary 에 존재
    miss_scr = {s.get(k) for s in tc_steps for k in ('start_screen', 'result_screen')
                if s.get(k) not in scr_ids}
    add('4. 모든 Screen ID 사전 등록', not miss_scr, ', '.join(sorted(miss_scr)))

    # 5. 모든 target(≠해당없음)이 Target Dictionary 에 존재
    miss_tgt = {s['target'] for s in tc_steps if s['target'] != NA and s['target'] not in tgt_ids}
    add('5. 모든 Target ID 사전 등록', not miss_tgt, ', '.join(sorted(miss_tgt)))

    # 6. Target 의 Screen ID 가 Screen Dictionary 에 존재
    miss_tscr = {v for v in tgt_scr.values() if v not in scr_ids}
    add('6. Target의 Screen ID 사전 존재', not miss_tscr, ', '.join(sorted(miss_tscr)))

    # 7. precondition State ID 가 State Dictionary 에 존재
    miss_sta = set()
    for s in tc_steps:
        for f in ('precondition_data_state', 'precondition_ui_state', 'precondition_permission_state'):
            v = s.get(f, NA)
            if v and v != NA:
                for sid in v.split(' / '):
                    if sid not in sta_ids:
                        miss_sta.add(sid)
    add('7. 모든 State ID 사전 등록', not miss_sta, ', '.join(sorted(miss_sta)))

    # 8. 모든 원본 TC 가 최소 하나의 신규 TC 와 연결
    unmapped = [m['source_row_number'] for m in mapping if m['status'] != 'mapped']
    add('8. 모든 원본 TC 연결 (unmapped=0)', not unmapped,
        f'{len(unmapped)}건 미연결' if unmapped else '')

    # 9. source_row_numbers 가 실제 범위 내
    valid_rows = {s['row'] for s in source_tcs}
    bad_rows = [t['new_tc_id'] for t in tc_master
                if any(r not in valid_rows for r in t['source_row_numbers'])]
    add('9. source_row_numbers 원본 일치', not bad_rows, f'{len(bad_rows)}건' if bad_rows else '')

    # 10. new_tc_id 중복 없음
    ids = [t['new_tc_id'] for t in tc_master]
    add('10. new_tc_id 유일성', len(ids) == len(set(ids)))

    # 11. step_no 1부터 순차
    by_tc = {}
    for s in tc_steps:
        by_tc.setdefault(s['new_tc_id'], []).append(s['step_no'])
    bad_seq = [tid for tid, nos in by_tc.items()
               if sorted(nos) != list(range(1, len(nos) + 1))]
    add('11. step_no 1부터 순차', not bad_seq, f'{len(bad_seq)}건' if bad_seq else '')

    # 12. result_screen ↔ 다음 start_screen 연결 일치
    bad_chain = 0
    for tid, _ in by_tc.items():
        steps = sorted([s for s in tc_steps if s['new_tc_id'] == tid], key=lambda x: x['step_no'])
        for a, b in zip(steps, steps[1:]):
            if a['result_screen'] != b['start_screen']:
                bad_chain += 1
    add('12. result_screen↔next start_screen 연결', bad_chain == 0,
        f'{bad_chain}건 불일치' if bad_chain else '')

    # 13. Dictionary prefix 규칙
    ok_prefix = (all(s['screen_id'].startswith('SCR_') for s in screen_dict)
                 and all(t['target_id'].startswith('TGT_') for t in target_dict)
                 and all(s['state_id'].startswith('STA_') for s in state_dict))
    add('13. Dictionary prefix 규칙 준수', ok_prefix)

    # 14. result_state 검증 가능 (모호 표현 단독 아님)
    vague_only = re.compile(r'^(정상|적절|문제없|이상\s*없)')
    bad_rs = [s['new_tc_id'] for s in tc_steps
              if vague_only.match(s['result_state'].strip()) and len(s['result_state']) < 12]
    add('14. result_state 검증 가능성', not bad_rs, f'{len(bad_rs)}건 모호' if bad_rs else '')

    # 15. 최종표에 공란/null/undefined/NaN 없음
    all_vals = []
    for t in tc_master:
        all_vals += [str(v) for v in t.values()]
    for s in tc_steps:
        all_vals += [str(v) for v in s.values()]
    bad_final = [v for v in all_vals if v.strip().lower() in ('none', 'nan', 'undefined', 'null')]
    add('15. 공란/null/NaN 미표시', not bad_final, f'{len(bad_final)}건' if bad_final else '')

    return checks


# ══════════════════════════════════════════════════════════════════════════════
# 파일 출력
# ══════════════════════════════════════════════════════════════════════════════

def _w(path, header, rows):
    with open(path, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(header)
        for r in rows:
            w.writerow(r)


def write_outputs(screen_dict, target_dict, state_dict, trans_dict,
                  tc_master, tc_steps, mapping, summary, validation,
                  unmapped_list, dist):
    os.makedirs(OUT_DIR, exist_ok=True)

    _w(os.path.join(OUT_DIR, 'screen_dictionary.csv'),
       ['Screen ID', '화면명', '식별 기준', '출처 원본 행번호', '사용 TC 수'],
       [[s['screen_id'], s['name'], s['criteria'],
         ' '.join(map(str, s['source_rows'])), s['used_tc_count']] for s in screen_dict])

    _w(os.path.join(OUT_DIR, 'target_dictionary.csv'),
       ['Target ID', '대상명', 'Screen ID', '식별 기준', '출처 원본 행번호', '사용 TC 수'],
       [[t['target_id'], t['name'], t['screen_id'], t['criteria'],
         ' '.join(map(str, t['source_rows'])), t['used_tc_count']] for t in target_dict])

    _w(os.path.join(OUT_DIR, 'state_dictionary.csv'),
       ['State ID', 'State Type', '정의', '판정 기준', '출처 원본 행번호', '사용 TC 수'],
       [[s['state_id'], s['state_type'], s['definition'], s['criteria'],
         ' '.join(map(str, s['source_rows'])), s['used_tc_count']] for s in state_dict])

    _w(os.path.join(OUT_DIR, 'transition_dictionary.csv'),
       ['Transition ID', '시작 화면', 'Action', 'Target ID', '도착 화면', '설명', '출처 원본 행번호'],
       [[t['transition_id'], t['start_screen'], t['action'], t['target_id'],
         t['dest_screen'], t['description'], ' '.join(map(str, t['source_rows']))] for t in trans_dict])

    _w(os.path.join(OUT_DIR, 'converted_tc_master.csv'),
       ['new_tc_id', 'title', 'purpose', 'source_sheet', 'source_row_numbers',
        'source_tc_ids', 'conversion_type', 'conversion_note', 'priority', 'os',
        'tc_attributes', 'automation_readiness', 'review_reason'],
       [[t['new_tc_id'], t['title'], t['purpose'], t['source_sheet'],
         ' '.join(map(str, t['source_row_numbers'])), ' '.join(t['source_tc_ids']),
         t['conversion_type'], t['conversion_note'], t['priority'], t['os'],
         ', '.join(t['tc_attributes']), t['automation_readiness'], t['review_reason']]
        for t in tc_master])

    _w(os.path.join(OUT_DIR, 'converted_tc_steps.csv'),
       ['new_tc_id', 'step_no', 'start_screen', 'precondition_data_state',
        'precondition_ui_state', 'precondition_permission_state', 'target',
        'target_parameter', 'action', 'action_parameter', 'result_screen', 'result_state'],
       [[s['new_tc_id'], s['step_no'], s['start_screen'], s['precondition_data_state'],
         s['precondition_ui_state'], s['precondition_permission_state'], s['target'],
         s['target_parameter'], s['action'], s['action_parameter'],
         s['result_screen'], s['result_state']] for s in tc_steps])

    _w(os.path.join(OUT_DIR, 'source_tc_mapping.csv'),
       ['source_row_number', 'source_tc_id', 'mapped_new_tc_ids', 'conversion_type', 'status', 'reason'],
       [[m['source_row_number'], m['source_tc_id'], ' '.join(m['mapped_new_tc_ids']),
         m['conversion_type'], m['status'], m['reason']] for m in mapping])

    with open(os.path.join(OUT_DIR, 'conversion_summary.json'), 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    # 대시보드용 통합 JSON (steps 를 TC 하위로 중첩)
    steps_by_tc = {}
    for s in tc_steps:
        steps_by_tc.setdefault(s['new_tc_id'], []).append(s)
    tcs_nested = []
    for t in tc_master:
        nt = dict(t)
        nt.pop('_min_row', None)
        nt['steps'] = sorted(steps_by_tc.get(t['new_tc_id'], []), key=lambda x: x['step_no'])
        tcs_nested.append(nt)

    payload = {
        'summary': summary,
        'distributions': dist,
        'validation': validation,
        'unmapped': unmapped_list,
        'screens': screen_dict,
        'targets': target_dict,
        'states': state_dict,
        'transitions': trans_dict,
        'tcs': tcs_nested,
    }
    with open(os.path.join(OUT_DIR, 'conversion.json'), 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False)

    # 정적 배포(GitHub Pages 등)용 — 대시보드가 상대경로로 직접 로드
    dashboard_json = os.path.join(BASE_DIR, 'dashboard', 'conversion.json')
    with open(dashboard_json, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False)


# ══════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', default='Regression TestCase.xlsx', help='input/ 내 파일명 또는 절대경로')
    ap.add_argument('--name', default='', help='(호환용, 미사용)')
    ARGS = ap.parse_args()
    convert()
