import type { Design } from '../domain/types';
import { slotPath } from './slot-path';

function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  solid = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = r * 0.12;
  ctx.beginPath();
  // Crossed five-point pen stroke, rather than a generic regular star sticker.
  for (let i = 0; i <= 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 4) / 5;
    const px = Math.cos(a) * r,
      py = Math.sin(a) * r;
    if (!i) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  if (solid) ctx.fill();
  ctx.stroke();
  ctx.restore();
}
function tape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-size / 2, -size * 0.2);
  ctx.lineTo(size * 0.48, -size * 0.23);
  ctx.lineTo(size * 0.4, size * 0.2);
  ctx.lineTo(-size * 0.48, size * 0.23);
  ctx.closePath();
  ctx.clip();
  const step = size / 8;
  for (let row = -2; row < 2; row++)
    for (let col = -4; col < 4; col++) {
      ctx.fillStyle = (row + col) % 2 ? '#eee7db' : '#211e21';
      ctx.fillRect(col * step, row * step, step, step);
    }
  ctx.restore();
}
function heart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, r);
  ctx.bezierCurveTo(-r * 1.9, -r * 0.6, -r * 0.7, -r * 1.4, 0, -r * 0.2);
  ctx.bezierCurveTo(r * 0.8, -r * 1.5, r * 1.8, -r * 0.6, 0, r);
  ctx.stroke();
  ctx.restore();
}
function kiwi(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#a8d87c';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff6d8';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#67754b';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(a) * r * 0.67,
      y + Math.sin(a) * r * 0.67,
      r * 0.035,
      r * 0.07,
      a,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
function clip(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.5);
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r * 0.25, -r * 0.7);
  ctx.lineTo(r * 0.25, r * 0.55);
  ctx.bezierCurveTo(r * 0.25, r * 1.15, -r * 0.6, r * 1.15, -r * 0.6, r * 0.55);
  ctx.lineTo(-r * 0.6, -r * 0.6);
  ctx.bezierCurveTo(-r * 0.6, -r * 1.2, r * 0.6, -r * 1.2, r * 0.6, -r * 0.6);
  ctx.lineTo(r * 0.6, r * 0.65);
  ctx.stroke();
  ctx.restore();
}

export function paintReference(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
  thumbnail = false,
) {
  const theme = frame.artwork?.theme;
  if (theme !== 'picnic-tiger' && theme !== 'punk-star') return false;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = frame.ink;
  ctx.strokeStyle = frame.ink;
  const slots = frame.layout.slots;
  if (theme === 'picnic-tiger') {
    if (!foreground) {
      // Collaged fabrics have different scales and directions, as in the supplied reference.
      const bands = [
        [0, 0.31, '#c5dfef'],
        [0.31, 0.56, '#cfe6b9'],
        [0.56, 0.78, '#f6d8e2'],
        [0.78, 1, '#c5dfef'],
      ] as const;
      for (const [start, end, color] of bands) {
        ctx.fillStyle = '#fffaf2';
        ctx.fillRect(0, h * start, w, h * (end - start));
        ctx.fillStyle = color;
        const step = w * (start === 0.31 ? 0.12 : 0.1);
        ctx.globalAlpha = 0.65;
        for (let x = 0; x < w; x += step * 2) ctx.fillRect(x, h * start, step, h * (end - start));
        for (let y = h * start; y < h * end; y += step * 2) ctx.fillRect(0, y, w, step);
        ctx.globalAlpha = 1;
      }
      if (frame.layout.id === 'picnic-tiger-strip') {
        const s = slots[0],
          cx = (s.x + s.width / 2) * w,
          cy = (s.y + s.height / 2) * h;
        ctx.fillStyle = '#f5be69';
        for (const dx of [-0.28, 0.28]) {
          ctx.beginPath();
          ctx.arc(cx + w * dx, cy - h * 0.07, w * 0.13, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          (s.width * w) / 2 + w * 0.055,
          (s.height * h) / 2 + w * 0.032,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    } else {
      if (frame.layout.id === 'picnic-tiger-strip') {
        const s = slots[0],
          cx = (s.x + s.width / 2) * w,
          cy = (s.y + s.height / 2) * h;
        ctx.fillStyle = '#79513b';
        for (const dx of [-0.06, 0, 0.06])
          ctx.fillRect(
            cx + w * dx - w * 0.016,
            cy - (s.height * h) / 2 - w * 0.03,
            w * 0.032,
            w * 0.065,
          );
        for (const side of [-1, 1])
          for (const dy of [-0.04, 0.01]) {
            ctx.save();
            ctx.translate(cx + side * ((s.width * w) / 2 + w * 0.02), cy + h * dy);
            ctx.rotate(side * 0.18);
            ctx.fillRect(-w * 0.032, -w * 0.014, w * 0.064, w * 0.028);
            ctx.restore();
          }
        ctx.fillStyle = '#f7a4ad';
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          ctx.roundRect(w * (0.1 + i * 0.115), h * 0.285, w * 0.115, h * 0.035, [
            0,
            0,
            w * 0.05,
            w * 0.05,
          ]);
          ctx.fill();
          ctx.fillStyle = i % 2 ? '#f7a4ad' : '#fff8ef';
        }
        ctx.save();
        const tilted = slots[2];
        ctx.translate((tilted.x + tilted.width / 2) * w, (tilted.y + tilted.height / 2) * h);
        ctx.rotate((tilted.rotation * Math.PI) / 180);
        ctx.strokeStyle = '#eda6bf';
        ctx.lineWidth = w * 0.045;
        ctx.strokeRect(
          (-tilted.width * w) / 2 - w * 0.012,
          (-tilted.height * h) / 2 - w * 0.012,
          tilted.width * w + w * 0.024,
          tilted.height * h + w * 0.024,
        );
        ctx.restore();
        const apple = slots[3];
        ctx.save();
        ctx.translate((apple.x + apple.width / 2) * w, (apple.y + apple.height / 2) * h);
        ctx.strokeStyle = '#88ce76';
        ctx.lineWidth = w * 0.055;
        ctx.stroke(applePath(apple.width * w, apple.height * h));
        ctx.restore();
      }
      for (const [x, y] of [
        [0.08, 0.35],
        [0.91, 0.53],
        [0.08, 0.79],
      ])
        kiwi(ctx, w * x, h * y, w * 0.055);
      clip(ctx, w * 0.9, h * 0.11, w * 0.065, '#4cafd0');
      clip(ctx, w * 0.13, h * 0.56, w * 0.06, '#79bc64');
      heart(ctx, w * 0.86, h * 0.77, w * 0.042, '#ef7d8b');
      star(ctx, w * 0.08, h * 0.68, w * 0.04, '#79513b', true);
      if (thumbnail) {
        ctx.fillStyle = '#f5be69';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.38, w * 0.3, h * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff8ef';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.4, w * 0.24, h * 0.085, 0, 0, Math.PI * 2);
        ctx.fill();
        kiwi(ctx, w * 0.5, h * 0.68, w * 0.2);
      }
      ctx.fillStyle = frame.ink;
      ctx.textAlign = 'center';
      ctx.font = `bold ${w * 0.035}px sans-serif`;
      ctx.fillText('HAPPY LITTLE DAYS', w * 0.5, h * 0.035, w * 0.78);
      ctx.font = `${w * 0.019}px serif`;
      ctx.fillText('a pocket full of sunshine', w * 0.5, h * 0.965, w * 0.77);
    }
  } else {
    if (!foreground) {
      ctx.fillStyle = '#e9dbcf';
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 1700; i++) {
        const x = (((i * 137) % 997) / 997) * w,
          y = (((i * 283) % 991) / 991) * h;
        ctx.fillRect(x, y, w * (i % 5 ? 0.002 : 0.014), w * 0.003);
      }
      ctx.strokeStyle = '#b5a49a';
      ctx.lineWidth = w * 0.001;
      for (let i = 0; i < 38; i++) {
        ctx.beginPath();
        ctx.moveTo((i % 2) * w, (h * i) / 38);
        ctx.lineTo(w * (0.2 + ((i * 7) % 11) / 14), h * (i / 38 + 0.06));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const s of slots) {
        ctx.save();
        ctx.translate((s.x + s.width / 2) * w, (s.y + s.height / 2) * h);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.strokeStyle = frame.accent;
        ctx.lineWidth = w * 0.025;
        ctx.strokeRect(
          (-s.width * w) / 2 - w * 0.012,
          (-s.height * h) / 2 - w * 0.012,
          s.width * w + w * 0.024,
          s.height * h + w * 0.024,
        );
        ctx.restore();
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const x = i % 2 ? 0.93 : 0.065,
          y = 0.06 + i * 0.071;
        star(
          ctx,
          w * x,
          h * y,
          w * (i % 4 === 0 ? 0.075 : 0.04),
          i % 3 === 0 ? frame.accent : frame.ink,
          i === 0,
        );
      }
      heart(ctx, w * 0.93, h * 0.13, w * 0.045, frame.accent);
      heart(ctx, w * 0.07, h * 0.41, w * 0.04, frame.accent);
      for (const [x, y] of [
        [0.065, 0.2],
        [0.93, 0.47],
      ]) {
        ctx.save();
        ctx.translate(w * x, h * y);
        ctx.strokeStyle = frame.ink;
        ctx.lineWidth = w * 0.007;
        ctx.beginPath();
        ctx.moveTo(w * 0.01, -h * 0.035);
        ctx.lineTo(-w * 0.035, h * 0.006);
        ctx.lineTo(w * 0.005, 0);
        ctx.lineTo(-w * 0.01, h * 0.035);
        ctx.lineTo(w * 0.04, -h * 0.007);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      tape(ctx, w * 0.53, h * 0.025, w * 0.32, 0.03);
      tape(ctx, w * 0.08, h * 0.32, w * 0.22, -0.65);
      tape(ctx, w * 0.92, h * 0.615, w * 0.23, 0.7);
      const bottom = Math.max(...slots.map((s) => s.y + s.height));
      if (frame.layout.id === 'punk-three-strip' || thumbnail) {
        ctx.save();
        ctx.translate(w * 0.5, h * 0.935);
        ctx.rotate(-0.13);
        ctx.textAlign = 'center';
        ctx.fillStyle = frame.ink;
        ctx.font = `italic bold ${w * 0.047}px serif`;
        ctx.fillText('shine your way', 0, -h * 0.025, w * 0.76);
        ctx.fillStyle = frame.accent;
        ctx.font = `italic 900 ${w * 0.135}px sans-serif`;
        ctx.fillText('STAR!', 0, h * 0.023, w * 0.76);
        ctx.strokeStyle = frame.accent;
        ctx.lineWidth = w * 0.009;
        ctx.beginPath();
        ctx.moveTo(-w * 0.29, h * 0.04);
        ctx.lineTo(w * 0.29, h * 0.035);
        ctx.stroke();
        ctx.restore();
      } else if (bottom < 0.94) {
        ctx.fillStyle = frame.accent;
        ctx.textAlign = 'center';
        ctx.font = `italic bold ${w * 0.04}px sans-serif`;
        ctx.fillText('SHINE YOUR WAY', w * 0.5, h * (bottom + (1 - bottom) * 0.55), w * 0.7);
      }
      if (thumbnail) star(ctx, w * 0.5, h * 0.42, w * 0.28, frame.accent, true);
      tape(ctx, w * 0.88, h * 0.975, w * 0.3, -0.5);
    }
  }
  ctx.restore();
  return true;
}

function applePath(w: number, h: number) {
  return slotPath('apple', w, h);
}
