#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_worklist.py — '5.일반채팅' 원본 TC를 LLM 사전조건/파라미터 강화용
워크리스트(_enrich_input.json)로 추출한다.

convert_chat.py 와 동일한 TC 순회 순서 · 스텝 분할(split_numbered)을 사용하므로
여기서 부여하는 new_tc_id / step_no 는 변환 결과와 1:1로 일치한다.

출력: output/chat_conversion/_enrich_input.json
  { "count": N, "tcs": [ {seq,row,new_tc_id,cat_path,cat4,precond,steps:[{step_no,text}],expected}, ... ] }
"""
import os, sys, json
import openpyxl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'tools'))

from analyzer import (
    load_sheet, is_tc_row, cell,
    COL_CAT1, COL_CAT2, COL_CAT3, COL_CAT4, COL_PRECOND, COL_STEP, COL_EXPECTED,
)
from convert_chat import clean_text, split_numbered

SHEET_NAME = '5.일반채팅'
OUT = os.path.join(BASE_DIR, 'output', 'chat_conversion', '_enrich_input.json')


def main():
    input_path = os.path.join(BASE_DIR, 'input', 'Regression TestCase.xlsx')
    wb = openpyxl.load_workbook(input_path, read_only=True, data_only=True)
    rows, excl, first_row, last_row = load_sheet(wb, SHEET_NAME)

    out = []
    seq = 0
    for i, r in enumerate(rows):
        if not is_tc_row(r):
            continue
        seq += 1
        excel_row = first_row + i
        cat1 = clean_text(cell(r, COL_CAT1))
        cat2 = clean_text(cell(r, COL_CAT2))
        cat3 = clean_text(cell(r, COL_CAT3))
        cat4 = clean_text(cell(r, COL_CAT4))
        precond = clean_text(cell(r, COL_PRECOND))
        step = clean_text(cell(r, COL_STEP))
        expected = clean_text(cell(r, COL_EXPECTED))

        cat_path = ' > '.join([c for c in [cat1, cat2, cat3, cat4] if c])
        segs = split_numbered(step)
        if not segs:
            segs = [cat4 or cat3 or cat2 or 'UI 확인']
        steps = [{'step_no': si + 1, 'text': s} for si, s in enumerate(segs)]

        out.append({
            'seq': seq,
            'row': excel_row,
            'new_tc_id': f'CHAT_NEW_{seq:04d}',
            'cat_path': cat_path,
            'cat4': cat4,
            'precond': precond,
            'steps': steps,
            'expected': expected,
        })

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'count': len(out), 'tcs': out}, f, ensure_ascii=False, indent=2)
    print(f'[extract_worklist] {len(out)} TC → {OUT}')


if __name__ == '__main__':
    main()
