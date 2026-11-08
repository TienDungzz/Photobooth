import { describe, expect, it } from 'vitest';
import { resolveLocale, validatePreferences } from './preferences';
import { identifyImage } from '../../features/photo-library/photos';
import vi from '../i18n/locales/vi.json';
import en from '../i18n/locales/en.json';

describe('preferences and translations', () => {
  it('normalizes locales and falls back per field', () => {
    expect(resolveLocale(['fr-FR', 'en-US'])).toBe('en');
    expect(resolveLocale(['fr'])).toBe('vi');
    expect(
      validatePreferences({ version: 1, locale: 'script', themePreference: 'dark' }, ['en-US']),
    ).toEqual({ version: 1, locale: 'en', themePreference: 'dark' });
    expect(validatePreferences({ version: 999, locale: 'en' }, ['vi-VN']).locale).toBe('vi');
  });
  it('keeps all locale keys and interpolation parameters in sync', () => {
    expect(Object.keys(vi).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(vi) as (keyof typeof vi)[]) {
      expect([...vi[key].matchAll(/\{\{(.*?)\}\}/g)].map((match) => match[1]).sort(), key).toEqual(
        [...en[key].matchAll(/\{\{(.*?)\}\}/g)].map((match) => match[1]).sort(),
      );
    }
  });
});
describe('file signatures', () => {
  it('rejects executable and HTML content regardless of extension', () => {
    expect(identifyImage(new TextEncoder().encode('<script>alert(1)</script>'))).toBeNull();
  });
  it('identifies only supported formats', () => {
    expect(identifyImage(new Uint8Array([255, 216, 255]))).toBe('jpeg');
    expect(identifyImage(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]))).toBe('png');
    expect(identifyImage(new TextEncoder().encode('RIFF0000WEBP'))).toBe('webp');
    expect(identifyImage(new TextEncoder().encode('GIF89a'))).toBeNull();
  });
});
