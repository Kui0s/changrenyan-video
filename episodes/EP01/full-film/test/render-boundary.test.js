const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

test('actual renderer keeps the adult and right-glute anchor continuous across frames 983 and 984', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href + '?export=1';
    await page.goto(url);
    await page.waitForFunction(() => window.TIMELINE && window.renderFrame && window.drawAdult);

    const capture = (frame) => page.evaluate((frameNumber) => {
      const original = window.drawAdult;
      const calls = [];
      window.drawAdult = function captureAdult(...args) {
        const result = original(...args);
        calls.push({
          gaitTime: args[0],
          x: args[1],
          groundY: args[2],
          scale: args[3],
          rightGlute: result.rightGlute,
        });
        return result;
      };
      window.renderFrame(frameNumber / window.TIMELINE.fps);
      window.drawAdult = original;
      return calls.at(-1);
    }, frame);

    const end04 = await capture(983);
    const start05 = await capture(984);
    assert.ok(end04 && start05, 'both boundary frames must draw person_01');
    assert.deepEqual(
      { x: start05.x, groundY: start05.groundY, scale: start05.scale },
      { x: end04.x, groundY: end04.groundY, scale: end04.scale },
    );
    const gaitAdvance = start05.gaitTime - end04.gaitTime;
    assert.ok(gaitAdvance > 0 && gaitAdvance <= 2 / 24 + 1e-6, JSON.stringify({ end04, start05 }));
    assert.ok(Math.hypot(
      start05.rightGlute[0] - end04.rightGlute[0],
      start05.rightGlute[1] - end04.rightGlute[1],
    ) < 5);
  } finally {
    await browser.close();
  }
});
