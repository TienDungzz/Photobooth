import { expect, test } from '@playwright/test';

test('ornament borders belong to layouts and leave photo centres unchanged',async({page})=>{
  await page.goto('/setup');
  const checks=await page.evaluate(async()=>{
    const {ornamentFrames,ornamentLayouts}=await import('/src/features/frame-catalog/ornament-catalog.ts');
    const {renderComposition}=await import('/src/engine/renderer.ts');
    const {ornamentPadding}=await import('/src/engine/ornament-treatment.ts');
    const checks=[];
    for(const layout of ornamentLayouts){
      const canvas=document.createElement('canvas');
      const draw=(index:number,decorated:boolean)=>{
        renderComposition(canvas,{...ornamentFrames[index],layout:decorated?layout:{...layout,slots:layout.slots.map(s=>({...s,treatment:undefined}))}},[],{},{width:600,layoutOnly:true,transparent:true});
        const ctx=canvas.getContext('2d')!;
        return {pixels:layout.slots.map(s=>[...ctx.getImageData(Math.floor((s.x+s.width/2)*canvas.width),Math.floor((s.y+s.height/2)*canvas.height),1,1).data]),image:canvas.toDataURL()};
      };
      const first=draw(0,true),second=draw(2,true),bare=draw(0,false);
      checks.push(first.image===second.image,first.image!==bare.image,JSON.stringify(first.pixels)===JSON.stringify(bare.pixels));
      for(const s of layout.slots){
        const pad=ornamentPadding(s.width*layout.width,s.height*layout.height)*1.5;
        const halfW=s.width*layout.width/2+pad,halfH=s.height*layout.height/2+pad,angle=s.rotation*Math.PI/180;
        const x=(s.x+s.width/2)*layout.width,y=(s.y+s.height/2)*layout.height;
        const rx=Math.abs(halfW*Math.cos(angle))+Math.abs(halfH*Math.sin(angle)),ry=Math.abs(halfW*Math.sin(angle))+Math.abs(halfH*Math.cos(angle));
        checks.push(x-rx>0,y-ry>0,x+rx<layout.width,y+ry<layout.height);
      }
    }
    return checks;
  });
  expect(checks.flatMap((passed,index)=>passed?[]:[index])).toEqual([]);
});

test('ornament designs have distinct geometry and render without atlases', async ({ page }, info) => {
  await page.goto('/setup');
  const results = await page.evaluate(async () => {
    const { ornamentFrames, ornamentLayouts } = await import('/src/features/frame-catalog/ornament-catalog.ts');
    const { renderComposition } = await import('/src/engine/renderer.ts');
    const { optimizedExport } = await import('/src/features/export-photo/optimize.ts');
    const { layouts } = await import('/src/features/frame-catalog/catalog.ts');
    const stage = document.createElement('div');
    stage.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:20px;background:#ddd;color:#222';
    document.body.replaceChildren(stage);
    const results = [];
    for (let i=0;i<ornamentLayouts.length;i++) {
      const frame=ornamentFrames[[0,0,1,2,3][i]],layout=ornamentLayouts[i];
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
    for(const frame of ornamentFrames){
      const canvas=document.createElement('canvas');
      renderComposition(canvas,{...frame,layout:layouts.find(l=>l.id==='grid-twenty')!},[],{},{width:400,placeholders:true});
      results.push({encoded:(await optimizedExport(canvas,'jpeg')).type==='image/jpeg',atlas:!!frame.artwork.atlas});
      renderComposition(canvas,{...frame,layout:layouts[0]},[],{},{width:150,decorationsOnly:true});
      results.push({encoded:(await optimizedExport(canvas,'png')).type==='image/png',atlas:!!frame.artwork.atlas});
    }
    return results;
  });
  expect(results).toHaveLength(13);
  expect(results.every(r=>r.encoded && !r.atlas)).toBe(true);
  await page.screenshot({path:`test-results/ornament-${info.project.name}.png`,fullPage:true});
});
