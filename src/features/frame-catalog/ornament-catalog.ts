import type { Frame, Layout, Slot } from '../../domain/types';

export const ornamentFrames: Frame[] = [
  {
    id: 'ornament-ivory-night',
    name: { vi: 'Ren ngà trong đêm', en: 'Ivory after dark' },
    collection: 'romance',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#29272d',
    ink: '#f4ece1',
    accent: '#b8afb9',
    stamp: 'Quiet moments, intricately kept',
    artwork: {
      theme: 'ivory-night',
      title: 'quietly, forever',
      subtitle: 'LACE / LITTLE MEMORIES',
    },
  },
  {
    id: 'ornament-cloud-curtain',
    name: { vi: 'Rèm sao trên mây', en: 'Stars above the clouds' },
    collection: 'celestial',
    color: 'blue',
    pattern: 'plain',
    style: 'minimal',
    background: '#334d69',
    ink: '#fff5e6',
    accent: '#c6d7e5',
    stamp: 'Under the same little sky',
    artwork: {
      theme: 'cloud-curtain',
      title: 'under our sky',
      subtitle: 'A SMALL CONSTELLATION OF US',
    },
  },
  {
    id: 'ornament-rose-haze',
    name: { vi: 'Ánh hồng mơ màng', en: 'Rose haze' },
    collection: 'romance',
    color: 'purple',
    pattern: 'plain',
    style: 'film',
    background: '#251c30',
    ink: '#ffe5f4',
    accent: '#edacd5',
    stamp: 'All the love, in a little light',
    artwork: {
      theme: 'rose-haze',
      title: 'softly in love',
      subtitle: 'LET THE LITTLE THINGS GLOW',
    },
  },
  {
    id: 'ornament-firefly-bloom',
    name: { vi: 'Hoa đom đóm', en: 'Firefly bloom' },
    collection: 'botanical',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#152b2d',
    ink: '#eef4dd',
    accent: '#b1dfcf',
    stamp: 'A tiny garden of glowing days',
    artwork: {
      theme: 'firefly-bloom',
      title: 'a garden of light',
      subtitle: 'TINY BLOOMS / BRIGHT MEMORIES',
    },
  },
];
type Box = [number, number, number, number, Slot['mask'], NonNullable<Slot['treatment']>, number?];
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
    category: 'scrapbook',
    width,
    height,
    slots: boxes.map(([x, y, w, h, mask, treatment, rotation = 0], i) => ({
      id: `slot-${i}`,
      x: x / width,
      y: y / height,
      width: w / width,
      height: h / height,
      mask,
      treatment,
      rotation,
    })),
  };
}
export const ornamentLayouts: Layout[] = [
  make('lace-cameo', 'Chân dung vòng ren', 'Lace cameo', 1800, 2000, [
    [420, 470, 960, 960, 'ellipse', 'lace'],
  ]),
  make('filigree-keepsakes', 'Hai ô hoa văn uốn', 'Filigree keepsakes', 2200, 2000, [
    [260, 450, 800, 1080, 'rect', 'filigree', -3],
    [1280, 630, 650, 760, 'rect', 'filigree', 4],
  ]),
  make('hanging-star-scenes', 'Ba cảnh dưới rèm sao', 'Hanging star scenes', 2400, 1800, [
    [280, 480, 480, 820, 'rect', 'star-curtain'],
    [960, 650, 480, 650, 'rect', 'star-curtain'],
    [1640, 480, 480, 820, 'rect', 'star-curtain'],
  ]),
  make('glowing-heart-quartet', 'Bốn ô tim phát sáng', 'Glowing heart quartet', 2200, 2200, [
    [320, 400, 620, 620, 'rounded', 'glow-hearts', -3],
    [1260, 400, 620, 620, 'rounded', 'glow-hearts', 3],
    [320, 1280, 620, 620, 'rounded', 'glow-hearts', 3],
    [1260, 1280, 620, 620, 'rounded', 'glow-hearts', -3],
  ]),
  make('firefly-flower-window', 'Cửa sổ hoa phát quang', 'Firefly flower window', 2000, 2200, [
    [350, 430, 1300, 1340, 'rounded', 'glow-flowers'],
  ]),
];
