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

## 验收

- `npm run build`（9 → 9 + 年份数 页，当前 = 12 页）+ `npm run check` 全绿；
- DOM 断言：首页 `.wall-item` ≤ 12 且无 `hidden`/`#tally-shown`；年份格是
  `<a href="/blog/2024/">`；`/blog/` 总览无 `.album-row`、年份墙链接正确；
  `/blog/2024/` 含该年 2 行、翻页指向 2026/2022、当年胶囊 `aria-current`；
- 截图目验：首页橱窗 + 时间线、归档总览年份墙、年份页（1440，390 抽查）；
- Header「归档」导航在年份页保持高亮（如现有逻辑按前缀判断则自动成立）。
