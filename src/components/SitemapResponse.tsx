import React, { useEffect } from 'react';

const SitemapResponse: React.FC = () => {
  useEffect(() => {
    // Set the content type for sitemap.xml
    document.title = 'sitemap.xml';
  }, []);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.ramble66.com/</loc>
    <lastmod>2025-08-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.ramble66.com/contact</loc>
    <lastmod>2025-08-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.ramble66.com/about</loc>
    <lastmod>2025-08-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      fontSize: '14px', 
      margin: 0, 
      padding: '10px',
      backgroundColor: '#f5f5f5'
    }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapResponse;