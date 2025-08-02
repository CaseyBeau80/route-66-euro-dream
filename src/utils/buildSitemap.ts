
import { writeFileSync } from 'fs';
import { generateSitemapFile } from './sitemapGenerator';

// This script generates the sitemap.xml file during build
export const buildSitemap = () => {
  try {
    const xml = generateSitemapFile();
    writeFileSync('public/sitemap.xml', xml, 'utf8');
    console.log('Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

// Auto-generate if this file is run directly
if (require.main === module) {
  buildSitemap();
}
