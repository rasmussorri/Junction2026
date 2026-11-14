import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { buildData } from './build-data.js';
import { assembleDataset } from '../src/data-contract.js';
import { createSnapshot, validateSnapshot, publishSnapshot, verifySourceFiles, writeJsonAtomic, digest } from '../server/data-store.js';
import { withPipelineLock } from './source-release.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await withPipelineLock(root, async () => {
// Build and validate everything before touching published files.
const parts = buildData(root);
const data = assembleDataset(structuredClone(parts));
for (const source of Object.values(data.evidence)) source.sha256 ||= digest(readFileSync(resolve(root, source.file)));
verifySourceFiles(data, root);
const snapshot = createSnapshot(data);
if (process.argv.includes('--check')) {
  const published = validateSnapshot(JSON.parse(readFileSync(resolve(root, 'data/dataset.json'))));
  if (published.revision !== snapshot.revision) throw new Error('Published data differs from current inputs. Run npm run data:import.');
} else {
  // These exports remain for offline consumers. The API reads dataset.json only.
  for (const name of ['screening', 'mortality', 'observations']) writeJsonAtomic(resolve(root, `data/${name}.json`), parts[name]);
  publishSnapshot(snapshot, root);
}
console.log(`${process.argv.includes('--check') ? 'Validated' : 'Published'} revision ${snapshot.revision.slice(0, 12)}: ${data.regions.length} areas.`);
for (const [goal, coverage] of Object.entries(data.coverage)) console.log(`${goal}: ${coverage.measured}/${coverage.areas} with measurements; ${coverage.assessable} assessable`);
});
