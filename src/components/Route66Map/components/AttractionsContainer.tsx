
import React from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';
import { AttractionHoverProvider } from './Attractions/contexts/AttractionHoverContext';

interface AttractionsContainerProps {
  map: google.maps.Map | null;
  selectedState: string | null;
  isVisible?: boolean;
  onAttractionClick?: (attraction: any) => void;
  onWebsiteClick?: (website: string) => void;
}

const AttractionsContainer: React.FC<AttractionsContainerProps> = ({
  map,
  selectedState,
  isVisible = true,
  onAttractionClick,
  onWebsiteClick
}) => {
  const { 
    waypoints: attractions,
    loading,
    error 
  } = useSupabaseRoute66();

  console.log(`🎯 AttractionsContainer: Rendering with ${attractions?.length || 0} attractions`, {
    selectedState,
    isVisible,
    loading,
    error: !!error
  });

  if (!isVisible || !map || loading || error || !attractions?.length) {
    return null;
  }

  // Filter attractions by selected state if applicable
  const filteredAttractions = selectedState 
    ? attractions.filter(attraction => 
        attraction.state?.toLowerCase() === selectedState.toLowerCase()
      )
    : attractions;

  console.log(`🎯 AttractionsContainer: Showing ${filteredAttractions.length} attractions (filtered by state: ${selectedState || 'none'})`);

  return (
    <AttractionHoverProvider>
      {filteredAttractions.map((attraction, index) => (
        <AttractionCustomMarker
          key={`attraction-${attraction.id || index}`}
          attraction={attraction}
          map={map}
          onAttractionClick={onAttractionClick}
          onWebsiteClick={onWebsiteClick}
        />
      ))}
    </AttractionHoverProvider>
  );
};

export default AttractionsContainer;
