
import React from 'react';

interface MapContainerProps {
  isLoaded: boolean;
}

// This component has been completely removed to prevent route conflicts
// Use GoogleMapsRoute66 instead
const MapContainer: React.FC<MapContainerProps> = ({ isLoaded }) => {
  console.log('⚠️ MapContainer: Component deprecated and disabled to prevent route conflicts');
  return null;
};

export default MapContainer;
