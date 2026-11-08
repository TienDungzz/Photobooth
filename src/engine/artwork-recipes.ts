import type { Frame } from '../domain/types';

type Theme = NonNullable<Frame['artwork']>['theme'];
type Sticker = [cell: number, x: number, y: number, size: number, rotation: number];
export const stickerRecipes: Partial<
  Record<
    Theme,
    {
      stickers: Sticker[];
      slotCell: number;
      thumbnailCell: number;
    }
  >
> = {
  nocturne: {
    stickers: [
      [0, 0.12, 0.09, 0.24, -0.1],
      [2, 0.88, 0.14, 0.21, 0.1],
      [4, 0.86, 0.89, 0.24, 0.1],
      [3, 0.14, 0.89, 0.26, -0.1],
    ],
    slotCell: 2,
    thumbnailCell: 1,
  },
  halloween: {
    stickers: [
      [0, 0.11, 0.1, 0.22, 0],
      [2, 0.88, 0.14, 0.2, 0.12],
      [4, 0.84, 0.89, 0.28, 0.08],
      [5, 0.13, 0.88, 0.24, -0.08],
    ],
    slotCell: 0,
    thumbnailCell: 1,
  },
  vow: {
    stickers: [
      [0, 0.11, 0.1, 0.26, 0],
      [2, 0.88, 0.13, 0.24, 0.12],
      [4, 0.85, 0.89, 0.28, 0.08],
      [3, 0.14, 0.88, 0.28, -0.1],
    ],
    slotCell: 2,
    thumbnailCell: 1,
  },
  afterhours: {
    stickers: [
      [0, 0.12, 0.08, 0.25, -0.12],
      [2, 0.89, 0.15, 0.19, 0.12],
      [4, 0.86, 0.88, 0.24, 0.1],
      [3, 0.14, 0.89, 0.26, -0.12],
    ],
    slotCell: 5,
    thumbnailCell: 1,
  },
  playdate: {
    stickers: [
      [0, 0.12, 0.09, 0.23, -0.1],
      [2, 0.88, 0.14, 0.19, 0.12],
      [4, 0.85, 0.89, 0.26, 0.1],
      [5, 0.14, 0.89, 0.24, -0.1],
    ],
    slotCell: 0,
    thumbnailCell: 1,
  },
  zine: {
    stickers: [
      [0, 0.11, 0.08, 0.18, -0.1],
      [2, 0.91, 0.17, 0.16, 0.15],
      [5, 0.86, 0.89, 0.24, 0.1],
      [3, 0.14, 0.89, 0.27, -0.12],
    ],
    slotCell: 0,
    thumbnailCell: 1,
  },
  ballet: {
    stickers: [
      [0, 0.13, 0.08, 0.24, -0.08],
      [5, 0.88, 0.13, 0.18, 0.1],
      [1, 0.81, 0.88, 0.29, 0.1],
      [4, 0.15, 0.88, 0.23, -0.1],
    ],
    slotCell: 5,
    thumbnailCell: 2,
  },
  herbarium: {
    stickers: [
      [0, 0.11, 0.12, 0.27, 0],
      [2, 0.88, 0.12, 0.18, 0.12],
      [4, 0.14, 0.89, 0.27, -0.14],
      [5, 0.86, 0.89, 0.25, 0.08],
    ],
    slotCell: 2,
    thumbnailCell: 1,
  },
  seaside: {
    stickers: [
      [0, 0.12, 0.09, 0.25, -0.12],
      [2, 0.9, 0.13, 0.17, 0.1],
      [4, 0.85, 0.89, 0.28, 0.08],
      [3, 0.15, 0.88, 0.23, -0.12],
    ],
    slotCell: 2,
    thumbnailCell: 1,
  },
  cherry: {
    stickers: [
      [0, 0.14, 0.08, 0.24, -0.08],
      [2, 0.88, 0.13, 0.21, 0.12],
      [4, 0.86, 0.89, 0.25, 0.12],
      [3, 0.14, 0.89, 0.24, -0.08],
    ],
    slotCell: 2,
    thumbnailCell: 1,
  },
};
