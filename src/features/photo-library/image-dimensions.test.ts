import { describe, expect, it } from 'vitest';
import { imageDimensions } from './image-dimensions';

describe('bounded image header dimensions', () => {
  it('reads PNG size including oversized declarations before decoding', () => {
    const bytes = new Uint8Array(24);
    const view = new DataView(bytes.buffer);
    view.setUint32(16, 100000);
    view.setUint32(20, 100000);
    expect(imageDimensions(bytes, 'png')).toEqual({ width: 100000, height: 100000 });
    expect(imageDimensions(bytes.slice(0, 20), 'png')).toBeNull();
  });
  it('reads JPEG SOF and rejects truncated blocks', () => {
    const bytes = new Uint8Array([255, 216, 255, 192, 0, 8, 8, 3, 232, 3, 32, 0]);
    expect(imageDimensions(bytes, 'jpeg')).toEqual({ width: 800, height: 1000 });
    expect(imageDimensions(bytes.slice(0, 8), 'jpeg')).toBeNull();
  });
  it('reads extended WebP dimensions', () => {
    const bytes = new Uint8Array(30);
    bytes.set(new TextEncoder().encode('VP8X'), 12);
    bytes[24] = 99;
    bytes[27] = 199;
    expect(imageDimensions(bytes, 'webp')).toEqual({ width: 100, height: 200 });
  });
});
