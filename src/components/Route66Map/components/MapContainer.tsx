
import React from 'react';

interface MapContainerProps {
  isLoaded: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({ isLoaded }) => {
  // This component is now deprecated in favor of GoogleMapsRoute66
  // which properly renders the Route 66 line through SimpleRoute66Service
  console.log('⚠️ MapContainer: Deprecated - using GoogleMapsRoute66 instead');
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">MapContainer deprecated - use GoogleMapsRoute66</p>
    </div>
  );
};

export default MapContainer;
