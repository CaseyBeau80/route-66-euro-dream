
import { TripPlan, DailySegment } from './TripPlanTypes';

export interface SanitizationReport {
  isValid: boolean;
  warnings: string[];
  sanitizedFields: string[];
  hasCircularReferences?: boolean;
  circularPaths?: string[];
  missingFields?: string[];
}

export interface TripDataSanitizationResult {
  sanitizedData: TripPlan;
  report: SanitizationReport;
}

export class TripDataSanitizationService {
  static sanitizeSegment(segment: any): DailySegment {
    return {
      day: segment.day || 1,
      title: segment.title || 'Unknown Segment',
      startCity: segment.startCity || 'Unknown',
      endCity: segment.endCity || 'Unknown',
      distance: segment.distance || 0,
      approximateMiles: segment.approximateMiles || 0,
      driveTimeHours: segment.driveTimeHours || 0,
      drivingTime: segment.drivingTime || 0,
      stops: segment.stops || [],
      recommendedStops: segment.recommendedStops || [],
      attractions: segment.attractions || [],
      subStopTimings: segment.subStopTimings || [],
      routeSection: segment.routeSection || 'Unknown',
      driveTimeCategory: segment.driveTimeCategory || { category: 'optimal', message: 'Optimal Drive Time' },
      destination: segment.destination || { city: 'Unknown', state: 'Unknown' },
      isGoogleMapsData: segment.isGoogleMapsData || false,
      dataAccuracy: segment.dataAccuracy || 'Unknown'
    };
  }

  static sanitizeTripPlan(tripPlan: any): TripPlan {
    if (!tripPlan) {
      console.error('Cannot sanitize null trip plan');
      return {
        id: `sanitized-${Date.now()}`,
        title: 'Unknown Trip',
        startCity: 'Unknown',
        endCity: 'Unknown',
        startLocation: 'Unknown',
        endLocation: 'Unknown',
        startDate: new Date(),
        totalDays: 0,
        totalDistance: 0,
        totalMiles: 0,
        totalDrivingTime: 0,
        segments: [],
        dailySegments: [],
        stops: [],
        lastUpdated: new Date()
      };
    }

    // Calculate total driving time if not present
    const totalDrivingTime = tripPlan.totalDrivingTime || 
      tripPlan.segments?.reduce((total: number, segment: any) => total + (segment.driveTimeHours || 0), 0) || 0;

    return {
      id: tripPlan.id || `sanitized-${Date.now()}`,
      title: tripPlan.title || 'Route 66 Adventure',
      startCity: tripPlan.startCity || tripPlan.startLocation || 'Unknown',
      endCity: tripPlan.endCity || tripPlan.endLocation || 'Unknown',
      startLocation: tripPlan.startLocation || tripPlan.startCity || 'Unknown',
      endLocation: tripPlan.endLocation || tripPlan.endCity || 'Unknown',
      startDate: tripPlan.startDate || new Date(),
      totalDays: isNaN(tripPlan.totalDays) ? 1 : Math.max(1, tripPlan.totalDays),
      totalDistance: isNaN(tripPlan.totalDistance) ? 0 : Math.max(0, tripPlan.totalDistance),
      totalMiles: tripPlan.totalMiles || Math.round(tripPlan.totalDistance || 0),
      totalDrivingTime,
      segments: (tripPlan.segments || []).map((segment: any) => this.sanitizeSegment(segment)),
      dailySegments: (tripPlan.dailySegments || tripPlan.segments || []).map((segment: any) => this.sanitizeSegment(segment)),
      stops: tripPlan.stops || [],
      lastUpdated: new Date()
    };
  }

  static sanitizeTripData(tripData: any): TripDataSanitizationResult {
    const report: SanitizationReport = {
      isValid: true,
      warnings: [],
      sanitizedFields: [],
      hasCircularReferences: false,
      circularPaths: [],
      missingFields: []
    };

    try {
      const sanitizedData = this.sanitizeTripPlan(tripData);
      return { sanitizedData, report };
    } catch (error) {
      report.isValid = false;
      report.warnings.push('Failed to sanitize trip data');
      return {
        sanitizedData: this.createEmptyTripPlan(),
        report
      };
    }
  }

  static createEmptyTripPlan(): TripPlan {
    return {
      id: `empty-${Date.now()}`,
      title: 'New Trip',
      startCity: '',
      endCity: '',
      startLocation: '',
      endLocation: '',
      startDate: new Date(),
      totalDays: 0,
      totalDistance: 0,
      totalMiles: 0,
      totalDrivingTime: 0,
      segments: [],
      dailySegments: [],
      stops: [],
      lastUpdated: new Date()
    };
  }

  static generateSanitizationReport(originalPlan: any, sanitizedPlan: TripPlan): SanitizationReport {
    const warnings: string[] = [];
    const sanitizedFields: string[] = [];

    if (!originalPlan) {
      warnings.push('Original plan was null or undefined');
      return { 
        isValid: false, 
        warnings, 
        sanitizedFields,
        hasCircularReferences: false,
        circularPaths: [],
        missingFields: ['originalPlan']
      };
    }

    // Check for sanitized fields
    if (!originalPlan.startLocation) sanitizedFields.push('startLocation');
    if (!originalPlan.endLocation) sanitizedFields.push('endLocation');
    if (!originalPlan.stops) sanitizedFields.push('stops');

    return {
      isValid: warnings.length === 0,
      warnings,
      sanitizedFields,
      hasCircularReferences: false,
      circularPaths: [],
      missingFields: []
    };
  }
}
