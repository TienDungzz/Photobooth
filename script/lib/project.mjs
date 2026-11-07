import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../check.config.mjs';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const extension = (file) => path.extname(file).toLowerCase();
export const read = (file) => readFile(path.join(root, file), 'utf8');
export const sourcePattern = /\.(?:[cm]?[jt]sx?|css|scss|html|json|svg)$/i;

export async function listFiles(directory = '') {
  let entries;
  try {
    entries = await readdir(path.join(root, directory), { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) continue;
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!config.ignoredDirectories.includes(entry.name)) {
        files.push(...await listFiles(relative));
      }
    } else if (entry.isFile()) files.push(relative);
  }
  return files;
}

export function report(name, findings, note = '') {
  console.log(`\n${name}${note ? `: ${note}` : ''}`);
  for (const finding of findings) {
    console.log(`[${finding.level}] ${finding.file}: ${finding.message}`);
  }
  const errors = findings.filter((item) => item.level === 'error').length;
  const warnings = findings.filter((item) => item.level === 'warning').length;
  console.log(`${errors} error(s), ${warnings} warning(s)`);
  if (errors || (warnings && process.argv.includes('--strict'))) process.exitCode = 1;
}
