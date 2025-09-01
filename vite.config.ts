
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { generateSitemapFile } from "./src/utils/sitemapGenerator";

// https://vitejs.dev/config/
// Vite plugin to generate sitemap.xml into the final build output
const sitemapPlugin = () => {
  let outDir = 'dist';
  return {
    name: 'sitemap-generator',
    apply: 'build' as const,
    configResolved(config: any) {
      // capture outDir for later
      outDir = (config?.build?.outDir as string) || 'dist';
    },
    closeBundle() {
      try {
        const xml = generateSitemapFile();
        const target = path.resolve(outDir, 'sitemap.xml');
        writeFileSync(target, xml, 'utf8');
        console.log('[sitemap-plugin] Wrote', target);

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
        // Ensure consistent file naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    react(),
    sitemapPlugin(),
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
