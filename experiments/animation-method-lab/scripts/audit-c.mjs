import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const piece = path.resolve('pieces/C/index.html');
const outDir = path.resolve('../../artifacts/animation-method-lab/C/audit');
fs.mkdirSync(outDir, { recursive: true });
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files'] });

const overlaps = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
async function run(mode) {
  const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(piece).href);
  await page.waitForFunction(() => typeof window.render === 'function');
  await page.evaluate((selectedMode) => {
    const real = window.TEXTS;
    if (selectedMode === 'overlap') window.TEXTS = (t) => t >= 1 && t < 3 ? [
      { id: 'n1', text: '重叠字幕一', x0: 24, y0: 520, x1: 336, y1: 598 },
      { id: 'n2', text: '重叠字幕二', x0: 40, y0: 540, x1: 320, y1: 612 },
    ] : [];
    if (selectedMode === 'short') window.TEXTS = (t) => t >= 1.2 && t < 1.45 ? [{ id: 'short', text: '短暂闪现不足阅读', x0: 24, y0: 520, x1: 336, y1: 598 }] : [];
    if (selectedMode === 'outside') window.TEXTS = (t) => t >= 1 && t < 3 ? [{ id: 'outside', text: '越界字幕', x0: 24, y0: 520, x1: 390, y1: 598 }] : [];
    if (selectedMode === 'missing-interface') { delete window.TEXTS; window.DUR = 0; }
    if (selectedMode === 'good') window.TEXTS = real;
  }, mode);
  const result = await page.evaluate(() => {
    if (typeof window.render !== 'function' || typeof window.TEXTS !== 'function' || !(window.DUR > 0)) return { status: 'NOT_CHECKED', code: 'MISSING_TEXTS_OR_DUR', exit: 2, frame: null };
    const fps = 24, all = [];
    for (let f = 0; f <= Math.round(window.DUR * fps); f += 1) {
      const t = f / fps; window.render(t); const boxes = window.TEXTS(t) || [];
      all.push({ f, t, boxes });
    }
    for (const row of all) for (let i = 0; i < row.boxes.length; i += 1) for (let j = i + 1; j < row.boxes.length; j += 1) {
      const a = row.boxes[i], b = row.boxes[j];
      if (a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0) return { status: 'FAIL', code: 'OVERLAP', exit: 1, frame: row.f };
    }
    for (const row of all) for (const b of row.boxes) if (b.x0 < 0 || b.y0 < 0 || b.x1 > 360 || b.y1 > 640) return { status: 'FAIL', code: 'OUTSIDE_VIEWPORT', exit: 1, frame: row.f };
    const spans = new Map();
    for (const row of all) for (const b of row.boxes) {
      const span = spans.get(b.id) || { text: b.text, first: row.f, last: row.f }; span.last = row.f; spans.set(b.id, span);
    }
    for (const [id, span] of spans) {
      const dwell = (span.last - span.first + 1) / fps;
      const needed = Math.max(1, span.text.length * 0.08);
      if (dwell < needed) return { status: 'FAIL', code: 'BAD_DWELL', exit: 1, frame: span.first, id, dwell, needed };
    }
    return { status: 'PASS', code: 'OK', exit: 0, frame: 29 };
  });
  const captureFrame = result.frame ?? 0;
  await page.evaluate(([f, selectedMode]) => {
    const t = f / 24; window.render(t); const boxes = typeof window.TEXTS === 'function' ? (window.TEXTS(t) || []) : [];
    const c = document.getElementById('c'), g = c.getContext('2d');
    g.save(); g.strokeStyle = selectedMode === 'good' ? '#4f9d5d' : '#e0483a'; g.lineWidth = 3;
    for (const b of boxes) g.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
    g.restore();
  }, [captureFrame, mode]);
  await page.locator('canvas').screenshot({ path: path.join(outDir, `${mode}-f${String(captureFrame).padStart(4, '0')}.png`) });
  await page.close();
  return { mode, ...result, evidence_frame: captureFrame };
}

const modes = ['good', 'overlap', 'short', 'outside', 'missing-interface'];
const results = [];
for (const mode of modes) results.push(await run(mode));
await browser.close();
fs.writeFileSync(path.join(outDir, 'negative-cases.jsonl'), `${results.map((r) => JSON.stringify(r)).join('\n')}\n`);
console.log(results);
if (results[0].status !== 'PASS' || results.slice(1).some((r) => r.status === 'PASS')) process.exit(1);
