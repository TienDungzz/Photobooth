import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/artwork', { recursive: true });
for (const name of [
  'coquette',
  'chrome',
  'memo',
  'ballet',
  'herbarium',
  'seaside',
  'cherry',
  'afterhours',
  'playdate',
  'zine',
  'nocturne',
  'halloween',
  'vow',
]) {
  const source = 'artwork-source/' + name + '-atlas.png';
  await sharp(source)
    .webp({ quality: 82, alphaQuality: 95 })
    .toFile('public/artwork/' + name + '-atlas.webp');
  await sharp(source)
    .resize(480, 320)
    .webp({ quality: 75, alphaQuality: 90 })
    .toFile('public/artwork/' + name + '-thumb.webp');
}
