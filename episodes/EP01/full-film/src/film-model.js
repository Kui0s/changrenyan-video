(function defineFilmModel(root) {
  'use strict';

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const mix = (a, b, u) => a + (b - a) * u;
  const smooth = (value) => {
    const u = clamp01(value);
    return u * u * (3 - 2 * u);
  };
  const phase01 = (value) => ((value % 1) + 1) % 1;

  const ANCHOR_CHAIN = Object.freeze([
    'person_01',
    'right_pelvis',
    'right_gluteus_medius',
    'selected_fascicle',
    'capillary_A',
    'interstitium_B',
    'myocyte_C',
  ]);

  function characterPose(name = 'P0', gaitPhase = 0) {
    const headWidth = 96;
    const groundY = 1060;
    const pose = {
      id: 'person_01',
      pose: name,
      headsTall: 7,
      headWidth,
      shoulderWidth: 190,
      groundY,
      head: { cx: 0, cy: 130, width: headWidth, height: 108 },
      neck: { topY: 184, bottomY: 230, width: 48 },
      torso: { topY: 228, bottomY: 516, shoulderWidth: 190, waistWidth: 126 },
      pelvis: { topY: 510, bottomY: 620, width: 142 },
      leftLeg: { hipY: 560, shoe: { length: 92, thickness: 28 } },
      rightLeg: { hipY: 560, shoe: { length: 92, thickness: 28 } },
      palette: { shirt: '#e7d9b8', trousers: '#72879a', shoes: '#4d3428', hair: '#3a2c25' },
      gaitPhase: phase01(gaitPhase),
    };
    return pose;
  }

  function legState(phase, side, groundFromHip) {
    const p = phase01(phase + (side === 'right' ? 0.5 : 0));
    const planted = p < 0.5;
    const u = planted ? p / 0.5 : (p - 0.5) / 0.5;
    const lift = planted ? 0 : Math.sin(Math.PI * u) * 72;
    const lane = side === 'left' ? -8 : 8;
    const toeX = planted ? 45 - 90 * u : mix(-45, 45, smooth(u));
    const toe = [lane + toeX, groundFromHip - lift];
    const heel = [toe[0] - 72, toe[1] - (planted ? 0 : 12)];
    const ankle = [heel[0] + 28, heel[1] - 20 - (planted ? 0 : Math.sin(Math.PI * u) * 8)];
    const knee = [lane + ankle[0] * 0.48 + 24, ankle[1] * 0.52 - lift * 0.08];
    return { planted, knee, ankle, heel, toe, lift };
  }

  function walkerState(time) {
    const phase = phase01(time * 0.75);
    const groundY = 1060;
    const hipY = 690 + 10 * Math.cos(phase * Math.PI * 4);
    const worldX = 170 + time * 135;
    const absoluteLeg = (leg, hipX) => ({
      ...leg,
      hip: [hipX, hipY],
      knee: [hipX + leg.knee[0], hipY + leg.knee[1]],
      ankle: [hipX + leg.ankle[0], hipY + leg.ankle[1]],
      heel: [hipX + leg.heel[0], hipY + leg.heel[1]],
      toe: [hipX + leg.toe[0], hipY + leg.toe[1]],
      shoe: {
        length: 92,
        soleY: hipY + leg.toe[1],
        heelX: hipX + leg.heel[0],
        toeX: hipX + leg.toe[0],
      },
    });
    return {
      id: 'person_01', phase, worldX, hipY, groundY,
      torsoLean: -0.035 + 0.025 * Math.sin(phase * Math.PI * 2),
      armSwing: Math.sin(phase * Math.PI * 2),
      left: absoluteLeg(legState(phase, 'left', groundY - hipY), worldX - 28),
      right: absoluteLeg(legState(phase, 'right', groundY - hipY), worldX + 28),
    };
  }

  function scaleJourneyAt(time) {
    let depth = 0;
    if (time >= 41 && time < 45) depth = mix(0, 1, smooth((time - 41) / 4));
    else if (time >= 45 && time < 50) depth = mix(1, 2, smooth((time - 45) / 5));
    else if (time >= 50 && time < 56) depth = mix(2, 4, smooth((time - 50) / 6));
    else if (time >= 56 && time < 63) depth = mix(4, 6, smooth((time - 56) / 7));
    else if (time >= 63 && time < 66) depth = 6;
    else if (time >= 66 && time < 78) depth = mix(6, 0, smooth((time - 66) / 12));
    return { personId: 'person_01', targetId: 'right_gluteus_medius', depth };
  }

  const GLUCOSE_STOPS = Object.freeze([
    { t: 51, region: 'blood', progress: 0 },
    { t: 55, region: 'capillary-wall', progress: 0.25 },
    { t: 58, region: 'interstitium', progress: 0.5 },
    { t: 62, region: 'muscle-membrane', progress: 0.75 },
    { t: 65, region: 'muscle-cell', progress: 1 },
  ]);

  function glucoseState(time) {
    if (time <= GLUCOSE_STOPS[0].t) return { ...GLUCOSE_STOPS[0] };
    for (let i = 1; i < GLUCOSE_STOPS.length; i += 1) {
      const previous = GLUCOSE_STOPS[i - 1];
      const next = GLUCOSE_STOPS[i];
      if (time <= next.t) {
        const u = smooth((time - previous.t) / (next.t - previous.t));
        return { region: next.region, progress: mix(previous.progress, next.progress, u) };
      }
    }
    return { ...GLUCOSE_STOPS.at(-1) };
  }

  const api = {
    ANCHOR_CHAIN,
    characterPose,
    walkerState,
    scaleJourneyAt,
    glucoseState,
    GLUCOSE_STOPS,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EP01FullModel = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
