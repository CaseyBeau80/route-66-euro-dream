
import React, { useEffect } from 'react';

declare global {
  interface Window {
    twttr: any;
  }
}

const TwitterTimeline: React.FC = () => {
  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
      script.setAttribute('charset', 'utf-8');
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load();
        }
      };
    } else {
      // If script is already loaded, just reload widgets
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="w-full px-2 sm:px-3 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="font-route66 text-3xl md:text-4xl text-route66-red mb-2">
            ROUTE 66 SOCIAL FEED
          </h2>
          <p className="font-travel text-route66-vintage-brown text-lg">
            Follow the latest adventures and stories from fellow travelers
          </p>
          <div className="flex justify-center mt-3">
            <div className="bg-route66-vintage-yellow text-route66-navy px-4 py-1 rounded-full font-bold text-sm">
              #ROUTE66
            </div>
          </div>
        </div>

        {/* Twitter Timeline Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vintage frame decoration */}
          <div className="absolute -inset-3 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80 vintage-paper-texture"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
          
          <div className="relative bg-white rounded-lg p-4 border-4 border-route66-vintage-brown shadow-postcard">
            {/* Twitter Timeline Embed */}
            <div className="flex justify-center">
              <a 
                className="twitter-timeline" 
                data-height="600"
                data-theme="light"
                data-chrome="noheader,nofooter,noborders,transparent"
                data-border-color="#8B4513"
                data-link-color="#CC2936"
                href="https://twitter.com/search?q=%23Route66"
              >
                Loading Route 66 tweets...
              </a>
            </div>
            
            {/* Fallback content while loading */}
            <noscript>
              <div className="text-center py-8">
                <p className="font-travel text-route66-vintage-brown">
                  JavaScript is required to view the Twitter timeline.
                </p>
                <a 
                  href="https://twitter.com/search?q=%23Route66" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="vintage-button inline-block mt-4 px-6 py-2 text-sm"
                >
                  View on Twitter
                </a>
              </div>
            </noscript>
          </div>
          
          {/* Vintage route markers */}
          <div className="flex justify-center mt-4 gap-2">
            <div className="bg-route66-vintage-turquoise text-white px-3 py-1 rounded-full text-xs font-bold">
              LIVE FEED
            </div>
            <div className="bg-route66-orange text-white px-3 py-1 rounded-full text-xs font-bold">
              REAL STORIES
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterTimeline;
