
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAttractionHover } from './hooks/useAttractionHover';
import AttractionHoverPortal from './AttractionHoverPortal';
import AttractionClickableCard from './AttractionClickableCard';
import { MarkerAnimationUtils } from '../../utils/markerAnimationUtils';
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

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered attraction hover card for: ${attraction.name} - keeping card visible`);
    handleMouseEnter(attraction.name);
  }, [handleMouseEnter, attraction.name]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left attraction hover card for: ${attraction.name} - starting hide delay`);
    handleMouseLeave(attraction.name);
  }, [handleMouseLeave, attraction.name]);

  // Create marker element - NO INFO WINDOWS
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
        // Clear all event listeners and info windows
        google.maps.event.clearInstanceListeners(markerRef.current);
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setIsMarkerReady(false);
    };
  }, [map, attraction, cleanup]);

  // Add event listeners - NO INFO WINDOWS, ONLY HOVER AND CLICK CARDS
  useEffect(() => {
    if (!isMarkerReady || !markerRef.current) return;

    const marker = markerRef.current;

    const handleMouseOverEvent = (e: google.maps.MapMouseEvent) => {
      if (!isClicked) { // Only show hover if not clicked
        console.log('🖱️ Mouse over attraction:', attraction.name, '- triggering enhanced jiggle');
        
        // Use enhanced jiggle animation
        MarkerAnimationUtils.triggerEnhancedJiggle(marker, attraction.name);

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

    // Add event listeners - NO INFO WINDOW CREATION
    marker.addListener('mouseover', handleMouseOverEvent);
    marker.addListener('mouseout', handleMouseOutEvent);
    marker.addListener('click', handleClickEvent);

    return () => {
      // Clean up all event listeners
      google.maps.event.clearInstanceListeners(marker);
    };
  }, [isMarkerReady, attraction, handleMouseEnter, handleMouseLeave, updatePosition, onAttractionClick, isClicked]);

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
        <AttractionHoverPortal
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick || ((website) => {
            console.log('🌐 Opening attraction website:', website);
            window.open(website, '_blank', 'noopener,noreferrer');
          })}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
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
