
import React from 'react';
import { mapBounds } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({ map }) => {
  // Create a rectangle overlay for areas outside Route 66 corridor
  // This adds a semi-transparent overlay to de-emphasize areas outside the corridor
  const addOverlays = () => {
    // North overlay (Canada)
    new google.maps.Rectangle({
      bounds: {
        north: 90,
        south: mapBounds.north,
        east: 180,
        west: -180
      },
      map: map,
      fillColor: "#8E9196",
      fillOpacity: 0.2,
      strokeWeight: 0,
      clickable: false
    });
    
    // South overlay (Mexico and below)
    new google.maps.Rectangle({
      bounds: {
        north: mapBounds.south,
        south: -90,
        east: 180,
        west: -180
      },
      map: map,
      fillColor: "#8E9196",
      fillOpacity: 0.2,
      strokeWeight: 0,
      clickable: false
    });
    
    // East overlay
    new google.maps.Rectangle({
      bounds: {
        north: mapBounds.north,
        south: mapBounds.south,
        east: 180,
        west: mapBounds.east
      },
      map: map,
      fillColor: "#8E9196",
      fillOpacity: 0.2,
      strokeWeight: 0,
      clickable: false
    });
    
    // West overlay
    new google.maps.Rectangle({
      bounds: {
        north: mapBounds.north,
        south: mapBounds.south,
        east: mapBounds.west,
        west: -180
      },
      map: map,
      fillColor: "#8E9196",
      fillOpacity: 0.2,
      strokeWeight: 0,
      clickable: false
    });
  };

  React.useEffect(() => {
    if (map) {
      addOverlays();
    }
  }, [map]);

  return null; // This component doesn't render anything visible directly
};

export default MapOverlays;
