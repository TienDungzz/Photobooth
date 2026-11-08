import { canvasBlob } from '../../engine/renderer';

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Recompress only IDAT: pixels, alpha and colour metadata remain byte-for-byte intact. */
async function optimizePng(original: Blob): Promise<Blob> {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    return original;
  }
  const bytes = new Uint8Array(await original.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  const imageData: Uint8Array<ArrayBuffer>[] = [];
  let insertAt = -1;
  for (let offset = 8; offset < bytes.length;) {
    const length = view.getUint32(offset);
    const end = offset + length + 12;
    if (end > bytes.length) return original;
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    if (type === 'IDAT') {
      if (insertAt === -1) insertAt = chunks.length;
      imageData.push(bytes.slice(offset + 8, end - 4));
    } else chunks.push(bytes.slice(offset, end));
    offset = end;
  }
  if (insertAt === -1) return original;
  const stream = new Blob(imageData)
    .stream()
    .pipeThrough(new DecompressionStream('deflate'))
    .pipeThrough(new CompressionStream('deflate'));
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
  const chunk = new Uint8Array(compressed.length + 12);
  const header = new DataView(chunk.buffer);
  header.setUint32(0, compressed.length);
  chunk.set([73, 68, 65, 84], 4);
  chunk.set(compressed, 8);
  header.setUint32(chunk.length - 4, crc32(chunk.subarray(4, chunk.length - 4)));
  chunks.splice(insertAt, 0, chunk);
  const optimized = new Blob([bytes.slice(0, 8), ...chunks], { type: 'image/png' });
  return optimized.size < original.size ? optimized : original;
}

export async function optimizedExport(canvas: HTMLCanvasElement, format: 'png' | 'jpeg') {
  if (format === 'jpeg') {
    // Encode from the rendered canvas, never recompress an already lossy JPEG.
    return canvasBlob(canvas, 'image/jpeg', 0.92);
  }
  const original = await canvasBlob(canvas);
  try {
    return await optimizePng(original);
  } catch {
    // A compression failure must not prevent downloading the valid original.
    return original;
  }
}
