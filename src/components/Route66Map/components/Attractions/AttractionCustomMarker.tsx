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
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
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
    if (!map || !google.maps.marker || markerRef.current) return;

    console.log('🎯 Creating attraction marker for:', attraction.name);

    try {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'attraction-marker';
      markerElement.innerHTML = `
        <div style="
          width: 28px;
          height: 28px;
          background-color: #dc2626;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          font-weight: bold;
          position: relative;
        ">
          🎯
        </div>
      `;

      overlayRef.current = markerElement;

      // Create the advanced marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: {
          lat: Number(attraction.latitude),
          lng: Number(attraction.longitude)
        },
        content: markerElement,
        title: attraction.name
      });

      markerRef.current = marker;
      setIsMarkerReady(true);

      console.log('✅ Attraction marker created successfully for:', attraction.name);

    } catch (error) {
      console.error('❌ Error creating attraction marker:', error);
    }

    return () => {
      cleanup();
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      setIsMarkerReady(false);
    };
  }, [map, attraction, cleanup]);

  // Add event listeners when marker is ready
  useEffect(() => {
    if (!isMarkerReady || !markerRef.current || !overlayRef.current) return;

    const element = overlayRef.current;

    const handleMouseEnterEvent = (e: MouseEvent) => {
      console.log('🖱️ Mouse enter attraction:', attraction.name);
      const rect = element.getBoundingClientRect();
      updatePosition(rect.left + rect.width / 2, rect.top);
      handleMouseEnter(attraction.name);
    };

    const handleMouseLeaveEvent = () => {
      console.log('🖱️ Mouse leave attraction:', attraction.name);
      handleMouseLeave(attraction.name);
    };

    const handleClickEvent = () => {
      console.log('🖱️ Click attraction:', attraction.name);
      onAttractionClick(attraction);
    };

    element.addEventListener('mouseenter', handleMouseEnterEvent);
    element.addEventListener('mouseleave', handleMouseLeaveEvent);
    element.addEventListener('click', handleClickEvent);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnterEvent);
      element.removeEventListener('mouseleave', handleMouseLeaveEvent);
      element.removeEventListener('click', handleClickEvent);
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
