#!/usr/bin/env node
/**
 * 拾光集 · 令牌外十六进制扫描（docs/astro-blog-design-migration.md §4.3.1）
 *
 * 规则（AGENTS.md「设计与样式约束」的可执行版）：
 *   1. src/styles/global.css：十六进制色值只允许出现在 :root 系选择器块内
 *      （:root、@media 内的 :root…、:root[data-theme=…]）；其余位置一律报错。
 *   2. src 下所有 .astro（递归）：颜色只能是 var(--token) 或其 color-mix()，
 *      任何十六进制色值（#rgb / #rrggbb / #rrggbbaa）一律报错。
 *   3. #000 / #fff 一族（3/4/6/8 位全 0 / 全 f 的写法）全域禁止，
 *      :root 块内也不允许 —— DESIGN.md「No-Pure-Black-White Rule」。
 *
 * 边界说明：
 *   - CSS 注释与引号字符串里的内容不算色值位置，注释不扫（:root 注释里
 *     本来就有「绝不用 #fff」这类教学文字）；#000/#fff 判定只看真实色值位置。
 *   - 扫描口径取「# 后跟 3/6/8 位十六进制」的最大吞噬串；4 位 #rgba、
 *     5/7/9 位等非法长度不报（任务书只列了 #rgb/#rrggbb/#rrggbbaa）。
 *
 * 零依赖，Node >= 22。有违规即输出 文件:行号 并以退出码 1 结束。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 仓库根 = scripts/ 的上一级（不依赖运行时的 cwd，npm run / CI 里都一致）
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const COLOR_LENGTHS = new Set([3, 6, 8]); // #rgb / #rrggbb / #rrggbbaa
const PURE_LENGTHS = new Set([3, 4, 6, 8]); // #000 / #fff 及带 alpha 的等价写法
const HEX_CHAR = /[0-9a-fA-F]/;

const errors = [];
let filesScanned = 0;
let linesScanned = 0;

/** 判断选择器是否是 :root 系（:root、:root[data-theme=…]、:root:not(…)；多选择器须每段都是） */
function isRootSelector(buf) {
  const sel = buf.trim();
  if (!sel) return false;
  return sel.split(',').every((part) => /^:root([\s:[.#*].*)?$/i.test(part.trim()));
}

/**
 * 扫描 global.css：逐字符推进，维护块栈判定当前位置是否在 :root 系块内。
 * 十六进制的检出与块状态在同一个循环里完成，注释与字符串内容跳过。
 */
function scanGlobalCss(text, file) {
  let line = 1;
  let buf = ''; // 自上一个 { / } / ; 起累积的待定选择器
  const stack = []; // 每层块是否 :root 系
  let i = 0;
  while (i < text.length) {
    const ch = text[i];

    if (ch === '\n') { line++; buf += ch; i++; continue; }

    // CSS 注释：整体跳过（不计行内 hex；选择器缓冲里以空格占位）
    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      for (let k = i; k < stop; k++) if (text[k] === '\n') { line++; buf += '\n'; } else buf += ' ';
      i = stop;
      continue;
    }

    // 字符串：整体跳过大括号/分号干扰，但其中的 hex 仍算色值位置扫
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < text.length && text[j] !== ch) {
        if (text[j] === '\\') j++; // 转义
        if (text[j] === '\n') line++;
        j++;
      }
      const inner = text.slice(i + 1, Math.min(j, text.length));
      scanHexRuns(inner, file, line, stack.at(-1) === true);
      for (let k = i; k < Math.min(j + 1, text.length); k++) if (text[k] === '\n') line++;
      i = j + 1;
      continue;
    }

    if (ch === '{') { stack.push(isRootSelector(buf)); buf = ''; i++; continue; }
    if (ch === '}') { stack.pop(); buf = ''; i++; continue; }
    if (ch === ';') { buf = ''; i++; continue; }

    if (ch === '#') {
      let j = i + 1;
      while (j < text.length && HEX_CHAR.test(text[j])) j++;
      const digits = text.slice(i + 1, j);
      classifyHex(digits, file, line, stack.at(-1) === true);
      i = j;
      continue;
    }

    buf += ch;
    i++;
  }
}

/** 扫一段独立文本（.astro 整文件，或 global.css 字符串内部）：全部按「:root 外」口径 */
function scanHexRuns(text, file, startLine, hexAllowed) {
  let line = startLine;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\n') { line++; i++; continue; }
    if (ch === '#') {
      let j = i + 1;
      while (j < text.length && HEX_CHAR.test(text[j])) j++;
      classifyHex(text.slice(i + 1, j), file, line, hexAllowed);
      i = j;
      continue;
    }
    i++;
  }
}

function classifyHex(digits, file, line, hexAllowed) {
  if (!COLOR_LENGTHS.has(digits.length) && !PURE_LENGTHS.has(digits.length)) return;
  const lower = digits.toLowerCase();
  if (PURE_LENGTHS.has(digits.length) && /^0+$/.test(lower)) {
    errors.push(`${file}:${line}: #${digits} —— #000 一族全域禁止（DESIGN.md · No-Pure-Black-White Rule）`);
    return;
  }
  if (PURE_LENGTHS.has(digits.length) && /^f+$/.test(lower)) {
    errors.push(`${file}:${line}: #${digits} —— #fff 一族全域禁止（DESIGN.md · No-Pure-Black-White Rule）`);
    return;
  }
  if (COLOR_LENGTHS.has(digits.length) && !hexAllowed) {
    errors.push(`${file}:${line}: 令牌外十六进制色值 #${digits} —— 颜色只能写成 var(--token) 或其 color-mix()`);
  }
}

/** .astro 文件：剥掉 HTML/CSS 注释（保留换行以维持行号），其余任何 hex 一律报错 */
function scanAstro(text, file) {
  const stripped = text
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  scanHexRuns(stripped, file, 1, false);
}

function walkAstro(dir, out) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkAstro(p, out);
    else if (name.endsWith('.astro')) out.push(p);
  }
  return out;
}

// ── 主流程 ────────────────────────────────────────────────────────────────
const globalCssPath = join(repoRoot, 'src/styles/global.css');
try {
  const text = readFileSync(globalCssPath, 'utf8');
  scanGlobalCss(text, relative(repoRoot, globalCssPath));
  filesScanned++;
  linesScanned += text.split('\n').length;
} catch (err) {
  errors.push(`${relative(repoRoot, globalCssPath)}: 读取失败（${err.message}）`);
}

const astroFiles = walkAstro(join(repoRoot, 'src'), []);
for (const f of astroFiles) {
  const text = readFileSync(f, 'utf8');
  scanAstro(text, relative(repoRoot, f));
  filesScanned++;
  linesScanned += text.split('\n').length;
}

if (errors.length > 0) {
  console.error(`✗ 令牌纪律检查未通过（${errors.length} 处违规）：\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    `\n规则：颜色只有一个来源（global.css :root 令牌）；global.css 的 :root 系块之外` +
      `与所有 .astro 组件里禁止十六进制色值；#000/#fff 全域禁止。`,
  );
  process.exit(1);
}

console.log(
  `✓ 令牌纪律检查通过：global.css + ${astroFiles.length} 个 .astro（共 ${linesScanned} 行）` +
    `，:root 块之外无十六进制，#000/#fff 未出现。`,
);
