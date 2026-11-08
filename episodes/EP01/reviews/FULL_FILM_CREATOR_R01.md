# EP01 full-film creator delivery R01

## Scope

Creator-side implementation of the eight-scene, 111-second, 9:16 full film authorized in Issue #10. The reviewed story baseline remains `b1d7dde6f591837d57e15af7a5866207992e2367`.

## Delivered behavior

- One normal adult `person_01` walks with grounded alternating stance feet.
- Scene 04 follows one blood route to the right gluteus medius.
- Scenes 05 and 06 enter and exit through the same anatomical anchor.
- Glucose crosses the capillary wall, interstitium, and muscle membrane in order.
- Scene 02 explicitly marks compressed explanatory time.
- Scene 07 presents eight short-term trials with visible limitations and uncertainty.
- Scene 08 avoids a longevity promise and ends with a qualified activity takeaway.

## Creator verification

- Automated contract tests: 26 passed, 0 failed, including an actual Playwright renderer probe at frames 983/984, parent/child scale-layer overlap, 05→06 inheritance, and commit-plus-hash render lineage enforcement.
- Build: syntax valid; no external runtime assets.
- Full-film review: story arc PASS; no flat frames; dead beats PASS with 0 stretches over 3 seconds.
- Text trace: PASS with 0 cut-off/overlap and 0 phone safe-zone warnings across 452 sampled frames.
- Decode: 1080×1920, 24 fps, 2664 frames, 111 seconds.
- Continuity evidence: 04's final adult pose and right-glute anchor are reused at 05's first frame; pelvis, glute, fascicle, and micro layers expand from their parent anchor while the parent remains visible; 06 begins from 05's terminal myocyte state.
- Phone preview, per-scene 0.5-second sheets, character poses, 04–06 scale journey, ffprobe data, logs, hashes, clean master, guide-audio master, and SRT are included in the release package.

## Unclaimed gates

The guide audio is not formal Mandarin narration. A-dimension narration review, independent full-video review, independent engineering review, user release approval, merge, and publication remain outside this creator delivery.
