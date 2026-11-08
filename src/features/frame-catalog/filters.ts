import type { Frame, Layout } from '../../domain/types';

export const collections = [
  'romance',
  'botanical',
  'celebration',
  'celestial',
  'retro',
  'geometric',
  'minimal',
] as const;
export const layoutStyles = ['classic', 'shaped', 'creative'] as const;
export function filterFrames(items: Frame[], collection: string) {
  return items.filter(
    (frame) =>
      collection === 'all' ||
      (collection === 'artwork'
        ? !!frame.artwork?.atlas
        : collection === 'basic'
          ? !frame.artwork?.atlas
          : frame.collection === collection),
  );
}
export function layoutStyleOf(layout: Layout): (typeof layoutStyles)[number] {
  if (
    layout.slots.some(
      (slot) =>
        slot.rotation !== 0 ||
        !!slot.treatment ||
        ['blob', 'cutout', 'torn', 'apple'].includes(slot.mask),
    )
  )
    return 'creative';
  if (layout.slots.some((slot) => slot.mask !== 'rect' && slot.mask !== 'rounded')) return 'shaped';
  return 'classic';
}
export function filterLayouts(items: Layout[], count: string, style: string) {
  return items.filter(
    (layout) =>
      (count === 'all' || layout.slots.length === Number(count)) &&
      (style === 'all' || layoutStyleOf(layout) === style),
  );
}
