/**
 * 存储服务
 * 微信环境使用 wx.getStorageSync / wx.setStorageSync
 * 非微信环境使用内存 fallback
 */

const isWeChat = typeof wx !== 'undefined';

const memory = {};

export const Storage = {
  /**
   * 初始化
   */
  init() {
    if (isWeChat) {
      console.log('[Storage] Using wx storage');
    } else {
      console.log('[Storage] Using memory fallback');
    }
  },

  /**
   * 读取数据
   */
  get(key) {
    if (isWeChat) {
      try {
        return wx.getStorageSync(key);
      } catch (e) {
        console.warn('[Storage] get failed:', key, e);
        return null;
      }
    }
    return memory[key] || null;
  },

  /**
   * 写入数据
   */
  set(key, value) {
    if (isWeChat) {
      try {
        wx.setStorageSync(key, value);
      } catch (e) {
        console.warn('[Storage] set failed:', key, e);
      }
      return;
    }
    memory[key] = value;
  },

  /**
   * 删除数据
   */
  remove(key) {
    if (isWeChat) {
      try {
        wx.removeStorageSync(key);
      } catch (e) {
        console.warn('[Storage] remove failed:', key, e);
      }
      return;
    }
    delete memory[key];
  },

  /**
   * 清空所有数据
   */
  clear() {
    if (isWeChat) {
      try {
        wx.clearStorageSync();
      } catch (e) {
        console.warn('[Storage] clear failed:', e);
      }
      return;
    }
    Object.keys(memory).forEach(k => delete memory[k]);
  },
};
