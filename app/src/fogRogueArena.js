const WIDTH = 320;
const HEIGHT = 220;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const nextRandom = (seed) => {
  const value = (seed * 1664525 + 1013904223) >>> 0;
  return [value, value / 4294967296];
};

const pick = (items, seed) => {
  const [nextSeed, value] = nextRandom(seed);
  return [items[Math.floor(value * items.length)], nextSeed];
};

const pickOffer = (items, seed, count = 3) => {
  const remaining = [...items];
  const offer = [];
  let currentSeed = seed;
  while (offer.length < Math.min(count, remaining.length)) {
    const [nextSeed, value] = nextRandom(currentSeed);
    currentSeed = nextSeed;
    offer.push(remaining.splice(Math.floor(value * remaining.length), 1)[0]);
  }
  return [offer, currentSeed];
};

export const arenaWeapons = [
  { id: "pulsePistol", name: "脉冲手枪", description: "直线脉冲，适合暴击与穿透构筑。", damage: 11, interval: .32, projectiles: 1, spread: .06, color: "#d9e9c8" },
  { id: "magScatter", name: "磁轨霰弹枪", description: "近距扇形爆发，适合散射与击退构筑。", damage: 8, interval: .65, projectiles: 4, spread: .35, color: "#e7b48d" },
  { id: "droneEmitter", name: "无人机发生器", description: "自动锁定最近异常，适合持续输出构筑。", damage: 7, interval: .48, projectiles: 2, spread: .16, color: "#9ec7dd" },
];

const enemyBlueprints = [
  { id: "crawler", name: "爬行检修体", hp: 25, speed: 35, damage: 8, xp: 3, coin: 1, radius: 7, color: "#b78e76" },
  { id: "heavy", name: "重装感染体", hp: 58, speed: 19, damage: 14, xp: 6, coin: 2, radius: 12, color: "#845f64" },
  { id: "burst", name: "自燃站务体", hp: 18, speed: 52, damage: 18, xp: 4, coin: 1, radius: 8, color: "#d47e63" },
  { id: "turret", name: "失控点台", hp: 34, speed: 14, damage: 10, xp: 5, coin: 2, radius: 9, color: "#9d91b8" },
  { id: "shield", name: "票根盾卫", hp: 42, speed: 28, damage: 10, xp: 5, coin: 2, radius: 10, color: "#78959c" },
];

const bossBlueprint = { id: "boss", name: "第七站监督员", hp: 520, speed: 25, damage: 20, xp: 40, coin: 18, radius: 21, color: "#d5a579", boss: true };

export const arenaUpgrades = [
  { id: "damage", name: "线路过载", description: "攻击力 +20%。", effect: { damage: .2 }, category: "通用" },
  { id: "fireRate", name: "急速交班", description: "攻击间隔缩短 15%。", effect: { fireRate: .15 }, category: "通用" },
  { id: "maxHp", name: "备用呼吸阀", description: "最大状态 +20，并修复 20。", effect: { maxHp: 20, heal: 20 }, category: "生存" },
  { id: "speed", name: "湿轨快步", description: "移动速度 +12%。", effect: { speed: .12 }, category: "生存" },
  { id: "crit", name: "冷光瞄准", description: "暴击率 +8%。", effect: { crit: .08 }, category: "通用" },
  { id: "critDamage", name: "碎票暴击", description: "暴击伤害 +35%。", effect: { critDamage: .35 }, category: "通用" },
  { id: "armor", name: "玻璃护符", description: "护甲 +2。", effect: { armor: 2 }, category: "生存" },
  { id: "dash", name: "临站冲刺", description: "闪避充能 +1。", effect: { dash: 1 }, category: "生存" },
  { id: "projectile", name: "分流弹道", description: "每次攻击投射物 +1。", effect: { projectiles: 1 }, category: "武器" },
  { id: "pierce", name: "贯穿工单", description: "投射物穿透 +1。", effect: { pierce: 1 }, category: "武器" },
  { id: "scatter", name: "扇面校准", description: "投射物散射更宽，伤害 +8%。", effect: { damage: .08, spread: .1 }, category: "武器" },
  { id: "burn", name: "余烬标记", description: "命中附加短暂灼痕。", effect: { burn: 1 }, category: "异常" },
  { id: "frost", name: "霜线协议", description: "命中使异常减速。", effect: { frost: 1 }, category: "异常" },
  { id: "chain", name: "回路跳接", description: "命中时向附近异常跳接。", effect: { chain: 1 }, category: "异常" },
  { id: "corrosion", name: "潮蚀刻痕", description: "命中削弱异常护持。", effect: { corrosion: 1 }, category: "异常" },
  { id: "explosion", name: "封存爆点", description: "击退异常时小范围震荡。", effect: { explosion: 1 }, category: "异常" },
  { id: "xp", name: "档案回收", description: "经验获取 +15%。", effect: { xpGain: .15 }, category: "通用" },
  { id: "coin", name: "遗物回收", description: "硬币掉落 +1。", effect: { coinGain: 1 }, category: "通用" },
  { id: "repair", name: "晨车修复", description: "每次升级修复 10 点状态。", effect: { levelHeal: 10 }, category: "生存" },
  { id: "lastLight", name: "末灯保险", description: "本局首次致命伤害保留 1 点状态。", effect: { lastLight: 1 }, category: "生存" },
  { id: "drone", name: "无人机增殖", description: "自动射击间隔额外缩短 10%。", effect: { fireRate: .1, drone: 1 }, category: "武器" },
  { id: "resonance", name: "元素共振", description: "每种异常强化使所有伤害 +6%。", effect: { resonance: 1 }, category: "异常" },
];

const typePerks = {
  I: { label: "静默校准", effect: { armor: 1 }, description: "起始护甲 +1。" },
  E: { label: "同行火种", effect: { levelHeal: 4 }, description: "每次升级额外修复 4 点状态。" },
  S: { label: "实物拆解", effect: { damage: .08 }, description: "起始伤害 +8%。" },
  N: { label: "余响预读", effect: { xpGain: .1 }, description: "经验获取 +10%。" },
  T: { label: "流程清障", effect: { crit: .04 }, description: "暴击率 +4%。" },
  F: { label: "守望围栏", effect: { maxHp: 8 }, description: "最大状态 +8。" },
  J: { label: "预备交班", effect: { dash: 1 }, description: "闪避充能 +1。" },
  P: { label: "临界回转", effect: { speed: .08 }, description: "移动速度 +8%。" },
};

const applyEffect = (player, effect) => ({
  ...player,
  maxHp: player.maxHp + (effect.maxHp ?? 0),
  hp: clamp(player.hp + (effect.heal ?? 0), 0, player.maxHp + (effect.maxHp ?? 0)),
  speed: player.speed * (1 + (effect.speed ?? 0)),
  damage: player.damage * (1 + (effect.damage ?? 0)),
  fireRate: player.fireRate + (effect.fireRate ?? 0),
  crit: clamp(player.crit + (effect.crit ?? 0), 0, .8),
  critDamage: player.critDamage + (effect.critDamage ?? 0),
  armor: player.armor + (effect.armor ?? 0),
  dashMax: player.dashMax + (effect.dash ?? 0),
  projectiles: player.projectiles + (effect.projectiles ?? 0),
  pierce: player.pierce + (effect.pierce ?? 0),
  spread: player.spread + (effect.spread ?? 0),
  burn: player.burn + (effect.burn ?? 0),
  frost: player.frost + (effect.frost ?? 0),
  chain: player.chain + (effect.chain ?? 0),
  corrosion: player.corrosion + (effect.corrosion ?? 0),
  explosion: player.explosion + (effect.explosion ?? 0),
  xpGain: player.xpGain + (effect.xpGain ?? 0),
  coinGain: player.coinGain + (effect.coinGain ?? 0),
  levelHeal: player.levelHeal + (effect.levelHeal ?? 0),
  lastLight: player.lastLight || Boolean(effect.lastLight),
});

export const getArenaProjection = (type = "INTJ") => {
  const perks = [...type].map((letter) => typePerks[letter]).filter(Boolean);
  return { label: `${type} · 雾港回收者投影`, perks };
};

const spawnEnemy = (run, blueprint, seed, elite = false) => {
  const [nextSeed, edgeValue] = nextRandom(seed);
  const [finalSeed, coordinate] = nextRandom(nextSeed);
  const side = Math.floor(edgeValue * 4);
  const offset = 16 + coordinate * (side < 2 ? HEIGHT - 32 : WIDTH - 32);
  const position = side === 0 ? { x: offset, y: -14 } : side === 1 ? { x: offset, y: HEIGHT + 14 } : side === 2 ? { x: -14, y: offset } : { x: WIDTH + 14, y: offset };
  const multiplier = elite ? 1.7 : 1 + Math.min(.7, run.time / 150);
  return [{
    ...blueprint,
    id: `${blueprint.id}-${run.spawnIndex}-${Math.floor(finalSeed)}`,
    x: position.x,
    y: position.y,
    hp: Math.round(blueprint.hp * multiplier),
    maxHp: Math.round(blueprint.hp * multiplier),
    damage: Math.round(blueprint.damage * multiplier),
    elite,
    burnTime: 0,
    frostTime: 0,
    hitCooldown: 0,
  }, finalSeed];
};

const makeUpgradeOffer = (run, seed) => pickOffer(arenaUpgrades, seed, 3);

export const createArenaRun = (type, weaponId, meta = { embers: 0 }, seed = Date.now()) => {
  const weapon = arenaWeapons.find((item) => item.id === weaponId) ?? arenaWeapons[0];
  let player = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    hp: 100,
    maxHp: 100,
    speed: 72,
    damage: weapon.damage,
    fireRate: 0,
    crit: .05,
    critDamage: 1.5,
    armor: 0,
    dashMax: 2,
    dashCharges: 2,
    dashRecharge: 0,
    invuln: 0,
    projectiles: weapon.projectiles,
    pierce: 0,
    spread: weapon.spread,
    burn: 0,
    frost: 0,
    chain: 0,
    corrosion: 0,
    explosion: 0,
    xpGain: 0,
    coinGain: 0,
    levelHeal: 0,
    lastLight: false,
  };
  [...type].map((letter) => typePerks[letter]).filter(Boolean).forEach((perk) => { player = applyEffect(player, perk.effect); });
  const metaBonus = Math.min(15, (meta.embers ?? 0) * 2);
  player = { ...player, maxHp: player.maxHp + metaBonus, hp: player.hp + metaBonus };
  return {
    type,
    weapon,
    player,
    time: 0,
    level: 1,
    xp: 0,
    nextXp: 14,
    coins: 0,
    kills: 0,
    spawnTimer: .6,
    spawnIndex: 0,
    shotTimer: .1,
    enemies: [],
    bullets: [],
    upgrades: [],
    relics: [],
    offer: [],
    shop: [],
    phase: "running",
    bossSpawned: false,
    bossDefeated: false,
    eventSeen: false,
    shopSeen: false,
    message: "雾港外围已开启。移动、闪避并让主武器自动清障。",
    seed,
  };
};

const enemyTarget = (run, aim) => {
  if (aim && Number.isFinite(aim.x) && Number.isFinite(aim.y)) return aim;
  return run.enemies.reduce((closest, enemy) => (!closest || distance(run.player, enemy) < distance(run.player, closest) ? enemy : closest), null);
};

const createBullets = (run, aim) => {
  const target = enemyTarget(run, aim);
  if (!target) return run;
  const baseAngle = Math.atan2(target.y - run.player.y, target.x - run.player.x);
  const bullets = [...run.bullets];
  let seed = run.seed;
  for (let index = 0; index < run.player.projectiles; index += 1) {
    const offset = run.player.projectiles === 1 ? 0 : ((index / (run.player.projectiles - 1)) - .5) * run.player.spread;
    const [nextSeed, random] = nextRandom(seed);
    seed = nextSeed;
    const critical = random < run.player.crit;
    const damage = run.player.damage * (critical ? run.player.critDamage : 1);
    bullets.push({ x: run.player.x, y: run.player.y, vx: Math.cos(baseAngle + offset) * 190, vy: Math.sin(baseAngle + offset) * 190, damage, pierce: run.player.pierce, life: 1.35, critical, color: run.weapon.color });
  }
  return { ...run, bullets, seed };
};

const killEnemy = (run, enemy, enemies) => {
  const player = run.player;
  const gain = Math.round(enemy.xp * (1 + player.xpGain));
  const coins = run.coins + enemy.coin + player.coinGain;
  const xp = run.xp + gain;
  const kills = run.kills + 1;
  const extraDamage = player.explosion && enemies.length ? enemies.map((other) => distance(enemy, other) < 35 ? { ...other, hp: other.hp - 8 } : other) : enemies;
  return { ...run, enemies: extraDamage, xp, coins, kills, message: `${enemy.name}${enemy.elite ? "（精英）" : ""}已被写回雾港记录。` };
};

const applyBulletHit = (run, bullet, enemyIndex) => {
  const enemy = run.enemies[enemyIndex];
  const enemies = [...run.enemies];
  const damage = bullet.damage;
  const updated = {
    ...enemy,
    hp: enemy.hp - damage,
    burnTime: run.player.burn ? Math.max(enemy.burnTime, 2) : enemy.burnTime,
    frostTime: run.player.frost ? Math.max(enemy.frostTime, 1.5) : enemy.frostTime,
  };
  enemies[enemyIndex] = updated;
  let nextRun = { ...run, enemies, message: `${bullet.critical ? "暴击 · " : ""}${Math.round(damage)} 点清障伤害。` };
  if (run.player.chain && nextRun.enemies.length > 1) {
    const secondary = nextRun.enemies.find((item, index) => index !== enemyIndex && distance(item, updated) < 48);
    if (secondary) nextRun = { ...nextRun, enemies: nextRun.enemies.map((item) => item.id === secondary.id ? { ...item, hp: item.hp - 5 * run.player.chain } : item) };
  }
  return nextRun;
};

const applyLevelCheck = (run) => {
  if (run.xp < run.nextXp) return run;
  const [offer, seed] = makeUpgradeOffer(run, run.seed);
  return {
    ...run,
    xp: run.xp - run.nextXp,
    level: run.level + 1,
    nextXp: Math.round(run.nextXp * 1.32),
    offer,
    seed,
    phase: "upgrade",
    message: "等级提升 · 从三份临时强化中选择一份。",
  };
};

const makeShop = (run) => [
  { id: "repair", name: "晨车修复包", description: "修复 28 点状态。", cost: 5, effect: { heal: 28 } },
  { id: "cache", name: "遗物回收箱", description: "随机获得一份强化。", cost: 9, effect: { randomUpgrade: true } },
  { id: "glass", name: "破镜护符", description: "护甲 +2，最大状态 -8。", cost: 7, effect: { armor: 2, maxHp: -8 } },
];

export const chooseArenaUpgrade = (run, upgradeId) => {
  if (run.phase !== "upgrade") return run;
  const upgrade = run.offer.find((item) => item.id === upgradeId);
  if (!upgrade) return run;
  const player = applyEffect(run.player, upgrade.effect);
  return {
    ...run,
    player: { ...player, hp: clamp(player.hp + player.levelHeal, 0, player.maxHp) },
    upgrades: [...run.upgrades, upgrade],
    offer: [],
    phase: "running",
    message: `获得强化「${upgrade.name}」。`,
  };
};

export const chooseArenaEvent = (run, choiceId) => {
  if (run.phase !== "event") return run;
  if (choiceId === "open") {
    const [upgrade, seed] = pick(arenaUpgrades, run.seed);
    const player = { ...applyEffect(run.player, upgrade.effect), hp: Math.max(1, Math.floor(run.player.hp * .8)) };
    return { ...run, player, upgrades: [...run.upgrades, upgrade], phase: "running", seed, message: `你拆开了神秘装置，获得「${upgrade.name}」。` };
  }
  return { ...run, coins: run.coins + 7, player: applyEffect(run.player, { heal: 10 }), phase: "running", message: "你把求救信号送回投递巷，得到硬币与修复。" };
};

export const buyArenaShopItem = (run, itemId) => {
  if (run.phase !== "shop") return run;
  const item = run.shop.find((entry) => entry.id === itemId);
  if (!item || run.coins < item.cost) return { ...run, message: "硬币不足，无法完成交易。" };
  if (item.effect.randomUpgrade) {
    const [upgrade, seed] = pick(arenaUpgrades, run.seed);
    return { ...run, coins: run.coins - item.cost, upgrades: [...run.upgrades, upgrade], shop: run.shop.filter((entry) => entry.id !== item.id), seed, message: `故障商人递来「${upgrade.name}」。` };
  }
  return { ...run, coins: run.coins - item.cost, player: applyEffect(run.player, item.effect), shop: run.shop.filter((entry) => entry.id !== item.id), message: `购买了「${item.name}」。` };
};

export const leaveArenaShop = (run) => run.phase === "shop" ? { ...run, phase: "running", message: "你离开了故障商人，雾重新开始流动。" } : run;

export const advanceArenaRun = (run, input, dt) => {
  if (!run || run.phase !== "running") return run;
  const delta = Math.min(.08, Math.max(.01, dt));
  let next = { ...run, time: run.time + delta, player: { ...run.player }, enemies: run.enemies.map((enemy) => ({ ...enemy })), bullets: run.bullets.map((bullet) => ({ ...bullet })) };
  let { player } = next;
  const direction = { x: (input.right ? 1 : 0) - (input.left ? 1 : 0), y: (input.down ? 1 : 0) - (input.up ? 1 : 0) };
  const length = Math.hypot(direction.x, direction.y) || 1;
  player.x = clamp(player.x + (direction.x / length) * player.speed * delta, 9, WIDTH - 9);
  player.y = clamp(player.y + (direction.y / length) * player.speed * delta, 9, HEIGHT - 9);
  player.invuln = Math.max(0, player.invuln - delta);
  player.dashRecharge += delta;
  if (player.dashRecharge >= 2.4 && player.dashCharges < player.dashMax) { player.dashCharges += 1; player.dashRecharge = 0; }
  if (input.dash && player.dashCharges > 0) {
    const dashDirection = direction.x || direction.y ? direction : { x: (input.aim?.x ?? player.x) - player.x, y: (input.aim?.y ?? player.y) - player.y };
    const dashLength = Math.hypot(dashDirection.x, dashDirection.y) || 1;
    player.x = clamp(player.x + (dashDirection.x / dashLength) * 42, 9, WIDTH - 9);
    player.y = clamp(player.y + (dashDirection.y / dashLength) * 42, 9, HEIGHT - 9);
    player.dashCharges -= 1;
    player.invuln = .38;
    player.dashRecharge = 0;
    next.message = "临站闪避 · 短暂无敌。";
  }

  next.spawnTimer -= delta;
  const spawnCap = next.bossSpawned ? 13 : Math.min(34, 13 + Math.floor(next.time / 12) * 3);
  if (next.spawnTimer <= 0 && next.enemies.length < spawnCap && !next.bossSpawned) {
    const [blueprint, seed] = pick(enemyBlueprints.slice(0, next.time > 28 ? 5 : 3), next.seed);
    const [enemy, finalSeed] = spawnEnemy(next, blueprint, seed, next.time > 38 && next.time < 70 && seed % 9 === 0);
    next = { ...next, enemies: [...next.enemies, enemy], seed: finalSeed, spawnIndex: next.spawnIndex + 1, spawnTimer: Math.max(.26, 1.1 - next.time * .011) };
  }
  if (next.time >= 72 && !next.bossSpawned) {
    const [boss, seed] = spawnEnemy(next, bossBlueprint, next.seed);
    next = { ...next, enemies: [...next.enemies, boss], seed, spawnIndex: next.spawnIndex + 1, bossSpawned: true, message: "警报 · 第七站监督员已进入月台。" };
  }

  next.shotTimer -= delta;
  if (next.shotTimer <= 0 && next.enemies.length > 0) {
    next = createBullets(next, input.aim);
    next.shotTimer = next.weapon.interval / (1 + next.player.fireRate);
  }

  const survivors = [];
  let localRun = { ...next, enemies: [] };
  next.enemies.forEach((enemy) => {
    const dx = localRun.player.x - enemy.x;
    const dy = localRun.player.y - enemy.y;
    const enemyDistance = Math.hypot(dx, dy) || 1;
    const slow = enemy.frostTime > 0 ? .55 : 1;
    enemy.x += (dx / enemyDistance) * enemy.speed * slow * delta;
    enemy.y += (dy / enemyDistance) * enemy.speed * slow * delta;
    enemy.frostTime = Math.max(0, enemy.frostTime - delta);
    enemy.burnTime = Math.max(0, enemy.burnTime - delta);
    if (enemy.burnTime > 0) enemy.hp -= 3 * localRun.player.burn * delta;
    if (distance(localRun.player, enemy) < enemy.radius + 7 && localRun.player.invuln <= 0) {
      const loss = Math.max(1, enemy.damage - localRun.player.armor);
      localRun.player = { ...localRun.player, hp: localRun.player.hp - loss, invuln: .55 };
      localRun.message = `${enemy.name}接触造成 ${loss} 点状态损失。`;
      if (enemy.id.startsWith("burst")) enemy.hp = 0;
    }
    if (enemy.hp > 0) survivors.push(enemy);
    else localRun = killEnemy(localRun, enemy, survivors);
  });
  localRun.enemies = survivors.filter((enemy) => enemy.hp > 0);

  const activeBullets = [];
  next.bullets.forEach((bullet) => {
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life -= delta;
    let hitIndex = localRun.enemies.findIndex((enemy) => distance(bullet, enemy) < enemy.radius + 3);
    while (hitIndex >= 0 && bullet.pierce >= 0) {
      localRun = applyBulletHit(localRun, bullet, hitIndex);
      bullet.pierce -= 1;
      if (bullet.pierce < 0) break;
      hitIndex = localRun.enemies.findIndex((enemy, index) => index !== hitIndex && distance(bullet, enemy) < enemy.radius + 3);
    }
    if (bullet.life > 0 && bullet.x > -12 && bullet.x < WIDTH + 12 && bullet.y > -12 && bullet.y < HEIGHT + 12 && bullet.pierce >= 0) activeBullets.push(bullet);
  });
  const defeated = localRun.enemies.filter((enemy) => enemy.hp <= 0);
  localRun.enemies = localRun.enemies.filter((enemy) => enemy.hp > 0);
  defeated.forEach((enemy) => { localRun = killEnemy(localRun, enemy, localRun.enemies); if (enemy.boss) localRun = { ...localRun, bossDefeated: true }; });
  localRun.bullets = activeBullets;

  if (localRun.player.hp <= 0) {
    if (localRun.player.lastLight) localRun = { ...localRun, player: { ...localRun.player, hp: 1, lastLight: false, invuln: 1 }, message: "末灯保险生效，保留 1 点状态。" };
    else return { ...localRun, player: { ...localRun.player, hp: 0 }, phase: "lost", message: "清障投影在雾中断线。" };
  }
  if (localRun.bossDefeated) return { ...localRun, phase: "cleared", message: "第七站监督员已被封存，晨车恢复线路。" };
  if (!localRun.eventSeen && localRun.time >= 24) return { ...localRun, eventSeen: true, phase: "event", message: "发现一个仍在呼吸的故障装置。" };
  if (!localRun.shopSeen && localRun.time >= 48) return { ...localRun, shopSeen: true, phase: "shop", shop: makeShop(localRun), message: "故障商人打开了潮湿的货柜。" };
  return applyLevelCheck(localRun);
};

export const getArenaResult = (run) => {
  if (!run || !["cleared", "lost"].includes(run.phase)) return null;
  const embers = Math.max(1, Math.floor(run.kills / 8) + (run.phase === "cleared" ? 4 : 0));
  return run.phase === "cleared"
    ? { title: "区域 Boss 已封存", text: `你击退了第七站监督员，带回 ${embers} 枚余烬核心。`, embers }
    : { title: "清障投影已中断", text: `你带回 ${embers} 枚余烬核心；下一局仍可用它们解锁小幅起始支援。`, embers };
};

export const drawArena = (canvas, run, aim) => {
  if (!canvas || !run) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = WIDTH * ratio;
  canvas.height = HEIGHT * ratio;
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = "#0a100f";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.strokeStyle = "rgba(201, 215, 188, .09)";
  context.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 32) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke(); }
  for (let y = 0; y <= HEIGHT; y += 28) { context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke(); }
  context.fillStyle = "rgba(131, 58, 49, .18)";
  context.fillRect(0, HEIGHT - 32, WIDTH, 32);
  run.bullets.forEach((bullet) => { context.fillStyle = bullet.critical ? "#f3d2a6" : bullet.color; context.beginPath(); context.arc(bullet.x, bullet.y, bullet.critical ? 3 : 2, 0, Math.PI * 2); context.fill(); });
  run.enemies.forEach((enemy) => {
    context.fillStyle = enemy.color;
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(4, 8, 7, .85)";
    context.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 6, enemy.radius * 2, 3);
    context.fillStyle = enemy.boss ? "#e3bd91" : enemy.elite ? "#ddb57f" : "#bdd7af";
    context.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 6, (enemy.hp / enemy.maxHp) * enemy.radius * 2, 3);
  });
  context.save();
  context.translate(run.player.x, run.player.y);
  const angle = aim ? Math.atan2(aim.y - run.player.y, aim.x - run.player.x) : 0;
  context.rotate(angle);
  context.fillStyle = run.player.invuln > 0 ? "#f1d8b8" : "#d7e8c1";
  context.fillRect(-7, -7, 14, 14);
  context.fillStyle = "#6f9d9a";
  context.fillRect(5, -2, 8, 4);
  context.restore();
};

export const arenaSize = { width: WIDTH, height: HEIGHT };
