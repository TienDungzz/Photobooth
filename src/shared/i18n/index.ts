import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';
import { readPreferences } from '../lib/preferences';

void i18n.use(initReactI18next).init({
  resources: { vi: { translation: vi }, en: { translation: en } },
  lng: readPreferences().locale,
  fallbackLng: 'vi',
  keySeparator: false,
  interpolation: { escapeValue: true },
  returnNull: false,
});
export { i18n };
