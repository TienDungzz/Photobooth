import type { Design, Frame } from '../domain/types';
import { stickerRecipes } from './artwork-recipes';
import { paintExpressivePaper } from './expressive-paper';
import { paintOccasionPaper } from './occasion-decoration';
import { paintSignature } from './signature-decoration';
import { paintGraphic } from './graphic-decoration';
import { paintCraft } from './craft-decoration';
import { paintReference } from './reference-decoration';
import { paintInspired } from './inspired-decoration';
import { paintOrnamentPaper } from './ornament-paper';
const cache = new Map<string, Promise<HTMLImageElement>>();
let fontsReady: Promise<unknown> | undefined;
const thumbnails: Record<string, string> = {
  '/artwork/nocturne-atlas.webp': '/artwork/nocturne-thumb.webp',
  '/artwork/halloween-atlas.webp': '/artwork/halloween-thumb.webp',
  '/artwork/vow-atlas.webp': '/artwork/vow-thumb.webp',
  '/artwork/afterhours-atlas.webp': '/artwork/afterhours-thumb.webp',
  '/artwork/playdate-atlas.webp': '/artwork/playdate-thumb.webp',
  '/artwork/zine-atlas.webp': '/artwork/zine-thumb.webp',
  '/artwork/ballet-atlas.webp': '/artwork/ballet-thumb.webp',
  '/artwork/herbarium-atlas.webp': '/artwork/herbarium-thumb.webp',
  '/artwork/seaside-atlas.webp': '/artwork/seaside-thumb.webp',
  '/artwork/cherry-atlas.webp': '/artwork/cherry-thumb.webp',
  '/artwork/coquette-atlas.webp': '/artwork/coquette-thumb.webp',
  '/artwork/chrome-atlas.webp': '/artwork/chrome-thumb.webp',
  '/artwork/memo-atlas.webp': '/artwork/memo-thumb.webp',
};
export async function loadArtwork(
  frame: Frame,
  thumbnail = false,
): Promise<HTMLImageElement | undefined> {
  if (frame.artwork) {
    fontsReady ??= Promise.all([
      document.fonts.load('16px "Noto Serif Variable"'),
      document.fonts.load('italic 16px "Noto Serif Variable"'),
    ]);
    await fontsReady;
  }
  const source = frame.artwork?.atlas;
  if (!source) return;
  const url = thumbnail ? (thumbnails[source] ?? source) : source;
  if (!cache.has(url))
    cache.set(
      url,
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => {
          cache.delete(url);
          reject(new Error('Artwork unavailable'));
        };
        image.src = url;
      }),
    );
  return cache.get(url);
}
function sticker(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cell: number,
  x: number,
  y: number,
  size: number,
  angle = 0,
) {
  const sw = image.naturalWidth / 3,
    sh = image.naturalHeight / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(
    image,
    (cell % 3) * sw,
    Math.floor(cell / 3) * sh,
    sw,
    sh,
    -size / 2,
    -size / 2,
    size,
    size,
  );
  ctx.restore();
}
export function artPaper(ctx: CanvasRenderingContext2D, frame: Design, w: number, h: number) {
  if (paintSignature(ctx, frame, w, h, false)) return;
  if (paintGraphic(ctx, frame, w, h, false)) return;
  if (paintCraft(ctx, frame, w, h, false)) return;
  if (paintReference(ctx, frame, w, h, false)) return;
  if (paintInspired(ctx, frame, w, h, false)) return;
  if (paintOrnamentPaper(ctx, frame, w, h, false)) return;
  const art = frame.artwork;
  if (!art) return;
  ctx.save();
  ctx.strokeStyle = frame.accent;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = w * 0.001;
  if (paintExpressivePaper(ctx, frame, w, h) || paintOccasionPaper(ctx, frame, w, h)) {
    ctx.globalAlpha = 0.7;
  } else if (art.theme === 'ballet') {
    for (let x = 0; x < w; x += w * 0.032) {
      ctx.fillStyle = frame.accent;
      ctx.fillRect(x, 0, w * 0.012, h);
    }
    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = '#fffdf8';
    ctx.lineWidth = w * 0.004;
    for (let y = h * 0.04; y < h * 0.97; y += w * 0.026)
      for (const x of [w * 0.043, w * 0.957]) {
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.013, w * 0.019, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
  } else if (art.theme === 'herbarium') {
    ctx.fillStyle = frame.accent;
    for (let i = 0; i < 800; i++) {
      const x = (((i * 127.31) % 997) / 997) * w;
      const y = (((i * 293.71) % 991) / 991) * h;
      ctx.fillRect(x, y, w * 0.0015, w * 0.0015);
    }
    ctx.strokeRect(w * 0.055, h * 0.035, w * 0.89, h * 0.93);
  } else if (art.theme === 'seaside') {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#cdebe755');
    gradient.addColorStop(1, '#f2dfb955');
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.25;
    for (let y = h * 0.02; y < h; y += h * 0.035) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y - h * 0.02, w * 0.7, y + h * 0.02, w, y);
      ctx.stroke();
    }
  } else if (art.theme === 'cherry') {
    const size = w * 0.025;
    ctx.fillStyle = frame.ink;
    for (let y = 0; y < h; y += size)
      for (let x = 0; x < w; x += size) {
        if (x > w * 0.06 && x < w * 0.94) continue;
        ctx.globalAlpha = (Math.round(x / size) + Math.round(y / size)) % 2 ? 0.09 : 0.23;
        ctx.fillRect(x, y, size, size);
      }
  } else if (art.theme === 'coquette')
    for (let x = 0; x < w; x += w * 0.025) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  else if (art.theme === 'chrome') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#e5d2f466');
    g.addColorStop(0.5, '#b2e7ec66');
    g.addColorStop(1, '#e8bde866');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else
    for (let y = h * 0.015; y < h; y += h * 0.014) {
      ctx.beginPath();
      ctx.moveTo(w * 0.025, y);
      ctx.lineTo(w * 0.975, y);
      ctx.stroke();
    }
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = w * 0.002;
  ctx.strokeRect(w * 0.025, h * 0.018, w * 0.95, h * 0.964);
  ctx.setLineDash([w * 0.003, w * 0.006]);
  ctx.strokeRect(w * 0.037, h * 0.027, w * 0.926, h * 0.946);
  ctx.restore();
}
export function artForeground(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  image?: HTMLImageElement,
  decorationsOnly = false,
) {
  if (paintSignature(ctx, frame, w, h, true)) return;
  if (paintGraphic(ctx, frame, w, h, true, decorationsOnly)) return;
  if (paintCraft(ctx, frame, w, h, true, decorationsOnly)) return;
  if (paintReference(ctx, frame, w, h, true, decorationsOnly)) return;
  if (paintInspired(ctx, frame, w, h, true, decorationsOnly)) return;
  if (paintOrnamentPaper(ctx, frame, w, h, true, decorationsOnly)) return;
  const art = frame.artwork;
  if (!art) return;
  const roomyHeader =
    decorationsOnly || Math.min(...frame.layout.slots.map((slot) => slot.y)) >= 0.13;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = frame.ink;
  const punchy = art.theme === 'afterhours' || art.theme === 'playdate' || art.theme === 'zine';
  const serif = !punchy && art.theme !== 'chrome' && art.theme !== 'cinema';
  ctx.font =
    (serif ? 'italic ' : 'bold ') +
    w * (roomyHeader ? (punchy ? 0.063 : 0.047) : 0.026) +
    (punchy ? 'px sans-serif' : 'px "Noto Serif Variable", Georgia, serif');
  ctx.fillText(art.title, w * 0.5, h * (roomyHeader ? 0.067 : 0.025), w * 0.73);
  ctx.font = w * 0.012 + 'px sans-serif';
  if (roomyHeader) ctx.fillText(art.subtitle, w * 0.5, h * 0.102, w * 0.7);
  ctx.font = 'italic ' + w * 0.025 + 'px "Noto Serif Variable", Georgia, serif';
  ctx.fillText(frame.stamp, w * 0.5, h * 0.915, w * 0.72);
  ctx.font = w * 0.012 + 'px sans-serif';
  ctx.fillText('PHOTOBOOTH / MADE OF LITTLE MOMENTS', w * 0.5, h * 0.947, w * 0.75);
  const recipe = stickerRecipes[art.theme];
  if (image && recipe) {
    for (const [cell, x, y, size, rotation] of recipe.stickers) {
      const header = y < 0.2;
      sticker(
        ctx,
        image,
        cell,
        w * x,
        h * (header && !roomyHeader ? y * 0.4 : y),
        w * (header && !roomyHeader ? size * 0.55 : size),
        rotation,
      );
    }
    if (decorationsOnly) {
      sticker(ctx, image, recipe.thumbnailCell, w * 0.5, h * 0.43, w * 0.58);
      sticker(ctx, image, recipe.slotCell, w * 0.76, h * 0.65, w * 0.2, 0.12);
    } else if (frame.layout.slots.length <= 6) {
      frame.layout.slots.forEach((slot, i) => {
        if (i % 2) return;
        sticker(
          ctx,
          image,
          recipe.slotCell,
          (slot.x + slot.width) * w,
          (slot.y + slot.height * 0.05) * h,
          Math.min(w * 0.11, slot.width * w * 0.32),
          0.12,
        );
      });
    }
  } else if (image) {
    sticker(
      ctx,
      image,
      0,
      w * 0.15,
      h * (roomyHeader ? 0.08 : 0.035),
      w * (roomyHeader ? 0.24 : 0.12),
      -0.12,
    );
    sticker(
      ctx,
      image,
      2,
      w * 0.88,
      h * (roomyHeader ? 0.13 : 0.045),
      w * (roomyHeader ? 0.2 : 0.11),
      0.15,
    );
    sticker(ctx, image, art.theme === 'chrome' ? 5 : 4, w * 0.86, h * 0.895, w * 0.25, 0.1);
    sticker(ctx, image, 3, w * 0.16, h * 0.89, w * 0.24, -0.1);
    if (decorationsOnly) {
      sticker(ctx, image, 1, w * 0.5, h * 0.43, w * 0.6);
      sticker(ctx, image, 5, w * 0.75, h * 0.65, w * 0.24);
    } else if (frame.layout.slots.length <= 6)
      frame.layout.slots.forEach((slot, i) => {
        if (i % 2) return;
        sticker(
          ctx,
          image,
          art.theme === 'memo' ? 3 : art.theme === 'chrome' ? 3 : 2,
          (slot.x + slot.width) * w,
          (slot.y + slot.height * 0.05) * h,
          Math.min(w * 0.13, slot.width * w * 0.38),
          0.1,
        );
      });
  }
  if (art.theme === 'cinema') {
    ctx.strokeStyle = frame.ink;
    ctx.lineWidth = w * 0.002;
    ctx.setLineDash([w * 0.008, w * 0.006]);
    for (const y of [roomyHeader ? 0.125 : 0.04, 0.865]) {
      ctx.beginPath();
      ctx.moveTo(w * 0.035, h * y);
      ctx.lineTo(w * 0.965, h * y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = frame.ink;
    for (let i = 0; i < 38; i++) {
      const x = w * (0.35 + i * 0.008);
      ctx.fillRect(x, h * 0.965, w * (i % 3 === 0 ? 0.004 : 0.0015), h * 0.014);
    }
  }
  ctx.restore();
}
