import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

async function resultPage(page: Page) {
  await page.goto('/setup');
  const buffer = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#efba93' } }).png().toBuffer();
  await page.locator('input[type=file]').setInputFiles(Array.from({ length: 4 }, (_, i) => ({ name: `photo-${i}.png`, mimeType: 'image/png', buffer })));
  await expect(page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true })).toBeEnabled();
}

test('download saves an editable project for seven days and survives reload', async ({ page }, info) => {
  page.on('dialog', dialog => void dialog.accept());
  await page.addInitScript(() => Object.defineProperty(navigator, 'canShare', { value: () => false }));
  await resultPage(page);
  await expect(page.locator('.header__gallery-count')).toHaveText('0');
  await page.locator('.studio__slot').first().click();
  await page.getByRole('slider', { name: 'Thu phóng', exact: true }).fill('1.4');
  await page.getByRole('button', { name: 'Áp dụng', exact: true }).click();
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  await page.getByRole('combobox', { name: 'Định dạng', exact: true }).selectOption('png');
  await page.getByRole('combobox', { name: 'Kích thước cạnh dài', exact: true }).selectOption('1200');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
  await expect(page.getByText('Đã lưu bản chỉnh sửa vào Kho ảnh trong 7 ngày.', { exact: true })).toBeVisible();
  await expect(page.locator('.header__gallery-count')).toHaveText('1');
  const saved = await page.evaluate(async () => {
    const { listProjects } = await import('/src/features/saved-gallery/storage.ts');
    const [record] = await listProjects();
    return { id: record.id, ttl: record.expiresAt - record.savedAt, photoCount: record.photos.length, zoom: Object.values(record.composition)[0].transform.zoom, format: record.result.type, expiresAt: record.expiresAt };
  });
  expect(saved.ttl).toBe(7 * 24 * 60 * 60 * 1000);
  expect(saved.photoCount).toBe(1);
  expect(saved.zoom).toBe(1.4);
  expect(saved.format).toBe('image/png');
  await page.getByRole('button', { name: 'Kho ảnh', exact: true }).click();
  await expect(page.locator('.saved-gallery__card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await page.reload();
  await expect(page.locator('.saved-gallery__card img')).toBeVisible();
  expect(await page.locator('.saved-gallery__card img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  if (info.project.name === 'mobile') {
    await expect(page.locator('.header__gallery > span')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: `test-results/saved-gallery-${info.project.name}.png` });
  await page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true }).click();
  await expect(page).toHaveURL(/\/setup$/);
  await expect(page.locator('.photo-tray__items img')).toHaveCount(1);
  await page.locator('.studio__slot').first().click();
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.4');
  await page.getByRole('button', { name: 'Áp dụng', exact: true }).click();
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  await expect(page.getByText('Đã lưu bản chỉnh sửa vào Kho ảnh trong 7 ngày.', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => (await (await import('/src/features/saved-gallery/storage.ts')).listProjects()).length)).toBe(2);
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  await expect.poll(() => page.evaluate(async () => (await (await import('/src/features/saved-gallery/storage.ts')).listProjects()).length)).toBe(2);
  await page.getByRole('button', { name: 'Kho ảnh', exact: true }).click();
  await expect(page.locator('.saved-gallery__card')).toHaveCount(2);
  await expect(page.locator('.header__gallery-count')).toHaveText('2');
  const otherTab = await page.context().newPage();
  await otherTab.goto('/gallery');
  await expect(otherTab.locator('.header__gallery-count')).toHaveText('2');
  await page.getByRole('button', { name: 'Xóa bản lưu', exact: true }).first().click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page.locator('.saved-gallery__card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Xóa bản lưu', exact: true }).first().click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Xóa bản lưu', exact: true }).click();
  await expect(page.locator('.saved-gallery__card')).toHaveCount(1);
  await expect(page.locator('.header__gallery-count')).toHaveText('1');
  await expect(otherTab.locator('.header__gallery-count')).toHaveText('1');
  await otherTab.close();
});

test('expired entries are removed and storage failure does not block downloading', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'canShare', { value: () => false }));
  await resultPage(page);
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  await expect(page.getByText('Đã lưu bản chỉnh sửa vào Kho ảnh trong 7 ngày.', { exact: true })).toBeVisible();
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('photobooth-gallery', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('projects', 'readwrite');
        const store = tx.objectStore('projects');
        const entries = store.getAll();
        entries.onsuccess = () => { for (const record of entries.result) store.put({ ...record, expiresAt: Date.now() - 1 }); };
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
    });
  });
  await page.getByRole('button', { name: 'Kho ảnh', exact: true }).click();
  await expect(page.getByText(/Kho ảnh còn trống/)).toBeVisible();
  await expect(page.locator('.header__gallery-count')).toHaveText('0');
  expect(await page.evaluate(async () => (await (await import('/src/features/saved-gallery/storage.ts')).listProjects()).length)).toBe(0);
  await page.goBack();
  await expect(page.getByRole('button', { name: 'Tải ảnh về', exact: true })).toBeEnabled();
  await page.evaluate(() => { IDBFactory.prototype.open = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/\.jpg$/);
  await expect(page.getByText(/Ảnh vẫn có thể tải về, nhưng chưa lưu được/)).toBeVisible();
});
