# AGENTS.md｜Codex 在《常人言》项目中的工作约束

1. 本项目源码为事实来源：先读取 `README.md`、`docs/WORKFLOW.md`、`docs/UPSTREAM_SOURCES.md`、`docs/STYLE_BASELINE.md`、`docs/MOTION_REQUIREMENTS.md`、当前集 `CODEX_TASK.md`。
2. 只能修改用户授权的项目工作区。不得读取、上传个人密钥或改动用户其他项目；不得在未经批准时推送、发布、覆盖他人工作或调整全局 Git/npm/系统/代理配置。
3. 对 `third_party/` 中实际获取的上游源码先做完整文件、依赖、许可证和 build 验证。记录远程 URL、commit SHA、复现命令与输出。不可只依据截图或 README 重画一种“相似风格”。
4. 标准美术组件应从真正可构建的原始风格 `STYLE.md + kit.js + demo + shared kit + renderer` 派生，保留上游 SHA 和变更记录。禁止在没有用户确认时私自更换手绘风格。
5. 程序生成的物体、角色动作、镜头运动、图示必须满足 `docs/MOTION_REQUIREMENTS.md`；不能用静态关键帧加 Ken Burns、文字淡入淡出代替主要叙事动作。
6. 科学含义、旁白和画面叙述以 EP01 研究与导演稿为准。发现错误先提交证据和改稿建议，不得擅自改变核心科学结论。
7. 先复现 Demo，再做风格相关技术试验，再做独立审核批准的15秒样片。未授权不能把“能生成关键帧”视为“已通过样片验收”。
8. 每次交付必须记录版本/hash、完整可重复命令、MP4、关键帧联系表、连续动作的短序列、已知失败与未验证点；对工程自评不得作为独立审核证据。
9. 不得误认第三方声音、字体、照片、Demo 内容都受主代码 MIT 许可覆盖。无合法来源的资源不要使用。
10. 遇到阻塞，记录 BLOCKED 的具体技术原因、复现命令和建议方案，不允许虚构通过结果。工程与审核均须满足 `docs/SCORE_RUBRIC.md` 的固定尺度。