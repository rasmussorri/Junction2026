import { readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { digest } from '../server/data-store.js';

export async function withPipelineLock(root, action) {
  const lock = resolve(root, 'data/.pipeline.lock');
  mkdirSync(resolve(root, 'data'), { recursive: true });
  try { mkdirSync(lock); } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Another data command holds data/.pipeline.lock. If its process has stopped, remove that directory and retry.');
    throw error;
  }
  try {
    writeFileSync(resolve(lock, 'owner.json'), JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
    return await action();
  } finally { rmSync(lock, { recursive: true, force: true }); }
}

export function readRelease(root, reference) {
  if (!reference) return null;
  if (!/^[a-f0-9]{64}$/.test(reference.id) || reference.file !== `research/12 Source releases/${reference.id}/release.json`) throw new Error('Invalid source release reference');
  const raw = readFileSync(resolve(root, reference.file));
  if (digest(raw) !== reference.sha256) throw new Error('Source release checksum mismatch');
  const release = JSON.parse(raw);
  if (release.version !== 1 || release.id !== reference.id || !Array.isArray(release.requests)) throw new Error('Invalid source release manifest');
  for (const request of release.requests) {
    if (typeof request.file !== 'string' || !request.file.startsWith('research/12 Source releases/') || request.file.split('/').includes('..')) throw new Error('Invalid release file');
    if (digest(readFileSync(resolve(root, request.file))) !== request.sha256) throw new Error(`Source release file checksum mismatch: ${request.file}`);
  }
  return release;
}

export function activeRelease(root) {
  try { return JSON.parse(readFileSync(resolve(root, 'data/dataset.json'), 'utf8')).data?.sourceRelease || null; }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
