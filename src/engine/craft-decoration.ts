import type { Design } from '../domain/types';

export function paintCraft(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  foreground: boolean,
  thumbnail = false,
) {
  const theme = frame.artwork?.theme;
  if (theme !== 'receipt' && theme !== 'quilt' && theme !== 'orbit') return false;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = frame.ink;
  ctx.strokeStyle = frame.ink;
  ctx.lineWidth = w * 0.0015;
  const top = Math.min(...frame.layout.slots.map((s) => s.y));
  const bottom = Math.max(...frame.layout.slots.map((s) => s.y + s.height));
  const header = thumbnail ? 0.16 : Math.min(0.16, Math.max(0.025, top - 0.025));
  const footer = Math.max(0.88, bottom + 0.025);
  const label = (text: string, x: number, y: number, size: number, max = 0.82) => {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `${theme === 'receipt' ? '' : '500 '}${w * size}px ${theme === 'receipt' ? 'monospace' : theme === 'quilt' ? '"Noto Serif Variable", serif' : 'sans-serif'}`;
    ctx.fillText(text, w * x, h * y, w * max);
  };
  const line = (x: number, y: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(w * x, h * y);
    ctx.lineTo(w * x2, h * y2);
    ctx.stroke();
  };
  if (theme === 'receipt') {
    if (!foreground) {
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 500; i++)
        ctx.fillRect(
          (((i * 127) % 997) / 997) * w,
          (((i * 281) % 991) / 991) * h,
          w * 0.001,
          h * 0.001,
        );
      ctx.globalAlpha = 1;
      ctx.setLineDash([w * 0.008, w * 0.007]);
      for (const y of [0.025, 0.975]) line(0.045, y, 0.955, y);
      ctx.setLineDash([]);
      if (frame.layout.id === 'receipt-counter') {
        ctx.setLineDash([w * 0.004, w * 0.008]);
        line(0.66, 0.19, 0.66, 0.85);
        ctx.setLineDash([]);
      }
    } else {
      label('THE LITTLE JOY STORE', 0.09, header * 0.36, header < 0.09 ? 0.022 : 0.035);
      label('NO. 0001 / OPEN EVERY GOOD DAY', 0.09, header * 0.63, 0.012);
      label('ITEM                            MEMORY', 0.09, header * 0.86, 0.012);
      if (frame.layout.id === 'receipt-moments') {
        for (const [text, y] of [
          ['01  THE BIG MOMENT', 0.415],
          ['02  SMALL JOYS', 0.61],
          ['TOTAL: FIVE REASONS TO SMILE', 0.855],
        ] as const)
          label(text, 0.11, y, 0.014);
      }
      if (frame.layout.id === 'receipt-counter') {
        label('YOUR ORDER', 0.7, 0.23, 0.019, 0.23);
        label('1 GOOD DAY', 0.7, 0.72, 0.016, 0.23);
        label('TOTAL: PRICELESS', 0.7, 0.77, 0.014, 0.23);
      }
      if (thumbnail) {
        for (let i = 0; i < 6; i++) {
          label(
            `${String(i + 1).padStart(2, '0')}  LITTLE JOY     1.00`,
            0.12,
            0.3 + i * 0.065,
            0.023,
            0.76,
          );
        }
        line(0.1, 0.72, 0.9, 0.72);
        label('TOTAL: PRICELESS', 0.12, 0.78, 0.027);
      }
      if (footer < 0.96 || thumbnail) {
        const y = thumbnail ? 0.9 : footer + (1 - footer) * 0.25;
        for (let i = 0; i < 54; i++)
          ctx.fillRect(w * (0.22 + i * 0.01), h * y, w * (i % 4 === 0 ? 0.006 : 0.0025), h * 0.025);
        label('PAID IN LAUGHTER / THANK YOU', 0.16, y + 0.047, 0.012, 0.7);
      }
    }
  } else if (theme === 'quilt') {
    if (!foreground) {
      const size = w * 0.06,
        colors = ['#a9b7a0', '#e2ba9e', '#d9c89c', '#b4c3b4'];
      for (let y = 0, row = 0; y < h; y += size, row++)
        for (let x = 0, col = 0; x < w; x += size, col++) {
          if (x > size && x < w - size * 2 && y > size && y < h - size * 2) continue;
          ctx.fillStyle = colors[(row + col * 3) % colors.length];
          ctx.fillRect(x, y, size, size);
          ctx.strokeStyle = '#faf3df';
          ctx.setLineDash([w * 0.003, w * 0.004]);
          ctx.strokeRect(x + w * 0.006, y + w * 0.006, size - w * 0.012, size - w * 0.012);
        }
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = frame.ink;
      for (let y = 0; y < h; y += w * 0.008) ctx.fillRect(0, y, w, w * 0.0008);
      ctx.globalAlpha = 1;
      for (const s of frame.layout.slots) {
        ctx.save();
        ctx.translate((s.x + s.width / 2) * w, (s.y + s.height / 2) * h);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.strokeStyle = frame.accent;
        ctx.lineWidth = w * 0.003;
        ctx.setLineDash([w * 0.004, w * 0.005]);
        ctx.strokeRect(
          (-s.width * w) / 2 - w * 0.009,
          (-s.height * h) / 2 - w * 0.009,
          s.width * w + w * 0.018,
          s.height * h + w * 0.018,
        );
        ctx.restore();
      }
    } else {
      label('stitched together', 0.13, header * 0.58, header < 0.09 ? 0.025 : 0.048, 0.74);
      if (thumbnail) {
        ctx.fillStyle = '#bb775b';
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.64);
        ctx.bezierCurveTo(w * 0.05, h * 0.4, w * 0.36, h * 0.29, w * 0.5, h * 0.41);
        ctx.bezierCurveTo(w * 0.64, h * 0.29, w * 0.95, h * 0.4, w * 0.5, h * 0.64);
        ctx.fill();
        ctx.strokeStyle = '#faf3df';
        ctx.setLineDash([w * 0.006, w * 0.007]);
        ctx.stroke();
      }
      if (footer < 0.95 || thumbnail)
        label(
          'pieces of our everyday',
          0.19,
          thumbnail ? 0.88 : footer + (1 - footer) * 0.3,
          0.018,
          0.65,
        );
    }
  } else {
    if (!foreground) {
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 110; i++) {
        const x = (((i * 167) % 997) / 997) * w,
          y = (((i * 397) % 991) / 991) * h;
        ctx.fillRect(x, y, w * (i % 9 === 0 ? 0.002 : 0.0009), w * (i % 9 === 0 ? 0.002 : 0.0009));
      }
      ctx.strokeStyle = frame.accent;
      ctx.globalAlpha = 0.4;
      ctx.save();
      ctx.translate(w * 0.51, h * 0.53);
      ctx.rotate(-0.45);
      for (const r of [0.28, 0.39, 0.49]) {
        ctx.beginPath();
        ctx.ellipse(0, 0, w * r, h * r * 0.72, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      for (const s of frame.layout.slots) {
        if (s.mask !== 'ellipse') continue;
        ctx.strokeStyle = frame.ink;
        ctx.beginPath();
        ctx.ellipse(
          (s.x + s.width / 2) * w,
          (s.y + s.height / 2) * h,
          (s.width * w) / 2 + w * 0.012,
          (s.height * h) / 2 + w * 0.012,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    } else {
      label('OUR LITTLE ORBIT', 0.08, header * 0.45, header < 0.09 ? 0.023 : 0.041);
      ctx.fillStyle = frame.accent;
      label('A MAP OF MOMENTS / NOT TO SCALE', 0.08, header * 0.8, 0.012);
      if (frame.layout.id === 'orbital-trio') {
        label('01 / HOME', 0.15, 0.69, 0.013, 0.4);
        label('02 / AWAY', 0.67, 0.49, 0.012, 0.25);
      }
      if (thumbnail) {
        ctx.fillStyle = frame.ink;
        ctx.beginPath();
        ctx.arc(w * 0.48, h * 0.48, w * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = frame.accent;
        ctx.beginPath();
        ctx.arc(w * 0.78, h * 0.67, w * 0.055, 0, Math.PI * 2);
        ctx.fill();
      }
      if (footer < 0.97 || thumbnail)
        label(
          'DIFFERENT WORLDS / THE SAME ORBIT',
          0.08,
          thumbnail ? 0.92 : footer + (1 - footer) * 0.4,
          0.012,
        );
    }
  }
  ctx.restore();
  return true;
}
