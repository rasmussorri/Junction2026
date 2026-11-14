"""Data adapter for Vahti UI.

Connects Vahti UI to the project's canonical data layer in sisu-ui/data/dataset.json.
Provides dynamic caching, revision tracking, and seamless fallback to static/data.json.
"""
import json
import os
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(ROOT, '..'))
DATASET_PATH = os.path.join(PROJECT_ROOT, 'sisu-ui', 'data', 'dataset.json')
FALLBACK_PATH = os.path.join(ROOT, 'static', 'data.json')

_cached_mtime = None
_cached_payload = None
_cached_status = None


def get_base_vahti():
    """Load base vahti static data (used for SVG map features and goal definitions)."""
    with open(FALLBACK_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_canonical_dataset():
    """Load raw dataset.json from sisu-ui data layer if available."""
    if not os.path.exists(DATASET_PATH):
        return None
    try:
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[data_adapter] Warning: Could not read {DATASET_PATH}: {e}")
        return None


def merge_canonical_into_vahti(sisu_snapshot, base):
    """Integrate canonical observations into the Vahti data schema."""
    out = dict(base)
    data = sisu_snapshot.get('data', {})
    revision = sisu_snapshot.get('revision', 'unknown')
    imported_at = sisu_snapshot.get('importedAt', time.strftime('%Y-%m-%dT%H:%M:%SZ'))

    out['snapshot'] = {
        'revision': revision,
        'importedAt': imported_at,
        'state': 'ready',
        'source': 'canonical-data-store'
    }
    out['generated'] = imported_at[:10]

    regions_data = data.get('regions', [])
    if not regions_data:
        return out

    # Region populations
    size = dict(out.get('size', {}))
    for r in regions_data:
        r_name = r.get('name')
        if r_name and 'population' in r:
            size[r_name] = r['population']
    out['size'] = size

    measures = dict(out.get('measures', {}))

    # Helper to find region observation by goal category and observation id
    def get_region_obs(r, category, obs_id):
        obs_list = r.get('observations', {}).get(category, [])
        for o in obs_list:
            if o.get('id') == obs_id:
                return o
        return None

    # Helper to find national observation
    def get_national_obs(category, obs_id):
        nat_list = data.get('nationalObservations', {}).get(category, [])
        for o in nat_list:
            if o.get('id') == obs_id:
                return o
        return None

    # Keep provenance with each replaced value. The static national screening
    # figures and any fallback regional values retain their original sources.
    measure_observations = {
        'suolisto': ('screening', 'screening-colon', 73.5),
        'rinta': ('screening', 'screening-breast', 81.6),
        'kohdunkaula': ('screening', 'screening-cervical', 76.3),
        'hpv_tytot': ('preventable-cancers', 'hpv-girls', None),
        'hpv_pojat': ('preventable-cancers', 'hpv-boys', None),
    }
    source_names = {
        'screening-colon': 'Finnish Cancer Registry — Colorectal Cancer Screening Statistics',
        'screening-breast': 'Finnish Cancer Registry — Breast Cancer Screening Statistics',
        'screening-cervical': 'Finnish Cancer Registry — Cervical Cancer Screening Statistics',
    }

    def observation_source(obs):
        source_id = next(iter(obs.get('sourceIds') or []), None)
        title = data.get('evidence', {}).get(source_id, {}).get('title')
        if title and source_id in ('sotkanet-3869', 'sotkanet-3297'):
            return f'Finnish Institute for Health and Welfare — Sotkanet — {title}'
        return source_names.get(source_id) or title

    for measure_id, (category, obs_id, national_default) in measure_observations.items():
        if measure_id not in measures:
            continue
        m = dict(measures[measure_id])
        vals = dict(m.get('values', {}))
        sources = dict(m.get('value_sources', {}))
        for r in regions_data:
            obs = get_region_obs(r, category, obs_id)
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
                sources[r['name']] = observation_source(obs)
        m['values'] = vals
        m['value_sources'] = sources
        m['period'] = '2024' if category == 'screening' else '2026'
        if national_default is not None:
            m['national'] = national_default
            if measure_id == 'kohdunkaula' or national_default != base['measures'][measure_id].get('national'):
                # This hard-coded national figure has no linked observation.
                m['national_source'] = None
        else:
            nat = get_national_obs(category, obs_id)
            if nat and nat.get('value') is not None:
                m['national'] = nat['value']
                m['national_source'] = observation_source(nat)
        measures[measure_id] = m

    out['measures'] = measures

    # 6. Mortality
    if 'mort' in out:
        mort = dict(out['mort'])
        nat_mort = get_national_obs('mortality', 'cancer-deaths')
        if nat_mort and 'series' in nat_mort:
            counts = dict(mort.get('counts', {}))
            sources = dict(mort.get('count_sources', {}))
            for pt in nat_mort['series']:
                try:
                    year = str(pt['period'])
                    counts[year] = int(pt['value'])
                    sources[year] = observation_source(nat_mort)
                except (ValueError, TypeError):
                    pass
            mort['counts'] = counts
            mort['count_sources'] = sources
        out['mort'] = mort

    return out


def get_vahti_data():
    """Retrieve the up-to-date Vahti data payload.
    Rebuilds automatically when dataset.json changes.
    """
    global _cached_mtime, _cached_payload, _cached_status

    if os.path.exists(DATASET_PATH):
        try:
            mtime = os.path.getmtime(DATASET_PATH)
            if _cached_payload is not None and mtime == _cached_mtime:
                return _cached_payload

            snapshot = load_canonical_dataset()
            if snapshot:
                base = get_base_vahti()
                payload = merge_canonical_into_vahti(snapshot, base)
                _cached_mtime = mtime
                _cached_payload = payload
                _cached_status = {
                    'ok': True,
                    'dataState': 'ready',
                    'revision': snapshot.get('revision'),
                    'importedAt': snapshot.get('importedAt'),
                    'source': 'canonical'
                }
                return _cached_payload
        except Exception as e:
            print(f"[data_adapter] Error loading canonical dataset: {e}")

    # Fallback to static data
    if _cached_payload is None:
        _cached_payload = get_base_vahti()
        _cached_status = {
            'ok': True,
            'dataState': 'serving_static_fallback',
            'revision': 'static-legacy',
            'importedAt': _cached_payload.get('generated', 'unknown'),
            'source': 'static_fallback'
        }
    return _cached_payload


def get_data_status():
    """Return status of the data connection."""
    get_vahti_data()
    return _cached_status or {'ok': True, 'dataState': 'ready'}
