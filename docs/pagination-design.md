# 分页设计 · 首页橱窗 + 归档按年路由

2026-10-04，所有者提出：文章增多后首页/归档必然无法一次全载，先查现状、
再明确分页动作与组件。AskUserQuestion 两项拍板（均为推荐方案）：

1. **归档页 → 按年路由**：`/blog/` 年份总览 + `/blog/[year]/` 每年一页
   + 上/下一年翻页（复用文章页 `.page-turn` 语言）；
2. **首页记忆墙 → 限量橱窗**：构建时只渲染最近 12 张；时间线年份格
   从「过滤器按钮」改为「年份链接」，年份过滤脚本退役。

## 现状结论（改造前）

- 两页均无分页：全站唯一 `getStaticPaths` 是文章 slug；首页 `wall.cards.map()`
  与归档 `years.map()` 都是构建时全量渲染，年份过滤只是 `hidden` 显隐。
- 唯一缓解：图片 `loading="lazy"`（视口外不请求）。HTML 体积与 DOM 节点
  随文章数线性增长（每卡约 1.5–2KB，300 篇时首页约 500KB HTML）。
- 备选否决理由：Astro `paginate()` 每 N 篇一页会打散按年相册语义；
  「加载更多」在纯静态站要么不省 DOM、要么引入客户端数据拉取（越零 JS 岛边界）。

## 职责分离原则

**首页 = 橱窗（最近的），归档 = 相册（全量按年）**——与拍立得隐喻一致：
墙上只钉最近的，相册按年收纳全量。年份的「全量翻阅」职责整体移交归档。

## 变更清单

| 处 | 变更 |
|---|---|
| `utils/posts.ts` | 导出 `WALL_LIMIT = 12`（单一来源） |
| `index.astro` | 记忆墙传 `wall.cards.slice(0, WALL_LIMIT)`；intro-meta 首条改「共 N 张（超量时 · 墙上留最近 12 张）」，`#tally-shown` 联动删除；`earliest`/`latestCard` 仍取全量 |
| `MemoryWall.astro` | props 改 `cards: WallCard[]`；删年份过滤脚本、`hidden` 传参、`open` 集 |
| `YearTrail.astro` | 年份格 `button` → `a href=/blog/{year}/`；标题「按年份展开」→「按年份翻阅」；删服务端状态计算与 `aria-live` 联动，留一行静态引导 |
| `blog/index.astro` | 重写为**年份总览**：卷首眉标 h1 保留 + `.year-grid` 年份墙（`a.year-cell`：年份 · N 张 · 分类）+ SubscribeCta；album 行模板移走 |
| `blog/[year].astro`（新） | `getStaticPaths` 按年生成；页首眉标 h1「归档 · {year}」+ year-jump 年际胶囊（当年 `aria-current="page"`）+ `.year-head` 大年份 + album 相册行 + `.page-turn` 上/下一年（更近/更早的一年）+ SubscribeCta |
| `global.css` | `.year-cell` 补 `text-decoration:none`（链接化）；删死代码 `aria-expanded` 展开态两段、`.wall-item.is-added`、`.wall-item[hidden]`；`.year-jump` 补 `aria-current` 态样式 |
| 锚点链接 | 旧 `/blog#y2024` 式锚点不再存在（年份即路由）；Footer/Header 的 `/blog` 链接不变 |

## 二步：时间线的胶片年份带（2026-10-04，所有者三选一拍板）

问题：时间线原是四列大格（年份 28–38px 大数字），10 年文章即桌面 3 行大格，
首页被撑得头重脚轻；且与归档总览的年份墙同组件同数据，视觉重复。

定案：**胶片年份带**——横排 mono 刻度（年份 15px + N 张 11.5px），上下发丝线
围合成一条「胶片带」，像底片边缘的年份编号；单元间 `--rule-faint` 细竖线，
hover 浅底（既有反馈语言）。年份多时 flex wrap 自动换行，高度可控（一行约
52px）；600px 以下收窄单元内边距。分类信息留在归档总览，带内只留张数
（信息减法）。层级由此拉开：首页时间线 = 速览刻度，归档总览 = 大格总目录。

组件分工：`.year-strip`/`.year-tick`（首页时间线专用，新）；
`.year-grid`/`.year-cell`（归档总览年份墙，保持大格）。

落选备选：紧凑小格网格（仍是总览大格的缩小版，层级区分弱）；最近 4 年 +
「更早的 N 年 →」入口（橱窗哲学彻底，但老年份在首页无直接入口）。

## 三步：归档直达最新一年（2026-10-04，所有者反馈）

问题：二步落地的 `/blog/` 年份总览墙让首次进入归档停在「先选年份」的状态，
多一跳；年份速览职责与首页胶片带重复。

定案（所有者拍板）：**点「归档」直接落在当前（最新）年份的相册**——图示即
`/blog/[year]/` 的形态（眉标年份 + 年际胶囊 + 大年份 + 相册行）；切换年份交给
页首胶囊。路由与组件变化：

- `/blog/` = 最新一年的相册（`YearAlbum` 组件渲染，含空集合守卫文案）；
- `/blog/{最新年}/` **不再生成**（避免与 `/blog/` 内容重复），
  `[year]` 路由只为更早年份生成；
- 年份入口的 href 统一走 `yearPath(year, homeYear)`（posts.ts）：
  最新年 → `/blog/`，其余 → `/blog/{year}/`；首页胶片带、年份胶囊、
  年际翻页全部接它（含翻页「← 更近的一年」指回 `/blog/`）；
- 年份总览墙（`.year-grid`/`.year-cell`）退役删除，`.year-meta` 保留
  （年份头的「N 张 · 分类」行仍用）；`YearAlbum` 承载相册页主体，
  `/blog/` 与 `[year]` 共用。

## 验收

- `npm run build`（9 → 9 + 年份数 页，当前 = 12 页）+ `npm run check` 全绿；
- DOM 断言：首页 `.wall-item` ≤ 12 且无 `hidden`/`#tally-shown`；年份格是
  `<a href="/blog/2024/">`；`/blog/` 总览无 `.album-row`、年份墙链接正确；
  `/blog/2024/` 含该年 2 行、翻页指向 2026/2022、当年胶囊 `aria-current`；
- 截图目验：首页橱窗 + 时间线、归档总览年份墙、年份页（1440，390 抽查）；
- Header「归档」导航在年份页保持高亮（如现有逻辑按前缀判断则自动成立）；
- 时间线（二步）：首页为 `.year-strip` 胶片带、无 `.year-cell`；归档总览
  `.year-cell` 大格墙不变。
