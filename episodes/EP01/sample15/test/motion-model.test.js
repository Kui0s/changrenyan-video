const test = require('node:test');
const assert = require('node:assert/strict');

const {
  gaitState,
  cameraState,
  glucoseState,
} = require('../src/motion-model.js');

test('gait alternates planted feet while keeping joint motion continuous', () => {
  const samples = [0, 0.25, 0.5, 0.75, 1].map((t) => gaitState(t));

  assert.equal(samples[0].left.planted, true);
  assert.equal(samples[2].right.planted, true);
  assert.equal(samples[4].left.planted, true);
  for (let i = 1; i < samples.length; i += 1) {
    assert.ok(Math.abs(samples[i].hipY - samples[i - 1].hipY) <= 22);
    assert.ok(Math.abs(samples[i].left.knee[0] - samples[i - 1].left.knee[0]) <= 90);
    assert.ok(Math.abs(samples[i].right.ankle[1] - samples[i - 1].right.ankle[1]) <= 75);
  }
});

test('camera follows the same right-leg anchor before entering the tissue view', () => {
  const start = cameraState(4.0);
  const middle = cameraState(5.5);
  const end = cameraState(7.0);

  assert.equal(start.anchor, 'right-leg');
  assert.equal(middle.anchor, 'right-leg');
  assert.equal(end.anchor, 'right-leg');
  assert.ok(middle.zoom > start.zoom);
  assert.ok(end.zoom > middle.zoom);
  assert.ok(Math.abs(middle.focus[0] - start.focus[0]) < 220);
});

test('glucose crosses capillary wall, interstitial space, and muscle membrane in order', () => {
  const checkpoints = [7.0, 8.6, 10.3, 11.8, 13.0].map((t) => glucoseState(t));

  assert.deepEqual(checkpoints.map((s) => s.region), [
    'blood',
    'capillary-wall',
    'interstitial',
    'muscle-membrane',
    'muscle-cell',
  ]);
  for (let i = 1; i < checkpoints.length; i += 1) {
    assert.ok(checkpoints[i].x > checkpoints[i - 1].x);
  }
});
