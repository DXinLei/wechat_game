/**
 * UI 面板模块 - 占位骨架
 */

export const Panels = {
  /**
   * 通关面板（占位）
   */
  showWin(levelId, stars) {
    console.log(`[Panels] Win panel: level=${levelId}, stars=${stars}`);
    // TODO: 实现通关弹窗 UI
  },

  /**
   * 失败面板（占位）
   */
  showFail(levelId) {
    console.log(`[Panels] Fail panel: level=${levelId}`);
    // TODO: 实现失败弹窗 UI，包含看广告复活按钮
  },

  /**
   * 道具面板（占位）
   */
  showItems() {
    console.log('[Panels] Items panel');
    // TODO: 实现道具选择弹窗
  },

  /**
   * 隐藏所有面板
   */
  hideAll() {
    // TODO: 实现
  },
};
