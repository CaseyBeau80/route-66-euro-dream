
import { useEffect } from 'react';
import { route66Waypoints } from './Route66Waypoints';

interface BackupRouteProps {
  map: google.maps.Map;
  directionsRenderer: google.maps.DirectionsRenderer | null;
}

const BackupRoute = ({ map, directionsRenderer }: BackupRouteProps) => {
  const createBackupRoute = () => {
    console.log('Creating backup route with polyline following historic Route 66 path');
    
    if (directionsRenderer) {
      directionsRenderer.setMap(null); // Remove existing renderer
    }
    
    // Create path coordinates for Route 66
    const route66Path = new google.maps.Polyline({
      path: route66Waypoints.map(wp => wp.location),
      geodesic: true,
      strokeColor: '#B91C1C',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 1.2,
          strokeColor: '#B91C1C',
          strokeWeight: 1
        },
        offset: '0',
        repeat: '100px'
      }]
    });
    
    route66Path.setMap(map);
    
    // Also add markers for major cities
    for (let i = 0; i < route66Waypoints.length; i++) {
      if (i === 0 || i === route66Waypoints.length - 1 || i % 3 === 0) {
        const majorStopMarker = new google.maps.Marker({
          position: route66Waypoints[i].location,
          map: map,
          title: route66Waypoints[i].location.toString()
        });
      }
    }
    
    return true;
  };
  
  return { createBackupRoute };
};

export default BackupRoute;
