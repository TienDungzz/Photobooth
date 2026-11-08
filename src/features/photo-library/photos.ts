import type { Photo } from '../../domain/types';
import { canvasBlob } from '../../engine/renderer';
import { imageDimensions } from './image-dimensions';

export type PhotoError = 'format' | 'size' | 'pixels' | 'decode' | 'animated';
export class InvalidPhoto extends Error {
  constructor(public code: PhotoError) {
    super(code);
  }
}
export const MAX_PHOTOS = 30;
export const MAX_SESSION_PIXELS = 32_000_000;

export function identifyImage(bytes: Uint8Array): 'jpeg' | 'png' | 'webp' | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) return 'png';
  const text = new TextDecoder('ascii').decode(bytes.slice(0, 12));
  return text.startsWith('RIFF') && text.endsWith('WEBP') ? 'webp' : null;
}

function pngAnimated(bytes: Uint8Array): boolean {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  for (let at = 8; at + 12 <= bytes.length;) {
    const length = view.getUint32(at);
    const type = String.fromCharCode(...bytes.slice(at + 4, at + 8));
    if (type === 'acTL') return true;
    if (type === 'IDAT') break;
    at += length + 12;
  }
  return false;
}

export async function importPhoto(blob: Blob, checkFile = true): Promise<Photo> {
  if (checkFile && blob instanceof File && !/\.(jpe?g|png|webp)$/i.test(blob.name))
    throw new InvalidPhoto('format');
  if (blob.size > 20 * 1024 * 1024) throw new InvalidPhoto('size');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const kind = identifyImage(bytes);
  if (!kind) throw new InvalidPhoto('format');
  const dimensions = imageDimensions(bytes, kind);
  if (!dimensions || dimensions.width < 1 || dimensions.height < 1)
    throw new InvalidPhoto('decode');
  if (dimensions.width * dimensions.height > 40_000_000) throw new InvalidPhoto('pixels');
  if (
    checkFile &&
    blob.type &&
    blob.type !== { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[kind]
  )
    throw new InvalidPhoto('format');
  if (
    (kind === 'png' && pngAnimated(bytes)) ||
    (kind === 'webp' && bytes[12] === 86 && bytes[15] === 88 && (bytes[20] & 2) !== 0)
  )
    throw new InvalidPhoto('animated');
  if (kind === 'png') {
    if (bytes.length < 24) throw new InvalidPhoto('decode');
    const view = new DataView(bytes.buffer);
    if (view.getUint32(16) * view.getUint32(20) > 40_000_000) throw new InvalidPhoto('pixels');
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  } catch {
    throw new InvalidPhoto('decode');
  }
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new InvalidPhoto('pixels');
    const factor = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * factor);
    canvas.height = Math.round(bitmap.height * factor);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new InvalidPhoto('decode');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const normalized = await canvasBlob(canvas, 'image/jpeg');
    const digest = await crypto.subtle.digest('SHA-256', await normalized.arrayBuffer());
    const fingerprint = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    const url = URL.createObjectURL(normalized);
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
    } catch {
      URL.revokeObjectURL(url);
      throw new InvalidPhoto('decode');
    }
    return {
      id: crypto.randomUUID(),
      fingerprint,
      url,
      image,
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    bitmap.close();
  }
}

export function releasePhoto(photo: Photo) {
  URL.revokeObjectURL(photo.url);
  photo.image.src = '';
}
