# Codex 正式任务｜EP01 工程阶段0–2（待执行）

> 当前状态：`PENDING_EXECUTION`。本文是工程任务，不证明 Codex 已经运行命令。

## 不可省略的阅读

先阅读 `AGENTS.md`、`docs/WORKFLOW.md`、`docs/STYLE_BASELINE.md`、`docs/UPSTREAM_SOURCES.md`、`docs/MOTION_REQUIREMENTS.md`、`docs/SCORE_RUBRIC.md`、`episodes/EP01/RESEARCH.md`、`episodes/EP01/SCRIPT.md`、`episodes/EP01/DIRECTOR.md`、`episodes/EP01/SAMPLE_15S.md`。

## 阶段0：真实克隆并复现 GitHub 原仓库（可在导演稿审核时并行）

1. 仅在用户授权的工作目录执行，先检查 `git`, `node`, `npm`, `ffmpeg`, `python`, Playwright/Chromium；不修改用户机器的全局环境以图省事。
2. 在 `third_party/` 完整克隆：`https://github.com/cth9191/animate`，记录 commit/remote/license；分析完整 `plugins/animate/skills/animate/` 工作流。
3. 读取 `styles/sketchbook/` 与 `styles/crosshatch/` 的 `STYLE.md`、`kit.js`、`demo/piece.json`、`demo/src/`，以及共享 `kit/`、`tools/` 的本轮实际依赖；不是只看 README、图片或 prompt。
4. 按上游 README/SKILL.md 的真实调用方法分别构建、渲染官方 Demo，记录运行命令、日志、MP4、关键帧。失败时输出可复现错误并解决依赖，不能假报成功。
5. 原版 Demo 通过后提交给用户选定唯一画风。未选定不得声称系列风格已冻结。保留 upstream 原始版本与 diff。

PowerShell 克隆示例：

```powershell
New-Item -ItemType Directory -Force -Path .\third_party | Out-Null
git clone https://github.com/cth9191/animate.git .\third_party\animate
git -C .\third_party\animate rev-parse HEAD
```

## 阶段1：导演稿审核通过且风格确定后，建立真实动画工程

1. 复用已经验证的 `kit.js` 与公共引擎，新增人物步态、髋膝踝关节或等效稳定姿态系统、血液/间隙/肌肉结构和摄取粒子轨迹。
2. 将摄影机当成有轨迹的实体：位置、跟随对象、缩放与世界空间变换随时间连续变化；不能把图片整体放大冒充镜头进入腿部。
3. 对每个关键镜头建事件/动作状态函数（`renderAt(t)` 或等价系统），记录时间窗、主动作、中间状态、音效 cue 和镜头衔接。
4. 按 `DIRECTOR.md` 的信息目标构建。必要时可借鉴 `lemo-opuscar`/`mg-styles-15` 的真实运镜源码；按需要另外克隆，登记来源与许可证，禁止为了省事一口气混装全部系统。
5. Codex 可以自主优化动作轨迹、缓动、构图、技术实现；涉及科学机制/旁白/重要剧情变更时向 ChatGPT 提议，不得擅改内容。

## 阶段2：15秒样片

1. 完成 `SAMPLE_15S.md` 的四段连续动作和临时中文配音、同步字幕及必要音效。
2. **禁止**：三个静态绘制页面做淡入淡出；单独给每张图做全局scale/position动画；空镜长停留；用字体/颗粒跳动代替人物行动和科学机制。
3. 在低分辨率预览中逐镜头查姿态与运动，提交0.2–0.5秒连续抽帧、关键帧、真实MP4，不得以2–3张风格图代替样片。
4. 自动检查关键时间点动画状态/帧差，人工回看运动是否有叙事意义；工程测试不代表内容审美自动通过。
5. 为独立审核提交所有证据：工作commit/视频hash/完整运行命令/渲染耗时/依赖版本/源码清单/许可/已知失败项。

## 明确的阶段门禁

- 原版风格复现通过≠新片通过；关键帧好看≠有动画；MP4有效≠叙事有效。
- 未经独立GPT审核导演稿，不能宣称批准制作正式样片。
- 独立GPT/独立Codex审核须评价真实产物，评分制度 `docs/SCORE_RUBRIC.md` 固定，样片阶段按已定义的适用维度权重归一化≥90、单项≥3.5及硬否决全部通过后，才**建议**用户决定是否扩展全片。缺少必验视频或工程证据是 NOT VERIFIED，不可算不适用。
- 两轮返工仍无有效改善时停止盲目反复，登记阻塞与替代方案。

## 交付格式

```
【阶段】0（源码复现） / 1（框架） / 2（样片）
【版本】upstream commit；工作 commit；MP4 sha256
【源代码审计】实际读过/运行过的风格、demo、引擎、渲染脚本与版本
【命令和环境】完整可复现命令、依赖及关键日志
【产物】视频、连续动作抽帧、关键画面、工程源码
【结果】PASS/FAIL/NOT VERIFIED；已知风险与许可
【下一步建议】需要GPT修改的内容；需要用户确认的风格/阶段；最小修复计划
```

任何尚未完成的阶段必须明确 `NOT VERIFIED`，不得仅凭规划文本声称已运行。