import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapRoute = () => {
  useEffect(() => {
    // Generate sitemap XML
    const xml = generateSitemapFile();
    
    // Replace the entire page content with XML
    document.documentElement.innerHTML = xml;
    
    // Add XML declaration if browser supports it
    if (document.implementation && document.implementation.createDocumentType) {
      const xmlDoc = document.implementation.createDocument('', '', null);
      xmlDoc.documentElement.innerHTML = xml;
    }
  }, []);

  // Render the XML content directly as text
  const xml = generateSitemapFile();
  
  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      {xml}
    </pre>
  );
};

export default SitemapRoute;