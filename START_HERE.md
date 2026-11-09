# GEMINI — 开箱即可用的离线源码与同题测试包

**按顺序先阅读：** `GEMINI_TASK.md`（固定要求），然后 `animate/styles/sketchbook/STYLE.md`，再参考 `animate/styles/sketchbook/demo/src/`，需要底层才看 `animate/kit/` 和 `animate/styles/sketchbook/kit.js`。
原始代码来源：`cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`，MIT许可证在 `LICENSE`。这份包是原版可运行代码子集，不包含我们失败的杆件人物源码。
**离线**：这里的“离线”意为无需通过 GitHub 读取源码；首次安装 Node/Playwright/Chromium/FFmpeg 可能仍需要下载安装依赖。

## 参考Demo如何运行（Node 18+ / Playwright+Chromium / FFmpeg）
```bash
npm install -g playwright
npx playwright install chromium
node animate/tools/build.mjs animate/styles/sketchbook/demo
node animate/tools/still.mjs animate/styles/sketchbook/demo 1.75,5.0 reference.png
node animate/tools/export.mjs animate/styles/sketchbook/demo --no-audio
```
已有依赖可略过安装。具体命令以实际运行工具输出为准；**我只核对原始构建源码，并没有在 Gemini 的环境里替它运行完成验证**。

## 同题公平比较
不要参考或复刻前一版失败小人；不要因为官方Demo画了一个圆点拟人主角，就将同一圆点+杆件当成自然成人。测试 T1 人物、T2 内视、T3 形变分别评分；同一要求将交给 Codex，评估真实视频而非日志PASS。
