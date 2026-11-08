const test = require('node:test');
const assert = require('node:assert/strict');

const {
  FILM,
  SCENES,
  sceneAt,
  subtitleAt,
  observationWindows,
  SUBTITLE_LAYOUT,
} = require('../src/timeline.js');

test('full film is an eight-scene continuous 111-second timeline below the release cap', () => {
  assert.equal(FILM.duration, 111);
  assert.equal(FILM.fps, 24);
  assert.equal(FILM.frames, 2664);
  assert.ok(FILM.duration < 120);
  assert.equal(SCENES.length, 8);

  assert.equal(SCENES[0].start, 0);
  assert.equal(SCENES.at(-1).end, 111);
  for (let i = 1; i < SCENES.length; i += 1) {
    assert.equal(SCENES[i].start, SCENES[i - 1].end);
  }
  assert.equal(sceneAt(40.99).id, '04');
  assert.equal(sceneAt(41).id, '05');
  assert.equal(sceneAt(110.99).id, '08');
});

test('scene four has one foreground story and hands the same anatomical target to scene five', () => {
  const scene04 = SCENES.find((scene) => scene.id === '04');
  const scene05 = SCENES.find((scene) => scene.id === '05');

  assert.deepEqual(scene04.foregroundStories, ['blood-to-right-gluteus-medius']);
  assert.equal(scene04.targetId, 'right_gluteus_medius');
  assert.equal(scene05.targetId, scene04.targetId);
});

test('mandatory explanation windows stay independently readable', () => {
  const windows = observationWindows();
  const byId = Object.fromEntries(windows.map((window) => [window.id, window]));

  assert.ok(byId.time_compression.end - byId.time_compression.start >= 2);
  assert.ok(byId.capillary_wall.end - byId.capillary_wall.start >= 1.2);
  assert.ok(byId.muscle_membrane.end - byId.muscle_membrane.start >= 1.2);
  assert.ok(byId.research_limit.end - byId.research_limit.start >= 2);
  assert.ok(byId.final_takeaway.end - byId.final_takeaway.start >= 1.5);
});

test('every scene owns a non-empty Chinese subtitle during its narration window', () => {
  for (const scene of SCENES) {
    const probe = scene.start + Math.min(1, (scene.end - scene.start) / 2);
    const subtitle = subtitleAt(probe);
    assert.equal(subtitle.sceneId, scene.id);
    assert.match(subtitle.text, /[\u3400-\u9fff]/u);
  }
});

test('subtitle panel remains above the phone bottom safe zone', () => {
  assert.ok(SUBTITLE_LAYOUT, 'timeline must expose the subtitle layout contract');
  assert.ok(SUBTITLE_LAYOUT.y + SUBTITLE_LAYOUT.height <= 1530);
  assert.ok(SUBTITLE_LAYOUT.lineCount <= 4);
});
