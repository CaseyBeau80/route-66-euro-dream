
import React from 'react';

interface MapLoadingStatesProps {
  loadError: Error | undefined;
  isLoaded: boolean;
}

export const MapErrorState: React.FC = () => (
  <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
    <div className="text-center p-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Map Loading Error
      </h3>
      <p className="text-gray-600 mb-4">
        Unable to load Google Maps. Please check your internet connection and try again.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  </div>
);

export const MapLoadingState: React.FC = () => (
  <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Route 66 Map...</p>
    </div>
  </div>
);

const MapLoadingStates: React.FC<MapLoadingStatesProps> = ({ loadError, isLoaded }) => {
  if (loadError) {
    return <MapErrorState />;
  }

  if (!isLoaded) {
    return <MapLoadingState />;
  }

  return null;
};

export default MapLoadingStates;
