---
title: 'Markdown 语法与版式验收'
description: '本文同时是一篇版式验收文：行内与独立公式、多行推导（带 \\tag 编号）、带文件名条的长代码块、宽表格，都应在手机上不撑破版面。'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
category: '技术'
tags: ['markdown']
---

Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.

> 本文在 starter 语法样例之上扩为**版式验收文**（docs/astro-blog-design-migration.md §8.4 批 5）：数学公式（行内 / 独立 / 多行推导 + `\tag` 编号）、带文件名元信息的长代码块、宽表格。验收口径见 docs/project-direction.md §6：这些内容在 390px 视口都不得撑破版面，且必须可完整阅读。

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Images

### Syntax

```markdown
![Alt text](./full/or/relative/path/of/image)
```

### Output

![blog placeholder](../../assets/blog-placeholder-about.jpg)

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

### Blockquote without attribution

#### Syntax

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Note** that you can use _Markdown syntax_ within a blockquote.
```

#### Output

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Note** that you can use _Markdown syntax_ within a blockquote.

### Blockquote with attribution

#### Syntax

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### Output

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Tables

### Syntax

```markdown
| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |
```

### Output

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Code Blocks

### Syntax

we can use 3 backticks ``` in new line and write snippet and close with 3 backticks on new line and to highlight language specific syntax, write one word of language name after first 3 backticks, for eg. html, javascript, css, markdown, typescript, txt, bash

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

### Output

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

### 验收：带文件名元信息的长代码块

下面的围栏块带有 `title="src/algorithms/lis-fast.ts"` 文件名元信息——文件名条（左侧文件名、右侧语言标签）是原型 `.code-head` 的规格（reference/prototype/post.tpl.html:78）。代码体刻意包含一行超过 80 列的长注释：在 390px 视口里它应当**横向滚动**，而不是撑破版心或被折行截断。

```ts title="src/algorithms/lis-fast.ts"
// 最长递增子序列 O(n log n)：树状数组维护「值域前缀上的最大 dp 值」，
// 离散化把值域压缩到 1..m，query 前缀最大值、update 单点写入。
function lisFast(a: number[]): number {
  // 离散化：把值域压到 1..m，树状数组只关心相对大小
  const rank = new Map(
    [...new Set(a)].sort((x, y) => x - y).map((v, i) => [v, i + 1] as const),
  );
  const m = rank.size;
  const bit = new Array<number>(m + 1).fill(0);
  const query = (i: number): number => {
    let best = 0;
    for (; i > 0; i -= i & -i) best = Math.max(best, bit[i]);
    return best;
  };
  const update = (i: number, v: number): void => {
    for (; i <= m; i += i & -i) bit[i] = Math.max(bit[i], v);
  };
  let ans = 0;
  for (const x of a) {
    const i = rank.get(x)!;
    const best = query(i - 1) + 1;
    update(i, best);
    ans = Math.max(ans, best);
  }
  return ans;
}
```

## 数学公式

### 行内公式

欧拉恒等式 $e^{i\pi} + 1 = 0$ 嵌在句子里应当与中文正文共享一行，不抬高行距；质能关系写作 $E = mc^2$、求和写作 $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$ 时同理。

### 独立公式

独立成段的公式渲染在 KaTeX 的 `katex-display` 容器里，对应原型 `.formula` 的规格（surface 底、1px 发丝线、3px 圆角）：

$$
\int_{-\infty}^{\infty} e^{-x^{2}} \, dx = \sqrt{\pi}
$$

### 多行推导（align 环境 + \tag 编号）

`\tag{}` 给推导步骤编号，渲染为原型 `.formula-num` 的等价样式（等宽 13px、褪色的墨）。**已验证的 KaTeX 兼容性边界**：一条公式只允许一个 `\tag`（`aligned` 里逐行打 `\tag` 会抛 `Multiple \tag` 解析错误）。因此逐行编号的推导链写成连续的独立公式块，每块各自带 `\tag`；跨行对齐则用 `aligned` 环境，编号放在结果行上：

$$
\begin{aligned}
\because\ a[j] < a[i] &\Rightarrow dp[j]\ \text{可直接转移} \\
\therefore\ dp[i] &= 1 + \max\{\, dp[j] \mid 0 \le j < i,\ a[j] < a[i] \,\} \tag{1}
\end{aligned}
$$

$$
query(k) = \max\{\, bit[t] \mid 0 < t \le k \,\} \tag{2}
$$

$$
ans = \max_{1 \le i \le n}\, dp[i] \tag{3}
$$

### 长公式：容器横向滚动

下面这条推导链在 390px 视口必然超出 `.prose` 的 36em 版心——`.katex-display` 容器应当横向滚动（对应 `.formula-body` 规格），页面本身不出现横向滚动条：

$$
\binom{n}{k} = \frac{n(n-1)(n-2)\cdots(n-k+1)}{k!} = \frac{n!}{k!\,(n-k)!} = \frac{n \cdot (n-1) \cdot (n-2) \cdots (n-k+1)}{k \cdot (k-1) \cdot (k-2) \cdots 2 \cdot 1}, \qquad 0 \le k \le n
$$

## 宽表格

树状数组的操作成本：在 390px 视口，这张七列表格应当整体横向滚动，行头列保持可读，而不是把每个单元格压成一列竖排字。

| 算法 | 预处理 | 单点更新 | 前缀查询 | 额外空间 | 实现难度 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 朴素扫描 | — | O(1) | O(n) | O(1) | ★ | 每次查询都扫前缀 |
| 前缀和 | O(n) | O(n) | O(1) | O(n) | ★ | 更新会整体重算 |
| 线段树 | O(n) | O(log n) | O(log n) | O(4n) | ★★★ | 支持区间综合查询 |
| 树状数组 | O(n) | O(log n) | O(log n) | O(n) | ★★ | 只处理可逆/极值前缀信息 |
| 分块 | O(n) | O(√n) | O(√n) | O(n) | ★★ | 块长取 √n 时最优 |

## List Types

### Ordered List

#### Syntax

```markdown
1. First item
2. Second item
3. Third item
```

#### Output

1. First item
2. Second item
3. Third item

### Unordered List

#### Syntax

```markdown
- List item
- Another item
- And another item
```

#### Output

- List item
- Another item
- And another item

### Nested list

#### Syntax

```markdown
- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese
```

#### Output

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Other Elements — abbr, sub, sup, kbd, mark

### Syntax

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
```

### Output

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
