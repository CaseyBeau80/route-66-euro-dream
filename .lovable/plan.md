

## Analysis

Nearly everything requested is **already implemented**:

- `/blog/:slug` route exists in `App.tsx` (lazy-loaded `BlogPostPage`)
- `BlogPostPage.tsx` fetches by slug, renders title, date, author, hero image, full markdown content, SEO metadata (Helmet with title, description, OG tags, JSON-LD), and a "Back to Blog" breadcrumb
- `BlogCard` already links each post to `/blog/:slug` with a "Read Story →" link
- `useBlogPost.ts` fetches from the external Supabase `blog_posts` table by slug

**The only gap**: The sitemap (`sitemapGenerator.ts`) does not include blog post URLs.

## Plan

### 1. Add blog post URLs to the sitemap

**File: `src/utils/sitemapGenerator.ts`**
- Add a new method `addBlogRoutes(slugs: string[])` that generates entries for `/blog` (priority 0.9) and each `/blog/:slug` (priority 0.8, changefreq weekly)
- Update `generateSitemapFile` to accept blog slugs and call this method

**File: `src/pages/SitemapXmlPage.tsx`**
- Make the sitemap page dynamic: fetch published blog post slugs from external Supabase on mount, then generate the XML
- Include the three known slugs: `route-66-weekly-events-march-15-2026`, `near-term-route-66-centennial-highlights-jan-feb-2026-v4`, `route-66-centennial-2026-events-guide`

This is a small change — two files modified, no new files needed.

