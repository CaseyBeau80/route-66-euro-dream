
import React from 'react';
import DestinationCustomMarker from './Destinations/DestinationCustomMarker';
import { useDestinationCities } from '../hooks/useDestinationCities';
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
  // Use the actual destination cities data instead of filtering waypoints
  const { destinationCities, isLoading } = useDestinationCities();
  
  console.log(`🏛️ DestinationCitiesContainer: Using ACTUAL destination cities data`, {
    destinationCitiesCount: destinationCities.length,
    waypointsCount: waypoints.length,
    mapAvailable: !!map,
    isLoading
  });

  // Convert destination cities to Route66Waypoint format for compatibility
  const destinationWaypoints: Route66Waypoint[] = destinationCities.map((city, index) => ({
    id: city.id,
    name: city.name,
    state: city.state,
    latitude: Number(city.latitude),
    longitude: Number(city.longitude),
    sequence_order: index + 1, // Assign sequence based on order
    is_major_stop: true, // All destination cities are major stops
    highway_designation: 'US-66',
    description: city.description || null
  }));

  console.log(`🏛️ Converted ${destinationCities.length} destination cities to waypoint format:`);
  destinationWaypoints.forEach((dest, index) => {
    console.log(`  🏛️ ${index + 1}. ${dest.name} (${dest.state})`);
  });

  // Special check for Rolla - it should NOT be in destination cities
  const rollaInDestinations = destinationWaypoints.find(d => d.name.toLowerCase().includes('rolla'));
  if (rollaInDestinations) {
    console.warn(`🚨 WARNING: Rolla found in destination cities - this should NOT happen!`, rollaInDestinations);
  } else {
    console.log(`✅ CORRECT: Rolla is NOT in destination cities`);
  }

  // Also check if Rolla is in the original waypoints for debugging
  const rollaInWaypoints = waypoints.find(w => w.name.toLowerCase().includes('rolla'));
  if (rollaInWaypoints) {
    console.log(`🔍 DEBUG: Rolla found in route66_waypoints:`, {
      name: rollaInWaypoints.name,
      state: rollaInWaypoints.state,
      is_major_stop: rollaInWaypoints.is_major_stop,
      sequence_order: rollaInWaypoints.sequence_order
    });
  }

  const handleDestinationSelect = (destination: Route66Waypoint) => {
    console.log('🏛️ Destination selected from ACTUAL destination cities:', destination.name);
    onDestinationClick(destination);
  };

  if (!map) {
    console.log('⚠️ DestinationCitiesContainer: No map available');
    return null;
  }

  if (isLoading) {
    console.log('⏳ DestinationCitiesContainer: Still loading destination cities');
    return null;
  }

  if (destinationWaypoints.length === 0) {
    console.log('⚠️ DestinationCitiesContainer: No destination cities found');
    return null;
  }

  console.log(`🛡️ Rendering ${destinationWaypoints.length} ACTUAL destination city markers (Rolla should NOT be included)`);

  return (
    <>
      {destinationWaypoints.map((destination) => (
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
