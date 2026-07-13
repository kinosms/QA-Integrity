"""
QA Analyzer — Flask 백엔드
실행: python server.py
접속: http://localhost:5000
"""

import os
import sys
import uuid
import ssl
import threading
import subprocess

from flask import Flask, jsonify, request, send_from_directory

# macOS Python 3.13 SSL 인증서 우회
_ssl_ctx = ssl.create_default_context()
_ssl_ctx.check_hostname = False
_ssl_ctx.verify_mode = ssl.CERT_NONE

BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
DASHBOARD_DIR = os.path.join(BASE_DIR, 'dashboard')
INPUT_DIR     = os.path.join(BASE_DIR, 'input')

SUPA_URL = 'https://fnuvsxkytoycdhgkqykw.supabase.co'
SUPA_KEY = 'sb_publishable_H_fiKjJsX13kBe9dM3Y6vg_r-QEnHgt'

app = Flask(__name__, static_folder=DASHBOARD_DIR)

# 진행 중인 분석 작업 저장소
jobs: dict = {}  # job_id -> { status, document_id, log, proc }


# ── 정적 파일 서빙 ──────────────────────────────────────────

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(DASHBOARD_DIR, path)


# ── API: input 폴더 파일 목록 ────────────────────────────────

@app.get('/api/input-files')
def list_input_files():
    """input/ 폴더의 .xlsx 파일 목록 반환 + Supabase에서 분석 여부 확인"""
    try:
        xlsx_files = sorted([
            f for f in os.listdir(INPUT_DIR)
            if f.lower().endswith('.xlsx') and not f.startswith('~')
        ])
    except FileNotFoundError:
        xlsx_files = []

    # Supabase에서 분석된 문서 목록 조회
    analyzed_map = {}
    try:
        import urllib.request
        import json as _json
        req = urllib.request.Request(
            SUPA_URL + '/rest/v1/documents?select=id,name,filename,total_tc',
            headers={
                'apikey': SUPA_KEY,
                'Authorization': 'Bearer ' + SUPA_KEY,
            }
        )
        with urllib.request.urlopen(req, timeout=5, context=_ssl_ctx) as resp:
            docs = _json.loads(resp.read())
            for d in docs:
                analyzed_map[d['filename']] = d
    except Exception as e:
        print(f'[warn] documents 조회 실패: {e}')

    result = []
    for f in xlsx_files:
        doc = analyzed_map.get(f)
        result.append({
            'filename':    f,
            'name':        doc['name'] if doc else f,
            'analyzed':    doc is not None,
            'document_id': doc['id'] if doc else None,
            'total_tc':    doc['total_tc'] if doc else None,
        })

    # 분석된 문서 중 input에 없는 것도 포함 (파일은 삭제됐지만 DB에 있는 경우)
    for filename, doc in analyzed_map.items():
        if filename not in xlsx_files:
            result.insert(0, {
                'filename':    filename,
                'name':        doc['name'],
                'analyzed':    True,
                'document_id': doc['id'],
                'total_tc':    doc['total_tc'],
            })

    return jsonify(result)


# ── API: 분석 실행 ───────────────────────────────────────────

@app.post('/api/analyze')
def start_analysis():
    """analyzer.py를 비동기로 실행하고 job_id 반환"""
    data = request.get_json(silent=True) or {}
    filename = data.get('filename', '').strip()
    name     = data.get('name', '').strip() or os.path.splitext(filename)[0]

    if not filename:
        return jsonify({'error': 'filename 필수'}), 400

    input_path = os.path.join(INPUT_DIR, filename)
    if not os.path.exists(input_path):
        return jsonify({'error': f'파일 없음: {filename}'}), 404

    job_id = str(uuid.uuid4())
    jobs[job_id] = {'status': 'running', 'document_id': None, 'log': []}

    thread = threading.Thread(
        target=_run_job,
        args=(job_id, filename, name),
        daemon=True
    )
    thread.start()

    return jsonify({'job_id': job_id})


def _run_job(job_id: str, filename: str, name: str):
    """별도 스레드에서 analyzer.py 실행 + 출력 스트리밍"""
    try:
        proc = subprocess.Popen(
            [
                sys.executable,
                os.path.join(BASE_DIR, 'tools', 'analyzer.py'),
                '--input', filename,
                '--name',  name,
            ],
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        jobs[job_id]['proc'] = proc

        for line in proc.stdout:
            line = line.rstrip()
            jobs[job_id]['log'].append(line)
            # analyzer.py가 완료 시 DOCUMENT_ID:<n> 출력
            if line.startswith('DOCUMENT_ID:'):
                try:
                    jobs[job_id]['document_id'] = int(line.split(':')[1])
                except ValueError:
                    pass

        proc.wait()
        jobs[job_id]['status'] = 'done' if proc.returncode == 0 else 'error'

    except Exception as e:
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['log'].append(f'[서버 오류] {e}')


# ── API: 분석 상태 조회 ──────────────────────────────────────

@app.get('/api/analyze/status/<job_id>')
def analysis_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        return jsonify({'error': '알 수 없는 job_id'}), 404

    return jsonify({
        'status':      job['status'],
        'document_id': job['document_id'],
        'log':         job['log'][-50:],   # 최근 50줄만
    })


# ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print(f'대시보드:  http://localhost:8080')
    print(f'INPUT_DIR: {INPUT_DIR}')
    app.run(host='0.0.0.0', port=8080, debug=False)
