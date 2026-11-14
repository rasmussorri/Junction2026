import json
G='2026-11-14'
def S(t,u,tier=None): return {'title':t,'url':u}  # source level classes removed
R={}
R['S2.2']={'title':'How screening participation has been increased elsewhere','generated':G,'sections':[
 {'name':'Finland','items':[
  {'text':'In a randomised trial in Espoo, mailing an HPV self-sampling kit to women who had missed screening brought in more participants than a reminder letter (29.8% vs 26.2%).',
   'sources':[S('Virtanen et al. 2011, International Journal of Cancer','https://doi.org/10.1002/ijc.25581','B')]},
  {'text':'Offering self-sampling as the first reminder raised total attendance by 17%. A cost analysis suggests a letter as the first reminder and self-sampling as the second.',
   'sources':[S("Virtanen, Anttila & Nieminen 2015, BMC Women's Health",'https://pmc.ncbi.nlm.nih.gov/articles/PMC4635548','B')]},
  {'text':'An opt-in model, where non-attenders order a self-sampling kit on request, was also found feasible in Finland.',
   'sources':[S('Finnish opt-in self-sampling pilot (PMC)','https://pmc.ncbi.nlm.nih.gov/articles/PMC9796070','B')]}]},
 {'name':'Other Nordic countries','items':[
  {'text':'Stockholm sent self-sampling kits directly to about 330,000 women instead of an invitation. Organised screening test coverage rose from 54% to 60% within a year.',
   'sources':[S('Elfström, Gray & Dillner 2023, eLife','https://elifesciences.org/articles/80905','B')]}]},
 {'name':'Rest of the world','items':[
  {'text':'A systematic review found that postal and telephone reminders, a GP signature on the invitation, and a pre-booked appointment (instead of an open invitation) increase participation.',
   'sources':[S('BMC Public Health 2013 (systematic review)','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3686655/','A')]},
  {'text':'In colorectal screening, advance notification letters, mailing the faecal test home, written reminders and a phone call from an adviser increase test return.',
   'sources':[S('Rat et al. 2018, European Journal of Cancer Prevention (systematic review)','https://doi.org/10.1097/CEJ.0000000000000344','A')]},
  {'text':'Pre-screening reminders, GP endorsement, more personal reminders and more acceptable tests (e.g. self-sampling) also work in under-served groups.',
   'sources':[S('Journal of Medical Screening 2017 (rapid review)','https://pubmed.ncbi.nlm.nih.gov/27754937/','A')]}]}]}
R['S3.3']={'title':'How access to cancer treatment has been sped up elsewhere','generated':G,'sections':[
 {'name':'Finland','items':[
  {'text':'A peer-reviewed Nordic comparison found that patients with lung symptoms wait longer in Finland at every stage of the pathway. Elsewhere, CT is used more widely early in the pathway, which allows earlier diagnosis.',
   'sources':[S('University of Helsinki: study in Acta Oncologica 2025','https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa','B')]}]},
 {'name':'Other Nordic countries','items':[
  {'text':'Denmark introduced national cancer patient pathways in 2008, with maximum time limits for diagnostics and the start of treatment. Waiting times fell significantly.',
   'sources':[S('Probst et al. 2012, Health Policy','https://doi.org/10.1016/j.healthpol.2011.11.001','B')]},
  {'text':'Sweden adopted the model in 2015 (standardised care pathways, SVF). The time from well-founded suspicion to treatment is measured the same way across the country.',
   'sources':[S('Regional Cancer Centres: Cancer Patient Pathways','https://cancercentrum.se/syd/regional-cancer-centres/knowledge-based-healthcare/cancer-patient-pathways/','B')]},
  {'text':'Swedish state funding to regions is tied to targets: 70% of patients assessed through a pathway, and 80% of those assessments completed within the target time.',
   'sources':[S('Government of Sweden, press release 12/2024','https://www.regeringen.se/pressmeddelanden/2024/12/positiva-resultat-inom-cancervarden/','B')]}]},
 {'name':'Rest of the world','items':[
  {'text':'England introduced a 28-day standard in 2021: cancer is diagnosed or ruled out within 28 days of referral, supported by rapid diagnostic centres.',
   'sources':[S('NHS England: Faster Diagnosis Framework','https://www.england.nhs.uk/wp-content/uploads/2019/07/B1332-NHS-Cancer-Programme-Faster-Diagnosis-Framework-v5.pdf','B')]},
  {'text':'Rapid diagnostic centres are based on the Danish model and serve patients with vague symptoms. In an evaluation, 7% were diagnosed with cancer and a third with another significant condition.',
   'sources':[S('British Journal of Cancer 2020','https://link.springer.com/10.1038/s41416-020-01207-7','B')]}]}]}
R['S3.2']={'title':'How cancer mortality has been reduced elsewhere','generated':G,'sections':[
 {'name':'Finland','items':[
  {'text':'In the NORDCAN comparison, survival improved least in Finland between 2001–2005 and 2011–2015 (5-year survival +3–4 percentage points, compared with +8–12 in Denmark).',
   'sources':[S('Engholm, ENCR 2018 (NORDCAN presentation)','https://encr.eu/sites/default/files/2018-ENCR-Conference/EngholmENCR_SurvivalNORDCAN.pdf','B')]},
  {'text':'Lung cancer causes the most cancer deaths in Finland, and outcomes are worse than in the other Nordic countries. Reasons include slower access to a doctor and narrower diagnostics in primary care.',
   'sources':[S('University of Helsinki: study in Acta Oncologica 2025','https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa','B')]}]},
 {'name':'Other Nordic countries','items':[
  {'text':'Denmark closed its survival gap with the other Nordic countries through four national cancer plans (2000–2015), patient pathways, public monitoring of waiting times and expanded screening.',
   'sources':[S('Engholm, ENCR 2018 (NORDCAN presentation)','https://encr.eu/sites/default/files/2018-ENCR-Conference/EngholmENCR_SurvivalNORDCAN.pdf','B')]},
  {'text':'A NORDCAN study attributes the improvements to several factors: earlier diagnosis, better treatment, national cancer plans, uniform guidelines and standardised pathways.',
   'sources':[S('Lundberg et al. 2020, Acta Oncologica','https://doi.org/10.1080/0284186X.2020.1822544','B')]}]},
 {'name':'Rest of the world','items':[
  {'text':'In the Dutch-Belgian NELSON trial, low-dose CT screening reduced lung cancer mortality among high-risk men by 24% over ten years.',
   'sources':[S('de Koning et al. 2020, New England Journal of Medicine','https://doi.org/10.1056/NEJMoa1911793','A')]}]}]}
R['S2.1']={'title':'How HPV vaccination coverage has been raised elsewhere (supporting indicator for preventable cancers)','generated':G,'sections':[
 {'name':'Finland','items':[
  {'text':'According to THL, most children receive the HPV vaccine as recommended in primary school. Few new vaccination series start after basic education, so reaching children at school age is decisive.',
   'sources':[S('THL press release 29 Nov 2023','https://www.sttinfo.fi/tiedote/70064492/storsta-delen-av-barnen-far-hpv-vaccin-enligt-rekommendationen-flickornas-vaccinationstackning-ar-hogre-an-pojkarnas?publisherId=69817778','B')]}]},
 {'name':'Other Nordic countries','items':[
  {'text':'In Norway, the vaccine is given at school during school hours by a public health nurse and free of charge, so cost and access barriers are minimal.',
   'sources':[S('BMJ Open 2015: HPV vaccination in the Norwegian school programme','https://pmc.ncbi.nlm.nih.gov/articles/PMC4442157','B')]},
  {'text':'A Norwegian registry study found that school-based delivery is largely equitable. Information campaigns aimed at lower-uptake groups could narrow the remaining gaps.',
   'sources':[S('Preventive Medicine 2015: registry study of 90,000 Norwegian girls','https://doi.org/10.1016/j.ypmed.2015.04.024','B')]}]},
 {'name':'Rest of the world','items':[
  {'text':'A meta-analysis found that digital reminders (text messages, alerts to professionals in patient records) increase vaccine uptake, while information alone does not.',
   'sources':[S('Chandeying & Thongseiratch 2023, npj Digital Medicine','https://www.nature.com/articles/s41746-023-00912-w','A')]},
  {'text':'High-coverage countries usually vaccinate at school and send systematic invitations and reminders. Low-coverage countries more often vaccinate in clinics without reminders.',
   'sources':[S('Systematic review 2024, Human Vaccines & Immunotherapeutics','https://doi.org/10.1080/21645515.2024.2319426','A')]}]}]}
for k,v in R.items(): json.dump(v,open(f'reports/{k}.json','w'),ensure_ascii=False,indent=1)
print(list(R))
