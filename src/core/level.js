/**
 * 关卡状态模块
 */

import { getLevel, TOTAL_LEVELS } from '../config/levels.js';
import { Storage } from '../services/storage.js';

export class Level {
  constructor() {
    this.currentLevelId = 1;
    this.attempts = 0;
  }

  /**
   * 加载指定关卡
   */
  loadLevel(id) {
    if (id < 1) id = 1;
    if (id > TOTAL_LEVELS) id = TOTAL_LEVELS;
    this.currentLevelId = id;
    this.attempts = 0;
  }

  /**
   * 获取当前关卡数据
   */
  getCurrentLevel() {
    return getLevel(this.currentLevelId);
  }

  /**
   * 获取当前关卡 ID
   */
  getCurrentLevelId() {
    return this.currentLevelId;
  }

  /**
   * 增加尝试次数
   */
  addAttempt() {
    this.attempts++;
  }

  /**
   * 判断是否达成通关目标
   * @param {Array} items - 当前棋盘上的恐龙列表
   * @param {Object} target - 目标 { level: X, count: Y }
   */
  checkGoal(items, target) {
    if (!target) return false;
    const count = items.filter(item => item.level >= target.level).length;
    return count >= target.count;
  }

  /**
   * 通关后进入下一关
   */
  nextLevel() {
    if (this.currentLevelId < TOTAL_LEVELS) {
      this.currentLevelId++;
      this.attempts = 0;
      return true;
    }
    return false;
  }

  /**
   * 重开当前关卡
   */
  restart() {
    this.attempts++;
  }

  /**
   * 保存当前关卡进度
   */
  saveProgress() {
    Storage.set('level', this.currentLevelId);
  }

  /**
   * 加载已保存的关卡进度
   */
  loadProgress() {
    const saved = Storage.get('level');
    if (saved) {
      this.currentLevelId = parseInt(saved, 10);
    }
  }
}
