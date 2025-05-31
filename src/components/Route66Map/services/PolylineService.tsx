
import React from 'react';
import { historicRoute66Waypoints } from '../components/HistoricRoute66Waypoints';

interface PolylineServiceProps {
  map: google.maps.Map;
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
}

export const PolylineService = {
  createRoutePolyline: ({ map, polylineRef }: PolylineServiceProps) => {
    console.log('🎨 PolylineService: Creating realistic textured Route 66 polyline');
    
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

    // Create realistic asphalt texture symbol
    const asphaltTexture = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      fillColor: '#2C2C2C',
      fillOpacity: 0.6,
      strokeColor: '#1A1A1A',
      strokeWeight: 1,
      strokeOpacity: 0.4
    };

    // Create polyline with realistic road appearance
    const polylineOptions: google.maps.PolylineOptions = {
      path: routePath,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt color
      strokeOpacity: 0.8,
      strokeWeight: 7,
      zIndex: 999999,
      clickable: true,
      visible: true,
      icons: [{
        icon: asphaltTexture,
        offset: '0%',
        repeat: '20px'
      }]
    };

    polylineRef.current = new google.maps.Polyline(polylineOptions);
    polylineRef.current.setMap(map);
    
    console.log('✅ PolylineService: Realistic textured polyline created and attached to map');
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
        console.log('🎯 PolylineService: Textured Route 66 polyline clicked!', event.latLng?.toString());
        const infoWindow = new google.maps.InfoWindow({
          content: '<div style="color: #2C2C2C; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Weathered Mother Road</div>',
          position: event.latLng
        });
        infoWindow.open(map);
      });
    }
  }
};
