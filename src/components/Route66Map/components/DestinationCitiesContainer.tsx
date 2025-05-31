
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import DestinationCustomMarker from './Destinations/DestinationCustomMarker';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { generateCityUrl } from '@/utils/cityUrlUtils';

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
  const navigate = useNavigate();

  // Filter for major stops only (destinations)
  const destinations = waypoints.filter(waypoint => waypoint.is_major_stop);

  const handleDestinationSelect = (destination: Route66Waypoint) => {
    console.log('🏛️ Destination selected:', destination.name);
    
    // Call the original click handler
    onDestinationClick(destination);
    
    // Navigate to city page if it's a major stop
    if (destination.is_major_stop) {
      const cityUrl = generateCityUrl(destination);
      navigate(cityUrl);
    }
  };

  console.log(`🏛️ Rendering ${destinations.length} Route 66 destination cities`);

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
