
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AttractionsProps, Attraction } from './Attractions/types';
import AttractionCustomMarker from './Attractions/AttractionCustomMarker';

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

  // TEMPORARILY DISABLE DRIVE-INS to test Route 66 polyline stability
  const filteredAttractions = useMemo(() => {
    // Separate drive-ins from other attractions
    const driveIns = attractions.filter(attraction => 
      attraction.name.toLowerCase().includes('drive-in')
    );
    const otherAttractions = attractions.filter(attraction => 
      !attraction.name.toLowerCase().includes('drive-in')
    );

    console.log(`🎬 TEMPORARILY DISABLED: Found ${driveIns.length} drive-in theaters (not rendering)`);
    console.log(`🚫 Drive-ins disabled for polyline testing:`, driveIns.map(d => d.name));

    // ONLY RENDER NON-DRIVE-IN ATTRACTIONS FOR NOW
    if (currentZoom >= 8) {
      // High zoom: show every other attraction (no drive-ins)
      return otherAttractions.filter((_, index) => index % 2 === 0);
    } else if (currentZoom >= 6) {
      // Medium zoom: show every 3rd attraction (no drive-ins)
      return otherAttractions.filter((_, index) => index % 3 === 0);
    } else {
      // Low zoom: show every 4th attraction (no drive-ins)
      return otherAttractions.filter((_, index) => index % 4 === 0);
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

  console.log(`🎯 AttractionsContainer: Rendering ${filteredAttractions.length} STABLE Route 66 attractions (zoom: ${currentZoom}, total available: ${attractions.length})`);
  console.log(`🚫 DRIVE-INS TEMPORARILY DISABLED for polyline testing`);

  return (
    <>
      {filteredAttractions.map((attraction) => (
        <AttractionCustomMarker
          key={`stable-attraction-${attraction.id}`}
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
