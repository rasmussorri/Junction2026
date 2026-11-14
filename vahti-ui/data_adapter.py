"""Data adapter for Vahti UI.

Connects Vahti UI to the project's canonical data layer in data/dataset.json.
Provides dynamic caching, revision tracking, and seamless fallback to static/data.json.
"""
import json
import os
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(ROOT, '..'))
DATASET_PATH = os.path.join(PROJECT_ROOT, 'data', 'dataset.json')
FALLBACK_PATH = os.path.join(ROOT, 'static', 'data.json')

_cached_mtime = None
_cached_payload = None
_cached_status = None


def get_base_vahti():
    """Load base vahti static data (used for SVG map features and goal definitions)."""
    with open(FALLBACK_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_canonical_dataset():
    """Load raw dataset.json from canonical data layer if available."""
    if not os.path.exists(DATASET_PATH):
        return None
    try:
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[data_adapter] Warning: Could not read {DATASET_PATH}: {e}")
        return None


def merge_canonical_into_vahti(canonical_snapshot, base):
    """Integrate canonical observations into the Vahti data schema."""
    out = dict(base)
    data = canonical_snapshot.get('data', {})
    revision = canonical_snapshot.get('revision', 'unknown')
    imported_at = canonical_snapshot.get('importedAt', time.strftime('%Y-%m-%dT%H:%M:%SZ'))

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

    # 1. Colorectal screening (suolisto)
    if 'suolisto' in measures:
        m = dict(measures['suolisto'])
        vals = dict(m.get('values', {}))
        for r in regions_data:
            obs = get_region_obs(r, 'screening', 'screening-colon')
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
        m['values'] = vals
        m['period'] = '2024'
        m['national'] = 73.5
        measures['suolisto'] = m

    # 2. Breast screening (rinta)
    if 'rinta' in measures:
        m = dict(measures['rinta'])
        vals = dict(m.get('values', {}))
        for r in regions_data:
            obs = get_region_obs(r, 'screening', 'screening-breast')
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
        m['values'] = vals
        m['period'] = '2024'
        m['national'] = 81.6
        measures['rinta'] = m

    # 3. Cervical screening (kohdunkaula) - Use canonical age-group screening
    if 'kohdunkaula' in measures:
        m = dict(measures['kohdunkaula'])
        vals = dict(m.get('values', {}))
        for r in regions_data:
            obs = get_region_obs(r, 'screening', 'screening-cervical')
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
        m['values'] = vals
        m['period'] = '2024'
        m['national'] = 76.3
        m['source'] = 'Finnish Cancer Registry, 2024 age-group screening'
        measures['kohdunkaula'] = m

    # 4. HPV vaccination girls (hpv_tytot)
    if 'hpv_tytot' in measures:
        m = dict(measures['hpv_tytot'])
        vals = dict(m.get('values', {}))
        for r in regions_data:
            obs = get_region_obs(r, 'preventable-cancers', 'hpv-girls')
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
        m['values'] = vals
        m['period'] = '2026'
        nat = get_national_obs('preventable-cancers', 'hpv-girls')
        if nat and nat.get('value') is not None:
            m['national'] = nat['value']
        measures['hpv_tytot'] = m

    # 5. HPV vaccination boys (hpv_pojat)
    if 'hpv_pojat' in measures:
        m = dict(measures['hpv_pojat'])
        vals = dict(m.get('values', {}))
        for r in regions_data:
            obs = get_region_obs(r, 'preventable-cancers', 'hpv-boys')
            if obs and obs.get('value') is not None:
                vals[r['name']] = obs['value']
        m['values'] = vals
        m['period'] = '2026'
        nat = get_national_obs('preventable-cancers', 'hpv-boys')
        if nat and nat.get('value') is not None:
            m['national'] = nat['value']
        measures['hpv_pojat'] = m

    out['measures'] = measures

    # 6. Mortality
    if 'mort' in out:
        mort = dict(out['mort'])
        nat_mort = get_national_obs('mortality', 'cancer-deaths')
        if nat_mort and 'series' in nat_mort:
            counts = dict(mort.get('counts', {}))
            for pt in nat_mort['series']:
                try:
                    counts[str(pt['period'])] = int(pt['value'])
                except (ValueError, TypeError):
                    pass
            mort['counts'] = counts
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
