import { geometryKey } from '../features/frame-catalog/extra-layouts';
import { describe, expect, it } from 'vitest';
import { coverGeometry } from './renderer';
import { defaultTransform } from '../domain/types';
import { frames, layouts, composeDesign, validateCatalog } from '../features/frame-catalog/catalog';
import { assignToEmpty, changeFrame } from '../domain/composition';
import { artLayouts } from '../features/frame-catalog/art-frames';
import { extraFrames } from '../features/frame-catalog/extra-frames';
import { expressiveLayouts } from '../features/frame-catalog/expressive-catalog';
import { occasionLayouts } from '../features/frame-catalog/occasion-catalog';

describe('frame catalog and composition', () => {
  it('keeps occasion scallops square and the entire rotated ticket including its stub inside the sheet', () => {
    for (const layout of occasionLayouts)
      for (const slot of layout.slots) {
        const w = slot.width * layout.width,
          h = slot.height * layout.height;
        if (slot.mask === 'scallop') expect(w).toBeCloseTo(h, 5);
        if (slot.treatment !== 'ticket') continue;
        const pad = Math.min(layout.width * 0.012, Math.min(w, h) * 0.035),
          stub = w * 0.24;
        const cx = (slot.x + slot.width / 2) * layout.width,
          cy = (slot.y + slot.height / 2) * layout.height;
        const angle = (slot.rotation * Math.PI) / 180;
        for (const x of [-w / 2 - pad, w / 2 + pad + stub])
          for (const y of [-h / 2 - pad, h / 2 + pad]) {
            const px = cx + x * Math.cos(angle) - y * Math.sin(angle),
              py = cy + x * Math.sin(angle) + y * Math.cos(angle);
            expect(px).toBeGreaterThan(0);
            expect(px).toBeLessThan(layout.width);
            expect(py).toBeGreaterThan(0);
            expect(py).toBeLessThan(layout.height);
          }
      }
  });
  it('keeps expressive photo bounds within the sheet after rotation', () => {
    for (const layout of expressiveLayouts)
      for (const slot of layout.slots) {
        const angle = (slot.rotation * Math.PI) / 180;
        const w = slot.width * layout.width,
          h = slot.height * layout.height;
        const halfWidth = (Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle))) / 2;
        const halfHeight = (Math.abs(h * Math.cos(angle)) + Math.abs(w * Math.sin(angle))) / 2;
        const cx = (slot.x + slot.width / 2) * layout.width,
          cy = (slot.y + slot.height / 2) * layout.height;
        expect(cx - halfWidth).toBeGreaterThan(0);
        expect(cy - halfHeight).toBeGreaterThan(0);
        expect(cx + halfWidth).toBeLessThan(layout.width);
        expect(cy + halfHeight).toBeLessThan(layout.height);
      }
    expect(
      new Set(expressiveLayouts.flatMap((layout) => layout.slots.map((slot) => slot.mask))),
    ).toEqual(new Set(['blob', 'cutout', 'rect', 'apple', 'torn']));
  });
  it('keeps only one representative of each procedural motif after curation', () => {
    expect(extraFrames).toHaveLength(22);
    expect(new Set(extraFrames.map((frame) => frame.pattern)).size).toBe(extraFrames.length);
  });
  it('keeps generated circular windows round, centered and separated in output pixels', () => {
    const circular = layouts.filter((layout) => layout.id.startsWith('ellipse-'));
    expect(circular.length).toBeGreaterThanOrEqual(5);
    for (const layout of circular)
      for (const slot of layout.slots) {
        expect(slot.width * layout.width).toBeCloseTo(slot.height * layout.height, 5);
        expect(slot.x).toBeGreaterThanOrEqual(0.06);
        expect(slot.x + slot.width).toBeLessThanOrEqual(0.94 + 1e-10);
        expect(slot.y).toBeGreaterThanOrEqual(0.13);
        expect(slot.y + slot.height).toBeLessThanOrEqual(0.85 + 1e-10);
        for (const other of layout.slots) {
          if (slot === other) continue;
          const horizontalGap = Math.max(
            other.x - slot.x - slot.width,
            slot.x - other.x - other.width,
          );
          const verticalGap = Math.max(
            other.y - slot.y - slot.height,
            slot.y - other.y - other.height,
          );
          expect(horizontalGap > 0 || verticalGap > 0).toBe(true);
        }
      }
    for (const layout of layouts.filter((layout) =>
      layout.slots.some((slot) => slot.mask === 'ellipse'),
    ))
      for (const slot of layout.slots.filter((slot) => slot.mask === 'ellipse')) {
        const ratio = (slot.width * layout.width) / (slot.height * layout.height);
        if (layout.id === 'picnic-tiger-strip') {
          // The supplied tiger reference deliberately has a landscape oval face.
          expect(ratio).toBeCloseTo(670 / 430, 5);
          continue;
        }
        expect(ratio).toBeGreaterThanOrEqual(0.75);
        expect(ratio).toBeLessThanOrEqual(1.01);
      }
  });
  it('keeps heart/star windows square and arches at portrait proportions in output pixels', () => {
    for (const layout of artLayouts)
      for (const slot of layout.slots) {
        const ratio = (slot.width * layout.width) / (slot.height * layout.height);
        if (slot.mask === 'heart' || slot.mask === 'star') expect(ratio).toBeCloseTo(1, 5);
        if (slot.mask === 'arch') {
          expect(ratio).toBeGreaterThanOrEqual(0.75);
          expect(ratio).toBeLessThanOrEqual(0.85);
        }
      }
  });
  it('changing decoration preserves the layout and exact crops', () => {
    const previous = composeDesign(frames[0], layouts[10]);
    const composition = assignToEmpty(previous, {}, [{ id: 'a' }]);
    composition['slot-0'].transform.zoom = 1.7;
    const next = composeDesign(frames[1], previous.layout);
    expect(next.layout).toBe(previous.layout);
    expect(changeFrame(previous, next, composition)).toBe(composition);
    expect('layout' in frames[0]).toBe(false);
  });
  it('supports 16 and 20 photos independently of every decoration', () => {
    for (const style of frames)
      for (const count of [16, 20]) {
        const layout = layouts.find((item) => item.slots.length === count)!;
        const design = composeDesign(style, layout);
        expect(design.id).toBe(style.id);
        expect(design.layout.slots).toHaveLength(count);
      }
  });
  it('contains independent frame styles and 93 distinct valid layouts', () => {
    expect(layouts).toHaveLength(93);
    expect(frames).toHaveLength(62);
    expect(validateCatalog()).toEqual([]);
    const geometries = layouts.map(geometryKey);
    expect(new Set(geometries).size).toBe(93);
  });
  it('adds only to empty slots, preserves existing crops and keeps excess out of assignments', () => {
    const frame = composeDesign(
      frames[0],
      layouts.find((layout) => layout.id === 'strip-two')!,
    );
    const first = { photoId: 'a', transform: { ...defaultTransform(), zoom: 2 } };
    const result = assignToEmpty(frame, { 'slot-0': first }, [{ id: 'b' }, { id: 'c' }]);
    expect(result['slot-0']).toBe(first);
    expect(result['slot-1'].photoId).toBe('b');
    expect(Object.keys(result)).toHaveLength(2);
  });
  it('changing to a smaller frame maps in order and resets crops without mutating input', () => {
    const previous = composeDesign(
      frames[0],
      layouts.find((layout) => layout.id === 'grid-four')!,
    );
    const composition = assignToEmpty(previous, {}, [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ]);
    const next = changeFrame(previous, composeDesign(frames[0], layouts[0]), composition);
    expect(next['slot-0'].photoId).toBe('a');
    expect(Object.keys(next)).toHaveLength(1);
    expect(Object.keys(composition)).toHaveLength(4);
  });
});
describe('cover geometry', () => {
  it('covers portrait slots with landscape photos without stretching', () => {
    const result = coverGeometry(2000, 1000, 400, 600, defaultTransform());
    expect(result.scale).toBe(0.6);
    expect(result.offsetX).toBe(0);
  });
  it('covers a slot after 90 degree rotation and clamps available movement through normalized offsets', () => {
    const result = coverGeometry(2000, 1000, 400, 600, {
      ...defaultTransform(),
      rotation: 90,
      x: 1,
      y: -1,
    });
    expect(result.scale).toBeCloseTo(0.4);
    expect(result.offsetX).toBeCloseTo(100);
    expect(result.offsetY).toBeCloseTo(0);
  });
});
