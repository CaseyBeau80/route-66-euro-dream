import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapXML = () => {
  console.log('SitemapXML component is rendering');
  
  useEffect(() => {
    console.log('SitemapXML useEffect running');
    // Set the document content type
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Type');
    meta.setAttribute('content', 'application/xml; charset=utf-8');
    document.head.appendChild(meta);
    
    // Set the title
    document.title = 'Sitemap';
  }, []);

  let xml;
  try {
    xml = generateSitemapFile();
    console.log('Generated XML:', xml.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    xml = 'Error generating sitemap';
  }
  
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