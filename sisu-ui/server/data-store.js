import { readFileSync, writeFileSync, renameSync, mkdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { validateDataset } from '../src/data-contract.js';

export const digest = value => createHash('sha256').update(value).digest('hex');
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export function createSnapshot(data, importedAt = new Date().toISOString()) {
  validateDataset(data);
  return { snapshotVersion: 1, revision: digest(JSON.stringify(data)), importedAt, data };
}
export function validateSnapshot(snapshot) {
  if (snapshot?.snapshotVersion !== 1 || !Number.isFinite(Date.parse(snapshot.importedAt))) throw new Error('Unsupported or incomplete snapshot');
  validateDataset(snapshot.data);
  if (digest(JSON.stringify(snapshot.data)) !== snapshot.revision) throw new Error('Snapshot checksum mismatch');
  return snapshot;
}
export function verifySourceFiles(data, root) {
  for (const [id, source] of Object.entries(data.evidence)) {
    const path = resolve(root, source.file);
    if (!path.startsWith(resolve(root, 'research') + '/')) throw new Error(`Source outside research directory: ${id}`);
    const raw = readFileSync(path);
    if (source.sha256 && digest(raw) !== source.sha256) throw new Error(`Source checksum mismatch: ${id}`);
  }
}
function historyPath(root, revision) {
  if (!/^[a-f0-9]{64}$/.test(revision)) throw new Error('A full 64-character revision is required');
  return resolve(root, 'data/history', revision);
}
export function readSnapshotEvidence(snapshot, id, root) {
  const source = Object.hasOwn(snapshot.data.evidence, id) && snapshot.data.evidence[id];
  if (!source) throw new Error(`Unknown evidence source: ${id}`);
  if (!source.file.startsWith('research/') || source.file.split('/').includes('..')) throw new Error('Invalid evidence path');
  for (const path of [resolve(root, source.file), resolve(historyPath(root, snapshot.revision), 'evidence', source.file)]) {
    try {
      const raw = readFileSync(path);
      if (source.sha256 && digest(raw) === source.sha256) return raw;
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  throw new Error(`Missing or changed evidence: ${id}`);
}
export function publishedHistory(root) {
  const path = resolve(root, 'data/history/published.json');
  if (!existsSync(path)) return [];
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(rows) || rows.some(row => !/^[a-f0-9]{64}$/.test(row.revision) || !Number.isFinite(Date.parse(row.publishedAt)))) throw new Error('Invalid publication history');
  return rows;
}
export function archivedSnapshot(root, revision) {
  const snapshot = validateSnapshot(JSON.parse(readFileSync(resolve(historyPath(root, revision), 'snapshot.json'), 'utf8')));
  if (snapshot.revision !== revision) throw new Error('Archive revision mismatch');
  for (const [id, source] of Object.entries(snapshot.data.evidence)) {
    const raw = readFileSync(resolve(historyPath(root, revision), 'evidence', source.file));
    if (digest(raw) !== source.sha256) throw new Error(`Archive evidence checksum mismatch: ${id}`);
  }
  return snapshot;
}
function archiveSnapshot(snapshot, root) {
  const dir = historyPath(root, snapshot.revision);
  if (existsSync(resolve(dir, 'snapshot.json'))) { archivedSnapshot(root, snapshot.revision); return; }
  // Source bytes are copied before marking an archive complete. They survive
  // later source edits and are never exposed through a general static route.
  for (const [id, source] of Object.entries(snapshot.data.evidence)) {
    const raw = readSnapshotEvidence(snapshot, id, root);
    const path = resolve(dir, 'evidence', source.file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, raw);
  }
  writeJsonAtomic(resolve(dir, 'snapshot.json'), snapshot);
}
export function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
    renameSync(temporary, path);
  } finally {
    try { unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
export function publishSnapshot(snapshot, root) {
  validateSnapshot(snapshot);
  for (const id of Object.keys(snapshot.data.evidence)) readSnapshotEvidence(snapshot, id, root);
  // Preserve the previous revision too, including the first pre-archive import.
  const activePath = resolve(root, 'data/dataset.json');
  let previous;
  try { previous = validateSnapshot(JSON.parse(readFileSync(activePath, 'utf8'))); }
  catch (error) { if (error.code !== 'ENOENT' && !existsSync(resolve(root, 'data/history/published.json'))) throw error; }
  if (previous) archiveSnapshot(previous, root);
  archiveSnapshot(snapshot, root);
  const history = publishedHistory(root);
  if (previous && !history.some(row => row.revision === previous.revision)) history.unshift({ revision: previous.revision, publishedAt: previous.importedAt });
  writeJsonAtomic(resolve(root, 'data/dataset.json'), snapshot);
  writeJsonAtomic(resolve(root, 'data/history/published.json'), [{ revision: snapshot.revision, publishedAt: new Date().toISOString() }, ...history.filter(row => row.revision !== snapshot.revision)]);
}
export function rollbackSnapshot(root, revision) {
  if (!publishedHistory(root).some(row => row.revision === revision)) throw new Error('Revision was not previously published');
  const snapshot = archivedSnapshot(root, revision);
  publishSnapshot(snapshot, root);
  return snapshot;
}

// Read one coherent revision per request. A failed replacement never evicts the
// last valid snapshot. A new valid replacement is picked up without a restart.
export function createDataStore(path, { root = resolve(dirname(path), '..') } = {}) {
  let current, signature, error = null;
  function read() {
    try {
      const stat = statSync(path);
      const next = `${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
      if (next !== signature) {
        signature = next;
        const candidate = validateSnapshot(JSON.parse(readFileSync(path, 'utf8')));
        current = freeze(candidate);
        error = null;
      }
    } catch (failure) {
      error = failure.message;
      if (!current) {
        try {
          for (const row of publishedHistory(root)) {
            try { current = freeze(archivedSnapshot(root, row.revision)); break; } catch { /* Try the previous published archive. */ }
          }
        } catch { /* Preserve the active-file error if the archive index is damaged. */ }
      }
      if (!current) throw new Error(`No valid dataset available. Run npm run data:import. ${error}`);
    }
    return current;
  }
  // Fail startup loudly rather than serving an empty dashboard.
  read();
  return {
    read,
    capture() {
      const snapshot = read();
      return { snapshot, state: error ? 'serving_previous_snapshot' : 'ready', error };
    },
    status() {
      const snapshot = read();
      return { state: error ? 'serving_previous_snapshot' : 'ready', revision: snapshot.revision, importedAt: snapshot.importedAt, error, coverage: snapshot.data.coverage };
    },
  };
}
