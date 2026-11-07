# EP01 原创15秒技术样片｜内部隔离上下文预审 R04

> **性质：INTERNAL SEPARATE-CONTEXT PRE-REVIEW / FORMAL PR REVIEW PENDING。** 本记录不能代替 GitHub 可追溯的正式独立审核。

## 绑定对象

- 源码：`b086858d46050888b2435eb965338a8b972f6620`
- 证据：`5e29fd1a8b373b97c128b8805063866ad68d696f`
- MP4 SHA-256：`9554272175e3005ee857ffa8a83c4028c94a7518cf3b50dda213c6166ec8e66b`
- 媒体：1080×1920、24fps、360帧、15.000秒

## 视觉/科学代理预审

- R03-01：**未发现继续阻塞的证据。** 0–4秒连续抽帧中支撑脚尖贴地，身体前移时支撑脚保持纸面位置；摆动脚离地并交替落脚。
- R03-02：**未发现继续阻塞的证据。** 4.75–6.25秒微观结构从同一右小腿切面内显现并围绕该位置连续放大，人物层同步退出；未硬切到无关静态图。
- 保留的小问题：步态没有完整后跟—前掌滚动；约5.75–6.25秒切面窗口属于抽象示意，正式成片可继续精修。
- 预评分：F=5.0、C=4.5、V=4.5、M=4.5、S=4.0；视觉85权重归一化 **91.8/100**；无预审硬否决。

## 工程代理预审

- 240Hz 密集采样覆盖0–4秒：完整左右支撑组的脚尖 `y` 变化为0，水平漂移为0至 `2.27e-13px` 浮点误差。
- 渲染链真实消费 `walkerState → calfAnchor → cameraState → worldToSampleScreen → transitionState`，不是测试专用死代码。
- 6项测试、18项清单、MP4哈希、FFprobe、确定性抽帧、文字/平帧/dead-beat检查通过。
- T预评分 **4.5/5**；工程建议为 `GO TO FORMAL PR REVIEW`。

## 保留门禁

- `CLEAN_REBUILD_NOT_VERIFIED`
- `FORMAL INDEPENDENT PR REVIEW PENDING`
- `FULL CONTINUOUS-PLAYBACK REVIEW PENDING`
- 未获用户后续阶段授权；不得自动合并、发布或制作完整EP01。
