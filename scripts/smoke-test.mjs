/**
 * Smoke Test - 验证所有核心模块可正常导入
 * 不调用 game.start()，避免 Node 环境缺少 wx/document 导致报错
 */

const modules = [
  '../src/main.js',
  '../src/config/levels.js',
  '../src/config/gameConfig.js',
  '../src/core/board.js',
  '../src/core/merge.js',
  '../src/core/level.js',
  '../src/core/items.js',
  '../src/services/storage.js',
  '../src/services/adMock.js',
  '../src/services/analytics.js',
  '../src/ui/renderer.js',
  '../src/ui/panels.js',
  '../src/utils/random.js',
  '../src/utils/time.js',
];

let passed = 0;
let failed = 0;

for (const modulePath of modules) {
  try {
    await import(modulePath);
    console.log(`[smoke] ok: ${modulePath}`);
    passed++;
  } catch (err) {
    console.error(`[smoke] FAIL: ${modulePath} — ${err.message}`);
    failed++;
  }
}

// 验证 main.js 导出 createGame
try {
  const main = await import('../src/main.js');
  if (typeof main.createGame !== 'function') {
    throw new Error('createGame export is missing or not a function');
  }
  console.log('[smoke] ok: createGame is a function');
  passed++;
} catch (err) {
  console.error(`[smoke] FAIL: createGame check — ${err.message}`);
  failed++;
}

console.log(`\n[smoke] result: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
