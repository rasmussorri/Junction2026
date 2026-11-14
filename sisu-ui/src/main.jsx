import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Markdown from 'react-markdown';
import { Activity, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronDown, Globe2, LoaderCircle, MapPin, Sparkles, X } from 'lucide-react';
import { metrics, screeningComparison } from './metrics.js';
import { GOALS, GROUPS, PROGRAMS, goalResult, goalCounts, goalOwner } from './goals.js';
import { hasLocalObservation, formatObservation, observationSources, goalView, goalDefinition, countDescription } from './observations.js';
import './styles.css';
import { useAppData } from './useAppData.js';
import './workspace.css';

const Link = ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a>;
const openCounty = id => { location.hash = `/county/${id}`; };
const route = () => location.hash.match(/^#\/county\/(HVA\d+)(?:\/goal\/([a-z-]+))?$/)?.slice(1) || [];
function Status({ status, hasData = false }) { return <span className={`status ${status}`}>{status === 'met' ? <Check size={12}/> : <i/>}{({ met: 'Met', missed: 'Not met', unknown: hasData ? 'Target unassessed' : 'No measurement' })[status]}</span>; }
function Counts({ region, data }) {
  const counts = goalCounts(region, data);
  return <div className="counts"><span className="met">{counts.met} met</span><span className="missed">{counts.missed} missed</span><span className="unknown">{counts.unknown} unassessed</span></div>;
}
function Owner({ data, regionId, goalId }) {
  const owner = goalOwner(data, regionId, goalId);
  if (!owner) return null;
  return <div className="owner"><span>Goal owner</span>{owner ? <><strong>{owner.name} · {owner.role}</strong>{owner.email && <a href={`mailto:${owner.email}`}>{owner.email}</a>}{owner.phone && <a href={`tel:${owner.phone}`}>{owner.phone}</a>}<Link href={owner.sourceUrl}>Verified responsibility & contact ↗</Link></> : <p>Responsible person not verified.</p>}</div>;
}
function SourceLinks({ data, region, goalId }) {
  const defaults = goalId === 'screening' ? ['screening', 'cervical'] : data.evidence[goalId] ? [goalId] : [];
  const ids = [...new Set([...observationSources(data, region, goalId), ...defaults])].filter(id => data.evidence[id]);
  return <div className="reference-links"><span>Sources</span><div className="primary-sources">{goalId === 'screening' ? PROGRAMS.map(p => <Link key={p} href={data.programs[p].sourceUrl}>{data.programs[p].name} ↗</Link>) : ids.map(id => data.evidence[id].url && <Link key={id} href={data.evidence[id].url}>{data.evidence[id].title} ↗</Link>)}</div><details><summary>Dataset snapshots & definitions</summary>{ids.map(id => <Link key={id} href={`/api/evidence/${id}?revision=${data.snapshot.revision}`}>{data.evidence[id].title} ↗</Link>)}<Link href={`/api/evidence/strategy?revision=${data.snapshot.revision}`}>Strategy targets (PDF) ↗</Link><Link href={`/api/evidence/audit?revision=${data.snapshot.revision}`}>Dataset audit & missing metrics ↗</Link></details></div>;
}
function National({ data, map, selectedRegion }) {
  const [hovered, setHovered] = useState(null);
  const [position, setPosition] = useState({ left: 12, top: 20 });
  const region = data.regions.find(r => r.id === hovered);
  const countyTriggers = useRef({});
  const previousCounty = useRef(null);
  useEffect(() => {
    if (!selectedRegion && previousCounty.current) countyTriggers.current[previousCounty.current]?.focus();
    previousCounty.current = selectedRegion?.id || null;
    setHovered(null);
  }, [selectedRegion?.id]);
  function showTooltip(event, id) {
    const box = event.currentTarget.ownerSVGElement.parentElement.getBoundingClientRect();
    setPosition({ left: Math.max(8, Math.min(event.clientX - box.left + 18, box.width - 283)), top: Math.max(8, Math.min(event.clientY - box.top - 30, box.height - 185)) });
    setHovered(id);
  }
  return <main className={`map-workspace ${selectedRegion ? 'with-county' : ''}`}>
    <section className="map-section national-map" aria-label="Finland county map"><div className="map-heading"><div><span className="eyebrow">NATIONAL OVERVIEW</span><h1>Cancer strategy</h1><p>Select a county to explore its goals.</p></div>{selectedRegion && <div className="map-county-summary" aria-live="polite"><h2>{selectedRegion.name}</h2><Counts region={selectedRegion} data={data}/></div>}<label className="county-picker"><span className="sr-only">Choose a county</span><select value={selectedRegion?.id || ''} aria-label="Choose a county" onChange={e => e.target.value ? openCounty(e.target.value) : location.hash = ''}><option value="">Choose a county</option>{data.regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select><ChevronDown size={14}/></label></div>
      <div className="map-canvas" onPointerLeave={() => setHovered(null)}><svg className="finland-map" viewBox={map.viewBox} aria-label="Wellbeing services counties of Finland"><desc>Hover or focus for the number of goals met. Click or press Enter to open the county side panel.</desc>{map.features.map(f => {
        const r = data.regions.find(r => r.id === f.id);
        return <path key={f.id} ref={el => { countyTriggers.current[f.id] = el; }} d={f.path} fillRule="evenodd" className={`county-shape ${r ? 'map-region' : 'unavailable'} ${hovered === f.id ? 'highlight' : ''} ${selectedRegion?.id === f.id ? 'selected-county' : ''}`} role={r ? 'button' : 'img'} tabIndex={r ? 0 : undefined} aria-pressed={r ? selectedRegion?.id === f.id : undefined} aria-label={r ? `${r.name}: ${goalCounts(r, data).met} of ${GOALS.length} goals met. Open county panel.` : 'Åland: outside this comparison'} aria-describedby={hovered === f.id ? 'county-tooltip' : undefined} onPointerEnter={e => showTooltip(e, f.id)} onPointerMove={e => showTooltip(e, f.id)} onFocus={() => { setHovered(f.id); setPosition({ left: 12, top: 30 }); }} onBlur={() => setHovered(null)} onClick={() => r && openCounty(r.id)} onKeyDown={e => { if (r && ['Enter', ' '].includes(e.key)) { e.preventDefault(); openCounty(r.id); } if (e.key === 'Escape') setHovered(null); }}/ >;
      })}</svg>
      {hovered && <div className="map-tooltip" id="county-tooltip" role="tooltip" style={position}><div className="tooltip-title"><MapPin size={15}/><strong>{region?.name || 'Åland'}</strong></div>{region ? <><div className="tooltip-count"><strong>{goalCounts(region, data).met}/{GOALS.length}</strong> goals met</div><Counts region={region} data={data}/><div className="tooltip-action">View county goals <ArrowRight size={14}/></div></> : <p>Outside the 22-area comparison.</p>}</div>}
      </div><div className="map-credit">Boundaries: <Link href={map.sourceUrl}>Statistics Finland</Link> · 2024 · CC BY 4.0</div>
    </section>
    {selectedRegion && <CountyPanel key={selectedRegion.id} data={data} region={selectedRegion}/>}
  </main>;
}
function CountyPanel({ data, region }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  return <aside className="county-panel" aria-labelledby="county-panel-heading" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); location.hash = ''; } }}>
    <div className="county-panel-header"><h2 id="county-panel-heading" ref={heading} tabIndex={-1}>Strategy goals<span className="sr-only"> for {region.name}</span></h2><a href="#" className="close-panel" aria-label="Close county panel"><X size={19}/></a></div>
    <div className="county-panel-body"><p className="panel-hint">Choose a <strong className="hint-goal">strategy-goal</strong> for its <strong className="hint-data">data</strong>, <strong className="hint-report">report</strong>, and <strong className="hint-chat">chat</strong>.</p>{GROUPS.map((group, index) => <section className={`panel-goal-group theme-${index}`} key={group}><h3>{group}</h3>{GOALS.filter(g => g.group === index).map(goal => {
      const view = goalView(data, region, goal.id);
      const result = view.assessment;
      const hasData = view.hasData;
      return <a key={goal.id} className={`panel-goal ${result.status}`} href={`#/county/${region.id}/goal/${goal.id}`}><div className="panel-goal-top"><strong>{goal.name}</strong><Status status={result.status} hasData={hasData}/></div><p className="panel-goal-target"><span>Strategy target</span>{goalDefinition(data, goal.id).target}</p><div className="panel-goal-bottom"><span>{view.summary}</span><ArrowRight size={15}/></div></a>;
    })}</section>)}</div>
  </aside>;
}
function Answer({ result }) {
  return <div className="answer"><Markdown components={{ a: ({ children, href }) => <Link href={href}>{children}</Link>, img: () => null }}>{result.text}</Markdown>{!!result.sources?.length && <details><summary>{result.sources.length} web sources</summary>{result.sources.map(s => <Link key={s.id} href={s.url}>[{s.id}] {s.title || 'Source'}</Link>)}</details>}{result.searchEntryPoint && <iframe title="Google Search suggestions" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={result.searchEntryPoint}/>}</div>;
}
function Chat({ data, region, goal, program, aiReady }) {
  const [messages, setMessages] = useState([]), [question, setQuestion] = useState('');
  const [web, setWeb] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const request = useRef(null), bottom = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => { if (messages.length || busy) bottom.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy]);
  async function ask(text, search = web) {
    if (request.current || !aiReady || !text.trim()) return;
    const controller = new AbortController(); request.current = controller;
    const history = [...messages, { role: 'user', text }];
    setMessages(history); setQuestion(''); setError(''); setBusy(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ regionId: region.id, goalId: goal.id, program, dataRevision: data.snapshot.revision, web: search, messages: history.slice(-15).map(m => ({ role: m.role, text: m.text.slice(0, 12000) })) }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(100000)]) });
      const result = await res.json(); if (res.status === 409) window.dispatchEvent(new Event('focus')); if (!res.ok) throw new Error(result.error || 'Request failed. Please try again.');
      setMessages(prev => [...prev, { role: 'assistant', ...result }]);
    } catch (e) { if (e.name !== 'AbortError') { setError(e.name === 'TimeoutError' ? 'Research took too long. Try a narrower question.' : e.message); setQuestion(text); setMessages(history.slice(0, -1)); } }
    finally { request.current = null; setBusy(false); }
  }
  const subject = goal.id === 'screening' ? data.programs[program].name : goal.name;
  return <aside className="chat"><div className="chat-heading"><Sparkles size={19}/><div><h2>Ask about {region.name}</h2><span>{subject}</span></div></div><div className="chat-messages" role="log" aria-live="polite">{!messages.length && !busy && <div className="chat-empty"><p>Ask about the figures or research ways to improve this goal.</p><button disabled={!aiReady} onClick={() => ask(`Explain whether ${subject} in ${region.name} meets the goal, and why. Separate the measured gap from any causes supported by our datasets. If causes are unknown, say so. Keep it concise and cite sources.`, false)}>Explain this goal<ArrowRight size={14}/></button><button disabled={!aiReady} onClick={() => ask(`Research tested ways to improve ${subject} in ${region.name}. Look first in Finland, then Nordics, Europe and globally, including similar preventive-health invitations where relevant. Give three concise options with reference links. Separate tested results from proposals.`, true)}><Globe2 size={15}/>Research improvements<ArrowUpRight size={14}/></button><button disabled={!aiReady} onClick={() => ask(`Find the named person actually accountable for the strategy goal ${goal.name} in ${region.name}, with direct published contact details and an official source explicitly establishing responsibility. A county director or service contact is not automatically the goal owner. If unverifiable, say so.`, true)}>Find the goal owner<ArrowUpRight size={14}/></button></div>}{messages.map((msg, i) => <div key={i} className={`message ${msg.role}`}>{msg.role === 'assistant' ? <Answer result={msg}/> : msg.text}</div>)}{busy && <p className="thinking"><LoaderCircle size={14} className="spin"/>Looking through data and sources…</p>}{messages.some(m => m.dataRevision && m.dataRevision !== data.snapshot.revision) && <p className="error">Data has updated. Earlier answers used a previous snapshot.</p>}{error && <p className="error" role="alert">{error}</p>}<div ref={bottom}/></div><form onSubmit={e => { e.preventDefault(); ask(question); }}><label className="web-option"><input type="checkbox" checked={web} onChange={e => setWeb(e.target.checked)}/><Globe2 size={13}/>Search the web</label><div className="compose"><textarea aria-label="Ask about county data" placeholder="Ask a question…" value={question} maxLength={4000} disabled={busy} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(question); } }}/><button aria-label="Send message" disabled={busy || !aiReady || !question.trim()}>{busy ? <LoaderCircle size={17} className="spin"/> : <ArrowUp size={17}/>}</button></div><p className="chat-note">{aiReady ? 'AI-assisted. Review the sources before acting.' : 'Add a Gemini API key to enable chat.'}</p></form></aside>;
}
function ObservationPanel({ data, region, goalId }) {
  const { local, national, shared } = goalView(data, region, goalId);
  function rows(items) {
    return items.map(row => <article className="observation-row" key={row.id}><div className="observation-heading"><h3>{row.label}</h3><span className="measurement-kind">{row.relation}</span></div><strong className="observation-number">{formatObservation(row)}</strong><p>{row.areaLabel} · {row.scope} · {row.period}</p>{countDescription(row) && <p>{countDescription(row)}</p>}{row.confidenceInterval && <p>95% confidence interval: {row.confidenceInterval[0]}–{row.confidenceInterval[1]}%</p>}<details className="measurement-definition"><summary>Definition</summary><p>{row.note}</p></details>{row.series?.length > 1 && <details><summary>History ({row.series.length} periods)</summary><table><thead><tr><th>Period</th><th>{row.unit}</th></tr></thead><tbody>{row.series.map(point => <tr key={point.period}><td>{point.period}</td><td>{point.value == null ? 'Not reported' : point.value.toLocaleString('en')}</td></tr>)}</tbody></table></details>}<div className="observation-citation"><Link href={row.sourceUrl}>Official source ↗</Link><Link href={`/api/evidence/${row.sourceIds[0]}?revision=${data.snapshot.revision}`}>Saved data ↗</Link><span>Retrieved {row.retrievedAt}</span></div></article>);
  }
  return <section className="observation-panel"><h2>Available measurements</h2>{local.length ? rows(local) : <p className="no-peers">County measurement: data source missing.</p>}{shared.length > 0 && <details className="context-observations"><summary>Shared provider context</summary><p>These are shared provider figures, not individual county counts.</p>{rows(shared)}</details>}{national.length > 0 && <details className="context-observations"><summary>National context · separate from {region.name}</summary>{rows(national)}</details>}</section>;
}
function GoalEvidence({ data, region, goal, program }) {
  const definition = goalDefinition(data, goal.id);
  const m = goal.id === 'screening' ? metrics(region, program, data.target) : null;
  return <details className="goal-evidence"><summary>Sources & definitions</summary>{m ? <p>{m.participated?.toLocaleString('en') ?? 'Not reported'} participated / {m.denominator?.toLocaleString('en') ?? 'not reported'} {data.programs[program].denominatorLabel.toLowerCase()}. {data.programs[program].note} The county screening average gives each available programme equal weight.</p> : <p>{definition.reason}</p>}{definition.strategyNote && <p>{definition.strategyNote}</p>}<SourceLinks data={data} region={region} goalId={goal.id}/></details>;
}
function CountyComparison({ data, region, program }) {
  const rows = screeningComparison(data, program);
  const missing = data.regions.length - rows.length;
  return <section className="county-comparison" aria-labelledby="comparison-heading"><div className="comparison-heading"><div><h2 id="comparison-heading">County comparison</h2><p>{data.programs[program].name} · {data.year} · highest first</p></div><Link href={data.programs[program].sourceUrl}>Source ↗</Link></div>
    <div className="comparison-legend"><span><i className="selected"/>{region.name}</span><span><i className="met"/>Met</span><span><i className="missed"/>Not met</span></div>
    <div className="comparison-axis" aria-hidden="true"><span/><div><span>0%</span><strong style={{left: `${data.target}%`}}>{data.target}% target</strong><span>100%</span></div><span/></div>
    <ol className="comparison-bars" aria-label={`${data.programs[program].name} participation, sorted highest to lowest. Target ${data.target}%.`}>{rows.map(row => <li key={row.id} className={`comparison-row ${row.id === region.id ? 'is-selected' : ''}`} aria-current={row.id === region.id ? 'true' : undefined}><span className="comparison-label">{row.name}{row.id === region.id && <span className="sr-only"> (selected county)</span>}</span><div className="comparison-track" aria-hidden="true"><span className={`comparison-bar ${row.id === region.id ? 'selected' : row.rate >= data.target ? 'met' : 'missed'}`} style={{width: `${row.rate}%`}}/><i className="comparison-target" style={{left: `${data.target}%`}}/></div><strong className="comparison-value">{row.rate.toFixed(1)}%<span className="sr-only"> · {row.rate >= data.target ? 'Met' : 'Not met'}</span></strong></li>)}</ol>
    {!!missing && <p className="comparison-missing">{missing} {missing === 1 ? 'area has' : 'areas have'} no comparable measurement for {data.year}.</p>}
  </section>;
}
function GoalDetail({ data, region, goal, aiReady }) {
  const [program, setProgram] = useState('breast');
  const result = goalResult(region, goal.id, data);
  return <main className="county-page"><a className="back-link" href={`#/county/${region.id}`}><ArrowLeft size={15}/>All goals · {region.name}</a><div className="county-heading"><div><div className="eyebrow">{GROUPS[goal.group]}</div><h1>{goal.name}</h1><p>{region.name} · Target: {goalDefinition(data, goal.id).target}</p></div><Status status={result.status} hasData={hasLocalObservation(region, goal.id)}/></div><div className="county-layout"><section className="county-content">{goal.id === 'screening' ? <><div className="county-goals programme-cards">{PROGRAMS.map(p => { const m = metrics(region, p, data.target); return <button key={p} className={`county-goal ${program === p ? 'selected' : ''}`} aria-pressed={program === p} onClick={() => setProgram(p)}><span className="goal-top">{data.programs[p].name}<span className="layer-dot"/></span><div className={`county-rate ${m.met === null ? 'unknown' : m.met ? 'met' : 'missed'}`}>{m.rate == null ? 'Not reported' : <>{m.rate.toFixed(1)}<small>%</small></>}</div><div className="county-goal-footer"><Status status={m.met === null ? 'unknown' : m.met ? 'met' : 'missed'}/><span>Target ≥{data.target}%</span></div></button>; })}</div><CountyComparison data={data} region={region} program={program}/></> : <ObservationPanel data={data} region={region} goalId={goal.id}/>}
      <GoalEvidence data={data} region={region} goal={goal} program={program}/><Owner data={data} regionId={region.id} goalId={goal.id}/></section><Chat key={`${goal.id}-${program}`} data={data} region={region} goal={goal} program={goal.id === 'screening' ? program : undefined} aiReady={aiReady}/></div></main>;
}
function App() {
  const { loaded, error, refreshError } = useAppData();
  const [current, setCurrent] = useState(route);
  useEffect(() => { const update = () => { setCurrent(route()); window.scrollTo(0, 0); }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  if (error) return <div className="loading"><p>{error}</p><button onClick={() => location.reload()}>Reload</button></div>;
  if (!loaded) return <div className="loading"><LoaderCircle className="spin" size={20}/>Loading Finland…</div>;
  const { data, map, health } = loaded, region = data.regions.find(r => r.id === current[0]), goal = goalDefinition(data, current[1]);
  return <><header className="header"><a href="#" className="brand"><span><Activity size={21}/></span>sisu.</a><span className="header-title">Finland’s cancer strategy <span>2026–2035</span></span><span className="year-label" title={data.snapshot ? `Imported ${data.snapshot.importedAt}. Source observation periods are shown on each metric.` : undefined}>Dataset snapshot</span></header>{refreshError && <p className="data-refresh-notice" role="status">{refreshError}</p>}{region && goal ? <GoalDetail key={`${region.id}-${goal.id}`} data={data} region={region} goal={goal} aiReady={health.aiConfigured}/> : <National data={data} map={map} selectedRegion={region}/>}</>;
}
createRoot(document.getElementById('root')).render(<App/>);
