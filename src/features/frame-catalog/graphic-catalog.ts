import type { Frame, Layout, Slot } from '../../domain/types';

export const graphicFrames: Frame[] = [
  {
    id: 'graphic-comic',
    name: { vi: 'Một ngày thành truyện', en: 'Comic day' },
    collection: 'celebration',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#fff2c5',
    ink: '#232020',
    accent: '#e94235',
    stamp: 'Everyday heroes, extraordinary memories',
    artwork: { theme: 'comic', title: 'WHAT A DAY!', subtitle: 'THE ADVENTURES OF US' },
  },
  {
    id: 'graphic-vinyl',
    name: { vi: 'Đĩa nhạc của đôi mình', en: 'On the record' },
    collection: 'retro',
    color: 'cream',
    pattern: 'plain',
    style: 'film',
    background: '#e6dfd1',
    ink: '#202c29',
    accent: '#b84632',
    stamp: 'Our favourite moments, on repeat',
    artwork: { theme: 'vinyl', title: 'ON THE RECORD', subtitle: 'ORIGINAL MEMORIES / LONG PLAY' },
  },
  {
    id: 'graphic-blueprint',
    name: { vi: 'Bản vẽ những kỷ niệm', en: 'Memory blueprint' },
    collection: 'geometric',
    color: 'blue',
    pattern: 'plain',
    style: 'minimal',
    background: '#17394e',
    ink: '#e4f0ed',
    accent: '#efd492',
    stamp: 'A study of the things that matter',
    artwork: { theme: 'blueprint', title: 'MEMORY STUDY', subtitle: 'DRAWN FROM LIFE / SHEET 01' },
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
  return {
    id,
    name: { vi, en },
    category: 'editorial',
    width,
    height,
    slots: boxes.map(([x, y, w, h, mask, rotation = 0], i) => ({
      id: `slot-${i}`,
      x: x / width,
      y: y / height,
      width: w / width,
      height: h / height,
      mask,
      rotation,
    })),
  };
}

export const graphicLayouts: Layout[] = [
  make('comic-sequence', 'Một cảnh lớn, hai nhịp truyện', 'Comic sequence', 2200, 1800, [
    [180, 380, 1020, 1060, 'rect', -3],
    [1340, 370, 660, 450, 'rect', 4],
    [1280, 980, 740, 460, 'rect', -4],
  ]),
  make('vinyl-sleeve', 'Đĩa tròn và ảnh lời tựa', 'Record and liner photo', 2200, 1800, [
    [170, 470, 1040, 1040, 'ellipse'],
    [1460, 560, 490, 700, 'rect'],
  ]),
  make('blueprint-study', 'Bốn góc nhìn bản vẽ', 'Four-view study', 2400, 1800, [
    [240, 390, 870, 840, 'rect'],
    [1270, 390, 390, 390, 'ellipse'],
    [1770, 390, 390, 390, 'ellipse'],
    [1270, 930, 890, 300, 'rect'],
  ]),
  make('comic-tall-story', 'Dải truyện dọc bốn nhịp', 'Tall comic story', 1800, 2400, [
    [160, 380, 1480, 600, 'rect'],
    [160, 1110, 590, 530, 'rect', -3],
    [900, 1110, 720, 360, 'rect', 3],
    [900, 1600, 720, 430, 'rect', -2],
  ]),
];
