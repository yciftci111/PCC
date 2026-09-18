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
    if (!d.narrative || typeof d.narrative !== 'object') d.narrative = {};
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
    if (QUESTIONNAIRES[d.role].narrative) return renderNarrativeForm();
    return renderForm();
  }

  /* --- 1. rolkeuze --- */
  function renderChoice() {
    const roles = [
      { key: 'patienten',     t: 'pRolePat',   s: 'pRolePatSub',   min: '8-12' },
      { key: 'professionals', t: 'pRoleProf',  s: 'pRoleProfSub',  min: '8-12' },
      { key: 'pcpis',         t: 'pRoleStaff', s: 'pRoleStaffSub', min: '12-18' },
      { key: 'mantelzorgers', t: 'pRoleCarer', s: 'pRoleCarerSub', min: '20-40' }
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

  /* --- 2b. mantelzorgers: open vragen met opname --- */
  function renderNarrativeForm() {
    const d = PStore.load();
    const q = QUESTIONNAIRES[d.role];
    root.innerHTML = `
      <header class="page-head">
        <span class="eyebrow">${q[L].title}</span>
        <h1>${Lang.t('pRoleCarer')}</h1>
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

    function progress() {
      const dd = PStore.load();
      let done = 0, total = q.dims.length * 3;
      q.dims.forEach(dm => {
        const n = dd.narrative[dm.id] || {};
        if ((n.q1 || '').trim()) done++;
        if ((n.q2 || '').trim()) done++;
        const it = q.items.find(i => i.dim === dm.id);
        if (dd.answers[it.id] !== undefined) done++;
      });
      root.querySelector('#pFill').style.width = Math.round(done / total * 100) + '%';
      root.querySelector('#pText').textContent = `${done} ${Lang.t('of')} ${total} ${Lang.t('progress')}`;
    }

    buildNarrativeForm(root, d, q, L, progress);
    progress();

    root.querySelector('#pBack').addEventListener('click', () => {
      if (!confirm(Lang.t('pBackConfirm'))) return;
      const dd = PStore.load(); dd.role = ''; PStore.save(); render(); window.scrollTo(0, 0);
    });
    root.querySelector('#pFinish').addEventListener('click', () => {
      const dd = PStore.load();
      dd.done = true; PStore.save(); render(); window.scrollTo(0, 0);
    });
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
        <p class="fineprint">${QUESTIONNAIRES[d.role].narrative ? Lang.t('pCodeLeadFile') : Lang.t('pCodeLead')}</p>
        <label class="field" style="margin:12px 0 10px">
          <span>${Lang.t('pYourName')}</span>
          <input type="text" id="pName" placeholder="${Lang.t('pNamePlaceholder')}" value="${(d.label || '').replace(/"/g, '&quot;')}">
        </label>
        <textarea class="codebox" id="pCode" readonly rows="3">${code}</textarea>
        <div class="export">
          ${mail ? `<a class="btn small" id="pSend" href="#">${Lang.t('pSend')}</a>` : ''}
          <button type="button" class="ghost small" id="pCopy">${Lang.t('pCopyCode')}</button>
          ${QUESTIONNAIRES[d.role].narrative ? `<button type="button" class="btn small" id="pDownload">${Lang.t('pDownloadFile')}</button>` : ''}
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
    const dl = root.querySelector('#pDownload');
    if (dl) dl.addEventListener('click', () => {
      const dd = PStore.load();
      const payload = { pccd: 1, qKey: dd.role, label: dd.label, answers: dd.answers,
                        meta: dd.meta, narrative: dd.narrative, saved: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pccd-${dd.role}-${slug(dd.label || 'respondent')}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    root.querySelector('#pPrint').addEventListener('click', () => window.print());
    root.querySelector('#pReset').addEventListener('click', () => {
      if (!confirm(Lang.t('pRestartConfirm'))) return;
      PStore.clear(); render(); window.scrollTo(0, 0);
    });
  }

  render();
}

/* ---------- opnemen en transcriberen (mantelzorgerslijst) ---------- */
// Audio blijft in IndexedDB op dit apparaat. Het gaat nooit mee in de code of
// het JSON-bestand: alleen de uitgewerkte tekst reist mee.
const AudioStore = {
  _db: null,
  open() {
    if (AudioStore._db) return Promise.resolve(AudioStore._db);
    return new Promise((res, rej) => {
      const rq = indexedDB.open('pccd-audio', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('clips');
      rq.onsuccess = () => { AudioStore._db = rq.result; res(rq.result); };
      rq.onerror = () => rej(rq.error);
    });
  },
  put(key, blob) {
    return AudioStore.open().then(db => new Promise((res, rej) => {
      const tx = db.transaction('clips', 'readwrite');
      tx.objectStore('clips').put(blob, key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    }));
  },
  get(key) {
    return AudioStore.open().then(db => new Promise((res, rej) => {
      const rq = db.transaction('clips', 'readonly').objectStore('clips').get(key);
      rq.onsuccess = () => res(rq.result || null);
      rq.onerror = () => rej(rq.error);
    }));
  },
  del(key) {
    return AudioStore.open().then(db => new Promise(res => {
      const tx = db.transaction('clips', 'readwrite');
      tx.objectStore('clips').delete(key);
      tx.oncomplete = res;
    }));
  }
};

const SpeechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

function makeRecorder(key, opts) {
  let rec = null, chunks = [], sr = null, stream = null;
  return {
    async start() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        await AudioStore.put(key, blob);
        stream.getTracks().forEach(t => t.stop());
        opts.onClip(blob);
      };
      rec.start();
      if (SpeechSupported && opts.transcribe) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        sr = new SR();
        sr.lang = Lang.get() === 'nl' ? 'nl-NL' : 'en-GB';
        sr.continuous = true; sr.interimResults = true;
        let settled = '';
        sr.onresult = e => {
          let interim = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript;
            if (e.results[i].isFinal) settled += t; else interim += t;
          }
          opts.onText(settled, interim);
        };
        sr.onerror = () => {};
        try { sr.start(); } catch (err) {}
      }
    },
    stop() {
      if (rec && rec.state !== 'inactive') rec.stop();
      if (sr) { try { sr.stop(); } catch (e) {} sr = null; }
    }
  };
}

function buildNarrativeForm(root, d, q, L, onProgress) {
  const host = root.querySelector('#pQuestions');
  host.innerHTML = '';

  const bg = document.createElement('section');
  bg.className = 'dim bgform';
  bg.innerHTML = `<h3 class="dim-head">${Lang.t('bgTitle')}</h3>
    <p class="fineprint" style="margin-bottom:12px">${Lang.t('bgLead')}</p>
    <div class="bgfields">${renderBgFields(d.role, d.meta, L)}</div>`;
  host.appendChild(bg);
  const writeBg = t => {
    const dd = PStore.load();
    const v = (t.value || '').trim();
    if (v) dd.meta[t.dataset.bg] = v; else delete dd.meta[t.dataset.bg];
    PStore.save();
  };
  bg.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.bg) writeBg(e.target); });
  bg.addEventListener('input', e => {
    if (e.target.dataset && e.target.dataset.bg && e.target.tagName === 'INPUT') writeBg(e.target);
  });

  if (!SpeechSupported) {
    const w = document.createElement('p');
    w.className = 'callout callout-warn';
    w.textContent = Lang.t('noSpeech');
    host.appendChild(w);
  }

  q.dims.forEach((dm, di) => {
    const open = q.open[dm.id];
    const sec = document.createElement('section');
    sec.className = 'dim narrative-dim';
    sec.innerHTML = `<h3 class="dim-head"><span class="dim-num">${di + 1}</span>${dm[L]}</h3>`;

    ['q1', 'q2'].forEach(slot => {
      const wrap = document.createElement('div');
      wrap.className = 'narrative-q';
      const key = `${d.role}:${dm.id}:${slot}`;
      const cur = (d.narrative[dm.id] || {})[slot] || '';
      wrap.innerHTML = `
        <p class="narrative-prompt">${open[slot]}</p>
        <div class="rec-row">
          <button type="button" class="ghost small rec-btn" data-rec="${key}">
            <span class="rec-dot"></span>${Lang.t('recStart')}</button>
          <span class="rec-time" data-time="${key}"></span>
          <audio class="rec-audio" data-audio="${key}" controls hidden></audio>
          <button type="button" class="linkbtn" data-del="${key}" hidden>${Lang.t('recDelete')}</button>
        </div>
        <textarea class="narrative-text" data-txt="${dm.id}:${slot}" rows="3"
          placeholder="${Lang.t('transcriptPlaceholder')}">${escapeHtml(cur)}</textarea>`;
      sec.appendChild(wrap);
    });

    const item = q.items.find(i => i.dim === dm.id);
    const val = d.answers[item.id];
    const scoreRow = document.createElement('div');
    scoreRow.className = 'item narrative-score';
    scoreRow.innerHTML = `
      <p class="item-text"><span class="item-id">${di + 1}</span>${escapeHtml(item.text)}</p>
      <div class="opts">
        ${SCALE_LABELS[L].map((lab, i) => {
          const v = i + 1;
          return `<label class="opt${val === v ? ' on' : ''}" title="${lab}">
            <input type="radio" name="${item.id}" value="${v}"${val === v ? ' checked' : ''}>
            <span class="opt-num">${v}</span><span class="opt-lab">${lab}</span></label>`;
        }).join('')}
        ${item.nvt ? `<label class="opt opt-na${val === 'na' ? ' on' : ''}">
            <input type="radio" name="${item.id}" value="na"${val === 'na' ? ' checked' : ''}>
            <span class="opt-num">–</span><span class="opt-lab">${NVT_LABEL[L]}</span></label>` : ''}
      </div>`;
    sec.appendChild(scoreRow);
    host.appendChild(sec);
  });

  // tekst bewaren
  host.addEventListener('input', e => {
    const t = e.target;
    if (!t.dataset || !t.dataset.txt) return;
    const [dim, slot] = t.dataset.txt.split(':');
    const dd = PStore.load();
    dd.narrative[dim] = dd.narrative[dim] || {};
    dd.narrative[dim][slot] = t.value;
    PStore.save();
    onProgress();
  });
  // scores bewaren
  host.addEventListener('change', e => {
    const t = e.target;
    if (t.type !== 'radio') return;
    const dd = PStore.load();
    dd.answers[t.name] = t.value === 'na' ? 'na' : Number(t.value);
    PStore.save();
    const row = t.closest('.item');
    row.querySelectorAll('.opt').forEach(o => o.classList.toggle('on', o.contains(t)));
    onProgress();
  });

  // opnameknoppen
  let active = null;
  host.querySelectorAll('[data-rec]').forEach(btn => {
    const key = btn.dataset.rec;
    const audio = host.querySelector(`[data-audio="${CSS.escape(key)}"]`);
    const delBtn = host.querySelector(`[data-del="${CSS.escape(key)}"]`);
    const timeEl = host.querySelector(`[data-time="${CSS.escape(key)}"]`);
    const ta = btn.closest('.narrative-q').querySelector('textarea');

    AudioStore.get(key).then(b => { if (b) { audio.src = URL.createObjectURL(b); audio.hidden = false; delBtn.hidden = false; } })
      .catch(() => {});

    let timer = null, t0 = 0;
    btn.addEventListener('click', async () => {
      if (active && active.btn !== btn) { active.rec.stop(); }
      if (btn.classList.contains('on')) {
        active.rec.stop(); active = null;
        btn.classList.remove('on');
        btn.lastChild.textContent = Lang.t('recStart');
        clearInterval(timer); timeEl.textContent = '';
        return;
      }
      const base = ta.value ? ta.value.trim() + ' ' : '';
      const rec = makeRecorder(key, {
        transcribe: true,
        onText: (settled, interim) => {
          ta.value = base + settled + interim;
          const dd = PStore.load();
          const [dim, slot] = ta.dataset.txt.split(':');
          dd.narrative[dim] = dd.narrative[dim] || {};
          dd.narrative[dim][slot] = base + settled;
          PStore.save();
          onProgress();
        },
        onClip: (blob) => {
          audio.src = URL.createObjectURL(blob);
          audio.hidden = false; delBtn.hidden = false;
        }
      });
      try {
        await rec.start();
      } catch (err) {
        alert(Lang.t('micDenied'));
        return;
      }
      active = { rec, btn };
      btn.classList.add('on');
      btn.lastChild.textContent = Lang.t('recStop');
      t0 = Date.now();
      timer = setInterval(() => {
        const s = Math.floor((Date.now() - t0) / 1000);
        timeEl.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
      }, 500);
    });

    delBtn.addEventListener('click', () => {
      AudioStore.del(key).then(() => { audio.hidden = true; audio.removeAttribute('src'); delBtn.hidden = true; });
    });
  });
}
