/**
 * Canvas 渲染模块
 * P0 v0.1 可玩原型
 */

export class Renderer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    // 棋盘布局（动态计算）
    this.layout = {};
  }

  /**
   * 初始化 Canvas
   */
  init() {
    if (typeof wx !== 'undefined') {
      this.canvas = wx.createCanvas();
      const sysInfo = wx.getSystemInfoSync();
      this.canvas.width = sysInfo.screenWidth;
      this.canvas.height = sysInfo.screenHeight;
    } else {
      // 非微信环境，fallback 到固定尺寸
      this.canvas = document.createElement('canvas');
      this.canvas.width = 375;
      this.canvas.height = 667;
    }
    this.ctx = this.canvas.getContext('2d');
    this._calcLayout();
    console.log('[Renderer] initialized', this.canvas.width, 'x', this.canvas.height);
  }

  /**
   * 获取 canvas 实例
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * 计算棋盘和按钮区域布局
   */
  _calcLayout() {
    const { canvas } = this;
    const cellSize = Math.min(100, Math.floor(canvas.width / 4.5));
    const gap = 10;
    const cols = 3, rows = 3;
    const boardW = cols * cellSize + (cols - 1) * gap;
    const boardH = rows * cellSize + (rows - 1) * gap;
    const boardX = (canvas.width - boardW) / 2;
    const boardY = Math.floor(canvas.height * 0.18);

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          row: r, col: c,
          x: boardX + c * (cellSize + gap),
          y: boardY + r * (cellSize + gap),
          w: cellSize, h: cellSize,
        });
      }
    }

    // 按钮区域在棋盘下方
    const btnY = boardY + boardH + 40;
    const btnW = 120;
    const btnH = 44;
    const btnGap = 30;
    const totalBtnW = btnW * 2 + btnGap;
    const btnStartX = (canvas.width - totalBtnW) / 2;

    this.layout = {
      boardX, boardY, cellSize, gap, cols, rows,
      cells,
      buttons: {
        restart: { x: btnStartX, y: btnY, w: btnW, h: btnH },
        next:    { x: btnStartX + btnW + btnGap, y: btnY, w: btnW, h: btnH },
      },
    };
  }

  /**
   * 点击命中测试
   * @returns {{ row, col } | { button } | null }
   */
  hitTest(x, y) {
    const { cells, buttons } = this.layout;
    for (const cell of cells) {
      if (x >= cell.x && x <= cell.x + cell.w && y >= cell.y && y <= cell.y + cell.h) {
        return { row: cell.row, col: cell.col };
      }
    }
    for (const [name, btn] of Object.entries(buttons)) {
      if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
        return { button: name };
      }
    }
    return null;
  }

  /**
   * 清除画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 绘制背景
   */
  drawBackground() {
    const { ctx, canvas } = this;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * 绘制标题
   */
  drawTitle(text = '萌萌合成小恐龙') {
    const { ctx, canvas } = this;
    ctx.save();
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF6B35';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeText(text, canvas.width / 2, 50);
    ctx.fillText(text, canvas.width / 2, 50);
    ctx.restore();
  }

  /**
   * 绘制关卡信息
   */
  drawLevelInfo(levelId, levelCfg) {
    const { ctx, canvas } = this;
    if (!levelCfg) return;
    ctx.save();
    ctx.fillStyle = '#444';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `第 ${levelId} 关  |  目标: Lv.${levelCfg.target.level} × ${levelCfg.target.count}`,
      canvas.width / 2,
      Math.floor(canvas.height * 0.14)
    );
    ctx.restore();
  }

  /**
   * 圆角矩形辅助
   */
  roundRect(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  /**
   * 绘制棋盘（含恐龙）
   */
  drawBoard(board, selectedCell) {
    const { ctx } = this;
    const { cells } = this.layout;

    for (const cell of cells) {
      const { row, col, x, y, w, h } = cell;
      const item = board ? board.getCell(row, col) : null;
      const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;

      // 格子背景
      ctx.fillStyle = isSelected ? 'rgba(255,235,59,0.9)' : 'rgba(255,255,255,0.85)';
      ctx.strokeStyle = isSelected ? '#FF9800' : '#8BC34A';
      ctx.lineWidth = isSelected ? 4 : 2;
      this.roundRect(x, y, w, h, 12);
      ctx.fill();
      ctx.stroke();

      if (item) {
        // 恐龙圆形占位
        const cx = x + w / 2;
        const cy = y + h / 2;
        const r = Math.min(w, h) * 0.34;

        // 恐龙颜色（按等级区分）
        const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336',
                        '#00BCD4', '#E91E63', '#8BC34A', '#FFC107', '#607D8B'];
        const color = colors[(item.level - 1) % colors.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // 恐龙边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 恐龙等级文字
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(12, Math.floor(r * 0.6))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Lv.${item.level}`, cx, cy);
      }
    }
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * 绘制按钮
   */
  drawButton(label, x, y, w, h, color, disabled) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = disabled ? '#ccc' : color;
    ctx.strokeStyle = disabled ? '#aaa' : '#fff';
    ctx.lineWidth = 2;
    this.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = disabled ? '#888' : '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  /**
   * 绘制游戏结束提示
   */
  drawGameOver(isWin) {
    const { ctx, canvas } = this;
    const { boardX, boardY, cellSize, gap, cols, rows } = this.layout;
    const boardW = cols * cellSize + (cols - 1) * gap;
    const boardH = rows * cellSize + (rows - 1) * gap;

    const cx = boardX + boardW / 2;
    const cy = boardY + boardH / 2;

    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isWin ? '#FFD700' : '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.strokeText(isWin ? '🎉 通关！' : '💔 游戏结束', cx, cy);
    ctx.fillText(isWin ? '🎉 通关！' : '💔 游戏结束', cx, cy);
    ctx.restore();
  }

  /**
   * 绘制操作提示
   */
  drawHint() {
    const { ctx, canvas } = this;
    const y = Math.floor(canvas.height * 0.88);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('点击两个相同等级恐龙即可合成', canvas.width / 2, y);
    ctx.restore();
  }

  /**
   * 绘制完整游戏画面
   * @param {Object} gameState
   */
  drawGame(gameState) {
    const { levelId, levelCfg, board, selectedCell, isGameOver, isWin } = gameState;
    this.clear();
    this.drawBackground();
    this.drawTitle();
    this.drawLevelInfo(levelId, levelCfg);
    this.drawBoard(board, selectedCell);

    const { buttons } = this.layout;
    // 按钮：重开始终可用，下一关仅通关后可用
    this.drawButton('重 开', buttons.restart.x, buttons.restart.y,
                    buttons.restart.w, buttons.restart.h, '#FF7043', false);
    this.drawButton('下一关', buttons.next.x, buttons.next.y,
                    buttons.next.w, buttons.next.h, '#66BB6A', !isGameOver);

    if (isGameOver) {
      this.drawGameOver(isWin);
    } else {
      this.drawHint();
    }
  }
}
