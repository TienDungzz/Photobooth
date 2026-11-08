import {expect,type Page} from '@playwright/test';
export async function openSlotTools(page:Page){
 await expect(page.locator('.photo-tray__pick--selected')).toBeVisible();
 await page.locator('.studio__slot[aria-pressed="true"]').click();
}
export async function closeSlotTools(page:Page){
 await page.locator('.crop-dialog .button--primary').click();
}
