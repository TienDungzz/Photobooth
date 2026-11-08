import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Check, RefreshCw, Settings2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Photo } from '../../domain/types';
import { CaptureSession, type CaptureState } from '../capture-session';
import { canvasBlob } from '../../engine/renderer';
import { importPhoto, releasePhoto } from '../photo-library';

export function CameraDialog({
  onUse,
  onClose,
  onSettings,
}: {
  onUse: (photos: Photo[]) => void;
  onClose: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const owned = useRef<Photo[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [attempt, setAttempt] = useState(0);
  const [delay, setDelay] = useState(3);
  const [count, setCount] = useState(1);
  const [interval, setIntervalSeconds] = useState(3);
  const [mirror, setMirror] = useState(true);
  const mirrorRef = useRef(mirror);
  mirrorRef.current = mirror;
  const [shots, setShots] = useState<Photo[]>([]);
  const [included, setIncluded] = useState<Set<string>>(new Set());
  const [state, setState] = useState<CaptureState>({
    status: 'ready',
    captured: 0,
    total: count,
    remaining: 0,
  });
  const controller = useRef<CaptureSession | null>(null);
  const busy = ['countdown', 'capturing', 'interval'].includes(state.status);
  const stopStream = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement;
    node?.showModal();
    return () => {
      node?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  useEffect(() => {
    let active = true;
    const session = new CaptureSession(
      async (isCurrent) => {
        const target = video.current;
        if (!target || target.readyState < 2 || !stream.current?.active)
          throw new Error('Camera unavailable');
        const canvas = document.createElement('canvas');
        canvas.width = target.videoWidth;
        canvas.height = target.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');
        if (mirrorRef.current) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(target, 0, 0);
        const photo = await importPhoto(await canvasBlob(canvas), false);
        if (!active || !isCurrent()) {
          releasePhoto(photo);
          return;
        }
        owned.current.push(photo);
        setShots([...owned.current]);
        setIncluded((old) => new Set([...old, photo.id]));
      },
      setState,
      () => setError(true),
    );
    controller.current = session;
    const visibility = () => {
      if (document.hidden) session.pause();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      active = false;
      session.dispose();
      stopStream();
      document.removeEventListener('visibilitychange', visibility);
      owned.current.forEach(releasePhoto);
      owned.current = [];
    };
  }, [stopStream]);
  useEffect(() => {
    let canceled = false;
    setReady(false);
    setError(false);
    stopStream();
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(true);
      return;
    }
    void navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: facing } }),
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then(async (media) => {
        if (canceled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream.current = media;
        media.getVideoTracks().forEach((track) =>
          track.addEventListener('ended', () => {
            if (!canceled) {
              setReady(false);
              setError(true);
              controller.current?.pause();
            }
          }),
        );
        if (video.current) {
          video.current.srcObject = media;
          try {
            await video.current.play();
          } catch {
            if (!canceled) setError(true);
          }
        }
        try {
          const all = await navigator.mediaDevices.enumerateDevices();
          if (!canceled) setDevices(all.filter((item) => item.kind === 'videoinput'));
        } catch {
          /* Facing mode remains available. */
        }
      })
      .catch(() => {
        if (!canceled) setError(true);
      });
    return () => {
      canceled = true;
      stopStream();
    };
  }, [deviceId, facing, attempt, stopStream]);
  const usePhotos = () => {
    controller.current?.stop();
    const chosen = owned.current.filter((photo) => included.has(photo.id));
    owned.current = owned.current.filter((photo) => !included.has(photo.id));
    onUse(chosen);
  };
  return (
    <dialog
      ref={dialog}
      className="camera-dialog"
      aria-labelledby="camera-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="camera-dialog__heading">
        <div>
          <p className="eyebrow">PHOTOBOOTH STUDIO</p>
          <h2 id="camera-title">{t('cameraTitle')}</h2>
          <p className="muted">{t('cameraDescription')}</p>
        </div>
        <div className="camera-dialog__actions">
          <button className="icon-button" onClick={onSettings} aria-label={t('settings')}>
            <Settings2 size={19} />
          </button>
          <button className="icon-button" onClick={onClose} aria-label={t('close')}>
            <X />
          </button>
        </div>
      </div>
      <div className="camera-dialog__body">
        <div>
          <div className="camera-dialog__view">
            <video
              ref={video}
              className={`camera-dialog__video${mirror ? ' camera-dialog__video--mirrored' : ''}`}
              autoPlay
              playsInline
              muted
              onLoadedData={() => setReady(true)}
            />
            {!ready && (
              <div className="camera-dialog__overlay">
                <Camera size={36} />
                <p>{t(error ? 'error.camera' : 'cameraLoading')}</p>
                {error && (
                  <button className="button" onClick={() => setAttempt((old) => old + 1)}>
                    {t('retry')}
                  </button>
                )}
              </div>
            )}
            {state.remaining > 0 && (
              <div className="camera-dialog__countdown" aria-hidden="true">
                {state.remaining}
              </div>
            )}
            {ready && (
              <span className="camera-dialog__live">
                <span />
                {t('cameraOn')}
              </span>
            )}
            {busy && (
              <span className="camera-dialog__progress">
                {t('captureProgress', {
                  current: Math.min(state.captured + 1, state.total),
                  total: state.total,
                })}
              </span>
            )}
          </div>
          <p className="camera-dialog__status" role="status">
            {t(
              state.status === 'paused'
                ? 'paused'
                : state.captured
                  ? 'captureProgress'
                  : 'cameraReady',
              { current: state.captured, total: state.total },
            )}
          </p>
          {shots.length > 0 && (
            <>
              <div className="camera-dialog__shots">
                {shots.map((photo, index) => (
                  <button
                    key={photo.id}
                    className={`camera-dialog__shot${included.has(photo.id) ? ' camera-dialog__shot--selected' : ''}`}
                    onClick={() =>
                      setIncluded((old) => {
                        const next = new Set(old);
                        if (next.has(photo.id)) next.delete(photo.id);
                        else next.add(photo.id);
                        return next;
                      })
                    }
                    aria-label={t('deleteCapture', { number: index + 1 })}
                    aria-pressed={included.has(photo.id)}
                  >
                    <img src={photo.url} alt={`${index + 1}`} />
                    {included.has(photo.id) && <Check size={16} />}
                  </button>
                ))}
              </div>
              <p className="muted">{t('reviewHint')}</p>
            </>
          )}
        </div>
        <div className="camera-dialog__controls">
          <fieldset disabled={busy || state.status === 'paused'}>
            <label>
              {t('cameraDevice')}
              <select value={deviceId} onChange={(event) => setDeviceId(event.target.value)}>
                <option value="">{t('cameraDevice')}</option>
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `${t('cameraDevice')} ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button button--subtle"
              onClick={() => {
                setDeviceId('');
                setFacing((old) => (old === 'user' ? 'environment' : 'user'));
              }}
            >
              <RefreshCw size={15} />
              {t('switchCamera')}
            </button>
            <label>
              {t('timer')}
              <select value={delay} onChange={(event) => setDelay(Number(event.target.value))}>
                {Array.from({ length: 11 }, (_, index) => (
                  <option key={index} value={index}>
                    {t('seconds', { count: index })}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('burst')}
              <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                {Array.from({ length: 9 }, (_, index) => (
                  <option key={index + 1}>{index + 1}</option>
                ))}
              </select>
            </label>
            <p className="panel__hint">
              {t(count === 1 ? 'singleCaptureHint' : 'burstCaptureHint', { count })}
            </p>
            <label>
              {t('interval')}
              <select
                value={interval}
                onChange={(event) => setIntervalSeconds(Number(event.target.value))}
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {t('seconds', { count: index + 1 })}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={mirror}
                onChange={(event) => setMirror(event.target.checked)}
              />
              {t('mirrorCapture')}
            </label>
          </fieldset>
          {error && (
            <p className="notice notice--error" role="alert">
              {t('error.camera')}
            </p>
          )}
          {busy ? (
            <button className="button button--primary" onClick={() => controller.current?.stop()}>
              {t('stopCapture')}
            </button>
          ) : state.status === 'paused' ? (
            <>
              <button
                className="button button--primary"
                disabled={!ready || error}
                onClick={() => controller.current?.resume()}
              >
                {t('resume')}
              </button>
              <button className="button" onClick={() => controller.current?.stop()}>
                {t('stopCapture')}
              </button>
            </>
          ) : (
            <button
              className="button button--primary"
              disabled={!ready || error || shots.length >= 9}
              onClick={() =>
                controller.current?.start({
                  count: Math.min(count, 9 - shots.length),
                  delay,
                  interval,
                })
              }
            >
              <Camera size={18} />
              {t(shots.length ? 'captureAgain' : 'startCapture')}
            </button>
          )}
          <button className="button" disabled={included.size === 0 || busy} onClick={usePhotos}>
            <Check size={18} />
            {t('usePhotos', { count: included.size })}
          </button>
          <p className="privacy-note">{t('private')}</p>
        </div>
      </div>
    </dialog>
  );
}
