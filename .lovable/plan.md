# Per-post social previews via build-time prerender + auto-redeploy on publish

## Goal

Each `/blog/:slug` URL must ship initial HTML with that post's own `og:image`, `twitter:image`, `og:title`, `og:description`, and `og:url` — so Facebook, LinkedIn, iMessage, and Slack (which don't run JS) get the real featured image, not `og-big-bo.jpg`.

A new post must be prerendered and live **before** the first social share — no manual rebuild step. Achieved with a Supabase trigger that fires a Lovable deploy hook whenever `blog_posts.is_published` flips to true.

Homepage and all other routes keep the existing static fallback in `index.html`.

## Part 1 — Build-time prerender

Extend the existing `sitemapPlugin` pattern in `vite.config.ts` with a second Vite plugin (`blogPrerenderPlugin`) that runs in `closeBundle` after the SPA bundle is written.

For each published post in `blog_posts`:

1. Read `dist/index.html` (the built SPA shell — same JS, same CSS, fully hydrates client-side).
2. Replace the static social-tag block (lines 111-115 of `index.html`) with a per-post block: `og:title`, `og:description`, `og:url`, `og:type=article`, `og:image`, `og:image:alt`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
3. Also override `<title>` and `<meta name="description">` for parity with Helmet.
4. Write the result to `dist/blog/<slug>/index.html`.

Lovable's static hosting serves `dist/blog/<slug>/index.html` directly when present; the SPA catch-all only fires when no matching file exists. Real users still get the full React app because the prerendered HTML loads the same `/src/main.tsx` bundle and React Router takes over after hydration.

### Files

- `vite.config.ts` — add `blogPrerenderPlugin` alongside `sitemapPlugin`. Fetches posts via `fetchTable('blog_posts', 'slug,title,excerpt,featured_image_url', 'is_published=eq.true')`.
- New `src/utils/blogPrerender.ts` — pure helper `injectBlogMeta(html, post)` that does the string replacement. Unit-testable.
- One small edit to `index.html` — wrap the existing 4-tag social block in `<!-- SOCIAL-META-START -->` / `<!-- SOCIAL-META-END -->` sentinels so the plugin can replace the block safely without regex fragility. The tags themselves don't change.
- No changes to `BlogPostPage.tsx` — Helmet tags stay (harmless, helps Googlebot).

### HTML escaping

Post title/excerpt/image URL are escaped (`&`, `<`, `>`, `"`, `'`) before injection.

## Part 2 — Auto-redeploy on publish

Wire publish events in Supabase to a Lovable deploy hook so prerender runs without human action.

### Steps (in this order)

1. **Get the Lovable deploy hook URL.** In Lovable: Publish dialog → Settings → look for "Deploy hook" or "Build webhook." It's a unique URL like `https://lovable.dev/api/deploy-hooks/<token>`. The user grabs this and gives it to us. We store it as a Supabase secret named `LOVABLE_DEPLOY_HOOK_URL` (via `add_secret`, not committed to code — the token is sensitive).
2. **Create a Supabase database trigger** that fires when `blog_posts.is_published` transitions to true (insert with `is_published=true`, or update flipping false→true). The trigger calls a Postgres function that POSTs to the deploy hook using `pg_net.http_post`.
3. **Enable `pg_net` extension** if not already enabled (one-time migration).
4. Trigger function reads the URL from a settings table or a hardcoded GUC; since secrets aren't natively readable from triggers, the cleanest pattern is: store the URL in a small `app_settings` table with RLS denying all client access, and have the trigger function `SELECT` it. Alternative: use Supabase Vault. I'll go with `app_settings` for simplicity unless you prefer Vault.

### Debouncing

If a post gets multiple updates in quick succession (typo fixes right after publish), each one triggers a build. Lovable's deploy queue should coalesce, but if it doesn't, we add a 60-second debounce in the trigger function (skip if last fire < 60s ago, tracked in `app_settings`).

### Verification

After publishing a new post:
- Check Supabase logs for the `pg_net` request and a 200/202 response from the deploy hook.
- Watch Lovable's deploy dashboard for the triggered build.
- Once deployed: `curl -sA "facebookexternalhit/1.1" https://ramble66.com/blog/<new-slug> | grep og:image` shows the post's featured image.

## Out of scope

- Prerendering attraction/hidden-gem detail pages (same plugin can be extended later).
- `og:image:width/height` (requires fetching/measuring each image).
- Cache-busting Facebook's scrape cache for already-shared old URLs — those need a manual "Scrape Again" in the Facebook Debugger. New shares get fresh data automatically.

## What I need from you to start Part 2

The Lovable deploy hook URL. Open Publish → Settings, copy the deploy/build webhook URL, and paste it back. I'll then request it as a secret (`LOVABLE_DEPLOY_HOOK_URL`) and wire up the trigger. Part 1 (prerender plugin) doesn't need anything from you and I can ship it first.
