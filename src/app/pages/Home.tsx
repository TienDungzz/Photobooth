import './HomeHero.css';
import type { MouseEvent } from 'react';
import {
  ArrowRight,
  Camera,
  Flower2,
  Heart,
  Images,
  LockKeyhole,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { frames, layouts, composeDesign } from '../../features/frame-catalog';
import { FrameCanvas } from '../../features/frame-preview';
import './Home.css';

export function Home({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  const start = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onStart();
  };
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow">
            <span />
            {t('homeEyebrow')}
          </span>
          <h1 id="home-title">
            {t('homeTitle')}
            <br />
            <em>{t('homeAccent')}</em>
            <Flower2 className="home-hero__flower" strokeWidth={1} />
          </h1>
          <p className="home-hero__description">{t('homeDescription')}</p>
          <div className="home-hero__buttons">
            <a className="button button--primary home-hero__cta" href="/setup" onClick={start}>
              {t('startCreating')}
              <ArrowRight size={18} />
            </a>
          </div>
          <p className="home-hero__privacy">
            <LockKeyhole size={13} />
            {t('private')}
            <span>·</span>
            {t('noAccount')}
          </p>
        </div>
        <div className="home-hero__art" aria-hidden="true">
          <div className="home-hero__halo" />
          <span className="home-hero__scribble">
            made of little
            <br />
            happy things.
          </span>
          <span className="home-hero__spark">✧</span>
          <div className="home-hero__print home-hero__print--back">
            <FrameCanvas frame={composeDesign(frames[0], layouts[3])} placeholders width={430} />
          </div>
          <div className="home-hero__print home-hero__print--front">
            <FrameCanvas frame={composeDesign(frames[1], layouts[6])} placeholders width={300} />
          </div>
          <div className="home-hero__tape" />
          <span className="home-hero__sticker">
            <Heart size={16} fill="currentColor" /> KEEP THIS MOMENT
          </span>
          <span className="home-hero__caption">a little you. a little us.</span>
        </div>
      </section>
      <section className="home-ribbon" aria-label={t('homeHighlights')}>
        <span>
          <Palette size={20} />
          <strong>{frames.length}</strong>
          {t('frameStylesLabel')}
        </span>
        <span>
          <Images size={20} />
          <strong>{layouts.length}</strong>
          {t('layoutsLabel')}
        </span>
        <span>
          <Camera size={20} />
          {t('cameraOrUpload')}
        </span>
        <span>
          <LockKeyhole size={20} />
          {t('localOnly')}
        </span>
      </section>
      <section className="home-collection">
        <div className="home-collection__copy">
          <span className="eyebrow">YOUR MOOD, YOUR FRAME</span>
          <h2>{t('homeCollectionTitle')}</h2>
          <p className="muted">
            {t('homeCollectionDescription', { frames: frames.length, layouts: layouts.length })}
          </p>
          <a href="/setup" className="home-hero__secondary" onClick={start}>
            {t('exploreFrames')}
            <ArrowRight size={17} />
          </a>
        </div>
        <div className="home-collection__prints" aria-hidden="true">
          {[0, 1, 3, 4].map((index) => (
            <div className="home-collection__print" key={index}>
              <FrameCanvas
                frame={composeDesign(frames[index], layouts[3])}
                decorationsOnly
                width={220}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="home-invite">
        <Sparkles size={28} strokeWidth={1.2} />
        <h2>{t('homeInviteTitle')}</h2>
        <p>{t('homeInviteDescription')}</p>
        <a className="button button--primary" href="/setup" onClick={start}>
          {t('startCreating')}
          <ArrowRight size={17} />
        </a>
      </section>
    </div>
  );
}
