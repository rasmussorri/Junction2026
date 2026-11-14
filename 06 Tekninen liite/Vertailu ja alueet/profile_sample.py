from pathlib import Path
import json,csv,re
from datetime import datetime,timezone
p=Path(__file__).parent
d=json.loads((p/'nordcan_finland_breast_2024.json').read_text());r=d['dataset'][0]
out={'checked_utc':datetime.now(timezone.utc).isoformat(),'dataset_rows':len(d['dataset']),'errors':d['error'],'fields':list(r),'country':'Finland','year':r['year'],'cancer':'Breast (C50)','type_code':r['type'],'sex_code':r['sex'],'total':r['total'],'age_groups':len(r['ages']),'population_age_groups':len(r['populations']),'age_counts_sum':sum(r['ages'].values()),'population_sum':sum(r['populations'].values()),'crude_rate_from_counts':r['total']/r['total_pop']*100000,'crude_rate_in_response':r['crude_rate'],'fractional_age_counts':{k:v for k,v in r['ages'].items() if v!=int(v)},'null_fields':[k for k,v in r.items() if v is None],'asr_world':r['asr'],'asr_european_1976':r['asr_e'],'asr_european_2013':r['asr_e2013'],'asr_nordic':r['asr_n']}
(p/'nordcan_profile.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print(json.dumps(out,ensure_ascii=False,indent=2))
