import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapResponse = () => {
  useEffect(() => {
    console.log('SitemapResponse: Serving sitemap.xml');
    
    // Generate XML content
    const xml = generateSitemapFile();
    
    // Create a new response that mimics XML serving
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Replace current page with the XML content
    window.location.replace(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-route66-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-route66-primary mb-4">Loading Sitemap...</h1>
        <p className="text-route66-text-secondary">Redirecting to sitemap.xml...</p>
      </div>
    </div>
  );
};

export default SitemapResponse;