# PR #12 方法论审核 R01｜创作端定向整改记录（待独立 R02 复核）

> **性质：作者会话整改说明，不是独立审查PASS。**
>
> 原审核：主分支 [`METHOD_TRANSFER_AUDIT_R01.md`](https://github.com/Kui0s/changrenyan-video/blob/main/docs/animation-lab/reviews/METHOD_TRANSFER_AUDIT_R01.md)。受审旧SHA：`research/animate-methods-transfer-v1@267b81cc904fe545d313af6342f5c4b11b6f62ba`。结论：研究源代码主要事实`VERIFIED`，**正式生产方法`REVISE`，A/B/C视频效果`NOT VERIFIED`**。
>
> 本文件只记录各项**实际文档修改**。没有新完整MP4、真实中文正式配音、用户验收或新的独立R02签字；不得声称“视频制作技术已经学会”。固定`docs/SCORE_RUBRIC.md v1.0`未改变。用户取消的独立15秒样片门禁不得恢复。

## 审核五项缺陷的定向处理与后续验收

| R01问题 | 创作端变更位置 | 已实际修改内容 | 仍需独立审稿人确认 |
|---|---|---|---|
| **P1-01 声音阶段混淆** | `PRODUCTION_METHOD_V1.md §二 G5a/G7、§G5a/G5b`；`METHOD_PROOF_TASK.md §C` | G5a允许临时普通话或人工核查句级时码，保留弹性；正式声音可在后期由剪映AI或用户录制加入，G5b/G7锁定最终音轨、字幕、镜头及≤120秒；C实验临时音频**不等于正式配音** | 是否真实遵守`docs/VOICE_AND_DURATION_POLICY.md`，同时堵住“无正式配音也宣称最终成片”的漏洞 |
| **P1-02 readcheck接入契约缺失** | `METHOD_PROOF_TASK.md §C` | 规定当前Canvas需要实际实现`window.DUR`与`window.TEXTS(t)`，后者返回实际字幕的`id/text/x0/y0/x1/y1`与真实视口；要求正常、短时不可读、出界、缺接口四类测试 | 审查者必须看到**实际执行日志/视频**及状态码；缺接口或空结果≠PASS；当前仅有任务约束、没有实物执行 |
| **P1-03 B镜头时长与目标过密** | `METHOD_PROOF_TASK.md §B` | 拆`B_SPACE`（目标定位与原路返回，6–10秒仅初始预算）与`B_MECHANISM`（血管壁、间隙、细胞膜科学解释，按阅读时间延长）；**必须分别验收** | 实际动态是否既能定位，又能理解机制；任一失败整体B不得称“掌握” |
| **P1-04 AI首看≠真人观众** | `INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md §2/§5/§7` | 明确`INDEPENDENT_AGENT_FIRST_WATCH`只是专家代理证据；真实非专业受试者用单独`HUMAN_VIEWER_FIRST_WATCH`并披露样本限制；用户最终`USER_ACCEPTANCE`独立且有拒收权 | 报告是否真实逐份标注证据等级、媒体SHA、是否看完整片；不能把AI推断美术/科学语义记为“普通人已证实理解” |
| **P2-05 缺2D止损条件** | `SCIENCE_VISUALS_TRANSFER_V1.md §3` | 2D先做真实镜头，失败仅一次针对根因修订；仍有杆件人/红椭圆叠框/空间不可追踪则标`2D NOT READY`，换合法分层素材或2.5D/3D同语义测试；都失败标`ANATOMY_CAMERA_NOT_READY` | 用**同一真实画面任务和盲看问题**比较技术路线，不因引擎名称宣布胜利 |

## 额外源码核验发现：readcheck不检查重叠

直接核查`lemomo-ai/lemo-opuscar/core/render/readcheck.mjs`（本次研究时main）：
- `window.TEXTS(t)`、`window.DUR`缺失时输出`NOT CHECKED` / exit 2；
- 文字持续可见时间太短或完全在画框外则报告BAD / exit 1；
- 其源码**不实现两个文字框彼此重叠的检测**，因此不能错误要求“运行readcheck后OVERLAP→FAIL”。本次已将`METHOD_PROOF_TASK.md`改为用**另外的几何重叠检测**或相应的`textcheck`测试此问题，且另外保留单独手机人工阅读检查。
- 如果工具显示`pass:true`不计阅读时长，不能用它让所有关键文本绕开验收；应在实验中审核哪些属于必要阅读文本。

## 实际操作边界

1. **文档整改已经提交**，审核R01的五个具体要求都有对应改动，但**是否真正关闭问题，由全新独立审稿人进行R02复审**。
2. 正式生产方法不得在R02之前标`APPROVED`；若R02再次要求修改，按新意见修订，保留R01与R02原文。
3. A、B-space、B-mechanism、C真实视频目前仍为`NOT VERIFIED`；这是下一阶段可执行任务，不是已发生的动画制作。
4. 用户若同意启动Codex实验，执行`METHOD_PROOF_TASK.md`，不修改旧失败成片PR #11、不提前制作完整EP01、不自动发布。
