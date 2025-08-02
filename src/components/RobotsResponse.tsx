import { useEffect } from 'react';

const RobotsResponse = () => {
  useEffect(() => {
    console.log('RobotsResponse: Serving robots.txt');
    
    // Generate robots.txt content
    const robotsContent = `User-agent: *
Allow: /
Sitemap: https://caseybeau80.github.io/ramble66-sitemap/sitemap.xml
`;
    
    // Create a new response that mimics text serving
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Replace current page with the robots.txt content
    window.location.replace(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-route66-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-route66-primary mb-4">Loading Robots.txt...</h1>
        <p className="text-route66-text-secondary">Redirecting to robots.txt...</p>
      </div>
    </div>
  );
};

export default RobotsResponse;