

# Fix Build Error + Blog Typography Upgrade

## 1. Fix build error — `vite.config.ts`

The previous sitemap cleanup removed `eventIds` and `nativeSiteSlugs` from the `SitemapData` interface in `sitemapGenerator.ts`, but `vite.config.ts` still passes them. Two edits:

**Lines 47–53**: Remove the `centennial_events` and `native_american_sites` fetch calls from `Promise.all`, and update the destructuring to only `[attractions, hiddenGems, blogPosts]`.

**Lines 55–61**: Remove `eventIds` and `nativeSiteSlugs` from the object passed to `generateSitemapFile`. Update the console.log on line 65 to remove the events/native-sites counts.

## 2. Blog typography — three files

### `index.html` (line 193)
Add `&family=Lora:wght@400;500;600;700` to the existing Google Fonts URL that loads Bebas Neue and Playfair Display.

### `tailwind.config.ts` (line 166)
Add `'lora': ['Lora', 'serif'],` to the `fontFamily` block, after the `playfair` entry.

### `src/components/Blog/BlogPostContent.tsx`
- Change outer `<article>` from `bg-white` to `bg-[#FAFAF7]`
- Wrap the content area below tags (the digest/markdown blocks + author note) in `<div className="max-w-[680px] mx-auto">`
- In the `MarkdownBlock` prose div: replace `prose-lg` with `font-lora text-[18px] leading-[1.75]`, add `prose-p:mb-6`
- Keep `prose-headings:font-playfair` unchanged (Playfair/Lora contrast)

## Files touched
1. `vite.config.ts` — remove phantom sitemap fetches (fixes build error)
2. `index.html` — add Lora font
3. `tailwind.config.ts` — add `lora` font family
4. `src/components/Blog/BlogPostContent.tsx` — background, max-width, typography

