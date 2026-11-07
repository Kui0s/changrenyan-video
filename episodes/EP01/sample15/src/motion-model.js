(function defineMotionModel(root) {
  'use strict';

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const mix = (a, b, u) => a + (b - a) * u;
  const smooth = (u) => {
    const x = clamp01(u);
    return x * x * (3 - 2 * x);
  };

  function legState(phase, side) {
    const offset = side === 'left' ? 0 : Math.PI;
    const a = phase * Math.PI * 2 + offset;
    const stride = Math.sin(a);
    const lift = Math.max(0, -Math.cos(a));
    const hip = [0, 0];
    const knee = [stride * 54, 118 - lift * 34];
    const ankle = [stride * 92, 248 - lift * 62];
    const toe = [ankle[0] + 48 + 14 * Math.sin(a + 0.6), ankle[1] + 5 - lift * 8];
    return {
      planted: Math.cos(a) >= -0.001,
      hip,
      knee,
      ankle,
      toe,
      lift,
    };
  }

  function gaitState(progress) {
    const phase = ((progress % 1) + 1) % 1;
    return {
      phase,
      hipY: 780 + 10 * Math.cos(phase * Math.PI * 6),
      torsoLean: -0.04 + 0.025 * Math.sin(phase * Math.PI * 2),
      left: legState(phase, 'left'),
      right: legState(phase, 'right'),
      armSwing: Math.sin(phase * Math.PI * 2),
    };
  }

  function cameraState(time) {
    const u = smooth((time - 4) / 3);
    return {
      anchor: 'right-leg',
      zoom: mix(1, 4.25, u),
      focus: [mix(610, 690, u), mix(1010, 1110, u)],
      sectionReveal: smooth((time - 5.35) / 1.5),
    };
  }

  const glucoseStops = [
    { t: 7.0, region: 'blood', x: 250 },
    { t: 8.6, region: 'capillary-wall', x: 405 },
    { t: 10.3, region: 'interstitial', x: 550 },
    { t: 11.8, region: 'muscle-membrane', x: 710 },
    { t: 13.0, region: 'muscle-cell', x: 865 },
  ];

  function glucoseState(time) {
    if (time <= glucoseStops[0].t) return { ...glucoseStops[0], progress: 0 };
    for (let i = 1; i < glucoseStops.length; i += 1) {
      const a = glucoseStops[i - 1];
      const b = glucoseStops[i];
      if (time <= b.t) {
        const u = smooth((time - a.t) / (b.t - a.t));
        return {
          region: b.region,
          x: mix(a.x, b.x, u),
          progress: (i - 1 + u) / (glucoseStops.length - 1),
        };
      }
    }
    return { ...glucoseStops[glucoseStops.length - 1], progress: 1 };
  }

  const api = { gaitState, cameraState, glucoseState, glucoseStops };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EP01Motion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
