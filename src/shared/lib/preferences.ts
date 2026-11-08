import type { Locale, Theme } from '../../domain/types';
export type Preferences = { version: 1; locale: Locale; themePreference: Theme };
const key = 'photobooth.preferences.v1';

export function resolveLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split('-')[0];
    if (base === 'vi' || base === 'en') return base;
  }
  return 'vi';
}
export function validatePreferences(
  raw: unknown,
  languages: readonly string[] = ['vi'],
): Preferences {
  const fallback: Preferences = {
    version: 1,
    locale: resolveLocale(languages),
    themePreference: 'system',
  };
  if (!raw || typeof raw !== 'object' || !('version' in raw) || raw.version !== 1) return fallback;
  const record = raw as Record<string, unknown>;
  return {
    version: 1,
    locale: record.locale === 'vi' || record.locale === 'en' ? record.locale : fallback.locale,
    themePreference:
      record.themePreference === 'light' || record.themePreference === 'dark'
        ? record.themePreference
        : 'system',
  };
}
export function readPreferences(): Preferences {
  const languages = typeof navigator !== 'undefined' ? navigator.languages : ['vi'];
  try {
    return validatePreferences(JSON.parse(localStorage.getItem(key) || 'null'), languages);
  } catch {
    return validatePreferences(null, languages);
  }
}
export function savePreferences(value: Preferences) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Settings remain usable in this session. */
  }
}
