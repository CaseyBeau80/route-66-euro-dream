
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
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
        ;
        
        const { data, error } = await (supabase as any)
          .from('attractions')
          .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation')
          .order('name');

        if (error) {
          console.error('❌ Error fetching attractions:', error);
          return;
        }

        ;
        
        // Debug: Log all attraction names to see what we have
        if (data) {
          ;
          data.forEach((attraction, index) => {
            ;
            ;
          });
          
          // Specifically look for the missing attractions
          const waterfalls = data.find(a => a.name.toLowerCase().includes('waterfall'));
          const shoalCreek = data.find(a => a.name.toLowerCase().includes('shoal creek'));
          
          ;
          ;
          ;
          
          if (waterfalls) {
            ;
          }
          if (shoalCreek) {
            ;
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
    
    ;
  }, [map]);

  // More relaxed filtering - show more attractions at all zoom levels
  const filteredAttractions = useMemo(() => {
    if (loading) {
      ;
      return [];
    }

    let visibleAttractions = attractions;

    // Simplified zoom-based filtering - less aggressive
    if (currentZoom >= 7) {
      // High zoom: show all attractions
      visibleAttractions = attractions;
      ;
    } else if (currentZoom >= 5) {
      // Medium zoom: show featured + every other attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 2 === 0
      );
      ;
    } else {
      // Low zoom: show featured + every 3rd attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 3 === 0
      );
      ;
    }

    // Debug: Check if our specific attractions are in the filtered list
    const waterfalls = visibleAttractions.find(a => a.name.toLowerCase().includes('waterfall'));
    const shoalCreek = visibleAttractions.find(a => a.name.toLowerCase().includes('shoal creek'));
    
    ;
    ;
    ;

    return visibleAttractions;
  }, [attractions, currentZoom, loading]);

  // Listen to zoom changes - simplified event handling
  useEffect(() => {
    if (!map) return;

    ;
    
    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    
    // Set initial zoom
    const initialZoom = map.getZoom() || 6;
    setCurrentZoom(initialZoom);
    ;

    return () => {
      ;
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, handleZoomChange]);

  // Website click handler
  const handleWebsiteClick = useCallback((website: string) => {
    ;
    window.open(website, '_blank', 'noopener,noreferrer');
  }, []);

  // Show loading state briefly but don't hide markers during zoom
  if (loading && attractions.length === 0) {
    ;
    return null;
  }

  ;

  return (
    <>
      {filteredAttractions.map((attraction) => {
        // Debug log for each attraction being rendered
        ;
        
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
