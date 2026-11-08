  // SCORE BODY — restrained guide audio only; formal Mandarin narration remains a separate deliverable.
  to = 's';
  [4.8, 7.2, 23.5, 26.2, 29.0, 101.5, 104.2, 106.9].forEach((t, i) => noiseHit(t, 0.07, 'bandpass', 460 + i * 20, 1.1, 0.022, i % 2 ? 0.1 : -0.1));
  [14.0, 16.2, 18.4, 35.0, 37.0, 39.0, 52.2, 56.0, 61.0, 65.0, 82.0, 85.0, 88.0, 91.0].forEach((t, i) => blip(t, 1250 + (i % 4) * 150, 850, 0.014, 0.018, 0.12));
