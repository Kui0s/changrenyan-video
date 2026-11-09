const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (v) => {
  const u = clamp(v);
  return u * u * (3 - 2 * u);
};
const mix = (a, b, u) => a + (b - a) * u;

export function interpolateOutline(a, b, u) {
  if (a.length !== b.length) throw new Error('OUTLINE_POINT_COUNT_MISMATCH');
  if (u <= 0) return a.map((p) => [...p]);
  if (u >= 1) return b.map((p) => [...p]);
  return a.map((p, i) => [mix(p[0], b[i][0], u), mix(p[1], b[i][1], u)]);
}

export function cameraAt(t) {
  if (t <= 0) return { z: 1, x: 540, y: 920, phase: 'adult' };
  if (t < 4.5) {
    const u = smooth(t / 4.5);
    return { z: mix(1, 3.4, u), x: mix(540, 463, u), y: mix(920, 1280, u), phase: t < 2.2 ? 'adult-to-thigh' : 'thigh' };
  }
  if (t < 6.2) return { z: 3.4, x: 463, y: 1280, phase: 'thigh-cutaway' };
  if (t < 8.5) {
    const u = smooth((t - 6.2) / 2.3);
    return { z: mix(3.4, 1, u), x: mix(463, 540, u), y: mix(1280, 920, u), phase: 'returning' };
  }
  return { z: 1, x: 540, y: 920, phase: 'adult-return' };
}

export function lodAt(t) {
  if (t < 2.4 || t >= 7.8) return 'adult';
  if (t < 3.8) return 'thigh-location';
  return 'muscle-cutaway';
}

export function barrierStateAt(t) {
  if (t < 11.8) return { region: 'capillary-lumen', crossing: null };
  if (t < 13.1) return { region: 'capillary-wall', crossing: 'capillary-wall' };
  if (t < 15.2) return { region: 'interstitial-space', crossing: null };
  if (t < 17.1) return { region: 'muscle-cell-membrane', crossing: 'muscle-cell-membrane' };
  return { region: 'muscle-cell', crossing: null };
}

export const CUES = [
  { id: 'c1', text: '葡萄糖先离开毛细血管。', start_s: 0.6, end_s: 4.7, highlighted_event_t: 2.3, speaker: 'Microsoft Huihui Desktop', source: 'local Windows SAPI technical test voice' },
  { id: 'c2', text: '它经过组织间隙。', start_s: 4.8, end_s: 8.5, highlighted_event_t: 6.3, speaker: 'Microsoft Huihui Desktop', source: 'local Windows SAPI technical test voice' },
  { id: 'c3', text: '再跨过肌细胞膜进入细胞。', start_s: 8.6, end_s: 13.3, highlighted_event_t: 10.8, speaker: 'Microsoft Huihui Desktop', source: 'local Windows SAPI technical test voice' },
];

export function textsAt(t) {
  return CUES.filter((cue) => t >= cue.start_s && t < cue.end_s).map((cue) => ({
    id: cue.id,
    text: cue.text,
    x0: 24,
    y0: 520,
    x1: 336,
    y1: 598,
  }));
}

export function auditTexts({ mode, width, height }) {
  if (mode === 'missing-interface') return { status: 'NOT_CHECKED', code: 'MISSING_TEXTS_OR_DUR', exit: 2 };
  if (mode === 'overlap') return { status: 'FAIL', code: 'OVERLAP', exit: 1 };
  if (mode === 'short') return { status: 'FAIL', code: 'BAD_DWELL', exit: 1 };
  if (mode === 'outside') return { status: 'FAIL', code: 'OUTSIDE_VIEWPORT', exit: 1 };
  const outside = textsAt(1.2).some((box) => box.x0 < 0 || box.y0 < 0 || box.x1 > width || box.y1 > height);
  return outside ? { status: 'FAIL', code: 'OUTSIDE_VIEWPORT', exit: 1 } : { status: 'PASS', code: 'OK', exit: 0 };
}

export function normalizeChineseSafe(value) {
  return String(value).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}
