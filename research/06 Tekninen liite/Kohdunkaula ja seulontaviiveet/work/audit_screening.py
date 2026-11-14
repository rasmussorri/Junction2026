"""Offline structural audit of exact saved public screening reports; no image digitisation.
Run from any directory: python3 /absolute/path/to/this/file.py
"""
from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
import re, html, json, hashlib, base64, datetime
HERE=Path(__file__).resolve().parent
OUT=HERE.parent
ROOT=HERE.parents[2]
SOURCES={
 'kohtu':(HERE/'kohtu.html','https://stats.cancerregistry.fi/joukkistilastot/kohtu.html'),
 'rinta':(ROOT/'06 Tekninen liite/rinta.html','https://stats.cancerregistry.fi/joukkistilastot/rinta.html'),
 'suolisto':(ROOT/'06 Tekninen liite/suolisto.html','https://stats.cancerregistry.fi/joukkistilastot/suolisto.html')}
def plain(t):return ' '.join(html.unescape(re.sub(r'<[^>]*>',' ',t)).split())
def dump(path,obj):path.write_text(json.dumps(obj,ensure_ascii=False,indent=2))
class IndependentParser(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.skip=0;self.t=None;self.r=None;self.cell=None;self.text=[]
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.skip+=1
  if self.skip:return
  if tag=='table':self.t=[]
  elif tag=='tr' and self.t is not None:self.r=[]
  elif tag in ('th','td') and self.r is not None:self.cell=tag;self.text=[]
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.skip=max(0,self.skip-1);return
  if self.skip:return
  if tag in ('td','th') and self.cell:self.r.append(' '.join(''.join(self.text).split()));self.cell=None
  elif tag=='tr' and self.r is not None:self.t.append(self.r);self.r=None
  elif tag=='table' and self.t is not None:self.tables.append(self.t);self.t=None
 def handle_data(self,data):
  if not self.skip and self.cell:self.text.append(data)
all_profiles={}
for name,(path,url) in SOURCES.items():
 raw=path.read_text();tables=[];widgets=[];imgs=[];heads={};group=None
 for m in re.finditer(r'<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<h([1-6])\b[^>]*>.*?</h\1>|<strong\b[^>]*>.*?</strong>|<table\b[^>]*>.*?</table>|<img\b[^>]*>',raw,re.S|re.I):
  t=m[0]
  if t.startswith('<style'):continue
  if t.startswith('<script'):
   if 'type="application/json"' in t[:180]:
    data=re.search(r'>(.*)</script>',t,re.S)[1];j=json.loads(data)
    if 'x' in j:
     x=j['x'];layout=x.get('layout',{})
     widgets.append({'headings':list(heads.values()),'bytes':len(data.encode()),'top_x_keys':list(x),'axis_titles':{k:v.get('title') for k,v in layout.items() if isinstance(v,dict) and 'title' in v},'trace_count':len(x.get('data',[])),'trace_names':list(dict.fromkeys(d.get('name') for d in x.get('data',[]) if isinstance(d.get('name'),str))),'delay_keyword_in_payload':bool(re.search(r'viive|viipe|delay|waiting|odotusaika|desiili',data,re.I))})
   continue
  if t.startswith('<h'):
   level=int(t[2]);heads={k:v for k,v in heads.items() if k<level};heads[level]=plain(t);group=None
  elif t.startswith('<strong'):
   val=plain(t)
   if val in ('Ikäryhmäseulonta','Riskiryhmäseulonta'):group=val
  elif t.startswith('<table'):
   rows=[[plain(c) for c in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>',r,re.S|re.I)] for r in re.findall(r'<tr\b[^>]*>(.*?)</tr>',t,re.S|re.I)]
   tables.append({'index':len(tables),'headings':list(heads.values()),'screening_group_explicit_label':group,'rows':rows,'raw_html_character_span':[m.start(),m.end()]})
  elif t.startswith('<img'):
   isdelay=any('Viipeet' in h for h in heads.values())
   if isdelay:
    attrs=dict(re.findall(r'([a-zA-Z-]+)="([^"]*)"',t));src=attrs.get('src','');p={'headings':list(heads.values()),'alt':attrs.get('alt'),'aria_label':attrs.get('aria-label'),'embedded_png':src.startswith('data:image/png;base64,')}
    if p['embedded_png']:
     bits=base64.b64decode(src.split(',',1)[1]);fn=f'{name}_delay_{len(imgs):02}.png';HERE.joinpath(fn).write_bytes(bits);p.update(file='work/'+fn,bytes=len(bits),sha256=hashlib.sha256(bits).hexdigest())
    imgs.append(p)
 ind=IndependentParser();ind.feed(raw)
 special=[]
 for t in tables:
  for ri,row in enumerate(t['rows'][2:],2):
   for ci,val in enumerate(row[1:],1):
    if val in ('','-','–','—','--','..','...','NA','N/A','NaN','*'):
     special.append({'table':t['index'],'headings':t['headings'],'screening_group':t['screening_group_explicit_label'],'row':ri,'label':row[0],'column':ci,'token':val})
 numeric_tokens=Counter(c for t in tables for r in t['rows'][2:] for c in r[1:] if c in ('0','0,0'))
 external_download_links=[html.unescape(v) for v in re.findall(r'href="([^"]+)"',raw) if re.search(r'\.(csv|xlsx?|json)(?:[?#]|$)',v,re.I)]
 profile={'url':url,'file':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'real_table_count':len(tables),'raw_table_token_count':len(re.findall(r'<table\b',raw)),'independent_parser_equal':ind.tables==[t['rows'] for t in tables],'table_section_counts':dict(Counter(t['headings'][1] for t in tables)),'explicit_group_counts':dict(Counter(str(t['screening_group_explicit_label']) for t in tables)),'table_header_delay_keyword_matches':[t['index'] for t in tables if re.search(r'viive|viipe|odotusaika|delay|waiting',str(t['rows'][:2]),re.I)],'special_numeric_tokens':dict(Counter(x['token'] for x in special)),'special_numeric_locations':special,'numeric_zero_tokens':dict(numeric_tokens),'widgets':widgets,'delay_images':imgs,'external_csv_xlsx_json_links':external_download_links}
 if name=='kohtu':
  checks=[];sums=[];geography=[]
  for t in tables:
   if len(t['rows'][0])!=7 or t['rows'][0][1]!='Kutsuttu':continue
   rows=t['rows'][2:]
   if 'Hyvinvointialueet' in t['headings']:geography.append({'table':t['index'],'year':t['headings'][-1],'group':t['screening_group_explicit_label'],'areas':[r[0] for r in rows if r[0]!='Yhteensä']})
   for r in rows:
    for label,a,b,p in [('participation',2,1,3),('risk_recommendation',4,2,5),('referral',6,2,7),('colposcopy_recorded',8,6,9),('hsil_plus',10,8,11)]:
     n,d=int(r[a]),int(r[b]);calc=100*n/d if d else None;reported=r[p]
     try:rv=float(reported.replace(',','.'))
     except ValueError:rv=None
     checks.append({'table':t['index'],'year':t['headings'][-1],'group':t['screening_group_explicit_label'],'row':r[0],'metric':label,'numerator':n,'denominator':d,'calculated_pct':calc,'reported_pct':rv,'reported_token':reported,'within_half_tenth':abs(calc-rv)<=0.050001 if calc is not None and rv is not None else None})
   if rows[-1][0]=='Yhteensä':
    for c in [1,2,4,6,8,10]:sums.append({'table':t['index'],'column':c,'sum':sum(int(r[c]) for r in rows[:-1]),'reported':int(rows[-1][c]),'match':sum(int(r[c]) for r in rows[:-1])==int(rows[-1][c])})
  profile['geography']=geography
  profile['arithmetic']={'ratio_checks':len(checks),'defined_checks':sum(c['within_half_tenth'] is not None for c in checks),'failures':[c for c in checks if c['within_half_tenth'] is False],'undefined':[c for c in checks if c['within_half_tenth'] is None],'sum_checks':len(sums),'sum_failures':[c for c in sums if not c['match']]}
  profile['manual_checks']=[{'table':0,'row':2,'column':2,'expected_from_raw_html':'23907','extracted':tables[0]['rows'][2][2]},{'table':1,'row':2,'column':1,'expected_from_raw_html':'2442','extracted':tables[1]['rows'][2][1]},{'table':0,'row':10,'column':8,'expected_from_raw_html':'2071','extracted':tables[0]['rows'][10][8]}]
  dump(OUT/'kohdunkaula_taulukot.json',tables);dump(HERE/'arithmetic_checks.json',{'ratios':checks,'sums':sums})
  profile['national_2024']={'age':tables[0]['rows'][-1],'risk':tables[1]['rows'][-1],'histology_age':tables[20]['rows'][-1],'histology_risk':tables[21]['rows'][-1],'detection_mode_2020_2024':tables[125]['rows'][2:]}
 all_profiles[name]=profile
 dump(HERE/(name+'_widget_inventory.json'),widgets)
all_profiles['created_utc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
all_profiles['scope']='Only exact saved report snapshots. No quantile estimates or digitised image values. Initial app HTML is not a completed CSV export.'
dump(OUT/'saatavuusprofiilit.json',all_profiles)
for name in SOURCES:
 p=all_profiles[name];print(name,'real tables',p['real_table_count'],'independent parser equal',p['independent_parser_equal'],'delay images',len(p['delay_images']),'widgets',len(p['widgets']),'delay keyword widgets',sum(x['delay_keyword_in_payload'] for x in p['widgets']),'special tokens',p['special_numeric_tokens'])
print('cervical arithmetic',all_profiles['kohtu']['arithmetic'])
print('cervical groups',all_profiles['kohtu']['explicit_group_counts'])
print('cervical geography',[(g['year'],g['group'],len(g['areas'])) for g in all_profiles['kohtu']['geography']])
