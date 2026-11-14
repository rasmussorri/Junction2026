#!/usr/bin/env python3
"""Reproduce T15 joins offline; --refresh refreshes the 46-cell StatFin sample only."""
from pathlib import Path
import json, hashlib, urllib.request, argparse, collections, itertools
from datetime import datetime, timezone

W=Path(__file__).resolve().parent
V=W.parents[2]
API='https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px'
YEAR='2024'
CROSSWALK={
'Etelä-Karjala':'HVA11','Etelä-Pohjanmaa':'HVA16','Etelä-Savo':'HVA12',
'Helsingin kaupunki':'HVA90','Itä-Uusimaa':'HVA01','Kainuu':'HVA20',
'Kanta-Häme':'HVA07','Keski-Pohjanmaa':'HVA18','Keski-Suomi':'HVA15',
'Keski-Uusimaa':'HVA02','Kymenlaakso':'HVA10','Lappi':'HVA21',
'Länsi-Uusimaa':'HVA03','Pirkanmaa':'HVA08','Pohjanmaa':'HVA17',
'Pohjois-Karjala':'HVA14','Pohjois-Pohjanmaa':'HVA19','Pohjois-Savo':'HVA13',
'Päijät-Häme':'HVA09','Satakunta':'HVA06','Vantaa ja Kerava':'HVA04','Varsinais-Suomi':'HVA05'}

def save(name,obj): (W/name).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def dupe(rows,fields):
 c=collections.Counter(tuple(r[k] for k in fields) for r in rows)
 return [{'key':list(k),'count':v} for k,v in c.items() if v>1]
def decode(d):
 ids=d['id'];codes=[]
 for name in ids:
  idx=d['dimension'][name]['category']['index']
  codes.append(sorted(idx,key=idx.get) if isinstance(idx,dict) else idx)
 out=[]
 for i,cc in enumerate(itertools.product(*codes)):
  value=d['value'].get(str(i)) if isinstance(d['value'],dict) else d['value'][i]
  status=d.get('status',{});status=status.get(str(i)) if isinstance(status,dict) else status[i]
  out.append(dict(zip(ids,cc),value=value,status=status))
 return out

args=argparse.ArgumentParser();args.add_argument('--refresh',action='store_true');args=args.parse_args()
meta=json.loads((W/'11ra_meta.json').read_text());variables={v['code']:v for v in meta['variables']}
area=next(v for v in meta['variables'] if v['code'].startswith('alue_'))
labels=dict(zip(area['values'],area['valueTexts']))
hvas=[c for c in area['values'] if c.startswith('HVA')]
assert len(hvas)==23 and set(CROSSWALK.values())==set(hvas)-{'HVA91'}
assert all(c in labels for c in CROSSWALK.values())
query={'query':[{'code':area['code'],'selection':{'filter':'item','values':hvas}},
 {'code':'contentscode','selection':{'filter':'item','values':['vaerak-vaesto','vaesto_yli64_p']}},
 {'code':'timeperiod_y','selection':{'filter':'item','values':[YEAR]}}],
 'response':{'format':'json-stat2'}}
save('11ra_hva2024_query.json',query)
if args.refresh or not (W/'11ra_hva2024_sample.json').exists():
 req=urllib.request.Request(API,data=json.dumps(query).encode(),headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=30) as r:
  raw=r.read();(W/'11ra_hva2024_sample.json').write_bytes(raw)
  log=json.loads((W/'http_log.json').read_text())
  log.append({'url':API,'method':'POST','status':r.status,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'timestamp_utc':datetime.now(timezone.utc).isoformat()})
  save('http_log.json',log)
data=json.loads((W/'11ra_hva2024_sample.json').read_text());poprows=decode(data)
assert len(poprows)==46 and not dupe(poprows,[area['code'],'contentscode','timeperiod_y'])
assert all(r['value'] is not None and r['status'] is None for r in poprows)
pop={}
for r in poprows:
 key=(r[area['code']],r['timeperiod_y'])
 pop.setdefault(key,{'region_code':key[0],'year':int(key[1]),'population_geography_date':'2026-01-01'})[r['contentscode']]=r['value']
assert len(pop)==23
save('population_pivot.json',list(pop.values()))
screening={};inputhashes=[]
for program in ['suolisto','rinta']:
 path=V/'06 Tekninen liite'/f'{program}_tables.json'
 raw=json.loads(path.read_text());selected=[(i,t) for i,t in enumerate(raw) if t['headings'][1:]==['Hyvinvointialueet','Seulontaketju',YEAR]]
 assert len(selected)==1
 idx,t=selected[0];rows=[]
 for rr in t['rows'][2:]:
  if rr[0]=='Yhteensä':continue
  name=rr[0];rows.append({'program':program,'year':int(YEAR),'source_region_name':name,
   'region_code':CROSSWALK[name],'denominator_source_label':t['rows'][0][1],
   'denominator_source_value':int(rr[1]),'participated_count':int(rr[2]),
   'participation_percent_published':float(rr[3].replace(',','.'))})
 assert len(rows)==22 and not dupe(rows,['region_code','year'])
 assert set(r['source_region_name'] for r in rows)==set(CROSSWALK)
 screening[program]=rows
 inputhashes.append({'path':str(path.relative_to(V)),'sha256':sha(path),'table_index_zero_based':idx,'headers':t['headings']})
 save(f'{program}_2024_regions.json',rows)

crosswalk=[{'screening_region_name':n,'statfin_region_code':c,'statfin_region_label':labels[c],
 'basis':'Explicit analyst name-to-code correspondence, checked against fetched official metadata; not a publisher-supplied crosswalk'} for n,c in CROSSWALK.items()]
save('region_crosswalk.json',crosswalk)
wide=[]
left={r['region_code']:r for r in screening['suolisto']};right={r['region_code']:r for r in screening['rinta']}
for code in sorted(set(left)&set(right)):
 a,b=left[code],right[code];context=pop[(code,YEAR)]
 wide.append({'region_code':code,'region_name':a['source_region_name'],'year':2024,
  'colon_selected_count':a['denominator_source_value'],'colon_participated_count':a['participated_count'],
  'colon_participation_percent_published':a['participation_percent_published'],
  'breast_invited_label_count':b['denominator_source_value'],'breast_participated_count':b['participated_count'],
  'breast_participation_percent_published':b['participation_percent_published'],
  'population_31dec_all_ages':context['vaerak-vaesto'],'population_age65plus_percent':context['vaesto_yli64_p'],
  'population_geography_date':context['population_geography_date']})
assert len(wide)==22 and not dupe(wide,['region_code','year'])
save('joined_2024_regions.json',wide)
combined=screening['suolisto']+screening['rinta']
sc=collections.Counter((r['region_code'],str(r['year'])) for r in combined)
pc=collections.Counter((r[area['code']],r['timeperiod_y']) for r in poprows)
mn=[list(k) for k in sc if sc[k]>1 and pc[k]>1]
naive_rows=sum(sc[k]*pc[k] for k in sc if k in pc)
checks={
 'screening_year':2024,'population_reference_date':'2024-12-31','population_geography_date':'2026-01-01',
 'statfin_response_updated':data['updated'],'screening_input_provenance':inputhashes,
 'screening_each_rows':{k:len(v) for k,v in screening.items()},
 'screening_each_duplicate_region_year_keys':{k:dupe(v,['region_code','year']) for k,v in screening.items()},
 'screening_join_matched_regions':len(set(left)&set(right)),
 'screening_left_unmatched':sorted(set(left)-set(right)), 'screening_right_unmatched':sorted(set(right)-set(left)),
 'crosswalk_codes_unique':len(set(CROSSWALK.values()))==len(CROSSWALK),
 'population_raw_cells':len(poprows),'population_pivot_rows':len(pop),
 'screening_to_population_matched':len(wide),'screening_to_population_unmatched':sorted(set(left)-{k[0] for k in pop}),
 'population_only_regions':[{'code':k[0],'label':labels[k[0]]} for k in pop if k[0] not in left],
 'final_duplicate_region_year_keys':dupe(wide,['region_code','year']),
 'naive_long_join_on_region_year':{'screening_rows':len(combined),'population_rows':len(poprows),
  'many_to_many_keys':len(mn),'result_rows':naive_rows,'reason':'2 programs × 2 measures per region; pivot measures and keep program in key or join programs wide first.'},
 'missing_population_cells':sum(r['value'] is None for r in poprows),
 'new_population_denominator_rates_created':False,
 'geography_compatibility':'Name/code correspondence verified. Screening region boundary vintage and residence assignment date not established by this test.'}
assert checks['screening_to_population_unmatched']==[] and len(checks['population_only_regions'])==1
assert checks['population_only_regions'][0]['code']=='HVA91'
assert naive_rows==88 and len(mn)==22
save('join_checks.json',checks)
save('source_manifest.json',{'screening_files':inputhashes,'statfin_api':API,
 'statfin_metadata_sha256':sha(W/'11ra_meta.json'),'statfin_data_sha256':sha(W/'11ra_hva2024_sample.json'),
 'generated_utc':datetime.now(timezone.utc).isoformat()})
print(json.dumps({k:v for k,v in checks.items() if k not in ['screening_input_provenance']},ensure_ascii=False,indent=2))
print('Examples:',json.dumps([r for r in wide if r['region_code'] in ['HVA11','HVA90']],ensure_ascii=False))
