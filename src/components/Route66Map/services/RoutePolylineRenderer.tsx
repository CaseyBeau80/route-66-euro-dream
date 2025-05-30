
import React from 'react';
import { historicRoute66Waypoints } from '../components/HistoricRoute66Waypoints';

interface RoutePolylineRendererProps {
  map: google.maps.Map;
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
}

export const RoutePolylineRenderer = {
  createPolyline: ({ map, polylineRef }: RoutePolylineRendererProps) => {
    console.log('🎯 RoutePolylineRenderer: Creating Route 66 polyline');

    // Validate waypoints
    if (!historicRoute66Waypoints || historicRoute66Waypoints.length === 0) {
      console.error('❌ No waypoints available');
      return null;
    }

    // Create the route path from waypoints
    const routePath = historicRoute66Waypoints.map(waypoint => ({
      lat: waypoint.lat,
      lng: waypoint.lng
    }));

    console.log('📍 Route path created:', {
      totalWaypoints: routePath.length,
      firstPoint: routePath[0],
      lastPoint: routePath[routePath.length - 1]
    });

    // Create the Route 66 polyline with enhanced visibility
    const polylineOptions: google.maps.PolylineOptions = {
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 10,
      zIndex: 999999,
      clickable: true,
      visible: true
    };

    polylineRef.current = new google.maps.Polyline(polylineOptions);
    polylineRef.current.setMap(map);
    
    console.log('✅ RoutePolylineRenderer: Route 66 polyline created and added to map');
    return routePath;
  },

  verifyPolylineVisibility: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>) => {
    setTimeout(() => {
      if (polylineRef.current) {
        console.log('🔍 RoutePolylineRenderer: Polyline verification:', {
          visible: polylineRef.current.getVisible(),
          map: polylineRef.current.getMap() ? 'attached' : 'not attached',
          pathLength: polylineRef.current.getPath()?.getLength()
        });

        // Force visibility if needed
        if (!polylineRef.current.getVisible()) {
          console.log('🔧 RoutePolylineRenderer: Forcing visibility');
          polylineRef.current.setVisible(true);
        }
      }
    }, 200);
  },

  addClickListener: (
    polylineRef: React.MutableRefObject<google.maps.Polyline | null>, 
    map: google.maps.Map
  ) => {
    if (polylineRef.current) {
      polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        console.log('🎯 RoutePolylineRenderer: Route 66 polyline clicked!', event.latLng?.toString());
        const infoWindow = new google.maps.InfoWindow({
          content: '<div style="color: red; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Mother Road</div>',
          position: event.latLng
        });
        infoWindow.open(map);
      });
    }
  }
};
