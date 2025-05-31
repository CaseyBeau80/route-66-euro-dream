
import React, { useEffect } from 'react';
import { Attraction } from '../types';
import { useAttractionMarker } from '../hooks/useAttractionMarker';
import { useAttractionMarkerEvents } from '../hooks/useAttractionMarkerEvents';
import { useAttractionHoverContext } from '../contexts/AttractionHoverContext';

interface AttractionMarkerRendererProps {
  attraction: Attraction;
  map: google.maps.Map;
  onAttractionClick?: (attraction: Attraction) => void;
}

const AttractionMarkerRenderer: React.FC<AttractionMarkerRendererProps> = ({
  attraction,
  map,
  onAttractionClick
}) => {
  const { markerRef, listenersRef, markerConfig } = useAttractionMarker(attraction);
  const { activeAttraction } = useAttractionHoverContext();

  // Check if this attraction is currently being hovered
  const isHovered = activeAttraction === attraction.name;

  useEffect(() => {
    if (!map || !attraction) return;

    // Prevent marker recreation if it already exists with same position
    if (markerRef.current) {
      const currentPos = markerRef.current.getPosition();
      if (currentPos && 
          Math.abs(currentPos.lat() - markerConfig.position.lat) < 0.0001 &&
          Math.abs(currentPos.lng() - markerConfig.position.lng) < 0.0001) {
        console.log(`🔒 Marker already exists for ${attraction.name}, skipping recreation`);
        return;
      }
    }

    console.log(`🎯 Creating attraction marker for ${attraction.name}`);

    // Create marker with memoized config
    const marker = new google.maps.Marker({
      position: markerConfig.position,
      map: map,
      icon: markerConfig.icon,
      title: markerConfig.title,
      zIndex: markerConfig.zIndex,
      optimized: markerConfig.optimized
    });

    markerRef.current = marker;

    if (markerConfig.isDriveIn) {
      console.log(`🎬 Drive-in theater marker created: ${attraction.name}`);
    }

    return () => {
      console.log(`🧹 Cleaning up attraction marker: ${attraction.name}`);
      
      // Remove marker from map
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [map, attraction, markerConfig]);

  // Set up marker events
  useAttractionMarkerEvents({
    marker: markerRef.current,
    attraction,
    listenersRef,
    isHovered,
    onAttractionClick
  });

  return null;
};

export default AttractionMarkerRenderer;
