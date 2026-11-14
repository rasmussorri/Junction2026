/* Cancer Strategy Monitor – UI (vanilla JS, no external libraries) */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (v, d = 1) => v == null ? '–' : Number(v).toLocaleString('en-GB', { maximumFractionDigits: d });
const enc = encodeURIComponent;
const FI = 'FI';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let D, M, AI = { ai: false };
let sel = FI;
let locked = false; /* set once an area is clicked: hovering then only previews it on the map */
const chats = {};
const showAll = {};
const introKey = 'vahti.introduction.v2';
const introRegion = 'Pohjois-Savo';
let introStep = null;
const introRoutes = {
  goal: '#/goal/2', screening: '#/t/S2.2', cervical: '#/m/kohdunkaula'
};

const SHORT = {
  'S1.1': 'PROM & NPS measured systematically', 'S1.2': 'NPS above 80',
  'S2.1': 'Preventable cancers −1,000 / year', 'S2.2': 'Screening participation ≥ 80%', 'S2.3': '≥ 70% diagnosed at stage I–II',
  'S3.1': 'Poor-prognosis survival to Nordic level', 'S3.2': 'Cancer mortality −10%', 'S3.3': 'Treatment within target times',
  'S4.1': 'New cancer studies +10% / year', 'S4.2': '> 10% of patients in interventional trials', 'S4.3': 'Single-channel assessment of cancer medicines'
};
/* targets whose status comes from a sub-goal: name what is measured and what it contributes to */
const MEASURED = { 'S2.1': 'HPV vaccination ≥ 90%' };
const tName = t => MEASURED[t.id] || SHORT[t.id];
const HOME_HIDDEN = ['S1.1', 'S4.3'];
const homeTargets = g => g.targets.filter(t => !HOME_HIDDEN.includes(t.id));
const contrib = t => MEASURED[t.id] ? `Contributes to: ${SHORT[t.id]}` : '';

/* ---------- helpers ---------- */
const per = p => p && p.length === 7 ? `${MON[+p.slice(5) - 1]} ${p.slice(0, 4)}` : p;
const rname = r => r === FI ? 'Whole country' : r;
/* every area-specific figure says where it is from; THL waiting times for the HUS area are one shared figure */
const inPlace = (r, care) => r === FI ? 'in the whole country' : `in ${r}${care && D.hus_area.includes(r) ? ' (HUS)' : ''}`;
const val = (m, r) => r === FI ? M[m].national : M[m].values[r];
const sourceName = name => {
  if (!name) return '';
  if (/^THL(?: |$)|^Finnish Institute for Health and Welfare(?: —|$)/.test(name)) return 'Finnish Institute for Health and Welfare';
  for (const publisher of ['Finnish Cancer Registry', 'Statistics Finland']) {
    if (name.startsWith(publisher)) return publisher;
  }
  return name;
};
const combineSources = sources => sources.every(Boolean)
  ? [...new Set(sources.flatMap(source => source.split(' / ').map(sourceName)))].join(' / ') : '';
const sourceAttr = name => name ? ` title="${esc(name.split(' / ').map(sourceName).join(' / '))}"` : '';
const sourceLine = name => name ? `<small class="data-source" style="display:block;margin-top:2px;color:#5b6b7c;font-size:11px;font-weight:400;line-height:1.35;white-space:nowrap;overflow-x:auto">${esc(name.split(' / ').map(sourceName).join(' / '))}</small>` : '';
const measureSource = (m, r) => {
  if (val(m, r) == null) return '';
  const x = M[m];
  return r === FI
    ? (Object.hasOwn(x, 'national_source') ? x.national_source : x.source)
    : (Object.hasOwn(x.value_sources || {}, r) ? x.value_sources[r] : x.source);
};
const aggregateSource = (t, r) => {
  const sources = t.measures
    .filter(m => val(m, r) != null && (M[t.measures[0]].kind !== 'zero' || M[m].unit === 'patients'))
    .map(m => measureSource(m, r));
  return combineSources(sources);
};
const mortalitySource = year => Object.hasOwn(D.mort.count_sources || {}, year)
  ? D.mort.count_sources[year] : D.mort.source_counts;
const targetStatusSource = (t, r) => {
  if (t.type === 'national') return mortalitySource(mort().last);
  if (t.type !== 'measures') return '';
  return combineSources(t.measures.filter(m => val(m, r) != null).map(m => measureSource(m, r)));
};
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
  return { mo, last, v: mo.counts[last], ok: mo.counts[last] <= mo.target };
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
  if (t.type === 'national') return mort().ok ? 'ok' : 'bad';
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
const oLabel = o => `${o.n} of ${D.goals.reduce((k, g) => k + homeTargets(g).length, 0)} targets not met`;
/* summary value for a target with several measures */
const AVG_LABEL = { 'S2.1': 'Average HPV vaccination coverage', 'S2.2': 'Average screening participation' };
function agg(t, r) {
  if (M[t.measures[0]].kind === 'zero') {
    const vs = t.measures.filter(m => M[m].unit === 'patients').map(m => val(m, r)).filter(v => v != null);
    const v = vs.length ? vs.reduce((a, b) => a + b, 0) : null;
    return { label: 'Patients waiting over 90 days', v, text: v == null ? '–' : nf(v, 0), target: '0', ok: v == null ? null : v <= 0 };
  }
  const tg = M[t.measures[0]].target, vs = t.measures.map(m => val(m, r)).filter(v => v != null);
  const v = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
  return { label: AVG_LABEL[t.id] || 'Average', v, text: v == null ? '–' : `${nf(v)}%`, target: `≥ ${tg}%`, ok: v == null ? null : v >= tg };
}
const tLabel = s => ({ ok: 'Met', bad: 'Not met', na: 'No data', nat: 'National target' }[s]);
const pill = (cls, txt, source) => `<span class="pill ${cls}"${sourceAttr(source)}>${esc(txt)}</span>`;

/* ---------- start ---------- */
/* data comes from the shared dataset through the server (/api/data); the file version uses the embedded copy */
function loadData() {
  if (location.protocol === 'file:') {
    return window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data.json').then(r => r.json());
  }
  return fetch('/api/data')
    .then(r => {
      if (!r.ok) throw new Error('Data API responded ' + r.status);
      return r.json();
    })
    .catch(err => {
      console.warn('Falling back to local data:', err.message);
      return window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data.json').then(r => r.json());
    });
}

function loadStatus() {
  if (location.protocol === 'file:') return Promise.resolve({ ai: false, offline: true });
  return fetch('/api/data/status')
    .then(r => r.ok ? r.json() : fetch('/api/status').then(res => res.json()))
    .catch(() => ({ ai: false, offline: true }));
}

initIntroduction();

Promise.all([loadData(), loadStatus()]).then(([d, s]) => {
  D = d; M = d.measures; AI = s;
  $('#askBtn').onclick = () => toggleDrawer(true);
  $('#drawerClose').onclick = () => toggleDrawer(false);
  window.addEventListener('hashchange', route); route();
  $('#introStart').disabled = false;
});
document.addEventListener('scroll', () => { $('#tooltip').style.opacity = 0; }, true);

function route() {
  $('#tooltip').style.opacity = 0;
  if (introStep && introStep !== 'done' && location.hash !== introHash()) {
    history.replaceState(null, '', introHash());
  }
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
  if (!introStep || introStep === 'done') window.scrollTo(0, 0);
  updateIntroduction({ reveal: true });
}

/* ---------- interactive introduction ---------- */
const introSteps = {
  areas: { title: 'Choose any region', text: 'Click the map or the list.' },
  areaReview: { title: () => `Review ${sel}`, text: 'See its status compared to the targets.', target: '.st-head, #status .gcard', next: 'chooseSavo', label: 'Next region' },
  chooseSavo: { title: 'Select Pohjois-Savo', text: 'Click the highlighted region in the list or on the map.', target: '.area[data-r="Pohjois-Savo"], .mapbox path[data-r="Pohjois-Savo"]' },
  openGoal: { title: 'Open Goal 2', text: 'See its status compared to the targets, then open the highlighted card.', target: '#status', linkTarget: '.gcard[href^="#/goal/2?"]', link: 'goalTitle' },
  goalTitle: { page: 'goal', title: 'Read the goal and targets', text: 'Take your time. Check Pohjois-Savo’s figures against each target.', target: '.hero, .tcard', next: 'goalContact', label: 'See contact details of this region' },
  goalContact: { page: 'goal', title: 'Contacts in Pohjois-Savo', text: 'See who to contact in this region.', target: 'h2:has(+ .contact), .contact', next: 'goalPeers', label: 'Continue' },
  goalPeers: { page: 'goal', title: 'Contact details for other regions', text: 'You can contact these regions to ask how they reached the target.', target: '[data-intro-peers], [data-intro-peers] + .hint, [data-intro-peers] + .hint + .peers', next: 'goalReport', label: 'Continue' },
  goalReport: { page: 'goal', title: 'Read what others have done to reach these targets', text: 'See what others tried and where the findings came from.', target: '[data-intro-report], [data-intro-report] ~ .report', next: 'goalChat', label: 'Try to chat with AI about the situation' },
  goalChat: { page: 'goal', title: 'Try the chat', text: () => AI.ai && !AI.offline
    ? 'Ask about prevention or screening in Pohjois-Savo.'
    : 'Ask your own question. Practice mode shows a local summary.', target: '.chat-card' },
  chatWaiting: { page: 'goal', title: 'Waiting for the reply', text: 'The answer will appear in the chat.', target: '.chat-card' },
  chatReview: { page: 'goal', title: 'Read the reply', text: 'Keep chatting or continue to the next thing.', target: '.chat-card', next: 'openScreening', label: 'Continue' },
  openScreening: { page: 'goal', title: 'Open average screening participation', text: 'Click the highlighted screening row.', linkTarget: 'a[href^="#/t/S2.2?"]', link: 'screeningSummary' },
  screeningSummary: { page: 'screening', title: 'Screening participation in more detail', text: 'See the overall result and the breakdown by cancer type.', target: '.hero, .hero + h2, .hero + h2 + .card', next: 'openCervical', label: 'Check out situation for a specific cancer type' },
  openCervical: { page: 'screening', title: 'Open cervical screening', text: 'Select cervical screening to look closer.', scrollTarget: '.hero + h2', linkTarget: 'a[href^="#/m/kohdunkaula?"]', link: 'cervicalSummary' },
  cervicalSummary: { page: 'cervical', title: 'Check the situation', target: '.hero', next: 'cervicalChart', label: 'Compare to different regions' },
  cervicalChart: { page: 'cervical', title: 'Compare all areas', text: 'Check how Pohjois-Savo is doing compared to other regions.', target: '.chartcard', next: 'cervicalDetails', label: 'See the rest of the page' },
  cervicalDetails: { page: 'cervical', title: 'Explore the rest of the page', text: 'Scroll for contacts, areas meeting the target, the AI report and chat.', target: '.contact, .peers, .report, .chat-card', next: 'done', label: 'Finish introduction' },
  done: { title: 'Explore on your own', text: 'Choose any area or goal to keep exploring.', label: 'Got it' }
};

function initIntroduction() {
  const dialog = $('#introWelcome');
  const open = () => dialog.showModal();
  $('#introReplay').onclick = open;
  dialog.oncancel = e => e.preventDefault();
  $('#introSkip').onclick = () => {
    rememberIntroduction();
    dialog.close();
  };
  $('#introStart').onclick = () => {
    toggleDrawer(false);
    sel = FI;
    locked = false;
    dialog.close();
    goToIntroStep('areas');
  };
  $('#introAction').onclick = () => {
    const step = introSteps[introStep];
    if (introStep === 'done') {
      introStep = null;
      updateIntroduction();
      $('#introReplay').focus();
    } else {
      goToIntroStep(step.next);
    }
  };
  try {
    if (localStorage.getItem(introKey) === 'seen') return;
  } catch { /* storage can be disabled */ }
  open();
}

function rememberIntroduction() {
  try { localStorage.setItem(introKey, 'seen'); } catch { /* storage can be disabled */ }
}

function introHash() {
  const page = introSteps[introStep].page;
  return page ? `${introRoutes[page]}?r=${enc(introRegion)}` : '#/';
}

function goToIntroStep(next) {
  const previous = introStep;
  introStep = next;
  if (next === 'done') {
    rememberIntroduction();
    sel = FI;
    locked = false;
  }
  const hash = introHash();
  if (next === 'done' || !previous || location.hash !== hash) {
    history.replaceState(null, '', hash);
    route();
  } else {
    updateIntroduction({ reveal: true });
  }
}

function updateIntroduction({ reveal = false } = {}) {
  const panel = $('#intro');
  const step = introSteps[introStep];
  const active = Boolean(step && introStep !== 'done');
  const view = $('#view');
  const targets = step?.target ? [...view.querySelectorAll(step.target)] : [];
  const linkTarget = step?.linkTarget ? $(step.linkTarget, view) : null;
  const [target] = targets;
  const home = $('.home', view);
  home?.classList.toggle('intro-home', active);
  const chatStep = ['goalChat', 'chatWaiting', 'chatReview'].includes(introStep);
  panel.hidden = !step;
  $('#introReplay').hidden = Boolean(step);
  document.querySelectorAll('.intro-target, .intro-link-target').forEach(el => el.classList.remove('intro-target', 'intro-link-target'));
  targets.forEach(el => el.classList.add('intro-target'));
  linkTarget?.classList.add('intro-link-target');

  // Keep reading and scrolling available while restricting interaction to the current task.
  $('.top').inert = active;
  $('#drawer').inert = active;
  $('#view').querySelectorAll('a, button, textarea, .sugg, .mapbox path[data-r]').forEach(el => {
    const area = el.dataset.r;
    const allowedArea = area && (
      (introStep === 'areas' && area !== FI) ||
      (introStep === 'chooseSavo' && area === introRegion)
    );
    const allowedChat = chatStep && target?.contains(el) && (
      el.matches('.msg.ai a[href^="https://"], .msg.ai a[href^="http://"]') ||
      (introStep !== 'chatWaiting' && el.matches('textarea, button[type="submit"]'))
    );
    el.toggleAttribute('inert', active && !(allowedArea || allowedChat || el === linkTarget));
  });
  if (!step) return;

  $('#introTitle').textContent = typeof step.title === 'function' ? step.title() : step.title;
  $('#introText').textContent = typeof step.text === 'function' ? step.text() : step.text || '';
  const action = $('#introAction');
  action.hidden = !step.label;
  action.textContent = step.label || '';

  if (reveal) {
    $('#introTitle').focus({ preventScroll: true });
    const focusTarget = (step.scrollTarget && $(step.scrollTarget, view)) || linkTarget || target;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (home) {
      window.scrollTo({ top: 0, behavior });
      if (focusTarget) {
        const column = focusTarget.closest('.areas, .status');
        if (column) revealIntroTarget(focusTarget, panel, behavior, column);
      }
    } else if (focusTarget) {
      revealIntroTarget(focusTarget, panel, behavior, null, linkTarget);
    }
  }
}

function revealIntroTarget(target, panel, behavior, column, requiredLink) {
  const rect = target.getBoundingClientRect();
  const topEdge = (column ? column.getBoundingClientRect().top : $('.top').getBoundingClientRect().bottom) + 12;
  const lowerEdge = Math.min(panel.getBoundingClientRect().top, column?.getBoundingClientRect().bottom ?? window.innerHeight) - 16;
  const available = Math.max(0, lowerEdge - topEdge);
  const revealHeight = target.matches('.chat-card') ? rect.height : Math.min(rect.height, available);
  const end = Math.max(rect.top + revealHeight, requiredLink?.getBoundingClientRect().bottom ?? 0);
  const offset = end - lowerEdge;
  const scroller = column || window;
  const position = column ? column.scrollTop : window.scrollY;
  // Keep as much of the preceding content visible as possible.
  scroller.scrollTo({ top: Math.max(0, position + offset), behavior });
}

function bindIntroNavigation() {
  $('#view').addEventListener('click', e => {
    const step = introSteps[introStep];
    if (!step || introStep === 'done') return;
    const link = e.target.closest('a');
    if (!link || link.matches('.chat-card .msg.ai a[href^="https://"], .chat-card .msg.ai a[href^="http://"]')) return;
    e.preventDefault();
    if (step.linkTarget && link.matches(step.linkTarget)) goToIntroStep(step.link);
  });
}

bindIntroNavigation();

/* ---------- home: areas | map | status ---------- */
function renderHome(v) {
  const regs = D.regions.slice().sort(byName);
  v.innerHTML = `<div class="home">
    <aside class="areas"><div class="areas-title">Areas</div>
      ${[FI, ...regs].map(r => `<button type="button" class="area ${r === FI ? 'fi' : ''} ${r === sel ? 'on' : ''}" data-r="${esc(r)}" aria-pressed="${r === sel}">${esc(rname(r))}</button>`).join('')}
    </aside>
    <section class="mapcol">
      <div class="map-title"><span class="sub">Hover an area in the list or click the map</span></div>
      <div class="mapbox">${mapSvg()}</div>
      <div class="legend"><span><i class="dot green"></i>0–3 targets not met</span><span><i class="dot yellow"></i>4–5 targets not met</span><span><i class="dot red"></i>6 or more targets not met</span></div>
    </section>
    <aside class="status" id="status"></aside>
  </div>`;
  v.querySelectorAll('.area').forEach(el => {
    el.addEventListener('mouseenter', () => locked || (introStep && introStep !== 'done') ? preview(el.dataset.r) : select(el.dataset.r));
    el.addEventListener('mouseleave', () => preview(null));
    el.addEventListener('click', () => chooseArea(el.dataset.r));
  });
  const tip = $('#tooltip');
  v.querySelectorAll('.mapbox path[data-r]').forEach(p => {
    p.addEventListener('mousemove', e => {
      const o = overall(p.dataset.r);
      tip.innerHTML = `<b>${esc(p.dataset.r)}</b> · ${oLabel(o)}`;
      tip.style.left = (e.clientX + 12) + 'px'; tip.style.top = (e.clientY + 12) + 'px'; tip.style.opacity = 1;
    });
    p.addEventListener('mouseenter', () => $('#hlHover').setAttribute('d', p.getAttribute('d')));
    p.addEventListener('mouseleave', () => { tip.style.opacity = 0; $('#hlHover').setAttribute('d', ''); });
    p.addEventListener('click', () => chooseArea(p.dataset.r));
  });
  renderStatus();
}
function mapSvg() {
  const { W, H, features } = D.map;
  return `<svg viewBox="0 0 ${W} ${H}" class="${sel === FI ? 'fi' : ''}" role="img" aria-label="Map of Finland's wellbeing services counties">
    <g class="outline">${features.filter(f => f.alue !== 'Ahvenanmaa').map(f => `<path d="${f.d}"></path>`).join('')}</g>${features.map(f =>
    f.alue === 'Ahvenanmaa' ? `<path class="na" d="${f.d}"></path>`
      : `<path d="${f.d}" data-r="${esc(f.alue)}" class="${overall(f.alue).c}"></path>`).join('')}
    <path class="hl" id="hlHover"></path><path class="hl sel" id="hlSel" d="${sel === FI ? '' : (features.find(f => f.alue === sel) || {}).d || ''}"></path></svg>`;
}
function preview(r) {
  const h = $('#hlHover'), p = r && r !== FI ? document.querySelector(`.mapbox path[data-r="${CSS.escape(r)}"]`) : null;
  if (h) h.setAttribute('d', p ? p.getAttribute('d') : '');
}
function chooseArea(r) {
  if (introStep === 'areas') {
    if (r === FI) return;
  } else if (introStep === 'chooseSavo') {
    if (r !== introRegion) return;
  } else if (introStep && introStep !== 'done') {
    return;
  }
  locked = true;
  preview(null);
  select(r);
  if (introStep === 'areas') goToIntroStep('areaReview');
  else if (introStep === 'chooseSavo') goToIntroStep('openGoal');
}
function select(r) {
  if (r === sel) return;
  sel = r;
  document.querySelectorAll('.area').forEach(a => {
    const selected = a.dataset.r === sel;
    a.classList.toggle('on', selected);
    a.setAttribute('aria-pressed', String(selected));
  });
  const svg = document.querySelector('.mapbox svg'); if (svg) svg.classList.toggle('fi', sel === FI);
  const sp = document.querySelector(`.mapbox path[data-r="${CSS.escape(sel)}"]`), hs = $('#hlSel');
  if (hs) hs.setAttribute('d', sp ? sp.getAttribute('d') : '');
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
    
    ${D.goals.map(g => {
      return `<a class="gcard" href="#/goal/${g.id}?r=${enc(sel)}">
        <div class="gtop"><span class="gnum">${g.id}</span><span class="gtitle">${esc(g.title)}</span></div>
        <ul class="tlist">${homeTargets(g).map(t => targetLine(t, sel)).join('')}</ul>
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
  return `<div class="card contact"><div class="where"><div class="a">${esc(rname(r))}</div><div class="c">${esc(c.role)}</div></div>
    <div class="who"><span class="n">${esc(c.name)}</span>
    <span class="c"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a> · ${esc(c.phone)}</span></div></div>`;
}
function peersBlock(key, list, valueOf, role, intro, label, sourceOf) {
  const all = showAll[key], shown = all ? list : list.slice(0, 5);
  return `<div class="hint">${intro}</div><div class="peers">${shown.map(p => {
    const c = D.contacts[p.r][role];
    return `<div class="card peer"><div class="pr">${esc(p.r)}</div><div class="pv ${p.good ? 'ok' : 'bad'}"${sourceAttr(sourceOf(p.r))}><span class="pk">${esc(label)}</span>${esc(valueOf(p.r))}${sourceLine(sourceOf(p.r))}</div>
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
  const score = r => M[m].kind === 'min' ? -val(m, r) : val(m, r), mine = val(m, sel);
  const c = regs.filter(r => val(m, r) != null && (mine == null || score(r) < score(sel))).sort((a, b) => score(a) - score(b)).slice(0, 3);
  return { list: c.map(r => ({ r, good: false })), closest: true };
}
function peersForTarget(t) {
  const regs = D.regions.filter(r => r !== sel);
  let list = regs.filter(r => tStatus(t, r) === 'ok').sort((a, b) => (sel === FI ? byName(a, b) : sizeDiff(a) - sizeDiff(b)) || byName(a, b));
  if (list.length) return { list: list.map(r => ({ r, good: true })), closest: false };
  const bad = r => t.measures.filter(m => mOk(m, r) === false).length;
  const min = M[t.measures[0]].kind === 'min';
  const has = r => min ? agg(t, r).v != null : tStatus(t, r) !== 'na';
  const score = r => min ? -agg(t, r).v : bad(r) * 1e6 + (agg(t, r).v || 0);
  const c = regs.filter(r => has(r) && (!has(sel) || score(r) < score(sel))).sort((a, b) => score(a) - score(b)).slice(0, 3);
  return { list: c.map(r => ({ r, good: false })), closest: true };
}
function targetValueText(t, r) {
  if (M[t.measures[0]].kind === 'zero') { const k = t.measures.filter(m => mOk(m, r) === false).length; return k ? `${k} of ${t.measures.length} measures over target` : 'All within target'; }
  return agg(t, r).text;
}
const peerLabel = t => M[t.measures[0]].kind === 'zero' ? 'Waiting times' : AVG_LABEL[t.id];

/* ---------- reports ---------- */
function reportSlot(id) { return `<div class="card report" data-report="${esc(id)}"><div class="ai-note"><span class="spinner"></span> Loading report…</div></div>`; }
function loadReports(root) {
  root.querySelectorAll('[data-report]').forEach(box => {
    const id = box.dataset.report, pre = window.__REPORTS__ && window.__REPORTS__[id];
    const p = pre ? Promise.resolve(pre) : AI.offline ? Promise.resolve({ missing: true, reason: 'offline' }) : fetch(`/api/report?id=${enc(id)}`).then(r => r.json());
    p.then(rep => { box.innerHTML = reportHtml(rep); showSuggestions(box.querySelector('.sugg'), rep.search_suggestions); updateIntroduction(); }).catch(() => box.innerHTML = '<div class="note">Could not load the report.</div>');
  });
}
/* Google's "Search suggestions" for answers grounded in Google Search, shown as provided (own shadow root keeps its CSS apart) */
function showSuggestions(el, html) {
  if (!el || !html) return;
  (el.shadowRoot || el.attachShadow({ mode: 'open' })).innerHTML = html;
}
function reportHtml(rep) {
  if (rep.missing) return `<div class="note">${rep.reason === 'no_key' ? 'No report yet. The AI compiles one from the web with Gemini once GEMINI_API_KEY is set in .env.'
    : rep.reason === 'offline' ? 'No report yet. The AI compiles one from the web when the app runs on its server (Kaynnista_vahti.command) with a Gemini key.'
      : 'The report could not be compiled: ' + esc(rep.reason || '')}</div>`;
  return `<div class="ai-note"><span class="badge">AI search results</span>
      <b>${esc(rep.title || '')}</b></div>
    ${(rep.sections || []).map(s => `<div class="rsec"><h4><span class="flag">${esc(s.name)}</span></h4>
      ${s.items.map(it => `<div class="ritem"><p>${esc(it.text)}</p>${(it.sources || []).map(x =>
        `<a class="src" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join('')}</div>`).join('')}</div>`).join('')}
    ${(rep.all_sources || []).length ? `<div class="rsec"><h4><span class="flag">All sources</span></h4>${rep.all_sources.map(x => `<a class="src" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join('')}</div>` : ''}
    ${rep.search_suggestions ? '<div class="sugg"></div>' : ''}`;
}

/* ---------- goal page ---------- */
function renderGoal(v, gid) {
  const g = D.goals.find(x => x.id === gid), r = sel, s = gStatus(g, r);
  const bad = g.targets.filter(t => tStatus(t, r) === 'bad');
  const roles = [...new Set((bad.length ? bad.map(t => t.role || g.role) : [g.role]))];
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal ${g.id}`)}
    <div class="card hero"><div class="kicker">Goal ${g.id} · ${esc(rname(r))}</div>
      <div class="hero-row"><div><h1>${esc(g.title)}</h1></div>${pill(s.c, gLabel(s), combineSources(g.targets.filter(t => tStatus(t, r) !== 'na').map(t => targetStatusSource(t, r))))}</div></div>
    <h2>Targets</h2>
    ${g.targets.map(t => targetCard(t, r)).join('')}
    <h2>Contacts in ${esc(rname(r))}</h2>
    ${roles.map(role => contactCard(r, role)).join('')}
    ${bad.length ? bad.map(t => peersSection(t)).join('') + `
      <h2 data-intro-report>AI report: how others have solved it</h2>
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
    const sources = combineSources([aggregateSource(t, r), aggregateSource(t, FI)].filter(Boolean));
    body = `<div class="mrows"><a class="mrow" href="#/t/${t.id}?r=${enc(r)}"><span class="dot ${a.ok === false ? 'bad' : a.ok ? 'ok' : 'na'}"${sourceAttr(aggregateSource(t, r))}></span><span class="lbl"${sourceAttr(aggregateSource(t, r))}>${esc(`${a.label} ${inPlace(r, t.role === 'care')}`)}${sourceLine(sources)}</span>
      <span class="v ${cls(a.ok)}"${sourceAttr(aggregateSource(t, r))}>${a.text}</span><span class="m">target ${num(a.target)}</span>
      <span class="m"${sourceAttr(aggregateSource(t, FI))}>${r === FI ? 'period ' + num(per(M[t.measures[0]].period)) : 'whole country ' + num(n.text, n.ok)}</span><span class="go">›</span></a>
      ${M[t.measures[0]].kind === 'zero' ? measureRow('lahete21', r) : ''}</div>`;
  }
  else if (t.type === 'national') {
    const x = mort();
    body = `<div class="mrows"><a class="mrow" href="#/m/mort?r=${enc(r)}"><span class="dot ${s}"${sourceAttr(mortalitySource(x.last))}></span><span class="lbl"${sourceAttr(mortalitySource(x.last))}>Cancer deaths per year, whole country${sourceLine(mortalitySource(x.last))}</span>
      <span class="v ${cls(x.ok)}"${sourceAttr(mortalitySource(x.last))}>${nf(x.v, 0)}</span><span class="m">target ${num('≤ ' + nf(x.mo.target, 0))} by ${x.mo.target_year}</span><span class="m"${sourceAttr(mortalitySource(x.last))}>year ${num(x.last)}</span><span class="go">›</span></a></div>`;
  }
  return `<div class="card tcard"><div class="tcard-head"><div class="tcard-text">${esc(t.text.replace(/\*+$/, ''))}</div>${pill(s, tLabel(s), targetStatusSource(t, r))}</div>${body}</div>`;
}
function measureRow(m, r) {
  const v = val(m, r), o = isOk(m, v);
  const sources = combineSources([measureSource(m, r), measureSource(m, FI)].filter(Boolean));
  return `<a class="mrow" href="#/m/${m}?r=${enc(r)}"><span class="dot ${o === false ? 'bad' : o ? 'ok' : 'na'}"${sourceAttr(measureSource(m, r))}></span><span class="lbl"${sourceAttr(measureSource(m, r))}>${esc(`${M[m].short} ${inPlace(r, M[m].role === 'care')}`)}${sourceLine(sources)}</span>
    <span class="v ${cls(o)}"${sourceAttr(measureSource(m, r))}>${fmt(m, v)}</span><span class="m">target ${num(fmtT(m))}</span>
    <span class="m"${sourceAttr(measureSource(m, FI))}>${r === FI ? 'period ' + num(per(M[m].period)) : 'whole country ' + num(fmt(m, M[m].national), mOk(m, FI))}</span><span class="go">›</span></a>`;
}
function closestIntro(p, what) {
  return `<span class="lead-bad">No other area meets ${what} yet.</span> ` + (p.list.length ? 'Closest to the target:'
    : sel === FI ? 'No area is ahead of the national level.' : `${esc(sel)} is already at the best level.`);
}
function peersSection(t) {
  if (t.type === 'national') return '';
  const p = peersForTarget(t);
  const intro = p.closest ? closestIntro(p, 'this target')
    : `${p.list.length} areas meet this target${sel === FI ? '' : ', closest in size to ' + esc(sel) + ' first'}.`;
  return `<h2 data-intro-peers="${esc(t.id)}">Regions that meet: ${esc(tName(t))}${contrib(t) ? ` <span class="h-sub">(${esc('contributes to: ' + SHORT[t.id])})</span>` : ''}</h2>${peersBlock('t' + t.id + sel, p.list, r => targetValueText(t, r), t.role || t.goal.role, intro, peerLabel(t), r => targetStatusSource(t, r))}`;
}

const kpi = (k, n, ok, sub, source, subSource) => `<div class="kpi"><div class="k"${sourceAttr(source)}>${esc(k)}${sourceLine(combineSources([source, subSource].filter(Boolean)))}</div><div class="n ${cls(ok)}"${sourceAttr(source)}>${n}</div>${sub ? `<div class="s"${sourceAttr(subSource)}>${esc(sub)}</div>` : ''}</div>`;

/* ---------- target page: summary first, then the breakdown ---------- */
function renderTarget(v, tid) {
  const t = T(tid), r = sel, s = tStatus(t, r), a = agg(t, r), role = t.role || t.goal.role;
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal ${t.goal.id} › ${esc(tName(t))}`)}
    <div class="card hero"><div class="kicker">Goal ${t.goal.id} · ${esc(rname(r))}</div>
      <div class="hero-row"><div><h1>${esc(tName(t))}</h1>${contrib(t) ? `<div class="contrib">${esc(contrib(t))}</div>` : ''}</div>${pill(s, tLabel(s), targetStatusSource(t, r))}</div>
      <div class="kpis">${M[t.measures[0]].kind === 'zero' ? `
        ${kpi(`${a.label} ${inPlace(r, true)}`, a.text, a.ok, `target ${a.target}${r !== FI ? ' · whole country ' + agg(t, FI).text : ''}`, aggregateSource(t, r), r !== FI && aggregateSource(t, FI))}
        ${kpi(`${M.lahete21.label} ${inPlace(r, true)}`, fmt('lahete21', val('lahete21', r)), mOk('lahete21', r), `target ${fmtT('lahete21')}${r !== FI ? ' · whole country ' + fmt('lahete21', M.lahete21.national) : ''}`, measureSource('lahete21', r), r !== FI && measureSource('lahete21', FI))}` : `
        <div class="kpi"${sourceAttr(aggregateSource(t, r))}><div class="k">${esc(`${a.label} ${inPlace(r)}`)}${sourceLine(aggregateSource(t, r))}</div><div class="n ${cls(a.ok)}"${sourceAttr(aggregateSource(t, r))}>${a.text}</div></div>
        <div class="kpi"><div class="k">Target</div><div class="n">${a.target}</div></div>
        ${r !== FI ? `<div class="kpi"${sourceAttr(aggregateSource(t, FI))}><div class="k">Whole country${sourceLine(aggregateSource(t, FI))}</div><div class="n ${cls(agg(t, FI).ok)}"${sourceAttr(aggregateSource(t, FI))}>${agg(t, FI).text}</div></div>` : ''}`}
        <div class="kpi"${sourceAttr(aggregateSource(t, r))}><div class="k">Period</div><div class="n small">${per(M[t.measures[0]].period)}</div></div>
      </div>
      ${D.hus_area.includes(r) && role === 'care' ? '<div class="note">THL reports Helsinki and the Uusimaa counties as one HUS row.</div>' : ''}
    </div>
    <h2>${{ 'S2.1': 'By group', 'S2.2': 'By cancer type' }[t.id] || 'By specialty'}</h2>
    <div class="card"><div class="mrows">${t.measures.map(m => measureRow(m, r)).join('')}</div></div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, role)}
    ${s === 'bad' ? peersSection(t) + `<h2 data-intro-report>AI report: how others have solved it</h2>${reportSlot(t.report)}` : ''}
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
    ${crumbs(`${esc(rname(r))} › Goal ${t.goal.id} › ${t.type === 'measures' ? esc(tName(t)) + ' › ' : ''}${esc(x.short)}`)}
    <div class="card hero"><div class="kicker">${esc(tName(t))} · ${esc(rname(r))}</div>
      <div class="hero-row"><div><h1>${esc(x.label)}</h1></div>${pill(st, st === 'na' ? 'No data' : tLabel(st), measureSource(m, r))}</div>
      <div class="kpis">
        <div class="kpi"${sourceAttr(measureSource(m, r))}><div class="k">${esc(`${x.short} ${inPlace(r, x.role === 'care')}`)}${sourceLine(measureSource(m, r))}</div><div class="n ${o === false ? 'bad' : o ? 'ok' : ''}"${sourceAttr(measureSource(m, r))}>${fmt(m, value)}</div></div>
        <div class="kpi"><div class="k">Target</div><div class="n">${fmtT(m)}</div></div>
        ${r !== FI ? `<div class="kpi"${sourceAttr(measureSource(m, FI))}><div class="k">Whole country${sourceLine(measureSource(m, FI))}</div><div class="n ${cls(isOk(m, x.national))}"${sourceAttr(measureSource(m, FI))}>${fmt(m, x.national)}</div></div>` : ''}
        <div class="kpi"${sourceAttr(measureSource(m, r))}><div class="k">Period</div><div class="n small">${per(x.period)}</div></div>
      </div>
      ${D.hus_area.includes(r) && x.role === 'care' ? '<div class="note">THL reports Helsinki and the Uusimaa counties as one HUS row.</div>' : ''}
    </div>
    <h2>All areas</h2><div class="card chartcard">${barChart(m)}</div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, x.role)}
    ${o === false ? `<h2>Areas that meet the target</h2>${peersBlock('m' + m + r, p.list, rr => fmt(m, val(m, rr)), x.role,
      p.closest ? closestIntro(p, 'the target') : `${p.list.length} areas meet the target ${fmtT(m)}.`, x.short, rr => measureSource(m, rr))}
      ${t.report ? `<h2 data-intro-report>AI report: how others have solved it</h2>${reportSlot(t.report)}` : ''}` : ''}
    <h2>Ask about this</h2>${chatCard(`m-${m}-${r}`)}
  </div>`;
  bindMore(v, () => renderMeasure(v, m));
  loadReports(v); bindChats(v, { region: rname(r), target: `${x.label} (${t.text})` });
}
function barChart(m) {
  const x = M[m], rows = [FI, ...D.regions].map(r => ({ r, v: val(m, r) }));
  rows.sort((a, b) => (a.r === FI ? -1 : b.r === FI ? 1 : 0) || ((b.v ?? -1) - (a.v ?? -1)) || byName(a.r, b.r));
  const W = 760, L = 170, Rr = 70, rh = 34, H = rows.length * rh + 30;
  const max = x.unit === '%' ? 100 : Math.max(5, ...rows.map(o => o.v || 0)) * 1.1;
  const X = v => L + (v / max) * (W - L - Rr);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(x.label)} by area">
    ${x.kind === 'min' ? `<line x1="${X(x.target)}" x2="${X(x.target)}" y1="4" y2="${H - 22}" stroke="#0f172a" stroke-dasharray="4 4"/>
      <text x="${X(x.target)}" y="${H - 6}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#0f172a">target ${fmtT(m)}</text>` : `<text x="${L}" y="${H - 6}" font-size="11.5" font-weight="600" fill="#0f172a">target ${fmtT(m)}</text>`}
    ${rows.map((o, i) => {
      const y = 8 + i * rh, ok = isOk(m, o.v), me = o.r === sel;
      const col = o.r === FI ? '#94a3b8' : ok === false ? '#f87171' : ok ? '#4ade80' : '#e2e8f0';
      const source = sourceName(measureSource(m, o.r));
      return `<g>${source ? `<title>${esc(source)}</title>` : ''}<rect x="0" y="${y - 2}" width="${W}" height="${rh}" fill="${me ? '#e6edf7' : 'transparent'}"/>
        <text x="${L - 10}" y="${y + 13}" text-anchor="end" font-size="12" font-weight="${me || o.r === FI ? 700 : 400}" fill="#0f172a">${esc(rname(o.r))}${x.role === 'care' && D.hus_area.includes(o.r) ? ' (HUS)' : ''}</text>
        <rect x="${L}" y="${y + 3}" width="${Math.max(1.5, o.v == null ? 0 : X(o.v) - L)}" height="14" rx="2" fill="${col}"/>
        <text x="${(o.v == null ? L : X(o.v)) + 6}" y="${y + 13}" font-size="11.5" font-weight="600" stroke="#fff" stroke-width="4" paint-order="stroke" fill="${ok === false ? '#dc2626' : ok ? '#16a34a' : '#0f172a'}">${fmt(m, o.v)}</text>
        ${source ? `<text x="${L}" y="${y + 28}" font-size="10" font-weight="400" fill="#5b6b7c">${esc(source)}</text>` : ''}</g>`;
    }).join('')}
  </svg>`;
}
function renderMort(v, t) {
  const r = sel, x = mort(), st = x.ok ? 'ok' : 'bad';
  v.innerHTML = `<div class="page">
    ${crumbs(`${esc(rname(r))} › Goal 3 › Cancer mortality`)}
    <div class="card hero"><div class="kicker">${esc(SHORT[t.id])} · ${esc(rname(r))}</div>
      <div class="hero-row"><div><h1>Cancer deaths per year, whole country</h1></div>${pill(st, tLabel(st), mortalitySource(x.last))}</div>
      <div class="kpis">${kpi(`Cancer deaths ${x.last}`, nf(x.v, 0), x.ok, null, mortalitySource(x.last))}${kpi(`Target by ${x.mo.target_year}`, '≤ ' + nf(x.mo.target, 0))}</div></div>
    <h2>Trend and target</h2><div class="card chartcard">${mortChart()}</div>
    <h2>Contact in ${esc(rname(r))}</h2>${contactCard(r, 'care')}
    ${st === 'bad' ? `<h2 data-intro-report>AI report: how others have solved it</h2>${reportSlot('S3.2')}` : ''}
    <h2>Ask about this</h2>${chatCard(`m-mort-${r}`)}
  </div>`;
  loadReports(v); bindChats(v, { region: rname(r), target: t.text });
}
function mortChart() {
  const mo = D.mort, ys = Object.keys(mo.counts).map(Number).sort((a, b) => a - b);
  const W = 760, H = 240, L = 60, R = 24, Tp = 16, B = 30, x0 = ys[0], x1 = mo.target_year, y0 = 11000, y1 = 14000;
  const X = y => L + (y - x0) / (x1 - x0) * (W - L - R), Y = v => Tp + (y1 - v) / (y1 - y0) * (H - Tp - B);
  const line = ys.map((y, i) => `${i ? 'L' : 'M'}${X(y).toFixed(1)} ${Y(mo.counts[y]).toFixed(1)}`).join('');
  const last = ys[ys.length - 1], vc = mort().ok ? '#16a34a' : '#dc2626';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cancer deaths and target">
    ${[11000, 12000, 13000, 14000].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eef0f3"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="#0f172a">${nf(v, 0)}</text>`).join('')}
    ${[2010, 2015, 2020, 2025, 2030, 2035].map(y => `<text x="${X(y)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#0f172a">${y}</text>`).join('')}
    <line x1="${L}" x2="${W - R}" y1="${Y(mo.target)}" y2="${Y(mo.target)}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="5 5"/>
    <path d="${line}" stroke="#0f172a" stroke-width="2.2" fill="none"><title>${esc([...new Set(ys.map(mortalitySource).filter(Boolean).map(sourceName))].join(' / '))}</title></path>
    <g><title>${esc(sourceName(mortalitySource(last)))}</title><circle cx="${X(last)}" cy="${Y(mo.counts[last])}" r="4" fill="${vc}"/>
    <text x="${X(last) + 8}" y="${Y(mo.counts[last]) - 8}" font-size="12" font-weight="600" fill="${vc}">${nf(mo.counts[last], 0)} (${last})</text></g>
    <text x="${W - R}" y="${Y(mo.target) + 18}" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">target ≤ ${nf(mo.target, 0)} by ${mo.target_year}</text>
  </svg><div class="note">Line = cancer deaths per year · dashed = target</div>`;
}

/* ---------- chat ---------- */
/* the model sometimes writes LaTeX ($\\ge$ 80\\%): turn it into plain symbols */
const TEX = { geq: '≥', ge: '≥', leq: '≤', le: '≤', neq: '≠', ne: '≠', times: '×', approx: '≈', pm: '±', rightarrow: '→', to: '→', cdot: '·', sim: '~' };
function plainMath(t) {
  return t.replace(/\\(?:text|mathrm|textbf)\{([^}]*)\}/g, '$1')
    .replace(/\\(geq|ge|leq|le|neq|ne|times|approx|pm|rightarrow|to|cdot|sim)(?![a-zA-Z])/g, (_, k) => TEX[k])
    .replace(/\\([%$&_#])/g, '$1')
    .replace(/\$([^$\n]{1,40}?)\$/g, '$1');
}
function inline(t) {
  return t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*\w])\*(?!\s)([^*\n]+?)\*(?![*\w])/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
function md(s) {
  let html = '', list = false;
  for (const raw of esc(plainMath(s)).split('\n')) {
    const l = raw;
    if (/^\s*#{1,6}\s/.test(l)) { if (list) { html += '</ul>'; list = false; } html += `<h5>${inline(l.replace(/^\s*#+\s*/, ''))}</h5>`; }
    else if (/^\s*[-*]\s+/.test(l)) { if (!list) { html += '<ul>'; list = true; } html += `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`; }
    else if (!l.trim()) { if (list) { html += '</ul>'; list = false; } }
    else { if (list) { html += '</ul>'; list = false; } html += `<p>${inline(l)}</p>`; }
  }
  return html + (list ? '</ul>' : '');
}
const emptyText = () => AI.offline ? (location.hostname === 'localhost' || location.protocol === 'file:' ? 'The chat needs the server: start Kaynnista_vahti.command and open http://localhost:8765.' : 'The chat is currently disconnected from the server. Check backend status.')
  : !AI.ai ? 'The chat is not enabled yet: add GEMINI_API_KEY to your environment variables (or .env locally) and restart/redeploy.'
    : 'Ask anything about the targets, the areas or the data. I will also search the web when needed.';
function chatCard(key) { return `<div class="card chat-card"><div class="chat-box" data-chat="${esc(key)}"></div></div>`; }
function chatInner(key) {
  const arr = chats[key] || [];
  return `<div class="msgs">${arr.length ? arr.map(m => m.role === 'user' ? `<div class="msg user">${esc(m.text)}</div>`
    : `<div class="msg ai">${md(m.text)}${m.pending ? '<span class="spinner"></span>' : ''}</div>`).join('')
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
/* the chat gets the text of the open page, so it knows what the user is looking at */
function pageText() {
  const v = $('#view'); let t = v.innerText;
  v.querySelectorAll('.chat-card, .more').forEach(el => { const s = el.innerText; if (s) t = t.replace(s, ''); });
  return t.replace(/\n{3,}/g, '\n\n').trim().slice(0, 12000);
}
function send(key, text, ctx, draw) {
  text = (text || '').trim(); if (!text) return;
  const firstQuestion = introStep === 'goalChat';
  const practice = (firstQuestion || introStep === 'chatReview') && key === `goal-2-${introRegion}`;
  if (introStep && introStep !== 'done' && !practice) return;
  if (practice && (AI.offline || !AI.ai)) {
    const screening = agg(T('S2.2'), introRegion);
    const summary = `Practice summary · Live AI is unavailable. Average screening participation in ${introRegion} is ${screening.text}. The target is ${screening.target}, and the national average is ${agg(T('S2.2'), FI).text}.`;
    const box = $('.chat-card [data-chat]');
    $('textarea', box).value = '';
    const messages = $('.msgs', box);
    $('.empty', messages)?.remove();
    messages.insertAdjacentHTML('beforeend', `<div class="msg user">${esc(text)}</div><div class="msg ai">${esc(summary)}</div>`);
    messages.scrollTop = messages.scrollHeight;
    if (firstQuestion) goToIntroStep('chatReview');
    return;
  }
  const arr = chats[key] = chats[key] || [];
  if (practice && arr.some(message => message.pending)) return;
  arr.push({ role: 'user', text });
  const pending = { role: 'assistant', pending: true, text: '' };
  arr.push(pending); draw();
  if (firstQuestion) goToIntroStep('chatWaiting');
  else if (practice) updateIntroduction();
  const box = () => document.querySelector(`[data-chat="${CSS.escape(key)}"]`);
  const redraw = () => { const b = box(); if (b) mountChat(b, ctx); };
  /* the answer is written into the bubble as it arrives */
  const paint = () => {
    const b = box(); if (!b) return;
    const el = [...b.querySelectorAll('.msg.ai')].pop(); if (!el) return;
    el.innerHTML = md(pending.text) + (pending.pending ? '<span class="spinner"></span>' : '');
    if (introStep === 'chatWaiting') updateIntroduction();
    const ms = b.querySelector('.msgs'); ms.scrollTop = ms.scrollHeight;
  };
  const finishReply = () => {
    redraw();
    if (firstQuestion && introStep === 'chatWaiting') goToIntroStep('chatReview');
    else updateIntroduction();
  };
  fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: arr.filter(m => m !== pending).map(m => ({ role: m.role, text: m.text })), context: { ...ctx, page: pageText() } }) })
    .then(async res => {
      const reader = res.body.getReader(), dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line) continue;
          const ev = JSON.parse(line);
          if (ev.delta) pending.text += ev.delta;
          if (ev.done) { pending.text = ev.text || pending.text; pending.pending = false; }
          paint();
        }
      }
      pending.pending = false; finishReply();
    })
    .catch(() => { pending.pending = false; pending.text = pending.text || emptyText(); finishReply(); });
}
function toggleDrawer(open) {
  const d = $('#drawer'); d.classList.toggle('open', open); d.setAttribute('aria-hidden', String(!open));
  if (open) { const b = $('#generalChat'); b.dataset.chat = 'general'; mountChat(b, { region: rname(sel) }); }
}
