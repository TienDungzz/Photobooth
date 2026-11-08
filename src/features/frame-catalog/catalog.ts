import { artFrames, artLayouts } from './art-frames';
import { expressiveFrames, expressiveLayouts } from './expressive-catalog';
import { occasionFrames, occasionLayouts } from './occasion-catalog';
import { signatureFrames, signatureLayouts } from './signature-catalog';
import { graphicFrames, graphicLayouts } from './graphic-catalog';
import { craftFrames, craftLayouts } from './craft-catalog';
import { referenceFrames, referenceLayouts } from './reference-catalog';
import { inspiredFrames, inspiredLayouts } from './inspired-catalog';
import { ornamentFrames, ornamentLayouts } from './ornament-catalog';
import { extraFrames } from './extra-frames';
import { expandLayouts } from './extra-layouts';
import type { Design, Frame, Layout, Slot } from '../../domain/types';

const slot = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
  mask: Slot['mask'] = 'rect',
): Slot => ({ id: '', x, y, width, height, rotation, mask });
const layout = (
  id: string,
  vi: string,
  en: string,
  category: Layout['category'],
  width: number,
  height: number,
  slots: Slot[],
): Layout => ({
  id,
  name: { vi, en },
  category,
  width,
  height,
  slots: slots.map((item, index) => ({ ...item, id: `slot-${index}` })),
});
function grid(columns: number, rows: number, gap = 0.025): Slot[] {
  const width = (0.88 - gap * (columns - 1)) / columns;
  const height = (0.8 - gap * (rows - 1)) / rows;
  return Array.from({ length: columns * rows }, (_, index) =>
    slot(
      0.06 + (index % columns) * (width + gap),
      0.05 + Math.floor(index / columns) * (height + gap),
      width,
      height,
    ),
  );
}

const baseLayouts: Layout[] = [
  layout('portrait', 'Chân dung', 'Portrait', 'single', 1800, 2400, [
    slot(0.07, 0.055, 0.86, 0.79),
  ]),
  layout('square', 'Một khoảnh khắc', 'One moment', 'single', 2400, 2400, [
    slot(0.07, 0.06, 0.86, 0.78),
  ]),
  layout('postcard', 'Tấm bưu thiếp', 'Postcard', 'single', 2400, 1600, [
    slot(0.05, 0.07, 0.9, 0.74),
  ]),
  layout('polaroid', 'Dear memories', 'Dear memories', 'single', 2000, 2400, [
    slot(0.08, 0.065, 0.84, 0.7),
  ]),
  layout('oval', 'Khung cửa nhỏ', 'Little window', 'single', 1800, 2400, [
    slot(0.1, 0.06, 0.8, 0.77, 0, 'ellipse'),
  ]),
  layout('strip-two', 'Chuyện của đôi mình', 'Better together', 'strip', 1200, 2400, grid(1, 2)),
  layout(
    'strip-three',
    'Ba nhịp yêu thương',
    'Three little moments',
    'strip',
    1000,
    2400,
    grid(1, 3),
  ),
  layout('strip-four', 'Classic photostrip', 'Classic photostrip', 'strip', 900, 2400, grid(1, 4)),
  layout('horizontal-two', 'Song hành', 'Side by side', 'strip', 2400, 1400, grid(2, 1)),
  layout('horizontal-three', 'Một ngày đẹp trời', 'A lovely day', 'strip', 2400, 1100, grid(3, 1)),
  layout('grid-four', 'Bốn mùa bên nhau', 'Four seasons', 'grid', 2000, 2400, grid(2, 2)),
  layout('grid-six-portrait', 'Nhật ký sáu tấm', 'Six keepsakes', 'grid', 1800, 2400, grid(2, 3)),
  layout('grid-six-wide', 'Những người bạn', 'Our kind of people', 'grid', 2400, 1800, grid(3, 2)),
  layout('grid-nine', 'Chín mảnh ký ức', 'Nine memories', 'grid', 2400, 2400, grid(3, 3)),
  layout('hero-left', 'Trang nhật ký', 'Journal page', 'editorial', 2400, 2000, [
    slot(0.05, 0.06, 0.55, 0.78),
    slot(0.63, 0.06, 0.32, 0.375),
    slot(0.63, 0.465, 0.32, 0.375),
  ]),
  layout('hero-top', 'Ngày đáng nhớ', 'A day to remember', 'editorial', 1800, 2400, [
    slot(0.06, 0.05, 0.88, 0.47),
    slot(0.06, 0.55, 0.425, 0.3),
    slot(0.515, 0.55, 0.425, 0.3),
  ]),
  layout('offset', 'Một chút ngẫu hứng', 'Off the record', 'editorial', 2000, 2400, [
    slot(0.07, 0.06, 0.58, 0.38),
    slot(0.35, 0.48, 0.58, 0.36),
  ]),
  layout('triptych', 'Chuyện kể ba phần', 'A little story', 'editorial', 2400, 2000, [
    slot(0.06, 0.08, 0.26, 0.65),
    slot(0.37, 0.16, 0.26, 0.65),
    slot(0.68, 0.08, 0.26, 0.65),
  ]),
  layout('scrapbook', 'Gom nhặt niềm vui', 'Collected joy', 'scrapbook', 2000, 2400, [
    slot(0.09, 0.07, 0.72, 0.36, -7),
    slot(0.22, 0.48, 0.68, 0.34, 6),
  ]),
  layout('scrapbook-three', 'Gửi những ngày xanh', 'The good old days', 'scrapbook', 2400, 2400, [
    slot(0.06, 0.07, 0.54, 0.43, -5),
    slot(0.52, 0.15, 0.4, 0.37, 8),
    slot(0.2, 0.55, 0.62, 0.3, -3, 'rounded'),
  ]),
];

baseLayouts.push(
  layout('hero-four', 'Một lớn, ba nhỏ', 'One large, three small', 'editorial', 1800, 2400, [
    slot(0.06, 0.05, 0.88, 0.47),
    slot(0.06, 0.55, 0.28, 0.3),
    slot(0.36, 0.55, 0.28, 0.3),
    slot(0.66, 0.55, 0.28, 0.3),
  ]),
  layout('grid-eight', 'Tám ảnh', 'Eight photos', 'grid', 1800, 2400, grid(2, 4)),
  layout('grid-ten', 'Mười ảnh', 'Ten photos', 'grid', 1800, 2400, grid(2, 5)),
  layout('grid-twelve', 'Mười hai ảnh', 'Twelve photos', 'grid', 1800, 2400, grid(3, 4)),
  layout('grid-sixteen', 'Mười sáu ảnh', 'Sixteen photos', 'grid', 1800, 2400, grid(4, 4)),
  layout('grid-twenty', 'Hai mươi ảnh', 'Twenty photos', 'grid', 1800, 2400, grid(4, 5)),
);

export const layouts = [
  ...expandLayouts(baseLayouts),
  ...artLayouts,
  ...expressiveLayouts,
  ...occasionLayouts,
  ...signatureLayouts,
  ...graphicLayouts,
  ...craftLayouts,
  ...referenceLayouts,
  ...inspiredLayouts,
  ...ornamentLayouts,
];
const baseFrames: Frame[] = [
  {
    id: 'love-letter-garden',
    collection: 'botanical',
    color: 'cream',
    name: { vi: 'Vườn thư tình', en: 'Love letter garden' },
    pattern: 'garden',
    style: 'minimal',
    background: '#fff9e8',
    ink: '#756648',
    accent: '#a0ac72',
    stamp: 'Love grows in little moments',
  },
  {
    id: 'ribbons-lace',
    collection: 'romance',
    color: 'pink',
    name: { vi: 'Ruy băng & ren', en: 'Ribbons & lace' },
    pattern: 'lace',
    style: 'pastel',
    background: '#fce7ee',
    ink: '#a76880',
    accent: '#d79aad',
    stamp: 'Tied together with love',
  },
  {
    id: 'love-scrapbook',
    collection: 'retro',
    color: 'cream',
    name: { vi: 'Sổ lưu niệm', en: 'Love scrapbook' },
    pattern: 'scrapbook',
    style: 'minimal',
    background: '#f1e3ca',
    ink: '#816349',
    accent: '#bb9670',
    stamp: 'Our lovely little story',
  },
  {
    id: 'starlight',
    collection: 'celestial',
    color: 'purple',
    name: { vi: 'Dưới trời sao', en: 'Starlight wishes' },
    pattern: 'stars',
    style: 'pastel',
    background: '#eae5f5',
    ink: '#665780',
    accent: '#a393bc',
    stamp: 'Written in the stars',
  },
  {
    id: 'classic-film',
    collection: 'retro',
    color: 'dark',
    name: { vi: 'Cuộn phim cũ', en: 'Classic film' },
    pattern: 'film',
    style: 'film',
    background: '#292c29',
    ink: '#f2e6ca',
    accent: '#e4b76e',
    stamp: 'GOOD TIMES · KEEP FOREVER',
  },
  {
    id: 'simple-paper',
    collection: 'minimal',
    color: 'cream',
    name: { vi: 'Trang giấy trắng', en: 'Simple paper' },
    pattern: 'plain',
    style: 'minimal',
    background: '#fffdf8',
    ink: '#343a36',
    accent: '#a9bfb0',
    stamp: 'Little moments, lovely memories',
  },
];
export const frames: Frame[] = [
  ...artFrames,
  ...expressiveFrames,
  ...occasionFrames,
  ...signatureFrames,
  ...graphicFrames,
  ...craftFrames,
  ...referenceFrames,
  ...inspiredFrames,
  ...ornamentFrames,
  ...baseFrames,
  ...extraFrames,
];
export function composeDesign(frame: Frame, layout: Layout): Design {
  return { ...frame, layout };
}
export function validateCatalog(): string[] {
  const errors: string[] = [];
  if (new Set(frames.map((frame) => frame.id)).size !== frames.length)
    errors.push('Duplicate frame IDs');
  if (new Set(layouts.map((layout) => layout.id)).size !== layouts.length)
    errors.push('Duplicate layout IDs');
  for (const item of layouts) {
    if (item.slots.length < 1 || item.slots.length > 20) errors.push(item.id);
    if (item.width <= 0 || item.height <= 0 || Math.max(item.width, item.height) > 2400)
      errors.push(item.id);
    for (const box of item.slots)
      if (
        ![box.x, box.y, box.width, box.height, box.rotation].every(Number.isFinite) ||
        box.width <= 0 ||
        box.height <= 0
      )
        errors.push(item.id + '/' + box.id);
  }
  return errors;
}
