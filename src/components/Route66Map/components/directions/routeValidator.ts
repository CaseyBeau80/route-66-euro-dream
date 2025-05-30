
import { RouteSegment } from './types';

export interface RouteValidation {
  isValid: boolean;
  totalSegments: number;
  successfulSegments: number;
  successRate: number;
  failedSegments: string[];
  recommendations: string[];
}

export class RouteValidator {
  validateRoute(segments: RouteSegment[]): RouteValidation {
    console.log('🔍 Validating Route 66 calculation results');

    const totalSegments = segments.length;
    let successfulSegments = 0;
    const failedSegments: string[] = [];
    const recommendations: string[] = [];

    // Check each segment for validity
    segments.forEach(segment => {
      if (this.isSegmentValid(segment)) {
        successfulSegments++;
      } else {
        failedSegments.push(segment.description);
      }
    });

    const successRate = successfulSegments / totalSegments;
    const isValid = successRate >= 0.6; // Consider valid if 60% or more segments work

    // Generate recommendations
    if (successRate < 0.8) {
      recommendations.push('Consider using city fallback for failed segments');
    }
    
    if (failedSegments.length > 0) {
      recommendations.push('Review waypoint density for failed segments');
    }
    
    if (successRate < 0.4) {
      recommendations.push('Route may need manual adjustment');
    }

    const validation: RouteValidation = {
      isValid,
      totalSegments,
      successfulSegments,
      successRate,
      failedSegments,
      recommendations
    };

    this.logValidationResults(validation);
    return validation;
  }

  private isSegmentValid(segment: RouteSegment): boolean {
    // Check if segment has minimum required waypoints
    if (segment.waypoints.length < 2) {
      return false;
    }

    // Check if waypoints have valid coordinates
    const validCoordinates = segment.waypoints.every(waypoint => 
      this.isValidCoordinate(waypoint.lat, waypoint.lng)
    );

    // Check if segment has a reasonable distance (not too short or too long)
    const totalDistance = this.calculateSegmentDistance(segment);
    const isReasonableDistance = totalDistance > 50 && totalDistance < 2000; // 50km to 2000km

    return validCoordinates && isReasonableDistance;
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  }

  private calculateSegmentDistance(segment: RouteSegment): number {
    let totalDistance = 0;
    
    for (let i = 0; i < segment.waypoints.length - 1; i++) {
      const point1 = segment.waypoints[i];
      const point2 = segment.waypoints[i + 1];
      totalDistance += this.calculateDistance(point1, point2);
    }
    
    return totalDistance;
  }

  private calculateDistance(
    point1: {lat: number, lng: number}, 
    point2: {lat: number, lng: number}
  ): number {
    // Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * 
      Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private logValidationResults(validation: RouteValidation): void {
    console.log('📊 Route Validation Results:');
    console.log(`   Valid: ${validation.isValid}`);
    console.log(`   Success Rate: ${Math.round(validation.successRate * 100)}% (${validation.successfulSegments}/${validation.totalSegments})`);
    
    if (validation.failedSegments.length > 0) {
      console.log(`   Failed Segments: ${validation.failedSegments.join(', ')}`);
    }
    
    if (validation.recommendations.length > 0) {
      console.log(`   Recommendations: ${validation.recommendations.join(', ')}`);
    }
  }
}
