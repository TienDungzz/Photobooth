import { describe, expect, it } from 'vitest';
import { frames, layouts } from './catalog';
import { filterFrames, filterLayouts, layoutStyleOf } from './filters';

describe('large catalog filters', () => {
  it('counts only illustrated atlases as featured, keeping the Canvas cinema frame in basic', () => {
    const featured = filterFrames(frames, 'artwork');
    const basic = filterFrames(frames, 'basic');
    expect(featured).toHaveLength(13);
    expect(basic).toHaveLength(49);
    expect(featured.every((frame) => !!frame.artwork?.atlas)).toBe(true);
    expect(basic.some((frame) => frame.id === 'atelier-cinema')).toBe(true);
    expect(new Set([...featured, ...basic].map((frame) => frame.id)).size).toBe(frames.length);
  });
  it('filters collections without changing the complete catalog', () => {
    const result = filterFrames(frames, 'botanical');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((frame) => frame.collection === 'botanical')).toBe(true);
    expect(filterFrames(frames, 'all')).toEqual(frames);
  });
  it('combines photo count and style independently', () => {
    const result = filterLayouts(layouts, '12', 'classic');
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((layout) => layout.slots.length === 12 && layoutStyleOf(layout) === 'classic'),
    ).toBe(true);
    expect(filterLayouts(layouts, '20', 'shaped')).toEqual([]);
    expect(filterLayouts(layouts, 'all', 'all')).toEqual(layouts);
  });
  it('provides layouts for every photo count from 1 to 20', () => {
    for (let count = 1; count <= 20; count++)
      expect(
        layouts.some((layout) => layout.slots.length === count),
        String(count),
      ).toBe(true);
  });
});
