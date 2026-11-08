import type { Design } from '../domain/types';

export function paintExpressivePaper(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  w: number,
  h: number,
): boolean {
  const theme = frame.artwork?.theme;
  if (theme !== 'afterhours' && theme !== 'playdate' && theme !== 'zine') return false;
  ctx.save();
  if (theme === 'afterhours') {
    ctx.globalAlpha = 1;
    const glow = ctx.createLinearGradient(0, 0, w, h);
    glow.addColorStop(0, '#991ac555');
    glow.addColorStop(0.5, '#173b4844');
    glow.addColorStop(1, '#d42f7f66');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    const size = w * 0.035;
    for (let y = 0; y < h; y += size)
      for (let x = 0; x < w; x += size) {
        if (x > w * 0.075 && x < w * 0.925) continue;
        ctx.fillStyle = (Math.round(x / size) + Math.round(y / size)) % 2 ? '#faf1ff' : '#090a16';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, y, size, size);
      }
  } else if (theme === 'playdate') {
    const size = w * 0.055;
    ctx.globalAlpha = 0.32;
    for (let y = 0; y < h; y += size)
      for (let x = 0; x < w; x += size) {
        ctx.fillStyle = y < h * 0.36 ? '#a6c9ed' : y < h * 0.69 ? '#edb9cf' : '#a7cf9d';
        if ((Math.round(x / size) + Math.round(y / size)) % 2) ctx.fillRect(x, y, size, size);
      }
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.28);
    ctx.lineTo(w, h * 0.42);
    ctx.lineTo(w, h * 0.72);
    ctx.lineTo(0, h * 0.58);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = frame.ink;
    for (let row = 0; row < 80; row++)
      for (let column = 0; column < 8; column++) {
        const x = w * (0.03 + column * 0.12),
          y = h * (0.025 + row * 0.012);
        ctx.fillRect(x, y, w * (0.035 + ((row * 7 + column * 3) % 8) * 0.006), h * 0.0018);
      }
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = frame.accent;
    ctx.save();
    ctx.translate(w * 0.9, h * 0.05);
    ctx.rotate(0.12);
    ctx.fillRect(-w * 0.04, -h * 0.012, w * 0.08, h * 0.13);
    ctx.restore();
    ctx.fillStyle = frame.ink;
    ctx.fillRect(w * 0.06, h * 0.105, w * 0.57, h * 0.006);
  }
  ctx.restore();
  return true;
}
