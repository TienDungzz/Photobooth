import { test, expect } from '@playwright/test';
import { chooseFilter } from './helpers/filter-dropdown';

test('shared wide page bounds and independent combined catalog filters', async ({
  page,
}, testInfo) => {
  await page.goto('/setup');
  if (testInfo.project.name === 'desktop')
    await page.setViewportSize({ width: 1920, height: 1080 });
  const bounds = await page.evaluate(() => {
    const header = document.querySelector('.header')!.getBoundingClientRect(),
      main = document.querySelector('.main')!.getBoundingClientRect();
    return {
      header: header.width,
      main: main.width,
      left: header.left - main.left,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(bounds.header).toBe(bounds.main);
  expect(bounds.left).toBe(0);
  expect(bounds.overflow).toBe(false);
  if (testInfo.project.name === 'desktop') expect(bounds.header).toBe(1760);
  await chooseFilter(page, 'Bộ sưu tập', 'Hoa & lá');
  await expect(page.locator('.design-picker input')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).not.toHaveCount(0);
  await page
    .getByRole('button', { name: 'Chọn mẫu frame: Lá non · Góc xinh', exact: true })
    .click();
  await chooseFilter(page, 'Số ảnh', '12 ảnh');
  await chooseFilter(page, 'Phong cách bố cục', 'Cơ bản');
  const selected = page.getByRole('button', {
    name: 'Chọn mẫu frame: Lá non · Góc xinh',
    exact: true,
  });
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  const layouts = page.getByRole('button', { name: /^Chọn bố cục:/ });
  expect(await layouts.count()).toBeGreaterThan(0);
  const names = await layouts.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('aria-label')),
  );
  expect(names.every((name) => name?.includes('12 ảnh'))).toBe(true);
  await chooseFilter(page, "Số ảnh", "20 ảnh");
  await chooseFilter(page, "Phong cách bố cục", "Hình đặc biệt");
  await expect(layouts).toHaveCount(0);
  await expect(
    page.getByText('Không có kết quả phù hợp. Hãy đổi hoặc xóa bộ lọc.', { exact: true }),
  ).toBeVisible();
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await chooseFilter(page, "Số ảnh", "12 ảnh");
  await chooseFilter(page, "Phong cách bố cục", "Cơ bản");
  await page.screenshot({
    path: `test-results/catalog-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test('all frames and layouts appear together without counts or pagination', async ({ page }) => {
  await page.goto('/setup');
  await expect(page.getByRole('button', { name: /^Chọn mẫu frame:/ })).toHaveCount(62);
  await expect(page.getByRole('button', { name: /^Chọn bố cục:/ })).toHaveCount(93);
  await expect(page.getByRole('button', { name: /Xem thêm|Show.*more/ })).toHaveCount(0);
  await expect(page.locator('.design-picker__results')).toHaveCount(0);
  for (const rail of await page.locator('.design-picker__rail').all()) {
    const last = rail.locator('.design-card').last();
    await last.click();
    await expect(last).toHaveAttribute('aria-pressed', 'true');
  }
});
