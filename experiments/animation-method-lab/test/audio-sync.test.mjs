import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ffprobe from 'ffprobe-static';

const audioDir = path.resolve('../../artifacts/animation-method-lab/C/audio');
const plan = JSON.parse(fs.readFileSync(path.join(audioDir, 'cue-plan.json'), 'utf8'));

test('each generated Mandarin sentence fits its declared subtitle window', () => {
  for (const cue of plan.cues) {
    const duration = Number(execFileSync(ffprobe.path, [
      '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path.join(audioDir, `${cue.id}.wav`),
    ], { encoding: 'utf8' }).trim());
    const window = cue.end_s - cue.start_s;
    assert.ok(duration <= window, `${cue.id} audio ${duration.toFixed(3)}s exceeds subtitle window ${window.toFixed(3)}s`);
  }
});
