import type { Page } from '@playwright/test';
import { showStudioTool } from './studio-tools';

export async function chooseFilter(page: Page, label: string, option: string) {
  await showStudioTool(page, label === 'Bộ sưu tập' ? 'frame' : 'layout');
  await page.getByRole('combobox', { name: label, exact: true }).click();
  await page.getByRole('listbox', { name: label, exact: true }).getByRole('option', { name: option, exact: true }).click();
}
