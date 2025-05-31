
import React from 'react';
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
  // Filter for major stops only (destinations) and add logging
  const destinations = waypoints.filter(waypoint => waypoint.is_major_stop);
  
  console.log(`🏛️ DestinationCitiesContainer: Processing waypoints`, {
    totalWaypoints: waypoints.length,
    destinationCities: destinations.length,
    mapAvailable: !!map
  });

  // Log each destination for debugging
  destinations.forEach((destination, index) => {
    console.log(`  ${index + 1}. ${destination.name} (${destination.state}) - Major Stop: ${destination.is_major_stop}`);
  });

  const handleDestinationSelect = (destination: Route66Waypoint) => {
    console.log('🏛️ Destination selected (no navigation):', destination.name);
    
    // Call the original click handler but removed navigation
    onDestinationClick(destination);
    
    // Navigation to city page removed - destinations now only show info cards
  };

  if (!map) {
    console.log('⚠️ DestinationCitiesContainer: No map available');
    return null;
  }

  if (destinations.length === 0) {
    console.log('⚠️ DestinationCitiesContainer: No destination cities found');
    return null;
  }

  console.log(`🛡️ Rendering ${destinations.length} Route 66 destination shield markers`);

  return (
    <>
      {destinations.map((destination) => (
        <DestinationCustomMarker
          key={`destination-${destination.id}`}
          destination={destination}
          map={map}
          onDestinationClick={handleDestinationSelect}
        />
      ))}
    </>
  );
};

export default DestinationCitiesContainer;
