import type { Slot } from '../domain/types';
/** Shared by photo clipping, borders and the active selection outline. */
export function slotPath(mask: Slot['mask'], w: number, h: number): Path2D {
  const p = new Path2D();
  if (mask === 'side-left' || mask === 'side-right') {
    const radius = Math.min(w / 2, h / 2);
    const radii = mask === 'side-left' ? [radius, 0, 0, radius] : [0, radius, radius, 0];
    p.roundRect(-w / 2, -h / 2, w, h, radii);
  } else if (mask === 'bear') {
    p.moveTo(-w * 0.44, -h * 0.22);
    p.bezierCurveTo(-w * 0.64, -h * 0.57, -w * 0.15, -h * 0.65, -w * 0.15, -h * 0.4);
    p.quadraticCurveTo(0, -h * 0.46, w * 0.15, -h * 0.4);
    p.bezierCurveTo(w * 0.15, -h * 0.65, w * 0.64, -h * 0.57, w * 0.44, -h * 0.22);
    p.bezierCurveTo(w * 0.62, h * 0.35, w * 0.32, h * 0.49, 0, h * 0.48);
    p.bezierCurveTo(-w * 0.32, h * 0.49, -w * 0.62, h * 0.35, -w * 0.44, -h * 0.22);
    p.closePath();
  } else if (mask === 'wavy') {
    p.moveTo(-w * 0.4, -h * 0.47);
    p.bezierCurveTo(-w * 0.2, -h * 0.54, -w * 0.1, -h * 0.4, w * 0.06, -h * 0.47);
    p.bezierCurveTo(w * 0.3, -h * 0.56, w * 0.51, -h * 0.5, w * 0.47, -h * 0.27);
    p.bezierCurveTo(w * 0.4, -h * 0.1, w * 0.54, h * 0.06, w * 0.47, h * 0.24);
    p.bezierCurveTo(w * 0.54, h * 0.49, w * 0.3, h * 0.53, w * 0.08, h * 0.46);
    p.bezierCurveTo(-w * 0.13, h * 0.4, -w * 0.3, h * 0.56, -w * 0.45, h * 0.45);
    p.bezierCurveTo(-w * 0.54, h * 0.3, -w * 0.4, h * 0.13, -w * 0.47, -h * 0.06);
    p.bezierCurveTo(-w * 0.52, -h * 0.23, -w * 0.55, -h * 0.43, -w * 0.4, -h * 0.47);
    p.closePath();
  } else if (mask === 'scallop') {
    for (let i = 0; i <= 280; i++) {
      const angle = (i / 280) * Math.PI * 2;
      const radius = 0.465 + 0.035 * Math.cos(angle * 14);
      const x = Math.cos(angle) * radius * w,
        y = Math.sin(angle) * radius * h;
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    }
    p.closePath();
  } else if (mask === 'blob') {
    p.moveTo(-w * 0.34, -h * 0.42);
    p.bezierCurveTo(-w * 0.13, -h * 0.56, w * 0.07, -h * 0.3, w * 0.3, -h * 0.43);
    p.bezierCurveTo(w * 0.5, -h * 0.48, w * 0.4, -h * 0.1, w * 0.47, h * 0.06);
    p.bezierCurveTo(w * 0.6, h * 0.36, w * 0.25, h * 0.49, w * 0.06, h * 0.43);
    p.bezierCurveTo(-w * 0.1, h * 0.34, -w * 0.34, h * 0.57, -w * 0.46, h * 0.26);
    p.bezierCurveTo(-w * 0.52, h * 0.06, -w * 0.31, -h * 0.11, -w * 0.43, -h * 0.24);
    p.bezierCurveTo(-w * 0.49, -h * 0.33, -w * 0.44, -h * 0.37, -w * 0.34, -h * 0.42);
    p.closePath();
  } else if (mask === 'cutout') {
    const points = [
      [-0.34, -0.5],
      [0.3, -0.47],
      [0.49, -0.22],
      [0.38, 0.03],
      [0.49, 0.26],
      [0.2, 0.48],
      [-0.1, 0.4],
      [-0.35, 0.5],
      [-0.48, 0.17],
      [-0.4, -0.09],
      [-0.5, -0.28],
    ];
    points.forEach(([x, y], i) => {
      if (i === 0) p.moveTo(x * w, y * h);
      else p.lineTo(x * w, y * h);
    });
    p.closePath();
  } else if (mask === 'torn') {
    const steps = 18;
    for (let side = 0; side < 4; side++)
      for (let i = 0; i <= steps; i++) {
        const t = i / steps,
          inset = i === 0 || i === steps ? 0.006 : 0.003 + ((i * 7 + side * 11) % 13) * 0.0016;
        const x =
          side === 0 ? -0.5 + t : side === 1 ? 0.5 - inset : side === 2 ? 0.5 - t : -0.5 + inset;
        const y =
          side === 0 ? -0.5 + inset : side === 1 ? -0.5 + t : side === 2 ? 0.5 - inset : 0.5 - t;
        if (side === 0 && i === 0) p.moveTo(x * w, y * h);
        else p.lineTo(x * w, y * h);
      }
    p.closePath();
  } else if (mask === 'apple') {
    p.moveTo(0, -h * 0.34);
    p.bezierCurveTo(-w * 0.12, -h * 0.5, -w * 0.43, -h * 0.48, -w * 0.48, -h * 0.14);
    p.bezierCurveTo(-w * 0.55, h * 0.16, -w * 0.3, h * 0.53, -w * 0.12, h * 0.46);
    p.quadraticCurveTo(0, h * 0.4, w * 0.12, h * 0.46);
    p.bezierCurveTo(w * 0.3, h * 0.53, w * 0.55, h * 0.16, w * 0.48, -h * 0.14);
    p.bezierCurveTo(w * 0.43, -h * 0.48, w * 0.12, -h * 0.5, 0, -h * 0.34);
    p.closePath();
  } else if (mask === 'heart') {
    p.moveTo(0, h * 0.48);
    p.bezierCurveTo(-w * 0.14, h * 0.29, -w * 0.62, -h * 0.03, -w * 0.46, -h * 0.31);
    p.bezierCurveTo(-w * 0.33, -h * 0.56, -w * 0.09, -h * 0.5, 0, -h * 0.29);
    p.bezierCurveTo(w * 0.09, -h * 0.5, w * 0.33, -h * 0.56, w * 0.46, -h * 0.31);
    p.bezierCurveTo(w * 0.62, -h * 0.03, w * 0.14, h * 0.29, 0, h * 0.48);
    p.closePath();
  } else if (mask === 'star') {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        r = i % 2 ? 0.29 : 0.5,
        x = Math.cos(a) * w * r,
        y = Math.sin(a) * h * r;
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    }
    p.closePath();
  } else if (mask === 'arch') {
    p.moveTo(-w / 2, h / 2);
    const spring = -h / 2 + w / 2;
    p.lineTo(-w / 2, spring);
    p.arc(0, spring, w / 2, Math.PI, Math.PI * 2);
    p.lineTo(w / 2, h / 2);
    p.closePath();
  } else if (mask === 'stamp') {
    const steps = 24;
    for (let side = 0; side < 4; side++)
      for (let i = 0; i <= steps; i++) {
        const t = i / steps,
          inset = i % 2 ? 0.012 : 0;
        const x =
          side === 0 ? -0.5 + t : side === 1 ? 0.5 - inset : side === 2 ? 0.5 - t : -0.5 + inset;
        const y =
          side === 0 ? -0.5 + inset : side === 1 ? -0.5 + t : side === 2 ? 0.5 - inset : 0.5 - t;
        if (side === 0 && i === 0) p.moveTo(x * w, y * h);
        else p.lineTo(x * w, y * h);
      }
    p.closePath();
  } else if (mask === 'ellipse') p.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
  else p.roundRect(-w / 2, -h / 2, w, h, mask === 'rounded' ? Math.min(w, h) * 0.08 : 0);
  return p;
}
