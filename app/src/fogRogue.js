const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const enemies = [
  { id: "ticketShade", name: "抽票影", title: "售票厅残留体", hp: 4, power: 1, note: "它把每一次犹豫都印成一张没有终点的票。" },
  { id: "cableAttendant", name: "红缆站务", title: "供电廊异常", hp: 5, power: 1, note: "它的工服下垂着不该带电的红色回路。" },
  { id: "mirrorInspector", name: "镜面检票员", title: "月台拦截者", hp: 6, power: 2, note: "它只核验倒影里的那张票。" },
  { id: "seventhConductor", name: "第七节乘务员", title: "闸门守望者", hp: 8, power: 2, note: "它坚持认为每个人都已经上过车。" },
  { id: "fogCustodian", name: "雾港保管员", title: "回收序列", hp: 7, power: 2, note: "它把遗失的工牌一张张贴回雾里。" },
];

const rewards = [
  { id: "rainShears", label: "雨线剪", description: "清障动作额外造成 1 点压制。", effects: { attack: 1 } },
  { id: "lampCore", label: "未熄雾灯芯", description: "每次击退异常后回复 1 点状态。", effects: { victoryHeal: 1 } },
  { id: "returnPencil", label: "回路检修笔", description: "观察异常时额外获得 1 点专注。", effects: { inspectFocus: 1 } },
  { id: "blankTicket", label: "未打孔车票", description: "封存动作额外获得 1 层护持。", effects: { sealWard: 1 } },
  { id: "relayTag", label: "交班中继牌", description: "最大状态 +2，并立即修复 2 点状态。", effects: { maxHp: 2, heal: 2 } },
  { id: "stationRule", label: "折角站务守则", description: "护持可抵消的伤害额外 +1。", effects: { guard: 1 } },
];

const nextRandom = (seed) => {
  const value = (seed * 1664525 + 1013904223) >>> 0;
  return [value, value / 4294967296];
};

const selectUnique = (pool, count, seed, excluded = []) => {
  const available = pool.filter((item) => !excluded.includes(item.id));
  const selected = [];
  let currentSeed = seed;
  while (selected.length < Math.min(count, available.length)) {
    const [nextSeed, value] = nextRandom(currentSeed);
    currentSeed = nextSeed;
    const item = available.splice(Math.floor(value * available.length), 1)[0];
    selected.push(item);
  }
  return [selected, currentSeed];
};

const effectValue = (run, effect) => run.relics.reduce((total, relic) => total + (relic.effects[effect] ?? 0), 0);

const projectionDescriptions = {
  I: "静默校准：观察时留下 1 层护持。",
  E: "同行反照：击退异常后额外修复 1 点状态。",
  S: "实物拆解：对已观察异常的清障额外造成 1 点压制。",
  N: "余响预读：观察时额外获得 1 点专注。",
  T: "流程清障：基础清障压制 +1。",
  F: "守望围栏：封存时额外获得 1 层护持。",
  J: "预备交班：每个新节点开始时获得 1 层护持。",
  P: "临界回转：护持抵消伤害后保留 1 层。",
};

export const getRogueProjection = (type = "INTJ") => ({
  label: `${type} · 雾港清障投影`,
  perks: [...type].map((letter) => projectionDescriptions[letter]).filter(Boolean),
});

export const getActiveRogueEnemy = (run) => {
  if (!run || run.floor >= run.enemyPath.length) return null;
  const enemy = run.enemyPath[run.floor];
  return { ...enemy, currentHp: run.enemyHealth[run.floor] };
};

const openNextReward = (run, seed) => {
  const [offer, nextSeed] = selectUnique(rewards, 3, seed, run.relics.map((relic) => relic.id));
  return { ...run, phase: "reward", offer, seed: nextSeed };
};

export const createFogRogueRun = (type, seed = Date.now()) => {
  const [path, nextSeed] = selectUnique(enemies, 4, seed);
  const initialWard = type?.[3] === "J" ? 1 : 0;
  return {
    type,
    seed: nextSeed,
    maxHp: 9,
    hp: 9,
    focus: 2,
    ward: initialWard,
    floor: 0,
    enemyPath: path,
    enemyHealth: path.map((enemy) => enemy.hp),
    relics: [],
    offer: [],
    observed: [],
    phase: "battle",
    history: [{ kind: "entry", text: `以 ${type} 的虚构清障投影进入雾港。` }],
  };
};

const resolveEnemyHit = (run, enemy, hp, ward) => {
  const protection = ward + effectValue(run, "guard");
  const adaptable = run.type?.[3] === "P" && protection > 0 ? 1 : 0;
  const damage = Math.max(0, enemy.power - protection);
  return {
    hp: clamp(hp - damage, 0, run.maxHp),
    ward: adaptable ? Math.min(1, ward) : 0,
    damage,
  };
};

export const performRogueAction = (run, action) => {
  const enemy = getActiveRogueEnemy(run);
  if (!enemy || run.phase !== "battle") return run;

  let hp = run.hp;
  let focus = run.focus;
  let ward = run.ward;
  let enemyHp = enemy.currentHp;
  let observed = run.observed;
  let text = "";

  if (action === "strike") {
    const observedBonus = observed.includes(enemy.id) && run.type?.[1] === "S" ? 1 : 0;
    const focusBonus = focus >= 4 ? 1 : 0;
    const damage = 2 + (run.type?.[2] === "T" ? 1 : 0) + effectValue(run, "attack") + observedBonus + focusBonus;
    enemyHp = Math.max(0, enemyHp - damage);
    text = `你用清障技法压制 ${enemy.name} ${damage} 点。`;
  } else if (action === "inspect") {
    const insight = 1 + (run.type?.[1] === "N" ? 1 : 0) + effectValue(run, "inspectFocus");
    focus = clamp(focus + insight, 0, 5);
    ward = clamp(ward + (run.type?.[0] === "I" ? 1 : 0), 0, 5);
    observed = observed.includes(enemy.id) ? observed : [...observed, enemy.id];
    text = `你记录了 ${enemy.name} 的回声频率，专注 +${insight}。`;
  } else if (action === "seal") {
    const guard = 2 + (run.type?.[2] === "F" ? 1 : 0) + effectValue(run, "sealWard");
    ward = clamp(ward + guard, 0, 5);
    focus = clamp(focus - 1, 0, 5);
    text = `你在脚边展开封存线，护持 +${guard}。`;
  } else {
    return run;
  }

  const enemyHealth = [...run.enemyHealth];
  enemyHealth[run.floor] = enemyHp;
  if (enemyHp === 0) {
    const heal = (run.type?.[0] === "E" ? 1 : 0) + effectValue(run, "victoryHeal");
    hp = clamp(hp + heal, 0, run.maxHp);
    const cleared = run.floor === run.enemyPath.length - 1;
    const nextRun = {
      ...run,
      hp,
      focus,
      ward,
      enemyHealth,
      observed,
      phase: cleared ? "cleared" : "battle",
      history: [...run.history, { kind: "victory", text: `${text}${heal ? ` 交班余温修复 ${heal} 点状态。` : ""}` }],
    };
    return cleared ? nextRun : openNextReward(nextRun, run.seed);
  }

  const counter = resolveEnemyHit(run, enemy, hp, ward);
  const phase = counter.hp === 0 ? "lost" : "battle";
  return {
    ...run,
    hp: counter.hp,
    focus,
    ward: counter.ward,
    enemyHealth,
    observed,
    phase,
    history: [...run.history, { kind: action, text: `${text}${counter.damage ? ` ${enemy.name}反扑，你损失 ${counter.damage} 点状态。` : ` ${enemy.name}的反扑被封存线抵消。`}` }],
  };
};

export const chooseRogueReward = (run, rewardId) => {
  if (run.phase !== "reward") return run;
  const reward = run.offer.find((item) => item.id === rewardId);
  if (!reward) return run;
  const maxHp = run.maxHp + (reward.effects.maxHp ?? 0);
  const hp = clamp(run.hp + (reward.effects.heal ?? 0), 0, maxHp);
  const nextFloor = run.floor + 1;
  const ward = run.type?.[3] === "J" ? Math.max(run.ward, 1) : run.ward;
  return {
    ...run,
    maxHp,
    hp,
    ward,
    floor: nextFloor,
    relics: [...run.relics, reward],
    offer: [],
    phase: "battle",
    history: [...run.history, { kind: "reward", text: `你将「${reward.label}」写入本次清障记录。` }],
  };
};

export const resolveRogueEnding = (run) => {
  if (run?.phase === "cleared") {
    return {
      title: "清障完成 · 晨车仍可抵达",
      text: `你以 ${run.type} 的虚构投影穿过了四个雾港节点。异常被逐一写回可追溯的记录，晨车没有停在第七站。`,
    };
  }
  if (run?.phase === "lost") {
    return {
      title: "清障中断 · 雾港暂时闭合",
      text: "这条虚构世界线在交班前中断。保留下来的证物与路线会在下一次试行中提供新的应对方式。",
    };
  }
  return null;
};
