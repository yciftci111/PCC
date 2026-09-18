/* PCCD Audit — analyse: steekproef, schaalkaarten, itemverdelingen en correlaties.
   Alle berekeningen gebeuren in de browser op de respondenten die je hebt
   ingevoerd of geimporteerd. */

/* ---------- statistiek ---------- */
function mean(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null; }
function variance(a) {
  if (a.length < 2) return null;
  const m = mean(a);
  return a.reduce((x, y) => x + (y - m) * (y - m), 0) / (a.length - 1);
}
function sd(a) { const v = variance(a); return v === null ? null : Math.sqrt(v); }

// Score van een respondent op een dimensie: gemiddelde van de beantwoorde items.
// Vereist minstens de helft van de items, anders telt de respondent niet mee.
function respondentDimScore(qKey, r, dimId) {
  const items = QUESTIONNAIRES[qKey].items.filter(i => i.dim === dimId);
  const vals = items.map(i => r.answers[i.id]).filter(v => typeof v === 'number');
  if (vals.length < Math.ceil(items.length / 2)) return null;
  return mean(vals);
}

// Cronbachs alfa over de respondenten met volledige data op deze schaal
function cronbachAlpha(qKey, dimId, respondents) {
  const items = QUESTIONNAIRES[qKey].items.filter(i => i.dim === dimId);
  const k = items.length;
  if (k < 2) return null;
  const rows = [];
  respondents.forEach(r => {
    const vals = items.map(i => r.answers[i.id]);
    if (vals.every(v => typeof v === 'number')) rows.push(vals);
  });
  if (rows.length < 3) return null;
  let sumItemVar = 0;
  for (let j = 0; j < k; j++) {
    const v = variance(rows.map(x => x[j]));
    if (v === null) return null;
    sumItemVar += v;
  }
  const totVar = variance(rows.map(x => x.reduce((a, b) => a + b, 0)));
  if (!totVar) return null;
  return { alpha: (k / (k - 1)) * (1 - sumItemVar / totVar), n: rows.length, k };
}

function pearson(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(p => p[0] !== null && p[1] !== null);
  if (pairs.length < 3) return null;
  const a = pairs.map(p => p[0]), b = pairs.map(p => p[1]);
  const ma = mean(a), mb = mean(b);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  if (!da || !db) return null;
  return { r: num / Math.sqrt(da * db), n: pairs.length };
}

function itemStats(qKey, item, respondents) {
  const dist = [0, 0, 0, 0, 0];
  let na = 0, blank = 0;
  const vals = [];
  respondents.forEach(r => {
    const v = r.answers[item.id];
    if (typeof v === 'number' && v >= 1 && v <= 5) { dist[v - 1]++; vals.push(v); }
    else if (v === 'na') na++;
    else blank++;
  });
  return { mean: mean(vals), sd: sd(vals), n: vals.length, dist, na, blank };
}

/* ---------- filteren ---------- */
function respondentsFor(qKey, filters) {
  const all = Store.load()[qKey].respondents;
  const keys = Object.keys(filters || {}).filter(k => filters[k] && filters[k].length);
  if (!keys.length) return all;
  return all.filter(r => keys.every(k => {
    const v = (r.meta || {})[k];
    return v !== undefined && v !== '' && filters[k].includes(String(v));
  }));
}

function bgCounts(qKey, field, respondents) {
  const out = {};
  respondents.forEach(r => {
    const v = (r.meta || {})[field.id];
    const key = (v === undefined || v === '') ? '__leeg' : String(v);
    out[key] = (out[key] || 0) + 1;
  });
  return out;
}

/* ---------- pagina ---------- */
function buildAnalysis() {
  buildChrome('analyse');
  if (!researcherUnlocked()) return renderLock();
  const L = Lang.get();
  document.title = Lang.t('analysisTitle') + ' — ' + Lang.t('siteTitle');
  const root = document.getElementById('app');

  let qKey = 'patienten';
  let tab = 'overzicht';
  let filters = {};
  try {
    const saved = JSON.parse(sessionStorage.getItem('pccd.analysis') || 'null');
    if (saved) { qKey = saved.qKey || qKey; tab = saved.tab || tab; filters = saved.filters || {}; }
  } catch (e) {}
  const remember = () => {
    try { sessionStorage.setItem('pccd.analysis', JSON.stringify({ qKey, tab, filters })); } catch (e) {}
  };

  const TABS = [
    ['overzicht', 'tabOverview'],
    ['steekproef', 'tabSample'],
    ['schalen', 'tabScales'],
    ['correlaties', 'tabCorrelations']
  ];

  function shell() {
    const q = QUESTIONNAIRES[qKey];
    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${Lang.t('analysisEyebrow')}</span>
        <h1>${Lang.t('analysisTitle')}</h1>
        <p class="lead">${Lang.t('analysisLead')}</p>
      </header>

      <div class="qswitch no-print" role="group" aria-label="${Lang.t('analysisPick')}">
        ${Object.values(QUESTIONNAIRES).map(x => {
          const n = Store.load()[x.key].respondents.length;
          return `<button type="button" data-q="${x.key}"${x.key === qKey ? ' class="on"' : ''}>
            ${x[L].title} <span class="qswitch-n">${n}</span></button>`;
        }).join('')}
      </div>

      <div class="analysis">
        <aside class="filters no-print" id="filters"></aside>
        <div class="analysis-main">
          <nav class="tabs no-print" id="tabs">
            ${TABS.map(([id, key]) => `<button type="button" data-tab="${id}"${id === tab ? ' class="on"' : ''}>${Lang.t(key)}</button>`).join('')}
          </nav>
          <div id="tabBody"></div>
        </div>
      </div>`;

    root.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
      qKey = b.dataset.q; filters = {}; remember(); shell();
    }));
    root.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      tab = b.dataset.tab; remember();
      root.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b));
      renderTab();
    }));
    renderFilters();
    renderTab();
  }

  /* --- filterkolom --- */
  function renderFilters() {
    const host = root.querySelector('#filters');
    const all = Store.load()[qKey].respondents;
    const fields = bgFields(qKey).filter(f => f.type === 'choice');
    const active = Object.values(filters).reduce((a, b) => a + (b ? b.length : 0), 0);

    host.innerHTML = `
      <div class="filters-head">
        <h2>${Lang.t('filters')}</h2>
        ${active ? `<button type="button" class="linkbtn" id="clearFilters">${Lang.t('clearFilters')}</button>` : ''}
      </div>
      ${fields.map(f => {
        const counts = bgCounts(qKey, f, all);
        const chosen = filters[f.id] || [];
        const open = chosen.length > 0;
        return `<details class="filtergroup"${open ? ' open' : ''}>
          <summary>${f[L]}${chosen.length ? ` <span class="filter-badge">${chosen.length}</span>` : ''}</summary>
          <div class="filteropts">
            ${f.opts.map(([val, nl, en]) => {
              const n = counts[val] || 0;
              return `<label class="filteropt${n ? '' : ' is-empty'}">
                <input type="checkbox" data-f="${f.id}" value="${val}"${chosen.includes(val) ? ' checked' : ''}${n ? '' : ' disabled'}>
                <span>${L === 'nl' ? nl : en}</span><b>${n}</b></label>`;
            }).join('')}
            ${counts.__leeg ? `<p class="filter-note">${counts.__leeg} ${Lang.t('withoutAnswer')}</p>` : ''}
          </div>
        </details>`;
      }).join('')}
      <p class="fineprint filters-note">${Lang.t('filtersNote')}</p>`;

    host.querySelectorAll('[data-f]').forEach(cb => cb.addEventListener('change', () => {
      const id = cb.dataset.f;
      filters[id] = filters[id] || [];
      if (cb.checked) filters[id].push(cb.value);
      else filters[id] = filters[id].filter(v => v !== cb.value);
      if (!filters[id].length) delete filters[id];
      remember(); renderFilters(); renderTab();
    }));
    const c = host.querySelector('#clearFilters');
    if (c) c.addEventListener('click', () => { filters = {}; remember(); renderFilters(); renderTab(); });
  }

  /* --- inhoud per tab --- */
  function renderTab() {
    const body = root.querySelector('#tabBody');
    const all = Store.load()[qKey].respondents;
    const sel = respondentsFor(qKey, filters);
    if (!all.length) {
      body.innerHTML = `<section class="panel"><p class="viz-empty">${Lang.t('analysisNoData')}</p></section>`;
      return;
    }
    const banner = `<p class="selection-note">${
      sel.length === all.length
        ? `${Lang.t('viewingAll')} ${all.length} ${all.length === 1 ? Lang.t('respondent') : Lang.t('respondents')}.`
        : `<strong>${sel.length}</strong> ${Lang.t('of')} ${all.length} ${Lang.t('respondents')} ${Lang.t('matchFilters')}.`
    }</p>`;
    if (tab === 'overzicht') body.innerHTML = banner + tabOverview(sel);
    else if (tab === 'steekproef') body.innerHTML = banner + tabSample(sel, all);
    else if (tab === 'schalen') body.innerHTML = banner + tabScales(sel);
    else body.innerHTML = banner + tabCorr(sel);
    if (tab === 'overzicht') drawOverviewRadar(sel);
    wireToggles(body);
  }

  function wireToggles(body) {
    body.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      const t = body.querySelector('#' + b.dataset.toggle);
      if (t) t.hidden = !t.hidden;
      b.classList.toggle('on', t && !t.hidden);
    }));
  }

  /* --- 1. overzicht: schaalkaarten --- */
  function tabOverview(sel) {
    const q = QUESTIONNAIRES[qKey];
    const cards = q.dims.map(d => {
      const scores = sel.map(r => respondentDimScore(qKey, r, d.id)).filter(v => v !== null);
      const m = mean(scores), s = sd(scores);
      const a = cronbachAlpha(qKey, d.id, sel);
      const pct = m === null ? 0 : ((m - 1) / 4) * 100;
      const col = m === null ? 'var(--border-strong)' : scaleColor(m);
      return `<article class="statcard" style="--accent-bar:${col}">
        <h3>${d[L]}</h3>
        <p class="statcard-num">${m === null ? '—' : m.toFixed(2)}<span> / 5</span></p>
        <p class="statcard-sub">SD ${s === null ? '—' : s.toFixed(2)} · n ${scores.length}</p>
        <div class="statbar"><span style="left:${pct}%; background:${col}"></span></div>
        <div class="statbar-ax"><span>1</span><span>3</span><span>5</span></div>
        ${a ? `<p class="statcard-alpha" title="${Lang.t('alphaHelp')}">
            <b class="${a.alpha >= 0.7 ? 'ok' : 'warn'}">α ${a.alpha.toFixed(2)}</b> ${Lang.t('reliability')} · ${a.k} items, n ${a.n}</p>`
          : `<p class="statcard-alpha muted">${Lang.t('alphaTooFew')}</p>`}
      </article>`;
    }).join('');

    const allScores = q.dims.map(d => sel.map(r => respondentDimScore(qKey, r, d.id)).filter(v => v !== null));
    const flat = allScores.flat();
    return `
      <section class="panel">
        <h2>${Lang.t('tabOverview')}</h2>
        <p class="fineprint">${Lang.t('overviewLead')}</p>
        <div class="statgrid">${cards}</div>
      </section>
      <section class="panel">
        <h2>${Lang.t('profileTitle')}</h2>
        <p class="fineprint">${Lang.t('profileLead')}</p>
        <div class="viz-wrap" id="anaViz"></div>
      </section>
      <div id="anaAdvice"></div>
      ${flat.length ? '' : `<section class="panel"><p class="viz-empty">${Lang.t('noAnswersYet')}</p></section>`}`;
  }

  function drawOverviewRadar(sel) {
    const q = QUESTIONNAIRES[qKey];
    const host = root.querySelector('#anaViz');
    if (!host) return;
    const means = {};
    q.dims.forEach(d => {
      const acc = [];
      sel.forEach(r => q.items.filter(i => i.dim === d.id).forEach(i => {
        const v = r.answers[i.id];
        if (typeof v === 'number') acc.push(v);
      }));
      means[d.id] = { mean: acc.length ? mean(acc) : null, n: acc.length };
    });
    const vals = q.dims.map(d => means[d.id].mean);
    if (!vals.some(v => v !== null)) { host.innerHTML = `<p class="viz-empty">${Lang.t('noAnswersYet')}</p>`; return; }
    renderRadar(host, {
      min: 1, max: 5,
      axes: q.dims.map(d => ({ label: axisLabel(d, L), full: d[L] })),
      series: [{ name: q[L].title, color: vizColors().series[q.series - 1], values: vals }],
      ariaLabel: q[L].title
    });
    renderAdvice(root.querySelector('#anaAdvice'), qKey, means, L, qKey === 'patienten' ? 'pat' : 'org');
  }

  /* --- 2. steekproef --- */
  function tabSample(sel, all) {
    const fields = bgFields(qKey);
    const q = QUESTIONNAIRES[qKey];
    const complete = sel.filter(r => q.items.every(i => r.answers[i.id] !== undefined)).length;
    const answered = sel.map(r => q.items.filter(i => r.answers[i.id] !== undefined).length);
    const avgDone = answered.length ? Math.round(mean(answered) / q.items.length * 100) : 0;

    const top = (field) => {
      if (field.type !== 'choice') return null;
      const c = bgCounts(qKey, field, sel);
      let best = null;
      field.opts.forEach(([v, nl, en]) => {
        if ((c[v] || 0) > (best ? best.n : 0)) best = { label: L === 'nl' ? nl : en, n: c[v] };
      });
      if (!best || !best.n) return null;
      return { label: best.label, pct: Math.round(best.n / sel.length * 100) };
    };
    const g = top(BG_COMMON[0]), a = top(BG_COMMON[1]);

    const tiles = [
      [sel.length, Lang.t('respondents')],
      [g ? `${g.pct}%` : '—', g ? g.label : Lang.t('noData')],
      [a ? a.label : '—', a ? `${a.pct}% · ${Lang.t('largestAgeGroup')}` : Lang.t('noData')],
      [`${complete}`, Lang.t('fullyCompleted')],
      [`${avgDone}%`, Lang.t('avgCompleted')]
    ].map(([big, small]) => `<div class="tile"><b>${big}</b><span>${small}</span></div>`).join('');

    const tables = fields.map(f => {
      if (f.type === 'text') {
        const vals = {};
        sel.forEach(r => {
          const v = ((r.meta || {})[f.id] || '').trim();
          if (v) vals[v] = (vals[v] || 0) + 1;
        });
        const rows = Object.entries(vals).sort((x, y) => y[1] - x[1]);
        if (!rows.length) return '';
        return `<div class="bgblock"><h3>${f[L]}</h3><table class="tbl">
          <tbody>${rows.map(([k, n]) => `<tr><td>${escapeHtml(k)}</td><td class="num">${n}</td>
            <td class="num muted">${Math.round(n / sel.length * 100)}%</td></tr>`).join('')}</tbody></table></div>`;
      }
      const c = bgCounts(qKey, f, sel);
      const max = Math.max(1, ...f.opts.map(([v]) => c[v] || 0));
      return `<div class="bgblock"><h3>${f[L]}</h3>
        <table class="tbl bgtable"><tbody>
          ${f.opts.map(([v, nl, en]) => {
            const n = c[v] || 0;
            const pct = sel.length ? Math.round(n / sel.length * 100) : 0;
            return `<tr${n ? '' : ' class="is-empty"'}><td>${L === 'nl' ? nl : en}</td>
              <td class="bar"><span style="width:${(n / max) * 100}%"></span></td>
              <td class="num">${n}</td><td class="num muted">${pct}%</td></tr>`;
          }).join('')}
          ${c.__leeg ? `<tr class="is-empty"><td>${Lang.t('withoutAnswer')}</td><td class="bar"></td>
            <td class="num">${c.__leeg}</td><td class="num muted">${Math.round(c.__leeg / sel.length * 100)}%</td></tr>` : ''}
        </tbody></table></div>`;
    }).join('');

    return `
      <section class="panel">
        <h2>${Lang.t('tabSample')}</h2>
        <p class="fineprint">${Lang.t('sampleLead')}</p>
        <div class="tiles">${tiles}</div>
      </section>
      <section class="panel">
        <h2>${Lang.t('background')}</h2>
        <div class="bggrid">${tables}</div>
      </section>`;
  }

  /* --- 3. schalen: items en verdeling --- */
  function tabScales(sel) {
    const q = QUESTIONNAIRES[qKey];
    const groups = q.domains
      ? q.domains.map(dom => ({ head: dom[L], dims: q.dims.filter(d => d.domain === dom.id) }))
      : [{ head: null, dims: q.dims }];

    const blocks = groups.map(gr => {
      const inner = gr.dims.map(d => {
        const items = q.items.filter(i => i.dim === d.id);
        const scores = sel.map(r => respondentDimScore(qKey, r, d.id)).filter(v => v !== null);
        const m = mean(scores);
        const a = cronbachAlpha(qKey, d.id, sel);
        const rows = items.map(it => {
          const st = itemStats(qKey, it, sel);
          const total = st.n || 1;
          const bars = st.dist.map((n, i) => n
            ? `<span class="seg seg-${i + 1}" style="width:${(n / total) * 100}%" title="${i + 1}: ${n}"></span>` : '').join('');
          return `<tr>
            <td class="itemcol"><span class="item-id">${it.id.replace(/^\D+/, '')}</span>${escapeHtml(it.text)}</td>
            <td class="num strong">${st.mean === null ? '—' : st.mean.toFixed(2)}</td>
            <td class="num muted">${st.sd === null ? '—' : st.sd.toFixed(2)}</td>
            <td class="num muted">${st.n}${st.na ? ` <span title="${Lang.t('na')}">+${st.na}</span>` : ''}</td>
            <td class="distcol"><div class="dist">${bars}</div></td>
          </tr>`;
        }).join('');
        return `<div class="scaleblock">
          <div class="scaleblock-head">
            <h3>${d[L]}</h3>
            <span class="scaleblock-mean">${m === null ? '—' : m.toFixed(2)}</span>
            ${a ? `<span class="badge ${a.alpha >= 0.7 ? 'badge-hoog' : 'badge-laag'}">α ${a.alpha.toFixed(2)}</span>` : ''}
          </div>
          <table class="tbl itemtable">
            <thead><tr><th>${Lang.t('item')}</th><th class="num">${Lang.t('meanShort')}</th>
              <th class="num">SD</th><th class="num">n</th><th>${Lang.t('distribution')}</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      }).join('');
      return (gr.head ? `<h2 class="domain-head">${gr.head}</h2>` : '') + inner;
    }).join('');

    return `
      <section class="panel">
        <h2>${Lang.t('tabScales')}</h2>
        <p class="fineprint">${Lang.t('scalesLead')}</p>
        <div class="distlegend">${[1, 2, 3, 4, 5].map(i =>
          `<span><i class="seg-${i}"></i>${i} ${SCALE_LABELS[L][i - 1]}</span>`).join('')}</div>
      </section>
      ${blocks}`;
  }

  /* --- 4. correlaties --- */
  function tabCorr(sel) {
    const q = QUESTIONNAIRES[qKey];
    const dims = q.dims;
    const scores = dims.map(d => sel.map(r => respondentDimScore(qKey, r, d.id)));
    const M = dims.map((_, i) => dims.map((__, j) => i === j ? { r: 1, n: null } : pearson(scores[i], scores[j])));

    const pairs = [];
    for (let i = 0; i < dims.length; i++)
      for (let j = i + 1; j < dims.length; j++)
        if (M[i][j]) pairs.push({ a: dims[i], b: dims[j], r: M[i][j].r, n: M[i][j].n });
    pairs.sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
    const strongest = pairs.slice(0, 5);

    const head = `<tr><th></th>${dims.map((d, i) =>
      `<th class="rot" title="${d[L]}">${i + 1}</th>`).join('')}</tr>`;
    const body = dims.map((d, i) => `<tr>
      <th class="rowhead"><span class="idx">${i + 1}</span> ${d[L]}</th>
      ${dims.map((_, j) => {
        const c = M[i][j];
        if (i === j) return `<td class="cell diag">–</td>`;
        if (!c) return `<td class="cell empty" title="${Lang.t('tooFewPairs')}">·</td>`;
        return `<td class="cell" style="background:${corrColor(c.r)}; color:${Math.abs(c.r) > 0.55 ? '#fff' : 'inherit'}"
          title="${d[L]} ↔ ${dims[j][L]}: r = ${c.r.toFixed(2)} (n = ${c.n})">${c.r.toFixed(2).replace('0.', '.')}</td>`;
      }).join('')}
    </tr>`).join('');

    const nUsable = sel.filter(r => dims.some(d => respondentDimScore(qKey, r, d.id) !== null)).length;
    const warn = nUsable < 20
      ? `<p class="callout callout-warn">${Lang.t('corrSmallN').replace('{n}', nUsable)}</p>` : '';

    return `
      <section class="panel">
        <h2>${Lang.t('tabCorrelations')}</h2>
        <p class="fineprint">${Lang.t('corrLead')}</p>
        ${warn}
        <div class="corrscroll"><table class="corrtable"><thead>${head}</thead><tbody>${body}</tbody></table></div>
        <div class="corrlegend">
          <span>−1</span>
          <i style="background:linear-gradient(to right, ${corrColor(-1)}, ${corrColor(-0.5)}, ${corrColor(0)}, ${corrColor(0.5)}, ${corrColor(1)})"></i>
          <span>+1</span>
        </div>
      </section>
      ${strongest.length ? `<section class="panel">
        <h2>${Lang.t('strongestLinks')}</h2>
        <p class="fineprint">${Lang.t('strongestLead')}</p>
        <table class="tbl"><thead><tr><th>${Lang.t('dimension')}</th><th>${Lang.t('dimension')}</th>
          <th class="num">r</th><th class="num">n</th></tr></thead>
          <tbody>${strongest.map(p => `<tr><td>${p.a[L]}</td><td>${p.b[L]}</td>
            <td class="num strong">${p.r.toFixed(2)}</td><td class="num muted">${p.n}</td></tr>`).join('')}</tbody>
        </table>
      </section>` : ''}`;
  }

  shell();
  window.addEventListener('pccd:theme', () => location.reload());
}

/* ---------- kleuren ---------- */
// sequentieel blauw voor een gemiddelde op 1-5
function scaleColor(m) {
  const steps = vizColors().series;
  if (m < 2.5) return steps[1];
  if (m < 3.5) return steps[0];
  return steps[2];
}
// divergerend rood <-> blauw met neutrale grijze middenwaarde
function corrColor(r) {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.getAttribute('data-theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const neutral = dark ? [56, 56, 53] : [240, 239, 236];
  const pos = dark ? [57, 135, 229] : [42, 120, 214];
  const neg = dark ? [230, 103, 103] : [227, 73, 72];
  const t = Math.min(1, Math.abs(r));
  const end = r >= 0 ? pos : neg;
  const mix = neutral.map((c, i) => Math.round(c + (end[i] - c) * t));
  return `rgb(${mix.join(',')})`;
}
