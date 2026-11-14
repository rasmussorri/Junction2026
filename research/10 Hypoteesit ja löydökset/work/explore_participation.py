from pathlib import Path
import json,re,html,hashlib,math,statistics
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'10 Hypoteesit ja löydökset'
SOURCE=ROOT/'06 Tekninen liite'
def plain(s):return ' '.join(html.unescape(re.sub('<[^>]*>',' ',s)).split())
def real_tables(s):
 s=re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S|re.I)
 return [[[plain(c) for c in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>',r,re.S|re.I)] for r in re.findall(r'<tr\b[^>]*>(.*?)</tr>',t,re.S|re.I)] for t in re.findall(r'<table\b[^>]*>.*?</table>',s,re.S|re.I)]
records=[];manifest={}
for prog in ['suolisto','rinta']:
 raw=(SOURCE/(prog+'.html')).read_text();independent=real_tables(raw);tabs=json.loads((SOURCE/(prog+'_tables.json')).read_text())
 assert independent==[t['rows'] for t in tabs]
 manifest[prog]={'source_url':'https://stats.cancerregistry.fi/joukkistilastot/'+prog+'.html','raw_sha256':hashlib.sha256(raw.encode()).hexdigest(),'real_tables':len(independent)}
 for i,t in enumerate(tabs):
  if 'Hyvinvointialueet' not in t['headings'] or 'Seulontaketju' not in t['headings']:continue
  assert t['rows'][0][1]==('Poimittu' if prog=='suolisto' else 'Kutsuttu')
  year=int(t['headings'][-1])
  for r in t['rows'][2:]:
   if r[0]=='Yhteensä':continue
   denominator=int(r[1]);participants=int(r[2]);rate=100*participants/denominator
   assert abs(rate-float(r[3].replace(',','.')))<=.050001
   records.append({'program':prog,'year':year,'region':r[0],'denominator_label':t['rows'][0][1],'denominator':denominator,'participants':participants,'participation_pct':rate,'published_pct':r[3],'table_index':i})
(OUT/'alue_vuosi_osallistuminen.json').write_text(json.dumps({'scope':'Regional aggregate snapshots; percentages recalculated from integer counts.','manifest':manifest,'records':records},ensure_ascii=False,indent=2))
results={'manifest':manifest,'programs':{},'comparisons_performed':{}}
for prog in ['suolisto','rinta']:
 data=[r for r in records if r['program']==prog];years=sorted({r['year'] for r in data});common=sorted(set.intersection(*[{r['region'] for r in data if r['year']==y} for y in years]));by_year={y:{r['region']:r for r in data if r['year']==y and r['region'] in common} for y in years}
 summaries=[]; rankings={}
 for y in years:
  rows=list(by_year[y].values());ordered=sorted(rows,key=lambda r:r['participation_pct']);rankings[y]={r['region']:k+1 for k,r in enumerate(ordered)}
  d=sum(r['denominator'] for r in rows);p=sum(r['participants'] for r in rows)
  summaries.append({'year':y,'stable_region_count':len(rows),'denominator':d,'participants':p,'weighted_pct':100*p/d,'lowest':ordered[0],'highest':ordered[-1],'gap_pp':ordered[-1]['participation_pct']-ordered[0]['participation_pct'],'bottom_three':[r['region'] for r in ordered[:3]],'top_three':[r['region'] for r in ordered[-3:]]})
 changes=[]
 for y0,y1 in zip(years,years[1:]):
  for region in common:
   a,b=by_year[y0][region],by_year[y1][region];changes.append({'region':region,'from':y0,'to':y1,'change_pp':b['participation_pct']-a['participation_pct'],'before':a,'after':b})
 endpoints=[{'region':r,'change_pp':by_year[years[-1]][r]['participation_pct']-by_year[years[0]][r]['participation_pct'],'before':by_year[years[0]][r],'after':by_year[years[-1]][r]} for r in common]
 results['programs'][prog]={'years':years,'stable_regions':common,'year_summaries':summaries,'adjacent_changes':changes,'endpoint_changes':sorted(endpoints,key=lambda a:a['change_pp']),'rankings_ascending':rankings,'endpoint_declines':sum(x['change_pp']<0 for x in endpoints),'adjacent_declines_by_interval':{str(y)+'-'+str(y+1):sum(c['change_pp']<0 for c in changes if c['from']==y) for y in years[:-1]}}
 results['comparisons_performed'][prog]={'region_year_rates':len(data),'stable_region_year_rates':len(common)*len(years),'adjacent_region_changes':len(changes),'endpoint_region_changes':len(endpoints),'annual_min_max_gaps':len(years)}
a={r['region']:r for r in records if r['program']=='suolisto' and r['year']==2024};b={r['region']:r for r in records if r['program']=='rinta' and r['year']==2024};common=sorted(set(a)&set(b))
ra=results['programs']['suolisto']['rankings_ascending'][2024];rb=results['programs']['rinta']['rankings_ascending'][2024]
assert len({a[r]['participation_pct'] for r in common})==len(common) and len({b[r]['participation_pct'] for r in common})==len(common)
rho=1-6*sum((ra[r]-rb[r])**2 for r in common)/(len(common)*(len(common)**2-1))
results['cross_program_2024']={'n_regions':len(common),'spearman_rho':rho,'ranks':[{'region':r,'colon_rank':ra[r],'breast_rank':rb[r],'colon_pct':a[r]['participation_pct'],'breast_pct':b[r]['participation_pct']} for r in common],'warning':'Different populations and denominators, ecological descriptive association only; no p-value or causal inference.'}
results['comparisons_performed']['cross_program']={'rank_correlations':1,'matched_regions':len(common)}
(OUT/'work/exploration_results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
for prog,p in results['programs'].items():
 print('\n',prog,'ENDPOINT DECLINES',p['endpoint_declines'],'ADJACENT',p['adjacent_declines_by_interval'])
 for s in p['year_summaries']:print(s['year'],round(s['weighted_pct'],4),s['lowest']['region'],round(s['lowest']['participation_pct'],3),s['highest']['region'],round(s['highest']['participation_pct'],3),'gap',round(s['gap_pp'],3),'bottom3',s['bottom_three'])
 print('largest endpoint drops',[(c['region'],round(c['change_pp'],4)) for c in p['endpoint_changes'][:3]])
 print('largest adjacent changes',[(c['region'],c['from'],round(c['change_pp'],4)) for c in sorted(p['adjacent_changes'],key=lambda c:abs(c['change_pp']),reverse=True)[:5]])
print('RHO',rho)
# Follow the observed decline with a fixed national age-sex composition check.
# This does not standardize regional estimates and does not follow the same people.
tabs=json.loads((SOURCE/'suolisto_tables.json').read_text()); age={}
for t in tabs:
 if t['headings'][1:3]!=['Koko maa','Ikäryhmät']:continue
 y=int(t['headings'][-1]);age[y]={(r[0],r[1]):{'denominator':int(r[2]),'participants':int(r[3])} for r in t['rows'][2:] if r[0] in ['60','62','64','66','68'] and r[1] in ['Miehet','Naiset']}
base_den=sum(v['denominator'] for v in age[2022].values());checks=[]
for y in sorted(age):
 vals=age[y];den=sum(v['denominator'] for v in vals.values());num=sum(v['participants'] for v in vals.values());standardized=sum(age[2022][k]['denominator']/base_den*100*vals[k]['participants']/vals[k]['denominator'] for k in age[2022])
 checks.append({'year':y,'age_range':'60,62,64,66,68','sex_strata':2,'denominator':den,'participants':num,'crude_pct_restricted':100*num/den,'direct_standardized_pct_2022_weights':standardized})
results['colon_national_fixed_age_sex_check']={'strata_count':10,'standard_population_year':2022,'standard_population_N':base_den,'annual_results':checks,'strata_declining_2022_to_2024':sum(age[2024][k]['participants']/age[2024][k]['denominator']<age[2022][k]['participants']/age[2022][k]['denominator'] for k in age[2022]),'warning':'National repeated cross-sections; not regional adjustment or within-person decline.'}
results['comparisons_performed']['followup_age_sex']={'annual_standardized_estimates':3,'stratum_endpoint_comparisons':10}
(OUT/'work/exploration_results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('AGESEX',results['colon_national_fixed_age_sex_check'])
