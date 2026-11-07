import path from 'node:path';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import config from './check.config.mjs';
import { extension, listFiles, read, report, root, sourcePattern } from './lib/project.mjs';

const allFiles = await listFiles();
const assets = allFiles.filter((file) => config.assetRoots.some((base) => file.startsWith(`${base}/`))
  && config.assetExtensions.includes(extension(file)));
const references = allFiles.filter((file) => (file.startsWith('src/') || file.startsWith('public/') || file === 'index.html')
  && sourcePattern.test(file));
const assetSet = new Set(assets);
const findings = [];
const exceptions = new Set();
for (const item of config.assetExceptions) {
  if (!item.path || !item.reason?.trim() || !assetSet.has(item.path)) {
    findings.push({ level: 'error', file: 'script/check.config.mjs', message: `Ngoại lệ thiếu lý do hoặc file không tồn tại: ${item.path}` });
  } else exceptions.add(item.path);
}

const used = new Set();
for (const file of references) {
  const text = await read(file);
  // Hỗ trợ chuỗi literal trong import, URL CSS, HTML và catalog.
  for (const match of text.matchAll(/["'`(]([^"'`()\s<>]+)["'`)]/g)) {
    let value = match[1].split(/[?#]/)[0];
    if (/^(?:data:|https?:|blob:|\/\/)/i.test(value) || value.includes('${')) continue;
    try { value = decodeURIComponent(value); } catch { continue; }
    const candidates = value.startsWith('@/') ? [`src/${value.slice(2)}`]
      : value.startsWith('/') ? [`public${value}`]
        : [path.posix.normalize(path.posix.join(path.posix.dirname(file), value)), value];
    for (const candidate of candidates) if (assetSet.has(candidate)) used.add(candidate);
  }
}

const hashes = new Map();
for (const file of assets) {
  if (!used.has(file) && !exceptions.has(file)) {
    findings.push({ level: 'warning', file, message: 'Không tìm thấy tham chiếu tĩnh; kiểm tra trước khi xóa hoặc khai báo ngoại lệ có lý do.' });
  }
  const hash = createHash('sha256').update(await readFile(path.join(root, file))).digest('hex');
  const first = hashes.get(hash);
  if (first) findings.push({ level: 'warning', file, message: `Nội dung trùng byte với ${first}; cân nhắc dùng chung asset.` });
  else hashes.set(hash, file);
}
report('Unused/duplicate assets', findings, assets.length ? `${assets.length} assets` : 'SKIP — chưa có tài nguyên');
