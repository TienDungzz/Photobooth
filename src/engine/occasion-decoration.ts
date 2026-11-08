import type { Design, Slot } from '../domain/types';

export function occasionMatte(frame: Design): string | undefined {
  if (frame.artwork?.theme === 'nocturne') return '#4f435c';
  if (frame.artwork?.theme === 'halloween') return '#8b613d';
  if (frame.artwork?.theme === 'vow') return '#fffdf7';
}

export function paintOccasionPaper(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
): boolean {
  const theme = frame.artwork?.theme;
  if (theme !== 'nocturne' && theme !== 'halloween' && theme !== 'vow') return false;
  ctx.save();
  if (theme === 'nocturne') {
    ctx.globalAlpha = 1;
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, h * 0.7);
    glow.addColorStop(0, '#51416c55');
    glow.addColorStop(1, '#17172800');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = frame.accent;
    ctx.fillStyle = frame.accent;
    ctx.lineWidth = w * 0.0015;
    ctx.globalAlpha = 0.6;
    for (const x of [w * 0.055, w * 0.945])
      for (let y = h * 0.05; y < h * 0.96; y += h * 0.055) {
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.012, h * 0.023, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y + h * 0.027, w * 0.0025, 0, Math.PI * 2);
        ctx.fill();
      }
  } else if (theme === 'halloween') {
    ctx.strokeStyle = '#c7955b';
    ctx.lineWidth = w * 0.0015;
    ctx.globalAlpha = 0.45;
    for (const side of [0, 1]) {
      ctx.save();
      ctx.translate(side * w, 0);
      ctx.scale(side ? -1 : 1, 1);
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.025 * i, 0, Math.PI / 2);
        ctx.stroke();
      }
      for (let i = 0; i <= 5; i++) {
        const a = (i * Math.PI) / 10;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * w * 0.15, Math.sin(a) * w * 0.15);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle = '#fff4d7';
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 450; i++)
      ctx.fillRect(
        (((i * 79) % 997) / 997) * w,
        (((i * 193) % 991) / 991) * h,
        w * 0.0018,
        w * 0.0018,
      );
  } else {
    ctx.fillStyle = '#fffefa';
    ctx.globalAlpha = 0.65;
    for (let i = 0; i < 4; i++) {
      const offset = i * w * 0.018;
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.bezierCurveTo(
        w * 0.24 + offset,
        h * 0.26,
        -w * 0.16 + offset,
        h * 0.68,
        w * 0.22 + offset,
        h,
      );
      ctx.lineTo(w * 0.29 + offset, h);
      ctx.bezierCurveTo(
        -w * 0.08 + offset,
        h * 0.64,
        w * 0.31 + offset,
        h * 0.28,
        w * 0.07 + offset,
        0,
      );
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
  return true;
}

export function paintOccasionBorder(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  slot: Slot,
  path: Path2D,
  w: number,
  h: number,
  canvasWidth: number,
) {
  const theme = frame.artwork?.theme;
  if (theme !== 'nocturne' && theme !== 'halloween' && theme !== 'vow') return;
  ctx.save();
  ctx.strokeStyle = frame.accent;
  ctx.lineWidth = Math.max(1, canvasWidth * 0.0018);
  ctx.stroke(path);
  ctx.save();
  ctx.scale(1.018, 1.018);
  ctx.globalAlpha = 0.65;
  ctx.stroke(path);
  ctx.restore();
  if (
    frame.layout.slots.length <= 6 &&
    ['rect', 'rounded', 'stamp', 'arch', 'torn'].includes(slot.mask)
  ) {
    const size = Math.min(w, h) * 0.07;
    ctx.lineWidth = canvasWidth * 0.0016;
    for (const x of [-1, 1])
      for (const y of [-1, 1]) {
        if (slot.mask === 'arch' && y === -1) continue;
        ctx.save();
        ctx.translate((x * w) / 2, (y * h) / 2);
        ctx.scale(x, y);
        ctx.beginPath();
        ctx.moveTo(-size * 0.9, 0);
        ctx.bezierCurveTo(-size * 0.2, -size * 0.65, -size * 0.6, -size * 0.9, 0, -size * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-size * 0.42, -size * 0.42, size * 0.13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
  }
  ctx.restore();
}
