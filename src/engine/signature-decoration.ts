import type { Design } from '../domain/types';

/** Full-page, code-native compositions. No sliced stickers or shared corner recipe. */
export function paintSignature(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
) {
  const theme = frame.artwork?.theme;
  if (theme !== 'passport' && theme !== 'mixtape' && theme !== 'poster') return false;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = frame.ink;
  ctx.fillStyle = frame.ink;
  ctx.lineWidth = w * 0.002;
  const top = Math.min(...frame.layout.slots.map((s) => s.y));
  const bottom = Math.max(...frame.layout.slots.map((s) => s.y + s.height));
  const text = (value: string, x: number, y: number, size: number, max = 0.84) => {
    ctx.font = `bold ${w * size}px sans-serif`;
    ctx.textAlign = 'left';
    const adjusted =
      y < 0.18
        ? y * Math.min(1, (top - 0.012) / 0.18)
        : y > 0.87
          ? Math.max(y, bottom + (1 - bottom) * ((y - 0.87) / 0.13))
          : y;
    if (y < 0.18 && top < 0.13) ctx.font = `bold ${w * size * 0.45}px sans-serif`;
    ctx.fillText(value, w * x, h * adjusted, w * max);
  };
  if (theme === 'passport') {
    if (!foreground) {
      ctx.globalAlpha = 0.13;
      for (let y = 0.02; y < 1; y += 0.014) {
        ctx.beginPath();
        ctx.moveTo(0, h * y);
        ctx.bezierCurveTo(w * 0.3, h * (y + 0.03), w * 0.7, h * (y - 0.03), w, h * y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeRect(w * 0.035, h * 0.026, w * 0.93, h * 0.948);
      ctx.setLineDash([w * 0.006, w * 0.006]);
      ctx.beginPath();
      ctx.moveTo(w * 0.565, h * 0.19);
      ctx.lineTo(w * 0.565, h * 0.59);
      ctx.stroke();
    } else {
      text('MEMORY / PASSPORT', 0.08, 0.085, 0.052);
      text('DEPARTMENT OF GOOD DAYS', 0.08, 0.115, 0.015);
      if (top >= 0.2) {
        ctx.save();
        ctx.translate(w * 0.74, h * (top >= 0.2 ? 0.18 : 0.025));
        ctx.rotate(-0.16);
        ctx.strokeStyle = frame.accent;
        ctx.fillStyle = frame.accent;
        ctx.strokeRect(-w * 0.13, -w * 0.04, w * 0.27, w * 0.1);
        text('ADMIT: HAPPINESS', -0.12, 0.009, 0.018, 0.25);
        ctx.restore();
      }
      if (frame.layout.id === 'passport-entry') text('NAME: YOU & ME', 0.09, 0.62, 0.019);
      text('<<< EVERYWHERE IS BETTER TOGETHER <<<', 0.08, 0.923, 0.02);
      text('PB  000001     /     VALID FOREVER', 0.08, 0.951, 0.015);
    }
  } else if (theme === 'mixtape') {
    if (!foreground) {
      ctx.fillStyle = '#15191c';
      ctx.fillRect(w * 0.035, h * 0.025, w * 0.93, h * 0.95);
      ctx.fillStyle = frame.accent;
      const headerScale = Math.min(1, (top - 0.012) / 0.18);
      ctx.fillRect(w * 0.065, h * 0.045 * headerScale, w * 0.87, h * 0.085 * headerScale);
      ctx.strokeStyle = '#677177';
      for (const y of [0.15, 0.6, 0.87]) {
        ctx.beginPath();
        ctx.moveTo(w * 0.07, h * y);
        ctx.lineTo(w * 0.93, h * y);
        ctx.stroke();
      }
      for (const x of [0.065, 0.935])
        for (const y of [0.025, 0.975]) {
          ctx.beginPath();
          ctx.arc(w * x, h * y, w * 0.012, 0, Math.PI * 2);
          ctx.stroke();
        }
    } else {
      ctx.fillStyle = '#191e21';
      text('OUR MIXTAPE', 0.09, 0.106, 0.068);
      ctx.fillStyle = frame.ink;
      text('SIDE A', 0.08, 0.15, 0.018);
      text('FRIENDS ON REPEAT / STEREO', 0.48, 0.15, 0.016, 0.44);
      for (const x of [0.3, 0.7]) {
        if (bottom > 0.87) continue;
        ctx.beginPath();
        ctx.arc(w * x, h * 0.918, w * 0.045, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w * x, h * 0.918, w * 0.013, 0, Math.PI * 2);
        ctx.stroke();
      }
      text('90', 0.46, 0.935, 0.055, 0.14);
      text('HIGH FIDELITY MEMORIES', 0.27, 0.968, 0.014, 0.5);
    }
  } else {
    if (!foreground) {
      ctx.fillStyle = frame.accent;
      ctx.fillRect(w * 0.7, h * 0.19, w * 0.25, h * 0.31);
      ctx.fillStyle = frame.ink;
      ctx.fillRect(w * 0.08, h * 0.87, w * 0.84, h * 0.004);
    } else {
      text('US, IN PRINT.', 0.065, 0.115, 0.105);
      text('THE PERSONAL ISSUE', 0.08, 0.157, 0.017);
      if (frame.layout.id === 'cover-story') {
        text('01', 0.72, 0.325, 0.115, 0.24);
        text('GOOD', 0.72, 0.38, 0.036, 0.23);
        text('DAYS', 0.72, 0.419, 0.036, 0.23);
        text('ONLY.', 0.72, 0.458, 0.036, 0.23);
      }
      text('AN ORDINARY DAY.', 0.08, 0.915, 0.026);
      text('AN EXTRAORDINARY US.', 0.08, 0.949, 0.026);
      for (let i = 0; i < 23 && bottom < 0.89; i++)
        ctx.fillRect(w * (0.75 + i * 0.006), h * 0.903, w * (i % 3 ? 0.002 : 0.004), h * 0.05);
    }
  }
  ctx.restore();
  return true;
}
