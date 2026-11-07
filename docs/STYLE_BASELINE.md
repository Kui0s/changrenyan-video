# 《常人言》系列视觉风格基线｜Sketchbook 正式选定

> **用户决定（2026-11-06）：固定采用 Sketchbook。** 这是系列**风格路线已经确认**，不是声称原创动画的工程基线已验收。镜头、动作、转场、叙事结构仍允许随每期内容变化。

## 冻结的风格来源与身份

- `selected_style: sketchbook`（**USER_APPROVED**）
- 上游仓库：`https://github.com/cth9191/animate`
- 上游固定 commit：`7e5eb56feb2dd573f890e1b7b34748af43d58263`
- 风格规范：`plugins/animate/skills/animate/styles/sketchbook/STYLE.md`
- 风格绘图代码：`plugins/animate/skills/animate/styles/sketchbook/kit.js`
- 官方示例及源码：`plugins/animate/skills/animate/styles/sketchbook/demo/`
- 共用引擎和工具：`plugins/animate/skills/animate/kit/`、`plugins/animate/skills/animate/tools/`（以真实依赖为准）
- 上游源码许可：MIT；正式改编、再分发须保留其版权和 LICENSE，另行登记第三方依赖和媒体权利
- 官方 Demo 复现提交：`095ec71eda99940cae1ac008610065d32a84ec4f`（`codex/ep01-upstream-reproduction`，Draft PR #3）
- `upstream_demo_reproduction: PASS`（已有来源审计证据）
- `original_episode_animation: NOT_VERIFIED`
- `series_derived_engine_baseline_commit: NOT_CREATED`
- `clean_environment_rebuild: NOT_VERIFIED`

## 固定的风格特征

这些特征来自上游真实 Sketchbook `STYLE.md`，要求 Codex 优先通过上游源码函数实现，而不是拿截图重新描绘：

1. **介质**：温暖的速写本纸张、石墨与墨线、少量橘陶土色重点、微弱纸张纹理；构图保留纸面呼吸感。
2. **线条**：`gpencil` / `gline` 等真实笔触 API；不规则双描、铅笔写入、墨线定形、涂鸦填色、刻线排阴影。
3. **帧风格**：原版每两帧变化的笔触 boil，保持手绘生命感，但不得把线条抖动当作人物动作。
4. **文字**：手写视觉语言，适应简体中文的字体需真实测量并确认许可及手机可读性；不能因本机缺字造成回退失真。
5. **人物**：同一片中保持统一的造型、比例、线条与强调色；在真实 kit 基础上新增人物步态和人体示意，不拿上游灯泡变太阳的示例分镜来替换文本。
6. **摄影**：保留“纸面是世界”的视觉连续性，但具体镜头调度、形变、节奏、场景转接**不固化为模板**。
7. **机制图解**：人体内部属于同一手绘视觉体系，禁止突然切换成另一套高光3D或平面UI图标画风。允许为了阅读性简化纹理。

## 不再采用的备选方案

`crosshatch` 仍作为已复现的**历史技术参考**保存在 PR #3；不得与 Sketchbook 画风混用并宣称仍是同一系列视觉风格。今后若需要更换系列画风，必须先提出专门变更并取得用户批准。

## 尚需 Codex 完成的工程工作

- 在独立原创样片工程中，使用固定上游版本的 Sketchbook `kit.js`、共用引擎和可复现工具链。
- 原样保留上游副本，新增 EP01 人物、步态、镜头及微观机制场景代码，清楚登记继承/修改/原创的代码边界。
- 输出约15秒原创动画、连续帧、源码 diff、运行命令、哈希、完整许可证记录。
- 源码和视觉**正式工程基线**只有在原创样片独立审核合格、用户验收后，才能记录为稳定的 `series_derived_engine_baseline_commit`；不能仅凭官方 Demo 的成功来冻结改造后的代码。
- 独立导演稿审核仍未通过（`NOT_VERIFIED`），不得把风格确认理解成导演或样片自动放行。

后续参见 `episodes/EP01/ORIGINAL_SAMPLE_TASK.md` 与 [Issue #4](https://github.com/Kui0s/changrenyan-video/issues/4)。
