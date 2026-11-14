"""Validate the included screening samples without network access or file writes."""
from pathlib import Path
import csv
import math

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / '10 Hypoteesit ja löydökset/Seulontasovelluksen koepoiminta/work'

for program, expected_rows in [('rinta', 150), ('kohtu', 306)]:
    path = SAMPLES / f'{program}_helsinki_vuosi_ika.csv'
    with path.open(encoding='utf-8', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter=';'))
    assert len(rows) == expected_rows, (program, 'unexpected row count')
    year_column = next(iter(rows[0]))
    keys = [(r[year_column], r['Kutsuikä']) for r in rows]
    assert len(keys) == len(set(keys)), (program, 'duplicate year–age key')
    for row in rows:
        invited = int(row['Kutsuttu'])
        attended = int(row['Tarkastettu'])
        published = float(row['Tarkastettu kutsutuista, %'].replace(',', '.'))
        assert invited > 0 and 0 <= attended <= invited
        assert math.isclose(100 * attended / invited, published, rel_tol=0, abs_tol=1e-9)
    if program == 'rinta':
        selected = [r for r in rows if r[year_column] == '2024']
        assert sum(int(r['Kutsuttu']) for r in selected) == 38630
        assert sum(int(r['Tarkastettu']) for r in selected) == 28686
    print(f'{program}: {len(rows)} rows, unique keys and all participation rates verified')

report = (ROOT / '05 Raportti/Junction 2026 - syöpädata ja MVP.md').read_text()
assert sum(line.startswith('### Kortti ') for line in report.splitlines()) == 10
assert all(f'### Analyysi {name} ' in report for name in 'ABC')
print('Report: 10 cards and 3 analysis plans present; no files changed')
