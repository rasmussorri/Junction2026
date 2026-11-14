from pathlib import Path
import json,math,csv
p=Path(__file__).parent
files=['hilmo_screening.json','hilmo_mammography.json','avo_screening_count.json','avo_screening_clients.json','pth_sept2026_doctor_count.json','pth_sept2026_doctor_pct.json']
out={}
def decode(d):
 dims=d['dimension'];ids=dims['id'];size=dims['size'];rev={a:{i:k for k,i in dims[a]['category']['index'].items()} for a in ids};rows=[]
 for pos,v in (d['value'].items() if isinstance(d['value'],dict) else enumerate(d['value'])):
  k=int(pos);coord=[]
  for n in reversed(size):coord.append(k%n);k//=n
  coord=coord[::-1];r={a:dims[a]['category']['label'][rev[a][j]] for a,j in zip(ids,coord)};r.update(value=v,cell_index=int(pos));rows.append(r)
 return rows
for fn in files:
 d=json.loads((p/fn).read_text())['dataset'];vals=d['value'];rows=decode(d);rec={'label':d['label'],'dimensions':d['dimension']['id'],'shape':d['dimension']['size'],'cells':math.prod(d['dimension']['size']),'explicit_values':len(vals),'absent_keys':math.prod(d['dimension']['size'])-len(vals),'non_numeric':{k:v for k,v in vals.items() if not str(v).replace('.','',1).isdigit()},'explicit_zeros':sum(str(v)=='0' for v in vals.values())}
 if fn.startswith('avo_screening'):rec['published_cells']=rows
 if fn.startswith('hilmo_'):rec['published_cells']=rows
 if fn.startswith('pth_'):rec['national_cells']=[r for r in rows if r['palveluntuottaja']=='Kaikki palveluntuottajat']
 out[fn]=rec
cnt=json.loads((p/'pth_sept2026_doctor_count.json').read_text())['dataset'];pct=json.loads((p/'pth_sept2026_doctor_pct.json').read_text())['dataset'];paired=[]
for i,x in cnt['value'].items():
 k=int(i);total=cnt['value'].get(str(k//6*6+5));y=pct['value'].get(i)
 if total and y:
  try:paired.append(abs(float(x)/float(total)*100-float(y)))
  except ValueError:pass
out['pct_check']={'paired_numeric_cells':len(paired),'max_difference_percentage_points':max(paired)}
(p/'profiles.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out,ensure_ascii=False,indent=2))
