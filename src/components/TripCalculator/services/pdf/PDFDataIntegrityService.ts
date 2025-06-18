
import { TripPlan, DailySegment, TripPlanDataValidator } from '../planning/TripPlanBuilder';

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
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
}
