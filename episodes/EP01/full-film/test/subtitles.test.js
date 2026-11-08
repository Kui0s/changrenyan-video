const test = require('node:test');
const assert = require('node:assert/strict');

const { SCENES } = require('../src/timeline.js');
const { formatSrtTime, toSrt } = require('../src/subtitles.js');

test('SRT time formatting handles the full-film minute boundary', () => {
  assert.equal(formatSrtTime(0), '00:00:00,000');
  assert.equal(formatSrtTime(66), '00:01:06,000');
  assert.equal(formatSrtTime(110.999), '00:01:50,999');
});

test('subtitle export contains all eight reviewed narration segments and ends at 111 seconds', () => {
  const srt = toSrt(SCENES);
  const blocks = srt.trim().split(/\r?\n\r?\n/u);

  assert.equal(blocks.length, 8);
  assert.match(blocks[0], /^1\n00:00:00,000 --> 00:00:10,000\n/u);
  assert.match(blocks[4], /^5\n00:00:41,000 --> 00:01:06,000\n/u);
  assert.match(blocks[7], /^8\n00:01:39,000 --> 00:01:51,000\n/u);
  assert.match(srt, /研究规模有限/u);
  assert.match(srt, /不能证明散步就能活到九十九/u);
});
