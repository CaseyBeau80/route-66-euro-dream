import { TripPlan, DailySegment } from '../planning/TripPlanTypes';
import { TripPlanDataValidator } from '../planning/TripPlanDataValidator';

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export interface DataIntegrityReport {
  isValid: boolean;
  warnings: string[];
  enrichmentStatus: {
    hasWeatherData: boolean;
    hasStopsData: boolean;
    completenessPercentage: number;
  };
}

export class PDFDataIntegrityService {
  static validateForPDFExport(tripPlan: TripPlan): ValidationResult {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }

    // Use the TripPlanDataValidator
    const basicValidation = TripPlanDataValidator.validateTripPlanStructure(tripPlan);
    if (!basicValidation.isValid) {
      issues.push(...basicValidation.issues);
    }

    // Additional PDF-specific validations
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      issues.push('No segments available for PDF export');
    }

    tripPlan.segments?.forEach((segment, index) => {
      if (!segment.startCity || !segment.endCity) {
        issues.push(`Segment ${index + 1} missing city information`);
      }
      if (!segment.distance || segment.distance <= 0) {
        issues.push(`Segment ${index + 1} has invalid distance`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static validateSegmentForPDF(segment: DailySegment): ValidationResult {
    const issues: string[] = [];

    if (!segment) {
      issues.push('Segment is null or undefined');
      return { isValid: false, issues };
    }

    if (!segment.day || segment.day <= 0) {
      issues.push('Invalid day number');
    }

    if (!segment.startCity) {
      issues.push('Missing start city');
    }

    if (!segment.endCity) {
      issues.push('Missing end city');
    }

    if (!segment.distance || segment.distance <= 0) {
      issues.push('Invalid distance');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static sanitizeForPDF(tripPlan: TripPlan): TripPlan {
    return TripPlanDataValidator.sanitizeTripPlan(tripPlan);
  }

  static generateIntegrityReport(tripPlan: TripPlan): DataIntegrityReport {
    const warnings: string[] = [];
    let hasWeatherData = false;
    let hasStopsData = false;

    if (tripPlan.segments) {
      const weatherSegments = tripPlan.segments.filter(s => s.weather || s.weatherData);
      hasWeatherData = weatherSegments.length > 0;

      const stopsSegments = tripPlan.segments.filter(s => s.stops && s.stops.length > 0);
      hasStopsData = stopsSegments.length > 0;

      if (!hasWeatherData) {
        warnings.push('No weather data available for segments');
      }

      if (!hasStopsData) {
        warnings.push('Limited stop information available');
      }
    }

    const completenessPercentage = tripPlan.segments 
      ? Math.round(((hasWeatherData ? 50 : 0) + (hasStopsData ? 50 : 0)))
      : 0;

    return {
      isValid: warnings.length === 0,
      warnings,
      enrichmentStatus: {
        hasWeatherData,
        hasStopsData,
        completenessPercentage
      }
    };
  }

  static shouldShowDataQualityNotice(integrityReport: DataIntegrityReport): boolean {
    return integrityReport.warnings.length > 0 || 
           integrityReport.enrichmentStatus.completenessPercentage < 75;
  }

  static generateDataQualityMessage(integrityReport: DataIntegrityReport): string {
    const completeness = integrityReport.enrichmentStatus.completenessPercentage;
    
    if (completeness >= 90) {
      return '✅ High quality data - all information complete';
    } else if (completeness >= 75) {
      return '⚠️ Good data quality - minor information gaps';
    } else if (completeness >= 50) {
      return '⚠️ Partial data available - some features may be limited';
    } else {
      return '⚠️ Limited data available - basic itinerary only';
    }
  }
}
