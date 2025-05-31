
import React from 'react';

interface BackupRouteProps {
  map: google.maps.Map;
  directionsRenderer: google.maps.DirectionsRenderer | null;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const BackupRoute = ({ map, directionsRenderer }: BackupRouteProps) => {
  console.log('⚠️ BackupRoute: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  
  const createBackupRoute = () => {
    console.log('⚠️ BackupRoute: createBackupRoute disabled to prevent route conflicts');
  };

  return {
    createBackupRoute
  };
};

export default BackupRoute;
