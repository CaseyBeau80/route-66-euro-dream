
import React, { useState, useEffect } from 'react';
import DestinationCustomMarker from './Destinations/DestinationCustomMarker';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface DestinationCitiesContainerProps {
  map: google.maps.Map;
  waypoints?: Route66Waypoint[]; // Made optional since we fetch our own data
  onDestinationClick?: (destination: Route66Waypoint) => void; // Made optional
}

const DestinationCitiesContainer: React.FC<DestinationCitiesContainerProps> = ({ 
  map, 
  waypoints = [], // Default empty array
  onDestinationClick = () => {} // Default no-op function
}) => {
  const [destinationWaypoints, setDestinationWaypoints] = useState<Route66Waypoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use static destination cities data instead of Supabase
  useEffect(() => {
    console.log('🏛️ Loading static destination cities data...');
    
    // Static destination cities data for Route 66
    const staticDestinations: Route66Waypoint[] = [
      {
        id: '1',
        name: 'Chicago',
        state: 'IL',
        latitude: 41.8781,
        longitude: -87.6298,
        sequence_order: 1,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Beginning of Historic Route 66'
      },
      {
        id: '2',
        name: 'Springfield',
        state: 'IL',
        latitude: 39.8003,
        longitude: -89.6437,
        sequence_order: 2,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Illinois State Capital'
      },
      {
        id: '3',
        name: 'St. Louis',
        state: 'MO',
        latitude: 38.7067,
        longitude: -90.3990,
        sequence_order: 3,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Gateway to the West'
      },
      {
        id: '4',
        name: 'Springfield',
        state: 'MO',
        latitude: 37.2090,
        longitude: -93.2923,
        sequence_order: 4,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Queen City of the Ozarks'
      },
      {
        id: '5',
        name: 'Tulsa',
        state: 'OK',
        latitude: 36.1540,
        longitude: -95.9928,
        sequence_order: 5,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Oil Capital of the World'
      },
      {
        id: '6',
        name: 'Oklahoma City',
        state: 'OK',
        latitude: 35.4676,
        longitude: -97.5164,
        sequence_order: 6,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Oklahoma State Capital'
      },
      {
        id: '7',
        name: 'Amarillo',
        state: 'TX',
        latitude: 35.2220,
        longitude: -101.8313,
        sequence_order: 7,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Heart of the Texas Panhandle'
      },
      {
        id: '8',
        name: 'Santa Fe',
        state: 'NM',
        latitude: 35.6870,
        longitude: -105.9378,
        sequence_order: 8,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'City Different'
      },
      {
        id: '9',
        name: 'Albuquerque',
        state: 'NM',
        latitude: 35.0844,
        longitude: -106.6504,
        sequence_order: 9,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Duke City'
      },
      {
        id: '10',
        name: 'Flagstaff',
        state: 'AZ',
        latitude: 35.1983,
        longitude: -111.6513,
        sequence_order: 10,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Heart of Northern Arizona'
      },
      {
        id: '11',
        name: 'Kingman',
        state: 'AZ',
        latitude: 35.0222,
        longitude: -114.3716,
        sequence_order: 11,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Heart of Historic Route 66'
      },
      {
        id: '12',
        name: 'Barstow',
        state: 'CA',
        latitude: 34.8987,
        longitude: -117.0178,
        sequence_order: 12,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Gateway to the Mojave'
      },
      {
        id: '13',
        name: 'San Bernardino',
        state: 'CA',
        latitude: 34.1066,
        longitude: -117.5931,
        sequence_order: 13,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'Gateway to Southern California'
      },
      {
        id: '14',
        name: 'Los Angeles',
        state: 'CA',
        latitude: 34.0522,
        longitude: -118.2437,
        sequence_order: 14,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'City of Angels'
      },
      {
        id: '15',
        name: 'Santa Monica',
        state: 'CA',
        latitude: 34.0195,
        longitude: -118.4912,
        sequence_order: 15,
        is_major_stop: true,
        highway_designation: 'US-66',
        description: 'End of the Trail'
      }
    ];

    console.log(`✅ Loaded ${staticDestinations.length} static destination cities`);
    staticDestinations.forEach((dest, index) => {
      console.log(`  🏛️ ${index + 1}. ${dest.name} (${dest.state}) - Lat: ${dest.latitude}, Lng: ${dest.longitude}`);
    });

    setDestinationWaypoints(staticDestinations);
    setIsLoading(false);
  }, []);

  console.log(`🏛️ DestinationCitiesContainer: Using static destination cities data`, {
    destinationWaypointsCount: destinationWaypoints.length,
    waypointsCount: waypoints.length,
    mapAvailable: !!map,
    isLoading
  });

  // Enhanced Santa Fe debugging
  const santaFeInDestinations = destinationWaypoints.find(d => 
    d.name.toLowerCase().includes('santa fe') ||
    d.name.toLowerCase().includes('santa_fe')
  );
  
  if (santaFeInDestinations) {
    console.log(`🎯 SANTA FE MARKER READY:`, {
      name: santaFeInDestinations.name,
      state: santaFeInDestinations.state,
      coordinates: `${santaFeInDestinations.latitude}, ${santaFeInDestinations.longitude}`,
      coordinatesValid: !isNaN(santaFeInDestinations.latitude) && !isNaN(santaFeInDestinations.longitude),
      willRenderMarker: !!map && !isLoading
    });
  } else {
    console.error(`❌ SANTA FE NOT FOUND in converted waypoints!`);
  }

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

  console.log(`🛡️ Rendering ${destinationWaypoints.length} ACTUAL destination city markers (Santa Fe should be included)`);

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
