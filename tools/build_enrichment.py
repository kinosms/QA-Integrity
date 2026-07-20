#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_enrichment.py — 서브에이전트가 추출한 배치별 강화 결과(out/batch_*.json)를
정규화하여 convert_chat.py 가 소비할 enrichment.json 을 생성한다.

- 모든 배치를 읽어 new_tc_id 별 preconditions/parameters 를 수집
- state_key → STA_ID / bucket / label 로 정규화한 State 표 구성
  * seed 어휘(enrich_seed_vocab.json)에 있으면 seed 의 bucket/label 사용
  * x_ 접두어(신규)는 STA_X_... 로 부여하고 검토 플래그(review=True)
- 출력: output/chat_conversion/enrichment.json
  {
    "states": { state_key: {state_id, bucket, label, review, count} },
    "tcs":    { new_tc_id: {preconditions:[{step_no,bucket,state_id,state_key}],
                            parameters:[{step_no,field,value}]} }
  }
"""
import os, sys, json, glob
from collections import Counter, defaultdict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'chat_conversion')
SEED = os.path.join(BASE_DIR, 'tools', 'enrich_seed_vocab.json')

# 배치 결과 위치 (스크래치패드 out/)
BATCH_OUT = os.environ.get(
    'ENRICH_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/enrich_batches/out',
)


def state_id_for(key):
    k = key.strip()
    if k.startswith('x_'):
        return 'STA_X_' + k[2:].upper()
    return 'STA_' + k.upper()


def main():
    seed = json.load(open(SEED, encoding='utf-8'))
    seed_map = {s['key']: s for s in seed['seed_states']}

    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'batch_*.json')))
    if not files:
        print(f'[error] 배치 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    tc_map = {}
    label_votes = defaultdict(Counter)   # key -> label counter
    bucket_votes = defaultdict(Counter)  # key -> bucket counter
    key_count = Counter()
    dupe = []

    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        for tc in data.get('results', []):
            tid = tc['new_tc_id']
            if tid in tc_map:
                dupe.append(tid)
            pcs = []
            for pc in tc.get('preconditions', []):
                key = pc['state_key'].strip()
                bkt = pc['bucket'].strip()
                key_count[key] += 1
                if pc.get('label'):
                    label_votes[key][pc['label'].strip()] += 1
                bucket_votes[key][bkt] += 1
                pcs.append({'step_no': int(pc['step_no']), 'state_key': key, 'bucket': bkt})
            prms = []
            for pr in tc.get('parameters', []):
                prms.append({
                    'step_no': int(pr['step_no']),
                    'field': pr['field'].strip(),
                    'value': pr.get('value'),
                })
            tc_map[tid] = {'preconditions': pcs, 'parameters': prms}

    # State 표 정규화
    states = {}
    for key, cnt in key_count.items():
        if key in seed_map:
            bkt = seed_map[key]['bucket']
            label = seed_map[key]['label']
            review = False
        else:
            bkt = bucket_votes[key].most_common(1)[0][0]
            label = (label_votes[key].most_common(1)[0][0]
                     if label_votes[key] else key)
            review = key.startswith('x_')
        states[key] = {
            'state_id': state_id_for(key),
            'bucket': bkt,
            'label': label,
            'review': review,
            'count': cnt,
        }

    # precondition bucket 을 정규화된 state bucket 으로 통일 + state_id 부여
    for tid, rec in tc_map.items():
        for pc in rec['preconditions']:
            st = states[pc['state_key']]
            pc['bucket'] = st['bucket']
            pc['state_id'] = st['state_id']

    result = {'states': states, 'tcs': tc_map}
    out = os.path.join(OUT_DIR, 'enrichment.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    n_pc = sum(len(r['preconditions']) for r in tc_map.values())
    n_pr = sum(len(r['parameters']) for r in tc_map.values())
    n_review = sum(1 for s in states.values() if s['review'])
    print(f'[build_enrichment] TC {len(tc_map)} | 사전조건 {n_pc} | 파라미터 {n_pr} | '
          f'State 종류 {len(states)} (검토 필요 x_ {n_review})')
    if dupe:
        print(f'[warn] 중복 TC {len(dupe)}건: {sorted(set(dupe))[:10]}')
    # 커버리지 체크
    return len(tc_map)


if __name__ == '__main__':
    main()
