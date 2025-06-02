
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
  const markerRef = React.useRef<google.maps.Marker | null>(null);

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

    markerRef.current = marker;

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

    // Trigger jiggle animation using Google Maps animation
    const triggerJiggleAnimation = () => {
      console.log(`🎯 Triggering jiggle animation for gem: ${gem.title}`);
      
      // Method 1: Use Google Maps bounce animation temporarily
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 700);

      // Method 2: Try to find and animate the marker element directly
      setTimeout(() => {
        const mapDiv = map.getDiv();
        
        // Look for all marker images in the map
        const markerImages = mapDiv.querySelectorAll('img[src*="data:image/svg+xml"]');
        console.log(`🔍 Found ${markerImages.length} marker images`);
        
        // Find our specific marker by checking if it's near our position
        const markerPosition = getMarkerScreenPosition();
        if (markerPosition) {
          markerImages.forEach((img, index) => {
            const imgElement = img as HTMLElement;
            const rect = imgElement.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(rect.left - markerPosition.x, 2) + 
              Math.pow(rect.top - markerPosition.y, 2)
            );
            
            // If the image is within 50 pixels of our marker position, animate it
            if (distance < 50) {
              console.log(`🎯 Found matching marker image ${index}, applying jiggle`);
              imgElement.style.animation = 'marker-jiggle 0.8s ease-in-out';
              setTimeout(() => {
                imgElement.style.animation = '';
              }, 800);
            }
          });
        }
      }, 100);
    };

    // Add hover effects to trigger jiggle animation
    const handleMouseOver = () => {
      console.log(`🎯 Mouse over gem: ${gem.title} - triggering jiggle effect`);
      
      triggerJiggleAnimation();

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
