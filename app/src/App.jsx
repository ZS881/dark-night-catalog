import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  Camera,
  CaretRight,
  CheckCircle,
  Crosshair,
  DownloadSimple,
  ImageSquare,
  Info,
  MapPin,
  ShieldCheck,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";
import { mbtiDossierByType } from "./mbtiDossiers";
import { mbtiDeepReports, mbtiFunctionGlossary } from "./mbtiDeepReports";
import { mbtiNarrativeProfiles } from "./mbtiNarratives";
import { nightChapters, resolveNightEnding, resolveNightStagePrompt } from "./nightChapters";
import { mbtiQuestions } from "./mbtiQuestions";
import { getWorldArtifact, worldArchiveData } from "./worldArchive";
import {
  applyExpeditionChoice,
  createExpeditionRun,
  expeditionNodes,
  expeditionTitle,
  resolveExpeditionEnding,
} from "./expeditionChapter";
import {
  buildResonanceParcel,
  deriveWorldDistricts,
  parseResonanceCode,
} from "./resonanceMail";
import {
  advanceArenaRun,
  arenaSize,
  arenaWeapons,
  buyArenaShopItem,
  chooseArenaEvent,
  chooseArenaUpgrade,
  createArenaRun,
  drawArena,
  getArenaProjection,
  getArenaResult,
  leaveArenaShop,
} from "./fogRogueArena";

const portableAssetUrl = (path) =>
  path.startsWith("/assets/")
    ? `${import.meta.env.BASE_URL}assets/${path.slice("/assets/".length)}`
    : path;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const residents = {
  repair: {
    name: "血线维修员",
    slug: "bloodline-maintainer",
    route: "修复路线",
    level: "都市异体 · 裂隙级 Ⅱ",
    image: "/assets/expressive-bloodline-maintainer.png",
    story: "它在永夜隧道里修补会自行生长的线缆。每接回一根，现实世界便少一段无人记得的归途。",
    habitat: "末班列车后的 07 号维修区",
    taboo: "不要替它拾起掉落的编号牌",
  },
  guide: {
    name: "雾灯引路员",
    slug: "fog-lamp-guide",
    route: "引路路线",
    level: "都市异体 · 路径级 Ⅰ",
    image: "/assets/expressive-fog-lamp-guide.png",
    story: "它会为没有终点的列车补上最后一盏雾灯。灯光熄灭前，所有迷路者都能被送回某一段尚未遗失的夜晚。",
    habitat: "废线尽头的 03 号引导台",
    taboo: "不要从它手里接走还未点亮的灯",
  },
  archive: {
    name: "潮痕档案员",
    slug: "tide-mark-archivist",
    route: "归档路线",
    level: "都市异体 · 封存级 Ⅱ",
    image: "/assets/expressive-tide-mark-archivist.png",
    story: "它替涨潮后的城市收拢遗失记录，并把无人承认的名字封进潮湿抽屉。清晨来临前，最后一枚印章总会留给空白的纸页。",
    habitat: "潮位以下的旧档案室",
    taboo: "不要替它盖上最后一枚空白印章",
  },
  patrol: {
    name: "蜕壳巡犬",
    slug: "shell-shed-patrol-hound",
    route: "巡界路线",
    level: "野外异体 · 边界级 Ⅲ",
    image: "/assets/shell-shed-patrol-hound-v2.png",
    story: "它曾在村界替人看守夜路，后来只记得“巡逻”这件事。每到月色最薄的时候，它会沿着无人使用的篱门，把遗失的脚印一枚枚送回原处。",
    habitat: "旧村庄外的芦苇巡界亭",
    taboo: "不要对着它的脚印数到第七步",
  },
  market: {
    name: "倒影收银员",
    slug: "reflection-cashier",
    route: "夜市路线",
    level: "都市异体 · 静默级 Ⅱ",
    image: "/assets/catalog-reflection-cashier.png",
    story: "它记得每一枚硬币落在托盘上的声音，却始终记不住自己究竟站在柜台哪一边。玻璃里的那一位会替它把找零算完。",
    habitat: "零点以后仍亮着的无名便利店",
    taboo: "结账时不要看向柜台下方；如果倒影先对你眨眼，就把找零原样放回去。",
  },
  post: {
    name: "灯眼邮差",
    slug: "lantern-eyed-courier",
    route: "雨巷路线",
    level: "都市异体 · 投递级 Ⅱ",
    image: "/assets/catalog-lantern-eyed-courier.png",
    story: "它只投递从未寄出的信。每当信封在它手里变得潮湿，某个尚未说出口的名字就会从巷口的灯影里消失。",
    habitat: "雨后的旧城投递巷",
    taboo: "不要替它确认收件人；被念出的名字会多收到一封回信。",
  },
  platform: {
    name: "站台检票员",
    slug: "platform-ticket-inspector",
    route: "末班路线",
    level: "都市异体 · 站台级 Ⅱ",
    image: "/assets/catalog-platform-ticket-inspector.png",
    story: "末班车停运后，它仍会逐张检验没有目的地的票根。被它打过孔的乘客，总能在下一次入睡前抵达一段未曾离开的站台。",
    habitat: "雨夜停运的郊区月台",
    taboo: "不要让它看见空白票根的背面。",
  },
  lost: {
    name: "失物保管员",
    slug: "lost-property-clerk",
    route: "失物路线",
    level: "都市异体 · 封存级 Ⅰ",
    image: "/assets/catalog-lost-property-clerk.png",
    story: "它替每一件失物保存最后一次被想起的温度。柜格里最深处那把没有齿的钥匙，至今还在等待一扇从未装上的门。",
    habitat: "废站地下的失物保管室",
    taboo: "不要向它描述你遗失的人；它会递来一把不属于你的钥匙。",
  },
  switch: {
    name: "门缝接线员",
    slug: "door-gap-switcher",
    route: "楼道路线",
    level: "都市异体 · 边界级 Ⅲ",
    image: "/assets/catalog-door-gap-switcher.png",
    story: "它负责把断掉的门铃、走廊灯和深夜的求救声接回各自原本的房间。没有人知道它身后的黑影是不是另一个同事。",
    habitat: "旧公寓没有门牌的楼层",
    taboo: "它维修门缝时不要报出房号；报错一次，你的门铃会在每个凌晨同时响起。",
  },
  umbrella: {
    name: "伞骨缝补匠",
    slug: "umbrella-rib-mender",
    route: "雨棚路线",
    level: "都市异体 · 雨幕级 Ⅱ",
    image: "/assets/catalog-umbrella-rib-mender.png",
    story: "它把被风折断的伞骨逐根缝好，再把无处躲雨的人送进伞下。伞面一旦闭合，里面保留的总是一场不属于此地的雨。",
    habitat: "旧商业街尽头的雨棚摊位",
    taboo: "不要替它撑开正在缝合的黑伞。",
  },
};

const questions = [
  {
    id: "corridor",
    prompt: "没有出口标记的走廊里，你会先做什么？",
    options: [
      { route: "repair", label: "寻找断开或损坏的地方" },
      { route: "guide", label: "跟随仍亮着的微光" },
      { route: "archive", label: "记下异常细节再决定" },
      { route: "patrol", label: "站在原处，确认没有东西跟来" },
      { route: "market", label: "看看附近还有没有亮着的店" },
    ],
  },
  {
    id: "voice",
    prompt: "远处传来一次叫你的声音时，你更愿意？",
    options: [
      { route: "repair", label: "先确认传声装置是否故障" },
      { route: "guide", label: "沿声源留下一盏灯" },
      { route: "archive", label: "不回应，记录声音的间隔" },
      { route: "patrol", label: "逆着风声绕到边界外侧" },
      { route: "market", label: "进亮着的店里借一会儿光" },
    ],
  },
  {
    id: "shift",
    prompt: "轮班结束前，你最想完成哪件事？",
    options: [
      { route: "repair", label: "补好最后一处裂缝" },
      { route: "guide", label: "送迷路者抵达站台" },
      { route: "archive", label: "封存今夜的异常记录" },
      { route: "patrol", label: "再巡一遍最后那段边界" },
      { route: "market", label: "把零钱和票据核对到最后一笔" },
    ],
  },
  {
    id: "signal",
    prompt: "最后一块无字路牌亮起时，你看见的灯色更像？",
    options: [
      { route: "primary", label: "被雨水洗淡的冷白" },
      { route: "alternate", label: "像未干的暗红印章" },
    ],
  },
];

const emptyAnswers = { corridor: "", voice: "", shift: "", signal: "" };
const emptyMbtiAnswers = Object.fromEntries(mbtiQuestions.map((question) => [question.id, ""]));
const mbtiDimensions = [
  { id: "EI", label: "能量取向", positive: "E", negative: "I", tieBreaker: "energy_1" },
  { id: "SN", label: "信息偏好", positive: "S", negative: "N", tieBreaker: "perception_1" },
  { id: "TF", label: "决策偏好", positive: "T", negative: "F", tieBreaker: "decision_1" },
  { id: "JP", label: "生活节奏", positive: "J", negative: "P", tieBreaker: "rhythm_1" },
];
const emptyMbtiScores = Object.fromEntries(mbtiDimensions.map((dimension) => [dimension.id, 0]));
const emptyVisualProfile = { contour: "", gaze: "", atmosphere: "", likeness: "contour" };
const visualFeatureOptions = {
  contour: [
    { id: "angular", label: "利落轮廓" },
    { id: "soft", label: "柔和轮廓" },
    { id: "obscured", label: "被遮掩的轮廓" },
  ],
  gaze: [
    { id: "direct", label: "直视" },
    { id: "side", label: "侧望" },
    { id: "lowered", label: "低垂视线" },
  ],
  atmosphere: [
    { id: "cold", label: "冷白光" },
    { id: "mist", label: "雾中微光" },
    { id: "aged", label: "旧灯暖影" },
  ],
  likeness: [
    { id: "mood", label: "仅保留氛围" },
    { id: "contour", label: "保留轮廓" },
    { id: "expression", label: "保留轮廓与表情节奏" },
  ],
};
const visualFeatureLabels = Object.fromEntries(
  Object.entries(visualFeatureOptions).flatMap(([feature, options]) => options.map((option) => [`${feature}:${option.id}`, option.label])),
);
const worldArchiveStorageKey = "dark-night-worldline-archive-v1";
const expeditionArchiveStorageKey = "dark-night-expedition-archive-v1";
const resonanceInboxStorageKey = "dark-night-resonance-inbox-v1";
const rogueMetaStorageKey = "dark-night-fog-rogue-meta-v1";

const loadWorldlineArchive = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(worldArchiveStorageKey);
    const records = stored ? JSON.parse(stored) : [];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const persistWorldlineArchive = (records) => {
  try {
    window.localStorage.setItem(worldArchiveStorageKey, JSON.stringify(records));
  } catch {
    // The archive is still usable for the current session when storage is unavailable.
  }
};

const loadLocalRecords = (storageKey) => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(storageKey);
    const records = stored ? JSON.parse(stored) : [];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const persistLocalRecords = (storageKey, records) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    // The fictional archive remains available for the current session when storage is unavailable.
  }
};

const loadRogueMeta = () => {
  if (typeof window === "undefined") return { embers: 0, runs: 0, clears: 0 };
  try {
    const stored = JSON.parse(window.localStorage.getItem(rogueMetaStorageKey) ?? "null");
    return stored && typeof stored === "object"
      ? { embers: Number(stored.embers) || 0, runs: Number(stored.runs) || 0, clears: Number(stored.clears) || 0 }
      : { embers: 0, runs: 0, clears: 0 };
  } catch {
    return { embers: 0, runs: 0, clears: 0 };
  }
};

const persistRogueMeta = (meta) => {
  try {
    window.localStorage.setItem(rogueMetaStorageKey, JSON.stringify(meta));
  } catch {
    // Meta progress remains available for the current play session if storage is unavailable.
  }
};
const calculateMbtiResult = (answers) => {
  const scores = { ...emptyMbtiScores };

  mbtiQuestions.forEach((question) => {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
    if (selectedOption) scores[question.dimension] += selectedOption.score;
  });

  const type = mbtiDimensions.map(({ id, positive, negative, tieBreaker }) => {
    if (scores[id] > 0) return positive;
    if (scores[id] < 0) return negative;
    return answers[tieBreaker].startsWith(positive) ? positive : negative;
  }).join("");

  return { type, scores };
};

export function App() {
  const [screen, setScreen] = useState("observe");
  const [hasConsent, setHasConsent] = useState(false);
  const [hasAdultVisualConsent, setHasAdultVisualConsent] = useState(false);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [resultRoute, setResultRoute] = useState("repair");
  const [resultSource, setResultSource] = useState("route");
  const [mbtiType, setMbtiType] = useState("INTJ");
  const [mbtiAnswers, setMbtiAnswers] = useState(emptyMbtiAnswers);
  const [mbtiScores, setMbtiScores] = useState(emptyMbtiScores);
  const [nightChoices, setNightChoices] = useState([]);
  const [expeditionRun, setExpeditionRun] = useState(null);
  const [rogueRun, setRogueRun] = useState(null);
  const [rogueWeapon, setRogueWeapon] = useState("pulsePistol");
  const [rogueMeta, setRogueMeta] = useState(loadRogueMeta);
  const [arenaPaused, setArenaPaused] = useState(false);
  const [arenaPanelOpen, setArenaPanelOpen] = useState(false);
  const [expeditionArchive, setExpeditionArchive] = useState(() => loadLocalRecords(expeditionArchiveStorageKey));
  const [resonanceInbox, setResonanceInbox] = useState(() => loadLocalRecords(resonanceInboxStorageKey));
  const [resonanceInput, setResonanceInput] = useState("");
  const [resonanceMessage, setResonanceMessage] = useState("");
  const [activeParcel, setActiveParcel] = useState(null);
  const [worldlineArchive, setWorldlineArchive] = useState(loadWorldlineArchive);
  const [resonanceEntry, setResonanceEntry] = useState(null);
  const [linkedNightType, setLinkedNightType] = useState("");
  const [fileName, setFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [visualProfile, setVisualProfile] = useState(emptyVisualProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const fileInput = useRef(null);
  const arenaCanvas = useRef(null);
  const rogueControls = useRef({ up: false, down: false, left: false, right: false, dash: false });
  const rogueAim = useRef({ x: arenaSize.width / 2, y: arenaSize.height / 2 });
  const creditedRogueRun = useRef(null);
  const activeRoleplayType = linkedNightType || mbtiType;
  const selectedResident = resultSource === "mbti"
    ? { ...mbtiDossierByType[activeRoleplayType], ...mbtiNarrativeProfiles[activeRoleplayType] }
    : residents[resultRoute];
  const deepReport = resultSource === "mbti" ? mbtiDeepReports[mbtiType] : null;
  const activeNightChapter = resultSource === "mbti" ? nightChapters[activeRoleplayType] : null;
  const nightStageIndex = nightChoices.length;
  const activeNightStage = activeNightChapter?.stages[nightStageIndex] ?? null;
  const activeNightEnding = activeNightChapter && nightChoices.length === activeNightChapter.stages.length
    ? resolveNightEnding(activeNightChapter, nightChoices)
    : null;
  const nightStagePrompt = activeNightStage ? resolveNightStagePrompt(activeNightStage, nightChoices) : "";
  const nightChoiceHistory = activeNightChapter
    ? nightChoices.map((choiceId, index) => activeNightChapter.stages[index]?.choices.find((choice) => choice.id === choiceId)?.label).filter(Boolean)
    : [];
  const nightSceneImage = portableAssetUrl(activeNightChapter?.sceneImage ?? selectedResident.image);
  const currentArtifact = activeNightEnding ? getWorldArtifact(activeRoleplayType, activeNightEnding.status) : null;
  const activeExpeditionNode = expeditionRun ? expeditionNodes[expeditionRun.history.length] ?? null : null;
  const expeditionEnding = expeditionRun && expeditionRun.history.length === expeditionNodes.length
    ? resolveExpeditionEnding(expeditionRun)
    : null;
  const rogueEnding = getArenaResult(rogueRun);
  const rogueProjection = getArenaProjection(mbtiType);
  const worldDistricts = deriveWorldDistricts(expeditionArchive, resonanceInbox);
  const latestExpeditionParcel = activeParcel ?? expeditionArchive[0]?.parcel ?? null;
  const resonanceTarget = resonanceEntry ? mbtiDossierByType[resonanceEntry.target] : null;
  const visualProfileComplete = ["contour", "gaze", "atmosphere"].every((feature) => Boolean(visualProfile[feature]));
  const visualProfileSummary = visualProfileComplete
    ? ["contour", "gaze", "atmosphere", "likeness"].map((feature) => visualFeatureLabels[`${feature}:${visualProfile[feature]}`]).join(" · ")
    : "";
  const mbtiScoreRows = mbtiDimensions.map((dimension, index) => {
    const score = mbtiScores[dimension.id];
    const selectedLetter = mbtiType[index];
    const direction = score > 0 ? dimension.positive : score < 0 ? dimension.negative : selectedLetter;
    const value = score === 0 ? `${direction} 0（同分取第一题偏好）` : `${direction} +${Math.abs(score)}`;
    return { ...dimension, value };
  });

  const beginObservation = () => {
    if (!hasConsent) {
      setScreen("consent");
      return;
    }
    setScreen("choose");
  };

  const chooseFile = () => fileInput.current?.click();

  const requestAnchorPhoto = () => {
    setScreen("consent");
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setFileName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setVisualProfile(emptyVisualProfile);
    setScreen("visualProfile");
  };

  const chooseVisualFeature = (feature, value) => {
    setVisualProfile((current) => ({ ...current, [feature]: value }));
  };

  const chooseAnswer = (questionId, route) => {
    setAnswers((current) => ({ ...current, [questionId]: route }));
  };

  const chooseMbtiAnswer = (questionId, value) => {
    setMbtiAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const resolveRoute = () => {
    const primaryRoutes = ["repair", "guide", "archive", "patrol", "market"];
    const scores = Object.fromEntries(primaryRoutes.map((route) => [route, 0]));
    Object.values(answers).forEach((route) => {
      if (primaryRoutes.includes(route)) scores[route] += 1;
    });
    const highestScore = Math.max(...Object.values(scores));
    const tiedRoutes = Object.keys(scores).filter((route) => scores[route] === highestScore);
    const primaryRoute = tiedRoutes.includes(answers.corridor) ? answers.corridor : tiedRoutes[0];
    const alternateResidents = {
      repair: "post",
      guide: "platform",
      archive: "lost",
      patrol: "switch",
      market: "umbrella",
    };
    return answers.signal === "alternate" ? alternateResidents[primaryRoute] : primaryRoute;
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const allQuestionsAnswered = answeredCount === questions.length;
  const mbtiAnsweredCount = Object.values(mbtiAnswers).filter(Boolean).length;
  const allMbtiQuestionsAnswered = mbtiAnsweredCount === mbtiQuestions.length;

  const generateRecord = () => {
    if (!allQuestionsAnswered) return;
    setResultRoute(resolveRoute());
    setResultSource("route");
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setSaveState("idle");
      setScreen("record");
    }, 1450);
  };

  const generateMbtiRecord = () => {
    if (!allMbtiQuestionsAnswered) return;
    const result = calculateMbtiResult(mbtiAnswers);
    setMbtiType(result.type);
    setMbtiScores(result.scores);
    setResultSource("mbti");
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setSaveState("idle");
      setScreen("record");
    }, 1050);
  };

  const beginNightShift = () => {
    if (!activeNightChapter) return;
    setLinkedNightType("");
    setNightChoices([]);
    setScreen("nightShift");
  };

  const openExpeditionBriefing = () => {
    if (resultSource !== "mbti") return;
    setLinkedNightType("");
    setExpeditionRun(null);
    setScreen("expeditionBriefing");
  };

  const startExpedition = () => {
    setExpeditionRun(createExpeditionRun(mbtiType));
    setScreen("expedition");
  };

  const chooseExpeditionPath = (choice) => {
    if (!expeditionRun || !activeExpeditionNode || expeditionEnding) return;
    setExpeditionRun((current) => applyExpeditionChoice(current, activeExpeditionNode, choice));
  };

  const replayExpedition = () => {
    setExpeditionRun(createExpeditionRun(mbtiType));
    setScreen("expedition");
  };

  const openRogueBriefing = () => {
    if (resultSource !== "mbti") return;
    setLinkedNightType("");
    setRogueRun(null);
    setArenaPaused(false);
    setArenaPanelOpen(false);
    setScreen("rogueBriefing");
  };

  const startRogueRun = () => {
    creditedRogueRun.current = null;
    rogueControls.current = { up: false, down: false, left: false, right: false, dash: false };
    rogueAim.current = { x: arenaSize.width / 2, y: arenaSize.height / 2 };
    setArenaPaused(false);
    setArenaPanelOpen(false);
    setRogueRun(createArenaRun(mbtiType, rogueWeapon, rogueMeta));
    setScreen("rogueArena");
  };

  const chooseRogueUpgrade = (upgradeId) => {
    setRogueRun((current) => current ? chooseArenaUpgrade(current, upgradeId) : current);
  };

  const chooseRogueEvent = (choiceId) => {
    setRogueRun((current) => current ? chooseArenaEvent(current, choiceId) : current);
  };

  const buyRogueShopItem = (itemId) => {
    setRogueRun((current) => current ? buyArenaShopItem(current, itemId) : current);
  };

  const leaveRogueShop = () => {
    setRogueRun((current) => current ? leaveArenaShop(current) : current);
  };

  const replayRogueRun = () => {
    startRogueRun();
  };

  const setRogueControl = (control, active) => {
    rogueControls.current = { ...rogueControls.current, [control]: active };
  };

  const queueRogueDash = () => {
    rogueControls.current = { ...rogueControls.current, dash: true };
  };

  const updateRogueAim = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    rogueAim.current = {
      x: clamp((event.clientX - bounds.left) * arenaSize.width / bounds.width, 0, arenaSize.width),
      y: clamp((event.clientY - bounds.top) * arenaSize.height / bounds.height, 0, arenaSize.height),
    };
  };

  const openWorldMap = () => {
    setResonanceMessage("");
    setScreen("worldMap");
  };

  const archiveExpedition = () => {
    if (!expeditionRun || !expeditionEnding) return;
    const parcel = buildResonanceParcel(expeditionRun, expeditionEnding);
    if (!parcel) return;
    const entry = {
      id: parcel.code,
      status: expeditionEnding.status,
      title: expeditionEnding.title,
      supplies: expeditionRun.supplies,
      history: expeditionRun.history,
      parcel,
      createdAt: parcel.createdAt,
    };
    setExpeditionArchive((current) => {
      const updated = [entry, ...current.filter((record) => record.id !== entry.id)].slice(0, 24);
      persistLocalRecords(expeditionArchiveStorageKey, updated);
      return updated;
    });
    setActiveParcel(parcel);
    setResonanceMessage("远征已归档。残响码只记录虚构路线符号。");
    setScreen("worldMap");
  };

  const receiveResonanceParcel = () => {
    const parcel = parseResonanceCode(resonanceInput);
    if (!parcel) {
      setResonanceMessage("无法辨认该残响码。格式示例：WH-R-AABC。");
      return;
    }
    setResonanceInbox((current) => {
      const updated = [parcel, ...current.filter((entry) => entry.code !== parcel.code)].slice(0, 32);
      persistLocalRecords(resonanceInboxStorageKey, updated);
      return updated;
    });
    setResonanceInput("");
    setResonanceMessage("已收到一封来自雾港的虚构来信。地图出现了新的标记。");
  };

  const copyResonanceCode = async () => {
    if (!latestExpeditionParcel) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard?.writeText(latestExpeditionParcel.code);
      setResonanceMessage("残响码已复制，可发给朋友导入。");
    } catch {
      setResonanceMessage(`请手动复制：${latestExpeditionParcel.code}`);
    }
  };

  const chooseNightPath = (choiceId) => {
    if (!activeNightChapter || !activeNightStage || activeNightEnding) return;
    setNightChoices((current) => [...current, choiceId]);
  };

  const openWorldlineArchive = () => {
    setResonanceEntry(null);
    setScreen("worldArchive");
  };

  const saveWorldline = () => {
    if (!activeNightEnding || !currentArtifact) return;
    const worldData = worldArchiveData[activeRoleplayType];
    const entryKey = `${activeRoleplayType}-${activeNightEnding.status}-${nightChoices.join(".")}`;
    const entry = {
      id: entryKey,
      type: activeRoleplayType,
      residentName: selectedResident.name,
      status: activeNightEnding.status,
      artifact: currentArtifact,
      target: worldData.target,
      link: worldData.link,
      nextNight: worldData.nextNight,
      conclusion: activeNightEnding.conclusion,
      pathLog: activeNightEnding.pathLog,
      createdAt: new Date().toISOString(),
    };
    setWorldlineArchive((current) => {
      const updated = [entry, ...current.filter((record) => record.id !== entryKey)].slice(0, 32);
      persistWorldlineArchive(updated);
      return updated;
    });
    setLinkedNightType("");
    openWorldlineArchive();
  };

  const openResonance = (entry) => {
    setResonanceEntry(entry);
    setScreen("resonance");
  };

  const startLinkedNight = (entry) => {
    setLinkedNightType(entry.target);
    setResultSource("mbti");
    setNightChoices([]);
    setRogueRun(null);
    setExpeditionRun(null);
    setScreen("nightShift");
  };

  const returnToRecord = () => {
    setLinkedNightType("");
    setArenaPaused(false);
    setArenaPanelOpen(false);
    setScreen("record");
  };

  const restart = () => {
    setScreen("observe");
    setFileName("");
    setHasConsent(false);
    setHasAdultVisualConsent(false);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview("");
    setVisualProfile(emptyVisualProfile);
    setAnswers(emptyAnswers);
    setMbtiAnswers(emptyMbtiAnswers);
    setMbtiScores(emptyMbtiScores);
    setNightChoices([]);
    setRogueRun(null);
    setArenaPaused(false);
    setArenaPanelOpen(false);
    setLinkedNightType("");
    setResonanceEntry(null);
    setActiveParcel(null);
    setResonanceInput("");
    setResonanceMessage("");
    setResultRoute("repair");
    setResultSource("route");
    setSaveState("idle");
  };

  const saveGeneratedPhoto = async () => {
    const imageSlug = selectedResident.slug ?? `mbti-${mbtiType.toLowerCase()}`;
    const filename = `暗夜图鉴-${imageSlug}-无文字原图.png`;
    const residentImageUrl = portableAssetUrl(selectedResident.image);

    try {
      const response = await fetch(residentImageUrl);
      const blob = await response.blob();
      const imageFile = new File([blob], filename, { type: blob.type || "image/png" });

      if (navigator.canShare?.({ files: [imageFile] })) {
        await navigator.share({ files: [imageFile] });
        setSaveState("saved");
        return;
      }

      const download = document.createElement("a");
      download.href = residentImageUrl;
      download.download = filename;
      document.body.appendChild(download);
      download.click();
      download.remove();
      setSaveState("saved");
    } catch (error) {
      if (error?.name !== "AbortError") {
        const download = document.createElement("a");
        download.href = residentImageUrl;
        download.download = filename;
        document.body.appendChild(download);
        download.click();
        download.remove();
        setSaveState("saved");
      }
    }
  };

  useEffect(() => {
    drawArena(arenaCanvas.current, rogueRun, rogueAim.current);
  }, [rogueRun]);

  useEffect(() => {
    if (screen !== "rogueArena" || rogueRun?.phase !== "running") return undefined;
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const controlMap = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
      if (controlMap[key]) {
        event.preventDefault();
        setRogueControl(controlMap[key], true);
      }
      if (event.code === "Space") {
        event.preventDefault();
        queueRogueDash();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        setArenaPanelOpen(true);
        setArenaPaused(true);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setArenaPaused((current) => !current);
      }
    };
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const controlMap = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
      if (controlMap[key]) setRogueControl(controlMap[key], false);
    };
    const timer = window.setInterval(() => {
      if (arenaPaused) return;
      const input = { ...rogueControls.current, aim: rogueAim.current };
      rogueControls.current = { ...rogueControls.current, dash: false };
      setRogueRun((current) => current ? advanceArenaRun(current, input, .05) : current);
    }, 50);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [screen, rogueRun?.phase, arenaPaused]);

  useEffect(() => {
    const result = getArenaResult(rogueRun);
    if (!result || creditedRogueRun.current === rogueRun?.seed) return;
    creditedRogueRun.current = rogueRun?.seed;
    setRogueMeta((current) => {
      const updated = {
        embers: Math.min(30, current.embers + result.embers),
        runs: current.runs + 1,
        clears: current.clears + (rogueRun?.phase === "cleared" ? 1 : 0),
      };
      persistRogueMeta(updated);
      return updated;
    });
  }, [rogueRun?.phase]);

  return (
    <main className="mobile-prototype" aria-live="polite">
      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {screen === "observe" && (
        <section className="screen observe-screen">
          <img className="scene-image" src={portableAssetUrl("/assets/expressive-bloodline-maintainer.png")} alt="雨夜地铁站内工作的彼界维修员" />
          <div className="scene-shade" />
          <header className="topbar">
            <button className="icon-button" aria-label="打开雾港世界线地图" onClick={openWorldMap}>
              <MapPin size={22} weight="bold" />
            </button>
            <div className="wordmark">暗夜图鉴相机</div>
            <button className="icon-button" aria-label="查看说明" onClick={() => setInfoOpen(true)}>
              <Info size={23} weight="bold" />
            </button>
          </header>

          <div className="route-badge"><MapPin size={14} weight="fill" /> 都市异体</div>
          <img className="observation-overlay" src={portableAssetUrl("/assets/observation-overlay.png")} alt="" aria-hidden="true" />

          <div className="observe-copy">
            <span className="eyebrow"><span className="signal-dot" /> 彼界目击 · 07 号维修区</span>
            <h1>血线维修员</h1>
            <p>它正在替末班列车接回断开的黑色线缆。</p>
            <button className="mbti-entry" onClick={() => setScreen("mbti")}><Archive size={16} weight="duotone" /> 开始 MBTI 场景问卷</button>
          </div>

          <div className="camera-dock">
            <button className="gallery-button" onClick={requestAnchorPhoto} aria-label="从相册上传锚点照片">
              <ImageSquare size={25} weight="duotone" />
            </button>
            <button className="shutter" onClick={beginObservation} aria-label="开始观测">
              <Camera size={40} weight="fill" />
            </button>
            <button className="gallery-button" onClick={() => setScreen("mbti")} aria-label="开始 MBTI 场景问卷" title="MBTI 场景问卷">
              <Archive size={24} weight="duotone" />
            </button>
            <span className="shutter-label">开始观测</span>
          </div>
        </section>
      )}

      {screen === "consent" && (
        <section className="screen sheet-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="潮湿的彼界隧道" />
          <div className="sheet-shade" />
          <div className="sheet-card">
            <button className="back-control" onClick={() => setScreen("observe")}><ArrowLeft size={20} /> 返回</button>
            <span className="eyebrow"><ShieldCheck size={15} weight="fill" /> 观测守则</span>
            <h2>先确认锚点归属</h2>
            <p>我们只将你拥有或已获得明确同意的照片，用作虚构彼界叙事的观测入口。</p>
            <label className="consent-row">
              <input type="checkbox" checked={hasConsent} onChange={(event) => setHasConsent(event.target.checked)} />
              <span>我拥有此照片，或已获得照片中所有人的同意。</span>
            </label>
            <label className="consent-row compact-consent">
              <input type="checkbox" checked={hasAdultVisualConsent} onChange={(event) => setHasAdultVisualConsent(event.target.checked)} />
              <span>照片中的人均为成年人，并同意以面容轮廓作为虚构角色的视觉参考。</span>
            </label>
            <p className="muted-copy"><WarningCircle size={16} /> 不进行颜值、面相或人格判断；生成内容为虚构故事。</p>
            <button className="primary-button" disabled={!hasConsent || !hasAdultVisualConsent} onClick={chooseFile}>
              <ImageSquare size={20} weight="fill" /> 选择锚点照片
            </button>
            <button className="quiet-button" disabled={!hasConsent} onClick={() => setScreen("choose")}>
              先使用演示锚点 <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </section>
      )}

      {screen === "visualProfile" && (
        <section className="screen choose-screen visual-profile-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="潮湿的彼界隧道" />
          <div className="sheet-shade" />
          <div className="chooser visual-profile-chooser">
            <button className="back-control light" onClick={() => setScreen("consent")}><ArrowLeft size={20} /> 返回照片确认</button>
            <span className="eyebrow"><ImageSquare size={15} weight="fill" /> 用户确认的视觉观测</span>
            <h2>标记将被保留的面容线索</h2>
            <div className="anchor-preview">
              <img src={photoPreview} alt="已选且获同意的锚点照片预览" />
              <div><strong>{fileName}</strong><span>只在当前设备会话中作为视觉锚点，不用于人格判断。</span></div>
            </div>
            <p>由你确认轮廓、视线与光感。它们只用于为彼界角色编写视觉依据；MBTI 仍只由场景问卷决定。</p>

            <div className="visual-feature-stack">
              {[
                ["contour", "轮廓印象"],
                ["gaze", "视线节奏"],
                ["atmosphere", "照片光感"],
                ["likeness", "角色保留程度"],
              ].map(([feature, label]) => (
                <fieldset className="visual-feature-group" key={feature}>
                  <legend>{label}</legend>
                  <div className="visual-option-grid">
                    {visualFeatureOptions[feature].map((option) => (
                      <button
                        key={option.id}
                        className={visualProfile[feature] === option.id ? "choice selected" : "choice"}
                        onClick={() => chooseVisualFeature(feature, option.id)}
                        aria-pressed={visualProfile[feature] === option.id}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="visual-boundary"><ShieldCheck size={17} weight="fill" /> 不读取或推断身份、种族、健康、情绪、性格与 MBTI；未成年人不进入此面容相似流程。</div>
            <button className="primary-button" disabled={!visualProfileComplete} onClick={() => setScreen("choose")}>
              <Crosshair size={20} weight="bold" /> 带着观测依据进入彼界
            </button>
          </div>
        </section>
      )}

      {screen === "choose" && (
        <section className="screen choose-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="潮湿的彼界隧道" />
          <div className="sheet-shade" />
          <div className="chooser">
            <button className="back-control light" onClick={() => setScreen("observe")}><ArrowLeft size={20} /> 重选</button>
            <span className="eyebrow"><Sparkle size={15} weight="fill" /> 锚点已接入 · 彼界心境问卷</span>
            <h2>{fileName ? "让这张照片遇见彼界居民" : "为演示锚点选择相遇路线"}</h2>
            <p>按直觉完成四道情境选择。答案只用于分配虚构居民与画面，不构成心理测评或人格判断。</p>

            <div className="question-stack">
              {questions.map((question, index) => (
                <fieldset className="quiz-question" key={question.id}>
                  <legend><span>{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                  <div className="question-options">
                    {question.options.map((option) => (
                      <button
                        key={option.route}
                        className={answers[question.id] === option.route ? "choice selected" : "choice"}
                        onClick={() => chooseAnswer(question.id, option.route)}
                        aria-pressed={answers[question.id] === option.route}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="quiz-progress"><MapPin size={17} weight="fill" /><span>已标记 {answeredCount}/{questions.length} 道心境路标</span></div>
            <button className="primary-button" disabled={!allQuestionsAnswered} onClick={generateRecord}>
              <Crosshair size={20} weight="bold" /> 分配彼界图鉴
            </button>
          </div>
        </section>
      )}

      {screen === "mbti" && (
        <section className="screen choose-screen mbti-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="潮湿的彼界隧道" />
          <div className="sheet-shade" />
          <div className="chooser mbti-chooser">
            <button className="back-control light" onClick={() => setScreen("observe")}><ArrowLeft size={20} /> 返回观测</button>
            <span className="eyebrow"><Archive size={15} weight="fill" /> 场景问卷 · 16 型人格投影</span>
            <h2>回答十六道彼界情境题</h2>
            <p>每道题记录你的当下偏好，并据此匹配一个 MBTI 风格的虚构居民。结果仅用于叙事体验，不是心理诊断或正式测评，也不会使用照片内容。</p>

            <div className="question-stack mbti-question-stack">
              {mbtiQuestions.map((question, index) => (
                <fieldset className="quiz-question" key={question.id}>
                  <legend><span>{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                  <div className="question-options">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        className={mbtiAnswers[question.id] === option.id ? "choice selected" : "choice"}
                        onClick={() => chooseMbtiAnswer(question.id, option.id)}
                        aria-pressed={mbtiAnswers[question.id] === option.id}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mbti-preview">
              <span className="eyebrow"><span className="signal-dot" /> 问卷进度 {mbtiAnsweredCount}/{mbtiQuestions.length}</span>
              <strong>类型会在最后一题后揭示</strong>
              <span>每个维度由四道题按 ±1 / ±2 累计；同分时使用该维度的第一题作为偏好参考。</span>
            </div>
            <button className="primary-button" disabled={!allMbtiQuestionsAnswered} onClick={generateMbtiRecord}>
              <Crosshair size={20} weight="bold" /> 根据答案生成人格图鉴
            </button>
          </div>
        </section>
      )}

      {isGenerating && (
        <section className="loading-layer" role="status">
          <img className="loading-image" src={portableAssetUrl(selectedResident.image)} alt="" />
          <div className="loading-shade" />
          <div className="loading-copy"><Crosshair size={32} weight="light" /><strong>{resultSource === "mbti" ? "正在编录人格投影" : "正在校准彼界坐标"}</strong><span>{resultSource === "mbti" ? "正在打开这名居民所在的平行夜班…" : "正在为你寻找同一路线的夜班居民…"}</span></div>
        </section>
      )}

      {screen === "record" && !isGenerating && (
        <section className="screen record-screen">
          <img className="record-image" src={portableAssetUrl(selectedResident.image)} alt={`${selectedResident.name}的目击记录`} />
          <div className="record-shade" />
          <div className="record-top"><span>{resultSource === "mbti" ? "人格投影 · 私密档案" : "彼界目击 · 私密档案"}</span><button className="icon-button" onClick={() => setInfoOpen(true)} aria-label="查看故事说明"><Info size={22} weight="bold" /></button></div>
          <article className="dossier">
            <span className="eyebrow"><span className="signal-dot" /> {selectedResident.level}</span>
            <h2>{selectedResident.name}</h2>
            <p className="relationship">{resultSource === "mbti" ? `问卷倾向结果：${mbtiType}` : `心境路标指向：${selectedResident.route}`}</p>
            <p>{selectedResident.story}</p>
            {resultSource === "route" && photoPreview && visualProfileSummary && (
              <section className="visual-observation" aria-label="照片观测依据">
                <img src={photoPreview} alt="本次观测使用的锚点照片缩略图" />
                <div>
                  <span>照片观测依据</span>
                  <strong>{visualProfileSummary}</strong>
                  <p>由用户确认的视觉线索已写入虚构居民档案；不用于人格、身份或外貌优劣判断。</p>
                </div>
              </section>
            )}
            {resultSource === "mbti" && (
              <section className="personality-thread" aria-label="这名居民的性格投影">
                <span className="thread-label">这名居民的性格投影</span>
                <div className="trait-chips">
                  {selectedResident.traits.map((trait) => <span key={trait}>{trait}</span>)}
                </div>
                <p><strong>异化表现：</strong>{selectedResident.manifestation}</p>
                <p><strong>夜班习惯：</strong>{selectedResident.workRhythm}</p>
                <button className="deep-report-button" onClick={() => setScreen("deepReport")}>
                  <Archive size={16} weight="duotone" /> 阅读完整人格投影
                </button>
                {activeNightChapter && (
                  <button className="night-shift-button" onClick={beginNightShift}>
                    <Sparkle size={16} weight="fill" /> 进入{selectedResident.name}的第一夜
                  </button>
                )}
                <button className="expedition-button" onClick={openExpeditionBriefing}>
                  <MapPin size={16} weight="fill" /> 进入雾港远征 · 生存试玩
                </button>
                <button className="rogue-button" onClick={openRogueBriefing}>
                  <Crosshair size={16} weight="bold" /> 雾港清障 · 肉鸽试行
                </button>
              </section>
            )}
            <dl>
              <div><dt>栖息地</dt><dd>{selectedResident.habitat}</dd></div>
              <div><dt>禁忌</dt><dd>{selectedResident.taboo}</dd></div>
              {resultSource === "mbti" && <div><dt>视觉支系</dt><dd>{selectedResident.visualStyle}</dd></div>}
            </dl>
            <div className="fiction-note"><ShieldCheck size={17} weight="fill" /> {resultSource === "mbti" ? "问卷驱动的虚构投影，不构成心理评估。" : "虚构彼界叙事，不代表现实判断。"}</div>
          </article>
          <div className="record-actions">
            <button className="secondary-button" onClick={restart}>重新观测</button>
            <button
              className={saveState === "saved" ? "primary-button compact saved-download" : "primary-button compact"}
              onClick={saveGeneratedPhoto}
            >
              <DownloadSimple size={19} weight="bold" /> {saveState === "saved" ? "无文字原图已保存" : "保存无文字原图"}
            </button>
          </div>
        </section>
      )}

      {screen === "nightShift" && activeNightChapter && (
        <section className="screen night-shift-screen">
          <img className="night-scene-image" src={nightSceneImage} alt={`${selectedResident.name}在彼界执行夜班`} />
          <div className="night-scene-shade" />
          <div className="night-header">
            <button className="back-control night-back" onClick={linkedNightType ? openWorldlineArchive : returnToRecord}><ArrowLeft size={20} /> {linkedNightType ? "返回档案馆" : "返回图鉴"}</button>
            <span>{activeNightChapter.title}</span>
            <span>{activeNightChapter.time}</span>
          </div>
          <div className="night-status" aria-label="彼界夜班进度"><Sparkle size={16} weight="fill" /><span>夜班进度</span><strong>{activeNightEnding ? activeNightEnding.status : `${nightStageIndex + 1} / ${activeNightChapter.stages.length}`}</strong></div>

          <article className="dialogue-panel">
            {!activeNightEnding ? (
              <>
                <span className="speaker-tag">{selectedResident.name} · {activeNightStage.title}</span>
                <p>{nightStagePrompt}</p>
                <p className="night-rule"><strong>今夜守则：</strong>{activeNightChapter.rule}</p>
                {nightChoiceHistory.length > 0 && <div className="night-history" aria-label="已做出的夜班选择"><span>已执行</span>{nightChoiceHistory.map((choice) => <em key={choice}>{choice}</em>)}</div>}
                <div className="dialogue-choices">
                  {activeNightStage.choices.map((choice) => (
                    <button key={choice.id} onClick={() => chooseNightPath(choice.id)}>
                      <span><strong>{choice.label}</strong><small>{choice.detail}</small></span>
                      <CaretRight size={18} weight="bold" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="speaker-tag">{activeNightEnding.title}</span>
                <p>{activeNightEnding.copy}</p>
                <div className="night-outcome-row"><span>{activeNightEnding.time}</span><strong>{activeNightEnding.relation}</strong></div>
                <p className="night-ending-conclusion">{activeNightEnding.conclusion}</p>
                <button className="night-primary-action" onClick={() => setScreen("nightComplete")}>展开本次路径推演 <Archive size={18} weight="duotone" /></button>
              </>
            )}
          </article>
        </section>
      )}

      {screen === "nightComplete" && activeNightEnding && activeNightChapter && (
        <section className="screen night-complete-screen">
          <img className="night-scene-image" src={nightSceneImage} alt={`${selectedResident.name}的第一夜记录`} />
          <div className="night-scene-shade" />
          <article className="night-log-card">
            <span className="eyebrow"><Archive size={15} weight="fill" /> 彼界夜班簿 · 已归档</span>
            <h2>{activeNightEnding.title}</h2>
            <p className="night-log-meta">{activeNightEnding.time} · {activeNightEnding.relation}</p>
            <p>{activeNightEnding.copy}</p>
            <p>{activeNightEnding.record}</p>
            <div className="night-history night-log-history"><span>本次路径</span>{nightChoiceHistory.map((choice) => <em key={choice}>{choice}</em>)}</div>
            <section className="ending-debrief" aria-label="本次结局推演">
              <span>结局推演</span>
              <p>{activeNightEnding.conclusion}</p>
              <ol className="ending-path-log">
                {activeNightEnding.pathLog.map((step) => (
                  <li key={step.stage}>
                    <span>{step.stage}</span>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                    <em>{step.signal}</em>
                  </li>
                ))}
              </ol>
            </section>
            <p className="night-log-note">这是 {activeRoleplayType}「{selectedResident.name}」的四段式第一夜。结局只属于虚构角色与彼界世界，不指向现实用户。</p>
            <button className="worldline-button" onClick={saveWorldline}><Archive size={19} weight="duotone" /> 收入世界线档案馆</button>
            <button className="primary-button" onClick={linkedNightType ? openWorldlineArchive : returnToRecord}><Archive size={19} weight="duotone" /> {linkedNightType ? "返回世界线档案馆" : "返回人物图鉴"}</button>
            <button className="quiet-button" onClick={beginNightShift}>重新游玩这一夜 <CaretRight size={16} weight="bold" /></button>
          </article>
        </section>
      )}

      {screen === "expeditionBriefing" && resultSource === "mbti" && (
        <section className="screen expedition-screen expedition-briefing-screen">
          <img className="night-scene-image" src={portableAssetUrl(selectedResident.image)} alt="雾港末班车远征入口" />
          <div className="night-scene-shade expedition-shade" />
          <div className="night-header">
            <button className="back-control night-back" onClick={returnToRecord}><ArrowLeft size={20} /> 返回图鉴</button>
            <span>彼界生存试行协议</span>
            <span>单人 · 本地记录</span>
          </div>
          <article className="expedition-card">
            <span className="eyebrow"><MapPin size={15} weight="fill" /> 异界轮班远征 · 第一章</span>
            <h2>{expeditionTitle}</h2>
            <p>你将以「{mbtiType} · {selectedResident.name}」的虚构夜班投影进入雾港。连续穿过四个节点，管理体力、清醒与异化，并把能被追溯的证物带回晨车。</p>
            <div className="expedition-boundary"><ShieldCheck size={16} weight="fill" /> 这里的能力仅是问卷驱动的虚构叙事技法，不评价、诊断或定义现实中的你。</div>
            <section className="expedition-gift-list" aria-label="本次远征的夜班技法">
              <span>本次夜班技法</span>
              {createExpeditionRun(mbtiType).gifts.map((gift) => (
                <div key={gift.label}><strong>{gift.label}</strong><p>{gift.detail}</p></div>
              ))}
            </section>
            <div className="expedition-brief-stats">
              <span>体力 3</span><span>清醒 3</span><span>异化 0</span>
            </div>
            <button className="night-primary-action" onClick={startExpedition}>领取夜班牌，进入雾港 <CaretRight size={18} weight="bold" /></button>
          </article>
        </section>
      )}

      {screen === "expedition" && expeditionRun && (
        <section className="screen expedition-screen">
          <img className="night-scene-image" src={portableAssetUrl(selectedResident.image)} alt="雾港末班车夜间远征" />
          <div className="night-scene-shade expedition-shade" />
          <div className="night-header">
            <button className="back-control night-back" onClick={returnToRecord}><ArrowLeft size={20} /> 暂离远征</button>
            <span>{expeditionTitle}</span>
            <span>{expeditionEnding ? expeditionEnding.status : `${expeditionRun.history.length + 1} / ${expeditionNodes.length}`}</span>
          </div>
          <div className="expedition-map" aria-label="雾港远征地图">
            {expeditionNodes.map((node, index) => (
              <span
                className={index < expeditionRun.history.length ? "complete" : index === expeditionRun.history.length ? "active" : "locked"}
                key={node.id}
                title={node.title}
              >{index + 1}</span>
            ))}
          </div>
          <article className="expedition-card expedition-play-card">
            <div className="expedition-stat-grid" aria-label="远征状态">
              <div><span>体力</span><strong>{expeditionRun.stamina}/5</strong></div>
              <div><span>清醒</span><strong>{expeditionRun.clarity}/5</strong></div>
              <div className={expeditionRun.drift >= 3 ? "danger" : ""}><span>异化</span><strong>{expeditionRun.drift}/5</strong></div>
              <div><span>归还印记</span><strong>{expeditionRun.seals}</strong></div>
            </div>
            {expeditionRun.supplies.length > 0 && <div className="expedition-supplies"><span>携带证物</span>{expeditionRun.supplies.map((supply) => <em key={supply}>{supply}</em>)}</div>}

            {!expeditionEnding && activeExpeditionNode ? (
              <>
                <span className="speaker-tag">{activeExpeditionNode.location} · {activeExpeditionNode.title}</span>
                <p className="expedition-prompt">{activeExpeditionNode.prompt}</p>
                <p className="night-rule"><strong>当前守则：</strong>{activeExpeditionNode.rule}</p>
                {expeditionRun.history.length > 0 && <div className="night-history expedition-history"><span>已穿过</span>{expeditionRun.history.map((entry) => <em key={entry.nodeId}>{entry.title}</em>)}</div>}
                <div className="dialogue-choices">
                  {activeExpeditionNode.choices.map((choice) => (
                    <button key={choice.id} onClick={() => chooseExpeditionPath(choice)}>
                      <span><strong>{choice.label}</strong><small>{choice.detail}</small></span>
                      <CaretRight size={18} weight="bold" />
                    </button>
                  ))}
                </div>
              </>
            ) : expeditionEnding ? (
              <>
                <span className={`speaker-tag expedition-ending-tag ${expeditionEnding.status === "失联" ? "lost" : ""}`}>{expeditionEnding.title}</span>
                <p className="expedition-prompt">{expeditionEnding.summary}</p>
                <p className="night-ending-conclusion">{expeditionEnding.returnNote}</p>
                <ol className="expedition-log" aria-label="本次远征记录">
                  {expeditionRun.history.map((entry, index) => (
                    <li key={entry.nodeId}><span>节点 {index + 1} · {entry.location}</span><strong>{entry.label}</strong><p>{entry.outcome}</p>{entry.triggeredGifts.length > 0 && <em>投影技法触发：{entry.triggeredGifts.join("、")}</em>}</li>
                  ))}
                </ol>
                <button className="worldline-button" onClick={archiveExpedition}><Archive size={19} weight="duotone" /> 归档远征并封装残响</button>
                <button className="night-primary-action" onClick={replayExpedition}>保留线索，重开世界线 <Sparkle size={18} weight="fill" /></button>
              </>
            ) : null}
          </article>
        </section>
      )}

      {screen === "rogueBriefing" && resultSource === "mbti" && (
        <section className="screen rogue-screen rogue-briefing-screen">
          <img className="night-scene-image" src={portableAssetUrl(selectedResident.image)} alt={`${selectedResident.name}的雾港清障入口`} />
          <div className="night-scene-shade rogue-shade" />
          <div className="night-header">
            <button className="back-control night-back" onClick={returnToRecord}><ArrowLeft size={20} /> 返回图鉴</button>
            <span>雾港清障试行协议</span>
            <span>单人 · 可重复世界线</span>
          </div>
          <article className="rogue-card">
            <span className="eyebrow"><Crosshair size={15} weight="bold" /> 肉鸽清障 · 第一批次</span>
            <h2>把这名居民送进会反击的雾里。</h2>
            <p>本局主角是「{mbtiType} · {selectedResident.name}」这名虚构彼界居民，而不是现实中的你。每次进入都会抽取不同的异常序列与证物，失败只会中断本条虚构世界线。</p>
            <div className="expedition-boundary"><ShieldCheck size={16} weight="fill" /> 问卷只决定叙事投影的起始技法；它不代表现实中的能力、性格强度或对抗倾向。</div>
            <section className="rogue-projection">
              <span>本局清障投影</span>
              <strong>{rogueProjection.label}</strong>
              {rogueProjection.perks.map((perk) => <p key={perk.label}>{perk.label}：{perk.description}</p>)}
            </section>
            <section className="arena-weapon-picker" aria-label="选择初始武器">
              <span>选择主武器</span>
              {arenaWeapons.map((weapon) => <button className={rogueWeapon === weapon.id ? "selected" : ""} key={weapon.id} onClick={() => setRogueWeapon(weapon.id)}><strong>{weapon.name}</strong><small>{weapon.description}</small></button>)}
            </section>
            <div className="rogue-rule-grid"><span>实时刷怪与闪避</span><span>升级三选一构筑</span><span>事件、商店与 Boss</span></div>
            <p className="arena-meta-note">局外余烬：{rogueMeta.embers} · 已完成 {rogueMeta.clears} 局。余烬最多提供 +15 起始状态，不会形成数值碾压。</p>
            <button className="night-primary-action" onClick={startRogueRun}>领取清障牌，进入雾港 <CaretRight size={18} weight="bold" /></button>
          </article>
        </section>
      )}

      {screen === "rogueLegacy" && rogueRun && (
        <section className="screen rogue-screen">
          <img className="night-scene-image" src={portableAssetUrl(selectedResident.image)} alt={`${selectedResident.name}正在雾港清障`} />
          <div className="night-scene-shade rogue-shade" />
          <div className="night-header">
            <button className="back-control night-back" onClick={returnToRecord}><ArrowLeft size={20} /> 暂离清障</button>
            <span>雾港清障 · {mbtiType}</span>
            <span>{rogueEnding ? "交班结算" : `${rogueRun.floor + 1} / ${rogueRun.enemyPath.length}`}</span>
          </div>
          <div className="rogue-map" aria-label="雾港清障节点">
            {rogueRun.enemyPath.map((enemy, index) => <span className={index < rogueRun.floor ? "complete" : index === rogueRun.floor && !rogueEnding ? "active" : "locked"} key={enemy.id}>{index + 1}</span>)}
          </div>
          <article className="rogue-card rogue-play-card">
            <div className="rogue-stat-grid" aria-label="清障状态">
              <div><span>状态</span><strong>{rogueRun.hp}/{rogueRun.maxHp}</strong></div>
              <div><span>专注</span><strong>{rogueRun.focus}/5</strong></div>
              <div><span>护持</span><strong>{rogueRun.ward}</strong></div>
              <div><span>证物</span><strong>{rogueRun.relics.length}</strong></div>
            </div>
            {rogueRun.relics.length > 0 && <div className="rogue-relics"><span>已装配证物</span>{rogueRun.relics.map((relic) => <em key={relic.id}>{relic.label}</em>)}</div>}

            {rogueRun.phase === "battle" && activeRogueEnemy && (
              <>
                <span className="speaker-tag rogue-enemy-tag">{activeRogueEnemy.title} · 异常完整度 {activeRogueEnemy.currentHp}/{activeRogueEnemy.hp}</span>
                <h2 className="rogue-enemy-name">{activeRogueEnemy.name}</h2>
                <p className="expedition-prompt">{activeRogueEnemy.note}</p>
                <div className="rogue-action-grid">
                  <button onClick={() => takeRogueAction("strike")}><strong>清障压制</strong><small>直接压低异常完整度；专注达到 4 时伤害提高。</small></button>
                  <button onClick={() => takeRogueAction("inspect")}><strong>观察回声</strong><small>记录该异常，并积累专注与护持。</small></button>
                  <button disabled={rogueRun.focus === 0} onClick={() => takeRogueAction("seal")}><strong>展开封存线</strong><small>{rogueRun.focus === 0 ? "专注不足，暂时无法封存。" : "消耗 1 点专注，抵御下一次反扑。"}</small></button>
                </div>
              </>
            )}

            {rogueRun.phase === "reward" && (
              <>
                <span className="speaker-tag">节点清理完成 · 选择一份证物</span>
                <p className="expedition-prompt">异常被写回站务系统，但下一段雾已经漫过来。只能带走一件能改变本局规则的证物。</p>
                <div className="rogue-reward-grid">
                  {rogueRun.offer.map((reward) => <button key={reward.id} onClick={() => takeRogueReward(reward.id)}><strong>{reward.label}</strong><small>{reward.description}</small><CaretRight size={16} weight="bold" /></button>)}
                </div>
              </>
            )}

            {rogueEnding && (
              <>
                <span className={`speaker-tag rogue-ending-tag ${rogueRun.phase === "lost" ? "lost" : ""}`}>{rogueEnding.title}</span>
                <p className="expedition-prompt">{rogueEnding.text}</p>
                <ol className="rogue-log" aria-label="本局清障记录">
                  {rogueRun.history.slice(-6).map((entry, index) => <li key={`${entry.kind}-${index}`}>{entry.text}</li>)}
                </ol>
                <button className="night-primary-action" onClick={replayRogueRun}>保留居民投影，重开清障线 <Sparkle size={18} weight="fill" /></button>
              </>
            )}
            {!rogueEnding && rogueRun.history.length > 1 && <p className="rogue-last-log">{rogueRun.history.at(-1).text}</p>}
          </article>
        </section>
      )}

      {screen === "rogueArena" && rogueRun && (
        <section className="screen arena-screen">
          <img className="night-scene-image" src={portableAssetUrl(selectedResident.image)} alt="雾港清障月台" />
          <div className="night-scene-shade arena-shade" />
          <div className="arena-header">
            <button className="back-control arena-back" onClick={returnToRecord}><ArrowLeft size={19} /> 暂离</button>
            <span>雾港站台 · {Math.floor(rogueRun.time)}s</span>
            <div className="arena-header-actions"><button onClick={() => { setArenaPanelOpen(true); setArenaPaused(true); }}>构筑 · Tab</button><button onClick={() => setArenaPaused((current) => !current)}>{arenaPaused ? "继续" : "暂停"} · Esc</button></div>
          </div>
          <section className="arena-hud" aria-label="肉鸽战斗状态">
            <div className="arena-health"><span>状态 {Math.ceil(rogueRun.player.hp)}/{rogueRun.player.maxHp}</span><i><b style={{ width: `${Math.max(0, rogueRun.player.hp / rogueRun.player.maxHp * 100)}%` }} /></i></div>
            <div className="arena-xp"><span>Lv.{rogueRun.level} · 经验 {rogueRun.xp}/{rogueRun.nextXp}</span><i><b style={{ width: `${Math.min(100, rogueRun.xp / rogueRun.nextXp * 100)}%` }} /></i></div>
            <div className="arena-numbers"><span>护甲 {rogueRun.player.armor}</span><span>硬币 {rogueRun.coins}</span><span>击退 {rogueRun.kills}</span></div>
          </section>
          <section className="arena-stage">
            <canvas ref={arenaCanvas} className="arena-canvas" width={arenaSize.width} height={arenaSize.height} onPointerMove={updateRogueAim} onPointerDown={updateRogueAim} aria-label="雾港清障战场：使用 WASD 或下方方向键移动，空格或闪避键冲刺" />
            <p className="arena-message">{rogueRun.message}</p>
          </section>
          <section className="arena-loadout" aria-label="当前构筑">
            <span>{rogueRun.weapon.name} · 自动清障</span>
            <em>闪避 {rogueRun.player.dashCharges}/{rogueRun.player.dashMax}</em>
            {rogueRun.upgrades.slice(-3).map((upgrade) => <i key={`${upgrade.id}-${rogueRun.upgrades.indexOf(upgrade)}`}>{upgrade.name}</i>)}
          </section>
          {rogueRun.phase === "running" && (
            <section className="arena-controls" aria-label="移动与闪避控制">
              <div className="arena-dpad">
                <button onPointerDown={() => setRogueControl("up", true)} onPointerUp={() => setRogueControl("up", false)} onPointerLeave={() => setRogueControl("up", false)}>▲</button>
                <button onPointerDown={() => setRogueControl("left", true)} onPointerUp={() => setRogueControl("left", false)} onPointerLeave={() => setRogueControl("left", false)}>◀</button>
                <button onPointerDown={() => setRogueControl("down", true)} onPointerUp={() => setRogueControl("down", false)} onPointerLeave={() => setRogueControl("down", false)}>▼</button>
                <button onPointerDown={() => setRogueControl("right", true)} onPointerUp={() => setRogueControl("right", false)} onPointerLeave={() => setRogueControl("right", false)}>▶</button>
              </div>
              <button className="arena-dash" onClick={queueRogueDash}>闪避<br /><small>Space</small></button>
            </section>
          )}
          {rogueRun.phase === "upgrade" && (
            <section className="arena-modal" aria-label="升级三选一">
              <span>等级提升 · 选择强化</span>
              <h2>雾港会记住你的构筑。</h2>
              <div className="arena-choice-list">{rogueRun.offer.map((upgrade) => <button key={upgrade.id} onClick={() => chooseRogueUpgrade(upgrade.id)}><em>{upgrade.category}</em><strong>{upgrade.name}</strong><small>{upgrade.description}</small></button>)}</div>
            </section>
          )}
          {rogueRun.phase === "event" && (
            <section className="arena-modal" aria-label="随机事件">
              <span>随机事件 · 故障装置</span>
              <h2>装置里传来一段尚未寄出的求救信号。</h2>
              <div className="arena-choice-list"><button onClick={() => chooseRogueEvent("open")}><strong>拆开装置</strong><small>失去 20% 当前状态，获得一份随机强化。</small></button><button onClick={() => chooseRogueEvent("help")}><strong>回传信号</strong><small>获得 7 硬币并修复 10 点状态。</small></button></div>
            </section>
          )}
          {rogueRun.phase === "shop" && (
            <section className="arena-modal" aria-label="故障商人">
              <span>商店 · 潮湿货柜</span>
              <h2>故障商人只收本局硬币。</h2>
              <div className="arena-choice-list">{rogueRun.shop.map((item) => <button key={item.id} disabled={rogueRun.coins < item.cost} onClick={() => buyRogueShopItem(item.id)}><em>{item.cost} 枚硬币</em><strong>{item.name}</strong><small>{item.description}</small></button>)}</div>
              <button className="quiet-button arena-leave-shop" onClick={leaveRogueShop}>离开货柜</button>
            </section>
          )}
          {rogueEnding && (
            <section className={`arena-modal arena-ending ${rogueRun.phase === "lost" ? "lost" : ""}`} aria-label="本局结算">
              <span>{rogueEnding.title}</span>
              <h2>{rogueEnding.embers} 枚余烬核心已归档</h2>
              <p>{rogueEnding.text}</p>
              <div className="arena-result-stats"><span>等级 {rogueRun.level}</span><span>击退 {rogueRun.kills}</span><span>强化 {rogueRun.upgrades.length}</span></div>
              <button className="night-primary-action" onClick={replayRogueRun}>以同一居民重开雾港 <Sparkle size={18} weight="fill" /></button>
              <button className="quiet-button" onClick={returnToRecord}>返回图鉴</button>
            </section>
          )}
          {(arenaPanelOpen || arenaPaused) && !rogueEnding && rogueRun.phase === "running" && (
            <section className="arena-modal arena-build-panel" aria-label="角色属性与构筑">
              <span>{arenaPanelOpen ? "角色属性与构筑 · Tab" : "暂停"}</span>
              <h2>{selectedResident.name}的雾港回收记录</h2>
              <div className="arena-build-stats"><span>状态 {Math.ceil(rogueRun.player.hp)}/{rogueRun.player.maxHp}</span><span>攻击 {Math.round(rogueRun.player.damage)}</span><span>暴击 {Math.round(rogueRun.player.crit * 100)}%</span><span>速度 {Math.round(rogueRun.player.speed)}</span><span>投射物 {rogueRun.player.projectiles}</span><span>穿透 {rogueRun.player.pierce}</span></div>
              <section className="arena-build-section"><strong>主武器 · {rogueRun.weapon.name}</strong><p>{rogueRun.weapon.description}</p></section>
              <section className="arena-build-section"><strong>本局强化 · {rogueRun.upgrades.length}</strong>{rogueRun.upgrades.length ? rogueRun.upgrades.map((upgrade, index) => <p key={`${upgrade.id}-${index}`}>{upgrade.name} · {upgrade.description}</p>) : <p>尚未获得强化。击退异常并收集经验可升级。</p>}</section>
              <button className="night-primary-action" onClick={() => { setArenaPanelOpen(false); setArenaPaused(false); }}>继续清障 <CaretRight size={18} weight="bold" /></button>
            </section>
          )}
        </section>
      )}

      {screen === "deepReport" && deepReport && (
        <section className="screen deep-report-screen">
          <img className="background-image" src={portableAssetUrl(selectedResident.image)} alt="" />
          <div className="sheet-shade deep-report-shade" />
          <article className="deep-report">
            <button className="back-control" onClick={() => setScreen("record")}><ArrowLeft size={20} /> 返回图鉴</button>
            <span className="eyebrow"><Archive size={15} weight="fill" /> 人格投影 · 深度档案</span>
            <h2>{mbtiType} · {deepReport.title}</h2>
            <p className="deep-report-lead">{deepReport.subtitle}</p>
            <p className="deep-report-boundary">这是基于本次自愿问卷的 MBTI 风格自我探索，不是脑科学结论、心理诊断或对你的固定定义。</p>

            <section className="report-section score-section">
              <h3>本次问卷的四维记录</h3>
              <p>分数只记录这 16 道题的方向性选择，不表示人格强度或能力高低。</p>
              <div className="score-grid">
                {mbtiScoreRows.map((row) => <div key={row.id}><span>{row.label}</span><strong>{row.value}</strong></div>)}
              </div>
            </section>

            <section className="report-section">
              <h3>一、这类倾向的观察视角</h3>
              <p>{deepReport.overview}</p>
            </section>

            <section className="report-section">
              <h3>二、认知功能叙事参考</h3>
              <p>以下是 MBTI 社群常用的叙事框架，用来描述偏好，不是对大脑结构的科学测量。</p>
              <div className="function-stack">
                {deepReport.stack.map((functionId, index) => {
                  const functionInfo = mbtiFunctionGlossary[functionId];
                  return <div key={functionId}><span>{String(index + 1).padStart(2, "0")}</span><h4>{functionInfo.name} · {functionInfo.metaphor}</h4><p>{functionInfo.text}</p></div>;
                })}
              </div>
            </section>

            <section className="report-section">
              <h3>三、常见的现实表现</h3>
              <div className="signature-list">
                {deepReport.signatures.map(([title, description]) => <div key={title}><h4>{title}</h4><p>{description}</p></div>)}
              </div>
            </section>

            <section className="report-section warning-section">
              <h3>四、压力下可能发生什么</h3>
              <p>{deepReport.pressure}</p>
            </section>

            <section className="report-section">
              <h3>五、给自己的实践提醒</h3>
              <ol className="reminder-list">
                {deepReport.reminders.map((reminder) => <li key={reminder}>{reminder}</li>)}
              </ol>
            </section>

            <section className="report-section">
              <h3>六、适配的协作与工作环境</h3>
              <p>{deepReport.roles}</p>
            </section>

            <section className="report-section otherworld-section">
              <h3>七、在彼界的异化映射</h3>
              <p><strong>{selectedResident.name}</strong> 并不是你本人，而是本次选择被写成的平行世界居民。{selectedResident.manifestation}</p>
              <p>{selectedResident.workRhythm}</p>
            </section>
          </article>
        </section>
      )}

      {screen === "worldMap" && (
        <section className="screen world-map-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="雾港线路图所在的潮湿隧道" />
          <div className="sheet-shade world-map-shade" />
          <article className="world-map-panel">
            <button className="back-control" onClick={() => setScreen("observe")}><ArrowLeft size={20} /> 返回观测</button>
            <span className="eyebrow"><MapPin size={15} weight="fill" /> 雾港世界线地图 · 本地记录</span>
            <h2>每一次交班，都让雾港多出一条可走的路。</h2>
            <p>地图只记录虚构远征、证物数量与残响信；不保存照片、用户名、问卷答案或任何现实人格信息。</p>
            <div className="worldline-stats">
              <div><strong>{expeditionArchive.length}</strong><span>雾港远征</span></div>
              <div><strong>{expeditionArchive.filter((entry) => entry.status === "归还").length}</strong><span>归还世界线</span></div>
              <div><strong>{resonanceInbox.length}</strong><span>收到残响信</span></div>
            </div>

            <section className="world-district-list" aria-label="雾港已发现区域">
              <span>线路显影</span>
              {worldDistricts.map((district) => (
                <article className={`world-district ${district.unlocked ? "unlocked" : "locked"}`} key={district.id}>
                  <em>{district.index}</em>
                  <div><strong>{district.name}</strong><p>{district.unlocked ? district.description : `未显影 · ${district.requirement}`}</p></div>
                  <span>{district.unlocked ? "已显影" : "雾中"}</span>
                </article>
              ))}
            </section>

            <section className="resonance-mailbox" aria-label="残响邮局">
              <span>残响邮局 · 朋友导入</span>
              <p>输入朋友分享的虚构路线码，即可收到一封世界内来信。</p>
              <div className="resonance-input-row">
                <input value={resonanceInput} onChange={(event) => setResonanceInput(event.target.value)} placeholder="WH-R-AABC" aria-label="残响码" />
                <button type="button" onClick={receiveResonanceParcel}>收信</button>
              </div>
              {resonanceMessage && <p className="resonance-message" role="status">{resonanceMessage}</p>}
              {latestExpeditionParcel && (
                <div className="outbound-parcel">
                  <span>本机最近封装的残响</span>
                  <strong>{latestExpeditionParcel.code}</strong>
                  <p>{latestExpeditionParcel.status} · {latestExpeditionParcel.title}</p>
                  <button type="button" onClick={copyResonanceCode}>复制给朋友</button>
                </div>
              )}
            </section>

            {resonanceInbox.length > 0 && (
              <section className="received-mail-list" aria-label="收到的残响来信">
                <span>已收到的来信</span>
                {resonanceInbox.slice(0, 3).map((parcel) => <article key={parcel.code}><strong>{parcel.title}</strong><em>{parcel.code}</em><p>{parcel.body}</p></article>)}
              </section>
            )}
            <button className="quiet-button world-map-archive-link" onClick={openWorldlineArchive}><Archive size={17} weight="duotone" /> 查看居民夜班档案馆</button>
          </article>
        </section>
      )}

      {screen === "worldArchive" && (
        <section className="screen world-archive-screen">
          <img className="background-image" src={portableAssetUrl("/assets/tunnel-atmosphere.png")} alt="潮湿的彼界隧道" />
          <div className="sheet-shade" />
          <article className="world-archive-panel">
            <button className="back-control" onClick={() => setScreen("observe")}><ArrowLeft size={20} /> 返回观测</button>
            <span className="eyebrow"><Archive size={15} weight="fill" /> 彼界世界线档案馆</span>
            <h2>证物会记住你走过的夜班</h2>
            <p>这里仅保存虚构角色、夜班路径与证物；不保存照片，也不会把任何结局指向现实中的你。</p>
            <div className="worldline-stats">
              <div><strong>{worldlineArchive.length}</strong><span>已归档世界线</span></div>
              <div><strong>{new Set(worldlineArchive.map((entry) => entry.artifact.name)).size}</strong><span>已发现证物</span></div>
              <div><strong>{new Set(worldlineArchive.map((entry) => entry.target)).size}</strong><span>已显现关联</span></div>
            </div>
            {worldlineArchive.length === 0 ? (
              <div className="empty-worldline">
                <CheckCircle size={30} weight="duotone" />
                <strong>第一件证物仍在等待被带回。</strong>
                <p>完成任意一名居民的夜班后，存活与失联路线都会留下不同的世界线证物。</p>
                <button className="primary-button" onClick={() => setScreen("mbti")}><Sparkle size={18} weight="fill" /> 开始人格投影问卷</button>
              </div>
            ) : (
              <div className="worldline-list">
                {worldlineArchive.map((entry) => (
                  <article className={`worldline-card ${entry.status === "存活" ? "survived" : "lost"}`} key={entry.id}>
                    <div className="worldline-card-top"><span>{entry.status === "存活" ? "已返回" : "失联残响"}</span><em>{entry.type}</em></div>
                    <h3>{entry.residentName}</h3>
                    <div className="artifact-row"><Archive size={16} weight="duotone" /><div><strong>{entry.artifact.name}</strong><p>{entry.artifact.description}</p></div></div>
                    <p className="worldline-link">关联线：{mbtiDossierByType[entry.target]?.name} · {entry.link}</p>
                    {entry.status === "死亡" ? (
                      <button className="worldline-action" onClick={() => openResonance(entry)}>追查残响 <CaretRight size={16} weight="bold" /></button>
                    ) : (
                      <button className="worldline-action" onClick={() => startLinkedNight(entry)}>携证物进入关联夜班 <CaretRight size={16} weight="bold" /></button>
                    )}
                    <p className="next-shift-note"><strong>下一夜预告：</strong>{entry.nextNight}</p>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      )}

      {screen === "resonance" && resonanceEntry && resonanceTarget && (
        <section className="screen resonance-screen">
          <img className="background-image" src={portableAssetUrl(resonanceTarget.image)} alt={`${resonanceTarget.name}的关联调查画面`} />
          <div className="sheet-shade resonance-shade" />
          <article className="resonance-panel">
            <button className="back-control" onClick={openWorldlineArchive}><ArrowLeft size={20} /> 返回世界线档案馆</button>
            <span className="eyebrow"><Sparkle size={15} weight="fill" /> 残响追查 · 关联已显现</span>
            <h2>{resonanceEntry.residentName}留下的回声</h2>
            <p>{resonanceEntry.status === "死亡" ? "这名虚构居民在夜班中失联，但其证物仍在彼界工作。你可以沿着它最后留下的关联线继续调查。" : "这名虚构居民已完成交班，但证物仍指向另一位正在值夜的居民。"}</p>
            <div className="resonance-clues">
              <div><span>01 · 留下的证物</span><strong>{resonanceEntry.artifact.name}</strong><p>{resonanceEntry.artifact.description}</p></div>
              <div><span>02 · 异常关联</span><strong>{resonanceTarget.name}</strong><p>{resonanceEntry.link}</p></div>
              <div><span>03 · 可继续的夜班</span><strong>调查入口已解锁</strong><p>{resonanceEntry.nextNight}</p></div>
            </div>
            <p className="fiction-note"><ShieldCheck size={17} weight="fill" /> 残响与追查都属于虚构彼界故事，不代表现实人物或现实事件。</p>
            <button className="primary-button" onClick={() => startLinkedNight(resonanceEntry)}><Sparkle size={18} weight="fill" /> 进入 {resonanceTarget.name} 的关联夜班</button>
          </article>
        </section>
      )}

      {infoOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setInfoOpen(false)}>
          <aside className="info-sheet" role="dialog" aria-modal="true" aria-label="图鉴说明" onClick={(event) => event.stopPropagation()}>
            <span className="eyebrow">暗夜图鉴相机</span>
            <h2>照片是锚点，不是评价对象。</h2>
            <p>这里的居民属于虚构彼界；照片不会被用于评判外貌、身份或人格。MBTI 场景问卷只会根据你主动提交的答案生成娱乐化故事投影，不作为心理诊断。</p>
            <button className="primary-button" onClick={() => setInfoOpen(false)}>我明白了</button>
          </aside>
        </div>
      )}
    </main>
  );
}
