
import React, { useEffect, useRef, useState } from 'react';
import { useAttractionHover } from './hooks/useAttractionHover';
import AttractionHoverCard from './AttractionHoverCard';
import AttractionClickableCard from './AttractionClickableCard';
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
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

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

      console.log('✅ Attraction marker created successfully for:', attraction.name);

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
      if (!isClicked) { // Only show hover if not clicked
        console.log('🖱️ Mouse over attraction:', attraction.name, '- triggering jiggle');
        
        // Add jiggle effect to marker
        const mapDiv = map.getDiv();
        const markerElements = mapDiv.querySelectorAll('[style*="cursor: pointer"]');
        markerElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.animation = 'marker-jiggle 0.8s ease-in-out';
          setTimeout(() => {
            htmlElement.style.animation = '';
          }, 800);
        });

        if (e.domEvent && e.domEvent.target) {
          const rect = (e.domEvent.target as HTMLElement).getBoundingClientRect();
          updatePosition(rect.left + rect.width / 2, rect.top);
        }
        handleMouseEnter(attraction.name);
      }
    };

    const handleMouseOutEvent = () => {
      if (!isClicked) { // Only hide hover if not clicked
        console.log('🖱️ Mouse out attraction:', attraction.name);
        handleMouseLeave(attraction.name);
      }
    };

    const handleClickEvent = (e: google.maps.MapMouseEvent) => {
      console.log('🖱️ Click attraction:', attraction.name);
      
      // Calculate click position
      if (e.domEvent) {
        const rect = (e.domEvent.target as HTMLElement).getBoundingClientRect();
        setClickPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
      
      setIsClicked(true);
      handleMouseLeave(attraction.name); // Hide hover card
      onAttractionClick(attraction);
    };

    marker.addListener('mouseover', handleMouseOverEvent);
    marker.addListener('mouseout', handleMouseOutEvent);
    marker.addListener('click', handleClickEvent);

    return () => {
      google.maps.event.clearInstanceListeners(marker);
    };
  }, [isMarkerReady, attraction, handleMouseEnter, handleMouseLeave, updatePosition, onAttractionClick, isClicked, map]);

  const handleCloseClickableCard = () => {
    setIsClicked(false);
  };

  if (!isMarkerReady) {
    return null;
  }

  return (
    <>
      {/* Hover card - only show when hovering and not clicked */}
      {!isClicked && (
        <AttractionHoverCard
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick || ((website) => {
            console.log('🌐 Opening attraction website:', website);
            window.open(website, '_blank', 'noopener,noreferrer');
          })}
        />
      )}

      {/* Clickable card - show when clicked */}
      <AttractionClickableCard
        attraction={attraction}
        isVisible={isClicked}
        position={clickPosition}
        onClose={handleCloseClickableCard}
        onWebsiteClick={onWebsiteClick || ((website) => {
          console.log('🌐 Opening attraction website:', website);
          window.open(website, '_blank', 'noopener,noreferrer');
        })}
      />
    </>
  );
};

export default AttractionCustomMarker;
