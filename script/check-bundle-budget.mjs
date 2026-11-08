import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { listFiles, report, root } from './lib/project.mjs';

const files = await listFiles('dist');
if (!files.includes('dist/index.html'))
  throw new Error('Run npm run build before checking bundle budget.');
const findings = [];
// Conservative: totals include lazy chunks, not only initial-route files.
for (const [extension, limit] of [
  ['.js', 250 * 1024],
  ['.css', 50 * 1024],
]) {
  let total = 0;
  for (const file of files.filter((file) => file.endsWith(extension)))
    total += gzipSync(await readFile(path.join(root, file))).length;
  console.log(`${extension}: ${total} gzip bytes / ${limit}`);
  if (total > limit)
    findings.push({ level: 'error', file: 'dist', message: `${extension} exceeds gzip budget` });
}
report('Production bundle budget', findings, 'Includes all chunks');
