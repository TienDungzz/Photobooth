import type { Design, Slot } from '../domain/types';
import { cloud, sparkle } from './inspired-motifs';
import { paintOrnament } from './ornament-treatment';

export function paintOrnamentPaper(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
  thumbnail = false,
) {
  const theme = frame.artwork?.theme;
  if (!['ivory-night', 'cloud-curtain', 'rose-haze', 'firefly-bloom'].includes(theme ?? ''))
    return false;
  ctx.save();
  ctx.globalAlpha = 1;
  const top = Math.min(...frame.layout.slots.map((s) => s.y)),
    bottom = Math.max(...frame.layout.slots.map((s) => s.y + s.height));
  if (!foreground) {
    if (theme === 'ivory-night') {
      const velvet = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        w * 0.1,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.7,
      );
      velvet.addColorStop(0, '#222127');
      velvet.addColorStop(1, '#817681');
      ctx.fillStyle = velvet;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e1d4db22';
      ctx.lineWidth = w * 0.001;
      for (let y = 0; y < h; y += w * 0.006) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (theme === 'cloud-curtain') {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#26394f');
      sky.addColorStop(1, '#7892ad');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 45; i++)
        sparkle(
          ctx,
          (((i * 167) % 997) / 997) * w,
          (((i * 337) % 991) / 991) * h,
          w * 0.002,
          '#f5f0df99',
        );
    } else {
      const colors = theme === 'rose-haze' ? ['#f7acd449', '#251c30'] : ['#a4dfce33', '#152b2d'];
      for (const [x, y] of [
        [0, 0],
        [1, 1],
      ]) {
        const glow = ctx.createRadialGradient(w * x, h * y, 0, w * x, h * y, w * 0.65);
        glow.addColorStop(0, colors[0]);
        glow.addColorStop(1, colors[1] + '00');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }
    }
  } else {
    ctx.fillStyle = frame.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic ${w * (top < 0.1 ? 0.024 : 0.04)}px "Noto Serif Variable", serif`;
    ctx.fillText(
      frame.artwork!.title,
      w * 0.5,
      h * (thumbnail ? 0.08 : Math.min(0.075, top * 0.35)),
      w * 0.8,
    );
    if (bottom < 0.93 || thumbnail) {
      ctx.font = `${w * 0.013}px sans-serif`;
      ctx.fillText(frame.artwork!.subtitle, w * 0.5, h * 0.962, w * 0.78);
    }
    if (theme === 'cloud-curtain') {
      const size = thumbnail ? w * 0.14 : Math.min(w * 0.14, (1 - bottom) * h * 0.6);
      for (const x of [0.06, 0.3, 0.55, 0.82, 0.99]) cloud(ctx, w * x, h * 0.99, size, '#e8eff5');
    }
    if (thumbnail) {
      const treatment: Slot['treatment'] =
        theme === 'ivory-night'
          ? 'lace'
          : theme === 'cloud-curtain'
            ? 'star-curtain'
            : theme === 'rose-haze'
              ? 'glow-hearts'
              : 'glow-flowers';
      const slot: Slot = {
        id: 'sample',
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        rotation: 0,
        mask: theme === 'ivory-night' ? 'ellipse' : 'rect',
        treatment,
      };
      ctx.translate(w * 0.5, h * 0.5);
      paintOrnament(ctx, slot, w * 0.6, theme === 'ivory-night' ? w * 0.6 : h * 0.54, true);
    }
  }
  ctx.restore();
  return true;
}
