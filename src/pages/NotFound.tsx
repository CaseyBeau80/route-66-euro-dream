
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { generateSitemapFile } from "@/utils/sitemapGenerator";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('NotFound component rendering for path:', location.pathname);
    
    // Handle sitemap.xml requests
    if (location.pathname === '/sitemap.xml') {
      console.log('Handling sitemap.xml request');
      
      // Generate XML content
      const xml = generateSitemapFile();
      
      // Create a new document with XML content
      const newDoc = document.implementation.createDocument(null, null, null);
      const xmlDeclaration = document.implementation.createDocumentType('xml', '', '');
      newDoc.appendChild(xmlDeclaration);
      
      // Replace the entire page content with XML
      document.open();
      document.write(xml);
      document.close();
      
      // Set proper content type
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'application/xml; charset=utf-8');
      document.head.appendChild(meta);
      
      return;
    }
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // If this is a sitemap request, don't render the 404 UI
  if (location.pathname === '/sitemap.xml') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
