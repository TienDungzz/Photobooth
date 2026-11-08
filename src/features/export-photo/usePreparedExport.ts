import { useEffect, useState } from 'react';
import { loadArtwork } from '../../engine/artwork';
import { renderComposition } from '../../engine/renderer';
import type { Composition, Design, Photo } from '../../domain/types';
import { optimizedExport } from './optimize';

export type ExportRequest = {
  frame: Design;
  photos: Photo[];
  composition: Composition;
  format: 'png' | 'jpeg';
  size: number;
  transparent: boolean;
  retry: number;
};

export const EXPORT_TIMEOUT_MS = 15_000;

export function usePreparedExport(request: ExportRequest) {
  const [state, setState] = useState<{
    request: ExportRequest;
    file?: File;
    url?: string;
    error?: string;
  }>();
  useEffect(() => {
    const controller = new AbortController();
    const deadline = Date.now() + EXPORT_TIMEOUT_MS;
    const checkDeadline = () => {
      controller.signal.throwIfAborted();
      if (Date.now() >= deadline) throw new DOMException('Export timed out', 'TimeoutError');
    };
    let resultUrl = '';
    let canvas: HTMLCanvasElement | undefined;
    const releaseCanvas = () => {
      if (canvas) canvas.width = canvas.height = 0;
    };
    const timer = window.setTimeout(() => {
      controller.abort();
      releaseCanvas();
      setState({ request, error: 'error.exportTimeout' });
    }, EXPORT_TIMEOUT_MS);
    const prepare = async () => {
      try {
        const { frame, photos, composition, format, size, transparent } = request;
        const [artwork] = await Promise.all([loadArtwork(frame), document.fonts.ready]);
        checkDeadline();
        canvas = document.createElement('canvas');
        renderComposition(canvas, frame, photos, composition, {
          artwork,
          width: Math.round(
            (size * frame.layout.width) / Math.max(frame.layout.width, frame.layout.height),
          ),
          height: Math.round(
            (size * frame.layout.height) / Math.max(frame.layout.width, frame.layout.height),
          ),
          transparent: format === 'png' && transparent,
        });
        const blob = await optimizedExport(canvas, format);
        checkDeadline();
        const file = new File(
          [blob],
          `photobooth-${frame.id}.${format === 'png' ? 'png' : 'jpg'}`,
          { type: blob.type },
        );
        resultUrl = URL.createObjectURL(file);
        setState({ request, file, url: resultUrl });
      } catch (cause) {
        if (!controller.signal.aborted)
          setState({
            request,
            error:
              cause instanceof DOMException && cause.name === 'TimeoutError'
                ? 'error.exportTimeout'
                : 'error.export',
          });
      } finally {
        clearTimeout(timer);
        releaseCanvas();
      }
    };
    void prepare();
    return () => {
      controller.abort();
      clearTimeout(timer);
      releaseCanvas();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [request]);
  const current = state?.request === request ? state : undefined;
  return { file: current?.file, url: current?.url, error: current?.error, busy: !current };
}
