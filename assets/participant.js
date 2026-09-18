/* PCCD Audit — deelnemersmodus.
   Dit is de pagina die je naar respondenten stuurt. Zij kiezen hun eigen lijst,
   vullen die in en krijgen daarna hun eigen spinnenweb met een geschreven advies.
   Er is geen navigatie naar de onderzoekersweergave en geen zicht op andere
   respondenten. Alles blijft in de browser van de respondent totdat die zelf
   op doorsturen klikt. */

const P_KEY = 'pccd.participant.v1';

const PStore = {
  _c: null,
  load() {
    if (PStore._c) return PStore._c;
    let d = null;
    try { d = JSON.parse(localStorage.getItem(P_KEY) || 'null'); } catch (e) {}
    if (!d || typeof d !== 'object') d = {};
    if (!d.answers || typeof d.answers !== 'object') d.answers = {};
    if (typeof d.label !== 'string') d.label = '';
    if (typeof d.role !== 'string') d.role = '';
    if (!d.meta || typeof d.meta !== 'object') d.meta = {};
    if (typeof d.done !== 'boolean') d.done = false;
    PStore._c = d;
    return d;
  },
  save() { try { localStorage.setItem(P_KEY, JSON.stringify(PStore.load())); } catch (e) {} },
  clear() { PStore._c = null; try { localStorage.removeItem(P_KEY); } catch (e) {} }
};

/* ---------- antwoordcode ---------- */
// Compact: v1|qKey|label|reeks cijfers. 1-5 = score, n = niet van toepassing,
// . = niet beantwoord. Daarna base64 zodat het als een tekstregel te mailen is.
function encodeSubmission(qKey, label, answers, meta) {
  const q = QUESTIONNAIRES[qKey];
  const digits = q.items.map(it => {
    const v = answers[it.id];
    if (v === 'na') return 'n';
    if (typeof v === 'number' && v >= 1 && v <= 5) return String(v);
    return '.';
  }).join('');
  const clean = x => String(x == null ? '' : x).replace(/[|~]/g, ' ');
  const metaStr = bgFields(qKey).map(f => clean((meta || {})[f.id])).join('~');
  const raw = ['v2', qKey, clean(label), digits, metaStr].join('|');
  return 'PCCD-' + btoa(unescape(encodeURIComponent(raw))).replace(/=+$/, '');
}
function decodeSubmission(code) {
  try {
    const body = String(code).trim().replace(/^PCCD-/, '');
    const raw = decodeURIComponent(escape(atob(body)));
    const [ver, qKey, label, digits, metaStr] = raw.split('|');
    if ((ver !== 'v1' && ver !== 'v2') || !QUESTIONNAIRES[qKey]) return null;
    const q = QUESTIONNAIRES[qKey];
    if (!digits || digits.length !== q.items.length) return null;
    const answers = {};
    q.items.forEach((it, i) => {
      const c = digits[i];
      if (c === 'n') answers[it.id] = 'na';
      else if (c >= '1' && c <= '5') answers[it.id] = Number(c);
    });
    const meta = {};
    if (ver === 'v2' && metaStr !== undefined) {
      const parts = metaStr.split('~');
      bgFields(qKey).forEach((f, i) => { if (parts[i]) meta[f.id] = parts[i]; });
    }
    return { qKey, label: label || '', answers, meta };
  } catch (e) { return null; }
}

/* ---------- achtergrondvelden ---------- */
function renderBgFields(qKey, meta, L) {
  return bgFields(qKey).map(f => {
    const cur = (meta || {})[f.id] || '';
    if (f.type === 'text') {
      return `<label class="field"><span>${f[L]}</span>
        <input type="text" data-bg="${f.id}" placeholder="${f.ph || ''}" value="${String(cur).replace(/"/g, '&quot;')}"></label>`;
    }
    return `<label class="field"><span>${f[L]}</span>
      <select data-bg="${f.id}">
        <option value="">${Lang.t('bgChoose')}…</option>
        ${f.opts.map(([v, nl, en]) => `<option value="${v}"${cur === v ? ' selected' : ''}>${L === 'nl' ? nl : en}</option>`).join('')}
      </select></label>`;
  }).join('');
}

/* ---------- opbouw ---------- */
function buildParticipant() {
  const L = Lang.get();
  document.documentElement.lang = L;
  const root = document.getElementById('app');

  // minimale koptekst: geen navigatie naar de onderzoekerskant
  const head = document.querySelector('[data-chrome]');
  if (head) {
    head.innerHTML = `
      <span class="brand" style="cursor:default">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text"><b>${CONFIG.organisatie || Lang.t('pTagline')}</b><small>${CONFIG.organisatie ? Lang.t('pTagline') : ''}</small></span>
      </span>
      <div class="chrome-actions">
        <button type="button" class="ghost" id="langBtn">${Lang.t('langLabel')}</button>
        <button type="button" class="ghost icon" id="themeBtn" aria-label="${Lang.t('themeDark')}" title="${Lang.t('themeDark')}">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2M12 19.6v2M2.4 12h2M19.6 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>
          </svg>
        </button>
      </div>`;
    head.querySelector('#langBtn').addEventListener('click', () => { Lang.set(L === 'nl' ? 'en' : 'nl'); location.reload(); });
    head.querySelector('#themeBtn').addEventListener('click', () => { Theme.toggle(); render(); });
  }

  document.title = (CONFIG.organisatie ? CONFIG.organisatie + ' \u2014 ' : '') + Lang.t('pTagline');
  fillFooter();

  function render() {
    const d = PStore.load();
    if (!d.role) return renderChoice();
    if (d.done) return renderResult();
    return renderForm();
  }

  /* --- 1. rolkeuze --- */
  function renderChoice() {
    const roles = [
      { key: 'patienten',     t: 'pRolePat',   s: 'pRolePatSub',   min: '8-12' },
      { key: 'professionals', t: 'pRoleProf',  s: 'pRoleProfSub',  min: '8-12' },
      { key: 'pcpis',         t: 'pRoleStaff', s: 'pRoleStaffSub', min: '12-18' }
    ];
    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${Lang.t('pStart')}</span>
        <h1>${Lang.t('pChoose')}</h1>
        <p class="lead">${Lang.t('pIntro')}</p>
        <p class="fineprint">${Lang.t('pChooseNote')}</p>
      </header>
      <section class="cards">
        ${roles.map(r => {
          const q = QUESTIONNAIRES[r.key];
          return `<button type="button" class="card card-role" data-role="${r.key}">
            <div class="card-body">
              <span class="card-eyebrow">${q.items.length} ${Lang.t('pQuestions')} · ${r.min} ${Lang.t('pMinutes')}</span>
              <h2>${Lang.t(r.t)}</h2>
              <p>${Lang.t(r.s)}</p>
              <span class="card-cta">${Lang.t('openList')} <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4"/></svg></span>
            </div>
          </button>`;
        }).join('')}
      </section>`;
    root.querySelectorAll('[data-role]').forEach(b => b.addEventListener('click', () => {
      const d = PStore.load();
      d.role = b.dataset.role; d.done = false;
      PStore.save(); render(); window.scrollTo(0, 0);
    }));
  }

  /* --- 2. invullen --- */
  function renderForm() {
    const d = PStore.load();
    const q = QUESTIONNAIRES[d.role];
    const org = CONFIG.organisatie || (L === 'nl' ? '‘naam organisatie’' : '‘organisation name’');

    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${q[L].title}</span>
        <h1>${Lang.t(d.role === 'patienten' ? 'pRolePat' : d.role === 'professionals' ? 'pRoleProf' : 'pRoleStaff')}</h1>
        <p class="lead">${q[L].intro}</p>
      </header>
      <div class="progress no-print">
        <div class="progress-bar"><span id="pFill"></span></div>
        <span class="progress-text" id="pText"></span>
        <button type="button" class="ghost small" id="pBack">${Lang.t('pBack')}</button>
      </div>
      <section class="questions" id="pQuestions"></section>
      <div class="finish-bar no-print">
        <button type="button" class="btn" id="pFinish">${Lang.t('pFinish')}</button>
      </div>`;

    const host = root.querySelector('#pQuestions');
    if (q[L].stem) {
      const s = document.createElement('p');
      s.className = 'stem';
      s.textContent = q[L].stem.replace('{org}', org);
      host.appendChild(s);
    }
    const bg = document.createElement('section');
    bg.className = 'dim bgform';
    bg.innerHTML = `<h3 class="dim-head">${Lang.t('bgTitle')}</h3>
      <p class="fineprint" style="margin-bottom:12px">${Lang.t('bgLead')}</p>
      <div class="bgfields">${renderBgFields(d.role, d.meta, L)}</div>`;
    host.appendChild(bg);
    const writeBg = (t) => {
      const dd = PStore.load();
      const v = (t.value || '').trim();
      if (v) dd.meta[t.dataset.bg] = v; else delete dd.meta[t.dataset.bg];
      PStore.save();
    };
    bg.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.bg) writeBg(e.target); });
    bg.addEventListener('input', e => {
      if (e.target.dataset && e.target.dataset.bg && e.target.tagName === 'INPUT') writeBg(e.target);
    });

    const key = document.createElement('div');
    key.className = 'scalekey';
    key.innerHTML = SCALE_LABELS[L].map((lab, i) => `<span><b>${i + 1}</b> ${lab}</span>`).join('') +
      `<span class="scalekey-na"><b>–</b> ${NVT_LABEL[L]}</span>`;
    host.appendChild(key);

    const groups = q.domains
      ? q.domains.map(dom => ({ head: dom[L], dims: q.dims.filter(x => x.domain === dom.id) }))
      : [{ head: null, dims: q.dims }];

    groups.forEach(gr => {
      if (gr.head) {
        const h = document.createElement('h2');
        h.className = 'domain-head';
        h.textContent = gr.head;
        host.appendChild(h);
      }
      gr.dims.forEach(dm => {
        const sec = document.createElement('section');
        sec.className = 'dim';
        sec.innerHTML = `<h3 class="dim-head">${dm[L]}</h3>`;
        q.items.filter(it => it.dim === dm.id).forEach(it => {
          const val = d.answers[it.id];
          const row = document.createElement('div');
          row.className = 'item';
          const opts = SCALE_LABELS[L].map((lab, i) => {
            const v = i + 1;
            return `<label class="opt${val === v ? ' on' : ''}" title="${lab}">
                      <input type="radio" name="${it.id}" value="${v}"${val === v ? ' checked' : ''}>
                      <span class="opt-num">${v}</span><span class="opt-lab">${lab}</span>
                    </label>`;
          }).join('');
          const nvt = it.nvt ? `<label class="opt opt-na${val === 'na' ? ' on' : ''}" title="${NVT_LABEL[L]}">
                      <input type="radio" name="${it.id}" value="na"${val === 'na' ? ' checked' : ''}>
                      <span class="opt-num">–</span><span class="opt-lab">${NVT_LABEL[L]}</span>
                    </label>` : '';
          row.innerHTML = `<p class="item-text"><span class="item-id">${it.id.replace(/^\D+/, '')}</span>${it.text}</p>
                           <div class="opts">${opts}${nvt}</div>`;
          sec.appendChild(row);
        });
        host.appendChild(sec);
      });
    });

    host.addEventListener('change', e => {
      const t = e.target;
      if (t.type !== 'radio') return;
      const dd = PStore.load();
      dd.answers[t.name] = t.value === 'na' ? 'na' : Number(t.value);
      PStore.save();
      const row = t.closest('.item');
      row.querySelectorAll('.opt').forEach(o => o.classList.toggle('on', o.contains(t)));
      progress();
    });

    root.querySelector('#pBack').addEventListener('click', () => {
      if (!confirm(Lang.t('pBackConfirm'))) return;
      const dd = PStore.load(); dd.role = ''; PStore.save(); render(); window.scrollTo(0, 0);
    });
    root.querySelector('#pFinish').addEventListener('click', () => {
      const dd = PStore.load();
      const done = q.items.filter(it => dd.answers[it.id] !== undefined).length;
      if (done < q.items.length && !confirm(Lang.t('pFinishIncomplete'))) return;
      dd.done = true; PStore.save(); render(); window.scrollTo(0, 0);
    });

    function progress() {
      const dd = PStore.load();
      const done = q.items.filter(it => dd.answers[it.id] !== undefined).length;
      root.querySelector('#pFill').style.width = Math.round(done / q.items.length * 100) + '%';
      root.querySelector('#pText').textContent = `${done} ${Lang.t('of')} ${q.items.length} ${Lang.t('progress')}`;
    }
    progress();
  }

  /* --- 3. bedankt, spinnenweb en advies --- */
  function renderResult() {
    const d = PStore.load();
    const q = QUESTIONNAIRES[d.role];
    const fake = [{ id: 'self', label: d.label, answers: d.answers }];
    const means = dimMeans(d.role, fake);
    const vals = q.dims.map(x => means[x.id].mean);
    const voice = d.role === 'patienten' ? 'pat' : 'org';
    const code = encodeSubmission(d.role, d.label, d.answers, d.meta);
    const mail = CONFIG.onderzoekerEmail;

    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${q[L].title}</span>
        <h1>${Lang.t('pThanks')}</h1>
        <p class="lead">${Lang.t('pThanksLead')}</p>
      </header>
      <section class="panel">
        <div class="viz-wrap" id="pViz"></div>
      </section>
      <div id="pAdvice"></div>
      <section class="panel no-print">
        <h2>${Lang.t('pCodeTitle')}</h2>
        <p class="fineprint">${Lang.t('pCodeLead')}</p>
        <label class="field" style="margin:12px 0 10px">
          <span>${Lang.t('pYourName')}</span>
          <input type="text" id="pName" placeholder="${Lang.t('pNamePlaceholder')}" value="${(d.label || '').replace(/"/g, '&quot;')}">
        </label>
        <textarea class="codebox" id="pCode" readonly rows="3">${code}</textarea>
        <div class="export">
          ${mail ? `<a class="btn small" id="pSend" href="#">${Lang.t('pSend')}</a>` : ''}
          <button type="button" class="ghost small" id="pCopy">${Lang.t('pCopyCode')}</button>
          <button type="button" class="ghost small" id="pPrint">${Lang.t('pPrint')}</button>
          <button type="button" class="ghost small danger" id="pReset">${Lang.t('pRestart')}</button>
        </div>
      </section>`;

    if (vals.some(v => v !== null)) {
      renderRadar(root.querySelector('#pViz'), {
        min: 1, max: 5,
        axes: q.dims.map(x => ({ label: axisLabel(x, L), full: x[L] })),
        series: [{ name: q[L].title, color: vizColors().series[q.series - 1], values: vals }],
        ariaLabel: q[L].title
      });
      renderAdvice(root.querySelector('#pAdvice'), d.role, means, L, voice);
    }

    const nameInput = root.querySelector('#pName');
    const codeBox = root.querySelector('#pCode');
    function refreshCode() {
      const dd = PStore.load();
      dd.label = nameInput.value; PStore.save();
      codeBox.value = encodeSubmission(dd.role, dd.label, dd.answers, dd.meta);
      const a = root.querySelector('#pSend');
      if (a) {
        const subj = encodeURIComponent('PCCD ' + q[L].title + (dd.label ? ' - ' + dd.label : ''));
        const body = encodeURIComponent((L === 'nl'
          ? 'Hierbij mijn antwoorden.\n\n'
          : 'Here are my answers.\n\n') + codeBox.value + '\n');
        a.href = `mailto:${mail}?subject=${subj}&body=${body}`;
      }
    }
    nameInput.addEventListener('input', refreshCode);
    refreshCode();

    root.querySelector('#pCopy').addEventListener('click', async (e) => {
      codeBox.select();
      try { await navigator.clipboard.writeText(codeBox.value); }
      catch (err) { document.execCommand('copy'); }
      e.target.textContent = Lang.t('pCopied');
      setTimeout(() => { e.target.textContent = Lang.t('pCopyCode'); }, 1600);
    });
    root.querySelector('#pPrint').addEventListener('click', () => window.print());
    root.querySelector('#pReset').addEventListener('click', () => {
      if (!confirm(Lang.t('pRestartConfirm'))) return;
      PStore.clear(); render(); window.scrollTo(0, 0);
    });
  }

  render();
}
