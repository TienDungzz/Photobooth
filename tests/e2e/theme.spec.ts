import { test, expect } from '@playwright/test';

test('neutral dark mode keeps readable controls and preserves frame colors', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('photobooth.preferences.v1', JSON.stringify({ version: 1, locale: 'vi', themePreference: 'dark' })));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: `test-results/dark-home-${info.project.name}.png` });
  await page.goto('/setup');
  const canvas = page.locator('.studio__frame canvas');
  await expect(canvas).toHaveAttribute('data-render-state', 'ready');
  const artworkPixel = await canvas.evaluate((element: HTMLCanvasElement) => [...element.getContext('2d')!.getImageData(0, 0, 1, 1).data]);
  const colors = await page.evaluate(() => {
    const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const style = (selector: string) => getComputedStyle(document.querySelector(selector)!);
    const luminance = (color: number[]) => color.map((channel) => {
      const v = channel / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
    }).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
    const contrast = (a: number[], b: number[]) => {
      const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
    };
    const panel = rgb(style('.panel').backgroundColor);
    const button = style('.panel .button--primary');
    return {
      background: rgb(style('body').backgroundColor), panel,
      selected: rgb(style('.design-card--selected').borderTopColor),
      textContrast: contrast(rgb(style('.panel').color), panel),
      mutedContrast: contrast(rgb(style('.panel__hint').color), panel),
      buttonContrast: contrast(rgb(button.color), rgb(button.backgroundColor)),
    };
  });
  for (const color of [colors.background, colors.panel]) expect(Math.max(...color) - Math.min(...color)).toBeLessThanOrEqual(5);
  expect(Math.max(...colors.selected) - Math.min(...colors.selected)).toBeLessThanOrEqual(25);
  for (const ratio of [colors.textContrast, colors.mutedContrast, colors.buttonContrast]) expect(ratio).toBeGreaterThanOrEqual(4.5);
  await page.screenshot({ path: `test-results/dark-studio-${info.project.name}.png` });
  await page.getByRole('button', { name: 'Thiết lập', exact: true }).click();
  await page.screenshot({ path: `test-results/dark-settings-${info.project.name}.png` });
  await page.getByRole('button', { name: 'Sáng', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(canvas).toHaveAttribute('data-render-state', 'ready');
  expect(await canvas.evaluate((element: HTMLCanvasElement) => [...element.getContext('2d')!.getImageData(0, 0, 1, 1).data])).toEqual(artworkPixel);
  await page.getByRole('button', { name: 'Tối', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
