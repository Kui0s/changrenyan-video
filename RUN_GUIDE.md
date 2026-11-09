# 运行说明｜不要联网查GitHub源代码

本压缩包已含原版`cth9191/animate`指定提交的Sketchbook绘图/镜头/形变/渲染源码、MIT许可证、官方6秒Demo源码与其样例图片。来源被固定，**不包含我们旧111秒失败视频的代码**。

## 安装基础环境
- Node.js ≥18
- Playwright + Chromium
- FFmpeg（加入PATH）
- 可选：若之后制作中文配音，需另行适配语音对齐；本轮只测试代码绘制的真实视频视觉质量。

Windows PowerShell在解压目录中执行：
```powershell
npm install -g playwright
npx playwright install chromium
node .\animate\tools\build.mjs .\animate\styles\sketchbook\demo
node .\animate\tools\tile.mjs .\animate\styles\sketchbook\demo .\baseline_tile.png 12 48 96
node .\animate\tools\export.mjs .\animate\styles\sketchbook\demo --no-audio
```

官方`piece.json`是1080×1920/24fps/6s。原版Demo的主角是圆形拟人小物体，**不是**T1要求的成人角色；请修改并新建原创场景和人物模型。技术手段不限于把官方`doodleHero`改成长方形身体和两根线条腿。

**注意**：这里的“离线”表示Gemini不需要去GitHub读取文件，首次下载Node或Playwright依赖仍需要网络。本包只保证原始项目文件齐备，不表示已在Gemini计算机上测试成功。
