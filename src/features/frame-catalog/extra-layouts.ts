import type { Layout, Slot } from '../../domain/types';

export function geometryKey(layout: Layout): string {
  return JSON.stringify([
    layout.width,
    layout.height,
    layout.slots.map((slot) =>
      [slot.x, slot.y, slot.width, slot.height, slot.rotation, slot.mask, slot.treatment ?? ''].map(
        (value) => (typeof value === 'number' ? Number(value.toFixed(5)) : value),
      ),
    ),
  ]);
}
function cells(
  count: number,
  columns: number,
  mask: Slot['mask'] = 'rect',
  top = 0.05,
  areaHeight = 0.8,
): Slot[] {
  const rows = Math.ceil(count / columns),
    gap = 0.025,
    w = (0.88 - gap * (columns - 1)) / columns,
    h = (areaHeight - gap * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns),
      inRow = Math.min(columns, count - row * columns),
      left = 0.06 + (0.88 - (inRow * w + (inRow - 1) * gap)) / 2;
    return {
      id: `slot-${index}`,
      x: left + (index % columns) * (w + gap),
      y: top + row * (h + gap),
      width: w,
      height: h,
      rotation: 0,
      mask,
    };
  });
}
/** Fit equal circles in physical pixels; normalized width/height are intentionally different. */
function circularCells(count: number, canvasWidth: number, canvasHeight: number): Slot[] {
  const areaWidth = canvasWidth * 0.88;
  const areaHeight = canvasHeight * 0.72;
  const gap = Math.min(canvasWidth, canvasHeight) * 0.035;
  const columns = Math.max(1, Math.round(Math.sqrt((count * areaWidth) / areaHeight)));
  const rows = Math.ceil(count / columns);
  const diameter = Math.min(
    (areaWidth - gap * (columns - 1)) / columns,
    (areaHeight - gap * (rows - 1)) / rows,
  );
  const top = canvasHeight * 0.13 + (areaHeight - (diameter * rows + gap * (rows - 1))) / 2;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns);
    const inRow = Math.min(columns, count - row * columns);
    const left = (canvasWidth - (diameter * inRow + gap * (inRow - 1))) / 2;
    return {
      id: `slot-${index}`,
      x: (left + (index % columns) * (diameter + gap)) / canvasWidth,
      y: (top + row * (diameter + gap)) / canvasHeight,
      width: diameter / canvasWidth,
      height: diameter / canvasHeight,
      rotation: 0,
      mask: 'ellipse',
    };
  });
}

export function expandLayouts(base: Layout[]): Layout[] {
  const output = [...base],
    seen = new Set(base.map(geometryKey));
  const add = (
    id: string,
    vi: string,
    en: string,
    category: Layout['category'],
    width: number,
    height: number,
    slots: Slot[],
  ) => {
    const layout: Layout = {
      id,
      name: { vi, en },
      category,
      width,
      height,
      slots: slots.map((slot, index) => ({ ...slot, id: `slot-${index}` })),
    };
    const key = geometryKey(layout);
    if (!seen.has(key)) {
      output.push(layout);
      seen.add(key);
    }
  };
  // Retain distinct arrangements and missing photo counts, rather than every ratio/count pair.
  const mosaicGroups = [
    { ratio: 'portrait', counts: [5, 7, 11, 13, 14, 15, 17, 18, 19] },
    { ratio: 'landscape', counts: [5, 8, 10] },
  ] as const;
  for (const { ratio, counts } of mosaicGroups)
    for (const count of counts) {
      const columns = Math.max(
        1,
        Math.round(Math.sqrt(count) * (ratio === 'portrait' ? 0.8 : 1.3)),
      );
      const [width, height] = ratio === 'portrait' ? [1800, 2400] : [2400, 1800];
      add(
        `mosaic-${count}-${ratio}`,
        `Mosaic ${count} · ${ratio === 'portrait' ? 'Dọc' : 'Ngang'}`,
        `Mosaic ${count} · ${ratio}`,
        'grid',
        width,
        height,
        cells(count, columns),
      );
    }
  for (const count of [5, 6, 8]) {
    const rest = cells(count - 1, Math.min(5, Math.ceil(Math.sqrt(count - 1))), 'rect', 0.46, 0.39);
    add(
      `story-${count}`,
      `Ảnh lớn & ${count - 1} ảnh nhỏ`,
      `Hero + ${count - 1} moments`,
      'editorial',
      1800,
      2400,
      [{ id: '', x: 0.06, y: 0.05, width: 0.88, height: 0.38, rotation: 0, mask: 'rect' }, ...rest],
    );
  }
  for (const mask of ['rounded', 'ellipse'] as const)
    for (const count of mask === 'rounded' ? [4, 9] : [1, 2, 3, 4, 5]) {
      add(
        `${mask}-${count}`,
        `${mask === 'rounded' ? 'Bo góc' : 'Tròn'} ${count} ảnh`,
        `${mask === 'rounded' ? 'Rounded' : 'Circle'} ${count}`,
        'grid',
        1800,
        2400,
        mask === 'ellipse'
          ? circularCells(count, 1800, 2400)
          : cells(count, Math.ceil(Math.sqrt(count)), mask),
      );
    }
  return output;
}
