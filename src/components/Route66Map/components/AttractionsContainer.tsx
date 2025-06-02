
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
  waypoints: any[]; // Keep for compatibility but won't use
  onAttractionClick: (attraction: any) => void;
}

const AttractionsContainer: React.FC<AttractionsContainerProps> = ({ 
  map, 
  onAttractionClick 
}) => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [isZoomStable, setIsZoomStable] = useState(true);

  // Fetch attractions from the attractions table
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('🎯 Fetching attractions from attractions table...');
        
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .order('name');

        if (error) {
          console.error('❌ Error fetching attractions:', error);
          return;
        }

        console.log(`✅ Fetched ${data?.length || 0} attractions from database`);
        setAttractions(data || []);
      } catch (error) {
        console.error('❌ Error in fetchAttractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);
  
  // Debounced zoom handling to prevent excessive re-renders
  const handleZoomChange = useCallback(() => {
    if (!map) return;
    
    setIsZoomStable(false);
    const newZoom = map.getZoom() || 6;
    
    // Debounce zoom updates
    const timeoutId = setTimeout(() => {
      setCurrentZoom(newZoom);
      setIsZoomStable(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [map]);

  // Enhanced filtering based on zoom level
  const filteredAttractions = useMemo(() => {
    if (loading) return [];

    // Show more attractions at higher zoom levels
    let visibleAttractions = attractions;

    if (currentZoom >= 8) {
      // High zoom: show all attractions
      visibleAttractions = attractions;
    } else if (currentZoom >= 6) {
      // Medium zoom: show featured attractions and every other attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 2 === 0
      );
    } else {
      // Low zoom: show only featured attractions or every 3rd attraction
      visibleAttractions = attractions.filter((attraction, index) => 
        attraction.featured || index % 3 === 0
      );
    }

    console.log(`🎯 AttractionsContainer: Showing ${visibleAttractions.length} attractions (zoom: ${currentZoom}, total: ${attractions.length})`);

    return visibleAttractions;
  }, [attractions, currentZoom, loading]);

  // Listen to zoom changes with debouncing
  useEffect(() => {
    if (!map) return;

    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    
    // Set initial zoom
    const initialZoom = map.getZoom() || 6;
    setCurrentZoom(initialZoom);

    return () => {
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, handleZoomChange]);

  // Website click handler
  const handleWebsiteClick = useCallback((website: string) => {
    console.log(`🌐 Opening website: ${website}`);
    window.open(website, '_blank', 'noopener,noreferrer');
  }, []);

  // Don't render markers during zoom transitions for better performance
  if (!isZoomStable || loading) {
    return null;
  }

  console.log(`🎯 AttractionsContainer: Rendering ${filteredAttractions.length} attractions from attractions table`);

  return (
    <>
      {filteredAttractions.map((attraction) => (
        <AttractionCustomMarker
          key={`attraction-${attraction.id}`}
          attraction={{
            id: attraction.id,
            name: attraction.name,
            latitude: Number(attraction.latitude),
            longitude: Number(attraction.longitude),
            description: attraction.description,
            website: attraction.website,
            state: attraction.state,
            city_name: attraction.city_name
          }}
          map={map}
          onAttractionClick={onAttractionClick}
          onWebsiteClick={handleWebsiteClick}
        />
      ))}
    </>
  );
};

export default React.memo(AttractionsContainer);
