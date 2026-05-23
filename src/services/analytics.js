/**
 * 埋点服务 - Mock 版本
 * 开发阶段 console.log 输出，上线前替换为真实微信埋点
 */

export const Analytics = {
  enabled: true,

  init() {
    console.log('[Analytics] initialized (mock mode)');
  },

  /**
   * 发送埋点事件
   * @param {string} eventName
   * @param {Object} params
   */
  track(eventName, params = {}) {
    if (!this.enabled) return;
    console.log(`[Analytics] ${eventName}`, params);
    // TODO: 接入微信数据埋点或其他分析平台
  },

  // ---- 便捷快捷函数 ----

  gameStart(levelId) {
    this.track('game_start', { level_id: levelId });
  },

  gameOver(levelId, isWin, reason) {
    this.track('game_over', { level_id: levelId, is_win: isWin, reason });
  },

  merge(fromLevel, toLevel, position) {
    this.track('merge', { from_level: fromLevel, to_level: toLevel, position });
  },

  itemUse(itemType, isFree, levelId) {
    this.track('item_use', { item_type: itemType, is_free: isFree, level_id: levelId });
  },

  adRequest(adType, position) {
    this.track('ad_request', { ad_type: adType, position });
  },

  adComplete(adType, rewardType) {
    this.track('ad_complete', { ad_type: adType, reward_type: rewardType });
  },

  adSkip(adType, reason) {
    this.track('ad_skip', { ad_type: adType, reason });
  },

  shareClick(shareType) {
    this.track('share_click', { share_type: shareType });
  },

  levelComplete(levelId, attempts) {
    this.track('level_complete', { level_id: levelId, attempts });
  },
};
