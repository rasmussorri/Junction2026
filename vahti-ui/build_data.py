"""Kokoaa UI:n datan: Excel (alkuperäinen data) + rules.yaml (tavoitteet) + kartta."""
import json, re, unicodedata, yaml, pandas as pd, numpy as np
X='/home/claude/vahti/Finland_cancer_care_dataset_2026-11-14.xlsx'
R=yaml.safe_load(open('/home/claude/vahti/rules.yaml'))
M=json.load(open('map_raw.json'))
CODE={'01':'Itä-Uusimaa','02':'Keski-Uusimaa','03':'Länsi-Uusimaa','04':'Vantaa ja Kerava','05':'Varsinais-Suomi','06':'Satakunta',
'07':'Kanta-Häme','08':'Pirkanmaa','09':'Päijät-Häme','10':'Kymenlaakso','11':'Etelä-Karjala','12':'Etelä-Savo','13':'Pohjois-Savo',
'14':'Pohjois-Karjala','15':'Keski-Suomi','16':'Etelä-Pohjanmaa','17':'Pohjanmaa','18':'Keski-Pohjanmaa','19':'Pohjois-Pohjanmaa',
'20':'Kainuu','21':'Lappi','90':'Helsinki','91':'Ahvenanmaa'}
REG=[CODE[c] for c in sorted(CODE) if c!='91']
HUS_AREA={'Helsinki','Itä-Uusimaa','Keski-Uusimaa','Länsi-Uusimaa','Vantaa ja Kerava'}
HUS='HUS (Uusimaa + Helsinki, erikoissairaanhoito)'
y=pd.read_excel(X,'CORE_regions_yearly',dtype={'vuosi':str}); q=pd.read_excel(X,'CORE_queues_monthly',dtype={'kuukausi':str})
def num(v):
    try:
        v=float(v); return None if np.isnan(v) else round(v,1)
    except Exception: return None
def ypiv(c): return y.pivot(index='vuosi',columns='alue',values=c).apply(pd.to_numeric,errors='coerce')
def qpiv(c): return q.pivot(index='kuukausi',columns='alue',values=c).apply(pd.to_numeric,errors='coerce')
SRC={'sotkanet':'https://sotkanet.fi/sotkanet/fi/haku','thl_jonot':'https://thl.fi/tilastot-ja-data/tilastot-aiheittain/sosiaali-ja-terveyspalvelut/hoitoonpaasy-erikoissairaanhoidossa',
'statfin':'https://pxdata.stat.fi/PxWeb/pxweb/fi/StatFin/StatFin__ksyyt/statfin_ksyyt_pxt_11ay.px/','strategia':'https://stm.fi/documents/1271139/1329769/Kansallinen_syopastrategia_2026_2035_FINAL.pdf/05ad3c9d-d8ba-a629-3e90-e8d10f4f5bbc?t=1767863923329',
'thl_21_2016':'https://core.ac.uk/download/78470017.pdf'}
# ---------- mittarit ----------
measures={}
def yearly(mid,label,col,target,src,unit='%'):
    p=ypiv(col); p=p[p.notna().sum(axis=1)>5]; yr=p.index.max(); prev=p.index[-2]
    hist={r:{t:num(p.loc[t,r]) for t in p.index[-8:]} for r in REG+['Koko maa'] if r in p}
    measures[mid]=dict(id=mid,label=label,kind='min',target=target,unit=unit,period=yr,source=src,
        national=num(p.loc[yr,'Koko maa']) if 'Koko maa' in p else None,
        values={r:num(p.loc[yr,r]) for r in REG if r in p},prev={r:num(p.loc[prev,r]) for r in REG if r in p},prev_period=prev,history=hist)
yearly('suolisto','Suolistosyövän seulonta, osallistuneet','seul_suolisto_osallistuneet_pct',80,'Sotkanet 6103')
yearly('rinta','Rintasyövän seulonta, osallistuneet','seul_rinta_osallistuneet_pct',80,'Sotkanet 3621')
yearly('kohdunkaula','Kohdunkaulasyövän seulonta, osallistuneet','seul_kohdunkaula_osallistuneet_pct',80,'Sotkanet 3620')
yearly('hpv_tytot','HPV-rokotuskattavuus, tytöt','hpv_rokotuskattavuus_tytot_pct',90,'Sotkanet 3869')
yearly('hpv_pojat','HPV-rokotuskattavuus, pojat','hpv_rokotuskattavuus_pojat_pct',90,'Sotkanet 3297')
MON='2026-09'
def monthly(mid,label,col,unit):
    p=qpiv(col); prev=p.index[p.index.get_loc(MON)-1]
    val=lambda r,t: num(p.loc[t,HUS if r in HUS_AREA else r])
    measures[mid]=dict(id=mid,label=label,kind='zero',target=0,unit=unit,period=MON,prev_period=prev,source='THL, erikoissairaanhoidon jonot',
        national=num(p.loc[MON,'Koko maa']),values={r:val(r,MON) for r in REG},prev={r:val(r,prev) for r in REG},
        history={r:{t:num(p.loc[t,HUS if r in HUS_AREA else r]) for t in p.index[-12:]} for r in REG+['Koko maa']})
monthly('onk90','Syöpätaudit: yli 90 vrk hoitoa odottaneet','esh_syopataudit_yli90vrk_odottaneet','potilasta')
monthly('gyn90','Gynekologinen onkologia: yli 90 vrk odottaneet','esh_gynonk_yli90vrk_odottaneet','potilasta')
monthly('hem90','Hematologia: yli 90 vrk odottaneet','esh_hematol_yli90vrk_odottaneet','potilasta')
monthly('lahete21','Syöpätaudit: lähete käsitelty yli 21 vrk','esh_syopataudit_lahete_yli21vrk_pct','%')
lah=qpiv('esh_syopataudit_lahetteet_vuoden_alusta')
size={r:num(lah.loc['2025-12',HUS if r in HUS_AREA else r]) for r in REG}
def ok(m,r):
    v=m['values'].get(r)
    if v is None: return None
    return v>=m['target'] if m['kind']=='min' else v<=0
# kuolleisuus
d=ypiv('syopakuolemat_lkm')['Koko maa'].dropna()
l6=pd.read_excel(X,'L06_StatFin_cancer_deaths',dtype=str)
a=l6[(l6.lahde_id=='stat_ksyyt_11ay')&(l6.ryhma=='04-21 Syövät (C00-C97)')&(l6.indikaattori=='Ikävakioitu kuolleisuusluku, koko väestö (1/100 000)')&(l6.sukupuoli=='yhteensä')].set_index('aika').arvo.astype(float)
mort=dict(counts={k:int(v) for k,v in d.items()},agestd={k:float(v) for k,v in a.items() if int(k)>=2010},baseline=13300,baseline_year=2025,target=11970,target_year=2035)
# kieliero
s=pd.read_excel(X,'CORE_screening_by_group',dtype=str)
kl=s[(s.vaestoryhma=='Väestöryhmät > Äidinkieli')&(s.aineisto.str.contains('2025'))&(s.indikaattori.str.endswith('| %'))&(s.sukupuoli.isin(['yhteensä','']))&(s.luokka.isin(['Kotimainen','Muu/puuttuva']))]
kieli=[{'ohjelma':r.aineisto.split(' seulonta')[0],'luokka':r.luokka,'arvo':float(r.arvo)} for r in kl.itertuples()]
# ---------- English labels ----------
EN={'suolisto':('Colorectal cancer screening participation','Colorectal screening','screening','THL Sotkanet 6103'),
    'rinta':('Breast cancer screening participation','Breast screening','screening','THL Sotkanet 3621'),
    'kohdunkaula':('Cervical cancer screening participation','Cervical screening','screening','THL Sotkanet 3620'),
    'hpv_tytot':('HPV vaccination coverage, girls','HPV vaccination, girls','vaccination','THL Sotkanet 3869'),
    'hpv_pojat':('HPV vaccination coverage, boys','HPV vaccination, boys','vaccination','THL Sotkanet 3297'),
    'onk90':('Oncology: patients waiting more than 90 days','Oncology, waiting > 90 days','care','THL specialist care waiting times'),
    'gyn90':('Gynaecological oncology: patients waiting more than 90 days','Gyn. oncology, waiting > 90 days','care','THL specialist care waiting times'),
    'hem90':('Haematology: patients waiting more than 90 days','Haematology, waiting > 90 days','care','THL specialist care waiting times'),
    'lahete21':('Oncology referrals processed in more than 21 days','Referrals > 21 days','care','THL specialist care waiting times')}
for k,(lab,short,role,src) in EN.items():
    measures[k].update(label=lab,short=short,role=role,source=src,unit={'%':'%','potilasta':'patients'}[measures[k]['unit']])
for k in measures: measures[k].pop('history_fi',None)
mort.update(source_counts='Statistics Finland, causes of death (13u5)',source_agestd='Statistics Finland, causes of death (11ay)')
# ---------- strategy main goals (Figure 1, strategy p. 5) ----------
goals=[
 {'id':'1','title':'Strengthen participation and develop person-centred services','role':'experience','targets':[
   {'id':'S1.1','text':'Patient experience (NPS), quality of life and well-being (PROM) are measured and reported systematically','type':'none','need':'Unit-level patient experience (NPS, HoPP) and PROM results (EQ-5D-5L, THL GenPROM) are not published.','src':'Strategy p. 5, p. 18'},
   {'id':'S1.2','text':'NPS in units treating cancer patients is above 80','type':'none','need':'Unit-level NPS results are not published (sub-goal 1.2 also sets HoPP above 4.7).','src':'Strategy p. 5, p. 18'}]},
 {'id':'2','title':'Reduce the cancer burden through prevention and early detection','role':'prevention','targets':[
   {'id':'S2.1','text':'The number of preventable cancers falls by 1,000 cases per year*','foot':'* The total number of preventable cancers is currently estimated at about 10,000.','type':'measures','measures':['hpv_tytot','hpv_pojat'],'role':'vaccination','report':'S2.1',
    'need':'No published count of preventable cancers. Supporting indicator: HPV vaccination coverage (strategy sub-goals 1.3 and 2.2, target at least 90%).','src':'Strategy p. 5'},
   {'id':'S2.2','text':'All cancer screening programmes reach 80% participation in every wellbeing services county','short':'Screening participation','type':'measures','measures':['suolisto','rinta','kohdunkaula'],'report':'S2.2','role':'screening','src':'Strategy p. 5, p. 29'},
   {'id':'S2.3','text':'At least 70% of cancers are diagnosed at stage I–II','type':'none','need':'Stage is recorded for only 41.9% of cases (2024, Finnish Cancer Registry), so the share cannot yet be measured.','src':'Strategy p. 5, p. 30'}]},
 {'id':'3','title':'Ensure equal and effective cancer care','role':'care','targets':[
   {'id':'S3.1','text':'5-year survival of poor-prognosis cancers reaches the Nordic level**','foot':'** 5-year relative survival rises from the 2023 NORDCAN level by more than 14 percentage points for lung, 6 for pancreatic and 14 for liver cancer. Nordic level = average of Sweden and Norway.',
    'type':'none','need':'Requires NORDCAN comparison data (Finland vs. Sweden and Norway).','src':'Strategy p. 5'},
   {'id':'S3.2','text':'Cancer mortality falls by 10% (currently 13,300 deaths per year)','short':'Cancer mortality','type':'national','report':'S3.2','role':'care','src':'Strategy p. 5'},
   {'id':'S3.3','text':'Patients receive treatment within the target times***','short':'Treatment within target times','foot':'*** THL guidance 21/2016: at most 6 weeks from referral to first treatment when cancer is suspected. A patient waiting more than 90 days is a certain breach.',
    'type':'measures','measures':['onk90','gyn90','hem90','lahete21'],'report':'S3.3','role':'care','src':'Strategy p. 5, p. 33'}]},
 {'id':'4','title':'At the forefront of a changing environment','role':'research','targets':[
   {'id':'S4.1','text':'New clinical and registry cancer studies increase by 10% per year****','foot':'**** The annual number of new clinical cancer studies rises to about 200 by 2035.','type':'none','need':'Requires trial registry data (EU CTIS, ClinicalTrials.gov) or FinTrials data.','src':'Strategy p. 5, p. 47'},
   {'id':'S4.2','text':'Over 10% of cancer patients are recruited to interventional trials','type':'none','need':'Hospital-level trial participation data is not published.','src':'Strategy p. 5, p. 47'},
   {'id':'S4.3','text':'Medicines used in cancer care are assessed through a single channel','type':'none','need':'Requires Palko / Fimea assessment data.','src':'Strategy p. 5, p. 53'}]}]
# ---------- example contacts by role ----------
def slug(t): return re.sub(r'[^a-z]+','-',unicodedata.normalize('NFKD',t.lower()).encode('ascii','ignore').decode()).strip('-')
ROLES={'experience':'Patient experience lead','prevention':'Prevention lead','screening':'Screening programme lead','care':'Head of cancer care',
       'vaccination':'Vaccination programme lead','research':'Research and innovation lead'}
contacts={r:{k:{'role':v,'name':'Example Person','email':f'{k}.{slug(r)}@example.com','phone':'+358 00 000 0000'} for k,v in ROLES.items()} for r in REG}
contacts['FI']={k:{'role':'National coordinator – '+v.lower(),'name':'Example Person','email':f'{k}.national@example.com','phone':'+358 00 000 0000'} for k,v in ROLES.items()}
out=dict(generated='2026-11-14',regions=REG,hus_area=sorted(HUS_AREA),size=size,measures=measures,mort=mort,goals=goals,contacts=contacts,
         map=dict(W=M['W'],H=M['H'],features=[{'code':f['c'],'alue':CODE[f['c']],'d':f['d']} for f in M['f']]))
json.dump(out,open('static/data.json','w'),ensure_ascii=False)
print('ok', len(json.dumps(out,ensure_ascii=False))//1000,'kB')
