# 动画技术能力验证任务 V1｜Codex领取版（不是EP01整片返工）

> **目的：** 通过对上游真实源码的跟踪复用与实物证明，确认“可以把成熟动画方法转移到《常人言》”。完成这个任务不是宣称已精通动画，也不是批准直接发布后续视频。
>
> **本任务独立于旧111秒失败成片**；不修改/回滚视频所在`codex/ep01-full-film`；不覆盖用户对它的拒收记录。输出保存在独立实验分支和`artifacts/animation-method-lab/`，不能将旧Demo官方画面称作本期原创。

## 一、开发输入必须真实读取

- 固定上游`cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`。
- [sketchbook STYLE](https://github.com/cth9191/animate/blob/7e5eb56feb2dd573f890e1b7b34748af43d58263/plugins/animate/skills/animate/styles/sketchbook/STYLE.md)、[原demo scenes](https://github.com/cth9191/animate/blob/7e5eb56feb2dd573f890e1b7b34748af43d58263/plugins/animate/skills/animate/styles/sketchbook/demo/src/scenes.js)、[原demo bridges](https://github.com/cth9191/animate/blob/7e5eb56feb2dd573f890e1b7b34748af43d58263/plugins/animate/skills/animate/styles/sketchbook/demo/src/bridges.js)、[morph.js](https://github.com/cth9191/animate/blob/7e5eb56feb2dd573f890e1b7b34748af43d58263/plugins/animate/skills/animate/kit/morph.js)、[craft.md](https://github.com/cth9191/animate/blob/7e5eb56feb2dd573f890e1b7b34748af43d58263/plugins/animate/skills/animate/craft.md)和`kit/core.js`。
- 本项目原Demo已经复现于`codex/ep01-upstream-reproduction`，只用它验证构建环境与原始质量；新实验必须有可核验的原创修改与演示。
- 失败111秒视频的制作代码：`codex/ep01-full-film`分支中的`episodes/EP01/full-film/src/scenes.js`、`film-model.js`、`timeline.js`；确认旧失败镜头41–78s使用`drawAnchoredLayer`/alpha图层而非可读空间放大。
- 科学资料及镜头目标参考`episodes/EP01/rewrite_v2/EVIDENCE_AND_BOUNDARIES.md`；不可在技术验证中引入假的医学过程。

## 二、A形变、B空间与机制、C普通话：三个互不替代的能力验证

### A｜原始Morph能力迁移（针对画面之间的语义形变）

- 使用同一Sketchbook kit和上游`kit/morph.js`，做约4–6秒、9:16、原风格的**一个自有科学符号变化**（建议淀粉链示意→葡萄糖符号→下一场景）。人物可以不用出现，避免把“能画成人”混入morph验证。
- 必须真的使用`BRIDGES`里两对象的轮廓、`STYLE.window`和`STYLE.blob`，采用“场景收拢到对象→对象几何插值→下一场景展开”而非两段PNG切换/全图alpha混合。
- **视觉验证：** 无字幕静音观看，观察者应能指认“哪一物体从场景A变成场景B，以及两场之间的联系”。必须给出边界前、过渡中心、边界后各时点连续帧。
- **科学限定：** 符号轮廓morph只代表解释性示意，不能让观众误认为消化就是整个淀粉对象瞬间变形、没有过程；真实消化链另以逐步断开的可见动作解释。

### B｜真实人体的镜头空间与生理机制：分开验收，按实际可读时长

**B-space（空间验证）**：先制作一个可理解的9:16连续镜头，约6–10秒仅作为**初始预算**，必要时延长。用可信的正常成年人整体或半身 → 一个明确可指认的身体局部 → 一个可信且位于该部位的组织剖面 → **沿同一空间关系返回同一个人**。这一步不要求同时解释葡萄糖经过所有生理边界，也不能把单独相机成功说成整个医学镜头成功。

**B-mechanism（科学机制验证）**：在已通过空间定位的连续镜头内部或另一个紧接的、相同部位的示意段落中，展示**血管壁→组织间隙→肌细胞膜**两个不同屏障及其相对位置、必要的新结构和变化。允许根据真正需要的阅读时间**单独延长**，不能硬塞进B-space的6–10秒；必须标明“生理原理与时间尺度示意”，并由具有相关知识的审核者核对医学准确性。

**技术底座与画面标准：**
- 不得直接复用官方`doodleHero`冒充正常成年人；人物应有可信的头颈肩、胸腰骨盆、四肢和真实站立/步行连接。可以使用有权利证明的角色/解剖素材，不为“全部代码绘制”降低美术质量。
- 在世界坐标里绑定人物→部位→组织→细胞的父子关系，镜头倍率提升时逐层出现**该处真正新增的结构**；建议参考`cth9191/animate`的`camOf/push`与`lemo-opuscar/styles/microscope/demo/film.js`的`camAt/activeLevel`，但其静态组织玻片素材不得伪作活体人体。
- B-space失败：人物保持原大小，前面叠大红椭圆/黑框/透明板；推进与退出无法指认同一部位；人像杆件。B-mechanism失败：用同一圆框表示血管壁与细胞膜、出现没有解剖关系的分子点、医学顺序错误。
- 实际视频必须提供24fps每帧索引、过渡起止和中间的连续可播放片段、相机目标/LOD层级清单。**算法锚点连续不代表人眼可辨连续。**
- **审核分开记**：`B_SPACE`要求新上下文视觉审核者一次看出“从哪位人物的哪一处进、经过哪个内层、怎样退回”；`B_MECHANISM`要求能区分血管壁/细胞外间隙/细胞膜与机理，而不读制作解释。两者分别`PASS/REVISE/NOT VERIFIED`；任一失败则B整体不得标为“已经掌握人体镜头”。
- 6–10秒不够就增加镜头停留，不设置人为最长时限来换取名义PASS；这不是重新引入独立15秒剧情样片门禁。

### C｜普通话临时验证与当前Canvas字幕接入：G5a/G5b分明

- 使用2–3句**合法临时普通话测试音轨**验证技术链，不要求用户提前决定剪映AI还是自己配音，也不能将试验C的音频冒充最终正式配音。原版`voice_words.py`默认`small.en`/`language='en'`，`voice.mjs`的英文`norm()`会丢失中文，`review.mjs`空格数词速无效；必须修正或隔离。
- 制作分句文本与实际声音，记录`cue_id, text, start_s, end_s, highlighted_event_t, speaker, source/rights`。中文ASR（如`--lang zh`）只是候选，应对照音频人工核验关键时间点和数字，不声称词级精度已自动证明。
- **必须在当前Canvas动画中实现检查适配层**：暴露`window.DUR`及`window.TEXTS(t)`，后者要返回每条实际显示文字的`id, text, x0, y0, x1, y1`，并与渲染时刻的可见状态、真实手机视口、字幕出现/消失时间一致。推荐直接在Canvas`fillText/strokeText`调用层记录或从唯一字幕数据模型生成；不可写一份与实际画面无关的假的TEXTS对象。
- 通过实例：3句字幕按真实普通话逐句出现，提供360px手机预览、音画对齐表，运行`lemo-opuscar/core/render/readcheck.mjs`的**阅读时长与视口检查**、另运行**文字重叠检查**，并人工实际读图；工具输出与视频文本位置一致。
- **故意制造负例并必须被抓住**：至少一次将两条字幕叠在同一位置（须由**额外几何重叠检查**或`textcheck.mjs`等相应工具报告OVERLAP→FAIL；**`readcheck.mjs`本身不检测重叠**）；一次让中文句子短暂闪现不足正常阅读时间（`readcheck.mjs`应返回BAD/exit 1）；一次让字幕越出视口（`readcheck.mjs`应报告never fully visible/exit 1）；一次去掉`window.TEXTS`或将`window.DUR`设为无效（`readcheck.mjs`应输出`NOT CHECKED`且exit 2，不能计为PASS）。还需证明关键中文词不会在英文正则中被清空；日志给出真实exit/status、失败原因与对应帧。
- 实验C的通过只说明普通话临时音画管线能够工作，**不证明最终剪映声音已锁定**；正式成片按用户的`docs/VOICE_AND_DURATION_POLICY.md`在后期合成实际声音，并重新核对时间轴/字幕/时长后才评A维。

## 三、制作步骤与权限

1. 先以只读方式复跑**原Sketchbook Demo**并记录与已有复现结果是否一致；不准以原版官方片充当原创新结果。
2. 读取并追踪每个用到的上游函数，写出`SOURCE_MAP.md`：`源文件/函数→新文件/函数→为什么复用→哪些部分不能复用`，标明MIT许可证及新素材授权。
3. 在独立实验分支实现A、B及中文音轨验证C，各自导出真实可观看MP4和关键帧（B-space与B-mechanism分开留证，C包含合法临时中文音频及真实Canvas字幕）；在实验期间使用原`tile/still/review`执行技术检查，出报告，但绝不能将其形式化PASS自动转换为审美PASS。
4. 按原官方`SKILL.md`的“2–4张真实look frames＋完整转场board”方法，在**动画量大之前**审美确认人物与转场静态层级；这是实验内部质量核对，不制造新的11分钟流程。
5. 交付`artifacts/animation-method-lab/A.mp4`、`B.mp4`、`C-zh-voice.mp4`、`SOURCE_MAP.md`、`VISUAL_FAILURES_AND_LIMITS.md`、FFmpeg/渲染日志与实物哈希。若B不合格，明确`NOT READY`，**不得强行推进EP01第二次整片制作**。
6. 正式评价必须由与制作不同上下文的独立GPT/视觉审核者直接观看A、B-space、B-mechanism、C全部实际媒体，再由独立工程Codex检查第三方源码使用与可复现性。评分制度不能因为是实验就虚造已通过主片90分。
7. 用户明确确认下一轮视频制作方向以前，**本实验不能自动启动旧片重制或发布**。

## 四、验收输出应回答的三个问题

1. **原项目哪几段代码确实被迁移了？** 对应commit与源码diff、可复现渲染命令证明，而不是空泛“我学习了原项目”。
2. **人眼真的能看懂吗？** 先盲看视频，写下初看理解、信息丢失与具体时间段，不准先阅读制作者的说明书。
3. **哪些能力已经证明、哪些仍不具备？** 形变叙事（A）、尺度空间穿越（B）、普通话音画同步（C）、可信成人角色、医学准确性、镜头审美分别独立标记；不要以A的成功推出B或整片成功。

**目标是形成将来各期可重复使用的可验证方法，不是为了再做几份漂亮文档。**

## 五、研究成果文件（先理解整条生产线，不只摸两个函数）

1. `PRODUCTION_METHOD_V1.md`：G0–G8九道完整成片质量门与返工规则。
2. `SOURCE_ARCHITECTURE_AND_LIMITS_V1.md`：实际代码模块与构建/审核/配音漏洞。
3. `SCIENCE_VISUALS_TRANSFER_V1.md`：解剖层级、形状morph与人体深入镜头之间的边界、可选2.5D/3D技术。
4. `INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md`：独立盲看、逐镜与源码双审，不改原90分制度。

**顺序：** 研究上游完整流程与这些目标→证明A/B/C可产生真实效果→经独立视觉/工程审核+用户确认→才将能力归档为可复用生产模块。**这不是授权Codex重做EP01。**

## 六、已找到的B/C具体候选代码（需要实际迁移验证）

- **B｜连续倍率相机**：研究 `lemomo-ai/lemo-opuscar/styles/microscope/demo/film.js` 的 `camAt`（对数螺旋/相似变换）与 `activeLevel`/`plateAlpha`（同一玻片样本的已配准图像金字塔与逐倍率换层）。目标是借鉴**同一世界坐标内的连贯焦点和按尺度新增细节**；必须新建科学生理可信的活体人体/器官/组织层级，不能拿静态肝切片假装运动人体内实时发生的情况。
- **C｜中文原生流程**：研究 `lemomo-ai/lemo-opuscar/core/tts/tts_zh.py` 句级普通话语音、`core/tts/asr_check.py --lang zh` 多语Whisper字符/数值检查，以及 `core/render/readcheck.mjs` 的中文阅读时间检查。实际测试普通话音轨、字幕断句、时间码与手机可读性；在线TTS使用之前核对微软相关服务与授权条款，也允许用户录音与合规离线方案。
- 具体证据与局限见 `ADJACENT_IMPLEMENTATIONS_V1.md`。在新实验中这些**只是有源代码的候选实现，不是已经迁移成功的模块**。
