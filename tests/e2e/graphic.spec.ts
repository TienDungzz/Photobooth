import { expect, test } from '@playwright/test';

test('graphic designs have distinct geometry and render without atlases', async ({ page }, info) => {
  await page.goto('/setup');
  const results = await page.evaluate(async () => {
    const { graphicFrames, graphicLayouts } = await import('/src/features/frame-catalog/graphic-catalog.ts');
    const { renderComposition } = await import('/src/engine/renderer.ts');
    const { optimizedExport } = await import('/src/features/export-photo/optimize.ts');
    const { layouts } = await import('/src/features/frame-catalog/catalog.ts');
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:20px;background:#ddd;color:#222';
    document.body.replaceChildren(stage);
    const results = [];
    for (let i=0;i<graphicLayouts.length;i++) {
      const frame=graphicFrames[i===3?0:i],layout=graphicLayouts[i];
      const canvas=document.createElement('canvas');
      renderComposition(canvas,{...frame,layout},[],{},{width:700,placeholders:true});
      const blob=await optimizedExport(canvas,'png');
      const bitmap=await createImageBitmap(blob);
      results.push({encoded:bitmap.width===700 && bitmap.height===canvas.height, atlas:!!frame.artwork.atlas});
      bitmap.close();
      canvas.style.cssText='width:100%;height:auto';
      const card=document.createElement('section');
      card.append(canvas,document.createTextNode(layout.name.en));stage.append(card);
      for(const slot of layout.slots){
        if(slot.mask==='ellipse' && Math.abs(slot.width*layout.width-slot.height*layout.height)>.001) throw Error('Distorted circle');
        const radians=slot.rotation*Math.PI/180;
        const rx=(Math.abs(slot.width*layout.width*Math.cos(radians))+Math.abs(slot.height*layout.height*Math.sin(radians)))/2;
        const ry=(Math.abs(slot.width*layout.width*Math.sin(radians))+Math.abs(slot.height*layout.height*Math.cos(radians)))/2;
        const cx=(slot.x+slot.width/2)*layout.width,cy=(slot.y+slot.height/2)*layout.height;
        if(cx-rx<0 || cy-ry<0 || cx+rx>layout.width || cy+ry>layout.height) throw Error('Clipped photo');
      }
    }
    // Independence: each new frame can also render a dense, unrelated layout.
    for(const frame of graphicFrames){
      const canvas=document.createElement('canvas');
      renderComposition(canvas,{...frame,layout:layouts.find(l=>l.id==='grid-twenty')!},[],{},{width:400,placeholders:true});
      results.push({encoded:(await optimizedExport(canvas,'jpeg')).type==='image/jpeg',atlas:!!frame.artwork.atlas});
      renderComposition(canvas,{...frame,layout:layouts[0]},[],{},{width:150,decorationsOnly:true});
      results.push({encoded:(await optimizedExport(canvas,'png')).type==='image/png',atlas:!!frame.artwork.atlas});
    }
    return results;
  });
  expect(results).toHaveLength(10);
  expect(results.every(r=>r.encoded && !r.atlas)).toBe(true);
  await page.screenshot({path:`test-results/graphic-${info.project.name}.png`,fullPage:true});
});
