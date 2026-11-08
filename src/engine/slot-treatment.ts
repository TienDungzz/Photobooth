import type { Design, Slot } from '../domain/types';
import { paintTicket } from './ticket-treatment';
import { paintOrnament } from './ornament-treatment';

export function paintMaskDetails(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  slot: Slot,
  w: number,
  h: number,
  layoutOnly: boolean,
) {
  if (slot.mask !== 'apple') return;
  ctx.save();
  ctx.strokeStyle = layoutOnly ? '#c59da2' : '#73533b';
  ctx.lineWidth = Math.min(w, h) * 0.045;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.34);
  ctx.quadraticCurveTo(-w * 0.02, -h * 0.47, w * 0.04, -h * 0.54);
  ctx.stroke();
  ctx.fillStyle = layoutOnly ? '#c59da2' : frame.accent;
  ctx.beginPath();
  ctx.moveTo(w * 0.015, -h * 0.43);
  ctx.bezierCurveTo(w * 0.045, -h * 0.57, w * 0.19, -h * 0.56, w * 0.2, -h * 0.52);
  ctx.bezierCurveTo(w * 0.16, -h * 0.43, w * 0.07, -h * 0.4, w * 0.015, -h * 0.43);
  ctx.fill();
  ctx.restore();
}

/** Paper/window chrome belongs to a layout; switching frames preserves this structure. */
export function paintSlotTreatment(
  ctx: CanvasRenderingContext2D,
  frame: Design,
  slot: Slot,
  w: number,
  h: number,
  canvasWidth: number,
) {
  if (!slot.treatment) return;
  if (paintOrnament(ctx, slot, w, h, false)) return;
  if (slot.treatment === 'ticket') {
    paintTicket(ctx, frame, w, h, canvasWidth);
    return;
  }
  const pad = Math.min(canvasWidth * 0.012, Math.min(w, h) * 0.035);
  const bar = slot.treatment === 'browser' ? Math.min(w, h) * 0.11 : 0;
  const footer = slot.treatment === 'polaroid' ? Math.min(h * 0.15, w * 0.09) : pad;
  ctx.save();
  ctx.shadowColor = '#15102035';
  ctx.shadowBlur = canvasWidth * 0.012;
  ctx.shadowOffsetY = canvasWidth * 0.004;
  ctx.fillStyle = '#fffdf6';
  ctx.fillRect(-w / 2 - pad, -h / 2 - pad - bar, w + pad * 2, h + pad + footer + bar);
  ctx.shadowColor = 'transparent';
  if (slot.treatment === 'browser') {
    ctx.fillStyle = frame.accent;
    ctx.fillRect(-w / 2 - pad, -h / 2 - pad - bar, w + pad * 2, bar + pad);
    ctx.strokeStyle = frame.ink;
    ctx.lineWidth = Math.max(1, canvasWidth * 0.002);
    ctx.strokeRect(-w / 2 - pad, -h / 2 - pad - bar, w + pad * 2, h + pad + footer + bar);
    ctx.fillStyle = frame.background;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-w / 2 + bar * (0.45 + i * 0.6), -h / 2 - bar * 0.52, bar * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = frame.background;
    ctx.beginPath();
    ctx.moveTo(w / 2 - bar * 0.8, -h / 2 - bar * 0.75);
    ctx.lineTo(w / 2 - bar * 0.3, -h / 2 - bar * 0.25);
    ctx.moveTo(w / 2 - bar * 0.3, -h / 2 - bar * 0.75);
    ctx.lineTo(w / 2 - bar * 0.8, -h / 2 - bar * 0.25);
    ctx.stroke();
  }
  ctx.restore();
}
