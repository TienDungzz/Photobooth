import { openSlotTools, closeSlotTools } from './helpers/slot-tools';
import { test, expect } from '@playwright/test';
import { chooseFilter } from './helpers/filter-dropdown';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

test('occasion artwork and scalloped layouts render and encode', async ({ page }, info) => {
  await page.goto('/setup');
  const checks = await page.evaluate(async () => {
    const { occasionFrames, occasionLayouts } =
      await import('/src/features/frame-catalog/occasion-catalog.ts');
    const { renderComposition, canvasBlob } = await import('/src/engine/renderer.ts');
    const { loadArtwork } = await import('/src/engine/artwork.ts');
    const { slotPath } = await import('/src/engine/slot-path.ts');
    const stage = document.createElement('div');
    stage.style.cssText =
      'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:20px;background:#eee';
    document.body.replaceChildren(stage);
    const checks = [];
    for (let i = 0; i < occasionLayouts.length; i++) {
      const layout = occasionLayouts[i],
        frame = occasionFrames[[0, 1, 1, 2][i]],
        artwork = await loadArtwork(frame);
      checks.push(!!artwork?.naturalWidth);
      const canvas = document.createElement('canvas');
      renderComposition(
        canvas,
        { ...frame, layout },
        [],
        {},
        { width: 650, artwork, placeholders: true },
      );
      const bitmap = await createImageBitmap(await canvasBlob(canvas));
      checks.push(bitmap.width === 650 && bitmap.height === canvas.height);
      bitmap.close();
      const card = document.createElement('section');
      card.style.cssText =
        'min-width:0;height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px';
      canvas.style.cssText = 'width:auto;height:auto;max-width:100%;max-height:390px';
      const label = document.createElement('span');
      label.textContent = layout.name.en;
      card.append(canvas, label);
      stage.append(card);
    }
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 400;
    const ctx = c.getContext('2d')!;
    ctx.translate(200, 200);
    const path = slotPath('scallop', 300, 300);
    checks.push(ctx.isPointInPath(path, 200, 200));
    checks.push(!ctx.isPointInPath(path, 60, 60));
    return checks;
  });
  expect(checks.every(Boolean)).toBe(true);
  await page.screenshot({
    path: `test-results/occasions-${info.project.name}.png`,
    fullPage: true,
  });
});

test('ticket layout exports a visible stub and keeps crops when changing occasion frames', async ({
  page,
}) => {
  await page.goto('/setup');
  await chooseFilter(page, 'Bộ sưu tập', 'Bộ thiết kế nổi bật');
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).toHaveCount(13);
  await chooseFilter(page, "Số ảnh", "2 ảnh");
  await chooseFilter(page, "Phong cách bố cục", "Phá cách");
  await page
    .getByRole('button', { name: 'Chọn bố cục: Hai vé kỷ niệm · 2 ảnh', exact: true })
    .click();
  await page.getByRole('button', { name: 'Chọn mẫu frame: Đêm hội bí ngô', exact: true }).click();
  const buffer = await sharp({
    create: { width: 800, height: 1000, channels: 3, background: '#80a0c0' },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel('Tải ảnh từ thiết bị', { exact: true })
    .setInputFiles(
      [1, 2].map((i) => ({ name: `portrait-${i}.png`, mimeType: 'image/png', buffer })),
    );
  await openSlotTools(page);
  await page.getByRole('slider', { name: 'Thu phóng', exact: true }).fill('1.25');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Chọn mẫu frame: Lời hẹn sắc ngà', exact: true }).click();
  await openSlotTools(page);
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.25');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true }).click();
  await expect(page.locator('.finish__preview canvas')).toHaveAttribute(
    'data-render-state',
    'ready',
  );
  await page.locator('.finish select').first().selectOption('png');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  const download = await pending;
  const { data, info } = await sharp(await readFile((await download.path())!))
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect(info.height).toBe(2400);
  const pixel = (x: number, y: number) => {
    const at =
      (Math.floor(info.height * y) * info.width + Math.floor(info.width * x)) * info.channels;
    return [...data.subarray(at, at + 3)];
  };
  pixel(0.43, 0.33).forEach((v, i) =>
    expect(Math.abs(v - [128, 160, 192][i])).toBeLessThanOrEqual(2),
  );
  expect(pixel(0.875, 0.31).every((v) => v > 220)).toBe(true);
});
