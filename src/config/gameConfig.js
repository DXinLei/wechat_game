/**
 * 游戏全局配置
 */

export const gameConfig = {
  // 棋盘配置
  board: {
    rows: 3,
    cols: 3,
    cellSize: 100,
  },

  // 恐龙配置
  dino: {
    maxLevel: 19,
    colors: ['green', 'blue', 'orange', 'pink', 'yellow', 'purple', 'white'],
  },

  // 道具配置
  items: {
    freeUsesPerDay: 1,
    types: ['remove', 'undo', 'shuffle'],
  },

  // 存储 key
  storage: {
    level: 'wg_level',
    coins: 'wg_coins',
    items: 'wg_items',
    todayItems: 'wg_today_items',
    todayDate: 'wg_today_date',
    unlockedDinos: 'wg_unlocked_dinos',
  },

  // 广告 mock 开关
  adMock: true,

  // 版本
  version: '0.1.0',
};
