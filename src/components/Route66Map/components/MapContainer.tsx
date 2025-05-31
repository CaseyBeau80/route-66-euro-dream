
import React from 'react';

interface MapContainerProps {
  isLoaded: boolean;
}

// Deprecated component - use GoogleMapsRoute66 instead
const MapContainer: React.FC<MapContainerProps> = ({ isLoaded }) => {
  console.log('⚠️ MapContainer: Deprecated - use GoogleMapsRoute66 instead');
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Component deprecated - use GoogleMapsRoute66</p>
    </div>
  );
};

export default MapContainer;
