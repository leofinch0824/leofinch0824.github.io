# 390px 版式不溢出自证记录

对应 `astro-blog-design-migration.md` §8.4 批 5 判据：「公式/代码/表格在 390px 视口不撑破版面（方法 + 结论）」。
本文件是该判据的落盘记录；复验时按「复现方法」重跑即可，不必复述结论。

## 结论

**通过。** 390×844 视口下，验收文正文页（`/blog/markdown-style-guide/`）页面级无横向溢出：
`document.scrollingElement.scrollWidth`（375）≤ `window.innerWidth`（390）。
正文内确有大量元素右缘超出视口（>391px，共 353 处），但**全部位于自带 `overflow-x: auto` 的容器内**
（`pre.astro-code` 代码块、`.katex-display` 公式容器、`.prose table` 表格），即内容在容器内横向滚动，
页面本身不出现横向滚动条——正是原型 `.code` / `.formula-body` / 宽表格规格的预期行为。

对应静态证据（`src/styles/global.css`）：`.prose table { display: block; overflow-x: auto; }`、
`.katex-display` 容器 `overflow-x: auto`、Shiki 产物 `pre.astro-code` 内联 `overflow-x: auto`。

## 方法（2026-10-04 实测）

1. `npm run build` 后 `npm run preview` 起静态服务；
2. 浏览器视口设为 390×844，打开验收文；
3. 控制台执行页面级检查：比较 `scrollingElement.scrollWidth` 与 `window.innerWidth`；
4. 元素级归因：遍历 `.prose *`，取 `getBoundingClientRect().right > 391` 的元素，
   逐个核对是否位于上述 `overflow-x: auto` 容器内（实测 353 处均收敛于容器，无游离溢出）。

## 覆盖范围与限制

- 实测页面：验收文正文页（公式/代码/表格最密集的页面，即判据所指页面）；首页 390 亮色截图同期目验无异常。
- 未做全部页面 × 亮暗矩阵的 390 实测；首页记忆墙、归档、关于页在 390 下的逐页量化数据未单独记录。
- 数据为 2026-10-04 构建产物（批 5 完成态 + 后续批 1 修复态）的实测值；样式或内容大改后应复跑本方法。
