"""Read-only checks of two genuine CSV exports obtained through public app UI.
Preserves original CSVs; writes derived JSON, selection provenance, and diagnostics.
"""
from pathlib import Path
from collections import Counter
import csv,json,hashlib,datetime,math,shutil,re
HERE=Path(__file__).resolve().parent;OUT=HERE.parent;ROOT=HERE.parents[2]
def dump(p,o):p.write_text(json.dumps(o,ensure_ascii=False,indent=2,allow_nan=False))
def num(v):
 try:
  x=float(v.replace(',','.'));return x if math.isfinite(x) else None
 except (ValueError,AttributeError):return None
result={'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'access':'Actual native Chrome public Guest session, CUA-operated; CSV download completed visibly and files verified locally. No sign-in.','url':'https://tilastot.syoparekisteri.fi/seulonta/','download_route_pattern':'/seulonta/session/{session_id}/download/download_csv?w=','route_note':'Observed session URL is state-dependent and temporary, not a stable standalone API.','license':{'label':'CC BY 4.0','source':'https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html','source_update':'2026-05-26','scope':'These actual app CSV exports. No inferred extension to static HTML annual reports.'},'ui_options':{'programs':['Rintasyöpä','Kohdunkaulan syöpä'],'breast_themes':['Kutsut ja tarkastukset','Testitulokset','Histologiset löydökset'],'cervical_themes':['Kutsut ja tarkastukset (ikäryhmäseulonta)','Kutsut ja tarkastukset (riskiryhmäseulonta)','Testitulokset (ikäryhmäseulonta)','Testitulokset (riskiryhmäseulonta)','Histologiset löydökset (ikäryhmäseulonta)','Histologiset löydökset (riskiryhmäseulonta)'],'delay_theme_observed':False,'colon_program_observed':False},'exports':{}}
for n in ['rinta','kohtu']:
 path=HERE/(n+'_helsinki_vuosi_ika.csv');rows=list(csv.DictReader(path.open(),delimiter=';'));yearcol=next(iter(rows[0]));years=sorted({int(r[yearcol]) for r in rows});ages=sorted({r['Kutsuikä'] for r in rows});checks=[]
 for r in rows:
  d=num(r['Kutsuttu']);a=num(r['Tarkastettu']);v=num(r['Tarkastettu kutsutuista, %']);calc=100*a/d if d and a is not None else None
  checks.append({'year':int(r[yearcol]),'age':r['Kutsuikä'],'numerator':a,'denominator':d,'reported_pct':v,'calculated_pct':calc,'equal_to_1e_9':abs(v-calc)<1e-9 if v is not None and calc is not None else None})
 partial=[]
 for year in range(2020,2025):
  for minage in ([50] if n=='rinta' else [25,30]):
   rr=[r for r in rows if int(r[yearcol])==year and int(r['Kutsuikä'].split('-')[0])>=minage]
   vals={c:sum(int(r[c]) for r in rr) for c in ['Kohdeväestö','Rekisteröity kohdeväestö','Kutsuttu','Tarkastettu']};vals.update(year=year,minimum_age=minage,rows=len(rr));vals['participation_pct']=100*vals['Tarkastettu']/vals['Kutsuttu'];partial.append(vals)
 static=json.loads((ROOT/'06 Tekninen liite/rinta_tables.json' if n=='rinta' else ROOT/'06 Tekninen liite/Kohdunkaula ja seulontaviiveet/kohdunkaula_taulukot.json').read_text());comp=[]
 for t in static:
  h=t['headings']
  if 'Hyvinvointialueet' not in h or 'Seulontaketju' not in h:continue
  if n=='kohtu' and t['screening_group_explicit_label']!='Ikäryhmäseulonta':continue
  sr=next(r for r in t['rows'][2:] if r[0]=='Helsingin kaupunki');ar=next(a for a in partial if a['year']==int(h[-1]) and a['minimum_age']==(50 if n=='rinta' else 30))
  comp.append({'year':ar['year'],'app':ar,'static_report':{'invited_or_selected':int(sr[1]),'participated':int(sr[2]),'reported_pct':sr[3],'table_heading':t['rows'][0][1]},'differences_app_minus_static':{'invited_or_selected':ar['Kutsuttu']-int(sr[1]),'participated':ar['Tarkastettu']-int(sr[2]),'percentage_points':ar['participation_pct']-100*int(sr[2])/int(sr[1])}})
 nonnum=Counter(v for r in rows for c,v in r.items() if c not in (yearcol,'Kutsuikä') and num(v) is None)
 p={'file':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'saved_utc':datetime.datetime.fromtimestamp(path.stat().st_mtime,datetime.timezone.utc).isoformat(),'rows':len(rows),'columns':list(rows[0]),'selection_sidecar_required':True,'selection':{'program':'Rintasyöpä' if n=='rinta' else 'Kohdunkaulan syöpä','theme':'Kutsut ja tarkastukset' if n=='rinta' else 'Kutsut ja tarkastukset (ikäryhmäseulonta)','sex':'Naiset','area':'Helsingin kaupunki','classification':yearcol+' ja Kutsuikä','table_view':'Pitkä taulu'},'years':years,'age_groups':ages,'complete_year_age_grid':len(rows)==len(years)*len(ages),'duplicate_keys':len(rows)-len({(r[yearcol],r['Kutsuikä']) for r in rows}),'nonnumeric_value_tokens':dict(nonnum),'participation_arithmetic':{'total':len(checks),'defined':sum(x['equal_to_1e_9'] is not None for x in checks),'failed':[x for x in checks if x['equal_to_1e_9'] is False],'undefined':[x for x in checks if x['equal_to_1e_9'] is None]},'coverage_cap_diagnostic':{'invited_gt_registered_rows':sum(num(r['Kutsuttu'])>num(r['Rekisteröity kohdeväestö']) for r in rows),'those_with_coverage_100':sum(num(r['Kutsuttu'])>num(r['Rekisteröity kohdeväestö']) and num(r['Peittävyys väestöstä, %'])==100 for r in rows),'interpretation':'Observed arithmetic diagnostic, not verified implementation of capping; definition may differ by program.'},'annual_sums':partial,'static_report_comparison':comp}
 observed_ui={'rinta':[('2010','50-51','Kutsuttu','4129'),('2010','50-51','Tarkastettu','3292'),('2010','52-53','Kutsuttu','3788')],'kohtu':[('1991','25-29','Kutsuttu','4932'),('1991','25-29','Tarkastettu','2554'),('1991','30-34','Kutsuttu','4650')]}[n]
 p['ui_spot_checks']=[{'year':year,'age':age,'column':col,'ui':v,'csv':next(r[col] for r in rows if r[yearcol]==year and r['Kutsuikä']==age)} for year,age,col,v in observed_ui]
 result['exports'][n]=p;dump(HERE/(n+'_participation_checks.json'),checks);dump(OUT/(n+'_helsinki_vuosi_ika.json'),{'provenance':p['selection'],'columns':list(rows[0]),'rows':rows})
help_source=ROOT/'10 Hypoteesit ja löydökset/H01 jatkotutkimus/work/seulonta_help_test.html';shutil.copyfile(help_source,HERE/'seulonta_help_license_snapshot.html');result['license']['snapshot_sha256']=hashlib.sha256(help_source.read_bytes()).hexdigest()
dump(OUT/'koepoiminnan_profiili.json',result)
for n,p in result['exports'].items():print(n,p['rows'],p['participation_arithmetic'],p['nonnumeric_value_tokens'],p['coverage_cap_diagnostic']);print('static2024',p['static_report_comparison'][0])
