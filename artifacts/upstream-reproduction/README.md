# EP01 工程阶段0｜上游官方 Demo 复现证据

状态：`PASS WITH KNOWN UPSTREAM REVIEW RISK`  
执行边界：仅复现 `cth9191/animate` 官方 `sketchbook` 与 `crosshatch` Demo。导演稿仍待独立审核；未制作、未放行 EP01 15 秒样片或完整成片。

## 固定版本

- 上游仓库：`https://github.com/cth9191/animate`
- 上游 commit：`7e5eb56feb2dd573f890e1b7b34748af43d58263`
- 上游许可证：MIT（仓库根 `LICENSE`，Copyright 2026 cth9191）
- 项目级依赖固定为 Playwright `1.65.0`、`ffmpeg-static@5.3.0`、`ffprobe-static@3.1.0`，脚本每次运行均校验实际安装版本。
- Node、npm、操作系统、Chromium 缓存位置、FFmpeg/FFprobe 二进制版本与候选本地字体哈希见每次重建的 `environment.txt`。
- 输出规格：`1080×1920`、24 fps、144 帧、6.000 秒、H.264/AAC MP4

## 实际审读和运行范围

完整审读了上游 `README.md`、`LICENSE`、`SKILL.md`、`craft.md`、两个候选风格的 `STYLE.md`、`kit.js`、`demo/piece.json`、`demo/src/`，以及本轮真实依赖的共享 `kit/core.js`、`morph.js`、`board.js`、`score-head.js`、`score-tail.js` 和 `tools/build.mjs`、`tile.mjs`、`still.mjs`、`storyboard.mjs`、`framehash.mjs`、`export.mjs`、`review.mjs`、`textcheck.mjs`、`gpu.mjs`。

实际运行链路不是截图重画：

1. `build.mjs` 从原始 head、共享 kit、原 style kit、原 scenes、bridges 与 score 生成单文件 `index.html`。
2. Playwright/Chromium 对每一帧调用原版 `renderFrame(t)`。
3. OfflineAudioContext 运行原版 score，生成 mix 与 stems。
4. FFmpeg 把 144 张原始渲染帧与音频编码为 MP4。
5. `tile.mjs` 逆序二次渲染并比较像素；两个 Demo 均为 `deterministic: true`。
6. `review.mjs` 读取真实 MP4 与帧序列，生成 0.25 秒间隔联系表并检查平帧、停滞、文字、安全区、morph 节拍与音频。

## 可观看产物

### Sketchbook

- `sketchbook/demo-share.mp4`：从原版源码导出的可观看复现版本
- `sketchbook/shot01-sequence.jpg`：铅笔描线、灯泡绘制与角色反应的连续序列
- `sketchbook/shot02-sequence.jpg`：灯泡变太阳、场景展开与角色动作的连续序列
- `sketchbook/determinism-tile.png`：选定帧与安全区证据

MP4 的当前 SHA-256 见机器生成的 `manifest.sha256`；每次完整重跑后由脚本最后重新计算。高码率中间输出保留在本地忽略目录 `third_party/animate/plugins/animate/skills/animate/styles/sketchbook/demo/renders/final.mp4`，不重复提交到 GitHub。

### Crosshatch

- `crosshatch/demo-share.mp4`：从原版源码导出的可观看复现版本
- `crosshatch/shot01-sequence.jpg`：纸面书写、计划线与相机推进的连续序列
- `crosshatch/shot02-sequence.jpg`：咖啡变月亮、暗场展开与终端逐字输入的连续序列
- `crosshatch/determinism-tile.png`：选定帧与安全区证据

MP4 的当前 SHA-256 见机器生成的 `manifest.sha256`；每次完整重跑后由脚本最后重新计算。高码率中间输出保留在本地忽略目录 `third_party/animate/plugins/animate/skills/animate/styles/crosshatch/demo/renders/final.mp4`，不重复提交到 GitHub。

完整文件哈希见 `manifest.sha256`，原始命令输出见 `logs/`。

## 验证结果

| 检查 | Sketchbook | Crosshatch |
|---|---|---|
| 从原始源码构建 | PASS | PASS |
| 144 帧完整导出 | PASS | PASS |
| 确定性二次渲染 | PASS | PASS |
| 3.0 秒 shape morph 在 8 分音符网格 | PASS | PASS |
| 平帧扫描 | PASS（0） | PASS（0） |
| 文字截断/重叠 | PASS（0） | PASS（0） |
| 无叙事理由的长停滞 | PASS（0 段） | PASS（0 段） |
| 音频响度/峰值 | -14.7 LUFS / -1.7 dBFS | -14.8 LUFS / -1.0 dBFS |
| 最响窗口位于 payoff act | PASS（4.5 秒） | **FAIL（1.0 秒）** |

`crosshatch` 的上游 `review.mjs` story-arc 汇总显示 PASS，但随后 SOUND 明细把最响 100ms 定位在 1.0 秒，不在 3–6 秒 payoff act。该矛盾不影响“源码能否构建和渲染”的阶段0结论，但应在选定风格或派生样片前修正 score 或 review 口径，不能当作全绿。

## 动态性人工复核

- Sketchbook：逐步出现的铅笔轨迹、灯泡轮廓/填色、角色姿态和表情、纸飞机与蚂蚁背景动作、灯泡到太阳的真实轮廓 morph、展开后的山丘/房屋/树/烟与挥手动作。
- Crosshatch：纸张文字 write-on、铅笔跟随、红色计划线、蒸汽和 hero boil、咖啡到月亮的真实轮廓 morph、暗场结构展开、终端逐字符输入。
- 两者都使用世界坐标 camera transform、时间函数和逐帧状态变化；不是静态图轮播、全局缩放或淡入淡出替代动画。
- `deterministic: true` 证明本机、同版本、同字体环境内的逐帧确定性。风格使用本地系统字体回退，跨操作系统的字形和像素哈希不保证相同；本次候选 Windows 字体文件及哈希记录在 `environment.txt`，不声称这些记录等于 Chromium 的完整字体解析轨迹。

## 许可与资源

官方两个 Demo 的画面、音频均由仓库代码程序化生成，未发现外部图片、网络字体、第三方声音或视频素材；`build.mjs` 输出也确认 `no external assets`。MIT 许可适用于本次固定 commit 的代码，保留上游许可证和 commit 记录。未来 EP01 若加入字体、配音、音效或其他仓库代码，必须另行登记授权。

## 复现命令

在仓库根目录运行：

```powershell
pwsh -File .\scripts\reproduce-upstream-demos.ps1
```

脚本把 npm 工具、Playwright 浏览器、上游源码和产物分别写入仓库内的 `.tools/`、`third_party/` 与 `artifacts/`；只对脚本进程设置 PATH，不修改全局 Git、npm 或系统 PATH。最终系列风格仍为 `PENDING_USER_CHOICE`。最终工作 commit 与本次媒体哈希将在 GitHub Issue #2 的交付评论中绑定。
