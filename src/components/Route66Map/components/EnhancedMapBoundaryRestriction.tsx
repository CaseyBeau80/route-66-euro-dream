
import { useEffect } from 'react';
import { mapBounds } from '../config/MapConfig';

interface EnhancedMapBoundaryRestrictionProps {
  map: google.maps.Map;
}

const EnhancedMapBoundaryRestriction = ({ map }: EnhancedMapBoundaryRestrictionProps) => {
  useEffect(() => {
    if (!map) return;
    
    console.log('🚧 Setting up enhanced Route 66 corridor boundary restrictions');
    
    // Define the Route 66 corridor boundary with enhanced restrictions
    const route66CorridorBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(mapBounds.south, mapBounds.west),  // SW corner
      new google.maps.LatLng(mapBounds.north, mapBounds.east)   // NE corner
    );
    
    // Apply enhanced bounds restrictions focused on Route 66 states
    map.setOptions({
      restriction: {
        latLngBounds: route66CorridorBounds,
        strictBounds: true  // Strict bounds to prevent excessive panning
      },
      minZoom: 4,  // Prevent zooming out too far
      maxZoom: 12, // Prevent excessive zoom in
      center: { lat: 35.5, lng: -97.5 }, // Center on Route 66 corridor
    });

    // Add bounds change listener to maintain focus
    const boundsChangedListener = map.addListener('bounds_changed', () => {
      const currentBounds = map.getBounds();
      if (currentBounds && !route66CorridorBounds.contains(currentBounds.getCenter())) {
        console.log('🎯 Recentering map to Route 66 corridor');
        map.panTo({ lat: 35.5, lng: -97.5 });
      }
    });

    console.log('✅ Enhanced Route 66 corridor boundary restrictions applied');
    
    // Cleanup
    return () => {
      google.maps.event.removeListener(boundsChangedListener);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default EnhancedMapBoundaryRestriction;
