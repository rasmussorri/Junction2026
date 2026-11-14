from pathlib import Path
from html.parser import HTMLParser
import json,re,html,hashlib,collections
P=Path(__file__).resolve().parent
class Scripts(HTMLParser):
 def __init__(self):super().__init__();self.items=[];self.cur=None
 def handle_starttag(self,t,a):
  if t=='script':self.cur={'attrs':dict(a),'text':''}
 def handle_data(self,s):
  if self.cur is not None:self.cur['text']+=s
 def handle_endtag(self,t):
  if t=='script' and self.cur is not None:self.items.append(self.cur);self.cur=None
p=Scripts();source=P/'myeloma_browser_headers.html';p.feed(source.read_text())
tables=[];plots=[]
for i,item in enumerate(p.items):
 if item['attrs'].get('type')!='application/json':continue
 d=json.loads(item['text']);x=d.get('x',{});data=x.get('data')
 if data and isinstance(data[0],list):
  assert len(set(len(col) for col in data))==1
  cols={}
  for de in x.get('options',{}).get('columnDefs',[]):
   if 'name' in de:cols[de['targets']]=de['name']
  assert set(cols)==set(range(len(data)))
  records=[{cols[j]:html.unescape(v) if isinstance(v,str) else v for j,v in enumerate(rr)} for rr in zip(*data)]
  buttons=x.get('options',{}).get('buttons',[]);fn=next(b['filename'] for b in buttons if b.get('extend')=='excel')
  table={'widget_index':i,'widget_id':item['attrs']['data-for'],'excel_filename':fn,
   'columns':[cols[j] for j in range(len(data))],'display_headers':re.findall(r'<th[^>]*>(.*?)</th>',x.get('container','')),
   'records':records}
  tables.append(table);(P/(fn+'.json')).write_text(json.dumps(table,ensure_ascii=False,indent=2)+'\n')
 elif data and isinstance(data[0],dict):
  axes={k:v.get('title') for k,v in x.get('layout',{}).items() if k.startswith(('xaxis','yaxis')) and isinstance(v,dict)}
  plots.append({'widget_index':i,'widget_id':item['attrs']['data-for'],'axis_titles':axes})
byname={t['excel_filename']:t for t in tables}
cohort=byname['myelooma_laaturaportti_kohdejoukko']['records'];national=[r for r in cohort if r['ca']=='Koko maa']
inc=byname['myelooma_laaturaportti_ilmaantuvuus_kokomaa']['records']
annual=next(r for r in inc if r['tilasto']=='Tapausten lukumäärä' and r['grouping']=='Kaikki yhdessä')
assert sum(int(annual[str(y)]) for y in range(2019,2024))==2336
hva=byname['myelooma_laaturaportti_ilmaantuvuus_hyvinvointialueet']['records'];assert len(hva)==22
hva_sum=sum(r['n_id'] for r in hva)
# Preserve the observed national-versus-regional coverage difference; do not impute its cause.
trt=byname['myelooma_laaturaportti_hoito_kokomaa']['records'];assert len(trt)==18
rawcheck=[]
for r in trt:
 diff=abs(100*r['n_id']/r['total']-float(r['Arvo'].replace(',','.')))
 assert diff<=0.05001
 rawcheck.append({'treatment':r['op'],'agegroup':r['agegroup'],'difference_pp':diff})
regional=byname['myelooma_laaturaportti_hoito_yhteistyoalueet']['records'][0]
assert regional['n_id']==154 and regional['total']==800
nulls=[{'table':t['excel_filename'],'row_index':i,'column':k} for t in tables for i,r in enumerate(t['records']) for k,v in r.items() if v is None]
markers=[{'table':t['excel_filename'],'row_index':i,'column':k,'value':v} for t in tables for i,r in enumerate(t['records']) for k,v in r.items() if isinstance(v,str) and v.strip() in ['NA','N/A','...','..','--','*']]
summary={'source_url':'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html','source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
 'table_count':len(tables),'total_table_rows':sum(len(t['records']) for t in tables),
 'tables':[{'file':t['excel_filename']+'.json','columns':t['columns'],'rows':len(t['records'])} for t in tables],
 'plot_axis_evidence':plots,'national_cohort':national,'annual_counts':annual,
 'checks':{'annual_counts_sum':2336,'hva_cases_sum':hva_sum,'hva_sum_matches_national':hva_sum==2336,'national_minus_hva':2336-hva_sum,'country_treatment_percent_checks_passed':len(rawcheck),
 'regional_adjustment_example':{'area':regional['ca'],'treatment':regional['op'],'patients':154,'cohort':800,'raw_percent':19.25,'published_adjusted_percent_ci':regional['Arvo']}},
 'null_cells':nulls,'searched_missing_markers':markers,'country_all_age_treatments':[r for r in trt if r['agegroup']=='Kaikki ikäryhmät']}
(P/'myeloma_profile.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k in ['table_count','total_table_rows','national_cohort','checks','country_all_age_treatments','null_cells','searched_missing_markers']},ensure_ascii=False,indent=2))
