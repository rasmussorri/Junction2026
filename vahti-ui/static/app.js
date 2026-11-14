/* Cancer Strategy Monitor – UI (vanilla JS, no external libraries) */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (v, d = 1) => v == null ? '–' : Number(v).toLocaleString('en-GB', { maximumFractionDigits: d });
const enc = encodeURIComponent;
const FI = 'FI';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let D, M, AI = { ai: false };
let sel = FI;
const chats = {};
const showAll = {};

const SHORT = {
  'S1.1': 'PROM & NPS measured systematically', 'S1.2': 'NPS above 80',
  'S2.1': 'Preventable cancers −1,000 / year', 'S2.2': 'Screening participation ≥ 80%', 'S2.3': '≥ 70% diagnosed at stage I–II',
  'S3.1': 'Poor-prognosis survival to Nordic level', 'S3.2': 'Cancer mortality −10%', 'S3.3': 'Treatment within target times',
  'S4.1': 'New cancer studies +10% / year', 'S4.2': '> 10% of patients in interventional trials', 'S4.3': 'Single-channel assessment of cancer medicines'
};
const TIER = { A: 'Review or official guideline', B: 'Study or public authority', C: 'News or practical example' };

/* ---------- helpers ---------- */
const per = p => p && p.length === 7 ? `${MON[+p.slice(5) - 1]} ${p.slice(0, 4)}` : p;
const rname = r => r === FI ? 'Whole country' : r;
const val = (m, r) => r === FI ? M[m].national : M[m].values[r];
const isOk = (m, v) => v == null ? null : (M[m].kind === 'min' ? v >= M[m].target : v <= 0);
const mOk = (m, r) => isOk(m, val(m, r));
const fmt = (m, v) => v == null ? '–' : M[m].unit === '%' ? `${nf(v)}%` : nf(v, 0);
const fmtT = m => M[m].kind === 'min' ? `≥ ${nf(M[m].target, 0)}%` : (M[m].unit === '%' ? '0%' : '0');
const allTargets = () => D.goals.flatMap(g => g.targets.map(t => ({ ...t, goal: g })));
const T = id => allTargets().find(t => t.id === id);
const parentOf = m => m === 'mort' ? T('S3.2') : allTargets().find(t => (t.measures || []).includes(m) || (t.support || []).includes(m));
const byName = (a, b) => a.localeCompare(b, 'fi');

function mort() {
  const mo = D.mort, last = Math.max(...Object.keys(mo.counts).map(Number));
  const path = Math.round(mo.baseline - (mo.baseline - mo.target) / (mo.target_year - mo.baseline_year) * (last - mo.baseline_year));
  return { mo, last, v: mo.counts[last], path };
}
const cls = ok => ok === false ? 'bad' : ok ? 'ok' : '';
const num = (txt, ok) => `<span class="num ${cls(ok)}">${txt}</span>`;
function tStatus(t, r) {
  if (t.type === 'measures') {
    if (M[t.measures[0]].kind === 'min') { const a = agg(t, r); return a.ok == null ? 'na' : a.ok ? 'ok' : 'bad'; }
    const s = t.measures.map(m => mOk(m, r));
    if (s.includes(false)) return 'bad';
    return s.every(x => x == null) ? 'na' : 'ok';
  }
  if (t.type === 'national') { const x = mort(); return x.v > x.path ? 'bad' : 'ok'; }
  return 'na';
}
/* main goal: not met if any target is below target; no data if no target has data */
function gStatus(g, r) {
  const st = g.targets.map(t => tStatus(t, r)), n = st.filter(x => x === 'bad').length;
  return { n, c: n ? 'red' : st.every(x => x === 'na') ? 'na' : 'green' };
}
/* area colour by targets not met: 0–3 = green, 4–5 = yellow, 6 or more = red */
function overall(r) { const n = allTargets().filter(t => tStatus(t, r) === 'bad').length; return { n, c: n <= 3 ? 'green' : n <= 5 ? 'yellow' : 'red' }; }
const gLabel = s => s.n ? 'Not met' : s.c === 'na' ? 'No data' : 'Met';
const oLabel = o => `${o.n} of ${allTargets().length} targets not met`;
/* summary value for a target with several measures */
const AVG_LABEL = { 'S2.1': 'Average HPV vaccination coverage', 'S2.2': 'Average screening participation' };
function agg(t, r) {
  if (M[t.measures[0]].kind === 'zero') {
    const vs = t.measures.filter(m => M[m].unit === 'patients').map(m => val(m, r)).filter(v => v != null);
    const v = vs.length ? vs.reduce((a, b) => a + b, 0) : null;
    return { label: 'Patients waiting > 90 days', v, text: v == null ? '–' : nf(v, 0), target: '0', ok: v == null ? null : v <= 0 };
  }
  const tg = M[t.measures[0]].target, vs = t.measures.map(m => val(m, r)).filter(v => v != null);
  const v = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
  return { label: AVG_LABEL[t.id] || 'Average', v, text: v == null ? '–' : `${nf(v)}%`, target: `≥ ${tg}%`, ok: v == null ? null : v >= tg };
}
const tLabel = s => ({ ok: 'Met', bad: 'Not met', na: 'No data', nat: 'National target' }[s]);
const pill = (cls, txt) => `<span class="pill ${cls}">${esc(txt)}</span>`;

/* ---------- start ---------- */
Promise.all([
  window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data.json').then(r => r.json()),
  location.protocol === 'file:' ? Promise.resolve({ ai: false, offline: true }) : fetch('api/status').then(r => r.json()).catch(() => ({ ai: false, offline: true }))
]).then(([d, s]) => {
  D = d; M = d.measures; AI = s;
  $('#askBtn').onclick = () => toggleDrawer(true);
  $('#drawerClose').onclick = () => toggleDrawer(false);
  window.addEventListener('hashchange', route); route();
});
document.addEventListener('scroll', () => { $('#tooltip').style.opacity = 0; }, true);

function route() {
  $('#tooltip').style.opacity = 0;
  const h = location.hash.replace(/^#\/?/, '');
  const [path, q] = h.split('?');
  const r = new URLSearchParams(q || '').get('r');
  if (r && (r === FI || D.regions.includes(r))) sel = r;
  const [kind, id] = path.split('/');
  const v = $('#view');
  if (kind === 'goal' && D.goals.find(g => g.id === id)) renderGoal(v, id);
  else if (kind === 't' && T(id) && T(id).type === 'measures') renderTarget(v, id);
  else if (kind === 'm' && (M[id] || id === 'mort')) renderMeasure(v, id);
  else renderHome(v);
  window.scrollTo(0, 0);
}

/* ---------- home: areas | map | status ---------- */
function renderHome(v) {
  const regs = D.regions.slice().sort(byName);
  v.innerHTML = `<div class="home">
    <aside class="areas"><div class="areas-title">Areas</div>
      ${[FI, ...regs].map(r => `<div class="area ${r === FI ? 'fi' : ''} ${r === sel ? 'on' : ''}" data-r="${esc(r)}">${esc(rname(r))}</div>`).join('')}
    </aside>
    <section class="mapcol">
      <div class="map-title"><h1>Strategy targets by area</h1><span class="sub" style="color:var(--muted)">Hover an area in the list or click the map</span></div>
      <div class="mapbox">${mapSvg()}</div>
      <div class="legend"><span><i class="dot green"></i>0–3 targets not met</span><span><i class="dot yellow"></i>4–5 targets not met</span><span><i class="dot red"></i>6 or more targets not met</span></div>
    </section>
    <aside class="status" id="status"></aside>
  </div>`;
  v.querySelectorAll('.area').forEach(el => {
    el.addEventListener('mouseenter', () => select(el.dataset.r));
    el.addEventListener('click', () => select(el.dataset.r));
  });
  const tip = $('#tooltip');
  v.querySelectorAll('.mapbox path[data-r]').forEach(p => {
    p.addEventListener('mousemove', e => {
      const o = overall(p.dataset.r);
      tip.innerHTML = `<b>${esc(p.dataset.r)}</b> · ${oLabel(o)}`;
      tip.style.left = (e.clientX + 12) + 'px'; tip.style.top = (e.clientY + 12) + 'px'; tip.style.opacity = 1;
    });
    p.addEventListener('mouseleave', () => tip.style.opacity = 0);
    p.addEventListener('click', () => select(p.dataset.r));
  });
  renderStatus();
}
function mapSvg() {
  const { W, H, features } = D.map;
  return `<svg viewBox="0 0 ${W} ${H}" class="${sel === FI ? 'fi' : ''}" role="img" aria-label="Map of Finland's wellbeing services counties">
    <g class="outline">${features.filter(f => f.alue !== 'Ahvenanmaa').map(f => `<path d="${f.d}"></path>`).join('')}</g>${features.map(f =>
    f.alue === 'Ahvenanmaa' ? `<path class="na" d="${f.d}"></path>`
      : `<path d="${f.d}" data-r="${esc(f.alue)}" class="${overall(f.alue).c} ${f.alue === sel ? 'sel' : ''}"></path>`).join('')}</svg>`;
}
function select(r) {
  if (r === sel) return;
  sel = r;
  document.querySelectorAll('.area').forEach(a => a.classList.toggle('on', a.dataset.r === sel));
  const svg = document.querySelector('.mapbox svg'); if (svg) svg.classList.toggle('fi', sel === FI);
  document.querySelectorAll('.mapbox path[data-r]').forEach(p => {
    const on = p.dataset.r === sel; p.classList.toggle('sel', on);
    if (on) p.parentNode.appendChild(p);
  });
  renderStatus();
}
function targetLine(t, r) {
  const s = tStatus(t, r);
  return `<li><span class="dot ${s}"></span><span>${esc(SHORT[t.id])}</span><span class="ts ${s}">${esc(tLabel(s))}</span></li>`;
}
function renderStatus() {
  const el = $('#status'); if (!el) return;
  const o = overall(sel);
  el.innerHTML = `<div class="st-head"><div class="st-title">${esc(rname(sel))}</div>${pill(o.c, oLabel(o))}</div>
    <div class="st-sub">${sel === FI ? 'National average · ' : ''}HPV ${M.hpv_tytot.period} · Screening ${M.suolisto.period} · Waiting times ${per(M.onk90.period)} · Mortality ${mort().last}</div>
    ${D.goals.map(g => {
      return `<a class="gcard" href="#/goal/${g.id}?r=${enc(sel)}">
        <div class="gtop"><span class="gnum">${g.id}</span><span class="gtitle">${esc(g.title)}</span></div>
        <ul class="tlist">${g.targets.map(t => targetLine(t, sel)).join('')}</ul>
        <div class="chev">Open goal ›</div></a>`;
    }).join('')}`;
}

/* ---------- shared blocks ---------- */
function crumbs(trail) {
  return `<div class="crumbs"><button class="btn" onclick="history.length > 1 ? history.back() : (location.hash = '#/')">← Back</button>
    <a class="btn" href="#/">⌂ Home</a><span class="trail">${trail}</span></div>`;
}
function contactCard(r, role) {
  const c = D.contacts[r][role];
  return `<div class="card contact"><div><div style="font-weight:600">${esc(rname(r))}</div><div class="c" style="color:var(--muted);font-size:12.5px">${esc(c.role)}</div></div>
    <div class="who"><span class="n">${esc(c.name)}</span>
    <span class="c"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a> · ${esc(c.phone)}</span></div></div>`;
}
function peersBlock(key, list, valueOf, role, intro, label) {
  const all = showAll[key], shown = all ? list : list.slice(0, 5);
  return `<div class="hint">${intro}</div><div class="peers">${shown.map(p => {
    const c = D.contacts[p.r][role];
    return `<div class="card peer"><div class="pr">${esc(p.r)}</div><div class="pv ${p.good ? 'ok' : 'bad'}"><span class="pk">${esc(label)}</span>${esc(valueOf(p.r))}</div>
      <div class="pc"><span class="n">${esc(c.name)}</span><span class="c">${esc(c.role)}</span>
      <span class="c"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a> · ${esc(c.phone)}</span></div></div>`;
  }).join('')}</div>
  ${list.length > 5 ? `<button class="more" data-more="${esc(key)}">${all ? 'Show fewer' : `Show all ${list.length}`}</button>` : ''}`;
}
function bindMore(root, rerender) {
  root.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { showAll[b.dataset.more] = !showAll[b.dataset.more]; rerender(); });
}
const sizeDiff = (a) => Math.abs((D.size[a] || 0) - (sel === FI ? 0 : (D.size[sel] || 0)));
function peersForMeasure(m) {
  const regs = D.regions.filter(r => r !== sel);
  let list = regs.filter(r => mOk(m, r) === true);
  if (M[m].kind === 'min') list.sort((a, b) => val(m, b) - val(m, a));
  else list.sort((a, b) => (sel === FI ? byName(a, b) : sizeDiff(a) - sizeDiff(b)) || byName(a, b));
  if (list.length) return { list: list.map(r => ({ r, good: true })), closest: false };
  const c = regs.filter(r => val(m, r) != null).sort((a, b) => M[m].kind === 'min' ? val(m, b) - val(m, a) : val(m, a) - val(m, b)).slice(0, 3);
  return { list: c.map(r => ({ r, good: false })), closest: true };
}
function peersForTarget(t) {
  const regs = D.regions.filter(r => r !== sel);
  let list = regs.filter(r => tStatus(t, r) === 'ok').sort((a, b) => (sel === FI ? byName(a, b) : sizeDiff(a) - sizeDiff(b)) || byName(a, b));
  if (list.length) return { list: list.map(r => ({ r, good: true })), closest: false };
  const bad = r => t.measures.filter(m => mOk(m, r) === false).length;
  const c = M[t.measures[0]].kind === 'min'
    ? regs.filter(r => agg(t, r).v != null).sort((a, b) => agg(t, b).v - agg(t, a).v).slice(0, 3)
    : regs.slice().sort((a, b) => bad(a) - bad(b) || (agg(t, a).v ?? 1e9) - (agg(t, b).v ?? 1e9)).slice(0, 3);
  return { list: c.map(r => ({ r, good: false })), closest: true };
}
function targetValueText(t, r) {
  if (M[t.measures[0]].kind === 'zero') { const k = t.measures.filter(m => mOk(m, r) === false).length; return k ? `Breaches in ${k} of ${t.measures.length} measures` : 'No breaches'; }
  return agg(t, r).text;
}
const peerLabel = t => M[t.measures[0]].kind === 'zero' ? 'Waiting-time breaches' : t.id === 'S2.1' ? 'Average coverage' : 'Average participation';

/* ---------- reports ---------- */
function reportSlot(id) { return `<div class="card report" data-report="${esc(id)}"><div class="ai-note"><span class="spinner"></span> Loading report…</div></div>`; }
function loadReports(root) {
  root.querySelectorAll('[data-report]').forEach(box => {
    const id = box.dataset.report, pre = window.__REPORTS__ && window.__REPORTS__[id];
    const p = pre ? Promise.resolve(pre) : AI.offline ? Promise.resolve({ missing: true, reason: 'offline' }) : fetch(`api/report?id=${enc(id)}`).then(r => r.json());
    p.then(rep => box.innerHTML = reportHtml(rep)).catch(() => box.innerHTML = '<div class="note">Could not load the report.</div>');
  });
}
function reportHtml(rep) {
  if (rep.missing) return `<div class="note">${rep.reason === 'no_key' ? 'No report yet. The AI compiles one from the web with Gemini once GEMINI_API_KEY is set in .env.'
    : rep.reason === 'offline' ? 'No report yet. The AI compiles one from the web when the app runs on its server (Kaynnista_vahti.command) with a Gemini key.'
      : 'The report could not be compiled: ' + esc(rep.reason || '')}</div>`;
  return `<div class="ai-note"><span class="badge" style="background:var(--accent-soft);color:var(--accent)">AI-compiled</span>
      <b style="color:var(--ink)">${esc(rep.title || '')}</b> · ${rep.generated === 'live' ? 'compiled from the web' : 'compiled ' + esc(rep.generated)} · verify sources</div>
    ${(rep.sections || []).map(s => `<div class="rsec"><h4><span class="flag">${esc(s.name)}</span></h4>
      ${s.items.map(it => `<div class="ritem"><p>${esc(it.text)}</p>${(it.sources || []).map(x =>
        `<a class="src" href="${esc(x.url)}" target="_blank" rel="noopener" title="${esc(TIER[x.tier] || '')}">${x.tier ? `<span class="tier ${x.tier}">${x.tier}</span>` : ''}${esc(x.title)} ↗</a>`).join('')}</div>`).join('')}</div>`).join('')}
    ${(rep.all_sources || []).length ? `<div class="rsec"><h4><span class="flag">All sources</span></h4>${rep.all_sources.map(x => `<a class="src" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join('')}</div>` : ''}
    <div class="note">Source levels: <span class="tier A">A</span> ${TIER.A} · <span class="tier B">B</span> ${TIER.B} · <span class="tier C">C</span> ${TIER.C}</div>`;
}

/* ---------- goal page ---------- */
function renderGoal(v, gid) {
  const g = D.goals.find(x => x.id === gid), r = sel, s = gStatus(g, r);
  const bad = g.targets.filter(t => tStatus(t, r) === 'bad');
  const roles = [...new Set((bad.length ? bad.map(t => t.role || g.role) : [g.role]))];
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal ${g.id}`)}
    <div class="card hero"><div class="kicker">Goal ${g.id} · ${esc(rname(r))}${r === FI ? ' (national average)' : ''}</div>
      <div class="hero-row"><h1>${esc(g.title)}</h1>${pill(s.c, gLabel(s))}</div></div>
    <h2>Targets</h2>
    ${g.targets.map(t => targetCard(t, r)).join('')}
    <h2>Contact in ${esc(rname(r))}</h2>
    ${roles.map(role => contactCard(r, role)).join('')}
    ${bad.length ? bad.map(t => peersSection(t)).join('') + `
      <h2>AI report: how others have solved it</h2>
      ${bad.filter(t => t.report).map(t => reportSlot(t.report)).join('')}` : ''}
    <h2>Ask about this goal</h2>${chatCard(`goal-${g.id}-${r}`)}
  </div>`;
  bindMore(v, () => renderGoal(v, gid));
  loadReports(v); bindChats(v, { region: rname(r), target: `Goal ${g.id}: ${g.title}` });
}
function targetCard(t, r) {
  const s = tStatus(t, r);
  let body = '';
  if (t.type === 'measures') {
    const a = agg(t, r), n = agg(t, FI);
    body = `<div class="mrows"><a class="mrow" href="#/t/${t.id}?r=${enc(r)}"><span class="dot ${s}"></span><span class="lbl">${esc(a.label)}</span>
      <span class="v ${cls(a.ok)}">${a.text}</span><span class="m">target ${num(a.target)}</span>
      <span class="m">${r === FI ? 'period ' + num(per(M[t.measures[0]].period)) : 'whole country ' + num(n.text, n.ok)}</span><span class="go">›</span></a></div>`;
  }
  else if (t.type === 'national') {
    const x = mort();
    body = `<div class="mrows"><a class="mrow" href="#/m/mort?r=${enc(r)}"><span class="dot ${x.v > x.path ? 'bad' : 'ok'}"></span><span class="lbl">Cancer deaths, whole country ${x.last}</span>
      <span class="v ${cls(x.v <= x.path)}">${nf(x.v, 0)}</span><span class="m">target path ${num(nf(x.path, 0))}</span><span class="m">target 2035 ${num(nf(x.mo.target, 0))}</span><span class="go">›</span></a></div>`;
  }
  return `<div class="card tcard"><div class="tcard-head"><div class="tcard-text">${esc(t.text.replace(/\*+$/, ''))}</div>${pill(s, tLabel(s))}</div>${body}</div>`;
}
function measureRow(m, r) {
  const v = val(m, r), o = isOk(m, v);
  return `<a class="mrow" href="#/m/${m}?r=${enc(r)}"><span class="dot ${o === false ? 'bad' : o ? 'ok' : 'na'}"></span><span class="lbl">${esc(M[m].short)}</span>
    <span class="v ${cls(o)}">${fmt(m, v)}</span><span class="m">target ${num(fmtT(m))}</span>
    <span class="m">${r === FI ? 'period ' + num(per(M[m].period)) : 'whole country ' + num(fmt(m, M[m].national), mOk(m, FI))}</span><span class="go">›</span></a>`;
}
function peersSection(t) {
  if (t.type === 'national') return '';
  const p = peersForTarget(t);
  const intro = p.closest ? `<span style="color:var(--red);font-weight:600">No other area meets this target yet.</span> Closest to the target:`
    : `${p.list.length} areas meet this target${sel === FI ? '' : ', closest in size to ' + esc(sel) + ' first'}.`;
  return `<h2>Regions that meet: ${esc(SHORT[t.id])}</h2>${peersBlock('t' + t.id + sel, p.list, r => targetValueText(t, r), t.role || t.goal.role, intro, peerLabel(t))}`;
}

/* ---------- target page: summary first, then the breakdown ---------- */
function renderTarget(v, tid) {
  const t = T(tid), r = sel, s = tStatus(t, r), a = agg(t, r), role = t.role || t.goal.role;
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal ${t.goal.id} › ${esc(SHORT[t.id])}`)}
    <div class="card hero"><div class="kicker">Goal ${t.goal.id} · ${esc(rname(r))}</div>
      <div class="hero-row"><h1>${esc(SHORT[t.id])}</h1>${pill(s, tLabel(s))}</div>
      <div class="kpis">
        <div class="kpi"><div class="k">${esc(a.label)}</div><div class="n ${cls(a.ok)}">${a.text}</div></div>
        <div class="kpi"><div class="k">Target</div><div class="n">${a.target}</div></div>
        ${r !== FI ? `<div class="kpi"><div class="k">Whole country</div><div class="n ${cls(agg(t, FI).ok)}">${agg(t, FI).text}</div></div>` : ''}
        <div class="kpi"><div class="k">Period</div><div class="n" style="font-size:14px;font-weight:600">${per(M[t.measures[0]].period)}</div></div>
      </div>
      ${D.hus_area.includes(r) && role === 'care' ? '<div class="note">THL reports Helsinki and the Uusimaa counties as one HUS row.</div>' : ''}
    </div>
    <h2>${{ 'S2.1': 'By group', 'S2.2': 'By cancer type' }[t.id] || 'By specialty'}</h2>
    <div class="card"><div class="mrows">${t.measures.map(m => measureRow(m, r)).join('')}</div></div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, role)}
    ${s === 'bad' ? peersSection(t) + `<h2>AI report: how others have solved it</h2>${reportSlot(t.report)}` : ''}
    <h2>Ask about this</h2>${chatCard(`t-${t.id}-${r}`)}
  </div>`;
  bindMore(v, () => renderTarget(v, tid));
  loadReports(v); bindChats(v, { region: rname(r), target: t.text });
}

/* ---------- measure page ---------- */
function renderMeasure(v, m) {
  const r = sel, t = parentOf(m);
  if (m === 'mort') return renderMort(v, t);
  const x = M[m], value = val(m, r), o = isOk(m, value);
  const st = o === false ? 'bad' : o ? 'ok' : 'na';
  const p = peersForMeasure(m);
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal ${t.goal.id} › ${t.type === 'measures' ? esc(SHORT[t.id]) + ' › ' : ''}${esc(x.short)}`)}
    <div class="card hero"><div class="kicker">${esc(SHORT[t.id])} · ${esc(rname(r))}</div>
      <div class="hero-row"><h1>${esc(x.label)}</h1>${pill(st, st === 'na' ? 'No data' : tLabel(st))}</div>
      <div class="kpis">
        <div class="kpi"><div class="k">${esc(rname(r))}</div><div class="n ${o === false ? 'bad' : o ? 'ok' : ''}">${fmt(m, value)}</div></div>
        <div class="kpi"><div class="k">Target</div><div class="n">${fmtT(m)}</div></div>
        ${r !== FI ? `<div class="kpi"><div class="k">Whole country</div><div class="n ${cls(isOk(m, x.national))}">${fmt(m, x.national)}</div></div>` : ''}
        <div class="kpi"><div class="k">Period · source</div><div class="n" style="font-size:14px;font-weight:600">${per(x.period)} · ${esc(x.source)}</div></div>
      </div>
      ${D.hus_area.includes(r) && x.role === 'care' ? '<div class="note">THL reports Helsinki and the Uusimaa counties as one HUS row.</div>' : ''}
    </div>
    <h2>All areas</h2><div class="card chartcard">${barChart(m)}</div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, x.role)}
    ${o === false ? `<h2>Areas that meet the target</h2>${peersBlock('m' + m + r, p.list, rr => fmt(m, val(m, rr)), x.role,
      p.closest ? `<span style="color:var(--red);font-weight:600">No other area meets the target yet.</span> Closest to the target:` : `${p.list.length} areas meet the target ${fmtT(m)}.`, x.short)}
      ${t.report ? `<h2>AI report: how others have solved it</h2>${reportSlot(t.report)}` : ''}` : ''}
    <h2>Ask about this</h2>${chatCard(`m-${m}-${r}`)}
  </div>`;
  bindMore(v, () => renderMeasure(v, m));
  loadReports(v); bindChats(v, { region: rname(r), target: `${x.label} (${t.text})` });
}
function barChart(m) {
  const x = M[m], rows = [FI, ...D.regions].map(r => ({ r, v: val(m, r) }));
  rows.sort((a, b) => (a.r === FI ? -1 : b.r === FI ? 1 : 0) || ((b.v ?? -1) - (a.v ?? -1)) || byName(a.r, b.r));
  const W = 760, L = 170, Rr = 70, rh = 22, H = rows.length * rh + 30;
  const max = x.unit === '%' ? 100 : Math.max(5, ...rows.map(o => o.v || 0)) * 1.1;
  const X = v => L + (v / max) * (W - L - Rr);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(x.label)} by area">
    ${x.kind === 'min' ? `<line x1="${X(x.target)}" x2="${X(x.target)}" y1="4" y2="${H - 22}" stroke="#0f172a" stroke-dasharray="4 4"/>
      <text x="${X(x.target)}" y="${H - 6}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#0f172a">target ${fmtT(m)}</text>` : `<text x="${L}" y="${H - 6}" font-size="11.5" fill="#64748b">Target 0: any value above zero is a certain breach</text>`}
    ${rows.map((o, i) => {
      const y = 8 + i * rh, ok = isOk(m, o.v), me = o.r === sel;
      const col = o.r === FI ? '#94a3b8' : ok === false ? '#f87171' : ok ? '#4ade80' : '#e2e8f0';
      return `${me ? `<rect x="0" y="${y - 2}" width="${W}" height="${rh}" rx="6" fill="#eef3ff"/>` : ''}
        <text x="${L - 10}" y="${y + 13}" text-anchor="end" font-size="12" font-weight="${me || o.r === FI ? 700 : 400}" fill="#0f172a">${esc(rname(o.r))}</text>
        <rect x="${L}" y="${y + 3}" width="${Math.max(1.5, o.v == null ? 0 : X(o.v) - L)}" height="${rh - 8}" rx="4" fill="${col}"/>
        <text x="${(o.v == null ? L : X(o.v)) + 6}" y="${y + 13}" font-size="11.5" font-weight="600" stroke="#fff" stroke-width="4" paint-order="stroke" fill="${ok === false ? '#dc2626' : ok ? '#16a34a' : '#0f172a'}">${fmt(m, o.v)}</text>`;
    }).join('')}
  </svg>`;
}
function renderMort(v, t) {
  const r = sel, x = mort(), st = x.v > x.path ? 'bad' : 'ok';
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal 3 › Cancer mortality`)}
    <div class="card hero"><div class="kicker">${esc(SHORT[t.id])} · ${esc(rname(r))}</div>
      <div class="hero-row"><h1>Cancer deaths per year, whole country</h1>${pill(st, tLabel(st))}</div>
      <div class="kpis"><div class="kpi"><div class="k">Deaths ${x.last}</div><div class="n ${st}">${nf(x.v, 0)}</div></div>
        <div class="kpi"><div class="k">Target path ${x.last}</div><div class="n">${nf(x.path, 0)}</div></div>
        <div class="kpi"><div class="k">Target 2035</div><div class="n">${nf(x.mo.target, 0)}</div></div></div></div>
    <h2>Trend and target path</h2><div class="card chartcard">${mortChart()}</div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, 'care')}
    ${st === 'bad' ? `<h2>AI report: how others have solved it</h2>${reportSlot('S3.2')}` : ''}
    <h2>Ask about this</h2>${chatCard(`m-mort-${r}`)}
  </div>`;
  loadReports(v); bindChats(v, { region: rname(r), target: t.text });
}
function mortChart() {
  const mo = D.mort, ys = Object.keys(mo.counts).map(Number).sort((a, b) => a - b);
  const W = 760, H = 240, L = 60, R = 24, Tp = 16, B = 30, x0 = ys[0], x1 = mo.target_year, y0 = 11000, y1 = 14000;
  const X = y => L + (y - x0) / (x1 - x0) * (W - L - R), Y = v => Tp + (y1 - v) / (y1 - y0) * (H - Tp - B);
  const line = ys.map((y, i) => `${i ? 'L' : 'M'}${X(y).toFixed(1)} ${Y(mo.counts[y]).toFixed(1)}`).join('');
  const last = ys[ys.length - 1], vc = mort().v > mort().path ? '#dc2626' : '#16a34a';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cancer deaths and target path">
    ${[11000, 12000, 13000, 14000].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eef0f3"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="#0f172a">${nf(v, 0)}</text>`).join('')}
    ${[2010, 2015, 2020, 2025, 2030, 2035].map(y => `<text x="${X(y)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#0f172a">${y}</text>`).join('')}
    <path d="M${X(mo.baseline_year)} ${Y(mo.baseline)}L${X(mo.target_year)} ${Y(mo.target)}" stroke="#16a34a" stroke-width="2" stroke-dasharray="5 5" fill="none"/>
    <path d="${line}" stroke="#0f172a" stroke-width="2.2" fill="none"/>
    <circle cx="${X(last)}" cy="${Y(mo.counts[last])}" r="4" fill="${vc}"/>
    <text x="${X(last) + 8}" y="${Y(mo.counts[last]) - 8}" font-size="12" font-weight="600" fill="${vc}">${nf(mo.counts[last], 0)} (${last})</text>
    <circle cx="${X(mo.target_year)}" cy="${Y(mo.target)}" r="4" fill="#16a34a"/>
    <text x="${X(mo.target_year) - 6}" y="${Y(mo.target) + 18}" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">Target ${nf(mo.target, 0)}</text>
  </svg><div class="note">Black = actual deaths · green dashed = target path</div>`;
}

/* ---------- chat ---------- */
function md(s) {
  let html = '', list = false;
  for (let l of esc(s).split('\n')) {
    l = l.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    if (/^\s*#{1,6}\s/.test(l)) { if (list) { html += '</ul>'; list = false; } html += `<h5>${l.replace(/^\s*#+\s*/, '')}</h5>`; }
    else if (/^\s*[-*]\s+/.test(l)) { if (!list) { html += '<ul>'; list = true; } html += `<li>${l.replace(/^\s*[-*]\s+/, '')}</li>`; }
    else if (!l.trim()) { if (list) { html += '</ul>'; list = false; } }
    else { if (list) { html += '</ul>'; list = false; } html += `<p>${l}</p>`; }
  }
  return html + (list ? '</ul>' : '');
}
const emptyText = () => AI.offline ? 'The chat needs the server: start Kaynnista_vahti.command and open http://localhost:8765.'
  : !AI.ai ? 'The chat is not enabled yet: add GEMINI_API_KEY to the .env file and restart the server.'
    : 'Ask anything about the targets, the areas or the data. I will also search the web when needed.';
function chatCard(key) { return `<div class="card chat-card"><div class="chat-box" data-chat="${esc(key)}"></div></div>`; }
function chatInner(key) {
  const arr = chats[key] || [];
  return `<div class="msgs">${arr.length ? arr.map(m => m.role === 'user' ? `<div class="msg user">${esc(m.text)}</div>`
    : `<div class="msg ai">${m.pending ? '<span class="spinner"></span>' : md(m.text)}${(m.sources || []).length
      ? `<div class="srcs"><b>Sources</b>${m.sources.map((s, i) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${i + 1}. ${esc(s.title)} ↗</a>`).join('')}</div>` : ''}</div>`).join('')
    : `<div class="empty">${emptyText()}</div>`}</div>
    <form class="chat-in"><textarea rows="2" placeholder="Ask a question…"></textarea><button type="submit" aria-label="Send">➤</button></form>`;
}
function mountChat(box, ctx) {
  const key = box.dataset.chat;
  const draw = () => {
    box.innerHTML = chatInner(key);
    const ms = box.querySelector('.msgs'); ms.scrollTop = ms.scrollHeight;
    const ta = box.querySelector('textarea'), form = box.querySelector('form');
    form.onsubmit = e => { e.preventDefault(); send(key, ta.value, ctx, draw); };
    ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(key, ta.value, ctx, draw); } };
  };
  draw();
}
function bindChats(root, ctx) { root.querySelectorAll('[data-chat]').forEach(b => mountChat(b, ctx)); }
function send(key, text, ctx, draw) {
  text = (text || '').trim(); if (!text) return;
  const arr = chats[key] = chats[key] || [];
  arr.push({ role: 'user', text });
  const pending = { role: 'assistant', pending: true, text: '' };
  arr.push(pending); draw();
  const redraw = () => { const b = document.querySelector(`[data-chat="${CSS.escape(key)}"]`); if (b) { mountChat(b, ctx); } };
  fetch('api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: arr.filter(m => !m.pending).map(m => ({ role: m.role, text: m.text })), context: ctx }) })
    .then(r => r.json()).then(res => { pending.pending = false; pending.text = res.text || ''; pending.sources = res.sources || []; redraw(); })
    .catch(() => { pending.pending = false; pending.text = emptyText(); redraw(); });
}
function toggleDrawer(open) {
  const d = $('#drawer'); d.classList.toggle('open', open); d.setAttribute('aria-hidden', String(!open));
  if (open) { const b = $('#generalChat'); b.dataset.chat = 'general'; mountChat(b, { region: rname(sel) }); }
}
