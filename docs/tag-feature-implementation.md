# 文章标签（tag）检索功能 · 实施计划

## Context

「拾光集」博客的文章 frontmatter 已有 `tags: z.array(z.string()).optional()`（content.config.ts:19），但全站没有任何按标签检索的入口——文章页元信息行的标签是纯文本（BlogPost.astro:26）。UI 原型已验收（`prototype/tags/`，本地 gitignore 目录），本计划把原型落成正式的静态预生成路由。

设计原则：全部复用现有设计系统，**零新增颜色、零新依赖、零客户端 JS**。标签与年份同构（都是「相册的一个翻阅维度」），页面形态照抄 YearAlbum。

## 改动清单（共 3 个文件：2 改 1 增）

### 1. 新增 `src/pages/tags/[tag].astro` —— 标签相册页

照抄 `src/pages/blog/[year].astro` 的结构：

```astro
---
export async function getStaticPaths() {
  const wall = prepareWall(await getCollection('blog'));
  // 按 tag 分桶：Map<string, WallCard[]>，新→旧已由 prepareWall 保证
  // 每个 tag 产出 { params: { tag }, props: { tag, cards, allTags } }
  // allTags: [{ name, count }]，按张数降序、同数按字典序
}
---
```

页面标记**完全照抄原型 `prototype/tags/index.html` 的 main 段**：
- 眉标 `<h1 class="eyebrow">标签 · {tag}</h1>`
- `.year-jump` 胶囊排列出全部标签（`{name} · {count}`），当前 tag 带 `aria-current="page"`
- `.year-head` 区：`.year-title` 显示标签名，`.year-meta` 显示 `{count} 张 · {涉及的分类、顿号连接}`
- `.album` 列表：复用 `.album-row` 结构（含 `.album-thumb--empty` 空相框逻辑），每行的 `.album-tag tag` 仍显示**分类**（不是标签——与年份页一致），日期格式 `MM · DD` 照抄 YearAlbum 的 `monthDay`
- 页尾 `.page-turn` 单卡：「← 归档」→ `/blog/`（**不做**「全部标签」索引页——当前仅 1 个真实标签，原型里的那个入口是占位的）

**SEO 字段**：`<Base title={`标签 · ${tag} · ${SITE_TITLE}`} description={`标记为「${tag}」的 ${count} 张相纸。`}>`，照抄 [year].astro 的写法。

**注意**：原型里的页头/页脚/license 卡不抄——`Base.astro` 布局自带 Header/Footer。

### 2. 改 `src/layouts/BlogPost.astro` —— 元信息行标签变链接

当前（第 26 行）：`const metaTopic = [category, ...(tags ?? [])].join(' / ');` 纯文本。

改为：分类保持纯文本，tags 逐个成链接。删除 `metaTopic`，在 `.article-meta` 里：

```astro
<span class="meta">
  {category}
  {(tags ?? []).map((tag) => (
    <> / <a class="meta-tag" href={`/tags/${tag}/`}>{tag}</a></>
  ))}
</span>
```

组件内 `<style>` 加一条（原型 prototype.css 已验证的形态）：

```css
/* 元信息行标签链接：静止与 .meta 一致，仅 hover 示意可点 */
.article-meta .meta-tag:hover { color: var(--accent); }
```

无标签的文章该段退化为 `{category}` 纯文本，与现状一致。

### 3. 改 `src/utils/posts.ts` —— 加标签聚合工具（可选最小化）

若 [tag].astro 里的分桶逻辑超过 ~15 行，抽一个 `prepareTags(cards)` 进来（与 `prepareWall` 同风格注释）；**若 15 行以内能写完就直接内联在 [tag].astro，不动 posts.ts**。倾向后者——先内联，等第二个调用方出现再抽。

## 硬约束（来自 CLAUDE.md / DESIGN.md）

- 颜色零新增：所有样式引用 `var(--token)`；组件内 `<style>` 只写布局 + 那一条 hover
- 标签 URL：tag 是自由字符串，`/tags/{tag}/` 路由参数直接用原值（Astro 会处理 URL 编码）；中文标签合法
- 空标签文章：年份页、记忆墙、文章页行为完全不变
- `main{width:720px}` 过渡兜底：新页面照抄 YearAlbum.astro 第 104-113 行的内联解除块
- `data-od-id`：新页面 section 加 `data-od-id="archive-tag"`（对齐 archive-year 的命名）

## 不做（明确排除）

- `/tags/` 全部标签索引页（标签数 ≤ ~8 前没意义）
- 分类路由化（分类的呈现处是年份相册，见 YearAlbum）
- 客户端筛选 / 标签云 / 搜索
- schema 改动（tags 已可选）；标签笔误（大小写变体）暂不治理——稳定后可把 tags 收成 enum
- RSS/sitemap 改动（标签页不进 RSS）

## 验收

1. `npm run check`（astro check + check:tokens + check:contrast）全绿
2. `npm run build`，确认 `dist/tags/markdown/index.html` 生成（当前唯一带 tag 的文章是 markdown-style-guide.md，`tags: ['markdown']`）
3. `astro dev --background`，人工核对：
   - `/tags/markdown/` 版式与 `prototype/tags/index.html` 一致（页头页脚是 Base.astro 的真身）
   - 文章页 `/blog/markdown-style-guide/` 元信息行「技术 / markdown」中 markdown 可点、hover 锈红、点击到 `/tags/markdown/`
   - **暗色**：系统切深色 + ThemeToggle 手动切 `[data-theme="dark"]` 各看一遍两个页面（原型未做暗色视觉核对，这里补上）
   - 390px 视口无横向滚动
4. `astro dev stop`

## 给开发者的备注

- 原型对照文件：`prototype/tags/index.html`（标签页）、`prototype/tags/article.html`（元信息行）、`prototype/tags/prototype.css`（hover 规则——注意 prototype.css 里的 `@font-face` 和 `--font-atkinson` 兜底**不要抄**，那是静态原型独有补丁，正式站点由 astro.config.mjs 注入）
- 参考实现模板：`src/pages/blog/[year].astro`（路由）+ `src/components/YearAlbum.astro`（标记）
