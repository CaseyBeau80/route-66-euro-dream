
import React from 'react';

const MapLoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-gray-200">
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold">Loading Google Maps...</h3>
        <p className="mt-2 text-gray-500">Please wait while we load the map.</p>
      </div>
    </div>
  );
};

export default MapLoadingIndicator;
