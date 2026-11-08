import { PhotoTray } from './PhotoTray';
import { CropDialog } from './CropDialog';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImagePlus,
  LayoutTemplate,
  Palette,
  Upload,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Composition, Design, Locale, Photo, Transform } from '../../domain/types';
import { defaultTransform } from '../../domain/types';
import { FrameCanvas } from '../frame-preview';
import { DesignPicker } from '../frame-catalog';

export function Editor({
  frame,
  photos,
  composition,
  onComposition,
  onUpload,
  onCamera,
  onRemovePhoto,
  onBack,
  onPreview,
  busy,
  onDesignChange,
}: {
  frame: Design;
  photos: Photo[];
  composition: Composition;
  onComposition: (value: Composition) => void;
  onUpload: (files: File[]) => void;
  onCamera: (slotId?: string) => void;
  onRemovePhoto: (id: string) => void;
  onBack: () => void;
  onPreview: () => void;
  busy: boolean;
  onDesignChange: (frame: Design) => void;
}) {
  const { t, i18n } = useTranslation();
  const [selection, setSelected] = useState(frame.layout.slots[0].id);
  const selected = frame.layout.slots.some((slot) => slot.id === selection)
    ? selection
    : frame.layout.slots[0].id;
  const [dragging, setDragging] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const moved = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const uploadButton = useRef<HTMLButtonElement>(null);
  const designPanel = useRef<HTMLElement>(null);
  const [mobileTool, setMobileTool] = useState<'frame' | 'layout' | 'photos'>('photos');
  const previewPanel = useRef<HTMLDivElement>(null);
  const previousPreview = useRef({ frame, photos, composition });
  const showPreview = () => {
    if (matchMedia('(max-width: 700px)').matches)
      previewPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    const previous = previousPreview.current;
    previousPreview.current = { frame, photos, composition };
    if (
      previous.frame === frame &&
      previous.photos === photos &&
      previous.composition === composition
    )
      return;
    if (drag.current) return;
    const id = requestAnimationFrame(showPreview);
    return () => cancelAnimationFrame(id);
  }, [frame, photos, composition]);
  const goTo = (section: 'frame' | 'layout' | 'photos') => {
    setMobileTool(section);
    showPreview();
    designPanel.current?.querySelectorAll<HTMLDetailsElement>('details').forEach((details) => {
      details.open = true;
    });
  };
  const drag = useRef<{ x: number; y: number; transform: Transform } | null>(null);
  const current = composition[selected];
  const currentPhoto = photos.find((photo) => photo.id === current?.photoId);
  const currentSlot = frame.layout.slots.find((slot) => slot.id === selected)!;
  const missing = frame.layout.slots.filter((slot) => !composition[slot.id]).length;
  const update = (patch: Partial<Transform>) => {
    if (current)
      onComposition({
        ...composition,
        [selected]: { ...current, transform: { ...current.transform, ...patch } },
      });
  };
  const pick = (photoId: string) =>
    onComposition({ ...composition, [selected]: { photoId, transform: defaultTransform() } });
  return (
    <section className="studio" data-mobile-tool={mobileTool}>
      <div className="studio__heading">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={16} />
          {t('backHome')}
        </button>
        <p className="eyebrow">{t('yourFrame')}</p>
        <h1>{t('setupTitle')}</h1>
        <p className="muted">{t('setupSubtitle')}</p>
        <p className="studio__mobile-intro">{t('mobileSetupHint')}</p>
      </div>
      <nav className="studio__mobile-nav" aria-label={t('mobileStudioTools')}>
        <button aria-pressed={mobileTool === 'frame'} onClick={() => goTo('frame')}>
          <Palette size={19} />
          <span>{t('mobileFrame')}</span>
        </button>
        <button aria-pressed={mobileTool === 'layout'} onClick={() => goTo('layout')}>
          <LayoutTemplate size={19} />
          <span>{t('mobileLayout')}</span>
        </button>
        <button aria-pressed={mobileTool === 'photos'} onClick={() => goTo('photos')}>
          <ImagePlus size={19} />
          <span>{t('mobilePhotos')}</span>
          <small>{photos.length}</small>
        </button>
      </nav>
      <div className="studio__layout">
        <aside className="studio__design" ref={designPanel}>
          <h2 className="eyebrow">{t('frameLayoutLabel')}</h2>
          <DesignPicker compact value={frame} onChange={onDesignChange} disabled={busy} />
        </aside>
        <div
          ref={previewPanel}
          className={`studio__workspace${dragging ? ' studio__workspace--dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            onUpload([...event.dataTransfer.files]);
          }}
        >
          <div
            className="studio__frame"
            style={
              {
                aspectRatio: `${frame.layout.width}/${frame.layout.height}`,
                '--frame-ratio': frame.layout.width / frame.layout.height,
              } as CSSProperties
            }
          >
            <FrameCanvas
              frame={frame}
              photos={photos}
              composition={composition}
              selectedSlot={selected}
              width={850}
            />
            {frame.layout.slots.map((slot, index) => (
              <button
                key={slot.id}
                className="studio__slot"
                style={{
                  left: `${slot.x * 100}%`,
                  top: `${slot.y * 100}%`,
                  width: `${slot.width * 100}%`,
                  height: `${slot.height * 100}%`,
                  transform: `rotate(${slot.rotation}deg)`,
                }}
                aria-label={t('selectedSlot', { number: index + 1 })}
                aria-pressed={selected === slot.id}
                onClick={() => {
                  setSelected(slot.id);
                  if (composition[slot.id] && !moved.current) setToolsOpen(true);
                  else if (
                    !composition[slot.id] &&
                    !moved.current &&
                    matchMedia('(max-width: 700px)').matches
                  )
                    goTo('photos');
                  moved.current = false;
                }}
                onPointerDown={(event) => {
                  setSelected(slot.id);
                  moved.current = false;
                  const item = composition[slot.id];
                  if (item) {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    drag.current = {
                      x: event.clientX,
                      y: event.clientY,
                      transform: item.transform,
                    };
                  }
                }}
                onPointerMove={(event) => {
                  if (!drag.current) return;
                  if (
                    Math.hypot(event.clientX - drag.current.x, event.clientY - drag.current.y) > 4
                  )
                    moved.current = true;
                  const dx = (event.clientX - drag.current.x) / 150;
                  const dy = (event.clientY - drag.current.y) / 150;
                  const angle = ((current?.transform.rotation ?? 0) * Math.PI) / 180;
                  update({
                    x: Math.max(
                      -1,
                      Math.min(
                        1,
                        drag.current.transform.x + dx * Math.cos(angle) + dy * Math.sin(angle),
                      ),
                    ),
                    y: Math.max(
                      -1,
                      Math.min(
                        1,
                        drag.current.transform.y - dx * Math.sin(angle) + dy * Math.cos(angle),
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
            ))}
          </div>
          <span className="studio__frame-caption">
            {frame.layout.name[i18n.language as Locale]} <span>·</span> {t(frame.style)}
          </span>
          <p className="studio__help">{t(dragging ? 'drop' : 'slotHelp')}</p>
        </div>
        <aside className="studio__sidebar">
          <div className="panel">
            <h2>
              <ImagePlus size={18} />
              {t('addPhotos')}
            </h2>
            <input
              ref={input}
              className="u-visually-hidden"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              aria-label={t('upload')}
              onChange={(event) => {
                onUpload([...(event.target.files ?? [])]);
                event.target.value = '';
              }}
            />
            <button
              ref={uploadButton}
              className="button button--primary button--full"
              title={t('upload')}
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              <Upload size={17} />
              <span>{t(busy ? 'working' : 'upload')}</span>
            </button>
            <p className="panel__hint">{t('uploadHint')}</p>
            <div className="panel__divider">{t('or')}</div>
            <button
              className="button button--full"
              title={t('camera')}
              disabled={busy}
              onClick={() => onCamera()}
            >
              <Camera size={18} />
              <span>{t('camera')}</span>
            </button>
          </div>
          <PhotoTray
            mobileReturnFocus={uploadButton}
            photos={photos}
            composition={composition}
            selectedNumber={frame.layout.slots.findIndex((slot) => slot.id === selected) + 1}
            currentPhotoId={current?.photoId}
            onPick={pick}
            onRemove={onRemovePhoto}
            disabled={busy}
          />
        </aside>
      </div>

      {toolsOpen && current && currentPhoto && (
        <CropDialog
          photo={currentPhoto}
          slot={currentSlot}
          aspect={
            (currentSlot.width * frame.layout.width) / (currentSlot.height * frame.layout.height)
          }
          initial={current.transform}
          onClose={() => setToolsOpen(false)}
          onApply={(transform) => {
            update(transform);
            setToolsOpen(false);
          }}
          onRemove={() => {
            const next = { ...composition };
            delete next[selected];
            onComposition(next);
            setToolsOpen(false);
          }}
        />
      )}
      <div className="studio__continue">
        <div>
          <strong>
            {t('filledPhotos', {
              filled: frame.layout.slots.length - missing,
              total: frame.layout.slots.length,
            })}
          </strong>
          <p>{t(missing ? 'missing' : 'setupActionHint', { count: missing })}</p>
        </div>
        <button className="button button--primary" disabled={!!missing || busy} onClick={onPreview}>
          {t('preview')}
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
