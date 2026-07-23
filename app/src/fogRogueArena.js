import pulsePistolSprite from "./assets/rogue-avatar-pulse-pistol.png?inline";
import magScatterSprite from "./assets/rogue-avatar-mag-scatter.png?inline";
import droneEmitterSprite from "./assets/rogue-avatar-drone-emitter.png?inline";
// The standalone build runs from file:// as a classic script. Keep these
// sprites inline so Vite does not emit import.meta.url asset paths, which
// would prevent the offline package from booting at all.
import fogHarborSliceArt from "./assets/arena-art/fog-harbor-slice-v1.png?inline";
import powerCorridorArt from "./assets/arena-art/power-corridor-v1.png?inline";
import facelessPlatformArt from "./assets/arena-art/faceless-platform-v1.png?inline";
import lastTrainExteriorArt from "./assets/arena-art/last-train-exterior-v1.png?inline";
import lastTrainInteriorArt from "./assets/arena-art/train-carriage-interior-v1.png?inline";
import ticketCrawlerSprite from "./assets/arena-art/ticket-crawler-v2.png?inline";
import facelessPassengerSprite from "./assets/arena-art/faceless-passenger-v2.png?inline";
import cableConductorSprite from "./assets/arena-art/cable-conductor-v2.png?inline";
import { getResidentCampaign } from "./residentCampaigns";
import { getWorksiteNpcs } from "./stationNpcs";

// The full painted station is now the world itself. Keeping world and camera
// at the same 16:9 boundary prevents a player from ever walking out of the
// finished map into a black test canvas.
const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 360;
const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;
// Keep the protagonist's collision body close to the ordinary station-worker
// NPCs. The supplied full-body pose is intentionally no longer a giant token.
const PLAYER_RADIUS = 14;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const distanceToSegment = (point, start, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const progress = lengthSquared <= .0001 ? 0 : clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
  const closest = { x: start.x + dx * progress, y: start.y + dy * progress };
  return { distance: distance(point, closest), progress };
};

/* Archived compact-layout sketches. The live run begins after this block.
const archivedArenaLayouts = [
  {
    id: "fog-harbor-platform",
    name: "雾港站台",
    hint: "中央开阔 · 两侧列车掩体",
    markers: [{ kind: "cache", x: 548, y: 278 }, { kind: "exit", x: 603, y: 302 }],
    // Every coordinate below is authored against the full 16:9 station plate:
    // train doors top, maintenance corridors on both sides, rail fog below.
    spawnZones: {
      trainDoorWest: [{ x: 42, y: 72, width: 28, height: 18 }],
      trainDoors: [
        { x: 42, y: 72, width: 28, height: 18 }, { x: 118, y: 72, width: 28, height: 18 },
        { x: 494, y: 72, width: 28, height: 18 }, { x: 570, y: 72, width: 28, height: 18 },
      ],
      service: [{ x: 18, y: 190, width: 26, height: 58 }, { x: 596, y: 190, width: 26, height: 58 }],
      railFog: [{ x: 164, y: 322, width: 44, height: 22 }, { x: 432, y: 322, width: 44, height: 22 }],
    },
    puddles: [
      { x: 274, y: 206, radiusX: 34, radiusY: 12 }, { x: 400, y: 152, radiusX: 22, radiusY: 8 },
      { x: 165, y: 243, radiusX: 20, radiusY: 9 },
    ],
    obstacles: [
      // These collision areas match the structures already painted into the
      // station art, so they intentionally render nothing in normal play.
      { kind: "tram", artBound: true, x: 0, y: 0, width: 640, height: 60 },
      { kind: "wall", artBound: true, x: 0, y: 0, width: 20, height: 308 }, { kind: "wall", artBound: true, x: 620, y: 0, width: 20, height: 308 },
      { kind: "rail", artBound: true, x: 0, y: 330, width: 640, height: 30 },
      { kind: "column", artBound: true, x: 72, y: 112, width: 28, height: 78 }, { kind: "column", artBound: true, x: 538, y: 112, width: 28, height: 78 },
      { kind: "gate", artBound: true, x: 414, y: 250, width: 88, height: 48 },
      { kind: "breakable", x: 22, y: 162, width: 54, height: 47, hp: 22 },
      { kind: "breakable", x: 572, y: 178, width: 38, height: 42, hp: 18 },
      { kind: "crate", artBound: true, x: 520, y: 270, width: 58, height: 40 },
    ],
  },
  {
    id: "power-corridor",
    name: "供电廊道",
    hint: "窄道电箱 · 击退与破障",
    markers: [{ kind: "cache", x: 1540, y: 290 }, { kind: "exit", x: 162, y: 888 }],
    obstacles: [
      { kind: "tram", x: 100, y: 104, width: 500, height: 78 }, { kind: "tram", x: 1320, y: 895, width: 500, height: 78 },
      { kind: "column", x: 676, y: 88, width: 50, height: 300 }, { kind: "column", x: 1195, y: 692, width: 50, height: 300 },
      { kind: "cables", x: 740, y: 275, width: 330, height: 32 }, { kind: "cables", x: 850, y: 770, width: 330, height: 32 },
      { kind: "barricade", x: 780, y: 430, width: 180, height: 38 }, { kind: "barricade", x: 960, y: 618, width: 180, height: 38 },
      { kind: "breakable", x: 1042, y: 414, width: 70, height: 62, hp: 26 }, { kind: "breakable", x: 808, y: 608, width: 70, height: 62, hp: 26 },
      { kind: "crate", x: 295, y: 510, width: 112, height: 76 }, { kind: "crate", x: 1515, y: 510, width: 112, height: 76 },
      { kind: "column", x: 465, y: 664, width: 50, height: 148 }, { kind: "column", x: 1405, y: 268, width: 50, height: 148 },
      { kind: "breakable", x: 550, y: 465, width: 62, height: 54, hp: 18 }, { kind: "breakable", x: 1310, y: 560, width: 62, height: 54, hp: 18 },
    ],
  },
  {
    id: "faceless-platform",
    name: "无脸月台",
    hint: "多传送门 · 精英优先",
    markers: [{ kind: "cache", x: 965, y: 210 }, { kind: "exit", x: 1750, y: 540 }, { kind: "portal", x: 360, y: 360 }, { kind: "portal", x: 1560, y: 720 }],
    obstacles: [
      { kind: "tram", x: 52, y: 210, width: 410, height: 78 }, { kind: "tram", x: 1458, y: 210, width: 410, height: 78 },
      { kind: "tram", x: 52, y: 790, width: 410, height: 78 }, { kind: "tram", x: 1458, y: 790, width: 410, height: 78 },
      { kind: "column", x: 600, y: 256, width: 54, height: 158 }, { kind: "column", x: 1266, y: 256, width: 54, height: 158 },
      { kind: "column", x: 600, y: 666, width: 54, height: 158 }, { kind: "column", x: 1266, y: 666, width: 54, height: 158 },
      { kind: "crate", x: 773, y: 316, width: 92, height: 68 }, { kind: "crate", x: 1055, y: 696, width: 92, height: 68 },
      { kind: "breakable", x: 920, y: 386, width: 64, height: 56, hp: 20 }, { kind: "breakable", x: 920, y: 636, width: 64, height: 56, hp: 20 },
      { kind: "cables", x: 205, y: 530, width: 240, height: 30 }, { kind: "cables", x: 1475, y: 530, width: 240, height: 30 },
      { kind: "barricade", x: 730, y: 925, width: 170, height: 38 }, { kind: "barricade", x: 1020, y: 118, width: 170, height: 38 },
    ],
  },
];

// MVP intentionally stays in one readable arena. The other layouts remain as
// archived production sketches, but cannot rotate into a live run yet.
const getArenaLayout = () => arenaLayouts[0];
const getArenaObstacles = () => getArenaLayout().obstacles.map((item, index) => ({ ...item, id: `${item.kind}-${index}` }));
const getArenaMarkers = () => getArenaLayout().markers.map((item, index) => ({ ...item, id: `${item.kind}-${index}`, collected: false }));

*/

// Live campaign layouts. Each plate fills the 1280×720 world; the camera
// follows the player through four readable 640×360 sectors instead of showing
// a small art patch surrounded by a black testing canvas.
const campaignLayouts = [
  {
    id: "fog-harbor-platform",
    name: "雾港站台",
    hint: "环形站台 · 列车门与两侧维修区",
    art: "fogHarbor",
    start: { x: 640, y: 290 },
    transitionText: "末班列车停靠在北侧月台，通往 07 号供电廊。",
    destination: "07 号供电廊",
    markers: [{ kind: "cache", x: 1100, y: 526 }, { kind: "train", x: 1035, y: 142 }],
    // Every anchor points at an existing station-side landmark; none occupies
    // the central kite loop, cache, train marker or an enemy entry zone.
    npcAnchors: {
      ticketGate: { x: 792, y: 584, landmark: "站台闸机外侧" }, lampPost: { x: 1082, y: 308, landmark: "右侧信号灯柱" },
      mailRack: { x: 228, y: 518, landmark: "左侧行李与旧广告架" }, signalBox: { x: 1082, y: 308, landmark: "右侧信号电箱" },
      counter: { x: 1028, y: 592, landmark: "南侧封闭售票口" }, mirrorStand: { x: 1028, y: 592, landmark: "南侧闸机玻璃" },
      paperRack: { x: 228, y: 518, landmark: "左侧候车长椅" }, toolCart: { x: 214, y: 430, landmark: "维修工具箱" },
      switchPanel: { x: 1082, y: 308, landmark: "信号切换箱" }, pump: { x: 214, y: 430, landmark: "积水维修口" },
      clock: { x: 214, y: 430, landmark: "月台时钟柱" }, awning: { x: 228, y: 518, landmark: "候车雨棚边缘" },
      patrolSign: { x: 792, y: 584, landmark: "闸机巡逻牌" }, locker: { x: 228, y: 518, landmark: "失物行李区" },
      archiveShelf: { x: 228, y: 518, landmark: "旧广告档案柜" }, suitcasePile: { x: 1028, y: 592, landmark: "南侧旧行李堆" },
      default: [{ x: 214, y: 430, landmark: "西侧服务带" }, { x: 1028, y: 592, landmark: "南侧闸机服务带" }],
    },
    spawnZones: {
      trainDoorWest: [{ x: 84, y: 142, width: 56, height: 32 }],
      trainDoors: [{ x: 84, y: 142, width: 56, height: 32 }, { x: 236, y: 142, width: 56, height: 32 }, { x: 988, y: 142, width: 56, height: 32 }, { x: 1140, y: 142, width: 56, height: 32 }],
      service: [{ x: 36, y: 380, width: 52, height: 116 }, { x: 1192, y: 380, width: 52, height: 116 }],
      railFog: [{ x: 328, y: 644, width: 88, height: 44 }, { x: 864, y: 644, width: 88, height: 44 }],
    },
    puddles: [{ x: 548, y: 412, radiusX: 68, radiusY: 24 }, { x: 800, y: 304, radiusX: 44, radiusY: 16 }, { x: 330, y: 486, radiusX: 40, radiusY: 18 }],
    obstacles: [
      { kind: "tram", artBound: true, x: 0, y: 0, width: 1280, height: 112 },
      { kind: "wall", artBound: true, x: 0, y: 0, width: 40, height: 616 }, { kind: "wall", artBound: true, x: 1240, y: 0, width: 40, height: 616 },
      { kind: "rail", artBound: true, x: 0, y: 660, width: 1280, height: 60 },
      { kind: "column", artBound: true, x: 144, y: 224, width: 56, height: 156 }, { kind: "column", artBound: true, x: 1076, y: 224, width: 56, height: 156 },
      { kind: "gate", artBound: true, x: 828, y: 500, width: 176, height: 96 },
      { kind: "breakable", x: 44, y: 324, width: 108, height: 94, hp: 22 }, { kind: "breakable", x: 1144, y: 356, width: 76, height: 84, hp: 18 }, { kind: "crate", artBound: true, x: 1040, y: 540, width: 116, height: 80 },
    ],
  },
  {
    id: "power-corridor",
    name: "07 号供电廊",
    hint: "配电机组 · 潮湿电缆与可击毁电箱",
    art: "powerCorridor",
    start: { x: 640, y: 410 },
    transitionText: "检修轨道亮起白灯，一列无标识的短编列车正在等候。",
    destination: "无脸月台",
    markers: [{ kind: "cache", x: 260, y: 518 }, { kind: "train", x: 850, y: 624 }],
    npcAnchors: {
      ticketGate: { x: 198, y: 558, landmark: "西侧检修闸门" }, lampPost: { x: 616, y: 214, landmark: "顶部检修灯列" },
      mailRack: { x: 198, y: 558, landmark: "西侧工具柜" }, signalBox: { x: 616, y: 214, landmark: "顶部控制面板" },
      counter: { x: 1130, y: 488, landmark: "东侧维修柜台" }, mirrorStand: { x: 1130, y: 488, landmark: "东侧反光检修板" },
      paperRack: { x: 198, y: 558, landmark: "西侧备件架" }, toolCart: { x: 252, y: 526, landmark: "左侧发电机组" },
      switchPanel: { x: 616, y: 214, landmark: "主配电切换板" }, pump: { x: 1026, y: 520, landmark: "右侧泵机组" },
      clock: { x: 616, y: 214, landmark: "配电计时表" }, awning: { x: 198, y: 558, landmark: "轨道防雨隔板" },
      patrolSign: { x: 198, y: 558, landmark: "西侧安全告示" }, locker: { x: 198, y: 558, landmark: "西侧储物柜" },
      archiveShelf: { x: 198, y: 558, landmark: "编号备件柜" }, suitcasePile: { x: 1130, y: 488, landmark: "东侧货运箱" },
      default: [{ x: 252, y: 526, landmark: "左侧设备带" }, { x: 1026, y: 520, landmark: "右侧设备带" }],
    },
    spawnZones: {
      trainDoorWest: [{ x: 78, y: 230, width: 44, height: 48 }],
      trainDoors: [{ x: 186, y: 132, width: 60, height: 40 }, { x: 612, y: 132, width: 60, height: 40 }, { x: 1015, y: 132, width: 60, height: 40 }],
      service: [{ x: 60, y: 456, width: 56, height: 82 }, { x: 1164, y: 456, width: 56, height: 82 }],
      railFog: [{ x: 320, y: 646, width: 88, height: 40 }, { x: 850, y: 646, width: 88, height: 40 }],
    },
    puddles: [{ x: 604, y: 448, radiusX: 86, radiusY: 30 }, { x: 742, y: 290, radiusX: 52, radiusY: 20 }, { x: 880, y: 576, radiusX: 58, radiusY: 23 }],
    obstacles: [
      { kind: "wall", artBound: true, x: 0, y: 0, width: 48, height: 720 }, { kind: "wall", artBound: true, x: 1232, y: 0, width: 48, height: 720 },
      { kind: "tram", artBound: true, x: 0, y: 0, width: 1280, height: 132 }, { kind: "rail", artBound: true, x: 0, y: 660, width: 1280, height: 60 },
      { kind: "column", artBound: true, x: 278, y: 318, width: 132, height: 176 }, { kind: "column", artBound: true, x: 874, y: 320, width: 112, height: 190 },
      { kind: "cables", artBound: true, x: 410, y: 196, width: 146, height: 42 }, { kind: "cables", artBound: true, x: 728, y: 528, width: 182, height: 42 },
      { kind: "breakable", x: 178, y: 382, width: 76, height: 70, hp: 26 }, { kind: "breakable", x: 1018, y: 390, width: 82, height: 72, hp: 26 }, { kind: "breakable", x: 1095, y: 540, width: 70, height: 62, hp: 20 },
    ],
  },
  {
    id: "faceless-platform",
    name: "无脸月台",
    hint: "开阔候车区 · 门扉压力与终局监督员",
    art: "facelessPlatform",
    start: { x: 640, y: 420 },
    markers: [{ kind: "cache", x: 1024, y: 500 }, { kind: "portal", x: 258, y: 270 }, { kind: "portal", x: 1054, y: 270 }],
    npcAnchors: {
      ticketGate: { x: 640, y: 250, landmark: "列车中央车门" }, lampPost: { x: 322, y: 570, landmark: "西南警示灯柱" },
      mailRack: { x: 322, y: 570, landmark: "西南行李与信箱" }, signalBox: { x: 1136, y: 334, landmark: "东侧故障电箱" },
      counter: { x: 980, y: 584, landmark: "南侧封闭柜台" }, mirrorStand: { x: 1120, y: 300, landmark: "东侧镜面传送门" },
      paperRack: { x: 322, y: 570, landmark: "西南遗失物箱" }, toolCart: { x: 1136, y: 334, landmark: "东侧检修电箱" },
      switchPanel: { x: 1136, y: 334, landmark: "门扉切换面板" }, pump: { x: 980, y: 584, landmark: "南侧排水栅格" },
      clock: { x: 640, y: 250, landmark: "列车门上时钟" }, awning: { x: 322, y: 570, landmark: "西侧雨棚下" },
      patrolSign: { x: 322, y: 570, landmark: "西南巡逻闸门" }, locker: { x: 322, y: 570, landmark: "西南失物柜" },
      archiveShelf: { x: 322, y: 570, landmark: "西南档案箱" }, suitcasePile: { x: 980, y: 584, landmark: "南侧货箱堆" },
      default: [{ x: 322, y: 570, landmark: "西南服务带" }, { x: 1136, y: 334, landmark: "东侧服务带" }],
    },
    spawnZones: {
      trainDoorWest: [{ x: 546, y: 152, width: 72, height: 42 }],
      trainDoors: [{ x: 260, y: 174, width: 62, height: 40 }, { x: 546, y: 152, width: 72, height: 42 }, { x: 928, y: 174, width: 62, height: 40 }],
      service: [{ x: 70, y: 400, width: 56, height: 96 }, { x: 1148, y: 400, width: 56, height: 96 }],
      railFog: [{ x: 356, y: 648, width: 88, height: 40 }, { x: 826, y: 648, width: 88, height: 40 }],
    },
    puddles: [{ x: 614, y: 372, radiusX: 98, radiusY: 34 }, { x: 320, y: 444, radiusX: 46, radiusY: 19 }, { x: 936, y: 434, radiusX: 54, radiusY: 20 }],
    obstacles: [
      { kind: "tram", artBound: true, x: 0, y: 0, width: 1280, height: 130 }, { kind: "rail", artBound: true, x: 0, y: 662, width: 1280, height: 58 },
      { kind: "wall", artBound: true, x: 0, y: 0, width: 54, height: 720 }, { kind: "wall", artBound: true, x: 1226, y: 0, width: 54, height: 720 },
      { kind: "gate", artBound: true, x: 95, y: 520, width: 150, height: 92 }, { kind: "gate", artBound: true, x: 1048, y: 520, width: 150, height: 92 },
      { kind: "column", artBound: true, x: 206, y: 316, width: 80, height: 122 }, { kind: "column", artBound: true, x: 986, y: 316, width: 80, height: 122 },
      { kind: "breakable", x: 120, y: 410, width: 72, height: 78, hp: 24 }, { kind: "breakable", x: 1088, y: 410, width: 72, height: 78, hp: 24 },
    ],
  },
];

const getActiveArenaLayout = (stageIndex = 0, type = "INTJ") => {
  const index = clamp(stageIndex, 0, campaignLayouts.length - 1);
  const base = campaignLayouts[index];
  const campaign = getResidentCampaign(type);
  const worksite = campaign.stages[index] ?? campaign.stages.at(-1);
  const nextWorksite = campaign.stages[index + 1] ?? null;
  return {
    ...base,
    id: worksite.id,
    name: worksite.name,
    hint: worksite.hint,
    art: worksite.art ?? base.art,
    mechanic: worksite.mechanic,
    campaignTitle: campaign.title,
    // Final worksite briefs can omit a bespoke pickup NPC. The live station
    // still needs a valid contact for its transfer cutscene and interaction
    // placement, so give it a route-appropriate unnamed attendant.
    contact: worksite.contact ?? {
      name: base.art === "facelessPlatform" ? "无脸月台值守员" : "站台值守员",
      role: "终点换乘接应",
      line: "别看空白的广告屏。列车会在灯熄前为你打开车门。",
    },
    destination: nextWorksite?.name ?? base.destination,
    transitionText: worksite.contact
      ? `${worksite.contact.role}「${worksite.contact.name}」已在下一站待命。`
      : base.transitionText,
  };
};
const getActiveArenaObstacles = (stageIndex = 0, type = "INTJ") => getActiveArenaLayout(stageIndex, type).obstacles.map((item, index) => ({ ...item, id: `${item.kind}-${index}` }));
const getActiveArenaMarkers = (stageIndex = 0, type = "INTJ") => getActiveArenaLayout(stageIndex, type).markers.map((item, index) => ({ ...item, id: `${item.kind}-${index}`, collected: false }));
const getActiveArenaNpcs = (stageIndex = 0, type = "INTJ") => {
  const layout = getActiveArenaLayout(stageIndex, type);
  return getWorksiteNpcs({ layout, stageIndex });
};

const getNearbyArenaNpc = (run, maxDistance = Infinity) => {
  const candidates = (run.npcs ?? []).map((npc) => ({ npc, range: distance(run.player, npc) }));
  const nearest = candidates.sort((left, right) => left.range - right.range)[0];
  if (!nearest || nearest.range > Math.min(maxDistance, nearest.npc.interactionRange ?? 52)) return null;
  return nearest.npc;
};

const isInsideObstacle = (point, obstacle, padding = 0) => (
  point.x > obstacle.x - padding
  && point.x < obstacle.x + obstacle.width + padding
  && point.y > obstacle.y - padding
  && point.y < obstacle.y + obstacle.height + padding
);

const resolveObstacleCollision = (point, radius, obstacles) => {
  let resolved = { ...point };
  // Two passes also resolve a corner where two pieces of scenery meet.
  for (let pass = 0; pass < 2; pass += 1) {
    obstacles.forEach((obstacle) => {
      const nearestX = clamp(resolved.x, obstacle.x, obstacle.x + obstacle.width);
      const nearestY = clamp(resolved.y, obstacle.y, obstacle.y + obstacle.height);
      let dx = resolved.x - nearestX;
      let dy = resolved.y - nearestY;
      let currentDistance = Math.hypot(dx, dy);
      if (currentDistance >= radius) return;
      if (currentDistance < .001) {
        const left = Math.abs(resolved.x - obstacle.x);
        const right = Math.abs(obstacle.x + obstacle.width - resolved.x);
        const top = Math.abs(resolved.y - obstacle.y);
        const bottom = Math.abs(obstacle.y + obstacle.height - resolved.y);
        const edge = Math.min(left, right, top, bottom);
        if (edge === left) { dx = -1; dy = 0; }
        else if (edge === right) { dx = 1; dy = 0; }
        else if (edge === top) { dx = 0; dy = -1; }
        else { dx = 0; dy = 1; }
        currentDistance = 1;
      }
      const push = radius - currentDistance + .05;
      resolved.x += (dx / currentDistance) * push;
      resolved.y += (dy / currentDistance) * push;
    });
  }
  return {
    x: clamp(resolved.x, radius, WORLD_WIDTH - radius),
    y: clamp(resolved.y, radius, WORLD_HEIGHT - radius),
  };
};

const moveThroughArena = (body, dx, dy, radius, obstacles) => {
  const moved = {
    x: clamp(body.x + dx, radius, WORLD_WIDTH - radius),
    y: clamp(body.y + dy, radius, WORLD_HEIGHT - radius),
  };
  return resolveObstacleCollision(moved, radius, obstacles);
};

// Hostiles cannot use a single straight-line chase once an authored obstacle
// blocks that line. Try a small fan of side steps each frame; if forward
// progress is impossible, deliberately choose the strongest lateral escape.
// This is lightweight enough for a crowd arena while preventing edge spawns
// from staring at a wall forever.
const steerEnemyToward = (enemy, target, delta, obstacles, slow = 1) => {
  const dx = target.x - enemy.x;
  const dy = target.y - enemy.y;
  const targetDistance = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);
  const routeSign = enemy.routeSign ?? 1;
  const step = enemy.speed * slow * delta;
  const angles = [0, routeSign * .38, -routeSign * .38, routeSign * .78, -routeSign * .78, routeSign * 1.18, -routeSign * 1.18];
  let best = null;
  let bestEscape = null;
  angles.forEach((offset) => {
    const position = moveThroughArena(enemy, Math.cos(angle + offset) * step, Math.sin(angle + offset) * step, enemy.radius, obstacles);
    const travel = Math.hypot(position.x - enemy.x, position.y - enemy.y);
    const progress = targetDistance - distance(position, target);
    const candidate = { position, travel, progress, offset, score: progress * 8 + travel * .35 - Math.abs(offset) * .08 };
    if (!best || candidate.score > best.score) best = candidate;
    if (!bestEscape || candidate.travel > bestEscape.travel) bestEscape = candidate;
  });
  const chosen = best && best.travel >= step * .18 ? best : bestEscape ?? best;
  return {
    position: chosen?.position ?? { x: enemy.x, y: enemy.y },
    moved: chosen?.travel ?? 0,
    madeProgress: (chosen?.progress ?? 0) > .02,
    routeSign: chosen && Math.abs(chosen.offset) > .7 ? Math.sign(chosen.offset) || routeSign : routeSign,
  };
};

const isInsidePuddle = (point, puddle) => (
  ((point.x - puddle.x) ** 2) / (puddle.radiusX ** 2)
  + ((point.y - puddle.y) ** 2) / (puddle.radiusY ** 2) < 1
);

const getPuddleMovementScale = (run, point) => (
  (run.layout?.puddles ?? []).some((puddle) => isInsidePuddle(point, puddle)) ? .78 : 1
);

const weaponSpritePaths = {
  // Inline data URLs keep the supplied protagonist sprites readable when the
  // standalone package is opened through file://, where some browsers block
  // canvas pixel reads from adjacent local files.
  pulsePistol: pulsePistolSprite,
  magScatter: magScatterSprite,
  droneEmitter: droneEmitterSprite,
};

const weaponSpriteCache = {};

const getWeaponSprite = (weaponId) => {
  if (typeof Image === "undefined" || !weaponSpritePaths[weaponId]) return null;
  if (weaponSpriteCache[weaponId]) return weaponSpriteCache[weaponId];
  const sprite = { image: new Image(), canvas: null, ready: false };
  weaponSpriteCache[weaponId] = sprite;
  sprite.image.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = sprite.image.naturalWidth;
      canvas.height = sprite.image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(sprite.image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index];
        const green = pixels.data[index + 1];
        const blue = pixels.data[index + 2];
        const greenDominance = green - Math.max(red, blue);
        // The supplied sprite sheets use a flat green preview background.  Key it
        // at runtime, so the original user-provided sprite remains untouched.
        if (green > 130 && greenDominance > 92) pixels.data[index + 3] = 0;
        else if (green > 105 && greenDominance > 62) pixels.data[index + 3] = Math.min(pixels.data[index + 3], Math.max(0, 255 - (greenDominance - 62) * 4));
      }
      context.putImageData(pixels, 0, 0);
      sprite.canvas = canvas;
      sprite.ready = true;
    } catch {
      // A canvas fallback remains available if a browser restricts pixel reads.
      sprite.ready = false;
    }
  };
  sprite.image.onerror = () => {
    sprite.failed = true;
  };
  sprite.image.src = weaponSpritePaths[weaponId];
  return sprite;
};

// Final user-supplied transparent NPC art.  It uses the same inline loading
// contract as the protagonist and station plates, so desktop file:// builds
// retain every worker without relying on a neighbouring asset folder.
const stationNpcSpriteCache = new Map();
const getStationNpcSprite = (npc) => {
  if (typeof Image === "undefined" || !npc?.spriteSrc) return null;
  if (stationNpcSpriteCache.has(npc.id)) return stationNpcSpriteCache.get(npc.id);
  const sprite = { image: new Image(), ready: false };
  stationNpcSpriteCache.set(npc.id, sprite);
  sprite.image.onload = () => { sprite.ready = true; };
  sprite.image.onerror = () => { sprite.failed = true; };
  sprite.image.src = npc.spriteSrc;
  return sprite;
};

// All high-detail art stays inline because the standalone package runs from
// file:// through a classic script. This also keeps the art slice portable.
const sceneArtCache = {};
const sceneArtPaths = {
  fogHarbor: fogHarborSliceArt,
  powerCorridor: powerCorridorArt,
  facelessPlatform: facelessPlatformArt,
};
const getSceneArt = (id = "fogHarbor") => {
  if (typeof Image === "undefined" || !sceneArtPaths[id]) return null;
  if (sceneArtCache[id]) return sceneArtCache[id];
  const sprite = { image: new Image(), ready: false };
  sceneArtCache[id] = sprite;
  sprite.image.onload = () => { sprite.ready = true; };
  sprite.image.onerror = () => { sprite.failed = true; };
  sprite.image.src = sceneArtPaths[id];
  return sprite;
};

// Transition art is deliberately separate from the combat plates: the train
// has an exterior arrival shot and a complete interior shot, so the handoff
// never reads as a dark modal drawn on top of the fighting screen.
const transitionArtCache = {};
const transitionArtPaths = {
  exterior: lastTrainExteriorArt,
  interior: lastTrainInteriorArt,
};
const getTransitionArt = (id) => {
  if (typeof Image === "undefined" || !transitionArtPaths[id]) return null;
  if (transitionArtCache[id]) return transitionArtCache[id];
  const sprite = { image: new Image(), ready: false };
  transitionArtCache[id] = sprite;
  sprite.image.onload = () => { sprite.ready = true; };
  sprite.image.onerror = () => { sprite.failed = true; };
  sprite.image.src = transitionArtPaths[id];
  return sprite;
};

// Enemy art is kept as transparent raster sprites and loaded without any
// fallback silhouette. The canvas adds motion, telegraphs and impact light.
const enemySpritePaths = {
  crawler: ticketCrawlerSprite,
  heavy: facelessPassengerSprite,
  burst: cableConductorSprite,
};

const enemySpriteCache = {};

const getEnemySprite = (model) => {
  if (typeof Image === "undefined" || !enemySpritePaths[model]) return null;
  if (enemySpriteCache[model]) return enemySpriteCache[model];
  const sprite = { image: new Image(), ready: false };
  enemySpriteCache[model] = sprite;
  sprite.image.onload = () => { sprite.ready = true; };
  sprite.image.onerror = () => { sprite.failed = true; };
  sprite.image.src = enemySpritePaths[model];
  return sprite;
};

const typeHash = (value = "INTJ") => [...value].reduce((total, letter) => total + letter.charCodeAt(0), 0);

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
  { id: "pulsePistol", name: "脉冲手枪", description: "直线脉冲，适合暴击与穿透构筑。", damage: 11, interval: .32, projectiles: 1, spread: .06, color: "#d9fbff" },
  { id: "magScatter", name: "磁轨霰弹枪", description: "近距扇形爆发，适合散射与击退构筑。", damage: 8, interval: .65, projectiles: 4, spread: .35, color: "#aaeef4" },
  { id: "droneEmitter", name: "无人机发生器", description: "自动锁定最近异常，适合持续输出构筑。", damage: 7, interval: .48, projectiles: 2, spread: .16, color: "#9eeaff" },
];

const enemyBlueprints = [
  { id: "crawler", name: "爬行检修体", hp: 25, speed: 35, damage: 8, xp: 3, coin: 1, radius: 7, color: "#b78e76" },
  { id: "heavy", name: "重装感染体", hp: 58, speed: 19, damage: 14, xp: 6, coin: 2, radius: 12, color: "#845f64" },
  { id: "burst", name: "自燃站务体", hp: 18, speed: 52, damage: 18, xp: 4, coin: 1, radius: 8, color: "#d47e63" },
  { id: "turret", name: "失控点台", hp: 34, speed: 14, damage: 10, xp: 5, coin: 2, radius: 9, color: "#9d91b8" },
  { id: "shield", name: "票根盾卫", hp: 42, speed: 28, damage: 10, xp: 5, coin: 2, radius: 10, color: "#78959c" },
];

const enemySignalColor = (enemy) => {
  if (enemy.boss) return "#ff3848";
  if (enemy.elite) return "#ff5261";
  if (enemy.id.startsWith("burst")) return "#ff765f";
  if (enemy.id.startsWith("heavy")) return "#ff8060";
  return "#f3a06d";
};

const getEnemyModel = (enemy) => enemy.id.split("-")[0];
const getEnemyRenderHeight = (enemy) => {
  const model = getEnemyModel(enemy);
  const multiplier = model === "crawler" ? 6.2 : model === "heavy" ? 5.35 : 6;
  return enemy.radius * multiplier;
};

// The artwork is intentionally larger than the movement collider. Use a
// separate, body-shaped projectile circle raised into the illustration so a
// visible hit on the head/torso never feels like a miss, without making melee
// contact or route collision more punishing.
const getEnemyProjectileHitbox = (enemy) => {
  const height = getEnemyRenderHeight(enemy);
  return {
    x: enemy.x,
    y: enemy.y - height * .2,
    radius: height * .36 * (enemy.elite ? 1.08 : 1),
  };
};

const findBulletHitIndex = (enemies, bullet, previousPosition) => {
  const skipped = new Set(bullet.hitIds ?? []);
  let candidate = null;
  enemies.forEach((enemy, index) => {
    if (enemy.hp <= 0 || skipped.has(enemy.id)) return;
    const hitbox = getEnemyProjectileHitbox(enemy);
    const sweep = distanceToSegment(hitbox, previousPosition, bullet);
    const contactRadius = hitbox.radius + (bullet.radius ?? 2.2) + 1.5;
    if (sweep.distance > contactRadius || (candidate && sweep.progress >= candidate.progress)) return;
    candidate = { index, progress: sweep.progress };
  });
  return candidate?.index ?? -1;
};

const bossBlueprint = { id: "boss", name: "第七站监督员", hp: 720, speed: 25, damage: 20, xp: 40, coin: 18, radius: 21, color: "#d5a579", boss: true };

// Eleven clearance waves plus one boss wave produce a 12–15 minute first run.
// A wave must hit its kill goal but cannot finish before its listed duration.
const waveDefinitions = [
  { goal: 12, duration: 60, pool: ["crawler"], sides: [2], source: "trainDoorWest", cap: 3, interval: 1.65, training: true, name: "单侧校准" },
  { goal: 16, duration: 60, pool: ["crawler"], sides: [2, 0], source: "trainDoors", cap: 5, interval: 1.25, name: "回流检票" },
  { goal: 20, duration: 60, pool: ["crawler", "heavy"], sides: [2, 0], source: "trainDoors", cap: 6, interval: 1.08, name: "失压车厢" },
  { goal: 24, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [2, 0], source: "service", cap: 7, interval: .98, elite: true, name: "夹击预演" },
  { goal: 28, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [1, 3], source: "service", cap: 8, interval: .92, name: "潮湿换乘" },
  { goal: 31, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2], source: "trainDoors", cap: 9, interval: .84, name: "列车回声" },
  { goal: 34, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2, 3], source: "railFog", cap: 10, interval: .78, elite: true, name: "红灯封锁" },
  { goal: 38, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2, 3], source: "railFog", cap: 11, interval: .74, name: "轨道倒灌" },
  { goal: 41, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2, 3], source: "service", cap: 12, interval: .68, name: "无声报站" },
  { goal: 45, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2, 3], source: "railFog", cap: 13, interval: .64, elite: true, name: "雾港夜班" },
  { goal: 50, duration: 60, pool: ["crawler", "heavy", "burst"], sides: [0, 1, 2, 3], source: "trainDoors", cap: 14, interval: .58, elite: true, name: "最后一班" },
  { goal: 1, duration: 0, pool: [], sides: [0], cap: 1, interval: 0, boss: true, name: "第七站监督员" },
];

const waveFor = (wave = 1) => waveDefinitions[clamp(wave, 1, waveDefinitions.length) - 1];

export const arenaRelics = [
  { id: "shard-sight", name: "裂片瞄准镜", description: "暴击率 +10%，子弹轨迹留下冷光。", effect: { crit: .1 } },
  { id: "morning-ticket", name: "晨车票根", description: "最大生命 +16，获得少量修复。", effect: { maxHp: 16, heal: 16 } },
  { id: "magnetic-glove", name: "磁暴手套", description: "击退距离 +20，霰弹会推开更大的空隙。", effect: { knockback: 20 } },
  { id: "paper-hive", name: "纸质蜂巢", description: "每次攻击额外发射 1 枚投射物。", effect: { projectiles: 1 } },
  { id: "blue-lamp", name: "蓝灯电容", description: "攻击频率 +14%。", effect: { fireRate: .14 } },
  { id: "station-seal", name: "停站印章", description: "护甲 +2，闪避充能速度提升。", effect: { armor: 2, dashRecharge: .25 } },
  { id: "tide-coil", name: "潮汐线圈", description: "爆破范围 +14，爆炸强化额外造成震荡。", effect: { blastRadius: 14, explosion: 1 } },
  { id: "archive-film", name: "归档胶卷", description: "经验获得 +25%。", effect: { xpGain: .25 } },
  { id: "switch-signal", name: "换轨信标", description: "移动速度 +12%，闪避次数 +1。", effect: { speed: .12, dash: 1 } },
  { id: "summon-stub", name: "召唤票据", description: "获得 1 枚环绕灵能节点。", effect: { orbit: 1, orbitDamage: 2 } },
];

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
  knockback: player.knockback + (effect.knockback ?? 0),
  blastRadius: player.blastRadius + (effect.blastRadius ?? 0),
  dashRechargeBonus: player.dashRechargeBonus + (effect.dashRecharge ?? 0),
  orbitCount: player.orbitCount + (effect.orbit ?? 0),
  orbitDamage: player.orbitDamage + (effect.orbitDamage ?? 0),
  lastLight: player.lastLight || Boolean(effect.lastLight),
});

export const getArenaProjection = (type = "INTJ") => {
  const perks = [...type].map((letter) => typePerks[letter]).filter(Boolean);
  return { label: `${type} · 雾港回收者投影`, perks };
};

const spawnEnemy = (run, blueprint, seed, elite = false, options = {}) => {
  const [nextSeed, edgeValue] = nextRandom(seed);
  const [finalSeed, coordinate] = nextRandom(nextSeed);
  const sidePool = options.sides ?? [0, 1, 2, 3];
  const side = sidePool[Math.min(sidePool.length - 1, Math.floor(edgeValue * sidePool.length))];
  const distanceAway = options.distance ?? (360 + coordinate * 170);
  const lateral = (coordinate - .5) * 340;
  const fallbackPosition = side === 0 ? { x: run.player.x + lateral, y: run.player.y - distanceAway }
    : side === 1 ? { x: run.player.x - lateral, y: run.player.y + distanceAway }
      : side === 2 ? { x: run.player.x - distanceAway, y: run.player.y + lateral }
        : { x: run.player.x + distanceAway, y: run.player.y - lateral };
  const source = options.source ?? "edge";
  const zones = run.layout?.spawnZones?.[source] ?? [];
  const zone = zones.length ? zones[Math.min(zones.length - 1, Math.floor(edgeValue * zones.length))] : null;
  const zonePosition = zone ? {
    x: zone.x + (coordinate - .5) * (zone.width ?? 0),
    y: zone.y + (Math.sin(finalSeed) * .5) * (zone.height ?? 0),
  } : null;
  // A named door/corridor is preferred, but an unsafe door is replaced with
  // an edge position. This prevents any source from producing a surprise
  // contact spawn at the player's feet.
  const requestedDistance = options.minimumDistance ?? (options.training ? 150 : 190);
  const minimumDistance = Math.min(requestedDistance, Math.min(WORLD_WIDTH, WORLD_HEIGHT) * .55);
  const rawPosition = zonePosition && distance(zonePosition, run.player) >= minimumDistance ? zonePosition : fallbackPosition;
  const multiplier = elite ? 1.7 : 1 + Math.min(.7, run.time / 150);
  const radius = Math.round(blueprint.radius * (elite ? 1.6 : 1.35));
  const edgeMargin = Math.max(radius + 10, 42);
  const position = resolveObstacleCollision({
    x: clamp(rawPosition.x, edgeMargin, WORLD_WIDTH - edgeMargin),
    y: clamp(rawPosition.y, edgeMargin, WORLD_HEIGHT - edgeMargin),
  }, radius, run.obstacles);
  return [{
    ...blueprint,
    radius,
    id: `${blueprint.id}-${run.spawnIndex}-${Math.floor(finalSeed)}`,
    x: position.x,
    y: position.y,
    hp: Math.round(blueprint.hp * multiplier),
    maxHp: Math.round(blueprint.hp * multiplier),
    damage: Math.round(blueprint.damage * multiplier * (options.damageScale ?? 1)),
    speed: blueprint.speed * (options.speedScale ?? 1),
    elite,
    routeSign: coordinate >= .5 ? 1 : -1,
    stuckTime: 0,
    spawnSource: source,
    telegraph: options.telegraph ?? .72,
    training: Boolean(options.training),
    burnTime: 0,
    frostTime: 0,
    shockTime: 0,
    hitCooldown: 0,
    shotTimer: blueprint.id === "heavy" ? 1.2 + coordinate : 0,
  }, finalSeed];
};

const makeUpgradeOffer = (run, seed) => pickOffer(arenaUpgrades, seed, 3);

export const createArenaRun = (type, weaponId, meta = { embers: 0 }, seed = Date.now(), avatar = {}) => {
  const weapon = arenaWeapons.find((item) => item.id === weaponId) ?? arenaWeapons[0];
  const stageIndex = 0;
  const layout = getActiveArenaLayout(stageIndex, type);
  let player = {
    x: layout.start.x,
    // Every map has a authored lit spawn anchor rather than an anonymous
    // center point, so the first camera frame explains the station space.
    y: layout.start.y,
    radius: PLAYER_RADIUS,
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
    dashTrail: 0,
    hitFlash: 0,
    projectiles: weapon.projectiles,
    pierce: weapon.id === "pulsePistol" ? 1 : 0,
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
    knockback: weapon.id === "magScatter" ? 34 : 5,
    blastRadius: weapon.id === "droneEmitter" ? 30 : 0,
    dashRechargeBonus: 0,
    orbitCount: weapon.id === "droneEmitter" ? 2 : 0,
    orbitDamage: weapon.id === "droneEmitter" ? 7 : 0,
  };
  // Personality is retained for dossiers and story, never as a combat stat.
  const metaBonus = Math.min(15, (meta.embers ?? 0) * 2);
  player = { ...player, maxHp: player.maxHp + metaBonus, hp: player.hp + metaBonus };
  const obstacles = getActiveArenaObstacles(stageIndex, type);
  const safeSpawn = resolveObstacleCollision(player, player.radius ?? PLAYER_RADIUS, obstacles);
  player = { ...player, ...safeSpawn };
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
    spawnTimer: 10,
    spawnIndex: 0,
    shotTimer: .1,
    enemies: [],
    bullets: [],
    enemyBullets: [],
    effects: [],
    upgrades: [],
    relics: [],
    offer: [],
    shop: [],
    phase: "running",
    bossSpawned: false,
    bossDefeated: false,
    wave: 1,
    waveElapsed: 0,
    waveKills: 0,
    waveEliteSpawned: false,
    waveRewarded: false,
    relicOffer: [],
    stageIndex,
    nextStageIndex: null,
    transitPending: false,
    layout,
    obstacles,
    markers: getActiveArenaMarkers(stageIndex, type),
    npcs: getActiveArenaNpcs(stageIndex, type),
    nearbyNpcId: null,
    activeNpcId: null,
    visitedNpcIds: [],
    avatar: {
      name: avatar.name ?? `${type} resident projection`,
      visualStyle: avatar.visualStyle ?? "catalogue resident",
      traits: avatar.traits ?? [],
    },
    message: "第 1/12 波 · 单侧校准。前 10 秒不会有异体贴身生成。",
    seed,
  };
};

export const getArenaObjective = (run) => {
  if (!run) return { label: "第 1/12 波", value: "准备中" };
  const wave = waveFor(run.wave);
  if (wave.boss) {
    const boss = run.enemies.find((enemy) => enemy.boss);
    return { label: "第 12/12 波 · Boss", value: boss ? `${Math.max(0, Math.ceil(boss.hp))}/${boss.maxHp}` : "雾幕预警" };
  }
  if (run.wave === 1 && run.waveElapsed < 10) return { label: "第 1/12 波 · 安全教学", value: `${Math.ceil(10 - run.waveElapsed)} 秒后接触` };
  const timeLeft = Math.max(0, Math.ceil(wave.duration - run.waveElapsed));
  const goalText = `${Math.min(run.waveKills, wave.goal)}/${wave.goal}`;
  return { label: `第 ${run.wave}/12 波 · ${wave.name}`, value: timeLeft > 0 ? `${goalText} · 封锁 ${timeLeft}s` : `${goalText} · 清场` };
};

const getLockedEnemy = (run, aim) => {
  const enemies = run.enemies.filter((enemy) => enemy.hp > 0 && (enemy.telegraph ?? 0) <= 0);
  if (!enemies.length) return null;
  if (aim && Number.isFinite(aim.x) && Number.isFinite(aim.y)) {
    const pointerCandidate = enemies.reduce((closest, enemy) => (!closest || distance(enemy, aim) < distance(closest, aim) ? enemy : closest), null);
    if (pointerCandidate && distance(pointerCandidate, aim) < 110) return pointerCandidate;
  }
  return enemies.reduce((closest, enemy) => (!closest || distance(run.player, enemy) < distance(run.player, closest) ? enemy : closest), null);
};

const getWeaponPose = (run, aim) => {
  const { player, weapon } = run;
  const locked = getLockedEnemy(run, aim);
  const destination = locked ?? (aim && Number.isFinite(aim.x) && Number.isFinite(aim.y) ? aim : {
    x: player.x + Math.cos(player.facing ?? 0) * 80,
    y: player.y + Math.sin(player.facing ?? 0) * 80,
  });
  const angle = Math.atan2(destination.y - player.y, destination.x - player.x);
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const perpendicular = { x: -direction.y, y: direction.x };
  // Collision stays compact, while the illustrated resident is deliberately
  // larger for a readable 16:9 combat view. The weapon itself stays compact
  // and is mounted higher on that illustration, so it complements rather
  // than covers the supplied character artwork.
  const radius = player.radius;
  // The anchor lives at the illustrated character's upper torso, not its
  // center. This keeps the held weapon visibly in front of the chest instead
  // of reading as attached to the waist on small battlefield sprites.
  const leadShoulder = {
    x: player.x + perpendicular.x * radius * .24,
    // Downward aim gets an extra upward offset: the wrist and muzzle remain
    // in front of the torso instead of sliding into the pelvis silhouette.
    y: player.y - radius * (1.5 + Math.max(0, direction.y) * .65) + perpendicular.y * radius * .2,
  };
  const grip = {
    x: leadShoulder.x + direction.x * radius * .92 + perpendicular.x * radius * .04,
    y: leadShoulder.y + direction.y * radius * .34 + perpendicular.y * radius * .04,
  };
  const muzzleDistance = weapon.id === "magScatter" ? 1.36 : weapon.id === "droneEmitter" ? .48 : 1.14;
  return {
    locked,
    angle,
    direction,
    grip,
    muzzle: { x: grip.x + direction.x * radius * muzzleDistance, y: grip.y + direction.y * radius * muzzleDistance },
  };
};

const createBullets = (run, aim) => {
  const pose = getWeaponPose(run, aim);
  if (!pose.locked && !aim) return run;
  const baseAngle = pose.angle;
  const bullets = [...run.bullets];
  let seed = run.seed;
  for (let index = 0; index < run.player.projectiles; index += 1) {
    const offset = run.player.projectiles === 1 ? 0 : ((index / (run.player.projectiles - 1)) - .5) * run.player.spread;
    const [nextSeed, random] = nextRandom(seed);
    seed = nextSeed;
    const critical = random < run.player.crit;
    const damage = run.player.damage * (critical ? run.player.critDamage : 1);
    bullets.push({
      x: pose.muzzle.x,
      y: pose.muzzle.y,
      vx: Math.cos(baseAngle + offset) * (run.weapon.id === "droneEmitter" ? 145 : 205),
      vy: Math.sin(baseAngle + offset) * (run.weapon.id === "droneEmitter" ? 145 : 205),
      damage,
      pierce: run.player.pierce,
      life: run.weapon.id === "droneEmitter" ? 1.62 : 1.35,
      critical,
      color: run.weapon.color,
      radius: run.weapon.id === "droneEmitter" ? 4.8 : run.weapon.id === "magScatter" ? 2.8 : 2.3,
      knockback: run.player.knockback,
      blastRadius: run.player.blastRadius,
      hitIds: [],
    });
  }
  return { ...run, bullets, seed, lastShotAt: run.time };
};

const getOrbitNodes = (run) => Array.from({ length: run.player.orbitCount ?? 0 }, (_, index) => {
  const angle = run.time * 2.8 + index * Math.PI * 2 / run.player.orbitCount;
  const range = run.player.radius * 1.75 + (index % 2) * 3;
  return {
    x: run.player.x + Math.cos(angle) * range,
    y: run.player.y + Math.sin(angle) * range,
  };
});

const applyOrbitDamage = (run, delta) => {
  if (!run.player.orbitCount || !run.player.orbitDamage) return run;
  const nodes = getOrbitNodes(run);
  return {
    ...run,
    enemies: run.enemies.map((enemy) => {
      const touching = nodes.some((node) => distance(node, enemy) < enemy.radius + 5);
      return touching ? { ...enemy, hp: enemy.hp - run.player.orbitDamage * delta } : enemy;
    }),
  };
};

const killEnemy = (run, enemy, enemies) => {
  const player = run.player;
  const gain = Math.round(enemy.xp * (1 + player.xpGain));
  const coins = run.coins + enemy.coin + player.coinGain;
  const xp = run.xp + gain;
  const kills = run.kills + 1;
  const extraDamage = player.explosion && enemies.length ? enemies.map((other) => distance(enemy, other) < 35 ? { ...other, hp: other.hp - 8 } : other) : enemies;
  return {
    ...run,
    enemies: extraDamage,
    xp,
    coins,
    kills,
    waveKills: run.waveKills + (enemy.boss ? 0 : 1),
    message: `${enemy.name}${enemy.elite ? "（精英）" : ""}已被写回雾港记录。`,
  };
};

const applyBulletHit = (run, bullet, enemyIndex) => {
  const enemy = run.enemies[enemyIndex];
  const enemies = [...run.enemies];
  const damage = bullet.damage;
  const velocityLength = Math.hypot(bullet.vx, bullet.vy) || 1;
  const updated = {
    ...enemy,
    hp: enemy.hp - damage,
    hitFlash: bullet.critical ? .22 : .14,
    x: enemy.x + (bullet.vx / velocityLength) * (bullet.knockback ?? 0),
    y: enemy.y + (bullet.vy / velocityLength) * (bullet.knockback ?? 0),
    burnTime: run.player.burn ? Math.max(enemy.burnTime, 2) : enemy.burnTime,
    frostTime: run.player.frost ? Math.max(enemy.frostTime, 1.5) : enemy.frostTime,
  };
  enemies[enemyIndex] = updated;
  if (bullet.blastRadius) {
    enemies.forEach((item, index) => {
      if (index !== enemyIndex && distance(item, updated) < bullet.blastRadius) enemies[index] = { ...item, hp: item.hp - Math.round(damage * .48), hitFlash: .16 };
    });
  }
  let nextRun = {
    ...run,
    enemies,
    effects: [...(run.effects ?? []), { kind: "impact", x: enemy.x, y: enemy.y - enemy.radius * .45, life: .17, maxLife: .17, critical: bullet.critical }],
    message: `${bullet.critical ? "暴击 · " : ""}${Math.round(damage)} 点清障伤害。`,
  };
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
    phase: "upgradeReveal",
    effectNotice: `「${upgrade.name}」已生效：${upgrade.description}`,
    message: `获得强化「${upgrade.name}」。`,
  };
};

const makeRelicOffer = (run, seed) => {
  const owned = new Set(run.relics.map((relic) => relic.id));
  const candidates = arenaRelics.filter((relic) => !owned.has(relic.id));
  return pickOffer(candidates.length ? candidates : arenaRelics, seed, 3);
};

const enterNextWave = (run) => {
  if (run.transitPending && Number.isInteger(run.nextStageIndex)) {
    const destination = getActiveArenaLayout(run.nextStageIndex, run.type);
    return {
      ...run,
      phase: "transit",
      relicOffer: [],
      message: `转乘许可已确认：${destination.name}。`,
    };
  }
  const nextWave = Math.min(12, run.wave + 1);
  const definition = waveFor(nextWave);
  return {
    ...run,
    wave: nextWave,
    waveElapsed: 0,
    waveKills: 0,
    waveEliteSpawned: false,
    waveRewarded: false,
    relicOffer: [],
    phase: "running",
    spawnTimer: definition.boss ? .8 : 1.2,
    message: definition.boss
      ? "第 12/12 波 · 第七站监督员正在穿过雾幕。"
      : `第 ${nextWave}/12 波 · ${definition.name}开始。`,
  };
};

export const beginNextArenaWave = (run) => {
  if (!run || !["waveComplete", "waveReward"].includes(run.phase)) return run;
  return enterNextWave(run);
};

export const chooseArenaRelic = (run, relicId) => {
  if (!run || run.phase !== "waveReward") return run;
  const relic = run.relicOffer.find((item) => item.id === relicId);
  if (!relic) return run;
  const player = applyEffect(run.player, relic.effect);
  return enterNextWave({
    ...run,
    player,
    relics: [...run.relics, relic],
    message: `已装配遗物「${relic.name}」。`,
  });
};

const resolveWaveComplete = (run) => {
  const isRelicStop = run.wave === 2 || run.wave === 4 || run.wave === 6 || run.wave === 8 || run.wave === 10 || run.wave === 11;
  if (!isRelicStop) return { ...run, phase: "waveComplete", message: `第 ${run.wave}/12 波完成。` };
  const [relicOffer, seed] = makeRelicOffer(run, run.seed);
  return {
    ...run,
    seed,
    relicOffer,
    phase: "waveReward",
    message: `第 ${run.wave}/12 波完成：从三件遗物中带走一件。`,
  };
};

const resolveCampaignWaveComplete = (run) => {
  const resolved = resolveWaveComplete(run);
  const nextStageIndex = run.wave === 4 ? 1 : run.wave === 8 ? 2 : null;
  return nextStageIndex === null ? resolved : {
    ...resolved,
    nextStageIndex,
    transitPending: true,
  };
};

// Debug / playtest affordance: skip exactly the active wave while deliberately
// preserving the normal reward, relic, train-transfer and ending flow.
export const skipArenaWave = (run) => {
  if (!run || run.phase !== "running") return run;
  const activeWave = waveFor(run.wave);
  const clearedBattlefield = {
    ...run,
    enemies: [],
    bullets: [],
    enemyBullets: [],
    effects: [],
    spawnTimer: 999,
  };

  if (activeWave.boss) {
    return {
      ...clearedBattlefield,
      bossSpawned: true,
      bossDefeated: true,
      phase: "cleared",
      message: "测试跳过：第七站监督员已被封存。",
    };
  }

  return resolveCampaignWaveComplete({
    ...clearedBattlefield,
    waveElapsed: Math.max(run.waveElapsed, activeWave.duration),
    waveKills: Math.max(run.waveKills, activeWave.goal),
    waveEliteSpawned: true,
    message: `测试跳过：第 ${run.wave}/12 波已清理。`,
  });
};

export const boardArenaTrain = (run) => {
  if (!run || run.phase !== "transit" || !Number.isInteger(run.nextStageIndex)) return run;
  const destination = getActiveArenaLayout(run.nextStageIndex, run.type);
  return {
    ...run,
    phase: "boarding",
    boardingElapsed: 0,
    boardingDuration: 3,
    boardingContact: run.layout?.contact ?? { name: "未登记接应员", role: "站内接应", line: "列车会带你抵达下一处工作现场。" },
    boardingDestination: destination.name,
    enemies: [],
    bullets: [],
    enemyBullets: [],
    effects: [],
    message: `列车门已开启：${run.layout?.contact?.name ?? "接应员"}正在车内等候。`,
  };
  /* Legacy immediate transfer retained below for implementation history.
  const stageIndex = run.nextStageIndex;
  const layout = getActiveArenaLayout(stageIndex);
  const obstacles = getActiveArenaObstacles(stageIndex);
  const spawned = resolveObstacleCollision({ ...run.player, ...layout.start }, run.player.radius ?? PLAYER_RADIUS, obstacles);
  const transferred = {
    ...run,
    stageIndex,
    nextStageIndex: null,
    transitPending: false,
    layout,
    obstacles,
    markers: getActiveArenaMarkers(stageIndex),
    player: { ...run.player, ...spawned, hp: Math.min(run.player.maxHp, run.player.hp + 14), dashCharges: run.player.dashMax, dashRecharge: 0 },
    enemies: [],
    bullets: [],
    enemyBullets: [],
    effects: [],
    spawnIndex: 0,
  };
  const nextRun = enterNextWave(transferred);
  return { ...nextRun, message: `列车驶入${layout.name}：第 ${nextRun.wave}/12 波即将开始。` };
};
*/
};

const completeArenaTransfer = (run) => {
  const stageIndex = run.nextStageIndex;
  const layout = getActiveArenaLayout(stageIndex, run.type);
  const obstacles = getActiveArenaObstacles(stageIndex, run.type);
  const spawned = resolveObstacleCollision({ ...run.player, ...layout.start }, run.player.radius ?? PLAYER_RADIUS, obstacles);
  const transferred = {
    ...run,
    stageIndex,
    nextStageIndex: null,
    transitPending: false,
    layout,
    obstacles,
    markers: getActiveArenaMarkers(stageIndex, run.type),
    npcs: getActiveArenaNpcs(stageIndex, run.type),
    nearbyNpcId: null,
    activeNpcId: null,
    player: { ...run.player, ...spawned, hp: Math.min(run.player.maxHp, run.player.hp + 14), dashCharges: run.player.dashMax, dashRecharge: 0 },
    enemies: [],
    bullets: [],
    enemyBullets: [],
    effects: [],
    spawnIndex: 0,
    boardingElapsed: 0,
  };
  const nextRun = enterNextWave(transferred);
  return { ...nextRun, message: `${run.boardingContact?.name ?? "接应员"}将你带到${layout.name}：第 ${nextRun.wave}/12 波即将开始。` };
};

const advanceArenaBoarding = (run, delta) => {
  const boardingElapsed = Math.min(run.boardingDuration ?? 3, (run.boardingElapsed ?? 0) + delta);
  if (boardingElapsed < (run.boardingDuration ?? 3)) return { ...run, boardingElapsed };
  return completeArenaTransfer({ ...run, boardingElapsed });
};

// The cinematic is decorative, never a progress gate. Playtesters and repeat
// players can retain the exact transfer result without waiting through it.
export const skipArenaBoarding = (run) => (
  run?.phase === "boarding"
    ? completeArenaTransfer({ ...run, boardingElapsed: run.boardingDuration ?? 3 })
    : run
);

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

export const interactArenaNpc = (run, npcId) => {
  if (!run || run.phase !== "running") return run;
  const npc = (run.npcs ?? []).find((entry) => entry.id === npcId) ?? getNearbyArenaNpc(run);
  if (!npc || distance(run.player, npc) > (npc.interactionRange ?? 52)) return run;
  return {
    ...run,
    phase: "npcInteraction",
    activeNpcId: npc.id,
    message: `${npc.name} 暂停了手里的${npc.prop}。`,
  };
};

export const leaveArenaNpcInteraction = (run) => {
  if (!run || run.phase !== "npcInteraction") return run;
  const activeNpc = (run.npcs ?? []).find((entry) => entry.id === run.activeNpcId);
  const visitedNpcIds = activeNpc && !run.visitedNpcIds?.includes(activeNpc.id)
    ? [...(run.visitedNpcIds ?? []), activeNpc.id]
    : (run.visitedNpcIds ?? []);
  return {
    ...run,
    phase: "running",
    activeNpcId: null,
    visitedNpcIds,
    message: activeNpc ? `离开 ${activeNpc.name} 的交互区。` : "回到站台。",
  };
};

export const advanceArenaRun = (run, input, dt) => {
  if (!run) return run;
  const delta = Math.min(.08, Math.max(.01, dt));
  if (run.phase === "boarding") return advanceArenaBoarding(run, delta);
  if (run.phase !== "running") return run;
  let next = {
    ...run,
    time: run.time + delta,
    waveElapsed: run.waveElapsed + delta,
    player: { ...run.player },
    enemies: run.enemies.map((enemy) => ({ ...enemy })),
    bullets: run.bullets.map((bullet) => ({ ...bullet })),
    enemyBullets: (run.enemyBullets ?? []).map((bullet) => ({ ...bullet })),
    effects: (run.effects ?? []).map((effect) => ({ ...effect, life: effect.life - delta })).filter((effect) => effect.life > 0),
    markers: run.markers.map((marker) => ({ ...marker })),
  };
  let { player } = next;
  const direction = { x: (input.right ? 1 : 0) - (input.left ? 1 : 0), y: (input.down ? 1 : 0) - (input.up ? 1 : 0) };
  const length = Math.hypot(direction.x, direction.y) || 1;
  const walkedPosition = moveThroughArena(
    player,
    (direction.x / length) * player.speed * getPuddleMovementScale(next, player) * delta,
    (direction.y / length) * player.speed * getPuddleMovementScale(next, player) * delta,
    player.radius ?? PLAYER_RADIUS,
    next.obstacles,
  );
  player.x = walkedPosition.x;
  player.y = walkedPosition.y;
  player.invuln = Math.max(0, player.invuln - delta);
  player.dashTrail = Math.max(0, player.dashTrail - delta);
  player.hitFlash = Math.max(0, player.hitFlash - delta);
  player.dashRecharge += delta;
  if (player.dashRecharge >= Math.max(1.3, 2.4 - player.dashRechargeBonus) && player.dashCharges < player.dashMax) { player.dashCharges += 1; player.dashRecharge = 0; }
  if (input.dash && player.dashCharges > 0) {
    const dashDirection = direction.x || direction.y ? direction : { x: (input.aim?.x ?? player.x) - player.x, y: (input.aim?.y ?? player.y) - player.y };
    const dashLength = Math.hypot(dashDirection.x, dashDirection.y) || 1;
    const dashedPosition = moveThroughArena(
      player,
      (dashDirection.x / dashLength) * 68,
      (dashDirection.y / dashLength) * 68,
      player.radius ?? PLAYER_RADIUS,
      next.obstacles,
    );
    player.x = dashedPosition.x;
    player.y = dashedPosition.y;
    player.dashCharges -= 1;
    player.invuln = .38;
    player.dashTrail = .25;
    player.dashRecharge = 0;
    next.message = "临站闪避 · 短暂无敌。";
  }

  const cacheIndex = next.markers.findIndex((marker) => marker.kind === "cache" && !marker.collected && distance(player, marker) < 32);
  if (cacheIndex >= 0) {
    next.markers[cacheIndex].collected = true;
    next.coins += 5;
    next.xp += 5;
    next.message = "发现雾港补给箱：获得 5 硬币与 5 经验。";
  }

  const nearbyNpc = getNearbyArenaNpc(next);
  next.nearbyNpcId = nearbyNpc?.id ?? null;
  if (input.interact && nearbyNpc) return interactArenaNpc(next, nearbyNpc.id);

  const wave = waveFor(next.wave);
  next.spawnTimer -= delta;
  if (wave.boss) {
    if (!next.bossSpawned && next.spawnTimer <= 0) {
      const [boss, seed] = spawnEnemy(next, bossBlueprint, next.seed, false, { telegraph: 2.2, source: "railFog", sides: [1], distance: 420, minimumDistance: 185 });
      next = {
        ...next,
        enemies: [...next.enemies, boss],
        seed,
        spawnIndex: next.spawnIndex + 1,
        bossSpawned: true,
        message: "Boss 预警 · 第七站监督员正在穿过雾幕。",
      };
    }
  } else if (next.spawnTimer <= 0 && next.enemies.length < wave.cap && (next.wave !== 1 || next.waveElapsed >= 10)) {
    const wantsElite = wave.elite && !next.waveEliteSpawned && next.waveElapsed >= 24;
    const choices = enemyBlueprints.filter((blueprint) => wave.pool.includes(blueprint.id));
    const [blueprint, pickedSeed] = pick(choices, next.seed);
    const [enemy, finalSeed] = spawnEnemy(next, wantsElite ? enemyBlueprints[1] : blueprint, pickedSeed, wantsElite, {
      sides: wave.sides,
      source: wave.source,
      speedScale: wave.training ? .52 : 1,
      damageScale: wave.training ? .35 : 1,
      distance: wave.training ? 220 : undefined,
      training: Boolean(wave.training),
      telegraph: wantsElite ? 1.5 : wave.training ? 1.05 : .72,
    });
    next = {
      ...next,
      enemies: [...next.enemies, enemy],
      seed: finalSeed,
      spawnIndex: next.spawnIndex + 1,
      waveEliteSpawned: next.waveEliteSpawned || wantsElite,
      spawnTimer: wave.interval,
    };
  }

  next.shotTimer -= delta;
  if (next.shotTimer <= 0 && next.enemies.length > 0) {
    next = createBullets(next, input.aim);
    next.shotTimer = next.weapon.interval / (1 + next.player.fireRate);
  }

  next = applyOrbitDamage(next, delta);

  const survivors = [];
  let localRun = { ...next, enemies: [] };
  next.enemies.forEach((enemy) => {
    enemy.telegraph = Math.max(0, (enemy.telegraph ?? 0) - delta);
    enemy.hitFlash = Math.max(0, (enemy.hitFlash ?? 0) - delta);
    if (enemy.telegraph > 0) {
      survivors.push(enemy);
      return;
    }
    const dx = localRun.player.x - enemy.x;
    const dy = localRun.player.y - enemy.y;
    const enemyDistance = Math.hypot(dx, dy) || 1;
    const slow = enemy.frostTime > 0 ? .55 : 1;
    const steering = steerEnemyToward(enemy, localRun.player, delta, localRun.obstacles, slow);
    enemy.x = steering.position.x;
    enemy.y = steering.position.y;
    enemy.routeSign = steering.routeSign;
    enemy.stuckTime = steering.madeProgress ? 0 : (enemy.stuckTime ?? 0) + delta;
    // If a crowd presses an edge prop, flip its preferred side after a short
    // delay. The next steering fan then takes the other side of the obstacle.
    if (enemy.stuckTime > .46) {
      enemy.routeSign *= -1;
      enemy.stuckTime = 0;
    }
    enemy.frostTime = Math.max(0, enemy.frostTime - delta);
    enemy.shockTime = Math.max(0, enemy.shockTime - delta);
    enemy.burnTime = Math.max(0, enemy.burnTime - delta);
    if (enemy.burnTime > 0) enemy.hp -= 3 * localRun.player.burn * delta;
    if (enemy.id.startsWith("heavy")) {
      enemy.shotTimer -= delta;
      if (enemy.shotTimer <= 0 && enemyDistance > 76 && enemyDistance < 260) {
        localRun.enemyBullets.push({
          x: enemy.x,
          y: enemy.y,
          vx: (dx / enemyDistance) * 132,
          vy: (dy / enemyDistance) * 132,
          radius: 3.1,
          life: 2.4,
          damage: Math.max(3, Math.round(enemy.damage * .55)),
          color: "#ff765f",
        });
        enemy.shotTimer = enemy.elite ? 1.05 : 1.55;
      }
    }
    if (distance(localRun.player, enemy) < enemy.radius + 7 && localRun.player.invuln <= 0) {
      const loss = Math.max(1, Math.round((enemy.damage - localRun.player.armor) * (enemy.training ? .35 : 1)));
      localRun.player = { ...localRun.player, hp: localRun.player.hp - loss, invuln: .55, hitFlash: .22 };
      localRun.message = `${enemy.name}接触造成 ${loss} 点状态损失。`;
      if (enemy.id.startsWith("burst")) enemy.hp = 0;
    }
    if (enemy.hp > 0) survivors.push(enemy);
    else localRun = killEnemy(localRun, enemy, survivors);
  });
  localRun.enemies = survivors.filter((enemy) => enemy.hp > 0);

  const activeEnemyBullets = [];
  localRun.enemyBullets.forEach((bullet) => {
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life -= delta;
    if (distance(bullet, localRun.player) < (localRun.player.radius ?? PLAYER_RADIUS) + bullet.radius && localRun.player.invuln <= 0) {
      const loss = Math.max(1, bullet.damage - localRun.player.armor);
      localRun.player = { ...localRun.player, hp: localRun.player.hp - loss, invuln: .32, hitFlash: .2 };
      localRun.message = `远程异体命中，状态 -${loss}。`;
      return;
    }
    if (bullet.life > 0 && bullet.x > 0 && bullet.x < WORLD_WIDTH && bullet.y > 0 && bullet.y < WORLD_HEIGHT) activeEnemyBullets.push(bullet);
  });
  localRun.enemyBullets = activeEnemyBullets;

  const activeBullets = [];
  next.bullets.forEach((bullet) => {
    const previousPosition = { x: bullet.x, y: bullet.y };
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life -= delta;
    let hitIndex = findBulletHitIndex(localRun.enemies, bullet, previousPosition);
    while (hitIndex >= 0 && bullet.pierce >= 0) {
      const hitId = localRun.enemies[hitIndex]?.id;
      localRun = applyBulletHit(localRun, bullet, hitIndex);
      bullet.hitIds = [...(bullet.hitIds ?? []), hitId].filter(Boolean);
      bullet.pierce -= 1;
      if (bullet.pierce < 0) break;
      hitIndex = findBulletHitIndex(localRun.enemies, bullet, previousPosition);
    }
    const coverIndex = localRun.obstacles.findIndex((obstacle) => isInsideObstacle(bullet, obstacle, 1));
    let struckCover = coverIndex >= 0;
    if (coverIndex >= 0 && localRun.obstacles[coverIndex].kind === "breakable") {
      const cover = localRun.obstacles[coverIndex];
      const remainingHp = cover.hp - bullet.damage;
      localRun.obstacles = remainingHp > 0
        ? localRun.obstacles.map((obstacle, index) => index === coverIndex ? { ...obstacle, hp: remainingHp } : obstacle)
        : localRun.obstacles.filter((_, index) => index !== coverIndex);
      if (remainingHp <= 0) {
        const center = { x: cover.x + cover.width / 2, y: cover.y + cover.height / 2 };
        localRun.enemies = localRun.enemies.map((enemy) => (
          distance(enemy, center) < 96
            ? { ...enemy, hp: enemy.hp - 9, frostTime: Math.max(enemy.frostTime, .45), shockTime: 1.15, hitFlash: .22 }
            : enemy
        ));
        localRun.effects = [...(localRun.effects ?? []), { kind: "electricBurst", x: center.x, y: center.y, life: .46, maxLife: .46 }];
        localRun.message = "电箱碎裂：通路打开，近处异体被电弧短暂麻痹。";
      }
      struckCover = remainingHp > 0;
    }
    if (bullet.life > 0 && !struckCover && bullet.x > -24 && bullet.x < WORLD_WIDTH + 24 && bullet.y > -24 && bullet.y < WORLD_HEIGHT + 24 && bullet.pierce >= 0) activeBullets.push(bullet);
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
  const activeWave = waveFor(localRun.wave);
  if (!activeWave.boss && localRun.waveElapsed >= activeWave.duration && localRun.waveKills >= activeWave.goal) return resolveCampaignWaveComplete(localRun);
  return applyLevelCheck(localRun);
};

export const getArenaResult = (run) => {
  if (!run || !["cleared", "lost"].includes(run.phase)) return null;
  const embers = Math.max(1, Math.floor(run.kills / 8) + (run.phase === "cleared" ? 4 : 0));
  return run.phase === "cleared"
    ? { title: "区域 Boss 已封存", text: `你击退了第七站监督员，带回 ${embers} 枚余烬核心。`, embers, unlockId: "fog-harbor-dawn-file", unlock: "解锁：雾港晨车档案与世界线地图节点。" }
    : { title: "清障投影已中断", text: `你带回 ${embers} 枚余烬核心；下一局仍可用它们解锁小幅起始支援。`, embers };
};

const drawArenaObstacle = (context, obstacle) => {
  // Collision-only objects are already painted into the full station plate.
  // Re-drawing placeholder rectangles over them would turn the map back into
  // a prototype, so only dynamic / destructible objects get a runtime model.
  if (obstacle.artBound) return;
  context.save();
  context.translate(obstacle.x, obstacle.y);
  context.fillStyle = "rgba(0, 4, 5, .42)";
  context.shadowColor = "rgba(0, 0, 0, .74)";
  context.shadowBlur = 10;
  context.fillRect(3, 5, obstacle.width, obstacle.height);
  context.shadowBlur = 0;
  if (obstacle.kind === "tram") {
    context.fillStyle = "#182426";
    context.fillRect(0, 0, obstacle.width, obstacle.height);
    context.fillStyle = "#536260";
    context.fillRect(5, 5, obstacle.width - 10, 6);
    context.fillStyle = "#071011";
    context.fillRect(8, 15, obstacle.width - 16, obstacle.height - 29);
    for (let x = 13; x < obstacle.width - 7; x += 33) {
      context.fillStyle = "#0a1314";
      context.fillRect(x, 18, 21, 20);
      context.strokeStyle = "#6e8580";
      context.lineWidth = 1;
      context.strokeRect(x, 18, 21, 20);
      context.fillStyle = "rgba(189, 227, 199, .21)";
      context.fillRect(x + 2, 20, 17, 5);
    }
    context.fillStyle = "#323e3d";
    context.fillRect(obstacle.width * .45, 14, 23, obstacle.height - 24);
    context.strokeStyle = "#7e8d83";
    context.strokeRect(obstacle.width * .45, 14, 23, obstacle.height - 24);
    context.fillStyle = "#b84d46";
    context.fillRect(0, obstacle.height - 7, obstacle.width, 4);
    context.fillStyle = "rgba(255, 117, 87, .65)";
    context.fillRect(10, obstacle.height - 15, 7, 4);
  } else if (obstacle.kind === "column") {
    context.fillStyle = "#2a3533";
    context.fillRect(4, 0, obstacle.width - 8, obstacle.height);
    context.fillStyle = "#687a73";
    context.fillRect(0, 7, obstacle.width, 8);
    context.fillStyle = "#c99654";
    for (let y = 25; y < obstacle.height - 16; y += 25) context.fillRect(0, y, obstacle.width, 5);
    context.fillStyle = "#111918";
    for (let y = 18; y < obstacle.height - 12; y += 22) { context.fillRect(8, y, 4, 4); context.fillRect(obstacle.width - 12, y, 4, 4); }
    context.fillStyle = "#171e1d";
    context.fillRect(0, obstacle.height - 12, obstacle.width, 12);
  } else if (obstacle.kind === "cables") {
    ["#252d2e", "#a85248", "#4a7777", "#c99654", "#1e2526"].forEach((color, index) => {
      const start = 4 + index * (obstacle.width / 4.8);
      context.strokeStyle = color;
      context.lineWidth = index === 2 ? 2 : 2.6;
      context.beginPath();
      context.moveTo(start, 2 + (index % 2) * 4);
      context.bezierCurveTo(start - 12, obstacle.height * .15, start + 10, obstacle.height * .75, start - 7, obstacle.height - 3);
      context.stroke();
    });
    [obstacle.width * .28, obstacle.width * .68].forEach((x) => {
      context.fillStyle = "#4c5550";
      context.fillRect(x - 5, obstacle.height * .42, 10, 5);
      context.fillStyle = "#171e1f";
      context.fillRect(x - 3, obstacle.height * .44, 6, 2);
    });
    context.fillStyle = "#ff765f";
    context.beginPath(); context.arc(obstacle.width * .54, obstacle.height * .48, 2, 0, Math.PI * 2); context.fill();
  } else if (obstacle.kind === "barricade") {
    context.fillStyle = "#232a29";
    context.fillRect(3, 9, obstacle.width - 6, obstacle.height - 11);
    context.fillStyle = "#59615a";
    context.fillRect(8, 6, obstacle.width - 16, 5);
    for (let x = -4; x < obstacle.width; x += 22) {
      context.fillStyle = "#d78e45";
      context.beginPath(); context.moveTo(x, 8); context.lineTo(x + 11, 8); context.lineTo(x + 21, obstacle.height - 8); context.lineTo(x + 11, obstacle.height - 8); context.closePath(); context.fill();
      context.fillStyle = "#7d3d34";
      context.beginPath(); context.moveTo(x + 11, 8); context.lineTo(x + 20, 8); context.lineTo(x + 10, obstacle.height - 8); context.lineTo(x, obstacle.height - 8); context.closePath(); context.fill();
    }
    context.fillStyle = "#151d1d";
    context.fillRect(0, obstacle.height - 6, obstacle.width, 5);
    [12, obstacle.width - 16].forEach((x) => { context.fillStyle = "#d2bd88"; context.beginPath(); context.arc(x, obstacle.height - 3, 2, 0, Math.PI * 2); context.fill(); });
  } else if (obstacle.kind === "breakable") {
    // Embedded electrical cabinet: worn metal and indicator lamps rather than
    // a bright UI tile. The map can still react to its destruction, but the
    // prop belongs to the station before combat begins.
    const bodyWidth = obstacle.width - 8;
    const bodyHeight = obstacle.height - 7;
    context.fillStyle = "rgba(0, 0, 0, .56)";
    context.fillRect(4, 6, bodyWidth, bodyHeight);
    context.fillStyle = "#26312e";
    context.fillRect(0, 0, bodyWidth, bodyHeight);
    context.fillStyle = "#47514b";
    context.fillRect(3, 3, bodyWidth - 7, 4);
    context.strokeStyle = "rgba(154, 164, 145, .58)";
    context.lineWidth = 1;
    context.strokeRect(2.5, 2.5, bodyWidth - 5, bodyHeight - 5);
    context.fillStyle = "#151d1b";
    context.fillRect(7, obstacle.height * .2, Math.max(8, bodyWidth - 18), obstacle.height * .46);
    context.fillStyle = "#667168";
    for (let y = obstacle.height * .28; y < obstacle.height * .56; y += 4) context.fillRect(10, y, Math.max(5, bodyWidth - 24), 1.3);
    context.fillStyle = "#514037";
    context.fillRect(5, obstacle.height * .73, Math.max(8, bodyWidth - 12), 4);
    context.strokeStyle = "rgba(201, 147, 77, .78)";
    context.lineWidth = 1.4;
    for (let x = 7; x < bodyWidth - 4; x += 10) {
      context.beginPath(); context.moveTo(x, obstacle.height * .73 + 3.5); context.lineTo(x + 6, obstacle.height * .73); context.stroke();
    }
    [[5, 6], [bodyWidth - 6, 6], [5, bodyHeight - 7], [bodyWidth - 6, bodyHeight - 7]].forEach(([x, y]) => {
      context.fillStyle = "#b7a27a"; context.beginPath(); context.arc(x, y, 1.2, 0, Math.PI * 2); context.fill();
    });
    const blink = .48 + Math.sin((obstacle.x + obstacle.y) * .03 + Date.now() * .004) * .25;
    context.fillStyle = `rgba(255, 101, 76, ${blink})`;
    context.beginPath(); context.arc(bodyWidth - 8, obstacle.height * .14, 1.8, 0, Math.PI * 2); context.fill();
  } else {
    context.fillStyle = "#2b302e";
    context.fillRect(0, 0, obstacle.width, obstacle.height);
    context.fillStyle = "#5d6259";
    context.fillRect(4, 4, obstacle.width - 8, 8);
    context.strokeStyle = "#9d805f";
    context.lineWidth = 1.2;
    context.strokeRect(4, 4, obstacle.width - 8, obstacle.height - 8);
    context.strokeStyle = "rgba(191, 139, 79, .72)";
    context.beginPath(); context.moveTo(5, 5); context.lineTo(obstacle.width - 5, obstacle.height - 5); context.moveTo(obstacle.width - 5, 5); context.lineTo(5, obstacle.height - 5); context.stroke();
    [[9, 9], [obstacle.width - 9, 9], [9, obstacle.height - 9], [obstacle.width - 9, obstacle.height - 9]].forEach(([x, y]) => { context.fillStyle = "#c7b47b"; context.beginPath(); context.arc(x, y, 1.6, 0, Math.PI * 2); context.fill(); });
  }
  context.restore();
};

const drawEnemyNpc = (context, enemy, time) => {
  const radius = enemy.radius;
  const model = enemy.id.split("-")[0];
  const signal = enemySignalColor(enemy);
  const sprite = getEnemySprite(model);
  const alert = enemy.id.startsWith("heavy") ? Math.max(0, 1 - (enemy.shotTimer ?? 1) / 1.55) : 0;
  const surge = enemy.id.startsWith("burst") ? .5 + Math.sin(time * 11) * .5 : 0;
  const bob = Math.sin(time * (enemy.id.startsWith("crawler") ? 9 : 5) + enemy.x * .08) * radius * .08;
  context.save();
  context.translate(enemy.x, enemy.y + bob);
  context.fillStyle = "rgba(0, 0, 0, .52)";
  context.beginPath(); context.ellipse(0, radius * .78, radius * 1.12, radius * .3, 0, 0, Math.PI * 2); context.fill();

  if (sprite?.ready) {
    const aspect = sprite.image.naturalWidth / sprite.image.naturalHeight;
    // Presentation scale is deliberately larger than collision scale: each
    // species must read as a physical creature before it reaches the player,
    // while the central loop stays forgiving to navigate.
    const height = radius * (model === "crawler" ? 6.2 : model === "heavy" ? 5.35 : 6) * (1 + surge * .05);
    const width = height * aspect;
    context.imageSmoothingEnabled = false;
    if (enemy.elite || enemy.boss) {
      context.save();
      context.shadowColor = "#ff3448";
      context.shadowBlur = enemy.boss ? 14 : 9;
      context.globalAlpha = .95;
      context.drawImage(sprite.image, -width / 2, -height * .71, width, height);
      context.restore();
    }
    context.drawImage(sprite.image, -width / 2, -height * .71, width, height);
    if (enemy.hitFlash > 0) {
      context.save();
      context.globalCompositeOperation = "screen";
      context.globalAlpha = Math.min(.82, enemy.hitFlash * 5.1);
      context.fillStyle = "#e8ffff";
      context.beginPath(); context.arc(0, -radius * .1, radius * 1.08, 0, Math.PI * 2); context.fill();
      context.strokeStyle = enemy.elite || enemy.boss ? "#ff5a62" : "#aef5ff";
      context.lineWidth = 1.4;
      context.beginPath(); context.arc(0, -radius * .1, radius * (1.32 + (1 - enemy.hitFlash / .22) * .45), 0, Math.PI * 2); context.stroke();
      context.restore();
    }
  } else {
    // Loading fallback retains a worker-like anatomy rather than a round token.
    context.strokeStyle = "#080b0d";
    context.lineWidth = Math.max(1.2, radius * .14);
    context.fillStyle = "#293336";
    context.fillRect(-radius * .5, -radius * .35, radius, radius * 1.1);
    context.fillStyle = "#12191b";
    context.beginPath(); context.arc(0, -radius * .72, radius * .62, 0, Math.PI * 2); context.fill(); context.stroke();
    context.fillStyle = signal;
    context.beginPath(); context.arc(0, -radius * .72, radius * .19, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "#3d4949";
    context.lineWidth = radius * .22;
    context.beginPath(); context.moveTo(-radius * .46, -radius * .1); context.lineTo(-radius, radius * .62); context.moveTo(radius * .46, -radius * .1); context.lineTo(radius, radius * .62); context.stroke();
  }

  if (model === "heavy" && alert > .35) {
    context.strokeStyle = `rgba(255, 101, 70, ${.35 + alert * .6})`;
    context.lineWidth = 1.2 + alert * 1.4;
    context.beginPath(); context.arc(radius * .58, radius * .05, radius * (.62 + alert * .2), 0, Math.PI * 2); context.stroke();
  }
  if (model === "burst") {
    context.strokeStyle = `rgba(255, 94, 67, ${.34 + surge * .5})`;
    context.lineWidth = 1.3;
    context.beginPath(); context.arc(0, radius * .05, radius * (1.08 + surge * .34), 0, Math.PI * 2); context.stroke();
  }
  if (model === "crawler") {
    context.strokeStyle = "rgba(235, 157, 101, .78)";
    context.lineWidth = 1;
    context.beginPath(); context.moveTo(-radius * .95, radius * .28); context.lineTo(-radius * 1.42, radius * (.54 + Math.sin(time * 12) * .08)); context.moveTo(radius * .95, radius * .28); context.lineTo(radius * 1.42, radius * (.54 - Math.sin(time * 12) * .08)); context.stroke();
  }
  if (enemy.shockTime > 0) {
    const pulse = .45 + Math.sin(time * 28) * .3;
    context.strokeStyle = `rgba(182, 246, 255, ${Math.max(.28, enemy.shockTime) * pulse})`;
    context.lineWidth = 1.4;
    for (let arc = 0; arc < 3; arc += 1) {
      const start = arc * Math.PI * 2 / 3 + time * 8;
      context.beginPath();
      context.moveTo(Math.cos(start) * radius * .35, -radius * .18 + Math.sin(start) * radius * .35);
      context.lineTo(Math.cos(start + .22) * radius * 1.08, -radius * .18 + Math.sin(start + .22) * radius * 1.08);
      context.lineTo(Math.cos(start + .48) * radius * .64, -radius * .18 + Math.sin(start + .48) * radius * .64);
      context.stroke();
    }
  }
  if (enemy.elite || enemy.boss) {
    context.fillStyle = "rgba(255, 54, 72, .11)";
    context.beginPath(); context.arc(0, 0, radius * (1.52 + Math.sin(time * 5) * .08), 0, Math.PI * 2); context.fill();
    context.strokeStyle = "#ff3e50";
    context.lineWidth = enemy.boss ? 2.3 : 1.5;
    context.beginPath(); context.arc(0, 0, radius * 1.42, 0, Math.PI * 2); context.stroke();
    context.fillStyle = "#ff5261";
    context.beginPath(); context.moveTo(0, -radius * 1.85); context.lineTo(radius * .32, -radius * 1.53); context.lineTo(0, -radius * 1.21); context.lineTo(-radius * .32, -radius * 1.53); context.closePath(); context.fill();
  }
  context.restore();
};

const drawAimSegment = (context, from, to, width, color) => {
  context.strokeStyle = "#151112";
  context.lineWidth = width + 1.6;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
};

const drawRigHand = (context, point, radius) => {
  context.fillStyle = "#f0c9ae";
  context.strokeStyle = "#201719";
  context.lineWidth = 1;
  context.beginPath(); context.arc(point.x, point.y, radius * .13, 0, Math.PI * 2); context.fill(); context.stroke();
};

const drawPistolModel = (context, anchor, angle, radius, color, time, shotAge) => {
  context.save();
  context.translate(anchor.x, anchor.y);
  context.rotate(angle);
  context.fillStyle = "#141719";
  context.fillRect(-radius * .18, -radius * .25, radius * 1.18, radius * .5);
  context.fillStyle = "#3f494a";
  context.fillRect(radius * .02, -radius * .18, radius * .82, radius * .36);
  context.fillStyle = color;
  context.fillRect(radius * .45, -radius * .12, radius * .53, radius * .24);
  context.fillStyle = "#bdf4ff";
  context.fillRect(radius * .58, -radius * .08, radius * .16, radius * .16);
  context.fillStyle = "#202427";
  context.fillRect(radius * .14, radius * .12, radius * .24, radius * .43);
  context.fillStyle = "#7d8790";
  context.fillRect(radius * .17, radius * .17, radius * .18, radius * .08);
  context.fillStyle = "#d9fbff";
  context.fillRect(radius * .26, -radius * .31, radius * .2, radius * .08);
  context.fillStyle = `rgba(218, 251, 255, ${shotAge < .12 ? .96 : .18 + Math.sin(time * 13) * .08})`;
  context.fillRect(radius * .95, -radius * .07, radius * .18, radius * .14);
  context.restore();
};

const drawScatterModel = (context, anchor, angle, radius, color, shotAge) => {
  context.save();
  context.translate(anchor.x, anchor.y);
  context.rotate(angle);
  context.fillStyle = "#161719";
  context.fillRect(-radius * .65, -radius * .29, radius * 1.92, radius * .58);
  context.fillStyle = "#4a403d";
  context.fillRect(-radius * .55, -radius * .2, radius * .78, radius * .4);
  context.fillStyle = "#252a2b";
  context.fillRect(radius * .22, -radius * .25, radius * 1.12, radius * .18);
  context.fillRect(radius * .22, radius * .07, radius * 1.12, radius * .18);
  context.fillStyle = color;
  context.fillRect(radius * .34, -radius * .13, radius * .78, radius * .26);
  context.fillStyle = "#aeeff5";
  context.fillRect(radius * .62, -radius * .11, radius * .17, radius * .22);
  context.fillStyle = "#7c2e2d";
  context.fillRect(-radius * .44, radius * .16, radius * .35, radius * .32);
  context.fillStyle = "#dcfbff";
  context.fillRect(radius * 1.22, -radius * .23, radius * .12, radius * .46);
  if (shotAge < .12) {
    context.fillStyle = "rgba(213, 250, 255, .95)";
    context.fillRect(radius * 1.34, -radius * .18, radius * .28, radius * .36);
  }
  context.restore();
};

const drawEmitterModel = (context, anchor, angle, radius, color, time) => {
  context.save();
  context.translate(anchor.x, anchor.y);
  context.rotate(angle);
  context.fillStyle = "#17171d";
  context.beginPath(); context.arc(0, 0, radius * .31, 0, Math.PI * 2); context.fill();
  context.strokeStyle = "#c07b5e";
  context.lineWidth = radius * .08;
  for (let index = 0; index < 4; index += 1) {
    context.save(); context.rotate(index * Math.PI / 2); context.beginPath(); context.moveTo(radius * .23, 0); context.lineTo(radius * .46, 0); context.stroke(); context.restore();
  }
  const pulse = radius * (.22 + Math.sin(time * 8) * .035);
  context.fillStyle = "rgba(142, 205, 232, .22)";
  context.beginPath(); context.arc(radius * .48, 0, pulse * 2.2, 0, Math.PI * 2); context.fill();
  context.fillStyle = color;
  context.beginPath(); context.arc(radius * .48, 0, pulse, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#fff0bd";
  context.beginPath(); context.arc(radius * .48, 0, pulse * .35, 0, Math.PI * 2); context.fill();
  context.restore();
};

// The source sprite supplies costume and silhouette. The articulated rig is
// anchored at the shoulders, so each held item sits in a believable hand pose
// and turns with pointer / touch aim rather than floating above the body.
const drawAimRig = (context, weapon, angle, radius, time, shotAge) => {
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const perpendicular = { x: -direction.y, y: direction.x };
  const shoulderHeight = -radius * (1.5 + Math.max(0, direction.y) * .65);
  const leadShoulder = { x: perpendicular.x * radius * .24, y: shoulderHeight + perpendicular.y * radius * .2 };
  const rearShoulder = { x: -perpendicular.x * radius * .24, y: shoulderHeight - perpendicular.y * radius * .2 };
  const elbowBend = radius * (.28 + Math.sin(time * 10) * .025);
  const leadElbow = {
    x: leadShoulder.x + direction.x * radius * .38 + perpendicular.x * elbowBend,
    y: leadShoulder.y + direction.y * radius * .17 + perpendicular.y * elbowBend,
  };
  const grip = {
    x: leadShoulder.x + direction.x * radius * .92 + perpendicular.x * radius * .04,
    y: leadShoulder.y + direction.y * radius * .34 + perpendicular.y * radius * .04,
  };
  const sleeve = weapon.id === "droneEmitter" ? "#503a51" : weapon.id === "magScatter" ? "#7b302f" : "#42343f";
  drawAimSegment(context, leadShoulder, leadElbow, radius * .23, sleeve);
  drawAimSegment(context, leadElbow, grip, radius * .19, sleeve);
  drawRigHand(context, grip, radius);

  if (weapon.id === "magScatter") {
    const supportGrip = {
      x: grip.x - direction.x * radius * .48 + perpendicular.x * radius * .06,
      y: grip.y - direction.y * radius * .48 + perpendicular.y * radius * .06,
    };
    const supportElbow = {
      x: rearShoulder.x + direction.x * radius * .2 - perpendicular.x * radius * .31,
      y: rearShoulder.y + direction.y * radius * .2 - perpendicular.y * radius * .31,
    };
    drawAimSegment(context, rearShoulder, supportElbow, radius * .22, sleeve);
    drawAimSegment(context, supportElbow, supportGrip, radius * .18, sleeve);
    drawRigHand(context, supportGrip, radius);
    drawScatterModel(context, grip, angle, radius, weapon.color, shotAge);
    return;
  }

  if (weapon.id === "droneEmitter") {
    drawEmitterModel(context, grip, angle, radius, weapon.color, time);
    return;
  }

  drawPistolModel(context, grip, angle, radius, weapon.color, time, shotAge);
};

const drawResidentAvatar = (context, run, aim) => {
  const { player, avatar } = run;
  const hash = typeHash(avatar.name);
  const palette = ["#b5d1bc", "#b9c7df", "#d4bb9c", "#d0a7ad"][hash % 4];
  const accent = ["#6f9d9a", "#9a769e", "#9e765f", "#7c9c80"][hash % 4];
  const lining = ["#314b43", "#39465f", "#694d42", "#593a48"][hash % 4];
  const eyeCount = 2 + (hash % 2);
  const headTall = 1.28 + ((hash >> 2) % 3) * .16;
  const variation = (hash >> 3) % 4;
  const pose = getWeaponPose(run, aim);
  const angle = pose.angle;
  const weaponSprite = getWeaponSprite(run.weapon.id);
  context.save();
  context.translate(player.x, player.y);
  if (player.dashTrail > 0) {
    context.save();
    context.rotate(angle + Math.PI);
    context.strokeStyle = `rgba(173, 245, 255, ${player.dashTrail * 3.4})`;
    context.lineWidth = 2.6;
    context.lineCap = "round";
    [-.38, 0, .38].forEach((offset) => {
      context.beginPath(); context.moveTo(-player.radius * .35, offset * player.radius); context.lineTo(-player.radius * 2.4, offset * player.radius); context.stroke();
    });
    context.restore();
  }
  if (player.hitFlash > 0) {
    context.strokeStyle = `rgba(255, 242, 220, ${player.hitFlash * 4})`;
    context.lineWidth = 2;
    context.beginPath(); context.arc(0, 0, player.radius * (1.25 + (1 - player.hitFlash / .22) * .55), 0, Math.PI * 2); context.stroke();
  }
  if (weaponSprite?.ready && weaponSprite.canvas) {
    // The supplied full-body character is the playable protagonist. Weapon
    // selection changes only the protagonist's pose / held equipment.
    // The player should read at a glance in a wide arena (about 1/8 of the
    // visible battle height), not as another tiny station prop.
    const spriteHeight = player.radius * 4.7;
    const spriteWidth = spriteHeight * weaponSprite.canvas.width / weaponSprite.canvas.height;
    context.imageSmoothingEnabled = false;
    context.fillStyle = "rgba(0, 0, 0, .5)";
    context.beginPath(); context.ellipse(0, player.radius * .72, player.radius * .9, player.radius * .24, 0, 0, Math.PI * 2); context.fill();
    context.shadowColor = "#b9f5ff";
    context.shadowBlur = 11;
    context.strokeStyle = run.weapon.color;
    context.lineWidth = 1.5;
    context.beginPath(); context.arc(0, -player.radius * .08, player.radius * .88, 0, Math.PI * 2); context.stroke();
    context.shadowBlur = 0;
    const bodyBob = Math.sin(run.time * 8) * player.radius * .045;
    const bodyTilt = Math.max(-.11, Math.min(.11, angle * .075));
    const faceLeft = Math.cos(angle) < 0;
    context.save();
    context.translate(0, bodyBob);
    context.rotate(bodyTilt);
    if (faceLeft) context.scale(-1, 1);
    context.drawImage(weaponSprite.canvas, -spriteWidth / 2, -spriteHeight + player.radius * .78, spriteWidth, spriteHeight);
    context.restore();
    drawAimRig(context, run.weapon, angle, player.radius, run.time, run.time - (run.lastShotAt ?? -99));
    context.restore();
    return;
  }
  if (weaponSprite) {
    // Never quietly substitute the earlier generic resident while the actual
    // protagonist portrait is loading (or if it ever fails). This makes the
    // supplied-character model the only playable protagonist for all three
    // opening weapons.
    context.fillStyle = "rgba(0, 0, 0, .52)";
    context.beginPath(); context.ellipse(0, player.radius * .9, player.radius * 1.45, player.radius * .38, 0, 0, Math.PI * 2); context.fill();
    context.strokeStyle = run.weapon.color;
    context.lineWidth = 1.5;
    context.beginPath(); context.arc(0, -player.radius * .25, player.radius * 1.45, 0, Math.PI * 2); context.stroke();
    context.fillStyle = "#e9dfcf";
    context.font = "8px ui-monospace, monospace";
    context.textAlign = "center";
    context.fillText(weaponSprite.failed ? "主角建模未载入" : "主角建模载入中", 0, player.radius * .08);
    context.restore();
    return;
  }
  context.fillStyle = "rgba(0, 0, 0, .46)";
  context.beginPath(); context.ellipse(0, player.radius * 1.08, player.radius * 1.25, player.radius * .34, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = player.invuln > 0 ? "#f3d2ae" : palette;
  context.strokeStyle = "#161a19";
  context.lineWidth = 1.8;
  // Long coat, separated legs and a work belt make the selected dossier resident
  // read as a person-shaped worker rather than a generic square player token.
  context.fillStyle = lining;
  context.fillRect(-player.radius * .48, player.radius * .64, player.radius * .34, player.radius * .68);
  context.fillRect(player.radius * .14, player.radius * .64, player.radius * .34, player.radius * .68);
  context.fillStyle = palette;
  context.beginPath(); context.moveTo(-player.radius * .92, player.radius * .88); context.lineTo(-player.radius * .67, -player.radius * .22); context.lineTo(player.radius * .67, -player.radius * .22); context.lineTo(player.radius * .92, player.radius * .88); context.lineTo(player.radius * .32, player.radius * 1.04); context.lineTo(0, player.radius * .7); context.lineTo(-player.radius * .32, player.radius * 1.04); context.closePath(); context.fill(); context.stroke();
  context.strokeStyle = "rgba(21, 26, 25, .75)";
  context.lineWidth = 1;
  context.beginPath(); context.moveTo(0, -player.radius * .05); context.lineTo(0, player.radius * .75); context.moveTo(-player.radius * .62, player.radius * .39); context.lineTo(player.radius * .62, player.radius * .39); context.stroke();
  context.fillStyle = accent; context.fillRect(-player.radius * .23, player.radius * .02, player.radius * .46, player.radius * .24);
  context.fillStyle = "#d9c28e"; context.fillRect(player.radius * .12, player.radius * .1, player.radius * .11, player.radius * .1);
  // Exaggerated catalogue face: rimmed eyes, different brow/hair silhouettes,
  // restrained expression and no real-person likeness.
  context.fillStyle = "#e3d4bd";
  context.beginPath(); context.ellipse(0, -player.radius * .75, player.radius * .8, player.radius * headTall, 0, 0, Math.PI * 2); context.fill(); context.stroke();
  context.fillStyle = "#202424";
  if (variation === 0) { context.beginPath(); context.arc(0, -player.radius * 1.22, player.radius * .78, Math.PI, Math.PI * 2); context.fill(); }
  if (variation === 1) { context.fillRect(-player.radius * .76, -player.radius * 1.52, player.radius * .34, player.radius * .62); context.fillRect(player.radius * .42, -player.radius * 1.5, player.radius * .34, player.radius * .66); }
  if (variation === 2) { context.beginPath(); context.moveTo(-player.radius * .65, -player.radius * 1.2); context.lineTo(0, -player.radius * 1.85); context.lineTo(player.radius * .65, -player.radius * 1.2); context.closePath(); context.fill(); }
  if (variation === 3) { context.beginPath(); context.arc(0, -player.radius * 1.25, player.radius * .9, Math.PI, 0); context.strokeStyle = accent; context.lineWidth = 3; context.stroke(); }
  context.fillStyle = "#f2e9d7";
  for (let eye = 0; eye < eyeCount; eye += 1) {
    const offset = eyeCount === 3 ? (eye - 1) * player.radius * .43 : (eye ? player.radius * .39 : -player.radius * .39);
    context.beginPath(); context.ellipse(offset, -player.radius * .77, player.radius * .25, player.radius * .34, 0, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#19191a"; context.beginPath(); context.arc(offset, -player.radius * .75, player.radius * .11, 0, Math.PI * 2); context.fill(); context.fillStyle = "#f2e9d7";
  }
  context.strokeStyle = "#4a3030"; context.lineWidth = 1.3; context.beginPath(); context.moveTo(-player.radius * .28, -player.radius * .18); context.quadraticCurveTo(0, -player.radius * .06, player.radius * .3, -player.radius * .18); context.stroke();
  context.save(); context.rotate(angle); context.fillStyle = "#212827"; context.fillRect(player.radius * .25, -4, player.radius * 1.7, 8); context.fillStyle = run.weapon.color; context.fillRect(player.radius * .65, -2, player.radius * 1.3, 4); context.restore();
  if (variation === 0 || variation === 3) { context.strokeStyle = accent; context.lineWidth = 2; context.beginPath(); context.moveTo(-player.radius * .5, -player.radius * 1.45); context.lineTo(-player.radius * .85, -player.radius * 1.95); context.moveTo(player.radius * .5, -player.radius * 1.45); context.lineTo(player.radius * .85, -player.radius * 1.95); context.stroke(); }
  context.restore();
};

export const getArenaCamera = (run) => {
  if (!run) return { x: 0, y: 0 };
  return {
    x: clamp(run.player.x - VIEW_WIDTH / 2, 0, WORLD_WIDTH - VIEW_WIDTH),
    y: clamp(run.player.y - VIEW_HEIGHT / 2, 0, WORLD_HEIGHT - VIEW_HEIGHT),
  };
};

const drawArenaMinimap = (context, run, camera) => {
  const scale = .062;
  const width = WORLD_WIDTH * scale;
  const height = WORLD_HEIGHT * scale;
  const x = VIEW_WIDTH - width - 12;
  const y = 12;
  context.fillStyle = "rgba(3, 9, 8, .84)";
  context.fillRect(x - 3, y - 3, width + 6, height + 6);
  context.strokeStyle = "rgba(210, 222, 200, .4)";
  context.lineWidth = 1;
  context.strokeRect(x, y, width, height);
  context.strokeStyle = "rgba(220, 236, 202, .72)";
  context.strokeRect(x + camera.x * scale, y + camera.y * scale, VIEW_WIDTH * scale, VIEW_HEIGHT * scale);
  run.markers.forEach((marker) => {
    if (marker.kind === "cache" && !marker.collected) {
      context.fillStyle = "#f1c773";
      context.fillRect(x + marker.x * scale - 2, y + marker.y * scale - 2, 4, 4);
    } else if (marker.kind === "train") {
      context.fillStyle = run.phase === "transit" ? "#d9f7ff" : "#698288";
      context.fillRect(x + marker.x * scale - 3, y + marker.y * scale - 2, 6, 4);
    } else if (marker.kind === "exit") {
      context.fillStyle = run.bossDefeated ? "#a8e6c0" : "#64706b";
      context.beginPath(); context.moveTo(x + marker.x * scale, y + marker.y * scale - 3); context.lineTo(x + marker.x * scale + 3, y + marker.y * scale + 3); context.lineTo(x + marker.x * scale - 3, y + marker.y * scale + 3); context.closePath(); context.fill();
    }
  });
  run.enemies.filter((enemy) => enemy.elite || enemy.boss).forEach((enemy) => {
    context.fillStyle = enemySignalColor(enemy);
    context.beginPath(); context.arc(x + enemy.x * scale, y + enemy.y * scale, enemy.boss ? 3 : 2, 0, Math.PI * 2); context.fill();
  });
  (run.npcs ?? []).forEach((npc) => {
    context.fillStyle = npc.id === run.nearbyNpcId ? "#f4e0a3" : "#8fa59a";
    context.fillRect(x + npc.x * scale - 1.5, y + npc.y * scale - 1.5, 3, 3);
  });
  context.fillStyle = "#c7f8ff";
  context.beginPath(); context.arc(x + run.player.x * scale, y + run.player.y * scale, 2.6, 0, Math.PI * 2); context.fill();
};

const drawWorldMarkers = (context, run) => {
  run.markers.forEach((marker) => {
    if (marker.kind === "cache" && !marker.collected) {
      context.fillStyle = "rgba(239, 191, 102, .16)";
      context.beginPath(); context.arc(marker.x, marker.y, 23, 0, Math.PI * 2); context.fill();
      context.strokeStyle = "#eac173";
      context.lineWidth = 1.5;
      context.strokeRect(marker.x - 8, marker.y - 7, 16, 14);
      context.fillStyle = "#f5d38e";
      context.fillRect(marker.x - 5, marker.y - 4, 10, 8);
    }
    if (marker.kind === "train") {
      const ready = run.phase === "transit";
      const pulse = 1 + Math.sin(run.time * 4) * .12;
      context.save();
      context.translate(marker.x, marker.y);
      context.fillStyle = ready ? "rgba(205, 248, 255, .18)" : "rgba(110, 138, 142, .12)";
      context.beginPath(); context.ellipse(0, 8, 28 * pulse, 13 * pulse, 0, 0, Math.PI * 2); context.fill();
      context.strokeStyle = ready ? "#d1f7ff" : "rgba(142, 172, 174, .7)";
      context.lineWidth = 2;
      context.strokeRect(-20, -12, 40, 22);
      context.fillStyle = ready ? "#e6fbff" : "#6e8587";
      context.fillRect(-15, -7, 10, 7); context.fillRect(5, -7, 10, 7);
      context.fillStyle = ready ? "#8ee8f5" : "#53666a";
      context.fillRect(-17, 10, 34, 3);
      context.restore();
    }
    if (marker.kind === "exit") {
      context.strokeStyle = run.bossDefeated ? "#b9f0c7" : "rgba(142, 157, 146, .6)";
      context.lineWidth = 2;
      context.beginPath(); context.arc(marker.x, marker.y, 17, 0, Math.PI * 2); context.stroke();
      context.fillStyle = run.bossDefeated ? "rgba(142, 231, 181, .18)" : "rgba(98, 110, 104, .12)";
      context.beginPath(); context.arc(marker.x, marker.y, 14, 0, Math.PI * 2); context.fill();
    }
    if (marker.kind === "portal") {
      context.strokeStyle = "rgba(190, 139, 236, .72)";
      context.lineWidth = 2;
      context.beginPath(); context.arc(marker.x, marker.y, 17 + Math.sin(run.time * 2.4) * 2, 0, Math.PI * 2); context.stroke();
    }
  });
};

// These props deliberately live on the map layer instead of being baked into
// the worker model. A future transparent sprite sheet can therefore keep its
// clean silhouette while every station supplies its own counter, lamp, locker
// or machinery behind it.
const drawNpcSceneCue = (context, npc) => {
  const { x, y, cue, palette } = npc;
  context.save();
  context.translate(x, y);
  context.fillStyle = "rgba(3, 8, 8, .54)";
  if (cue === "lampPost") {
    context.fillRect(18, -78, 4, 78);
    context.fillStyle = "rgba(231, 211, 145, .16)";
    context.beginPath(); context.arc(20, -74, 30, 0, Math.PI * 2); context.fill();
    context.fillStyle = palette.glow; context.fillRect(15, -78, 10, 12);
  } else if (cue === "counter" || cue === "mirrorStand" || cue === "paperRack") {
    context.fillStyle = "#242a27"; context.fillRect(-32, -22, 64, 22);
    context.fillStyle = "#6d6047"; context.fillRect(-28, -20, 56, 4);
    if (cue === "mirrorStand") { context.strokeStyle = palette.glow; context.lineWidth = 2; context.strokeRect(22, -58, 17, 28); }
    if (cue === "paperRack") { context.fillStyle = "#aa9d7a"; [-19, -7, 5].forEach((offset) => context.fillRect(offset, -36, 8, 13)); }
  } else if (cue === "locker" || cue === "archiveShelf" || cue === "mailRack") {
    context.fillStyle = "#222a29"; context.fillRect(18, -67, 28, 67);
    context.strokeStyle = "#6f796f"; context.lineWidth = 1; context.strokeRect(18, -67, 28, 67);
    context.fillStyle = palette.trim; for (let row = 0; row < 3; row += 1) context.fillRect(22, -59 + row * 19, 20, 3);
  } else if (cue === "toolCart" || cue === "pump" || cue === "switchPanel" || cue === "signalBox") {
    context.fillStyle = "#293231"; context.fillRect(19, -38, 30, 38);
    context.strokeStyle = "#8b7859"; context.lineWidth = 1.4; context.strokeRect(19, -38, 30, 38);
    context.fillStyle = palette.glow; context.beginPath(); context.arc(42, -29, 2.5, 0, Math.PI * 2); context.fill();
    if (cue === "pump") { context.strokeStyle = "#688887"; context.lineWidth = 3; context.beginPath(); context.moveTo(27, -18); context.lineTo(52, -18); context.stroke(); }
  } else if (cue === "clock") {
    context.fillStyle = "#262526"; context.fillRect(18, -76, 25, 76);
    context.strokeStyle = palette.glow; context.lineWidth = 1.3; context.beginPath(); context.arc(30, -61, 10, 0, Math.PI * 2); context.stroke();
  } else if (cue === "awning") {
    context.strokeStyle = "#708e8f"; context.lineWidth = 2; context.beginPath(); context.moveTo(-35, -66); context.lineTo(39, -66); context.lineTo(53, -36); context.stroke();
  } else if (cue === "patrolSign") {
    context.fillStyle = "#2d332f"; context.fillRect(20, -55, 4, 55); context.fillStyle = palette.trim; context.fillRect(14, -56, 18, 13);
  } else if (cue === "suitcasePile") {
    context.fillStyle = "#3b332b"; context.fillRect(19, -18, 30, 18); context.strokeStyle = palette.trim; context.strokeRect(19, -18, 30, 18);
  } else if (cue === "ticketGate") {
    context.fillStyle = "#26302f"; context.fillRect(19, -35, 12, 35); context.fillRect(38, -35, 12, 35); context.fillStyle = palette.glow; context.fillRect(22, -29, 5, 3);
  }
  context.restore();
};

const drawNpcProp = (context, npc, time) => {
  const { prop, palette } = npc;
  context.save();
  context.translate(13, -27);
  context.strokeStyle = "#17191a";
  context.lineWidth = 1.4;
  if (prop === "lantern") {
    const pulse = .75 + Math.sin(time * 4 + npc.x) * .12;
    context.fillStyle = `rgba(232, 220, 151, ${.2 * pulse})`; context.beginPath(); context.arc(0, 0, 18, 0, Math.PI * 2); context.fill();
    context.strokeStyle = palette.glow; context.strokeRect(-4, -7, 8, 13); context.fillStyle = palette.glow; context.fillRect(-2, -4, 4, 7);
  } else if (prop === "ticket" || prop === "letter" || prop === "paper") {
    context.fillStyle = "#d8c99f"; context.fillRect(-4, -6, 11, 8); context.strokeRect(-4, -6, 11, 8);
    context.fillStyle = palette.trim; context.fillRect(-2, -3, 7, 1);
  } else if (prop === "mirror") {
    context.fillStyle = "#343a45"; context.fillRect(-5, -11, 10, 16); context.strokeStyle = palette.glow; context.strokeRect(-5, -11, 10, 16); context.fillStyle = "#bbc7d0"; context.fillRect(-2, -8, 4, 7);
  } else if (prop === "tools" || prop === "wrench") {
    context.strokeStyle = "#899f9d"; context.lineWidth = 3; context.beginPath(); context.moveTo(-5, 5); context.lineTo(7, -8); context.stroke(); context.fillStyle = palette.trim; context.fillRect(4, -11, 5, 5);
  } else if (prop === "switch" || prop === "bell") {
    context.fillStyle = "#242c2c"; context.fillRect(-5, -8, 11, 14); context.fillStyle = palette.glow; context.beginPath(); context.arc(1, -3, 3, 0, Math.PI * 2); context.fill();
  } else if (prop === "watch") {
    context.fillStyle = "#28282a"; context.beginPath(); context.arc(1, -3, 7, 0, Math.PI * 2); context.fill(); context.strokeStyle = palette.glow; context.stroke(); context.beginPath(); context.moveTo(1, -3); context.lineTo(4, -6); context.stroke();
  } else if (prop === "umbrella") {
    context.strokeStyle = "#7b9898"; context.lineWidth = 2; context.beginPath(); context.moveTo(-5, 8); context.lineTo(6, -11); context.stroke(); context.fillStyle = "#2b3b3d"; context.beginPath(); context.arc(0, -9, 8, Math.PI, 0); context.fill();
  } else if (prop === "badge" || prop === "seal") {
    context.fillStyle = palette.glow; context.beginPath(); context.arc(1, -3, 5, 0, Math.PI * 2); context.fill(); context.fillStyle = "#543a31"; context.fillRect(-2, 2, 6, 5);
  } else if (prop === "ledger") {
    context.fillStyle = "#6c5340"; context.fillRect(-5, -9, 13, 16); context.strokeStyle = palette.trim; context.strokeRect(-5, -9, 13, 16); context.fillStyle = "#c2b388"; context.fillRect(-2, -5, 8, 1);
  } else if (prop === "suitcase") {
    context.fillStyle = "#4c3b2e"; context.fillRect(-6, -6, 15, 11); context.strokeStyle = palette.trim; context.strokeRect(-6, -6, 15, 11); context.fillRect(-1, -10, 5, 4);
  } else {
    context.fillStyle = "#594839"; context.fillRect(-6, -6, 14, 11); context.strokeStyle = palette.trim; context.strokeRect(-6, -6, 14, 11);
  }
  context.restore();
};

const drawStationNpc = (context, npc, time, nearby = false) => {
  const scale = 1;
  const bob = Math.sin(time * 1.8 + npc.x * .03) * 1.2;
  const { coat, trim, skin, glow } = npc.palette;
  context.save();
  context.translate(npc.x, npc.y + bob);
  context.imageSmoothingEnabled = false;
  context.fillStyle = "rgba(0, 0, 0, .48)";
  context.beginPath(); context.ellipse(0, 5, 20, 6, 0, 0, Math.PI * 2); context.fill();
  const sprite = getStationNpcSprite(npc);
  if (sprite?.ready) {
    // Every supplied art file is anchored to a common feet baseline. Keep its
    // full costume, face and held work item intact; the map adds only the
    // separate environmental cue behind it.
    const height = 76;
    const width = height * sprite.image.naturalWidth / sprite.image.naturalHeight;
    context.drawImage(sprite.image, -width / 2, -height + 5, width, height);
    if (nearby) {
      const pulse = 22 + Math.sin(time * 5) * 2;
      context.strokeStyle = `rgba(221, 239, 194, ${.58 + Math.sin(time * 5) * .15})`;
      context.lineWidth = 1.25; context.beginPath(); context.ellipse(0, 5, pulse, pulse * .28, 0, 0, Math.PI * 2); context.stroke();
      context.fillStyle = "rgba(5, 11, 10, .86)"; context.fillRect(-33, -96, 66, 11);
      context.fillStyle = "#eef1d8"; context.font = "7px ui-monospace, monospace"; context.textAlign = "center"; context.fillText(`E · ${npc.name}`, 0, -88);
    }
    context.restore();
    return;
  }
  // boots and layered work coat: clear clothing/metal/skin material zones
  context.fillStyle = "#16191a"; context.fillRect(-11, -2, 8, 8); context.fillRect(3, -2, 8, 8);
  context.fillStyle = coat; context.beginPath(); context.moveTo(-15, -5); context.lineTo(-11, -39); context.lineTo(10, -39); context.lineTo(16, -5); context.closePath(); context.fill();
  context.fillStyle = "rgba(14, 17, 18, .5)"; context.fillRect(-3, -37, 6, 30);
  context.fillStyle = trim; context.fillRect(-11, -34, 4, 24); context.fillRect(7, -34, 4, 24); context.fillRect(-15, -8, 30, 3);
  context.fillStyle = "#202624"; context.fillRect(-17, -33, 5, 20); context.fillRect(12, -33, 5, 20);
  // a small left-upper key light makes all workers belong to the same world.
  context.fillStyle = "rgba(240, 230, 190, .18)"; context.fillRect(-10, -36, 5, 22);
  context.fillStyle = skin; context.fillRect(-9, -55, 18, 18);
  context.fillStyle = "#202527"; context.fillRect(-11, -59, 22, 7); context.fillRect(-9, -62, 18, 4);
  context.fillStyle = "#131718"; context.fillRect(-7, -50, 5, 4); context.fillRect(3, -50, 5, 4);
  context.fillStyle = glow; context.fillRect(-6, -49, 2, 2); context.fillRect(4, -49, 2, 2);
  context.fillStyle = "#7f6256"; context.fillRect(-2, -43, 5, 2);
  context.fillStyle = "#bdab8d"; context.fillRect(-7, -54, 4, 2);
  drawNpcProp(context, npc, time);
  if (nearby) {
    const pulse = 18 + Math.sin(time * 5) * 1.8;
    context.strokeStyle = `rgba(221, 239, 194, ${.58 + Math.sin(time * 5) * .15})`;
    context.lineWidth = 1.2; context.beginPath(); context.ellipse(0, 5, pulse, pulse * .28, 0, 0, Math.PI * 2); context.stroke();
    context.fillStyle = "rgba(5, 11, 10, .82)"; context.fillRect(-29, -78, 58, 11);
    context.fillStyle = "#eef1d8"; context.font = "7px ui-monospace, monospace"; context.textAlign = "center"; context.fillText(`E · ${npc.name}`, 0, -70);
  }
  context.restore();
};

const drawStationNpcs = (context, run) => {
  (run.npcs ?? []).forEach((npc) => drawNpcSceneCue(context, npc));
  (run.npcs ?? []).forEach((npc) => drawStationNpc(context, npc, run.time, npc.id === run.nearbyNpcId));
};

const drawSpawnWarning = (context, enemy, time) => {
  if (!(enemy.telegraph > 0)) return;
  const pulse = .55 + Math.sin((time + enemy.telegraph) * 15) * .24;
  if (enemy.spawnSource === "trainDoors" || enemy.spawnSource === "trainDoorWest") {
    context.fillStyle = `rgba(255, 111, 80, ${pulse * .13})`;
    context.fillRect(enemy.x - enemy.radius * 1.35, enemy.y - enemy.radius * 1.8, enemy.radius * 2.7, enemy.radius * 3.2);
    context.strokeStyle = `rgba(255, 151, 99, ${pulse})`;
    context.lineWidth = 1.4;
    context.strokeRect(enemy.x - enemy.radius * 1.35, enemy.y - enemy.radius * 1.8, enemy.radius * 2.7, enemy.radius * 3.2);
  } else if (enemy.spawnSource === "railFog") {
    context.fillStyle = `rgba(255, 106, 74, ${pulse * .11})`;
    context.beginPath(); context.ellipse(enemy.x, enemy.y, enemy.radius * 3.1, enemy.radius * 1.35, 0, 0, Math.PI * 2); context.fill();
  } else if (enemy.spawnSource === "service") {
    context.strokeStyle = `rgba(255, 116, 75, ${pulse})`;
    context.lineWidth = 1.3;
    context.beginPath(); context.moveTo(enemy.x - enemy.radius * 2.1, enemy.y); context.lineTo(enemy.x + enemy.radius * 2.1, enemy.y); context.stroke();
  }
  context.strokeStyle = `rgba(245, 92, 76, ${pulse})`;
  context.lineWidth = 2;
  context.beginPath(); context.arc(enemy.x, enemy.y, enemy.radius * 2.1 + enemy.telegraph * 5, 0, Math.PI * 2); context.stroke();
};

const drawThreatIndicators = (context, run, camera) => {
  const playerScreen = { x: run.player.x - camera.x, y: run.player.y - camera.y };
  const candidates = run.enemies
    .filter((enemy) => enemy.x < camera.x || enemy.x > camera.x + VIEW_WIDTH || enemy.y < camera.y || enemy.y > camera.y + VIEW_HEIGHT)
    .sort((left, right) => distance(run.player, left) - distance(run.player, right))
    .slice(0, 4);
  candidates.forEach((enemy) => {
    const dx = enemy.x - run.player.x;
    const dy = enemy.y - run.player.y;
    const magnitude = Math.hypot(dx, dy) || 1;
    const travel = Math.min((VIEW_WIDTH * .46) / Math.max(Math.abs(dx) / magnitude, .01), (VIEW_HEIGHT * .43) / Math.max(Math.abs(dy) / magnitude, .01));
    const x = clamp(playerScreen.x + dx / magnitude * travel, 12, VIEW_WIDTH - 12);
    const y = clamp(playerScreen.y + dy / magnitude * travel, 12, VIEW_HEIGHT - 12);
    context.save();
    context.translate(x, y);
    context.rotate(Math.atan2(dy, dx));
    context.fillStyle = enemySignalColor(enemy);
    context.shadowColor = enemySignalColor(enemy);
    context.shadowBlur = enemy.elite || enemy.boss ? 8 : 3;
    context.beginPath(); context.moveTo(7, 0); context.lineTo(-5, -5); context.lineTo(-5, 5); context.closePath(); context.fill();
    context.restore();
  });
};

const drawTargetLock = (context, run, aim) => {
  const target = getLockedEnemy(run, aim);
  if (!target) return;
  const pulse = 2 + Math.sin(run.time * 9) * .7;
  context.save();
  context.translate(target.x, target.y);
  context.strokeStyle = "#c8f7ff";
  context.lineWidth = 1.2;
  context.setLineDash([3, 2]);
  context.beginPath(); context.arc(0, 0, target.radius + 6 + pulse, 0, Math.PI * 2); context.stroke();
  context.setLineDash([]);
  context.fillStyle = "#c8f7ff";
  context.fillRect(-1, -target.radius - 12 - pulse, 2, 6);
  context.restore();
};

const drawStationDressings = (context, time) => {
  // Fixed dressing keeps the playable loop readable while selling a lived-in
  // underground station: rails, ads, puddles, gates, bags and carriage light.
  context.fillStyle = "rgba(92, 57, 48, .22)";
  [168, 904].forEach((y) => context.fillRect(0, y, WORLD_WIDTH, 5));
  context.strokeStyle = "rgba(146, 159, 141, .34)";
  context.lineWidth = 2;
  [195, 215, 865, 885].forEach((y) => { context.beginPath(); context.moveTo(0, y); context.lineTo(WORLD_WIDTH, y); context.stroke(); });
  [[210, 435, 34, 11], [750, 536, 44, 14], [1125, 355, 28, 9], [1530, 700, 42, 13], [1695, 470, 31, 10]].forEach(([x, y, rx, ry]) => {
    context.fillStyle = "rgba(135, 174, 164, .10)";
    context.beginPath(); context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "rgba(173, 208, 190, .14)";
    context.lineWidth = 1; context.beginPath(); context.ellipse(x, y, rx * .78, ry * .55, 0, 0, Math.PI * 2); context.stroke();
  });
  [[170, 430, "离开这里"], [900, 215, "雾港 / 07"], [1490, 650, "末班停运"]].forEach(([x, y, text]) => {
    context.fillStyle = "#222b2a"; context.fillRect(x, y, 90, 34);
    context.strokeStyle = "rgba(201, 165, 115, .42)"; context.strokeRect(x, y, 90, 34);
    context.fillStyle = "rgba(231, 206, 157, .72)"; context.font = "9px ui-monospace, monospace"; context.textAlign = "center"; context.fillText(text, x + 45, y + 20);
  });
  [[595, 532], [1270, 520]].forEach(([x, y]) => {
    context.fillStyle = "#2c3533";
    for (let index = 0; index < 3; index += 1) context.fillRect(x + index * 10, y, 7, 25);
    context.strokeStyle = "#a0574f"; context.lineWidth = 2; context.beginPath(); context.moveTo(x - 4, y + 4); context.lineTo(x + 34, y + 4); context.stroke();
  });
  [[405, 622], [1452, 410], [1020, 752]].forEach(([x, y]) => {
    context.fillStyle = "#453a32"; context.fillRect(x, y, 18, 13); context.strokeStyle = "#a78b65"; context.strokeRect(x, y, 18, 13);
    context.fillStyle = "#675244"; context.fillRect(x + 4, y - 5, 10, 5);
  });
  const flicker = .5 + Math.sin(time * 7) * .22;
  context.fillStyle = `rgba(242, 190, 124, ${flicker})`;
  [[320, 120], [1090, 120], [1600, 965]].forEach(([x, y]) => context.fillRect(x, y, 18, 3));
};

// The painted station plate is the entire world, not a decorative slice. Its
// 16:9 dimensions exactly match the movement bounds and the camera viewport.
// Dynamic lighting and weather sit above it while collision remains data driven.
const drawFogHarborArt = (context, run) => {
  const { time, wave } = run;
  const scene = getSceneArt(run.layout?.art);
  if (scene?.ready) {
    context.save();
    context.imageSmoothingEnabled = false;
    context.drawImage(scene.image, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    context.restore();
  } else {
    // A dark wet-tile fallback avoids exposing a black void while the embedded
    // background decodes on a slow device.
    context.fillStyle = "#17211e";
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }

  // Very faint observation scan: it reads like a diagnostic pass, never like
  // the former gameplay grid.
  const scanY = (time * 42) % WORLD_HEIGHT;
  context.fillStyle = "rgba(189, 248, 239, .025)";
  context.fillRect(0, scanY, WORLD_WIDTH, 1);

  const lampsByStation = {
    fogHarbor: [[140, 188, "#f3c46c", 96], [528, 144, "#d1c974", 84], [1090, 144, "#f3c46c", 96], [96, 348, "#ff4b43", 80], [1196, 332, "#ff4b43", 72]],
    powerCorridor: [[312, 126, "#f3c46c", 72], [636, 110, "#f3c46c", 76], [994, 116, "#ff774f", 78], [174, 444, "#ff4b43", 72], [1102, 500, "#ff4b43", 68]],
    facelessPlatform: [[274, 152, "#f3c46c", 80], [640, 146, "#c8efff", 96], [1004, 152, "#f3c46c", 80], [116, 570, "#ff4b43", 66], [1164, 570, "#ff4b43", 66]],
  };
  const lamps = lampsByStation[run.layout?.art] ?? lampsByStation.fogHarbor;
  context.save();
  context.globalCompositeOperation = "screen";
  lamps.forEach(([x, y, color, radius], index) => {
    const flicker = .7 + Math.sin(time * (4.6 + index) + index * 1.9) * .18;
    const glow = context.createRadialGradient(x, y, 0, x, y, radius * flicker);
    glow.addColorStop(0, `${color}2e`);
    glow.addColorStop(.35, `${color}14`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.beginPath(); context.arc(x, y, radius * flicker, 0, Math.PI * 2); context.fill();
  });
  const alarmLevel = clamp((wave - 3) / 8, 0, .32);
  if (alarmLevel > 0) {
    const alarm = context.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    alarm.addColorStop(0, `rgba(255, 61, 57, ${alarmLevel})`);
    alarm.addColorStop(.45, "rgba(0, 0, 0, 0)");
    alarm.addColorStop(1, `rgba(255, 57, 50, ${alarmLevel * .72})`);
    context.fillStyle = alarm;
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }
  context.restore();
};

const drawArenaAtmosphere = (context, run) => {
  const { player, time } = run;
  context.save();
  context.globalCompositeOperation = "screen";
  const playerGlow = context.createRadialGradient(player.x, player.y, 2, player.x, player.y, 64);
  playerGlow.addColorStop(0, "rgba(216, 251, 255, .22)");
  playerGlow.addColorStop(.38, "rgba(108, 223, 232, .07)");
  playerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = playerGlow;
  context.beginPath(); context.arc(player.x, player.y, 64, 0, Math.PI * 2); context.fill();

  // Fog stays near the platform edges and rain only catches occasional light,
  // preserving the central loop's combat readability.
  for (let index = 0; index < 13; index += 1) {
    const x = (index * 173 + time * (8 + index % 3) * 7) % WORLD_WIDTH;
    const y = (index * 89 + time * 19) % WORLD_HEIGHT;
    context.strokeStyle = "rgba(159, 211, 201, .10)";
    context.lineWidth = 1;
    context.beginPath(); context.moveTo(x, y); context.lineTo(x - 3, y + 11 + index % 5); context.stroke();
  }
  [[72, 176], [1208, 164], [84, 652], [1200, 652]].forEach(([x, y], index) => {
    const drift = Math.sin(time * .42 + index) * 18;
    const fog = context.createRadialGradient(x + drift, y, 2, x + drift, y, 125);
    fog.addColorStop(0, "rgba(157, 190, 173, .075)");
    fog.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = fog;
    context.beginPath(); context.arc(x + drift, y, 125, 0, Math.PI * 2); context.fill();
  });
  context.restore();
};

const drawArenaEffects = (context, run) => {
  (run.effects ?? []).forEach((effect) => {
    const progress = 1 - effect.life / effect.maxLife;
    context.save();
    context.globalCompositeOperation = "screen";
    if (effect.kind === "electricBurst") {
      const radius = 26 + progress * 74;
      context.strokeStyle = `rgba(176, 246, 255, ${Math.max(0, 1 - progress) * .86})`;
      context.lineWidth = 2.2;
      context.beginPath(); context.arc(effect.x, effect.y, radius, 0, Math.PI * 2); context.stroke();
      for (let arc = 0; arc < 7; arc += 1) {
        const angle = arc * Math.PI * 2 / 7 + progress * 3;
        context.beginPath();
        context.moveTo(effect.x + Math.cos(angle) * 9, effect.y + Math.sin(angle) * 9);
        context.lineTo(effect.x + Math.cos(angle + .12) * radius * .72, effect.y + Math.sin(angle + .12) * radius * .72);
        context.lineTo(effect.x + Math.cos(angle - .1) * radius, effect.y + Math.sin(angle - .1) * radius);
        context.stroke();
      }
    }
    if (effect.kind === "impact") {
      const radius = (effect.critical ? 11 : 7) + progress * 8;
      const alpha = Math.max(0, 1 - progress) * .92;
      context.strokeStyle = effect.critical ? `rgba(255, 248, 194, ${alpha})` : `rgba(195, 250, 255, ${alpha})`;
      context.lineWidth = effect.critical ? 2.1 : 1.45;
      context.beginPath(); context.arc(effect.x, effect.y, radius, 0, Math.PI * 2); context.stroke();
      for (let ray = 0; ray < 4; ray += 1) {
        const angle = ray * Math.PI / 2 + progress * .35;
        context.beginPath();
        context.moveTo(effect.x + Math.cos(angle) * radius * .55, effect.y + Math.sin(angle) * radius * .55);
        context.lineTo(effect.x + Math.cos(angle) * radius * 1.35, effect.y + Math.sin(angle) * radius * 1.35);
        context.stroke();
      }
    }
    context.restore();
  });
};

const drawArenaDebug = (context, run) => {
  context.save();
  context.font = "10px ui-monospace, monospace";
  context.textBaseline = "top";
  context.setLineDash([5, 3]);
  run.obstacles.forEach((obstacle) => {
    context.strokeStyle = obstacle.kind === "breakable" ? "#f0c873" : "rgba(130, 235, 215, .88)";
    context.lineWidth = 1;
    context.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    context.fillStyle = "rgba(4, 15, 14, .76)";
    context.fillRect(obstacle.x, obstacle.y - 12, Math.max(38, obstacle.kind.length * 6 + 8), 11);
    context.fillStyle = "#d5fff1";
    context.fillText(obstacle.kind, obstacle.x + 3, obstacle.y - 11);
  });
  context.setLineDash([3, 3]);
  Object.entries(run.layout?.spawnZones ?? {}).forEach(([source, zones]) => {
    zones.forEach((zone) => {
      context.strokeStyle = source === "railFog" ? "#ff7660" : source === "service" ? "#ffd36b" : "#b7fbff";
      context.strokeRect(zone.x, zone.y, zone.width ?? 4, zone.height ?? 4);
      context.fillStyle = "rgba(3, 11, 10, .78)";
      context.fillRect(zone.x, zone.y - 11, source.length * 6 + 8, 10);
      context.fillStyle = "#edf8e8";
      context.fillText(source, zone.x + 3, zone.y - 10);
    });
  });
  (run.layout?.puddles ?? []).forEach((puddle) => {
    context.strokeStyle = "rgba(159, 221, 233, .8)";
    context.beginPath(); context.ellipse(puddle.x, puddle.y, puddle.radiusX, puddle.radiusY, 0, 0, Math.PI * 2); context.stroke();
  });
  context.restore();
};

const drawTransitWorkerModel = (context, x, y, scale, npc = {}, guide = false) => {
  const palette = npc.palette ?? { coat: "#334144", trim: "#8bb5b5", skin: "#d6c4a8", glow: "#bee4dc" };
  context.save();
  context.translate(x, y);
  context.fillStyle = "rgba(0, 0, 0, .42)";
  context.beginPath(); context.ellipse(0, scale * .95, scale * .62, scale * .18, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = palette.coat;
  context.strokeStyle = palette.trim;
  context.lineWidth = 1.4;
  context.beginPath(); context.moveTo(-scale * .48, scale * .72); context.lineTo(-scale * .36, -scale * .08); context.lineTo(0, -scale * .3); context.lineTo(scale * .36, -scale * .08); context.lineTo(scale * .48, scale * .72); context.closePath(); context.fill(); context.stroke();
  context.fillStyle = "#171d1d";
  context.fillRect(-scale * .42, scale * .6, scale * .26, scale * .27); context.fillRect(scale * .16, scale * .6, scale * .26, scale * .27);
  context.fillStyle = palette.trim;
  context.fillRect(-scale * .34, -scale * .08, scale * .12, scale * .58); context.fillRect(scale * .22, -scale * .08, scale * .12, scale * .58);
  context.fillStyle = palette.skin;
  context.beginPath(); context.ellipse(0, -scale * .53, scale * .34, scale * .4, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#151819";
  context.beginPath(); context.arc(0, -scale * .7, scale * .35, Math.PI, 0); context.fill();
  context.fillStyle = palette.glow;
  context.beginPath(); context.arc(-scale * .13, -scale * .53, scale * .055, 0, Math.PI * 2); context.arc(scale * .13, -scale * .53, scale * .055, 0, Math.PI * 2); context.fill();
  context.fillStyle = "rgba(238, 229, 195, .18)";
  context.fillRect(-scale * .25, -scale * .74, scale * .18, scale * .26);
  if (guide) {
    context.strokeStyle = palette.glow;
    context.lineWidth = 2;
    context.beginPath(); context.moveTo(scale * .34, -scale * .18); context.lineTo(scale * .72, -scale * .62); context.stroke();
    context.fillStyle = `rgba(236, 222, 151, .16)`; context.beginPath(); context.arc(scale * .76, -scale * .72, scale * .33, 0, Math.PI * 2); context.fill();
    context.fillStyle = palette.glow; context.beginPath(); context.arc(scale * .76, -scale * .72, scale * .14, 0, Math.PI * 2); context.fill();
  }
  context.restore();
};

const drawTransitProtagonist = (context, run, x, y, height = 78) => {
  const sprite = getWeaponSprite(run.weapon.id);
  if (!sprite?.ready || !sprite.canvas) {
    drawTransitWorkerModel(context, x, y, height * .42, { palette: { coat: "#33454a", trim: "#9fd6de", skin: "#d5c2a7", glow: "#c5eff3" } }, false);
    return;
  }
  const width = height * sprite.canvas.width / sprite.canvas.height;
  context.save();
  context.translate(x, y);
  context.imageSmoothingEnabled = false;
  context.fillStyle = "rgba(0, 0, 0, .42)";
  context.beginPath(); context.ellipse(0, 5, width * .34, 6, 0, 0, Math.PI * 2); context.fill();
  context.shadowColor = "rgba(171, 237, 244, .5)";
  context.shadowBlur = 9;
  context.drawImage(sprite.canvas, -width / 2, -height + 5, width, height);
  context.restore();
};

const drawTransitNpc = (context, npc, x, y, height = 90) => {
  const sprite = getStationNpcSprite(npc);
  if (!sprite?.ready) {
    drawTransitWorkerModel(context, x, y, height * .4, npc, true);
    return;
  }
  const width = height * sprite.image.naturalWidth / sprite.image.naturalHeight;
  context.save();
  context.translate(x, y);
  context.imageSmoothingEnabled = false;
  context.fillStyle = "rgba(0, 0, 0, .44)";
  context.beginPath(); context.ellipse(0, 5, width * .36, 6, 0, 0, Math.PI * 2); context.fill();
  context.shadowColor = npc.palette?.glow ?? "#d8c879";
  context.shadowBlur = 8;
  context.drawImage(sprite.image, -width / 2, -height + 5, width, height);
  context.restore();
};

const drawLegacyTrainBoarding = (context, run) => {
  if (run.phase !== "boarding") return;
  const duration = run.boardingDuration ?? 2.6;
  const progress = clamp((run.boardingElapsed ?? 0) / duration, 0, 1);
  const fade = Math.min(1, progress * 4, (1 - progress) * 7 + .12);
  const heroX = 160 + Math.min(1, progress * 2.2) * 128;
  const doorOpen = 16 + Math.min(1, progress * 2) * 48;
  const contact = run.boardingContact ?? {};
  const contactNpc = (run.npcs ?? []).find((npc) => npc.isContact) ?? { name: contact.name, palette: { coat: "#3c4440", trim: "#c5a06c", skin: "#d1c1a8", glow: "#e6c879" } };
  context.save();
  context.fillStyle = `rgba(2, 6, 6, ${.78 * fade})`;
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  const carriage = context.createLinearGradient(0, 56, 0, 310);
  carriage.addColorStop(0, "#172425"); carriage.addColorStop(.48, "#0c1516"); carriage.addColorStop(1, "#071010");
  context.fillStyle = carriage;
  context.fillRect(48, 54, 544, 258);
  context.strokeStyle = "rgba(188, 224, 206, .45)";
  context.lineWidth = 2; context.strokeRect(48, 54, 544, 258);
  [82, 162, 478, 558].forEach((x) => {
    context.fillStyle = "rgba(231, 188, 105, .24)"; context.fillRect(x, 82, 48, 76);
    context.strokeStyle = "rgba(238, 205, 135, .52)"; context.strokeRect(x, 82, 48, 76);
  });
  context.fillStyle = "#030808";
  context.fillRect(320 - doorOpen, 76, doorOpen * 2, 190);
  context.strokeStyle = "rgba(186, 243, 247, .72)"; context.lineWidth = 2;
  context.strokeRect(320 - doorOpen, 76, doorOpen * 2, 190);
  context.fillStyle = "rgba(205, 246, 251, .1)"; context.fillRect(320 - doorOpen + 5, 82, doorOpen * 2 - 10, 178);
  context.fillStyle = "rgba(255, 235, 182, .12)"; context.fillRect(58, 272, 524, 20);
  drawTransitProtagonist(context, run, heroX, 245, 76);
  drawTransitNpc(context, contactNpc, 390, 236, 90);
  context.fillStyle = "#d9f1e9";
  context.font = "600 13px ui-monospace, SFMono-Regular, monospace";
  context.textAlign = "center";
  context.fillText(progress < .48 ? "主角登上末班列车" : `${contact.name ?? "接应员"} 已在车内接应`, VIEW_WIDTH / 2, 30);
  context.fillStyle = "rgba(219, 229, 215, .88)";
  context.font = "11px ui-sans-serif, system-ui, sans-serif";
  context.fillText(contact.role ?? "下一站接应", VIEW_WIDTH / 2, 334);
  if (progress > .42) {
    context.fillStyle = "rgba(244, 230, 208, .93)";
    context.font = "11px ui-sans-serif, system-ui, sans-serif";
    const line = contact.line ?? `前往 ${run.boardingDestination ?? "下一站"}。`;
    context.fillText(line.length > 38 ? `${line.slice(0, 38)}…` : line, VIEW_WIDTH / 2, 350);
  }
  context.restore();
};

const cinematicEase = (value) => 1 - (1 - clamp(value, 0, 1)) ** 3;

const drawCinematicStationPlate = (context, run) => {
  const scene = getSceneArt(run.layout?.art);
  context.fillStyle = "#020606";
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  if (scene?.ready) {
    context.drawImage(scene.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    context.fillStyle = "rgba(1, 5, 6, .56)";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  } else {
    const tunnel = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    tunnel.addColorStop(0, "#081112"); tunnel.addColorStop(.58, "#10211f"); tunnel.addColorStop(1, "#050908");
    context.fillStyle = tunnel; context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    context.fillStyle = "rgba(213, 169, 93, .16)";
    context.fillRect(0, 300, VIEW_WIDTH, 4);
    context.fillStyle = "rgba(136, 191, 193, .08)";
    context.fillRect(0, 316, VIEW_WIDTH, 2);
  }
  context.fillStyle = "rgba(0, 0, 0, .45)";
  context.fillRect(0, 0, VIEW_WIDTH, 42);
  context.fillStyle = "rgba(137, 190, 190, .12)";
  context.fillRect(0, 306, VIEW_WIDTH, 2);
};

const drawCinematicCaption = (context, title, detail, alpha = 1) => {
  context.save();
  context.globalAlpha = alpha;
  context.textAlign = "center";
  context.font = "600 12px ui-monospace, SFMono-Regular, monospace";
  context.fillStyle = "#e8e2cf";
  context.fillText(title, VIEW_WIDTH / 2, 29);
  if (detail) {
    context.font = "10px ui-sans-serif, system-ui, sans-serif";
    context.fillStyle = "rgba(204, 219, 208, .86)";
    context.fillText(detail, VIEW_WIDTH / 2, 342);
  }
  context.restore();
};

// Full-screen train transfer: exterior arrival, platform reception, then the
// independent interior plate. Combat HUD is hidden by the React shell while
// this canvas owns the complete frame.
const drawTrainBoarding = (context, run) => {
  if (run.phase !== "boarding") return;
  const duration = run.boardingDuration ?? 3;
  const progress = clamp((run.boardingElapsed ?? 0) / duration, 0, 1);
  const arrival = cinematicEase(progress / .267);
  const brake = clamp((progress - .267) / .333, 0, 1);
  const boarding = cinematicEase((progress - .6) / .4);
  const contact = run.boardingContact ?? {};
  const contactNpc = (run.npcs ?? []).find((npc) => npc.isContact) ?? {
    name: contact.name ?? "未登记接应员",
    palette: { coat: "#3c4440", trim: "#c5a06c", skin: "#d1c1a8", glow: "#e6c879" },
  };
  const exterior = getTransitionArt("exterior");
  const interior = getTransitionArt("interior");

  context.save();
  context.imageSmoothingEnabled = false;
  if (progress < .6) {
    drawCinematicStationPlate(context, run);
    const trainHeight = 254 + brake * 10;
    const trainWidth = exterior?.ready ? trainHeight * exterior.image.naturalWidth / exterior.image.naturalHeight : 540;
    const trainX = -trainWidth - 20 + (trainWidth + 56) * arrival;
    const trainY = 48 + Math.sin(Math.min(1, brake) * Math.PI) * 4;
    context.save();
    context.fillStyle = "rgba(0, 0, 0, .48)";
    context.beginPath(); context.ellipse(324, 294, 300, 25, 0, 0, Math.PI * 2); context.fill();
    if (exterior?.ready) context.drawImage(exterior.image, trainX, trainY, trainWidth, trainHeight);
    else {
      context.fillStyle = "#172326"; context.fillRect(trainX, trainY + 42, trainWidth, 148);
      context.fillStyle = "rgba(240, 189, 102, .62)"; [0, 1, 2, 3, 4].forEach((index) => context.fillRect(trainX + 48 + index * 76, trainY + 72, 42, 28));
    }
    context.restore();
    if (progress > .267) {
      const sway = Math.sin(brake * Math.PI * 5) * (1 - brake) * 3;
      drawTransitProtagonist(context, run, 258 + brake * 24, 300 + sway, 104);
      drawTransitNpc(context, contactNpc, 403, 302 - sway, 122);
      context.fillStyle = `rgba(161, 235, 245, ${.48 + Math.sin(brake * 12) * .14})`;
      context.beginPath(); context.arc(365, 253, 8 + brake * 2, 0, Math.PI * 2); context.fill();
      drawCinematicCaption(context, "E 登上末班列车", `${contact.name ?? "接应员"} 正在车门前等候`);
    } else {
      drawCinematicCaption(context, "末班列车正在驶入", "隧道灯正依次熄灭", .9);
    }
  } else {
    context.fillStyle = "#040706";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    if (interior?.ready) context.drawImage(interior.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    else drawCinematicStationPlate(context, run);

    // The generated carriage stays intact; only the centre seam becomes an
    // opening with a threshold and deep corridor instead of a cyan test box.
    const openingWidth = 20 + boarding * 146;
    const left = VIEW_WIDTH / 2 - openingWidth / 2;
    const passage = context.createLinearGradient(left, 0, left + openingWidth, 0);
    passage.addColorStop(0, "rgba(11, 18, 18, .86)");
    passage.addColorStop(.18, "rgba(1, 4, 5, .96)");
    passage.addColorStop(.5, "rgba(4, 12, 14, .98)");
    passage.addColorStop(.82, "rgba(1, 4, 5, .96)");
    passage.addColorStop(1, "rgba(11, 18, 18, .86)");
    context.fillStyle = passage;
    context.fillRect(left, 68, openingWidth, 218);
    context.strokeStyle = "rgba(197, 164, 93, .52)";
    context.lineWidth = 1.4;
    context.beginPath(); context.moveTo(left, 285); context.lineTo(left + openingWidth, 285); context.stroke();
    context.fillStyle = "rgba(217, 184, 92, .16)";
    context.fillRect(left, 287, openingWidth, 8);
    for (let index = 0; index < 5; index += 1) {
      context.fillStyle = `rgba(126, 205, 211, ${.09 + index * .02})`;
      context.fillRect(left + 7 + index * ((openingWidth - 14) / 5), 75, 1, 196);
    }
    drawTransitNpc(context, contactNpc, 410, 300, 126);
    drawTransitProtagonist(context, run, 236 + boarding * 108, 302, 108);
    drawCinematicCaption(context, boarding < .68 ? "车门已开启" : "驶向下一处工作现场", boarding < .68 ? `${contact.name ?? "接应员"} 侧身让出门槛` : (contact.line ?? "请握紧手中的观测牌。"));
  }

  if (progress > .9) {
    const fade = cinematicEase((progress - .9) / .1);
    context.fillStyle = `rgba(0, 0, 0, ${fade})`;
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  }
  context.restore();
};

export const drawArena = (canvas, run, aim, options = {}) => {
  if (!canvas || !run) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = VIEW_WIDTH * ratio;
  canvas.height = VIEW_HEIGHT * ratio;
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = "#080e0d";
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  const camera = getArenaCamera(run);
  context.save();
  context.beginPath();
  context.rect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  context.clip();
  context.translate(-camera.x, -camera.y);
  drawFogHarborArt(context, run);
  drawWorldMarkers(context, run);
  run.obstacles.forEach((obstacle) => drawArenaObstacle(context, obstacle));
  drawStationNpcs(context, run);
  if (options.debug) drawArenaDebug(context, run);
  run.bullets.forEach((bullet) => {
    const trailLength = Math.min(18, Math.hypot(bullet.vx, bullet.vy) * .065);
    const direction = Math.atan2(bullet.vy, bullet.vx);
    context.strokeStyle = bullet.critical ? "rgba(244, 255, 255, .88)" : "rgba(155, 235, 244, .58)";
    context.lineWidth = bullet.critical ? 2.1 : 1.35;
    context.lineCap = "round";
    context.beginPath(); context.moveTo(bullet.x, bullet.y); context.lineTo(bullet.x - Math.cos(direction) * trailLength, bullet.y - Math.sin(direction) * trailLength); context.stroke();
    context.fillStyle = bullet.critical ? "#f7ffff" : bullet.color;
    context.shadowColor = context.fillStyle;
    context.shadowBlur = bullet.radius > 4 ? 8 : 4;
    context.beginPath(); context.arc(bullet.x, bullet.y, bullet.critical ? 3.8 : bullet.radius ?? 2.2, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
  });
  (run.enemyBullets ?? []).forEach((bullet) => {
    const trailLength = Math.min(16, Math.hypot(bullet.vx, bullet.vy) * .075);
    const direction = Math.atan2(bullet.vy, bullet.vx);
    context.strokeStyle = "rgba(255, 112, 78, .65)";
    context.lineWidth = 1.7;
    context.lineCap = "round";
    context.beginPath(); context.moveTo(bullet.x, bullet.y); context.lineTo(bullet.x - Math.cos(direction) * trailLength, bullet.y - Math.sin(direction) * trailLength); context.stroke();
    context.fillStyle = bullet.color ?? "#ff765f";
    context.shadowColor = context.fillStyle;
    context.shadowBlur = 7;
    context.beginPath(); context.arc(bullet.x, bullet.y, bullet.radius ?? 3, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
  });
  run.enemies.forEach((enemy) => {
    drawSpawnWarning(context, enemy, run.time);
    drawEnemyNpc(context, enemy, run.time);
    context.fillStyle = "rgba(4, 8, 7, .9)";
    context.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, enemy.radius * 2, 3);
    context.fillStyle = enemySignalColor(enemy);
    context.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, (enemy.hp / enemy.maxHp) * enemy.radius * 2, 3);
  });
  drawArenaEffects(context, run);
  drawTargetLock(context, run, aim);
  getOrbitNodes(run).forEach((node) => {
    context.fillStyle = "#aee9ec";
    context.shadowColor = "#8cdced";
    context.shadowBlur = 8;
    context.beginPath(); context.arc(node.x, node.y, 3.3, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(177, 235, 235, .58)";
    context.lineWidth = 1; context.beginPath(); context.arc(node.x, node.y, 6.1, 0, Math.PI * 2); context.stroke();
  });
  drawResidentAvatar(context, run, aim);
  drawArenaAtmosphere(context, run);
  context.restore();
  drawArenaMinimap(context, run, camera);
  drawThreatIndicators(context, run, camera);
  drawTrainBoarding(context, run);
};

export const arenaSize = { width: VIEW_WIDTH, height: VIEW_HEIGHT, worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT };
