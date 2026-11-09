import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';

const dir = path.resolve(process.argv[2] || '../../artifacts/animation-method-lab/C/audio');
const output = path.join(dir, 'temporary-zh-voice.wav');
const args = [
  '-y', '-hide_banner', '-i', path.join(dir, 'c1.wav'), '-i', path.join(dir, 'c2.wav'), '-i', path.join(dir, 'c3.wav'),
  '-filter_complex',
  '[0:a]adelay=600|600[a0];[1:a]adelay=4800|4800[a1];[2:a]adelay=8600|8600[a2];[a0][a1][a2]amix=inputs=3:duration=longest:normalize=0,apad=pad_dur=13.5,atrim=duration=13.5[a]',
  '-map', '[a]', '-ar', '48000', '-ac', '2', output,
];
const result = spawnSync(ffmpeg, args, { encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'ffmpeg-voice-mix.log'), `COMMAND: ${ffmpeg} ${args.join(' ')}\n${result.stdout || ''}${result.stderr || ''}`);
if (result.status !== 0) process.exit(result.status || 1);
console.log(`wrote ${output}`);
