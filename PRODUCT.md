# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **作者本人**：博客的作者兼读者。持续发布个人文章，也需要长期回读自己的旧文；写作内容涵盖技术分享、算法、论文式数学推导与生活记录。
- **访客读者**：从首页记忆墙或归档进入，核心任务是安静地读完一篇长文；阅读注意力应全程留在内容上，不被界面打扰。

## Product Purpose

个人博客「拾光集」：持续发布个人文章，同时承载技术内容与生活记录。核心主张是「文字也是一种影像记录」——每篇文章以一张被保存的记忆快照的方式呈现（首页记忆墙、按年份翻阅的相册式归档、干净的长文正文）。成功的含义：初次阅读顺畅、长期回读愉悦；公式、代码等复杂排版不破坏阅读节奏；站点可长期维护、持续迭代。

## Positioning

把文章当影像记忆来陈列，而不是通用博客模板的内容列表：记忆墙与相册式归档承载「翻看」的体验，正文页退回纯粹的阅读体验，两者共用同一套克制的视觉语言。视觉系统（六令牌、相纸隐喻、暗房暗色）以 DESIGN.md 为唯一权威，本文件不复述视觉条款。

## Operating Context

- 内容以 Markdown 为主、MDX 按需；Astro Content Collections 组织文章元数据，编号（№ NNN）按日期倒序构建时计算，不进 frontmatter。
- 数学公式：KaTeX（`remark-math` + `rehype-katex`）已安装并构建时验证（2026-10-04 批5）：行内/独立公式、`aligned` 多行推导、`\tag` 编号、长公式横向滚动渲染正常，验收文为 `src/content/blog/markdown-style-guide.md`；已实证边界——一条公式仅支持一个 `\tag`，逐行编号须拆为多个公式块。390px 不溢出的实测方法与数据见 `docs/layout-qa-390.md`。
- 代码高亮：Astro 内置 Shiki 已接入，自定义 CSS 变量主题使 token 色走 `--code-*`（`src/styles/code-theme.mjs`）；Expressive Code 已评估并**不采用**——它构建期强制十六进制主题色、无法消费 `--code-*` 令牌，引入即破坏颜色单一来源；代价是 `.code-head` 文件名条暂无实现。
- 整体技术边界：Astro + CSS，必要的独立交互用少量 TypeScript；不将 Svelte、Motion、GSAP、D3、ECharts 列为默认依赖；`ClientRouter` 未启用，是否采用单独评估。
- 真实开发仓库：`/Users/pegasus/workplace/work_repos/astro-blog`（Astro ^7.3.5，带 GitHub Actions CI）；原型四页（index / archive / post / about）是唯一的视觉验收基准；迁移路径见 `astro-blog-design-migration.md`（进仓库后放 `docs/`）。

## Capabilities and Constraints

已确认：

- 网站呈现服务于每篇文章的内容；视觉的目的是改善体验与聚焦，不能增加阅读负担。
- 必需能力：可靠的 Markdown 渲染与正文排版；论文式 LaTeX 数学公式；代码块语法高亮；复杂内容与普通段落混排不打断节奏。
- 内容照片永不裁切：完整画幅呈现，内容图禁用 `object-fit: cover`（内容真实性规则，非装饰偏好）。
- 动效只做操作反馈与导航衔接；正文不使用逐段显现、滚动劫持、视差；全部动效遵循 `prefers-reduced-motion`。
- 构建时完成渲染（文章、公式、高亮），阅读内容在页面打开时直接可用；客户端脚本保持最少。

明确未决（不得当作事实，也不得虚构）：

- About 人设事实已由作者提供（2026-10-04：算法工程师，喜欢健身，喜欢看电影；肖像用 `docs/images-test/portrait.jpg`）；仍待作者提供：名字、坐标、联系方式邮箱。
- 站内文章：`test2.md`（Claude Code 源码分析）为作者提供的真实文章；其余 5 篇为 lorem 占位样文。全部配图来自 `docs/images-test/` 测试图池循环选取（拷贝于 `src/assets/test-pool/`），非正式照片。
- KaTeX 基础兼容性（行内/独立公式、多行推导、`\tag` 编号、横向滚动）已按验收文验证；公式交叉引用、算法伪代码环境仍待真实文章验证（验收条件见 astro-blog 仓库 `docs/project-direction.md` §6）。
- 订阅（subscribe）区块仅为版面占位，作者已确认暂不接入真实订阅服务。

## Brand Commitments

- 站名「拾光集」；设计系统注册名「拾光集 · 记忆快照」。
- 北星句「文字也是一种影像记录」为品牌级主张（收录于 DESIGN.md）。
- 具体视觉条款（每屏强调色至多两次、相纸平放不发光等）见 DESIGN.md，此处不复制。

## Evidence on Hand

- astro-blog 仓库 `docs/project-direction.md`：使用背景、体验需求、正文技术栈推荐与 §6 验收条件。
- 原型四页 + `DESIGN.md` + `.impeccable/design.json`（七个可渲染组件片段；进仓库后分别位于 `reference/prototype/output/`、根目录、`.impeccable/`）——当前视觉与组件基准。
- `astro-blog-design-migration.md`：迁移批次顺序、默认决策与 AGENTS.md 条款文字。
- 缺失且后续工作不得虚构：真实文章、真实个人照片、真实人设信息、订阅服务。

## Product Principles

1. **内容即时可读**：不等待开场动画，读者停下来阅读时页面保持安静。
2. **阅读优先**：正文宽度、字号行距、中英文混排、对比度与移动端排版优先于任何装饰。
3. **真实性**：照片完整呈现不裁切；未验证的能力不当作已完成。
4. **长期维护**：能构建时做的不到客户端做；约束写成可脚本校验的断言进 CI。
5. **克制表达**：低饱和、少量强调，让摄影与文字本身承载色彩。

## Accessibility & Inclusion

- 亮、暗两主题的所有文字与强调色对比度 ≥ WCAG AA（当前实测最低 4.90）。
- 功能性文字不小于 11px。
- 全部动效在 `prefers-reduced-motion` 下禁用。
- 主题切换持久化于 localStorage，无闪初始化，未选择时跟随系统偏好。
- 屏幕阅读器标签（`.sr-only`，Header / Footer 各 3 处）在任何换肤或迁移中必须保留。
