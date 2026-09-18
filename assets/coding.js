/* PCCD Audit — automatische thematisering van open antwoorden.
   Drie stappen naar het model van de gefundeerde theorie:
     open      fragmenten opdelen en per fragment betekenisdragende codes afleiden
     axiaal    codes groeperen tot categorieen op grond van hun samen voorkomen
     selectief de kerncategorie bepalen en het verband met de andere beschrijven

   BELANGRIJK: dit is een geautomatiseerde eerste slag, geen interpretatie.
   De uitkomst is een voorstel dat de onderzoeker leest, corrigeert en
   verantwoordt. Alles is aanpasbaar en de wijzigingen worden bewaard. */

const NL_STOP = new Set(('de het een en of maar want dus als dan toch ook nog al wel niet geen te te ' +
 'ik jij je u hij zij ze wij we jullie hem haar hen hun mij me mijn jouw uw zijn haar ons onze ' +
 'die dat deze dit daar hier er waar wat wie hoe waarom wanneer welke welk ' +
 'is zijn was waren ben bent word wordt worden werd werden heb hebt heeft hebben had hadden ' +
 'kan kunt kunnen kon konden zal zult zullen zou zouden mag mogen moest moesten moet moeten ' +
 'ga gaat gaan ging gingen doe doet doen deed deden kom komt komen kwam kwamen ' +
 'van voor met bij aan op in uit over door tot naar om onder tussen tegen zonder na sinds ' +
 'zo heel erg veel meer meest weinig minder wat beetje echt eigenlijk gewoon even nou ja nee ' +
 'maar toen altijd nooit soms vaak weer eens per elke elk alle iedere ieder iets niets iemand niemand ' +
 'zelf zelfde ander andere anders wel eens hoor natuurlijk misschien vooral bijvoorbeeld omdat ' +
 'terwijl hoewel zodat doordat opdat want daarom daardoor daarbij daarna hierbij hierna ' +
 'een_beetje uh uhm ehm hmm oke oké goed dank dankjewel ' +
 'worden wordt geworden geweest gedaan gaan gehad ' +
 'meneer mevrouw man vrouw mensen persoon ding dingen keer moment momenten tijd ' +
 'denk denkt vind vindt weet weten zeg zegt zei zeggen ' +
 'iets_meer wat_meer nogal best redelijk'
 ).split(/\s+/).filter(Boolean));

// versimpelde stam: haalt de meest voorkomende Nederlandse uitgangen eraf
function stem(w) {
  let s = w;
  s = s.replace(/(heden|ingen|hedens)$/, 'heid');
  s = s.replace(/(tjes|pjes|kjes|etjes)$/, '');
  s = s.replace(/(ende|end)$/, 'en');
  s = s.replace(/(eren|eert|eerde)$/, 'eer');
  s = s.replace(/(en|er|st|te|de|s)$/, '');
  if (s.length < 3) return w;
  // dubbele medeklinker aan het eind terugbrengen (loppen -> lop -> lopen blijft herkenbaar)
  s = s.replace(/([bcdfgklmnprstvz])\1$/, '$1');
  return s;
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !NL_STOP.has(w) && !/^\d+$/.test(w));
}

function splitFragments(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map(t => t.trim())
    .filter(t => t.split(/\s+/).length >= 4);
}

/* ---------- 1. OPEN CODEREN ---------- */
function openCoding(fragments) {
  // documentfrequentie van stammen en van tweewoordcombinaties
  const df = new Map(), forms = new Map(), bigramDf = new Map(), bigramForms = new Map();
  const prepped = fragments.map(fr => {
    const toks = tokenize(fr.text);
    const stems = toks.map(stem);
    const uniq = [...new Set(stems)];
    uniq.forEach(s => df.set(s, (df.get(s) || 0) + 1));
    stems.forEach((s, i) => {
      const m = forms.get(s) || new Map();
      m.set(toks[i], (m.get(toks[i]) || 0) + 1);
      forms.set(s, m);
    });
    const bis = [], biForms = [];
    for (let i = 0; i < stems.length - 1; i++) {
      bis.push(stems[i] + ' ' + stems[i + 1]);
      biForms.push(toks[i] + ' ' + toks[i + 1]);
    }
    [...new Set(bis)].forEach(bg => bigramDf.set(bg, (bigramDf.get(bg) || 0) + 1));
    bis.forEach((bg, i) => {
      const m = bigramForms.get(bg) || new Map();
      m.set(biForms[i], (m.get(biForms[i]) || 0) + 1);
      bigramForms.set(bg, m);
    });
    return { fr, stems, bis };
  });

  const N = fragments.length || 1;
  const label = (key, map) => {
    const m = map.get(key);
    if (!m) return key;
    return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
  };

  // kandidaatcodes: minstens twee keer voorkomend, niet in bijna elk fragment
  const cand = new Map();
  df.forEach((n, s) => { if (n >= 2 && n / N < 0.85) cand.set(s, { key: s, n, bi: false }); });
  bigramDf.forEach((n, bg) => { if (n >= 3 && n / N < 0.6) cand.set(bg, { key: bg, n, bi: true }); });

  // per fragment de sterkste codes toekennen (tf-idf-achtig, tweewoorden wegen zwaarder)
  const codes = new Map();
  prepped.forEach(({ fr, stems, bis }) => {
    const tf = new Map();
    stems.forEach(s => tf.set(s, (tf.get(s) || 0) + 1));
    bis.forEach(b => tf.set(b, (tf.get(b) || 0) + 1.1));
    const scored = [...new Set([...stems, ...bis])]
      .filter(k => cand.has(k))
      .map(k => {
        const c = cand.get(k);
        return { k, score: (tf.get(k) || 1) * Math.log(1 + N / c.n) * (c.bi ? 1.15 : 1) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    fr.codes = scored.map(x => x.k);
    fr.codes.forEach(k => {
      if (!codes.has(k)) {
        codes.set(k, {
          id: k,
          label: cand.get(k).bi ? label(k, bigramForms) : label(k, forms),
          fragments: [], dims: new Set()
        });
      }
      codes.get(k).fragments.push(fr.id);
      codes.get(k).dims.add(fr.dim);
    });
  });

  // fragmenten zonder code krijgen hun meest kenmerkende woord
  prepped.forEach(({ fr, stems }) => {
    if (fr.codes.length || !stems.length) return;
    const s = stems[0];
    const k = 'los:' + s;
    if (!codes.has(k)) codes.set(k, { id: k, label: label(s, forms) || s, fragments: [], dims: new Set(), loose: true });
    fr.codes = [k];
    codes.get(k).fragments.push(fr.id);
    codes.get(k).dims.add(fr.dim);
  });

  return [...codes.values()]
    .map(c => ({ ...c, dims: [...c.dims], n: c.fragments.length }))
    .sort((a, b) => b.n - a.n);
}

function RESIDUAL_LABEL() {
  return (typeof Lang !== 'undefined' && Lang.get() === 'en')
    ? 'Remaining, scattered codes' : 'Overig \u2014 verspreide codes';
}

/* ---------- 2. AXIAAL CODEREN ---------- */
// Codes die vaak in dezelfde fragmenten voorkomen horen bij elkaar.
function axialCoding(codes, fragments) {
  const byId = new Map(fragments.map(f => [f.id, f]));
  const sets = new Map(codes.map(c => [c.id, new Set(c.fragments)]));
  const jac = (a, b) => {
    const A = sets.get(a), B = sets.get(b);
    let inter = 0;
    A.forEach(x => { if (B.has(x)) inter++; });
    const uni = A.size + B.size - inter;
    return uni ? inter / uni : 0;
  };

  // Agglomeratief samenvoegen: telkens het paar met de grootste overlap, totdat
  // er een hanteerbaar aantal categorieen over is. Een vaste drempel levert bij
  // veel materiaal tientallen minicategorieen op, en dat is geen axiale codering.
  let clusters = codes.map(c => ({ codes: [c.id], frags: new Set(c.fragments) }));
  const target = Math.max(5, Math.min(12, Math.round(Math.sqrt(fragments.length / 3))));
  const overlap = (a, b) => {
    let inter = 0;
    (a.frags.size < b.frags.size ? a.frags : b.frags).forEach(x => {
      if ((a.frags.size < b.frags.size ? b.frags : a.frags).has(x)) inter++;
    });
    const uni = a.frags.size + b.frags.size - inter;
    return uni ? inter / uni : 0;
  };
  let guard = 0;
  while (clusters.length > target && guard++ < 500) {
    let best = 0, bi = -1, bj = -1;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const o = overlap(clusters[i], clusters[j]);
        if (o > best) { best = o; bi = i; bj = j; }
      }
    }
    if (bi < 0 || best <= 0) break;
    clusters[bi].codes = clusters[bi].codes.concat(clusters[bj].codes);
    clusters[bj].frags.forEach(x => clusters[bi].frags.add(x));
    clusters.splice(bj, 1);
  }
  // Als er geen overlap meer is maar er nog te veel clusters zijn, houden we de
  // grootste aan en brengen we de rest samen onder in een restcategorie. Dat is
  // eerlijker dan losse codes kunstmatig aan elkaar plakken: ook in handmatig
  // coderen blijft er materiaal over dat nog geen categorie vormt.
  if (clusters.length > target) {
    clusters.sort((a, b) => b.frags.size - a.frags.size);
    const keep = clusters.slice(0, target - 1);
    const rest = clusters.slice(target - 1);
    const merged = { codes: [], frags: new Set(), residual: true };
    rest.forEach(c => {
      merged.codes = merged.codes.concat(c.codes);
      c.frags.forEach(x => merged.frags.add(x));
    });
    clusters = keep.concat(merged.codes.length ? [merged] : []);
  }

  const codeById = new Map(codes.map(c => [c.id, c]));
  return clusters.map((cl, i) => {
    const members = cl.codes.map(id => codeById.get(id)).sort((a, b) => b.n - a.n);
    const dims = new Set();
    const frags = [...cl.frags];
    frags.forEach(fid => dims.add(byId.get(fid).dim));
    return {
      id: 'cat' + (i + 1),
      label: cl.residual ? RESIDUAL_LABEL() : (() => {
        const picked = [];
        for (const m of members) {
          const words = new Set(m.label.split(/\s+/));
          if (picked.some(p => p.split(/\s+/).some(w => words.has(w)))) continue;
          picked.push(m.label);
          if (picked.length === 2) break;
        }
        return (picked.length ? picked : members.slice(0, 1).map(m => m.label)).join(' en ');
      })(),
      residual: !!cl.residual,
      codes: members.map(m => m.id),
      codeLabels: members.map(m => m.label),
      fragments: frags,
      dims: [...dims],
      n: frags.length
    };
  }).sort((a, b) => (a.residual ? 1 : 0) - (b.residual ? 1 : 0) || b.n - a.n);
}

/* ---------- 3. SELECTIEF CODEREN ---------- */
function selectiveCoding(categories, fragments, dims, L) {
  if (!categories.filter(c => !c.residual).length) return null;
  const byId = new Map(fragments.map(f => [f.id, f]));
  const dimName = new Map(dims.map(d => [d.id, d[L]]));
  // kern = de categorie die het breedst over de dimensies ligt en het vaakst voorkomt
  const scored = categories.filter(c => !c.residual).map(c => ({ c, score: c.dims.length * 2 + Math.log(1 + c.n) }))
    .sort((a, b) => b.score - a.score);
  const core = scored[0].c;
  const others = scored.slice(1, 4).map(x => x.c);

  const quote = (cat) => {
    const f = cat.fragments
      .map(id => byId.get(id))
      .sort((a, b) => b.text.length - a.text.length)
      .find(x => x.text.length > 40 && x.text.length < 300);
    return f || null;
  };

  const T = L === 'nl' ? {
    core: 'De kerncategorie is',
    spans: 'komt terug in {d} van de {t} dimensies en in {n} fragmenten',
    around: 'Daaromheen liggen',
    rel: '{c} verschijnt vooral bij {dims}',
    note: 'Dit is een geautomatiseerde eerste ordening op grond van taalgebruik. De categorieen zijn geen interpretatie: lees de fragmenten, hernoem wat niet klopt en verantwoord de keuzes zelf.',
    none: 'Er is nog te weinig tekst om een kerncategorie te bepalen.'
  } : {
    core: 'The core category is',
    spans: 'appears in {d} of the {t} dimensions and in {n} fragments',
    around: 'Around it lie',
    rel: '{c} appears mainly under {dims}',
    note: 'This is an automated first ordering based on word use. The categories are not an interpretation: read the fragments, rename what is wrong and justify the choices yourself.',
    none: 'There is not yet enough text to determine a core category.'
  };

  const story = [
    `${T.core} “${core.label}”: ${T.spans.replace('{d}', core.dims.length).replace('{t}', dims.length).replace('{n}', core.n)}.`,
    others.length ? `${T.around} ${others.map(o => `“${o.label}” (${o.n})`).join(', ')}.` : '',
    ...others.map(o => T.rel.replace('{c}', `“${o.label}”`)
      .replace('{dims}', o.dims.map(d => dimName.get(d)).join(', ')) + '.')
  ].filter(Boolean).join(' ');

  return { core, others, story, note: T.note, quote: quote(core) };
}

/* ---------- alles samen: een klik ---------- */
function runCoding(qKey, respondents, L) {
  const q = QUESTIONNAIRES[qKey];
  const fragments = [];
  let n = 0;
  respondents.forEach(r => {
    const nar = r.narrative || {};
    q.dims.forEach(d => {
      ['q1', 'q2'].forEach(slot => {
        const txt = (nar[d.id] || {})[slot];
        splitFragments(txt).forEach(t => {
          fragments.push({ id: 'f' + (++n), text: t, dim: d.id, respondent: r.label, slot, codes: [] });
        });
      });
    });
  });
  if (fragments.length < 3) return { fragments, codes: [], categories: [], selective: null, tooLittle: true };
  const codes = openCoding(fragments);
  const categories = axialCoding(codes, fragments);
  const selective = selectiveCoding(categories, fragments, q.dims, L);
  return { fragments, codes, categories, selective, tooLittle: false };
}

/* ---------- rapport ---------- */
function codingReport(res, qKey, L) {
  const q = QUESTIONNAIRES[qKey];
  const dimName = {}; q.dims.forEach(d => dimName[d.id] = d[L]);
  const byId = new Map(res.fragments.map(f => [f.id, f]));
  const lines = [];
  lines.push(`# ${L === 'nl' ? 'Thematische analyse' : 'Thematic analysis'} — ${q[L].title}`);
  lines.push('');
  lines.push(`${L === 'nl' ? 'Fragmenten' : 'Fragments'}: ${res.fragments.length} · ${L === 'nl' ? 'open codes' : 'open codes'}: ${res.codes.length} · ${L === 'nl' ? 'categorieen' : 'categories'}: ${res.categories.length}`);
  lines.push('');
  if (res.selective) {
    lines.push(`## ${L === 'nl' ? 'Selectief coderen' : 'Selective coding'}`);
    lines.push(res.selective.story);
    if (res.selective.quote) lines.push('', `> ${res.selective.quote.text}`, `> — ${res.selective.quote.respondent}, ${dimName[res.selective.quote.dim]}`);
    lines.push('', `_${res.selective.note}_`, '');
  }
  lines.push(`## ${L === 'nl' ? 'Axiaal coderen' : 'Axial coding'}`);
  res.categories.forEach(c => {
    lines.push('', `### ${c.label}  (${c.n})`);
    lines.push(`${L === 'nl' ? 'Open codes' : 'Open codes'}: ${c.codeLabels.join(', ')}`);
    lines.push(`${L === 'nl' ? 'Dimensies' : 'Dimensions'}: ${c.dims.map(d => dimName[d]).join(', ')}`);
    c.fragments.slice(0, 3).forEach(fid => {
      const f = byId.get(fid);
      lines.push(`- "${f.text}" — ${f.respondent}, ${dimName[f.dim]}`);
    });
  });
  lines.push('', `## ${L === 'nl' ? 'Open coderen' : 'Open coding'}`, '');
  lines.push(`| ${L === 'nl' ? 'Code' : 'Code'} | n | ${L === 'nl' ? 'Dimensies' : 'Dimensions'} |`);
  lines.push('|---|---|---|');
  res.codes.slice(0, 40).forEach(c => {
    lines.push(`| ${c.label} | ${c.n} | ${c.dims.map(d => dimName[d]).join(', ')} |`);
  });
  return lines.join('\n');
}

function aiPrompt(res, qKey, L) {
  const q = QUESTIONNAIRES[qKey];
  const dimName = {}; q.dims.forEach(d => dimName[d.id] = d[L]);
  const head = L === 'nl'
    ? `Hieronder staan interviewfragmenten van mantelzorgers over persoonsgerichte zorg, geordend per dimensie.
Voer een thematische analyse uit volgens de gefundeerde theorie:
1. Open coderen: benoem per fragment wat er gebeurt, dicht bij de woorden van de respondent.
2. Axiaal coderen: groepeer de open codes tot categorieen en beschrijf hun onderlinge verband.
3. Selectief coderen: bepaal de kerncategorie en schrijf in enkele alinea's het verhaal dat de fragmenten samen vertellen.
Onderbouw elke categorie met letterlijke citaten en vermeld waar je twijfelt.

`
    : `Below are interview fragments from informal carers about person-centred care, ordered by dimension.
Carry out a thematic analysis following grounded theory:
1. Open coding, 2. Axial coding, 3. Selective coding.
Support each category with verbatim quotes and note where you are uncertain.

`;
  const body = q.dims.map(d => {
    const frs = res.fragments.filter(f => f.dim === d.id);
    if (!frs.length) return '';
    return `## ${dimName[d.id]}\n` + frs.map(f => `- (${f.respondent}) ${f.text}`).join('\n');
  }).filter(Boolean).join('\n\n');
  return head + body;
}
