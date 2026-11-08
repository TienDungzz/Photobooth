import { expect, test } from '@playwright/test';

test('signature designs render full-page compositions without sticker atlases', async ({ page }, info) => {
  await page.goto('/setup');
  const results = await page.evaluate(async () => {
    const { signatureFrames, signatureLayouts } = await import('/src/features/frame-catalog/signature-catalog.ts');
    const { renderComposition } = await import('/src/engine/renderer.ts');
    const { optimizedExport } = await import('/src/features/export-photo/optimize.ts');
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;padding:20px;background:#ddd;color:#222';
    document.body.replaceChildren(stage);
    const results = [];
    for (let i = 0; i < signatureFrames.length; i++) {
      const frame = signatureFrames[i], layout = signatureLayouts[i];
      const canvas = document.createElement('canvas');
      renderComposition(canvas, {...frame, layout}, [], {}, {width:600, placeholders:true});
      const bitmap = await createImageBitmap(await optimizedExport(canvas, 'png'));
      results.push({atlas:frame.artwork.atlas ?? null,width:bitmap.width,height:bitmap.height, count:layout.slots.length});
      bitmap.close();
      canvas.style.cssText = 'width:100%;height:auto';
      const card = document.createElement('section');
      card.append(canvas, document.createTextNode(frame.name.en));
      stage.append(card);
    }
    return results;
  });
  expect(results).toEqual([3,3,2].map(count=>({atlas:null,width:600,height:800,count})));
  await page.screenshot({path:`test-results/signature-${info.project.name}.png`,fullPage:true});
});
