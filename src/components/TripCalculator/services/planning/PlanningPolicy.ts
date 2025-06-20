
export interface PlanningAdjustment {
  type: 'days_increased' | 'days_decreased' | 'route_modified' | 'constraints_applied';
  reason: string;
  originalValue: any;
  newValue: any;
  impact: 'low' | 'medium' | 'high';
}

export interface ConstraintResult {
  finalDays: number;
  adjustments: PlanningAdjustment[];
  warnings: string[];
}

export interface PlanningInput {
  startLocation: string;
  endLocation: string;
  requestedDays: number;
  tripStyle: string;
  availableStops: any[];
  routeStops: any[];
}

export class PlanningPolicy {
  private static readonly MIN_DAYS = 2;
  private static readonly MAX_DAILY_MILES = 500;
  private static readonly RECOMMENDED_MAX_HOURS = 8;

  /**
   * Apply planning constraints and return adjusted parameters
   */
  applyConstraints(input: PlanningInput): ConstraintResult {
    console.log(`📋 PLANNING POLICY: Applying constraints to ${input.requestedDays} day trip`);
    
    const adjustments: PlanningAdjustment[] = [];
    const warnings: string[] = [];
    let finalDays = input.requestedDays;

    // Validate minimum days
    if (finalDays < this.constructor.MIN_DAYS) {
      adjustments.push({
        type: 'days_increased',
        reason: `Minimum ${this.constructor.MIN_DAYS} days required for any Route 66 trip`,
        originalValue: finalDays,
        newValue: this.constructor.MIN_DAYS,
        impact: 'high'
      });
      finalDays = this.constructor.MIN_DAYS;
    }

    // Add warning for limited stops
    if (input.routeStops.length < input.requestedDays - 1) {
      warnings.push(`Limited destination options available: ${input.routeStops.length} stops for ${input.requestedDays} day trip`);
    }

    console.log(`📋 POLICY RESULT: ${input.requestedDays} → ${finalDays} days, ${adjustments.length} adjustments, ${warnings.length} warnings`);

    return {
      finalDays,
      adjustments,
      warnings
    };
  }
}
