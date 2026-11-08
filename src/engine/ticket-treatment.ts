import type { Design } from '../domain/types';

export function paintTicket(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
  canvasWidth: number,
) {
  const pad = Math.min(canvasWidth * 0.012, Math.min(w, h) * 0.035),
    stub = w * 0.24;
  const right = w / 2 + pad,
    center = right + stub / 2;
  ctx.save();
  ctx.shadowColor = '#15102035';
  ctx.shadowBlur = canvasWidth * 0.012;
  ctx.shadowOffsetY = canvasWidth * 0.004;
  ctx.fillStyle = '#fff8e7';
  ctx.beginPath();
  ctx.roundRect(-w / 2 - pad, -h / 2 - pad, w + pad * 2 + stub, h + pad * 2, h * 0.025);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = frame.accent;
  ctx.lineWidth = canvasWidth * 0.002;
  ctx.stroke();
  ctx.setLineDash([h * 0.018, h * 0.012]);
  ctx.beginPath();
  ctx.moveTo(right, -h / 2);
  ctx.lineTo(right, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#493e32';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + stub * 0.115 + 'px sans-serif';
  ctx.fillText('ADMIT ONE', center, -h * 0.29, stub * 0.86);
  ctx.font = stub * 0.09 + 'px sans-serif';
  ctx.fillText('KEEP THIS MOMENT', center, h * 0.31, stub * 0.88);
  ctx.fillText('01 / 24', center, h * 0.4, stub * 0.88);
  for (let i = 0; i < 24; i++)
    ctx.fillRect(
      right + stub * (0.16 + i * 0.028),
      -h * 0.12,
      stub * (i % 3 === 0 ? 0.015 : 0.006),
      h * 0.31,
    );
  ctx.restore();
}
