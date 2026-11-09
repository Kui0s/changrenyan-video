import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';

const [pieceArg, outputArg, audioArg] = process.argv.slice(2);
if (!pieceArg || !outputArg) {
  console.error('usage: node scripts/render-piece.mjs <piece-dir> <output-dir> [audio.wav]');
  process.exit(2);
}

const pieceDir = path.resolve(pieceArg);
const outputDir = path.resolve(outputArg);
const evidenceDir = path.join(outputDir, 'frames');
fs.mkdirSync(evidenceDir, { recursive: true });
const metaFile = path.join(pieceDir, 'piece.json');
const pieceMeta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
const requestedTimes = new Set((pieceMeta.evidenceTimes || []).map(Number));
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: pieceMeta.format.width, height: pieceMeta.format.height }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
await page.goto(pathToFileURL(path.join(pieceDir, 'index.html')).href);
await page.waitForFunction(() => typeof window.renderFrame === 'function' && !!window.TIMELINE);
const timeline = await page.evaluate(() => window.TIMELINE);

const outMp4 = path.join(outputDir, `${pieceMeta.name}.mp4`);
const ffmpegLog = path.join(outputDir, 'ffmpeg-render.log');
const renderLog = path.join(outputDir, 'render.log');
const frameIndex = path.join(outputDir, 'frame-index.csv');
const args = ['-y', '-hide_banner', '-loglevel', 'info', '-f', 'image2pipe', '-framerate', String(timeline.fps), '-vcodec', 'png', '-i', 'pipe:0'];
if (audioArg) args.push('-i', path.resolve(audioArg), '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '160k', '-shortest');
else args.push('-map', '0:v:0');
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(timeline.fps), '-frames:v', String(timeline.frames), '-movflags', '+faststart', outMp4);

const ff = spawn(ffmpegPath, args, { stdio: ['pipe', 'ignore', 'pipe'] });
let ffLog = `COMMAND: ${ffmpegPath} ${args.join(' ')}\n`;
ff.stderr.on('data', (chunk) => { ffLog += chunk.toString(); });
const lines = ['frame,time_s,sha256,png_bytes'];
const renderLines = [
  `piece=${pieceMeta.name}`,
  `source=${path.join(pieceDir, 'index.html')}`,
  `format=${timeline.width}x${timeline.height}`,
  `fps=${timeline.fps}`,
  `frames=${timeline.frames}`,
  `duration=${timeline.duration}`,
  `started_utc=${new Date().toISOString()}`,
];

const writeChunk = async (chunk) => {
  if (!ff.stdin.write(chunk)) await new Promise((resolve) => ff.stdin.once('drain', resolve));
};

for (let frame = 0; frame < timeline.frames; frame += 1) {
  const time = frame / timeline.fps;
  const base64 = await page.evaluate(([f, fps]) => {
    window.renderFrame(f / fps);
    return document.getElementById('c').toDataURL('image/png').split(',')[1];
  }, [frame, timeline.fps]);
  const png = Buffer.from(base64, 'base64');
  const sha = createHash('sha256').update(png).digest('hex');
  lines.push(`${frame},${time.toFixed(6)},${sha},${png.length}`);
  const onHalfSecond = frame % Math.max(1, Math.round(timeline.fps / 2)) === 0;
  const explicitlyRequested = [...requestedTimes].some((t) => Math.round(t * timeline.fps) === frame);
  if (onHalfSecond || explicitlyRequested || frame === timeline.frames - 1) {
    fs.writeFileSync(path.join(evidenceDir, `f${String(frame).padStart(4, '0')}-${time.toFixed(3)}s.png`), png);
  }
  await writeChunk(png);
  if ((frame + 1) % timeline.fps === 0) renderLines.push(`rendered=${frame + 1}/${timeline.frames} at ${new Date().toISOString()}`);
}
ff.stdin.end();
const exitCode = await new Promise((resolve) => ff.on('close', resolve));
await browser.close();
renderLines.push(`ffmpeg_exit=${exitCode}`);
renderLines.push(`page_errors=${pageErrors.length}`);
if (pageErrors.length) renderLines.push(...pageErrors);
renderLines.push(`finished_utc=${new Date().toISOString()}`);
fs.writeFileSync(frameIndex, `${lines.join('\n')}\n`);
fs.writeFileSync(renderLog, `${renderLines.join('\n')}\n`);
fs.writeFileSync(ffmpegLog, ffLog);
if (exitCode !== 0 || pageErrors.length) process.exit(1);
console.log(`wrote ${outMp4}`);
