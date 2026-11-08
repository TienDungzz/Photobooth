import { describe, expect, it } from 'vitest';
import type { Photo } from '../../domain/types';
import { mergePhotos } from './merge-photos';

const photo = (id: string, fingerprint = id): Photo => ({
  id,
  fingerprint,
  url: `blob:${id}`,
  image: {} as HTMLImageElement,
  width: 800,
  height: 1000,
});
describe('unique photo library with reusable slot references', () => {
  it('stores one image for duplicate content in one upload and preserves both assignments', () => {
    const first = photo('first', 'same'),
      duplicate = photo('renamed', 'same');
    const plan = mergePhotos([], [first, duplicate]);
    expect(plan.added).toEqual([first]);
    expect(plan.assignments).toEqual([first, first]);
    expect(plan.discarded).toEqual([duplicate]);
    expect(plan.limited).toBe(false);
  });
  it('reuses a library photo on later imports without releasing the owned reference', () => {
    const owned = photo('existing', 'same'),
      duplicate = photo('new', 'same');
    const plan = mergePhotos([owned], [duplicate, owned]);
    expect(plan.added).toEqual([]);
    expect(plan.assignments).toEqual([owned, owned]);
    expect(plan.discarded).toEqual([duplicate]);
  });
  it('does not merge different content, and duplicate references do not consume capacity', () => {
    const existing = Array.from({ length: 30 }, (_, i) => photo(String(i)));
    const repeated = photo('copy', '0'),
      fresh = photo('fresh');
    const plan = mergePhotos(existing, [repeated, fresh]);
    expect(plan.assignments).toEqual([existing[0]]);
    expect(plan.added).toEqual([]);
    expect(plan.discarded).toEqual([repeated, fresh]);
    expect(plan.limited).toBe(true);
  });
});
