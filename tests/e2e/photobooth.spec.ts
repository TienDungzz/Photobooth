import { openSlotTools, closeSlotTools } from './helpers/slot-tools';
import { test, expect } from '@playwright/test';
import { chooseFilter } from './helpers/filter-dropdown';
import { deflateSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

function crc32(bytes: Buffer) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const check = Buffer.alloc(4);
  check.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, check]);
}
function fixture() {
  const width = 800,
    height = 1000;
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const pixels = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = y * (width * 3 + 1) + 1 + x * 3;
      pixels[at] = x < width / 2 ? 180 : 85;
      pixels[at + 1] = y < height / 2 ? 155 : 205;
      pixels[at + 2] = 120;
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
const file = { name: 'synthetic-photo.png', mimeType: 'image/png', buffer: fixture() };

test('gallery filters, locale/theme and responsive layout', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/setup');
  await expect(
    page.getByRole('heading', { name: 'Những khoảnh khắc mình giữ lại.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).toHaveCount(62);
  await expect(page.getByRole('button', { name: /^Chọn bố cục:/ })).toHaveCount(93);
  await chooseFilter(page, 'Số ảnh', '20 ảnh');
  await page
    .getByRole('button', { name: 'Chọn bố cục: Hai mươi ảnh · 20 ảnh', exact: true })
    .click();
  await page.getByRole('button', { name: 'Chọn mẫu frame: Ruy băng & ren', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Chọn bố cục: Hai mươi ảnh · 20 ảnh', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: 'test-results/design-picker-' + testInfo.project.name + '.png' });
  await page.getByRole('button', { name: 'Thiết lập', exact: true }).click();
  await page.getByRole('button', { name: 'Tối', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('upload, crop and export PNG/JPEG without network photo uploads', async ({
  page,
}, testInfo) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (['POST', 'PUT'].includes(request.method())) requests.push(request.url());
  });
  await page.goto('/setup');
  await page.getByRole('button', { name: 'Chọn bố cục: Chân dung · 1 ảnh', exact: true }).click();

  await page.getByLabel('Tải ảnh từ thiết bị', { exact: true }).setInputFiles(file);
  await expect(page.getByRole('button', { name: 'Xem thành phẩm', exact: true })).toBeEnabled();
  await openSlotTools(page);
  await page.getByRole('slider', { name: 'Thu phóng', exact: true }).fill('1.5');
  await closeSlotTools(page);
  await page.getByRole('button', { name: 'Chọn mẫu frame: Ruy băng & ren', exact: true }).click();
  await openSlotTools(page);
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.5');
  await closeSlotTools(page);
  await expect(
    page.getByRole('button', { name: 'Chọn bố cục: Chân dung · 1 ảnh', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await openSlotTools(page);
  await page.getByRole('button', { name: 'Xoay 90°', exact: true }).click();
  await closeSlotTools(page);
  await page.screenshot({ path: `test-results/editor-${testInfo.project.name}.png` });
  await page.getByRole('button', { name: 'Xem thành phẩm', exact: true }).click();
  await expect(page.locator('.finish__preview canvas')).toHaveAttribute('data-render-state', 'ready');
  await page.screenshot({ path: `test-results/finish-${testInfo.project.name}.png` });
  await page.locator('.finish select').first().selectOption('png');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  const download = await downloadPromise;
  const buffer = await readFile((await download.path())!);
  expect(buffer.readUInt32BE(16)).toBe(1800);
  expect(buffer.readUInt32BE(20)).toBe(2400);
  await page.getByRole('combobox', { name: 'Định dạng', exact: true }).selectOption('jpeg');
  const jpegPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải ảnh về', exact: true }).click();
  const jpeg = await readFile((await (await jpegPromise).path())!);
  expect(jpeg[0]).toBe(255);
  expect(jpeg[1]).toBe(216);
  await page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true }).click();
  await openSlotTools(page);
  await expect(page.getByRole('slider', { name: 'Thu phóng', exact: true })).toHaveValue('1.5');
  await closeSlotTools(page);
  expect(requests).toEqual([]);
});

test('rejects unsupported content without losing a valid photo', async ({ page }) => {
  await page.goto('/setup');
  await page.getByRole('button', { name: 'Chọn bố cục: Chân dung · 1 ảnh', exact: true }).click();

  await page
    .getByLabel('Tải ảnh từ thiết bị', { exact: true })
    .setInputFiles([
      file,
      { name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('<script>alert(1)</script>') },
    ]);
  await expect(
    page.getByText('Chỉ hỗ trợ ảnh JPEG, PNG, WebP tĩnh. Hãy chuyển HEIC sang JPEG trước.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Xem thành phẩm', exact: true })).toBeEnabled();
});

test('changing layout preserves decoration and photo tray', async ({ page }) => {
  await page.goto('/setup');
  await page.getByRole('button', { name: 'Chọn bố cục: Chân dung · 1 ảnh', exact: true }).click();
  await page.getByRole('button', { name: 'Chọn mẫu frame: Ruy băng & ren', exact: true }).click();

  await page.getByLabel('Tải ảnh từ thiết bị', { exact: true }).setInputFiles(file);
  await expect(page.getByRole('button', { name: 'Xem thành phẩm', exact: true })).toBeEnabled();
  await page
    .getByRole('button', { name: 'Chọn bố cục: Ba nhịp yêu thương · 3 ảnh', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Chọn mẫu frame: Ruy băng & ren', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Xem thành phẩm', exact: true })).toBeDisabled();
  await expect(page.locator('.photo-tray__item')).toHaveCount(1);
  await expect(page.getByText('Còn thiếu 2 ảnh', { exact: true })).toBeVisible();
});

test('camera burst captures, keeps completed photos, then releases camera', async ({ page }) => {
  await page.goto('/setup');
  await page
    .getByRole('button', { name: 'Chọn bố cục: Classic photostrip · 4 ảnh', exact: true })
    .click();

  await page.getByRole('button', { name: 'Mở camera', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Bắt đầu chụp', exact: true })).toBeEnabled({
    timeout: 15000,
  });
  await page
    .getByRole('combobox', { name: 'Hẹn giờ trước ảnh đầu', exact: true })
    .selectOption('0');
  await page
    .getByRole('combobox', { name: 'Khoảng nghỉ giữa các ảnh', exact: true })
    .selectOption('1');
  await page.getByRole('combobox', { name: 'Số tấm', exact: true }).selectOption('4');
  await page.getByRole('button', { name: 'Bắt đầu chụp', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Thiết lập', exact: true }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Settings', exact: true })
    .getByRole('button', { name: 'Close', exact: true })
    .click();
  await expect(page.getByRole('button', { name: 'Use 4 photos', exact: true })).toBeEnabled({
    timeout: 15000,
  });
  await page.getByRole('button', { name: 'Use 4 photos', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Preview keepsake', exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.querySelectorAll('video').length)).toBe(0);
});
