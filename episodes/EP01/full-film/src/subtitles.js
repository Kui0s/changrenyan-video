'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { SCENES } = require('./timeline.js');

function formatSrtTime(seconds) {
  const totalMilliseconds = Math.max(0, Math.round(seconds * 1000));
  const milliseconds = totalMilliseconds % 1000;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const secs = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const pad = (value, width) => String(value).padStart(width, '0');
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(milliseconds, 3)}`;
}

function toSrt(scenes = SCENES) {
  return scenes.map((scene, index) => [
    String(index + 1),
    `${formatSrtTime(scene.start)} --> ${formatSrtTime(scene.end)}`,
    scene.subtitle,
  ].join('\n')).join('\n\n') + '\n';
}

function writeSrt(outputPath) {
  const resolved = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, toSrt(), { encoding: 'utf8' });
  return resolved;
}

if (require.main === module) {
  if (!process.argv[2]) {
    process.stderr.write('usage: node subtitles.js <output.srt>\n');
    process.exitCode = 2;
  } else {
    process.stdout.write(writeSrt(process.argv[2]) + '\n');
  }
}

module.exports = { formatSrtTime, toSrt, writeSrt };
