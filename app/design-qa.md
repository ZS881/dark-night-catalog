# Design QA — 暗夜图鉴相机

## Scope

- **Source visual truth:** `C:\Users\18485\Documents\妖魔相机\app\reference-option-2.png`
- **Implementation screenshot:** `C:\Users\18485\Documents\妖魔相机\app\qa-home.png`
- **Comparison sheet:** `C:\Users\18485\Documents\妖魔相机\app\qa-comparison.png`
- **Viewport:** 390 × 844
- **State compared:** the initial “血线维修员” observation screen

## Comparison history

| Pass | Finding | Severity | Resolution |
| --- | --- | --- | --- |
| 1 | The observation screen used a CSS-drawn viewfinder, making the framing feel flatter than the chosen source direction. | P2 | Replaced it with a generated, transparent inspection-frame asset (`public/assets/observation-overlay.png`). |
| 2 | Rechecked at 390 × 844 after the asset was integrated. The visual hierarchy, nocturnal green/red palette, wet-tunnel imagery, typographic contrast, and primary shutter action are coherent with the source direction. | — | No P0, P1, or P2 issues remain. |

## Surface review

| Surface | Result |
| --- | --- |
| Typography | High-contrast Chinese title and dossier copy remain legible over the dark scene; the title/metadata/action hierarchy is clear. |
| Layout & spacing | Mobile-safe padding, a stable top utility row, a central capture control, and a low visual-information block preserve the camera-like composition. |
| Colors | Restrained black, wet green, off-white, and signal red match the “night maintenance district” tone without introducing decorative gradients. |
| Images | Original generated assets show a normal-scale humanoid worker completing maintenance work; the generated transparent frame is used as a real asset rather than CSS illustration. |
| Copy | All wording treats an uploaded photo as a consented fictional anchor. It avoids judging or altering the real person, while the horror is confined to the parallel-world record. |

## Interaction verification

Verified in the in-app browser:

1. The observation shutter keeps the consent → selection → generation path intact.
2. Generation resolves to the narrative dossier, with the image, character name, background story, habitat, taboo, and safety note visible together.
3. The dossier offers “Save clean original image”; the exported file contains only the generated character image, with no title, creature copy, dossier fields, or interface elements.
4. The save action uses the platform share sheet when it can share an image file, and falls back to a same-origin image download in a browser.
5. Uploading an anchor photo still opens the consent gate first; consent unlocks the demo/upload path.
6. Browser console errors: `[]`.

## Questionnaire expansion

- Three scenario-based “mood markers” now route an anchor to one of three fictional night-shift residents: repair → Bloodline Maintainer, guidance → Fog-Lamp Guide, archival → Tide-Mark Archivist.
- The questions explicitly state that they are not a psychological assessment or personality judgment; they only select a fictional encounter route.
- All three answers are required before assignment. A majority score determines the route; ties resolve to the first selected scenario, making the result deterministic.
- The Guidance route was tested end-to-end at 390 × 844: its selections produced the Fog-Lamp Guide image, name, story, habitat, taboo, and clean-image save action. Browser console errors: `[]`.

## Paper-theater horror art pass

- Replaced the route imagery with three original paper-theater urban-horror illustrations. They use layered cut-paper forms, irregular ink contours, degraded print grain, aged paper palettes, and staged shadows; they do not copy any existing horror-animation character or scene.
- The home observation screen now uses the paper-style Bloodline Maintainer. The archival route was re-tested at 390 × 844 and produced the paper-style Tide-Mark Archivist image, matching dossier metadata, and clean-image save action. Browser console errors: `[]`.

## Expressive creature pass

- Replaced the three route portraits with versions that have clear, highly exaggerated fictional facial features: oversized eyes, asymmetric pupils, elongated noses/jaws, and broad inked smiles. The treatment stays in the original paper-theater direction and avoids graphic injury.
- Added a fourth route, 巡界 → 蜕壳巡犬, as an original village-boundary night-patrol creature. Its design draws only on broad motifs from the supplied folklore-style description (canine behavior, layered “shed” outerwear, uncanny restoration) and does not copy the supplied character, title, or plot.
- The new route was tested end-to-end at 390 × 844: all three patrol answers generated the Shell-Shed Patrol Hound portrait, matching dossier copy, and clean-image save action. Browser console errors: `[]`.

## Final result

**passed**

## 人格投影叙事扩展

- 每名 MBTI 风格居民新增三项叙事性格特征、对应的异化表现与夜班习惯；这些字段描述虚构居民，不将特征反向定义为用户的人格结论。
- 结果卡在原有故事下新增「这名居民的性格投影」区块，保留特征标签、异化表现和工作习惯，并可在较小屏幕内滚动阅读。
- 验证：浏览器完成 16 题 ESTJ 路径后，`站台检票员` 正确显示「组织秩序 / 执行到底 / 承担责任」、检票钳与黄线的异化表现，以及末班验票的夜班习惯。

**passed**

## MBTI 深度报告

- 图鉴中的「阅读完整人格投影」会打开独立的可滚动报告，而不是挤压图鉴卡。报告沿用统一模板：四维选择记录、认知功能叙事参考、现实表现、压力反应、实践提醒、协作／工作环境和彼界异化映射。
- 四维分数显示为本次 16 道题的方向性选择记录；页面同时说明 MBTI 功能模型是社群常用叙事，不是脑科学结论、心理诊断或对用户的固定定义。
- 验证：全选 I/S/F/J 的 ISFJ 路径正确得到 `雾灯引路员`；报告显示 `I +8 / S +8 / F +8 / J +8`、Si→Fe→Ti→Ne 叙事、ISFJ 特征与压力／实践内容，并可返回原图鉴。16/16 深度报告已与 16/16 居民档案完成映射核对。

**passed**

## MBTI 问卷人格图鉴

- 入口：主页提供「开始 MBTI 场景问卷」入口；16 道自愿作答的场景题，每个维度各四题，以 +2 / +1 / -1 / -2 累计 I/E、S/N、T/F、J/P 的两组倾向；同分时以该维度第一题为偏好参考。
- 内容：16/16 类型均有独立的虚构居民、故事、栖息地、禁忌、视觉支系与无文字原图保存路径。
- 视觉：保留档案铅印和怪诞插画，同时新增哥特机械、工业怪诞、民俗水墨、异形卡通与夜雨电影写实；写实线允许狰狞夸张面容，但无露骨伤口或血腥。
- 边界：问卷结果只用于娱乐化彼界叙事；不从照片、外貌、上传锚点或行为推断人格，也不构成心理诊断。
- 验证：`pnpm build` 成功；资源检查确认 16/16 图像存在。浏览器端到端测试完成 16 道预设倾向题后，稳定得到 `ESTJ → 站台检票员`；结果卡正确显示类型、故事、视觉支系与保存纯图按钮。

**passed**

## 十名居民自动分流扩展

- 结果：主路线（修复、引路、归档、巡界、夜市）与彼侧路线（雨巷、末班、失物、楼道、雨棚）组成 10 名可达居民。
- 分流：前三道题只计算五种工作倾向；第四道无字路牌灯色在主路线与对应彼侧居民间切换，不用于心理或人格判断。
- 资源：10/10 个居民图像均位于 `public/assets`，结果卡与无文字原图保存复用 `selectedResident.image`。
- 验证：`pnpm build` 成功；源代码检查确认 10 个居民条目、10 个已存在资源与映射逻辑均一致。

**passed**

## 彼界夜班 · 第一夜示例

- Source visual truth: `C:\Users\18485\Documents\妖魔相机\app\reference-galgame-first-night.png` (selected ImageGen concept, 390 × 844 portrait).
- Implemented scene asset: `public/assets/galgame-fog-lamp-first-night.png`; it is a clean, non-graphic night-platform background generated specifically for the dialogue overlay.
- Interaction contract: only the ISFJ `雾灯引路员` dossier exposes the entry. The chapter offers two choices — `先去关门处` and `留灯给候车者` — with distinct outcome copy, a relationship note, archive state, replay, and return to the character dossier.
- Static verification: `pnpm build` passed; the scene asset is present (1,929,262 bytes); all five core flow labels and transitions are present in `src/App.jsx`.
- Browser-rendered capture: blocked. The in-app browser policy rejected navigation to the local preview URL, so a 390 × 844 implementation screenshot, browser interaction run, console check, and visual side-by-side comparison cannot be produced in this environment.

**Findings**

- [P1] Browser-based visual QA is unavailable.
  Location: local preview verification.
  Evidence: navigation to the local preview was rejected by browser URL policy.
  Impact: the selected mock and implementation cannot be visually compared at the required mobile viewport.
  Fix: open the local preview in an allowed browser surface, capture the ISFJ night-shift opening state at 390 × 844, then compare it side by side with `reference-galgame-first-night.png` and update this report.

**Implementation Checklist**

1. Complete the blocked browser capture and two-branch interaction test.
2. Review the dialogue panel's crop, text wrapping, choice affordance, and visual balance against the reference.

final result: blocked
