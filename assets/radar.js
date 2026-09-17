/* PCCD Audit — spinnenwebdiagram (radar), eigen SVG-renderer.
   Geen externe bibliotheken: werkt op GitHub Pages zonder netwerk.
   Kleuren worden als letterlijke hex in het SVG gezet, zodat de PNG-export klopt. */

const VIZ = {
  light: {
    surface: '#ffffff',
    grid: '#e3e2de',
    axis: '#c9c8c2',
    textPrimary: '#14130f',
    textSecondary: '#5c5b55',
    series: ['#2a78d6', '#eb6834', '#1baf7a']
  },
  dark: {
    surface: '#17171a',
    grid: '#33333a',
    axis: '#45454d',
    textPrimary: '#f4f4f2',
    textSecondary: '#a8a7a0',
    series: ['#3987e5', '#d95926', '#199e70']
  }
};

function isDark() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function vizColors() { return isDark() ? VIZ.dark : VIZ.light; }

const SVGNS = 'http://www.w3.org/2000/svg';
function el(name, attrs, text) {
  const n = document.createElementNS(SVGNS, name);
  for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
  if (text !== undefined) n.textContent = text;
  return n;
}

function wrapLabel(str, maxChars, maxLines) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines - 1);
    let last = lines.slice(maxLines - 1).join(' ');
    if (last.length > maxChars) last = last.slice(0, Math.max(1, maxChars - 1)).replace(/\s+\S*$/, '') + '…';
    kept.push(last);
    return kept;
  }
  return lines;
}

/**
 * @param {HTMLElement} host  container (position:relative)
 * @param {Object} o
 *   axes:   [{label, full}]
 *   series: [{name, color, values:[number|null]}]
 *   min,max: schaalgrenzen
 */
function renderRadar(host, o) {
  const C = vizColors();
  const axes = o.axes || [];
  const series = (o.series || []).filter(s => s.values.some(v => v !== null && v !== undefined));
  const min = o.min ?? 1, max = o.max ?? 5;
  const n = axes.length;

  host.innerHTML = '';
  if (!n || !series.length) {
    const p = document.createElement('p');
    p.className = 'viz-empty';
    p.textContent = o.emptyText || '';
    host.appendChild(p);
    return;
  }

  const compact = !!o.compact;
  const many = n > 10;
  const hasLegend = series.length >= 2 && !compact;
  const legendH = hasLegend ? 46 : 0;
  const W = compact ? 260 : (many ? 860 : 760);
  const bodyH = compact ? 260 : (many ? 660 : 590);
  const H = bodyH + legendH;
  const cx = W / 2;
  const cy = compact ? 130 : bodyH / 2;
  const R = compact ? 96 : (many ? 208 : 194);
  const labelPad = 24;
  const fontAxis = many ? 12.5 : 14;
  const maxChars = many ? 17 : 19;
  const maxLines = 3;

  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`, class: 'radar',
    role: 'img', 'aria-label': o.ariaLabel || 'Spinnenwebdiagram',
    xmlns: SVGNS, preserveAspectRatio: 'xMidYMid meet'
  });
  svg.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: C.surface }));

  const ang = i => (-Math.PI / 2) + (i * 2 * Math.PI / n);
  const rad = v => ((v - min) / (max - min)) * R;
  const pt = (i, v) => [cx + Math.cos(ang(i)) * rad(v), cy + Math.sin(ang(i)) * rad(v)];

  // ringen (recessief)
  const g = el('g', {});
  for (let lvl = min; lvl <= max; lvl++) {
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(pt(i, lvl).map(x => x.toFixed(1)).join(','));
    g.appendChild(el('polygon', {
      points: pts.join(' '), fill: 'none',
      stroke: lvl === max ? C.axis : C.grid,
      'stroke-width': lvl === max ? 1.25 : 1
    }));
  }
  // assen
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, max);
    g.appendChild(el('line', { x1: cx, y1: cy, x2: x.toFixed(1), y2: y.toFixed(1), stroke: C.grid, 'stroke-width': 1 }));
  }
  // schaalcijfers op de verticale as
  if (!compact) {
    for (let lvl = min; lvl <= max; lvl++) {
      g.appendChild(el('text', {
        x: cx + 6, y: (cy - rad(lvl) + 4).toFixed(1),
        fill: C.textSecondary, 'font-size': 10.5, 'font-family': 'inherit'
      }, String(lvl)));
    }
  }
  svg.appendChild(g);

  // reeksen
  const markers = [];
  series.forEach((s, si) => {
    const color = s.color || C.series[si % C.series.length];
    const pts = [], present = [];
    for (let i = 0; i < n; i++) {
      const v = s.values[i];
      if (v === null || v === undefined || isNaN(v)) continue;
      const p = pt(i, Math.max(min, Math.min(max, v)));
      pts.push(p); present.push(i);
    }
    if (!pts.length) return;
    const closed = pts.length === n;
    const d = pts.map((p, k) => (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + (closed ? ' Z' : '');
    if (closed) svg.appendChild(el('path', { d, fill: color, 'fill-opacity': series.length > 1 ? 0.1 : 0.14, stroke: 'none' }));
    svg.appendChild(el('path', { d, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    pts.forEach((p, k) => {
      // 2px surface-ring, zodat overlappende punten leesbaar blijven
      svg.appendChild(el('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: compact ? 3.6 : 6, fill: C.surface }));
      const c = el('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: compact ? 2.4 : 4.5, fill: color });
      svg.appendChild(c);
      if (!compact) markers.push({ x: p[0], y: p[1], axis: present[k], series: si, color });
    });
  });

  // hittargets + tooltip
  const tip = document.createElement('div');
  tip.className = 'viz-tip';
  tip.hidden = true;
  markers.forEach(m => {
    const hit = el('circle', { cx: m.x.toFixed(1), cy: m.y.toFixed(1), r: 14, fill: 'transparent', style: 'cursor:pointer' });
    const show = () => {
      const a = axes[m.axis];
      const rows = series.map((s, si) => {
        const v = s.values[m.axis];
        const col = s.color || C.series[si % C.series.length];
        return `<span class="viz-tip-row"><i style="background:${col}"></i>${s.name}: <b>${v === null || v === undefined ? '—' : v.toFixed(2)}</b></span>`;
      }).join('');
      tip.innerHTML = `<strong>${a.full || a.label}</strong>${rows}`;
      tip.hidden = false;
      const box = host.getBoundingClientRect();
      const scale = box.width / W;
      tip.style.left = Math.round(m.x * scale) + 'px';
      tip.style.top = Math.round(m.y * scale) + 'px';
    };
    hit.addEventListener('mouseenter', show);
    hit.addEventListener('focus', show);
    hit.addEventListener('mouseleave', () => { tip.hidden = true; });
    hit.addEventListener('blur', () => { tip.hidden = true; });
    hit.setAttribute('tabindex', '0');
    svg.appendChild(hit);
  });

  // aslabels
  for (let i = 0; !compact && i < n; i++) {
    const a = ang(i);
    const lx = cx + Math.cos(a) * (R + labelPad);
    const ly = cy + Math.sin(a) * (R + labelPad);
    const cos = Math.cos(a);
    let anchor = 'middle';
    if (cos > 0.25) anchor = 'start';
    else if (cos < -0.25) anchor = 'end';
    const lines = wrapLabel(axes[i].label, maxChars, maxLines);
    const lh = fontAxis + 2.5;
    const y0 = ly - ((lines.length - 1) * lh) / 2 + fontAxis * 0.35;
    const t = el('text', {
      x: lx.toFixed(1), y: y0.toFixed(1), 'text-anchor': anchor,
      fill: C.textSecondary, 'font-size': fontAxis, 'font-family': 'inherit'
    });
    lines.forEach((ln, k) => {
      t.appendChild(el('tspan', { x: lx.toFixed(1), dy: k ? lh : 0 }, ln));
    });
    svg.appendChild(t);
  }

  // legenda (altijd bij twee of meer reeksen)
  if (series.length >= 2 && !compact) {
    const lg = el('g', {});
    const itemW = 190;
    const startX = cx - (series.length * itemW) / 2 + itemW / 2;
    series.forEach((s, si) => {
      const color = s.color || C.series[si % C.series.length];
      const x = startX + si * itemW;
      const y = bodyH + 22;
      lg.appendChild(el('line', { x1: x - 46, y1: y, x2: x - 22, y2: y, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }));
      lg.appendChild(el('circle', { cx: x - 34, cy: y, r: 4.5, fill: color }));
      lg.appendChild(el('text', { x: x - 14, y: y + 4.5, fill: C.textPrimary, 'font-size': 14, 'font-family': 'inherit' }, s.name));
    });
    svg.appendChild(lg);
  }

  host.appendChild(svg);
  host.appendChild(tip);
  host._radar = { svg, W, H };
}

/* --- PNG-export: SVG serialiseren en op canvas tekenen --- */
function radarToPng(host, filename) {
  const store = host._radar;
  if (!store) return;
  const clone = store.svg.cloneNode(true);
  clone.setAttribute('xmlns', SVGNS);
  clone.setAttribute('width', store.W);
  clone.setAttribute('height', store.H);
  const fam = getComputedStyle(document.body).fontFamily || 'sans-serif';
  clone.setAttribute('font-family', fam);
  clone.querySelectorAll('[style]').forEach(n => n.removeAttribute('style'));

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = store.W * scale;
    canvas.height = store.H * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = vizColors().surface;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
