// Every MBTI projection receives a small, replayable first-night chapter.
// These stories describe fictional parallel-world workers, not the player.
const baseNightChapters = {
  ISTJ: {
    title: "第一夜：编号失效",
    time: "00:07",
    prompt: "07 号维修区有一根线缆同时牵着两个本不该亮起的站牌。交班铃已经响过一次，你只能先处理一端。",
    choices: [
      { id: "restore", label: "接回旧编号线" },
      { id: "isolate", label: "隔离陌生站牌" },
    ],
    outcomes: {
      restore: { title: "旧序归位", time: "00:19", relation: "秩序 +1 · 07 号灯列", copy: "你按褪色图纸接回旧编号。最远处的站牌重新亮起，缆线里传来一声迟到多年的报站；陌生站牌则安静地暗下去。", record: "你先让可被确认的归途恢复了原样，把无法归类的光留给下一班维修员。" },
      isolate: { title: "余光封存", time: "00:19", relation: "余光 +1 · 无名站牌", copy: "你把会亮的陌生站牌单独接入检修回路。旧编号线短暂失去光亮，但站牌背后浮出一行从未登记过的目的地。", record: "你没有急着修正异常，而是替它留下了一次被记录的机会。" },
    },
  },
  ISFJ: {
    title: "第一夜：末班之后",
    time: "00:13",
    sceneImage: "/assets/galgame-fog-lamp-first-night.png",
    prompt: "停运月台的车灯亮了两次。栏杆后的孩子在叫“姐姐”，而候车者脚边的雾灯正要熄灭。今夜只能先回应一个方向。",
    choices: [
      { id: "gate", label: "先去关门处" },
      { id: "lamp", label: "留灯给候车者" },
    ],
    outcomes: {
      gate: { title: "门后的回应", time: "00:21", relation: "微光 +1 · 无名小孩", copy: "你把雾灯压低，走到紧闭的安全门前。门后的孩子没有再叫，只把一张湿透的旧车票从栏杆间递出来。票根背面写着：请替我把灯留给还在等的人。", record: "你没有打开安全门，却让门后的影子知道自己仍被听见。" },
      lamp: { title: "留灯的人", time: "00:21", relation: "微光 +1 · 候车者", copy: "你把灯留在候车者脚边。她终于抬起头，说自己在等一班没有编号的车。雾里传来孩子的轻敲声，而灯光替你回答：这里还有人没有离开。", record: "你没有追赶门后的声音，却替站台留下了一处不会熄灭的等待。" },
    },
  },
  INFJ: {
    title: "第一夜：未署名的告别",
    time: "00:11",
    prompt: "失物室最深处的柜格自行打开，里面放着一封没有收件人的告别信，和一把齿纹完全相反的钥匙。清晨前只能先归档一样。",
    choices: [
      { id: "letter", label: "封存未署名的信" },
      { id: "key", label: "追查反向钥匙" },
    ],
    outcomes: {
      letter: { title: "被保留的话", time: "00:24", relation: "静默 +1 · 寄信人", copy: "你把信放进恒温柜，没有拆开。柜门合上时，纸页从里面轻轻敲了两下，像有人终于得到允许，可以不必把话说完。", record: "你守住了一句没有去处的话，也让它不必马上消失。" },
      key: { title: "门外的钥匙", time: "00:24", relation: "线索 +1 · 反向门", copy: "你用钥匙比对所有门锁，最终在地下走廊尽头找到一扇从墙面背后开向失物室的门。信仍留在桌上，却多了一道陌生的折痕。", record: "你选择追着谜团向前走，而告别已悄悄为自己找到了入口。" },
    },
  },
  INTJ: {
    title: "第一夜：潮位之外",
    time: "00:17",
    prompt: "旧档案室的潮水倒灌到第三层。一本记录明日涨潮的册子先浮了起来，另一只抽屉正浸着今天尚未盖章的名单。",
    choices: [
      { id: "forecast", label: "先核对明日潮册" },
      { id: "seal", label: "先封存当夜名单" },
    ],
    outcomes: {
      forecast: { title: "提前一日的页码", time: "00:29", relation: "预见 +1 · 潮位册", copy: "你翻开明日的记录，发现潮水会在没有月亮的夜里绕开档案室。最后一页写着你的笔迹，却没有写明你何时来过。", record: "你把未来当作一份待核实的资料，也为今夜留下新的变量。" },
      seal: { title: "当夜封条", time: "00:29", relation: "封存 +1 · 无名名单", copy: "你先盖好名单。潮水退去后，每一个名字都还在，唯独最末一栏出现了明日的日期，像有人已替你安排了下一班。", record: "你先守住眼前能够确认的事实，未知的潮声则被封在门外。" },
    },
  },
  ISTP: {
    title: "第一夜：门缝回路",
    time: "00:09",
    prompt: "四层的门铃和九层的走廊灯同时断路。墙后的黑影不断递来一截发热铜线，电箱里却只剩一个空的接口。",
    choices: [
      { id: "bell", label: "接回四层门铃" },
      { id: "lamp", label: "点亮九层走廊" },
    ],
    outcomes: {
      bell: { title: "有人应门", time: "00:18", relation: "回声 +1 · 四层住户", copy: "你把铜线压进门铃回路。门内没有人开门，门铃却响出三短一长的回应；黑影把剩下的线收回墙后，像完成了一次交接。", record: "你让一段失联的回应重新抵达，却仍不知道门后是谁在值班。" },
      lamp: { title: "楼道亮起", time: "00:18", relation: "照明 +1 · 九层住户", copy: "你把接口留给走廊灯。长廊亮起后，墙上出现一串从未安装过的门牌；最远处那扇门下，黑影正在替你拧紧另一块面板。", record: "你先让看得见的路恢复照明，也让一位看不见的同事继续工作。" },
    },
  },
  ISFP: {
    title: "第一夜：黑伞未合",
    time: "00:16",
    prompt: "雨棚下有一把正在自行渗水的黑伞，伞骨断在第七节；另一位淋湿的旅人不肯进店，只盯着你手里的最后一卷银线。",
    choices: [
      { id: "mend", label: "缝合渗水的黑伞" },
      { id: "shelter", label: "替旅人撑起旧伞" },
    ],
    outcomes: {
      mend: { title: "雨被收好", time: "00:27", relation: "雨幕 +1 · 黑伞", copy: "你把银线穿过第七节伞骨。黑伞终于合上，伞面里传来遥远的雷声；旅人朝你点头，像早已知道这场雨该被留下。", record: "你修复了一场无处安放的雨，也保住了它不落到别人的夜里。" },
      shelter: { title: "同行一段", time: "00:27", relation: "温度 +1 · 无名旅人", copy: "你撑起旧伞送旅人穿过街口。雨没有停，但伞下干燥得像未下过雨；回头时，黑伞已经自己收好了最后一滴水。", record: "你把最后一卷线留给了同行的人，雨也为此暂时放慢了脚步。" },
    },
  },
  INFP: {
    title: "第一夜：纸月的缺口",
    time: "00:14",
    prompt: "河市的风吹散了一轮纸月。篮子里有一片写着愿望的碎纸，河面上则漂来一艘没有灯芯的小船。",
    choices: [
      { id: "fold", label: "折好写愿望的碎片" },
      { id: "boat", label: "给小船留一束月光" },
    ],
    outcomes: {
      fold: { title: "愿望的折痕", time: "00:26", relation: "月影 +1 · 写愿望的人", copy: "你把碎片折成一只小鸟。它没有飞远，只停在篮沿，对着河面轻轻发亮；小船顺水而去，带走一段无人认领的叹息。", record: "你没有替愿望决定方向，只让它拥有了可以停歇的形状。" },
      boat: { title: "无灯的船", time: "00:26", relation: "漂流 +1 · 河面来客", copy: "你把一束纸月光放进小船。船立刻亮起来，照出河底一条未被绘入地图的巷子；篮中的碎片则自动拼成一道小小的缺口。", record: "你让一条陌生的路被看见，也替月亮留下一处可以想象的空白。" },
    },
  },
  INTP: {
    title: "第一夜：第九层的螺丝",
    time: "00:12",
    prompt: "泵房压力表停止跳动，桌上那枚用途未定的螺丝却开始轻轻震动。井底传来规律敲击，像一台等待拆开的机器。",
    choices: [
      { id: "gauge", label: "重启压力表" },
      { id: "screw", label: "拆开震动的螺丝" },
    ],
    outcomes: {
      gauge: { title: "读数归零", time: "00:25", relation: "结构 +1 · 第九层泵房", copy: "你让压力表重新跳动。所有读数都指向零，唯独最后一格显示“仍在运转”；井底的敲击停止，好像有人满意地记下了结果。", record: "你先让系统重新说话，却让它留下了一句尚无法解释的结论。" },
      screw: { title: "未命名零件", time: "00:25", relation: "谜题 +1 · 井底机器", copy: "你拆开螺丝，里面卷着极细的旧图纸。图纸画的是泵房本身，却多出一层不存在的地下室；压力表在此刻自行归零。", record: "你选择打开问题本身，下一层结构也因此向你露出了一点边缘。" },
    },
  },
  ESTP: {
    title: "第一夜：雨地新印",
    time: "00:05",
    prompt: "巡界亭外刚出现一串新脚印，方向直指芦苇深处；与此同时，村界篱门被风吹开，门外站着一只没有影子的羊。",
    choices: [
      { id: "tracks", label: "追进芦苇查脚印" },
      { id: "gate", label: "先守住村界篱门" },
    ],
    outcomes: {
      tracks: { title: "芦苇里的回跑", time: "00:17", relation: "猎风 +1 · 新脚印", copy: "你踩着湿泥一路追进芦苇，脚印在水边突然变成两列，一列回村，一列继续向雾里跑。那只羊在远处叫了一声，像在催你做选择。", record: "你追上了异常最先出现的方向，也替村界留下了一条尚未关闭的路。" },
      gate: { title: "篱门归位", time: "00:17", relation: "边界 +1 · 无影羊", copy: "你把篱门扣好，无影羊安静地卧在门外。它蹄下的泥水慢慢凝成脚印，全部朝着村内，仿佛有人刚刚从这里走出去。", record: "你先稳住了边界，脚印的来处则被夜雨暂时洗去。" },
    },
  },
  ESFP: {
    title: "第一夜：雨巷回信",
    time: "00:20",
    prompt: "一封没有地址的信在你掌心发热，巷口唯一亮着的窗却刚熄灯。与此同时，路边水洼倒映出另一扇仍在等信的窗。",
    choices: [
      { id: "window", label: "敲亮巷口的窗" },
      { id: "reflection", label: "投进水洼的倒影" },
    ],
    outcomes: {
      window: { title: "迟到的投递", time: "00:33", relation: "灯火 +1 · 巷口住户", copy: "你轻敲玻璃，窗重新亮起。一只手从帘后接走信封，没有问寄件人；雨声忽然小了，像整条巷子都在等这次开门。", record: "你把一封迟到的信送进现实的窗，也让夜晚短暂地有了回应。" },
      reflection: { title: "水面收件人", time: "00:33", relation: "倒影 +1 · 无址来信", copy: "你把信放进水洼，信封没有下沉，反而在倒影中被一只手接走。巷口的窗依旧熄着，里面却多出一盏很小的灯。", record: "你相信了另一扇窗的存在，也让回信有了不必被看见的路径。" },
    },
  },
  ESTJ: {
    title: "第一夜：空白票根",
    time: "00:08",
    prompt: "停运月台上排起三位乘客，其中一人的票根空白，另一人的目的地被雨水洗掉。检票钟将在一分钟后敲响。",
    choices: [
      { id: "blank", label: "先核验空白票根" },
      { id: "route", label: "先查洗掉的目的地" },
    ],
    outcomes: {
      blank: { title: "未写的站名", time: "00:22", relation: "规程 +1 · 空白乘客", copy: "你按规程把空白票根置入检票机。机器没有打孔，却吐出一张补票，上面写着“尚未决定”；三位乘客都安静地等着你的下一步。", record: "你先处理了最不合规则的票，也替它争取到一次被正式记录的资格。" },
      route: { title: "雨中的终点", time: "00:22", relation: "调度 +1 · 失站乘客", copy: "你用站台旧图比对残留墨迹，找回了被洗掉的目的地。检票钟敲响时，空白票根自行浮出一个站名，正是那条线路的下一站。", record: "你先让路线恢复明确，空白也因此在秩序中找到了自己的位置。" },
    },
  },
  ESFJ: {
    title: "第一夜：找零之外",
    time: "00:15",
    prompt: "无名便利店的队伍只剩最后两人。一枚多出来的硬币在托盘上不停旋转，玻璃里的收银员却对你比出“先照顾他”的手势。",
    choices: [
      { id: "customer", label: "先替客人算完找零" },
      { id: "mirror", label: "先回应玻璃里的同事" },
    ],
    outcomes: {
      customer: { title: "多出的一枚", time: "00:28", relation: "照应 +1 · 夜归客", copy: "你把找零一枚枚数清，夜归客终于松了口气。那枚多出来的硬币滚进玻璃底边，里面的收银员替你把下一位的账单摊平。", record: "你先照顾了眼前的人，也让另一侧的同事替你守住片刻柜台。" },
      mirror: { title: "玻璃里的手势", time: "00:28", relation: "同伴 +1 · 倒影收银员", copy: "你按玻璃里的手势把硬币放回托盘。倒影中的同事替你微笑，队伍里的夜归客却先递来一张写着“谢谢”的小票。", record: "你回应了看不见的协作，也让柜台两边都没有人被落下。" },
    },
  },
  ENFJ: {
    title: "第一夜：红线来信",
    time: "00:10",
    prompt: "疗养院长廊起了浓雾。一个带红线的信封卡在门缝里，走廊尽头还有三名不敢前进的来客在等你的灯笼。",
    choices: [
      { id: "guide", label: "先带来客穿过雾廊" },
      { id: "letter", label: "先安置红线来信" },
    ],
    outcomes: {
      guide: { title: "雾廊列队", time: "00:23", relation: "引导 +1 · 三名来客", copy: "你把灯笼举高，三名来客跟着光穿过走廊。红线信封在身后轻轻震动，却没有被拆开；雾散时，每个人都记得下一扇门的位置。", record: "你先把犹豫的人带向前方，也让未知的信继续等待合适的手。" },
      letter: { title: "未拆的讯息", time: "00:23", relation: "托付 +1 · 红线信", copy: "你把信封放进灯笼下的木盒，红线慢慢松开成一条指路的细光。三名来客沿着光自行走来，没人问信里写了什么。", record: "你没有替任何人揭开答案，却把它变成了一条能让大家同行的路。" },
    },
  },
  ENTJ: {
    title: "第一夜：失准的钟面",
    time: "00:06",
    prompt: "北塔钟楼有一枚齿轮拒绝转动，城南的街钟因此快了七分钟；同一时刻，主钟的指针正慢慢指向一个不存在的十三点。",
    choices: [
      { id: "gear", label: "强制校正拒转齿轮" },
      { id: "thirteen", label: "追查第十三点" },
    ],
    outcomes: {
      gear: { title: "七分钟归还", time: "00:30", relation: "时序 +1 · 城南街钟", copy: "你锁住主轴，强制让齿轮归位。城南的街钟同时慢下七分钟，十三点却被压进钟面背后，像一段尚未获准使用的时间。", record: "你先让整座城恢复同一节拍，把额外的时间留作下一次检修的风险。" },
      thirteen: { title: "多出的一刻", time: "00:30", relation: "变数 +1 · 北塔钟面", copy: "你放过拒转的齿轮，沿着指针追到钟面背后。那里有一条只在十三点出现的检修梯，城南的街钟则继续快着七分钟。", record: "你选择保留变数的入口，也承担了让既定秩序暂时偏移的代价。" },
    },
  },
  ENTP: {
    title: "第一夜：未标价的镜子",
    time: "00:18",
    prompt: "镜摊上有一面未标价的镜子，它照出的不是客人，而是三种不同的离开方式。外面有人正问你：这面镜子卖不卖？",
    choices: [
      { id: "sell", label: "把镜子卖给提问的人" },
      { id: "test", label: "先替它试一次反光" },
    ],
    outcomes: {
      sell: { title: "成交的岔路", time: "00:31", relation: "交易 +1 · 镜前客人", copy: "你报出一个会随提问改变的价格。客人笑着买下镜子，镜中三种离开方式却只剩两种；摊位后多出一张写着你名字的收据。", record: "你把选择交给了愿意付价的人，也让自己的可能性被悄悄记了一笔。" },
      test: { title: "反光实验", time: "00:31", relation: "折光 +1 · 未标价镜", copy: "你把镜子对准巷口的路灯。镜里出现第四条离开方式：留在摊位后继续卖镜子。客人没有催促，只等你先笑出声。", record: "你没有急着成交，而是为问题多增加了一条可供讨论的答案。" },
    },
  },
  ENFP: {
    title: "第一夜：萤群换乘",
    time: "00:22",
    prompt: "乡道候车亭没有线路图，雨后的萤群却飞成两条方向：一条追着一辆无班次的旧巴士，另一条围住一名不知该往哪里走的陌生旅人。",
    choices: [
      { id: "bus", label: "追上无班次旧巴士" },
      { id: "traveler", label: "把萤群分给旅人" },
    ],
    outcomes: {
      bus: { title: "没有站牌的车", time: "00:37", relation: "远路 +1 · 旧巴士", copy: "你追上旧巴士，把萤群引到车窗边。车门没有完全打开，只留下一张会变换终点的车票；旅人站在候车亭，朝你挥了挥手。", record: "你跟随了最先亮起的可能，也替下一段旅程留下了一张尚未确定的票。" },
      traveler: { title: "借一束萤火", time: "00:37", relation: "同行 +1 · 迷路旅人", copy: "你把一半萤火放进旅人掌心。旧巴士从雨里驶过，没有停靠，却在远处亮起第二次尾灯；旅人说，他现在知道该去哪里等。", record: "你把光分给了需要方向的人，也让错过的车变成了可被期待的下一班。" },
    },
  },
};

const ending = (status, title, time, relation, copy, record) => ({ status, title, time, relation, copy, record });

const nightExpansions = {
  ISTJ: {
    rule: "未登记线路亮起第三次前，不得把它跨接进旧回路。",
    firstSafe: "restore",
    turn: { title: "第二段：回路回声", dependsOn: 0, promptByChoice: { restore: "旧编号线恢复稳定，陌生站牌却在封闭区闪了第二次。它正向检修台发送一个没有来源的报码。", isolate: "你把陌生站牌留在独立回路，它开始发送低频报码。旧编号线则在黑暗中等待下一次合闸。" }, choices: [{ id: "tag", label: "贴上红封条，记录报码", safety: 1 }, { id: "bridge", label: "直接跨接两条线路", safety: 0 }] },
    final: { title: "第三段：交班临界", dependsOn: 1, promptByChoice: { tag: "红封条把报码固定成一串站名。交班车正在靠近，最末一个站名仍未被登记。", bridge: "跨接后的线路短暂安静，电箱里却多出一道温热的影子。交班车正在靠近。" }, choices: [{ id: "report", label: "把异常写入交班簿", safety: 1 }, { id: "follow", label: "跟着影子走入封闭区", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：编号留白", "00:41", "秩序 +2 · 07 号灯列", "你按流程封存了未登记的站名。交班车驶过时，陌生站牌只亮起一次，像在认可自己暂时可以留在记录之外。", "你带着完整交班簿离开维修区；有些异常被保留下来，不等于它们被放任。"), death: ending("死亡", "死亡结局：无编号交接", "00:41", "失联 · 封闭区", "你越过红封条后，所有线路都开始报出你的工号。等交班车抵达，检修台上只剩一张还在缓慢出票的空白编号牌。", "彼界记录显示：维修员未在交班时间返回。它的工号被列为“待确认”。") },
  },
  ISFJ: {
    rule: "雾灯熄灭前，不能同时回应门后的呼唤与站台上的等待。",
    firstSafe: "lamp",
    turn: { title: "第二段：灯影分岔", dependsOn: 0, promptByChoice: { gate: "安全门后的孩子递出旧车票。候车者脚边的雾灯已只剩一缕火，你听见两处都在等回答。", lamp: "雾灯稳住了候车者的影子，安全门后却传来三次轻敲。她把一枚旧车票推到你脚边。" }, choices: [{ id: "signal", label: "用灯光回应，不开安全门", safety: 1 }, { id: "open", label: "推开尚未解锁的安全门", safety: 0 }] },
    final: { title: "第三段：末班临站", dependsOn: 1, promptByChoice: { signal: "灯光在雾中折成一条细线，指向候车者等待的无编号列车。她问你：这盏灯是否该带上车？", open: "门后没有站台，只有一段向下延伸的楼梯。候车者的灯在远处最后闪了一下。" }, choices: [{ id: "stay", label: "把灯留在站台，等列车靠岸", safety: 1 }, { id: "descend", label: "提灯进入门后的楼梯", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：灯未熄灭", "00:44", "微光 +2 · 候车者", "无编号列车停在雾外，却没有催促任何人。你把灯留在站台，候车者因此记起自己该在哪一站下车。", "你在末班驶离后完成交班。雾灯仍为后来的人亮着。"), death: ending("死亡", "死亡结局：门后的末班", "00:44", "失联 · 未解锁门", "你跟着门后的声音离开月台。第二天清晨，安全门仍然锁着，只有一盏雾灯在栏杆内侧等着下一位引路员。", "彼界记录显示：引路员未回到 03 号台；其雾灯已被列入失物。") },
  },
  INFJ: {
    rule: "失物可以暂存，不能替失主打开最后一层抽屉。",
    firstSafe: "letter",
    turn: { title: "第二段：柜格低语", dependsOn: 0, promptByChoice: { letter: "告别信被封进恒温柜，反向钥匙却在抽屉里转了半圈。走廊尽头那扇门开始轻响。", key: "你找到一扇从墙背后开来的门。信封仍在桌上，封口多出一道像指纹的折痕。" }, choices: [{ id: "log", label: "登记钥匙的来源与温度", safety: 1 }, { id: "unlock", label: "用钥匙试开墙后门", safety: 0 }] },
    final: { title: "第三段：归还时间", dependsOn: 1, promptByChoice: { log: "登记簿自动写下失主的名字，又立刻被水汽抹去。上层柜格里传来一声轻轻的叹息。", unlock: "墙后门开出一条窄缝，里面摆着与你相同的保管桌。那封信正在另一侧等待被拆开。" }, choices: [{ id: "return", label: "把钥匙放回最深柜格", safety: 1 }, { id: "enter", label: "走进墙后的保管室", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：未寄出的告别", "00:46", "静默 +2 · 寄信人", "你没有替任何人拆信，只让钥匙回到等待它的柜格。清晨前，恒温柜的雾气散去，留下一个被好好保存的名字。", "你完成了保管，而不是替别人完成告别。"), death: ending("死亡", "死亡结局：替身保管员", "00:46", "失联 · 墙后柜室", "你走进墙后的保管室，里面的那位保管员抬头微笑。原来的失物室照常开门，只是柜台后再也没有人记得你的声音。", "彼界记录显示：保管员已被另一侧的同事接替。") },
  },
  INTJ: {
    rule: "未盖章的未来记录不能作为当夜行动依据。",
    firstSafe: "seal",
    turn: { title: "第二段：逆潮页码", dependsOn: 0, promptByChoice: { forecast: "明日潮册写着你的笔迹。今天的名单已被水浸到最后一栏，潮水仍在向内倒退。", seal: "你先封好了名单。明日潮册却在桌上自行翻页，标出一条本不该存在的撤离路线。" }, choices: [{ id: "compare", label: "比对旧档，不改动未来册", safety: 1 }, { id: "rewrite", label: "直接修改明日潮册", safety: 0 }] },
    final: { title: "第三段：最后印章", dependsOn: 1, promptByChoice: { compare: "旧档与未来册只有一个差异：今晚的你仍在档案室。空白印章正被潮水推到手边。", rewrite: "被改过的页码开始渗出海水，所有抽屉同时打开，像在等待你给出新的分类。" }, choices: [{ id: "archive", label: "封存差异，留下注记", safety: 1 }, { id: "stamp", label: "在空白页盖下终章", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：潮位已注记", "00:48", "封存 +2 · 潮位册", "你把差异留在注记里，没有强迫未来立刻服从。潮水在门槛前退去，明日潮册也终于合上。", "你带着可追溯的记录离开，未来仍保留被再次验证的权利。"), death: ending("死亡", "死亡结局：空白页归档", "00:48", "失联 · 潮下档案室", "终章印落下的一刻，抽屉依次合拢。清晨的档案室整齐如常，只有一页新记录写着：档案员已被潮位收录。", "彼界记录显示：当夜归档员未离开潮位以下区域。") },
  },
  ISTP: {
    rule: "门缝另一侧递来的线，只能接入看得见的回路。",
    firstSafe: "lamp",
    turn: { title: "第二段：电箱余温", dependsOn: 0, promptByChoice: { bell: "四层门铃响出三短一长，九层走廊仍黑着。墙后黑影递来第二截更热的铜线。", lamp: "九层长廊亮起，墙上多出未安装的门牌。四层的门铃则开始重复三短一长。" }, choices: [{ id: "test", label: "用测试笔确认回路", safety: 1 }, { id: "splice", label: "徒手接入墙后铜线", safety: 0 }] },
    final: { title: "第三段：门牌之外", dependsOn: 1, promptByChoice: { test: "测试笔只在看得见的线路上亮起。最远处那扇无号门下，有人把你的工具箱推了回来。", splice: "墙后铜线接通后，所有门铃同时响起。电箱里出现一个本不属于这层楼的“开门”按钮。" }, choices: [{ id: "disconnect", label: "断开未知支路后交班", safety: 1 }, { id: "press", label: "按下电箱的开门按钮", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：可见回路", "00:39", "照明 +2 · 九层住户", "你断开未知支路，走廊灯稳定下来。工具箱里多了一张没有房号的维修单，署名是“墙内同事”。", "你没有追进门缝，而是让能被确认的住户重新看清回家的路。"), death: ending("死亡", "死亡结局：门缝接替", "00:39", "失联 · 无号门", "你按下开门按钮后，走廊所有灯都熄了。次日有人听见门缝里传来熟悉的检修声，却再也没见到原来的接线员。", "彼界记录显示：接线员的工位已由墙内回路占用。") },
  },
  ISFP: {
    rule: "缝合中的黑伞不能完全撑开，也不能交给陌生的雨。",
    firstSafe: "mend",
    turn: { title: "第二段：伞下回声", dependsOn: 0, promptByChoice: { mend: "第七节伞骨重新闭合，伞面里却仍传来异地的雷声。旅人站在雨棚外，没有再催你。", shelter: "旧伞替旅人挡住了雨，黑伞则在摊位上自己张开一条细缝，露出银线的另一端。" }, choices: [{ id: "bind", label: "把银线系回第七节", safety: 1 }, { id: "open", label: "撑开黑伞查看里面", safety: 0 }] },
    final: { title: "第三段：雨棚尽头", dependsOn: 1, promptByChoice: { bind: "银线收紧，雷声被困在伞骨间。旅人递来一枚干燥的纽扣，说雨马上会换一个方向。", open: "黑伞里没有雨，只有一条通向陌生街道的巷子。旅人站在伞外，像在等待你先迈进去。" }, choices: [{ id: "close", label: "合伞入柜，护送旅人离开", safety: 1 }, { id: "step", label: "走进伞内的陌生街道", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：雨被收好", "00:45", "雨幕 +2 · 无名旅人", "你把黑伞合好，雨也从雨棚外慢慢退去。旅人离开时把纽扣留在桌上，像一枚不会生锈的谢意。", "你保存了不属于此地的雨，也没有让任何人独自走进它。"), death: ending("死亡", "死亡结局：伞内街区", "00:45", "失联 · 黑伞", "你踏进伞内的街道，身后的雨棚立刻消失。摊位第二天照常开着，只多了一把伞骨完整、仍在滴水的黑伞。", "彼界记录显示：缝补匠最后一次目击发生在伞面内侧。") },
  },
  INFP: {
    rule: "纸月可以折成路标，不能被用来照亮河底的门。",
    firstSafe: "fold",
    turn: { title: "第二段：河岸微航", dependsOn: 0, promptByChoice: { fold: "纸鸟停在篮沿，河面的小船已漂向未绘入地图的巷子。它的船尾留下细细的月光。", boat: "小船亮起后照出河底的巷口。篮中的纸月却少了一片，风把缺口吹向你的脚边。" }, choices: [{ id: "mark", label: "把月光折成河岸路标", safety: 1 }, { id: "dive", label: "沿月光潜向河底门", safety: 0 }] },
    final: { title: "第三段：缺口归处", dependsOn: 1, promptByChoice: { mark: "路标一盏盏亮起，纸鸟却衔回一张没有写完的愿望。远处有人正循着光往岸上走。", dive: "河底门后传来许多愿望的低语。那张碎纸在水中展开，像在邀请你把自己的名字补上。" }, choices: [{ id: "leave", label: "把愿望放回篮中，不署名", safety: 1 }, { id: "sign", label: "在碎纸上写下自己的名字", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：月影靠岸", "00:43", "月影 +2 · 河市来客", "你让愿望保持未完成的样子。循光而来的人找到河岸，纸月也慢慢拼回夜空，只留下一道温柔缺口。", "你没有替愿望决定主人，因而仍能带着自己的影子回家。"), death: ending("死亡", "死亡结局：愿望署名", "00:43", "失联 · 河底门", "名字写下后，河面所有纸月同时熄灭。翌日河岸只剩一只发光小船，船票上写着一个无人再能念出的名字。", "彼界记录显示：拾荒者被列入未完成愿望。") },
  },
  INTP: {
    rule: "第九层任何未命名零件，都不能在压力表归零前装回机器。",
    firstSafe: "gauge",
    turn: { title: "第二段：井底读数", dependsOn: 0, promptByChoice: { gauge: "压力表恢复跳动，却始终停在“仍在运转”。那枚螺丝震出一张极细的地下图纸。", screw: "螺丝里卷着多一层地下室的图纸，压力表自行归零。井底敲击声变得像有人在数数。" }, choices: [{ id: "catalog", label: "把图纸编号后封入样本盒", safety: 1 }, { id: "install", label: "把螺丝装进未知接口", safety: 0 }] },
    final: { title: "第三段：第十层假设", dependsOn: 1, promptByChoice: { catalog: "样本盒里多出一枚相同螺丝。井底的敲击停在第九下，像在等你承认不存在第十层。", install: "接口吞下螺丝，墙面出现向下的检修梯。压力表开始显示一个不可能的负数。" }, choices: [{ id: "shutdown", label: "关闭泵房，带样本上报", safety: 1 }, { id: "descend", label: "沿不存在的检修梯下行", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：假设暂存", "00:42", "结构 +2 · 第九层泵房", "你把未知零件留在样本盒，泵房恢复到可解释的安静。第十层是否存在，成为一份有待下次验证的假设。", "你没有让好奇心替代检修程序，因此带着问题安全返回地面。"), death: ending("死亡", "死亡结局：负数楼层", "00:42", "失联 · 第十层", "你沿着不该存在的检修梯下行。第二天压力表重新跳动，读数稳定为零；只有工具箱少了一枚用途未定的螺丝。", "彼界记录显示：拆解员最后一次工作地点无法标注。") },
  },
  ESTP: {
    rule: "巡界时，脚印可以追，但篱门不能无人守到第三声风响。",
    firstSafe: "gate",
    turn: { title: "第二段：风响三次", dependsOn: 0, promptByChoice: { tracks: "芦苇中的脚印分成两列，篱门在身后第二次被风撞响。无影羊正站在雨里看你。", gate: "你扣好篱门，无影羊卧在门外。芦苇里那串新脚印却开始朝你所在的巡界亭靠近。" }, choices: [{ id: "whistle", label: "吹响巡界哨，标记方位", safety: 1 }, { id: "run", label: "不留标记冲进芦苇", safety: 0 }] },
    final: { title: "第三段：边界回返", dependsOn: 1, promptByChoice: { whistle: "哨声把脚印定在界桩外。无影羊抬起头，蹄下出现一条通回巡界亭的干路。", run: "你冲进芦苇后，脚印在四面八方响起。篱门的第三声风响从很远处传来。" }, choices: [{ id: "return", label: "沿界桩回亭登记", safety: 1 }, { id: "cross", label: "越过无影羊的界线", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：边界仍在", "00:36", "边界 +2 · 无影羊", "你沿界桩返回，脚印停在雨地外。无影羊在篱门前卧下，像替你完成了剩余的半班巡逻。", "你带着清楚的方位回到巡界亭，边界也仍有名字可叫。"), death: ending("死亡", "死亡结局：第七步之后", "00:36", "失联 · 芦苇巡界", "你跨过无影羊的界线，脚印忽然少了一双。清晨人们在篱门外发现新的巡逻痕迹，却无法确认它属于谁。", "彼界记录显示：巡犬未在雨停前返回。") },
  },
  ESFP: {
    rule: "没有地址的信只能投给亮着的窗，不能投给水面先出现的倒影。",
    firstSafe: "window",
    turn: { title: "第二段：回信灯影", dependsOn: 0, promptByChoice: { window: "巷口的窗重新亮起，接信的手没有露面。水洼里的另一扇窗却把同一个名字倒映了三次。", reflection: "信在水面被接走，巷口窗仍熄着。雨里多出一盏小灯，像有人正从倒影那侧赶来。" }, choices: [{ id: "wait", label: "在亮窗外等待签收铃", safety: 1 }, { id: "call", label: "对水面念出收件人", safety: 0 }] },
    final: { title: "第三段：雨巷签收", dependsOn: 1, promptByChoice: { wait: "签收铃响了一次，窗帘后留下一张回执。远处的水洼慢慢恢复成普通雨水。", call: "名字落进水面后，整条巷子的窗都亮了。每一扇窗里都站着一个等待投递的影子。" }, choices: [{ id: "stamp", label: "盖章离开，不追问回信", safety: 1 }, { id: "enter", label: "走进最亮的那扇窗", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：雨声已签收", "00:51", "灯火 +2 · 巷口住户", "你把回执夹进邮袋，雨巷的灯一盏盏熄灭。那封信终于有了去处，也没有再要求你证明收件人的存在。", "你完成一次投递，仍带着自己的名字走出雨巷。"), death: ending("死亡", "死亡结局：倒影收件", "00:51", "失联 · 雨巷水面", "你对水面念出名字后，自己的倒影先接过了邮袋。次日巷口只剩一封新信，收件栏写着“下一位灯眼邮差”。", "彼界记录显示：邮差的最后一次签收发生在倒影窗口。") },
  },
  ESTJ: {
    rule: "空白票根须先登记；钟响后不得为任何乘客补写目的地。",
    firstSafe: "blank",
    turn: { title: "第二段：检票钟前", dependsOn: 0, promptByChoice: { blank: "检票机吐出一张写着“尚未决定”的补票。被洗掉目的地的乘客仍在等你核对。", route: "你找回了被洗掉的终点，空白票根却自行浮出一个陌生站名，检票钟已开始预响。" }, choices: [{ id: "queue", label: "按顺序登记三位乘客", safety: 1 }, { id: "rush", label: "跳过登记直接放行", safety: 0 }] },
    final: { title: "第三段：钟响之后", dependsOn: 1, promptByChoice: { queue: "三张票根已被编号，只有空白补票还没有目的地。钟声将在十秒后落下。", rush: "有人越过闸机，站台尽头多出一节没有门的车厢。空白票根在你手里开始发烫。" }, choices: [{ id: "hold", label: "暂扣空白票，关闭闸机", safety: 1 }, { id: "board", label: "持票登上无门车厢", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：闸机已落锁", "00:40", "规程 +2 · 末班站台", "你让所有可核验的乘客先行，空白票则被妥善暂扣。钟声落下时，车厢没有门，却也没有再带走任何人。", "你守住了流程，也为无法确认的目的地留下复查空间。"), death: ending("死亡", "死亡结局：无门车厢", "00:40", "失联 · 末班列车", "你跨过闸机进入无门车厢。列车没有发车的声音，只在次日的票务记录里多了一张已检票却没有乘客姓名的票根。", "彼界记录显示：检票员未在钟响后返岗。") },
  },
  ESFJ: {
    rule: "找零必须留在托盘可见处；玻璃里的同事不能替你接待真实客人。",
    firstSafe: "customer",
    turn: { title: "第二段：托盘硬币", dependsOn: 0, promptByChoice: { customer: "夜归客收好零钱，托盘上却还旋着一枚多出的硬币。玻璃里的收银员对你摇了摇头。", mirror: "你回应玻璃里的同事，夜归客安静等着。那枚硬币忽然停住，正好挡住了找零的金额。" }, choices: [{ id: "count", label: "当着客人面重新点数", safety: 1 }, { id: "pass", label: "把硬币递给玻璃里的手", safety: 0 }] },
    final: { title: "第三段：闭店铃响", dependsOn: 1, promptByChoice: { count: "金额重新对上，夜归客留下小票。玻璃里的同事把最后一盏柜台灯指向门口。", pass: "硬币穿过玻璃后，倒影那边排起了长队。真实店门却在你身后悄悄锁上。" }, choices: [{ id: "close", label: "结清当班账目，送客离店", safety: 1 }, { id: "serve", label: "转身服务玻璃里的队伍", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：账目相符", "00:47", "照应 +2 · 夜归客", "你结清了每一枚硬币，也让最后一位夜归客在闭店铃前离开。玻璃里的同事向你点头，随后随灯光淡去。", "你把照顾留给了现实柜台，也守住了自己该站的位置。"), death: ending("死亡", "死亡结局：倒影夜班", "00:47", "失联 · 玻璃柜台", "你转身接待玻璃里的长队。第二天便利店照常营业，玻璃里多了一名微笑得恰到好处的收银员。", "彼界记录显示：原收银员的工牌仍在托盘上。") },
  },
  ENFJ: {
    rule: "红线来信可以安置，不能替收信人拆读；灯笼必须照见同行者。",
    firstSafe: "guide",
    turn: { title: "第二段：雾廊并行", dependsOn: 0, promptByChoice: { guide: "三名来客跟在灯笼后，红线信封在身后轻震。最慢的那一位开始看不见前方的门。", letter: "红线化成细光，三名来客沿光走来。最慢的那一位却被雾留在第二扇门前。" }, choices: [{ id: "group", label: "停下整队，等最慢的人", safety: 1 }, { id: "split", label: "分开队伍各自前行", safety: 0 }] },
    final: { title: "第三段：晨雾门牌", dependsOn: 1, promptByChoice: { group: "所有人重新聚在灯下。红线指向一扇没有门牌的房门，里面传来未拆信封的轻响。", split: "雾廊吞没了两道背影。你的灯笼仍亮着，但只照见一扇扇自己打开的门。" }, choices: [{ id: "knock", label: "在门外放下信，带队离开", safety: 1 }, { id: "read", label: "拆开红线信封寻找答案", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：同行抵达", "00:49", "引导 +2 · 三名来客", "你让所有人一起走过晨雾，把信留给真正的门后之人。雾散时，三名来客都记得彼此的名字。", "你没有替任何人选择答案，却带着大家抵达了能够选择的地方。"), death: ending("死亡", "死亡结局：雾中传令", "00:49", "失联 · 无牌房门", "你拆开信封后，灯笼熄成一缕红线。第二天雾廊仍有人听见熟悉的传令声，却再也看不见举灯的人。", "彼界记录显示：传令官的灯笼已被归入无主物品。") },
  },
  ENTJ: {
    rule: "校时可暂停，不能为了追赶一刻钟而让主轴失去锁定。",
    firstSafe: "gear",
    turn: { title: "第二段：主轴偏移", dependsOn: 0, promptByChoice: { gear: "拒转齿轮已归位，十三点被压在钟面背后。城南街钟仍有七分钟的回差需要核验。", thirteen: "你看见十三点的检修梯，城南街钟继续快着七分钟。主轴开始发出不属于机械的心跳。" }, choices: [{ id: "lock", label: "锁定主轴，再核对街钟", safety: 1 }, { id: "force", label: "加速主轴强行补时", safety: 0 }] },
    final: { title: "第三段：报时之前", dependsOn: 1, promptByChoice: { lock: "主轴稳定下来，十三点的检修梯正在合拢。北塔外已有守夜人等你给出正常报时。", force: "补时让所有齿轮同时飞转，钟面背后的十三点开始向外渗光。守夜人催促你立刻报时。" }, choices: [{ id: "report", label: "按已校准时间报时", safety: 1 }, { id: "announce", label: "宣布第十三点开始", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：全城同刻", "00:35", "时序 +2 · 北塔钟楼", "你按校准后的时间报时，所有街钟依次归位。十三点没有消失，只被妥善锁进一段没人急着使用的时间。", "你选择稳定系统，也为未来的检修保留了可控的入口。"), death: ending("死亡", "死亡结局：第十三次钟响", "00:35", "失联 · 北塔钟面", "第十三声钟响穿过整座城，主轴停在你的报时声里。此后每个暴雨夜，钟楼都会多响一次，却无人能登上北塔。", "彼界记录显示：监工被编入下一轮钟响。") },
  },
  ENTP: {
    rule: "未标价的镜子可试照，不能在同一夜卖出两种互相矛盾的未来。",
    firstSafe: "test",
    turn: { title: "第二段：第四种离开", dependsOn: 0, promptByChoice: { sell: "客人带走镜子后，摊位后多出写着你名字的收据。剩下两种离开方式正在争论谁更真实。", test: "镜中出现第四种离开：留在摊位继续卖镜子。提问的客人笑着等你给它标价。" }, choices: [{ id: "label", label: "写下单一价码并封存副本", safety: 1 }, { id: "auction", label: "同时向两种未来叫价", safety: 0 }] },
    final: { title: "第三段：镜门合页", dependsOn: 1, promptByChoice: { label: "价签固定后，镜面只保留一条可走的巷子。客人问你是否愿意自己先走一遍。", auction: "两种未来同时成交，镜摊开始向内折叠。每面镜子里都有一个你在催促你做决定。" }, choices: [{ id: "close", label: "收摊封镜，明夜再谈", safety: 1 }, { id: "enter", label: "进入最会说服你的镜门", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：未售出的可能", "00:52", "折光 +2 · 未标价镜", "你在镜门合拢前收起价签。那面未标价的镜子仍在，但它终于允许明天再给出答案。", "你没有让新奇压过边界，因此仍能从自己的摊位后离开。"), death: ending("死亡", "死亡结局：镜门游商", "00:52", "失联 · 流动镜摊", "你走进最会说服你的镜门，镜外的摊位随即出现一位新游商。他学着你的声线，向下一个客人报出价格。", "彼界记录显示：原游商的去向有十六种版本，无一可核验。") },
  },
  ENFP: {
    rule: "萤火可以分给同行者，但不能全部带上无班次的车。",
    firstSafe: "traveler",
    turn: { title: "第二段：候车亭岔光", dependsOn: 0, promptByChoice: { bus: "旧巴士留下一张变换终点的车票，旅人仍在候车亭等雨停。萤群开始朝两边飞散。", traveler: "旅人握着半束萤火，旧巴士从远处亮起第二次尾灯。车票在雨里落到你脚边。" }, choices: [{ id: "map", label: "用萤火标出回程路标", safety: 1 }, { id: "board", label: "带着全部萤火追车", safety: 0 }] },
    final: { title: "第三段：无班次终点", dependsOn: 1, promptByChoice: { map: "路标一路亮向有人居住的方向。旧巴士停在远处，却没有再打开车门。", board: "萤火跟你上了车，候车亭彻底暗下。车票上的终点开始变成你刚才经过的每一个路口。" }, choices: [{ id: "wait", label: "留在路标旁等下一班", safety: 1 }, { id: "ride", label: "撕下车票继续向前", safety: 0 }] },
    endings: { survive: ending("存活", "存活结局：下一班可等", "00:54", "同行 +2 · 迷路旅人", "你把光留在能照见彼此的路上。旧巴士最终驶过，却没有带走任何尚未准备好的人。", "你没有追逐所有可能，因此仍有一条明确的路可以回返。"), death: ending("死亡", "死亡结局：无班次乘客", "00:54", "失联 · 乡道候车亭", "你撕下车票后，旧巴士终于开门。翌日候车亭只剩一群萤火，围着一张没有终点也没有姓名的车票。", "彼界记录显示：旅人的影子多等了一班车。") },
  },
};

const nightDeepening = {
  ISTJ: { firstThird: { id: "copy", label: "抄录两端站名后再合闸", safety: 1, detail: "先留下可复查的编号关系。" }, turnThird: { id: "listen", label: "切断报码，只保留单向监听", safety: 1, detail: "让异常继续发声，但不让它进入旧网。" }, finalThird: { id: "delay", label: "等交班鸣笛后再处理站名", safety: 0, detail: "把决定留给下一次可验证的时点。" }, closure: { title: "第四段：返程核验", dependsOn: 2, prompt: "交班车已进站。无论刚才选择了什么，检修台上都多出一张无法扫描的编号牌。", promptByChoice: { report: "交班簿已写明异常。那张无法扫描的编号牌正贴在封闭区的红线外。", follow: "你从封闭区退回时，编号牌已经扣在工具箱上，像在等你把它带离现场。", delay: "鸣笛后，编号牌自动吐出一串新的站名。它们全都没有出现在旧图纸上。" }, choices: [{ id: "handover", label: "把编号牌封袋交给交班员", safety: 1, detail: "让异常进入正式链路。" }, { id: "pocket", label: "把编号牌带回值班室复查", safety: 0, detail: "保留线索，但风险也被带离现场。" }, { id: "zone", label: "拿着编号牌折返封闭区", safety: 0, fatal: true, detail: "越过已标记的禁入线。" }] } },
  ISFJ: { firstThird: { id: "mark", label: "在雾里立下双灯光标", safety: 1, detail: "给两个方向都留下可回看的信号。" }, turnThird: { id: "broadcast", label: "用站台广播回应两处声音", safety: 1, detail: "不靠近，也不让任何一方被彻底忽略。" }, finalThird: { id: "ticket", label: "把旧车票压在雾灯下", safety: 0, detail: "留下请求的证物，暂不替它决定去处。" }, closure: { title: "第四段：返程点灯", dependsOn: 2, prompt: "列车的门终于打开一扇。灯下出现第二枚旧车票，站台与门后的声音都在等你交班。", promptByChoice: { stay: "你把灯留在站台，第二枚车票因此没有被风吹走。", descend: "你从楼梯回到月台，雾灯比先前更暗，车票却在你掌心发热。", ticket: "旧车票压住灯芯，门后的轻敲停止了一瞬。" }, choices: [{ id: "relieve", label: "把灯与车票交给下一位引路员", safety: 1, detail: "完整交接，保留站台的等待。" }, { id: "watch", label: "留在站台看列车离开", safety: 0, detail: "多守一会儿，但错过固定交班。" }, { id: "boardalone", label: "独自登上无编号列车", safety: 0, fatal: true, detail: "在没有记录的情况下离开站台。" }] } },
  INFJ: { firstThird: { id: "tag", label: "给信与钥匙分别贴上封存签", safety: 1, detail: "先承认两件失物都需要被保留。" }, turnThird: { id: "listen", label: "隔着门听完三次轻响", safety: 1, detail: "收集线索，不替失主做决定。" }, finalThird: { id: "note", label: "在登记簿留下未确认注记", safety: 0, detail: "让后续保管员能看见你的疑问。" }, closure: { title: "第四段：柜台交接", dependsOn: 2, prompt: "开站铃将响，墙后门与恒温柜同时安静下来。柜台上只剩一份没有签名的交接单。", promptByChoice: { return: "钥匙回到了最深柜格，交接单却多出一栏“失主是否到场”。", enter: "你从墙后柜室回来，手里多了一份与自己笔迹相同的交接单。", note: "未确认注记渗出浅雾，像在提醒下一班不要遗漏。" }, choices: [{ id: "sealhand", label: "注明未到场并锁好柜台", safety: 1, detail: "让保管继续，而不是擅自归还。" }, { id: "waitowner", label: "在空柜台前再等五分钟", safety: 0, detail: "给失主多一次出现的机会。" }, { id: "backroom", label: "带着交接单回到墙后门", safety: 0, fatal: true, detail: "再次进入无人授权的保管室。" }] } },
  INTJ: { firstThird: { id: "measure", label: "先测量潮位，再取两份记录", safety: 1, detail: "把未来册与当夜事实放在同一尺度。" }, turnThird: { id: "marktide", label: "在地面标出退潮线", safety: 1, detail: "为后续人员留下客观边界。" }, finalThird: { id: "holdstamp", label: "把空白印章装入防水盒", safety: 0, detail: "延后结论，不让印章替你决定。" }, closure: { title: "第四段：潮门封存", dependsOn: 2, prompt: "潮门即将关闭，未来册停在你面前。最后一页仍有一处空白，等待被定义或被保留。", promptByChoice: { archive: "差异已写入注记，空白页却浮出一个尚未发生的潮位。", stamp: "终章印的余墨在水面扩散，潮门开始比预期更早合拢。", holdstamp: "防水盒轻轻震动，像有一枚印章在里面要求被使用。" }, choices: [{ id: "locktide", label: "锁门并把空白页列为待核实", safety: 1, detail: "让未来保持可修订状态。" }, { id: "copyfuture", label: "抄走空白页，留门至交班", safety: 0, detail: "保住信息，但延长暴露时间。" }, { id: "wade", label: "带着未来册涉水去潮门外", safety: 0, fatal: true, detail: "离开已知防潮范围。" }] } },
  ISTP: { firstThird: { id: "isolate", label: "先拉下分区闸，逐路排查", safety: 1, detail: "把门铃与走廊灯拆回可验证的单元。" }, turnThird: { id: "photo", label: "拍下门牌后再合上电箱", safety: 1, detail: "留下异常门牌的证据。" }, finalThird: { id: "ask", label: "敲三下无号门，停在门外", safety: 0, detail: "测试回应，不跨过门缝。" }, closure: { title: "第四段：工具归位", dependsOn: 2, prompt: "电箱温度下降，工具箱却少了一把绝缘钳。无号门后传来有人把它放回地面的声音。", promptByChoice: { disconnect: "未知支路已断开，绝缘钳被推到红线前。", press: "开门按钮熄灭后，工具箱里多出一张没有楼层的维修单。", ask: "无号门只回应了三下敲击，绝缘钳仍在门缝内侧。" }, choices: [{ id: "retrieve", label: "用绝缘钩取回工具后离场", safety: 1, detail: "不伸手进入未知区域。" }, { id: "leavekit", label: "留下工具箱，登记缺失物", safety: 0, detail: "以工具换取安全撤离。" }, { id: "crawl", label: "从门缝钻入取回绝缘钳", safety: 0, fatal: true, detail: "让自己进入无法确认的回路。" }] } },
  ISFP: { firstThird: { id: "cover", label: "用雨棚布暂盖黑伞裂口", safety: 1, detail: "先止住异地雨的外泄。" }, turnThird: { id: "dry", label: "把银线与旅人的纽扣一起晾干", safety: 1, detail: "保留两件物品的来源关系。" }, finalThird: { id: "shelter", label: "请旅人在雨棚下等到雷声停", safety: 0, detail: "优先安置同行者，不继续拆伞。" }, closure: { title: "第四段：收伞时分", dependsOn: 2, prompt: "雨停后，黑伞伞柄下多出一张陌生街区的车票。旅人已在雨棚外等你决定如何收工。", promptByChoice: { close: "你已把黑伞合好，车票却在伞柄下反复变换街名。", step: "你从伞内街道退回，鞋边还带着不属于这里的干燥尘土。", shelter: "旅人等到雷声停，车票也终于不再变换。" }, choices: [{ id: "store", label: "把车票夹入伞套，锁进收纳柜", safety: 1, detail: "让未知地点等待下一次正式观测。" }, { id: "gift", label: "把车票交给旅人辨认", safety: 0, detail: "共享线索，也增加对方卷入的风险。" }, { id: "ridein", label: "撑开黑伞，按车票街名前行", safety: 0, fatal: true, detail: "主动进入伞内的异地雨。" }] } },
  INFP: { firstThird: { id: "count", label: "数清碎片，再把缺口留白", safety: 1, detail: "不急着补满一轮不属于自己的月亮。" }, turnThird: { id: "shore", label: "沿岸放下三盏纸灯", safety: 1, detail: "给来客与小船都留返回的光。" }, finalThird: { id: "hum", label: "对着河面哼完旧曲，不下水", safety: 0, detail: "回应低语，却不交换名字。" }, closure: { title: "第四段：纸月归篮", dependsOn: 2, prompt: "河水退到石阶下，篮中只剩最后一片纸月。它背面出现一道像门缝的折线。", promptByChoice: { leave: "未署名的愿望仍在篮中，最后一片纸月慢慢变得温暖。", sign: "写过名字的碎纸漂在你脚边，河底的门缝仍亮着。", hum: "旧曲停下后，门缝折线变成一张可折的路线图。" }, choices: [{ id: "foldback", label: "把最后碎片折回篮中", safety: 1, detail: "让月亮以不完整的方式归位。" }, { id: "float", label: "让碎片随小船漂走", safety: 0, detail: "把选择交给河流，而非自己。" }, { id: "door", label: "沿折线撕开纸月的门", safety: 0, fatal: true, detail: "主动打开河底邀请。" }] } },
  INTP: { firstThird: { id: "scope", label: "用镜面检查接口，不装入零件", safety: 1, detail: "先确认看不见的结构。" }, turnThird: { id: "sample", label: "取一滴冷凝水做样本", safety: 1, detail: "把不可解释的读数留给后续验证。" }, finalThird: { id: "markstep", label: "在楼梯口标出负数读数", safety: 0, detail: "记录入口，不立即进入。" }, closure: { title: "第四段：上行验证", dependsOn: 2, prompt: "泵房的报警灯由红转黄。那枚螺丝安静下来，地下图纸上却多了通往地面的箭头。", promptByChoice: { shutdown: "泵房已关闭，箭头仍指向一条从未铺设的上行管道。", descend: "你从检修梯退回时，图纸上的第十层被涂成了一个问号。", markstep: "负数读数停在楼梯口，样本盒在你掌心持续微震。" }, choices: [{ id: "elevator", label: "乘维护梯上行并封存样本", safety: 1, detail: "优先回到可通讯的楼层。" }, { id: "mapcopy", label: "抄下箭头后关闭照明", safety: 0, detail: "保留推理材料，但不完成验证。" }, { id: "pipe", label: "钻入图纸标出的上行管道", safety: 0, fatal: true, detail: "进入未在建筑记录中的结构。" }] } },
  ESTP: { firstThird: { id: "chalk", label: "在雨地圈出脚印方向", safety: 1, detail: "把追踪变成可回看的路线。" }, turnThird: { id: "flare", label: "向界桩放一枚冷焰信号", safety: 1, detail: "让篱门与芦苇都看得见你的方位。" }, finalThird: { id: "rope", label: "系上回亭绳，再等风停", safety: 0, detail: "保住退路，但延后追击。" }, closure: { title: "第四段：巡界回铃", dependsOn: 2, prompt: "雨势转小，巡界亭的铃自己响了一下。无影羊已不在篱门外，只留下一串向界内延伸的浅蹄印。", promptByChoice: { return: "你沿界桩返回，浅蹄印却在亭前绕成一圈。", cross: "你从界线外退回时，哨声仍在雾里回响。", rope: "回亭绳绷紧，像有人从界内轻轻拉了一下。" }, choices: [{ id: "loghoof", label: "登记蹄印，关闭篱门回亭", safety: 1, detail: "把异常留在边界记录中。" }, { id: "watchgate", label: "在篱门外再守一轮", safety: 0, detail: "增加观察，但延长暴露。" }, { id: "followhoof", label: "顺着蹄印穿过界内雾地", safety: 0, fatal: true, detail: "离开已标记的巡界路线。" }] } },
  ESFP: { firstThird: { id: "sort", label: "把信封与水洼倒影逐项对照", safety: 1, detail: "确认投递对象是否一致。" }, turnThird: { id: "lamp", label: "在巷口灯下留下投递时间", safety: 1, detail: "给回信留一个可追溯的时点。" }, finalThird: { id: "coverpuddle", label: "用邮袋遮住水洼，等雨小", safety: 0, detail: "暂时中断倒影的视线。" }, closure: { title: "第四段：邮袋封口", dependsOn: 2, prompt: "雨巷尽头传来自行车铃，邮袋里多出一封回信。它没有收件地址，封口却盖着今晚的日期。", promptByChoice: { stamp: "你已盖好投递章，回信却没有可以投递的地址。", enter: "你从亮窗前退回，邮袋内的回信正慢慢变得潮湿。", coverpuddle: "水洼被遮住后，回信的封口暂时停止跳动。" }, choices: [{ id: "returnbag", label: "把回信带回邮局待查", safety: 1, detail: "按可追溯流程暂存。" }, { id: "leavepost", label: "放在巷口信箱等天亮", safety: 0, detail: "相信明天会给它地址。" }, { id: "wetopen", label: "趁封口潮湿时拆开回信", safety: 0, fatal: true, detail: "打破未投递信件的禁忌。" }] } },
  ESTJ: { firstThird: { id: "announce", label: "先宣布临时检票顺序", safety: 1, detail: "让所有乘客知道规则仍有效。" }, turnThird: { id: "checkclock", label: "同步检票机与站台钟", safety: 1, detail: "避免错把钟差当成票务异常。" }, finalThird: { id: "bench", label: "请三位乘客坐回候车椅", safety: 0, detail: "暂停放行，保留秩序。" }, closure: { title: "第四段：末班清站", dependsOn: 2, prompt: "钟声结束后，站台空了一半。空白票根却仍在闸机槽里，背面开始浮出一道车门形的阴影。", promptByChoice: { hold: "闸机已落锁，阴影被压在票根背面，没有再延伸。", board: "你从无门车厢退回时，检票机吐出一张写着你工号的票。", bench: "三位乘客都还在候车椅上，只有空白票根慢慢向闸机内滑去。" }, choices: [{ id: "sealpass", label: "把票根封进票务箱并清站", safety: 1, detail: "完成当班关站程序。" }, { id: "retain", label: "留下票根等待早班核验", safety: 0, detail: "保留异常，但延长值守。" }, { id: "scanback", label: "把票根背面贴上检票机扫描", safety: 0, fatal: true, detail: "让未知车门接入站台系统。" }] } },
  ESFJ: { firstThird: { id: "receipt", label: "先打印两份明细给客人与柜台", safety: 1, detail: "让找零与照应都留下凭据。" }, turnThird: { id: "callmanager", label: "按下闭店呼叫铃，等同事回应", safety: 1, detail: "请求可见一侧的支援。" }, finalThird: { id: "coverglass", label: "拉下半扇遮光帘继续结账", safety: 0, detail: "减少倒影干扰，但仍留在柜台。" }, closure: { title: "第四段：闭店对账", dependsOn: 2, prompt: "最后一笔账已显示完成，玻璃里的同事却递来一张不同金额的夜班单。真实店门外有人正等你锁门。", promptByChoice: { close: "账目相符，玻璃里的夜班单却仍在托盘上。", serve: "你从倒影队伍前退回，真实柜台的呼叫铃正在持续响。", coverglass: "遮光帘后传来轻轻的点钞声，夜班单的金额不再变化。" }, choices: [{ id: "filebill", label: "把夜班单夹入异常账册后锁门", safety: 1, detail: "带着证据结束当班。" }, { id: "leavebill", label: "把夜班单留在托盘交早班", safety: 0, detail: "让下一位同事共同核对。" }, { id: "pullcurtain", label: "掀开遮光帘走进玻璃后", safety: 0, fatal: true, detail: "主动更换到倒影一侧的柜台。" }] } },
  ENFJ: { firstThird: { id: "name", label: "先让每位来客报出能记住的名字", safety: 1, detail: "用彼此的确认抵抗雾的分散。" }, turnThird: { id: "rope", label: "让大家握住同一根引路绳", safety: 1, detail: "让队伍在雾中保持可见关系。" }, finalThird: { id: "lampnote", label: "把红线信放到灯下做记号", safety: 0, detail: "暂不拆信，也不带着它继续走。" }, closure: { title: "第四段：雾散登记", dependsOn: 2, prompt: "晨雾薄下来，三名来客与一扇无牌门都出现在灯笼光圈边缘。红线信封正等待最后的安置。", promptByChoice: { knock: "你已把信留在门外，门内没有回应，来客却都还在灯下。", read: "信封重新封好，红线却缠住了灯笼提手。", lampnote: "灯下的信不再震动，雾廊尽头出现一张离开登记表。" }, choices: [{ id: "register", label: "登记所有同行者后离开", safety: 1, detail: "让这趟引导有明确的归还记录。" }, { id: "waitdoor", label: "在门外等到天光全亮", safety: 0, detail: "多给门后一次回应机会。" }, { id: "unravel", label: "拆开缠住灯笼的红线", safety: 0, fatal: true, detail: "把未署名讯息直接接到自己身上。" }] } },
  ENTJ: { firstThird: { id: "audit", label: "先调取城南街钟的偏差记录", safety: 1, detail: "以全城数据校验一枚齿轮。" }, turnThird: { id: "brake", label: "启用主轴制动，暂停补时", safety: 1, detail: "宁可停摆，也不让误差扩散。" }, finalThird: { id: "delegate", label: "让守夜人分头确认街钟", safety: 0, detail: "扩大核验范围，但分散控制力。" }, closure: { title: "第四段：钟楼交钥", dependsOn: 2, prompt: "暴雨渐弱，北塔主钟停止抖动。钟面后仍有一把只在十三点出现的检修钥匙。", promptByChoice: { report: "已校准的报时穿过雨幕，检修钥匙在钟面背后轻轻转动。", announce: "第十三点的余音还在塔内，钥匙已经落到你的脚边。", delegate: "守夜人的回报逐一传来，钥匙却没有出现在任何记录里。" }, choices: [{ id: "keybox", label: "把检修钥匙锁入钟楼钥匙箱", safety: 1, detail: "将额外时间留给正式检修。" }, { id: "tagkey", label: "挂上封签，明夜再核验", safety: 0, detail: "延后处置，保留追踪。" }, { id: "wind", label: "用钥匙拧开第十三点的钟面", safety: 0, fatal: true, detail: "主动进入未被允许的时刻。" }] } },
  ENTP: { firstThird: { id: "compare", label: "让客人先描述镜中所见", safety: 1, detail: "把交易建立在可比对的观察上。" }, turnThird: { id: "reverse", label: "将镜面对向空墙测试反光", safety: 1, detail: "让镜子先照见没有选择的地方。" }, finalThird: { id: "reserve", label: "给客人一张明夜取镜凭条", safety: 0, detail: "把好奇心推迟到可再次协商的时间。" }, closure: { title: "第四段：镜摊收市", dependsOn: 2, prompt: "巷口打烊铃响，未标价镜子里只剩一条细窄的光路。客人还站在摊前，等你说最后一句。", promptByChoice: { close: "你已收起价签，光路仍指向摊位后的暗巷。", enter: "你从镜门边退开，镜中出现一个正在替你收摊的身影。", reserve: "凭条上的日期自己改成了明夜，镜面却仍不肯完全暗下。" }, choices: [{ id: "wrap", label: "用黑布包镜，留下单一凭条", safety: 1, detail: "让交易与未来都保持可撤销。" }, { id: "display", label: "把镜子朝里摆到明夜", safety: 0, detail: "继续观察，但不再试照。" }, { id: "negotiate", label: "与镜中的自己继续议价", safety: 0, fatal: true, detail: "让两种未来同时占据摊位。" }] } },
  ENFP: { firstThird: { id: "sharemap", label: "先和旅人一起画出可见路标", safety: 1, detail: "把偶然同行变成双方都能读懂的路线。" }, turnThird: { id: "bench", label: "在候车亭留下半束萤火", safety: 1, detail: "不把所有光都带向未知方向。" }, finalThird: { id: "askdriver", label: "隔着车窗询问下一站", safety: 0, detail: "收集信息，不登车。" }, closure: { title: "第四段：候车亭晨牌", dependsOn: 2, prompt: "雨停后，候车亭的线路图空白处慢慢显出一条新线。旧巴士仍在远处，旅人等你决定是否把它写进地图。", promptByChoice: { wait: "你留在路标旁，新的线路图却只显示半截终点。", ride: "你从车门边退回，车票在掌心折成一只小小的萤火。", askdriver: "司机没有回答，只在车窗上画了一道返回候车亭的箭头。" }, choices: [{ id: "mapline", label: "把新线标为“待验证”并等天亮", safety: 1, detail: "给未知留位置，不把它当作承诺。" }, { id: "givepass", label: "把车票交给旅人保管", safety: 0, detail: "分享可能性，也让对方参与风险。" }, { id: "chase", label: "追着远处巴士跑出路标范围", safety: 0, fatal: true, detail: "离开所有能回看的光。" }] } },
};

const enrichNightChoices = (choices) => choices.map((choice) => ({
  ...choice,
  detail: choice.detail ?? (choice.fatal ? "这一步会切断当前的返程条件。" : choice.safety ? "优先保留可复查的线索与返程条件。" : "会让异常更接近，但仍可能留有转圜。"),
}));

export const nightChapters = Object.fromEntries(
  Object.entries(baseNightChapters).map(([type, chapter]) => {
    const expansion = nightExpansions[type];
    const deepening = nightDeepening[type];
    const firstStage = {
      id: "signal",
      title: "第一段：初次异动",
      prompt: chapter.prompt,
      choices: enrichNightChoices([
        ...chapter.choices.map((choice) => ({ ...choice, safety: choice.id === expansion.firstSafe ? 1 : 0 })),
        deepening.firstThird,
      ]),
    };
    return [type, {
      ...chapter,
      rule: expansion.rule,
      stages: [
        firstStage,
        {
          ...expansion.turn,
          prompt: "你暂时没有立刻介入。第一段留下的线索仍在现场变化，第二道异常已经出现。",
          choices: enrichNightChoices([...expansion.turn.choices, deepening.turnThird]),
        },
        {
          ...expansion.final,
          prompt: "你没有扩大刚才的处置范围。交班前的现场出现了新的确认信号，需要决定如何收束。",
          choices: enrichNightChoices([...expansion.final.choices, deepening.finalThird]),
        },
        { ...deepening.closure, choices: enrichNightChoices(deepening.closure.choices) },
      ],
      endings: expansion.endings,
      survivalThreshold: 2,
    }];
  }),
);

export const resolveNightStagePrompt = (stage, selectedChoices) => {
  if (!stage.promptByChoice) return stage.prompt;
  return stage.promptByChoice[selectedChoices[stage.dependsOn]] ?? stage.prompt;
};

export const resolveNightEnding = (chapter, selectedChoices) => {
  const path = chapter.stages.map((stage, index) => {
    const choice = stage.choices.find((option) => option.id === selectedChoices[index]);
    return { stage: stage.title, choice };
  });
  const safety = path.reduce((score, step) => score + (step.choice?.safety ?? 0), 0);
  const fatalStep = path.find((step) => step.choice?.fatal);
  const survived = !fatalStep && safety >= chapter.survivalThreshold;
  const ending = chapter.endings[survived ? "survive" : "death"];
  const pathLog = path.map((step) => ({
    stage: step.stage,
    label: step.choice?.label ?? "未完成选择",
    detail: step.choice?.detail ?? "这一步没有留下足够的记录。",
    signal: step.choice?.fatal ? "禁区已越过" : step.choice?.safety ? "返程线索已保留" : "异常仍在扩大",
  }));
  const lastChoice = path.at(-1)?.choice;
  const conclusion = survived
    ? `这名角色在四段夜班中留下了 ${safety} 条可复查的返程线索。最后选择「${lastChoice?.label}」让交班仍能被记录，因此它带着异常的证物回到了可确认的世界。`
    : fatalStep
      ? `真正切断返程的是「${fatalStep.choice.label}」。它越过了本夜明示的禁区；此前留下的线索只能说明它曾在这里工作，无法再把它带回交班点。`
      : `这名角色只留下了 ${safety} 条可复查的返程线索，未达到返程所需的最小条件。最后的「${lastChoice?.label}」没有立刻终止现场，却让异常在交班前先一步完成了收束。`;

  return { ...ending, safety, pathLog, conclusion };
};
