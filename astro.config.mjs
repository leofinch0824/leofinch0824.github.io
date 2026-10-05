// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import astroExpressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
	site: 'https://leofinch0824.github.io',
	base: '/',
	// astroExpressiveCode 必须排在 mdx() 之前（顺序反了 EC 会直接抛错）。
	integrations: [
		astroExpressiveCode({
			// 代码高亮：Expressive Code（Shiki 引擎），双主题用成熟现成主题
			// （2026-10-05 所有者拍板，推翻此前「不采用 EC」的记录）。
			// token 色由主题自带（构建期 hex），是「颜色单一来源 = global.css 令牌」
			// 的唯一明文例外，已写入 AGENTS.md / DESIGN.md / PRODUCT.md。
			// 主题切换接线：改名 dark/light 后，EC 默认 themeCssSelector 生成
			// [data-theme='dark'] / [data-theme='light']，配合默认的
			// prefers-color-scheme 媒体查询（守卫 :root:not([data-theme='light'])），
			// 与 global.css 双暗块的语义完全对齐——四种状态
			// （未选/亮/暗 × 系统亮/暗）都不会错配。
			themes: ['one-light', 'one-dark-pro'],
			customizeTheme: (theme) => {
				theme.name = theme.type === 'dark' ? 'dark' : 'light';
			},
			// 盒型/字体仍走站点规格（DESIGN.md「代码块」）：1px 发丝线、
			// 外圆角 1px（EC 渲染为 calc(radius + borderWidth)，故 radius 填 0）、
			// 等宽 13.5px/1.78、内边距 16px 18px；帧阴影关闭（相纸平放不发光）。
			// 背景/前景/选区/滚动条不覆写，交给主题——包括亮暗各自的颜色。
			// gutterBorderWidth 归零：本站永不渲染行号沟槽，而 EC 的行内
			// 内边距公式会恒扣沟槽边宽（默认 1.5px），归零后才是规格的 18px。
			styleOverrides: {
				borderRadius: '0',
				borderWidth: '1px',
				borderColor: 'var(--border)',
				codeFontFamily: 'var(--font-mono)',
				codeFontSize: '13.5px',
				codeLineHeight: '1.78',
				codePaddingBlock: '16px',
				codePaddingInline: '18px',
				gutterBorderWidth: '0px',
				uiFontFamily: 'var(--font-mono)',
				uiFontSize: '13px',
				frames: {
					frameBoxShadowCssValue: 'none',
				},
			},
		}),
		mdx(),
		sitemap(),
	],
	markdown: {
		// Astro 7 默认 Markdown 处理器是 Sätteri；remark/rehype 插件生态
		// （remark-math、rehype-katex）走 unified 处理器（@astrojs/markdown-remark，
		// 旧键 remarkPlugins/rehypePlugins 需要它，官方提示用 processor: unified({...})）。
		// 数学公式：remark-math 解析 $…$ / $$…$$，rehype-katex 构建时渲染；
		// 对 .md 与 .mdx 同时生效（@astrojs/mdx 默认 extendMarkdownConfig）。
		// 代码高亮由上方 astroExpressiveCode 接管：它把 rehype 插件追加到
		// 本处理器的 rehypeKatex 之后，并自行设置 syntaxHighlight:false，
		// 数学管线不受影响。
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
