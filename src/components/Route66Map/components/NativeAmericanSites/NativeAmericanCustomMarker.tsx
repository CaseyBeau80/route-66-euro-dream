
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NativeAmericanSite } from './types';
import { NativeAmericanIconCreator } from '../RouteMarkers/NativeAmericanIconCreator';
import NativeAmericanHoverCard from './NativeAmericanHoverCard';
import NativeAmericanClickableCard from './NativeAmericanClickableCard';

interface NativeAmericanCustomMarkerProps {
  site: NativeAmericanSite;
  onMarkerClick?: (site: NativeAmericanSite) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const NativeAmericanCustomMarker: React.FC<NativeAmericanCustomMarkerProps> = ({
  site,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getMarkerScreenPosition = useCallback(() => {
    if (!markerRef.current || !map) return { x: 0, y: 0 };
    
    const position = markerRef.current.getPosition();
    if (!position) return { x: 0, y: 0 };
    
    const projection = map.getProjection();
    if (!projection) return { x: 0, y: 0 };
    
    const bounds = map.getBounds();
    if (!bounds) return { x: 0, y: 0 };
    
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const point = projection.fromLatLngToPoint(position);
    
    if (!topRight || !bottomLeft || !point) return { x: 0, y: 0 };
    
    const scale = Math.pow(2, map.getZoom() || 0);
    const mapDiv = map.getDiv();
    const mapRect = mapDiv.getBoundingClientRect();
    
    const x = mapRect.left + (point.x - bottomLeft.x) * scale;
    const y = mapRect.top + (point.y - topRight.y) * scale;
    
    return { x, y };
  }, [map]);

  useEffect(() => {
    if (!map || markerRef.current) return;

    // Validate coordinates
    const lat = site.latitude;
    const lng = site.longitude;
    
    if (!lat || !lng || lat === 0 || lng === 0) {
      console.warn(`🪶 Invalid coordinates for ${site.name}`);
      return;
    }

    console.log(`🪶 Creating marker for: ${site.name} at ${lat}, ${lng}`);

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: NativeAmericanIconCreator.createNativeAmericanIcon(false),
      title: NativeAmericanIconCreator.createNativeAmericanTitle(site.name, site.tribe_nation),
      zIndex: NativeAmericanIconCreator.getNativeAmericanZIndex(),
      optimized: true
    });

    markerRef.current = marker;

    // Mouse enter handler
    marker.addListener('mouseover', () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      const pos = getMarkerScreenPosition();
      setHoverPosition(pos);
      setIsHovered(true);
    });

    // Mouse leave handler
    marker.addListener('mouseout', () => {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    });

    // Click handler
    marker.addListener('click', () => {
      const pos = getMarkerScreenPosition();
      setClickPosition(pos);
      setIsClicked(true);
      setIsHovered(false);
      
      if (onMarkerClick) {
        onMarkerClick(site);
      }
    });

    // Update icon on zoom change
    const zoomListener = map.addListener('zoom_changed', () => {
      const currentZoom = map.getZoom() || 8;
      const isCloseZoom = currentZoom >= 9;
      marker.setIcon(NativeAmericanIconCreator.createNativeAmericanIcon(isCloseZoom));
    });

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      google.maps.event.removeListener(zoomListener);
      marker.setMap(null);
      markerRef.current = null;
    };
  }, [map, site, onMarkerClick, getMarkerScreenPosition]);

  const handleClose = useCallback(() => {
    setIsClicked(false);
  }, []);

  const handleWebsiteClick = useCallback((website: string) => {
    onWebsiteClick(website);
  }, [onWebsiteClick]);

  return (
    <>
      {/* Hover card */}
      <NativeAmericanHoverCard
        site={site}
        isVisible={isHovered && !isClicked}
        position={hoverPosition}
      />
      
      {/* Clickable card */}
      <NativeAmericanClickableCard
        site={site}
        isVisible={isClicked}
        position={clickPosition}
        onClose={handleClose}
        onWebsiteClick={handleWebsiteClick}
      />
    </>
  );
};

export default NativeAmericanCustomMarker;
