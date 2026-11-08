import { useEffect, useId, useRef, useState } from 'react';
import { Crop, MoveHorizontal, RotateCw, RotateCcw, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Photo, Slot, Transform } from '../../domain/types';
import { defaultTransform } from '../../domain/types';
import { coverGeometry } from '../../engine/renderer';
import { slotPath } from '../../engine/slot-path';
import { ZoomControl } from './ZoomControl';
import './CropDialog.css';

export function CropDialog({
  photo,
  slot,
  aspect,
  initial,
  onApply,
  onClose,
  onRemove,
}: {
  photo: Photo;
  slot: Slot;
  aspect: number;
  initial: Transform;
  onApply: (value: Transform) => void;
  onClose: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const dialog = useRef<HTMLDialogElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; transform: Transform } | null>(null);
  useEffect(() => {
    const node = dialog.current,
      previous = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node?.showModal();
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  const width = Math.max(1, Math.round(700 * Math.min(1, aspect))),
    height = Math.max(1, Math.round(700 / Math.max(1, aspect)));
  useEffect(() => {
    const node = canvas.current,
      ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    node.width = width;
    node.height = height;
    ctx.translate(width / 2, height / 2);
    const geo = coverGeometry(photo.width, photo.height, width, height, draft);
    ctx.save();
    ctx.rotate(geo.angle);
    ctx.translate(geo.offsetX, geo.offsetY);
    ctx.scale(draft.mirrored ? -1 : 1, 1);
    ctx.drawImage(
      photo.image,
      (-photo.width * geo.scale) / 2,
      (-photo.height * geo.scale) / 2,
      photo.width * geo.scale,
      photo.height * geo.scale,
    );
    ctx.restore();
    const path = slotPath(slot.mask, width, height),
      outside = new Path2D();
    outside.rect(-width / 2, -height / 2, width, height);
    outside.addPath(path);
    ctx.fillStyle = '#0009';
    ctx.fill(outside, 'evenodd');
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  }, [photo, slot.mask, draft, width, height]);
  return (
    <dialog
      className="crop-dialog"
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-hint`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="crop-dialog__heading">
        <h2 id={`${id}-title`}>{t('editPhotoTitle')}</h2>
        <button className="icon-button" onClick={onClose} aria-label={t('close')}>
          <X size={20} />
        </button>
      </div>
      <p className="crop-dialog__hint" id={`${id}-hint`}>
        {t('cropHint')}
      </p>
      <div className="crop-dialog__stage">
        <canvas
          tabIndex={0}
          ref={canvas}
          className="crop-dialog__canvas"
          style={{
            aspectRatio: aspect,
            width: `min(100%, calc(min(320px, calc(45dvh - 30px)) * ${aspect}))`,
          }}
          aria-label={t('cropPreview')}
          onKeyDown={(event) => {
            const directions: Record<string, [number, number]> = {
              ArrowLeft: [-0.05, 0],
              ArrowRight: [0.05, 0],
              ArrowUp: [0, -0.05],
              ArrowDown: [0, 0.05],
            };
            const direction = directions[event.key];
            if (!direction) return;
            event.preventDefault();
            setDraft((old) => ({
              ...old,
              x: Math.max(-1, Math.min(1, old.x + direction[0])),
              y: Math.max(-1, Math.min(1, old.y + direction[1])),
            }));
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, y: e.clientY, transform: draft };
          }}
          onPointerMove={(e) => {
            const start = drag.current;
            if (!start) return;
            const rect = e.currentTarget.getBoundingClientRect(),
              geo = coverGeometry(photo.width, photo.height, width, height, start.transform);
            const dx = ((e.clientX - start.x) * width) / rect.width,
              dy = ((e.clientY - start.y) * height) / rect.height;
            const c = Math.cos(geo.angle),
              s = Math.sin(geo.angle);
            const overflowX = photo.width * geo.scale - Math.abs(c) * width - Math.abs(s) * height;
            const overflowY = photo.height * geo.scale - Math.abs(s) * width - Math.abs(c) * height;
            setDraft({
              ...start.transform,
              x: Math.max(
                -1,
                Math.min(
                  1,
                  start.transform.x + (overflowX > 1 ? (2 * (dx * c + dy * s)) / overflowX : 0),
                ),
              ),
              y: Math.max(
                -1,
                Math.min(
                  1,
                  start.transform.y + (overflowY > 1 ? (2 * (-dx * s + dy * c)) / overflowY : 0),
                ),
              ),
            });
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        />
      </div>
      <ZoomControl value={draft.zoom} onChange={(zoom) => setDraft((old) => ({ ...old, zoom }))} />
      <div className="crop-dialog__tools">
        <button
          className="button"
          onClick={() => setDraft((old) => ({ ...old, rotation: (old.rotation + 90) % 360 }))}
        >
          <RotateCw size={17} />
          {t('rotate')}
        </button>
        <button
          className="button"
          aria-pressed={draft.mirrored}
          onClick={() => setDraft((old) => ({ ...old, mirrored: !old.mirrored }))}
        >
          <MoveHorizontal size={17} />
          {t('mirror')}
        </button>
        <button className="button" onClick={() => setDraft(defaultTransform())}>
          <RotateCcw size={16} />
          {t('reset')}
        </button>
      </div>
      <div className="crop-dialog__actions">
        <button className="text-button crop-dialog__remove" onClick={onRemove}>
          <Trash2 size={15} />
          {t('removeSlot')}
        </button>
        <button className="button" onClick={onClose}>
          {t('cancelAction')}
        </button>
        <button className="button button--primary" onClick={() => onApply(draft)}>
          <Crop size={17} />
          {t('applyCrop')}
        </button>
      </div>
    </dialog>
  );
}
