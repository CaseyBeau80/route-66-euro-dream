
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Fetch attractions from the attractions table
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('🎯 Fetching attractions from attractions table...');
        
        const { data, error } = await (supabase as any)
          .from('attractions')
          .select('*')
          .order('name');

        if (error) {
          console.error('❌ Error fetching attractions:', error);
          return;
        }

        console.log(`✅ Fetched ${data?.length || 0} attractions from database`);
        
        // Debug: Log all attraction names to see what we have
        if (data) {
          console.log('🔍 ALL ATTRACTIONS IN DATABASE:');
          data.forEach((attraction, index) => {
            console.log(`  ${index + 1}. "${attraction.name}" in ${attraction.city_name}, ${attraction.state}`);
            console.log(`     Coordinates: ${attraction.latitude}, ${attraction.longitude}`);
          });
          
          // Specifically look for the missing attractions
          const waterfalls = data.find(a => a.name.toLowerCase().includes('waterfall'));
          const shoalCreek = data.find(a => a.name.toLowerCase().includes('shoal creek'));
          
          console.log('🔍 LOOKING FOR SPECIFIC ATTRACTIONS:');
          console.log('  The Waterfalls:', waterfalls ? `FOUND - ${waterfalls.name}` : 'NOT FOUND');
          console.log('  Shoal Creek Overlook:', shoalCreek ? `FOUND - ${shoalCreek.name}` : 'NOT FOUND');
          
          if (waterfalls) {
            console.log(`    Waterfalls details: lat=${waterfalls.latitude}, lng=${waterfalls.longitude}, city=${waterfalls.city_name}`);
          }
          if (shoalCreek) {
            console.log(`    Shoal Creek details: lat=${shoalCreek.latitude}, lng=${shoalCreek.longitude}, city=${shoalCreek.city_name}`);
          }
        }
        
        setAttractions(data || []);
      } catch (error) {
        console.error('❌ Error in fetchAttractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
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
