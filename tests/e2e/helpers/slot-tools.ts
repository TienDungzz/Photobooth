import {expect,type Page} from '@playwright/test';
import { showStudioTool } from './studio-tools';
export async function openSlotTools(page:Page){
 await showStudioTool(page, 'photos');
 await expect(page.locator('.photo-tray__pick--selected')).toBeVisible();
 await page.locator('.studio__slot[aria-pressed="true"]').click();
}
export async function closeSlotTools(page:Page){
 await page.locator('.crop-dialog .button--primary').click();
}
