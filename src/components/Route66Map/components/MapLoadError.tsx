
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
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold text-red-600">Error Loading Google Maps</h3>
        <p className="mt-2 text-gray-700">
          {error || "Please check your internet connection or API key configuration."}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Troubleshooting tips:</p>
          <ul className="text-left mt-2 space-y-1">
            <li>• Check browser console for detailed errors</li>
            <li>• Verify API key restrictions in Google Cloud Console</li>
            <li>• Try refreshing the page</li>
            {!window.localStorage && <li>• Incognito mode detected - try normal browsing</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapLoadError;
