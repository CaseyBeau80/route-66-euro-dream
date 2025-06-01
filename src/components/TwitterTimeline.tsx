
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    twttr: any;
  }
}

const TwitterTimeline: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadTwitterWidget = () => {
      console.log("🐦 TwitterTimeline: Starting widget load process");
      
      // Set a timeout to handle cases where the widget never loads
      timeoutId = setTimeout(() => {
        console.log("🐦 TwitterTimeline: Widget load timeout");
        setIsLoading(false);
        setHasError(true);
      }, 10000); // 10 second timeout

      if (!window.twttr) {
        console.log("🐦 TwitterTimeline: Loading Twitter script");
        const script = document.createElement('script');
        script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
        script.setAttribute('charset', 'utf-8');
        script.async = true;
        
        script.onload = () => {
          console.log("🐦 TwitterTimeline: Script loaded, initializing widgets");
          if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load().then(() => {
              console.log("🐦 TwitterTimeline: Widgets loaded successfully");
              clearTimeout(timeoutId);
              setIsLoading(false);
            }).catch((error: any) => {
              console.error("🐦 TwitterTimeline: Widget load error:", error);
              clearTimeout(timeoutId);
              setIsLoading(false);
              setHasError(true);
            });
          }
        };
        
        script.onerror = () => {
          console.error("🐦 TwitterTimeline: Failed to load Twitter script");
          clearTimeout(timeoutId);
          setIsLoading(false);
          setHasError(true);
        };
        
        document.head.appendChild(script);
      } else {
        console.log("🐦 TwitterTimeline: Script already loaded, reloading widgets");
        window.twttr.widgets.load().then(() => {
          console.log("🐦 TwitterTimeline: Widgets reloaded successfully");
          clearTimeout(timeoutId);
          setIsLoading(false);
        }).catch((error: any) => {
          console.error("🐦 TwitterTimeline: Widget reload error:", error);
          clearTimeout(timeoutId);
          setIsLoading(false);
          setHasError(true);
        });
      }
    };

    loadTwitterWidget();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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
            {/* Loading State */}
            {isLoading && !hasError && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-red mx-auto mb-4"></div>
                  <p className="font-travel text-route66-vintage-brown">
                    Loading Route 66 tweets...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="bg-route66-vintage-yellow text-route66-navy px-4 py-2 rounded-full font-bold text-sm inline-block mb-4">
                    SOCIAL FEED TEMPORARILY UNAVAILABLE
                  </div>
                </div>
                <p className="font-travel text-route66-vintage-brown mb-4">
                  Having trouble loading the latest tweets. Connect with Route 66 travelers directly:
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="https://twitter.com/hashtag/Route66" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="vintage-button inline-block px-6 py-2 text-sm bg-route66-red text-white hover:bg-route66-vintage-red transition-colors"
                  >
                    View #Route66 on Twitter
                  </a>
                  <a 
                    href="https://twitter.com/search?q=Route%2066%20road%20trip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="vintage-button inline-block px-6 py-2 text-sm bg-route66-orange text-white hover:bg-route66-rust transition-colors"
                  >
                    Route 66 Road Trips
                  </a>
                  <a 
                    href="https://twitter.com/search?q=%22mother%20road%22" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="vintage-button inline-block px-6 py-2 text-sm bg-route66-vintage-turquoise text-white hover:opacity-80 transition-opacity"
                  >
                    Mother Road Stories
                  </a>
                </div>
              </div>
            )}
            
            {/* Twitter Timeline Embed - Only show when not loading and no error */}
            {!isLoading && !hasError && (
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
            )}
            
            {/* Fallback content for no JavaScript */}
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
