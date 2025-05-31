
import React, { useEffect } from 'react';
import DestinationCustomMarker from './Destinations/DestinationCustomMarker';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface DestinationCitiesContainerProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
  onDestinationClick: (destination: Route66Waypoint) => void;
}

const DestinationCitiesContainer: React.FC<DestinationCitiesContainerProps> = ({
  map,
  waypoints,
  onDestinationClick
}) => {
  // Filter for destination cities (major stops)
  const destinationCities = waypoints.filter(waypoint => waypoint.is_major_stop === true);

  useEffect(() => {
    console.log('🏛️ DestinationCitiesContainer: Active and managing destination cities');
    console.log(`✅ Managing ${destinationCities.length} destination cities (NO yellow circles)`);
    console.log('🎯 Destination cities:', destinationCities.map(d => d.name));
    
    // Add portal root if it doesn't exist
    if (!document.getElementById('map-portal-root')) {
      const portalRoot = document.createElement('div');
      portalRoot.id = 'map-portal-root';
      portalRoot.style.position = 'absolute';
      portalRoot.style.top = '0';
      portalRoot.style.left = '0';
      portalRoot.style.pointerEvents = 'none';
      portalRoot.style.zIndex = '100000';
      document.body.appendChild(portalRoot);
      console.log('📍 Created map portal root for hover cards');
    }

    return () => {
      console.log('🧹 DestinationCitiesContainer: Cleaning up destination markers');
    };
  }, [destinationCities.length]);

  if (!map || destinationCities.length === 0) {
    console.log('🏛️ DestinationCitiesContainer: No map or destination cities available');
    return null;
  }

  console.log('🏛️ DestinationCitiesContainer: Rendering destination markers for:', destinationCities.map(d => d.name));

  return (
    <>
      {destinationCities.map((destination) => (
        <DestinationCustomMarker
          key={destination.id}
          destination={destination}
          map={map}
          onDestinationClick={onDestinationClick}
        />
      ))}
    </>
  );
};

export default DestinationCitiesContainer;
