#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_split.py — 서브에이전트의 스텝 분리 판정 결과(split_batches/out/batch_*.json)에서
decision=="split" 항목만 모아 step_split.json 을 생성한다.

출력: output/chat_conversion/step_split.json
  { "splits": { "<new_tc_id>|<orig_step_no>": [ {action, action_parameter, result_state}, ... ] } }
"""
import os, sys, json, glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
BATCH_OUT = os.environ.get(
    'SPLIT_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/split_batches/out',
)

ALLOWED = {'TAP','DOUBLE_TAP','LONG_PRESS','INPUT','CLEAR','SWIPE','SCROLL','DRAG',
           'SELECT','BACK','WAIT','OPEN','CLOSE','SWITCH','VERIFY'}


def main():
    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'batch_*.json')))
    if not files:
        print(f'[error] 분리 판정 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    splits = {}
    n_split = 0; n_keep = 0; n_sub = 0; bad = 0
    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        for r in data.get('results', []):
            if r.get('decision') != 'split':
                n_keep += 1
                continue
            subs = r.get('substeps') or []
            clean = []
            for sub in subs:
                act = str(sub.get('action', 'VERIFY')).strip().upper()
                if act not in ALLOWED:
                    act = 'VERIFY'
                rs = (sub.get('result_state') or '').strip()
                if not rs:
                    continue
                clean.append({
                    'action': act,
                    'action_parameter': sub.get('action_parameter'),
                    'result_state': rs,
                })
            if len(clean) < 2:      # 분리는 2개 이상일 때만 유효
                bad += 1
                continue
            key = f"{r['new_tc_id']}|{int(r['step_no'])}"
            splits[key] = clean
            n_split += 1
            n_sub += len(clean)

    out = os.path.join(OUT_DIR, 'step_split.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'splits': splits}, f, ensure_ascii=False, indent=2)
    print(f'[build_split] split {n_split}개 스텝 → 하위 {n_sub}개 substep '
          f'(순증 {n_sub - n_split}) | keep {n_keep}'
          f'{f" | 무효 split {bad}" if bad else ""}')


if __name__ == '__main__':
    main()
