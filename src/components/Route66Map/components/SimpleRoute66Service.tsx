
import React, { useEffect, useState } from 'react';
import { historicRoute66Waypoints } from './HistoricRoute66Waypoints';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const [routeRendered, setRouteRendered] = useState(false);

  useEffect(() => {
    if (!map || routeRendered) return;

    console.log('🚗 Starting Route 66 rendering process');

    // Create the basic Route 66 polyline path
    const routePath = historicRoute66Waypoints.map(waypoint => ({
      lat: waypoint.lat,
      lng: waypoint.lng
    }));

    console.log(`📍 Creating Route 66 polyline with ${routePath.length} waypoints`);
    console.log('🔍 First few waypoints:', routePath.slice(0, 5));
    console.log('🔍 Last few waypoints:', routePath.slice(-5));

    // Create a highly visible Route 66 polyline with maximum visibility settings
    const route66Polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 1.0, // Full opacity
      strokeWeight: 12, // Even thicker line
      zIndex: 10000, // Very high z-index
      clickable: true,
      visible: true // Explicitly set visible
    });

    // Add the polyline to the map
    route66Polyline.setMap(map);
    console.log('✅ Route 66 polyline added to map with settings:', {
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 12,
      zIndex: 10000,
      visible: true,
      pathLength: routePath.length
    });

    // Create bounds to fit the entire route
    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => bounds.extend(point));
    
    console.log('🗺️ Calculated bounds:', {
      northeast: bounds.getNorthEast().toString(),
      southwest: bounds.getSouthWest().toString()
    });
    
    // Fit the map to show the entire route with proper padding
    map.fitBounds(bounds, { 
      top: 50, 
      right: 50, 
      bottom: 50, 
      left: 50 
    });
    console.log('🗺️ Map bounds adjusted to show full Route 66');

    // Add a timeout to zoom to a specific section after bounds are set
    setTimeout(() => {
      // Zoom to Chicago area to verify the line is there
      const chicagoArea = new google.maps.LatLngBounds(
        new google.maps.LatLng(41.5, -88.0),
        new google.maps.LatLng(42.0, -87.0)
      );
      map.fitBounds(chicagoArea);
      console.log('🎯 Zoomed to Chicago area to verify route visibility');
    }, 2000);

    // Add start marker (Chicago)
    const startMarker = new google.maps.Marker({
      position: routePath[0],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#22C55E" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">START</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      title: 'Route 66 Start - Chicago, IL',
      zIndex: 20000
    });

    // Add end marker (Santa Monica)
    const endMarker = new google.maps.Marker({
      position: routePath[routePath.length - 1],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">END</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      title: 'Route 66 End - Santa Monica, CA',
      zIndex: 20000
    });

    console.log('📍 Start and end markers added');

    // Add click listener to polyline for debugging
    route66Polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🎯 Route 66 polyline clicked at:', event.latLng?.toString());
      // Show an info window when clicked to confirm the line exists
      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="color: red; font-weight: bold;">Route 66 - The Mother Road</div>',
        position: event.latLng
      });
      infoWindow.open(map);
    });

    // Add map zoom change listener to log current zoom level
    const zoomChangeListener = map.addListener('zoom_changed', () => {
      console.log('🔍 Map zoom changed to:', map.getZoom());
    });

    setRouteRendered(true);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Route 66 service');
      route66Polyline.setMap(null);
      startMarker.setMap(null);
      endMarker.setMap(null);
      google.maps.event.removeListener(zoomChangeListener);
    };
  }, [map, routeRendered]);

  return null;
};

export default SimpleRoute66Service;
