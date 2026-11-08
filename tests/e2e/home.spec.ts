import { chooseDesign, showStudioTool } from './helpers/studio-tools';
import { test, expect } from '@playwright/test';

test('home promotes the photobooth and opens a separate setup page', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Một chút bạn. Thật nhiều kỷ niệm.', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/, includeHidden: true })).toHaveCount(0);
  await expect(page.locator('input[type=file]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole('link', { name: 'Bắt đầu tạo ảnh', exact: true }).first().click();
  await expect(page).toHaveURL(/\/setup$/);
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/, includeHidden: true })).toHaveCount(62);
  await chooseDesign(page, 'Chọn mẫu frame: Ruy băng & ren');
  await page.getByRole('button', { name: 'Photobooth', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/setup$/);
  await expect(
    page.getByRole('button', { name: 'Chọn mẫu frame: Ruy băng & ren', exact: true, includeHidden: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({
    path: `test-results/setup-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await showStudioTool(page, 'photos');
  await page.getByRole('button', { name: 'Mở camera', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('video')).toHaveCount(0);
});

test('direct preview without session photos returns to setup', async ({ page }) => {
  await page.goto('/setup/preview');
  await expect(page).toHaveURL(/\/setup$/);
  await expect(page.getByRole('button', { name: 'Hoàn tất ảnh', exact: true })).toBeDisabled();
});
