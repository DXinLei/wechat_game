/**
 * 道具模块
 * 接口占位，具体逻辑后续完善
 */

import { gameConfig } from '../config/gameConfig.js';
import { Storage } from '../services/storage.js';

const FREE_USES = gameConfig.items.freeUsesPerDay;
const ITEM_TYPES = gameConfig.items.types;

/**
 * 获取今日道具剩余次数
 */
export function getTodayUses() {
  const today = getTodayDate();
  const saved = Storage.get(gameConfig.storage.todayItems);
  const data = saved ? JSON.parse(saved) : {};

  // 如果不是今天，重置
  if (data.date !== today) {
    const reset = {};
    ITEM_TYPES.forEach(t => { reset[t] = FREE_USES; });
    const newData = { date: today, uses: reset };
    Storage.set(gameConfig.storage.todayItems, JSON.stringify(newData));
    return newData.uses;
  }

  return data.uses || {};
}

/**
 * 使用道具
 * @param {string} type - remove | undo | shuffle
 * @returns {boolean} 是否成功
 */
export function useItem(type) {
  if (!ITEM_TYPES.includes(type)) return false;

  const uses = getTodayUses();
  if (uses[type] <= 0) return false;

  uses[type]--;
  const today = getTodayDate();
  Storage.set(gameConfig.storage.todayItems, JSON.stringify({ date: today, uses }));
  return true;
}

/**
 * 检查道具是否可用
 */
export function canUse(type) {
  const uses = getTodayUses();
  return (uses[type] || 0) > 0;
}

/**
 * 移除道具：移走棋盘上指定位置的恐龙
 */
export function remove(board, row, col) {
  if (!canUse('remove')) return false;
  const item = board.getCell(row, col);
  if (!item) return false;
  if (useItem('remove')) {
    board.removeAt(row, col);
    return true;
  }
  return false;
}

/**
 * 撤回道具：回退最近一步操作（占位）
 */
export function undo() {
  // TODO: 实现撤回历史记录栈
  if (!canUse('undo')) return false;
  return useItem('undo');
}

/**
 * 洗牌道具：打乱棋盘所有恐龙位置（占位）
 */
export function shuffle(board) {
  // TODO: 实现洗牌逻辑
  if (!canUse('shuffle')) return false;
  return useItem('shuffle');
}

function getTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export const ITEMS = { remove, undo, shuffle };
