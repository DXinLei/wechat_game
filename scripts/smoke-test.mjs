/**
 * Smoke Test - 验证所有核心模块可正常导入 + 轻量逻辑检查
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

// ---- 轻量逻辑检查 ----
console.log('\n--- logic checks ---');

// 1. Board + hasMergeable
try {
  const { Board } = await import('../src/core/board.js');
  const b = new Board();
  b.setCell(0, 0, { id: 'a', level: 1, variant: 'normal' });
  b.setCell(0, 1, { id: 'b', level: 1, variant: 'normal' });
  const mergeable = b.hasMergeable();
  if (mergeable !== true) throw new Error(`hasMergeable should be true, got ${mergeable}`);
  console.log('[logic] ok: Board.hasMergeable() true with two Lv.1 dinos');
  passed++;
} catch (err) {
  console.error(`[logic] FAIL: Board.hasMergeable — ${err.message}`);
  failed++;
}

// 2. isStuck() true when board full with no mergeable pairs
try {
  const { Board } = await import('../src/core/board.js');
  const b = new Board();
  // Fill board with 9 different levels so no two share the same level
  b.setCell(0, 0, { id: 'a', level: 1, variant: 'normal' });
  b.setCell(0, 1, { id: 'b', level: 2, variant: 'normal' });
  b.setCell(0, 2, { id: 'c', level: 3, variant: 'normal' });
  b.setCell(1, 0, { id: 'd', level: 4, variant: 'normal' });
  b.setCell(1, 1, { id: 'e', level: 5, variant: 'normal' });
  b.setCell(1, 2, { id: 'f', level: 6, variant: 'normal' });
  b.setCell(2, 0, { id: 'g', level: 7, variant: 'normal' });
  b.setCell(2, 1, { id: 'h', level: 8, variant: 'normal' });
  b.setCell(2, 2, { id: 'i', level: 9, variant: 'normal' });
  const stuck = b.isStuck();
  if (stuck !== true) throw new Error(`isStuck should be true, got ${stuck}`);
  console.log('[logic] ok: Board.isStuck() true when full and no mergeable pairs');
  passed++;
} catch (err) {
  console.error(`[logic] FAIL: Board.isStuck — ${err.message}`);
  failed++;
}

// 3. levels.length === 30
try {
  const { levels } = await import('../src/config/levels.js');
  if (levels.length !== 30) throw new Error(`levels.length should be 30, got ${levels.length}`);
  console.log('[logic] ok: levels.length === 30');
  passed++;
} catch (err) {
  console.error(`[logic] FAIL: levels.length — ${err.message}`);
  failed++;
}

// 4. Level 1 target is Lv.2 x 1
try {
  const { levels } = await import('../src/config/levels.js');
  const lv1 = levels[0];
  if (lv1.target.level !== 2 || lv1.target.count !== 1) {
    throw new Error(`Level 1 target should be {level:2, count:1}, got ${JSON.stringify(lv1.target)}`);
  }
  if (lv1.initialCount !== 3) {
    throw new Error(`Level 1 initialCount should be 3, got ${lv1.initialCount}`);
  }
  console.log('[logic] ok: Level 1 target = Lv.2 × 1, initialCount = 3');
  passed++;
} catch (err) {
  console.error(`[logic] FAIL: Level 1 config — ${err.message}`);
  failed++;
}

console.log(`\n[smoke] result: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
