import type { Page } from '@playwright/test';

export async function showStudioTool(page: Page, tool: 'frame' | 'layout' | 'photos') {
  const nav = page.locator('.studio__mobile-nav');
  if (await nav.isVisible()) {
    const button = nav.locator('button').nth(['frame', 'layout', 'photos'].indexOf(tool));
    if (await button.getAttribute('aria-pressed') !== 'true') await button.click();
  }
}

export async function chooseDesign(page: Page, name: string) {
  await showStudioTool(page, name.startsWith('Chọn mẫu frame:') ? 'frame' : 'layout');
  await page.getByRole('button', { name, exact: true }).click();
}
