// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { SITE } from './src/site.config.ts';
import { captions } from './src/lib/hast-captions.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // The address lives in src/site.config.ts so it only changes in one place.
  site: SITE.url,
  // One URL per page: always with a trailing slash (/about/), the form
  // Cloudflare Pages serves. This keeps canonical links consistent.
  trailingSlash: 'always',
  // Load pages as soon as their links are on screen, so a page change can turn
  // in straight after the old page swings away (touch screens never hover).
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    // Sätteri is Astro's Markdown processor; the plugin makes an image with a title a captioned figure.
    processor: satteri({ hastPlugins: [captions] }),
  },
  vite: {
    build: {
      // Write the CSS so browsers from early 2022 still understand it: the
      // build turns newer shorthand (like `width >= 48rem`) into the older form.
      cssTarget: ['chrome100', 'firefox100', 'safari15.4'],
    },
  },
  integrations: [
    sitemap({
      // Search results are not content; keep them out of the sitemap.
      filter: (page) => !page.includes('/search/'),
    }),
  ],
});
