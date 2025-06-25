
import type { Route66Waypoint } from '../types/supabaseTypes';

export class SmoothPathCreationService {
  /**
   * Enhanced function to create smooth curved path between waypoints
   */
  static createSmoothCurvedPath(waypoints: Route66Waypoint[]): google.maps.LatLngLiteral[] {
    console.log('🛣️ Creating smooth curved path for Route 66');
    
    const validWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    if (validWaypoints.length < 2) {
      console.error('❌ Insufficient waypoints for curved path');
      return [];
    }

    const smoothPath: google.maps.LatLngLiteral[] = [];
    const segmentsPerSection = 15; // More segments for smoother curves

    for (let i = 0; i < validWaypoints.length - 1; i++) {
      const current = validWaypoints[i];
      const next = validWaypoints[i + 1];
      
      // Get control points for Bezier curve
      const prev = i > 0 ? validWaypoints[i - 1] : current;
      const afterNext = i < validWaypoints.length - 2 ? validWaypoints[i + 2] : next;
      
      // Calculate control points for smooth curves
      const cp1 = {
        lat: current.latitude + (next.latitude - prev.latitude) * 0.2,
        lng: current.longitude + (next.longitude - prev.longitude) * 0.2
      };
      
      const cp2 = {
        lat: next.latitude - (afterNext.latitude - current.latitude) * 0.2,
        lng: next.longitude - (afterNext.longitude - current.longitude) * 0.2
      };
      
      // Create cubic Bezier curve
      for (let t = 0; t <= segmentsPerSection; t++) {
        const ratio = t / segmentsPerSection;
        const invRatio = 1 - ratio;
        
        // Cubic Bezier formula
        const lat = Math.pow(invRatio, 3) * current.latitude +
                    3 * Math.pow(invRatio, 2) * ratio * cp1.lat +
                    3 * invRatio * Math.pow(ratio, 2) * cp2.lat +
                    Math.pow(ratio, 3) * next.latitude;
        
        const lng = Math.pow(invRatio, 3) * current.longitude +
                    3 * Math.pow(invRatio, 2) * ratio * cp1.lng +
                    3 * invRatio * Math.pow(ratio, 2) * cp2.lng +
                    Math.pow(ratio, 3) * next.longitude;
        
        smoothPath.push({ lat, lng });
      }
    }
    
    console.log(`✅ Created smooth curved path with ${smoothPath.length} points`);
    return smoothPath;
  }
}
