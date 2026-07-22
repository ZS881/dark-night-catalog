const choiceSymbols = {
  catalogTicket: "A",
  helpSleeper: "B",
  rushThrough: "C",
  testCircuit: "A",
  shareLamp: "B",
  touchCable: "C",
  keepLamp: "A",
  readSignal: "B",
  openCase: "C",
  sealTicket: "A",
  leaveLamp: "B",
  boardSeventh: "C",
};

const normaliseCode = (value = "") => value.trim().toUpperCase().replace(/\s+/g, "");

const routeNotes = {
  A: "你留下了可复核的痕迹。",
  B: "你让一盏不属于你的灯继续亮着。",
  C: "你从没有被允许的捷径旁经过。",
};

export const buildResonanceParcel = (run, ending) => {
  if (!run || !ending || run.history.length !== 4) return null;
  const route = run.history.map((entry) => choiceSymbols[entry.choiceId] ?? "X").join("");
  const statusLetter = ending.status === "归还" ? "R" : "L";
  const code = `WH-${statusLetter}-${route}`;
  const isReturned = statusLetter === "R";

  return {
    code,
    status: isReturned ? "归还残响" : "失联残响",
    title: isReturned ? "一封从晨车投下的回信" : "一封未盖邮戳的站台来信",
    body: isReturned
      ? `第七站暂时从线路图上褪去。${routeNotes[route.at(-1)] ?? "交班簿仍保持空白。"}`
      : `信封里只有四段脚步声。${routeNotes[route.at(-1)] ?? "末班广播没有读出寄件人的名字。"}`,
    route,
    createdAt: new Date().toISOString(),
  };
};

export const parseResonanceCode = (input) => {
  const code = normaliseCode(input);
  const match = /^WH-([RL])-([ABC]{4})$/.exec(code);
  if (!match) return null;

  const [, state, route] = match;
  const isReturned = state === "R";
  return {
    code,
    status: isReturned ? "归还残响" : "失联残响",
    title: isReturned ? "一封从晨车投下的回信" : "一封未盖邮戳的站台来信",
    body: isReturned
      ? `第七站暂时从线路图上褪去。${routeNotes[route.at(-1)]}`
      : `信封里只有四段脚步声。${routeNotes[route.at(-1)]}`,
    route,
    receivedAt: new Date().toISOString(),
  };
};

export const deriveWorldDistricts = (expeditions = [], inbox = []) => {
  const returned = expeditions.some((entry) => entry.status === "归还");
  const lost = expeditions.some((entry) => entry.status === "失联");
  const hasTwoSupplies = expeditions.some((entry) => entry.supplies?.length >= 2);
  const hasMail = inbox.length > 0;
  const hasSeveralRuns = expeditions.length >= 2;

  return [
    {
      id: "ticketHall",
      index: "01",
      name: "潮湿售票厅",
      description: "吐票机仍在打印没有终点的票根。",
      unlocked: expeditions.length > 0,
      requirement: "完成一次雾港远征",
    },
    {
      id: "powerCorridor",
      index: "02",
      name: "07 号供电廊",
      description: "只有回路被核对过的电缆会在雾里发光。",
      unlocked: returned,
      requirement: "带回一条归还世界线",
    },
    {
      id: "facelessPlatform",
      index: "03",
      name: "无脸月台",
      description: "候车者把没有影子的皮箱留在灯下。",
      unlocked: hasTwoSupplies || hasMail,
      requirement: "带回两份证物，或接收一封残响信",
    },
    {
      id: "seventhGate",
      index: "04",
      name: "第七站闸门",
      description: "铁盒已经记住了那些没能下车的工号。",
      unlocked: lost || hasSeveralRuns || hasMail,
      requirement: "留下失联世界线、完成两次远征，或接收一封残响信",
    },
  ];
};
