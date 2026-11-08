import { slotPath } from './slot-path';
import { paintOrnament } from './ornament-treatment';
import { paintSlotTreatment, paintMaskDetails } from './slot-treatment';
import { paintOccasionBorder, occasionMatte } from './occasion-decoration';
import { artPaper, artForeground } from './artwork';
import type { Composition, Design, Photo, Transform } from '../domain/types';
import { decoratePaper } from './frame-decoration';

export function coverGeometry(
  imageWidth: number,
  imageHeight: number,
  width: number,
  height: number,
  transform: Transform,
) {
  const angle = (transform.rotation * Math.PI) / 180;
  const projectedWidth = Math.abs(Math.cos(angle)) * width + Math.abs(Math.sin(angle)) * height;
  const projectedHeight = Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * height;
  const scale =
    Math.max(projectedWidth / imageWidth, projectedHeight / imageHeight) * transform.zoom;
  return {
    scale,
    offsetX: (transform.x * (imageWidth * scale - projectedWidth)) / 2,
    offsetY: (transform.y * (imageHeight * scale - projectedHeight)) / 2,
    angle,
  };
}

function flower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(radius * 0.62, 0, radius * 0.48, radius * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e4bc62';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function renderComposition(
  canvas: HTMLCanvasElement,
  frame: Design,
  photos: Photo[],
  composition: Composition,
  options: {
    artwork?: HTMLImageElement;
    width?: number;
    height?: number;
    placeholders?: boolean;
    selectedSlot?: string;
    transparent?: boolean;
    decorationsOnly?: boolean;
    layoutOnly?: boolean;
  } = {},
) {
  const width = options.width ?? frame.layout.width;
  canvas.width = width;
  canvas.height = options.height ?? Math.round((width * frame.layout.height) / frame.layout.width);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const height = canvas.height;
  if (!options.transparent) {
    ctx.fillStyle = frame.background;
    ctx.fillRect(0, 0, width, height);
  }
  if (!options.layoutOnly) {
    if (frame.artwork) artPaper(ctx, frame, width, height);
    else decoratePaper(ctx, frame, width, height);
  }
  if (!options.decorationsOnly)
    frame.layout.slots.forEach((box, index) => {
      const w = box.width * width;
      const h = box.height * height;
      ctx.save();
      ctx.translate((box.x + box.width / 2) * width, (box.y + box.height / 2) * height);
      ctx.rotate((box.rotation * Math.PI) / 180);
      const path = slotPath(box.mask, w, h);
      paintSlotTreatment(ctx, frame, box, w, h, width);
      if (frame.artwork && !options.layoutOnly) {
        ctx.strokeStyle =
          occasionMatte(frame) ??
          (frame.artwork.theme === 'afterhours'
            ? '#090a16'
            : frame.artwork.theme === 'memo'
              ? '#f8f0db'
              : '#fffcf4');
        ctx.lineWidth = Math.min(width * 0.019, Math.min(w, h) * 0.055);
        ctx.stroke(path);
        ctx.strokeStyle = frame.accent;
        ctx.lineWidth = width * 0.003;
        ctx.stroke(path);
      }
      ctx.save();
      ctx.clip(path);
      const assignment = composition[box.id];
      const photo = photos.find((item) => item.id === assignment?.photoId);
      if (options.layoutOnly) {
        ctx.fillStyle = '#c59da2';
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else if (photo && assignment) {
        const geo = coverGeometry(photo.width, photo.height, w, h, assignment.transform);
        ctx.rotate(geo.angle);
        ctx.translate(geo.offsetX, geo.offsetY);
        ctx.scale(assignment.transform.mirrored ? -1 : 1, 1);
        ctx.drawImage(
          photo.image,
          (-photo.width * geo.scale) / 2,
          (-photo.height * geo.scale) / 2,
          photo.width * geo.scale,
          photo.height * geo.scale,
        );
      } else if (options.placeholders) {
        const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
        gradient.addColorStop(0, ['#b7c6ac', '#d9bfab', '#c7c4b8'][index % 3]);
        gradient.addColorStop(1, ['#71866f', '#b39076', '#8a9c99'][index % 3]);
        ctx.fillStyle = gradient;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = '#fff7df55';
        ctx.beginPath();
        ctx.arc(w * 0.22, -h * 0.22, Math.min(w, h) * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f9eddb';
        ctx.beginPath();
        ctx.ellipse(-w * 0.1, h * 0.24, w * 0.38, h * 0.29, -0.18, 0, Math.PI * 2);
        ctx.fill();
        flower(ctx, -w * 0.1, -h * 0.05, Math.min(w, h) * 0.22, '#fff7e9');
        flower(ctx, w * 0.23, h * 0.27, Math.min(w, h) * 0.17, '#efe4d7');
      } else {
        ctx.fillStyle = frame.style === 'film' ? '#3e423c' : '#e9e8df';
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = frame.style === 'film' ? '#a5aa9e' : '#92988b';
        ctx.font = `${Math.min(w, h) * 0.18}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${index + 1}`, 0, 0);
      }
      ctx.restore();
      paintMaskDetails(ctx, frame, box, w, h, !!options.layoutOnly);
      paintOrnament(ctx, box, w, h, true, !!options.layoutOnly);
      if (!options.layoutOnly) paintOccasionBorder(ctx, frame, box, path, w, h, width);
      if (options.selectedSlot === box.id) {
        ctx.strokeStyle = '#c79535';
        ctx.lineWidth = Math.max(2, width * 0.006);
        ctx.stroke(path);
      }
      ctx.restore();
    });
  if (options.layoutOnly) return;
  if (frame.artwork) {
    artForeground(ctx, frame, width, height, options.artwork, options.decorationsOnly);
    return;
  }
  ctx.fillStyle = frame.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic ${width * 0.045}px Georgia, serif`;
  ctx.fillText('Photobooth', width * 0.5, height * 0.917, width * 0.8);
  ctx.font = `${Math.max(7, width * 0.017)}px sans-serif`;
  ctx.fillText(frame.stamp, width * 0.5, height * 0.958, width * 0.84);
  if (frame.style === 'pastel') flower(ctx, width * 0.13, height * 0.915, width * 0.035, '#fff8eb');
  if (frame.style === 'film') {
    ctx.fillStyle = frame.accent;
    for (let i = 0; i < 9; i++) {
      ctx.fillRect(width * 0.014, height * (0.06 + i * 0.09), width * 0.018, height * 0.015);
      ctx.fillRect(width * 0.968, height * (0.06 + i * 0.09), width * 0.018, height * 0.015);
    }
  }
}

export function canvasBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 0.94,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      type,
      quality,
    ),
  );
}
