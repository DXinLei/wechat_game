/**
 * 基于 seed 的伪随机数生成
 * 保证相同 seed 产生相同的随机序列
 */

class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  /**
   * 获取下一个随机数 [0, 1)
   */
  next() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  /**
   * 获取 [min, max] 范围内的随机整数
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * 按权重随机选择
   * @param {Array} items - 选项数组
   * @param {Array} weights - 权重数组
   */
  weightedChoice(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}

export { SeededRandom };

/**
 * 根据 seed 生成随机恐龙等级
 */
export function randomDinoLevel(seed, dropRates) {
  const levels = Object.keys(dropRates).map(Number);
  const weights = levels.map(l => dropRates[l]);
  const rng = new SeededRandom(seed);
  const chosen = rng.weightedChoice(levels, weights);
  return chosen;
}
