
import { useEffect } from 'react';
import { generateSitemapFile } from '@/utils/sitemapGenerator';

const SitemapXML = () => {
  console.log('SitemapXML component is rendering');
  
  useEffect(() => {
    console.log('SitemapXML useEffect running');
    
    // For XML requests, we need to handle this differently
    const handleXmlResponse = () => {
      const xml = generateSitemapFile();
      console.log('Generated XML for download:', xml.substring(0, 100) + '...');
      
      // Create and trigger download
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Redirect back to home after download
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    };
    
    handleXmlResponse();
  }, []);

  // Show a loading message briefly before redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-route66-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-route66-primary mb-4">Generating Sitemap...</h1>
        <p className="text-route66-text-secondary">Your sitemap.xml file will download automatically.</p>
      </div>
    </div>
  );
};

export default SitemapXML;
