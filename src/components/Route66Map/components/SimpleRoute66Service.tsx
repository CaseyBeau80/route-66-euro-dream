
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

    // Create a highly visible Route 66 polyline
    const route66Polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 1.0, // Full opacity
      strokeWeight: 8, // Thick line
      zIndex: 1000, // High z-index
      clickable: true
    });

    // Add the polyline to the map
    route66Polyline.setMap(map);
    console.log('✅ Route 66 polyline added to map');

    // Create bounds to fit the entire route
    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => bounds.extend(point));
    
    // Fit the map to show the entire route with some padding
    map.fitBounds(bounds, { padding: 50 });
    console.log('🗺️ Map bounds adjusted to show full Route 66');

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
      zIndex: 2000
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
      zIndex: 2000
    });

    console.log('📍 Start and end markers added');

    // Add click listener to polyline for debugging
    route66Polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🎯 Route 66 polyline clicked at:', event.latLng?.toString());
    });

    setRouteRendered(true);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Route 66 service');
      route66Polyline.setMap(null);
      startMarker.setMap(null);
      endMarker.setMap(null);
    };
  }, [map, routeRendered]);

  return null;
};

export default SimpleRoute66Service;
