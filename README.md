# 拾光集 · Time Travel

个人博客：把每篇文章当成一张被保存的记忆快照。Astro ^7 静态站点——文章、公式（KaTeX）、代码高亮（Expressive Code，one-light / one-dark-pro 双主题）全部构建时渲染，无客户端框架；GitHub Actions 构建并发布到 GitHub Pages。

## 两份准则（改任何前端之前的唯一依据）

- **[DESIGN.md](./DESIGN.md)** —— 视觉系统唯一权威：六令牌调色、字号角色阶、相纸隐喻、暗色成对规则、组件规格与 Do/Don't。
- **[PRODUCT.md](./PRODUCT.md)** —— 产品定义：定位、分页与归档定案、内容事实与未决项（所有者未提供的事实不得虚构）。

日常协作约定见 [AGENTS.md](./AGENTS.md)（`CLAUDE.md` 为其符号链接）。

## 结构

```text
src/pages/         路由：/ 记忆墙橱窗（最近 12 张）、/blog/ 最新年相册、
                   /blog/[year]/ 年份相册、/about/、文章页
src/components/    Header / Footer / MemoryWall / YearTrail / YearAlbum 等
src/content/blog/  文章（Content Collections；现仅剩版式验收文占位，待真实文章进场）
src/styles/        global.css —— 颜色只在 :root 令牌定义，组件样式只引用令牌
scripts/           check-tokens / check-contrast 门禁脚本
```

## 命令

| 命令 | 作用 |
| :--- | :--- |
| `npm run dev` | 开发服务器（agent 用后台模式：`npx astro dev --background`，以 `astro dev stop / status / logs` 管理） |
| `npm run build` | 产出 `dist/`（含 sitemap 与 RSS） |
| `npm run preview` | 本地预览构建产物 |
| `npm run check` | `astro check` + 令牌唯一源 + 对比度门禁 |
