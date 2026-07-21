#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_refinement.py — 서브에이전트가 재작성한 배치별 result_state 결과
(refine_batches/out/batch_*.json)를 하나의 result_refinement.json 으로 합친다.

출력: output/chat_conversion/result_refinement.json
  { "steps": { "<new_tc_id>|<step_no>": "재작성된 result_state", ... } }
"""
import os, sys, json, glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
BATCH_OUT = os.environ.get(
    'REFINE_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/refine_batches/out',
)


def main():
    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'batch_*.json')))
    if not files:
        print(f'[error] 재작성 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    steps = {}
    empty = 0
    dupe = 0
    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        for r in data.get('results', []):
            key = f"{r['new_tc_id']}|{int(r['step_no'])}"
            txt = (r.get('result_state') or '').strip()
            if not txt:
                empty += 1
                continue
            if key in steps:
                dupe += 1
            steps[key] = txt

    out = os.path.join(OUT_DIR, 'result_refinement.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'steps': steps}, f, ensure_ascii=False, indent=2)
    print(f'[build_refinement] 재작성 스텝 {len(steps)}개 → result_refinement.json'
          f'{f" | 빈값 {empty}" if empty else ""}{f" | 중복 {dupe}" if dupe else ""}')


if __name__ == '__main__':
    main()
