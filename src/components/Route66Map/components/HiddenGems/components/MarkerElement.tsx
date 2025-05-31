
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

    // Create the visual marker
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: createVintageRoute66Icon(),
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    // Function to update hover card position
    const updatePosition = () => {
      const projection = map.getProjection();
      if (projection) {
        const point = projection.fromLatLngToPoint(marker.getPosition()!);
        const scale = Math.pow(2, map.getZoom());
        const pixelPosition = new google.maps.Point(
          point.x * scale,
          point.y * scale
        );
        
        // Convert to screen coordinates
        const bounds = map.getBounds();
        const ne = bounds?.getNorthEast();
        const sw = bounds?.getSouthWest();
        
        if (ne && sw) {
          const mapDiv = map.getDiv();
          const mapWidth = mapDiv.offsetWidth;
          const mapHeight = mapDiv.offsetHeight;
          
          const x = ((Number(gem.longitude) - sw.lng()) / (ne.lng() - sw.lng())) * mapWidth;
          const y = ((ne.lat() - Number(gem.latitude)) / (ne.lat() - sw.lat())) * mapHeight;
          
          onPositionUpdate(x, y);
        }
      }
    };

    // Add mouse event listeners to the marker
    marker.addListener('mouseover', () => {
      console.log(`🎯 Mouse over gem: ${gem.title}`);
      updatePosition();
      onMouseEnter();
    });

    marker.addListener('mouseout', () => {
      console.log(`🎯 Mouse out gem: ${gem.title}`);
      onMouseLeave();
    });

    // Update position when map changes
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
