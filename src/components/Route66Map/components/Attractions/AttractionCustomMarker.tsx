
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
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isMarkerReady, setIsMarkerReady] = useState(false);
  const [isAdvancedMarker, setIsAdvancedMarker] = useState(false);

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
      // First try to create an Advanced Marker if available
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        console.log('📍 Using Advanced Marker for attraction:', attraction.name);
        
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
        setIsAdvancedMarker(true);
        setIsMarkerReady(true);

        console.log('✅ Advanced attraction marker created successfully for:', attraction.name);

      } else {
        console.log('📍 Using regular Marker for attraction (Advanced Markers not available):', attraction.name);
        
        // Fallback to regular marker
        const marker = new google.maps.Marker({
          map,
          position: {
            lat: Number(attraction.latitude),
            lng: Number(attraction.longitude)
          },
          title: attraction.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#dc2626',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3
          }
        });

        markerRef.current = marker;
        setIsAdvancedMarker(false);
        setIsMarkerReady(true);

        console.log('✅ Regular attraction marker created successfully for:', attraction.name);
      }

    } catch (error) {
      console.error('❌ Error creating attraction marker:', error);
    }

    return () => {
      cleanup();
      if (markerRef.current) {
        if (isAdvancedMarker) {
          (markerRef.current as google.maps.marker.AdvancedMarkerElement).map = null;
        } else {
          (markerRef.current as google.maps.Marker).setMap(null);
        }
        markerRef.current = null;
      }
      setIsMarkerReady(false);
    };
  }, [map, attraction, cleanup, isAdvancedMarker]);

  // Add event listeners when marker is ready
  useEffect(() => {
    if (!isMarkerReady || !markerRef.current) return;

    let element: HTMLElement | null = null;

    if (isAdvancedMarker && overlayRef.current) {
      element = overlayRef.current;
    } else if (!isAdvancedMarker) {
      // For regular markers, we need to handle events differently
      const marker = markerRef.current as google.maps.Marker;
      
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
    }

    if (element) {
      const handleMouseEnterEvent = (e: MouseEvent) => {
        console.log('🖱️ Mouse enter attraction:', attraction.name);
        const rect = element!.getBoundingClientRect();
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
        element!.removeEventListener('mouseenter', handleMouseEnterEvent);
        element!.removeEventListener('mouseleave', handleMouseLeaveEvent);
        element!.removeEventListener('click', handleClickEvent);
      };
    }
  }, [isMarkerReady, attraction, handleMouseEnter, handleMouseLeave, updatePosition, onAttractionClick, isAdvancedMarker]);

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
