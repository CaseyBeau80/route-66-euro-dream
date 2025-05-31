
import React, { useState, useEffect } from 'react';
import { AttractionsProps, Attraction } from './Attractions/types';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';

const AttractionsContainer: React.FC<AttractionsProps> = ({ 
  map, 
  waypoints, 
  onAttractionClick 
}) => {
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  
  // Filter for regular stops (non-major destinations)
  const attractions: Attraction[] = waypoints.filter(waypoint => !waypoint.is_major_stop);
  
  // Smart filtering based on zoom level instead of arbitrary filtering
  const getFilteredAttractions = (zoom: number): Attraction[] => {
    if (zoom >= 8) {
      // High zoom: show all attractions
      return attractions;
    } else if (zoom >= 6) {
      // Medium zoom: show every 2nd attraction
      return attractions.filter((_, index) => index % 2 === 0);
    } else {
      // Low zoom: show every 3rd attraction for performance
      return attractions.filter((_, index) => index % 3 === 0);
    }
  };

  const filteredAttractions = getFilteredAttractions(currentZoom);

  // Listen to zoom changes
  useEffect(() => {
    if (!map) return;

    const handleZoomChanged = () => {
      const zoom = map.getZoom() || 6;
      setCurrentZoom(zoom);
    };

    const zoomListener = map.addListener('zoom_changed', handleZoomChanged);
    
    // Set initial zoom
    handleZoomChanged();

    return () => {
      google.maps.event.removeListener(zoomListener);
    };
  }, [map]);

  console.log(`🎯 AttractionsContainer: Rendering ${filteredAttractions.length} Route 66 attractions (zoom: ${currentZoom}, total available: ${attractions.length})`);

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
