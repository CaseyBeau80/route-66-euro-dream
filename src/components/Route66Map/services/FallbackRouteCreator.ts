
import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class FallbackRouteCreator {
  constructor(private map: google.maps.Map) {}

  createAsphaltFallbackRoute(majorStops: Route66Waypoint[]): void {
    console.log('🔄 Creating ASPHALT fallback straight-line route with BRIGHT YELLOW stripes');
    
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    const fallbackPolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark charcoal/asphalt color
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 10000,
      clickable: false,
      map: this.map
    });

    // Add bright yellow center line to fallback route
    const fallbackCenterLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700', // Bright yellow
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 10001,
      clickable: false,
      map: this.map,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1.0, // Full opacity for bright yellow
          strokeColor: '#FFD700', // Bright yellow
          strokeWeight: 2,
          scale: 1
        },
        offset: '0%',
        repeat: '40px'
      }]
    });

    console.log('✅ ASPHALT Fallback route with BRIGHT YELLOW stripes created');
    
    // Store in global state for cleanup
    RouteGlobalState.addPolylineSegment(fallbackPolyline);
    RouteGlobalState.addPolylineSegment(fallbackCenterLine);
  }
}
