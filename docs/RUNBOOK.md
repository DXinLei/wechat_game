# Runbook

## Project
萌萌合成小恐龙 / DXinLei/wechat_game

## Current Branch
feat/p0-mvp-bootstrap

## How to Open in WeChat DevTools

1. 打开微信开发者工具。
2. 选择「小游戏」项目。
3. 导入本地目录：`/opt/data/wechat_game`，或用户本地实际的 `wechat_game` 仓库目录。
4. AppID 使用测试号 / touristappid。
5. 编译运行。

## Local Command Check

```bash
npm install
npm run check
```

**Expected Result**

打开后应看到：
- 渐变背景
- 标题：萌萌合成小恐龙
- 第 1 关目标
- 3×3 棋盘
- 若干 Lv.1 恐龙圆形占位
- 底部「重开」「下一关」按钮

## Basic Play Test

1. 点击一个 Lv.1 恐龙。
2. 点击另一个 Lv.1 恐龙。
3. 两只 Lv.1 应合成为一只 Lv.2。
4. 棋盘应随机掉落一只新恐龙。
5. 达成目标后应显示通关提示。
6. 通关后「下一关」按钮应可用。
7. 失败后「重开」按钮应可用，「下一关」不可用。

## Known Limitations

- 当前是 P0 v0.1 原型。
- 暂无真实美术恐龙素材接入。
- 暂无拖拽，仅支持点击式合成。
- 暂无真实广告，仅有 adMock。
- 暂无音效。
- 暂无道具 UI。
