import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';

const directory = path.resolve('test-results/catalog-review', process.argv[2] ?? 'current');
await mkdir(directory, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5198, strictPort: true } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto('http://127.0.0.1:5198');
  const catalog = await page.evaluate(async () => {
    const { frames, layouts } = await import('/src/features/frame-catalog/catalog.ts');
    return { frames, layouts };
  });
  await writeFile(path.join(directory, 'catalog.json'), JSON.stringify(catalog, null, 2));
  for (const kind of ['frames', 'layouts']) {
    const items = catalog[kind];
    for (let offset = 0; offset < items.length; offset += 24) {
      await page.evaluate(
        async ({ kind, offset }) => {
          const { frames, layouts, composeDesign } =
            await import('/src/features/frame-catalog/catalog.ts');
          const { renderComposition } = await import('/src/engine/renderer.ts');
          const { loadArtwork } = await import('/src/engine/artwork.ts');
          const stage = document.createElement('div');
          stage.style.cssText =
            'display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;padding:24px;background:#eee;color:#333';
          document.body.replaceChildren(stage);
          const items = kind === 'frames' ? frames : layouts;
          for (const item of items.slice(offset, offset + 24)) {
            const frame =
              kind === 'frames' ? item : frames.find((frame) => frame.id === 'simple-paper');
            const layout = kind === 'layouts' ? item : layouts[0];
            const card = document.createElement('section');
            card.style.cssText =
              'min-width:0;height:245px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#fff;padding:8px;border-radius:8px';
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'width:auto;height:auto;max-width:100%;max-height:175px';
            const artwork = kind === 'frames' ? await loadArtwork(frame, true) : undefined;
            renderComposition(
              canvas,
              composeDesign(frame, layout),
              [],
              {},
              {
                width: 180,
                artwork,
                decorationsOnly: kind === 'frames',
                layoutOnly: kind === 'layouts',
              },
            );
            const title = document.createElement('div');
            title.textContent = item.id;
            title.style.cssText = 'font:11px sans-serif;text-align:center;overflow-wrap:anywhere';
            const subtitle = document.createElement('div');
            subtitle.textContent =
              kind === 'frames'
                ? item.name.en
                : item.slots.length + ' photos / ' + item.width + '×' + item.height;
            subtitle.style.cssText = 'font:10px sans-serif;text-align:center';
            card.append(canvas, title, subtitle);
            stage.append(card);
          }
        },
        { kind, offset },
      );
      await page.screenshot({
        path: path.join(directory, `${kind}-${offset / 24 + 1}.png`),
        fullPage: true,
      });
    }
  }
  console.log(
    `Reviewed ${catalog.frames.length} frames / ${catalog.layouts.length} layouts: ${directory}`,
  );
} finally {
  await browser?.close();
  await server.close();
}
