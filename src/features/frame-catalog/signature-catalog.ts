import type { Frame, Layout, Slot } from '../../domain/types';

export const signatureFrames: Frame[] = [
  {
    id: 'signature-passport',
    name: { vi: 'Hộ chiếu những chuyến đi', en: 'Memory passport' },
    collection: 'retro',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#eee8d3',
    ink: '#274c48',
    accent: '#a34c35',
    stamp: 'Collect places. Keep people.',
    artwork: { theme: 'passport', title: 'MEMORY PASSPORT', subtitle: 'DEPARTMENT OF GOOD DAYS' },
  },
  {
    id: 'signature-mixtape',
    name: { vi: 'Cuộn băng ngày ấy', en: 'Our mixtape' },
    collection: 'retro',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#292e32',
    ink: '#f5e9ca',
    accent: '#e68b53',
    stamp: 'A soundtrack for the little things',
    artwork: { theme: 'mixtape', title: 'OUR MIXTAPE', subtitle: 'SIDE A / FRIENDS ON REPEAT' },
  },
  {
    id: 'signature-poster',
    name: { vi: 'Trang bìa của chúng mình', en: 'The cover story' },
    collection: 'geometric',
    color: 'blue',
    pattern: 'plain',
    style: 'minimal',
    background: '#eaece5',
    ink: '#173ddd',
    accent: '#d8ef56',
    stamp: 'An ordinary day. An extraordinary us.',
    artwork: { theme: 'poster', title: 'US, IN PRINT.', subtitle: 'THE PERSONAL ISSUE / NO. 01' },
  },
];

function layout(id: string, vi: string, en: string, boxes: number[][]): Layout {
  return {
    id,
    name: { vi, en },
    category: 'editorial',
    width: 1800,
    height: 2400,
    slots: boxes.map(([x, y, width, height, rotation], i): Slot => ({
      id: `slot-${i}`,
      x,
      y,
      width,
      height,
      rotation,
      mask: 'rect',
    })),
  };
}

// Deliberately authored hierarchies, rather than equal cells or mask/count variants.
export const signatureLayouts: Layout[] = [
  layout('passport-entry', 'Ảnh thẻ và trang hành trình', 'Passport entry', [
    [0.1, 0.2, 0.43, 0.38, 0],
    [0.62, 0.28, 0.27, 0.22, -5],
    [0.3, 0.65, 0.59, 0.19, 2],
  ]),
  layout('mixtape-sleeve', 'Bìa album và hai cảnh phụ', 'Mixtape sleeve', [
    [0.1, 0.18, 0.8, 0.39, 0],
    [0.12, 0.64, 0.32, 0.19, -3],
    [0.56, 0.64, 0.32, 0.19, 3],
  ]),
  layout('cover-story', 'Ảnh bìa và ô chú thích', 'Cover story', [
    [0.08, 0.2, 0.59, 0.64, 0],
    [0.72, 0.54, 0.2, 0.26, 0],
  ]),
];
