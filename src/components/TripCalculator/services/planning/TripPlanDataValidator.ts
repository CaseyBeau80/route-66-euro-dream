
import { TripPlan, DailySegment } from './TripPlanTypes';
import { getDestinationCityName } from './TripPlanBuilder';

// Enhanced data validation service
export class TripPlanDataValidator {
  static validateTripPlan(tripPlan: TripPlan): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }
    
    // Validate basic fields
    if (!tripPlan.startCity || tripPlan.startCity.trim() === '') {
      issues.push('Start city is missing or empty');
    }
    
    if (!tripPlan.endCity || tripPlan.endCity.trim() === '') {
      issues.push('End city is missing or empty');
    }
    
    if (!tripPlan.totalDays || isNaN(tripPlan.totalDays) || tripPlan.totalDays <= 0) {
      issues.push('Total days is invalid or missing');
    }
    
    if (!tripPlan.totalDistance || isNaN(tripPlan.totalDistance) || tripPlan.totalDistance <= 0) {
      issues.push('Total distance is invalid or missing');
    }
    
    // Validate segments
    if (!tripPlan.segments || !Array.isArray(tripPlan.segments)) {
      issues.push('Segments array is missing or invalid');
    } else {
      tripPlan.segments.forEach((segment, index) => {
        const segmentIssues = this.validateSegment(segment, index);
        issues.push(...segmentIssues);
      });
    }
    
    return { isValid: issues.length === 0, issues };
  }

  static validateTripPlanStructure(tripPlan: TripPlan): { isValid: boolean; issues: string[] } {
    return this.validateTripPlan(tripPlan);
  }
  
  static validateSegment(segment: DailySegment, index: number): string[] {
    const issues: string[] = [];
    const prefix = `Segment ${index + 1}`;
    
    if (!segment) {
      issues.push(`${prefix}: Segment is null or undefined`);
      return issues;
    }
    
    if (!segment.day || isNaN(segment.day) || segment.day <= 0) {
      issues.push(`${prefix}: Day number is invalid`);
    }
    
    if (!segment.startCity || segment.startCity.trim() === '') {
      issues.push(`${prefix}: Start city is missing`);
    }
    
    if (!segment.endCity && !segment.destination) {
      issues.push(`${prefix}: End city/destination is missing`);
    }
    
    if (isNaN(segment.distance) || segment.distance < 0) {
      issues.push(`${prefix}: Distance is invalid (${segment.distance})`);
    }
    
    if (isNaN(segment.driveTimeHours || 0) || (segment.driveTimeHours || 0) < 0) {
      issues.push(`${prefix}: Drive time is invalid (${segment.driveTimeHours})`);
    }
    
    return issues;
  }
  
  static sanitizeSegment(segment: DailySegment): DailySegment {
    return {
      ...segment,
      distance: isNaN(segment.distance) ? 0 : Math.max(0, segment.distance),
      driveTimeHours: isNaN(segment.driveTimeHours || 0) ? 0 : Math.max(0, segment.driveTimeHours || 0),
      startCity: segment.startCity || 'Unknown',
      endCity: segment.endCity || getDestinationCityName(segment.destination) || 'Unknown',
      approximateMiles: segment.approximateMiles || Math.round(segment.distance || 0),
      recommendedStops: segment.recommendedStops || [],
      attractions: segment.attractions || []
    };
  }
  
  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    if (!tripPlan) {
      console.error('Cannot sanitize null trip plan');
      return tripPlan;
    }
    
    // Calculate total driving time if not present
    const totalDrivingTime = tripPlan.totalDrivingTime || 
      tripPlan.segments?.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0) || 0;
    
    return {
      ...tripPlan,
      totalDistance: isNaN(tripPlan.totalDistance) ? 0 : Math.max(0, tripPlan.totalDistance),
      totalMiles: tripPlan.totalMiles || Math.round(tripPlan.totalDistance || 0),
      totalDays: isNaN(tripPlan.totalDays) ? 1 : Math.max(1, tripPlan.totalDays),
      totalDrivingTime,
      segments: (tripPlan.segments || []).map(segment => this.sanitizeSegment(segment)),
      lastUpdated: new Date()
    };
  }
}
