/**
 * 棋盘核心模块
 * 3×3 棋盘数据结构与操作
 */

export class Board {
  constructor() {
    this.rows = 3;
    this.cols = 3;
    this.cells = this.createEmptyBoard();
  }

  /**
   * 创建空棋盘
   */
  createEmptyBoard() {
    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null)
    );
  }

  /**
   * 重置棋盘
   */
  reset() {
    this.cells = this.createEmptyBoard();
  }

  /**
   * 获取格子数据
   */
  getCell(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
    return this.cells[row][col];
  }

  /**
   * 设置格子数据
   */
  setCell(row, col, item) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
    this.cells[row][col] = item;
  }

  /**
   * 清空指定格子
   */
  clearCell(row, col) {
    this.setCell(row, col, null);
  }

  /**
   * 查找所有空格
   */
  findEmptyCells() {
    const empty = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.cells[r][c] === null) {
          empty.push({ row: r, col: c });
        }
      }
    }
    return empty;
  }

  /**
   * 判断棋盘是否已满
   */
  isFull() {
    return this.findEmptyCells().length === 0;
  }

  /**
   * 判断是否存在可合成的相邻或同位置项
   * 检查所有格子中是否有两只等级相同的恐龙
   */
  hasMergeable() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.cells[r][c];
        if (!current) continue;
        // 检查棋盘上其他位置是否有同等级的恐龙
        for (let r2 = 0; r2 < this.rows; r2++) {
          for (let c2 = 0; c2 < this.cols; c2++) {
            if (r === r2 && c === c2) continue;
            const other = this.cells[r2][c2];
            if (other && other.level === current.level) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * 放置恐龙到随机空格
   */
  placeRandom(item) {
    const empty = this.findEmptyCells();
    if (empty.length === 0) return false;
    const pos = empty[Math.floor(Math.random() * empty.length)];
    this.setCell(pos.row, pos.col, item);
    return pos;
  }

  /**
   * 移除指定格子的恐龙
   */
  removeAt(row, col) {
    const item = this.getCell(row, col);
    this.clearCell(row, col);
    return item;
  }

  /**
   * 移动恐龙到目标位置
   */
  moveTo(fromRow, fromCol, toRow, toCol) {
    const item = this.getCell(fromRow, fromCol);
    if (!item) return false;
    this.clearCell(fromRow, fromCol);
    this.setCell(toRow, toCol, item);
    return true;
  }

  /**
   * 交换两个格子
   */
  swap(row1, col1, row2, col2) {
    const temp = this.cells[row1][col1];
    this.cells[row1][col1] = this.cells[row2][col2];
    this.cells[row2][col2] = temp;
  }

  /**
   * 获取所有恐龙
   */
  getAllItems() {
    const items = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.cells[r][c]) {
          items.push({ ...this.cells[r][c], row: r, col: c });
        }
      }
    }
    return items;
  }

  /**
   * 判断是否无解（棋盘满且无可合成）
   */
  isStuck() {
    return this.isFull() && !this.hasMergeable();
  }
}
