/**
 * 广告服务 - Mock 版本
 * 开发阶段直接 resolve success，不接真实 wx.createRewardedVideoAd
 */

import { gameConfig } from '../config/gameConfig.js';

const MOCK = gameConfig.adMock;

export const AdService = {
  /**
   * 显示激励广告
   * @param {string} position - 广告位置标识
   * @param {string} rewardType - 奖励类型
   * @returns {Promise<boolean>} 是否成功
   */
  showRewardAd(position, rewardType) {
    return new Promise((resolve) => {
      if (MOCK) {
        console.log(`[AdMock] showRewardAd called: position=${position}, reward=${rewardType}`);
        setTimeout(() => {
          console.log(`[AdMock] reward ad completed: ${rewardType}`);
          resolve(true);
        }, 100);
        return;
      }

      // TODO: 真实微信广告接入
      // const rewardedVideo = wx.createRewardedVideoAd({ adUnitId: 'your_unit_id' });
      // rewardedVideo.show().then(() => { ... });
      resolve(true);
    });
  },

  /**
   * 显示插屏广告
   */
  showInterstitialAd() {
    return new Promise((resolve) => {
      if (MOCK) {
        console.log('[AdMock] showInterstitialAd called');
        setTimeout(resolve, 50);
        return;
      }
      // TODO: 真实插屏广告接入
      resolve(true);
    });
  },
};
