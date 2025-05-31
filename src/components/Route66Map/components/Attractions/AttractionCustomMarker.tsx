
import React, { useEffect, useRef, useState } from 'react';
import { useAttractionHover } from './hooks/useAttractionHover';
import AttractionHoverCard from './AttractionHoverCard';
import type { Route66Waypoint } from '../../types/supabaseTypes';

interface AttractionCustomMarkerProps {
  map: google.maps.Map;
  attraction: Route66Waypoint;
  onAttractionClick: (attraction: Route66Waypoint) => void;
  onWebsiteClick?: (website: string) => void;
}

const AttractionCustomMarker: React.FC<AttractionCustomMarkerProps> = ({
  map,
  attraction,
  onAttractionClick,
  onWebsiteClick
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isMarkerReady, setIsMarkerReady] = useState(false);

  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useAttractionHover();

  // Create marker element
  useEffect(() => {
    if (!map || markerRef.current) return;

    console.log('🎯 Creating attraction marker for:', attraction.name);

    try {
      // Use regular marker with custom icon
      const marker = new google.maps.Marker({
        map,
        position: {
          lat: Number(attraction.latitude),
          lng: Number(attraction.longitude)
        },
        title: attraction.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#dc2626',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });

      markerRef.current = marker;
      setIsMarkerReady(true);

      console.log('✅ Regular attraction marker created successfully for:', attraction.name);

    } catch (error) {
      console.error('❌ Error creating attraction marker:', error);
    }

    return () => {
      cleanup();
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setIsMarkerReady(false);
    };
  }, [map, attraction, cleanup]);

  // Add event listeners when marker is ready
  useEffect(() => {
    if (!isMarkerReady || !markerRef.current) return;

    const marker = markerRef.current;

    const handleMouseOverEvent = (e: google.maps.MapMouseEvent) => {
      console.log('🖱️ Mouse over attraction:', attraction.name);
      if (e.domEvent && e.domEvent.target) {
        const rect = (e.domEvent.target as HTMLElement).getBoundingClientRect();
        updatePosition(rect.left + rect.width / 2, rect.top);
      }
      handleMouseEnter(attraction.name);
    };

    const handleMouseOutEvent = () => {
      console.log('🖱️ Mouse out attraction:', attraction.name);
      handleMouseLeave(attraction.name);
    };

    const handleClickEvent = () => {
      console.log('🖱️ Click attraction:', attraction.name);
      onAttractionClick(attraction);
    };

    marker.addListener('mouseover', handleMouseOverEvent);
    marker.addListener('mouseout', handleMouseOutEvent);
    marker.addListener('click', handleClickEvent);

    return () => {
      google.maps.event.clearInstanceListeners(marker);
    };
  }, [isMarkerReady, attraction, handleMouseEnter, handleMouseLeave, updatePosition, onAttractionClick]);

  if (!isMarkerReady) {
    return null;
  }

  return (
    <AttractionHoverCard
      attraction={attraction}
      isVisible={isHovered}
      position={hoverPosition}
      onWebsiteClick={onWebsiteClick || ((website) => {
        console.log('🌐 Opening attraction website:', website);
        window.open(website, '_blank', 'noopener,noreferrer');
      })}
    />
  );
};

export default AttractionCustomMarker;
