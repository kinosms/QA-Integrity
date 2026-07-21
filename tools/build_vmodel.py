#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_vmodel.py — 기능별 계층 검증 모델(out/F*.json)을 통합하여
  1) output/validation_model/validation_model.json (대시보드/집계용)
  2) output/validation_model/validation_model.md   (Markdown Tree)
  3) dashboard/validation_model.json                (대시보드 동기화본)
을 생성한다.
"""
import os, sys, json, glob
from collections import Counter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, 'output', 'validation_model')
DASH = os.path.join(BASE_DIR, 'dashboard')
BATCH_OUT = os.environ.get(
    'VMODEL_OUT_DIR',
    '/private/tmp/claude-501/-Users-geronimo-sung-Desktop-qa-analyzer/'
    'cafb65e7-30af-480a-a0bf-db6f3c6568c8/scratchpad/vmodel/out',
)
SERVICE = '일반채팅'


def stats_of(groups):
    ng = len(groups)
    ni = sum(len(g.get('items', [])) for g in groups)
    nc = sum(len(it.get('checkpoints', [])) for g in groups for it in g.get('items', []))
    return {'groups': ng, 'items': ni, 'checkpoints': nc}


def main():
    files = sorted(glob.glob(os.path.join(BATCH_OUT, 'F*.json')))
    if not files:
        print(f'[error] 모델 결과 없음: {BATCH_OUT}')
        sys.exit(1)

    functions = []
    precond_ctr = Counter(); target_ctr = Counter(); evidence_ctr = Counter()
    for fp in files:
        data = json.load(open(fp, encoding='utf-8'))
        groups = data.get('validation_groups', [])
        st = stats_of(groups)
        functions.append({
            'function': data.get('function', os.path.basename(fp)[:-5]),
            'function_name': data.get('function_name', ''),
            'stats': st,
            'validation_groups': groups,
        })
        for g in groups:
            for it in g.get('items', []):
                for c in it.get('checkpoints', []):
                    for p in c.get('preconditions', []): precond_ctr[p] += 1
                    if c.get('target'): target_ctr[c['target']] += 1
                    for e in c.get('evidence', []): evidence_ctr[e] += 1

    functions.sort(key=lambda f: -f['stats']['checkpoints'])
    totals = {
        'functions': len(functions),
        'groups': sum(f['stats']['groups'] for f in functions),
        'items': sum(f['stats']['items'] for f in functions),
        'checkpoints': sum(f['stats']['checkpoints'] for f in functions),
    }
    model = {
        'service': SERVICE,
        'totals': totals,
        'top_preconditions': precond_ctr.most_common(20),
        'top_targets': target_ctr.most_common(20),
        'evidence_distribution': evidence_ctr.most_common(),
        'functions': functions,
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, 'validation_model.json'), 'w', encoding='utf-8') as f:
        json.dump(model, f, ensure_ascii=False, indent=2)
    with open(os.path.join(DASH, 'validation_model.json'), 'w', encoding='utf-8') as f:
        json.dump(model, f, ensure_ascii=False, indent=2)

    # ── Markdown Tree ──────────────────────────────────────────────────────
    L = []
    L.append(f'# {SERVICE} — 계층형 검증 모델 (Hierarchical Validation Model)')
    L.append('')
    L.append(f"- 기능 {totals['functions']} · 검증 그룹 {totals['groups']} · "
             f"검증 항목 {totals['items']} · 체크포인트 {totals['checkpoints']}")
    L.append('')
    for f in functions:
        L.append(f"# {f['function_name'] or f['function']}")
        L.append('')
        L.append(f"> 검증 그룹 {f['stats']['groups']} · 항목 {f['stats']['items']} · "
                 f"체크포인트 {f['stats']['checkpoints']}")
        L.append('')
        for g in f['validation_groups']:
            L.append(f"## {g['group']}")
            L.append('')
            for it in g.get('items', []):
                L.append(f"### {it['item']}")
                L.append('')
                for c in it.get('checkpoints', []):
                    L.append(f"- **Check Point**: {c.get('check_point','')}")
                    ep = ' → '.join(c.get('execution_path', []))
                    L.append(f"  - Execution Path: {ep}")
                    L.append(f"  - Preconditions: {', '.join(c.get('preconditions', [])) or '-'}")
                    L.append(f"  - Target: {c.get('target','-')}")
                    L.append(f"  - Expected State: {c.get('expected_state','-')}")
                    L.append(f"  - Evidence: {', '.join(c.get('evidence', [])) or '-'}")
                L.append('')
    with open(os.path.join(OUT_DIR, 'validation_model.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))

    print(f"[build_vmodel] 기능 {totals['functions']} / 그룹 {totals['groups']} / "
          f"항목 {totals['items']} / 체크포인트 {totals['checkpoints']}")
    print(f"  → {OUT_DIR}/validation_model.json, validation_model.md")
    print(f"  → {DASH}/validation_model.json")


if __name__ == '__main__':
    main()
