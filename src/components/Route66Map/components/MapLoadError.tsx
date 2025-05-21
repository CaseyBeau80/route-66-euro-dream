
import React from 'react';

interface MapLoadErrorProps {
  error: string;
}

const MapLoadError: React.FC<MapLoadErrorProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold text-red-600">Error Loading Google Maps</h3>
        <p className="mt-2 text-gray-700">
          {error || "Please check your internet connection or API key configuration."}
        </p>
      </div>
    </div>
  );
};

export default MapLoadError;
