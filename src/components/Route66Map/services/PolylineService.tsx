
import React from 'react';
import { historicRoute66Waypoints } from '../components/HistoricRoute66Waypoints';

interface PolylineServiceProps {
  map: google.maps.Map;
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
}

export const PolylineService = {
  createRoutePolyline: ({ map, polylineRef }: PolylineServiceProps) => {
    console.log('🎨 PolylineService: Creating Route 66 polyline');
    
    // Validate waypoints
    if (!historicRoute66Waypoints || historicRoute66Waypoints.length === 0) {
      console.error('❌ No waypoints available for Route 66');
      return null;
    }

    // Create route path
    const routePath = historicRoute66Waypoints.map(waypoint => ({
      lat: waypoint.lat,
      lng: waypoint.lng
    }));

    console.log('📍 Route path prepared:', {
      waypointCount: routePath.length,
      firstPoint: routePath[0],
      lastPoint: routePath[routePath.length - 1]
    });

    // Create polyline with maximum visibility settings
    const polylineOptions: google.maps.PolylineOptions = {
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 8,
      zIndex: 999999,
      clickable: true,
      visible: true
    };

    polylineRef.current = new google.maps.Polyline(polylineOptions);
    polylineRef.current.setMap(map);
    
    console.log('✅ PolylineService: Polyline created and attached to map');
    return routePath;
  },

  verifyVisibility: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>) => {
    setTimeout(() => {
      if (polylineRef.current) {
        const isVisible = polylineRef.current.getVisible();
        const attachedMap = polylineRef.current.getMap();
        
        console.log('🔍 PolylineService: Visibility check:', {
          visible: isVisible,
          attachedToMap: !!attachedMap,
          pathLength: polylineRef.current.getPath()?.getLength()
        });

        // Force visibility if needed
        if (!isVisible) {
          console.log('🔧 PolylineService: Forcing polyline visibility');
          polylineRef.current.setVisible(true);
        }

        // Re-attach to map if needed
        if (!attachedMap && polylineRef.current) {
          console.log('🔧 PolylineService: Re-attaching polyline to map');
          // Note: We need the map reference to re-attach, this should be handled by the caller
        }
      }
    }, 300);
  },

  addClickListener: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>, map: google.maps.Map) => {
    if (polylineRef.current) {
      polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        console.log('🎯 PolylineService: Route 66 polyline clicked!', event.latLng?.toString());
        const infoWindow = new google.maps.InfoWindow({
          content: '<div style="color: red; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Mother Road</div>',
          position: event.latLng
        });
        infoWindow.open(map);
      });
    }
  }
};
