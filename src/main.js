/**
 * 萌萌合成小恐龙 - 游戏主入口
 */

import { Renderer } from './ui/renderer.js';
import { Storage } from './services/storage.js';
import { Analytics } from './services/analytics.js';
import { Board } from './core/board.js';
import { Level } from './core/level.js';
import { ITEMS } from './core/items.js';
import { gameConfig } from './config/gameConfig.js';

export function createGame() {
  let renderer = null;
  let board = null;
  let level = null;

  function init() {
    // 初始化 Canvas 渲染器
    renderer = new Renderer();
    renderer.init();

    // 初始化存储
    Storage.init();

    // 初始化埋点
    Analytics.init();

    // 初始化棋盘
    board = new Board();

    // 初始化关卡
    level = new Level();
  }

  function start() {
    init();

    // 加载第 1 关
    level.loadLevel(1);

    // 绘制启动占位画面
    renderer.drawPlaceholder(level.getCurrentLevel());

    console.log('[Game] 萌萌合成小恐龙 started!');
    console.log('[Game] Current level:', level.getCurrentLevel());
  }

  return {
    start,
  };
}
