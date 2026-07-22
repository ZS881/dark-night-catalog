const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const expeditionTitle = "雾港末班车：第七站无人下车";

export const expeditionNodes = [
  {
    id: "ticketHall",
    location: "01 / 潮湿售票厅",
    title: "没有终点的票根",
    prompt: "售票窗后没有人，只有一台还在吐票的旧机器。每一张票根都写着今晚的日期，却没有目的地。广播提醒你：第一声报站后，不要把票递给玻璃里的人。",
    rule: "票根可以核对，不能替陌生乘客确认终点。",
    choices: [
      {
        id: "catalogTicket",
        label: "核对票根编号，收起未打孔的一张",
        detail: "获得可用于终点封存的证物；花一点时间确认来源。",
        tags: ["inspect", "record", "prepare"],
        effects: { clarity: 1, stamina: -1, seals: 1 },
        supply: "未打孔车票",
        outcome: "你从边角磨损的票根中找到一张没有终点、也没有乘客姓名的车票。机器随即安静下来。",
      },
      {
        id: "helpSleeper",
        label: "把一张空白票留给门口的候车者",
        detail: "换取一句口头线索，但会失去一份可验证的物资。",
        tags: ["help", "care"],
        effects: { clarity: 1, drift: 1 },
        outcome: "候车者没有接票，只在雾里说：\"第七站的人从不下车，只会等别人替他们下车。\"",
      },
      {
        id: "rushThrough",
        label: "避开售票窗，沿着隧道边缘快步通过",
        detail: "节省时间，但忽略了第一条可追溯的线索。",
        tags: ["improvise"],
        effects: { stamina: 1, clarity: -1, drift: 1 },
        outcome: "你没有回头。身后的吐票声停了三秒，又开始以你的脚步频率重复。",
      },
    ],
  },
  {
    id: "powerCorridor",
    location: "02 / 07号供电廊",
    title: "会呼吸的配电箱",
    prompt: "供电廊的红色电缆像潮湿的根系一样垂到地面。维修记录说它们今晚不该带电；可你每靠近一步，尽头的无脸站务员就多亮起一盏灯。",
    rule: "看不见回路终点的电缆，不能徒手接入。",
    choices: [
      {
        id: "testCircuit",
        label: "用检修笔逐段确认可见回路",
        detail: "稳定而缓慢；点亮一段安全通道。",
        tags: ["inspect", "prepare"],
        effects: { stamina: -1, clarity: 1, seals: 1 },
        supply: "回路检修笔",
        outcome: "检修笔只在三根电缆上亮起。你用粉笔圈住它们，远处的无脸站务员向后退了一步。",
      },
      {
        id: "shareLamp",
        label: "把随身灯分给无脸站务员",
        detail: "获得同行协助；你将独自穿过更暗的走廊。",
        tags: ["help", "care"],
        effects: { stamina: -1, clarity: 1, drift: -1 },
        supply: "站务员的灯号",
        outcome: "对方接过灯后没有说谢谢，只把一张写着\"不要数第七根\"的维修单塞进你口袋。",
      },
      {
        id: "touchCable",
        label: "借着闪光直接跨过红色电缆",
        detail: "快速前进，但让异化信号记住你的工号。",
        tags: ["improvise", "signal"],
        effects: { stamina: 1, clarity: -1, drift: 2 },
        outcome: "闪光熄灭时，你已经在走廊另一端；电缆却像记住了你的步幅一样，在地面缓慢收紧。",
      },
    ],
  },
  {
    id: "platform",
    location: "03 / 无脸月台",
    title: "候车者的雾灯",
    prompt: "月台上只有一位候车者。她抱着一盏快熄灭的雾灯，脚边摆着一只没有影子的皮箱。末班车还未进站，但第七站的站名已经从电子屏上渗出来。",
    rule: "在站名念完前，不能同时回应门后的呼唤与月台上的等待。",
    choices: [
      {
        id: "keepLamp",
        label: "替候车者护住雾灯，等列车靠岸",
        detail: "放慢脚步，换取月台的稳定与一枚信物。",
        tags: ["quiet", "care"],
        effects: { stamina: -1, clarity: 1, seals: 1, drift: -1 },
        supply: "未熄雾灯芯",
        outcome: "你挡住了门后的第二声呼唤。雾灯没有再闪，候车者也终于记起自己原本要在哪一站下车。",
      },
      {
        id: "readSignal",
        label: "只记录电子屏不断重写的站名",
        detail: "获得通向终点的异界线索，但月台会开始记住你。",
        tags: ["quiet", "record", "signal"],
        effects: { clarity: 1, drift: 1 },
        supply: "第七站报站残片",
        outcome: "你没有抬头回应任何声音，只把第七站的每一次拼写变化记进站务簿。",
      },
      {
        id: "openCase",
        label: "打开没有影子的皮箱，寻找更快的路线",
        detail: "可能获得捷径，也可能让月台把你算作乘客。",
        tags: ["improvise"],
        effects: { stamina: 1, clarity: -1, drift: 2 },
        outcome: "皮箱里没有行李，只有一张已经替你打好孔的车票。电子屏随即把你的名字留在了候车名单上。",
      },
    ],
  },
  {
    id: "seventhStop",
    location: "04 / 第七站闸门",
    title: "无人下车的终点",
    prompt: "列车在雾外停住，车门没有打开。闸门旁的铁盒要求你交出一件证物，或交出一个可以被记录的名字。最后一班广播开始倒数。",
    rule: "第七节车厢从不接回独自登车的人。",
    choices: [
      {
        id: "sealTicket",
        label: "用可追溯的证物封住第七站闸门",
        detail: "将你带回来的线索交给世界，而不是交给列车。",
        tags: ["record", "prepare"],
        effects: { clarity: 1, seals: 1, drift: -1 },
        outcome: "铁盒吞下证物，站名从电子屏上淡去。列车没有开门，只在雾里鸣笛一次。",
      },
      {
        id: "leaveLamp",
        label: "把雾灯留在闸门前，护送候车者离开",
        detail: "放弃一件物资，换取一条不必独自走完的回程。",
        tags: ["help", "care", "quiet"],
        effects: { stamina: -1, clarity: 1, drift: -1 },
        outcome: "候车者没有上车。她接过雾灯后站在你的身后，直到第一班晨车的灯穿过雾港。",
      },
      {
        id: "boardSeventh",
        label: "独自登上第七节车厢",
        detail: "明确的禁忌选项：它会立刻结束本次远征。",
        tags: ["signal"],
        effects: { drift: 5 },
        fatal: true,
        outcome: "车门只为你打开了一条缝。你踏进去后，站务系统将你的工号改成了一个不会被呼叫的站名。",
      },
    ],
  },
];

const axisGifts = [
  { index: 0, letter: "I", label: "静默回响", tag: "quiet", effect: { clarity: 1 }, detail: "在不回应异常呼唤的行动中，额外恢复 1 点清醒。" },
  { index: 0, letter: "E", label: "同行火种", tag: "help", effect: { clarity: 1 }, detail: "在帮助异界居民的行动中，额外恢复 1 点清醒。" },
  { index: 1, letter: "S", label: "实物辨识", tag: "inspect", effect: { seals: 1 }, detail: "在核对可见线索时，额外获得 1 枚归还印记。" },
  { index: 1, letter: "N", label: "余响听辨", tag: "signal", effect: { clarity: 1 }, detail: "在辨识异常信号时，额外恢复 1 点清醒。" },
  { index: 2, letter: "T", label: "流程拆解", tag: "record", effect: { stamina: 1 }, detail: "在记录、封存或拆解规则时，额外恢复 1 点体力。" },
  { index: 2, letter: "F", label: "守望连结", tag: "care", effect: { seals: 1 }, detail: "在守护居民的行动中，额外获得 1 枚归还印记。" },
  { index: 3, letter: "J", label: "预备交班", tag: "prepare", effect: { stamina: 1 }, detail: "在事先确认回路或物资时，额外恢复 1 点体力。" },
  { index: 3, letter: "P", label: "临界应变", tag: "improvise", effect: { drift: -1 }, detail: "在临场变通时，额外降低 1 点异化。" },
];

export const getExpeditionGifts = (type) => axisGifts.filter((gift) => type?.[gift.index] === gift.letter);

const mergeEffects = (base, extra) => Object.keys(base).reduce((result, key) => ({
  ...result,
  [key]: (base[key] ?? 0) + (extra[key] ?? 0),
}), { ...extra });

export const createExpeditionRun = (type) => ({
  type,
  stamina: 3,
  clarity: 3,
  drift: 0,
  seals: 0,
  supplies: [],
  history: [],
  gifts: getExpeditionGifts(type),
});

export const applyExpeditionChoice = (run, node, choice) => {
  const triggeredGifts = run.gifts.filter((gift) => choice.tags.includes(gift.tag));
  const giftEffect = triggeredGifts.reduce((total, gift) => mergeEffects(total, gift.effect), {});
  const effect = mergeEffects(choice.effects, giftEffect);
  const supplies = choice.supply && !run.supplies.includes(choice.supply)
    ? [...run.supplies, choice.supply]
    : run.supplies;

  return {
    ...run,
    stamina: clamp(run.stamina + (effect.stamina ?? 0), 0, 5),
    clarity: clamp(run.clarity + (effect.clarity ?? 0), 0, 5),
    drift: clamp(run.drift + (effect.drift ?? 0), 0, 5),
    seals: clamp(run.seals + (effect.seals ?? 0), 0, 5),
    supplies,
    history: [...run.history, {
      nodeId: node.id,
      location: node.location,
      title: node.title,
      label: choice.label,
      outcome: choice.outcome,
      fatal: Boolean(choice.fatal),
      triggeredGifts: triggeredGifts.map((gift) => gift.label),
      supply: choice.supply ?? "",
    }],
  };
};

export const resolveExpeditionEnding = (run) => {
  const lastChoice = run.history.at(-1);
  if (lastChoice?.fatal) {
    return {
      status: "失联",
      title: "失联结局：第七节乘客",
      summary: "你选择把自己交给了没有返程记录的车厢。晨间交班时，雾港只收到一张正在缓慢出票的空白工牌。",
      returnNote: "第七站将你的名字记成了一个尚未被启用的站名。",
    };
  }
  if (run.stamina === 0) {
    return {
      status: "失联",
      title: "失联结局：雾中滞留",
      summary: "你带着线索抵达了闸门，却没有余力完成交班。第一班晨车进站时，月台上只剩下你的脚印。",
      returnNote: "一枚未被带走的证物仍在雾里发热，等待下一位夜班居民续查。",
    };
  }
  if (run.clarity === 0 || run.drift >= 4) {
    return {
      status: "失联",
      title: "失联结局：广播接管",
      summary: "你分不清广播是在报站，还是在练习你的声音。闸门打开前，系统已经替你确认了一个不属于你的终点。",
      returnNote: "世界线档案留下了一段可供追查的报站残响。",
    };
  }
  if (run.seals >= 3 && run.supplies.length >= 2) {
    return {
      status: "归还",
      title: "归还结局：晨车交班",
      summary: "你没有驱逐雾港的异常，而是让每一件证物回到可被追溯的位置。晨车抵达时，候车者向你点亮了一盏完整的雾灯。",
      returnNote: "你带回了足够的证物与印记；第七站暂时从线路图上淡去。",
    };
  }
  return {
    status: "归还",
    title: "归还结局：带着余响离站",
    summary: "你在末班车真正抵达前离开了闸门。雾港仍有未解的声音，但它们已经被写进可供下一班核对的记录。",
    returnNote: "这条世界线尚未闭合；保留下来的线索会在下一次远征中改变路线。",
  };
};
