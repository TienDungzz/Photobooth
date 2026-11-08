import type { Frame, Layout, Slot } from '../../domain/types';

export const inspiredFrames: Frame[] = [
  {
    id: 'inspired-candy-sky',
    name: { vi: 'Mây kẹo và gấu nhỏ', en: 'Candy sky club' },
    collection: 'celebration',
    color: 'pink',
    pattern: 'plain',
    style: 'pastel',
    background: '#f6b9d4',
    ink: '#355b80',
    accent: '#cb678d',
    stamp: 'Small joys, all year round',
    artwork: { theme: 'candy-sky', title: 'CANDY SKY CLUB', subtitle: 'SWEET DAYS / SOFT CLOUDS' },
  },
  {
    id: 'inspired-field-notes',
    name: { vi: 'Sổ hoa giấy xé', en: 'Wildflower field notes' },
    collection: 'botanical',
    color: 'cream',
    pattern: 'plain',
    style: 'minimal',
    background: '#e9e1d1',
    ink: '#626b48',
    accent: '#a7aa86',
    stamp: 'Small steps. Beautiful days.',
    artwork: {
      theme: 'field-notes',
      title: 'field notes',
      subtitle: 'LITTLE THINGS WORTH KEEPING',
    },
  },
  {
    id: 'inspired-luminous',
    name: { vi: 'Vườn bướm phát sáng', en: 'Luminous garden' },
    collection: 'celestial',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#171626',
    ink: '#fff1ff',
    accent: '#dca5e8',
    stamp: 'You make the ordinary glow',
    artwork: { theme: 'luminous', title: 'a little glow', subtitle: 'LIGHT UP THE LITTLE MOMENTS' },
  },
  {
    id: 'inspired-denim-bunny',
    name: { vi: 'Thỏ nhỏ, denim và ren', en: 'Denim bunny keepsakes' },
    collection: 'romance',
    color: 'blue',
    pattern: 'plain',
    style: 'pastel',
    background: '#202e53',
    ink: '#f4ede4',
    accent: '#a9c4d5',
    stamp: 'hello, little memories',
    artwork: {
      theme: 'denim-bunny',
      title: 'hello, little memories',
      subtitle: 'BLUE JEANS / SOFT HEARTS',
    },
  },
  {
    id: 'inspired-marquee',
    name: { vi: 'Đêm công chiếu', en: 'Opening night' },
    collection: 'celebration',
    color: 'dark',
    pattern: 'plain',
    style: 'film',
    background: '#360e18',
    ink: '#fff0c9',
    accent: '#d4473b',
    stamp: 'Tonight, you are the star',
    artwork: { theme: 'marquee', title: 'OPENING NIGHT', subtitle: 'A FILM BY YOU / ADMIT ONE' },
  },
];

type Box = [number, number, number, number, Slot['mask'], number?, Slot['treatment']?];
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
    category: 'scrapbook',
    slots: boxes.map(([x, y, w, h, mask, rotation = 0, treatment], i) => ({
      id: `slot-${i}`,
      x: x / width,
      y: y / height,
      width: w / width,
      height: h / height,
      mask,
      rotation,
      ...(treatment ? { treatment } : {}),
    })),
  };
}
export const inspiredLayouts: Layout[] = [
  make('candy-six-scenes', 'Sáu ô mây, tim và gấu', 'Six candy scenes', 1600, 2400, [
    [140, 250, 580, 460, 'rect'],
    [880, 250, 580, 460, 'bear'],
    [140, 970, 580, 580, 'heart'],
    [880, 970, 580, 580, 'heart'],
    [140, 1780, 580, 460, 'bear'],
    [880, 1780, 580, 460, 'rect'],
  ]),
  make('field-note-spread', 'Bốn trang hoa nghiêng', 'Four field-note pages', 2200, 2000, [
    [250, 340, 700, 540, 'torn', -5, 'polaroid'],
    [1220, 340, 710, 540, 'rect', 4, 'polaroid'],
    [250, 1110, 700, 540, 'rect', -3, 'polaroid'],
    [1220, 1110, 710, 540, 'torn', 5, 'polaroid'],
  ]),
  make('luminous-window', 'Cửa sổ ánh sáng', 'Luminous window', 1800, 2000, [
    [240, 300, 1320, 1400, 'wavy'],
  ]),
  make('denim-alternating', 'Ba vòm ngang đan xen', 'Alternating side arches', 1000, 2400, [
    [230, 280, 690, 510, 'side-left'],
    [80, 1000, 690, 510, 'side-right'],
    [230, 1720, 690, 510, 'side-left'],
  ]),
  make('marquee-feature', 'Ba cảnh công chiếu', 'Three premiere scenes', 1200, 2400, [
    [235, 370, 730, 520, 'rect'],
    [235, 1030, 730, 520, 'rect'],
    [235, 1690, 730, 420, 'rect'],
  ]),
];
