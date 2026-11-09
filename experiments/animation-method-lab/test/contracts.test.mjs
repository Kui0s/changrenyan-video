import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CUES,
  auditTexts,
  barrierStateAt,
  cameraAt,
  interpolateOutline,
  lodAt,
  normalizeChineseSafe,
  textsAt,
} from '../src/contracts.mjs';

test('A outline interpolation produces a real midpoint rather than an endpoint switch', () => {
  const a = [[0, 0], [4, 0], [4, 2], [0, 2]];
  const b = [[1, -1], [3, -1], [5, 1], [3, 3]];
  assert.deepEqual(interpolateOutline(a, b, 0), a);
  assert.deepEqual(interpolateOutline(a, b, 1), b);
  assert.deepEqual(interpolateOutline(a, b, 0.5), [[0.5, -0.5], [3.5, -0.5], [4.5, 1.5], [1.5, 2.5]]);
});

test('B-space camera enters the left thigh and returns to the same adult', () => {
  assert.deepEqual(cameraAt(0), { z: 1, x: 540, y: 920, phase: 'adult' });
  assert.equal(cameraAt(4).phase, 'thigh');
  assert.ok(cameraAt(4).z > 2.5);
  assert.deepEqual(cameraAt(4.5), { z: 3.4, x: 463, y: 1280, phase: 'thigh-cutaway' });
  assert.deepEqual(cameraAt(8.5), { z: 1, x: 540, y: 920, phase: 'adult-return' });
  assert.equal(lodAt(0), 'adult');
  assert.equal(lodAt(4), 'muscle-cutaway');
});

test('B-mechanism orders two distinct barriers with extracellular space between', () => {
  assert.equal(barrierStateAt(10.5).region, 'capillary-lumen');
  assert.equal(barrierStateAt(12.2).crossing, 'capillary-wall');
  assert.equal(barrierStateAt(14.0).region, 'interstitial-space');
  assert.equal(barrierStateAt(16.0).crossing, 'muscle-cell-membrane');
  assert.equal(barrierStateAt(18.0).region, 'muscle-cell');
});

test('C exposes complete Chinese subtitle boxes for active cues', () => {
  assert.deepEqual(textsAt(0.5), []);
  const active = textsAt(1.2);
  assert.equal(active.length, 1);
  assert.equal(active[0].id, 'c1');
  assert.match(active[0].text, /葡萄糖/);
  assert.deepEqual([active[0].x0, active[0].y0, active[0].x1, active[0].y1], [24, 520, 336, 598]);
});

test('C subtitle windows satisfy the upstream default Chinese reading-time rule', () => {
  for (const cue of CUES) {
    const han = [...cue.text].filter((character) => /\p{Script=Han}/u.test(character)).length;
    const other = [...cue.text].filter((character) => !/\s/u.test(character) && !/\p{Script=Han}/u.test(character)).length;
    const needed = Math.max(1.5, han / 4.5 + other / 15 + 1.5);
    assert.ok(cue.end_s - cue.start_s >= needed, `${cue.id} needs ${needed.toFixed(2)}s`);
  }
});

test('C audit catches overlap, short dwell, viewport escape and missing interface', () => {
  assert.equal(auditTexts({ mode: 'good', width: 360, height: 640 }).status, 'PASS');
  assert.equal(auditTexts({ mode: 'overlap', width: 360, height: 640 }).code, 'OVERLAP');
  assert.equal(auditTexts({ mode: 'short', width: 360, height: 640 }).code, 'BAD_DWELL');
  assert.equal(auditTexts({ mode: 'outside', width: 360, height: 640 }).code, 'OUTSIDE_VIEWPORT');
  assert.equal(auditTexts({ mode: 'missing-interface', width: 360, height: 640 }).status, 'NOT_CHECKED');
});

test('Chinese-safe normalization never erases key Chinese terms', () => {
  assert.equal(normalizeChineseSafe(' 葡萄糖，进入肌肉细胞！ '), '葡萄糖进入肌肉细胞');
  assert.notEqual(normalizeChineseSafe('葡萄糖'), '');
});
