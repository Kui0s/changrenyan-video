# EP01 original 15-second sample delivery

- Source commit: `0f013943be1efd19241b1e05d80f81634874a0d0`
- Upstream engine: `cth9191/animate@7e5eb56feb2dd573f890e1b7b34748af43d58263`
- Master video: `sample.mp4`
- Master SHA-256: `35c34196e4a57e7503647f554ae8aafb35c193fdaa6b81d5ad09c127e78ad29a`
- Phone preview: `sample-phone-360x640.mp4`
- Format: 1080×1920, 24fps, 360 frames, 15.000 seconds, H.264/AAC

## What is implemented

1. 0–4s: an original articulated character performs at least three alternating steps with visible hip, knee, ankle, arm, and centre-of-mass changes.
2. 4–7s: the camera follows the same moving right leg and opens a local calf cutaway before expanding into the tissue view.
3. 7–13s: one highlighted glucose marker moves from blood across the capillary wall, through interstitial space, and through a distinct transporter in the muscle-cell membrane; the muscle cell contracts and relaxes.
4. 13–15s: the completed route and both boundaries remain visible for reading.

The line “不是‘三步降糖’” explicitly prevents the motion test from implying that three steps immediately lower blood glucose. The diagram also states that time and scale are compressed.

## Evidence

- `contact-sheet-0.5s.png`: one frame every 0.5 seconds.
- `shot01-sheet.jpg`–`shot04-sheet.jpg`: shot-level 0.25-second sequences.
- `phone.jpg`: one frame per second at 360px width.
- `ffprobe.json`: stream, duration, frame-count, and codec evidence.
- `logs/tests.log`: motion-model tests.
- `logs/tile.log`: deterministic second render of all sampled frames.
- `logs/review.log`: upstream review; text, dead beats, flat frames, and story checks pass.
- `logs/frame-integrity.log`: no black-frame report. The detector flags 13.25–15.00 as low-change intervals; this is the specified reading hold, and the Sketchbook boil still updates on its two-frame cadence.
- `environment.txt`: tool, upstream, and Chinese-font versions/hashes.
- `manifest.sha256`: hashes for the full evidence package.

## Not completed or not claimed

- This sample uses temporary synthesized effects, not final Mandarin narration.
- No clean second-machine rebuild or CI rebuild is claimed.
- The implementation author does not issue the final quality PASS. Independent visual/scientific and source/toolchain reviews remain required under `episodes/EP01/QA_HANDOFF.md`.
- This does not authorize or implement the full EP01 video, merge the PR, or publish media.
