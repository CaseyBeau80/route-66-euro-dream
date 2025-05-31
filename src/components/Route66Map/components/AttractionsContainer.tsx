
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AttractionsProps, Attraction } from './Attractions/types';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';
import { DestinationCityProtectionService } from '../services/DestinationCityProtectionService';

const AttractionsContainer: React.FC<AttractionsProps> = ({ 
  map, 
  waypoints, 
  onAttractionClick 
}) => {
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [isZoomStable, setIsZoomStable] = useState(true);
  
  // Filter for regular stops (non-major destinations)
  const attractions: Attraction[] = useMemo(() => 
    waypoints.filter(waypoint => !waypoint.is_major_stop),
    [waypoints]
  );
  
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

  // ALL ATTRACTIONS NOW ENABLED - including drive-ins for full Route 66 experience
  const filteredAttractions = useMemo(() => {
    // Show all attractions with enhanced clustering protection
    const allAttractions = attractions;

    console.log(`🎯 AttractionsContainer: All attractions enabled (${allAttractions.length} total)`);
    console.log(`🎬 Drive-ins re-enabled for full Route 66 experience`);

    if (currentZoom >= 8) {
      // High zoom: show all attractions
      return allAttractions;
    } else if (currentZoom >= 6) {
      // Medium zoom: show every other attraction
      return allAttractions.filter((_, index) => index % 2 === 0);
    } else {
      // Low zoom: show every 3rd attraction
      return allAttractions.filter((_, index) => index % 3 === 0);
    }
  }, [attractions, currentZoom]);

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
  if (!isZoomStable) {
    return null;
  }

  console.log(`🎯 AttractionsContainer: Rendering ${filteredAttractions.length} Route 66 attractions (zoom: ${currentZoom}, total available: ${attractions.length})`);
  console.log(`🛡️ Enhanced clustering protection active for destination cities`);

  return (
    <>
      {filteredAttractions.map((attraction) => (
        <AttractionCustomMarker
          key={`attraction-${attraction.id}`}
          attraction={attraction}
          map={map}
          onAttractionClick={onAttractionClick}
          onWebsiteClick={handleWebsiteClick}
        />
      ))}
    </>
  );
};

export default React.memo(AttractionsContainer);
