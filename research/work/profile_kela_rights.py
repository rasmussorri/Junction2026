"""Small aggregate Kela extract; never downloads person-level data."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from datetime import datetime, timezone
from collections import Counter
import json, hashlib, argparse

root=Path(__file__).resolve().parents[1]
out=root/'09 Aineistojen syväanalyysi/Kelan korvausoikeudet'
out.mkdir(parents=True,exist_ok=True)
p=argparse.ArgumentParser();p.add_argument('--refresh',action='store_true');args=p.parse_args()
url='https://avoindata.suomi.fi/data/api/3/action/datastore_search?'+urlencode({'resource_id':'cc74cc46-2b92-42b5-9a52-55adb3df512f','limit':1000,'filters':json.dumps({'korvausoikeus_koodi':115,'vuosi':2025}),'sort':'_id asc'})
raw=out/'rights115_2025.json'
if args.refresh or not raw.exists():
    at=datetime.now(timezone.utc).isoformat()
    with urlopen(Request(url,headers={'User-Agent':'JunctionResearch/1.0'}),timeout=30) as r:
        data=r.read(1000001)
        assert len(data)<1000000,'Unexpectedly large aggregate response'
        log={'url':url,'method':'GET','at_utc':at,'status':r.status,'content_type':r.headers.get('Content-Type'),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
    raw.write_bytes(data);(out/'request_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2))
j=json.loads(raw.read_text()); assert j['success']
res=j['result'];rows=res['records'];assert len(rows)==res['total'] and not res.get('total_was_estimated')
assert all(r['vuosi']==2025 and r['korvausoikeus_koodi']==115 for r in rows)
keyfields=['aikatyyppi','vuosi','hyvinvointialue_nro','ikaryhma','sukupuoli','korvausoikeus_koodi']
keys=Counter(tuple(r[f] for f in keyfields) for r in rows)
assert max(keys.values())==1
fields=['alkanut_lkm','kokovuosi_lkm','kuolema_lkm','voimassaolleet_lkm','vuodenlopussa_lkm']
dimensions={f:sorted({str(r[f]) for r in rows}) for f in ['hyvinvointialue_nro','hyvinvointialue_nimi','ikaryhma','sukupuoli']}
missing={f:sum(r.get(f) is None for r in rows) for f in fields}
checks=[]
for r in rows:
    for lesser in ['kokovuosi_lkm','vuodenlopussa_lkm','alkanut_lkm','kuolema_lkm']:
        if r[lesser] is not None and r['voimassaolleet_lkm'] is not None and r[lesser]>r['voimassaolleet_lkm']:
            checks.append({'id':r['_id'],'constraint':lesser+' <= voimassaolleet_lkm'})
prior=json.loads((root/'06 Tekninen liite/Kela ja Fimea/rights_breast2025_sample.json').read_text())['result']['records']
byid={r['_id']:r for r in rows}
assert all(byid[r['_id']]==r for r in prior),'Prior small query differs'
grouped={}
for r in rows:
    k=(r['hyvinvointialue_nro'],r['hyvinvointialue_nimi'],r['sukupuoli'])
    obj=grouped.setdefault(k,{'region_code':k[0],'region_name':k[1],'sex':k[2],'age_rows':0,**{f:0 for f in fields}})
    obj['age_rows']+=1
    for f in fields:
        if r[f] is not None:obj[f]+=r[f]
profile={'selection':{'code':115,'year':2025},'rows':len(rows),'unique_keys':len(keys),'dimensions':dimensions,'null_by_measure':missing,'zero_by_measure':{f:sum(r[f]==0 for r in rows) for f in fields},'constraint_violations':checks,'prior_sample_exact_row_matches':len(prior),'total_cartesian_cells':len(dimensions['hyvinvointialue_nro'])*len(dimensions['ikaryhma'])*len(dimensions['sukupuoli']),'grouped_age_sums_for_inspection':list(grouped.values()),'note':'Absent combinations are not automatically zero. Regional sums provisional until age categories and suppression documented. Counts concern reimbursement rights/episodes, not new diagnoses or treatment delivery.'}
(out/'profile.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in profile.items() if k!='grouped_age_sums_for_inspection'},ensure_ascii=False,indent=2))
