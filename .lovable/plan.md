## Option A: Static brand og:image fallback (stopgap)

### Code change — `index.html`

Add four meta tags inside the existing `<head>`, right after the existing static SEO block (after the `<meta name="robots">` line, before the `<meta name="theme-color">` line):

```html
<!-- Static social preview fallback. Helmet on per-route pages (e.g. BlogPostPage) overrides for JS-executing crawlers like Googlebot. Social scrapers (Facebook, LinkedIn, Slack) only see this static tag until prerender (Option B) lands. -->
<meta property="og:image" content="https://ramble66.com/images/og-big-bo.jpg" />
<meta property="og:image:alt" content="Ramble 66 — Route 66 Trip Planner" />
<meta name="twitter:image" content="https://ramble66.com/images/og-big-bo.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

That's the entire code change. One file, four lines.

### No changes to `BlogPostPage.tsx`
Confirmed — its existing Helmet `og:image` / `twitter:image` tags stay as-is. They help Googlebot show the correct featured image in search results and do nothing harmful to Facebook (which ignores Helmet output anyway).

### Where to disable the Lovable auto social card (you'll do this manually)

Honest disclosure: I do not have an API to flip this for you, and I have not personally seen this exact toggle in the current Publish UI. Based on the live HTML, the auto-injected r2.dev og:image is added by Lovable's hosting pipeline. The most likely locations to check, in order:

1. **Publish dialog → "Settings" / gear icon** inside the Publish modal itself (Desktop: top-right Publish button; Mobile: `...` menu → Publish). Look for "Social preview image" or "Auto-generate social card" or similar.
2. **Project Settings → Project section** (Desktop: click project name top-left → Settings; Mobile: `...` → Settings). Look in General or a "Social" / "SEO" sub-section.
3. If neither exposes it, ask Lovable support (or post in the Discord) — phrase it as: "How do I disable the auto-generated og:image / Twitter card on my published site? It's overriding my static meta tags."

If you can't find a toggle, the static tags I'm adding will still ship in `index.html` but the auto-injected tag will continue to appear alongside them. Facebook deduplicates `og:image` by taking the **first one it sees**. Since the auto-injected tag appears just before `</head>` (after our static tags), our static tag should win — but please verify after publish.

### Verification steps (after you republish)

1. `curl https://ramble66.com/blog/route-66-diners-where-to-eat | grep -iE "og:image|twitter:image"` — confirm `og-big-bo.jpg` appears, and note whether the r2.dev tag is gone (toggle worked) or still present (toggle not found, but ours appears first).
2. Paste the URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → "Scrape Again" → confirm the preview shows the Big Bo brand image, **not** the Seligman shield.
3. Repeat for `https://ramble66.com/` and `https://ramble66.com/blog` to confirm the fallback works everywhere.

### What Option A does NOT fix
Facebook will show the same Big Bo brand image for every blog post — the diner photo will still not appear on FB. That's the whole point of Option B (build-time prerender), which I'll plan separately when you're ready. Googlebot already shows the correct per-post image thanks to Helmet.

### Out of scope for this turn
- Option B prerender (separate plan when you're ready)
- Any change to `BlogPostPage.tsx`, `SocialMetaTags.tsx`, or other route components
- Any change to `vite.config.ts` or build pipeline