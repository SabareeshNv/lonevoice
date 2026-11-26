# CLAUDE.md — Lone Voice

Project memory for Claude. Read this before changing anything. Keep it current: when a decision changes, update this file in the same commit.

## What this is

**Lone Voice** is an anonymous personal microblog. It's a static site built with **Astro 7** and **plain modern CSS**, styled after the **Zune HD and Windows Phone 7/8** (Metro).

- **Repository:** `SabareeshNv/personal-blog`. Pushing to `main` deploys.
- **Hosting:** Cloudflare Pages.
  - Build command `npm run build`, output folder `dist`, `NODE_VERSION=22`.
  - Every push to `main` rebuilds the live site in about a minute.
- **Live address:** `https://lonevoice.pages.dev` (the owner switched to it from `personal-blog-afn.pages.dev`). The address is set in exactly **one** place: `url` in `src/site.config.ts`. Change it there and nowhere else.
- **History:** the project started in `SabareeshNv/Claude-microblog`. Its early commits contain an abandoned Malayalam version of the site. Ignore that repository: this repository is the only source of truth.

## How the owner works (follow these)

- **The owner also edits the code on a laptop** and pushes to `main`. Always pull (`git pull --ff-only origin main`) before starting work.

- **Design before code.** For new pages or visual changes, the owner approves a design first. That has been a Claude Design canvas: "Lone Voice — Zune design", https://claude.ai/artifact/VV3aN4Qhv2tNr5p5zyjMRY, and, for the November 2026 refinements, "Lone Voice — design refinements" (before/after boards), https://claude.ai/artifact/JLj9N5TGvim7bqM6cJYoxT. Ask before building anything big that hasn't been designed.
- **Short, plain explanations.** The owner isn't a developer. Explain changes in everyday words.
- **Push to `main` when a change is done and verified.** The owner asked for this workflow, since `main` is what Cloudflare deploys. Don't open pull requests unless asked.
- **Verify visually.** For any motion or layout change, build the site and check it in a browser: screenshots at 390×844 (phone) and 1440×900 (desktop), plus slow-motion frames for animations (see Testing). Report what was and wasn't verified. The owner's phone is an **iPhone 17 on iOS 27** (Safari engine, 120 Hz screen); only Chromium is available in this environment.

## Hard rules and constraints

- **Anonymous.** No personal name, photo or author byline anywhere. The publisher is the site name (`SITE.publisher`) in structured data too. The owner said: "I won't be using my personal name in this website/blog."
- **No Tailwind, no CSS framework.** The owner explicitly switched from Tailwind 4 to hand-written modern CSS: grid, flexbox, custom properties and logical properties.
- **Co-located Astro components.** Each component keeps its markup, scoped `<style>` and `<script>` in one `.astro` file. Global CSS is only `tokens.css`, `global.css` (a reset plus `.container` and `.visually-hidden`) and `transitions.css`.
- **Mobile first, three sizes.** Base styles (no media query) are the **mobile** layout, under 48rem (768 px). Two breakpoints switch to the larger sizes:
  - `@media (min-width: 48rem)`: **tablet**, 768–1023 px. Two columns: the posts plus a **narrow 240 px sidebar** (32 px gap), stacked date block in a 64 px column (40 px day), 26 px post titles, 36 px article titles, 16:10 covers with the title inside, smaller sidebar type. (The owner chose this, "Option B", from the canvas; a full-width version with the sidebar below was rejected because the sidebar items didn't line up.)
  - `@media (min-width: 64rem)`: **desktop**, 1024 px and up. Two columns with the full 320 px sidebar (64 px gap), the same 64 px date column, 32 px titles, 2:1 covers with the title inside.

  Tablet and desktop values are tokens that change at 48rem and again at 64rem (`--width-side`, `--gap-columns`, `--size-date-column`, `--text-date-day`, `--space-post-gutter`, `--ratio-card`, `--text-post-title`, `--text-article-title`, `--text-side-heading`, `--text-side-tile`, `--size-side-tile`), so components mostly don't need their own media queries.

  The owner expects mobile, tablet and desktop to be distinct. Don't add another size without asking; a large-desktop or small-phone size has been offered but not chosen.
- **Tokens only.** Colours, font sizes, spacing and widths come from `src/styles/tokens.css`. Never hard-code a value a token exists for. Some tokens change value at 48rem, so components often need no media query.
- **English interface**, Open Sans 300/400/600 (via `@fontsource/open-sans`), self-hosted. **The owner decided Open Sans is the right font for this project** (November 2026, after a Segoe-style alternative was suggested): don't propose another. Only the `latin`, `latin-ext`, `math` and `symbols` alphabets are imported in `BaseHead.astro` (the last two hold the ← → arrows, so they must stay). Importing the whole package added about 25 KB of Cyrillic, Greek, Hebrew and Vietnamese rules to every page's CSS for nothing. Text in those alphabets falls back to the system font; to support one, import its `<name>-<weight>.css` files.
- **Contrast (checked November 2026):** every text colour token passes WCAG AA (4.5:1) on black and on the tile greys (muted grey 6.25:1 on black, 5.18:1 on tiles). The one failure was small white text on the orange end of the pinned card's gradient (about 3.9:1), fixed with a 20% dark tint under the gradient in `PinnedCard`. Text over gradients and art can't be checked by tools like axe; measure by hiding the text, sampling the pixels behind it and comparing with the text colour (worst case: the brightest 2% of pixels). Re-check if a colour token, a gradient or the header art changes. Text over a photo (the title on a card cover) relies on the `.scrim`.
- **Colour roles:** magenta (`--color-accent`, `--color-accent-deep`, `--color-tile-warm`) for fills and tiles, pink (`--color-accent-text`) for text links and tags, orange (`--color-orange`) for dates (the weekday is always orange). There is no third pink.
- **Weights:** the giant and display type (wordmark, page and year headings, menu, day numbers, quotes) is Open Sans 300. Small text (under about 20 px: the lede, "share", "subscribe with RSS") is 400, because hairline strokes shimmer on black.
- **Casing:** interface text is lowercase (menu, sidebar headings, "follow along", footer links, page titles via `PageIntro`). The owner's own post titles and headings keep the case they are written in. "RSS" stays capitals.
- **Dark only** (`color-scheme: dark`). Every colour token also has a light value via `light-dark()`. Changing it to `dark light` would follow the reader's system setting, but the owner hasn't asked for that.
- **Browser reach.** `cssTarget` in `astro.config.mjs` (Chrome 100, Firefox 100, Safari 15.4, about early 2022) makes the build rewrite newer CSS for older browsers: `light-dark()` colours become `var()` fallbacks and range queries (`width >= 48rem`) become `min-width`. Write media queries as `min-width` anyway. Before this, the site needed Chrome 123 / Safari 17.5 / Firefox 120 (2024) for colours and Chrome 104 / Safari 16.4 (2023) for the tablet and desktop layouts. Page transitions still need a 2023+ browser (Safari 18 for shared elements) and simply don't animate elsewhere. Never test by eye only: compare `dist` screenshots before and after a CSS change.
- **Almost no JavaScript.** The only scripts are the search page (Pagefind), `CoverFlight`, the menu's scroll-into-view (`PivotNav`), Astro's `<ClientRouter />`, and the share buttons (`ShareLinks`). Forms work without JavaScript.
- **Accessibility:** every link and button must have a tappable area of at least 44 px (`--size-touch`) in both directions. For a small one (tags, "continue reading", footer links) add `class="tap"` (in `global.css`): it grows the hit area with an invisible `::after` and changes nothing visible. Check with a script that probes `document.elementFromPoint` around each link, not by arithmetic. Links inside running text are exempt. Real links and buttons, visible focus outlines, a skip link, `aria-label` on icon-only controls, `alt` text required for covers (the schema enforces it), and `prefers-reduced-motion` turns all motion off.

## Design decisions (all approved by the owner)

- **Look:** black background, large thin lowercase type, the Windows Phone pivot menu (current item white, others grey), round outlined app-bar buttons, square tiles. Zune magenta accent `#d6006f`, a pink→orange gradient (`--gradient-zune`) and pink/orange weekday colours.
- **Header** (`SiteHeader`, never animated between pages):
  - On the homepage, a giant "lone voice" (144 px on tablet and desktop, trimmed from 176) runs off the right edge, with the tagline underneath (`SITE.tagline`, currently "ideas half formed, feelings half named."). On phones the tagline is capped at 14 rem with `text-wrap: balance`, so it breaks after the comma and stays clear of the shapes.
  - Inner pages have a compact name (56 px on tablet and desktop).
  - Pink→orange angled shapes (`ZuneArt`) sit behind the name and fade to black on the left. On tablet and desktop they are large and sweep out from behind the end of the name (the owner found the old small corner shapes disconnected); on phones they stay beside the name, clear of the menu.
  - No domain name is shown in the header (the owner asked to remove it).
- **Menu:** home · topics · posts · books. "posts" is the page at `/posts/` that lists every post by month (page 2 onward: `/posts/page/2/`…). A single post is `/posts/<name>/` and highlights "posts" too; home's later pages (`/page/2/`…) highlight "home" (`PivotNav`). There is **no "photos"** item (the owner removed it) and **no "about"** item: About lives in the footer (the owner asked for that). `FOOTER_LINKS` in `src/site.config.ts` lists the footer links: About, Content Policy, Privacy Policy. On phones the menu is 28 px with 24 px gaps and **deliberately scrolls sideways**: the four items end at 370 px, so "books" peeks in at the right edge and fades, like a Windows Phone pivot. The owner likes this ("that type of scrolling was present in the Windows 10 phone UI"), so don't shrink the menu to make it fit. There is a spacer after the last item, as wide as the fade, so it can scroll clear of it. A small script in `PivotNav` scrolls the menu just far enough that the current item is never inside the fade (the books page needed it); it does nothing where the menu fits.
- **Search button** (round, in the header): shown on phones; on tablet and desktop only on pages without a sidebar (the sidebar has a search box).
- **Layout:**
  - Desktop has two columns: the main column (760 px) and the sidebar (320 px), 64 px apart, 1200 px maximum width.
  - Tablet has two columns too: the main column takes the rest, the sidebar is 240 px, 32 px apart.
  - **The sidebar is not sticky** (the owner asked, November 2026: "let the webpage flow naturally"). It scrolls away with the page. Don't add `position: sticky`; the earlier version stuck by its top or bottom and used a script to measure the sidebar's height.
  - A page can nudge the sidebar so its first line lines up with the page's first line: `BaseLayout`'s `sidebarOffset` (used by the posts list, whose big year heading sits 15 px higher than the other pages' first lines).
  - Phones have one column, with the sidebar below the content.
  - The gap below the header is 88 px on desktop and 48 px on phones (`--space-header`); the owner asked for more breathing room.
- **Sidebar contents and order:**
  1. Intro (homepage only; text in `SITE.intro`): a quiet 20 px light line under a short magenta rule. It used to be a loud magenta tile that competed with the latest post.
  2. Search box (Pagefind)
  3. Pinned post on a pink→orange card
  4. "subscribe with RSS", with a small "share" label and a row of round share buttons under it (Facebook, X, Telegram, WhatsApp; `ShareLinks.astro`). The same share block also sits under "Follow along" on the About page. They are **buttons, not links**, on purpose: ad blockers (Brave Shields, uBlock Origin; EasyList has rules like `a[href^="https://x.com/intent/tweet?"]`) hide any `<a>` with a share address, and the owner saw the whole row vanish in Brave. A small script in `ShareLinks.astro` builds the address when a button is tapped and opens it in a new tab. Never put a share address in an `href`. Brand icons and the RSS symbol are all filled Simple Icons marks (CC0) in `Icon.astro`, so the sidebar's icons share one style.

  The owner rejected repeating the menu items in the sidebar, and rejected "recent covers".
- **Timeline** (`PostCard`): one column, newest first.
  - **Date block:** not a link (the owner asked for that); the way into a post is the title, "continue reading" or, for posts with no title, "view post →". On tablet and desktop it's a vertical stack (small "NOV", a 40 px thin grey "21" so the title leads, the weekday in orange, then the year) with a thin divider before the post. On phones it's **one small line** ("21 NOV 2026 · SAT", 12 px semibold). The owner found the big date on phones squeezed the text and distracted from the title.
  - **Covers:** a titled post with a cover is an image card: the cover runs the full width of the card (16:10 on phones and tablets, 2:1 on desktop, `--ratio-card`) and the **title sits inside the bottom of the picture**, in white, like a Windows Phone tile. The summary, tags and link follow below. The title has no left padding, so its left edge lines up exactly with the picture's edge and with the summary and tags (the owner asked for that alignment), and 1 rem of padding below it (the owner briefly asked for 0.5 rem, then kept 1 rem). It does not underline on hover (the owner asked for that); the rest of the card's links still do. The dark fade (`.scrim`) lives **inside the cover link**, not on the title, so it is part of the cover picture that travels between card and post page. Its height comes from an invisible copy of the title (`.scrim-text`, `visibility: hidden`, same type settings), so a short title barely darkens the picture and a long one gets a taller fade; keep the copy's type settings identical to the real title's. The real title sits above it (`z-index: 1`). Title and cover share one grid cell and stay separate elements. History: the cover used to sit beside the title, which squeezed long titles into four narrow lines (owner report); a title-above-cover-beside-summary layout was tried and rejected. Photo posts (a cover with no title) show the picture full width with a caption below.
  - **Titles and text:** titles are bold: 24 px on phones (raised from 21 px at the owner's request, because titles were barely bigger than the 16 px summaries), 26 px on tablet and 32 px on desktop (`--text-post-title`). Summaries are a softer grey (`--color-body`). Notes are 19 px regular.
  - **Footer row:** tags (pink, no boxes) sit on the left and "continue reading →" (**white**, not pink) on the right edge, in one row. Every post has this row, and the link is always on the right edge with the plain arrow (the owner rejected a left-aligned variant and a round arrow button as inconsistent / not needed): notes and photo posts, which have no title and are shown in full, get "view post →" in the same place so each one can be opened. The owner found the stacked, same-coloured version cluttered.
  - Hairlines separate posts.
- **Other pages:** post (44 px title, a cover in the card's shape, prose, then "older" and "newer" as two dark tiles with the neighbouring post's title), topics (tiles ordered by post count, then name; the first gets the gradient, the second magenta, the third deep magenta, the fourth burnt orange, the rest grey; only the first is double width; 2 columns on phones, 3 on tablet, 4 on desktop; `grid-auto-flow: dense` lets small tiles fill gaps beside wide ones; has the sidebar, like the homepage and archive, at the owner's request), **books** (see below), single topic, posts page at `/posts/` (year → month → rows; paginated at `SITE.archivePageSize`, 20, so `/posts/`, `/posts/page/2/`…; one page until there are more posts than that; it used to be `/archive/`, which `public/_redirects` sends to `/posts/` with a 301 on Cloudflare), about, search, content and privacy policies (one shared layout), 404.
- **Footer:** an oversized faint "lone voice", the copyright line, and About / Content Policy / Privacy Policy links.

## Content model (`src/content.config.ts`)

Each post is a Markdown file in `src/content/posts/`. The file name becomes the URL (`/posts/<name>/`).

- **Required:** `date`.
- **Optional:** `title`, `description` (the timeline summary; otherwise an excerpt is used), `cover` + `coverAlt` (alt is required when there's a cover), `tags`, `link` + `linkTitle` (shows a link card), `pinned`, `updated` (shown on the post and sent to search engines), `draft`.
- **What a post has decides its kind:**
  - title (± cover) → titled post
  - cover without a title → photo post (full-width picture)
  - neither → note (shown in full on the timeline)
  - `link` works with any kind (the card goes under the text)
- **Text in posts** (`Prose.astro`): headings, lists, quotes, code, tables (scroll sideways on phones), footnotes (`[^1]`, small and quiet at the end) and long web addresses (wrap) are styled. **Captions:** a Markdown image with a title, `![alt](../../assets/covers/x.jpg "Caption text")`, becomes a figure with a caption. This is done by a small plugin, `src/lib/hast-captions.mjs`, for Sätteri (Astro 7's Markdown processor, set in `astro.config.mjs` with `@astrojs/markdown-satteri`, now a direct dependency). The older `markdown.rehypePlugins` setting does not work in Astro 7 without `@astrojs/markdown-remark`. Paragraphs use `text-wrap: pretty`, headings `balance`.
- **Post file names are free** (any name, a number or `page` included; the owner asked for this): the name becomes `/posts/<name>/`. Pagination can't clash because list pages live in a `page/` folder: the homepage is `/`, then `/page/2/`, `/page/3/`…; the posts list is `/posts/`, then `/posts/page/2/`…. This is done by the site's own `paginate()` in `src/lib/pagination.ts` (Astro's built-in one would use `/2/` and `/posts/2/`, which a post named `2` would clash with). Page 1 is its own address (`index.astro` and `posts/index.astro`); pages 2 and up are `page/[page].astro` and `posts/page/[page].astro`, and both pairs share one component (`HomeListing`, `PostsListing`). `public/_redirects` sends `/page/1/` and `/posts/page/1/` to page 1 and old `/archive/N/` to `/posts/page/N/`. `PivotNav` treats a first segment of `page` as the homepage; `CoverFlight` reads `/posts/<name>/` (one segment after `posts`).
- **The first card's picture loads at once** (`loading="eager"`, `fetchpriority="high"`) **only on the homepage, and only if the newest post has a cover** (`Timeline`'s `eagerFirst`, `PostCard`'s `eager`). A note or a text-only post first means nothing is eager. Never mark an image eager just because it is the first image on the page: if the first post has no picture, the first image is further down and not seen on arrival. Other timelines (topics) stay lazy.
- **Cover images** live in `src/assets/covers/`. Astro makes each in several widths (480–1600 px, `COVER_WIDTHS` and `COVER_SIZES` in `src/lib/images.ts`) and the browser picks the one its screen needs: a phone at 3× needs about 1100 px, a retina laptop about 1300 px. Astro never enlarges an original, so **use a picture at least 1600 px wide**; a smaller one is shown at its own size and looks soft on big or high-density screens. (Card covers were once generated at 480 px only, a leftover from when they were thumbnails, and looked pixelated; the owner reported it. Check sharpness by comparing `img.currentSrc`'s file width with the shown width × `devicePixelRatio`, not `naturalWidth`, which is in screen pixels when a `srcset` is used.)
- **The sample posts were deleted** (November 2026, at the owner's request; they are in git history, last present at commit `e9f0bcb`). The site builds and shows quiet "nothing here yet" lines (`EmptyState`) on the homepage, posts list and topics page while there are no posts. `src/content/posts/` keeps a `.gitkeep` so the folder exists (git drops empty folders, and the CMS needs it). Quirk: with zero posts Pagefind finds no `data-pagefind-body` and indexes every page, so search would list About and the policies until the first post exists. The 3 generated sample covers are still in `src/assets/covers/`, unused. The About, Content Policy and Privacy Policy texts were drafted by Claude from how the site really works (no cookies or storage, no analytics, only same-site requests, share buttons act only when tapped, hosted on Cloudflare Pages, no comments or ads); the owner should review them. They are statements of fact and promises, so update them (and the `updated` date at the top of each policy) whenever the site changes, for example if analytics, comments or ads are ever added. Only one post should be `pinned` (the sidebar card shows one).

## Writing from a phone (Pages CMS)

`.pages.yml` at the repository root configures **Pages CMS** (https://pagescms.org, free, open source), a web app that edits the repository through the owner's GitHub sign-in. Saving there commits to the repository, so **saving on `main` publishes** (Cloudflare rebuilds). Set up by the owner once: open https://app.pagescms.org, sign in with GitHub, install the GitHub App on the `lonevoice` repository, open it. The config only works on a branch that contains it, so it must be on `main` for the owner to use it.

- **Collections:** `posts` (every front-matter field in `src/content.config.ts`, plus the text as `body`) and `books` (the list in `src/content/books.yaml`). **Keep `.pages.yml` in step with the content schema**: a new field in `content.config.ts` needs a field in `.pages.yml`, or the editor can't set it.
- **Pictures:** two named media folders, `covers` (`src/assets/covers`, written into posts as `../../assets/covers/name.jpg`) and `books` (`src/assets/books`, written as `../assets/books/name.jpg`). The `output` paths are what Astro's `image()` expects, relative to the file.
- **`updated` starts empty** (`default: ""` in `.pages.yml`). Pages CMS starts every date field at today, which made fresh posts show an "updated" line (owner report). As a safety net the site only treats `updated` as an edit when it is a later day than the post's `date` (`editedDate()` in `src/lib/posts.ts`, used for the "updated" line and the structured data), so a same-day `updated` is ignored.
- **`date` is a date and time** (`yyyy-MM-dd'T'HH:mm:ssxxx`). Date-only values made same-day posts tie, so the newest-first order was arbitrary (owner report); the time fixes that. **Pages CMS writes the phone's clock time followed by `+00:00` whatever the real zone** (seen on the owner's first post: committed at 16:59 India time, saved as `16:57:00+00:00`), so the site does not trust the offset: `clockTimeAsSiteTime()` (`src/lib/format.ts`, applied to `date` and `updated` in `src/content.config.ts`) reads the clock reading as time in `SITE.timeZone` (Asia/Kolkata). A post written at 20:30 therefore stays on its own day and orders correctly. **A hand-written date with a real offset (`+05:30`) would be misread**, so write dates as the India clock time; all authoring is meant to go through the editor. Date-only values count as midnight India time. Posts with exactly the same date and time are ordered by file name, later name first (`getPosts`). `updated` stays date-only.
- **File names:** suggested from the title (`{primary}.md`) and editable when creating; any name works (see "Post file names are free" above). A post with no title needs a name typed in.
- **No preview:** saving goes live, so unfinished posts should use the `draft` switch. Saving `books.yaml` through the CMS drops the explanatory comments at the top of that file.
- The syntax was taken from the Pages CMS 2.x docs (read November 2026); I could not run the editor itself here. A post written the way the CMS writes it was built and rendered correctly (title, summary, tags, cover, caption).

## Books page (`src/pages/books.astro`)

A grid of books read, grouped by the year finished (newest year first), styled like the archive's year headings and the topics tiles: 2 columns on phones, 3 on tablet, 4 on desktop, with the sidebar.

- **Data:** one list in `src/content/books.yaml` (collection `books` in `src/content.config.ts`; the `yaml` package parses it and gives each book its position as id). Each book: `title`, `author`, `year` (required) and an optional `cover` (a picture in `src/assets/books/`, written as `../assets/books/name.jpg`). Within a year the order is the order in the file.
- **Cover:** 2:3, cropped by Astro; alt is empty because the title sits right beneath it. Without a cover the book gets a tile (gradient, magenta, grey in turn) with the title's first letter (leading "the/a/an" skipped).
- **The books in the file are the owner's own** (Musafir Cafe, The Mirror Of Infinite Endings, Ikigai), each with a cover in `src/assets/books/`. A title containing a colon needs quotes in the YAML.
- Books are not pages and are not in search or the sitemap beyond `/books/` itself.

## Motion (page transitions) — read before touching

**November 2026:** the Windows Phone 7/8 animations (pivot, turnstile, feather, continuum with lift) were replaced with a small, plain set, now on `main`; the old version's details are in the git history (last commit before the change: `89ca4b2`) (`MotionDirector.astro`, `src/lib/motion.ts`, `src/styles/motion.css`). The owner asked for "smooth and sensible" motion that need not copy Windows Phone 7/8, and only on elements where it makes sense; then asked for the page slide to feel a little like Windows 10 Mobile. Don't add motion to every element.

Built on Astro's `<ClientRouter />` (in `BaseHead.astro`), so pages swap without full reloads. Prefetch (`prefetchAll`, viewport strategy in `astro.config.mjs`) keeps the next page ready.

| File | Role |
| --- | --- |
| `src/lib/transitions.ts` | The main column's animation (`pageAnimation`, passed to `transition:animate` in `BaseLayout`) and the shared name `COVER_NAME` |
| `src/styles/transitions.css` | The four slide keyframes, the slide distance, the cover's timing, and the reduced-motion rule |
| `src/components/CoverFlight.astro` | A small script that names the cover that should travel |

**What moves:**
- **Main column** (`transition:name="main"`), Windows 10 Mobile style: the old content fades out in 0.15 s while nudging 1.25 rem away; the new content slides in 2.5 rem (`--slide-distance`) while fading in over 0.35 s, easing to a stop (`cubic-bezier(0.1, 0.9, 0.2, 1)`). **Forwards it comes from the right, going back from the left** (`forwards` and `backwards` in `pageAnimation`). The distance is small on purpose: a whole column sliding far streaks its text on phones. No stagger, no per-item or per-paragraph animation.
- **Header, sidebar, footer:** don't animate. The sidebar is named `sidebar` with `transition:animate="none"` so it swaps instantly; the header and footer are part of the page background, which cross-fades (identical headers show no change).
- **Post cover:** opening a post from a page that shows its card (home, posts list, topic) moves the card's cover into the post page's cover (0.45 s, ease-out), and going back moves it to its card. Notes, posts with no cover, and posts opened from search or from another post have no travelling picture; the page just changes. The date and title don't fly.
- Hover and colour micro-transitions on buttons and links (0.15 s) are not page transitions and stay.
- `prefers-reduced-motion: reduce` turns page animation off (`transitions.css`; Astro also skips it).

**How the cover is named:** `CoverFlight.astro` listens for `astro:before-preparation` and `astro:after-swap`. Elements that can travel carry `data-cover` (the card's cover link in `PostCard`, the cover box on the post page, which also carries `data-post-id`). Opening a post: the card is named `post-cover` before the old page is captured and the post page's cover is named right after the swap. Going back: the other way round. Nothing is named in advance, so the same post on several pages (home, topic, posts list) never sends unrelated pictures flying.

**Rules (each from a real bug in the earlier version):**
1. **Never put a static `transition:name` on list items.** Two cards with the same name break the transition, and a post that appears on two pages flies across the screen. Name the one card at navigation time.
2. **Never pass an empty or undefined `transition:name`.** Astro then generates numbered names that pair unrelated elements across pages.
3. **Never name the site header or its pieces.** Named, it morphed, flew in from above when the scroll position changed, and showed an off-screen header at the top.
4. **Card and post covers must have the same shape** (`--ratio-card`: 2:1 on desktop, 16:10 on tablet and phones). With different shapes the same photo is cropped differently at each end and visibly zooms (about 11% for a 16:9 photo) as it travels. If either shape changes, change both.
5. **A shared element must not sit inside an element that is itself animating** (a parent that is mid-turn makes it arrive tilted).
6. **Page scripts run once under the client router.** Put setup in an `astro:page-load` listener (see `search.astro`); use a bundled `<script>`, not `define:vars` (inline scripts can re-run).
7. **Links to files must never go through the client router.** The owner tapped RSS on About, pressed Back and saw an empty page. `RoundButton` adds `data-astro-reload` to links whose path has a file extension. Any new link to a file (feeds, images, downloads) needs the same.
8. **Testing transition CSS:** don't inject it with `addStyleTag` (Astro swaps stylesheets on navigation, so it silently does nothing); edit the source and rebuild.

## SEO (`BaseHead.astro`, `src/lib/seo.ts`)

- **Every page:** unique title and description, canonical link, `robots` meta, Open Graph and Twitter tags.
- **Link-preview images:** 1200×630 — covers are cropped with `getImage`; other pages use `public/og-default.jpg`. That image shows "lone voice" and the tagline; regenerate it whenever `SITE.tagline` changes (render an HTML page with Open Sans 300 and the Zune shapes at 1200×630 in Playwright, then save as JPEG).
- **Clean URLs:** `trailingSlash: 'always'`.
- **Structured data (JSON-LD):** `WebSite` with a `SearchAction` on page 1, `BlogPosting` and `BreadcrumbList` on posts, breadcrumbs on topic pages.
- **Crawling:**
  - The sitemap excludes `/search/`.
  - `robots.txt` is generated from the site address (`src/pages/robots.txt.ts`).
  - Search and 404 are `noindex`.
- **RSS** (`/rss.xml`): full content, the cover first (also as `media:content`), the link at the end, root-relative URLs made absolute.

## Search

Pagefind indexes `[data-pagefind-body]` (post pages only) after `astro build`. The date block and tags are `data-pagefind-ignore`; the date is passed as attribute meta. Search **doesn't work in `npm run dev`**: use `npm run build && npm run preview`.

## Commands and testing

```sh
npm install
npm run dev       # drafts visible; no search
npm run build     # astro check (must report 0 errors / 0 warnings) + build + pagefind
npm run preview
```

- **Regression check for refactors:** build, copy `dist` aside, change the code, build again, then serve both and compare full-page screenshots of every page at 390, 820 and 1440 px with `reducedMotion: 'reduce'`. Identical bytes mean nothing changed visually. (The CSS cleanup that cut the stylesheet from 51 KB to 17 KB was verified this way: 81 of 81 identical.)
- **Preview server:** Astro 7's `astro preview` is a single instance. If one is running, a new call says "already running at …" (check the log for the port). Stop it with `npx astro preview stop`.
- **Browser:** Chromium and Playwright are preinstalled. Don't run `playwright install`.
- **Visual checks:**
  - Screenshots at 390×844 and 1440×900.
  - Slow motion: create a CDP session, call `Animation.enable` and `Animation.setPlaybackRate({ playbackRate: 0.1 })`, then take screenshots every ~500 ms during a navigation.
- **Motion audit:**
  - **Unpaired elements:** for each kind of navigation (home → post, deep tap, archive/search/pinned → post, post → older post, post → menu, pivots, back), record computed `view-transition-name`s on `astro:before-swap` (old page) and `astro:after-swap` (new page). Anything on only one side, except `root`, `main` and `sidebar`, is jank. The expected flying names are only `post-date-*`, `post-title-*` and `post-cover-*`.
  - **Running animations:** `document.getAnimations()` right after a swap lists every animation, including the view-transition pseudo-elements.
- **The live site is reachable from this environment** for checks after a deploy.

## Code map

```
src/site.config.ts      SITE (title, tagline, intro, url, publisher, socialImage, lang, locale,
                        timeZone Asia/Kolkata, pageSize 10, archivePageSize 20, copyrightYear), NAV, FOOTER_LINKS
src/content.config.ts   post schema
src/lib/books.ts        getBooks, getBooksByYear
src/lib/posts.ts        getPosts, isPhoto/isNote, excerpt/summary/displayTitle, topics, pinned,
                        archive grouping, linkHost
src/lib/format.ts       date parts in SITE.timeZone (en-GB)
src/lib/seo.ts          JSON-LD builders
src/lib/pagination.ts   paginate(): pages at / and /page/N/ (or /posts/ and /posts/page/N/)
src/lib/transitions.ts  main-column animation, shared cover name
src/layouts/BaseLayout  head, skip link, header, main (+ optional sidebar slot), footer, CoverFlight
src/layouts/PageLayout  single-column text pages (About, policies)
src/components/         one component per piece of the design (see README table); YearSection is the
                        year heading + spacing shared by the archive and books pages
src/pages/              index + page/[page] (home), posts/[slug] (one post), posts/index + posts/page/[page] (the posts list), topics/, topics/[topic], books, about,
                        search, content-policy, privacy-policy, 404, rss.xml.ts, robots.txt.ts
public/                 favicon.svg, apple-touch-icon.png, og-default.jpg,
                        _redirects (old /archive/ → /posts/, 301), _headers (cache rules: `/_astro/*` immutable for a year; fixed-name images 1 day;
                        `/pagefind/*` always revalidate)
```

## Open items and ideas (not done unless the owner asks)

- **Waiting on the owner:**
  - Real content (posts, About, policies, intro text).
  - Submit `https://lonevoice.pages.dev/sitemap-index.xml` to Google Search Console and Bing (and again if a custom domain is added later).
  - Checking motion on the iPhone.
- **Offered but not chosen yet:**
  - Security headers in `public/_headers` (long cache times are already there).
  - A light theme switch.
  - Cloudflare Web Analytics (cookie-free; would need a privacy-policy mention).
- **Rejected:** comments, comment counts, reading time, a "photos" section, sidebar copies of menu items, "recent covers", a personal name or photo, Tailwind.
