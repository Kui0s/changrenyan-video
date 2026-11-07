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
    const lane = side === 'left' ? -12 : 12;
    const knee = [lane + stride * 42, 118 - lift * 38];
    const ankle = [lane + stride * 72, 248 - lift * 66];
    const toe = [ankle[0] + 46 + 12 * Math.sin(a + 0.6), ankle[1] + 5 - lift * 10];
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

  function cameraState(time, target = [690, 1110]) {
    const u = smooth((time - 4) / 3);
    return {
      anchor: 'right-leg',
      zoom: mix(1, 2.65, u),
      focus: [mix(540, target[0], u), mix(1030, target[1], u)],
      sectionReveal: smooth((time - 5.35) / 1.5),
    };
  }

  function transitionState(time) {
    const macroAlpha = 1 - smooth((time - 5.25) / 1.15);
    const microAlpha = smooth((time - 5.25) / 1.35);
    return {
      macroAlpha,
      microAlpha,
      microScale: mix(0.12, 1, microAlpha),
    };
  }

  function muscleState(time) {
    const contraction = time < 13 ? Math.max(0, Math.sin((time - 7) * Math.PI * 1.25)) : 0;
    return {
      contraction,
      width: 316 - contraction * 48,
      height: 690 + contraction * 72,
    };
  }

  const MICRO_LAYOUT = Object.freeze({
    vesselOuter: Object.freeze({ x: 92, y: 510, w: 330, h: 760 }),
    vesselInner: Object.freeze({ x: 116, y: 538, w: 282, h: 704 }),
    muscleBase: Object.freeze({ x: 728, y: 535, w: 316, h: 690 }),
    capillaryWall: Object.freeze([398, 422]),
    interstitial: Object.freeze([422, 708]),
    muscleMembrane: Object.freeze([708, 750]),
  });

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

  const api = {
    gaitState,
    cameraState,
    transitionState,
    muscleState,
    glucoseState,
    glucoseStops,
    MICRO_LAYOUT,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EP01Motion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
