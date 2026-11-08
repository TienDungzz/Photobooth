import { loadArtwork } from '../../engine/artwork';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, Download, ExternalLink, Flower2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Composition, Design, Photo } from '../../domain/types';
import { FrameCanvas } from '../frame-preview';
import { renderComposition } from '../../engine/renderer';
import { optimizedExport } from './optimize';

export function Finish({
  frame,
  photos,
  composition,
  onBack,
  onNew,
}: {
  frame: Design;
  photos: Photo[];
  composition: Composition;
  onBack: () => void;
  onNew: () => void;
}) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<'png' | 'jpeg'>('jpeg');
  const [size, setSize] = useState(2400);
  const [transparent, setTransparent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const url = useRef('');
  const alive = useRef(true);
  const locked = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, []);
  const download = async () => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setMessage('');
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const [artwork] = await Promise.all([loadArtwork(frame), document.fonts.ready]);
      const canvas = document.createElement('canvas');
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
      canvas.width = 0;
      canvas.height = 0;
      if (!alive.current) return;
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      setResult(url.current);
      const anchor = document.createElement('a');
      anchor.href = url.current;
      anchor.download = `photobooth-${frame.id}.${format === 'png' ? 'png' : 'jpg'}`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setMessage('downloaded');
    } catch {
      if (alive.current) setMessage('error.export');
    } finally {
      locked.current = false;
      if (alive.current) setBusy(false);
    }
  };
  return (
    <section
      className="finish"
      style={{ '--frame-ratio': frame.layout.width / frame.layout.height } as CSSProperties}
    >
      <div className="finish__heading">
        <p className="eyebrow">{t('finishLabel')}</p>
        <h1>
          {t('finishTitle')}
          <Flower2 size={35} />
        </h1>
        <p className="muted">{t('finishDescription')}</p>
      </div>
      <div className="finish__layout">
        <div className="finish__preview">
          <div className="finish__frame">
            <FrameCanvas
              frame={frame}
              photos={photos}
              composition={composition}
              transparent={format === 'png' && transparent}
              width={850}
            />
          </div>
        </div>
        <div className="panel finish__controls">
          <label>
            {t('format')}
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as 'png' | 'jpeg')}
              disabled={busy}
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </label>
          <label>
            {t('quality')}
            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              disabled={busy}
            >
              <option value={2400}>{t('fullQuality')}</option>
              <option value={1200}>{t('smallQuality')}</option>
            </select>
          </label>
          {format === 'png' && (
            <label className="checkbox">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(event) => setTransparent(event.target.checked)}
                disabled={busy}
              />
              {t('transparent')}
            </label>
          )}
          <p className="muted">{t('jpegNote')}</p>
          <button
            className="button button--primary button--full"
            onClick={() => void download()}
            disabled={busy}
          >
            <Download size={18} />
            {t(busy ? 'optimizingExport' : 'download')}
          </button>
          {message && (
            <p
              className={`notice${message.startsWith('error') ? ' notice--error' : ''}`}
              role="status"
            >
              {t(message)}
            </p>
          )}
          {result && (
            <a className="button" href={result} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              {t('openImage')}
            </a>
          )}
          <button className="button button--full" onClick={onBack} disabled={busy}>
            <ArrowLeft size={17} />
            {t('editAgain')}
          </button>
          <button className="text-button" onClick={onNew} disabled={busy}>
            <RotateCcw size={15} />
            {t('newSession')}
          </button>
          <p className="privacy-note">{t('private')}</p>
        </div>
      </div>
    </section>
  );
}
