
import { TripPlan, DailySegment } from './TripPlanTypes';
import { CircularReferenceRemover } from './utils/CircularReferenceRemover';
import { SegmentSanitizer } from './utils/SegmentSanitizer';
import { DataSanitizationUtils } from './utils/DataSanitizationUtils';

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
      const deCircularized = CircularReferenceRemover.removeCircularReferences(data, report);
      
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
   * Sanitize trip plan structure and ensure all required fields are present
   */
  private static sanitizeTripPlan(data: any, report: SanitizationReport): TripPlan {
    const sanitized: TripPlan = {
      id: DataSanitizationUtils.sanitizeString(data?.id, `trip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
      title: DataSanitizationUtils.sanitizeString(data?.title, 'Untitled Route 66 Adventure'),
      startCity: DataSanitizationUtils.sanitizeString(data?.startCity, 'Unknown Start'),
      endCity: DataSanitizationUtils.sanitizeString(data?.endCity, 'Unknown End'),
      startDate: data?.startDate ? new Date(data.startDate) : new Date(),
      totalDays: DataSanitizationUtils.sanitizeNumber(data?.totalDays, 1),
      totalDistance: DataSanitizationUtils.sanitizeNumber(data?.totalDistance, 0),
      totalMiles: DataSanitizationUtils.sanitizeNumber(data?.totalMiles || data?.totalDistance, 0),
      totalDrivingTime: DataSanitizationUtils.sanitizeNumber(data?.totalDrivingTime, 0),
      segments: SegmentSanitizer.sanitizeSegments(data?.segments || data?.dailySegments, report),
      dailySegments: SegmentSanitizer.sanitizeSegments(data?.dailySegments || data?.segments, report),
      lastUpdated: new Date()
    };

    // Track what we had to sanitize
    if (data?.title !== sanitized.title) report.sanitizedFields.push('title');
    if (data?.startCity !== sanitized.startCity) report.sanitizedFields.push('startCity');
    if (data?.endCity !== sanitized.endCity) report.sanitizedFields.push('endCity');
    if (data?.totalDays !== sanitized.totalDays) report.sanitizedFields.push('totalDays');

    return sanitized;
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
}
