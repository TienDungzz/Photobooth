import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let failed = false;
for (const name of ['check-code.mjs', 'check-unused-assets.mjs', 'check-performance.mjs']) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(name, import.meta.url)), ...process.argv.slice(2)], { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) failed = true;
}
process.exitCode = failed ? 1 : 0;
