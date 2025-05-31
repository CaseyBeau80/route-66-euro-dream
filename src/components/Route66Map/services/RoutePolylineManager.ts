
import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RoutePolylineManager {
  constructor(private map: google.maps.Map) {}

  createPolylines(smoothRoutePath: google.maps.LatLngLiteral[], majorStopsOnly: Route66Waypoint[]): void {
    if (majorStopsOnly.length === 0) {
      console.error('❌ Cannot create polylines with empty major stops array');
      return;
    }

    // VALIDATION: Ensure we're only working with major stops
    const nonMajorStops = majorStopsOnly.filter(wp => wp.is_major_stop !== true);
    if (nonMajorStops.length > 0) {
      console.error('❌ CRITICAL ERROR: Non-major stops detected in majorStopsOnly array:', 
        nonMajorStops.map(s => s.name));
      return;
    }

    console.log('🛣️ Creating polylines ONLY between consecutive Route 66 city icons (major stops)');
    console.log(`🎯 Input validation: ${majorStopsOnly.length} major stops confirmed`);

    if (majorStopsOnly.length < 2) {
      console.log('⚠️ Not enough major stops to create city-to-city road segments');
      return;
    }

    // Sort by sequence order to ensure proper city-to-city connections
    const sortedMajorStops = majorStopsOnly.sort((a, b) => a.sequence_order - b.sequence_order);
    
    console.log(`🏛️ Creating ${sortedMajorStops.length - 1} city-to-city road segments:`);

    // Create segments ONLY between consecutive major stops (city-to-city)
    for (let i = 0; i < sortedMajorStops.length - 1; i++) {
      const startCity = sortedMajorStops[i];
      const endCity = sortedMajorStops[i + 1];
      
      console.log(`🛣️ Segment ${i + 1}: ${startCity.name} (${startCity.state}) → ${endCity.name} (${endCity.state})`);
      
      // Create a simple straight line segment between major cities only
      const segmentPath = [
        { lat: startCity.latitude, lng: startCity.longitude },
        { lat: endCity.latitude, lng: endCity.longitude }
      ];

      // Create main route polyline for this city-to-city segment
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

      console.log(`✅ Created city-to-city segment ${i + 1}: ${startCity.name} → ${endCity.name}`);
    }

    console.log(`🛣️ Clean Route 66 spine completed: ${sortedMajorStops.length - 1} city-to-city segments between ${sortedMajorStops.length} major stops only`);
  }

  fitMapToBounds(majorStopsOnly: Route66Waypoint[]): void {
    if (majorStopsOnly.length === 0) return;

    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      majorStopsOnly.forEach(stop => {
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
