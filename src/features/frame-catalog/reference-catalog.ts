import type { Frame, Layout, Slot } from '../../domain/types';

export const referenceFrames: Frame[] = [
  {
    id: 'reference-picnic-tiger',
    name: { vi: 'Hổ con picnic', en: 'Picnic tiger' },
    collection: 'celebration',
    color: 'green',
    pattern: 'plain',
    style: 'pastel',
    background: '#fff9ea',
    ink: '#79513b',
    accent: '#ef929f',
    stamp: 'Little days, big happiness',
    artwork: {
      theme: 'picnic-tiger',
      title: 'HAPPY LITTLE DAYS',
      subtitle: 'A POCKET FULL OF SUNSHINE',
    },
  },
  {
    id: 'reference-punk-star',
    name: { vi: 'Ngôi sao nổi loạn', en: 'Rebel star' },
    collection: 'retro',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#171516',
    ink: '#f1e7dc',
    accent: '#c72d62',
    stamp: 'Everyone has a little star inside',
    artwork: {
      theme: 'punk-star',
      title: 'SHINE YOUR WAY',
      subtitle: 'LOUD HEART / GOOD MEMORIES',
    },
  },
];

type Box = [number, number, number, number, Slot['mask'], number?];
function make(id: string, vi: string, en: string, boxes: Box[]): Layout {
  return {
    id,
    name: { vi, en },
    width: 900,
    height: 2400,
    category: 'scrapbook',
    slots: boxes.map(([x, y, width, height, mask, rotation = 0], i) => ({
      id: `slot-${i}`,
      x: x / 900,
      y: y / 2400,
      width: width / 900,
      height: height / 2400,
      mask,
      rotation,
    })),
  };
}
export const referenceLayouts: Layout[] = [
  make('picnic-tiger-strip', 'Dải hổ con, ảnh nghiêng và táo', 'Tiger, tilted photo and apple', [
    [115, 220, 670, 430, 'ellipse'],
    [100, 840, 700, 400, 'rect'],
    [120, 1390, 660, 400, 'rect', 6],
    [125, 1900, 650, 360, 'apple'],
  ]),
  make('punk-three-strip', 'Ba ảnh viền punk', 'Three punk panels', [
    [140, 150, 620, 580, 'rect'],
    [140, 830, 620, 580, 'rect'],
    [140, 1510, 620, 580, 'rect'],
  ]),
];
