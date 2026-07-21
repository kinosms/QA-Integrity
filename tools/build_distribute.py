#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_distribute.py — 스텝 간 중복 해소(분배) 결과(distribute_batches/out/batch_*.json)를
기존 result_refinement.json 의 해당 스텝 항목에 덮어써서 갱신한다.

분배값도 result_state override 이므로 별도 파일 없이 result_refinement.json 을 그대로 재사용한다.
(convert_chat.py 는 result_refinement.json 만 소비하므로 추가 코드 불필요.)
"""
import os, sys, json, glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
REFINE = os.path.join(OUT_DIR, 'result_refinement.json')
BATCH_OUT = os.environ.get(
    'DISTRIBUTE_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/distribute_batches/out',
)


def main():
    if not os.path.exists(REFINE):
        print(f'[error] result_refinement.json 없음: {REFINE}')
        sys.exit(1)
    ref = json.load(open(REFINE, encoding='utf-8'))
    steps = ref.get('steps', {})

    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'batch_*.json')))
    if not files:
        print(f'[error] 분배 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    updated = 0; empty = 0; tcs = 0
    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        for tc in data.get('results', []):
            tcs += 1
            for st in tc.get('steps', []):
                txt = (st.get('result_state') or '').strip()
                if not txt:
                    empty += 1
                    continue
                key = f"{tc['new_tc_id']}|{int(st['step_no'])}"
                steps[key] = txt
                updated += 1

    ref['steps'] = steps
    with open(REFINE, 'w', encoding='utf-8') as f:
        json.dump(ref, f, ensure_ascii=False, indent=2)
    print(f'[build_distribute] TC {tcs} | 스텝 갱신 {updated}개'
          f'{f" | 빈값 {empty}" if empty else ""} → result_refinement.json 갱신')


if __name__ == '__main__':
    main()
