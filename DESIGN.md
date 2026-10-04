---
name: 拾光集 · 记忆快照
description: 文字也是一种影像记录 —— 拍立得记忆相册风格的个人博客设计系统
colors:
  # 亮色 · 相册纸上的印相
  album-paper: "#f2eee6"      # --bg 相册纸
  photo-white: "#fbf9f4"      # --surface 相纸白
  ink: "#201d18"              # --fg 墨
  faded-ink: "#665e4f"        # --muted 褪色的墨
  hairline: "#e2dbcc"         # --border 发丝线
  darkroom-rust: "#a9503a"    # --accent 暗房锈红（全站唯一强调色）
  # 暗色 · 暗房（同一套令牌的第二组值）
  darkroom-floor: "#1c1917"   # --bg 暗房底
  darkroom-print: "#262220"   # --surface 印相纸
  warm-white-ink: "#ece7dd"   # --fg 暖白墨
  darkroom-faded: "#a49a8a"   # --muted 褪色的墨（暗）
  darkroom-hairline: "#3a3430" # --border 发丝线（暗）
  rust-lifted: "#d0785c"      # --accent 锈红 · 提亮版
  # 语义
  print-shade: "#0b0a09"      # --shade 投影墨（暗色；亮色下等于 ink）
  # 代码语法（作用域令牌，低饱和，不参与强调色预算；暗色各提亮一档）
  syntax-keyword: "#7c4a39"   # --code-kw
  syntax-string: "#59684f"    # --code-str
  syntax-number: "#8a6335"    # --code-num
  syntax-keyword-dark: "#d08a72"
  syntax-string-dark: "#9db08a"
  syntax-number-dark: "#d0a86a"
typography:
  display:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(30px, 4.4vw, 52px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  year-mark:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(40px, 6vw, 68px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(27px, 3.2vw, 40px)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.012em"
  wall-heading:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(24px, 2.6vw, 32px)"
    fontWeight: 600
    lineHeight: 1.2
  prose-heading:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(23px, 2.4vw, 29px)"
    fontWeight: 600
    lineHeight: 1.3
  cta-heading:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "clamp(18px, 2.1vw, 22px)"
    fontWeight: 600
    lineHeight: 1.3
  motto:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.66
  formula:
    fontSize: "19px"
    fontWeight: 400
  site-name:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.78
  label:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    letterSpacing: "0.13em"
  meta:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    letterSpacing: "0.04em"
  page-mark:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "16px"
    fontWeight: 400
    letterSpacing: "0.13em"
  tag:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.05em"
  tick:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 500
  prose:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "17.5px"
    fontWeight: 400
    lineHeight: 1.92
  card-title:
    fontFamily: "Iowan Old Style, Palatino Linotype, Palatino, Songti SC, Noto Serif SC, Source Han Serif SC, STSong, Georgia, serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.42
  card-body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.76
  dek:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.62
  nav-link:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  button:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
  code:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.78
  code-inline:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
  caption:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    letterSpacing: "0.04em"
  micro:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    letterSpacing: "0.05em"
rounded:
  photo: "1px"     # 相纸上的照片
  frame: "2px"     # 缩略图衬框
  card: "3px"      # 相纸卡、印刷边框
  chip: "4px"      # 行内代码
  control: "8px"   # 按钮
  panel: "14px"    # 大面板
  pill: "999px"    # 标签
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.darkroom-rust}"
    textColor: "{colors.photo-white}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.faded-ink}"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.faded-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  card-print:
    backgroundColor: "{colors.photo-white}"
    rounded: "{rounded.card}"
    padding: "11px 11px 0"
  nav-link:
    textColor: "{colors.faded-ink}"
---

# Design System: 拾光集 · 记忆快照

## Overview

**Creative North Star: "文字也是一种影像记录"**

这个系统把一个个人博客当成一本摊开的拍立得相册来对待：每篇文章是一张被保存下来的记忆快照，压在暖色的相册纸上，带着轻微的手工旋转和真实的接触投影。屏幕不是发光的显示器，而是一张桌面——相纸躺在上面，而不是浮在光里。

整个系统刻意低饱和、克制、安静。颜色几乎全部让位给摄影：页面自身只有一张「纸」、一层「墨」、一根「发丝线」，锈红作为唯一强调色每屏最多出现两次，让照片承担全部色彩。动效模仿「把照片一张张摆上桌面」的物理直觉：入场是 45ms 错落的 lay-down 落纸动画，悬停是抬起 7px 并回正的物理感，静止时页面完全安静。夜间提供第二组令牌（暗房主题）：纸变成压在暗桌上的印相，底色不死黑、正文不用纯白、照片整体收 7% 亮度，长文阅读优先。

**Key Characteristics:**
- 六个基础令牌是全站唯一颜色来源；任何颜色必须写成 `var(--token)` 或其 `color-mix()`
- 亮暗两套值共用同一套令牌名，双主题是同一系统而非两套皮肤
- 相纸卡带 ±1.8° 手工旋转；错落交给旋转，高度交给网格
- 摄影 3:2、永不裁切（禁止 `object-fit: cover` 用于内容图）
- 动效全部服从 `prefers-reduced-motion`，静止优先

## Colors

一句话：一张暖纸、一层墨、一根发丝线，加一枚每屏只响两次的锈红。

### Primary
- **暗房锈红**（#a9503a，暗色 #d0785c）：全站唯一强调色。默认预算是「眉标 + 主按钮」各一次，每屏合计不超过两次。照片才是色彩的承担者，锈红是签名的红笔，不是装饰。

### Neutral
- **相册纸**（#f2eee6）：页面底色，暖纸。不是白，也不是灰。
- **相纸白**（#fbf9f4）：卡片与相纸的表面，比底色亮一档。
- **墨**（#201d18）：正文文字，暖黑。
- **褪色的墨**（#665e4f）：次要文字、元信息、题注。
- **发丝线**（#e2dbcc）：1px 边框与分隔线，几乎只是暗示。
- **投影墨**（亮色 = 墨；暗色 #0b0a09）：所有阴影的颜色来源，见 Elevation。

### 暗色 · 暗房
同一套令牌名的第二组值：**暗房底** #1c1917（暖黑，不是纯黑）、**印相纸** #262220、**暖白墨** #ece7dd（不是 #fff）、**褪色的墨** #a49a8a、**发丝线** #3a3430、**锈红提亮版** #d0785c（暗底上仍过 AA）。切换跟随系统偏好，页头按钮可手动覆写并记忆于 localStorage。

### Named Rules
**The Twice-Per-Screen Rule.** 锈红每屏最多出现两次（默认眉标 + 主按钮）。它的稀有就是它的分量；第三次出现时，一定有一个该被降级为墨或褪色的墨。

**The No-Pure-Black-White Rule.** 永远不用 `#000` 与 `#fff`。亮色的黑是暖黑 #201d18，暗色的白是暖白 #ece7dd——纸与墨都有体温。

**The One-Source Rule.** 六个基础令牌是唯一颜色来源。组件里出现十六进制色值即是缺陷；改令牌必须同时改亮暗两处定义。

## Typography

**Display Font:** Iowan Old Style / Palatino（中文回落宋体：Songti SC / Noto Serif SC）
**Body Font:** 系统无衬线（PingFang SC / Hiragino Sans GB / Microsoft YaHei）
**Label/Mono Font:** ui-monospace / SF Mono / JetBrains Mono

**Character:** 衬线只属于标题与「相纸上的手写」——它是相册里的笔迹；正文用无衬线保证长文可读；等宽体专属日期、编号、底片编号、代码与题注，是相机铭牌的字体。中文与西文各自回落到同气质的家族。

### Hierarchy

角色阶（2026-10-05 typeset 审计收敛）：同角色同值，
跨档必须 ≥1.5px 或有明确语境；新增组件只允许引用下表规格。

**衬线（display）族 —— 属于标题、「相纸上的手写」与关于页零碎句：**

| 角色 | 规格 | 用在哪 |
|---|---|---|
| 文章标题 | 600, clamp(30px, 4.4vw, 52px), 1.25 | 文章页 `article-head h1`，每页一次 |
| 年份巨字 | clamp(40px, 6vw, 68px) | 年份相册页 `year-title`（装饰位） |
| 区块标题 | 600, clamp(27px, 3.2vw, 40px), 1.18 | 页面级区块 h2（为什么写/照片背面/制作说明） |
| 墙区块标题 | 600, clamp(24px, 2.6vw, 32px) | 记忆墙 h2（墙密度高，小一档） |
| 文内小节 | 600, clamp(23px, 2.4vw, 29px), 1.3 | `prose h2` |
| 收尾小节 | 600, clamp(18px, 2.1vw, 22px) | CTA 区 h2（找到我） |
| 卡标题 | 600, 18px, 1.4–1.42 | 相纸卡标题、归档行标题、翻页标题、`prose h3` |
| 格言 | 500, 21px, 1.66, 字距 0 | 首页/关于的卷首一句话（`.intro h1`，非 h3 角色） |
| 手写注脚 | 400, 相纸语境 15px / 关于页注脚 21px | `print-note` |
| 零碎短句 | 400, 17.5px / 1.92, keep-all | 关于页「一些零碎的」（2026-10-05 拍板：属正文内容，不做标题化字号；衬线承中文印刷正文传统） |

**无衬线（body）族 —— 正文与 UI：**

| 角色 | 规格 | 用在哪 |
|---|---|---|
| 长文正文 | 400, 17.5px / 1.92（920px 起 17，600px 起 16.5） | `prose`，版心 36em |
| 正文基础 | 400, 16px / 1.62 | UI 文字、段落默认 |
| 导语 | 400, 18px / 1.78, muted | `lead` |
| 卡正文 | 400, 15px / 1.74–1.78 | backface 值、spec 值、相纸卡注脚 |
| 摘要 | 400, 14px / 1.62, muted | 归档行摘要 `album-dek` |
| 控件/导航 | 400–500, 14–14.5px | 按钮 14.5、导航词 14 |

**等宽（mono）族 —— 只属于「机器写的东西」（Signature-Only Rule 不变）：**

| 角色 | 规格 | 用在哪 |
|---|---|---|
| 页面级眉标 h1 | 400, 16px, 0.13em 字距 | 归档/年份页「归档 · YYYY」（二轮覆写后随 label 档升，保住档差） |
| label | 400, 14px, 0.13em 字距 | 眉标、题注、引言署名、credit-key |
| meta | 400, 14px, 0.02–0.06em | 日期、底片编号、年份胶囊、元信息条、翻页 label、findme、公式编号 |
| tag | 400, 13px | 标签胶囊（略小于 meta 的徽章角色） |
| tick | 500, 15px, tabular-nums | 胶片年份带的年份数字 |
| 代码 | 13.5px（块）/ 13px（行内）/ 0.86em（码内） | 代码 |
| 页脚小字 | 400, 13px（钉住） | 页脚栏标、订阅面板（所有者指定不随 meta 档放大） |

> 2026-10-05 所有者覆写（两轮）：label/meta 原为原型继承的 11.5/12px，判定过小
> 影响阅读，先放大至 13px（第 2 步）；所有者看后仍觉小，同日二轮升至 14px
> （第 3 步），tag 随调 13、页面级眉标 15→16 保档差；页脚小字按所有者指定
> 钉在 13/13.5 不动。巨型 poster 角色同日退役：关于页零碎句属正文内容，
> 降为衬线 17.5/400。

特例（有空间或角色理由，不再外扩）：顶栏副标 10.5px（空间敏感）、站名 20px、
页脚基准 13.5px。数字一律 `tabular-nums`。

**加粗规则**：600 只有标题族；500 只有「当前态/强调位」（站名、格言、
tick 年份、导航当前页、RSS 强调链）；正文与元信息永远 400——要强调时用
`--fg` 提色或 `<b>`（正文字重 700 由浏览器合成，仅在句内关键词用）。

### Named Rules
**The Signature-Only Rule.** 等宽体只用于「机器写的东西」——日期、编号、代码、参数表。它出现在正文段落里就是错了。
**The One-Size-Per-Role Rule.** 同一角色的文字在全站任何页面、任何状态下字号一致；需要新的字号先问它是不是新角色，是就登记进上表，不是就用现有档。

## Layout

容器 1180px、左右槽 32px。密度是「相册摊开」而非「仪表盘」：区块间距用 clamp(48px, 7vw, 88px)，相册里没有框线，只有留白。记忆墙是 3 列网格（行距 clamp(26px, 3.4vw, 44px)、列距 clamp(20px, 2.6vw, 34px)），末张跨两列补满；920px 起全部塌成单列。年份轨迹是四格等分按钮，以发丝线分隔。文章页版心 680px、正文 36em，头图相框允许略出血到文字列之外。间距阶：8 / 12 / 20 / 32 / 56 / 96px。

顶栏 sticky、毛玻璃（底色 88% 透明混合 + blur(14px)），站名与导航词禁止词中断行；页头不放订阅按钮，订阅入口收口于页脚面板（2026-10-05）。

## Elevation & Depth

深度是物理的，不是发光的。相纸「压」在桌面上：静止时只有贴着桌面的一层接触影（--lift-1），悬停抬起时多一层环境影（--lift-2）。阴影颜色永远来自 `--shade`，不来自 `--fg`——暗色下 `--fg` 是暖白，从它派生阴影会让相纸发光晕（这是本系统修过的真实缺陷）。

### Shadow Vocabulary
- **接触影 lift-1**（`0 1px 1px` 投影墨 7% + `0 10px 20px -14px` 投影墨 45%）：相纸静止状态。
- **抬起影 lift-2**（`0 2px 3px` 9% + `0 28px 44px -22px` 45%）：悬停 / 聚焦态，配合 translateY(-7px)。
- **暗色变体**：投影墨取 #0b0a09、两档不透明度提到 50–80%，暗桌上影子要更实更贴。
- **纸纹颗粒**：全屏 feTurbulence 噪点层（亮 5.5% / 暗 2.8%），纸不是纯色。

### Named Rules
**The Print-Lies-Flat Rule.** 相纸压在桌上，不浮在光里。任何阴影必须比所在表面更暗；暗色下禁止从 `--fg` 派生投影。

**The Motion-Is-Physics Rule.** 动效只模拟纸的物理：入场 lay-down（0.6s，cubic-bezier(.16,.84,.3,1)，每张延迟 45ms）、悬停抬起回正（0.42s）。读者开始阅读时页面必须完全静止；`prefers-reduced-motion` 下全部关闭。

## Shapes

形式语言来自相纸：卡片是 3px 圆角的矩形（相纸的直边只被生产模具磨掉一点点），照片本身 1px，按钮 8px，大面板 14px，标签是完整胶囊（999px）。边框永远是 1px 发丝线——相册里没有粗框。旋转是形状的一部分：每张卡带一个 ±1.8° 内的内联 `--rot` 值，悬停时回正到 0°，这个「被摆正」的瞬间就是系统的签名交互。

## Components

### Buttons
- **Shape:** 8px 圆角，内边距 10px 18px，字重 500。
- **Primary:** 锈红底 + 相纸白字（暗色用提亮锈红 + 印相纸字），占强调色预算一次。
- **Hover / Focus:** 亮色底色向墨压深（--accent-hover），暗色反向提亮（向白混 12%，对印相纸深字 5.7:1）；`:active` 下压 1px；焦点环 2px 锈红、外偏 3px。
- **Secondary:** 透明底 + 发丝线边框、墨色字，悬停边框加深为墨。
- **Ghost / 图标钮:** 无底无框，褪色的墨；34px 圆形用于主题切换。

### Chips
- **标签（tag）:** 透明底胶囊（999px），1px 极淡发丝线，等宽 11px、字距 0.05em，褪色的墨。出现在卡片元信息行与筛选处。

### Cards / Containers
- **相纸卡（.print）:** 系统签名组件。相纸白底、1px 发丝线、3px 圆角、接触影 lift-1；内边距 11px 11px 0，上方是 3:2 照片（1px 圆角），下方题注区 13px 3px 17px。整卡带 ±1.8° 内联旋转，悬停抬起 7px 回正并换 lift-2、标题下出现发丝下划线。元信息行：等宽 11.5px、底片编号用褪色的墨。
- **无照片卡（.note-face）:** 同样 3:2 的纯文字相纸——「文字也是一种影像记录」的直译。衬线 16.5px/1.78，墨色 76% 混合。
- **印刷边框头图（.plate）:** 文章页头图。相纸白衬 13px、1px 发丝线、3px 圆角、lift-1；题注等宽 11.5px 带暗房锈红 ▣ 前缀记号。

### Inputs / Fields
- 项目当前无表单输入（订阅入口为页脚 RSS 强调链接，页头按钮已移除）。若将来引入：透明底 + 1px 发丝线 + 8px 圆角，焦点环同按钮；字号不小于 16px 防 iOS 聚焦放大。

### Navigation
- **顶栏：** sticky + 毛玻璃。站名衬线 20px + 等宽小字副标；导航词 14px、褪色的墨，当前页用墨色 + 500 字重 + 1px 下划线。词内禁止断行。

### 代码块（.code）
- 相纸上的印刷品：code-bg（墨 5% 混相纸白）底、code-head 文件名条（等宽，左文件名右语言标签）、1px 圆角。token 色：关键字 #7c4a39 / 字符串 #59684f / 数字 #8a6335 / 注释为褪色的墨 92% 混合（全部低于饱和阈值，不参与强调色预算；暗色各提亮一档）。这是 Shiki 主题对接的设计规格。

## Do's and Don'ts

### Do:
- **Do** 让照片承担色彩；页面自身保持纸 + 墨 + 发丝线的三件套。
- **Do** 给每张相纸卡一个 ±1.8° 内的独立旋转值——错落是数据，不是随机。
- **Do** 改任何令牌时同时改亮暗两处定义（`prefers-color-scheme` 块与 `[data-theme="dark"]` 块成对维护）。
- **Do** 用 `--shade` 写一切「要比表面更暗」的效果。
- **Do** 长文优先：正文 36em、行高 1.9 上下、`text-wrap: pretty`。

### Don't:
- **Don't** 让锈红在一屏出现第三次。
- **Don't** 用 `object-fit: cover` 裁切内容照片；比例只做布局兜底，画幅永远完整。
- **Don't** 在组件里写死十六进制色值——六令牌之外没有颜色。
- **Don't** 加贴纸堆砌、重做旧、3D、粒子、霓虹；动效超出「纸的物理」即为越界。
- **Don't** 在暗色下从 `--fg` 派生阴影或发光——相纸会亮成一团。
- **Don't** 用 `#000` / `#fff`。
