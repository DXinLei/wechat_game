/**
 * 萌萌合成小恐龙 - 游戏主入口
 * P0 v0.1 可玩原型
 */

import { Renderer } from './ui/renderer.js';
import { Storage } from './services/storage.js';
import { Analytics } from './services/analytics.js';
import { Board } from './core/board.js';
import { Level } from './core/level.js';
import { getLevel } from './config/levels.js';
import { randomDinoLevel } from './utils/random.js';
import { gameConfig } from './config/gameConfig.js';

let _dinoIdCounter = 0;
function nextDinoId() {
  return `dino_${++_dinoIdCounter}`;
}

/**
 * 判断按钮是否可用（纯函数，可独立测试）
 * @param {Object} state - { isGameOver, isWin }
 * @param {string} button - 'restart' | 'next'
 */
export function canUseButton(state, button) {
  if (button === 'restart') return true;
  if (button === 'next') return Boolean(state.isGameOver && state.isWin);
  return false;
}

/**
 * 创建游戏实例
 */
export function createGame() {
  // ---- 内部状态 ----
  let renderer = null;
  let board = null;
  let levelModule = null;
  let seed = 0; // per-level seed counter

  const state = {
    currentLevelId: 1,
    board: null,          // Board instance
    selectedCell: null,   // { row, col } | null
    isGameOver: false,
    isWin: false,
    coins: 0,
    attempts: 0,
    // renderer draws from this; replace board object ref for reactivity
    _boardRef: null,
  };

  // ---- 初始化 ----
  function init() {
    renderer = new Renderer();
    renderer.init();
    Storage.init();
    Analytics.init();

    // 绑定 Canvas 点击事件（微信环境 + 浏览器 fallback）
    bindCanvasEvents();

    console.log('[Game] initialized');
  }

  // ---- 加载关卡 ----
  function loadLevel(levelId) {
    const cfg = getLevel(levelId);
    if (!cfg) return false;

    state.currentLevelId = levelId;
    state.isGameOver = false;
    state.isWin = false;
    state.selectedCell = null;
    state.attempts = 0;

    // 创建新棋盘
    board = new Board();
    state.board = board;
    state._boardRef = board;

    // 用关卡 seed 初始化随机种子
    seed = cfg.seed;

    // 根据 initialCount 初始生成恐龙
    for (let i = 0; i < cfg.initialCount; i++) {
      dropOneDino(cfg);
    }

    console.log(`[Game] Level ${levelId} loaded | board items: ${board.getAllItems().length}`);
    return true;
  }

  // ---- 掉落一只恐龙（根据 dropRates） ----
  function dropOneDino(cfg) {
    const empty = board.findEmptyCells();
    if (empty.length === 0) return false;

    seed++; // advance seed for each drop
    const dinoLevel = randomDinoLevel(seed, cfg.dropRates);
    const dino = {
      id: nextDinoId(),
      level: dinoLevel,
      variant: 'normal',
    };

    const pos = empty[Math.floor(seed % empty.length)];
    board.setCell(pos.row, pos.col, dino);
    return true;
  }

  // ---- 点击处理 ----
  function handleClick(x, y) {
    // 1. 先做命中测试
    const info = renderer.hitTest(x, y);
    if (!info) return;

    // 2. 按钮处理（任何游戏状态都可点重启）
    if (info.button === 'restart') {
      doRestartLevel();
      return;
    }

    // 下一关：仅在通关后可用
    if (info.button === 'next') {
      if (state.isGameOver && state.isWin) {
        doNextLevel();
      }
      return;
    }

    // 3. 游戏结束时，棋盘格点击无效
    if (state.isGameOver) {
      return;
    }

    // 4. 正常游戏状态处理棋盘格点击
    const { row, col } = info;
    if (row === undefined || col === undefined) return;

    const cell = board.getCell(row, col);

    if (state.selectedCell === null) {
      // 无选中 → 选中有恐龙的格子
      if (cell) {
        state.selectedCell = { row, col };
      }
    } else {
      const { row: sRow, col: sCol } = state.selectedCell;

      if (row === sRow && col === sCol) {
        // 点击同一格 → 取消选择
        state.selectedCell = null;
      } else if (cell) {
        // 点击另一有恐龙格 → 尝试合成
        const src = board.getCell(sRow, sCol);
        const tgt = board.getCell(row, col);
        if (src && tgt && src.level === tgt.level) {
          // 合成成功
          const newLevel = Math.min(src.level + 1, gameConfig.dino.maxLevel);
          board.setCell(row, col, { id: nextDinoId(), level: newLevel, variant: 'normal' });
          board.clearCell(sRow, sCol);
          state.selectedCell = null;

          Analytics.merge(src.level, newLevel, { to_row: row, to_col: col });

          // 掉落新恐龙（有空位时）
          const cfg = getLevel(state.currentLevelId);
          if (board.findEmptyCells().length > 0) {
            dropOneDino(cfg);
          }

          // 检查通关
          checkWin();
          // 检查失败
          if (!state.isGameOver) {
            checkLose();
          }
        } else {
          // 等级不同 → 切换选中
          state.selectedCell = { row, col };
        }
      } else {
        // 点击空格子 → 取消选择
        state.selectedCell = null;
      }
    }

    render();
  }

  // ---- 通关判断 ----
  function checkWin() {
    const cfg = getLevel(state.currentLevelId);
    if (!cfg) return;
    const items = board.getAllItems();
    const targetCount = items.filter(it => it.level >= cfg.target.level).length;
    if (targetCount >= cfg.target.count) {
      state.isGameOver = true;
      state.isWin = true;
      levelModule.restart(); // increment attempts on win
      Analytics.gameOver(state.currentLevelId, true, 'target_reached');
      Analytics.levelComplete(state.currentLevelId, state.attempts);
    }
  }

  // ---- 失败判断 ----
  function checkLose() {
    if (board.isStuck()) {
      state.isGameOver = true;
      state.isWin = false;
      Analytics.gameOver(state.currentLevelId, false, 'stuck');
    }
  }

  // ---- 重开当前关 ----
  function doRestartLevel() {
    loadLevel(state.currentLevelId);
    render();
  }

  // ---- 进入下一关 ----
  function doNextLevel() {
    if (state.currentLevelId < 30) {
      loadLevel(state.currentLevelId + 1);
    } else {
      // 已通关所有关卡，重开第1关
      loadLevel(1);
    }
    render();
  }

  // ---- 渲染 ----
  function render() {
    if (!renderer) return;
    const levelCfg = getLevel(state.currentLevelId);
    renderer.drawGame({
      levelId: state.currentLevelId,
      levelCfg,
      board: state._boardRef,
      selectedCell: state.selectedCell,
      isGameOver: state.isGameOver,
      isWin: state.isWin,
    });
  }

  // ---- 绑定点击/触摸事件 ----
  function bindCanvasEvents() {
    const canvas = renderer.getCanvas();

    if (typeof wx !== 'undefined') {
      // 微信小游戏环境：优先使用 wx.onTouchStart
      if (typeof wx.onTouchStart === 'function') {
        wx.onTouchStart((res) => {
          const touch = res.touches && res.touches[0];
          if (touch) {
            const x = touch.clientX ?? touch.x;
            const y = touch.clientY ?? touch.y;
            handleClick(x, y);
          }
        });
      } else if (typeof wx.onCanvasTouchStart === 'function') {
        // 降级：wx.onCanvasTouchStart
        wx.onCanvasTouchStart((res) => {
          const touch = res.touches && res.touches[0];
          if (touch) handleClick(touch.x, touch.y);
        });
      }
    } else if (typeof document !== 'undefined' && canvas) {
      // 浏览器环境：同时支持 touch 和 click
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const x = (touch.clientX - rect.left) * scaleX;
          const y = (touch.clientY - rect.top) * scaleY;
          handleClick(x, y);
        }
      }, { passive: false });
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        handleClick(x, y);
      });
    }
  }

  // ---- 启动游戏 ----
  function start() {
    init();
    levelModule = new Level();
    loadLevel(1);
    render();
    Analytics.gameStart(1);
    console.log('[Game] 萌萌合成小恐龙 started!');
  }

  return {
    start,
    _handleClick: handleClick,
  };
}
