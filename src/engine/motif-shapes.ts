import type { Frame } from '../domain/types';

export function drawMotif(
  ctx: CanvasRenderingContext2D,
  pattern: Frame['pattern'],
  background: string,
) {
  const circle = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const line = (x: number, y: number, xx: number, yy: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.stroke();
  };
  switch (pattern) {
    case 'hearts':
      ctx.beginPath();
      ctx.moveTo(0, 0.8);
      ctx.bezierCurveTo(-1.5, -0.1, -0.8, -1.3, 0, -0.5);
      ctx.bezierCurveTo(0.8, -1.3, 1.5, -0.1, 0, 0.8);
      ctx.fill();
      break;
    case 'bows':
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 0.48, 0, 0.5, 0.3, side * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        line(0, 0.1, side * 0.5, 0.95);
      }
      circle(0, 0, 0.13);
      break;
    case 'tulips':
      line(0, -0.1, 0, 1);
      ctx.beginPath();
      ctx.moveTo(-0.6, -0.9);
      ctx.lineTo(-0.3, -0.5);
      ctx.lineTo(0, -1);
      ctx.lineTo(0.3, -0.5);
      ctx.lineTo(0.6, -0.9);
      ctx.quadraticCurveTo(0.7, 0.5, 0, 0.2);
      ctx.quadraticCurveTo(-0.7, 0.5, -0.6, -0.9);
      ctx.fill();
      break;
    case 'daisies':
    case 'sakura': {
      const petals = pattern === 'daisies' ? 8 : 5;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0.5, 0, 0.5, 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.fillStyle = '#d4ad56';
      circle(0, 0, 0.24);
      ctx.restore();
      break;
    }
    case 'cherries':
      circle(-0.4, 0.4, 0.34);
      circle(0.4, 0.55, 0.34);
      ctx.beginPath();
      ctx.moveTo(-0.4, 0.1);
      ctx.quadraticCurveTo(-0.2, -0.8, 0.3, -0.9);
      ctx.lineTo(0.4, 0.2);
      ctx.stroke();
      break;
    case 'leaves':
    case 'vines':
      line(0, -1, 0, 1);
      for (const y of pattern === 'vines' ? [-0.6, 0, 0.6] : [0])
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(side * 0.35, y, 0.5, 0.2, side * -0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      break;
    case 'moon':
      circle(0, 0, 0.85);
      ctx.save();
      ctx.fillStyle = background;
      circle(0.4, -0.25, 0.75);
      ctx.restore();
      break;
    case 'clouds':
      ctx.beginPath();
      ctx.moveTo(-0.8, 0.5);
      ctx.bezierCurveTo(-1.4, -0.2, -0.6, -0.6, -0.3, -0.3);
      ctx.bezierCurveTo(-0.2, -1.1, 0.8, -0.9, 0.7, -0.2);
      ctx.bezierCurveTo(1.4, -0.2, 1.2, 0.6, 0.6, 0.5);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'sun':
      circle(0, 0, 0.45);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        line(Math.cos(a) * 0.65, Math.sin(a) * 0.65, Math.cos(a), Math.sin(a));
      }
      break;
    case 'rainbow':
      for (const r of [0.4, 0.7, 1]) {
        ctx.beginPath();
        ctx.arc(0, 0.5, r, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'confetti':
      ctx.fillRect(-0.9, -0.8, 0.35, 0.35);
      ctx.save();
      ctx.rotate(0.7);
      ctx.fillRect(0.2, -0.4, 0.25, 0.8);
      ctx.restore();
      circle(0.6, 0.6, 0.2);
      break;
    case 'balloons':
      ctx.beginPath();
      ctx.ellipse(0, -0.3, 0.6, 0.75, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0.5);
      ctx.bezierCurveTo(-0.6, 0.6, 0.5, 1.1, -0.2, 1.3);
      ctx.stroke();
      break;
    case 'checks':
      for (let x = -1; x < 1; x += 0.5)
        for (let y = -1; y < 1; y += 0.5)
          if (Math.round((x + y) * 2) % 2 === 0) ctx.fillRect(x, y, 0.5, 0.5);
      break;
    case 'dots':
      for (const [x, y] of [
        [-0.5, -0.5],
        [0.5, 0.5],
        [-0.5, 0.5],
        [0.5, -0.5],
      ])
        circle(x, y, 0.22);
      break;
    case 'stripes':
      for (const x of [-0.7, 0, 0.7]) line(x - 0.3, -0.8, x + 0.3, 0.8);
      break;
    case 'postage':
      ctx.strokeRect(-0.7, -0.9, 1.4, 1.8);
      ctx.strokeRect(-0.45, -0.65, 0.9, 1.3);
      for (let y = -0.7; y < 0.9; y += 0.35) circle(-0.8, y, 0.09);
      break;
    case 'artdeco':
      for (const r of [0.4, 0.7, 1]) {
        ctx.beginPath();
        ctx.moveTo(-r, r);
        ctx.lineTo(-r, -r);
        ctx.lineTo(r, -r);
        ctx.stroke();
      }
      line(-1, 1, 1, -1);
      break;
    case 'diamonds':
      for (const r of [0.5, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.stroke();
      }
      break;
    case 'waves':
      for (const y of [-0.6, 0, 0.6]) {
        ctx.beginPath();
        ctx.moveTo(-1, y);
        ctx.bezierCurveTo(-0.4, y - 1, 0.4, y + 1, 1, y);
        ctx.stroke();
      }
      break;
    case 'scallops':
      for (const x of [-0.6, 0, 0.6]) {
        ctx.beginPath();
        ctx.arc(x, 0, 0.4, 0, Math.PI);
        ctx.stroke();
      }
      break;
  }
}

export function decorateMotifs(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  width: number,
  height: number,
) {
  if (!frame.variant) return;
  const positions: [number, number][] = [];
  if (frame.variant === 'corners')
    for (const x of [0.027, 0.973]) for (const y of [0.035, 0.85]) positions.push([x, y]);
  else
    for (let index = 0; index < (frame.variant === 'classic' ? 12 : 9); index++)
      for (const x of [0.026, 0.974])
        positions.push([
          x + (frame.variant === 'scattered' ? Math.sin(index) * 0.007 : 0),
          0.04 + index * (frame.variant === 'classic' ? 0.071 : 0.098),
        ]);
  ctx.save();
  for (const [index, [x, y]] of positions.entries()) {
    ctx.save();
    ctx.translate(width * x, height * y);
    if (frame.variant === 'scattered') ctx.rotate(Math.sin(index) * 0.45);
    const size = width * (frame.variant === 'corners' ? 0.022 : 0.013);
    ctx.scale(size, size);
    ctx.lineWidth = 0.12;
    ctx.lineCap = 'round';
    drawMotif(ctx, frame.pattern, frame.background);
    ctx.restore();
  }
  if (frame.variant === 'scattered') {
    ctx.setLineDash([width * 0.006, width * 0.008]);
    ctx.strokeRect(width * 0.008, height * 0.008, width * 0.984, height * 0.984);
  }
  if (frame.variant === 'corners')
    ctx.strokeRect(width * 0.02, height * 0.02, width * 0.96, height * 0.96);
  ctx.restore();
}
