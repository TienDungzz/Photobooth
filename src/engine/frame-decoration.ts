import type { Frame } from '../domain/types';
import { decorateMotifs } from './motif-shapes';

export function decoratePaper(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.strokeStyle = frame.accent;
  ctx.fillStyle = frame.accent;
  ctx.lineWidth = Math.max(1, width * 0.0015);
  decorateMotifs(ctx, frame, width, height);
  if (frame.pattern === 'lace') {
    ctx.globalAlpha = 0.24;
    for (let x = 0; x < width; x += width * 0.025) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += width * 0.025) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const x of [0.025, 0.975])
      for (let y = 0.04; y < 0.88; y += 0.025) {
        ctx.beginPath();
        ctx.arc(width * x, height * y, width * 0.008, 0, Math.PI * 2);
        ctx.stroke();
      }
  }
  if (frame.pattern === 'garden') {
    for (const x of [0.025, 0.975]) {
      ctx.beginPath();
      ctx.moveTo(width * x, height * 0.035);
      ctx.bezierCurveTo(
        width * (x + 0.015),
        height * 0.3,
        width * (x - 0.015),
        height * 0.6,
        width * x,
        height * 0.87,
      );
      ctx.stroke();
      for (let y = 0.07; y < 0.87; y += 0.07) {
        ctx.beginPath();
        ctx.ellipse(
          width * x,
          height * y,
          width * 0.011,
          height * 0.008,
          x < 0.5 ? -0.6 : 0.6,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.fillStyle = '#dbb872';
        ctx.beginPath();
        ctx.arc(width * x, height * (y + 0.025), width * 0.007, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = frame.accent;
      }
    }
  }
  if (frame.pattern === 'scrapbook') {
    ctx.globalAlpha = 0.14;
    for (let y = height * 0.03; y < height; y += height * 0.025) {
      ctx.beginPath();
      ctx.moveTo(width * 0.02, y);
      ctx.lineTo(width * 0.98, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const x of [0.025, 0.975])
      for (const y of [0.04, 0.86]) {
        ctx.save();
        ctx.translate(width * x, height * y);
        ctx.rotate(0.3);
        ctx.fillRect(-width * 0.018, -height * 0.006, width * 0.036, height * 0.012);
        ctx.restore();
      }
  }
  if (frame.pattern === 'stars')
    for (let index = 0; index < 18; index++) {
      const x = width * (index % 2 ? 0.975 : 0.025),
        y = height * (0.04 + Math.floor(index / 2) * 0.095),
        r = width * 0.012;
      ctx.beginPath();
      ctx.moveTo(x - r, y);
      ctx.lineTo(x + r, y);
      ctx.moveTo(x, y - r);
      ctx.lineTo(x, y + r);
      ctx.stroke();
    }
  if (frame.pattern !== 'film') {
    ctx.globalAlpha = 0.6;
    ctx.strokeRect(width * 0.012, height * 0.012, width * 0.976, height * 0.976);
  }
  ctx.restore();
}
