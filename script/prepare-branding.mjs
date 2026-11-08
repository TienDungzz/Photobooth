import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Header logo and small-size favicon have separate editable SVG sources.
const logo = await readFile(new URL('../public/brand/logo.svg', import.meta.url), 'utf8');
const favicon = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
await sharp(Buffer.from(logo)).resize(512, 512).png().toFile(fileURLToPath(new URL('../public/brand/logo.png', import.meta.url)));
await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile(fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url)));
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => sharp(Buffer.from(favicon)).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + images.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(images.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index]; directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4); directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8); directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([directory, ...images]));
console.log('Prepared transparent logo PNG, SVG favicon, 16/32/48 ICO and 180px touch icon.');
