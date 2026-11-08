import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Design, Locale } from '../../domain/types';
import { frames, layouts, composeDesign } from './catalog';
import { FrameCanvas } from '../frame-preview';
import { filterFrames, filterLayouts, collections, layoutStyles } from './filters';
import { PickerTools } from './PickerTools';
import './DesignPicker.css';
import { artLayouts } from './art-frames';
import { expressiveFrames, expressiveLayouts } from './expressive-catalog';
import { occasionFrames, occasionLayouts } from './occasion-catalog';
import { signatureFrames, signatureLayouts } from './signature-catalog';
import { graphicFrames, graphicLayouts } from './graphic-catalog';
import { craftFrames, craftLayouts } from './craft-catalog';
import { referenceFrames, referenceLayouts } from './reference-catalog';
import { inspiredFrames, inspiredLayouts } from './inspired-catalog';
import { ornamentFrames, ornamentLayouts } from './ornament-catalog';

const orderedLayouts = [
  ...ornamentLayouts,
  ...inspiredLayouts,
  ...referenceLayouts,
  ...craftLayouts,
  ...graphicLayouts,
  ...signatureLayouts,
  ...occasionLayouts,
  ...expressiveLayouts,
  ...artLayouts,
  ...layouts.filter(
    (layout) =>
      !artLayouts.includes(layout) &&
      !expressiveLayouts.includes(layout) &&
      !occasionLayouts.includes(layout) &&
      !signatureLayouts.includes(layout) &&
      !graphicLayouts.includes(layout) &&
      !craftLayouts.includes(layout) &&
      !referenceLayouts.includes(layout) &&
      !inspiredLayouts.includes(layout) &&
      !ornamentLayouts.includes(layout),
  ),
];
const orderedFrames = [
  ...ornamentFrames,
  ...inspiredFrames,
  ...referenceFrames,
  ...craftFrames,
  ...graphicFrames,
  ...signatureFrames,
  ...occasionFrames,
  ...expressiveFrames,
  ...frames.filter(
    (frame) =>
      !expressiveFrames.includes(frame) &&
      !occasionFrames.includes(frame) &&
      !signatureFrames.includes(frame) &&
      !graphicFrames.includes(frame) &&
      !craftFrames.includes(frame) &&
      !referenceFrames.includes(frame) &&
      !inspiredFrames.includes(frame) &&
      !ornamentFrames.includes(frame),
  ),
];

export function DesignPicker({
  value,
  onChange,
  disabled = false,
  compact = false,
}: {
  value: Design;
  onChange: (frame: Design) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [style, setStyle] = useState('all');
  const [collection, setCollection] = useState('all');
  const [count, setCount] = useState('all');
  const frameResults = filterFrames(orderedFrames, collection);
  const layoutResults = filterLayouts(orderedLayouts, count, style);
  return (
    <div
      className={
        'design-picker' + (compact ? ' design-picker--compact' : ' design-picker--expanded')
      }
    >
      <details className="design-picker__section" open>
        <summary className="design-picker__summary">
          <span>
            {t('chooseFrameStyle')}
            <small>{value.name[locale]}</small>
          </span>
          <ChevronDown size={16} />
        </summary>
        <PickerTools
          controls={[
            {
              label: 'frameCollection',
              value: collection,
              onChange: setCollection,
              options: [
                { value: 'all', label: t('allFrameCollections') },
                ...['artwork', 'basic', ...collections].map((value) => ({
                  value,
                  label: t(value),
                })),
              ],
            },
          ]}
        />
        <div className="design-picker__rail" role="group" aria-label={t('chooseFrameStyle')}>
          {frameResults.map((frame) => (
            <button
              key={frame.id}
              className={'design-card' + (value.id === frame.id ? ' design-card--selected' : '')}
              aria-label={t('chooseFrameStyle') + ': ' + frame.name[locale]}
              aria-pressed={value.id === frame.id}
              disabled={disabled}
              onClick={() => onChange(composeDesign(frame, value.layout))}
            >
              <span className="design-card__paper">
                <FrameCanvas frame={composeDesign(frame, layouts[0])} decorationsOnly width={150} />
              </span>
              <span className="design-card__name" title={frame.name[locale]}>
                {frame.name[locale]}
              </span>
            </button>
          ))}
        </div>
        {frameResults.length === 0 && <p className="design-picker__empty">{t('noMatches')}</p>}
      </details>
      <details className="design-picker__section" open>
        <summary className="design-picker__summary">
          <span>
            {t('chooseLayout')}
            <small>
              {t('photosCount', { count: value.layout.slots.length })} · {value.layout.name[locale]}
            </small>
          </span>
          <ChevronDown size={16} />
        </summary>
        <PickerTools
          controls={[
            {
              label: 'photoCount',
              value: count,
              onChange: setCount,
              options: [
                { value: 'all', label: t('anyPhotoCount') },
                ...Array.from({ length: 20 }, (_, index) => ({
                  value: String(index + 1),
                  label: t('photosCount', { count: index + 1 }),
                })),
              ],
            },
            {
              label: 'layoutStyle',
              value: style,
              onChange: setStyle,
              options: [
                { value: 'all', label: t('allLayoutStyles') },
                ...layoutStyles.map((value) => ({ value, label: t('layoutStyle.' + value) })),
              ],
            },
          ]}
        />
        <div
          className="design-picker__rail design-picker__rail--layouts"
          role="group"
          aria-label={t('chooseLayout')}
        >
          {layoutResults.map((layout) => (
            <button
              key={layout.id}
              className={
                'design-card design-card--layout' +
                (value.layout.id === layout.id ? ' design-card--selected' : '')
              }
              aria-label={
                t('chooseLayout') +
                ': ' +
                layout.name[locale] +
                ' · ' +
                t('photosCount', { count: layout.slots.length })
              }
              aria-pressed={value.layout.id === layout.id}
              disabled={disabled}
              onClick={() => onChange(composeDesign(value, layout))}
            >
              <span className="design-card__geometry">
                <FrameCanvas frame={composeDesign(frames[0], layout)} layoutOnly width={150} />
              </span>
              <span className="design-card__name">
                {t('photosCount', { count: layout.slots.length })}
              </span>
            </button>
          ))}
        </div>
        {layoutResults.length === 0 && <p className="design-picker__empty">{t('noMatches')}</p>}
      </details>
    </div>
  );
}
