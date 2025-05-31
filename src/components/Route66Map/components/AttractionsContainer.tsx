
import React from 'react';
import { AttractionsProps, Attraction } from './Attractions/types';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';

const AttractionsContainer: React.FC<AttractionsProps> = ({ 
  map, 
  waypoints, 
  onAttractionClick 
}) => {
  // Filter for regular stops (non-major destinations)
  const attractions: Attraction[] = waypoints.filter(waypoint => !waypoint.is_major_stop);
  
  // Show every 2nd attraction for better performance
  const filteredAttractions = attractions.filter((_, index) => index % 2 === 0);

  console.log(`🎯 Rendering ${filteredAttractions.length} Route 66 attractions with hover cards (filtered from ${attractions.length} total)`);

  const handleWebsiteClick = (website: string) => {
    console.log(`🌐 Opening website: ${website}`);
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {filteredAttractions.map((attraction) => (
        <AttractionCustomMarker
          key={`attraction-marker-${attraction.id}`}
          attraction={attraction}
          map={map}
          onAttractionClick={onAttractionClick}
          onWebsiteClick={handleWebsiteClick}
        />
      ))}
    </>
  );
};

export default AttractionsContainer;
