import { openSlotTools, closeSlotTools } from './helpers/slot-tools';
import { test, expect } from '@playwright/test';
import { chooseFilter } from './helpers/filter-dropdown';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

test('expressive masks and layered layouts render and encode without missing assets', async ({ page }, info) => {
  await page.goto('/setup');
  const checks = await page.evaluate(async () => {
    const { expressiveFrames, expressiveLayouts } = await import('/src/features/frame-catalog/expressive-catalog.ts');
    const { renderComposition, canvasBlob } = await import('/src/engine/renderer.ts');
    const { loadArtwork } = await import('/src/engine/artwork.ts');
    const { slotPath } = await import('/src/engine/slot-path.ts');
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;padding:20px;background:#eee';
    document.body.replaceChildren(stage);
    const checks = [];
    for (let i = 0; i < expressiveLayouts.length; i++) {
      const layout = expressiveLayouts[i], frame = expressiveFrames[i < 3 ? 0 : i === 3 ? 1 : 2];
      const artwork = await loadArtwork(frame);
      checks.push(!!artwork?.naturalWidth);
      const canvas = document.createElement('canvas');
      renderComposition(canvas, { ...frame, layout }, [], {}, { width: 600, artwork, placeholders: true });
      const bitmap = await createImageBitmap(await canvasBlob(canvas));
      checks.push(bitmap.width === 600 && bitmap.height === canvas.height); bitmap.close();
      const card = document.createElement('section');
      card.style.cssText = 'height:470px;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px';
      canvas.style.cssText = 'width:auto;height:auto;max-height:420px;max-width:100%';
      const label = document.createElement('span'); label.textContent = layout.name.en;
      card.append(canvas, label); stage.append(card);
    }
    const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 400;
    const ctx = canvas.getContext('2d')!; ctx.translate(200, 200);
    for (const mask of ['blob','cutout','torn','apple']) {
      const path = slotPath(mask, 320, 240);
      checks.push(ctx.isPointInPath(path, 200, 200));
      checks.push(!ctx.isPointInPath(path, 40, 40));
    }
    return checks;
  });
  expect(checks.every(Boolean)).toBe(true);
  await page.screenshot({ path: `test-results/expressive-${info.project.name}.png`, fullPage: true });
});

test('browser layout retains its structure and crop when switching expressive frames and exporting', async ({ page }) => {
  await page.goto('/setup');
  await chooseFilter(page, 'Bộ sưu tập', 'Bộ thiết kế nổi bật');
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).toHaveCount(13);
  await chooseFilter(page, "Số ảnh", "3 ảnh");
  await chooseFilter(page, "Phong cách bố cục", "Phá cách");
  await page.getByRole('button', { name: 'Chọn bố cục: Ba cửa sổ ký ức · 3 ảnh', exact: true }).click();
  await page.getByRole('button', { name: 'Chọn mẫu frame: Sau giờ lên đèn', exact: true }).click();
  const buffer = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#80a0c0' } }).png().toBuffer();
  await page.getByLabel('Tải ảnh từ thiết bị', { exact: true }).setInputFiles([1,2,3].map((i) => ({ name: `portrait-${i}.png`, mimeType: 'image/png', buffer })));
  await openSlotTools(page);
  await page.getByRole('slider', { name: 'Thu phóng', exact: true }).fill('1.3');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Chọn mẫu frame: Một ngày tinh nghịch', exact: true }).click();
  await openSlotTools(page);
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.3');
  await closeSlotTools(page);
  await expect(page.getByRole('button', { name: 'Chọn bố cục: Ba cửa sổ ký ức · 3 ảnh', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Xem thành phẩm', exact: true }).click();
  await expect(page.locator('.finish__preview canvas')).toHaveAttribute('data-render-state', 'ready');
  await page.locator('.finish select').first().selectOption('png');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  const download = await downloaded;
  const { data, info } = await sharp(await readFile((await download.path())!)).raw().toBuffer({ resolveWithObject: true });
  expect(info.width).toBe(1200); expect(info.height).toBe(2400);
  const sample = (x: number, y: number) => {
    const at = (Math.floor(info.height * y) * info.width + Math.floor(info.width * x)) * info.channels;
    return [...data.subarray(at, at + 3)];
  };
  const photo = sample(.5,.24), titlebar = sample(.5,.135);
  photo.forEach((channel,index) => expect(Math.abs(channel - [128,160,192][index])).toBeLessThanOrEqual(2));
  expect(titlebar.some((channel,index) => Math.abs(channel-photo[index]) > 20)).toBe(true);
});
