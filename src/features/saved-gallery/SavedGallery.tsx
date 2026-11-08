import { useEffect, useState } from 'react';
import { Download, Images, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { deleteProject, listProjects, type SavedProject } from './storage';
import './SavedGallery.css';

function SavedCard({
  project,
  onRestore,
  onDelete,
  disabled,
}: {
  project: SavedProject;
  onRestore: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    const value = URL.createObjectURL(project.result);
    setUrl(value);
    return () => URL.revokeObjectURL(value);
  }, [project]);
  const download = () => {
    setError(false);
    const apple =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (apple && navigator.share && navigator.canShare?.({ files: [project.result] })) {
      void navigator.share({ files: [project.result] }).catch((cause) => {
        if (!(cause instanceof DOMException && cause.name === 'AbortError')) setError(true);
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = project.result.name;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    }
  };
  return (
    <article className="saved-gallery__card">
      <a
        href={url || undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('openImage')}
      >
        {url && <img src={url} alt={t('savedPhoto')} />}
      </a>
      <p>{t('savedUntil', { date: new Date(project.expiresAt).toLocaleString(i18n.language) })}</p>
      <div className="saved-gallery__actions">
        <button className="button" onClick={onRestore} disabled={disabled}>
          <Pencil size={16} />
          {t('editAgain')}
        </button>
        <button
          className="icon-button"
          aria-label={t('download')}
          onClick={download}
          disabled={!url || disabled}
        >
          <Download size={18} />
        </button>
        <button
          className="icon-button"
          aria-label={t('deleteSavedPhoto')}
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 size={18} />
        </button>
      </div>
      {error && (
        <p role="status" className="notice notice--error">
          {t('error.share')}
        </p>
      )}
    </article>
  );
}

export function SavedGallery({
  onRestore,
  busy,
}: {
  onRestore: (project: SavedProject) => void;
  busy: boolean;
}) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [revision, refresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState<SavedProject | null>(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    void listProjects()
      .then((items) => {
        if (alive) setProjects(items);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [revision]);
  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    const visible = () => {
      if (document.visibilityState === 'visible') update();
    };
    const nextExpiry = projects.length
      ? Math.max(1, Math.min(...projects.map((project) => project.expiresAt)) - Date.now())
      : 60_000;
    const timer = window.setTimeout(update, Math.min(nextExpiry, 60_000));
    document.addEventListener('visibilitychange', visible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [projects, revision]);
  const remove = async () => {
    if (!pending || deleting) return;
    setDeleting(true);
    setPending(null);
    try {
      await deleteProject(pending.id);
      refresh((value) => value + 1);
    } catch {
      setError(true);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <section className="saved-gallery">
      <h1>
        <Images size={28} />
        {t('savedGallery')}
      </h1>
      <p className="muted">{t('savedGalleryHint')}</p>
      {loading && <p role="status">{t('working')}</p>}
      {error && (
        <div role="status" className="notice notice--error">
          {t('error.gallery')}{' '}
          <button className="text-button" onClick={() => refresh((value) => value + 1)}>
            {t('retryGallery')}
          </button>
        </div>
      )}
      {!loading && !error && !projects.length && (
        <p className="empty-state">{t('savedGalleryEmpty')}</p>
      )}
      <div className="saved-gallery__grid">
        {projects
          .filter((project) => project.expiresAt > Date.now())
          .map((project) => (
            <SavedCard
              key={project.id}
              project={project}
              onRestore={() => onRestore(project)}
              onDelete={() => setPending(project)}
              disabled={busy || deleting}
            />
          ))}
      </div>
      {pending && (
        <ConfirmDialog
          title={t('deleteSavedPhoto')}
          description={t('deleteSavedConfirm')}
          confirmLabel={t('deleteSavedPhoto')}
          onConfirm={() => void remove()}
          onCancel={() => setPending(null)}
        />
      )}
    </section>
  );
}
