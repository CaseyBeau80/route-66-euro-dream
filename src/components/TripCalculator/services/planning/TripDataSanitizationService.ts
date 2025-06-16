
import { TripPlan, DailySegment } from './TripPlanTypes';

export interface SanitizationReport {
  hasCircularReferences: boolean;
  circularPaths: string[];
  missingFields: string[];
  sanitizedFields: string[];
  warnings: string[];
}

export class TripDataSanitizationService {
  /**
   * Deep sanitize trip data to remove circular references and fix data integrity issues
   */
  static sanitizeTripData(data: any): { sanitizedData: TripPlan; report: SanitizationReport } {
    console.log('🧹 TripDataSanitizationService: Starting deep sanitization', data);
    
    const report: SanitizationReport = {
      hasCircularReferences: false,
      circularPaths: [],
      missingFields: [],
      sanitizedFields: [],
      warnings: []
    };

    if (!data) {
      report.warnings.push('No data provided for sanitization');
      return { sanitizedData: this.createEmptyTripPlan(), report };
    }

    try {
      // First, detect and remove circular references
      const deCircularized = this.removeCircularReferences(data, report);
      
      // Then sanitize the structure
      const sanitized = this.sanitizeTripPlan(deCircularized, report);
      
      console.log('✅ TripDataSanitizationService: Sanitization complete', { report, sanitized });
      return { sanitizedData: sanitized, report };
      
    } catch (error) {
      console.error('❌ TripDataSanitizationService: Sanitization failed', error);
      report.warnings.push(`Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { sanitizedData: this.createEmptyTripPlan(), report };
    }
  }

  /**
   * Remove circular references using a visited set approach
   */
  private static removeCircularReferences(obj: any, report: SanitizationReport, visited = new WeakSet(), path = ''): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (visited.has(obj)) {
      report.hasCircularReferences = true;
      report.circularPaths.push(path);
      console.warn('🔄 Circular reference detected at path:', path);
      return '[Circular Reference Removed]';
    }

    visited.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((item, index) => 
        this.removeCircularReferences(item, report, visited, `${path}[${index}]`)
      );
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      result[key] = this.removeCircularReferences(value, report, visited, currentPath);
    }

    visited.delete(obj);
    return result;
  }

  /**
   * Sanitize trip plan structure and ensure all required fields are present
   */
  private static sanitizeTripPlan(data: any, report: SanitizationReport): TripPlan {
    const sanitized: TripPlan = {
      id: this.sanitizeString(data?.id, `trip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
      title: this.sanitizeString(data?.title, 'Untitled Route 66 Adventure'),
      startCity: this.sanitizeString(data?.startCity, 'Unknown Start'),
      endCity: this.sanitizeString(data?.endCity, 'Unknown End'),
      startDate: data?.startDate ? new Date(data.startDate) : new Date(),
      totalDays: this.sanitizeNumber(data?.totalDays, 1),
      totalDistance: this.sanitizeNumber(data?.totalDistance, 0),
      totalMiles: this.sanitizeNumber(data?.totalMiles || data?.totalDistance, 0),
      totalDrivingTime: this.sanitizeNumber(data?.totalDrivingTime, 0),
      segments: this.sanitizeSegments(data?.segments || data?.dailySegments, report),
      dailySegments: this.sanitizeSegments(data?.dailySegments || data?.segments, report),
      lastUpdated: new Date()
    };

    // Track what we had to sanitize
    if (data?.title !== sanitized.title) report.sanitizedFields.push('title');
    if (data?.startCity !== sanitized.startCity) report.sanitizedFields.push('startCity');
    if (data?.endCity !== sanitized.endCity) report.sanitizedFields.push('endCity');
    if (data?.totalDays !== sanitized.totalDays) report.sanitizedFields.push('totalDays');

    return sanitized;
  }

  /**
   * Sanitize segments array
   */
  private static sanitizeSegments(segments: any, report: SanitizationReport): DailySegment[] {
    if (!Array.isArray(segments)) {
      report.missingFields.push('segments');
      return [];
    }

    return segments.map((segment, index) => this.sanitizeSegment(segment, index, report));
  }

  /**
   * Sanitize individual segment
   */
  private static sanitizeSegment(segment: any, index: number, report: SanitizationReport): DailySegment {
    if (!segment || typeof segment !== 'object') {
      report.warnings.push(`Segment ${index + 1} is invalid`);
      return this.createEmptySegment(index + 1);
    }

    return {
      day: this.sanitizeNumber(segment.day, index + 1),
      title: this.sanitizeString(segment.title, `Day ${index + 1}`),
      startCity: this.sanitizeString(segment.startCity, 'Unknown'),
      endCity: this.sanitizeString(segment.endCity || segment.destination?.city, 'Unknown'),
      destination: segment.destination ? {
        city: this.sanitizeString(segment.destination.city || segment.destination.name, 'Unknown'),
        state: this.sanitizeString(segment.destination.state, undefined)
      } : undefined,
      distance: this.sanitizeNumber(segment.distance || segment.approximateMiles, 0),
      driveTimeHours: this.sanitizeNumber(segment.driveTimeHours || segment.drivingTime, 0),
      drivingTime: this.sanitizeNumber(segment.drivingTime || segment.driveTimeHours, 0),
      approximateMiles: this.sanitizeNumber(segment.approximateMiles || segment.distance, 0),
      recommendedStops: Array.isArray(segment.recommendedStops) ? segment.recommendedStops : (Array.isArray(segment.stops) ? segment.stops : []),
      attractions: Array.isArray(segment.attractions) ? segment.attractions : [],
      weather: segment.weather || null,
      weatherData: segment.weatherData || segment.weather || null,
      notes: this.sanitizeString(segment.notes, ''),
      recommendations: Array.isArray(segment.recommendations) ? segment.recommendations : []
    };
  }

  private static sanitizeString(value: any, fallback: string | undefined): string | undefined {
    if (fallback === undefined) {
      return typeof value === 'string' && value.trim() ? value.trim() : undefined;
    }
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  private static sanitizeNumber(value: any, fallback: number): number {
    const num = Number(value);
    return isNaN(num) ? fallback : Math.max(0, num);
  }

  private static createEmptyTripPlan(): TripPlan {
    return {
      id: `empty-trip-${Date.now()}`,
      title: 'Invalid Trip Data',
      startCity: 'Unknown',
      endCity: 'Unknown',
      startDate: new Date(),
      totalDays: 0,
      totalDistance: 0,
      totalMiles: 0,
      totalDrivingTime: 0,
      segments: [],
      dailySegments: [],
      lastUpdated: new Date()
    };
  }

  private static createEmptySegment(day: number): DailySegment {
    return {
      day,
      title: `Day ${day}`,
      startCity: 'Unknown',
      endCity: 'Unknown',
      distance: 0,
      driveTimeHours: 0,
      drivingTime: 0,
      approximateMiles: 0,
      recommendedStops: [],
      attractions: [],
      notes: '',
      recommendations: []
    };
  }
}
