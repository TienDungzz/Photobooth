import {expect,test} from '@playwright/test';

test('camera defaults to one shot even when the layout has multiple empty slots',async({page})=>{
  await page.goto('/setup');
  await page.getByRole('button',{name:'Chọn bố cục: Chuyện của đôi mình · 2 ảnh',exact:true}).click();
  const takeOne=async()=>{
    await page.getByRole('button',{name:'Mở camera',exact:true}).click();
    await expect(page.getByRole('button',{name:'Bắt đầu chụp',exact:true})).toBeEnabled({timeout:15000});
    await expect(page.getByRole('combobox',{name:'Số tấm',exact:true})).toHaveValue('1');
    await page.getByRole('combobox',{name:'Hẹn giờ trước ảnh đầu',exact:true}).selectOption('0');
    await page.getByRole('combobox',{name:'Khoảng nghỉ giữa các ảnh',exact:true}).selectOption('1');
    await page.getByRole('button',{name:'Bắt đầu chụp',exact:true}).click();
    await expect(page.getByRole('button',{name:'Chụp thêm',exact:true})).toBeEnabled();
    await expect(page.locator('.camera-dialog__shot')).toHaveCount(1);
    await page.getByRole('button',{name:'Dùng 1 ảnh',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  };
  await takeOne();
  await expect(page.locator('.photo-tray__items img')).toHaveCount(1);
  await expect(page.getByRole('button',{name:'Hoàn tất ảnh',exact:true})).toBeDisabled();
  await takeOne();
  await expect(page.locator('.photo-tray__items img')).toHaveCount(2);
  await expect(page.getByRole('button',{name:'Hoàn tất ảnh',exact:true})).toBeEnabled();
});
