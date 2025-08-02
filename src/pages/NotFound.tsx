
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { generateSitemapFile } from "@/utils/sitemapGenerator";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle sitemap.xml requests
    if (location.pathname === "/sitemap.xml") {
      const xml = generateSitemapFile();
      
      // Replace the entire document with XML
      const newDoc = document.implementation.createHTMLDocument();
      newDoc.documentElement.innerHTML = `<html><head><meta charset="UTF-8"></head><body><pre>${xml}</pre></body></html>`;
      document.documentElement.innerHTML = newDoc.documentElement.innerHTML;
      
      // Set title for XML
      document.title = "Sitemap";
      return;
    }
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // If this is sitemap.xml, render the XML content
  if (location.pathname === "/sitemap.xml") {
    const xml = generateSitemapFile();
    return (
      <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', padding: '20px' }}>
        {xml}
      </div>
    );
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
