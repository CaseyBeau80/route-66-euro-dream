
import React from 'react';

interface MapLoadErrorProps {
  error: string;
}

const MapLoadError: React.FC<MapLoadErrorProps> = ({ error }) => {
  // Log detailed error information for debugging
  console.error('🗺️ MapLoadError details:', {
    error,
    isIncognito: !window.localStorage,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    domain: window.location.hostname,
    fullUrl: window.location.href
  });

  const handleTryWithNewApiKey = () => {
    const newApiKey = prompt('Enter your Google Maps API key (for testing):');
    if (newApiKey && newApiKey.trim()) {
      localStorage.setItem('google_maps_api_key', newApiKey.trim());
      console.log('🔄 Manual API key set, reloading...');
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
      <div className="text-center p-6 max-w-2xl">
        <h3 className="text-lg font-semibold text-red-600">Error Loading Google Maps</h3>
        <p className="mt-2 text-gray-700">
          {error || "Please check your internet connection or API key configuration."}
        </p>
        
        {/* Show current domain for debugging */}
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Current domain:</strong> {window.location.hostname}
          </p>
          <p className="text-sm text-yellow-800">
            <strong>Full URL:</strong> {window.location.href}
          </p>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Troubleshooting tips:</p>
          <ul className="text-left mt-2 space-y-1">
            <li>• Check browser console for detailed errors</li>
            <li>• Verify API key restrictions in Google Cloud Console</li>
            <li>• Ensure your domain is allowed in API key restrictions</li>
            <li>• Try refreshing the page</li>
            {!window.localStorage && <li>• Incognito mode detected - try normal browsing</li>}
          </ul>
        </div>
        
        <div className="mt-4 space-x-2">
          <button
            onClick={() => {
              console.log('🔄 Reloading page for debugging...');
              window.location.reload();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
          
          <button
            onClick={handleTryWithNewApiKey}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test with Manual API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLoadError;
