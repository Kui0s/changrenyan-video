# 上游源码架构与质量门禁：可以复用什么，不能保证什么

> **静态代码与上游已有运行报告核查；不是本人重新运行并认证全部工具。** 上游版本`cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`，与2026-11-08仓库main相同。
>
> 主要路径统一前缀：`plugins/animate/skills/animate/`。上游官方6秒Sketchbook与项目原复现结果：`artifacts/upstream-reproduction/README.md`。更长的60秒示范位于`examples/history-of-ai/`，但它是**cut-paper**风格，不是Sketchbook。

## 1. 真实工程数据流

```text
研究/源材料
   ↓  source-checked brief.md，真正的情节节拍
选FORMATS.md叙事结构 + STYLE.md/kit.js绘图语言
   ↓  2–4张实际风格帧（still.mjs + compare.mjs）
src/head.html 定义 画幅/FPS/TIMELINE/board/acts/cues
   + src/scenes.js 或 src/era-*.js 真实场景绘图
   + src/bridges.js / pieceCam / BRIDGES
   + src/score.js 和可选中文 voice.json/voice.wav
   + piece.json 指定 style、声轨与审查配置
   ↓  tools/build.mjs
index.html = head + kit/core + style kit + scenes + bridges
             + kit/morph renderer + kit/board + synth audio
   ↓  浏览器 Playwright 调用 window.renderFrame(t) 与renderAudioWav()
PNG逐帧、WAV/stems
   ↓  tools/export.mjs + FFmpeg
MP4母版、字幕预览、手机share
   ↓  tools/tile / still / storyboard / review / textcheck / framehash
   + 独立人眼真实看图和听音轨
   ↓  RENDERED COMPLETE≠VISUAL ACCEPTED
独立视频/科学审查 + 独立工程审查 + 用户验收
```

上游`kit/board.js`直接调用`renderFrame(TIMELINE.board[k].t)`来生成分镜。因此，**批准的画面就是成品的绘制函数**，并非单独画一套与最终制作脱节的演示图。这是整条生产方法的关键节约机制。

## 2. 绘制/时间核心的关键实现与制约

### 2.1 每帧与场景

- `kit/morph.js`：`renderFrame(t)`根据`FPS`计算`F`，用`B=floor(F/2)`作为on-2s笔触时刻；`STYLE.ones`为true时可逐帧更新，其他主要采用2帧为一组的手绘节奏。`renderEra`每帧重置Canvas并应用`pieceCam`世界坐标变换。
- `ERA_LIST`定义不同时间段场景绘制函数；`TIMELINE.shots`描述每段，`cues`控制描线与物件动作，`board`导出真实关键帧。
- `kit/core.js`：有`RNG`稳定扰动、`ink/pencil/hatch`绘图、`springMove/springTrack`等状态无关的运动函数；`camOf/push/bump`所在实现是`kit/morph.js`，不要在复用时误找源文件。
- **误区：** “同一帧可重新渲染”“脚底坐标不变”属于工程/运动形式条件，不等于人体或镜头好看。

### 2.2 真正的形状变形

- 官方Sketchbook `styles/sketchbook/demo/src/bridges.js`规定：在`tc=3.0s`将`bulbPts()`灯泡轮廓与`ellipsePts()`太阳轮廓配对。
- `kit/morph.js`不只是渐隐：第一相`shrink`使用`STYLE.window`收缩旧场景到指定对象；第二相`morph`用`byAngle`重采样两组轮廓并按时刻`lerp`形状点；第三相`grow`从新对象展开新场景。
- `camOf({z,p,to})`把世界点p转换到屏幕点to；`pieceCam`按场景决定进/退镜头，而不是整个Canvas不加区分地放大。
- **几何限制：** 上游`styles/README.md`指出当两个对象比例差异巨大（点→细长长条）时，角度重采样可能夹出蝴蝶结式收缩。动画工程必须先验收几何轮廓，而不是凡事套morph。
- **语义限制：** 灯泡轮廓变太阳是故事隐喻；不能把“骨骼肌→毛细血管→细胞”仅用morph当成真实连续解剖纵深。

### 2.3 Sketchbook真正的风格代码

- `styles/sketchbook/kit.js`：`gpencil`草图、`gline`确认线、`scribbleFill`偏位上色、`handLetter`手写字、`sketchPage`纸张场景、`doodleHero`简化抽象人物、`STYLE.window/blob/post`对接形变渲染器。
- `styles/sketchbook/STYLE.md`：先铅笔→墨线→涂色；主角只用陶土橘，概念高亮黄；字幕每节短、画面仅一个焦点；相机移动在同一纸张空间；on-2s让笔触活着。
- 官方`doodleHero`是有表情的**圆形拟人对象**，它之所以可爱是符合设定；并**不是可直接获得自然成人体态的角色生成器**。
- **常见误区：** 复用`sketchPage/gline`而用方框手脚画成人，仅得到同一纹理，不得到相同质量。

## 3. 为什么要研究更长的60秒真实案例

同一仓库`examples/history-of-ai/`包含 **60秒、15个独立场景、13次morph、一次硬切、1440帧** 的Cut-paper范例。

- `src/head.html`定义15个`ERA_LIST`、15个分节拍`SHOTS`、`TIMELINE.board`每节关键帧、`MORPHS`与8类音画act，以及末尾返回开头的叙事结构。
- `src/bridges.js`逐个明确每场A→B对象，例如纸页→黑板、烛火→烛火、棋盘→下一场景；`pieceCam`在特定场景给出`push`和`bump`而非平均每段都猛烈放缩。
- `src/score.js`围绕剧情变化组织声音：早期温暖→冬季冷寂→逐步堆叠→沉默→关键撞击→收束。这里**声音本身承担转折**，不只是随便放一段配乐。
- 这个范例说明较长影片需要**分节拍、多场景真实过渡、前后呼应、音画共同结构**；它不能证明Sketchbook已有同样成熟的60秒人体医学制作经验。

### 为什么不能只看6秒Demo就放心做111秒

6秒Demo的质量优势可能来自：场景只需两个世界、一个灯泡→太阳的形状变化、一位圆点主角、极少字幕、丰富小动作。111秒人体科普牵涉正规人体比例、不同器官空间、跨尺度放大、科学正确性、中文解说，**技术问题的类型和难度都不同**。

## 4. 官方实际工具的输入/输出及精确边界

| 脚本 | 读取/动作 | 证据 | **盲区与风险** |
|---|---|---|---|
| `build.mjs` | 按`piece.json`的`build/scenes`拼`head+core+kit+scene+bridges+morph+score`，生成`index.html`并检查JS语法与外部素材约束 | 渲染入口可编译 | 源码拼接通过不保证作品美观；仓库外许可需另外查 |
| `still.mjs` | 实际渲染指定时间的静帧 | 2–4张look frames | 不代表镜头流畅 |
| `storyboard.mjs` | 根据`TIMELINE.board`调用真实`renderFrame`，绘制带标题、声音、转场提示的板 | 审核批准的场景画面可继续发展为成片 | 必须另外核查镜头之间连续帧，不然仍可能有糟糕过渡 |
| `tile.mjs` | 指定帧从顺序/逆序重新绘制、比较像素，叠安全区 | 确定性、孤立帧可生成 | 不检查观众理解，特殊形态不合格仍可pass |
| `compare.mjs` | 参考静帧与新画面并排，比较比例、主色、边距/线宽 | 造型/风格偏差可视 | 不能只凭色彩距离认可人物或机制画面 |
| `voice.mjs` + `voice_words.py` | 用OS临时朗读或真实音频，输出`voice.wav/voice.json` | 英文版有句/词起止时间 | **英文词级处理不能直接用于普通话**，详见第5节 |
| `export.mjs` | Playwright逐帧、离线声音、FFmpeg合成、可生成SRT/字幕版及不同尺寸 | 媒体可交付 | `renders/final-captions.mp4`可能只用于声文预览，不能据此推断有完整中文旁白 |
| `review.mjs` | 真MP4切点/节奏/音频响度/部分脚本规则，输出联系表和`phone.jpg` | 技术测量与抽帧审查 | **没有统一可靠的成片美术PASS出口**；部分规则为空或缺前提 |
| `textcheck.mjs` | 抽样帧文本裁切、互相遮挡、安全区 | 文本几何排版 | 无字号、中文语义和阅读难度评价；镜头morph中的帧还会被跳过 |
| `framehash.mjs` | 给定帧渲染哈希，比较代码变化前后是否同像素 | 检测不该改变的镜头被误改 | 不是艺术评分 |
| `tools/measure/refs.mjs`/shotlog.py | 从参考图片/视频测量颜色、切点、比例/节奏 | 参考匹配有测量依据 | 映射参考的**机制**而不是照抄画面 |

## 5. 源码检查中发现的三条高风险陷阱

### 5.1 中文配音链原样执行会出错

`tools/voice_words.py`：
`WhisperModel('small.en')`（默认）且`transcribe(...,language='en')`。

`tools/voice.mjs`：
`norm(w) = w.toLowerCase().replace(/[^a-z0-9]/g,'')`，
`words = L.text.split(/\s+/).filter(w => norm(w))`。

**对不带空格的中文句子，绝大多数文字在`norm`时被删光，词列表可能为空；因此不能相信`voice.json`的词对齐结果。**

`tools/review.mjs`的`narration`使用`text.split(/\s+/)`计英语单词数，中文句子可能只记作**1个词**，进而错误报告语速很低。

**必须适配：**使用中文能力的语音识别/强制对齐方案、中文按句或语义短语切分并核验起止，或先人工标定句间时间；关键画面绑定句时间点，中文词/字密度不能照抄英语词每秒3.5的标准。若无法正确对齐，应显式标为`CHINESE_TIMING_NOT_VERIFIED`，不能让工具假PASS。

### 5.2 “story arc: PASS (0/0 rules)”不代表故事被检验

`tools/review.mjs`中建立`rules=[]`，只有当`gift/peak/silence/mix`等条件存在时才添加规则；最后用`rules.every(([ok])=>ok)`判PASS。**JavaScript里`[].every(...)`结果天然为true**。若`rules.length===0`，应人工标明`NOT TESTED`，不是“故事通过”。

此外`review.mjs`主要输出日志，不负责为所有warn/fail建立总的非0退出码；因此“命令正常结束”也不等于所有质量条件满足。应将关键技术门禁另行解析成可执行失败，并保留独立审美判断。

### 5.3 “字幕没有重叠”不代表可读、与声音同步

`tools/textcheck.mjs`按抽样帧计算几何外框，标记裁切、文本遮挡、安全区；它**没有判断中文词义、阅读所需时间、字体是否过小、是否与实际普通话逐句出现**。

上游Sketchbook规范提倡**短手写字幕**（约每行20字以内，通常两行）；官方通用`grammar/FRAME.md`建议主要字幕至少50px/1080画布。旧片的32–36px整幕长句自然不符合这条手机观感基线。

需要新的人工/工具补充检查：关键字是否易读；是否一次1–2行、逐句随解说出现；是否有观众注意力冲突；360px手机预览而不是只看1080原尺寸。

## 6. 将现有工具接入我们的项目

- **先沿用官方原码作为受控基线**，禁止为了适应旧EP01圆框特效而直接改坏上游`kit/morph.js`。
- 若要修改，对照`framehash.mjs`验证旧Demo在未改动部分保持一致；为新人体层级另建明确模块（例如`anatomy-layer-camera`），而不是混入原Sketchbook style绘图基础。
- 原版无法满足正常人物与准确体内结构时，必须评估合规插画资产或2.5D/3D模型；“来源于官方仓库”不比“实现对观众有效”优先。
- 为中文新增/独立包装`zh-voice-timing`与`zh-subtitle-check`，不把英文版的成功检测复用为中文合格。
- 参考视频测量、原创画面对照、Storyboard、正式MP4和独立审核应绑定**精确commit SHA+视频SHA256**，避免审核稿件与最终渲染稿不一致。

## 7. 仍未证明的能力与下一步实验

- **已知有源码/复现证据：** 官方Sketchbook 6s绘图、灯泡→太阳morph、世界相机、逐帧渲染；已有我们仓库的复现证据，但本轮未重跑。
- **有公开代码但本项目未验证：** 60s跨15场morph/音效结构可以供借鉴，仍需要本项目真实迁移验证。
- **未证实：** 自主制作符合用户审美的正常成年人；合法且清楚的医学层级；一次观看能理解的体内放大镜头；完整普通话语音-字幕同步；整期110秒成片达到上游观感。**不得在缺少真实视频时升级其证据状态。**
- 实验任务：`METHOD_PROOF_TASK.md`的A（morph真实迁移）、B（人体剖面多尺度镜头），并新增C（普通话配音时间轴和手机字幕可读）；所有实际媒体须独立盲看。完成前不再次整片盲目生产。
