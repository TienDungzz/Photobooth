import { test, expect } from '@playwright/test';
import sharp from 'sharp';

test('mobile tools are discoverable and navigate to each editor section', async ({ page }, info) => {
  await page.goto('/setup');
  const nav = page.locator('.studio__mobile-nav');
  if (info.project.name !== 'mobile') {
    await expect(nav).toBeHidden();
    return;
  }
  await expect(nav).toBeInViewport();
  expect(await nav.evaluate(element => getComputedStyle(element).position)).toBe('static');
  await expect(page.locator('.studio__sidebar')).toBeVisible();
  const actions = page.locator('.studio__sidebar > .panel .button');
  const uploadBox = await actions.first().boundingBox();
  const cameraBox = await actions.last().boundingBox();
  expect(cameraBox!.y).toBeGreaterThan(uploadBox!.y + uploadBox!.height);
  expect(cameraBox!.x).toBe(uploadBox!.x);
  await expect(nav.getByRole('button')).toHaveCount(3);
  await expect(nav.getByRole('button', { name: 'Xem trước', exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'test-results/mobile-tools-initial.png' });
  const sections = page.locator('.design-picker__section');
  for (const [index, name] of ['Frame', 'Bố cục'].entries()) {
    await sections.nth(index).evaluate((element: HTMLDetailsElement) => { element.open = false; });
    await nav.getByRole('button', { name, exact: true }).click();
    await expect(sections.nth(index)).toHaveAttribute('open', '');
    await expect(sections.nth(index)).toBeVisible();
    await expect(sections.nth(1 - index)).toBeHidden();
    expect(await page.locator('.studio__design').evaluate(element => getComputedStyle(element).position)).toBe('fixed');
    expect(await sections.nth(index).locator('.design-picker__rail').evaluate(element => getComputedStyle(element).display)).toBe('flex');
    await sections.nth(index).locator('.design-picker__rail button').first().click();
  }
  await page.locator('.studio__slot').first().click();
  await expect(page.locator('.studio__sidebar')).toBeVisible();
  expect(await page.locator('.studio__sidebar').evaluate(element => getComputedStyle(element).position)).toBe('fixed');
  const buffer = await sharp({ create: { width: 600, height: 800, channels: 3, background: '#aabbcc' } }).png().toBuffer();
  await page.getByLabel('Tải ảnh từ thiết bị', { exact: true }).setInputFiles({ name: 'mobile.png', mimeType: 'image/png', buffer });
  await expect(page.locator('.photo-tray__items img')).toHaveCount(1);
  const trayTop = await page.locator('.photo-tray__pick').evaluate(element => element.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 80));
  expect(await page.locator('.photo-tray__pick').evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(trayTop, 0);
  await page.screenshot({ path: 'test-results/mobile-photo-dock.png' });
  await nav.getByRole('button', { name: /Ảnh/ }).click();
  await page.locator('.studio__slot').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
