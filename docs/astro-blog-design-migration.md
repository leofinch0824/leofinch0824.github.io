# 拾光集原型 → astro-blog 迁移方案

日期：2026-10-04
原型：`拾光集` 四页视觉原型（index / archive / post / about）
目标仓库：`work_repos/astro-blog`（Astro 7.3.5 + MDX + RSS + Sitemap，GitHub Pages 部署）

---

## 0. 一句话结论

迁移是**两条性质不同的线**，不要混在一起做：

- **实现风格（皮肤）是「替换」** —— `build/base.css` 整份取代 `src/styles/global.css`，四个页面的结构搬进 Astro 的 layout / 页面 / 组件。
- **开发流程是「转化」，不是照搬** —— `build/inline.py` 那套构建脚本到了 Astro 里没有存在必要，因为 Astro 本身就是构建器。但脚本背后的**两条纪律必须带走**，它们才是原型流程里最值钱的部分：

  1. **令牌唯一源**：颜色只在 `:root` 定义一次，页面里任何颜色都写成 `var(--x)`。
  2. **可验证性**：样式约束要能用脚本判真假（本轮的令牌外十六进制扫描、对比度实测、渲染截图），而不是靠肉眼。

---

## 1. 现状对照

| 原型 | astro-blog 现状 |
| --- | --- |
| `build/base.css` 617 行，令牌 + 组件样式一体 | `src/styles/global.css` 141 行，Bear Blog 衍生，令牌是 `--accent #2337ff` / `--black` / `--gray` 那套 |
| 四个 `build/*.tpl.html` → 四个自包含 HTML | 没有共享 layout：`index.astro`、`blog/index.astro` 各自写一份 `<html><head><body>`，`BlogPost.astro` 也是 |
| `build/inline.py` 内联 CSS + 图片 data URI | 无；仓库用 `astro:assets` + `sharp` |
| 正文图片走 data URI，零网络请求 | `blog-placeholder-*.jpg` + `<Image>` |
| 字体为系统栈（零请求） | `fontProviders.local()` 自托管 Atkinson（2 个 woff） |
| 公式/代码是**手写样式的视觉稿** | 无公式方案；Shiki 未接；`docs/project-direction.md` 记为待定 |
| 每屏 section 带 `data-od-id` 锚点 | 无 |
| 内容：14 篇占位文章 + 虚构人设 | 4 篇 Lorem 示例 |

---

## 2. 实现风格：逐文件落点

### 2.1 直接替换

| 原型 | 落点 |
| --- | --- |
| `build/base.css` | `src/styles/global.css`（整份替换，保留文件名） |
| `build/home.tpl.html` | `src/pages/index.astro` |
| `build/archive.tpl.html` | `src/pages/blog/index.astro`（见 §7 岔路 1） |
| `build/post.tpl.html` | `src/layouts/BlogPost.astro` + `src/pages/blog/[...slug].astro` |
| `build/about.tpl.html` | `src/pages/about.astro`（**必须脱离 BlogPost layout**，关于页是双栏 backface + spec，不是文章） |
| `build/inline.py` | 删除，职责交给 Astro |
| 四个 HTML 产物 | 删除，`astro build` 产出 |

`global.css` 在 Astro 里是**全局作用域**（不被 scoped），和 base.css 的角色完全一致，这一步没有摩擦。

base.css 里这几块原样搬，它们和构建方式无关：暗色两段、`prefers-reduced-motion`、`@media print`、`@media (max-width:920px)` 回流、`@keyframes lay-down`、`@keyframes vt-out/vt-in`。

### 2.2 需要新建的 Astro 边界

这些在原型里是"一整页 HTML"，到 Astro 必须切出来：

- `src/layouts/Base.astro` —— **前置重构**。统一 `<html>/<head>/<Header>/<Footer>`，现在三处重复。不先做这个，后面每个页面都要改三遍。
- `src/components/ThemeToggle.astro` —— 切换按钮 + 无闪初始化。
- `src/components/PostCard.astro` —— 相纸卡。props：`post`、`rot`（对应原型的内联 `--rot`）、`index`（对应入场 stagger 的 `--i`）。**把 `--rot` 做成 prop 而不是写死**，这是原型里"旋转是数据、不是样式"的体现。
- `src/components/MemoryWall.astro` —— 记忆墙 + 年份展开交互（少量 TS，不需要 Svelte）。
- `src/components/YearTrail.astro` —— 年份轨迹四格。
- `src/components/Plate.astro` —— 印刷边框头图，内部用 `<Image>`。
- `src/components/SubscribeCta.astro` —— 订阅区。

`Header.astro` / `Footer.astro` 重写；`HeaderLink.astro` 的 active 判定逻辑可以留，但样式改成 `.is-current` 那套（下划线 + 字重 500），并且优先用 `aria-current="page"` 而不是纯 class。

`FormattedDate.astro` 要改：现在是 `en-us` 的 `Jul 8, 2022`，原型要的是 `2026 · 03 · 14` 这种等宽数字格式，切到 `zh-CN` + `font-variant-numeric: tabular-nums`。

### 2.3 三处真冲突（必须做决策，不能自动带过）

**① 图片：data URI 内联 vs `astro:assets`**

原型内联是为了交付单文件，Astro 必须换成 `<Image>`，好处是构建时多尺寸 + WebP + 懒加载。

但这里有一个**已验证的坑**：Astro 7.3.5 的 `<Image>`，`fit` 默认值是 `'cover'`，而它**只在 `layout` 不为 `'none'` 时生效**（`node_modules/astro/components/Image.astro:29-34`）。也就是说：

- 默认 `layout="none"` + 只给 `width`（高度自动）→ 保持原比例，**安全**。
- 一旦为了响应式用了 `layout="constrained"`（对博客很有吸引力），`fit` 会**静默变成 `cover`** → 图片被裁 → 直接违反原型那条"内容图永不裁切"的硬约束。

所以：要么留在 `layout="none"` 只给宽度，要么用 `layout` 时**显式写 `fit="contain"`**。这条要写进仓库的 AGENTS.md，否则下一个人一定会踩。

**② 字体：系统栈 vs 自托管 Atkinson**

原型是纯系统栈（零请求、中文走 PingFang/微软雅黑）。仓库已经配了 `fontProviders.local()` 自托管 Atkinson，且 `BaseHead.astro` 里有 `<Font preload>`。

建议**不浪费它**：`--font-display` 保持原型的衬线栈不变（Atkinson 是人文无衬线，不适合当标题字体）；`--font-body` 改成 `var(--font-atkinson)` 开头，后面接原型的中文回退链（`'PingFang SC','Hiragino Sans GB','Microsoft YaHei'`）。这样西文用 Atkinson、中文正确回落，且不破坏 `astro.config.mjs` 里的字体声明。

**③ Astro scoped style vs 令牌唯一源**

这是迁移里最容易被侵蚀的一条。Astro 默认鼓励组件内写 `<style>`（自动 scoped），很方便，但原型整套设计的根基是"六个令牌是唯一颜色来源"——一旦组件里出现 `#f2eee6`，暗色模式就开始漏。

建议的规矩，写进 AGENTS.md 并用脚本卡住：

> 组件内可以写 `<style>`，但**只允许写布局**（grid / flex / 间距 / 尺寸）。
> 任何颜色必须写成 `var(--token)` 或令牌的 `color-mix()`。

---

## 3. Shiki / KaTeX：原型真正给到的东西

这一条容易被低估。原型的 `.code` 和 `.formula` **不是实现，是设计规格**：

- `.code` 有 `code-head`（左侧文件名 `lis-naive.ts`、右侧语言标签）+ `tok-kw / tok-fn / tok-num / tok-cmt` 四类 token 色。
- `.formula` 有 `formula-body`（水平可滚动）+ `formula-num`（公式编号 `(1)`）。

它们正好回答了 `docs/project-direction.md` §6 里悬着的验收条件。落地方式：

- **Shiki** 默认输出行内 `style="color:#..."`。要用上你的令牌，需要写一个自定义 Shiki 主题，把 `--code-kw/--code-str/--code-num/--code-cmt` 的值喂给主题的 keyword/string/number/comment 槽位；或者改用 CSS 变量主题。
- 暗色要出**两套**主题（light/dark），用 `themes: { light, dark }` 配合 CSS 变量切换 —— 这恰好对上原型里暗色单独定义 `--code-*` 的做法，不是巧合。
- `code-head` 的文件名条正是 Expressive Code 的 frame 能力。`project-direction.md` 说它"按需评估"——原型其实已经把它画出来了，可以拿这张图判断值不值得引入。
- **KaTeX**：`formula-num` 对应 `\tag{}`（需要 amsmath 环境），`formula-body` 的水平滚动对应长公式在手机上不撑破版面。这两点直接对应 §6 的验收条件 1 和 3。

注意别把原型的假公式、假高亮当已完成能力搬过去 —— 那些 `<span class="tok-kw">` 是手敲的。

---

## 4. 开发流程：留什么、丢什么、建什么

### 4.1 留下

- **令牌唯一源**这条纪律（见 §2.3 ③）。
- **`data-od-id` 锚点**：建议保留成组件上的属性。OD 的评论模式和 impeccable 评审都靠 section 锚点定位，丢了等于把评审能力一起丢了。
- **"改样式只改一处"** 的心智：原型的 `build/base.css` → Astro 的 `src/styles/global.css`，一一对应。

### 4.2 丢掉

- `build/inline.py` 不再作为流程维护。Astro 就是构建器，它做的"内联 CSS + 内联图片"两件事分别由 Astro 打包和 `astro:assets` 接管。
  **注意区分"不再维护"和"删掉文件"**：脚本本身要连同 `build/` 一起拷进 `reference/prototype/` 留档（见 §8.1），它是原型产物可复现的唯一手段。
- 四个自包含 HTML 产物。
- 原型的假公式 / 假高亮实现（只留样式规格，见 §3）。

### 4.3 新建：把"可验证"变成 CI

这是本轮原型迭代里最该沉淀下来的东西。原型这边每次改样式我都是靠三类检查收口，它们直接可移植：

1. **令牌外十六进制扫描** —— 扫 `global.css` 和所有 `.astro`，任何 `:root{}` 之外的 `#rrggbb` 直接报错。
2. **对比度断言** —— 把六对关键前景/背景（正文、次要文字、强调色、按钮文字、三档代码色）在亮暗两套下都算一遍，低于 AA 就失败。
3. **渲染截图** —— 1440 和 390 两档，亮暗各一份。

仓库已经有 `.github/workflows/deploy.yml`，加一个 `ci.yml` 跑 `astro check` + 上面两个脚本即可。**光有纪律没有检查，纪律两个迭代就没了。**

---

## 5. 迁移顺序

每批都能独立 `astro dev` 验收，不要一次性重写：

| 批次 | 内容 |
| --- | --- |
| 0 | 抽 `Base.astro`，三处重复的 html 骨架合一 |
| 1 | `global.css` 整份替换 + BaseHead 加无闪脚本 + `ThemeToggle` |
| 2 | `Header` / `Footer` 重写 |
| 3 | `content.config.ts` 扩 schema + `index.astro` 记忆墙 + `PostCard` |
| 4 | `blog/index`（归档）+ `BlogPost` + `about` |
| 5 | Shiki 主题对接 + KaTeX（对应 project-direction 的待定项） |
| 6 | 校验脚本 + CI |

批 0 和批 1 是关键路径：做完这两步，皮肤就换完了，后面都是结构活。

**每批的完成判据见 §8.4** —— 那一节给的是 agent 能自己核对的条目，不要用"看起来对"当验收。

### 内容模型要扩（批 3 的前置）

原型的卡片需要**编号**（`№ 011`）、**分类**（技术 / 生活 / 影像 / 算法）、**阅读时长**。现在 `content.config.ts` 只有 `title / description / pubDate / updatedDate / heroImage`。

建议：

- `category` 加进去（用于卡片右下角那枚标签、归档页的分组）。
- `tags` 可选。
- **编号不要进 frontmatter** —— 它本质是按 `pubDate` 倒序的序号，构建时算出来即可，手工维护 14 个编号迟早对不上（而且 `heroImage` 可选的卡也得占一个号，这正是原型里"共 14 张"那类计数矛盾的来源）。
- `heroImage` 保持可选：原型 14 张里有一张是"无照片卡"，整块相纸就是文字本身，那是设计的一部分，不是缺图。

---

## 6. 不要搬的东西

- **14 篇占位文章与虚构人设**（杭州 / 写后端 / X100V / FM2 / 一只猫）—— 它们是撑版式长度用的，不是真实内容。
- **5 张 `blog-placeholder-*.jpg`**（除非只作为过渡期的临时图）。
- **原型的单文件内联策略** —— 那是交付形式，不是实现方式。

---

## 7. 需要你定的三个岔路（已给建议默认，可直接采用）

| 岔路 | 建议默认 | 说明 |
| --- | --- | --- |
| 1. 归档页放哪 | **`/blog` 做成按年相册** | 原型 archive 的形态直接落在 `/blog`，首页 `/` 只留卷首语 + 记忆墙。少一个路由。另一个选择是新建 `/archive`、`/blog` 保持普通列表，更贴原型的两页分离，但多一个路由和一份导航状态。 |
| 2. 正文无衬线字体 | **西文 Atkinson + 中文回落原型中文栈** | 见 §2.3 ②。标题保持原型的衬线栈不动。 |
| 3. 单文件导出要不要留 | **只留作冻结参考，不再维护** | `reference/prototype/` 里的 `inline.py` 留着不删（它是原型产物可复现的唯一方式），但**不再作为正式流程**。只有当你确实需要"单文件 HTML 给编辑器预览"时才恢复维护。 |

> 注意 1 和 3 不冲突：`build/` 要先**拷进仓库当参考**（见 §8.1），然后才谈"还要不要继续维护它"。

---

## 8. 交接前置条件

把方案交给另一个 agent 之前，下面四件事不做完，它会卡住或者跑偏。

### 8.1 必须先把原型源一起放进仓库（最容易漏，也最致命）

方案通篇引用 `build/base.css`、`build/*.tpl.html`，**但这些文件在 OD 项目目录里，不在仓库里**。另一个 agent 在 `astro-blog` 里翻不到它们，第一步就停住。

做法：

```
reference/prototype/
├── README.md          ← 一句话：只读参考，不参与构建，不要修改
├── base.css           ← 从 OD 项目 build/ 拷
├── home.tpl.html
├── archive.tpl.html
├── post.tpl.html
├── about.tpl.html
├── inline.py
└── output/            ← 四个产物 HTML，从 OD 项目根目录拷
    ├── index.html
    ├── archive.html
    ├── post.html
    └── about.html
```

- 四个产物 HTML 是**唯一的视觉基准**。agent 必须能同时打开"参考页"和 `npm run dev` 的页面并排比对，否则 §5 里每一批的"验收"都没有判据。
- `.gitignore` 不排除该目录，可以直接提交。
- 方案本身与 impeccable 上下文三件套也一起进仓库：本文件放 `docs/astro-blog-design-migration.md`；`PRODUCT.md`、`DESIGN.md` 放仓库根目录，`design.json` 放 `.impeccable/`。仓库里已装有 impeccable 技能（`.claude/skills/impeccable`），三件套就位后，在仓库里跑 `/impeccable` 即可直接加载完整项目上下文，不必回溯 OD 项目目录。
- 次选方案是只在方案里写死 OD 项目的绝对路径 —— 但那个路径跟机器绑定，换台机器或那个项目被清理就断，不建议。

### 8.2 "整份替换 global.css" 有一处会静默打断现有组件

已核对：`.sr-only` 这个类**只存在于 `src/styles/global.css`**，而 `Header.astro` 和 `Footer.astro` 各有 3 处 `<span class="sr-only">` 正在用它。

一旦批 1 把 global.css 整份换成 base.css，这 6 个无障碍标签会**一起消失**——视觉上完全看不出来，但屏幕阅读器会把顶栏和页脚读成一串没有名字的链接。这是个只有无障碍测试才会发现的回归。

做法：批 1 换肤时，先把这几条"站点基础规则"从 global.css 摘出来保留，其余整份丢弃：

- `.sr-only`（必须保留，6 处在用）
- `input, textarea { font-size: 16px }`（starter 遗留；如果将来真加订阅表单，少了它 iOS 聚焦时会自动放大页面）

### 8.3 把约束写进 AGENTS.md（现成文字，直接粘）

仓库现在的 `AGENTS.md` 和 `CLAUDE.md` 内容完全相同，只有 Astro 文档链接和 `astro dev --background`，**没有任何项目自己的规矩**。方案里反复说"这条要写进 AGENTS.md"，但没给文字 —— 给 agent 一个没写规则的仓库，它两个迭代就会把令牌纪律丢掉。

建议直接追加这一段（`AGENTS.md` 与 `CLAUDE.md` 两处同步）：

```markdown
## 设计与样式约束（拾光集设计系统）

- 颜色只有一个来源：`src/styles/global.css` 的 `:root` 令牌。组件内 `<style>` 只写布局（grid / flex / 间距 / 尺寸），任何颜色必须写成 `var(--token)` 或其 `color-mix()`；组件里禁止出现十六进制色值。
- 暗色定义成对维护：改任何一个基础令牌，`@media (prefers-color-scheme: dark)` 和 `:root[data-theme="dark"]` 两段都要改，它们是重复的两份。
- 任何「必须比背景更暗」的效果（投影、遮罩）用 `--shade`，不要从 `--fg` 派生 —— 暗色下 `--fg` 是暖白，派生出来会让卡片发光。
- 内容图片永不裁切。`<Image>` 在默认 `layout="none"` 下只给 `width`（高度自动）；一旦使用 `layout`，必须显式写 `fit="contain"`，否则 Astro 7.3.5 会静默按 `cover` 裁图。
- 顶栏站名与导航词禁止词中断行；560px 以下隐藏页头订阅按钮。
- 参考实现在 `reference/prototype/`，只读，不要修改。
```

（最后一条 `npm run check:tokens` 之类的校验命令，等批 6 的脚本落地后再补进来。）

### 8.4 每批给 agent 一个能自证的完成判据

§5 里现在的"验收"写的是"视觉零变化""换肤成功"，agent 没法自证，只能声称完成。换成可核对的：

| 批次 | 完成判据 |
| --- | --- |
| 0 | `npm run build` 通过；三个页面在 `npm run dev` 下 DOM 结构与改动前一致；无任何视觉变化 |
| 1 | 并排打开 `reference/prototype/output/index.html` 与本地首页，配色 / 字体 / 卡片投影一致；页头切换按钮点击生效，刷新后保持；**`sr-only` 仍在，屏幕阅读器不出现无名链接** |
| 2 | 顶栏在 1440 / 390 两档都不换行；页脚四列布局与参考页一致 |
| 3 | 首页记忆墙默认展开最近两年；点年份格在原页展开该年；计数与卡片数一致 |
| 4 | 四个页面齐备，路由与 §7 决定一致；归档页按年份分组 |
| 5 | 用一篇真实技术文章验证：行内/独立公式、多行推导、长代码、宽表格在 390px 不撑破版面（对应 `docs/project-direction.md` §6） |
| 6 | CI 上故意塞一个 `#ff0000` 到组件里，`check:tokens` 必须失败 |

### 8.5 顺带交代给 agent 的两句

- 仓库当前在 `dev-ui` 分支，且 `.agents/ .claude/ .codex/ .impeccable/ .zcode/` 是未跟踪状态。**先开分支再动手**，别在这些目录的去留上自作主张。
- 批 0 和批 1 是关键路径，做完这两步皮肤就换完了；**不要跳过批 0 直接改页面**，否则三处重复的 html 骨架会让每个页面改三遍。
