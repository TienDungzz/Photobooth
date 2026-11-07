import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root } from '../lib/project.mjs';

async function fixture(run) {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'photobooth-checkers-'));
  try {
    await cp(path.join(root, 'script'), path.join(temporaryRoot, 'script'), { recursive: true });
    const put = async (file, text) => {
      const target = path.join(temporaryRoot, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, text);
    };
    const check = (name, args = []) => {
      const result = spawnSync(process.execPath, [path.join(temporaryRoot, 'script', name), ...args], { encoding: 'utf8' });
      assert.ifError(result.error);
      return { status: result.status, output: result.stdout + result.stderr };
    };
    await run({ put, check });
  } finally {
    // Chỉ xóa thư mục tạm do chính lần kiểm thử này tạo ra.
    const resolved = path.resolve(temporaryRoot);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('photobooth-checkers-'));
    await rm(resolved, { recursive: true, force: true });
  }
}

test('project chưa có source báo SKIP; strict vẫn thành công', async () => {
  await fixture(async ({ check }) => {
    const result = check('check-all.mjs', ['--strict']);
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /SKIP/);
  });
});

test('BEM hợp lệ được chấp nhận và BEM sai bị chặn', async () => {
  await fixture(async ({ put, check }) => {
    await put('src/Panel.css', '.camera-panel__preview--active { width: 100%; }\n');
    assert.equal(check('check-code.mjs').status, 0);
    await put('src/Panel.css', '.cameraPanel { color: red !important; }\n');
    const result = check('check-code.mjs');
    assert.equal(result.status, 1);
    assert.match(result.output, /BEM/);
    assert.match(result.output, /!important/);
  });
});

test('nhận diện đường dẫn, asset dư/trùng và strict exit code', async () => {
  await fixture(async ({ put, check }) => {
    await put('public/used.png', 'used');
    await put('src/assets/local.webp', 'local');
    await put('src/assets/alias.svg', '<svg/>');
    await put('public/orphan.png', 'unused');
    await put('public/copy.png', 'unused');
    await put('src/main.ts', 'import "./assets/local.webp";\nimport "@/assets/alias.svg";\nconst image = "/used.png?v=1";\n');
    const result = check('check-unused-assets.mjs');
    assert.equal(result.status, 0);
    assert.match(result.output, /orphan.png/);
    assert.match(result.output, /trùng byte/);
    assert.doesNotMatch(result.output, /\[warning\] (?:public\/used.png|src\/assets\/(?:local.webp|alias.svg))/);
    assert.equal(check('check-unused-assets.mjs', ['--strict']).status, 1);
  });
});

test('ngoại lệ asset phải có lý do và file thực', async () => {
  await fixture(async ({ put, check }) => {
    await put('script/check.config.mjs', `export default { ignoredDirectories: [], assetRoots: ['public'], assetExtensions: ['.png'], assetExceptions: [{ path: 'public/missing.png', reason: '' }] };\n`);
    assert.equal(check('check-unused-assets.mjs').status, 1);
    await put('public/dynamic.png', 'image');
    await put('script/check.config.mjs', `export default { ignoredDirectories: [], assetRoots: ['public'], assetExtensions: ['.png'], assetExceptions: [{ path: 'public/dynamic.png', reason: 'Dynamic catalog URL' }] };\n`);
    assert.equal(check('check-unused-assets.mjs', ['--strict']).status, 0);
  });
});

test('phát hiện asset quá ngưỡng và rủi ro vòng đời', async () => {
  await fixture(async ({ put, check }) => {
    await put('public/large.png', Buffer.alloc(5 * 1024 * 1024 + 1));
    await put('src/camera.ts', 'setTimeout(capture, 1000);\nURL.createObjectURL(blob);\n');
    const result = check('check-performance.mjs');
    assert.equal(result.status, 1);
    assert.match(result.output, /quá ngưỡng/);
    assert.match(result.output, /timer/);
    assert.match(result.output, /object URL/);
    const all = check('check-all.mjs');
    assert.equal(all.status, 1);
    assert.match(all.output, /Code conventions/);
    assert.match(all.output, /Unused\/duplicate assets/);
    assert.match(all.output, /Performance signals/);
  });
});
