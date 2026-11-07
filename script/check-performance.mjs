import path from 'node:path';
import { stat } from 'node:fs/promises';
import config from './check.config.mjs';
import { extension, listFiles, read, report, root } from './lib/project.mjs';

const files = (await listFiles()).filter((file) => file.startsWith('src/') || file.startsWith('public/'));
const findings = [];
for (const file of files) {
  const add = (level, message) => findings.push({ level, file, message });
  if (config.assetExtensions.includes(extension(file))) {
    const { size } = await stat(path.join(root, file));
    if (size > config.limits.assetErrorBytes) add('error', `Asset quá ngưỡng ${config.limits.assetErrorBytes} bytes: ${size} bytes.`);
    else if (size > config.limits.assetWarningBytes) add('warning', `Asset lớn: ${size} bytes; kiểm tra nén và tải theo nhu cầu.`);
  }
  if (!/\.(?:[cm]?[jt]sx?|css|scss|html|json)$/.test(file)) continue;
  const text = await read(file);
  const lines = text.split('\n').length;
  if (file.startsWith('src/') && lines > config.limits.sourceWarningLines) add('warning', `Module dài ${lines} dòng; rà soát trách nhiệm, không tách máy móc.`);
  for (const match of text.matchAll(/data:[^\s"'`)]*;base64,[a-zA-Z0-9+/=]+/g)) {
    if (match[0].length > config.limits.inlineDataWarningCharacters) add('warning', 'Base64 nhúng lớn; cân nhắc asset riêng hoặc Blob URL.');
  }
  if (/\.(?:[cm]?[jt]sx?)$/.test(file)) {
    if (/\.toDataURL\s*\(/.test(text)) add('warning', 'toDataURL tạo chuỗi ảnh trong bộ nhớ; cân nhắc toBlob.');
    if (/\b(?:setInterval|setTimeout)\s*\(/.test(text)) add('warning', 'Có timer; xác minh cleanup, callback cũ và hành vi tab ẩn.');
    if (/\.createObjectURL\s*\(/.test(text)) add('warning', 'Có object URL; xác minh chủ sở hữu gọi revokeObjectURL khi không dùng.');
    if (/\.getUserMedia\s*\(/.test(text)) add('warning', 'Có camera stream; xác minh track.stop khi đóng/đổi camera.');
  }
}
report('Performance signals', findings, files.length ? `${files.length} files; heuristic review only` : 'SKIP — chưa có source/tài nguyên');
