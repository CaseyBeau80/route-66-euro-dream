
import React, { useCallback } from 'react';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';
import { useAttractions } from '@/hooks/useAttractions';
import { useMapZoom } from '@/hooks/useMapZoom';
import { filterAttractionsByZoom } from '@/utils/attractionFilters';
import type { AttractionsContainerProps } from '../types/attractions';

const AttractionsContainer: React.FC<AttractionsContainerProps> = ({ 
  map, 
  onAttractionClick = () => {} // Default no-op function
}) => {
  const { attractions, loading } = useAttractions();
  const currentZoom = useMapZoom(map);
  
  const filteredAttractions = filterAttractionsByZoom(attractions, currentZoom, loading);

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
