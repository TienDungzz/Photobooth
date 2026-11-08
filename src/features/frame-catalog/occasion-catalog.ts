import type { Frame, Layout, Slot } from '../../domain/types';

export const occasionFrames: Frame[] = [
  {
    id: 'atelier-nocturne',
    name: { vi: 'Dạ khúc cánh bướm', en: 'Butterfly nocturne' },
    collection: 'celestial',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#171728',
    ink: '#ede0ef',
    accent: '#c8adcf',
    stamp: 'A small wonder, held in silver light',
    artwork: {
      theme: 'nocturne',
      atlas: '/artwork/nocturne-atlas.webp',
      title: 'nocturne',
      subtitle: 'A CABINET OF LITTLE WONDERS',
    },
  },
  {
    id: 'atelier-halloween',
    name: { vi: 'Đêm hội bí ngô', en: 'Pumpkin after dark' },
    collection: 'celebration',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#252329',
    ink: '#f7dcad',
    accent: '#c7955b',
    stamp: 'GOOD FRIENDS / A LITTLE MAGIC',
    artwork: {
      theme: 'halloween',
      atlas: '/artwork/halloween-atlas.webp',
      title: 'AFTER DARK',
      subtitle: 'A FRIENDLY LITTLE HAUNTING',
    },
  },
  {
    id: 'atelier-vow',
    name: { vi: 'Lời hẹn sắc ngà', en: 'Ivory vows' },
    collection: 'romance',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#f6f2e9',
    ink: '#686354',
    accent: '#b6a77f',
    stamp: 'Together is a beautiful place to be',
    artwork: {
      theme: 'vow',
      atlas: '/artwork/vow-atlas.webp',
      title: 'our day, forever',
      subtitle: 'THE MOMENTS WE PROMISE TO KEEP',
    },
  },
];

type Box = [number, number, number, number, number, Slot['mask'], Slot['treatment']?];
function make(
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
    category: 'editorial',
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

export const occasionLayouts: Layout[] = [
  make('gallery-medallion', 'Hai vòm và huy hiệu', 'Gallery medallion', 1800, 2400, [
    [210, 350, 640, 800, 0, 'arch'],
    [950, 350, 640, 800, 0, 'arch'],
    [530, 1300, 740, 740, 0, 'scallop'],
  ]),
  make('cabinet-portrait', 'Chân dung trong tủ ký ức', 'Cabinet portrait', 2400, 1800, [
    [750, 300, 900, 1100, 0, 'arch'],
    [75, 600, 520, 520, 0, 'ellipse'],
    [1805, 600, 520, 520, 0, 'ellipse'],
  ]),
  make('ticket-duo', 'Hai vé kỷ niệm', 'Keepsake tickets', 1800, 2200, [
    [200, 400, 1150, 650, -3, 'rect', 'ticket'],
    [200, 1230, 1150, 650, 3, 'rect', 'ticket'],
  ]),
  make('scalloped-duet', 'Hai huy hiệu viền lượn', 'Scalloped cameos', 2200, 1600, [
    [250, 390, 700, 700, 0, 'scallop'],
    [1250, 390, 700, 700, 0, 'scallop'],
  ]),
];
