## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## 设计与样式约束（拾光集设计系统）

- 颜色只有一个来源：`src/styles/global.css` 的 `:root` 令牌。组件内 `<style>` 只写布局（grid / flex / 间距 / 尺寸），任何颜色必须写成 `var(--token)` 或其 `color-mix()`；组件里禁止出现十六进制色值。唯一例外：**代码块 token 色**由 Expressive Code 双主题 one-light / one-dark-pro 在构建期生成（astro.config.mjs，hex 合法），盒型/字体仍走令牌与站点规格（2026-10-05 定案，见 DESIGN.md「代码块」）。
- 暗色定义成对维护：改任何一个基础令牌，`@media (prefers-color-scheme: dark)` 和 `:root[data-theme="dark"]` 两段都要改，它们是重复的两份。
- 任何「必须比背景更暗」的效果（投影、遮罩）用 `--shade`，不要从 `--fg` 派生 —— 暗色下 `--fg` 是暖白，派生出来会让卡片发光。
- 内容图片永不裁切。`<Image>` 在默认 `layout="none"` 下只给 `width`（高度自动）；一旦使用 `layout`，必须显式写 `fit="contain"`，否则 Astro 7.3.5 会静默按 `cover` 裁图。
- 顶栏站名与导航词禁止词中断行；页头不放订阅按钮（订阅入口在页脚面板）。
- 视觉与组件的唯一基准是 `DESIGN.md`（产品事实以 `PRODUCT.md` 为准）。历史原型（reference/prototype）与迁移/精修过程文档已于 2026-10-05 清退出仓库，需要时从 git 历史找回。
- 以上约束由脚本校验（改动样式后自跑）：`npm run check:tokens`（令牌外十六进制扫描）、`npm run check:contrast`（亮暗两套四对前景/背景对比度 ≥ AA；代码块 token 色归 EC 双主题，不在此门禁内）；`npm run check` 串联 `astro check` 与前两者，并在 `.github/workflows/ci.yml` 中执行。
- Astro 官方文档可经 `astro-docs` MCP 查询（工作区 `.zcode/config.json` 已配置，远程 `https://mcp.docs.astro.build/mcp`，工具 `search_astro_docs`）；查 API/配置拿不准时优先查最新文档，不要凭记忆写。
