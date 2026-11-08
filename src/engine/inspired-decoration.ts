import type { Design } from '../domain/types';
import { slotPath } from './slot-path';
import { bow, bunny, cloud, sprig, butterfly, sparkle } from './inspired-motifs';

export function paintInspired(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
  thumbnail = false,
) {
  const theme = frame.artwork?.theme;
  if (!['candy-sky', 'field-notes', 'luminous', 'denim-bunny', 'marquee'].includes(theme ?? ''))
    return false;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = frame.ink;
  ctx.fillStyle = frame.ink;
  ctx.lineWidth = w * 0.002;
  const slots = frame.layout.slots,
    top = Math.min(...slots.map((s) => s.y)),
    bottom = Math.max(...slots.map((s) => s.y + s.height));
  const title = (value: string, color = frame.ink) => {
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic 500 ${w * (top < 0.1 ? 0.023 : 0.04)}px "Noto Serif Variable", serif`;
    ctx.fillText(value, w * 0.5, h * (thumbnail ? 0.07 : Math.min(0.07, top * 0.4)), w * 0.76);
  };
  if (theme === 'candy-sky') {
    if (!foreground) {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#f6b4d2');
      gradient.addColorStop(0.6, '#f5d5e7');
      gradient.addColorStop(1, '#a9c6e5');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff3fa';
      ctx.globalAlpha = 0.4;
      const step = w * 0.055;
      for (let x = 0; x < w; x += step * 2) ctx.fillRect(x, h * 0.34, step, h * 0.33);
      for (let y = h * 0.34; y < h * 0.67; y += step * 2) ctx.fillRect(0, y, w, step);
      ctx.globalAlpha = 1;
      for (const s of slots) {
        ctx.save();
        ctx.translate((s.x + s.width / 2) * w, (s.y + s.height / 2) * h);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.strokeStyle = s.y > 0.7 ? '#4c7fa4' : '#c37198';
        ctx.lineWidth = w * 0.012;
        ctx.stroke(slotPath(s.mask, s.width * w + w * 0.012, s.height * h + w * 0.012));
        ctx.restore();
      }
    } else {
      for (const [x, y, r] of [
        [0.08, 0.08, 0.07],
        [0.5, 0.31, 0.06],
        [0.93, 0.08, 0.055],
        [0.08, 0.69, 0.045],
      ])
        cloud(ctx, w * x, h * y, w * r, '#fff9fb');
      for (const [x, y] of [
        [0.13, 0.16],
        [0.47, 0.13],
        [0.86, 0.72],
      ]) {
        ctx.strokeStyle = '#49799e';
        ctx.beginPath();
        ctx.moveTo(w * x, 0);
        ctx.lineTo(w * x, h * y);
        ctx.stroke();
        sparkle(ctx, w * x, h * y, w * 0.03, '#447aa3');
      }
      if (frame.layout.id === 'candy-six-scenes') {
        bow(ctx, w * 0.32, h * 0.73, w * 0.055, '#df779c');
        bunny(ctx, w * 0.91, h * 0.94, w * 0.065, '#f5edf1');
      }
      if (thumbnail) {
        cloud(ctx, w * 0.5, h * 0.4, w * 0.25, '#fff9fb');
        bow(ctx, w * 0.5, h * 0.7, w * 0.18, '#dd8faf');
      }
      title('candy sky club');
    }
  } else if (theme === 'field-notes') {
    if (!foreground) {
      ctx.fillStyle = '#ccc4b3';
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 650; i++)
        ctx.fillRect(
          (((i * 173) % 997) / 997) * w,
          (((i * 313) % 991) / 991) * h,
          w * 0.002,
          w * 0.001,
        );
      ctx.globalAlpha = 1;
      // Torn paper collage on the margins, preserving a quieter photo area.
      ctx.fillStyle = '#a8ad8d';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.17, 0);
      for (let i = 0; i <= 30; i++) ctx.lineTo(w * (0.09 + ((i * 7) % 9) * 0.006), (h * i) / 30);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f5f0e5';
      ctx.fillRect(w * 0.2, h * 0.04, w * 0.75, h * 0.92);
    } else {
      sprig(ctx, w * 0.08, h * 0.23, w * 0.11);
      sprig(ctx, w * 0.92, h * 0.76, w * 0.12);
      sprig(ctx, w * 0.12, h * 0.87, w * 0.1);
      for (const [x, y, a] of [
        [0.17, 0.15, -0.3],
        [0.86, 0.15, 0.3],
        [0.16, 0.87, 0.2],
      ]) {
        ctx.save();
        ctx.translate(w * x, h * y);
        ctx.rotate(a);
        ctx.fillStyle = '#a1ad89';
        ctx.fillRect(-w * 0.07, -w * 0.025, w * 0.14, w * 0.05);
        ctx.strokeStyle = '#f3eddb';
        ctx.lineWidth = w * 0.008;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.moveTo(w * i * 0.024, -w * 0.025);
          ctx.lineTo(w * i * 0.024, w * 0.025);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (thumbnail) {
        sprig(ctx, w * 0.5, h * 0.52, w * 0.24);
      }
      title('field notes');
      if (bottom < 0.91 || thumbnail) {
        ctx.fillStyle = frame.ink;
        ctx.font = `italic ${w * 0.024}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('little things worth keeping', w * 0.5, h * 0.96, w * 0.8);
      }
    }
  } else if (theme === 'luminous') {
    if (!foreground) {
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.75);
      glow.addColorStop(0, '#171626');
      glow.addColorStop(1, '#49334e');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.shadowColor = '#e6abea';
      ctx.shadowBlur = w * 0.025;
      const motifs = [
        [0.08, 0.15, 0.07],
        [0.89, 0.1, 0.065],
        [0.93, 0.76, 0.07],
        [0.1, 0.88, 0.065],
      ];
      for (const [x, y, r] of motifs) {
        ctx.shadowColor = y > 0.6 ? '#99e8e2' : '#f0b3e6';
        butterfly(ctx, w * x, h * y, w * r, y > 0.6 ? '#ceffff' : '#ffe2ff');
      }
      for (let i = 0; i < 56; i++) {
        const side = i % 4,
          t = (i * 0.173) % 1,
          x =
            side === 0 ? 0.04 + t * 0.92 : side === 1 ? 0.96 : side === 2 ? 0.04 + t * 0.92 : 0.04,
          y =
            side === 0 ? 0.06 : side === 1 ? 0.08 + t * 0.84 : side === 2 ? 0.94 : 0.08 + t * 0.84;
        sparkle(ctx, w * x, h * y, w * (i % 7 === 0 ? 0.022 : 0.005), '#fff0ff');
      }
      if (thumbnail) butterfly(ctx, w * 0.5, h * 0.5, w * 0.24, '#ffd6ff');
      ctx.shadowBlur = 0;
      title('a little glow');
    }
  } else if (theme === 'denim-bunny') {
    if (!foreground) {
      ctx.fillStyle = '#8ba4b4';
      ctx.fillRect(0, 0, w * 0.28, h);
      ctx.strokeStyle = '#c2d2d5';
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = w * 0.002;
      for (let y = -w; y < h; y += w * 0.012) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w * 0.28, y + w * 0.28);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#d9e0de';
      ctx.setLineDash([w * 0.005, w * 0.005]);
      ctx.beginPath();
      ctx.moveTo(w * 0.255, 0);
      ctx.lineTo(w * 0.255, h);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let y = h * 0.08; y < h; y += h * 0.06)
        for (const x of [0.39, 0.72, 0.9]) {
          ctx.fillStyle = '#bdc8e245';
          ctx.beginPath();
          ctx.arc(w * x, y, w * 0.009, 0, Math.PI * 2);
          ctx.fill();
        }
      for (const y of [0.018, 0.982])
        for (let x = 0; x < w; x += w * 0.03) {
          ctx.strokeStyle = '#f7efe3';
          ctx.lineWidth = w * 0.009;
          ctx.beginPath();
          ctx.arc(x, h * y, w * 0.02, 0, Math.PI);
          ctx.stroke();
        }
    } else {
      bow(ctx, w * 0.18, h * 0.08, w * 0.095, '#a3bfce');
      bow(ctx, w * 0.2, h * 0.93, w * 0.11, '#759ab3');
      if (frame.layout.id === 'denim-alternating') {
        bunny(ctx, w * 0.19, h * 0.37, w * 0.095, '#efe9df');
        bunny(ctx, w * 0.84, h * 0.68, w * 0.095, '#c4e2dd');
      }
      if (thumbnail) bunny(ctx, w * 0.56, h * 0.5, w * 0.22, '#e7ede7');
      if (bottom < 0.94 || thumbnail) {
        ctx.fillStyle = frame.ink;
        ctx.font = `italic ${w * 0.04}px "Noto Serif Variable", serif`;
        ctx.textAlign = 'center';
        ctx.fillText('hello!', w * 0.61, h * 0.966, w * 0.59);
      }
    }
  } else {
    if (!foreground) {
      const red = ctx.createLinearGradient(0, 0, w, 0);
      red.addColorStop(0, '#6e111b');
      red.addColorStop(0.45, '#b3262b');
      red.addColorStop(1, '#69111b');
      ctx.fillStyle = red;
      ctx.fillRect(w * 0.05, h * 0.025, w * 0.9, h * 0.95);
      ctx.strokeStyle = '#d5ad69';
      ctx.lineWidth = w * 0.009;
      ctx.strokeRect(w * 0.055, h * 0.028, w * 0.89, h * 0.944);
      for (const x of [0.11, 0.89])
        for (let y = h * 0.1; y < h * 0.9; y += h * 0.042) {
          ctx.fillStyle = '#ffedc0';
          ctx.fillRect(w * (x - 0.017), y, w * 0.034, h * 0.018);
        }
      for (const s of slots) {
        ctx.strokeStyle = '#e0aa63';
        ctx.lineWidth = w * 0.008;
        ctx.strokeRect(
          s.x * w - w * 0.009,
          s.y * h - w * 0.009,
          s.width * w + w * 0.018,
          s.height * h + w * 0.018,
        );
      }
    } else {
      // Light-bulb sign and a small tiled disco ball, not a sliced sticker atlas.
      const signScale = thumbnail ? 1 : Math.min(1, top / 0.15);
      ctx.fillStyle = '#f1dfb9';
      ctx.fillRect(w * 0.18, h * 0.035 * signScale, w * 0.64, h * 0.08 * signScale);
      ctx.strokeStyle = '#d09e53';
      ctx.lineWidth = w * 0.008;
      ctx.strokeRect(w * 0.18, h * 0.035 * signScale, w * 0.64, h * 0.08 * signScale);
      for (let i = 0; i < 12; i++) {
        ctx.shadowColor = '#ffd482';
        ctx.shadowBlur = w * 0.012;
        ctx.fillStyle = '#ffefbb';
        for (const y of [0.026, 0.124]) {
          ctx.beginPath();
          ctx.arc(w * (0.19 + i * 0.056), h * y * signScale, w * 0.009 * signScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#8f2028';
      ctx.textAlign = 'center';
      ctx.font = `bold ${w * 0.048 * signScale}px sans-serif`;
      ctx.fillText('OPENING NIGHT', w * 0.5, h * 0.078 * signScale, w * 0.6);
      for (const [x, y] of [
        [0.1, 0.3],
        [0.89, 0.63],
        [0.12, 0.89],
      ]) {
        ctx.save();
        ctx.translate(w * x, h * y);
        ctx.rotate(0.2);
        ctx.fillStyle = '#9d1f29';
        ctx.strokeStyle = '#edc77b';
        ctx.lineWidth = w * 0.007;
        const star = slotPath('star', w * 0.14, w * 0.14);
        ctx.fill(star);
        ctx.stroke(star);
        ctx.restore();
      }
      ctx.strokeStyle = '#e5d0ad';
      ctx.lineWidth = w * 0.012;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const y = 0.44 + i * 0.007,
            x = 0.95 + Math.sin(i * 0.15) * 0.025 + side * 0.012;
          if (!i) ctx.moveTo(w * x, h * y);
          else ctx.lineTo(w * x, h * y);
        }
        ctx.stroke();
      }
      for (let i = 0; i < 14; i++) {
        const y = 0.45 + i * 0.03,
          x = 0.95 + Math.sin(((y - 0.44) / 0.007) * 0.15) * 0.025;
        ctx.fillStyle = '#21191c';
        ctx.fillRect(w * (x - 0.012), h * y, w * 0.024, h * 0.016);
      }
      if (bottom < 0.92 || thumbnail) {
        ctx.save();
        ctx.translate(w * 0.15, h * 0.94);
        ctx.rotate(-0.16);
        ctx.fillStyle = '#1e1b1e';
        ctx.fillRect(-w * 0.08, -h * 0.025, w * 0.23, h * 0.055);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = i % 2 ? '#18181b' : '#eee0c6';
          ctx.fillRect(-w * 0.08 + w * i * 0.046, -h * 0.03, w * 0.046, h * 0.012);
        }
        ctx.fillStyle = '#f7eedb';
        ctx.font = `${w * 0.014}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('TAKE 01', -w * 0.06, h * 0.01);
        ctx.restore();
      }
      const cx = w * 0.85,
        cy = h * 0.37,
        r = w * 0.085;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      for (let row = -5; row <= 5; row++)
        for (let col = -5; col <= 5; col++) {
          ctx.fillStyle = ['#f1e0c3', '#846e61', '#c5b4a0', '#fff3db'][
            (row * row + col * 7 + 77) % 4
          ];
          ctx.fillRect(cx + col * r * 0.2, cy + row * r * 0.2, r * 0.18, r * 0.18);
        }
      ctx.restore();
      if (thumbnail) {
        ctx.fillStyle = frame.ink;
        ctx.textAlign = 'center';
        ctx.font = `bold ${w * 0.18}px serif`;
        ctx.fillText('★', w * 0.5, h * 0.5);
      }
      if (bottom < 0.94 || thumbnail) {
        ctx.save();
        ctx.translate(w * 0.61, h * 0.946);
        ctx.rotate(-0.12);
        ctx.fillStyle = '#f7e4bf';
        ctx.fillRect(-w * 0.23, -h * 0.022, w * 0.46, h * 0.044);
        ctx.fillStyle = '#94242d';
        ctx.textAlign = 'center';
        ctx.font = `bold ${w * 0.034}px sans-serif`;
        ctx.fillText('ADMIT ONE', 0, 0, w * 0.4);
        ctx.restore();
      }
    }
  }
  ctx.restore();
  return true;
}
