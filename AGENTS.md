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

- 颜色只有一个来源：`src/styles/global.css` 的 `:root` 令牌。组件内 `<style>` 只写布局（grid / flex / 间距 / 尺寸），任何颜色必须写成 `var(--token)` 或其 `color-mix()`；组件里禁止出现十六进制色值。
- 暗色定义成对维护：改任何一个基础令牌，`@media (prefers-color-scheme: dark)` 和 `:root[data-theme="dark"]` 两段都要改，它们是重复的两份。
- 任何「必须比背景更暗」的效果（投影、遮罩）用 `--shade`，不要从 `--fg` 派生 —— 暗色下 `--fg` 是暖白，派生出来会让卡片发光。
- 内容图片永不裁切。`<Image>` 在默认 `layout="none"` 下只给 `width`（高度自动）；一旦使用 `layout`，必须显式写 `fit="contain"`，否则 Astro 7.3.5 会静默按 `cover` 裁图。
- 顶栏站名与导航词禁止词中断行；560px 以下隐藏页头订阅按钮。
- 参考实现在 `reference/prototype/`，只读，不要修改。
