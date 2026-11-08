const test = require('node:test');
const assert = require('node:assert/strict');

const {
  gaitState,
  walkerState,
  cameraState,
  calfAnchor,
  worldToSampleScreen,
  glucoseState,
  transitionState,
  muscleState,
  MICRO_LAYOUT,
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

test('support foot stays on the ground without sliding during each stance', () => {
  const leftStance = [0.1, 0.3, 0.5].map((t) => walkerState(t));
  const rightStance = [0.8, 1.0, 1.2].map((t) => walkerState(t));

  for (const state of leftStance) {
    assert.equal(state.left.planted, true);
    assert.ok(Math.abs(state.left.toe[1] - state.groundY) < 0.001);
  }
  for (const state of rightStance) {
    assert.equal(state.right.planted, true);
    assert.ok(Math.abs(state.right.toe[1] - state.groundY) < 0.001);
  }
  assert.ok(Math.max(...leftStance.map((s) => s.left.toe[0])) - Math.min(...leftStance.map((s) => s.left.toe[0])) < 0.001);
  assert.ok(Math.max(...rightStance.map((s) => s.right.toe[0])) - Math.min(...rightStance.map((s) => s.right.toe[0])) < 0.001);
});

test('camera follows the supplied right-leg joint target before entering the tissue view', () => {
  const target = [684, 1088];
  const start = cameraState(4.0, target);
  const middle = cameraState(5.5, target);
  const end = cameraState(7.0, target);

  assert.equal(start.anchor, 'right-leg');
  assert.equal(middle.anchor, 'right-leg');
  assert.equal(end.anchor, 'right-leg');
  assert.ok(middle.zoom > start.zoom);
  assert.ok(end.zoom > middle.zoom);
  assert.deepEqual(end.focus, target);
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
  assert.ok(checkpoints[1].x >= MICRO_LAYOUT.capillaryWall[0]);
  assert.ok(checkpoints[1].x <= MICRO_LAYOUT.capillaryWall[1]);
  assert.ok(checkpoints[2].x > MICRO_LAYOUT.capillaryWall[1]);
  assert.ok(checkpoints[2].x < MICRO_LAYOUT.muscleMembrane[0]);
  assert.ok(checkpoints[3].x >= MICRO_LAYOUT.muscleMembrane[0]);
  assert.ok(checkpoints[3].x <= MICRO_LAYOUT.muscleMembrane[1]);
});

test('transition fades the walker before the microscopic diagram fills the page', () => {
  const walker = walkerState(5.25);
  const worldAnchor = calfAnchor(walker);
  const screenAnchor = worldToSampleScreen(worldAnchor, cameraState(5.25, worldAnchor));
  const start = transitionState(5.25, screenAnchor);
  const middle = transitionState(6.1, screenAnchor);
  const end = transitionState(6.8, screenAnchor);

  assert.ok(start.macroAlpha > 0.9);
  assert.ok(start.microAlpha < 0.1);
  assert.deepEqual(start.microOrigin, screenAnchor);
  assert.ok(middle.macroAlpha < 0.55);
  assert.ok(middle.microAlpha > 0.45);
  assert.ok(middle.microOrigin[0] >= Math.min(540, screenAnchor[0]));
  assert.ok(middle.microOrigin[0] <= Math.max(540, screenAnchor[0]));
  assert.equal(end.macroAlpha, 0);
  assert.equal(end.microAlpha, 1);
  assert.deepEqual(end.microOrigin, [540, 930]);
  assert.ok(start.microScale < middle.microScale);
  assert.ok(middle.microScale < end.microScale);
});

test('muscle contraction is visible at phone scale while preserving cell area directionally', () => {
  const relaxed = muscleState(7.0);
  const contracted = muscleState(7.4);

  assert.ok(relaxed.width - contracted.width >= 40);
  assert.ok(contracted.height - relaxed.height >= 55);
});
