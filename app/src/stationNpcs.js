import ticketInspectorSprite from "./assets/npcs/npc-ticket-inspector.png?inline";
import fogLanternGuideSprite from "./assets/npcs/npc-fog-lamp-guide.png?inline";
import lanternEyedCourierSprite from "./assets/npcs/npc-lantern-eyed-courier.png?inline";
import mistHeraldSprite from "./assets/npcs/npc-mist-herald.png?inline";
import reflectionCashierSprite from "./assets/npcs/npc-reflection-cashier.png?inline";
import mirrorGatePeddlerSprite from "./assets/npcs/npc-mirror-gate-peddler.png?inline";
import paperMoonGathererSprite from "./assets/npcs/npc-paper-moon-gatherer.png?inline";
import bloodlineMaintainerSprite from "./assets/npcs/npc-bloodline-maintainer.png?inline";
import doorGapSwitcherSprite from "./assets/npcs/npc-door-gap-switcher.png?inline";
import deepWellDisassemblerSprite from "./assets/npcs/npc-deep-well-disassembler.png?inline";
import bellTowerForemanSprite from "./assets/npcs/npc-bell-tower-foreman.png?inline";
import umbrellaMenderSprite from "./assets/npcs/npc-umbrella-mender.png?inline";
import patrolHoundSprite from "./assets/npcs/npc-patrol-hound.png?inline";
import lostPropertyClerkSprite from "./assets/npcs/npc-lost-property-clerk.png?inline";
import tideMarkArchivistSprite from "./assets/npcs/npc-tide-mark-archivist.png?inline";
import fireflyTravelerSprite from "./assets/npcs/npc-firefly-traveler.png?inline";

// Non-hostile station workers are world actors, not enemy variants.  The
// catalog keeps art direction, functional read and future sprite hooks in one
// place so a later portrait, glow pass or four-direction sheet can replace the
// procedural prototype without altering map or interaction logic.
const spriteSourceById = {
  ticketInspector: ticketInspectorSprite,
  fogLanternGuide: fogLanternGuideSprite,
  lampEyedPostman: lanternEyedCourierSprite,
  mistMessenger: mistHeraldSprite,
  reflectionCashier: reflectionCashierSprite,
  mirrorVendor: mirrorGatePeddlerSprite,
  paperMoonCollector: paperMoonGathererSprite,
  bloodlineMaintainer: bloodlineMaintainerSprite,
  doorGapSwitcher: doorGapSwitcherSprite,
  deepwellDismantler: deepWellDisassemblerSprite,
  clocktowerForeman: bellTowerForemanSprite,
  umbrellaBoneMender: umbrellaMenderSprite,
  patrolHound: patrolHoundSprite,
  lostPropertyClerk: lostPropertyClerkSprite,
  tideArchivist: tideMarkArchivistSprite,
  fireflyTraveller: fireflyTravelerSprite,
};

const npc = (id, name, category, role, prop, action, line, palette, cue) => ({
  id,
  name,
  category,
  role,
  prop,
  action,
  line,
  palette,
  cue,
  spriteSrc: spriteSourceById[id],
  interactionRange: 52,
  spritePlan: {
    idle: true,
    portrait: true,
    lit: true,
    walkDirections: 4,
    action,
  },
});

export const stationNpcCatalog = {
  ticketInspector: npc("ticketInspector", "站台检票员", "route", "无目的地检票", "ticket", "punch", "把没有终点的票根递给你。别问它从哪一站来。", { coat: "#38413d", trim: "#a78b61", skin: "#cdbd9c", glow: "#e7c878" }, "ticketGate"),
  fogLanternGuide: npc("fogLanternGuide", "雾灯引路人", "route", "雾区换乘接引", "lantern", "light", "灯只照下一步，后面的路由雾自己记住。", { coat: "#34484a", trim: "#b7c7bb", skin: "#d7c6a4", glow: "#d8d198" }, "lampPost"),
  lampEyedPostman: npc("lampEyedPostman", "灯眼邮差", "route", "失信投递", "letter", "offer", "信封没有收件人，但它知道你会收下。", { coat: "#4b3e36", trim: "#c38661", skin: "#d5c2a3", glow: "#f0b77a" }, "mailRack"),
  mistMessenger: npc("mistMessenger", "迷雾使者", "route", "临时路线告知", "bell", "ring", "铃响三次以后，列车会把陌生人当作乘客。", { coat: "#394052", trim: "#a6bad1", skin: "#cbc3b1", glow: "#b6d7df" }, "signalBox"),
  reflectionCashier: npc("reflectionCashier", "倒影收银员", "shop", "回收柜台交易", "counter", "count", "它只收本局硬币，也会找回一枚不属于你的零钱。", { coat: "#493f36", trim: "#b68b62", skin: "#d3c4aa", glow: "#e5bc7a" }, "counter"),
  mirrorVendor: npc("mirrorVendor", "镜门商贩", "shop", "镜面遗物交易", "mirror", "polish", "镜子里那个你已经先一步挑好了货。", { coat: "#302f3d", trim: "#a082a7", skin: "#d3c5b0", glow: "#bfc6eb" }, "mirrorStand"),
  paperMoonCollector: npc("paperMoonCollector", "纸月收集者", "shop", "月片回收", "paper", "sort", "它把湿掉的纸月晾成车票，再卖给赶路的人。", { coat: "#514b3b", trim: "#d2c08e", skin: "#d8c7aa", glow: "#e8db9a" }, "paperRack"),
  bloodlineMaintainer: npc("bloodlineMaintainer", "血线维护员", "function", "轨道缝合维修", "tools", "repair", "别踩红线。它们只是比电缆更愿意记住脚印。", { coat: "#3a4145", trim: "#9f6259", skin: "#cfbda4", glow: "#d88a70" }, "toolCart"),
  doorGapSwitcher: npc("doorGapSwitcher", "门缝切换工", "function", "门缝线路切换", "switch", "turn", "门缝没有锁，只有一套不肯承认的班次表。", { coat: "#3a3d38", trim: "#a7b49c", skin: "#c9b99e", glow: "#b8d592" }, "switchPanel"),
  deepwellDismantler: npc("deepwellDismantler", "深井拆解员", "function", "泵房设备拆解", "wrench", "tighten", "水位已经量过了。再往下，听见的会比看见的更多。", { coat: "#3b4542", trim: "#769f9d", skin: "#cbbca5", glow: "#91c8c4" }, "pump"),
  clocktowerForeman: npc("clocktowerForeman", "钟楼工头", "function", "时序维修监工", "watch", "check", "指针不是在报时，它在替每个人保留还没发生的迟到。", { coat: "#3e3940", trim: "#b58c65", skin: "#d0bda4", glow: "#dfb272" }, "clock"),
  umbrellaBoneMender: npc("umbrellaBoneMender", "伞骨修补匠", "function", "雨棚工具修补", "umbrella", "mend", "修好的伞会自己朝着没有雨的地方张开。", { coat: "#323d3f", trim: "#789fa1", skin: "#d0bea5", glow: "#a7d1d0" }, "awning"),
  patrolHound: npc("patrolHound", "巡逻猎犬", "story", "边界巡逻", "badge", "watch", "它不追人，只盯着那些已经离开却仍留在站台上的影子。", { coat: "#48413a", trim: "#c79761", skin: "#cfc0aa", glow: "#e5a665" }, "patrolSign"),
  lostPropertyClerk: npc("lostPropertyClerk", "失物柜员", "story", "无主失物归档", "ledger", "record", "每件失物都有一把钥匙，但没有一把能打开原来的门。", { coat: "#38413a", trim: "#9eaf91", skin: "#d0c0a7", glow: "#c7deae" }, "locker"),
  tideArchivist: npc("tideArchivist", "潮痕档案员", "story", "潮位档案归档", "seal", "stamp", "下一页已经浮起来了。请别替它翻过去。", { coat: "#35434a", trim: "#77a4a8", skin: "#c7bba8", glow: "#9bd8d5" }, "archiveShelf"),
  fireflyTraveller: npc("fireflyTraveller", "萤火旅人", "story", "乡道换乘记录", "suitcase", "wait", "手提箱里没有行李，只有几盏还没找到站名的萤灯。", { coat: "#464038", trim: "#ba965e", skin: "#d5c2a7", glow: "#e1c56b" }, "suitcasePile"),
};

const aliases = [
  ["检票", "ticketInspector"], ["雾灯", "fogLanternGuide"], ["邮", "lampEyedPostman"], ["传令", "mistMessenger"],
  ["收银", "reflectionCashier"], ["镜", "mirrorVendor"], ["纸月", "paperMoonCollector"], ["血线", "bloodlineMaintainer"],
  ["门缝", "doorGapSwitcher"], ["拆解", "deepwellDismantler"], ["钟楼", "clocktowerForeman"], ["伞", "umbrellaBoneMender"],
  ["巡逻", "patrolHound"], ["失物", "lostPropertyClerk"], ["档案", "tideArchivist"], ["萤", "fireflyTraveller"],
];

const sceneHosts = {
  fogHarbor: "fogLanternGuide",
  powerCorridor: "deepwellDismantler",
  facelessPlatform: "mirrorVendor",
};

const resolveProfile = (contact = {}) => {
  // A terminal worksite may intentionally omit a bespoke escort. Treat that
  // as an unnamed station contact instead of dereferencing null during the
  // transfer and taking the canvas down with it.
  const safeContact = contact ?? {};
  const name = safeContact.name ?? "";
  const alias = aliases.find(([needle]) => name.includes(needle));
  return stationNpcCatalog[alias?.[1] ?? "mistMessenger"];
};

export const getWorksiteNpcs = ({ layout, stageIndex = 0 }) => {
  const anchors = layout.npcAnchors ?? {};
  const rawContact = layout.contact ?? {};
  const contactProfile = resolveProfile(rawContact);
  const sceneHost = stationNpcCatalog[sceneHosts[layout.art] ?? "fogLanternGuide"];
  const fallbackHost = stationNpcCatalog[layout.art === "powerCorridor" ? "doorGapSwitcher" : layout.art === "facelessPlatform" ? "lostPropertyClerk" : "ticketInspector"];
  const hostProfile = sceneHost.id === contactProfile.id ? fallbackHost : sceneHost;
  const contact = rawContact;
  const resolveAnchor = (profile, index) => {
    const fallback = anchors.default?.[index] ?? anchors.default?.[0] ?? { x: 1080, y: 420, landmark: "站台服务带" };
    return anchors[profile.cue] ?? anchors[profile.category] ?? fallback;
  };
  const makeActor = (profile, anchor, suffix, overrides = {}) => ({
    ...profile,
    ...overrides,
    id: `${profile.id}-${stageIndex}-${suffix}`,
    x: anchor.x,
    y: anchor.y,
    baseline: anchor.y,
    landmark: anchor.landmark,
  });
  const contactAnchor = resolveAnchor(contactProfile, 0);
  const preferredHostAnchor = resolveAnchor(hostProfile, 1);
  // Some routes deliberately share a *type* of landmark (for example a
  // signal lamp and a signal box). Two NPCs may never occupy the same feet
  // baseline, though: that would hide their silhouettes and block the
  // interaction ring. Use the second service-side fallback in that case.
  const hostAnchor = preferredHostAnchor.x === contactAnchor.x && preferredHostAnchor.y === contactAnchor.y
    ? (anchors.default?.[1] ?? { x: 1080, y: 420, landmark: "站台服务位" })
    : preferredHostAnchor;
  return [
    makeActor(contactProfile, contactAnchor, "contact", {
      name: contact.name ?? contactProfile.name,
      role: contact.role ?? contactProfile.role,
      line: contact.line ?? contactProfile.line,
      isContact: true,
    }),
    makeActor(hostProfile, hostAnchor, "host", { isContact: false }),
  ];
};
