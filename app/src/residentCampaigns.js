// Worksite campaigns belong to fictional dossier residents. They are level
// design briefs first: every entry can receive dedicated environment art and
// an escort model later without changing combat, map or transition code.
const stage = (id, name, hint, art, mechanic, contact = null) => ({ id, name, hint, art, mechanic, contact, awaitingModel: true });

export const residentCampaignByType = {
  ISTJ: { title: "编号线缆夜勤", stages: [
    stage("istj-wire-bay", "编号线缆车间", "断线桥架 · 编号灯", "fogHarbor", "按序点亮的配电柜会改变绕行路线", { name: "雾灯引路员", role: "北侧列车接应", line: "我替你留住了下一盏编号灯，跟着它上车。" }),
    stage("istj-cable-bridge", "黑线廊桥", "高架线槽 · 断裂检修门", "powerCorridor", "破坏错误线槽会短暂露出安全通路", { name: "站台检票员", role: "终站验票接应", line: "这张工单没有目的地，但列车承认它。" }),
    stage("istj-maintenance-terminal", "07 号维修终端", "封闭检修台 · 警报列车", "facelessPlatform", "终局警报会轮换封锁站台边缘"),
  ] },
  ISFJ: { title: "末灯引路夜勤", stages: [
    stage("isfj-lamp-platform", "03 号雾灯引导台", "末灯候车区 · 低雾", "fogHarbor", "未熄的雾灯提供短暂护盾", { name: "晨雾传令官", role: "废线列车接应", line: "别回头数灯，我会把你的名字送到下一站。" }),
    stage("isfj-abandoned-line", "废线候车室", "遗失座位 · 雾门", "facelessPlatform", "被遗忘的座椅会生成缓速雾区", { name: "失物保管员", role: "归档门接应", line: "最后一盏灯我已经存进抽屉，车门会为你打开。" }),
    stage("isfj-last-lamp-archive", "末灯归档室", "灯罩货架 · 静默终点", "powerCorridor", "护送灯火越多，精英越慢"),
  ] },
  INFJ: { title: "失物封存夜勤", stages: [
    stage("infj-lost-property", "失物保管室", "抽屉墙 · 未署名钥匙", "powerCorridor", "打开错误抽屉会唤醒远程异体", { name: "潮痕档案员", role: "潮位门接应", line: "钥匙会自己选门；你只需别替它命名。" }),
    stage("infj-drawer-corridor", "第九抽屉回廊", "层叠柜门 · 潮痕", "fogHarbor", "潮痕周期改变中央可走区域", { name: "门缝接线员", role: "封存列车接应", line: "门后那边的灯还亮着，线已经接好。" }),
    stage("infj-sealed-vault", "静默封存库", "钥匙库 · 无主标签", "facelessPlatform", "首领会借用未收集的钥匙制造分身"),
  ] },
  INTJ: { title: "潮位档案夜勤", stages: [
    stage("intj-tide-archive", "潮位档案室", "湿页书架 · 预演水线", "fogHarbor", "潮线预警会提前标出下一次敌潮", { name: "深井拆解员", role: "泵房列车接应", line: "我测过水位，下一趟能通过。" }),
    stage("intj-pump-gate", "泵房潮闸", "机械闸门 · 漏水电缆", "powerCorridor", "积水会传导电系伤害并改变路线", { name: "无脸月台值守员", role: "终站接应", line: "别看广告屏，直接走进亮着的车门。" }),
    stage("intj-unlisted-platform", "无脸月台", "空白广告屏 · 终局列车", "facelessPlatform", "每轮封锁会重排精英出现的入口"),
  ] },
  ISTP: { title: "门缝接线夜勤", stages: [
    stage("istp-door-gap", "无牌公寓走廊", "门缝电铃 · 维修灯", "powerCorridor", "门铃短响时可击穿附近异体", { name: "镜门游商", role: "错层列车接应", line: "别问车票，先把这面镜子扣在口袋里。" }),
    stage("istp-bell-service", "断铃配电层", "线缆井 · 应急闸", "fogHarbor", "可破坏闸机能打开近路或放出异体", { name: "血线维修员", role: "边界门接应", line: "门缝已经接回原房间，下一列在等你。" }),
    stage("istp-threshold-room", "边界接线室", "折叠门墙 · 故障电流", "facelessPlatform", "Boss 会封闭一侧路线，迫使绕行"),
  ] },
  ISFP: { title: "雨棚缝补夜勤", stages: [
    stage("isfp-umbrella-stall", "雨棚缝补摊", "折伞货架 · 雨幕", "fogHarbor", "完整伞面会挡住一次远程攻击", { name: "灯眼邮差", role: "雨巷列车接应", line: "把伞收好，雨会替我们遮住车窗。" }),
    stage("isfp-rain-awning", "黑伞街", "漏雨橱窗 · 水沟", "facelessPlatform", "雨幕会遮蔽远处敌人但暴露脚步", { name: "纸月拾荒者", role: "河岸接应", line: "我折了一艘能穿过积水的纸船。" }),
    stage("isfp-umbrella-vault", "隐伞库", "倒挂伞骨 · 风压终点", "powerCorridor", "风压阶段会推动双方单位"),
  ] },
  INFP: { title: "纸月回收夜勤", stages: [
    stage("infp-moon-bank", "涨潮旧河岸", "纸船码头 · 月影", "fogHarbor", "月片拾取物会为环绕技能充能", { name: "萤群旅人", role: "乡道列车接应", line: "萤火已经记住路线，跟它们走。" }),
    stage("infp-paper-ferry", "纸船渡口", "漂流月片 · 水闸", "facelessPlatform", "漂流纸船会短暂形成可绕行掩体", { name: "雾灯引路员", role: "雾堤接应", line: "把最后一片月光留在船上，列车会看见它。" }),
    stage("infp-moon-embankment", "月影堤", "白纸水线 · 潮声终局", "powerCorridor", "潮水退去时暴露危险电缆"),
  ] },
  INTP: { title: "深井拆解夜勤", stages: [
    stage("intp-pump-room", "地下泵房", "旧仪表 · 压力阀", "powerCorridor", "仪表读数会改变电箱爆发范围", { name: "潮痕档案员", role: "深井车接应", line: "我为你预留了下一页空白记录。" }),
    stage("intp-instrument-shaft", "仪表竖井", "回声管道 · 升降台", "fogHarbor", "上下气压会让弹道产生轻微偏移", { name: "钟楼监工", role: "时序列车接应", line: "别等指针归零，下一趟只停十秒。" }),
    stage("intp-deep-control", "深井控制室", "拆解台 · 无声齿轮", "facelessPlatform", "首领阶段会关闭一项互动设备"),
  ] },
  ESTP: { title: "村界巡逻夜勤", stages: [
    stage("estp-fungus-border", "菌雨村界", "湿泥路 · 巡逻灯", "fogHarbor", "边界泥地降低移动但提高击退", { name: "门缝接线员", role: "哨线列车接应", line: "边界线重新亮了，冲过去。" }),
    stage("estp-patrol-yard", "异界巡逻庭", "篱栏缺口 · 雨棚", "facelessPlatform", "篱栏可破坏，打开新的拉怪环路", { name: "血线维修员", role: "村外维修车接应", line: "脚印已经被送回原地，列车没等别人。" }),
    stage("estp-border-watch", "边界哨亭", "风雨岗台 · 追踪终局", "powerCorridor", "Boss 会沿最近的脚印加速冲刺"),
  ] },
  ESFP: { title: "雨巷投递夜勤", stages: [
    stage("esfp-letter-alley", "旧城投递巷", "亮窗信箱 · 暴雨", "fogHarbor", "亮窗附近掉落物会变为金色补给", { name: "倒影收银员", role: "后巷列车接应", line: "找零已经算完，车门会给你留一条缝。" }),
    stage("esfp-wet-sorting", "湿信分拣厅", "信架迷路 · 邮袋", "powerCorridor", "邮袋可被击破，产生随机补给或雾团", { name: "晨雾传令官", role: "亮窗接应", line: "这封没寄出的信写着下一站。" }),
    stage("esfp-lit-window", "仍亮着的窗街", "雨幕橱窗 · 红灯终局", "facelessPlatform", "警报灯会提升奖励与敌人速度"),
  ] },
  ESTJ: { title: "终站验票夜勤", stages: [
    stage("estj-ticket-platform", "郊区月台", "检票闸机 · 黄线", "fogHarbor", "黄线区域让敌人减速、玩家加速", { name: "雾灯引路员", role: "末班列车接应", line: "票根已经打孔，下一站不会问你的名字。" }),
    stage("estj-stub-inspection", "无目的检票室", "票根柜 · 闸门", "powerCorridor", "检票柜可封锁一条刷怪通道", { name: "镜门游商", role: "终站接应", line: "目的地空着，正适合你上车。" }),
    stage("estj-unlisted-terminal", "未列名终站", "空白站牌 · 封锁门", "facelessPlatform", "每轮都有一条黄线变为危险区域"),
  ] },
  ESFJ: { title: "倒影收银夜勤", stages: [
    stage("esfj-night-store", "无名便利店", "收银台 · 冰柜灯", "facelessPlatform", "找零掉落会为附近友方弹道增幅", { name: "灯眼邮差", role: "后巷接应", line: "收据背面写着车门的开锁时间。" }),
    stage("esfj-reflection-alley", "收银后巷", "玻璃墙 · 货箱", "fogHarbor", "倒影会延迟复制一次敌方冲刺", { name: "镜门游商", role: "玻璃列车接应", line: "别看柜台下，直接看我递来的那面镜。" }),
    stage("esfj-glass-market", "玻璃夜市", "灯箱摊位 · 回声终局", "powerCorridor", "玻璃碎片会反射部分弹道"),
  ] },
  ENFJ: { title: "晨雾传令夜勤", stages: [
    stage("enfj-care-home", "旧疗养院走廊", "晨雾病房 · 灯笺", "facelessPlatform", "跟随灯笺可在雾中标记安全路线", { name: "雾灯引路员", role: "院庭列车接应", line: "我在每个转角留了灯，别让任何人掉队。" }),
    stage("enfj-mist-courtyard", "雾灯院庭", "石阶花圃 · 回声门", "fogHarbor", "院庭雾气会把远程威胁显示为边缘箭头", { name: "失物保管员", role: "回声门接应", line: "把无人认领的信交给我，车在门后。" }),
    stage("enfj-echo-ward", "回声门廊", "封闭病房 · 引路终局", "powerCorridor", "首领会制造需要优先清理的失控灯笺"),
  ] },
  ENTJ: { title: "北塔校时夜勤", stages: [
    stage("entj-clocktower", "北塔钟楼", "齿轮地面 · 暴雨", "powerCorridor", "齿轮转向会周期性改变绕行路线", { name: "深井拆解员", role: "校时列车接应", line: "把故障齿轮留给我，列车按时到站。" }),
    stage("entj-gear-bridge", "齿轮廊桥", "悬空传动轴 · 警报灯", "fogHarbor", "转动桥段会短暂改变掩体位置", { name: "站台检票员", role: "时序终站接应", line: "检票机只接受这一秒的票根。" }),
    stage("entj-time-engine", "时序机房", "巨型钟面 · 机械终局", "facelessPlatform", "Boss 的攻击节奏遵循可读的钟声预警"),
  ] },
  ENTP: { title: "镜门流动夜勤", stages: [
    stage("entp-mirror-stall", "流动镜摊", "折光货架 · 假门", "facelessPlatform", "镜面偶尔复制敌人投射物方向", { name: "门缝接线员", role: "错层接应", line: "门开在哪一面不重要，线已经接过去了。" }),
    stage("entp-reflection-floor", "旧公寓倒影层", "镜墙走廊 · 反向楼梯", "fogHarbor", "反向镜面会让小地图短暂翻转", { name: "倒影收银员", role: "镜门列车接应", line: "这次找零是一张单程镜票。" }),
    stage("entp-glass-gate", "镜门集市", "多面玻璃 · 可能性终局", "powerCorridor", "Boss 会在镜门间瞬移并留下可破坏残影"),
  ] },
  ENFP: { title: "萤群候车夜勤", stages: [
    stage("enfp-unlisted-stop", "无线路候车亭", "萤光路牌 · 乡道雾", "fogHarbor", "萤火群会把未知入口标到小地图", { name: "纸月拾荒者", role: "乡道列车接应", line: "我把月片折成车票，它会带你穿过雨。" }),
    stage("enfp-firefly-road", "萤光乡道", "无名岔路 · 夜雨", "facelessPlatform", "随机岔路会生成高风险补给", { name: "晨雾传令官", role: "终点接应", line: "下一站没有名字，但灯笺知道怎么念。" }),
    stage("enfp-shadow-terminal", "未标记终站", "空站牌 · 萤影终局", "powerCorridor", "首领会在萤影中制造真假入口"),
  ] },
};

export const getResidentCampaign = (type = "INTJ") => residentCampaignByType[type] ?? residentCampaignByType.INTJ;
