import { Home } from './pages/Home';
import { usePage } from './usePage';
import { SettingsDialog } from './components/SettingsDialog';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { mergePhotos } from '../features/photo-library/merge-photos';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Flower2, Globe2, Settings2, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { frames, layouts, composeDesign } from '../features/frame-catalog';
import { Editor } from '../features/editor';
import {
  defaultTransform,
  type Composition,
  type Design,
  type Locale,
  type Photo,
} from '../domain/types';
import { importPhoto, InvalidPhoto, releasePhoto, MAX_PHOTOS } from '../features/photo-library';
import { readPreferences, savePreferences } from '../shared/lib/preferences';
import { assignToEmpty, changeFrame } from '../domain/composition';
const CameraDialog = lazy(() =>
  import('../features/camera').then((module) => ({ default: module.CameraDialog })),
);
const Finish = lazy(() =>
  import('../features/export-photo').then((module) => ({ default: module.Finish })),
);

export function App() {
  const { t, i18n } = useTranslation();
  const [page, setRoute] = usePage();
  const [frame, setFrame] = useState<Design>(() => composeDesign(frames[0], layouts[10]));
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoRef = useRef<Photo[]>([]);
  const [composition, setComposition] = useState<Composition>({});
  const compositionRef = useRef(composition);
  compositionRef.current = composition;
  const [preferences, setPreferences] = useState(readPreferences);
  const [settings, setSettings] = useState(false);
  const [confirmNewSession, setConfirmNewSession] = useState(false);
  const [camera, setCamera] = useState<{ slotId?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const alive = useRef(true);
  const [messages, setMessages] = useState<string[]>([]);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    if (page !== 'editor') setCamera(null);
    if (page !== 'finish') setConfirmNewSession(false);
  }, [page]);
  useEffect(() => {
    if (page === 'finish' && frame.layout.slots.some((slot) => !composition[slot.id]))
      setRoute('editor', true);
  }, [page, frame, composition, setRoute]);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.theme =
        preferences.themePreference === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : preferences.themePreference;
    };
    apply();
    media.addEventListener('change', apply);
    savePreferences(preferences);
    return () => media.removeEventListener('change', apply);
  }, [preferences]);
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  useEffect(() => {
    alive.current = true;
    const before = (event: BeforeUnloadEvent) => {
      if (photoRef.current.length) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', before);
    return () => {
      alive.current = false;
      window.removeEventListener('beforeunload', before);
      photoRef.current.forEach(releasePhoto);
      photoRef.current = [];
    };
  }, []);
  const navigate = (next: typeof page) => {
    if (locked.current) return;
    setRoute(next);
    setMessages([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => main.current?.focus());
  };
  const addPhotos = (incoming: Photo[], slotId?: string) => {
    const plan = mergePhotos(photoRef.current, incoming);
    if (plan.limited) setMessages(['limit']);
    plan.discarded.forEach(releasePhoto);
    const next = [...photoRef.current, ...plan.added];
    photoRef.current = next;
    setPhotos(next);
    let assigned = { ...compositionRef.current };
    if (slotId && plan.assignments[0])
      assigned[slotId] = { photoId: plan.assignments[0].id, transform: defaultTransform() };
    else if (frame) {
      assigned = assignToEmpty(frame, assigned, plan.assignments);
    }
    setComposition(assigned);
    return plan.limited;
  };
  const upload = async (files: File[]) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setMessages([]);
    const incoming: Photo[] = [];
    const staged: Photo[] = [];
    const errors = new Set<string>();
    try {
      for (const file of files) {
        try {
          const photo = await importPhoto(file);
          if (!alive.current) {
            releasePhoto(photo);
            break;
          }
          const plan = mergePhotos([...photoRef.current, ...staged], [photo]);
          plan.discarded.forEach(releasePhoto);
          staged.push(...plan.added);
          incoming.push(...plan.assignments);
          if (plan.limited) errors.add('limit');
        } catch (error) {
          errors.add(error instanceof InvalidPhoto ? `error.${error.code}` : 'error.decode');
        }
      }
      if (alive.current) {
        if (addPhotos(incoming)) errors.add('limit');
        setMessages([...errors]);
      } else staged.forEach(releasePhoto);
    } finally {
      locked.current = false;
      if (alive.current) setBusy(false);
    }
  };
  const selectFrame = (next: Design) => {
    if (locked.current) return;
    setComposition(changeFrame(frame, next, composition));
    setFrame(next);
  };
  const removePhoto = (id: string) => {
    if (locked.current) return;
    const target = photoRef.current.find((photo) => photo.id === id);
    if (target) releasePhoto(target);
    photoRef.current = photoRef.current.filter((photo) => photo.id !== id);
    setPhotos([...photoRef.current]);
    setComposition(
      Object.fromEntries(Object.entries(composition).filter(([, item]) => item.photoId !== id)),
    );
  };
  const newSession = () => {
    if (locked.current) return;
    setConfirmNewSession(false);
    photoRef.current.forEach(releasePhoto);
    photoRef.current = [];
    setPhotos([]);
    setComposition({});
    setFrame(composeDesign(frames[0], layouts[10]));
    navigate('editor');
  };
  const setLocale = (locale: Locale) => {
    void i18n.changeLanguage(locale);
    setPreferences((old) => ({ ...old, locale }));
  };
  return (
    <div className={'app' + (page !== 'home' ? ' app--setup' : '')}>
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>
      <header className="header">
        <button className="brand" onClick={() => navigate('home')} aria-label="Photobooth">
          <picture>
            <source srcSet="/brand/logo.svg" type="image/svg+xml" />
            <img className="brand__logo" src="/brand/logo.png" alt="" width="56" height="56" />
          </picture>
          <span className="brand__wordmark">
            photobooth<span className="brand__dot">.</span>
            <small className="brand__tagline">{t('tagline')}</small>
          </span>
        </button>
        <nav className="header__nav" aria-label="Photobooth">
          <button
            className={`header__link${page === 'home' ? ' header__link--active' : ''}`}
            onClick={() => navigate('home')}
          >
            {t('homeNav')}
          </button>
          <button
            className={`header__link${page !== 'home' ? ' header__link--active' : ''}`}
            disabled={!frame}
            onClick={() => navigate('editor')}
          >
            {t('studio')}
          </button>
        </nav>
        <div className="header__actions">
          <button
            className="header__language"
            onClick={() => setLocale(i18n.language === 'vi' ? 'en' : 'vi')}
            aria-label={t('language')}
          >
            <Globe2 size={16} />
            <span>{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
          </button>
          <button
            className="icon-button"
            onClick={() => setSettings(true)}
            aria-label={t('settings')}
          >
            <Settings2 size={19} />
          </button>
        </div>
      </header>

      <main id="main" ref={main} tabIndex={-1} className="main">
        {messages.length > 0 && (
          <div className="messages" role="status">
            {messages.map((message) => (
              <p className="notice" key={message}>
                {t(message)}
              </p>
            ))}
            <button className="icon-button" onClick={() => setMessages([])} aria-label={t('close')}>
              <X size={16} />
            </button>
          </div>
        )}
        {page === 'home' && <Home onStart={() => navigate('editor')} />}
        {frame && page === 'editor' && (
          <Editor
            onDesignChange={selectFrame}
            frame={frame}
            photos={photos}
            composition={composition}
            onComposition={setComposition}
            onUpload={(files) => void upload(files)}
            onCamera={(slotId) => {
              if (photos.length >= MAX_PHOTOS) {
                setMessages(['limit']);
                return;
              }
              setCamera({ slotId });
            }}
            onRemovePhoto={removePhoto}
            onBack={() => navigate('home')}
            onPreview={() => navigate('finish')}
            busy={busy}
          />
        )}
        <Suspense
          fallback={
            <p className="empty-state" role="status">
              {t('working')}
            </p>
          }
        >
          {frame && page === 'finish' && (
            <Finish
              frame={frame}
              photos={photos}
              composition={composition}
              onBack={() => navigate('editor')}
              onNew={() => setConfirmNewSession(true)}
            />
          )}
          {camera && page === 'editor' && (
            <CameraDialog
              onSettings={() => setSettings(true)}
              onClose={() => setCamera(null)}
              onUse={(incoming) => {
                addPhotos(incoming, camera.slotId);
                setCamera(null);
              }}
            />
          )}
        </Suspense>
      </main>
      <footer className="footer">
        <span>
          <Flower2 size={18} />
          {t('footer')}
        </span>
        <span>
          <ShieldCheck size={15} />
          {t('localNote')}
        </span>
        <span>© {new Date().getFullYear()} Photobooth</span>
      </footer>
      {settings && (
        <SettingsDialog
          preferences={preferences}
          onLocale={setLocale}
          onTheme={(theme) => setPreferences((old) => ({ ...old, themePreference: theme }))}
          onClose={() => setSettings(false)}
        />
      )}
      {confirmNewSession && (
        <ConfirmDialog
          title={t('newSession')}
          description={t('newSessionConfirm')}
          confirmLabel={t('startNewSession')}
          onConfirm={newSession}
          onCancel={() => setConfirmNewSession(false)}
          returnFocus={main}
        />
      )}
    </div>
  );
}
