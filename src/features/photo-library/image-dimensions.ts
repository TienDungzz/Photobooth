// Read bounded header fields before asking the browser to allocate a bitmap.
// The browser decoder remains responsible for validating the complete image.
export function imageDimensions(
  bytes: Uint8Array,
  kind: 'jpeg' | 'png' | 'webp',
): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (kind === 'png' && bytes.length >= 24)
    return { width: view.getUint32(16), height: view.getUint32(20) };
  if (kind === 'webp' && bytes.length >= 30) {
    const type = String.fromCharCode(...bytes.slice(12, 16));
    const uint24 = (at: number) => bytes[at] + (bytes[at + 1] << 8) + (bytes[at + 2] << 16);
    if (type === 'VP8X') return { width: uint24(24) + 1, height: uint24(27) + 1 };
    if (type === 'VP8 ' && bytes[23] === 0x9d && bytes[24] === 1 && bytes[25] === 0x2a)
      return {
        width: view.getUint16(26, true) & 0x3fff,
        height: view.getUint16(28, true) & 0x3fff,
      };
    if (type === 'VP8L' && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
  }
  if (kind === 'jpeg') {
    let at = 2;
    while (at + 4 <= bytes.length) {
      if (bytes[at] !== 0xff) return null;
      while (bytes[at] === 0xff) at++;
      const marker = bytes[at++];
      if (marker === 0xda || marker === 0xd9) return null;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
      if (at + 2 > bytes.length) return null;
      const length = view.getUint16(at);
      if (length < 2 || at + length > bytes.length) return null;
      if (
        [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
          marker,
        )
      ) {
        return length >= 7
          ? { width: view.getUint16(at + 5), height: view.getUint16(at + 3) }
          : null;
      }
      at += length;
    }
  }
  return null;
}
