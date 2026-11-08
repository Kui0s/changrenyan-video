(function defineTimeline(root) {
  'use strict';

  const FILM = Object.freeze({
    name: 'EP01-full-film-v2.3',
    title: '饭后走一走，身体里发生了什么？',
    width: 1080,
    height: 1920,
    duration: 111,
    fps: 24,
    frames: 2664,
  });

  const SUBTITLE_LAYOUT = Object.freeze({
    x: 80,
    y: 1295,
    width: 920,
    height: 220,
    lineTop: 1348,
    lineGap: 48,
    lineCount: 4,
    fontSize: 36,
    charactersPerLine: 22,
  });

  const VISUAL_LAYOUT = Object.freeze({
    microLabelsY: 1225,
    microCellLabelX: 815,
    exitNoteY: 520,
  });

  function titleFontSize(title) {
    if (title.length > 15) return 44;
    if (title.length > 12) return 48;
    return 55;
  }

  const SCENES = Object.freeze([
    {
      id: '01', start: 0, end: 10, key: 'question',
      title: '饭后走一走，真能走出长寿吗？',
      subtitle: '饭后走一走，活到九十九。真能走出长寿吗？没那么简单。但身体里，确实有变化。',
      foregroundStories: ['meal-to-question'], targetId: 'person_01',
    },
    {
      id: '02', start: 10, end: 22, key: 'digestion',
      title: '淀粉消化，小肠吸收入血',
      subtitle: '吃完饭，淀粉经过消化变成葡萄糖，从小肠进入血液。餐后血糖通常会上升。',
      foregroundStories: ['starch-to-blood'], targetId: 'small_intestine',
    },
    {
      id: '03', start: 22, end: 32, key: 'whole-body-walk',
      title: '走路时，整个人都在参与',
      subtitle: '走路时，不只是腿在动。臀部、躯干，还有摆臂的肌肉，也会参与其中。',
      foregroundStories: ['differential-muscle-activity'], targetId: 'person_01',
    },
    {
      id: '04', start: 32, end: 41, key: 'blood-target',
      title: '血液把葡萄糖送到活动中的肌肉',
      subtitle: '从整个人体看，血液把葡萄糖送往各处，也送到正在工作的肌肉。',
      foregroundStories: ['blood-to-right-gluteus-medius'], targetId: 'right_gluteus_medius',
    },
    {
      id: '05', start: 41, end: 66, key: 'cell-uptake',
      title: '走进一处代表性肌细胞',
      subtitle: '走进一块活动中的肌肉看看。葡萄糖先穿过毛细血管壁，经过细胞外的间隙，再通过肌细胞膜，进入细胞。',
      foregroundStories: ['two-biological-boundaries'], targetId: 'right_gluteus_medius',
    },
    {
      id: '06', start: 66, end: 78, key: 'return-to-person',
      title: '摄糖与收缩有关，但不是一步瞬降',
      subtitle: '肌肉收缩会促进葡萄糖摄取。但这不是说，每迈一步，血糖都会立刻下降。',
      foregroundStories: ['same-anchor-return'], targetId: 'right_gluteus_medius',
    },
    {
      id: '07', start: 78, end: 99, key: 'evidence',
      title: '八项短期试验：有方向，也有限制',
      subtitle: '有研究汇总了八项短期试验。和饭后不运动相比，饭后运动总体能减小餐后血糖波动。但研究规模有限，也不是人人都一样。',
      foregroundStories: ['short-term-evidence-with-limits'], targetId: 'evidence_board',
    },
    {
      id: '08', start: 99, end: 111, key: 'takeaway',
      title: '规律活动，比一句长寿口号更值得记住',
      subtitle: '这不能证明散步就能活到九十九。更值得记住的，是量力而行，把规律活动变成习惯。',
      foregroundStories: ['qualified-takeaway'], targetId: 'person_01',
    },
  ].map(Object.freeze));

  function sceneAt(time) {
    const t = Math.max(0, Math.min(FILM.duration - Number.EPSILON, time));
    return SCENES.find((scene) => t >= scene.start && t < scene.end) || SCENES.at(-1);
  }

  function subtitleAt(time) {
    const scene = sceneAt(time);
    return { sceneId: scene.id, text: scene.subtitle };
  }

  function observationWindows() {
    return [
      { id: 'time_compression', start: 13, end: 15.2, label: '原理示意·时间尺度已压缩' },
      { id: 'capillary_wall', start: 52, end: 53.5, label: '第一道边界：毛细血管壁' },
      { id: 'muscle_membrane', start: 60.5, end: 62, label: '第二道边界：肌细胞膜' },
      { id: 'research_limit', start: 94, end: 97, label: '研究规模有限，仍需更多验证' },
      { id: 'final_takeaway', start: 107, end: 109.5, label: '量力而行，把规律活动变成习惯' },
    ];
  }
  const api = {
    FILM,
    SCENES,
    sceneAt,
    subtitleAt,
    observationWindows,
    SUBTITLE_LAYOUT,
    VISUAL_LAYOUT,
    titleFontSize,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EP01FullTimeline = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
