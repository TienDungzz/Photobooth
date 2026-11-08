import { test, expect } from '@playwright/test';

test('desktop preview uses the available viewport after scrolling past the header', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Desktop viewport sizing');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/setup');
  await page.getByRole('button', { name: 'Chọn bố cục: Classic photostrip · 4 ảnh', exact: true }).click();
  const workspace = page.locator('.studio__workspace');
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.studio__layout')!.getBoundingClientRect().top + window.scrollY));
  await expect.poll(() => workspace.evaluate(e => Math.round(e.getBoundingClientRect().top))).toBe(24);
  const measure = () => page.evaluate(() => {
    const frame = document.querySelector('.studio__frame')!.getBoundingClientRect();
    const canvas = document.querySelector('.studio__frame canvas')!.getBoundingClientRect();
    const bar = document.querySelector('.studio__continue')!.getBoundingClientRect();
    return { width:frame.width,height:frame.height,canvasWidth:canvas.width,canvasHeight:canvas.height,bottom:frame.bottom,barTop:bar.top,overflow:document.documentElement.scrollWidth>innerWidth };
  });
  const strip = await measure();
  expect(strip.height).toBeGreaterThan(800);
  expect(strip.width).toBeGreaterThan(300);
  expect(strip.width / strip.height).toBeCloseTo(900/2400, 2);
  expect(strip.bottom).toBeLessThan(strip.barTop);
  expect(strip.canvasWidth).toBeCloseTo(strip.width, 0);
  expect(strip.canvasHeight).toBeCloseTo(strip.height, 0);
  await page.screenshot({path:'test-results/large-preview-strip.png'});
  await page.getByRole('button', { name: 'Chọn bố cục: Tấm bưu thiếp · 1 ảnh', exact: true }).click();
  const landscape = await measure();
  expect(landscape.width).toBeGreaterThan(700);
  expect(landscape.width/landscape.height).toBeCloseTo(1.5,2);
  expect(landscape.bottom).toBeLessThan(landscape.barTop);
  expect(landscape.overflow).toBe(false);
});

test('editor selector rails stay inside the sidebar without overlapping controls', async ({
  page,
}, testInfo) => {
  await page.goto('/setup');
  if (testInfo.project.name === 'mobile') await page.locator('.studio__mobile-nav button').nth(1).click();
  await page.getByRole('button', { name: 'Chọn bố cục: Chân dung · 1 ảnh', exact: true }).click();

  await page.screenshot({
    path: `test-results/editor-layout-${testInfo.project.name}.png`,
    fullPage: true,
  });
  const geometry = await page.evaluate(() => {
    const workspace = document.querySelector('.studio__workspace')!.getBoundingClientRect();
    const sidebar = document.querySelector('.studio__sidebar')!.getBoundingClientRect();
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      workspaceBottom: workspace.bottom,
      workspaceRight: workspace.right,
      sidebarTop: sidebar.top,
      sidebarLeft: sidebar.left,
    };
  });
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width);
  if (geometry.width <= 650)
    await page.locator('.studio__mobile-nav button').nth(2).click();
  else expect(geometry.sidebarLeft).toBeGreaterThanOrEqual(geometry.workspaceRight);
  if (geometry.width > 1050) {
    const desktop = await page.evaluate(() => {
      const columns = ['.studio__design', '.studio__workspace', '.studio__sidebar'].map((selector) => {
        const element = document.querySelector(selector)!;
        const style = getComputedStyle(element);
        return { position: style.position, top: style.top, maxHeight: style.maxHeight, overflowY: style.overflowY };
      });
      const grids = [...document.querySelectorAll('.design-picker__rail')].map((element) => {
        const style = getComputedStyle(element);
        const cards = [...element.children].map((card) => ({ top: (card as HTMLElement).offsetTop }));
        return {
          display: style.display, overflowY: style.overflowY,
          clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
          columns: cards.filter((card) => Math.abs(card.top - cards[0].top) < 1).length,
          rows: new Set(cards.map((card) => Math.round(card.top))).size,
        };
      });
      return { columns, grids };
    });
    expect(desktop.columns.every((column) => column.position === 'sticky' && column.top === '24px')).toBe(true);
    for (const index of [0, 2]) {
      expect(desktop.columns[index].maxHeight).toBe('none');
      expect(desktop.columns[index].overflowY).toBe('visible');
    }
    for (const grid of desktop.grids) {
      expect(grid.display).toBe('grid');
      expect(grid.overflowY).toBe('auto');
      expect(grid.columns).toBeGreaterThanOrEqual(2);
      expect(grid.rows).toBeGreaterThan(1);
      expect(grid.scrollHeight).toBeGreaterThan(grid.clientHeight);
      expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
    }
    const rail = page.locator('.design-picker__rail').first();
    await rail.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    expect(await rail.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await rail.evaluate((element) => { element.scrollTop = 0; });
    await page.evaluate(() => window.scrollTo(0, 0));
    const initialTop = await page.locator('.studio__workspace').evaluate((element) => element.getBoundingClientRect().top);
    await page.evaluate((top) => window.scrollTo(0, top + 80), initialTop);
    await expect.poll(() => page.locator('.studio__workspace').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(24);
    await expect.poll(() => page.locator('.studio__sidebar').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(24);
  }
  await page.getByRole('button', { name: 'Mở camera', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
