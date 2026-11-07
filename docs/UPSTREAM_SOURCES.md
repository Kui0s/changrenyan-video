# GitHub 上游源代码登记与复现计划

所有项目先真实 clone，再读风格文件、Demo、渲染工具与依赖，记录 SHA；不可仅从 README 的图片或截图反推实现。许可证以具体版本的实际 LICENSE 与素材清单为准。

| 角色 | 仓库 | 必须关注 |
|---|---|---|
| 主要风格与动画工作流 | https://github.com/cth9191/animate | `plugins/animate/skills/animate/styles/sketchbook/`, `crosshatch/`, `kit/`, `tools/`, `SKILL.md`, `craft.md` |
| 候选导演技法和多样风格 | https://github.com/lemomo-ai/lemo-opuscar | `DIRECTOR.md`, `TECHNIQUE.md`, `styles/`, `core/`，仅按技术需求克隆使用 |
| 动态MG动作与镜头范例 | https://github.com/Vincentwei1021/mg-styles-15 | `demos/`, `harness/render.mjs`, `prompts/`, `lib/`；需要时克隆 |
| 作品与提示词索引 | https://github.com/yihui-dev/awesome-opus5-5-videos | 辅助参考，不能误认为全部案例均有源码 |

**阶段0已完成**：Codex 在[PR #3](https://github.com/Kui0s/changrenyan-video/pull/3)中真实克隆、固定上游SHA并复现Sketchbook/Crosshatch官方Demo，证据包含MP4、日志和哈希；这只是**上游复现PASS，不是EP01原创样片**。复现脚本已复制到主分支 `scripts/reproduce-upstream-demos.ps1`。**本阶段已选定唯一Sketchbook风格，不需要重新复现Crosshatch来获得开工资格。**

`animate` 主要面向 Claude Code，但它的绘图与渲染代码可由 Codex 在符合依赖条件时尝试执行；不要直接将 Claude 插件命令当成 Codex 插件。

如果另外两个仓库具备需要的镜头/运镜技法，必须单独追溯源文件、API及许可。不要先把全部第三方源码复制进主项目。

开源权限：`animate` 主仓库 MIT；`lemo-opuscar` 代码 MIT 而演示影片/静帧另有 CC BY 4.0 与第三方授权例外；`mg-styles-15` 代码/示例的主授权 MIT，部分字体和三方素材单独授权。**实际使用前由 Codex 审核具体资源。**
## 当前制作使用顺序

1. Codex直接按仓库根 [`CODEX_START_HERE.md`](../CODEX_START_HERE.md) 在当前机器执行依赖自检，克隆固定 `cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`。本机预装状态**不可通过旧PR推定**。
2. 仅基于其 **Sketchbook** 组件编写本期新增场景。需要特定技术时才决定是否阅读/克隆其他辅助仓库，遵守其许可证；不允许混用风格或复制官方示例画面当原创。
3. 交付独立样片PR、源码和证据，按 [`QA_HANDOFF.md`](../episodes/EP01/QA_HANDOFF.md) 独立审核≥90；过审后仍须用户另外批准完整成片。
