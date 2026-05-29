
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { generateSitemapFile } from "./src/utils/sitemapGenerator";
import { injectBlogMeta, type BlogPostMeta } from "./src/utils/blogPrerender";

// External Supabase credentials (same as src/lib/supabase.ts)
const SUPABASE_URL = "https://xbwaphzntaxmdfzfsmvt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo";

async function fetchTable(table: string, select: string, filters?: string): Promise<Record<string, string>[]> {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  if (filters) url += `&${filters}`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[sitemap-plugin] Failed to fetch ${table}: ${res.status}`);
      return [];
    }
    return (await res.json()) as Record<string, string>[];
  } catch (err) {
    console.warn(`[sitemap-plugin] Error fetching ${table}:`, err);
    return [];
  }
}

// https://vitejs.dev/config/
// Vite plugin to generate sitemap.xml into the final build output
const sitemapPlugin = () => {
  let outDir = 'dist';
  return {
    name: 'sitemap-generator',
    apply: 'build' as const,
    configResolved(config: any) {
      outDir = (config?.build?.outDir as string) || 'dist';
    },
    async closeBundle() {
      try {
        // Fetch all dynamic slugs/ids from external Supabase in parallel
        const [attractions, hiddenGems, blogPosts] = await Promise.all([
          fetchTable('attractions', 'slug'),
          fetchTable('hidden_gems', 'slug'),
          fetchTable('blog_posts', 'slug', 'is_published=eq.true'),
        ]);

        const xml = generateSitemapFile({
          attractionSlugs: attractions.map((r: any) => r.slug),
          hiddenGemSlugs: hiddenGems.map((r: any) => r.slug),
          blogSlugs: blogPosts.map((r: any) => r.slug),
        });

        const target = path.resolve(outDir, 'sitemap.xml');
        writeFileSync(target, xml, 'utf8');
        console.log(`[sitemap-plugin] Wrote ${target} with ${attractions.length} attractions, ${hiddenGems.length} hidden gems, ${blogPosts.length} blog posts`);

        // Ensure robots.txt is present in final build output
        const robotsIn = path.resolve('public', 'robots.txt');
        const robotsOut = path.resolve(outDir, 'robots.txt');
        let robotsContent = 'User-agent: *\nAllow: /\nSitemap: https://ramble66.com/sitemap.xml\n';
        try {
          if (existsSync(robotsIn)) {
            robotsContent = readFileSync(robotsIn, 'utf8');
          }
        } catch {}
        writeFileSync(robotsOut, robotsContent, 'utf8');
        console.log('[sitemap-plugin] Wrote', robotsOut);
      } catch (err) {
        console.warn('[sitemap-plugin] Failed to write sitemap/robots:', err);
      }
    }
  };
};

// Vite plugin: after the SPA bundle is written, generate per-post HTML at
// dist/blog/<slug>/index.html with the post's own og:image / twitter:image /
// title / description so non-JS social crawlers (Facebook, LinkedIn, iMessage,
// Slack) see the real featured image instead of the static fallback.
const blogPrerenderPlugin = () => {
  let outDir = 'dist';
  return {
    name: 'blog-prerender',
    apply: 'build' as const,
    configResolved(config: any) {
      outDir = (config?.build?.outDir as string) || 'dist';
    },
    async closeBundle() {
      try {
        const shellPath = path.resolve(outDir, 'index.html');
        if (!existsSync(shellPath)) {
          console.warn('[blog-prerender] dist/index.html not found; skipping.');
          return;
        }
        const shell = readFileSync(shellPath, 'utf8');

        const posts = (await fetchTable(
          'blog_posts',
          'slug,title,excerpt,featured_image_url',
          'is_published=eq.true',
        )) as unknown as BlogPostMeta[];

        let written = 0;
        for (const post of posts) {
          if (!post?.slug || !post?.title) continue;
          const html = injectBlogMeta(shell, post);
          const dir = path.resolve(outDir, 'blog', post.slug);
          mkdirSync(dir, { recursive: true });
          writeFileSync(path.resolve(dir, 'index.html'), html, 'utf8');
          written += 1;
        }
        console.log(`[blog-prerender] Wrote ${written} per-post HTML files under ${path.resolve(outDir, 'blog')}`);
      } catch (err) {
        console.warn('[blog-prerender] Failed:', err);
      }
    },
  };
};
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    react(),
    sitemapPlugin(),
    blogPrerenderPlugin(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}));
