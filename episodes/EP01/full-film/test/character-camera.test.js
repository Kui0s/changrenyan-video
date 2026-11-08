const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ANCHOR_CHAIN,
  characterPose,
  walkerState,
  scaleJourneyAt,
  glucoseState,
  ambientMotionAt,
} = require('../src/film-model.js');

test('person_01 has adult proportions, connected body volumes, and visible shoes', () => {
  const pose = characterPose('P0', 0);

  assert.equal(pose.id, 'person_01');
  assert.ok(pose.headsTall >= 6.8 && pose.headsTall <= 7.2);
  assert.ok(pose.shoulderWidth / pose.headWidth >= 1.8);
  assert.ok(pose.shoulderWidth / pose.headWidth <= 2.2);
  assert.ok(pose.neck.bottomY <= pose.torso.topY + 8);
  assert.ok(pose.torso.bottomY <= pose.pelvis.topY + 8);
  assert.ok(pose.leftLeg.hipY >= pose.pelvis.topY);
  assert.ok(pose.rightLeg.hipY >= pose.pelvis.topY);
  assert.ok(pose.leftLeg.shoe.length >= pose.headWidth * 0.8);
  assert.ok(pose.rightLeg.shoe.length >= pose.headWidth * 0.8);
});

test('alternating stance feet remain grounded and locked in world space', () => {
  const leftStance = [0.1, 0.3, 0.5].map((time) => walkerState(time));
  const rightStance = [0.8, 1.0, 1.2].map((time) => walkerState(time));

  for (const state of leftStance) {
    assert.equal(state.left.planted, true);
    assert.ok(Math.abs(state.left.shoe.soleY - state.groundY) < 0.001);
  }
  for (const state of rightStance) {
    assert.equal(state.right.planted, true);
    assert.ok(Math.abs(state.right.shoe.soleY - state.groundY) < 0.001);
  }
  assert.ok(Math.max(...leftStance.map((s) => s.left.shoe.toeX)) - Math.min(...leftStance.map((s) => s.left.shoe.toeX)) < 0.001);
  assert.ok(Math.max(...rightStance.map((s) => s.right.shoe.toeX)) - Math.min(...rightStance.map((s) => s.right.shoe.toeX)) < 0.001);
});

test('macro-to-micro camera uses the reviewed right gluteus chain and returns to the same person', () => {
  assert.deepEqual(ANCHOR_CHAIN, [
    'person_01',
    'right_pelvis',
    'right_gluteus_medius',
    'selected_fascicle',
    'capillary_A',
    'interstitium_B',
    'myocyte_C',
  ]);

  const samples = [39, 41, 45, 50, 56, 63, 66, 72, 78].map(scaleJourneyAt);
  assert.ok(samples[3].depth > samples[2].depth);
  assert.ok(samples[4].depth > samples[3].depth);
  assert.ok(samples[5].depth >= samples[4].depth);
  assert.ok(samples[7].depth < samples[6].depth);
  assert.equal(samples[0].personId, 'person_01');
  assert.equal(samples.at(-1).personId, 'person_01');
  assert.ok(samples.every((sample) => sample.targetId === 'right_gluteus_medius'));
});

test('glucose crosses the two distinct biological boundaries in order and is not reversed on camera exit', () => {
  const checkpoints = [51, 55, 58, 62, 65, 72].map(glucoseState);
  assert.deepEqual(checkpoints.slice(0, 5).map((state) => state.region), [
    'blood',
    'capillary-wall',
    'interstitium',
    'muscle-membrane',
    'muscle-cell',
  ]);
  for (let i = 1; i < checkpoints.length; i += 1) {
    assert.ok(checkpoints[i].progress >= checkpoints[i - 1].progress);
  }
  assert.equal(checkpoints.at(-1).region, 'muscle-cell');
});

test('long explanation holds retain visible ambient motion instead of becoming slides', () => {
  const digestion = [18, 19, 20, 21].map((time) => ambientMotionAt('02', time));
  const evidenceA = [80.25, 81.25, 82.25, 83.25].map((time) => ambientMotionAt('07', time));
  const evidenceB = [89.75, 90.75, 91.75, 92.75].map((time) => ambientMotionAt('07', time));

  for (const samples of [digestion, evidenceA, evidenceB]) {
    assert.ok(new Set(samples.map((sample) => sample.scan.toFixed(3))).size >= 3);
    assert.ok(new Set(samples.map((sample) => sample.pulse.toFixed(3))).size >= 3);
  }
});
