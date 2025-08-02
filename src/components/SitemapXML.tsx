import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapXML = () => {
  useEffect(() => {
    // Set the document content type
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Type');
    meta.setAttribute('content', 'application/xml; charset=utf-8');
    document.head.appendChild(meta);
    
    // Set the title
    document.title = 'Sitemap';
  }, []);

  const xml = generateSitemapFile();
  
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      fontSize: '14px',
      lineHeight: '1.4',
      margin: 0,
      padding: '10px',
      whiteSpace: 'pre-wrap',
      backgroundColor: '#f8f9fa'
    }}>
      {xml}
    </pre>
  );
};

export default SitemapXML;