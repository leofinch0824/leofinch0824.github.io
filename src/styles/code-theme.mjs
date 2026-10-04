/**
 * 拾光集 · Shiki 自定义主题（CSS 变量版）
 * ─────────────────────────────────────────────────────────────
 * Shiki 默认把十六进制色值烤进内联 style="color:#…"，那会让代码颜色
 * 脱离令牌纪律。这里把 global.css 的作用域令牌原样喂给 TextMate 槽位，
 * 产物是 style="color:var(--code-kw)" —— 颜色解析发生在浏览器里，
 * 亮暗两段令牌（prefers-color-scheme 与 [data-theme=dark] 成对维护的
 * 那两份）各自生效，一份主题即覆盖双主题，无需 --shiki-dark 切换 CSS。
 *
 * 槽位 ↔ 令牌对照（规格来源：DESIGN.md「代码块（.code）」）：
 *   keyword  → --code-kw   #7c4a39（暗 #d08a72）
 *   string   → --code-str  #59684f（暗 #9db08a）
 *   number   → --code-num  #8a6335（暗 #d0a86a）
 *   comment  → --code-cmt  褪色的墨 92%（斜体，同 .tok-cmt 规格）
 *   function → .tok-fn 规格色（墨 72% 混相册纸，global.css）
 *   其余     → editor.foreground = --fg（墨）
 *   背景     → editor.background = --code-bg（墨 5% 混相纸白）
 *
 * 全部 token 高亮只对齐 global.css 既有的 --code-* 令牌；令牌本身
 * 在本文件不重复定义 —— 单一颜色来源仍是 global.css 的 :root。
 */

const comment = 'var(--code-cmt)';
const string = 'var(--code-str)';
const number = 'var(--code-num)';
const keyword = 'var(--code-kw)';
const fn = 'color-mix(in oklch, var(--fg) 72%, var(--bg))'; // .tok-fn 的规格色

export const codeTheme = {
	name: 'shiguangji',
	// JSDoc 窄化：astro check 下 shiki 的 type 只收 "light" | "dark"，裸字符串会放宽成 string
	type: /** @type {"light"} */ ('light'),
	colors: {
		'editor.background': 'var(--code-bg)',
		'editor.foreground': 'var(--fg)',
	},
	// TextMate 原生格式用 settings（shiki 4.5 的 ThemeRegistrationRaw 要求此键；
	// 运行时 tokenColors 也会被归一成 settings，两者等价，直接写 settings 少一步转换）
	settings: [
		// 注释：.tok-cmt 规格含斜体
		{ scope: ['comment'], settings: { foreground: comment, fontStyle: 'italic' } },
		// 字符串（含模板串、转义）
		{ scope: ['string'], settings: { foreground: string } },
		// 数字字面量（规格里只有 number；true/false 等语言常量保持墨色）
		{ scope: ['constant.numeric'], settings: { foreground: number } },
		// 关键字与类型声明（function/const/let/for/if/return/class…）
		{ scope: ['keyword', 'storage'], settings: { foreground: keyword } },
		// 函数名（.tok-fn 规格）
		{
			scope: ['entity.name.function', 'support.function', 'variable.function', 'meta.function-call'],
			settings: { foreground: fn },
		},
	],
};

export default codeTheme;
