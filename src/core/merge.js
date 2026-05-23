/**
 * 合成规则模块
 */

import { gameConfig } from '../config/gameConfig.js';

const MAX_LEVEL = gameConfig.dino.maxLevel;

/**
 * 判断两只恐龙是否可以合成
 */
export function canMerge(item1, item2) {
  if (!item1 || !item2) return false;
  return item1.level === item2.level;
}

/**
 * 合成两只恐龙，返回新的恐龙等级
 * 超过最高等级时保持最高等级
 */
export function doMerge(item1, item2) {
  if (!canMerge(item1, item2)) return null;
  const newLevel = Math.min(item1.level + 1, MAX_LEVEL);
  return newLevel;
}

/**
 * 创建一只新恐龙对象
 */
export function createDino(level, color) {
  return {
    level,
    color: color || 'green',
    id: Date.now() + Math.random(),
  };
}

/**
 * 随机获取恐龙颜色
 */
export function randomColor() {
  const colors = gameConfig.dino.colors;
  return colors[Math.floor(Math.random() * colors.length)];
}
