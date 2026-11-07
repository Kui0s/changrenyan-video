# EP01 上游 Demo 来源与原创能力审计｜证据归档（2026-11-06）

> **对象**：`codex/ep01-upstream-reproduction` 分支、提交 `095ec71eda99940cae1ac008610065d32a84ec4f`、Draft PR #3；以及用户提供的 Work 独立审计结果。本文件记录**既有独立审核结论**及本次核对的可见 GitHub 证据，并不宣称本会话完成了第二台机器重新构建。

## 结论

| 审核对象 | 状态 | 边界 |
|---|---|---|
| `cth9191/animate` 官方 Sketchbook/Crosshatch Demo 源码重新构建 | **PASS（源码和证据一致）** | 不是下载官方 MP4；也不是原创《常人言》内容 |
| 来源声明真实性 | **PASS（基本完整）** | 提交明确披露官方示例与上游 commit；仍需第三方 NOTICE 清单 |
| Codex 新作的《常人言》人物、镜头、科学图示能力 | **NOT VERIFIED** | 没有发现新增的 EP01 动画场景源码 |
| 不同干净环境独立重建 | **NOT VERIFIED** | 只有原执行方提交的本机日志和证据，未见独立 CI 构建证明 |
| 导演稿及成片质量90分审核 | **NOT VERIFIED** | 上游 Demo 不能代替 EP01 审核 |

## 可查证事实

- [上游仓库](https://github.com/cth9191/animate)，固定上游 `7e5eb56feb2dd573f890e1b7b34748af43d58263`，MIT。
- [本项目复现提交](https://github.com/Kui0s/changrenyan-video/commit/095ec71eda99940cae1ac008610065d32a84ec4f)、[Draft PR #3](https://github.com/Kui0s/changrenyan-video/pull/3)、[复现脚本](https://github.com/Kui0s/changrenyan-video/blob/095ec71eda99940cae1ac008610065d32a84ec4f/scripts/reproduce-upstream-demos.ps1)。
- 复现脚本 clone 并 checkout 上游 commit，运行其 `build.mjs`、`tile.mjs`、`export.mjs`、`review.mjs`，未在本项目提交修改后的上游 `scenes.js`、`kit.js`。
- 交付两份 1080×1920 / 24fps / 144帧 / 6秒的官方示例重建 MP4，附连续帧、环境、日志、哈希。上游官方 Sketchbook 的灯泡→太阳、Crosshatch 的咖啡→月亮内容与媒体相吻合。
- Crosshatch 的音频高潮位置检查存在已披露的上游失败项；不影响其从源码构建的基本结论。
- 未有 GitHub CI 独立重建；不得把 `deterministic: true` 等同跨机器证明，不能把 PR 中自报审查视为第三方审查。

## 开源许可整改项

在移植上游引擎/风格源代码进入正式动画工程前：保留 MIT 正文及原版权声明；补全上游和 npm/FFmpeg/Playwright/音频/字体依赖清单与授权边界；冻结依赖锁文件；避免把复现 MP4 当原创视频宣传。

## 下一验证条件

使用最终选定的一种风格的原 `kit.js` 和共享引擎，新写上游不存在的 EP01 15秒动画：人物连续迈步、摄像机追随并进入腿部、葡萄糖按血管→组织间隙→肌细胞的路径被摄取。提交**新场景源码**、上游 diff、MP4、0.25–0.5秒联系表、构建日志、许可证清单，随后安排独立代码检查和一次干净环境重建。

**本审计不修改固定评分标准，也不构成 15秒原创样片的通过证明。**