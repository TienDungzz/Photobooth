import type { Frame, Layout, Slot } from '../../domain/types';

export const expressiveFrames: Frame[] = [
  {
    id: 'atelier-afterhours',
    name: { vi: 'Sau giờ lên đèn', en: 'After hours' },
    collection: 'celestial',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#171327',
    ink: '#f4f1ff',
    accent: '#64e9e2',
    stamp: 'KEEP THE NIGHT / KEEP THE FEELING',
    artwork: {
      theme: 'afterhours',
      atlas: '/artwork/afterhours-atlas.webp',
      title: 'AFTER HOURS',
      subtitle: 'GOOD COMPANY / LOUD MEMORIES',
    },
  },
  {
    id: 'atelier-playdate',
    name: { vi: 'Một ngày tinh nghịch', en: 'Picnic playdate' },
    collection: 'celebration',
    color: 'green',
    pattern: 'plain',
    style: 'pastel',
    background: '#fff9df',
    ink: '#654535',
    accent: '#7bbb88',
    stamp: 'Little joys, all mixed together',
    artwork: {
      theme: 'playdate',
      atlas: '/artwork/playdate-atlas.webp',
      title: 'PLAY DATE!',
      subtitle: 'A LITTLE BIT OF HAPPY / EVERY DAY',
    },
  },
  {
    id: 'atelier-zine',
    name: { vi: 'Ngoài khuôn khổ', en: 'Off the record' },
    collection: 'retro',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#eee8d9',
    ink: '#242323',
    accent: '#ba343d',
    stamp: 'RAW MOMENTS / NO PERFECT TAKES',
    artwork: {
      theme: 'zine',
      atlas: '/artwork/zine-atlas.webp',
      title: 'OFF THE RECORD',
      subtitle: 'AN INDEPENDENT MEMORY ZINE / VOL. 01',
    },
  },
];

type Box = [
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  mask: Slot['mask'],
  treatment?: Slot['treatment'],
];
function design(
  id: string,
  vi: string,
  en: string,
  width: number,
  height: number,
  boxes: Box[],
): Layout {
  return {
    id,
    name: { vi, en },
    width,
    height,
    category: 'scrapbook',
    slots: boxes.map(([x, y, w, h, rotation, mask, treatment], i) => ({
      id: `slot-${i}`,
      x: x / width,
      y: y / height,
      width: w / width,
      height: h / height,
      rotation,
      mask,
      ...(treatment ? { treatment } : {}),
    })),
  };
}

// Individually authored arrangements; never expand these into mask × count variants.
export const expressiveLayouts: Layout[] = [
  design('liquid-duet', 'Hai miền ngẫu hứng', 'Liquid duet', 1400, 2400, [
    [190, 340, 1020, 750, -4, 'blob'],
    [160, 1210, 1060, 770, 4, 'blob'],
  ]),
  design('cutout-trio', 'Ba mảnh tự do', 'Cutout trio', 1200, 2400, [
    [140, 340, 920, 500, -4, 'cutout'],
    [140, 920, 920, 500, 4, 'cutout'],
    [140, 1500, 920, 500, -3, 'cutout'],
  ]),
  design('browser-trio', 'Ba cửa sổ ký ức', 'Memory windows.exe', 1200, 2400, [
    [120, 350, 960, 470, 0, 'rect', 'browser'],
    [120, 940, 960, 470, 0, 'rect', 'browser'],
    [120, 1530, 960, 470, 0, 'rect', 'browser'],
  ]),
  design('mixed-playdate', 'Nhật ký trái cây', 'Fruit journal', 1200, 2400, [
    [170, 330, 860, 450, 0, 'blob'],
    [190, 900, 820, 440, -6, 'rect', 'polaroid'],
    [260, 1450, 680, 570, 3, 'apple'],
  ]),
  design('ripped-editorial', 'Ba trang xé tay', 'Torn editorial', 2200, 1800, [
    [150, 350, 1080, 1100, -4, 'torn'],
    [1400, 350, 640, 480, 6, 'torn'],
    [1370, 970, 640, 480, -5, 'torn'],
  ]),
  design('polaroid-pile', 'Chồng ảnh cuối tuần', 'Weekend photo pile', 2200, 2200, [
    [150, 350, 1000, 680, -9, 'rect', 'polaroid'],
    [1100, 420, 940, 700, 7, 'rect', 'polaroid'],
    [180, 1130, 940, 680, -6, 'rect', 'polaroid'],
    [1080, 1210, 950, 620, 9, 'rect', 'polaroid'],
  ]),
];
