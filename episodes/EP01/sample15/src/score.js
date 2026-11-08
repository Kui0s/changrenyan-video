  // SCORE BODY — an original, voice-free technical sample.
  to = 's';
  [0.45, 1.7, 2.95, 4.2].forEach((t, i) => noiseHit(t, 0.08, 'bandpass', 520 + i * 35, 1.2, 0.035, i % 2 ? 0.12 : -0.12));
  for (let i = 0; i < 8; i++) blip(7.35 + i * 0.72, 1700 + (i % 3) * 180, 1100, 0.02, 0.02, 0.15);
