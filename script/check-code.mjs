import { listFiles, read, report } from './lib/project.mjs';

const files = (await listFiles('src')).filter((file) => /\.(?:[cm]?[jt]sx?|css|scss)$/.test(file));
const findings = [];
const bem = /^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?|u-[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;

for (const file of files) {
  const text = await read(file);
  const add = (level, message) => findings.push({ level, file, message });
  if (text.includes('\ufffd')) add('error', 'Có ký tự Unicode thay thế; kiểm tra encoding UTF-8.');
  if (/^\t/m.test(text)) add('error', 'Dùng spaces thay cho tab ở đầu dòng.');
  if (!text.endsWith('\n')) add('error', 'Thiếu newline cuối file.');
  if (/\.(?:css|scss)$/.test(file)) {
    const css = text.replace(/\/\*[\s\S]*?\*\//g, '');
    if (/!important\b/i.test(css)) add('error', 'Không dùng !important.');
    // Chỉ đọc phần selector trước {, không quét dấu chấm trong URL/declaration.
    for (const match of css.matchAll(/(?:^|[{}])([^{}]+)\{/g)) {
      const selector = match[1].trim();
      if (selector.startsWith('@')) continue;
      for (const token of selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
        if (!bem.test(token[1])) add('error', `Class không đúng BEM: .${token[1]}`);
      }
      if (/#[a-zA-Z_][\w-]*/.test(selector)) add('error', 'Không dùng ID selector trong CSS.');
    }
  } else {
    if (/\bvar\s+[a-zA-Z_$]/.test(text)) add('warning', 'Có thể đang dùng var; rà soát và đổi sang const/let.');
    if (/\bany\b/.test(text) && /\.tsx?$/.test(file)) add('warning', 'Có token any; kiểm tra type hoặc comment liên quan.');
    if (/eslint-disable|@ts-ignore|@ts-nocheck/.test(text)) add('warning', 'Có bỏ qua kiểm tra; cần lý do và phạm vi cụ thể.');
  }
}
report('Code conventions', findings, files.length ? `${files.length} files` : 'SKIP — chưa có source trong src/');
