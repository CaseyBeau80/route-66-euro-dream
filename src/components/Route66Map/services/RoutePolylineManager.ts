
import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RoutePolylineManager {
  constructor(private map: google.maps.Map) {}

  createPolylines(smoothRoutePath: google.maps.LatLngLiteral[], waypoints: Route66Waypoint[]): void {
    if (smoothRoutePath.length === 0 || waypoints.length === 0) {
      console.error('❌ Cannot create polylines with empty route path or waypoints');
      return;
    }

    console.log('🛣️ Creating polylines only for segments with Route 66 icons');

    // Only create polylines between major stops (where icons exist)
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    if (majorStops.length < 2) {
      console.log('⚠️ Not enough major stops with icons to create road segments');
      return;
    }

    console.log(`🎯 Found ${majorStops.length} major stops with icons - creating ${majorStops.length - 1} road segments`);

    // Create segments only between consecutive major stops
    for (let i = 0; i < majorStops.length - 1; i++) {
      const startStop = majorStops[i];
      const endStop = majorStops[i + 1];
      
      // Create a simple straight line segment between major stops with icons
      const segmentPath = [
        { lat: startStop.latitude, lng: startStop.longitude },
        { lat: endStop.latitude, lng: endStop.longitude }
      ];

      // Create main route polyline for this segment
      const mainPolyline = new google.maps.Polyline({
        path: segmentPath,
        geodesic: true,
        strokeColor: '#2C2C2C',
        strokeOpacity: 0.9,
        strokeWeight: 10,
        zIndex: 1000,
        clickable: false
      });

      // Create center dashed line for authentic Route 66 look
      const centerLine = new google.maps.Polyline({
        path: segmentPath,
        geodesic: true,
        strokeColor: '#FFD700',
        strokeOpacity: 0,
        strokeWeight: 0,
        zIndex: 1001,
        clickable: false,
        icons: [{
          icon: {
            path: 'M 0,-2 0,2',
            strokeOpacity: 1,
            strokeColor: '#FFD700',
            strokeWeight: 3,
            scale: 1
          },
          offset: '0%',
          repeat: '30px'
        }]
      });

      // Add polylines to map
      mainPolyline.setMap(this.map);
      centerLine.setMap(this.map);

      // Store in global state
      RouteGlobalState.addPolylineSegment(mainPolyline);
      RouteGlobalState.addPolylineSegment(centerLine);

      console.log(`✅ Created road segment ${i + 1}: ${startStop.name} → ${endStop.name}`);
    }

    console.log(`🛣️ Road segments created only between ${majorStops.length} locations with Route 66 icons`);
  }

  fitMapToBounds(waypoints: Route66Waypoint[]): void {
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    if (majorStops.length === 0) return;

    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      majorStops.forEach(stop => {
        bounds.extend(new google.maps.LatLng(stop.latitude, stop.longitude));
      });
      this.map.fitBounds(bounds, { 
        top: 60, 
        right: 60, 
        bottom: 60, 
        left: 60 
      });
    }, 1000);
  }

  cleanupPolylines(): void {
    const polylines = RouteGlobalState.getPolylineSegments();
    
    polylines.forEach(polyline => {
      polyline.setMap(null);
    });
    
    RouteGlobalState.clearPolylineSegments();

    // Legacy cleanup
    const smoothPolyline = RouteGlobalState.getSmoothPolyline();
    const centerLine = RouteGlobalState.getCenterLine();

    if (smoothPolyline) {
      smoothPolyline.setMap(null);
      RouteGlobalState.setSmoothPolyline(null);
    }
    
    if (centerLine) {
      centerLine.setMap(null);
      RouteGlobalState.setCenterLine(null);
    }
  }
}
