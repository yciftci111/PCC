/* PCCD Audit — pagina voor de thematische analyse. */

function buildCoding() {
  buildChrome('codering');
  if (!researcherUnlocked()) return renderLock();
  const L = Lang.get();
  document.title = Lang.t('codingTitle') + ' — ' + Lang.t('siteTitle');
  const root = document.getElementById('app');
  const qKey = 'mantelzorgers';
  const q = QUESTIONNAIRES[qKey];

  // handmatige hernoemingen blijven bewaard
  const renameKey = 'pccd.coding.labels';
  const loadNames = () => { try { return JSON.parse(localStorage.getItem(renameKey) || '{}'); } catch (e) { return {}; } };
  const saveNames = o => { try { localStorage.setItem(renameKey, JSON.stringify(o)); } catch (e) {} };

  let res = null;

  function shell() {
    const reps = Store.load()[qKey].respondents;
    const withText = reps.filter(r => Object.values(r.narrative || {})
      .some(x => (x.q1 || '').trim() || (x.q2 || '').trim())).length;
    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${q[L].title}</span>
        <h1>${Lang.t('codingTitle')}</h1>
        <p class="lead">${Lang.t('codingLead')}</p>
      </header>
      <section class="panel runpanel">
        <div class="runrow">
          <div>
            <p class="runcount"><b>${reps.length}</b> ${reps.length === 1 ? Lang.t('respondent') : Lang.t('respondents')}
              · <b>${withText}</b> ${L === 'nl' ? 'met open antwoorden' : 'with open answers'}</p>
            <p class="fineprint">${Lang.t('codingLead')}</p>
          </div>
          <button type="button" class="btn big" id="runBtn">${res ? Lang.t('reRun') : Lang.t('runCoding')}</button>
        </div>
      </section>
      <div id="out"></div>`;
    root.querySelector('#runBtn').addEventListener('click', run);
    if (res) render();
  }

  function run() {
    const reps = Store.load()[qKey].respondents;
    res = runCoding(qKey, reps, L);
    render();
  }

  function render() {
    const out = root.querySelector('#out');
    if (res.tooLittle) {
      out.innerHTML = `<section class="panel"><p class="viz-empty">${Lang.t('codingTooLittle')}</p></section>`;
      return;
    }
    const names = loadNames();
    const nm = (id, fallback) => names[id] || fallback;
    const dimName = {}; q.dims.forEach(d => dimName[d.id] = d[L]);
    const byId = new Map(res.fragments.map(f => [f.id, f]));

    const sel = res.selective;
    out.innerHTML = `
      <section class="panel">
        <div class="tiles">
          <div class="tile"><b>${res.fragments.length}</b><span>${Lang.t('fragments')}</span></div>
          <div class="tile"><b>${res.codes.length}</b><span>${Lang.t('openCodes')}</span></div>
          <div class="tile"><b>${res.categories.length}</b><span>${Lang.t('categoriesN')}</span></div>
        </div>
        <p class="callout callout-warn" style="margin-top:14px">${Lang.t('codingWarning')}</p>
      </section>

      ${sel ? `<section class="panel">
        <h2>3 · ${Lang.t('selectiveCoding')}</h2>
        <p class="fineprint">${Lang.t('selectiveLead')}</p>
        <div class="corebox">
          <span class="badge badge-midden">${L === 'nl' ? 'Kerncategorie' : 'Core category'}</span>
          <h3 contenteditable="true" data-name="${sel.core.id}">${escapeHtml(nm(sel.core.id, sel.core.label))}</h3>
          <p class="core-story">${escapeHtml(sel.story)}</p>
          ${sel.quote ? `<blockquote class="quote">${escapeHtml(sel.quote.text)}
            <cite>${escapeHtml(sel.quote.respondent)} · ${dimName[sel.quote.dim]}</cite></blockquote>` : ''}
        </div>
      </section>` : ''}

      <section class="panel">
        <h2>2 · ${Lang.t('axialCoding')}</h2>
        <p class="fineprint">${Lang.t('axialLead')}</p>
        <div class="catgrid">
          ${res.categories.map(c => `
            <article class="catcard">
              <header>
                <h3 contenteditable="true" data-name="${c.id}">${escapeHtml(nm(c.id, c.label))}</h3>
                <span class="catn">${c.n}</span>
              </header>
              <p class="cat-codes">${c.codeLabels.slice(0, 8).map(x => `<span class="tag">${escapeHtml(x)}</span>`).join('')}</p>
              <p class="cat-dims"><b>${Lang.t('inDims')}:</b> ${c.dims.map(d => dimName[d]).join(', ')}</p>
              <details><summary>${Lang.t('exampleFragments')}</summary>
                <ul class="fraglist">${c.fragments.slice(0, 5).map(fid => {
                  const f = byId.get(fid);
                  return `<li>${escapeHtml(f.text)}<span class="fragmeta">${escapeHtml(f.respondent)} · ${dimName[f.dim]}</span></li>`;
                }).join('')}</ul>
              </details>
            </article>`).join('')}
        </div>
      </section>

      <section class="panel">
        <h2>1 · ${Lang.t('openCoding')}</h2>
        <p class="fineprint">${Lang.t('openLead')}</p>
        <table class="tbl codetable">
          <thead><tr><th>${Lang.t('codeLabel')}</th><th class="num">n</th><th>${Lang.t('inDims')}</th></tr></thead>
          <tbody>${res.codes.slice(0, 50).map(c => `<tr>
            <td contenteditable="true" data-name="${c.id}">${escapeHtml(nm(c.id, c.label))}</td>
            <td class="num strong">${c.n}</td>
            <td class="muted">${c.dims.map(d => dimName[d]).join(', ')}</td></tr>`).join('')}</tbody>
        </table>
      </section>

      <div class="export">
        <button type="button" class="btn small" id="dlReport">${Lang.t('downloadReport')}</button>
        <button type="button" class="ghost small" id="cpPrompt">${Lang.t('copyPrompt')}</button>
        <button type="button" class="ghost small" id="prt">${Lang.t('exportPdf')}</button>
      </div>`;

    out.querySelectorAll('[data-name]').forEach(el => {
      el.addEventListener('blur', () => {
        const o = loadNames();
        o[el.dataset.name] = el.textContent.trim();
        saveNames(o);
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
    });

    out.querySelector('#dlReport').addEventListener('click', () => {
      const names = loadNames();
      const patched = JSON.parse(JSON.stringify({
        fragments: res.fragments, codes: res.codes, categories: res.categories
      }));
      patched.codes.forEach(c => { if (names[c.id]) c.label = names[c.id]; });
      patched.categories.forEach(c => {
        if (names[c.id]) c.label = names[c.id];
        c.codeLabels = c.codeLabels.map((l, i) => names[c.codes[i]] || l);
      });
      const text = codingReport({ ...res, ...patched }, qKey, L);
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pccd-thematische-analyse.md';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    out.querySelector('#cpPrompt').addEventListener('click', async e => {
      const txt = aiPrompt(res, qKey, L);
      try { await navigator.clipboard.writeText(txt); e.target.textContent = Lang.t('pCopied'); }
      catch (err) {
        const ta = document.createElement('textarea');
        ta.value = txt; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        e.target.textContent = Lang.t('pCopied');
      }
      setTimeout(() => { e.target.textContent = Lang.t('copyPrompt'); }, 1800);
    });
    out.querySelector('#prt').addEventListener('click', () => window.print());
  }

  shell();
  window.addEventListener('pccd:theme', () => location.reload());
}
