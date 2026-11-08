// EP01 full-film original scene implementation. Drawing primitives come from the pinned upstream Sketchbook kit.
const FT = EP01FullTimeline;
const FM = EP01FullModel;

function ease01(value) { return EZ.io(clamp(value)); }
function localTime(scene) { return TT - scene.start; }
function alphaWindow(time, start, end, fade = 0.45) {
  return ease01((time - start) / fade) * (1 - ease01((time - end) / fade));
}

function poly(points, fill, stroke = SK.ink, key = 'poly', alpha = 1) {
  gfill(points, fill, { key: key + '-fill', off: [0, 0], a: alpha });
  gline(points, { key: key + '-line', w: 4.5, col: stroke, closed: true, a: alpha, amp: 0.75 });
}

function taperedSegment(a, b, wa, wb, fill, key, alpha = 1) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len, ny = dx / len;
  poly([
    [a[0] + nx * wa, a[1] + ny * wa],
    [b[0] + nx * wb, b[1] + ny * wb],
    [b[0] - nx * wb, b[1] - ny * wb],
    [a[0] - nx * wa, a[1] - ny * wa],
  ], fill, SK.ink, key, alpha);
}

function drawShoe(heel, toe, key, alpha = 1) {
  const y = Math.max(heel[1], toe[1]);
  poly([
    [heel[0] - 12, y - 31], [heel[0] + 30, y - 35],
    [toe[0] + 28, y - 20], [toe[0] + 34, y], [heel[0] - 18, y],
  ], '#4d3428', SK.ink, key, alpha);
  gpencil([[heel[0] - 16, y + 2], [toe[0] + 34, y + 2]], { key: key + '-sole', w: 6, col: SK.graph, a: alpha, passes: 1 });
}

function drawAdult(time, x, groundY, scale = 1, options = {}) {
  const state = FM.walkerState(time);
  const originX = state.worldX;
  const hipY = state.hipY;
  const p = (point) => [x + (point[0] - originX) * scale, groundY + (point[1] - state.groundY) * scale];
  const hip = [x, groundY + (hipY - state.groundY) * scale];
  const alpha = options.alpha ?? 1;
  const shirt = options.transparent ? 'rgba(231,217,184,0.30)' : '#e7d9b8';
  const trousers = options.transparent ? 'rgba(114,135,154,0.32)' : '#72879a';

  const left = { hip: p(state.left.hip), knee: p(state.left.knee), ankle: p(state.left.ankle), heel: p(state.left.heel), toe: p(state.left.toe) };
  const right = { hip: p(state.right.hip), knee: p(state.right.knee), ankle: p(state.right.ankle), heel: p(state.right.heel), toe: p(state.right.toe) };
  taperedSegment(left.hip, left.knee, 31 * scale, 25 * scale, trousers, 'person-left-thigh', alpha * 0.82);
  taperedSegment(left.knee, left.ankle, 25 * scale, 18 * scale, trousers, 'person-left-calf', alpha * 0.82);
  taperedSegment(right.hip, right.knee, 34 * scale, 27 * scale, trousers, 'person-right-thigh', alpha);
  taperedSegment(right.knee, right.ankle, 27 * scale, 19 * scale, trousers, 'person-right-calf', alpha);
  drawShoe(left.heel, left.toe, 'person-left-shoe', alpha * 0.85);
  drawShoe(right.heel, right.toe, 'person-right-shoe', alpha);

  const pelvisY = hip[1] - 46 * scale;
  poly([
    [x - 67 * scale, pelvisY - 18 * scale], [x + 67 * scale, pelvisY - 18 * scale],
    [x + 58 * scale, pelvisY + 72 * scale], [x - 58 * scale, pelvisY + 72 * scale],
  ], trousers, SK.ink, 'person-pelvis', alpha);

  const lean = state.torsoLean;
  ctx.save();
  ctx.translate(x, pelvisY - 20 * scale);
  ctx.rotate(lean);
  const torso = [[-65, 0], [-92, -210], [-74, -260], [74, -260], [92, -210], [65, 0]].map(([px, py]) => [px * scale, py * scale]);
  poly(torso, shirt, SK.ink, 'person-torso', alpha);
  const neck = sketchBox(-25 * scale, -315 * scale, 50 * scale, 70 * scale, 14 * scale, 0.025);
  poly(neck, '#dfb493', SK.ink, 'person-neck', alpha);
  const head = loopPts(0, -380 * scale, 55 * scale, 68 * scale, 0.04, 0, 38);
  gfill(head, '#dfb493', { key: 'person-head-fill', off: [0, 0], a: alpha });
  gline(head, { key: 'person-head-line', w: 4.5, col: SK.ink, closed: true, a: alpha });
  const hair = [[-50, -404], [-28, -450], [20, -448], [52, -410], [42, -384], [8, -403], [-35, -386]].map(([px, py]) => [px * scale, py * scale]);
  poly(hair, '#3a2c25', SK.ink, 'person-hair', alpha);
  gline([[12 * scale, -390 * scale], [29 * scale, -386 * scale]], { key: 'person-eye', w: 3.5, col: SK.ink, a: alpha, second: false });
  gline([[26 * scale, -360 * scale], [42 * scale, -365 * scale]], { key: 'person-mouth', w: 3, col: SK.ink, a: alpha, second: false });

  const swing = state.armSwing * 70;
  const leftShoulder = [-78 * scale, -225 * scale], rightShoulder = [78 * scale, -225 * scale];
  const leftElbow = [(-108 - swing * 0.24) * scale, -110 * scale];
  const leftHand = [(-82 - swing) * scale, 8 * scale];
  const rightElbow = [(108 + swing * 0.24) * scale, -110 * scale];
  const rightHand = [(82 + swing) * scale, 8 * scale];
  taperedSegment(leftShoulder, leftElbow, 22 * scale, 17 * scale, shirt, 'person-left-upper-arm', alpha * 0.84);
  taperedSegment(leftElbow, leftHand, 17 * scale, 12 * scale, '#dfb493', 'person-left-forearm', alpha * 0.84);
  taperedSegment(rightShoulder, rightElbow, 23 * scale, 18 * scale, shirt, 'person-right-upper-arm', alpha);
  taperedSegment(rightElbow, rightHand, 18 * scale, 12 * scale, '#dfb493', 'person-right-forearm', alpha);
  ctx.restore();

  if (options.muscles) {
    const pulse = 0.65 + 0.35 * Math.sin(time * Math.PI * 2);
    const glute = loopPts(x + 43 * scale, pelvisY + 8 * scale, 40 * scale, 55 * scale, 0.04, 0, 26);
    gfill(glute, 'rgba(213,105,70,0.72)', { key: 'right-glute-highlight', off: [0, 0], a: alpha * pulse });
    gline(glute, { key: 'right-glute-outline', w: 4, col: SK.terraD, closed: true, a: alpha });
    [left, right].forEach((leg, index) => {
      taperedSegment(leg.hip, leg.knee, 18 * scale, 13 * scale, 'rgba(224,128,82,0.48)', 'muscle-thigh-' + index, alpha);
    });
    if (options.wholeBodyMuscles) {
      taperedSegment(leftShoulder.map((v, i) => (i ? v + pelvisY - 20 * scale : v + x)), leftElbow.map((v, i) => (i ? v + pelvisY - 20 * scale : v + x)), 9 * scale, 7 * scale, 'rgba(224,128,82,0.28)', 'muscle-arm-light', alpha);
    }
  }
  return { state, hip: [x, pelvisY], rightGlute: [x + 43 * scale, pelvisY + 8 * scale] };
}

function drawTitle(scene) {
  pageTag('EP01 · ' + scene.id + '/08');
  const [x0, x1] = handLetter(scene.title, 540, 270, FT.titleFontSize(scene.title), { face: 'marker', col: SK.ink, align: 'center', reveal: ease01(localTime(scene) / 0.8), key: 'scene-title', jit: 0.5, stroke: 1.1 });
  highlight(x0, x1, 280, 42, ease01(localTime(scene) / 0.9));
}

function wrapChinese(text, count = 18) {
  const clean = text.replace(/\s+/g, '');
  const lines = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(clean.length, start + count);
    const punct = clean.slice(start, end + 4).search(/[。；！？]/u);
    if (punct >= count - 5 && punct <= count + 3) end = start + punct + 1;
    lines.push(clean.slice(start, end));
    start = end;
  }
  return lines.slice(0, 4);
}

function drawSubtitle(scene) {
  const layout = FT.SUBTITLE_LAYOUT;
  const lines = wrapChinese(scene.subtitle, FT.subtitleCharactersPerLine(scene.id));
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(248,244,232,0.94)';
  ctx.strokeStyle = 'rgba(54,48,42,0.68)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(layout.x, layout.y, layout.width, layout.height, 34);
  ctx.fill(); ctx.stroke();
  ctx.restore();
  lines.forEach((line, index) => handLetter(line, 540, layout.lineTop + index * layout.lineGap, FT.subtitleFontSize(scene.id), {
    col: SK.ink, align: 'center', reveal: ease01(localTime(scene) / 0.7), key: 'subtitle-' + index, jit: 0.35, stroke: 0.75,
  }));
}

function drawMealQuestion(scene) {
  const t = localTime(scene);
  const tableY = 890;
  poly([[90, tableY], [520, tableY], [500, tableY + 55], [115, tableY + 55]], '#caa67a', SK.ink, 'table');
  taperedSegment([155, tableY + 40], [135, 1320], 17, 12, '#8f6a49', 'table-leg-left');
  taperedSegment([455, tableY + 40], [475, 1320], 17, 12, '#8f6a49', 'table-leg-right');
  const plate = loopPts(300, tableY - 18, 115, 34, 0.035, 0, 42);
  gfill(plate, SK.paper, { key: 'plate-fill', off: [0, 0], a: 1 });
  gline(plate, { key: 'plate', w: 5, col: SK.graph, closed: true });
  for (let i = 0; i < 5; i++) {
    const rice = loopPts(260 + i * 20, tableY - 38 - (i % 2) * 11, 16, 9, 0.08, 0, 18);
    gfill(rice, '#eee4c8', { key: 'rice' + i, off: [0, 0], a: 1 });
    gline(rice, { key: 'rice-line' + i, w: 2.5, col: SK.graph, closed: true });
  }
  const stand = ease01((t - 2.2) / 2.8);
  const walk = Math.max(0, t - 5);
  const px = 710 + walk * 42;
  const py = 1330 - (1 - stand) * 60;
  drawAdult(walk, px, py, 0.72 + stand * 0.08);
  handLetter('饭后走一走', 290, 490, 66, { face: 'marker', col: SK.ink, align: 'center', reveal: ease01(t / 1.2), key: 'proverb', jit: 0.8 });
  handLetter('活到九十九？', 670, 610, 76, { face: 'marker', col: SK.terraD, align: 'center', reveal: ease01((t - 3.2) / 1.2), key: 'question', jit: 0.9 });
  handLetter('不是承诺，是一个问题', 540, 720, 38, { col: SK.graph, align: 'center', reveal: ease01((t - 5.5) / 1), key: 'not-promise', jit: 0.4 });
}

function drawDigestive(scene) {
  const t = localTime(scene);
  const ambient = FM.ambientMotionAt('02', TT);
  const chainY = 600;
  for (let i = 0; i < 7; i++) {
    const broken = ease01((t - 1.2 - i * 0.16) / 1.5);
    const x = 190 + i * 105 + broken * (i - 3) * 18;
    const sugar = loopPts(x, chainY + Math.sin(i) * 18, 34, 34, 0.06, 0, 24);
    scribbleFill(sugar, SK.hilite, { key: 'starch-' + i, gap: 8, w: 4, a: 0.95, base: 0.38 });
    gline(sugar, { key: 'starch-line-' + i, w: 4, closed: true });
    if (i < 6 && broken < 0.75) gpencil([[x + 34, chainY], [x + 72, chainY]], { key: 'chain-' + i, w: 5, a: 1 - broken, passes: 1 });
  }
  handLetter(t < 4 ? '淀粉' : '消化 → 葡萄糖', 540, 470, 62, { face: 'marker', col: SK.ink, align: 'center', reveal: 1, key: 'digestion-label', jit: 0.6 });
  const bodyIn = ease01((t - 3.2) / 1.8);
  if (bodyIn > 0.001) {
    ctx.save(); ctx.globalAlpha *= bodyIn;
    const body = sketchBox(310, 710, 460, 640, 150, 0.025);
    gfill(body, 'rgba(231,217,184,0.25)', { key: 'digest-body', off: [0, 0], a: 1 });
    gline(body, { key: 'digest-body-line', w: 5, col: SK.graph, closed: true, a: 0.7 });
    const stomach = loopPts(470, 870, 82, 118, 0.05, -0.18, 36);
    gfill(stomach, 'rgba(204,137,105,0.32)', { key: 'stomach-fill', off: [0, 0], a: 1 });
    gline(stomach, { key: 'stomach', w: 5, col: SK.terraD, closed: true });
    const intestine = [];
    for (let i = 0; i < 90; i++) {
      const u = i / 89;
      intestine.push([430 + u * 250 + Math.sin(u * Math.PI * 10 + t * 1.5) * (34 + ambient.pulse * 10), 1070 + u * 165]);
    }
    gpencil(intestine, { key: 'small-intestine', w: 22, col: SK.terra, a: 0.58, passes: 2 });
    gline(intestine, { key: 'small-intestine-line', w: 6, col: SK.terraD, second: false, amp: 0.8 });
    handLetter('小肠吸收', 690, 1170, 42, { col: SK.ink, align: 'center', reveal: ease01((t - 5) / 0.8), key: 'absorb', jit: 0.4 });
    const route = [[610, 1190], [735, 1140], [820, 1040]];
    arrowPencil(route, ease01((t - 6) / 2));
    const glucoseX = 610 + ease01((t - 6) / 2.8) * 210;
    const dot = loopPts(glucoseX, 1160 - ease01((t - 6) / 2.8) * 120, 22, 22, 0.07, 0, 20);
    scribbleFill(dot, SK.hilite, { key: 'absorbed-glucose', gap: 6, w: 4, a: 1, base: 0.4 });
    gline(dot, { key: 'absorbed-glucose-line', w: 4, closed: true });
    for (let i = 0; i < 3; i++) {
      const flow = ((Math.max(0, t - 6) * 0.22 + i * 0.34) % 1 + 1) % 1;
      const fx = lerp(610, 820, flow);
      const fy = lerp(1160, 1040, flow) + Math.sin(t * 2 + i) * 8;
      const movingDot = loopPts(fx, fy, 12, 12, 0.08, 0, 16);
      gfill(movingDot, SK.hilite, { key: 'flow-dot-fill-' + i, off: [0, 0], a: 0.55 + ambient.pulse * 0.25 });
      gline(movingDot, { key: 'flow-dot-' + i, w: 2.5, col: SK.graph, closed: true, a: 0.8 });
    }
    ctx.restore();
  }
  const noticeA = alphaWindow(TT, 13, 15.2, 0.35);
  handLetter('原理示意 · 时间尺度已压缩', 540, 1250, 39, { col: SK.graph, align: 'center', reveal: noticeA, key: 'time-compression', jit: 0.35 });
}

function drawWholeBody(scene, targetOnly = false) {
  const t = localTime(scene);
  gpencil([[70, 1325], [1010, 1325]], { key: 'whole-ground', w: 4, col: SK.graph, a: 0.5, passes: 1 });
  const person = drawAdult(t, 520, 1325, 1.05, { transparent: true, muscles: true, wholeBodyMuscles: !targetOnly });
  if (!targetOnly) {
    const cues = [
      ['腿与臀', 230, 870, 1.0], ['躯干稳定', 770, 760, 0.75], ['摆臂肌肉', 830, 1030, 0.5],
    ];
    cues.forEach(([label, x, y, delay], index) => {
      const a = ease01((t - delay - index * 0.7) / 0.7);
      handLetter(label, x, y, 38, { col: index ? SK.graph : SK.terraD, align: 'center', reveal: a, key: 'muscle-cue-' + index, jit: 0.35 });
      gpencil([[x, y + 25], [person.hip[0] + (index - 1) * 80, person.hip[1] - 40 - index * 80]], { key: 'muscle-pointer-' + index, w: 3, a: a * 0.65, passes: 1 });
    });
    handLetter('参与程度不同，不是全身同步发光', 540, 1250, 37, { col: SK.graph, align: 'center', reveal: ease01((t - 4.2) / 0.8), key: 'different-intensity', jit: 0.35 });
  }
  return person;
}

function drawBloodTarget(scene) {
  const t = localTime(scene);
  const person = drawWholeBody(scene, true);
  const route = [[385, 1030], [455, 970], [520, 1005], [person.rightGlute[0], person.rightGlute[1]]];
  ctx.save(); ctx.setLineDash([16, 13]);
  gpencil(route, { key: 'blood-route', w: 10, col: '#b65b51', a: 0.82, part: ease01(t / 5.2), passes: 1 });
  ctx.restore();
  const flow = ease01(t / 5.2);
  const seg = Math.min(route.length - 2, Math.floor(flow * (route.length - 1)));
  const u = flow * (route.length - 1) - seg;
  const px = lerp(route[seg][0], route[seg + 1][0], u);
  const py = lerp(route[seg][1], route[seg + 1][1], u);
  const dot = loopPts(px, py, 20, 20, 0.08, 0, 20);
  scribbleFill(dot, SK.hilite, { key: 'blood-glucose', gap: 6, w: 4, a: 1, base: 0.45 });
  gline(dot, { key: 'blood-glucose-line', w: 4, closed: true });
  handLetter('血液运输', 310, 900, 43, { col: SK.terraD, align: 'center', reveal: ease01(t / 0.8), key: 'blood-label', jit: 0.4 });
  const lock = ease01((t - 5.5) / 1.2);
  const ring = loopPts(person.rightGlute[0], person.rightGlute[1], 78, 88, 0.04, 0, 40);
  gline(ring, { key: 'target-lock', w: 7, col: SK.hiliteD, closed: true, a: lock });
  handLetter('右侧臀中肌', 760, 790, 46, { face: 'marker', col: SK.ink, align: 'center', reveal: lock, key: 'target-name', jit: 0.45 });
  handLetter('唯一深入位置', 760, 845, 34, { col: SK.graph, align: 'center', reveal: lock, key: 'target-only', jit: 0.35 });
}

function drawBreadcrumb(active) {
  const labels = ['整个人', '右髋肌肉', '肌束', '毛细血管', '组织间隙', '肌细胞'];
  labels.forEach((label, index) => {
    const x = 105 + index * 174;
    const activeAlpha = index <= active ? 1 : 0.28;
    handLetter(label, x, 400, 29, { col: index === active ? SK.terraD : SK.graph, align: 'center', reveal: activeAlpha, key: 'crumb-' + index, jit: 0.3 });
    if (index < labels.length - 1) arrowPencil([[x + 60, 402], [x + 110, 402]], index < active ? 1 : 0.18);
  });
}

function drawMicroDiagram(globalTime, alpha = 1) {
  const glucose = FM.glucoseState(globalTime);
  const ambient = FM.ambientMotionAt('05', globalTime);
  const vessel = sketchBox(110, 610, 300, 640, 80, 0.025);
  const vesselInner = sketchBox(135, 640, 250, 580, 65, 0.02);
  gfill(vessel, 'rgba(198,84,74,0.14)', { key: 'micro-vessel-fill', off: [0, 0], a: alpha });
  gline(vessel, { key: 'micro-vessel-outer', w: 8, col: SK.graph, closed: true, a: alpha });
  gline(vesselInner, { key: 'micro-vessel-inner', w: 4, col: SK.graphL, closed: true, a: alpha, second: false });
  for (let i = 0; i < 5; i++) {
    const cell = loopPts(235 + (i % 2) * 65 + Math.sin(globalTime * 1.7 + i) * 13, 725 + i * 92 + Math.cos(globalTime * 1.35 + i) * 9, 31, 17, 0.07, 0, 20);
    gline(cell, { key: 'micro-rbc-' + i, w: 3, col: '#a84d45', closed: true, a: alpha * 0.55 });
  }
  for (let i = 0; i < 6; i++) {
    gpencil([[445, 690 + i * 92], [520, 670 + i * 92], [615, 705 + i * 92]], { key: 'interstitial-fiber-' + i, w: 2.5, col: SK.graphL, a: alpha * 0.42, passes: 1 });
  }
  const muscle = sketchBox(670, 610, 310, 640, 70, 0.025);
  const muscleInner = sketchBox(694, 635, 262, 590, 56, 0.02);
  gfill(muscle, 'rgba(217,119,87,0.15)', { key: 'micro-muscle-fill', off: [0, 0], a: alpha });
  gline(muscle, { key: 'micro-muscle-outer', w: 8, col: SK.ink, closed: true, a: alpha });
  gline(muscleInner, { key: 'micro-muscle-inner', w: 4, col: SK.graph, closed: true, a: alpha, second: false });
  for (let i = 0; i < 5; i++) {
    const inset = 12 + ambient.pulse * 14;
    gline([[725 + inset, 735 + i * 92], [925 - inset, 735 + i * 92]], { key: 'micro-fiber-' + i, w: 5, col: SK.terraD, a: alpha * 0.5, second: false, amp: 0.7 });
  }
  const x = lerp(260, 835, glucose.progress);
  const y = 920;
  const route = [[260, y], [390, y], [540, y], [675, y], [835, y]];
  ctx.save(); ctx.setLineDash([10, 12]);
  gpencil(route, { key: 'micro-route', w: 4.5, col: SK.graph, a: alpha * 0.78, part: glucose.progress, passes: 1 });
  ctx.restore();
  const dot = loopPts(x, y, 23, 23, 0.08, 0, 22);
  scribbleFill(dot, SK.hilite, { key: 'micro-glucose-fill', gap: 6, w: 4, a: alpha, base: 0.4 });
  gline(dot, { key: 'micro-glucose-line', w: 4.5, col: SK.ink, closed: true, a: alpha });
  const labels = [['血液', 250], ['毛细血管壁', 390], ['组织间隙', 540], ['肌细胞膜', 690], ['细胞内', FT.VISUAL_LAYOUT.microCellLabelX]];
  labels.forEach(([label, lx], index) => handLetter(label, lx, FT.VISUAL_LAYOUT.microLabelsY, index === 1 || index === 3 ? 29 : 33, { col: index === 1 || index === 3 ? SK.terraD : SK.graph, align: 'center', reveal: alpha, key: 'micro-label-' + index, jit: 0.3 }));
}

function drawScaleJourney(scene, exiting = false) {
  const global = TT;
  const state = FM.scaleJourneyAt(global);
  const depth = state.depth;
  const active = Math.min(5, Math.max(0, Math.floor(depth + 0.2)));
  drawBreadcrumb(active);
  const center = [540, 930];
  const ringRadius = Math.max(90, 390 - depth * 45);
  for (let i = 0; i < 4; i++) {
    const ring = loopPts(center[0], center[1], ringRadius + i * 45, ringRadius * 0.72 + i * 32, 0.025, 0, 46);
    gline(ring, { key: 'zoom-ring-' + i, w: 3.5, col: i === 0 ? SK.terraD : SK.graphL, closed: true, a: 0.2 + (3 - i) * 0.1 });
  }
  if (depth < 1.25) {
    drawAdult(localTime(scene), 540, 1370, 0.9, { transparent: true, muscles: true });
    handLetter('同一个人 · 同一个右髋锚点', 540, 1260, 38, { col: SK.graph, align: 'center', reveal: 1, key: 'same-person', jit: 0.35 });
  } else if (depth < 2.5) {
    const pelvis = sketchBox(245, 620, 590, 590, 150, 0.025);
    gfill(pelvis, 'rgba(114,135,154,0.18)', { key: 'pelvis-context', off: [0, 0], a: 1 });
    gline(pelvis, { key: 'pelvis-context-line', w: 6, col: SK.graph, closed: true });
    const muscle = loopPts(630, 905, 175, 245, 0.04, -0.28, 48);
    scribbleFill(muscle, SK.terra, { key: 'glute-muscle', gap: 13, w: 5, a: 0.78, base: 0.22 });
    gline(muscle, { key: 'glute-muscle-line', w: 7, col: SK.terraD, closed: true });
    handLetter('右侧臀中肌', 650, 1245, 49, { face: 'marker', col: SK.ink, align: 'center', reveal: 1, key: 'glute-name', jit: 0.45 });
  } else if (depth < 4.2) {
    const fascicle = loopPts(540, 930, 365, 250, 0.025, 0, 54);
    gfill(fascicle, 'rgba(217,119,87,0.14)', { key: 'fascicle-fill', off: [0, 0], a: 1 });
    gline(fascicle, { key: 'fascicle-line', w: 7, col: SK.terraD, closed: true });
    for (let i = -3; i <= 3; i++) gpencil([[250, 930 + i * 48], [830, 920 + i * 47]], { key: 'fascicle-fiber-' + i, w: 6, col: SK.terra, a: 0.58, passes: 1 });
    gpencil([[300, 810], [430, 870], [560, 835], [720, 900], [835, 860]], { key: 'fascicle-capillary', w: 13, col: '#b65b51', a: 0.78, passes: 2 });
    handLetter('肌束中的毛细血管', 540, 1265, 47, { face: 'marker', col: SK.ink, align: 'center', reveal: 1, key: 'fascicle-label', jit: 0.45 });
  } else {
    drawMicroDiagram(exiting ? 66 : global, 1);
    if (exiting) {
      handLetter('葡萄糖留在细胞内 · 相机沿原锚点退出', 540, FT.VISUAL_LAYOUT.exitNoteY, 34, { col: SK.graph, align: 'center', reveal: 1, key: 'not-reverse', jit: 0.35 });
    }
  }
}

function drawEvidence(scene) {
  const t = localTime(scene);
  const ambient = FM.ambientMotionAt('07', TT);
  const cardIn = ease01(t / 2.2);
  for (let i = 0; i < 8; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 120 + col * 225, y = 560 + row * 220 + Math.sin(TT * 1.3 + i) * (2 + ambient.pulse * 3);
    const card = sketchBox(x, y, 175, 150, 20, 0.025);
    gfill(card, i % 2 ? 'rgba(231,217,184,0.5)' : 'rgba(114,135,154,0.16)', { key: 'study-card-fill-' + i, off: [0, 0], a: cardIn });
    gline(card, { key: 'study-card-' + i, w: 4, col: SK.graph, closed: true, a: cardIn });
    handLetter(String(i + 1), x + 88, y + 87, 51, { face: 'marker', col: SK.ink, align: 'center', reveal: cardIn, key: 'study-num-' + i, jit: 0.4 });
  }
  handLetter('8项短期试验', 540, 1030, 58, { face: 'marker', col: SK.ink, align: 'center', reveal: ease01((t - 1) / 1), key: 'eight-trials', jit: 0.55 });
  const compare = ease01((t - 5) / 2);
  handLetter('饭后运动', 300, 1165, 45, { col: SK.terraD, align: 'center', reveal: compare, key: 'exercise', jit: 0.4 });
  handLetter('饭后不运动', 780, 1165, 45, { col: SK.graph, align: 'center', reveal: compare, key: 'no-exercise', jit: 0.4 });
  const left = [[180, 1310], [250, 1265], [320, 1245], [390, 1228]];
  const right = [[660, 1310], [730, 1278], [800, 1268], [870, 1260]];
  gpencil(left, { key: 'qualitative-exercise', w: 6, col: SK.terraD, a: compare, passes: 1 });
  gpencil(right, { key: 'qualitative-control', w: 6, col: SK.graph, a: compare, passes: 1 });
  const scanX = lerp(180, 870, ambient.scan);
  gpencil([[scanX - 42, 1125], [scanX, 1105], [scanX + 42, 1125]], { key: 'evidence-scan', w: 5, col: SK.hiliteD, a: 0.45 + ambient.pulse * 0.35, passes: 1 });
  handLetter('总体方向：餐后波动较小', 540, 1215, 42, { col: SK.ink, align: 'center', reveal: ease01((t - 9) / 1), key: 'overall-direction', jit: 0.4 });
  const limit = alphaWindow(TT, 94, 97, 0.4);
  const [x0, x1] = handLetter('研究规模有限 · 不是人人都一样', 540, 1265, 43, { face: 'marker', col: SK.ink, align: 'center', reveal: limit, key: 'research-limit', jit: 0.45 });
  highlight(x0, x1, 1275, 42, limit);
}

function drawTakeaway(scene) {
  const t = localTime(scene);
  gpencil([[70, 1325], [1010, 1325]], { key: 'takeaway-ground', w: 4, col: SK.graph, a: 0.5, passes: 1 });
  drawAdult(t, 540, 1325, 1.02);
  handLetter('“走到九十九”', 540, 580, 67, { face: 'marker', col: SK.graph, align: 'center', reveal: ease01(t / 0.8), key: 'ninety-nine', jit: 0.65 });
  gpencil([[300, 535], [780, 625]], { key: 'no-promise-slash', w: 9, col: SK.terraD, a: ease01((t - 1.5) / 0.7), passes: 2 });
  handLetter('短期证据不能证明延寿', 540, 720, 46, { col: SK.terraD, align: 'center', reveal: ease01((t - 2.2) / 0.9), key: 'no-longevity-proof', jit: 0.4 });
  const finalA = alphaWindow(TT, 107, 109.5, 0.35);
  const [x0, x1] = handLetter('量力而行 · 把规律活动变成习惯', 540, 870, 52, { face: 'marker', col: SK.ink, align: 'center', reveal: Math.max(ease01((t - 5) / 1), finalA), key: 'final-takeaway', jit: 0.55 });
  highlight(x0, x1, 882, 48, Math.max(ease01((t - 5) / 1), finalA));
}

function sceneFullFilm() {
  sketchPage({ grid: 'dots' });
  const scene = FT.sceneAt(TT);
  drawTitle(scene);
  if (scene.id === '01') drawMealQuestion(scene);
  else if (scene.id === '02') drawDigestive(scene);
  else if (scene.id === '03') drawWholeBody(scene, false);
  else if (scene.id === '04') drawBloodTarget(scene);
  else if (scene.id === '05') drawScaleJourney(scene, false);
  else if (scene.id === '06') drawScaleJourney(scene, true);
  else if (scene.id === '07') drawEvidence(scene);
  else drawTakeaway(scene);
  drawSubtitle(scene);
}

