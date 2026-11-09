# Issue #13 engineering deliverables

Exact media:

- `A.mp4` — 5.0s A morph proof.
- `B.mp4` — 20.0s; B-space is 0–9s, B-mechanism is 9–20s.
- `C-zh-voice.mp4` — 13.5s temporary Mandarin/Canvas subtitle proof.

Evidence folders contain every-frame SHA256 CSV indexes, 0.5-second contact frames plus forced transition frames, raw render logs and FFmpeg logs. `B-initial/` is retained as the failed first camera target; `B/` is the one directed revision.

Rebuild from `experiments/animation-method-lab`:

```powershell
npm ci --ignore-scripts
npm test
node vendor/animate/tools/build.mjs pieces/A
node vendor/animate/tools/build.mjs pieces/B
node vendor/animate/tools/build.mjs pieces/C
pwsh -File scripts/generate-voice.ps1 -OutputDirectory ../../artifacts/animation-method-lab/C/audio
node scripts/mix-voice.mjs ../../artifacts/animation-method-lab/C/audio
$env:PLAYWRIGHT_CHROME='C:\Program Files\Google\Chrome\Application\chrome.exe'
node vendor/lemo-opuscar/core/render/readcheck.mjs pieces/C --size 360x640
node scripts/audit-c.mjs
node scripts/render-piece.mjs pieces/A ../../artifacts/animation-method-lab/A
node scripts/render-piece.mjs pieces/B ../../artifacts/animation-method-lab/B
node scripts/render-piece.mjs pieces/C ../../artifacts/animation-method-lab/C ../../artifacts/animation-method-lab/C/audio/temporary-zh-voice.wav
```

The local Windows run used Node 24.20.0, npm 11.19.0, PowerShell 7.6.9, Chrome, `playwright` 1.65.0, `ffmpeg-static` 5.3.0 and `ffprobe-static` 3.1.0. A clean second-machine rebuild was not performed and remains `CLEAN_REBUILD_NOT_VERIFIED`.
