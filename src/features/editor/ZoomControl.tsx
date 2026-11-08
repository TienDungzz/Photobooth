import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';

export function ZoomControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useTranslation();
  const change = (value: number) =>
    onChange(Math.max(1, Math.min(3, Math.round(value * 100) / 100)));
  return (
    <div className="crop-zoom">
      <button
        className="icon-button"
        aria-label={t('zoomOut')}
        disabled={value <= 1}
        onClick={() => change(value - 0.1)}
      >
        <Minus size={19} />
      </button>
      <input
        aria-label={t('zoom')}
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={value}
        style={{ '--zoom-progress': `${((value - 1) / 2) * 100}%` } as CSSProperties}
        onChange={(e) => change(Number(e.target.value))}
      />
      <button
        className="icon-button"
        aria-label={t('zoomIn')}
        disabled={value >= 3}
        onClick={() => change(value + 0.1)}
      >
        <Plus size={19} />
      </button>
      <output className="crop-zoom__value">{Math.round(value * 100)}%</output>
    </div>
  );
}
