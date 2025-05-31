
// Enhanced Route 66 interpolation service to create smooth curves with ~2000 points
import type { Route66Waypoint } from '../types/supabaseTypes';

interface InterpolatedPoint {
  lat: number;
  lng: number;
  distance: number;
  segment: number;
}

export class RouteInterpolationService {
  private waypoints: Route66Waypoint[] = [];
  private interpolatedPoints: InterpolatedPoint[] = [];

  constructor(waypoints: Route66Waypoint[]) {
    this.waypoints = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    console.log(`🎯 RouteInterpolationService: Initialized with ${this.waypoints.length} waypoints`);
  }

  // Haversine distance calculation
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Catmull-Rom spline interpolation for smooth curves
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

  // Adaptive interpolation based on segment distance
  private calculateInterpolationSteps(distance: number): number {
    // Base: 8-10 points per segment, more for longer segments
    const basePoints = 8;
    const adaptivePoints = Math.max(basePoints, Math.min(20, Math.floor(distance * 2)));
    return adaptivePoints;
  }

  // Generate smooth interpolated route
  public generateSmoothRoute(): google.maps.LatLngLiteral[] {
    if (this.waypoints.length < 2) {
      console.warn('⚠️ Not enough waypoints for interpolation');
      return [];
    }

    this.interpolatedPoints = [];
    let totalDistance = 0;
    let segmentIndex = 0;

    console.log(`🔄 Starting interpolation for ${this.waypoints.length} waypoints...`);

    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const current = this.waypoints[i];
      const next = this.waypoints[i + 1];
      
      // Get surrounding points for Catmull-Rom spline
      const prev = i > 0 ? this.waypoints[i - 1] : current;
      const afterNext = i < this.waypoints.length - 2 ? this.waypoints[i + 2] : next;

      const segmentDistance = this.calculateDistance(
        current.latitude, current.longitude,
        next.latitude, next.longitude
      );

      const interpolationSteps = this.calculateInterpolationSteps(segmentDistance);

      // Generate interpolated points for this segment
      for (let step = 0; step <= interpolationSteps; step++) {
        const t = step / interpolationSteps;
        
        if (step === 0 && i > 0) continue; // Skip first point to avoid duplicates

        let interpolatedPoint: { lat: number; lng: number };

        if (this.waypoints.length >= 4 && i > 0 && i < this.waypoints.length - 2) {
          // Use Catmull-Rom spline for smooth curves
          interpolatedPoint = this.catmullRomInterpolate(
            { lat: prev.latitude, lng: prev.longitude },
            { lat: current.latitude, lng: current.longitude },
            { lat: next.latitude, lng: next.longitude },
            { lat: afterNext.latitude, lng: afterNext.longitude },
            t
          );
        } else {
          // Use linear interpolation for endpoints
          interpolatedPoint = {
            lat: current.latitude + (next.latitude - current.latitude) * t,
            lng: current.longitude + (next.longitude - current.longitude) * t
          };
        }

        this.interpolatedPoints.push({
          lat: interpolatedPoint.lat,
          lng: interpolatedPoint.lng,
          distance: totalDistance + (segmentDistance * t),
          segment: segmentIndex
        });
      }

      totalDistance += segmentDistance;
      segmentIndex++;
    }

    console.log(`✅ Generated ${this.interpolatedPoints.length} interpolated points`);
    console.log(`📏 Total route distance: ${totalDistance.toFixed(2)} km`);

    return this.interpolatedPoints.map(point => ({
      lat: point.lat,
      lng: point.lng
    }));
  }

  // Get interpolated points with metadata
  public getInterpolatedPoints(): InterpolatedPoint[] {
    return this.interpolatedPoints;
  }

  // Get total route distance
  public getTotalDistance(): number {
    if (this.interpolatedPoints.length === 0) return 0;
    return this.interpolatedPoints[this.interpolatedPoints.length - 1].distance;
  }

  // Get route statistics
  public getRouteStatistics() {
    return {
      totalPoints: this.interpolatedPoints.length,
      totalDistance: this.getTotalDistance(),
      segments: this.waypoints.length - 1,
      averagePointsPerSegment: Math.round(this.interpolatedPoints.length / (this.waypoints.length - 1))
    };
  }
}
