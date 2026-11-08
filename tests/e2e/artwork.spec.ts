import { openSlotTools, closeSlotTools } from './helpers/slot-tools';
import { test, expect } from '@playwright/test';
import { chooseFilter } from './helpers/filter-dropdown';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

test('circular layouts stay round in thumbnails previews and encoded PNG', async ({ page }, info) => {
  await page.goto('/setup');
  const checks = await page.evaluate(async () => {
    const { layouts, frames, composeDesign } = await import('/src/features/frame-catalog/catalog.ts');
    const { renderComposition, canvasBlob } = await import('/src/engine/renderer.ts');
    const circular = layouts.filter((layout) => layout.id.startsWith('ellipse-'));
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;padding:20px;background:#eee';
    document.body.replaceChildren(stage);
    const checks: boolean[] = [];
    for (const layout of circular) {
      const frame = composeDesign(frames.find((item) => item.id === 'simple-paper')!, layout);
      for (const width of [150, 600]) {
        const canvas = document.createElement('canvas');
        renderComposition(canvas, frame, [], {}, { width, layoutOnly: true });
        const bitmap = await createImageBitmap(await canvasBlob(canvas));
        const decoded = document.createElement('canvas');
        decoded.width = bitmap.width; decoded.height = bitmap.height;
        const ctx = decoded.getContext('2d')!; ctx.drawImage(bitmap, 0, 0); bitmap.close();
        const pixels = ctx.getImageData(0, 0, decoded.width, decoded.height).data;
        const isPhoto = (x: number, y: number) => {
          const at = (y * decoded.width + x) * 4;
          return pixels[at] === 197 && pixels[at + 1] === 157 && pixels[at + 2] === 162;
        };
        for (const slot of layout.slots) {
          const cx = Math.floor((slot.x + slot.width / 2) * decoded.width);
          const cy = Math.floor((slot.y + slot.height / 2) * decoded.height);
          let horizontal = 0, vertical = 0;
          for (let x = Math.ceil(slot.x * decoded.width); x < (slot.x + slot.width) * decoded.width; x++) if (isPhoto(x, cy)) horizontal++;
          for (let y = Math.ceil(slot.y * decoded.height); y < (slot.y + slot.height) * decoded.height; y++) if (isPhoto(cx, y)) vertical++;
          checks.push(horizontal > 0 && Math.abs(horizontal - vertical) <= 2);
        }
        if (width === 600) {
          const card = document.createElement('section');
          card.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px';
          canvas.style.cssText = 'width:auto;height:auto;max-width:100%;max-height:350px';
          const label = document.createElement('span'); label.textContent = layout.name.en;
          card.append(canvas, label); stage.append(card);
        }
      }
    }
    return checks;
  });
  expect(checks.length).toBeGreaterThan(0);
  expect(checks.every(Boolean)).toBe(true);
  await page.screenshot({ path: 'test-results/circular-layouts-' + info.project.name + '.png', fullPage: true });
});

test('authored heart star and arch layouts retain natural shapes in previews', async ({ page }, info) => {
  await page.goto('/setup');
  await page.evaluate(async () => {
    const { renderComposition } = await import('/src/engine/renderer.ts');
    const { loadArtwork } = await import('/src/engine/artwork.ts');
    const { artFrames, artLayouts } = await import('/src/features/frame-catalog/art-frames.ts');
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;padding:20px;background:#eee';
    document.body.replaceChildren(stage);
    for (let i = 0; i < 6; i++) {
      const layout = artLayouts[i], frame = artFrames.find((item) => item.artwork?.theme === (i < 2 ? 'coquette' : i < 4 ? 'chrome' : 'cinema'))!;
      const card = document.createElement('section');
      card.style.cssText = 'min-width:0;height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px';
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'max-height:390px;max-width:100%;width:auto;height:auto';
      const artwork = await loadArtwork(frame);
      renderComposition(canvas, { ...frame, layout }, [], {}, { width: 480, artwork, placeholders: true });
      const label = document.createElement('span'); label.textContent = layout.name.en;
      card.append(canvas, label); stage.append(card);
    }
  });
  await page.screenshot({ path: 'test-results/shaped-layouts-' + info.project.name + '.png', fullPage: true });
});

test('shape filters, independent artwork selection and a real PNG download', async ({ page }) => {
  await page.goto('/setup');
  await chooseFilter(page, 'Bộ sưu tập', 'Bộ thiết kế nổi bật');
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).toHaveCount(13);
  await chooseFilter(page, "Số ảnh", "2 ảnh");
  await chooseFilter(page, "Phong cách bố cục", "Hình đặc biệt");
  await page.getByRole('button', { name: 'Chọn bố cục: Hai trái tim · 2 ảnh', exact: true }).click();
  const buffer = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#c08166' } }).png().toBuffer();
  await page.getByLabel('Tải ảnh từ thiết bị', { exact: true }).setInputFiles([
    { name: 'portrait-a.png', mimeType: 'image/png', buffer },
    { name: 'portrait-b.png', mimeType: 'image/png', buffer },
  ]);
  await openSlotTools(page);
  await page.getByRole('slider', { name: 'Thu phóng', exact: true }).fill('1.4');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Chọn mẫu frame: Chrome mộng mơ', exact: true }).click();
  await openSlotTools(page);
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.4');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Xem thành phẩm', exact: true }).click();
  await expect(page.locator('.finish__preview canvas')).toHaveAttribute('data-render-state', 'ready');
  await page.locator('.finish select').first().selectOption('png');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  const download = await downloaded;
  const bytes = await readFile((await download.path())!);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  expect(info.height).toBe(2400);
  const sample = (x: number, y: number) => {
    const at = (Math.floor(info.height * y) * info.width + Math.floor(info.width * x)) * info.channels;
    return [...data.subarray(at, at + 3)];
  };
  // A point inside the heart contains the uploaded photo; its upper corner is clipped away.
  const inside = sample(0.5, 0.3);
  // The photo library normalizes inputs through JPEG; allow its small quantization error.
  inside.forEach((channel, index) => expect(Math.abs(channel - [192, 129, 102][index])).toBeLessThanOrEqual(2));
  expect(sample(0.11, 0.16).some((channel, index) => Math.abs(channel - inside[index]) > 20)).toBe(true);
});

test('featured artwork renders all themes and shaped masks with shared export geometry', async ({page}, info) => {
await page.goto('/setup');
const result = await page.evaluate(async () => {
// Exercise the same renderer and asset loader used by the editor and export.
const {renderComposition,canvasBlob}=await import('/src/engine/renderer.ts');
const {loadArtwork}=await import('/src/engine/artwork.ts');
const {artFrames,artLayouts}=await import('/src/features/frame-catalog/art-frames.ts');
const {slotPath}=await import('/src/engine/slot-path.ts');
await document.fonts.ready;
const stage=document.createElement('div');stage.id='artwork-review';stage.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:24px;background:#eee';
document.body.replaceChildren(stage);
const checks=[];
for(let i=0;i<artFrames.length;i++){
const frame=artFrames[i], layout=artLayouts[[1,3,8,7][i % 4]];
const canvas=document.createElement('canvas');canvas.style.width='100%';stage.append(canvas);
const artwork=await loadArtwork(frame);
renderComposition(canvas,{...frame,layout},[],{},{width:480,artwork,placeholders:true});
const blob=await canvasBlob(canvas);const bitmap=await createImageBitmap(blob);
checks.push(bitmap.width===480 && bitmap.height===canvas.height);bitmap.close();
}
const canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;
const ctx=canvas.getContext('2d')!;ctx.translate(200,200);
for(const mask of ['heart','star','arch','stamp']){
const path=slotPath(mask,300,300);
checks.push(ctx.isPointInPath(path,200,200));
checks.push(!ctx.isPointInPath(path,20,20));
}
return checks;
});
expect(result.every(Boolean)).toBe(true);
await page.screenshot({path:'test-results/artwork-'+info.project.name+'.png',fullPage:true});
});

test('failed artwork is visible and cannot silently produce an incomplete render', async({page})=>{
await page.route('**/artwork/ballet-*.webp',route=>route.abort());
await page.goto('/setup');
await expect(page.locator('.studio__frame canvas')).toHaveAttribute('data-render-state','error');
await expect(page.locator('.studio__frame [role="alert"]')).toBeVisible();
});
