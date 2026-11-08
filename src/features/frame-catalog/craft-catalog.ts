import type { Frame, Layout, Slot } from '../../domain/types';

export const craftFrames: Frame[] = [
  {
    id: 'craft-receipt',
    name: { vi: 'Hóa đơn ngày vui', en: 'Joy receipt' },
    collection: 'minimal',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#f7f3e8',
    ink: '#34372f',
    accent: '#747b64',
    stamp: 'Paid in laughter. Kept forever.',
    artwork: {
      theme: 'receipt',
      title: 'THE LITTLE JOY STORE',
      subtitle: 'YOUR DAY, ITEM BY ITEM',
    },
  },
  {
    id: 'craft-quilt',
    name: { vi: 'Chăn chắp những ngày êm', en: 'Days stitched together' },
    collection: 'romance',
    color: 'green',
    pattern: 'plain',
    style: 'pastel',
    background: '#eee5d2',
    ink: '#4d6457',
    accent: '#bb775b',
    stamp: 'A little piece of every good day',
    artwork: { theme: 'quilt', title: 'stitched together', subtitle: 'PIECES OF OUR EVERYDAY' },
  },
  {
    id: 'craft-orbit',
    name: { vi: 'Quỹ đạo của chúng mình', en: 'Our little orbit' },
    collection: 'celestial',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#101e2c',
    ink: '#e7d7ad',
    accent: '#7da8aa',
    stamp: 'Different worlds. The same orbit.',
    artwork: {
      theme: 'orbit',
      title: 'OUR LITTLE ORBIT',
      subtitle: 'A MAP OF MOMENTS THAT BROUGHT US HERE',
    },
  },
];

type Box = [number, number, number, number, Slot['mask'], number?];
function make(
  id: string,
  vi: string,
  en: string,
  width: number,
  height: number,
  boxes: Box[],
): Layout {
  const scale = Math.min(1, 2400 / Math.max(width, height));
  return {
    id,
    name: { vi, en },
    category: 'editorial',
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    slots: boxes.map(([x, y, w, h, mask, rotation = 0], i) => ({
      id: `slot-${i}`,
      x: x / width,
      y: y / height,
      width: w / width,
      height: h / height,
      rotation,
      mask,
    })),
  };
}
export const craftLayouts: Layout[] = [
  make('receipt-moments', 'Hóa đơn năm khoảnh khắc', 'Five little purchases', 1400, 2800, [
    [150, 430, 1100, 650, 'rect'],
    [150, 1210, 470, 420, 'rect'],
    [780, 1210, 470, 420, 'rect'],
    [150, 1760, 670, 510, 'rect'],
    [950, 1830, 300, 370, 'rect'],
  ]),
  make('quilt-pieces', 'Năm mảnh chăn chắp', 'Five quilt pieces', 2200, 2000, [
    [190, 400, 650, 790, 'rect'],
    [950, 400, 1060, 340, 'rect'],
    [950, 850, 470, 670, 'rect'],
    [1530, 850, 480, 670, 'rect'],
    [190, 1300, 650, 350, 'rect'],
  ]),
  make('orbital-trio', 'Ba hành tinh kỷ niệm', 'Three memory planets', 2200, 2200, [
    [300, 420, 1020, 1020, 'ellipse'],
    [1480, 570, 440, 440, 'ellipse'],
    [1280, 1360, 650, 650, 'ellipse'],
  ]),
  make('receipt-counter', 'Ảnh chính và biên nhận', 'Photo and receipt stub', 2400, 1800, [
    [210, 360, 1260, 1080, 'rect'],
    [1680, 550, 480, 620, 'rect'],
  ]),
];
