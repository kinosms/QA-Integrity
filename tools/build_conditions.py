#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_conditions.py — 조건→precondition 분리 판정 결과(condition_batches/out/batch_*.json)를
condition_override.json 으로 합친다.

출력: output/chat_conversion/condition_override.json
  {
    "states": { state_key: {state_id, bucket, label, review} },   // add_preconditions 로 도입된 State
    "steps":  { "<tc_id>|<step_no>": <annotate|split 레코드> }      // keep 은 제외
  }
"""
import os, sys, json, glob
from collections import Counter, defaultdict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
SEED = os.path.join(BASE_DIR, 'tools', 'enrich_seed_vocab.json')
BATCH_OUT = os.environ.get(
    'CONDITION_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/condition_batches/out',
)


def state_id_for(key):
    k = key.strip()
    if k.startswith('x_'):
        return 'STA_X_' + k[2:].upper()
    return 'STA_' + k.upper()


def main():
    seed = {s['key'] for s in json.load(open(SEED, encoding='utf-8'))['seed_states']}
    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'batch_*.json')))
    if not files:
        print(f'[error] 조건 판정 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    steps = {}
    label_votes = defaultdict(Counter)
    bucket_votes = defaultdict(Counter)
    n_keep = n_ann = n_split = 0

    def collect_pcs(pcs):
        for pc in pcs or []:
            key = pc['state_key'].strip()
            bucket_votes[key][pc.get('bucket', 'data')] += 1
            if pc.get('label'):
                label_votes[key][pc['label'].strip()] += 1

    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        for r in data.get('results', []):
            dec = r.get('decision', 'keep')
            key = f"{r['new_tc_id']}|{int(r['step_no'])}"
            if dec == 'annotate':
                collect_pcs(r.get('add_preconditions'))
                steps[key] = {
                    'decision': 'annotate',
                    'add_preconditions': r.get('add_preconditions', []),
                    'result_state': (r.get('result_state') or '').strip(),
                }
                n_ann += 1
            elif dec == 'split':
                cases = r.get('cases') or []
                if len(cases) < 2:
                    n_keep += 1
                    continue
                for c in cases:
                    collect_pcs(c.get('add_preconditions'))
                steps[key] = {'decision': 'split', 'cases': cases}
                n_split += 1
            else:
                n_keep += 1

    # State 표 구성
    states = {}
    for key in bucket_votes:
        bkt = bucket_votes[key].most_common(1)[0][0]
        label = label_votes[key].most_common(1)[0][0] if label_votes[key] else key
        review = (key not in seed) and (not key.startswith('os_'))
        states[key] = {'state_id': state_id_for(key), 'bucket': bkt,
                       'label': label, 'review': review}

    out = os.path.join(OUT_DIR, 'condition_override.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'states': states, 'steps': steps}, f, ensure_ascii=False, indent=2)
    print(f'[build_conditions] keep {n_keep} / annotate {n_ann} / split {n_split} '
          f'| 신규 State {len(states)} → condition_override.json')


if __name__ == '__main__':
    main()
