import { expect, test } from '@playwright/test';

test('export optimization preserves dimensions, PNG pixels and high JPEG fidelity', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { optimizedExport } = await import('/src/features/export-photo/optimize.ts');
    const { canvasBlob } = await import('/src/engine/renderer.ts');
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 900, 1200);
    gradient.addColorStop(0, '#94b4cc');
    gradient.addColorStop(1, '#f3c7a5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 1200);
    ctx.fillStyle = '#29343d';
    ctx.font = '32px serif';
    ctx.fillText('Memories worth keeping', 80, 130);
    const original = await canvasBlob(canvas);
    const jpeg = await optimizedExport(canvas, 'jpeg');
    const png = await optimizedExport(canvas, 'png');
    const source = ctx.getImageData(0, 0, 900, 1200).data;
    async function difference(blob: Blob) {
      const bitmap = await createImageBitmap(blob);
      const width = bitmap.width, height = bitmap.height;
      ctx.clearRect(0, 0, 900, 1200);
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const decoded = ctx.getImageData(0, 0, 900, 1200).data;
      let squared = 0;
      for (let i = 0; i < source.length; i++) squared += (source[i] - decoded[i]) ** 2;
      return { width, height, mse: squared / source.length };
    }
    const jpegDiff = await difference(jpeg);
    const pngDiff = await difference(png);
    // Also verify translucent pixels, not only opaque PNG output.
    ctx.clearRect(0, 0, 900, 1200);
    ctx.fillStyle = '#cc778880';
    ctx.fillRect(100, 100, 400, 400);
    const alpha = await optimizedExport(canvas, 'png');
    const bitmap = await createImageBitmap(alpha);
    ctx.clearRect(0, 0, 900, 1200);
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return {
      originalBytes: original.size, jpegBytes: jpeg.size, pngBytes: png.size,
      jpegDiff, pngDiff,
      outsideAlpha: ctx.getImageData(0, 0, 1, 1).data[3],
      insideAlpha: ctx.getImageData(200, 200, 1, 1).data[3],
    };
  });
  expect(result.jpegDiff.width).toBe(900);
  expect(result.jpegDiff.height).toBe(1200);
  expect(10 * Math.log10(255 ** 2 / result.jpegDiff.mse)).toBeGreaterThan(35);
  expect(result.jpegBytes).toBeLessThan(result.originalBytes);
  expect(result.pngBytes).toBeLessThanOrEqual(result.originalBytes);
  expect(result.pngDiff).toEqual({ width: 900, height: 1200, mse: 0 });
  expect(result.outsideAlpha).toBe(0);
  expect(result.insideAlpha).toBe(128);
  console.log('Export optimization fixture:', JSON.stringify(result));
});
