import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedHistory, rollbackSnapshot } from '../server/data-store.js';
import { withPipelineLock } from './source-release.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (!args.length) {
  const history = publishedHistory(root);
  if (!history.length) console.log('No archived publications yet. Run npm run data:import.');
  for (const row of history) console.log(`${row.revision}  ${row.publishedAt}`);
} else if (args.length === 2 && args[0] === '--rollback') {
  const snapshot = await withPipelineLock(root, () => rollbackSnapshot(root, args[1]));
  console.log(`Restored ${snapshot.revision}. Its original source release will be replayed by data:import.`);
} else throw new Error('Usage: npm run data:history, or npm run data:rollback -- FULL_REVISION');
