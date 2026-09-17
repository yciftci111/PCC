/* PCCD Audit — opslag, paginaopbouw en export */

const STORE_KEY = 'pccd.v1';

const Store = {
  _cache: null,
  load() {
    if (Store._cache) return Store._cache;
    let data = null;
    try { data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { data = null; }
    if (!data || typeof data !== 'object') data = {};
    if (typeof data.org !== 'string') data.org = '';
    for (const k of Object.keys(QUESTIONNAIRES)) {
      if (!data[k] || typeof data[k] !== 'object') data[k] = { respondents: [], current: null };
      if (!Array.isArray(data[k].respondents)) data[k].respondents = [];
    }
    Store._cache = data;
    return data;
  },
  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Store.load())); } catch (e) {}
  },
  reset(qKey) {
    const d = Store.load();
    d[qKey] = { respondents: [], current: null };
    Store.save();
  }
};

function uid() { return 'r' + Math.random().toString(36).slice(2, 9); }

function addRespondent(qKey, label) {
  const d = Store.load();
  const q = d[qKey];
  const r = { id: uid(), label: label || defaultRespondentLabel(qKey), answers: {} };
  q.respondents.push(r);
  q.current = r.id;
  Store.save();
  return r;
}
function defaultRespondentLabel(qKey) {
  const n = Store.load()[qKey].respondents.length + 1;
  const t = Lang.t('respondent');
  return t.charAt(0).toUpperCase() + t.slice(1) + ' ' + n;
}
function currentRespondent(qKey) {
  const q = Store.load()[qKey];
  if (!q.respondents.length) return null;
  let r = q.respondents.find(x => x.id === q.current);
  if (!r) { r = q.respondents[0]; q.current = r.id; Store.save(); }
  return r;
}

/* ---------- scoreberekening ---------- */
// Pool op itemniveau over de geselecteerde respondenten: robuuster wanneer
// respondenten verschillende items op "niet van toepassing" zetten.
function dimMeans(qKey, respondents) {
  const q = QUESTIONNAIRES[qKey];
  const acc = {};
  q.dims.forEach(d => { acc[d.id] = { sum: 0, n: 0 }; });
  respondents.forEach(r => {
    q.items.forEach(it => {
      const v = r.answers[it.id];
      if (typeof v === 'number' && v >= 1 && v <= 5) {
        acc[it.dim].sum += v; acc[it.dim].n += 1;
      }
    });
  });
  const out = {};
  q.dims.forEach(d => {
    out[d.id] = acc[d.id].n ? { mean: acc[d.id].sum / acc[d.id].n, n: acc[d.id].n } : { mean: null, n: 0 };
  });
  return out;
}
function overallMean(qKey, respondents) {
  const m = dimMeans(qKey, respondents);
  const vals = Object.values(m).filter(x => x.mean !== null);
  if (!vals.length) return null;
  const totalN = vals.reduce((a, b) => a + b.n, 0);
  return vals.reduce((a, b) => a + b.mean * b.n, 0) / totalN;
}
function answeredCount(qKey, r) {
  if (!r) return 0;
  return QUESTIONNAIRES[qKey].items.filter(it => r.answers[it.id] !== undefined && r.answers[it.id] !== null).length;
}

/* ---------- chrome ---------- */
function buildChrome(active) {
  const L = Lang.get();
  document.documentElement.lang = L;
  const head = document.querySelector('[data-chrome]');
  if (!head) return;
  head.innerHTML = `
    <a class="brand" href="index.html">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text"><b>${Lang.t('siteTitle')}</b><small>${Lang.t('siteTagline')}</small></span>
    </a>
    <nav class="nav">
      <a href="index.html"${active === 'home' ? ' aria-current="page"' : ''}>${Lang.t('home')}</a>
      <a href="patienten.html"${active === 'patienten' ? ' aria-current="page"' : ''}>${QUESTIONNAIRES.patienten[L].title}</a>
      <a href="professionals.html"${active === 'professionals' ? ' aria-current="page"' : ''}>${QUESTIONNAIRES.professionals[L].title}</a>
      <a href="pcpi-s.html"${active === 'pcpis' ? ' aria-current="page"' : ''}>${QUESTIONNAIRES.pcpis[L].title}</a>
      <a href="vergelijking.html"${active === 'compare' ? ' aria-current="page"' : ''}>${Lang.t('compare')}</a>
    </nav>
    <div class="chrome-actions">
      <button type="button" class="ghost" id="langBtn">${Lang.t('langLabel')}</button>
      <button type="button" class="ghost icon" id="themeBtn" aria-label="${Lang.t('themeDark')}" title="${Lang.t('themeDark')}">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
          <circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2M12 19.6v2M2.4 12h2M19.6 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>
        </svg>
      </button>
    </div>`;
  head.querySelector('#langBtn').addEventListener('click', () => {
    Lang.set(Lang.get() === 'nl' ? 'en' : 'nl');
    location.reload();
  });
  head.querySelector('#themeBtn').addEventListener('click', () => {
    Theme.toggle();
    window.dispatchEvent(new Event('pccd:theme'));
  });
}

function axisLabel(dm, L) { return dm[L === 'nl' ? 'shortNl' : 'shortEn'] || dm[L]; }

function fmt(v, dec = 2) { return v === null || v === undefined ? '—' : v.toFixed(dec); }

/* ---------- homepage ---------- */
function buildHome() {
  buildChrome('home');
  const L = Lang.get();
  document.title = Lang.t('siteTitle') + ' — ' + Lang.t('siteTagline');
  const hero = document.getElementById('hero');
  hero.innerHTML = `
    <h1>${Lang.t('heroTitle')}</h1>
    <p class="lead">${Lang.t('heroLead')}</p>
    <p class="fineprint">${Lang.t('heroNote')}</p>`;

  const grid = document.getElementById('cards');
  grid.innerHTML = '';
  Object.values(QUESTIONNAIRES).forEach(q => {
    const d = Store.load()[q.key];
    const reps = d.respondents;
    const means = dimMeans(q.key, reps);
    const vals = q.dims.map(dm => means[dm.id].mean);
    const has = vals.some(v => v !== null);
    const avg = overallMean(q.key, reps);

    const card = document.createElement('a');
    card.className = 'card';
    card.href = q.file;
    card.innerHTML = `
      <div class="card-viz" data-viz="${q.key}"></div>
      <div class="card-body">
        <span class="card-eyebrow">${q.dims.length} ${Lang.t('dimensions')} · ${q.items.length} ${Lang.t('items')}</span>
        <h2>${q[L].title}</h2>
        <p>${q[L].subtitle}</p>
        <div class="card-meta">
          <span class="chip${reps.length ? ' chip-on' : ''}">${reps.length} ${reps.length === 1 ? Lang.t('respondent') : Lang.t('respondents')}</span>
          ${has ? `<span class="chip">${Lang.t('avgScore')} ${fmt(avg)}</span>` : `<span class="chip chip-muted">${Lang.t('noData')}</span>`}
        </div>
        <span class="card-cta">${Lang.t('openList')} <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4"/></svg></span>
      </div>`;
    grid.appendChild(card);

    const host = card.querySelector('[data-viz]');
    if (has) {
      renderRadar(host, {
        compact: true, min: 1, max: 5,
        axes: q.dims.map(dm => ({ label: axisLabel(dm, L), full: dm[L] })),
        series: [{ name: q[L].title, color: vizColors().series[q.series - 1], values: vals }]
      });
    } else {
      renderRadar(host, {
        compact: true, min: 1, max: 5,
        axes: q.dims.map(dm => ({ label: axisLabel(dm, L), full: dm[L] })),
        series: [{ name: '', color: vizColors().grid, values: q.dims.map(() => 3) }]
      });
      host.classList.add('is-placeholder');
    }
  });

  const cmp = document.getElementById('compareCta');
  if (cmp) {
    cmp.innerHTML = `
      <div>
        <h2>${Lang.t('compareTitle')}</h2>
        <p>${Lang.t('compareLead')}</p>
      </div>
      <a class="btn" href="vergelijking.html">${Lang.t('compareTitle')}</a>`;
  }
  window.addEventListener('pccd:theme', () => location.reload());
}

/* ---------- vragenlijstpagina ---------- */
function buildQuestionnaire(qKey) {
  buildChrome(qKey);
  const L = Lang.get();
  const q = QUESTIONNAIRES[qKey];
  document.title = q[L].title + ' — ' + Lang.t('siteTitle');
  const data = Store.load();
  if (!data[qKey].respondents.length) addRespondent(qKey);

  const root = document.getElementById('app');
  root.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">${q.dims.length} ${Lang.t('dimensions')} · ${q.items.length} ${Lang.t('items')}</span>
      <h1>${q[L].title}</h1>
      <p class="lead">${q[L].intro}</p>
    </header>

    <div class="toolbar no-print">
      <label class="field">
        <span>${Lang.t('orgLabel')}</span>
        <input type="text" id="orgInput" placeholder="${Lang.t('orgPlaceholder')}" value="${escapeHtml(data.org)}">
      </label>
      <label class="field">
        <span>${Lang.t('respondentLabel')}</span>
        <select id="respSelect"></select>
      </label>
      <div class="field-actions">
        <button type="button" class="btn small" id="addResp">${Lang.t('addRespondent')}</button>
        <button type="button" class="ghost small" id="renameResp">${Lang.t('renameRespondent')}</button>
        <button type="button" class="ghost small danger" id="delResp">${Lang.t('deleteRespondent')}</button>
      </div>
    </div>

    <div class="progress no-print">
      <div class="progress-bar"><span id="progFill"></span></div>
      <span class="progress-text" id="progText"></span>
      <span class="progress-note">${Lang.t('savedNote')}</span>
    </div>

    <div class="layout${q.dims.length > 10 ? ' layout-stack' : ''}">
      <section class="questions no-print" id="questions" aria-label="${q[L].title}"></section>
      <aside class="results" id="results"></aside>
    </div>`;

  const orgInput = root.querySelector('#orgInput');
  orgInput.addEventListener('input', () => {
    Store.load().org = orgInput.value;
    Store.save();
    renderStem();
    renderResults();
  });

  const sel = root.querySelector('#respSelect');
  function fillSelect() {
    const qd = Store.load()[qKey];
    sel.innerHTML = qd.respondents.map(r =>
      `<option value="${r.id}"${r.id === qd.current ? ' selected' : ''}>${escapeHtml(r.label)}</option>`).join('');
  }
  sel.addEventListener('change', () => {
    Store.load()[qKey].current = sel.value;
    Store.save(); renderAll();
  });
  root.querySelector('#addResp').addEventListener('click', () => {
    const name = prompt(Lang.t('newRespondentName'), defaultRespondentLabel(qKey));
    if (name === null) return;
    addRespondent(qKey, name.trim() || undefined);
    renderAll();
  });
  root.querySelector('#renameResp').addEventListener('click', () => {
    const r = currentRespondent(qKey); if (!r) return;
    const name = prompt(Lang.t('newRespondentName'), r.label);
    if (name === null) return;
    r.label = name.trim() || r.label; Store.save(); renderAll();
  });
  root.querySelector('#delResp').addEventListener('click', () => {
    const qd = Store.load()[qKey];
    if (!confirm(Lang.t('confirmDelete'))) return;
    qd.respondents = qd.respondents.filter(r => r.id !== qd.current);
    qd.current = qd.respondents.length ? qd.respondents[0].id : null;
    if (!qd.respondents.length) addRespondent(qKey);
    Store.save(); renderAll();
  });

  /* --- vragen --- */
  const qHost = root.querySelector('#questions');
  function renderQuestions() {
    const r = currentRespondent(qKey);
    qHost.innerHTML = '';
    if (q[L].stem) {
      const s = document.createElement('p');
      s.className = 'stem';
      s.id = 'stemLine';
      qHost.appendChild(s);
    }
    const key = document.createElement('div');
    key.className = 'scalekey';
    key.innerHTML = SCALE_LABELS[L].map((lab, i) =>
      `<span><b>${i + 1}</b> ${lab}</span>`).join('') +
      `<span class="scalekey-na"><b>–</b> ${NVT_LABEL[L]}</span>`;
    qHost.appendChild(key);
    const groups = q.domains
      ? q.domains.map(dom => ({ head: dom[L], dims: q.dims.filter(d => d.domain === dom.id) }))
      : [{ head: null, dims: q.dims }];

    groups.forEach(gr => {
      if (gr.head) {
        const h = document.createElement('h2');
        h.className = 'domain-head';
        h.textContent = gr.head;
        qHost.appendChild(h);
      }
      gr.dims.forEach(dm => {
        const sec = document.createElement('section');
        sec.className = 'dim';
        sec.id = 'dim-' + dm.id;
        sec.innerHTML = `<h3 class="dim-head">${dm[L]}</h3>`;
        q.items.filter(it => it.dim === dm.id).forEach(it => {
          const val = r.answers[it.id];
          const row = document.createElement('div');
          row.className = 'item';
          const opts = SCALE_LABELS[L].map((lab, i) => {
            const v = i + 1;
            return `<label class="opt${val === v ? ' on' : ''}" title="${lab}">
                      <input type="radio" name="${it.id}" value="${v}"${val === v ? ' checked' : ''}>
                      <span class="opt-num">${v}</span>
                      <span class="opt-lab">${lab}</span>
                    </label>`;
          }).join('');
          const nvt = it.nvt ? `<label class="opt opt-na${val === 'na' ? ' on' : ''}" title="${NVT_LABEL[L]}">
                      <input type="radio" name="${it.id}" value="na"${val === 'na' ? ' checked' : ''}>
                      <span class="opt-num">–</span>
                      <span class="opt-lab">${NVT_LABEL[L]}</span>
                    </label>` : '';
          row.innerHTML = `
            <p class="item-text"><span class="item-id">${it.id.replace(/^\D+/, '')}</span>${escapeHtml(it.text)}</p>
            <div class="opts">${opts}${nvt}
              <button type="button" class="clear" data-clear="${it.id}"${val === undefined ? ' hidden' : ''}>${Lang.t('clearAnswer')}</button>
            </div>`;
          sec.appendChild(row);
        });
        qHost.appendChild(sec);
      });
    });

    qHost.addEventListener('change', onAnswer);
    qHost.querySelectorAll('[data-clear]').forEach(b => b.addEventListener('click', () => {
      const rr = currentRespondent(qKey);
      delete rr.answers[b.dataset.clear];
      Store.save(); renderQuestions(); renderResults(); renderProgress();
    }));
    renderStem();
  }
  function onAnswer(e) {
    const t = e.target;
    if (t.type !== 'radio') return;
    const r = currentRespondent(qKey);
    r.answers[t.name] = t.value === 'na' ? 'na' : Number(t.value);
    Store.save();
    // markeer zonder de hele lijst te hertekenen (scrollpositie blijft staan)
    const row = t.closest('.item');
    row.querySelectorAll('.opt').forEach(o => o.classList.toggle('on', o.contains(t)));
    const btn = row.querySelector('[data-clear]');
    if (btn) btn.hidden = false;
    renderResults(); renderProgress();
  }
  function renderStem() {
    const s = document.getElementById('stemLine');
    if (!s) return;
    const org = Store.load().org.trim();
    s.textContent = q[L].stem.replace('{org}', org || (L === 'nl' ? '‘naam organisatie’' : '‘organisation name’'));
  }

  /* --- voortgang --- */
  function renderProgress() {
    const r = currentRespondent(qKey);
    const done = answeredCount(qKey, r);
    const pct = Math.round(done / q.items.length * 100);
    root.querySelector('#progFill').style.width = pct + '%';
    root.querySelector('#progText').textContent = `${done} ${Lang.t('of')} ${q.items.length} ${Lang.t('progress')}`;
  }

  /* --- resultaten --- */
  let scope = 'all';
  let view = 'chart';
  function renderResults() {
    const qd = Store.load()[qKey];
    const reps = scope === 'all' ? qd.respondents : [currentRespondent(qKey)].filter(Boolean);
    const means = dimMeans(qKey, reps);
    const vals = q.dims.map(d => means[d.id].mean);
    const has = vals.some(v => v !== null);
    const org = Store.load().org.trim();
    const host = root.querySelector('#results');

    host.innerHTML = `
      <div class="results-head">
        <h2>${Lang.t('resultTitle')}</h2>
        <p class="fineprint">${org ? escapeHtml(org) + ' · ' : ''}${reps.length} ${reps.length === 1 ? Lang.t('respondent') : Lang.t('respondents')} · ${Lang.t('resultLead')}</p>
        <div class="seg no-print" role="group">
          <button type="button" data-scope="all"${scope === 'all' ? ' class="on"' : ''}>${Lang.t('allRespondents')}</button>
          <button type="button" data-scope="one"${scope === 'one' ? ' class="on"' : ''}>${Lang.t('currentOnly')}</button>
        </div>
        <div class="seg no-print" role="group">
          <button type="button" data-view="chart"${view === 'chart' ? ' class="on"' : ''}>${Lang.t('chartView')}</button>
          <button type="button" data-view="table"${view === 'table' ? ' class="on"' : ''}>${Lang.t('tableView')}</button>
        </div>
      </div>
      <div class="viz-wrap" id="viz"${view === 'chart' ? '' : ' hidden'}></div>
      <div id="tbl"${view === 'table' ? '' : ' hidden'}></div>
      <p class="fineprint">${Lang.t('scaleNote')}</p>
      <div class="export no-print">
        <button type="button" class="btn small" id="expPng">${Lang.t('exportPng')}</button>
        <button type="button" class="ghost small" id="expCsv">${Lang.t('exportCsv')}</button>
        <button type="button" class="ghost small" id="expPdf">${Lang.t('exportPdf')}</button>
        <button type="button" class="ghost small danger" id="resetAll">${Lang.t('resetAll')}</button>
      </div>`;

    const viz = host.querySelector('#viz');
    if (has) {
      renderRadar(viz, {
        min: 1, max: 5,
        axes: q.dims.map(d => ({ label: axisLabel(d, L), full: d[L] })),
        series: [{ name: q[L].title, color: vizColors().series[q.series - 1], values: vals }],
        ariaLabel: q[L].title
      });
    } else {
      viz.innerHTML = `<p class="viz-empty">${Lang.t('noAnswersYet')}</p>`;
    }

    // tabelweergave (toegankelijkheid + aflezen)
    const rowsHtml = [];
    const groups = q.domains
      ? q.domains.map(dom => ({ head: dom[L], dims: q.dims.filter(d => d.domain === dom.id) }))
      : [{ head: null, dims: q.dims }];
    groups.forEach(gr => {
      if (gr.head) rowsHtml.push(`<tr class="tr-head"><th colspan="3">${gr.head}</th></tr>`);
      gr.dims.forEach(d => {
        const m = means[d.id];
        rowsHtml.push(`<tr><td>${d[L]}</td><td class="num">${fmt(m.mean)}</td><td class="num muted">${m.n}</td></tr>`);
      });
    });
    host.querySelector('#tbl').innerHTML = `
      <table class="tbl">
        <thead><tr><th>${Lang.t('dimension')}</th><th class="num">${Lang.t('score')}</th><th class="num">${Lang.t('answered')}</th></tr></thead>
        <tbody>${rowsHtml.join('')}</tbody>
      </table>`;

    host.querySelectorAll('[data-scope]').forEach(b => b.addEventListener('click', () => { scope = b.dataset.scope; renderResults(); }));
    host.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; renderResults(); }));
    host.querySelector('#expPng').addEventListener('click', () => {
      if (view !== 'chart') { view = 'chart'; renderResults(); }
      radarToPng(root.querySelector('#viz'), `pccd-${qKey}${org ? '-' + slug(org) : ''}.png`);
    });
    host.querySelector('#expCsv').addEventListener('click', () => exportCsv(qKey));
    host.querySelector('#expPdf').addEventListener('click', () => window.print());
    host.querySelector('#resetAll').addEventListener('click', () => {
      if (!confirm(Lang.t('confirmReset'))) return;
      Store.reset(qKey); addRespondent(qKey); renderAll();
    });
  }

  function renderAll() { fillSelect(); renderQuestions(); renderProgress(); renderResults(); }
  renderAll();
  window.addEventListener('pccd:theme', renderResults);
}

/* ---------- vergelijkingspagina ---------- */
function buildCompare() {
  buildChrome('compare');
  const L = Lang.get();
  document.title = Lang.t('compareTitle') + ' — ' + Lang.t('siteTitle');
  const root = document.getElementById('app');
  const d = Store.load();
  const P = QUESTIONNAIRES.patienten, F = QUESTIONNAIRES.professionals, S = QUESTIONNAIRES.pcpis;
  const mp = dimMeans('patienten', d.patienten.respondents);
  const mf = dimMeans('professionals', d.professionals.respondents);
  const ms = dimMeans('pcpis', d.pcpis.respondents);
  const vp = PCC_DIMS.map(dm => mp[dm.id].mean);
  const vf = PCC_DIMS.map(dm => mf[dm.id].mean);
  const vs = S.dims.map(dm => ms[dm.id].mean);
  const hasP = vp.some(v => v !== null), hasF = vf.some(v => v !== null), hasS = vs.some(v => v !== null);
  const C = vizColors();
  let mode = 'overlay';

  root.innerHTML = `
    <header class="page-head">
      <span class="eyebrow">${Lang.t('compareTitle')}</span>
      <h1>${Lang.t('compareTitle')}</h1>
      <p class="lead">${Lang.t('compareLead')}</p>
    </header>
    <div class="seg no-print" role="group" id="modeSeg">
      <button type="button" data-mode="overlay" class="on">${Lang.t('overlay')}</button>
      <button type="button" data-mode="separate">${Lang.t('separate')}</button>
    </div>
    <div id="cmpViz"></div>
    <div id="diffBlock"></div>
    <section class="panel">
      <h2>${S[L].title}</h2>
      <p class="fineprint">${Lang.t('pcpisSeparate')}</p>
      <div class="viz-wrap" id="pcpisViz"></div>
    </section>
    <div class="export no-print">
      <button type="button" class="btn small" id="expPng">${Lang.t('exportPng')}</button>
      <button type="button" class="ghost small" id="expPdf">${Lang.t('exportPdf')}</button>
    </div>`;

  function draw() {
    const host = root.querySelector('#cmpViz');
    host.innerHTML = '';
    if (!hasP && !hasF) {
      host.innerHTML = `<p class="viz-empty panel">${Lang.t('noCompareData')}</p>`;
      return;
    }
    const axes = PCC_DIMS.map(dm => ({ label: axisLabel(dm, L), full: dm[L] }));
    const sp = { name: P[L].title, color: C.series[0], values: vp };
    const sf = { name: F[L].title, color: C.series[1], values: vf };
    if (mode === 'overlay') {
      const w = document.createElement('div');
      w.className = 'viz-wrap';
      host.appendChild(w);
      renderRadar(w, { min: 1, max: 5, axes, series: [sp, sf], ariaLabel: 'Patiënten vs professionals' });
    } else {
      const g = document.createElement('div');
      g.className = 'viz-duo';
      host.appendChild(g);
      [[sp, hasP], [sf, hasF]].forEach(([s, ok]) => {
        const w = document.createElement('div');
        w.className = 'viz-wrap';
        w.innerHTML = `<h3 class="viz-title">${s.name}</h3>`;
        const inner = document.createElement('div');
        inner.style.position = 'relative';
        w.appendChild(inner);
        g.appendChild(w);
        if (ok) renderRadar(inner, { min: 1, max: 5, axes, series: [s], ariaLabel: s.name });
        else inner.innerHTML = `<p class="viz-empty">${Lang.t('noAnswersYet')}</p>`;
      });
    }
  }

  function drawDiff() {
    const host = root.querySelector('#diffBlock');
    if (!hasP || !hasF) { host.innerHTML = ''; return; }
    const rows = PCC_DIMS.map((dm, i) => ({ dm, p: vp[i], f: vf[i], diff: (vp[i] !== null && vf[i] !== null) ? vf[i] - vp[i] : null }));
    const sorted = rows.filter(r => r.diff !== null).slice().sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    const top = sorted[0];
    host.innerHTML = `
      <section class="panel">
        <h2>${Lang.t('difference')}</h2>
        <p class="fineprint">${Lang.t('diffExplain')}</p>
        ${top ? `<p class="callout"><strong>${Lang.t('largestGap')}:</strong> ${top.dm[L]} — ${fmt(top.diff)}</p>` : ''}
        <table class="tbl">
          <thead><tr><th>${Lang.t('dimension')}</th><th class="num">${Lang.t('patients')}</th><th class="num">${Lang.t('professionals')}</th><th class="num">${Lang.t('difference')}</th></tr></thead>
          <tbody>${rows.map(r => `<tr><td>${r.dm[L]}</td><td class="num">${fmt(r.p)}</td><td class="num">${fmt(r.f)}</td><td class="num ${r.diff === null ? '' : (Math.abs(r.diff) >= 0.5 ? 'flag' : '')}">${r.diff === null ? '—' : (r.diff > 0 ? '+' : '') + r.diff.toFixed(2)}</td></tr>`).join('')}</tbody>
        </table>
      </section>`;
  }

  const pv = root.querySelector('#pcpisViz');
  if (hasS) {
    renderRadar(pv, {
      min: 1, max: 5,
      axes: S.dims.map(dm => ({ label: axisLabel(dm, L), full: dm[L] })),
      series: [{ name: S[L].title, color: C.series[2], values: vs }],
      ariaLabel: S[L].title
    });
  } else {
    pv.innerHTML = `<p class="viz-empty">${Lang.t('noAnswersYet')}</p>`;
  }

  root.querySelectorAll('#modeSeg button').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode;
    root.querySelectorAll('#modeSeg button').forEach(x => x.classList.toggle('on', x === b));
    draw();
  }));
  root.querySelector('#expPng').addEventListener('click', () => {
    const w = root.querySelector('#cmpViz .viz-wrap');
    if (w) radarToPng(w, 'pccd-vergelijking.png');
  });
  root.querySelector('#expPdf').addEventListener('click', () => window.print());

  draw(); drawDiff();
  window.addEventListener('pccd:theme', () => location.reload());
}

/* ---------- export & hulp ---------- */
function exportCsv(qKey) {
  const L = Lang.get();
  const q = QUESTIONNAIRES[qKey];
  const d = Store.load();
  const dimName = {}; q.dims.forEach(x => dimName[x.id] = x[L]);
  const head = ['organisatie', 'vragenlijst', 'respondent', 'item', 'dimensie', 'vraag', 'score'];
  const lines = [head.join(';')];
  d[qKey].respondents.forEach(r => {
    q.items.forEach(it => {
      const v = r.answers[it.id];
      lines.push([d.org, q[L].title, r.label, it.id, dimName[it.dim], it.text,
        v === undefined ? '' : (v === 'na' ? 'n.v.t.' : v)].map(csvCell).join(';'));
    });
  });
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pccd-${qKey}${d.org ? '-' + slug(d.org) : ''}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function csvCell(v) {
  const s = String(v ?? '');
  return /[";\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function slug(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
