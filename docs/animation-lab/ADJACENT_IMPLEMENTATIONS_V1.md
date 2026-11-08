# 相邻成熟实现核查 V1｜真实连续显微镜镜头与中文配音的候选方案

> **证据状态：已阅读公开源代码与Demo导演资料；未在本项目实际运行或审核它们与Sketchbook混用的成片。**
> 原核心源项目仍是`cth9191/animate@7e5eb56`。这份研究只补其确实欠缺的**高倍率连续深入**和**普通话解说/字幕**能力。
>
> 新增候选：[lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)，当前`main`研究时树SHA：`143f387ad774525dc9abc0ff05fb5f4bfbaa5f02`。仓库代码许可标为MIT，**其示例媒体、真实病理图像、字体、配音/模型均须按实际资源另查权属与条款，不等于所有素材都自动可用**。

## 1. 找到了什么真实实现

### A. Microscope：真正的连续尺度穿越案例

- [Microscope STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/microscope/STYLE.md)
- [39.5秒演示的完整分镜、尺度与时间](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/microscope/DEMO.md)
- [主要摄影/显微镜源代码](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/microscope/demo/film.js)
- [真实数据/测量事实核查](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/microscope/demo/FACTS.md)

该演示《量出来的蓝》：**一份有真实扫描数据的肝组织玻片 → 组织不同倍率 → 局部区域 → 一个细胞核 → 回到原玻片**，39.5秒，几乎一个连续摄影机运动。

它与失败EP01的差别不是“有更多圆框”，而是**各个尺度始终属于同一份已经注册坐标的组织图像**：

1. `demo/film.js`中`camAt(t)`使用可追踪世界坐标的**相似变换/对数螺旋相机（log-spiral camera）**，推进时焦点和旋转属于同一运动；不是四个独立canvas反复alpha。
2. 各放大倍率使用**同一玻片扫描的多分辨率图像金字塔（registered pyramidal plates）**，通过`activeLevel/plateAlpha`在适当分辨率过渡，同一个组织在不同视距下延续；不是把两张完全不同来源的组织图硬接成“一块肌肉”。
3. `focus()`按倍率变化添加真实摄影语法上的合焦/失焦过程、物镜点击声和比例尺更新；这会帮助观众感到自己在深入某个目标。
4. `demo/timeline.js`给出12个连续节拍及镜头站点；每次测量标记与目标保持世界→屏幕同一变换，信息一个一个出现。
5. `STYLE.md`对单屏只展示一个重点读数、标签时长、手机文字、真实材料与防造数据设置明确边界。

**注意适用性：** 它演示的是**真实静态组织切片的显微镜照片**，不是活人体在走路时内部器官与细胞真实实时运动。不能把活体人体外观照片直接假装连入某份无关肝组织切片，也不能把病理染色图当人体血液葡萄糖运动实拍。它能迁移的是**单一对象跨尺度的摄影机、层级图像选择与视觉聚焦方法**；新科普需自建有科学依据的多层解剖/器官视觉资产与明确“示意”的语义。

### B. 现成中文语音与字幕质量控制

- [普通话TTS`core/tts/tts_zh.py`](https://github.com/lemomo-ai/lemo-opuscar/blob/main/core/tts/tts_zh.py)：分句生成`zh-CN-XiaoxiaoNeural`等普通话WAV，支持每句语速、声音、音频缓存；需要网络，使用微软在线语音需先核对服务条款与适用权限。也提到使用离线Kokoro`lang=cmn`作替代，但音色质量仍须听验。
- [语音识别核查`core/tts/asr_check.py`](https://github.com/lemomo-ai/lemo-opuscar/blob/main/core/tts/asr_check.py)：支持`--lang zh`与多语Whisper模型（中文默认`small`），按中文字符/数值校验朗读稿，并导出识别时刻；不是`small.en`和仅英文`a-z0-9`。
- [阅读时间检查`core/render/readcheck.mjs`](https://github.com/lemomo-ai/lemo-opuscar/blob/main/core/render/readcheck.mjs)：`window.TEXTS(t)`报告当时可见文字，中文阅读时长建议按“字数/4.5+1.5秒”估算；**这是工程初始检查值，不是所有观众的实测阅读速度保证**。没有`window.TEXTS(t)`应报告`NOT CHECKED`而不是PASS。
- [TECHNIQUE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/TECHNIQUE.md)：明确“一套timeline驱动画面、普通话或英文配音、音效、字幕和最终合成”；开发和成片审查分开。特别是`readcheck`能对原项目只检查文字重叠的缺口有所补足。
- Microscope演示实际使用的是**英文旁白+中文/英文双语字幕**（`DEMO.md`明确）。因此不能说其Demo已亲自证明完整中文配音链对我们的视频成功；`tts_zh.py`与`asr_check.py`只证明该库**存在对应实现**，我们还需真实生成、听验并验证版权/使用条件。

## 2. 什么时候选用哪种技术

| 所需效果 | 第一候选 | 必要额外能力 | 不可做的错误替代 |
|---|---|---|---|
| Sketchbook手绘小故事/物体变形 | `cth9191/animate` style kit+`morph.js` | 审批过的真实风格帧与场景结构 | 把全屏淡入淡出说成对象形变 |
| 真实同一样本显微镜高倍率深入 | `lemo-opuscar/styles/microscope`世界相机+同一样本多倍率资料 | 有实际可用、可注册坐标且授权的多分辨率图像 | 用两张不同来源的组织图假装一镜连续 |
| 行走人体→体内器官→骨骼肌细胞（机制**示意**） | 综合世界相机/分级LOD/遮罩层级/可信人体模型，可以借鉴Microscope的摄影机语法与Sketchbook手绘材质 | **需要新设计的连贯解剖世界**，可能使用合法分层插画、2.5D或3D；科学准确和美术质量需实审 | 原111秒片的固定人像+红椭圆+长方框+点线 |
| 中文口播→真实时码→字幕 | `lemo-opuscar/core/tts/tts_zh.py`+`asr_check.py`或者自录/其他合法声音+等价校验 | 试听、网络/许可、中文断句/人工校正、与最终MP4对齐 | `animate/voice_words.py`默认英语`small.en`而得出中文假PASS |
| 真实演示视频的最终独立视觉审核 | 两套工具的渲染/字幕/读图检查 + **真实人眼盲看** | 独立审核上下文和全片MP4 | 将`review.mjs`的0/0 PASS当审核通过 |

## 3. 下一阶段建议的最小实际迁移证明

研究文档目前已经找到**可复制的代码路径**，但还没有复制成功：

1. **摄像机试验：** 把Microscope`camAt`的世界/相机变换与它对多级图像的选择逻辑拆出来，接入一个原创**有明确父子关系的解剖层级**（不是假数据扫描），与Sketchbook材质结合，实际导出8–10秒往返镜头。
2. **配音试验：** 用3句中文产生真实音轨，适配句/关键词时间，`--lang zh`校验，读图时长检查，字幕在手机尺寸可见；实际听感和许可证都要确认。
3. **视觉双盲对比：** 不给审稿者看制作步骤，让其先分别看旧111秒的41–78秒和新试验镜头，回答“哪一个让你清楚理解从身体哪里进入、里面看到什么、怎样返回”；如二者都不清楚，新试验仍须失败，不因为引入了新库而自动PASS。

这补充了我们原`METHOD_PROOF_TASK.md`的B/C的**明确候选源代码**，但不改变当前未制作、未核验的实际状态。
