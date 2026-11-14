"""Kokoaa ja synkronoi Vahti UI:n datan projektin kanonisesta tietokerroksesta.

Käyttö:
    python3 build_data.py
"""
import json
import os
import sys

from data_adapter import get_vahti_data, FALLBACK_PATH, ROOT

def main():
    print("Synkronoidaan Vahti UI:n data kanonisesta aineistosta...")
    data = get_vahti_data()
    snapshot = data.get('snapshot', {})
    
    # Kirjoitetaan staattinen varmuuskopio data.json
    with open(FALLBACK_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Staattinen data.json päivitetty: {FALLBACK_PATH}")
    
    # Päivitetään myös Vercel public/data.json jos public-kansio on olemassa
    public_path = os.path.abspath(os.path.join(ROOT, '..', 'public', 'data.json'))
    if os.path.exists(os.path.dirname(public_path)):
        with open(public_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Public data.json päivitetty: {public_path}")
    print(f"Revisio: {snapshot.get('revision')}")
    print(f"Tuontiaika: {snapshot.get('importedAt')}")
    print(f"Alueita: {len(data.get('regions', []))}, mittareita: {len(data.get('measures', {}))}")

if __name__ == '__main__':
    main()
