import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';
import { z } from 'astro/zod';
import { clockTimeAsSiteTime } from './lib/format';

/**
 * Every post lives in `src/content/posts/` as a Markdown file.
 *
 * Only `date` is required. A post can also have, in any combination:
 * - `title`        — makes it a titled post; without one it is a short note
 * - `cover`        — an image beside the text on the timeline, or full width
 *                    when the post has no title (a photo post)
 * - `tags`         — topics, shown under the post and on /topics/
 * - `description`  — a summary used on the timeline instead of an excerpt
 * - `link`         — a web page the post is about, shown as a link card
 *                    (`linkTitle` names it; otherwise the site's address shows)
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        // The clock time the author saw, read as time in SITE.timeZone (see clockTimeAsSiteTime).
        date: z.coerce.date().transform(clockTimeAsSiteTime),
        /** Set when a post is meaningfully edited; shown and sent to search engines. */
        updated: z.coerce.date().transform(clockTimeAsSiteTime).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        link: z.url().optional(),
        linkTitle: z.string().optional(),
        tags: z.array(z.string()).default([]),
        /** Keep this post in the sidebar's “pinned” slot. */
        pinned: z.boolean().default(false),
        /** Drafts appear only in `npm run dev`. */
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message: 'A cover image needs `coverAlt` text for screen readers.',
        path: ['coverAlt'],
      }),
});

/**
 * The books page. All books live in one list, `src/content/books.yaml`:
 * a title, an author, the year it was finished and, if you like, a cover.
 */
const books = defineCollection({
  // The list has no ids, so each book gets its position in the file.
  loader: file('src/content/books.yaml', {
    parser: (text) => (parse(text) as object[]).map((book, i) => ({ id: String(i), ...book })),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      // year i read the book, not the year it was published. I don't care about that.
      year: z.number().int(),
      cover: image().optional(),
    }),
});

export const collections = { posts, books };
