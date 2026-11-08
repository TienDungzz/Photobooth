import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

async function finish(page: Page) {
  await page.goto('/setup');
  const buffer = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#91aabb' } }).png().toBuffer();
  await page.locator('input[type=file]').setInputFiles(Array.from({ length: 4 }, (_, i) => ({ name: `photo-${i}.png`, mimeType: 'image/png', buffer })));
  await expect(page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true })).toBeEnabled();
}

test('export timeout unlocks controls and ignores a late encoder callback', async ({ page }) => {
  await finish(page);
  await page.clock.install();
  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    Object.assign(window, { releaseEncoder: () => {}, blockEncoder: true });
    HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
      if (!(window as any).blockEncoder) return original.call(this, callback, ...args);
      original.call(this, blob => { (window as any).releaseEncoder = () => callback(blob); }, ...args);
    };
  });
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  await expect(page.getByRole('button', { name: /Đang tạo và tối ưu/ })).toBeDisabled();
  await page.clock.fastForward(15_100);
  await expect(page.getByRole('status')).toContainText('15 giây');
  await expect(page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true })).toBeEnabled();
  await page.evaluate(() => { (window as any).releaseEncoder(); (window as any).blockEncoder = false; });
  await expect(page.getByRole('status')).toContainText('15 giây');
  await expect(page.getByRole('link', { name: 'Mở ảnh đã tạo' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Thử tạo ảnh lại', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tải ảnh về', exact: true })).toBeEnabled();
});

test('iPhone shares a prepared image without keeping processing state or opening Preview', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { get: () => 'iPhone' });
    Object.defineProperty(navigator, 'canShare', { value: ({ files }: ShareData) => files?.[0]?.type === 'image/jpeg' });
    Object.defineProperty(navigator, 'share', { value: ({ files }: ShareData) => {
      Object.assign(window, { sharedName: files?.[0]?.name, sharedType: files?.[0]?.type, activeAtShare: navigator.userActivation.isActive });
      return new Promise<void>((resolve, reject) => Object.assign(window, { resolveShare: resolve, cancelShare: () => reject(new DOMException('Cancelled', 'AbortError')) }));
    } });
  });
  await finish(page);
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  const download = page.getByRole('button', { name: 'Tải ảnh về', exact: true });
  await expect(download).toBeEnabled();
  await download.click();
  expect(await page.evaluate(() => (window as any).sharedType)).toBe('image/jpeg');
  expect(await page.evaluate(() => (window as any).activeAtShare)).toBe(true);
  await expect(page.getByRole('button', { name: /Đang tạo và tối ưu/ })).toHaveCount(0);
  await expect(page.locator('.notice--error')).toHaveCount(0);
  await page.evaluate(() => (window as any).cancelShare());
  await expect(page.locator('.notice--error')).toHaveCount(0);
  await download.click();
  await page.evaluate(() => (window as any).resolveShare());
  await expect(download).toBeEnabled();
  await expect(page).toHaveURL(/setup\/preview$/);
});

test('download fallback starts a file download and clears its notice', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'canShare', { value: () => false }));
  await finish(page);
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  const button = page.getByRole('button', { name: 'Tải ảnh về', exact: true });
  await expect(button).toBeEnabled();
  const event = page.waitForEvent('download');
  await button.click();
  expect((await event).suggestedFilename()).toMatch(/\.jpg$/);
  await expect(page.getByText('Đã tạo ảnh và bắt đầu tải xuống.', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 6000 });
  await expect(button).toBeEnabled();
});
