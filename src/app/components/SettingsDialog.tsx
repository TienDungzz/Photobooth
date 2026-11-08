import { Laptop, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Locale, Theme } from '../../domain/types';
import type { Preferences } from '../../shared/lib/preferences';
import { Modal } from './Modal';

export function SettingsDialog({
  preferences,
  onLocale,
  onTheme,
  onClose,
}: {
  preferences: Preferences;
  onLocale: (locale: Locale) => void;
  onTheme: (theme: Theme) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal title={t('settings')} onClose={onClose}>
      <fieldset>
        <legend>{t('language')}</legend>
        <div className="settings__options">
          {(['vi', 'en'] as Locale[]).map((locale) => (
            <button
              className={`button${preferences.locale === locale ? ' button--primary' : ''}`}
              aria-pressed={preferences.locale === locale}
              key={locale}
              onClick={() => onLocale(locale)}
            >
              {locale === 'vi' ? 'Tiếng Việt' : 'English'}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t('theme')}</legend>
        <div className="settings__options settings__options--theme">
          {(
            [
              { value: 'light', Icon: Sun },
              { value: 'dark', Icon: Moon },
              { value: 'system', Icon: Laptop },
            ] as const
          ).map(({ value, Icon }) => (
            <button
              key={value}
              className={`button${preferences.themePreference === value ? ' button--primary' : ''}`}
              aria-pressed={preferences.themePreference === value}
              onClick={() => onTheme(value)}
            >
              <Icon size={17} />
              {t(value)}
            </button>
          ))}
        </div>
      </fieldset>
    </Modal>
  );
}
