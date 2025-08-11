
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync } from "fs";
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
      } catch (err) {
        console.warn('[sitemap-plugin] Failed to write sitemap:', err);
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
