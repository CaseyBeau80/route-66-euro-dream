
import type { Route66Waypoint } from '../types/supabaseTypes';

export class PathInterpolationService {
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
  generateWindyPath(startCity: Route66Waypoint, endCity: Route66Waypoint, prevCity?: Route66Waypoint, nextCity?: Route66Waypoint): google.maps.LatLngLiteral[] {
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
}
