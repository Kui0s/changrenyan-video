# Final verification record

Executed from commit base `f7da5bd5011ebf159536928baf106c5981ed04bd` on 2026-11-09.

## Engineering checks (not a visual PASS)

- `npm test`: 8 passed, 0 failed.
- `npm run build`: A, B and C built successfully; syntax OK; no external assets.
- Unmodified upstream `readcheck.mjs --size 360x640`: all three cues OK.
- Separate browser audit: good exit 0; overlap exit 1; short dwell exit 1; outside viewport exit 1; missing interface exit 2 / NOT_CHECKED.
- Strict UTF-8 decode: 43 text/source/evidence files OK.

## Media decode

Each final MP4 was decoded from start to end with ffmpeg `-v error -f null -` and returned exit 0.

| File | Streams | Geometry | FPS | Duration | Bytes |
|---|---|---:|---:|---:|---:|
| `A.mp4` | H.264 | 1080x1920 | 24 | 5.000 s | 3,499,454 |
| `B.mp4` | H.264 | 1080x1920 | 24 | 20.000 s | 14,024,299 |
| `C-zh-voice.mp4` | H.264 + AAC | 360x640 | 24 | 13.500 s | 3,315,471 |

Frame-index row counts are A 120, B 480 and C 324. SHA-256 values were recomputed and exactly match `SHA256SUMS.txt`.

This record establishes reproducibility and playability only. Visual acceptance remains pending independent human review; the executor does not issue PASS.
