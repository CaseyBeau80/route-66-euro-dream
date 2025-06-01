
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
  // Filter for major stops only (destinations) - ensure we're getting all of them
  const destinations = waypoints.filter(waypoint => waypoint.is_major_stop === true);
  
  console.log(`🏛️ DestinationCitiesContainer: Processing waypoints`, {
    totalWaypoints: waypoints.length,
    destinationCities: destinations.length,
    mapAvailable: !!map
  });

  // Log detailed information about filtering
  console.log(`🔍 Waypoint filtering breakdown:`, {
    totalWaypoints: waypoints.length,
    majorStops: waypoints.filter(w => w.is_major_stop === true).length,
    nonMajorStops: waypoints.filter(w => w.is_major_stop === false || w.is_major_stop === null).length,
    destinationsFound: destinations.length
  });

  // Log each destination for debugging
  destinations.forEach((destination, index) => {
    console.log(`  🏛️ ${index + 1}. ${destination.name} (${destination.state}) - Major Stop: ${destination.is_major_stop}, Seq: ${destination.sequence_order}`);
  });

  // Also log waypoints that are NOT marked as major stops for debugging
  const nonMajorStops = waypoints.filter(w => w.is_major_stop !== true);
  if (nonMajorStops.length > 0) {
    console.log(`⚠️ Waypoints NOT marked as major stops:`, nonMajorStops.map(w => `${w.name} (${w.state}) - Major: ${w.is_major_stop}`));
  }

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
    console.log('⚠️ DestinationCitiesContainer: No destination cities found - this suggests data issue');
    console.log('🔍 All waypoints for debugging:', waypoints.map(w => ({
      name: w.name,
      state: w.state,
      is_major_stop: w.is_major_stop,
      sequence_order: w.sequence_order
    })));
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
