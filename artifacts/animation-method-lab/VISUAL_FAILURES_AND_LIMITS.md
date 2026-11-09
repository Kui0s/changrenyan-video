# Visual failures, limits and stop-loss record

This is the creator/engineering log, not an independent review and not a PASS certificate.

## A — shape morph

- Produced: `A.mp4`, 5.0 seconds, 1080×1920, 24 fps.
- Observable chain: starch scene shrinks into the selected outline; the isolated outline changes point-by-point; the glucose-symbol scene expands from the new outline.
- Boundary: the morph is an explanatory symbol transition. It does **not** portray digestion as an instantaneous physical conversion. A future narrative must separately show stepwise chain breakdown and absorption.
- Open visual question: an independent blind viewer must identify both endpoint objects and their relationship without reading this file.

## B-space — first render failed, one directed revision made

- Initial failure (`B-initial/`): camera target `(438,1110)` landed on the hip/pelvis area. At 3.75–6.0 seconds the intended thigh cutaway sat near the frame edge and the label collided with the drawing.
- Directed revision (`B/`): moved the camera target to the actual left-thigh node `(463,1280)` and regenerated all 480 frames.
- Revision result: the left thigh now stays centered through the cutaway and the camera returns to the same adult.
- Remaining limit: the adult is code-drawn geometric line art. It may still read as simplified/rigid rather than a production-quality credible person. The executor therefore records `PENDING_INDEPENDENT_VISUAL_REVIEW`, not PASS.
- Stop-loss route if the independent blind view still calls the person a rod figure or loses the body location: mark `B_SPACE 2D NOT READY`; replace the code-drawn person with licensed layered human illustration, or build the same node hierarchy in 2.5D/3D. Do not perform another cosmetic ellipse/label revision.

## B-mechanism

- Produced in the 9–20 second segment of `B.mp4`.
- The capillary wall and muscle-cell membrane are drawn as two different paired boundaries with an open interstitial region between them. One tracked glucose mark crosses the wall, pauses in the gap, crosses the cell membrane and remains in the muscle cell.
- The title explicitly says “生理原理与时间尺度示意”. The timing is not asserted to be physiological real time.
- Open scientific/visual question: a knowledgeable independent reviewer must check the abstraction and confirm the two barriers are distinguishable without the creator explanation.

## C — two real failures corrected

- First voice generation at SAPI rate `-1` produced 3.590s / 2.630s / 3.741s, exceeding the original cue windows. The audio-sync test failed; no video from that timing was accepted.
- Temporary rate `4` produced 2.080s / 1.533s / 2.171s. The cue windows were then expanded to meet the unmodified upstream readcheck defaults rather than weakening the check.
- Final unmodified `readcheck.mjs` results: c1 need/got 3.79/4.12s; c2 3.12/3.72s; c3 4.01/4.68s.
- Negative cases: overlap → `FAIL/exit 1`; 0.25s flash → `FAIL/exit 1`; viewport escape → `FAIL/exit 1`; missing interface/invalid duration → `NOT_CHECKED/exit 2`.
- Rights limit: the Microsoft Huihui voice is a local system TTS used only as a temporary engineering track. Redistribution rights were not independently audited; do not treat it as final licensed narration.
- Content limit: C proves the temporary pipeline only. Final CapCut AI/user narration must be re-timed and re-checked.

## Release boundary

- No old EP01 remake was performed.
- No production release or merge was performed.
- No independent GPT/Codex blind review was performed in this execution context.
- These artifacts are ready to be reviewed; they do not authorize a main-film claim or a 90-point claim.
