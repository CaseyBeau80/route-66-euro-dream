
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class TripPrePlanningValidator {
  /**
   * Validate trip parameters before planning - FIXED: Only destination-focused
   */
  static validateTripParameters(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate basic parameters
    if (!startLocation || startLocation.trim() === '') {
      errors.push('Start location is required');
    }

    if (!endLocation || endLocation.trim() === '') {
      errors.push('End location is required');
    }

    if (travelDays <= 0) {
      errors.push('Travel days must be positive');
    }

    if (travelDays > 14) {
      warnings.push('Trips longer than 14 days may be challenging to plan optimally');
    }

    // Validate trip style - Only destination-focused is supported
    if (tripStyle !== 'destination-focused') {
      errors.push('Only destination-focused trip style is supported');
    }

    // Validate route feasibility
    if (startLocation === endLocation) {
      errors.push('Start and end locations cannot be the same');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Quick validation check
   */
  static isValidTripRequest(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): boolean {
    const result = this.validateTripParameters(startLocation, endLocation, travelDays, tripStyle);
    return result.isValid;
  }
}
