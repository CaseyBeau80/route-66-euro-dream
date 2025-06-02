
import React from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';

interface MarkerElementProps {
  gem: HiddenGem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPositionUpdate: (x: number, y: number) => void;
  map: google.maps.Map;
}

const MarkerElement: React.FC<MarkerElementProps> = ({
  gem,
  onMouseEnter,
  onMouseLeave,
  onPositionUpdate,
  map
}) => {
  React.useEffect(() => {
    if (!map) return;

    // Create the visual marker with jiggle effect
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: createVintageRoute66Icon(),
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    // Create a custom HTML overlay for hover effects
    const markerOverlay = document.createElement('div');
    markerOverlay.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      cursor: pointer;
      z-index: 999999;
      background: transparent;
      border-radius: 50%;
      transition: transform 0.2s ease;
    `;

    // Function to get marker screen position
    const getMarkerScreenPosition = () => {
      const projection = map.getProjection();
      if (!projection) return null;

      const position = marker.getPosition();
      if (!position) return null;

      // Get the map div
      const mapDiv = map.getDiv();
      const mapRect = mapDiv.getBoundingClientRect();

      // Convert lat/lng to pixel coordinates
      const point = projection.fromLatLngToPoint(position);
      const scale = Math.pow(2, map.getZoom());
      
      // Get map bounds to calculate relative position
      const bounds = map.getBounds();
      if (!bounds) return null;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Calculate relative position within the map
      const x = ((position.lng() - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
      const y = ((ne.lat() - position.lat()) / (ne.lat() - sw.lat())) * mapRect.height;

      // Add map's position on the page
      return {
        x: mapRect.left + x,
        y: mapRect.top + y
      };
    };

    // Add hover effects to trigger jiggle animation
    const handleMouseOver = () => {
      console.log(`🎯 Mouse over gem: ${gem.title} - triggering jiggle effect`);
      
      // Get the map div container
      const mapDiv = map.getDiv();
      
      // Apply jiggle animation to the marker
      const markerImg = mapDiv.querySelector(`img[src*="${encodeURIComponent('ROUTE')}"]`);
      if (markerImg) {
        markerImg.classList.add('animate-marker-jiggle');
        setTimeout(() => {
          markerImg.classList.remove('animate-marker-jiggle');
        }, 800);
      }

      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        onPositionUpdate(screenPos.x, screenPos.y);
        onMouseEnter();
      }
    };

    const handleMouseOut = () => {
      console.log(`🎯 Mouse out gem: ${gem.title}`);
      onMouseLeave();
    };

    // Add mouse event listeners to the marker
    marker.addListener('mouseover', handleMouseOver);
    marker.addListener('mouseout', handleMouseOut);

    // Update position when map changes
    const updatePosition = () => {
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        onPositionUpdate(screenPos.x, screenPos.y);
      }
    };

    const boundsListener = map.addListener('bounds_changed', updatePosition);
    const zoomListener = map.addListener('zoom_changed', updatePosition);

    // Initial position update
    setTimeout(updatePosition, 100);

    return () => {
      marker.setMap(null);
      google.maps.event.removeListener(boundsListener);
      google.maps.event.removeListener(zoomListener);
    };
  }, [gem, map, onMouseEnter, onMouseLeave, onPositionUpdate]);

  return null;
};

export default MarkerElement;
