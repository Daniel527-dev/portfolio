# Portfolio

A full-stack personal portfolio and blog in the style of [joshwcomeau.com](https://www.joshwcomeau.com/), with ideas borrowed from [brittanychiang.com](https://brittanychiang.com/) (spotlight cursor, experience list) and [jhey.dev](https://jhey.dev/) (playful micro-interactions).

Built with **Next.js 16 (App Router)**, **React 19**, **MDX** and **SQLite** (`node:sqlite`, so there is nothing native to compile).

## Features

**Front end**
- Home page with a hero section, an animated SVG mascot whose eyes follow the cursor (click it to wave), and sparkles around the title
- Recently Published list, Browse by Category, a Popular Content list ranked by real view counts, featured projects and a newsletter signup
- MDX articles with a sticky table of contents, syntax-highlighted code blocks with a copy button, callouts, and interactive demos (spring physics, flexbox playground, effect cleanup)
- A like button that fills a heart with each click (up to 10 per visitor), with particle bursts and sound
- Light and dark themes with no flash on load, a sound toggle (sounds are generated with Web Audio, so there are no audio files), Ctrl/⌘ + K search, a cursor spotlight, a responsive mobile menu and a custom 404 page
- Respects `prefers-reduced-motion`; semantic HTML, a skip link, focus styles and ARIA labels throughout

**Back end**
- `POST/GET /api/likes/[slug]`: batched likes, capped per visitor in SQL
- `POST/GET /api/views/[slug]`: view counter (one view per visitor every 30 minutes)
- `POST /api/subscribe`: newsletter signup with validation, duplicate detection and a honeypot
- `POST /api/contact`: contact form with validation, a honeypot and rate limiting
- `/admin`: password-protected dashboard (HMAC-signed httpOnly cookie, server actions) showing stats, messages and subscribers
- `/rss.xml`, `/sitemap.xml`, `/robots.txt` and Open Graph metadata

Visitors are identified by a salted SHA-256 hash of their IP address and user agent. No raw personal data is stored.

## Getting started

Requires **Node.js 22.13 or newer**.

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                  # http://localhost:3000
```

The SQLite database is created automatically at `data/portfolio.db`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit tests for the data layer and validation (`node:test`) |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm run lint` | ESLint |

## Making it yours

- **Name, bio, socials, projects, experience:** `src/site.config.ts`
- **Articles:** add an `.mdx` file to `content/posts/` (the filename becomes the URL slug). Frontmatter fields:
  ```yaml
  title: My Article
  abstract: One or two sentences shown in lists and previews.
  publishedOn: 2026-10-01
  updatedOn: 2026-10-05   # optional
  category: css           # one of the slugs in site.config.ts
  ```
  MDX can use `<Callout type="info|warning|success" title="…">`, `<SpringDemo />`, `<FlexPlayground />` and `<CleanupDemo />`. To register more components, see `src/lib/mdx.tsx`.
- **Colours, fonts and spacing:** CSS custom properties at the top of `src/app/globals.css`

## Project structure

```
content/posts/          MDX articles
src/site.config.ts      all personal content
src/app/                routes (pages, API route handlers, admin, RSS, sitemap)
src/components/         UI components (+ components/mdx for article widgets)
src/lib/                db.ts (SQLite), content.ts (MDX loading), mdx.tsx, auth.ts, validation.ts, request.ts, sound.ts
tests/                  node:test unit tests
```

## Deploying

- **Netlify:** connect the GitHub repo and deploy. `netlify.toml` already sets the build command (`npm run build`), the publish directory (`.next`) and Node 22, and Netlify adds its Next.js adapter automatically. Leave the build settings in the Netlify UI empty, or make them match these values.
- **VPS / Docker / Railway / Render / Fly.io:** `npm run build && npm start`. Mount a persistent volume and point `DATABASE_PATH` at it.
- **Vercel:** deploys with no extra configuration.

Serverless hosts (Netlify, Vercel) only allow writes to the temp directory, so the database falls back to it there. The site works, but likes, views, subscribers and messages reset whenever the server function restarts or the site is redeployed. For durable data on those hosts, replace `src/lib/db.ts` with a hosted database (Turso/libSQL, Postgres, Netlify Blobs, etc.). The function signatures can stay the same.

On Netlify and Vercel, set `ADMIN_PASSWORD` and `SESSION_SECRET` as environment variables in the site settings. `.env.local` is never committed.

Set `SITE_URL` to the public URL so RSS, the sitemap and Open Graph links are correct.

The rate limiter lives in memory. If you run several server instances, move it to Redis or a similar shared store.
