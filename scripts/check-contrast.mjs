#!/usr/bin/env node
/**
 * 拾光集 · 关键前景/背景对比度断言（docs/astro-blog-design-migration.md §4.3.2）
 *
 * 从 src/styles/global.css 解析亮、暗两套令牌（暗色有 @media(prefers-color-scheme)
 * 与 :root[data-theme="dark"] 两份重复定义，先校验两份一致，再任取合并结果计算），
 * 自实现 WCAG 相对亮度与对比度，对七对关键前景/背景断言 ≥ AA（4.5:1）：
 *
 *   正文 --fg/--bg · 次要 --muted/--bg · 强调 --accent/--bg ·
 *   主按钮文字 --surface/--accent · 代码三档 --code-kw / --code-str / --code-num
 *
 * 代码三档的底色有两层口径，都做门禁、取更严者：
 *   a. 真实渲染底 --code-bg（global.css:--code-bg = --fg 5% 混 --surface，
 *      构建期 color-mix，本脚本用 OKLab 自行解析）；
 *   b. 任务书字面底 --surface。
 * 另输出参考值（不门禁）：--code-cmt（muted 92% 透明度）合成到 --code-bg 后的对比度。
 *
 * 零依赖，Node >= 22。任一门禁对低于 4.5:1 以退出码 1 结束。
 */
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const cssRelPath = 'src/styles/global.css';

const AA = 4.5;
const fatal = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

/* ── 1. 解析 global.css 的 :root 系块 ───────────────────────────────────── */

function isRootSelector(sel) {
  const s = sel.trim();
  if (!s) return false;
  // 与 check-tokens.mjs 同款收紧：只认「同一元素的复合选择器」（:root、:root[attr]、:root:not(…)），
  // 含组合器的后代块（:root[data-theme="dark"] .foo）是组件规则块，不是令牌定义位（终审遗留 #12）。
  return s.split(',').every((part) => /^:root([:[.#*][^\s>+~]*)?$/i.test(part.trim()));
}

/** 返回 [{selector, media, decls}]，只收集 :root 系块；decls 为 {--x: value} */
function parseRootBlocks(css) {
  const blocks = [];
  let buf = '';
  let declBuf = '';
  let line = 1;
  const stack = []; // {root, mediaPrelude|null}
  const nearestMedia = () => {
    for (let k = stack.length - 1; k >= 0; k--) if (stack[k].mediaPrelude) return stack[k].mediaPrelude;
    return null;
  };
  const addDecl = (text) => {
    const m = text.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]*?)\s*$/);
    if (!m) return;
    const top = stack.at(-1);
    const block = blocks.at(-1);
    if (top?.root && block) block.decls[m[1]] = m[2];
  };
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '\n') { line++; buf += ch; declBuf += ch; i++; continue; }
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? css.length : end + 2;
      for (let k = i; k < stop; k++) if (css[k] === '\n') { line++; buf += '\n'; declBuf += '\n'; } else { buf += ' '; declBuf += ' '; }
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== ch) { if (css[j] === '\\') j++; j++; }
      const piece = css.slice(i, Math.min(j + 1, css.length));
      buf += piece; declBuf += piece;
      for (let k = i; k < Math.min(j + 1, css.length); k++) if (css[k] === '\n') line++;
      i = j + 1;
      continue;
    }
    if (ch === '{') {
      const sel = buf.trim();
      buf = ''; declBuf = '';
      stack.push({ root: isRootSelector(sel), mediaPrelude: /^@media\b/i.test(sel) ? sel : null });
      if (stack.at(-1).root) blocks.push({ selector: sel, media: nearestMedia(), decls: {}, line });
      i++;
      continue;
    }
    if (ch === '}') {
      if (declBuf.trim()) addDecl(declBuf);
      stack.pop(); buf = ''; declBuf = '';
      i++;
      continue;
    }
    if (ch === ';') {
      if (declBuf.trim()) addDecl(declBuf);
      declBuf = '';
      i++;
      continue;
    }
    buf += ch; declBuf += ch;
    i++;
  }
  return blocks;
}

function mergeBlocks(blocks) {
  const out = {};
  for (const b of blocks) for (const [k, v] of Object.entries(b.decls)) out[k] = v;
  return out;
}

/* ── 2. 颜色引擎：hex / 关键字 / var() / color-mix(in oklch …) ───────────── */

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** {r,g,b,a}（0–1 线性化通道另存 lr,lg,lb）→ {L,A,B,alpha} OKLab（Björn Ottosson 矩阵） */
function toOklab({ lr, lg, lb, a }) {
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    A: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    B: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    alpha: a,
  };
}

function oklabToLinear(lab) {
  const l_ = lab.L + 0.3963377774 * lab.A + 0.2158037573 * lab.B;
  const m_ = lab.L - 0.1055613458 * lab.A - 0.0638541728 * lab.B;
  const s_ = lab.L - 0.0894841775 * lab.A - 1.291485548 * lab.B;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return {
    lr: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    lg: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    lb: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    a: lab.alpha,
  };
}

function hexToRgba(hex) {
  let d = hex.slice(1);
  if (d.length === 3 || d.length === 4) d = [...d].map((c) => c + c).join('');
  if (d.length !== 6 && d.length !== 8) return null;
  const ch = (i) => parseInt(d.slice(i, i + 2), 16) / 255;
  // r/g/b 存 gamma sRGB（供显示与合成），lr/lg/lb 存线性化通道（供亮度计算）
  const [r, g, b] = [ch(0), ch(2), ch(4)];
  return { r, g, b, lr: srgbToLinear(r), lg: srgbToLinear(g), lb: srgbToLinear(b), a: d.length === 8 ? ch(6) : 1 };
}

/** 顶层逗号切分（忽略括号内） */
function splitTopLevel(s, sep) {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function substituteVars(value, vars) {
  let s = value;
  for (let guard = 0; s.includes('var(') && guard < 16; guard++) {
    s = s.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*?)\s*)?\)/g, (m, name, fb) => {
      if (vars[name] !== undefined) return vars[name];
      if (fb !== undefined && fb.trim() !== '') return fb;
      return m; // 无解 → 留给下一轮 / 最终报错
    });
  }
  if (s.includes('var(')) throw new Error(`无法解析的 var() 引用：${value.trim()}`);
  return s;
}

/** color-mix(in oklch, C1 [w1]?, C2 [w2]?)；权重缺省 50/50，给一处则另一处取余 */
function parseColorMix(inner) {
  const args = splitTopLevel(inner, ',').map((a) => a.trim());
  if (!/^in\s+oklch$/i.test(args[0])) throw new Error(`暂不支持的 color-mix 插值空间：${args[0]}`);
  const inputs = args.slice(1).map((arg) => {
    const m = arg.match(/^([\s\S]*?)(?:\s+(-?[\d.]+%))?$/);
    return { color: parseColor(m[1]), w: m[2] === undefined ? null : parseFloat(m[2]) / 100 };
  });
  if (inputs.length !== 2) throw new Error(`color-mix 需要 2 个颜色：${inner}`);
  let [w1, w2] = [inputs[0].w, inputs[1].w];
  if (w1 === null && w2 === null) { w1 = 0.5; w2 = 0.5; }
  else if (w1 === null) w1 = 1 - w2;
  else if (w2 === null) w2 = 1 - w1;
  const sum = w1 + w2;
  if (sum <= 0) throw new Error(`color-mix 权重之和为 0：${inner}`);
  w1 /= sum; w2 /= sum;

  // hue powerless（某一路色度≈0 沿用另一路）+ shorter 弧；alpha 按 premultiplied 插值
  const l1 = toOklab(inputs[0].color), l2 = toOklab(inputs[1].color);
  const c1 = Math.hypot(l1.A, l1.B), c2 = Math.hypot(l2.A, l2.B);
  const h1 = c1 < 1e-4 ? Math.atan2(l2.B, l2.A) : Math.atan2(l1.B, l1.A);
  const h2 = c2 < 1e-4 ? h1 : Math.atan2(l2.B, l2.A);
  let dh = h2 - h1;
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  const H = h1 + dh * w2;
  const a1 = l1.alpha * w1, a2 = l2.alpha * w2;
  const alpha = a1 + a2;
  if (alpha === 0) return { r: 0, g: 0, b: 0, lr: 0, lg: 0, lb: 0, a: 0 };
  const L = (l1.L * a1 + l2.L * a2) / alpha;
  const C = c1 * w1 + c2 * w2;
  const lab = { L, A: Math.cos(H) * C, B: Math.sin(H) * C, alpha };
  const lin = oklabToLinear(lab);
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  return {
    r: linearToSrgb(clamp01(lin.lr)),
    g: linearToSrgb(clamp01(lin.lg)),
    b: linearToSrgb(clamp01(lin.lb)),
    lr: lin.lr, lg: lin.lg, lb: lin.lb, a: lab.alpha,
  };
}

function parseColor(input) {
  const s = input.trim().toLowerCase();
  const keywords = {
    transparent: { r: 0, g: 0, b: 0, lr: 0, lg: 0, lb: 0, a: 0 },
    black: hexToRgba('#000000'),
    white: hexToRgba('#ffffff'),
  };
  if (keywords[s]) return keywords[s];
  if (s.startsWith('#')) {
    const c = hexToRgba(s);
    if (!c) throw new Error(`无法解析的十六进制色值：${input.trim()}`);
    return c;
  }
  if (s.startsWith('color-mix(') && s.endsWith(')')) {
    return parseColorMix(s.slice('color-mix('.length, -1));
  }
  throw new Error(`暂不支持的颜色写法：${input.trim()}`);
}

function resolveToken(name, vars) {
  const v = vars[name];
  if (v === undefined) throw new Error(`令牌 ${name} 未定义`);
  return parseColor(substituteVars(v, vars));
}

/* ── 3. WCAG 相对亮度与对比度 ───────────────────────────────────────────── */

const luminance = (c) => 0.2126 * c.lr + 0.7152 * c.lg + 0.0722 * c.lb;
function contrast(c1, c2) {
  const [hi, lo] = [luminance(c1), luminance(c2)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** 前景带透明度时先合成到背景（浏览器 alpha 合成发生在 gamma sRGB 空间） */
function compositeOver(fg, bg) {
  const mix = (f, b) => f * fg.a + b * (1 - fg.a);
  const r = mix(fg.r, bg.r), g = mix(fg.g, bg.g), b = mix(fg.b, bg.b);
  return { r, g, b, lr: srgbToLinear(r), lg: srgbToLinear(g), lb: srgbToLinear(b), a: 1 };
}
const hexOf = (c) => {
  const to = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0');
  return `#${to(c.r)}${to(c.g)}${to(c.b)}` + (c.a < 1 ? ` (${Math.round(c.a * 100)}%)` : '');
};

/* ── 4. 自检（防止数学回归）──────────────────────────────────────────────── */

const selfTest = () => {
  const bw = contrast(hexToRgba('#000000'), hexToRgba('#ffffff'));
  const grey = contrast(hexToRgba('#767676'), hexToRgba('#ffffff'));
  if (Math.abs(bw - 21) > 0.05) fatal(`自检失败：#000/#ffffff 对比度应为 21:1，算得 ${bw.toFixed(2)}:1`);
  if (!(grey > 4.4 && grey < 4.7)) fatal(`自检失败：#767676/#ffffff 对比度应约 4.54:1，算得 ${grey.toFixed(2)}:1`);
};
selfTest();

/* ── 5. 读取令牌，校验暗色两份一致 ───────────────────────────────────────── */

let blocks;
try {
  blocks = parseRootBlocks(readFileSync(`${repoRoot}/${cssRelPath}`, 'utf8'));
} catch (err) {
  fatal(`${cssRelPath} 读取失败：${err.message}`);
}

const lightBlocks = blocks.filter((b) => !b.media && b.selector === ':root');
const darkMediaBlocks = blocks.filter((b) => b.media?.includes('prefers-color-scheme') && b.selector.startsWith(':root'));
const darkManualBlocks = blocks.filter((b) => !b.media && /^:root\[data-theme=["']?dark/i.test(b.selector));
if (!lightBlocks.length) fatal('未找到顶层 :root 块');
if (!darkMediaBlocks.length) fatal('未找到 @media(prefers-color-scheme: dark) 内的 :root 块');
if (!darkManualBlocks.length) fatal('未找到 :root[data-theme="dark"] 块');

const light = mergeBlocks(lightBlocks);
const darkMedia = mergeBlocks(darkMediaBlocks);
const darkManual = mergeBlocks(darkManualBlocks);

const driftErrors = [];
const normValue = (v) => v.replace(/\s+/g, ' ').trim(); // CSS 值与换行/缩进无关，比较前归一
for (const key of new Set([...Object.keys(darkMedia), ...Object.keys(darkManual)])) {
  const a = darkMedia[key], b = darkManual[key];
  if (a !== undefined && b !== undefined && normValue(a) !== normValue(b)) {
    driftErrors.push(`暗色两份定义不一致：${key}\n    @media 内：${normValue(a)}\n    [data-theme=dark]：${normValue(b)}`);
  }
}
const requiredDarkOverrides = ['--bg', '--surface', '--fg', '--muted', '--accent', '--code-kw', '--code-str', '--code-num'];
for (const key of requiredDarkOverrides) {
  if (darkMedia[key] === undefined) driftErrors.push(`@media(prefers-color-scheme: dark) 内未显式覆写 ${key}（将从亮色继承，暗色两段须成对维护）`);
  if (darkManual[key] === undefined) driftErrors.push(`:root[data-theme="dark"] 内未显式覆写 ${key}（将从亮色继承，暗色两段须成对维护）`);
}
for (const e of driftErrors) console.error(`✗ ${e}`);
if (driftErrors.length) process.exit(1);

// 暗色合并结果 = 亮色为基础、暗色覆写（与浏览器级联一致）
const dark = { ...light, ...darkMedia };

/* ── 6. 七对关键前景/背景 × 亮暗 ─────────────────────────────────────────── */

const PAIRS = [
  { name: '正文', fg: '--fg', bg: '--bg' },
  { name: '次要文字', fg: '--muted', bg: '--bg' },
  { name: '强调色', fg: '--accent', bg: '--bg' },
  { name: '主按钮文字', fg: '--surface', bg: '--accent' },
  { name: '代码·关键字', fg: '--code-kw', bg: '--code-bg', also: '--surface' },
  { name: '代码·字符串', fg: '--code-str', bg: '--code-bg', also: '--surface' },
  { name: '代码·数字', fg: '--code-num', bg: '--code-bg', also: '--surface' },
];

function evaluate(map, label) {
  const rows = [];
  for (const pair of PAIRS) {
    let fg, bg, alsoBg;
    try {
      fg = resolveToken(pair.fg, map);
      bg = resolveToken(pair.bg, map);
      alsoBg = pair.also ? resolveToken(pair.also, map) : null;
    } catch (err) {
      fatal(`${label} · ${pair.name}：${err.message}`);
    }
    const r = contrast(fg, bg);
    const r2 = alsoBg ? contrast(fg, alsoBg) : null;
    const worst = r2 === null ? r : Math.min(r, r2);
    rows.push({ pair, fg, bg, alsoBg, r, r2, worst, ok: worst >= AA });
  }
  return rows;
}

const printRows = (rows) => {
  for (const { pair, fg, bg, alsoBg, r, r2, ok } of rows) {
    const main = `${pair.name.padEnd(6, '　')} ${pair.fg.padEnd(11)} ${hexOf(fg)} on ${pair.bg.padEnd(10)} ${hexOf(bg)}`;
    const extra = alsoBg ? `（对 ${pair.also} ${hexOf(alsoBg)}：${r2.toFixed(2)}:1）` : '';
    const ratio = `${r.toFixed(2)}:1`;
    console.log(`  ${ok ? '✓' : '✗'} ${main}  ${ratio.padStart(7)} ${extra}`);
  }
};

console.log(`拾光集 · 前景/背景对比度检查（WCAG AA ≥ ${AA}:1）`);
console.log(
  `解析 ${cssRelPath}：亮色 :root ×${lightBlocks.length}；` +
    `暗色 @media 块 ×${darkMediaBlocks.length}、暗色 [data-theme="dark"] 块 ×${darkManualBlocks.length}` +
    ` —— 两份暗色定义一致 ✓`,
);

const lightRows = evaluate(light, '亮色');
const darkRows = evaluate(dark, '暗色');
let failed = false;

console.log('\n亮色');
printRows(lightRows);
console.log('\n暗色');
printRows(darkRows);

// 参考值（不门禁）：--code-cmt 合成后的对比度
try {
  for (const [label, map] of [['亮色', light], ['暗色', dark]]) {
    const cmt = resolveToken('--code-cmt', map);
    const codeBg = resolveToken('--code-bg', map);
    const r = contrast(compositeOver(cmt, codeBg), codeBg);
    console.log(`  ℹ 参考（不门禁）：${label} --code-cmt 合成到 --code-bg = ${r.toFixed(2)}:1`);
  }
} catch { /* --code-cmt 不存在时静默跳过 */ }

for (const rows of [lightRows, darkRows]) for (const row of rows) if (!row.ok) failed = true;

const all = [...lightRows, ...darkRows];
const worstPair = all.reduce((w, r) => (r.worst < w.worst ? r : w));
if (failed) {
  const bad = all.filter((r) => !r.ok).length;
  console.error(`\n✗ ${bad} 项断言低于 AA ${AA}:1（${PAIRS.length} 对前景/背景 × 亮暗两套 = ${all.length} 项）`);
  process.exit(1);
}
console.log(
  `\n✓ 全部通过：${PAIRS.length} 对前景/背景 × 亮暗两套 = ${all.length} 项门禁断言 ≥ ${AA}:1` +
    `（最低：${worstPair.pair.name} ${worstPair.worst.toFixed(2)}:1）`,
);
