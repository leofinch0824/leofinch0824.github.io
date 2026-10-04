import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				// Transform string to Date object
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: z.optional(image()),
				// 批3（2026-10 迁移）：分类用于卡片元信息与归档分组，必填；tags 可选。
				category: z.enum(['技术', '生活', '影像', '算法']),
				tags: z.array(z.string()).optional(),
				// 注意：编号（№ NNN）与阅读时长不进 frontmatter ——
				// 构建时由 src/utils/posts.ts 按 pubDate 排序算出。
			}),
});

export const collections = { blog };
