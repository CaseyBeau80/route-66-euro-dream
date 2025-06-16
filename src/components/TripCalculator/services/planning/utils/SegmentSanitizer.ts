
import { DailySegment } from '../TripPlanTypes';
import { SanitizationReport } from '../TripDataSanitizationService';
import { DataSanitizationUtils } from './DataSanitizationUtils';

export class SegmentSanitizer {
  /**
   * Sanitize individual segment
   */
  static sanitizeSegment(segment: any, index: number, report: SanitizationReport): DailySegment {
    if (!segment || typeof segment !== 'object') {
      report.warnings.push(`Segment ${index + 1} is invalid`);
      return this.createEmptySegment(index + 1);
    }

    return {
      day: DataSanitizationUtils.sanitizeNumber(segment.day, index + 1),
      title: DataSanitizationUtils.sanitizeString(segment.title, `Day ${index + 1}`),
      startCity: DataSanitizationUtils.sanitizeString(segment.startCity, 'Unknown'),
      endCity: DataSanitizationUtils.sanitizeString(segment.endCity || segment.destination?.city, 'Unknown'),
      destination: segment.destination ? {
        city: DataSanitizationUtils.sanitizeString(segment.destination.city || segment.destination.name, 'Unknown'),
        state: DataSanitizationUtils.sanitizeString(segment.destination.state, 'Unknown')
      } : {
        city: DataSanitizationUtils.sanitizeString(segment.endCity, 'Unknown'),
        state: 'Unknown'
      },
      distance: DataSanitizationUtils.sanitizeNumber(segment.distance || segment.approximateMiles, 0),
      driveTimeHours: DataSanitizationUtils.sanitizeNumber(segment.driveTimeHours || segment.drivingTime, 0),
      drivingTime: DataSanitizationUtils.sanitizeNumber(segment.drivingTime || segment.driveTimeHours, 0),
      approximateMiles: DataSanitizationUtils.sanitizeNumber(segment.approximateMiles || segment.distance, 0),
      recommendedStops: Array.isArray(segment.recommendedStops) ? segment.recommendedStops : (Array.isArray(segment.stops) ? segment.stops : []),
      attractions: Array.isArray(segment.attractions) ? segment.attractions : [],
      weather: segment.weather || null,
      weatherData: segment.weatherData || segment.weather || null,
      notes: DataSanitizationUtils.sanitizeString(segment.notes, ''),
      recommendations: Array.isArray(segment.recommendations) ? segment.recommendations : []
    };
  }

  /**
   * Sanitize segments array
   */
  static sanitizeSegments(segments: any, report: SanitizationReport): DailySegment[] {
    if (!Array.isArray(segments)) {
      report.missingFields.push('segments');
      return [];
    }

    return segments.map((segment, index) => this.sanitizeSegment(segment, index, report));
  }

  private static createEmptySegment(day: number): DailySegment {
    return {
      day,
      title: `Day ${day}`,
      startCity: 'Unknown',
      endCity: 'Unknown',
      destination: {
        city: 'Unknown',
        state: 'Unknown'
      },
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
