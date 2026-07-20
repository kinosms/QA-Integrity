/* =========================================================
   convert.js — 5.일반채팅 구조화 TC 변환 대시보드
   conversion.json 을 로드해 사전 4종 + 신규 TC + 추적성/검증을 렌더링
   ========================================================= */

'use strict';

var DATA = null;

// ── 라벨/색상 ──────────────────────────────────────────────
var PRI_ORDER = ['P0','P1','P2','P3','P4','P5','empty','other'];
var PRI_LABEL = {P0:'P0',P1:'P1',P2:'P2',P3:'P3',P4:'P4',P5:'P5',empty:'미지정',other:'기타'};
var PRI_COLOR = {P0:'#ef4444',P1:'#f97316',P2:'#eab308',P3:'#22c55e',P4:'#3b82f6',P5:'#a855f7',empty:'#475569',other:'#64748b'};
var OS_LABEL  = {common:'공통',android:'Android',ios:'iOS',web:'Web',pc:'PC',empty:'미지정',other:'기타'};
var OS_COLOR  = {common:'#6366f1',android:'#78c257',ios:'#38bdf8',web:'#f59e0b',pc:'#a855f7',empty:'#475569',other:'#64748b'};
var READ_LABEL = {READY:'READY',REVIEW_REQUIRED:'REVIEW',MANUAL_ONLY:'MANUAL'};
var READ_CLS   = {READY:'ready',REVIEW_REQUIRED:'review',MANUAL_ONLY:'manual'};

// ── 유틸 ───────────────────────────────────────────────────
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function $(id){ return document.getElementById(id); }

// API 호출 헬퍼: HTML 404 등 비-JSON 응답을 명확한 에러로 변환
// file:// 로 열었거나 다른 포트/호스트에서 열어도 백엔드(localhost:8080)를 자동으로 찾음
var API_BASE = /^https?:\/\/(localhost|127\.0\.0\.1):8080/.test(location.href) ? '' : 'http://localhost:8080';
var SERVER_HINT = '백엔드 서버가 실행 중이 아닙니다. 터미널에서 "python server.py" 실행 후 http://localhost:8080 으로 접속하세요.';
function apiJson(url, opts){
  return fetch(API_BASE + url, opts).then(function(r){
    var ct = r.headers.get('content-type') || '';
    if(!r.ok || ct.indexOf('application/json') < 0){
      throw new Error(SERVER_HINT);
    }
    return r.json();
  });
}
function rowsText(arr){ return (arr||[]).join(' '); }
function naCls(v){ return (v==='해당없음') ? ' class="na"' : ''; }

// ══════════════════════════════════════════════════════════
// 초기화
// ══════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', function(){
  bindToggles();
  loadFileList();
  loadConversion();
});

function loadConversion(){
  var ov = $('loading-overlay'); if(ov) ov.style.display='flex';
  apiJson('/api/chat-conversion')
    .then(function(d){ DATA = d; renderAll(); })
    .catch(function(e){ showEmpty(e && /server\.py/.test(e.message) ? e.message : ''); })
    .finally(function(){ if(ov) ov.style.display='none'; });
}

function showEmpty(msg){
  $('empty-state').style.display='block';
  $('dash-root').style.display='none';
  var sb=$('status-badge'); sb.textContent='미변환'; sb.className='status-badge warn';
  if(msg){
    var es=$('empty-state');
    es.querySelector('#empty-hint') || (function(){
      var d=document.createElement('div'); d.id='empty-hint';
      d.style.cssText='color:#fb923c;font-size:12px;margin-top:14px'; es.appendChild(d);
    })();
    $('empty-hint').textContent='⚠ '+msg;
  }
}

function loadFileList(){
  apiJson('/api/input-files').then(function(files){
    var sel=$('analyze-file-select'); if(!sel) return;
    sel.innerHTML='';
    files.forEach(function(f){
      var o=document.createElement('option');
      o.value=f.filename; o.textContent=f.filename;
      if(f.filename.indexOf('Regression')>=0) o.selected=true;
      sel.appendChild(o);
    });
  }).catch(function(){
    var sel=$('analyze-file-select');
    if(sel) sel.innerHTML='<option value="">서버 미실행 — python server.py 필요</option>';
  });
}

// ══════════════════════════════════════════════════════════
// 전체 렌더
// ══════════════════════════════════════════════════════════
function renderAll(){
  $('empty-state').style.display='none';
  $('dash-root').style.display='block';

  var s=DATA.summary;
  var sb=$('status-badge');
  if(s.status==='success'){ sb.textContent='✔ 성공'; sb.className='status-badge ok'; }
  else { sb.textContent='⚠ 경고'; sb.className='status-badge warn'; }

  renderKPI();
  renderDistributions();
  renderTrace();
  renderValidation();
  renderScreenDict();
  renderTargetDict();
  renderStateDict();
  renderTransitionDict();
  renderTCView();

  $('cnt-screen').textContent = DATA.screens.length;
  $('cnt-target').textContent = DATA.targets.length;
  $('cnt-state').textContent  = DATA.states.length;
  $('cnt-transition').textContent = DATA.transitions.length;
  $('cnt-tc').textContent = DATA.tcs.length;
}

// ── KPI ────────────────────────────────────────────────────
function renderKPI(){
  var s=DATA.summary;
  var cards=[
    {v:s.source_tc_count, l:'원본 TC 수'},
    {v:s.converted_tc_count, l:'신규 TC 수'},
    {v:s.converted_step_count, l:'신규 Step 수'},
    {v:s.unmapped_source_tc_count, l:'미연결 원본 TC', cls:s.unmapped_source_tc_count?'warn':'ok'},
    {v:s.automation_ready_count, l:'자동화 READY', cls:'ok'},
    {v:s.review_required_count, l:'REVIEW_REQUIRED', cls:'warn'},
  ];
  $('kpi-row').innerHTML = cards.map(function(c){
    return '<div class="kpi-card '+(c.cls||'')+'"><div class="kv">'+c.v+'</div><div class="kl">'+esc(c.l)+'</div></div>';
  }).join('');
}

// ── 분포 4종 ───────────────────────────────────────────────
function distBars(container, entries, colorFn){
  var max=Math.max.apply(null, entries.map(function(e){return e.v;}).concat([1]));
  container.innerHTML = entries.map(function(e){
    var pct=Math.round(e.v/max*100);
    return '<div class="dist-bar-row"><div class="dist-bar-label">'+esc(e.l)+'</div>'
      +'<div class="dist-bar-track"><div class="dist-bar-fill" style="width:'+pct+'%;background:'+e.c+'"></div></div>'
      +'<div class="dist-bar-val">'+e.v+'</div></div>';
  }).join('') || '<div class="empty-note">데이터 없음</div>';
}

function renderDistributions(){
  var d=DATA.distributions;
  // 서비스
  var svc=Object.keys(d.service).map(function(k){return {l:k,v:d.service[k],c:'#6366f1'};});
  distBars($('svc-dist'), svc, null);
  // 우선순위
  var pri=PRI_ORDER.filter(function(k){return d.priority[k];}).map(function(k){
    return {l:PRI_LABEL[k],v:d.priority[k],c:PRI_COLOR[k]};});
  distBars($('pri-dist'), pri, null);
  // OS (그리드 카드)
  var os=Object.keys(d.os).sort(function(a,b){return d.os[b]-d.os[a];});
  $('os-dist').innerHTML = os.map(function(k){
    return '<div class="kpi-card"><div class="kv" style="color:'+(OS_COLOR[k]||'#94a3b8')+'">'+d.os[k]+'</div>'
      +'<div class="kl">'+esc(OS_LABEL[k]||k)+'</div></div>';
  }).join('') || '<div class="empty-note">데이터 없음</div>';
  // 속성
  var attr=Object.keys(d.attributes).map(function(k){return {l:k,v:d.attributes[k],c:'#22d3ee'};})
    .sort(function(a,b){return b.v-a.v;});
  distBars($('attr-dist'), attr, null);
}

// ── 추적성 ─────────────────────────────────────────────────
function renderTrace(){
  var s=DATA.summary;
  var cells=[
    {v:s.source_tc_count,l:'전체 원본 TC'},
    {v:s.converted_tc_count,l:'신규 TC'},
    {v:s.mapped_source_tc_count,l:'연결 완료 원본'},
    {v:s.unmapped_source_tc_count,l:'미연결 원본'},
    {v:s.split_source_tc_count,l:'분리(SPLIT)'},
    {v:s.merged_source_tc_count,l:'통합(MERGED)'},
    {v:s.automation_ready_count,l:'READY'},
    {v:s.review_required_count,l:'REVIEW_REQUIRED'},
    {v:s.manual_only_count,l:'MANUAL_ONLY'},
    {v:s.validation_passed+'/'+s.validation_total,l:'검증 통과'},
  ];
  $('trace-grid').innerHTML = cells.map(function(c){
    return '<div class="trace-cell"><div class="tv">'+c.v+'</div><div class="tl">'+esc(c.l)+'</div></div>';
  }).join('');

  var un=DATA.unmapped||[];
  var w=$('trace-unmapped-wrap');
  if(!un.length){
    w.innerHTML='<div style="font-size:12px;color:#4ade80">✔ 모든 원본 행이 신규 TC에 연결되었습니다 (unmapped_source_tc_count = 0)</div>';
  }else{
    w.innerHTML='<div class="sub-title" style="color:#fb923c;margin-bottom:8px">⚠ 미연결 원본 TC ('+un.length+')</div>'
      +'<div class="dt-wrap"><table class="dt"><thead><tr><th class="nosort">원본 행번호</th><th class="nosort">원본 TC ID</th><th class="nosort">사유</th></tr></thead><tbody>'
      +un.map(function(u){return '<tr><td class="mono">'+u.source_row_number+'</td><td class="mono">'+esc(u.source_tc_id)+'</td><td>'+esc(u.reason||'-')+'</td></tr>';}).join('')
      +'</tbody></table></div>';
  }
}

function renderValidation(){
  $('validation-list').innerHTML = DATA.validation.map(function(v){
    return '<div class="val-row '+(v.pass?'ok':'bad')+'"><span class="val-icon">'+(v.pass?'✔':'✕')+'</span>'
      +'<span>'+esc(v.name)+'</span>'+(v.detail?'<span class="val-detail">'+esc(v.detail)+'</span>':'')+'</div>';
  }).join('');
}

// ══════════════════════════════════════════════════════════
// 범용 데이터 테이블 (검색·필터·정렬·페이지네이션)
// ══════════════════════════════════════════════════════════
function mountTable(container, cfg){
  var state={ q:'', filters:{}, sortKey:cfg.defaultSort||null, sortDir:cfg.defaultDir||'asc', page:1 };
  (cfg.filters||[]).forEach(function(f){ state.filters[f.key]='all'; });

  function filtered(){
    var q=state.q.trim().toLowerCase();
    var rows=cfg.rows.filter(function(r){
      if(q){
        var hay=(cfg.searchFields||[]).map(function(fn){return fn(r);}).join(' ').toLowerCase();
        if(hay.indexOf(q)<0) return false;
      }
      for(var i=0;i<(cfg.filters||[]).length;i++){
        var f=cfg.filters[i], val=state.filters[f.key];
        if(val!=='all' && !f.match(r,val)) return false;
      }
      return true;
    });
    if(state.sortKey){
      var col=cfg.columns.filter(function(c){return c.key===state.sortKey;})[0];
      if(col){
        rows=rows.slice().sort(function(a,b){
          var va=col.sortVal?col.sortVal(a):col.render(a), vb=col.sortVal?col.sortVal(b):col.render(b);
          if(typeof va==='number'&&typeof vb==='number') return state.sortDir==='asc'?va-vb:vb-va;
          va=String(va); vb=String(vb);
          return state.sortDir==='asc'?va.localeCompare(vb):vb.localeCompare(va);
        });
      }
    }
    return rows;
  }

  function render(){
    var rows=filtered();
    var ps=cfg.pageSize||15;
    var pages=Math.max(1,Math.ceil(rows.length/ps));
    if(state.page>pages) state.page=pages;
    var slice=rows.slice((state.page-1)*ps, state.page*ps);

    var html='<div class="dt-toolbar">';
    if(cfg.search!==false)
      html+='<input class="dt-search" placeholder="'+esc(cfg.searchPlaceholder||'검색')+'" value="'+esc(state.q)+'">';
    (cfg.filters||[]).forEach(function(f){
      html+='<select class="fsel" data-fk="'+f.key+'"><option value="all">'+esc(f.label)+'</option>'
        +f.options.map(function(o){return '<option value="'+esc(o.v)+'"'+(state.filters[f.key]===o.v?' selected':'')+'>'+esc(o.label)+'</option>';}).join('')
        +'</select>';
    });
    html+='<span class="dt-hint">'+rows.length+' / '+cfg.rows.length+'건</span></div>';

    html+='<div class="dt-wrap"><table class="dt"><thead><tr>';
    cfg.columns.forEach(function(c){
      var srt=c.sortable!==false;
      var arr = state.sortKey===c.key ? '<span class="arrow">'+(state.sortDir==='asc'?'▲':'▼')+'</span>' : '';
      html+='<th class="'+(srt?'':'nosort')+'" data-sk="'+(srt?c.key:'')+'">'+esc(c.label)+arr+'</th>';
    });
    html+='</tr></thead><tbody>';
    if(!slice.length){
      html+='<tr><td colspan="'+cfg.columns.length+'" class="empty-note">조건에 맞는 항목이 없습니다</td></tr>';
    }else{
      slice.forEach(function(r){
        html+='<tr>'+cfg.columns.map(function(c){
          var v=c.html?c.html(r):esc(c.render(r));
          return '<td'+(c.className?' class="'+c.className+'"':'')+'>'+v+'</td>';
        }).join('')+'</tr>';
      });
    }
    html+='</tbody></table></div>';
    html+='<div class="pager" data-pager></div><div class="page-info">'+state.page+' / '+pages+' 페이지</div>';
    container.innerHTML=html;

    // 이벤트 바인딩
    var si=container.querySelector('.dt-search');
    if(si) si.oninput=function(){ state.q=this.value; state.page=1; var pos=this.selectionStart; render(); var ni=container.querySelector('.dt-search'); ni.focus(); ni.setSelectionRange(pos,pos); };
    container.querySelectorAll('select[data-fk]').forEach(function(sel){
      sel.onchange=function(){ state.filters[this.getAttribute('data-fk')]=this.value; state.page=1; render(); };
    });
    container.querySelectorAll('th[data-sk]').forEach(function(th){
      var sk=th.getAttribute('data-sk'); if(!sk) return;
      th.onclick=function(){
        if(state.sortKey===sk){ state.sortDir=state.sortDir==='asc'?'desc':'asc'; }
        else { state.sortKey=sk; state.sortDir='asc'; }
        render();
      };
    });
    buildPager(container.querySelector('[data-pager]'), state.page, pages, function(p){ state.page=p; render(); });
  }
  render();
}

function buildPager(el, cur, pages, cb){
  if(!el) return;
  if(pages<=1){ el.innerHTML=''; return; }
  var html='<button '+(cur<=1?'disabled':'')+' data-p="'+(cur-1)+'">‹</button>';
  var start=Math.max(1,cur-2), end=Math.min(pages,start+4); start=Math.max(1,end-4);
  if(start>1) html+='<button data-p="1">1</button>'+(start>2?'<span style="color:#64748b">…</span>':'');
  for(var i=start;i<=end;i++) html+='<button class="'+(i===cur?'active':'')+'" data-p="'+i+'">'+i+'</button>';
  if(end<pages) html+=(end<pages-1?'<span style="color:#64748b">…</span>':'')+'<button data-p="'+pages+'">'+pages+'</button>';
  html+='<button '+(cur>=pages?'disabled':'')+' data-p="'+(cur+1)+'">›</button>';
  el.innerHTML=html;
  el.querySelectorAll('button[data-p]').forEach(function(b){
    b.onclick=function(){ var p=+this.getAttribute('data-p'); if(p>=1&&p<=pages) cb(p); };
  });
}

function clip(text){ var t=esc(text); return '<div class="cell-clip" title="'+t+'">'+t+'</div>'; }
function rowsCell(arr){ return '<span class="rows-badge">'+esc(rowsText(arr))+'</span>'; }

// ══════════════════════════════════════════════════════════
// A. Screen Dictionary
// ══════════════════════════════════════════════════════════
function renderScreenDict(){
  mountTable($('screen-view'), {
    rows: DATA.screens, pageSize: 12,
    searchPlaceholder:'Screen ID · 화면명 · 원본 행번호 검색',
    searchFields:[function(r){return r.screen_id;},function(r){return r.name;},function(r){return rowsText(r.source_rows);}],
    defaultSort:'screen_id',
    columns:[
      {key:'screen_id',label:'Screen ID',render:function(r){return r.screen_id;},html:function(r){return '<span class="mono">'+esc(r.screen_id)+'</span>';}},
      {key:'name',label:'화면명',render:function(r){return r.name;}},
      {key:'criteria',label:'식별 기준',sortable:false,render:function(r){return r.criteria;},html:function(r){return clip(r.criteria);}},
      {key:'source_rows',label:'출처 원본 행번호',sortable:false,render:function(r){return rowsText(r.source_rows);},html:function(r){return clip(rowsText(r.source_rows));}},
      {key:'used_tc_count',label:'사용 TC 수',render:function(r){return r.used_tc_count;},sortVal:function(r){return r.used_tc_count;},html:function(r){return '<span class="use-badge">'+r.used_tc_count+'</span>';}},
    ]
  });
}

// ══════════════════════════════════════════════════════════
// B. Target Dictionary
// ══════════════════════════════════════════════════════════
function renderTargetDict(){
  var scr=uniq(DATA.targets.map(function(t){return t.screen_id;}));
  mountTable($('target-view'), {
    rows: DATA.targets, pageSize: 12,
    searchPlaceholder:'Target ID · 대상명 · 원본 행번호 검색',
    searchFields:[function(r){return r.target_id;},function(r){return r.name;},function(r){return rowsText(r.source_rows);}],
    defaultSort:'target_id',
    filters:[{key:'screen',label:'Screen ID 전체',options:scr.map(function(s){return {v:s,label:s};}),match:function(r,v){return r.screen_id===v;}}],
    columns:[
      {key:'target_id',label:'Target ID',render:function(r){return r.target_id;},html:function(r){return '<span class="mono">'+esc(r.target_id)+'</span>';}},
      {key:'name',label:'대상명',render:function(r){return r.name;}},
      {key:'screen_id',label:'Screen ID',render:function(r){return r.screen_id;},html:function(r){return '<span class="mono">'+esc(r.screen_id)+'</span>';}},
      {key:'criteria',label:'식별 기준',sortable:false,render:function(r){return r.criteria;},html:function(r){return clip(r.criteria);}},
      {key:'source_rows',label:'출처 원본 행번호',sortable:false,render:function(r){return rowsText(r.source_rows);},html:function(r){return clip(rowsText(r.source_rows));}},
      {key:'used_tc_count',label:'사용 TC 수',render:function(r){return r.used_tc_count;},sortVal:function(r){return r.used_tc_count;},html:function(r){return '<span class="use-badge">'+r.used_tc_count+'</span>';}},
    ]
  });
}

// ══════════════════════════════════════════════════════════
// C. State Dictionary
// ══════════════════════════════════════════════════════════
function renderStateDict(){
  var types=uniq(DATA.states.map(function(s){return s.state_type;}));
  mountTable($('state-view'), {
    rows: DATA.states, pageSize: 12,
    searchPlaceholder:'State ID · 정의 · 원본 행번호 검색',
    searchFields:[function(r){return r.state_id;},function(r){return r.definition;},function(r){return rowsText(r.source_rows);}],
    defaultSort:'state_id',
    filters:[{key:'type',label:'State Type 전체',options:types.map(function(t){return {v:t,label:t};}),match:function(r,v){return r.state_type===v;}}],
    columns:[
      {key:'state_id',label:'State ID',render:function(r){return r.state_id;},html:function(r){return '<span class="mono">'+esc(r.state_id)+'</span>';}},
      {key:'state_type',label:'State Type',render:function(r){return r.state_type;}},
      {key:'definition',label:'정의',sortable:false,render:function(r){return r.definition;},html:function(r){return clip(r.definition);}},
      {key:'criteria',label:'판정 기준',sortable:false,render:function(r){return r.criteria;},html:function(r){return clip(r.criteria);}},
      {key:'source_rows',label:'출처 원본 행번호',sortable:false,render:function(r){return rowsText(r.source_rows);},html:function(r){return clip(rowsText(r.source_rows));}},
      {key:'used_tc_count',label:'사용 TC 수',render:function(r){return r.used_tc_count;},sortVal:function(r){return r.used_tc_count;},html:function(r){return '<span class="use-badge">'+r.used_tc_count+'</span>';}},
    ]
  });
}

// ══════════════════════════════════════════════════════════
// D. Transition Dictionary
// ══════════════════════════════════════════════════════════
function renderTransitionDict(){
  var starts=uniq(DATA.transitions.map(function(t){return t.start_screen;}));
  var dests=uniq(DATA.transitions.map(function(t){return t.dest_screen;}));
  var acts=uniq(DATA.transitions.map(function(t){return t.action;}));
  mountTable($('transition-view'), {
    rows: DATA.transitions, pageSize: 12,
    searchPlaceholder:'Transition ID · 설명 검색',
    searchFields:[function(r){return r.transition_id;},function(r){return r.description;},function(r){return rowsText(r.source_rows);}],
    defaultSort:'transition_id',
    filters:[
      {key:'start',label:'시작 화면 전체',options:starts.map(function(s){return {v:s,label:s};}),match:function(r,v){return r.start_screen===v;}},
      {key:'dest',label:'도착 화면 전체',options:dests.map(function(s){return {v:s,label:s};}),match:function(r,v){return r.dest_screen===v;}},
      {key:'act',label:'Action 전체',options:acts.map(function(s){return {v:s,label:s};}),match:function(r,v){return r.action===v;}},
    ],
    columns:[
      {key:'transition_id',label:'Transition ID',render:function(r){return r.transition_id;},html:function(r){return '<span class="mono">'+esc(r.transition_id)+'</span>';}},
      {key:'start_screen',label:'시작 화면',render:function(r){return r.start_screen;},html:function(r){return '<span class="mono">'+esc(r.start_screen)+'</span>';}},
      {key:'action',label:'Action',render:function(r){return r.action;}},
      {key:'target_id',label:'Target ID',render:function(r){return r.target_id;},html:function(r){return '<span class="mono">'+esc(r.target_id)+'</span>';}},
      {key:'dest_screen',label:'도착 화면',render:function(r){return r.dest_screen;},html:function(r){return '<span class="mono">'+esc(r.dest_screen)+'</span>';}},
      {key:'description',label:'설명',sortable:false,render:function(r){return r.description;},html:function(r){return clip(r.description);}},
      {key:'source_rows',label:'출처 원본 행번호',sortable:false,render:function(r){return rowsText(r.source_rows);},html:function(r){return clip(rowsText(r.source_rows));}},
    ]
  });
}

function uniq(arr){ var s={},o=[]; arr.forEach(function(x){if(!s[x]){s[x]=1;o.push(x);}}); return o.sort(); }

// ══════════════════════════════════════════════════════════
// E. 신규 TC 결과표 (아코디언)
// ══════════════════════════════════════════════════════════
var tcState={ q:'', screen:'all', target:'all', action:'all', conv:'all', ready:'all', page:1 };
var TC_PAGE=10;

function renderTCView(){
  var allScreens=uniq(DATA.screens.map(function(s){return s.screen_id;}));
  var allTargets=uniq(DATA.targets.map(function(t){return t.target_id;}));
  var allActions=uniq([].concat.apply([], DATA.tcs.map(function(t){return t.steps.map(function(s){return s.action;});})));

  var html='<div class="dt-toolbar">'
    +'<input class="dt-search" id="tc-q" placeholder="New TC ID · TC명 · 원본 행번호 검색" value="'+esc(tcState.q)+'">'
    +selectHtml('tc-f-screen','Screen ID 필터',allScreens,tcState.screen)
    +selectHtml('tc-f-target','Target ID 필터',allTargets,tcState.target)
    +selectHtml('tc-f-action','Action 필터',allActions,tcState.action)
    +selectHtml('tc-f-conv','변환유형 필터',['ONE_TO_ONE','SPLIT','MERGED','RESTRUCTURED'],tcState.conv)
    +selectHtml('tc-f-ready','자동화상태 필터',['READY','REVIEW_REQUIRED','MANUAL_ONLY'],tcState.ready)
    +'<span class="dt-hint" id="tc-hint"></span></div>'
    +'<div id="tc-list"></div>'
    +'<div class="pager" id="tc-pager"></div><div class="page-info" id="tc-pageinfo"></div>';
  $('tc-view').innerHTML=html;

  $('tc-q').oninput=function(){ tcState.q=this.value; tcState.page=1; var p=this.selectionStart; renderTCList(); $('tc-q').focus(); $('tc-q').setSelectionRange(p,p); };
  bindSel('tc-f-screen','screen'); bindSel('tc-f-target','target'); bindSel('tc-f-action','action');
  bindSel('tc-f-conv','conv'); bindSel('tc-f-ready','ready');
  renderTCList();
}

function selectHtml(id,label,opts,cur){
  return '<select class="fsel" id="'+id+'"><option value="all">'+esc(label)+'</option>'
    +opts.map(function(o){return '<option value="'+esc(o)+'"'+(cur===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>';
}
function bindSel(id,key){ var el=$(id); if(el) el.onchange=function(){ tcState[key]=this.value; tcState.page=1; renderTCList(); }; }

function tcFiltered(){
  var q=tcState.q.trim().toLowerCase();
  return DATA.tcs.filter(function(t){
    if(q){
      var hay=(t.new_tc_id+' '+t.title+' '+rowsText(t.source_row_numbers)+' '+t.source_tc_ids.join(' ')).toLowerCase();
      if(hay.indexOf(q)<0) return false;
    }
    if(tcState.conv!=='all' && t.conversion_type!==tcState.conv) return false;
    if(tcState.ready!=='all' && t.automation_readiness!==tcState.ready) return false;
    if(tcState.screen!=='all' && !t.steps.some(function(s){return s.start_screen===tcState.screen||s.result_screen===tcState.screen;})) return false;
    if(tcState.target!=='all' && !t.steps.some(function(s){return s.target===tcState.target;})) return false;
    if(tcState.action!=='all' && !t.steps.some(function(s){return s.action===tcState.action;})) return false;
    return true;
  });
}

function renderTCList(){
  var rows=tcFiltered();
  var pages=Math.max(1,Math.ceil(rows.length/TC_PAGE));
  if(tcState.page>pages) tcState.page=pages;
  var slice=rows.slice((tcState.page-1)*TC_PAGE, tcState.page*TC_PAGE);
  $('tc-hint').textContent=rows.length+' / '+DATA.tcs.length+'건';
  $('tc-pageinfo').textContent=tcState.page+' / '+pages+' 페이지';

  if(!slice.length){ $('tc-list').innerHTML='<div class="empty-note">조건에 맞는 신규 TC가 없습니다</div>'; }
  else { $('tc-list').innerHTML=slice.map(tcCardHtml).join(''); }

  $('tc-list').querySelectorAll('.tc-head').forEach(function(h){
    h.onclick=function(){ this.parentNode.classList.toggle('open'); };
  });
  buildPager($('tc-pager'), tcState.page, pages, function(p){ tcState.page=p; renderTCList(); window.scrollTo(0,0); $('content').scrollTop=$('card-tc').offsetTop; });
}

function tcCardHtml(t){
  var pcls='chip '+(t.priority?t.priority.toLowerCase():'');
  var rcls='chip '+(READ_CLS[t.automation_readiness]||'');
  var head='<div class="tc-head">'
    +'<span class="tc-id">'+esc(t.new_tc_id)+'</span>'
    +'<span class="tc-title">'+esc(t.title)+'</span>'
    +'<span class="tc-meta">'
    +'<span class="'+pcls+'">'+esc(t.priority)+'</span>'
    +'<span class="chip">'+esc(OS_LABEL[t.os]||t.os)+'</span>'
    +'<span class="chip conv">'+esc(t.conversion_type)+'</span>'
    +'<span class="'+rcls+'">'+esc(READ_LABEL[t.automation_readiness]||t.automation_readiness)+'</span>'
    +'</span></div>';

  var info='<div class="tc-info">'
    +'<b>검증 목적</b>: '+esc(t.purpose)+'<br>'
    +'<b>원본 행번호</b>: '+esc(rowsText(t.source_row_numbers))+' &nbsp;|&nbsp; <b>원본 TC ID</b>: '+esc(t.source_tc_ids.join(', '))+'<br>'
    +'<b>변환 유형</b>: '+esc(t.conversion_type)+' — '+esc(t.conversion_note)+'<br>'
    +'<b>TC 속성</b>: '+esc(t.tc_attributes.join(', ')||'해당없음')
    +(t.review_reason?'<br><b>검토 사유</b>: '+esc(t.review_reason):'')
    +'</div>';

  var cols=['Step','start_screen','precondition · Data','precondition · UI','precondition · Permission','target','target_parameter','action','action_parameter','result_screen','result_state'];
  var thead='<tr>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'</tr>';
  var tbody=t.steps.map(function(s){
    return '<tr>'
      +'<td>'+s.step_no+'</td>'
      +'<td class="mono">'+esc(s.start_screen)+'</td>'
      +'<td'+naCls(s.precondition_data_state)+'>'+esc(s.precondition_data_state)+'</td>'
      +'<td'+naCls(s.precondition_ui_state)+'>'+esc(s.precondition_ui_state)+'</td>'
      +'<td'+naCls(s.precondition_permission_state)+'>'+esc(s.precondition_permission_state)+'</td>'
      +'<td'+naCls(s.target)+'>'+esc(s.target)+'</td>'
      +'<td'+naCls(s.target_parameter)+'>'+esc(s.target_parameter)+'</td>'
      +'<td>'+esc(s.action)+'</td>'
      +'<td'+naCls(s.action_parameter)+'>'+esc(s.action_parameter)+'</td>'
      +'<td class="mono">'+esc(s.result_screen)+'</td>'
      +'<td>'+esc(s.result_state)+'</td>'
      +'</tr>';
  }).join('');

  return '<div class="tc-card">'+head+'<div class="tc-body">'+info
    +'<div class="step-wrap"><table class="step-tbl"><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table></div></div></div>';
}

// ══════════════════════════════════════════════════════════
// 섹션 접기/펼치기
// ══════════════════════════════════════════════════════════
function bindToggles(){
  document.querySelectorAll('.section-header').forEach(function(h){
    h.style.cursor='pointer';
    h.onclick=function(){ this.parentNode.classList.toggle('collapsed'); };
  });
}

// ══════════════════════════════════════════════════════════
// 분석 실행 모달
// ══════════════════════════════════════════════════════════
function openAnalyzeModal(){ $('analyze-modal').style.display='flex'; }
function closeAnalyzeModal(){ $('analyze-modal').style.display='none'; }

function runConversion(){
  var file=$('analyze-file-select').value;
  var btn=$('analyze-run-btn'); btn.disabled=true; btn.textContent='변환 중...';
  $('analyze-progress').style.display='block';
  $('analyze-progress-bar').style.width='15%';
  $('analyze-log').textContent='변환 요청...';

  apiJson('/api/chat-conversion/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename:file})})
    .then(function(res){
      if(res.error) throw new Error(res.error);
      pollStatus(res.job_id);
    })
    .catch(function(e){ btn.textContent='요청 실패'; btn.disabled=false; $('analyze-log').textContent=(e&&e.message)||String(e); });
}

function pollStatus(jobId){
  var btn=$('analyze-run-btn');
  var timer=setInterval(function(){
    apiJson('/api/analyze/status/'+jobId).then(function(st){
      $('analyze-log').textContent=(st.log||[]).join('\n');
      $('analyze-log').scrollTop=$('analyze-log').scrollHeight;
      if(st.status==='done'){
        clearInterval(timer);
        $('analyze-progress-bar').style.width='100%';
        btn.textContent='완료 ✔';
        setTimeout(function(){ closeAnalyzeModal(); btn.disabled=false; btn.textContent='분석 시작'; loadConversion(); },800);
      }else if(st.status==='error'){
        clearInterval(timer); btn.textContent='오류'; btn.disabled=false;
        $('analyze-progress-bar').style.background='#ef4444';
      }else{
        var w=parseInt($('analyze-progress-bar').style.width)||15;
        if(w<90) $('analyze-progress-bar').style.width=(w+8)+'%';
      }
    }).catch(function(){});
  },1000);
}

// ══════════════════════════════════════════════════════════
// Export — Excel / CSV
// ══════════════════════════════════════════════════════════
function exportConversionXlsx(){
  if(!DATA){ alert('변환 결과가 없습니다'); return; }
  var wb=XLSX.utils.book_new();
  var add=function(name,aoa){ XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name.slice(0,31)); };

  add('Screen Dictionary', [['Screen ID','화면명','식별 기준','출처 원본 행번호','사용 TC 수']]
    .concat(DATA.screens.map(function(s){return [s.screen_id,s.name,s.criteria,rowsText(s.source_rows),s.used_tc_count];})));
  add('Target Dictionary', [['Target ID','대상명','Screen ID','식별 기준','출처 원본 행번호','사용 TC 수']]
    .concat(DATA.targets.map(function(t){return [t.target_id,t.name,t.screen_id,t.criteria,rowsText(t.source_rows),t.used_tc_count];})));
  add('State Dictionary', [['State ID','State Type','정의','판정 기준','출처 원본 행번호','사용 TC 수']]
    .concat(DATA.states.map(function(s){return [s.state_id,s.state_type,s.definition,s.criteria,rowsText(s.source_rows),s.used_tc_count];})));
  add('Transition Dictionary', [['Transition ID','시작 화면','Action','Target ID','도착 화면','설명','출처 원본 행번호']]
    .concat(DATA.transitions.map(function(t){return [t.transition_id,t.start_screen,t.action,t.target_id,t.dest_screen,t.description,rowsText(t.source_rows)];})));
  add('Converted TC', [['new_tc_id','title','purpose','source_sheet','source_row_numbers','source_tc_ids','conversion_type','conversion_note','priority','os','tc_attributes','automation_readiness','review_reason']]
    .concat(DATA.tcs.map(function(t){return [t.new_tc_id,t.title,t.purpose,t.source_sheet,rowsText(t.source_row_numbers),t.source_tc_ids.join(' '),t.conversion_type,t.conversion_note,t.priority,t.os,t.tc_attributes.join(', '),t.automation_readiness,t.review_reason];})));

  var stepAoa=[['new_tc_id','step_no','start_screen','precondition_data_state','precondition_ui_state','precondition_permission_state','target','target_parameter','action','action_parameter','result_screen','result_state']];
  DATA.tcs.forEach(function(t){ t.steps.forEach(function(s){
    stepAoa.push([s.new_tc_id,s.step_no,s.start_screen,s.precondition_data_state,s.precondition_ui_state,s.precondition_permission_state,s.target,s.target_parameter,s.action,s.action_parameter,s.result_screen,s.result_state]);
  });});
  add('Converted Steps', stepAoa);

  add('Source Mapping', [['source_row_number','source_tc_id','mapped_new_tc_ids','conversion_type','status']]
    .concat((DATA.unmapped||[]).map(function(u){return [u.source_row_number,u.source_tc_id,u.mapped_new_tc_ids.join(' '),u.conversion_type,u.status];}))
    .concat([['— 미연결 외 전체 매핑은 output/chat_conversion/source_tc_mapping.csv 참조 —','','','','']]));

  var s=DATA.summary;
  add('Conversion Summary', Object.keys(s).map(function(k){return [k, s[k]];}));

  XLSX.writeFile(wb, 'chat_conversion.xlsx');
}

function exportConversionCsv(){
  if(!DATA){ alert('변환 결과가 없습니다'); return; }
  var head=['new_tc_id','title','priority','os','conversion_type','automation_readiness','source_row_numbers','step_no','start_screen','precondition_data_state','precondition_ui_state','precondition_permission_state','target','target_parameter','action','action_parameter','result_screen','result_state'];
  var lines=[head.join(',')];
  DATA.tcs.forEach(function(t){ t.steps.forEach(function(s){
    lines.push([t.new_tc_id,t.title,t.priority,t.os,t.conversion_type,t.automation_readiness,rowsText(t.source_row_numbers),
      s.step_no,s.start_screen,s.precondition_data_state,s.precondition_ui_state,s.precondition_permission_state,
      s.target,s.target_parameter,s.action,s.action_parameter,s.result_screen,s.result_state]
      .map(csvCell).join(','));
  });});
  var blob=new Blob(['﻿'+lines.join('\n')],{type:'text/csv;charset=utf-8;'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='converted_tc_steps.csv'; a.click();
}
function csvCell(v){ v=String(v==null?'':v); return /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }
