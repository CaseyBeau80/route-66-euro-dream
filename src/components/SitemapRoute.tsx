import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapRoute = () => {
  useEffect(() => {
    // Generate sitemap XML
    const xml = generateSitemapFile();
    
    // Set proper headers and serve XML
    const response = new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
    
    // Create blob URL and replace current page
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    window.location.replace(url);
  }, []);

  return null;
};

export default SitemapRoute;