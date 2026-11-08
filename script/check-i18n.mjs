import { listFiles, read, report } from './lib/project.mjs';

if (!(await listFiles('src')).includes('src/shared/i18n/locales/vi.json')) {
  report('Locale keys and placeholders', [], 'SKIP — no locale catalog');
} else {
  const base = JSON.parse(await read('src/shared/i18n/locales/vi.json'));
  const target = JSON.parse(await read('src/shared/i18n/locales/en.json'));
  const findings = [];
  for (const key of new Set([...Object.keys(base), ...Object.keys(target)])) {
    const values = [base[key], target[key]];
    if (values.some((value) => typeof value !== 'string' || !value.trim())) {
      findings.push({ level: 'error', file: key, message: 'Missing or empty translation' });
      continue;
    }
    if (values.some((value) => /\uFFFD|\p{L}\?\p{L}/u.test(value))) {
      findings.push({ level: 'error', file: key, message: 'Possible damaged Unicode: replacement character or question mark inside a word' });
    }
    const placeholders = values.map((value) =>
      [...value.matchAll(/\{\{(.*?)\}\}/g)]
        .map((match) => match[1])
        .sort()
        .join(','),
    );
    if (placeholders[0] !== placeholders[1])
      findings.push({ level: 'error', file: key, message: 'Interpolation placeholders differ' });
  }
  report('Locale keys and placeholders', findings, `${Object.keys(base).length} keys`);
}
