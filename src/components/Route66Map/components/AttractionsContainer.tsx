
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';

interface Attraction {
  id: string;
  name: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  website?: string;
  image_url?: string;
  category?: string;
  featured?: boolean;
}

interface AttractionsContainerProps {
  map: google.maps.Map;
  waypoints?: any[]; // Made optional since we fetch our own data
  onAttractionClick?: (attraction: any) => void; // Made optional
}

const AttractionsContainer: React.FC<AttractionsContainerProps> = ({ 
  map, 
  onAttractionClick = () => {} // Default no-op function
}) => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState<number>(6);

  // Use static attractions data instead of Supabase
  useEffect(() => {
    console.log('🎯 Loading static attractions data...');
    
    // Static attractions data for Route 66
    const staticAttractions: Attraction[] = [
      {
        id: '1',
        name: 'Cadillac Ranch',
        city_name: 'Amarillo',
        state: 'TX',
        latitude: 35.2220,
        longitude: -101.9673,
        description: 'Iconic art installation featuring 10 buried Cadillacs',
        category: 'Art Installation',
        featured: true
      },
      {
        id: '2', 
        name: 'Petrified Forest National Park',
        city_name: 'Holbrook',
        state: 'AZ',
        latitude: 35.0819,
        longitude: -109.7877,
        description: 'Ancient petrified wood and painted desert landscapes',
        category: 'National Park',
        featured: true
      },
      {
        id: '3',
        name: 'Santa Monica Pier',
        city_name: 'Santa Monica',
        state: 'CA',
        latitude: 34.0195,
        longitude: -118.4912,
        description: 'Western terminus of Route 66 with amusement park',
        category: 'Landmark',
        featured: true
      },
      {
        id: '4',
        name: 'Gateway Arch',
        city_name: 'St. Louis',
        state: 'MO',
        latitude: 38.6270,
        longitude: -90.1994,
        description: 'Iconic 630-foot stainless steel arch',
        category: 'Monument',
        featured: true
      },
      {
        id: '5',
        name: 'Chain of Rocks Bridge',
        city_name: 'St. Louis',
        state: 'MO',
        latitude: 38.7406,
        longitude: -90.1743,
        description: 'Historic Route 66 bridge with 22-degree bend',
        category: 'Bridge',
        featured: false
      },
      {
        id: '6',
        name: 'Meramec Caverns',
        city_name: 'Stanton',
        state: 'MO',
        latitude: 38.2581,
        longitude: -91.0826,
        description: 'Underground limestone cave system',
        category: 'Natural Wonder',
        featured: false
      },
      {
        id: '7',
        name: 'Blue Whale of Catoosa',
        city_name: 'Catoosa',
        state: 'OK',
        latitude: 36.1878,
        longitude: -95.7489,
        description: 'Giant blue whale sculpture and swimming hole',
        category: 'Roadside Attraction',
        featured: true
      },
      {
        id: '8',
        name: 'Golden Driller',
        city_name: 'Tulsa',
        state: 'OK', 
        latitude: 36.1512,
        longitude: -95.9371,
        description: '75-foot tall statue of an oil worker',
        category: 'Roadside Attraction',
        featured: false
      }
    ];

    console.log(`✅ Loaded ${staticAttractions.length} static attractions`);
    staticAttractions.forEach((attraction, index) => {
      console.log(`  ${index + 1}. "${attraction.name}" in ${attraction.city_name}, ${attraction.state}`);
    });
    
    setAttractions(staticAttractions);
    setLoading(false);
  }, []);
  
  // Simplified zoom handling - no more aggressive debouncing that causes disappearing
  const handleZoomChange = useCallback(() => {
    if (!map) return;
    
    const newZoom = map.getZoom() || 6;
    setCurrentZoom(newZoom);
    
    console.log(`🔍 AttractionsContainer: Zoom changed to ${newZoom}`);
  }, [map]);

  // More relaxed filtering - show more attractions at all zoom levels
  const filteredAttractions = useMemo(() => {
    if (loading) {
      console.log('⏳ AttractionsContainer: Still loading attractions');
      return [];
    }

    let visibleAttractions = attractions;

    // Simplified zoom-based filtering - less aggressive
    if (currentZoom >= 7) {
      // High zoom: show all attractions
      visibleAttractions = attractions;
      console.log(`🎯 HIGH ZOOM (${currentZoom}): Showing ALL ${attractions.length} attractions`);
    } else if (currentZoom >= 5) {
      // Medium zoom: show featured + every other attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 2 === 0
      );
      console.log(`🎯 MEDIUM ZOOM (${currentZoom}): Showing ${visibleAttractions.length} of ${attractions.length} attractions`);
    } else {
      // Low zoom: show featured + every 3rd attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 3 === 0
      );
      console.log(`🎯 LOW ZOOM (${currentZoom}): Showing ${visibleAttractions.length} of ${attractions.length} attractions`);
    }

    // Debug: Check if our specific attractions are in the filtered list
    const waterfalls = visibleAttractions.find(a => a.name.toLowerCase().includes('waterfall'));
    const shoalCreek = visibleAttractions.find(a => a.name.toLowerCase().includes('shoal creek'));
    
    console.log('🔍 FILTERED ATTRACTIONS CHECK:');
    console.log('  The Waterfalls in filtered list:', waterfalls ? 'YES' : 'NO');
    console.log('  Shoal Creek in filtered list:', shoalCreek ? 'YES' : 'NO');

    return visibleAttractions;
  }, [attractions, currentZoom, loading]);

  // Listen to zoom changes - simplified event handling
  useEffect(() => {
    if (!map) return;

    console.log('🎯 AttractionsContainer: Setting up zoom listener');
    
    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    
    // Set initial zoom
    const initialZoom = map.getZoom() || 6;
    setCurrentZoom(initialZoom);
    console.log(`🎯 AttractionsContainer: Initial zoom set to ${initialZoom}`);

    return () => {
      console.log('🧹 AttractionsContainer: Cleaning up zoom listener');
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, handleZoomChange]);

  // Website click handler
  const handleWebsiteClick = useCallback((website: string) => {
    console.log(`🌐 Opening website: ${website}`);
    window.open(website, '_blank', 'noopener,noreferrer');
  }, []);

  // Show loading state briefly but don't hide markers during zoom
  if (loading && attractions.length === 0) {
    console.log('⏳ AttractionsContainer: Initial loading state');
    return null;
  }

  console.log(`🎯 AttractionsContainer: RENDERING ${filteredAttractions.length} attractions (zoom: ${currentZoom}, total: ${attractions.length})`);

  return (
    <>
      {filteredAttractions.map((attraction) => {
        // Debug log for each attraction being rendered
        console.log(`🎯 Rendering attraction marker: "${attraction.name}" at ${attraction.latitude}, ${attraction.longitude}`);
        
        return (
          <AttractionCustomMarker
            key={`attraction-${attraction.id}`}
            attraction={{
              id: attraction.id,
              name: attraction.name,
              latitude: Number(attraction.latitude),
              longitude: Number(attraction.longitude),
              description: attraction.description,
              state: attraction.state,
              city_name: attraction.city_name,
              website: attraction.website, // Include website field
              // Add required Route66Waypoint properties with default values
              sequence_order: 0, // Attractions don't have a sequence order
              is_major_stop: false, // Attractions are not major stops by default
              highway_designation: null // Attractions don't have highway designations
            }}
            map={map}
            onAttractionClick={onAttractionClick}
            onWebsiteClick={handleWebsiteClick}
          />
        );
      })}
    </>
  );
};

export default React.memo(AttractionsContainer);
