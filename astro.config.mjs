// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { codeTheme } from './src/styles/code-theme.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://leofinch0824.github.io',
	base: '/',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 默认 Markdown 处理器是 Sätteri；remark/rehype 插件生态
		// （remark-math、rehype-katex）走 unified 处理器（@astrojs/markdown-remark，
		// 旧键 remarkPlugins/rehypePlugins 需要它，官方提示用 processor: unified({...})）。
		// 数学公式：remark-math 解析 $…$ / $$…$$，rehype-katex 构建时渲染；
		// 对 .md 与 .mdx 同时生效（@astrojs/mdx 默认 extendMarkdownConfig）。
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
		// 代码高亮：内置 Shiki + 拾光集 CSS 变量主题（src/styles/code-theme.mjs）。
		// 主题把 --code-kw/--code-str/--code-num/--code-cmt 原样写进 TextMate 槽位，
		// 产物是 style="color:var(--code-kw)" —— 亮暗切换完全由 global.css 里
		// 成对维护的令牌接管，Shiki 侧零主题切换 CSS，双主题天然成立。
		shikiConfig: {
			theme: codeTheme,
		},
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
