import type { CollectionEntry } from 'astro:content';

// 批3 内容工具（docs/astro-blog-design-migration.md §5「内容模型要扩」）。
// 编号与阅读时长都是构建时算出的展示数据，绝不写回 frontmatter ——
// 编号本质是按 pubDate 排出的「底片序号」，手工维护迟早对不上。

export type BlogPost = CollectionEntry<'blog'>;

/** 首页记忆墙的橱窗上限（docs/pagination-design.md）：只渲染最近这些张，
 *  超出部分不进 DOM；全量翻阅走归档按年路由。单一来源，首页与断言共用。 */
export const WALL_LIMIT = 12;

/** 墙上一张相纸：内容条目 + 构建时算出的展示数据。 */
export interface WallCard {
	post: BlogPost;
	/** 底片编号，三位零填充；最早一篇 = № 001，最新一篇 = № NNN
	 *  （对照原型 reference/prototype/home.tpl.html:215 与 :68） */
	no: string;
	/** 阅读时长（分钟，向上取整）：中文字数/300 + 西文词数/200 */
	minutes: number;
	/** pubDate 所在年份；卡片 data-year 与年份轨迹分组共用 */
	year: number;
	/** ±1.8° 内的手工旋转值（内联 --rot）—— 错落是数据，不是随机（DESIGN.md Do's） */
	rot: string;
	/** 入场落纸动画的错落序号（内联 --i，每张延迟 45ms） */
	i: number;
}

/** 年份轨迹上的一格。 */
export interface YearGroup {
	year: number;
	/** 该年张数 */
	count: number;
	/** 该年出现过的分类，按 pubDate 新→旧的首次出现顺序 */
	categories: string[];
}

/** 记忆墙整体数据：相纸序列、年份分组、默认展开年份。 */
export interface Wall {
	/** 全部相纸，pubDate 新→旧 */
	cards: WallCard[];
	/** 年份分组，新→旧 */
	years: YearGroup[];
	/** 默认摊开：最近两年（原型 home.tpl.html:58「墙上默认摊开最近的两年」） */
	openYears: number[];
}

/* 原型 14 张相纸的旋转序列（home.tpl.html:62-217），全部落在 ±1.8° 内；
   卡片更多时从头循环取值 —— 保留「手工摆放」的数据感，不引入随机。 */
const ROTATIONS = [
	'-1.1deg', '1.5deg', '-0.7deg', '1.8deg',
	'-1.0deg', '0.8deg', '-1.7deg', '1.3deg',
	'-0.6deg', '1.6deg', '-1.4deg', '0.7deg',
	'-1.2deg', '0.9deg',
] as const;

/* CJK：平假名/片假名、汉字扩展A与基本区、兼容表意文字、谚文。
   只数字（不含 \u3000-\u303F 标点区），标点不计入阅读量。 */
const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/g;

/** 阅读时长估算（分钟）：CJK 按字数 300 字/分钟，其余按西文词 200 词/分钟，
 *  向上取整，至少 1 分钟。输入是 Markdown/MDX 源文（post.body）；
 *  标记语法带来的几个「假词」对「约 N 分钟」的量级没有影响。 */
export function readingMinutes(body: string): number {
	const cjkCount = body.match(CJK)?.length ?? 0;
	const wordCount = body
		.replace(CJK, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.ceil(cjkCount / 300 + wordCount / 200));
}

/** 按 pubDate 新→旧排序（不改动入参顺序）。 */
export function sortByPubDateDesc(posts: readonly BlogPost[]): BlogPost[] {
	return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 把集合条目整理成记忆墙数据：排序、编号、阅读时长、按年分组、默认展开年。 */
export function prepareWall(posts: readonly BlogPost[]): Wall {
	const sorted = sortByPubDateDesc(posts);
	const total = sorted.length;
	const cards: WallCard[] = sorted.map((post, i) => ({
		post,
		// 最新 = № total，最早 = № 001（原型里 2023·09·15 那张是 № 001）
		no: String(total - i).padStart(3, '0'),
		minutes: readingMinutes(post.body ?? ''),
		year: post.data.pubDate.getFullYear(),
		rot: ROTATIONS[i % ROTATIONS.length],
		i,
	}));

	// 按年分组：cards 已按新→旧排好，首遇即该年在轨迹上的位置
	const years: YearGroup[] = [];
	const byYear = new Map<number, YearGroup>();
	const catsByYear = new Map<number, Set<string>>();
	for (const card of cards) {
		let group = byYear.get(card.year);
		if (!group) {
			group = { year: card.year, count: 0, categories: [] };
			byYear.set(card.year, group);
			years.push(group);
			catsByYear.set(card.year, new Set());
		}
		group.count++;
		const seen = catsByYear.get(card.year)!;
		if (!seen.has(card.post.data.category)) {
			seen.add(card.post.data.category);
			group.categories.push(card.post.data.category);
		}
	}

	return {
		cards,
		years,
		openYears: years.slice(0, 2).map((g) => g.year),
	};
}
