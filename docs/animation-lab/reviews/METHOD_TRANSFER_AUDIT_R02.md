# 《常人言》动画制作方法论｜PR #12 独立复审 R02

> **结论：METHOD_DOCUMENTATION_PASS / READY_FOR_CONTROLLED_PROOFS**（文档整改通过，可进入受控 A/B/C 技术实证）。  
> **实际原创制作能力：A / B-SPACE / B-MECHANISM / C = NOT VERIFIED。** 没有新媒体可供首看，不签发原创视频90分PASS。  
> **EP01 旧111秒正片：USER REJECTED / RELEASE NO_GO**，本轮结论绝不改变其状态。  
> 复审日：2026-11-08（America/Los_Angeles）。  
> 仓库：`Kui0s/changrenyan-video`；Draft [PR #12](https://github.com/Kui0s/changrenyan-video/pull/12)；[Issue #13](https://github.com/Kui0s/changrenyan-video/issues/13)。  
> **受审冻结提交**：`research/animate-methods-transfer-v1@f7da5bd5011ebf159536928baf106c5981ed04bd`。  
> 对照前次[R01](./METHOD_TRANSFER_AUDIT_R01.md)（受审`267b81cc904fe545d313af6342f5c4b11b6f62ba`；研究事实VERIFIED WITH LIMITS、方法REVISE、实物NOT VERIFIED）。  
> 复审者依据GitHub实际新版文件与原始检查器源码独立判断，不采用创作端整改说明为自动PASS证据；不是经另一个代理再复审本结论的双重独立审计。**本轮审核范围是方法/执行规范，不是用户直接观看过的成片。**

## 1. 本轮真正读取的证据

| 文件（研究分支） | blob SHA | 作用 |
|---|---|---|
| `docs/animation-lab/PRODUCTION_METHOD_V1.md` | `d2c3303cd85e958d02be93c8309d0babe7b3bb36` | G5a/G5b阶段与G7中文声音交付门禁、G0–G8全流程 |
| `docs/animation-lab/METHOD_PROOF_TASK.md` | `86304252365fe66d9d0515daee7a21b9f1692418` | A/B/C独立可核对技术验证，真实Canvas字幕检测合同 |
| `docs/animation-lab/INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md` | `3a8f67f3d2de7d5548d6128866907bdd9b6013ff` | 专家代理首看/真实观众与用户验收分开 |
| `docs/animation-lab/SCIENCE_VISUALS_TRANSFER_V1.md` | `20111caba276346a6b17fcaff6e8867c8e674dd5` | 2D失败修订止损及2.5D/3D等路线比较 |
| `docs/animation-lab/reviews/METHOD_TRANSFER_R01_RESPONSE.md` | `25db880c97d806c9b64cbf07646a8c9bbf4b0a0f` | 作者变更索引；**仅作差异导航，未按作者自评认定合格** |
| `docs/animation-lab/README.md` | `7e986bbcc4d52af49bf23715930d58f2d73edcc9` | 实际能力状态与文档导航 |

原始检查器交叉核对：`lemomo-ai/lemo-opuscar@143f387ad774525dc9abc0ff05fb5f4bfbaa5f02`的`core/render/readcheck.mjs`；其具体实现确实要求`window.render(t)`、`window.TEXTS(t)`、`window.DUR`，读取视口边界，语句短暂显示或从未完整进入画面时返回BAD/exit1，接口缺失/没有文本返回NOT CHECKED/exit2。**其自身不检查两个文本框彼此重叠**。`cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`的英文音轨检查与0/0 story rules问题已于R01直接验证，本次无新证据推翻。

## 2. R01问题独立逐项关闭

| R01缺陷 | 受审新版实际修订 | R02判定 |
|---|---|---|
| **P1-01：临时声音与正式配音阶段混淆** | `PRODUCTION_METHOD_V1.md`明确G5a可用人工核查句段预算/合规临时普通话并继续G3/G4/G6；G5b在后期使用用户自录或剪映AI正式声、据实重排cue字幕，G7必须有真实中文音轨。与已批准的`docs/VOICE_AND_DURATION_POLICY.md`相容 | **RESOLVED（流程）**；实际音画未测试 |
| **P1-02：readcheck缺正确接口/负例契约** | `METHOD_PROOF_TASK.md §C`要求Canvas桥接`window.render(t)`、`window.DUR`、`window.TEXTS(t)`（id/text/框），传入实际9:16视口如360×640；短时、越界、缺接口与另行重叠检查，明确不同退出码；后期FFmpeg/SRT字幕另测 | **RESOLVED（测试设计）**；接口尚未写入动画项目，也没有真实退出日志；不能报C已通过 |
| **P1-03：B实验强制6–10秒塞满所有机制** | 拆为`B_SPACE`空间定位与原路返回、`B_MECHANISM`血管壁/间隙/细胞膜的区别与科学解释；允许延长以获得读图停顿，分别PASS/REVISE，任一不通过B不能整体通过 | **RESOLVED（任务设计）**；实际观众能否理解未证实 |
| **P1-04：独立AI首看假冒真人观众** | `INDEPENDENT_VISUAL_REVIEW_PROTOCOL_V1.md`区分`INDEPENDENT_AGENT_FIRST_WATCH`、确有受试者才登记`HUMAN_VIEWER_FIRST_WATCH`及`USER_ACCEPTANCE`；必须真的有完整媒体、首次盲看记录，不以多AI一致推断人类统计结论 | **RESOLVED（审查证据分级）** |
| **P2-05：2D技术路线缺止损条件** | `SCIENCE_VISUALS_TRANSFER_V1.md`对2D按代表镜头实物验证，若出现杆件人/椭圆叠框/空间不可辨，仅允许一次针对根因修订；继续不合格标`2D NOT READY`，再用同语义目标比较合规分层素材、2.5D/3D，不因工具名称加分 | **RESOLVED（路径裁决规则）**；还未实际选择替代路线 |

这五项均非简单将原审核问题改写成任务清单，而是明确增加了**阶段边界、测试输入/输出、负例、停止条件或证据类型**，能够约束后续执行。**因此R01的“方法待修订”关闭**，但此前研发成果尚未进入可称为“经过生产验证的通用能力”的等级。

## 3. 放行定义和本轮不打90分的原因

- **本轮可以判文档层PASS**：研究发现具真实源码对应、方法步骤与受控测试合同足够完整，可用于指导Codex做A/B/C真实实验。
- **不对方法论自创一个90分成绩**：仓库`docs/SCORE_RUBRIC.md v1.0`的F/C/V/M/S/A/T是导演与实际视频对应阶段的评分系统，不是静态源码研究文档的评价公式。拿“文字分≥90”给方法论签发“视频能力PASS”，会重复旧EP01的失败。
- **A（原创对象morph）= NOT VERIFIED；B_SPACE（可信人体推进/返回）= NOT VERIFIED；B_MECHANISM（生理双边界）= NOT VERIFIED；C（临时普通话/字幕）= NOT VERIFIED**。没有任何新的原创MP4和真实工程运行记录可升级它们。
- **旧111秒EP01发布状态仍是NO_GO**；其全帧审查和用户拒收记录保留，旧成片不被这套方法修订“洗白”。
- **不恢复单独15秒样片门禁**；独立A/B/C只是隔离技术能力测试，不作为直接发布作品。
- **本审核不能自动开始工程**：用户在本轮只说“继续”承接审核流程，不等于明确授权修改/重做旧正片或触发Codex新实验。

## 4. 下一阶段真实实验：必须独立提交什么

| 能力 | 必要媒体/工程证据 | 正式否决条件 |
|---|---|---|
| A 语义morph | 源码中真实`BRIDGES/STYLE.window/STYLE.blob`映射、4–6秒原创连续MP4、前中后完整连续帧、项目版本/上游diff/哈希 | 直接alpha交叉淡入、复用原灯泡→太阳镜头冒充原创、观众无法识别A如何变为B |
| B_SPACE 人体尺度空间 | 可正常辨认的人体图/连续片、推进位置、不同尺度新增结构、同原位置退回、逐帧/相机父子关系 | 杆件人、人物原地不变而红椭圆放大、不同长方框淡入冒充体内进入 |
| B_MECHANISM 医学机制 | 有明确血管壁→细胞外间隙→肌细胞膜及粒子路径的连续视频、真实科学结构审核 | 两道边界混为一条、粒子仿佛一脚落地直接穿膜、仅凭标签理解科学过程 |
| C 普通话音画字幕 | **真实可听**临时中文、句级时码和人工校正、Canvas`TEXTS`适配、`readcheck`通过/负例/NOT CHECKED三种状态、独立重叠检查、最终360px实看 | 无声音、英文词级检测假PASS、关键短句太快/越界、工具报0但实际没有执行、以C临时声代替最终剪映正式声 |

**执行时还须**：各自MP4/代码SHA与媒体SHA256、可复现渲染命令/日志、素材来源和许可证；由未参与制作的视觉审核者**直接看媒体**，再交另一独立工程审核者核对技术、来源与复现。若任何测试尚未提交实物，则记录`NOT VERIFIED`，而不是估计高分。

### 仍需注意的次级技术边界（不是新文档否决）

1. `readcheck`的CJK 4.5字/秒+固定停顿只是**可复核的初始启发式**，不能等同所有观众真实阅读能力或最终字幕与音频同步检验；工具没有文字重叠检查，任务已正确要求单独检测。其时间检查本身还依赖`TEXTS`真实反映**最终渲染可见文本**，不能塞与Canvas不一致的假的几何数据。
2. B空间实验即使能完成高倍率摄影机，也不必然意味着可信的医学动态图层已实现，必须和B机制分别检查。使用其他库/3D资产需登记相应许可，不可把静态肝切片伪装成活动人体。
3. 独立AI首看优于制作端自评，但不是普通受众的因果理解实证。用户最后是否接受仍是独立门禁。

## 5. 操作建议和状态

- **PR #12：R02方法文档PASS，可作为受控实验任务依据；建议保留Draft直到项目维护者/用户决定合并**，不因本报告自动合并。
- **Issue #13：从“方法文档待审核”推进为“方法已审、真实A/B/C实验尚未启动”**。
- 具体下一步若用户明确让Codex执行：使用`docs/animation-lab/METHOD_PROOF_TASK.md@f7da5bd5011ebf159536928baf106c5981ed04bd`，在单独实验分支做A、B_SPACE、B_MECHANISM、C；不直接重制EP01或发布。
- 真实实验之后如有新提交，另起`METHOD_PROOF_VISUAL_R01.md`及`METHOD_PROOF_ENGINEERING_R01.md`，严禁拿本文件代替实际视频审核。

**本轮状态：`METHOD_DOCUMENTATION_PASS` / `A_B_C_NOT_VERIFIED` / `OLD_EP01_RELEASE_NO_GO`。**
