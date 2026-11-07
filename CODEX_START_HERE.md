# Codex 开工入口｜《常人言》EP01（已授权原创15秒样片）

> **本文件是当前执行入口。打开仓库即从这里开始，不要求用户重新口述已经在仓库确定的需求。**
> **最新决策**：导演文字方案 `ROUND 03` 已由独立审核以 **90.0/100 PASS**；用户已确认 Sketchbook 风格，并指示在审核合格后应完成交接，使 Codex 可按本项目**直接启动原创15秒技术样片**。本授权仅涵盖阶段1/2的技术实现、提交审查 PR 和 Issue #5 的并行预演；**不授权直接进入完整正片批量制作、合并/发布或自行宣布最终PASS**。
> **不需要再次等待导演稿达到90分；它已经达标。** 后期正式普通话配音使用剪映AI朗读或用户本人声音；完整视频严格少于120秒。

## 0. 权威顺序与现状（读完即执行）

1. [`AGENTS.md`](./AGENTS.md)：工程权限与风险约束。
2. [`episodes/EP01/SCRIPT.md`](./episodes/EP01/SCRIPT.md) **v1.5** 和 [`DIRECTOR.md`](./episodes/EP01/DIRECTOR.md) **v2.4**：本期已审核通过的内容基线，**不可随意改动已批准的核心科学含义**。
3. [`ROUND_03.md`](./episodes/EP01/reviews/ROUND_03.md)：独立审核 **90.0 PASS**，只针对导演文字方案；保留历史，勿重审旧稿冒充新结论。
4. [`docs/STYLE_BASELINE.md`](./docs/STYLE_BASELINE.md)：唯一风格 **Sketchbook**，固定上游 commit；不得混入 Crosshatch 画风。
5. [`episodes/EP01/ORIGINAL_SAMPLE_TASK.md`](./episodes/EP01/ORIGINAL_SAMPLE_TASK.md) 与 [`SAMPLE_15S.md`](./episodes/EP01/SAMPLE_15S.md)：现在要执行的 **Issue #4**。
6. [`episodes/EP01/QA_HANDOFF.md`](./episodes/EP01/QA_HANDOFF.md)：必须交付的媒体、源码、证据与后续独立90分审核。
7. [`docs/SCORE_RUBRIC.md`](./docs/SCORE_RUBRIC.md) 固定100分制度 + [`docs/VOICE_AND_DURATION_POLICY.md`](./docs/VOICE_AND_DURATION_POLICY.md) 阶段性配音安排，**不允许调低评分尺度**。

> 如果其他历史文件提到“导演稿尚未通过/等待选择风格/需要先做完整自然语音”，以本文件、上述已通过审核、用户决定和最新 Issue 为准。历史失败报告原样保留。

## 1. 资源、代码、证据在哪里

| 对象 | 真实位置/URL | 已核实状态 |
|---|---|---|
| 本项目仓库 | https://github.com/Kui0s/changrenyan-video | 主分支存正式文本与执行规范；**没有原创动画源码**，由 Codex 本阶段新增 |
| 主动画引擎 | https://github.com/cth9191/animate | **源码来源已知**；上游固定 SHA：`7e5eb56feb2dd573f890e1b7b34748af43d58263` |
| Sketchbook 风格实现 | `plugins/animate/skills/animate/styles/sketchbook/STYLE.md`、`kit.js`、`demo/src/`（相对于上游根目录） | 官方 Demo 本机重建已有证据；**不是EP01原创内容** |
| 公共绘图动画系统 | 上游 `plugins/animate/skills/animate/kit/` | 有已用工具链，具体 import/renderer 以源码为准 |
| 渲染与检查工具 | 上游 `plugins/animate/skills/animate/tools/` | `build.mjs`、`export.mjs`、`tile.mjs`、`review.mjs` 等，确认 CLI 参数后用 |
| 已验证的 Windows 复现命令 | 本仓库 `scripts/reproduce-upstream-demos.ps1` | 从 [PR #3](https://github.com/Kui0s/changrenyan-video/pull/3) **原样迁入**；是上游官方 Demo 的复现脚本，**不是EP01原创渲染器** |
| 官方 Demo 及日志 | [PR #3](https://github.com/Kui0s/changrenyan-video/pull/3) 的 `artifacts/upstream-reproduction/` | 官方重建成功；原分支 Draft/未合并，不能将其媒体当成新作品 |
| 真实完成的原创样片/声音/干净环境重建 | 尚无 | **PENDING_EXECUTION**；不得报告已完成 |

## 2. 本地首轮执行：完成实际前置检查，然后开工

**所有命令在用户授权的工作区执行，不编辑全局 Node/Git/代理环境。** 电脑可能未包含上一轮独立执行环境；不要因为 GitHub 有成功日志就跳过当前机器的检查。

```powershell
# 如果尚未克隆本项目，在希望工作的目录执行：
git clone https://github.com/Kui0s/changrenyan-video.git
cd changrenyan-video

# 确认主分支包含审核与工程任务，并为原创样片独立开分支：
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c codex/ep01-original-15s

# 检查工具：版本和缺失项记入本次工程日志
git --version
node --version
npm --version
pwsh --version

# 原样保留真实上游，不在其中直接写EP01原创场景：
New-Item -ItemType Directory -Force -Path third_party | Out-Null
git clone https://github.com/cth9191/animate.git third_party/animate
git -C third_party/animate checkout --detach 7e5eb56feb2dd573f890e1b7b34748af43d58263
git -C third_party/animate rev-parse HEAD
```

- 如果本机已有 `third_party/animate`，先确认其 `origin`、`HEAD`、改动状态，**不要无条件覆盖**；如 SHA 不符，`fetch` 后安全切换到固定 SHA；如工作区已有改动，留证据后使用新的隔离目录。
- 上游复现脚本要求 Windows **PowerShell 7+**，其运行会在仓库内安装 `playwright@1.65.0`、`ffmpeg-static@5.3.0`、`ffprobe-static@3.1.0`，以及 Chromium。可参考脚本选择与复用依赖，但**不要求为了本片再完整渲染两套6秒官方Demo**。原脚本中 `npm install` 会重新解析依赖；在新增原创工程时须创建并提交依赖锁文件，或使用等价可锁定方式。
- `scripts/reproduce-upstream-demos.ps1` 是已经有 GitHub 证据的**复现模板**，不能误以为执行它就生产新场景；新动画必须有新增的项目目录、场景源代码和渲染配置。
- 首轮 `PRECHECK`：确认上游SHA、Git/Node/Chromium/FFmpeg/FFprobe可用、简体中文字体支持、1080×1920纵屏帧与本机权限、第三方MIT版权及依赖清单；有问题记录并自行解决可解决项，不用先询问已明确的制作目标。
- 原创动画可以引用并按MIT许可证复用上游工具和风格函数；将复制/修改代码保留 LICENSE 与版权，字体、配音和其他库单独登记其授权。
- **不要把 `third_party/`、`.tools/`、`node_modules/` 大批提交到 GitHub。** 提交原创项目代码与构建配置、必要的许可/证据；大型中间媒体避免无规划入库。

## 3. 立即制作（唯一主任务）：Issue #4

- [Issue #4｜原创15秒技术样片](https://github.com/Kui0s/changrenyan-video/issues/4) **READY_TO_EXECUTE**。不用先完成 Issue #5，也不用重新审核文字稿。
- 在上游真实 Sketchbook `kit.js` 与公共引擎基础上，新增**完全不同于官方 Demo 的** EP01 角色、连贯步态、相机、组织/细胞图示以及时间轴代码（例如 `episodes/EP01/src/`，实际路径按工程组织清晰决定）。
- 约15秒，9:16；**0–4秒**至少三步步态、重心/髋膝踝；**4–7秒**镜头跟随同一条腿进入内部；**7–13秒**葡萄糖血液→血管壁→组织间隙→肌细胞膜→肌细胞内；**13–15秒**保留科学路径与两道边界让观众看清。具体内部节拍可在保持样片目标的条件下优化。
- **不允许**仅换官方 Demo 文本/符号，静态图片轮播、伪造原创或拿线条 jitter 当实际运动；跨毛细血管壁与跨肌细胞膜**不是同一个转运结构**。
- 正式中文声音**不必现在制作**；可提交无声片并记录可调整 cue。最后实际配音在剪映或用户录音后才进入完整成片的音画审核。
- 不要为了三步动画暗示“仅走3步即可降低血糖”，这3步只为验证新增连续动画能力。
- **不要自动继续全片**。先产出可播放样片并按下面 QA 接受独立审核。

## 4. 并行技术任务（不阻塞主任务）

- [Issue #5](https://github.com/Kui0s/changrenyan-video/issues/5) 负责镜头03（淀粉消化与吸收入血）及06（8项短期试验的汇总对照）低成本连续动态预演与手机端可读性，**不再重复制作05**。
- Issue #5 可与Issue #4并行，但**完整影片批量制作前**必须核实03/06动态示意确实可读；已有导演稿90分不代表画面通过。

## 5. 本轮完成定义：交付并送独立审核

必须新建工作分支及 PR，附至少：`sample.mp4`、新增`src`和动画工程配置、上游复用/修改/新作差异说明、上游完整SHA、本项目commit、MP4 SHA-256、时间码/0.25–0.5秒联系表、360×640手机预览、构建命令、原始日志、媒体探针、锁定依赖与授权清单。不得只是贴几张关键帧声称完成。

**不允许 Codex 自评签发质量PASS。** [`QA_HANDOFF.md`](./episodes/EP01/QA_HANDOFF.md) 规定独立 GPT + 独立 Codex 的分工和固定90分阶段门槛；失败就记录时间码、具体代码与修复验收。**样片合格以后才请求用户决定是否进入完整视频**。不要发布、不自动合并主分支。

## 6. 给执行端的最后一条指令

**现在应开始 Issue #4 的实作，不必再产出一份“准备方案”等用户确认；能执行的命令和新增代码就直接执行。** 环境失败需留下确切错误与自救步骤，不能报告已有样片。工程结果通过 PR 与 Issue 供独立审查；**原来的上游 Demo PASS、导演文字 PASS 都不等于本次原创样片 PASS**。
