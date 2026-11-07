// EP01 original scene implementation. Drawing primitives come from the upstream Sketchbook kit.
const MM = EP01Motion;

function ease01(v) { return EZ.io(clamp(v)); }
function fadeBetween(t, a, b) { return 1 - ease01((t - a) / (b - a)); }

function drawLimb(P, key, width = 16, col = SK.ink) {
  gpencil(P, { key: key + '-p', w: width + 8, col: SK.graph, a: 0.38, amp: 1.5 });
  gline(P, { key, w: width, col, amp: 1.1, step: 9 });
  P.slice(1, -1).forEach(([x, y], i) => {
    const joint = loopPts(x, y, width * 0.72, width * 0.72, 0.08, 0, 18);
    gfill(joint, SK.paper, { key: key + '-jf' + i, off: [0, 0], a: 0.9 });
    gline(joint, { key: key + '-j' + i, w: 3.2, closed: true, amp: 0.7 });
  });
}

function drawWalker(t, alpha) {
  const progress = t * 0.75;
  const s = MM.gaitState(progress);
  const worldX = 170 + Math.min(t, 4.9) * 135;
  const hipY = s.hipY;
  const rightHip = [worldX + 22, hipY];
  const leftHip = [worldX - 22, hipY];
  const point = (p, hip) => [hip[0] + p[0], hip[1] + p[1]];
  const right = [rightHip, point(s.right.knee, rightHip), point(s.right.ankle, rightHip), point(s.right.toe, rightHip)];
  const left = [leftHip, point(s.left.knee, leftHip), point(s.left.ankle, leftHip), point(s.left.toe, leftHip)];
  const target = [(right[1][0] + right[2][0]) / 2, (right[1][1] + right[2][1]) / 2];
  const cam = MM.cameraState(t);
  const cameraU = ease01((t - 4) / 2.7);
  const zoom = lerp(1, 2.45, cameraU);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(540, 1030);
  ctx.scale(zoom, zoom);
  ctx.translate(-lerp(540, target[0], cameraU), -lerp(1030, target[1], cameraU));

  const groundY = 1288;
  gpencil([[50, groundY], [350, groundY - 4], [700, groundY + 5], [1030, groundY]], { key: 'walk-ground', w: 3.2, a: 0.58 });
  for (let i = 0; i < 7; i++) {
    const fx = 120 + i * 132;
    gpencil([[fx, groundY - 3], [fx + 48, groundY + 3]], { key: 'footmark' + i, w: 5, a: 0.2 + 0.3 * clamp((t * 170 - fx + 300) / 180), passes: 1 });
  }

  drawLimb(left, 'left-leg');
  drawLimb(right, 'right-leg', 18, SK.ink);

  ctx.save();
  ctx.translate(worldX, hipY - 185);
  ctx.rotate(s.torsoLean);
  const torso = sketchBox(-62, -70, 124, 180, 22, 0.04);
  scribbleFill(torso, SK.terra, { key: 'shirt', gap: 11, w: 5, a: 0.88, base: 0.25 });
  gline(torso, { key: 'torso', w: 6, closed: true });
  const head = loopPts(0, -140, 54, 62, 0.06, 0, 34);
  gfill(head, SK.paper, { key: 'head-fill', off: [0, 0], a: 0.96 });
  gline(head, { key: 'head', w: 5, closed: true });
  gline([[-22, -145], [-10, -149]], { key: 'eye1', w: 4, second: false });
  gline([[14, -149], [26, -145]], { key: 'eye2', w: 4, second: false });
  gline([[-12, -119], [4, -114], [20, -120]], { key: 'smile', w: 3.5, second: false });
  const swing = s.armSwing * 66;
  drawLimb([[-48, -30], [-78 - swing * 0.25, 55], [-42 - swing, 132]], 'left-arm', 11);
  drawLimb([[48, -30], [78 + swing * 0.25, 55], [42 + swing, 132]], 'right-arm', 11);
  ctx.restore();

  if (t >= 4.7) {
    const reveal = ease01((t - 4.7) / 1.5);
    const calf = [right[2][0] * 0.54 + right[1][0] * 0.46, right[2][1] * 0.54 + right[1][1] * 0.46];
    const cut = loopPts(calf[0], calf[1], 45 + 22 * reveal, 105 + 42 * reveal, 0.05, 0, 42);
    gfill(cut, SK.paper, { key: 'calf-cut', off: [0, 0], a: 0.86 * reveal });
    gline(cut, { key: 'calf-cut-line', w: 5, col: SK.terraD, closed: true, a: reveal });
    for (let i = -2; i <= 2; i++) {
      gpencil([[calf[0] - 28, calf[1] + i * 28], [calf[0] + 30, calf[1] + i * 25]], { key: 'fiber' + i, w: 3, a: 0.65 * reveal, passes: 1 });
    }
  }
  ctx.restore();
  return { target, cam };
}

function roundedCellPoints(x, y, w, h) {
  return sketchBox(x, y, w, h, 48, 0.025);
}

function drawBoundaryLabel(text, x, y, key, reveal) {
  handLetter(text, x, y, 42, { col: SK.ink, align: 'center', reveal, key, jit: 0.6, stroke: 0.8 });
}

function drawMicro(t, alpha, transitionU) {
  const state = MM.glucoseState(t);
  const contract = t < 13 ? 0.5 + 0.5 * Math.sin((t - 7) * Math.PI * 1.25) : 0;
  const cellW = 316 - contract * 18;
  const cellH = 690 + contract * 22;
  const cellX = 728 + (316 - cellW) / 2;
  const cellY = 535 - (cellH - 690) / 2;

  ctx.save();
  ctx.globalAlpha = alpha;
  if (transitionU < 1) {
    const scale = lerp(0.14, 1, transitionU);
    const ox = lerp(690, 540, transitionU), oy = lerp(1090, 930, transitionU);
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    ctx.translate(-540, -930);
  }

  // Capillary lumen and its double-lined wall.
  const outerVessel = sketchBox(92, 510, 330, 760, 86, 0.025);
  const innerVessel = sketchBox(116, 538, 282, 704, 70, 0.02);
  gfill(outerVessel, 'rgba(224,72,58,0.10)', { key: 'vessel-wash', off: [0, 0], a: 1 });
  gpencil(outerVessel, { key: 'vessel-outer-pencil', w: 5, a: 0.6, closed: true });
  gline(outerVessel, { key: 'vessel-outer', w: 7, col: SK.graph, closed: true });
  gline(innerVessel, { key: 'vessel-inner', w: 4, col: SK.graphL, closed: true, second: false });
  for (let i = 0; i < 6; i++) {
    const yy = 610 + i * 105 + 12 * Math.sin(TT * 2 + i);
    const bloodCell = loopPts(205 + (i % 2) * 78, yy, 35, 20, 0.08, 0, 22);
    gpencil(bloodCell, { key: 'rbc' + i, w: 3, col: SK.graph, a: 0.45, closed: true, passes: 1 });
  }

  // Interstitial space: sparse graphite fibres keep it visibly separate from both membranes.
  for (let i = 0; i < 6; i++) {
    const yy = 610 + i * 105;
    gpencil([[462, yy], [515, yy - 22], [588, yy + 8], [650, yy - 16]], { key: 'matrix' + i, w: 2.4, a: 0.26, passes: 1 });
  }

  // Muscle cell membrane and contracting fibres.
  const muscle = roundedCellPoints(cellX, cellY, cellW, cellH);
  const muscleInner = roundedCellPoints(cellX + 20, cellY + 22, cellW - 40, cellH - 44);
  gfill(muscle, 'rgba(217,119,87,0.10)', { key: 'muscle-wash', off: [0, 0], a: 1 });
  gline(muscle, { key: 'muscle-membrane-outer', w: 8, col: SK.ink, closed: true });
  gpencil(muscleInner, { key: 'muscle-membrane-inner', w: 4, col: SK.graph, a: 0.72, closed: true, passes: 1 });
  for (let i = 0; i < 6; i++) {
    const yy = cellY + 110 + i * 88;
    const inset = 48 + contract * 10;
    gline([[cellX + inset, yy], [cellX + cellW - inset, yy]], { key: 'myofibril' + i, w: 5, col: SK.terraD, a: 0.52, second: false, amp: 0.7 });
    for (let j = 1; j < 4; j++) {
      const xx = lerp(cellX + inset, cellX + cellW - inset, j / 4);
      gpencil([[xx - 7, yy - 12], [xx + 7, yy + 12]], { key: 'sarcomere' + i + '-' + j, w: 2.5, a: 0.5, passes: 1 });
    }
  }

  // A distinct transporter gate only on the muscle membrane.
  const gateY = 895;
  gline([[cellX - 7, gateY - 42], [cellX + 17, gateY - 24], [cellX + 17, gateY + 24], [cellX - 7, gateY + 42]], { key: 'transporter', w: 8, col: SK.terraD, second: false });
  arrowPencil([[660, gateY], [712, gateY]], clamp((t - 10.8) / 0.8));

  const labelsIn = ease01((t - 7.05) / 0.65);
  drawBoundaryLabel('血液', 255, 440, 'label-blood', labelsIn);
  drawBoundaryLabel('毛细血管壁', 265, 1325, 'label-wall', labelsIn);
  drawBoundaryLabel('组织间隙', 555, 1325, 'label-space', labelsIn);
  drawBoundaryLabel('肌细胞膜', 850, 1325, 'label-membrane', labelsIn);
  handLetter('葡萄糖转运', 718, 832, 34, { col: SK.graph, align: 'center', reveal: ease01((t - 10.7) / 0.7), key: 'label-gate', jit: 0.5 });

  // The tracked glucose particle leaves a persistent graphite route behind it.
  const route = [[250, 860], [365, 860], [430, 860], [550, 895], [660, 895], [735, 895], [865, 895]];
  const routePart = clamp(state.progress);
  ctx.save(); ctx.setLineDash([10, 12]);
  gpencil(route, { key: 'glucose-route', w: 4.2, a: 0.76, part: routePart, passes: 1 });
  ctx.restore();
  const particleX = state.x;
  const particleY = lerp(860, 895, ease01((particleX - 430) / 250));
  const glucose = loopPts(particleX, particleY, 24, 24, 0.09, 0, 24);
  scribbleFill(glucose, SK.hilite, { key: 'glucose-fill', gap: 7, w: 4, a: 0.98, base: 0.45 });
  gline(glucose, { key: 'glucose-dot', w: 4.5, closed: true });
  const particleLabelY = particleY + lerp(-47, 68, ease01((particleX - 570) / 90));
  handLetter('葡萄糖', particleX, particleLabelY, 32, { col: SK.ink, align: 'center', reveal: 1, key: 'glucose-label', jit: 0.5 });

  if (t >= 13) {
    const hold = ease01((t - 13) / 0.45);
    arrowPencil(route, hold);
    const [x0, x1] = handLetter('进入肌肉细胞', 540, 1460, 62, { face: 'marker', col: SK.ink, align: 'center', reveal: hold, key: 'result', jit: 0.7, stroke: 1.2 });
    highlight(x0, x1, 1470, 50, hold);
    handLetter('机制示意 · 时间与尺度已压缩', 540, 1535, 34, { col: SK.graph, align: 'center', reveal: hold, key: 'disclaimer', jit: 0.4 });
  }
  ctx.restore();
}

function sceneSample() {
  sketchPage({ grid: 'dots' });
  const microU = ease01((TT - 5.15) / 1.85);
  const macroA = TT < 5.15 ? 1 : fadeBetween(TT, 5.15, 6.85);

  if (TT < 6.25 && macroA > 0.01) drawWalker(TT, macroA);
  if (microU > 0.001) drawMicro(TT, microU, microU);

  if (TT < 4.2) {
    pageTag('动作测试');
    pageCaption(['连续走三步', '不是“三步降糖”'], [[0, '三步']], { y: 1420, size: 62 });
  } else if (TT < 7) {
    pageTag('同一条腿');
    pageCaption(['跟随运动中的腿', '进入内部示意'], [[1, '内部']], { y: 1420, size: 60 });
  } else if (TT < 13) {
    pageTag('两道边界');
    pageCaption(['血管壁 → 组织间隙', '肌细胞膜 → 细胞内'], [[0, '组织间隙']], { y: 1420, size: 55 });
  }
}
