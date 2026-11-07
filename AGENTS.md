# AGENTS.md｜Codex 工作规则（EP01 已获15秒原创样片执行授权）

> 每次打开仓库先读取 [`CODEX_START_HERE.md`](./CODEX_START_HERE.md)。**当前唯一主任务为 Issue #4 的原创15秒技术样片**，已过导演文字稿90分门禁；Issue #5 的03/06动态预演可以并行，不是启动样片的阻塞项。**禁止跳至完整成片制作、合并或发布**。

## 必须遵守

1. 按顺序阅读 `CODEX_START_HERE.md`、`docs/STYLE_BASELINE.md`、`docs/WORKFLOW.md`、`docs/UPSTREAM_SOURCES.md`、`docs/MOTION_REQUIREMENTS.md`、`docs/SCORE_RUBRIC.md`、`episodes/EP01/SCRIPT.md`、`DIRECTOR.md`、`ORIGINAL_SAMPLE_TASK.md`、`QA_HANDOFF.md`，必要时读 `RESEARCH.md`。
2. **事实和权限**：导演文本在 `reviews/ROUND_03.md` **90.0 PASS**；用户确认 Sketchbook 并允许按仓库任务制作原创15秒样片。不得要求再次确认已批准事项。正式成片/发布仍需独立审核与新的阶段授权。
3. 仅在用户授权的项目工作区操作；不能获取用户个人密钥、修改其他项目或重写全局Git/npm/网络配置。可为本次任务在本仓库创建独立工程分支、提交原创代码与产物、创建PR；**不得自动合并PR、修改审批制度或发布成片**。
4. 从 `https://github.com/cth9191/animate` 的 commit `7e5eb56feb2dd573f890e1b7b34748af43d58263` 真正克隆和读取完整 Sketchbook 风格、Demo、共享 kit 与渲染工具，确认LICENSE。当前 `scripts/reproduce-upstream-demos.ps1` 只是原版Demo复现脚本，不是本期内容代码；不以截图或提示词模仿风格。
5. 启动前在**当前执行机器**核对 Git、Node、npm、PowerShell、Chromium/Playwright、FFmpeg/FFprobe、简体中文字体、依赖及许可。历史 PR #3 的成功只证明上一运行环境，不能当当前机器已装好；对缺项自行解决或记录精确BLOCKED原因。
6. 在原有 `kit.js` 和公共引擎基础上**新增**动画场景、人物步态/关节/重心、镜头跟踪、组织间隙和肌细胞膜图示，保持真实代码与官方上游的可识别归属。禁止把原Demo换标题或把静态图片缩放拼接充当连续原创叙事。
7. 科学和口播严格以 `SCRIPT v1.5 / DIRECTOR v2.4 / RESEARCH` 为准。腿部三步只是动作测试，不得暗示临床“走三步便降糖”；镜头05须分辨毛细血管壁、组织间隙、肌细胞膜和不同转运机制；遇科学疑问先附证据再提变更，不擅改核心含义。
8. 15秒技术样片的正式中文配音**不是前置依赖**；可以无声或清楚标明的临时声音。剪映AI朗读/用户本人声音留到后期，完整视频必须<120秒，最终音画分按固定尺度验收。
9. 交付须附完整源代码、可复现构建/依赖锁、原版与新增diff、真实MP4及SHA256、0.25–0.5秒连续帧、360×640手机图、日志、FFprobe、第三方MIT及字体/媒体授权信息。不要因大文件问题只交本地路径；按 `QA_HANDOFF.md` 通过PR提供可访问的真实证据。
10. **工程执行者不能自评为最终PASS。** 交给独立GPT与独立Codex核验；适用评分≥90、单项≥3.5、无硬否决、证据完整后，才请求用户决定整期制作。不能伪造CI、第二台机器重建、自然配音或已完成阶段。问题记录时间码、失败命令、最小修复和复测。
