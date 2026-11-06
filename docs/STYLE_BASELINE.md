# 系列风格基线（待确认）

## 约束

画风必须**唯一而统一**；每期镜头、分镜、动作、转场自由设计。优先使用真实 GitHub 风格源代码、Demo、绘图库与渲染工具，不拿截图当作重画依据。

目前可先复现：
- `cth9191/animate` 的 `styles/sketchbook/`
- `cth9191/animate` 的 `styles/crosshatch/`

**尚未经过用户观看真实源码生成视频之后确认最终风格。** 不得写“sketchbook 已定稿”。当前只是候选技术路线。

## 冻结基线应记录（实际复现后填写）

- selected_style: `PENDING_USER_CHOICE`
- upstream_repo: `https://github.com/cth9191/animate`
- upstream_commit: `NOT_VERIFIED`
- source paths: `plugins/animate/skills/animate/styles/<chosen>/STYLE.md`, `kit.js`, `demo/`, `kit/`, `tools/`
- verified_demo_render: `NOT_VERIFIED`
- source_license: `MIT`（需复核依赖与素材）
- baseline_commit: `NOT_CREATED`
- measured attributes: 线条/纹理/配色/背景/人物比例/手写字体/12fps或其他作画节奏/摄影运动；由原源码与实片提取，不凭截图填数值。
- acceptance: 用户确认后冻结，不为每期内容自行更换视觉体系。

版本升级方式：提PR/比较同一标准测试场景前后效果，跨镜头回归通过后用户确认。其他项目的镜头算法可以择需借鉴，但不能将其不同画风一并混入最终系列。