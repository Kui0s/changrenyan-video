# 常人言｜代码动画短视频系列

> 项目状态：**Sketchbook 风格已确认，上游官方 Demo 复现通过；ROUND 01/02 导演审核均未获正式PASS（ROUND 02文字诊断86.0），待继续整改/独立复评。用户已决定配音留到后期、成片≤120秒。原创15秒样片和全片均尚未制作。**
>
> 当前基线：`SCORE_RUBRIC v1.0`（固定计分标准），`AUDIT_CHECKLIST v1.0`（可逐轮细化的检查项）。

## 目标

以**不超过120秒**、9:16 的中文代码动画，解释一句熟悉俗语背后的可证实机制与适用边界。第一期为《饭后走一走，活到九十九》。“九十九”代表健康长寿，不是精准寿命承诺。

**固定美术风格、开放镜头语言。** 动画采用从 GitHub 完整开源源码实际复现并扩展的绘图系统；不以截图临摹替代真实源代码。人物、场景、相机、转场和科学图示均可程序化生成，不预设用户提供 PNG/SVG 素材。

**真实动画，不是图片轮播。** 每个主要段落都有叙事所需的连续动作、可见状态变化及因果衔接；禁止用几张静帧加缩放/淡入淡出冒充完整导演和动画制作。参见 `docs/MOTION_REQUIREMENTS.md`。

## 职责与门禁

| 身份 | 职责 |
|---|---|
| 用户 | 最终决定系列风格、关键审美取舍、阶段放行与发布 |
| ChatGPT（创作端） | 研究、口播、导演稿、文字分镜、解释准确性；维护内容包 |
| 独立 GPT 审核端 | 不参与原稿写作，审核内容/观众理解/视频叙事，提供问题证据 |
| Codex（工程端） | 克隆原仓库、复现 Demo、封装绘图、镜头和动画代码、渲染；提交产物和测试证据 |
| 独立 Codex 审核端 | 不直接参与被评审工程修改，审源码、动态性、渲染可重建性和工程风险 |

阶段：**内容研究与导演稿 → 独立导演审核 → 原仓库复现及15秒样片 → 双独立审核 → 全片制作 → 成片双独立审核（至少90分）→ 用户确认、经验入库**。

在导演稿尚未通过前，Codex 可以开展 `git clone`、依赖审计及原 Demo 复现，但不应将正式样片或成片宣称获准制作。

## 文件导航

- `docs/WORKFLOW.md`：交接、审核、返工、阻塞与权限。
- `docs/VOICE_AND_DURATION_POLICY.md`：2026-11-06用户确认的配音延期至剪辑、正式成片≤120秒的阶段规则。
- `docs/SCORE_RUBRIC.md`：固定的100分评分维度、权重、门槛与硬性否决。
- `docs/AUDIT_CHECKLIST.md`：会随实物缺陷增加的检查项；不得改变评分尺度。
- `docs/MOTION_REQUIREMENTS.md`：避免“幻灯片视频”的工程约束及可执行测试。
- `docs/STYLE_BASELINE.md`：用户已批准 Sketchbook 唯一系列画风；原创派生工程基线仍待样片验证。
- `docs/UPSTREAM_SOURCES.md`：GitHub 源码来源、路径、可复现要求及许可证。
- `episodes/EP01/RESEARCH.md`：科学证据与禁用论点。
- `episodes/EP01/SCRIPT.md`：口播文案。
- `episodes/EP01/DIRECTOR.md`：完整逐镜头导演稿与动作编排。
- `episodes/EP01/SAMPLE_15S.md`：15秒样片要求。
- `episodes/EP01/ORIGINAL_SAMPLE_TASK.md`：区别于上游官方 Demo 复现的原创动画能力验证任务。
- `episodes/EP01/CODEX_TASK.md`：交给 Codex 的可执行工程任务。
- `episodes/EP01/reviews/ROUND_00.md`：早期初始状态卡（历史存档）。
- `episodes/EP01/reviews/UPSTREAM_PROVENANCE_AUDIT.md`：上游复现与原创能力来源审计。
- `episodes/EP01/reviews/CREATOR_PRE_REVIEW_R01.md`：内容端初期修订记录；**不是独立审核通过**。
- `episodes/EP01/reviews/ROUND_01.md`：首轮独立导演审核，**REVISE/NO_GO**（历史诊断79.3）。
- `episodes/EP01/reviews/ROUND_02.md`：二轮独立导演审核，**REVISE/NO_GO**（历史诊断86.0）；历史证据要求不追溯改写。
- `episodes/EP01/reviews/CREATOR_REVISION_R02.md`：针对ROUND 01的逐项整改记录；**不是独立审核**。
- `episodes/EP01/VOICE_TIMING_PROBE_R02.md`：历史低保真eSpeak测时；**只作为参考，不再阻塞导演文字审核；后期成片再验正式声音**。
- `AGENTS.md`：Codex 工作权限与禁止事项。

## 当前事实状态

- [x] 研究来源初步核查并整理（仍需独立内容审核）
- [x] EP01 已有新一轮创作端修订稿（以主分支 `episodes/EP01/SCRIPT.md` / `DIRECTOR.md` 最新版本为准）；ROUND 02历史结论仍是 **REVISE/NO_GO**，最新内容须单独进行 ROUND 03 独立审核
- [x] 固定评分尺度与动态性审核规则
- [x] 创建独立 GitHub 远程仓库并上传首批项目文件
- [ ] 独立导演审核正式≥90分放行（[ROUND 01 NO_GO](https://github.com/Kui0s/changrenyan-video/blob/main/episodes/EP01/reviews/ROUND_01.md)，[Issue #1](https://github.com/Kui0s/changrenyan-video/issues/1) 已明确固定90分关口）
- [x] Codex 在工程分支重建上游官方 Demo（[PR #3](https://github.com/Kui0s/changrenyan-video/pull/3)，来源审计 PASS；不是原创样片）
- [x] 用户确认 Sketchbook 为唯一系列手绘画风（源码上游 commit 已记录；**原创派生工程基线尚待验证**）
- [ ] [#4](https://github.com/Kui0s/changrenyan-video/issues/4) 15秒**原创**代码动画样片（非上游 Demo）
- [ ] 样片90分审核及用户放行
- [ ] ≤120秒成片（配音可用剪映AI或本人）、90分完整音画审核、发布批准