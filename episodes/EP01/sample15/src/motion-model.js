(function defineMotionModel(root) {
  'use strict';

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const mix = (a, b, u) => a + (b - a) * u;
  const smooth = (u) => {
    const x = clamp01(u);
    return x * x * (3 - 2 * x);
  };

  const phase01 = (value) => ((value % 1) + 1) % 1;

  function legState(phase, side, groundFromHip) {
    const p = phase01(phase + (side === 'right' ? 0.5 : 0));
    const planted = p < 0.5;
    const u = planted ? p / 0.5 : (p - 0.5) / 0.5;
    const lift = planted ? 0 : Math.sin(Math.PI * u) * 72;
    const hip = [0, 0];
    const lane = side === 'left' ? -8 : 8;
    const toeX = planted ? 45 - 90 * u : mix(-45, 45, smooth(u));
    const toe = [lane + toeX, groundFromHip - lift];
    const ankle = [toe[0] - 44, toe[1] - 6 - (planted ? 0 : Math.sin(Math.PI * u) * 8)];
    const knee = [lane + ankle[0] * 0.48 + 24, ankle[1] * 0.52 - lift * 0.08];
    return {
      planted,
      hip,
      knee,
      ankle,
      toe,
      lift,
    };
  }

  function gaitState(progress) {
    const phase = phase01(progress);
    const groundY = 1060;
    const hipY = 805 + 10 * Math.cos(phase * Math.PI * 4);
    return {
      phase,
      groundY,
      hipY,
      torsoLean: -0.04 + 0.025 * Math.sin(phase * Math.PI * 2),
      left: legState(phase, 'left', groundY - hipY),
      right: legState(phase, 'right', groundY - hipY),
      armSwing: Math.sin(phase * Math.PI * 2),
    };
  }

  function walkerState(time) {
    const gait = gaitState(time * 0.75);
    const worldX = 170 + time * 135;
    const absoluteLeg = (leg, hipX) => ({
      ...leg,
      hip: [hipX, gait.hipY],
      knee: [hipX + leg.knee[0], gait.hipY + leg.knee[1]],
      ankle: [hipX + leg.ankle[0], gait.hipY + leg.ankle[1]],
      toe: [hipX + leg.toe[0], gait.hipY + leg.toe[1]],
    });
    return {
      ...gait,
      worldX,
      left: absoluteLeg(gait.left, worldX - 28),
      right: absoluteLeg(gait.right, worldX + 28),
    };
  }

  function calfAnchor(walker) {
    return [
      (walker.right.knee[0] + walker.right.ankle[0]) / 2,
      (walker.right.knee[1] + walker.right.ankle[1]) / 2,
    ];
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

  function worldToSampleScreen(point, camera) {
    return [
      540 + (point[0] - camera.focus[0]) * camera.zoom,
      1030 + (point[1] - camera.focus[1]) * camera.zoom,
    ];
  }

  function transitionState(time, anchor = [690, 1090]) {
    const macroAlpha = 1 - smooth((time - 5.25) / 1.15);
    const microAlpha = smooth((time - 5.25) / 1.35);
    return {
      macroAlpha,
      microAlpha,
      microScale: mix(0.12, 1, microAlpha),
      microOrigin: [mix(anchor[0], 540, microAlpha), mix(anchor[1], 930, microAlpha)],
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
    walkerState,
    cameraState,
    calfAnchor,
    worldToSampleScreen,
    transitionState,
    muscleState,
    glucoseState,
    glucoseStops,
    MICRO_LAYOUT,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EP01Motion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
