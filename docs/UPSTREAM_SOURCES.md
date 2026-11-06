# GitHub 上游源代码登记与复现计划

所有项目先真实 clone，再读风格文件、Demo、渲染工具与依赖，记录 SHA；不可仅从 README 的图片或截图反推实现。许可证以具体版本的实际 LICENSE 与素材清单为准。

| 角色 | 仓库 | 必须关注 |
|---|---|---|
| 主要风格与动画工作流 | https://github.com/cth9191/animate | `plugins/animate/skills/animate/styles/sketchbook/`, `crosshatch/`, `kit/`, `tools/`, `SKILL.md`, `craft.md` |
| 候选导演技法和多样风格 | https://github.com/lemomo-ai/lemo-opuscar | `DIRECTOR.md`, `TECHNIQUE.md`, `styles/`, `core/`，仅按技术需求克隆使用 |
| 动态MG动作与镜头范例 | https://github.com/Vincentwei1021/mg-styles-15 | `demos/`, `harness/render.mjs`, `prompts/`, `lib/`；需要时克隆 |
| 作品与提示词索引 | https://github.com/yihui-dev/awesome-opus5-5-videos | 辅助参考，不能误认为全部案例均有源码 |

首轮强制任务：克隆 `animate`，读取 sketchbook / crosshatch 的 `STYLE.md` 与 `kit.js`、完整 Demo 文件、公共动画与渲染工具，分别复现 Demo 并提交真实 MP4；**官方样片视频不等于本地复现成功**。

`animate` 主要面向 Claude Code，但它的绘图与渲染代码可由 Codex 在符合依赖条件时尝试执行；不要直接将 Claude 插件命令当成 Codex 插件。

如果另外两个仓库具备需要的镜头/运镜技法，必须单独追溯源文件、API及许可。不要先把全部第三方源码复制进主项目。

开源权限：`animate` 主仓库 MIT；`lemo-opuscar` 代码 MIT 而演示影片/静帧另有 CC BY 4.0 与第三方授权例外；`mg-styles-15` 代码/示例的主授权 MIT，部分字体和三方素材单独授权。**实际使用前由 Codex 审核具体资源。**