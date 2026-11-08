import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, Download, ExternalLink, Flower2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Composition, Design, Photo } from '../../domain/types';
import { FrameCanvas } from '../frame-preview';

import { usePreparedExport } from './usePreparedExport';

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
  const [retry, setRetry] = useState(0);
  const [message, setMessage] = useState('');
  const request = useMemo(
    () => ({ frame, photos, composition, format, size, transparent, retry }),
    [frame, photos, composition, format, size, transparent, retry],
  );
  const { file, url: result, error, busy } = usePreparedExport(request);
  const sharing = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    setMessage('');
  }, [request]);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  const download = () => {
    if (busy || sharing.current) return;
    if (!file || !result) {
      setRetry((value) => value + 1);
      return;
    }
    setMessage('');
    const isAppleMobile =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isAppleMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
      sharing.current = true;
      try {
        // No await before share: preserve the click's transient user activation.
        void navigator
          .share({ files: [file] })
          .catch((cause: unknown) => {
            if (alive.current && !(cause instanceof DOMException && cause.name === 'AbortError'))
              setMessage('error.share');
          })
          .finally(() => {
            sharing.current = false;
          });
      } catch {
        sharing.current = false;
        setMessage('error.share');
      }
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = result;
    anchor.download = file.name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setMessage('downloaded');
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
            {t(busy ? 'optimizingExport' : error ? 'retryExport' : 'download')}
          </button>
          {(error || message) && (
            <p
              className={`notice${(error || message).startsWith('error') ? ' notice--error' : ''}`}
              role="status"
            >
              {t(error || message)}
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
