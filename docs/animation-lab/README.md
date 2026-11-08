# 动画制作方法研究室｜研究导航与真实进度（2026-11-08）

## 最新状态：R01五项定向整改已提交，待独立R02复审

- 研究审核R01在主分支`docs/animation-lab/reviews/METHOD_TRANSFER_AUDIT_R01.md`：**源码研究VERIFIED WITH LIMITS，流程REVISE，A/B/C实物NOT VERIFIED**。研究主分支没有变成已批准的生产标准。
- 本研究分支已经将五项意见落实到`PRODUCTION_METHOD_V1.md`、`METHOD_PROOF_TASK.md`、`INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md`、`SCIENCE_VISUALS_TRANSFER_V1.md`。
- **[R01创作端逐项整改记录](reviews/METHOD_TRANSFER_R01_RESPONSE.md)**：每项对应修改位置、待复审证据和readcheck能力的纠偏；**只是作者答复，不是独立R02结论**。
- A形状变形、B-space人体空间、B-mechanism医学机制、C临时普通话及Canvas字幕，**尚无实际新视频**；不能把文字修订说成能力通过。
- 用户保留正式中文配音在剪映或自行录制后期加入的权利；正式成片才必须有完整可听中文声轨。

## 研究目标

让《常人言》从当前“文本导演评分高、工程测试通过、真实视频极差”变为可重复制作达到用户认可观感的原创动画。对照研究`cth9191/animate`的**整个成片工作流**，不再以绘图函数或官方Demo复现成功冒充原创制作能力。

## 当前真正完成的事

- 复核固定上游`cth9191/animate@7e5eb56`及当前main一致；追踪`SKILL.md/craft.md/intake.md/new-style.md/grammar/*/styles/README.md`与6s Sketchbook Demo、60s Cut-paper成熟案例。
- 阅读并定位`kit/morph.js/core.js/board.js`、`build.mjs/tile.mjs/still.mjs/storyboard.mjs/review.mjs/textcheck.mjs/export.mjs/voice.mjs/voice_words.py`的输入输出、关键函数与部分质量检测盲区。
- 与被用户拒收的`codex/ep01-full-film`源码、完整2664帧分析报告对照，区分哪些上游方法没有迁移、哪些新能力根本不存在。
- 形成可执行G0–G8成片生产流程、具体门禁、人体科学放缩策略、独立视频审核协议，并发现**原上游英语配音校准无法原样用于中文**和`story arc PASS (0/0 rules)`空规则假PASS。
- 所有研究文档均为**静态源码与历史真实运行证据层面的研究成果**，作者会话不对自身作品颁发独立PASS。

## 阅读顺序（从方法到实现）

1. **[PRODUCTION_METHOD_V1.md](PRODUCTION_METHOD_V1.md)** — 核心方法：从选题G0到用户最终验收G8，每一步必须产出什么，失败如何止损。
2. **[SOURCE_ARCHITECTURE_AND_LIMITS_V1.md](SOURCE_ARCHITECTURE_AND_LIMITS_V1.md)** — 源码架构/数据流/6s与60s案例、工具测试漏洞与中文音轨问题。
3. **[SCIENCE_VISUALS_TRANSFER_V1.md](SCIENCE_VISUALS_TRANSFER_V1.md)** — 形状morph、世界相机与真实人体尺度深入的区别；2D、分层素材、2.5D/3D的可行路线。
4. **[INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md](INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md)** — 先盲看真实视频、再核对导演与源码、不同上下文双审、原90分标准不变。
5. **[UPSTREAM_METHODS_AUDIT_V1.md](UPSTREAM_METHODS_AUDIT_V1.md)** — 上一版具体上游函数与失败EP01场景对比。
6. **[METHOD_PROOF_TASK.md](METHOD_PROOF_TASK.md)** — **尚未执行**的三个可验证实验：A原创形状morph、B-space空间与B-mechanism科学解释分审、C临时普通话时序/真实Canvas字幕与反例测试。

## 三个关键能力的证据状态

| 能力 | 现在的证据 | 能否声称“会做符合用户要求的原创成片” |
|---|---|---|
| 上游官方6秒Sketchbook复现 | 项目旧`codex/ep01-upstream-reproduction`构建记录和媒体 | **不能**：只是原作品复现 |
| 原版`kit/morph.js`与摄影机架构的理解 | 函数与官方Demo源码追踪、历史复现 | **不能**：没有原创迁移过审画面 |
| 60秒15场景Cut-paper组织方式 | 官方完整示例源码（15场景、13morph、1硬切、音乐叙事） | **不能**：不是Sketchbook人体视频 |
| 正常成人的人体动画 | 旧111秒视频实际失败 | **不能**：需要重新设计资产/骨骼并真实审稿 |
| 全身→器官/组织→细胞→同一全身 | 原视频41–78秒大红椭圆＋图框叠加，用户拒收 | **不能**：需证明空间真正连续，不能简单叠透明层 |
| 中文真实配音/字幕同步 | 原正式成片缺中文解说、上游默认英语识别工具链 | **不能**：需先完成本地中文时间轴 |
| 完整原创作品达到用户认可参考质量 | 尚无成功证据 | **不能**：仅有方法设计，没有新的原创作品经独立视觉和用户验收 |

## 接下来的正确动作

按照`METHOD_PROOF_TASK.md`做A/B/C三个**局部方法的实物验证**，并由独立视觉Agent盲看、独立工程Agent审来源与复现。**它们不是单独15秒样片，也不自动启动完整EP01重制。**

若B（可信人体深入）在2D Sketchbook中不能达到清楚的空间结构，直接比较分层解剖素材、2.5D/3D等替代实现；不能为坚持原技术栈重复做大红椭圆框图。对A/B/C未有实物时一律标`UNVERIFIED`。

只有真实原创画面及完整中文音画闭环具备证据，才可进入下一期或EP01第二次整片制作。原失败111秒视频、用户拒收与旧审核历史均保留；研究不能替它们自动“洗白”。

## 补充研究：已有真实显微镜连续倍率镜头和中文配音实现

- **[ADJACENT_IMPLEMENTATIONS_V1.md](ADJACENT_IMPLEMENTATIONS_V1.md)**：进一步读了另一开源库 `lemomo-ai/lemo-opuscar` 的39.5秒 `styles/microscope` 演示、`film.js` 对数螺旋摄影机与同一样本多分辨率金字塔、`tts_zh.py`普通话语音和`asr_check.py`中文识别校验。
- **能借鉴：** 真正同一对象跨尺度的相机/层级机制，以及已存在的中文工具实现；这比继续围绕原来的红椭圆框自行猜测更有代码依据。
- **不能冒充：** 该显微镜示范使用**静态真实肝组织玻片扫描**，并非活人从皮肤进入活动中的肌肉/细胞；该演示为英文配音加双语字幕，不是已证明适合我们的中文配音工作流。仍须原创整合、合法素材、实物检验与独立审核。
