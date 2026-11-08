import type { Design } from '../domain/types';

/** Three distinct print systems. All coordinates are drawn at export resolution. */
export function paintGraphic(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
  decorationsOnly = false,
) {
  const theme = frame.artwork?.theme;
  if (theme !== 'comic' && theme !== 'vinyl' && theme !== 'blueprint') return false;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = frame.ink;
  ctx.strokeStyle = frame.ink;
  ctx.lineWidth = w * 0.002;
  const top = Math.min(...frame.layout.slots.map((s) => s.y));
  const bottom = Math.max(...frame.layout.slots.map((s) => s.y + s.height));
  const header = Math.min(0.16, Math.max(0.025, top - 0.025));
  const footer = Math.max(0.88, bottom + 0.025);
  const label = (text: string, x: number, y: number, size: number, max = 0.85) => {
    ctx.font = `bold ${size * w}px ${theme === 'blueprint' ? 'monospace' : 'sans-serif'}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w * x, h * y, w * max);
  };
  if (theme === 'comic') {
    if (!foreground) {
      ctx.fillStyle = frame.accent;
      ctx.globalAlpha = 0.2;
      const step = w * 0.018;
      for (let row = 0, y = 0; y < h; y += step, row++)
        for (let x = ((row % 2) * step) / 2; x < w; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, w * 0.0028, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = frame.ink;
      ctx.lineWidth = w * 0.012;
      ctx.strokeRect(w * 0.025, h * 0.023, w * 0.95, h * 0.954);
      // Paper margins and panel outlines follow the chosen slots, including rotations.
      for (const s of frame.layout.slots) {
        ctx.save();
        ctx.translate((s.x + s.width / 2) * w, (s.y + s.height / 2) * h);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.fillStyle = '#fffdf4';
        ctx.fillRect(
          (-s.width * w) / 2 - w * 0.009,
          (-s.height * h) / 2 - w * 0.009,
          s.width * w + w * 0.018,
          s.height * h + w * 0.018,
        );
        ctx.strokeRect(
          (-s.width * w) / 2 - w * 0.009,
          (-s.height * h) / 2 - w * 0.009,
          s.width * w + w * 0.018,
          s.height * h + w * 0.018,
        );
        ctx.restore();
      }
    } else {
      if (decorationsOnly) {
        ctx.fillStyle = frame.accent;
        ctx.save();
        ctx.translate(w * 0.5, h * 0.48);
        ctx.rotate(-0.1);
        ctx.fillRect(-w * 0.32, -h * 0.08, w * 0.64, h * 0.16);
        ctx.fillStyle = '#fffdf4';
        label('WOW!', -0.25, 0, 0.16, 0.55);
        ctx.restore();
      }
      ctx.fillStyle = frame.accent;
      label('WHAT A DAY!', 0.065, header * 0.48, header < 0.09 ? 0.035 : 0.075);
      ctx.fillStyle = frame.ink;
      label('THE ADVENTURES OF US', 0.07, header * 0.87, 0.014);
      if (footer < 0.96) label('TO BE CONTINUED...', 0.07, footer + (1 - footer) * 0.4, 0.027);
      if (frame.layout.id === 'comic-sequence') {
        ctx.fillStyle = frame.accent;
        ctx.fillRect(w * 0.57, h * 0.466, w * 0.17, h * 0.055);
        ctx.fillStyle = '#fffdf4';
        label('MEANWHILE...', 0.585, 0.494, 0.018, 0.15);
      }
    }
  } else if (theme === 'vinyl') {
    if (!foreground) {
      ctx.fillStyle = frame.accent;
      ctx.fillRect(w * 0.025, 0, w * 0.018, h);
      ctx.strokeRect(w * 0.065, h * 0.035, w * 0.89, h * 0.93);
      if (frame.layout.id === 'vinyl-sleeve') {
        const s = frame.layout.slots[0],
          cx = (s.x + s.width / 2) * w,
          cy = (s.y + s.height / 2) * h;
        const radius = (s.width * w) / 2;
        ctx.fillStyle = '#1e2524';
        ctx.beginPath();
        ctx.arc(cx, cy, radius + w * 0.04, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#68706b';
        ctx.lineWidth = w * 0.001;
        for (let r = radius + w * 0.009; r < radius + w * 0.037; r += w * 0.004) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else {
      if (decorationsOnly) {
        ctx.fillStyle = '#202624';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, w * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#66706a';
        ctx.lineWidth = w * 0.002;
        for (let r = w * 0.15; r < w * 0.33; r += w * 0.013) {
          ctx.beginPath();
          ctx.arc(w * 0.5, h * 0.48, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = frame.accent;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, w * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = frame.background;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, w * 0.018, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = frame.accent;
      label('ON THE RECORD', 0.09, header * 0.46, header < 0.09 ? 0.03 : 0.06);
      ctx.fillStyle = frame.ink;
      label('ORIGINAL MEMORIES / LONG PLAY', 0.09, header * 0.85, 0.014);
      if (frame.layout.id === 'vinyl-sleeve') {
        label('SIDE B', 0.66, 0.765, 0.026, 0.24);
        label('YOU / ME / ON REPEAT', 0.66, 0.81, 0.012, 0.25);
      }
      if (footer < 0.96) {
        label('33 1/3 RPM', 0.09, footer + (1 - footer) * 0.35, 0.018);
        label('STEREO / KEEP FOREVER', 0.57, footer + (1 - footer) * 0.35, 0.014, 0.35);
      }
    }
  } else {
    if (!foreground) {
      const step = w * 0.025;
      ctx.lineWidth = w * 0.0007;
      ctx.globalAlpha = 0.18;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = w * 0.0015;
      ctx.strokeRect(w * 0.035, h * 0.035, w * 0.93, h * 0.93);
      for (const s of frame.layout.slots) {
        const x = s.x * w,
          y = s.y * h,
          sw = s.width * w,
          sh = s.height * h;
        ctx.setLineDash([w * 0.004, w * 0.004]);
        ctx.strokeRect(x - w * 0.01, y - w * 0.01, sw + w * 0.02, sh + w * 0.02);
        ctx.setLineDash([]);
        for (const [cx, cy] of [
          [x, y],
          [x + sw, y + sh],
        ]) {
          ctx.beginPath();
          ctx.moveTo(cx - w * 0.014, cy);
          ctx.lineTo(cx + w * 0.014, cy);
          ctx.moveTo(cx, cy - w * 0.014);
          ctx.lineTo(cx, cy + w * 0.014);
          ctx.stroke();
        }
      }
    } else {
      label('MEMORY STUDY', 0.07, header * 0.45, header < 0.09 ? 0.025 : 0.05);
      ctx.fillStyle = frame.accent;
      label('DRAWN FROM LIFE / SHEET 01', 0.07, header * 0.85, 0.013);
      if (frame.layout.id === 'blueprint-study') {
        ctx.strokeRect(w * 0.1, h * 0.735, w * 0.8, h * 0.095);
        for (const x of [0.48, 0.7]) {
          ctx.beginPath();
          ctx.moveTo(w * x, h * 0.735);
          ctx.lineTo(w * x, h * 0.83);
          ctx.stroke();
        }
        label('SUBJECT: OUR GOOD DAYS', 0.12, 0.766, 0.014, 0.35);
        label('SCALE 1:1', 0.5, 0.766, 0.014, 0.18);
        label('REV. 01', 0.73, 0.766, 0.014, 0.14);
        label('DETAILS WORTH REMEMBERING', 0.12, 0.805, 0.012, 0.6);
      }
      if (footer < 0.96)
        label('PB / ARCHIVE OF EVERYDAY LIFE', 0.07, footer + (1 - footer) * 0.4, 0.014);
    }
  }
  ctx.restore();
  return true;
}
