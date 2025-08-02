import React, { useEffect } from 'react';

const RobotsResponse: React.FC = () => {
  useEffect(() => {
    // Set the content type for robots.txt
    document.title = 'robots.txt';
  }, []);

  const robotsContent = `User-agent: *
Allow: /
Sitemap: https://www.ramble66.com/sitemap.xml`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      fontSize: '14px', 
      margin: 0, 
      padding: '10px',
      backgroundColor: '#f5f5f5'
    }}>
      {robotsContent}
    </pre>
  );
};

export default RobotsResponse;