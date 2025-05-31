import { RouteGlobalState } from './RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RoutePolylineManager {
  constructor(private map: google.maps.Map) {}

  // Catmull-Rom spline interpolation for smooth, windy curves
  private catmullRomInterpolate(
    p0: { lat: number; lng: number },
    p1: { lat: number; lng: number },
    p2: { lat: number; lng: number },
    p3: { lat: number; lng: number },
    t: number
  ): { lat: number; lng: number } {
    const t2 = t * t;
    const t3 = t2 * t;

    const lat = 0.5 * (
      (2 * p1.lat) +
      (-p0.lat + p2.lat) * t +
      (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
      (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3
    );

    const lng = 0.5 * (
      (2 * p1.lng) +
      (-p0.lng + p2.lng) * t +
      (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
      (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3
    );

    return { lat, lng };
  }

  // Calculate distance between two points for adaptive interpolation
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Generate windy interpolated path between two cities
  private generateWindyPath(startCity: Route66Waypoint, endCity: Route66Waypoint, prevCity?: Route66Waypoint, nextCity?: Route66Waypoint): google.maps.LatLngLiteral[] {
    const distance = this.calculateDistance(startCity.latitude, startCity.longitude, endCity.latitude, endCity.longitude);
    
    // More interpolation points for longer segments to create more curves
    const interpolationSteps = Math.max(12, Math.min(25, Math.floor(distance * 3)));
    
    const path: google.maps.LatLngLiteral[] = [];
    
    // Use surrounding cities for better curve calculation
    const p0 = prevCity ? { lat: prevCity.latitude, lng: prevCity.longitude } : { lat: startCity.latitude, lng: startCity.longitude };
    const p1 = { lat: startCity.latitude, lng: startCity.longitude };
    const p2 = { lat: endCity.latitude, lng: endCity.longitude };
    const p3 = nextCity ? { lat: nextCity.latitude, lng: nextCity.longitude } : { lat: endCity.latitude, lng: endCity.longitude };

    for (let step = 0; step <= interpolationSteps; step++) {
      const t = step / interpolationSteps;
      
      let interpolatedPoint: { lat: number; lng: number };
      
      if (prevCity && nextCity) {
        // Use Catmull-Rom spline for smooth, windy curves
        interpolatedPoint = this.catmullRomInterpolate(p0, p1, p2, p3, t);
      } else {
        // Add some artificial curves for end segments
        const midLat = p1.lat + (p2.lat - p1.lat) * t;
        const midLng = p1.lng + (p2.lng - p1.lng) * t;
        
        // Add a slight curve perpendicular to the main direction
        const perpOffset = Math.sin(t * Math.PI) * 0.05; // Adjust curve intensity
        const deltaLat = p2.lat - p1.lat;
        const deltaLng = p2.lng - p1.lng;
        
        interpolatedPoint = {
          lat: midLat + (-deltaLng * perpOffset),
          lng: midLng + (deltaLat * perpOffset)
        };
      }
      
      path.push({
        lat: interpolatedPoint.lat,
        lng: interpolatedPoint.lng
      });
    }
    
    return path;
  }

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

    console.log('🛣️ Creating windy, nostalgic polylines between Route 66 city icons (major stops)');
    console.log(`🎯 Input validation: ${majorStopsOnly.length} major stops confirmed`);

    if (majorStopsOnly.length < 2) {
      console.log('⚠️ Not enough major stops to create city-to-city road segments');
      return;
    }

    // Sort by sequence order to ensure proper city-to-city connections
    const sortedMajorStops = majorStopsOnly.sort((a, b) => a.sequence_order - b.sequence_order);
    
    console.log(`🏛️ Creating ${sortedMajorStops.length - 1} windy city-to-city road segments:`);

    // Create curved segments between consecutive major stops (city-to-city)
    for (let i = 0; i < sortedMajorStops.length - 1; i++) {
      const startCity = sortedMajorStops[i];
      const endCity = sortedMajorStops[i + 1];
      const prevCity = i > 0 ? sortedMajorStops[i - 1] : undefined;
      const nextCity = i < sortedMajorStops.length - 2 ? sortedMajorStops[i + 2] : undefined;
      
      console.log(`🛣️ Segment ${i + 1}: ${startCity.name} (${startCity.state}) → ${endCity.name} (${endCity.state})`);
      
      // Generate windy, curved path between cities
      const windyPath = this.generateWindyPath(startCity, endCity, prevCity, nextCity);

      // Create main route polyline for this windy city-to-city segment
      const mainPolyline = new google.maps.Polyline({
        path: windyPath,
        geodesic: false, // Turn off geodesic for more pronounced curves
        strokeColor: '#2C2C2C',
        strokeOpacity: 0.9,
        strokeWeight: 10,
        zIndex: 1000,
        clickable: false
      });

      // Create center dashed line for authentic Route 66 look
      const centerLine = new google.maps.Polyline({
        path: windyPath,
        geodesic: false,
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

      console.log(`✅ Created windy city-to-city segment ${i + 1}: ${startCity.name} → ${endCity.name} with ${windyPath.length} curve points`);
    }

    console.log(`🛣️ Nostalgic windy Route 66 spine completed: ${sortedMajorStops.length - 1} curved city-to-city segments between ${sortedMajorStops.length} major stops only`);
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
