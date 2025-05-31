
import { route66StateIds } from '../config/MapConfig';
import type { Route66Waypoint } from '../types/supabaseTypes';

export const fitMapToEnhancedRoute66Corridor = (map: google.maps.Map, routePath: google.maps.LatLngLiteral[]) => {
  console.log('🎯 Fitting map to enhanced Route 66 corridor');
  
  const bounds = new google.maps.LatLngBounds();
  
  // Add route points to bounds
  routePath.forEach(point => {
    bounds.extend(new google.maps.LatLng(point.lat, point.lng));
  });

  // Fit the map to show the entire corridor with enhanced padding
  map.fitBounds(bounds, {
    top: 80,
    right: 80,
    bottom: 80,
    left: 80
  });

  // Ensure zoom stays within our enhanced limits
  const listener = map.addListener('bounds_changed', () => {
    const zoom = map.getZoom();
    if (zoom && zoom > 12) {
      map.setZoom(12);
    } else if (zoom && zoom < 4) {
      map.setZoom(4);
    }
    google.maps.event.removeListener(listener);
  });

  console.log("✅ Enhanced Route 66 corridor bounds applied");
};

export const focusOnRoute66States = (map: google.maps.Map, waypoints: Route66Waypoint[]) => {
  console.log('🏛️ Focusing map on Route 66 states including Arkansas');
  
  // Filter waypoints to only those in Route 66 states
  const route66Waypoints = waypoints.filter(waypoint => 
    route66StateIds.includes(waypoint.state)
  );

  if (route66Waypoints.length === 0) {
    console.log('⚠️ No waypoints found in Route 66 states');
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  
  // Add all Route 66 waypoints to bounds
  route66Waypoints.forEach(waypoint => {
    bounds.extend(new google.maps.LatLng(waypoint.latitude, waypoint.longitude));
  });

  // Fit bounds with padding optimized for Route 66 corridor
  map.fitBounds(bounds, {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  });

  console.log(`✅ Focused on ${route66Waypoints.length} waypoints across ${route66StateIds.length} Route 66 states`);
};

export const centerOnRoute66Corridor = (map: google.maps.Map) => {
  console.log('📍 Centering map on Route 66 corridor');
  
  // Center on the geographic center of Route 66
  const route66Center = { lat: 35.5, lng: -97.5 };
  
  map.setCenter(route66Center);
  map.setZoom(5); // Optimal zoom for Route 66 overview
  
  console.log('✅ Map centered on Route 66 corridor');
};
