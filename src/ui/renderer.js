/**
 * Canvas 渲染模块 - 占位骨架
 */

export class Renderer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * 初始化 Canvas
   */
  init() {
    if (typeof wx !== 'undefined') {
      this.canvas = wx.createCanvas();
    } else {
      // 非微信环境，创建模拟 canvas
      this.canvas = document.createElement('canvas');
      this.canvas.width = 375;
      this.canvas.height = 667;
    }
    this.ctx = this.canvas.getContext('2d');
    console.log('[Renderer] initialized');
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
    // 渐变背景
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
   * 绘制 3×3 棋盘占位
   */
  drawBoardPlaceholder() {
    const { ctx, canvas } = this;
    const cols = 3, rows = 3;
    const cellSize = 90;
    const gap = 10;
    const boardW = cols * cellSize + (cols - 1) * gap;
    const boardH = rows * cellSize + (rows - 1) * gap;
    const startX = (canvas.width - boardW) / 2;
    const startY = 100;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cellSize + gap);
        const y = startY + r * (cellSize + gap);

        // 格子背景
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.strokeStyle = '#8BC34A';
        ctx.lineWidth = 2;
        this.roundRect(x, y, cellSize, cellSize, 12);
        ctx.fill();
        ctx.stroke();

        // 恐龙占位圆
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#999';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('恐龙', x + cellSize / 2, y + cellSize / 2 + 4);
      }
    }
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
   * 绘制占位启动画面
   */
  drawPlaceholder(levelData) {
    this.clear();
    this.drawBackground();
    this.drawTitle();
    this.drawBoardPlaceholder();

    // 关卡信息
    const { ctx, canvas } = this;
    ctx.fillStyle = '#555';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `第 ${levelData.id} 关 | 目标: Lv.${levelData.target.level} × ${levelData.target.count}`,
      canvas.width / 2,
      450
    );
  }
}
