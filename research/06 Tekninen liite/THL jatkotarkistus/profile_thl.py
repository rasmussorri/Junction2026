from pathlib import Path
import json,math,collections
p=Path(__file__).resolve().parent
load=lambda n:json.loads((p/n).read_text())['dataset']
count=load('queue_gt180_count.json');pct=load('queue_gt180_pct.json');total=json.loads((p.parents[1]/'09 Aineistojen syväanalyysi/work/thl_explicit.json').read_text())['dataset']
assert count['dimension']==pct['dimension']==total['dimension']
checks=[]
for k,v in count['value'].items():
 if k in pct['value'] and k in total['value'] and float(total['value'][k])>0:
  calc=100*float(v)/float(total['value'][k]);err=abs(calc-float(pct['value'][k]));checks.append({'index':k,'count':v,'total':total['value'][k],'reported_pct':pct['value'][k],'calculated_pct':calc,'pass':err<=.0500001})
def profile(d):
 vals=d['value'];items=list(vals.values()) if isinstance(vals,dict) else vals
 return {'dimensions':d['dimension']['id'],'shape':d['dimension']['size'],'stored_values':len(vals),'missing_index_count':math.prod(d['dimension']['size'])-len(vals),'nulls':sum(v is None for v in items),'zeros':sum(v in ['0','0.0',0,0.0] for v in items),'non_numeric_tokens':dict(collections.Counter(v for v in items if v is not None and not str(v).replace('.','').replace('-','').isdigit()))}
def cell(d,a,b):
 x,y=d['dimension']['id'];dx=d['dimension'][x]['category'];dy=d['dimension'][y]['category'];i=dx['index'][a]*d['dimension']['size'][1]+dy['index'][b];return d['value'].get(str(i))
latest=[]
d=count['dimension']
for a,l in d['tuottaja']['category']['label'].items():
 latest.append({'producer':l,'date':'30.09.2026','gt180_count':cell(count,a,'1239137'),'waiting_total':cell(total,a,'1239137'),'gt180_pct':cell(pct,a,'1239137')})
h=load('hilmo_oncology.json');a=load('avohilmo_c50_area_clients.json');bad=load('avohilmo_c50.json')
result={'waiting_gt180_pct':profile(pct),'waiting_gt180_count':profile(count),'ratio_check_count':len(checks),'ratio_check_failures':sum(not c['pass'] for c in checks),'latest_queue_rows':latest,'hilmo':profile(h),'hilmo_explicit_equal':h==load('hilmo_oncology_explicit.json'),'avohilmo_bad_query':profile(bad),'avohilmo_corrected':profile(a)}
(p/'profiles.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));(p/'ratio_checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2))
