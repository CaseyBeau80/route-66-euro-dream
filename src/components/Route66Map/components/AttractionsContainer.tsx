
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
  
  // Smart filtering with special handling for drive-ins
  const getFilteredAttractions = (zoom: number): Attraction[] => {
    // Separate drive-ins from other attractions
    const driveIns = attractions.filter(attraction => 
      attraction.name.toLowerCase().includes('drive-in')
    );
    const otherAttractions = attractions.filter(attraction => 
      !attraction.name.toLowerCase().includes('drive-in')
    );

    console.log(`🎬 Found ${driveIns.length} drive-in theaters in attractions`);
    driveIns.forEach(driveIn => {
      console.log(`🎬 Drive-in: ${driveIn.name} at ${driveIn.latitude}, ${driveIn.longitude}`);
    });

    if (zoom >= 8) {
      // High zoom: show all attractions including drive-ins
      return [...driveIns, ...otherAttractions];
    } else if (zoom >= 6) {
      // Medium zoom: show all drive-ins + every 2nd other attraction
      return [...driveIns, ...otherAttractions.filter((_, index) => index % 2 === 0)];
    } else {
      // Low zoom: show all drive-ins + every 3rd other attraction
      return [...driveIns, ...otherAttractions.filter((_, index) => index % 3 === 0)];
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
  
  // Log drive-ins specifically
  const driveInsBeingRendered = filteredAttractions.filter(a => a.name.toLowerCase().includes('drive-in'));
  console.log(`🎬 Rendering ${driveInsBeingRendered.length} drive-in theaters:`, 
    driveInsBeingRendered.map(d => d.name)
  );

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
