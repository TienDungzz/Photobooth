import type { Slot } from '../domain/types';
import { slotPath } from './slot-path';
import { sparkle } from './inspired-motifs';

export function hasOrnament(slot: Slot) {
  return ['lace', 'filigree', 'star-curtain', 'glow-hearts', 'glow-flowers'].includes(
    slot.treatment ?? '',
  );
}

/** The padding is part of the decorative footprint, not the photo's crop rectangle. */
export function ornamentPadding(w: number, h: number) {
  return Math.min(w, h) * 0.16;
}

export function paintOrnament(
  ctx: CanvasRenderingContext2D,
  slot: Slot,
  w: number,
  h: number,
  foreground: boolean,
  layoutOnly = false,
) {
  if (!hasOrnament(slot)) return false;
  const pad = ornamentPadding(w, h),
    small = Math.min(w, h);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const color = layoutOnly ? '#936c7b' : '#fff6ee';
  const path = slotPath(slot.mask, w, h);
  if (!foreground) {
    ctx.strokeStyle = slot.treatment?.startsWith('glow') ? '#87719c55' : '#9f94a177';
    ctx.lineWidth = pad * 0.5;
    ctx.shadowColor = '#20132444';
    ctx.shadowBlur = pad * 0.35;
    ctx.stroke(path);
    ctx.restore();
    return true;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = small * 0.004;
  ctx.stroke(path);
  const perimeter = (
    count: number,
    draw: (x: number, y: number, angle: number, index: number) => void,
  ) => {
    for (let i = 0; i < count; i++) {
      const t = i / count;
      if (slot.mask === 'ellipse') {
        const a = t * Math.PI * 2;
        draw(Math.cos(a) * (w / 2 + pad * 0.35), Math.sin(a) * (h / 2 + pad * 0.35), a, i);
      } else {
        const distance = t * (2 * w + 2 * h);
        if (distance < w) draw(-w / 2 + distance, -h / 2 - pad * 0.3, -Math.PI / 2, i);
        else if (distance < w + h) draw(w / 2 + pad * 0.3, -h / 2 + distance - w, 0, i);
        else if (distance < 2 * w + h)
          draw(w / 2 - (distance - w - h), h / 2 + pad * 0.3, Math.PI / 2, i);
        else draw(-w / 2 - pad * 0.3, h / 2 - (distance - 2 * w - h), Math.PI, i);
      }
    }
  };
  if (slot.treatment === 'lace') {
    const count = Math.max(28, Math.round(((w + h) / small) * 24));
    perimeter(count, (x, y, a) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.strokeStyle = color;
      ctx.lineWidth = small * 0.003;
      ctx.beginPath();
      ctx.ellipse(0, 0, pad * 0.42, pad * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, pad * 0.23, pad * 0.14, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (const dy of [-0.27, 0, 0.27]) {
        ctx.beginPath();
        ctx.arc(pad * 0.44, pad * dy, pad * 0.045, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      ctx.restore();
    });
  } else if (slot.treatment === 'filigree') {
    ctx.setLineDash([small * 0.003, small * 0.012]);
    ctx.strokeRect(-w / 2 - pad * 0.25, -h / 2 - pad * 0.25, w + pad * 0.5, h + pad * 0.5);
    ctx.setLineDash([]);
    for (const sx of [-1, 1])
      for (const sy of [-1, 1]) {
        ctx.save();
        ctx.translate((sx * w) / 2, (sy * h) / 2);
        ctx.scale(sx, sy);
        ctx.lineWidth = small * 0.004;
        ctx.beginPath();
        ctx.moveTo(-pad * 1.2, -pad * 0.05);
        ctx.bezierCurveTo(-pad * 0.7, pad * 0.8, pad * 0.7, pad * 0.7, pad * 0.05, -pad * 1.2);
        ctx.stroke();
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(
            -pad * (0.2 + i * 0.35),
            pad * 0.18,
            pad * 0.25,
            pad * 0.09,
            -0.4,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(
            pad * 0.18,
            -pad * (0.2 + i * 0.35),
            pad * 0.09,
            pad * 0.25,
            0.4,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, pad * 0.17, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
  } else if (slot.treatment === 'star-curtain') {
    for (let i = 0; i < 7; i++) {
      const x = w * (-0.43 + i * 0.143),
        drop = pad * (0.15 + ((i * 3) % 5) * 0.23),
        y = -h / 2 + drop;
      ctx.lineWidth = small * 0.0025;
      ctx.beginPath();
      ctx.moveTo(x, -h / 2 - pad * 0.85);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.fill(slotPath('star', pad * 0.42, pad * 0.42));
      ctx.restore();
    }
    for (let i = 0; i < 5; i++)
      sparkle(ctx, -w * 0.4 + i * w * 0.2, h / 2 + pad * 0.15, pad * 0.12, color);
  } else {
    const flower = slot.treatment === 'glow-flowers',
      count = flower ? 10 : 14;
    perimeter(count, (x, y, a, i) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2);
      const r = pad * (flower ? 0.6 : 0.52),
        tint = layoutOnly
          ? '#936c7b'
          : (flower ? ['#d7fff1', '#fce0fa', '#e6ddff'] : ['#ffcee9', '#e0dcff', '#ffdeef'])[i % 3];
      const motif = new Path2D();
      if (flower) {
        for (let n = 0; n <= 100; n++) {
          const angle = (n / 100) * Math.PI * 2,
            radius = r * (0.72 + 0.22 * Math.cos(angle * 5));
          const px = Math.cos(angle) * radius,
            py = Math.sin(angle) * radius;
          if (!n) motif.moveTo(px, py);
          else motif.lineTo(px, py);
        }
        motif.closePath();
      } else motif.addPath(slotPath('heart', r * 1.6, r * 1.6));
      ctx.strokeStyle = tint;
      ctx.lineWidth = small * 0.014;
      ctx.shadowColor = tint;
      ctx.shadowBlur = small * 0.035;
      ctx.stroke(motif);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = layoutOnly ? tint : '#fff5ff';
      ctx.lineWidth = small * 0.003;
      ctx.stroke(motif);
      if (flower) {
        for (let petal = 0; petal < 6; petal++) {
          const angle = (petal * Math.PI) / 3;
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(angle) * r * 0.22,
            Math.sin(angle) * r * 0.22,
            r * 0.21,
            r * 0.07,
            angle,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }
      ctx.restore();
      sparkle(
        ctx,
        x + pad * 0.4 * Math.cos(a),
        y + pad * 0.4 * Math.sin(a),
        pad * 0.08,
        layoutOnly ? '#936c7b' : '#fff5e6',
      );
    });
  }
  ctx.restore();
  return true;
}
