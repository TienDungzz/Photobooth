import { loadArtwork } from '../../engine/artwork';
import { useTranslation } from 'react-i18next';
import { memo, useEffect, useRef, useState } from 'react';
import { renderComposition } from '../../engine/renderer';
import type { Composition, Design, Photo } from '../../domain/types';

const emptyPhotos: Photo[] = [];
const emptyComposition: Composition = {};

export const FrameCanvas = memo(function FrameCanvas({
  frame,
  photos = emptyPhotos,
  composition = emptyComposition,
  selectedSlot,
  placeholders = false,
  width = 600,
  transparent = false,
  decorationsOnly = false,
  layoutOnly = false,
}: {
  frame: Design;
  photos?: Photo[];
  composition?: Composition;
  selectedSlot?: string;
  placeholders?: boolean;
  width?: number;
  transparent?: boolean;
  decorationsOnly?: boolean;
  layoutOnly?: boolean;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let active = true;
    const canvas = ref.current;
    if (canvas) {
      canvas.dataset.renderState = 'loading';
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }
    void Promise.all([
      layoutOnly ? Promise.resolve(undefined) : loadArtwork(frame, width <= 300),
      document.fonts.ready,
    ])
      .then(([artwork]) => {
        if (active && canvas) {
          setError(false);
          renderComposition(canvas, frame, photos, composition, {
            artwork,
            width,
            selectedSlot,
            placeholders,
            transparent,
            decorationsOnly,
            layoutOnly,
          });
          canvas.dataset.renderState = 'ready';
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          if (canvas) canvas.dataset.renderState = 'error';
        }
      });
    return () => {
      active = false;
    };
  }, [
    frame,
    photos,
    composition,
    width,
    selectedSlot,
    placeholders,
    transparent,
    decorationsOnly,
    layoutOnly,
  ]);
  return (
    <>
      <canvas ref={ref} className="frame-canvas" aria-hidden="true" />
      {error && <p role="alert">{t('error.artwork')}</p>}
    </>
  );
});
