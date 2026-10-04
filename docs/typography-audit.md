# 字号体系审计（typeset）· 2026-10-05

## 第 2 步：所有者覆写——mono 小字档放大（同日）

所有者反馈：mono 小字（首页 intro-meta「共 6 张/始于/最近更新」、「时间线」等眉标、
归档页「归档 · 2026」、关于页三处眉标、页脚同类小字）**过小、影响阅读，「怀疑
它们不是标题」**。溯源确认：11.5/12px 确是原型 base.css 原值、被第 1 步收编为
label/meta 档——本次为**所有者对设计系统基准的有意覆写**，DESIGN.md 同步改。

新档（保持梯度：正文 16 > 卡 15 > dek 14 > **meta/label 13** > tag 12.5 > micro 10.5）：

- label 11.5 → **13**：眉标、页脚栏标、题注（plate figcaption）、pullquote 署名、credit-key
- meta 12 → **13**：intro-meta（共 N 张/始于/最近更新）、相纸卡元信息行、胶片带张数、
  年份胶囊、归档日期/编号、翻页 label、订阅面板小字、findme
- tag 徽章 11.5 → **12.5**（略小于 meta，徽章角色）
- 新增**页面级眉标 h1**（归档/年份页「归档 · YYYY」）：**15px**——同 mono 语言
  但明确高出一档，回应「怀疑不是标题」
- 不动：logo-sub 10.5（顶栏装饰特例）、代码 13/13.5、tick 年份数字 15

---

# 以下为第 1 步审计记录

所有者反馈：标题/正文的字号分配「视觉上感觉有一点奇怪」，希望明确各等级文本
（正文大小 / 标题大小 / 加粗）的控制规则。本文是 impeccable typeset 流程的
分析记录：两份独立评估（排版学评估 + 机械扫描）→ 收敛方案 → 实施。

## 证据

- **机械扫描**（`impeccable detect --scope type src/`）：20px logo、24–32
  wall-head、68px year-title、30–52 article-h1、23–29 prose-h2 等 advisory——
  大量字面 font-size 偏离 DESIGN.md 登记的 5 档字阶。
- **排版学评估**（global.css 全量 font-size 盘点 + 原型 base.css 对照）：
  - mono 元信息族实际用了 **8 档**：10.5 / 11 / 11.5 / 12 / 12.5 / 13 / 13.5 / 15。
    其中 11 vs 11.5、12 vs 12.5 是 0.5px 级差异，肉眼不可辨却破坏「同角色
    同规格」；**同一角色不同值**：日期行 print-meta 11.5 vs album-date 12，
    元信息 year-meta 11.5 vs `--fs-meta` 12.5，眉标 eyebrow 11.5 vs
    foot-label 11。
  - sans 正文族在 14–17.5 之间有 **8 档**：卡/列表正文三种值
    （backface-val 15.5 / spec-val 15 / 摘要 14），正文响应链
    16 / 16.5 / 17 / 17.5（合理），伪正文无统一规格。
  - `--fs-h3: 21px` 令牌是**死规格**：全站真实 h3 全部覆写成 18px
    （print-cap、album-body h3），DESIGN.md 被迫注「卡片实际 18px/1.42」。
  - h2 有四档（全局 27–40 / wall-head 24–32 / prose 23–29 / cta 18–22）——
    对照原型 base.css 确认**全部是原型有意分档**（页面区块 / 相册墙区块 /
    文内小节 / 收尾小节四种语境），不是失控，但 DESIGN.md 未登记，观感
    「四档并存=没系统」。
- **考古**：碎片大多来自原型 base.css 本身（11.5×8、12×4、11×3…）——原型
  没有收敛完自己的字阶；DESIGN.md 的 5 档是对原型的抽象理想，不是现实。

## 判断

怪的三源头（按贡献排序）：
1. mono 0.5px 级碎档（元信息是全站出现频率最高的文字）；
2. 卡/列表正文 14–15.5 伪梯度；
3. 令牌与实际脱节（`--fs-h3`、`--fs-meta`）+ 角色阶未文档化。

字体家族、字重系统（600 标题 / 500 强调 / 400 正文）、行高、度量
（36em 正文 / 56ch lead）均健康，不动。

## 收敛方案（现实向 DESIGN.md 理想对齐，非换体系）

**Mono → 3 主体档 + 2 特例**：
- 11.5px **label**（眉标、foot-label、tag、刻度计数、code-head）
- 12px **meta**（日期、编号、胶囊、`--fs-meta`、spec-key、sub-note）
- 15px **tick**（胶片带年份数字，独立）
- 特例：logo-sub 10.5（顶栏空间敏感）、代码 13.5 / 13（代码独立角色）
- 改动：11→11.5（foot-label、tag、主题钮）；11.5→12（print-meta、
  year-meta、tick-count、turn-label）；12.5→12（`--fs-meta`、sub-note）

**Sans 卡片区 → 两档**：
- 18px **卡标题**（h3 族：print-cap、album h3、turn-title 17→18、
  prose h3 19→18；`--fs-h3` 令牌 21→18 对齐现实）
- 15px **卡正文**（backface-val 15.5→15；spec-val、墙卡 print-note 已是）
- 14px 摘要（album-dek）保留为独立角色

**格言档独立**：`.intro h1`（首页/关于的格言句）由 `var(--fs-h3)` 改为
字面 21px——它不是 h3，是「格言」一次性角色，不占令牌。

**h2 四档全部保留**（原型有意），在 DESIGN.md 正名登记四种语境。

## 预期视觉变化

全部为 0.5–1px 级微调（11.5→12 一批最可见），系统性收益大于单点观感：
新增组件从此有唯一正确值可循；DESIGN.md 与现实一致，detector 扫描干净。

## 验收

- `npm run build` + `npm run check` 全绿；`impeccable detect --scope type` 复扫
  无未登记字面值；
- DESIGN.md Hierarchy 重写为角色阶表（含加粗规则与「什么内容用什么档」
  使用指南）；
- 截图抽查：记忆墙卡、归档行、页脚、年份页（0.5px 级变化不逐张比价，
  以无回归为准）。
