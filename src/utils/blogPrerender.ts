/**
 * Build-time prerender helpers for blog post social previews.
 *
 * Replaces the static social-meta block in the built SPA shell (dist/index.html)
 * with a per-post block so non-JS crawlers (Facebook, LinkedIn, iMessage, Slack)
 * see the post's own featured image instead of the sitewide fallback.
 *
 * Pure functions — no IO, no fetch. Driven by blogPrerenderPlugin in vite.config.ts.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
}

const SITE = 'https://ramble66.com';
const FALLBACK_IMAGE = `${SITE}/images/og-big-bo.jpg`;
const TITLE_SUFFIX = ' | Ramble66 - Route 66 Adventures';

// Escape user-supplied strings for safe insertion into HTML attribute values.
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildBlogMetaBlock(post: BlogPostMeta): string {
  const url = `${SITE}/blog/${post.slug}`;
  const fullTitle = `${post.title}${TITLE_SUFFIX}`;
  const description = (post.excerpt ?? '').trim();
  const image = post.featured_image_url?.trim() || FALLBACK_IMAGE;
  const imageAlt = post.title;

  const t = escapeHtml(fullTitle);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  const i = escapeHtml(image);
  const a = escapeHtml(imageAlt);

  return [
    '<!-- SOCIAL-META-START -->',
    '<!-- Prerendered per-post social tags (blogPrerenderPlugin) -->',
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${u}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${i}" />`,
    `<meta property="og:image:alt" content="${a}" />`,
    `<meta property="og:site_name" content="Ramble 66" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${u}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${i}" />`,
    `<meta name="twitter:image:alt" content="${a}" />`,
    '<!-- SOCIAL-META-END -->',
  ].join('\n    ');
}

const SOCIAL_BLOCK_RE = /<!-- SOCIAL-META-START -->[\s\S]*?<!-- SOCIAL-META-END -->/;
const TITLE_RE = /<title>[\s\S]*?<\/title>/;
const DESC_RE = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i;

export function injectBlogMeta(html: string, post: BlogPostMeta): string {
  const fullTitle = `${post.title}${TITLE_SUFFIX}`;
  const description = (post.excerpt ?? '').trim();

  let out = html;

  if (SOCIAL_BLOCK_RE.test(out)) {
    out = out.replace(SOCIAL_BLOCK_RE, buildBlogMetaBlock(post));
  } else {
    console.warn(`[blogPrerender] SOCIAL-META sentinels not found for slug=${post.slug}; appending block to <head>.`);
    out = out.replace(/<\/head>/i, `    ${buildBlogMetaBlock(post)}\n  </head>`);
  }

  out = out.replace(TITLE_RE, `<title>${escapeHtml(fullTitle)}</title>`);
  out = out.replace(
    DESC_RE,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );

  return out;
}
