const artifact = (name, description) => ({ name, description });

export const worldArchiveData = {
  ISTJ: { survived: artifact("封存编号牌", "红封条将不存在的站名锁进了可复查的维修记录。"), lost: artifact("空白工号牌", "工号仍在出票，却再也没有对应的交班人。"), target: "ESTJ", link: "空白票根与未登记线路在同一趟末班车上出现。", nextNight: "第二夜：站台钟响前，带着封存编号牌去核对一张无目的地车票。" },
  ISFJ: { survived: artifact("双面旧车票", "一面写着候车者的站名，另一面仍留着门后的指印。"), lost: artifact("熄灭雾灯", "灯芯还温着，却只照见未解锁安全门的内侧。"), target: "INFJ", link: "旧车票会被送入失物室，等待一把没有齿的钥匙。", nextNight: "第二夜：雾灯交接后，确认哪一位候车者没有随列车离开。" },
  INFJ: { survived: artifact("未署名封签", "封签记住了失物的温度，却没有替任何人揭开内容。"), lost: artifact("墙后交接单", "交接单上的笔迹与原保管员完全一致。"), target: "ENFJ", link: "失物室的红线信会在晨雾走廊里寻找真正的收信人。", nextNight: "第二夜：查验恒温柜上多出的第十七格，那里存着一盏失而复得的雾灯。" },
  INTJ: { survived: artifact("潮位注记页", "它证明未来并未被改写，只是被谨慎地留在待核实栏。"), lost: artifact("空白终章印", "印面沾着潮水，盖出的名字总在清晨前消失。"), target: "ENTJ", link: "潮位册记录的第十三点，与北塔钟楼的异常报时一致。", nextNight: "第二夜：在涨潮抵达前，把注记页送到北塔钟楼校时。" },
  ISTP: { survived: artifact("墙内维修单", "维修单没有房号，署名却写着“已完成一次可见回路”。"), lost: artifact("无号门铃片", "它会在没有门牌的楼层响出三短一长。"), target: "ESTP", link: "楼道外的脚印会把无号门的维修单带向村界篱门。", nextNight: "第二夜：追查墙内同事留下的维修单，确认它来自哪一层。" },
  ISFP: { survived: artifact("银线伞套", "伞套里收着一滴不会蒸发的异地雨。"), lost: artifact("伞内车票", "车票的街名每天都会变一次。"), target: "INFP", link: "伞面里落下的雨会流进旧河市，成为纸月碎片的光源。", nextNight: "第二夜：用银线伞套辨认那场雨究竟来自哪一条街。" },
  INFP: { survived: artifact("未署名纸月", "纸月没有被补全，因此仍能为后来的人留下一点光。"), lost: artifact("河底船票", "船票没有终点，背面只写着一段无法唱完的旧曲。"), target: "ENFP", link: "纸月照出的河岸路线，会通向没有线路图的乡道候车亭。", nextNight: "第二夜：顺着纸月路标寻找那艘从河市漂出的无灯小船。" },
  INTP: { survived: artifact("第十层样本盒", "盒内的螺丝与图纸仍在等待下一次有记录的验证。"), lost: artifact("负数读数条", "纸条显示一层不存在的楼层，却能被每台仪表读出。"), target: "INTJ", link: "地下泵房的负数读数，被潮位档案室归入同一批异常。", nextNight: "第二夜：将样本盒送往潮位档案室，比较两份不可能的结构图。" },
  ESTP: { survived: artifact("无影羊铃", "铃声只在界桩以内响起，提醒巡界亭有人仍在值守。"), lost: artifact("第七步泥印", "泥印永远停在界线外，却会在雨后向内多出半步。"), target: "ISTP", link: "无影羊铃的回声会穿过旧公寓，唤醒一扇无号门。", nextNight: "第二夜：将羊铃挂到无号门前，确认脚印从哪一侧开始。" },
  ESFP: { survived: artifact("雨巷回执", "回执没有寄件人，却确认那封信曾被一扇真实的窗收下。"), lost: artifact("倒影邮袋", "邮袋里的信会在水面出现新的收件地址。"), target: "ESFJ", link: "雨巷里多出的硬币，会在无名便利店的托盘上开始旋转。", nextNight: "第二夜：拿着回执去便利店核对一枚多出来的硬币。" },
  ESTJ: { survived: artifact("暂扣空白票", "票根已被编号，但目的地仍被保留在待核验栏。"), lost: artifact("无门车票", "票孔已经打好，乘客姓名却从未出现。"), target: "ISTJ", link: "空白票的编号与 07 号维修区失联线路的报码相同。", nextNight: "第二夜：把暂扣票送去 07 号维修区，确认它是否属于同一趟列车。" },
  ESFJ: { survived: artifact("异常夜班单", "账目相符，只有玻璃里的那份副本仍在等待复核。"), lost: artifact("倒影工牌", "工牌背面写着“请从另一侧上班”。"), target: "ESFP", link: "夜班单上未对平的金额，会对应一封没有地址的雨巷回信。", nextNight: "第二夜：带着夜班单去雨巷，寻找能让金额相符的收件人。" },
  ENFJ: { survived: artifact("引路绳结", "四个绳结记住了同行者都曾被灯光照见。"), lost: artifact("红线灯芯", "灯芯被红线缠住，只能在无人处重新点亮。"), target: "INFJ", link: "红线灯芯需要失物室的一把反向钥匙才能拆开。", nextNight: "第二夜：把引路绳结交给保管员，确认那封红线信的来源。" },
  ENTJ: { survived: artifact("第十三点钥匙", "它被锁进钥匙箱，等待一次被允许的校时。"), lost: artifact("失准报时簿", "每次翻页都会多出一声不属于城市的钟响。"), target: "INTJ", link: "第十三点的时间残差，被潮位册标记为一场尚未来临的涨潮。", nextNight: "第二夜：将钥匙与潮位注记并置，校验城市是否真的多出一刻。" },
  ENTP: { survived: artifact("未标价镜片", "镜片只反射一个未来，因此仍可被谨慎地收进黑布。"), lost: artifact("双重收据", "两张收据都写着成交，却指向不同的离开方式。"), target: "ENFP", link: "镜门中多出的路线，会在乡道候车亭变成一张没有终点的线路图。", nextNight: "第二夜：带着镜片去候车亭，辨认哪一条路线属于现实。" },
  ENFP: { survived: artifact("待验证线路图", "地图为未知巴士留出一条虚线，却没有许诺终点。"), lost: artifact("无终点车票", "车票在萤火中折叠，始终不肯显出下一站。"), target: "ISFP", link: "候车亭的虚线会在雨夜延伸到一把正在滴水的黑伞下。", nextNight: "第二夜：把线路图压进伞套，确认巴士是否曾经过旧商业街。" },
};

export const getWorldArtifact = (type, status) => {
  const record = worldArchiveData[type];
  if (!record) return null;
  return status === "存活" ? record.survived : record.lost;
};
