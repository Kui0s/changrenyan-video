# 常人言｜Sketchbook 代码动画短视频系列

> **EP01 当前状态：原创15秒技术样片 READY_TO_EXECUTE。** [ROUND 03 独立导演稿审核](./episodes/EP01/reviews/ROUND_03.md)对 `SCRIPT v1.5 / DIRECTOR v2.4` 给出正式 **90.0/100 PASS**；用户已确认唯一Sketchbook画风，并要求完成工程准备后可直接让Codex按仓库任务开工。**这仅允许开始原创15秒样片与并行03/06预演；未批准整部正片制作或发布。**
>
> **Codex 请直接从 [CODEX_START_HERE.md](./CODEX_START_HERE.md) 开始执行，不必重新询问导演稿是否通过、画风是哪种或声音在哪里。** 严格区分“仓库资源/任务就绪”和“当前执行机器依赖已经安装”：后者必须在 Codex 开始时实际检查。

## 目标与事实

EP01：《饭后走一走，活到九十九》，以科学证据解释俗语健康长寿的寓意，不宣称散步能保证某个寿命。目标9:16、Sketchbook原生代码手绘、**完整视频严格少于120秒**；中文声音在后期使用剪映AI朗读或用户本人录制，自然速度即可。

**拒绝幻灯片动画**：角色、镜头、场景、组织结构及葡萄糖符号需要真实随时间演化；连贯肢体运动和有意义的转场优先，允许为读图有目的地稳定画面，但不能靠静态帧轮播、图片全局放大或笔触抖动伪装成叙事。

## 已确认和未完成

| 事项 | 状态与证据 |
|---|---|
| 固定审核制度 | [`docs/SCORE_RUBRIC.md v1.0`](./docs/SCORE_RUBRIC.md)，90分、单项≥3.5、无硬否决；**完全不变** |
| 研究、口播、导演稿 | [`SCRIPT v1.5`](./episodes/EP01/SCRIPT.md)、[`DIRECTOR v2.4`](./episodes/EP01/DIRECTOR.md)，独立 [ROUND 03 **90.0 PASS**](./episodes/EP01/reviews/ROUND_03.md) |
| 唯一风格 | [Sketchbook，已获用户确认](./docs/STYLE_BASELINE.md)；上游 `cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263` |
| 上游官方Demo | [PR #3](https://github.com/Kui0s/changrenyan-video/pull/3) **源码重建PASS**，但该PR处于Draft，动画不是《常人言》原创；其复现脚本已复制进本仓库 `scripts/` |
| 原创15秒样片 | **READY_TO_EXECUTE / NOT PRODUCED**，[Issue #4](https://github.com/Kui0s/changrenyan-video/issues/4)，下一工程主任务 |
| 镜头03、06预演 | [Issue #5](https://github.com/Kui0s/changrenyan-video/issues/5)，与样片并行，不是导演文字审核前置条件 |
| 原创代码可重建性/第三方许可 | **待Codex本轮提交实物、锁定依赖并接受独立代码审查**；[Issue #6](https://github.com/Kui0s/changrenyan-video/issues/6) 已预设样片独立双审流程 |
| 成片、真实中文配音、完整质量审核 | **NOT PRODUCED**；需样片通过90分、用户另外同意全片后才执行 |

## 执行入口与重要文档

| 位置 | 用途 |
|---|---|
| [`CODEX_START_HERE.md`](./CODEX_START_HERE.md) | **唯一当前执行入口**：资源地址、克隆指令、依赖检查、阶段授权及工程顺序 |
| [`AGENTS.md`](./AGENTS.md) | Codex安全边界、交付纪律和事实来源 |
| [`episodes/EP01/ORIGINAL_SAMPLE_TASK.md`](./episodes/EP01/ORIGINAL_SAMPLE_TASK.md) | 15秒原创动画的具体动态动作/镜头与源代码要求 |
| [`episodes/EP01/SAMPLE_15S.md`](./episodes/EP01/SAMPLE_15S.md) | 分秒画面验收 |
| [`episodes/EP01/QA_HANDOFF.md`](./episodes/EP01/QA_HANDOFF.md) | MP4/源码/差异/日志的交付、独立 GPT+Codex 评分、下一阶段门禁 |
| [`episodes/EP01/ANIMATIC_VALIDATION_TASK.md`](./episodes/EP01/ANIMATIC_VALIDATION_TASK.md) | 并行03/06镜头动态预演，不重复05样片 |
| [`docs/STYLE_BASELINE.md`](./docs/STYLE_BASELINE.md) | Sketchbook真实源码风格与固定版本 |
| [`docs/UPSTREAM_SOURCES.md`](./docs/UPSTREAM_SOURCES.md) | 主上游和其他可选技术参考，以及许可证风险 |
| [`docs/MOTION_REQUIREMENTS.md`](./docs/MOTION_REQUIREMENTS.md) | 防静态幻灯片与连续运动验收 |
| [`docs/VOICE_AND_DURATION_POLICY.md`](./docs/VOICE_AND_DURATION_POLICY.md) | 后期配音与总时长<120秒，导演文本阶段无需终配音 |
| [`docs/WORKFLOW.md`](./docs/WORKFLOW.md) | 协作、独立审核、返工、版本流程 |

历史审稿按 `episodes/EP01/reviews/` 分轮归档：ROUND 01 79.3（诊断/NO_GO）、ROUND 02 86.0（诊断/NO_GO）、[ROUND 03 90.0（正式导演文字阶段PASS）](./episodes/EP01/reviews/ROUND_03.md)。不得覆盖历史评审、把导演文字90分直接迁移为真实视频90分。

## 角色及工程门禁

ChatGPT负责研究/口播/导演内容；Codex负责实际克隆源码、编写新的 EP01 人物/动态/科学镜头、渲染和提交工程证据。**原创样片完成后由[Issue #6](https://github.com/Kui0s/changrenyan-video/issues/6)安排独立 GPT 看视频、未参与编写的独立 Codex 审源码与可复现性**。按固定评分适用维度加权≥90、适用单项≥3.5且无否决/缺证据，才能建议用户决定进入完整正片。

**用户不需要重新提供上游URL、声线、画风或脚本；工程端直接按入口执行。** 若本机依赖缺失，Codex自己排查并记录，不可宣称远程文档已证明本机就绪。未经样片评审和用户决定，不自动合并主分支、不直接制作/发布全片。
