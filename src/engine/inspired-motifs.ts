export function sparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.1, -r * 0.1, r, 0);
  ctx.quadraticCurveTo(r * 0.1, r * 0.1, 0, r);
  ctx.quadraticCurveTo(-r * 0.1, r * 0.1, -r, 0);
  ctx.quadraticCurveTo(-r * 0.1, -r * 0.1, 0, -r);
  ctx.fill();
  ctx.restore();
}
export function bow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#f5f0e4';
  ctx.lineWidth = r * 0.045;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(side * r * 1.5, -r, side * r * 1.6, r * 0.7, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(side * r * 0.7, r * 1.3);
    ctx.lineTo(side * r * 0.18, r * 1.1);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.15, r * 0.23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
export function bunny(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#aebbc0';
  ctx.lineWidth = r * 0.025;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * r * 0.27, -r * 0.65, r * 0.22, r * 0.62, side * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(side * r * 0.55, r * 0.65, r * 0.3, r * 0.18, side * -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.44, r * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.1, r * 0.58, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#283c4b';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * r * 0.2, -r * 0.12, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, r * 0.03, r * 0.025, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
export function cloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#ce7aa5';
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.moveTo(-r, r * 0.2);
  ctx.bezierCurveTo(-r * 1.4, -r * 0.3, -r * 0.8, -r * 0.65, -r * 0.45, -r * 0.45);
  ctx.bezierCurveTo(-r * 0.4, -r * 1.1, r * 0.5, -r * 1.1, r * 0.6, -r * 0.45);
  ctx.bezierCurveTo(r * 1.3, -r * 0.6, r * 1.4, r * 0.3, r * 0.8, r * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
export function sprig(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#778264';
  ctx.lineWidth = r * 0.025;
  ctx.beginPath();
  ctx.moveTo(0, r);
  ctx.quadraticCurveTo(-r * 0.25, 0, r * 0.1, -r);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const cy = r * (0.7 - i * 0.36),
      side = i % 2 ? 1 : -1;
    ctx.fillStyle = '#9ba27d';
    ctx.beginPath();
    ctx.ellipse(side * r * 0.15, cy, r * 0.2, r * 0.06, side * -0.5, 0, Math.PI * 2);
    ctx.fill();
    const fx = side * r * 0.3,
      fy = cy - r * 0.15;
    ctx.fillStyle = '#fffdf2';
    for (let p = 0; p < 6; p++) {
      const a = (p * Math.PI) / 3;
      ctx.beginPath();
      ctx.ellipse(
        fx + Math.cos(a) * r * 0.1,
        fy + Math.sin(a) * r * 0.1,
        r * 0.09,
        r * 0.04,
        a,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.fillStyle = '#d7bc74';
    ctx.beginPath();
    ctx.arc(fx, fy, r * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
export function butterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.3);
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.035;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, r * 0.1);
    ctx.bezierCurveTo(side * r * 1.8, -r * 1.7, side * r * 1.9, r * 0.6, 0, r * 0.5);
    ctx.bezierCurveTo(side * r * 1.2, r * 1.6, side * r * 1.2, r * 0.4, 0, r * 0.1);
    ctx.stroke();
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, r * 0.3);
      ctx.quadraticCurveTo(
        side * r * 0.5,
        -r * 0.2,
        side * r * (0.4 + i * 0.15),
        -r * (0.2 + i * 0.12),
      );
      ctx.stroke();
    }
  }
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.15);
  ctx.lineTo(0, r * 0.7);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.2, -r * 0.6, -r * 0.3, -r * 0.45);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.2, -r * 0.6, r * 0.3, -r * 0.45);
  ctx.stroke();
  ctx.restore();
}
