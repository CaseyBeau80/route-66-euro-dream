
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

  // Enhanced filtering to show ALL drive-ins and attractions
  const filteredAttractions = useMemo(() => {
    // Separate drive-ins and regular attractions with broader detection
    const driveIns = attractions.filter(attraction => {
      const name = attraction.name.toLowerCase();
      const desc = attraction.description?.toLowerCase() || '';
      return name.includes('drive-in') || 
             name.includes('drive in') ||
             name.includes('theater') ||
             name.includes('theatre') ||
             desc.includes('drive-in') ||
             desc.includes('drive in') ||
             desc.includes('theater') ||
             desc.includes('theatre');
    });
    
    const regularAttractions = attractions.filter(attraction => {
      const name = attraction.name.toLowerCase();
      const desc = attraction.description?.toLowerCase() || '';
      return !(name.includes('drive-in') || 
               name.includes('drive in') ||
               name.includes('theater') ||
               name.includes('theatre') ||
               desc.includes('drive-in') ||
               desc.includes('drive in') ||
               desc.includes('theater') ||
               desc.includes('theatre'));
    });

    console.log(`🎬 Found ${driveIns.length} drive-in theaters in waypoint attractions:`, driveIns.map(d => d.name));
    console.log(`🎯 Found ${regularAttractions.length} regular attractions`);

    // Always show ALL drive-ins regardless of zoom level (they're special!)
    let visibleAttractions = [...driveIns];

    // Add regular attractions based on zoom level
    if (currentZoom >= 8) {
      // High zoom: show all regular attractions
      visibleAttractions.push(...regularAttractions);
    } else if (currentZoom >= 6) {
      // Medium zoom: show every other regular attraction
      visibleAttractions.push(...regularAttractions.filter((_, index) => index % 2 === 0));
    } else {
      // Low zoom: show every 3rd regular attraction
      visibleAttractions.push(...regularAttractions.filter((_, index) => index % 3 === 0));
    }

    console.log(`🎯 AttractionsContainer: Showing ${visibleAttractions.length} total attractions (${driveIns.length} drive-ins always visible, zoom: ${currentZoom})`);

    return visibleAttractions;
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

  console.log(`🎯 AttractionsContainer: Rendering ${filteredAttractions.length} Route 66 attractions with ALL drive-ins visible (total available: ${attractions.length})`);

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
