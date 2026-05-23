/**
 * 30 关基础关卡配置
 * 根据 PRD v2.1 关卡参数表生成
 */

export const levels = [];

// 生成 1~30 关配置
for (let id = 1; id <= 30; id++) {
  let targetLevel, targetCount, initialCount, dropRates, failRateTarget;

  if (id === 1) {
    // 引导关
    targetLevel = 2;
    targetCount = 1;
    initialCount = 3;
    dropRates = { 1: 1 };
    failRateTarget = 0;
  } else if (id >= 2 && id <= 3) {
    targetLevel = 3;
    targetCount = 1;
    initialCount = 4;
    dropRates = { 1: 0.95, 2: 0.05 };
    failRateTarget = 0.05;
  } else if (id >= 4 && id <= 10) {
    targetLevel = 4;
    targetCount = 1;
    initialCount = id < 7 ? 4 : 5;
    dropRates = { 1: 0.80, 2: 0.18, 3: 0.02 };
    failRateTarget = 0.15 + (id - 4) * 0.014;
  } else if (id >= 11 && id <= 30) {
    targetLevel = 5;
    targetCount = id < 20 ? 1 : 2;
    initialCount = Math.min(6, 5 + Math.floor((id - 11) / 5));
    dropRates = generateDynamicDrops(id);
    failRateTarget = Math.min(0.45, 0.30 + (id - 11) * 0.012);
  }

  levels.push({
    id,
    target: { level: targetLevel, count: targetCount },
    initialCount,
    dropRates,
    seed: 10000 + id,
    failRateTarget: Math.round(failRateTarget * 100) / 100,
  });
}

function generateDynamicDrops(levelId) {
  const r1 = Math.max(0.60, 0.80 - (levelId - 11) * 0.01);
  const r2 = Math.min(0.35, 0.15 + (levelId - 11) * 0.015);
  const r3 = Math.round((1 - r1 - r2) * 100) / 100;
  return { 1: r1, 2: r2, 3: r3 };
}

export function getLevel(id) {
  if (id < 1 || id > levels.length) return null;
  return levels[id - 1];
}

export const TOTAL_LEVELS = 30;
