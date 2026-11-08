import './PhotoTray.css';
import { useRef, useState, type RefObject } from 'react';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { Check, Images, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Photo, Composition } from '../../domain/types';
export function PhotoTray({
  photos,
  composition,
  selectedNumber,
  currentPhotoId,
  onPick,
  onRemove,
  disabled = false,
  mobileReturnFocus,
}: {
  photos: Photo[];
  composition: Composition;
  selectedNumber: number;
  currentPhotoId?: string;
  onPick: (id: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
  mobileReturnFocus?: RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslation();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const tray = useRef<HTMLElement>(null);
  return (
    <section className="photo-tray" ref={tray} tabIndex={-1}>
      <div className="photo-tray__heading">
        <h2>
          <Images size={19} />
          {t('library')}
          <span>{photos.length}/30</span>
        </h2>
        <p className="muted">{t('libraryHint')}</p>
      </div>
      {photos.length === 0 ? (
        <div className="photo-tray__empty">
          <Images size={25} />
          {t('noPhotos')}
        </div>
      ) : (
        <div className="photo-tray__items">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photo-tray__item">
              <button
                className={`photo-tray__pick${currentPhotoId === photo.id ? ' photo-tray__pick--selected' : ''}`}
                onClick={() => onPick(photo.id)}
                aria-label={`${t('selectedSlot', { number: selectedNumber })}: ${index + 1}`}
              >
                <img src={photo.url} alt={`${index + 1}`} />
                {Object.values(composition).some((item) => item.photoId === photo.id) && (
                  <Check size={14} />
                )}
              </button>
              <button
                className="photo-tray__delete"
                disabled={disabled}
                aria-label={`${t('removePhoto')} ${index + 1}`}
                onClick={() => setPendingDelete(photo.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title={t('deletePhotoTitle')}
          description={t('confirmDelete')}
          confirmLabel={t('removePhoto')}
          onCancel={() => setPendingDelete(null)}
          returnFocus={
            matchMedia('(max-width: 700px)').matches ? (mobileReturnFocus ?? tray) : tray
          }
          onConfirm={() => {
            onRemove(pendingDelete);
            setPendingDelete(null);
          }}
        />
      )}
    </section>
  );
}
