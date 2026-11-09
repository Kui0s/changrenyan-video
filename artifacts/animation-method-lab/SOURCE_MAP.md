# Animation method lab source map

Status: engineering evidence only. No independent visual or engineering reviewer has signed PASS.

## Fixed sources

- `cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263` (MIT).
- Vendored verbatim in `experiments/animation-method-lab/vendor/animate/`: `kit/core.js`, `kit/morph.js`, `styles/sketchbook/kit.js`, `tools/build.mjs`, and `LICENSE`.
- `lemomo-ai/lemo-opuscar` candidate checker files: `core/render/readcheck.mjs`, `page.mjs`, `serve.mjs`, and `browser.mjs`, with its MIT `LICENSE`, vendored only to execute the required Chinese reading/viewport contract.
- Project baseline: PR #12 research branch `research/animate-methods-transfer-v1`, reviewed head `f7da5bd5011ebf159536928baf106c5981ed04bd`.

## Function-level transfer

| Upstream source/function | New source/function | Reuse type | Purpose and boundary |
|---|---|---|---|
| `animate/kit/morph.js`: `renderFrame`, `byAngle`, `maskK`, `scaled` | `pieces/A` assembled page and `BRIDGES[0]` | Direct vendored execution | Real shrink → outline interpolation → grow chain. Not a PNG crossfade. |
| `animate/styles/sketchbook/kit.js`: `STYLE.window`, `STYLE.blob` | A bridge render | Direct vendored execution | Makes the old scene collapse through the starch outline, draws the intermediate outline, then expands from the glucose outline. |
| `animate/styles/sketchbook/kit.js`: `sketchPage`, `gline`, `gpencil`, `gfill`, `scribbleFill`, `handLetter` | A/B/C scene functions | Direct calls from original scenes | Preserves the selected paper, graphite/ink, terracotta and on-2s drawing language. New subject drawings are original lab code. |
| `animate/kit/morph.js`: camera idea (`camOf`/continuous transform) | `pieces/B/src/piece.js`: `cameraForB`, `drawSpace` | Reimplemented for the lab hierarchy | Continuous world transform locks on the left-thigh node. It is not claimed as a generic anatomy camera. |
| `lemo-opuscar/core/render/readcheck.mjs` | C `window.render`, `window.DUR`, `window.TEXTS` | External checker used unmodified | Confirms default reading dwell and 360×640 viewport. It does not check overlap. |
| Windows `System.Speech` / Microsoft Huihui Desktop | `scripts/generate-voice.ps1` | Local temporary TTS | Technical test only. It is not final narration and redistribution rights were not independently audited. |

## Original lab implementation

- `pieces/A/src/scenes.js`: original starch-chain and glucose-symbol outlines and two new scenes.
- `pieces/A/src/bridges.js`: new starch → glucose `BRIDGES` entry.
- `pieces/B/src/piece.js`: adult geometry, left-thigh world anchor, muscle cutaway, two distinct barriers, tracked glucose and return camera.
- `pieces/C/src/piece.js`: 360×640 Canvas mechanism view, three cue model, real subtitle drawing and `TEXTS(t)` boxes from the same cue model.
- `src/contracts.mjs` and `test/*.test.mjs`: executable time/LOD/barrier/subtitle/audio contracts.
- `scripts/render-piece.mjs`: deterministic every-frame browser render → FFmpeg image pipe, frame SHA index and evidence stills.
- `scripts/audit-c.mjs`: separate geometry-overlap, dwell, viewport and missing-interface negative checks.

## Old EP01 comparison (read only)

The old `codex/ep01-full-film` branch was downloaded only for comparison. Its `film-model.js` uses depth values from 41–78 seconds and blends `person/pelvis/fascicle/micro` layers with alpha. `scenes.js` applies `drawAnchoredLayer` with `ctx.globalAlpha`, translate and scale. This confirms the rejected sequence relied on layered alpha handoffs rather than the new A outline morph or the B world-camera proof. No old EP01 frame or media was reused.

## Media and rights

- No external raster, anatomy photograph, music or stock character is embedded.
- Chinese fonts are local Windows fonts (`Microsoft YaHei`/DengXian); glyphs are rendered into the video and no font file is redistributed.
- The A/B/C drawing code is new project code; the copied engine/style/checker files retain their upstream licenses.
