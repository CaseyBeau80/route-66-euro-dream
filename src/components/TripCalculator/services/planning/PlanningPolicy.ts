
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';

export interface PlanningConstraint {
  name: string;
  priority: number;
  validate: (params: PlanningConstraintParams) => ConstraintResult;
}

export interface PlanningConstraintParams {
  startLocation: string;
  endLocation: string;
  requestedDays: number;
  tripStyle: string;
  availableStops: TripStop[];
  routeStops?: TripStop[];
}

export interface ConstraintResult {
  isValid: boolean;
  adjustedDays?: number;
  adjustmentReason?: string;
  warningMessage?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface PlanningAdjustment {
  type: 'day_reduction' | 'day_increase' | 'route_change';
  originalValue: number;
  adjustedValue: number;
  reason: string;
  constraint: string;
}

export class PlanningPolicy {
  private constraints: PlanningConstraint[] = [];

  constructor() {
    // Register constraints in priority order (higher priority = applied first)
    this.registerConstraint({
      name: 'destination_cities_constraint',
      priority: 100,
      validate: this.validateDestinationCitiesConstraint.bind(this)
    });

    this.registerConstraint({
      name: 'minimum_days_constraint',
      priority: 90,
      validate: this.validateMinimumDaysConstraint.bind(this)
    });

    this.registerConstraint({
      name: 'maximum_days_constraint',
      priority: 80,
      validate: this.validateMaximumDaysConstraint.bind(this)
    });
  }

  registerConstraint(constraint: PlanningConstraint): void {
    this.constraints.push(constraint);
    this.constraints.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Apply all planning constraints and return adjustments
   */
  applyConstraints(params: PlanningConstraintParams): {
    finalDays: number;
    adjustments: PlanningAdjustment[];
    warnings: string[];
    isValid: boolean;
  } {
    console.log(`🎯 POLICY: Applying planning constraints for ${params.requestedDays} days`);
    
    const adjustments: PlanningAdjustment[] = [];
    const warnings: string[] = [];
    let currentDays = params.requestedDays;
    let isValid = true;

    for (const constraint of this.constraints) {
      const result = constraint.validate({
        ...params,
        requestedDays: currentDays
      });

      if (!result.isValid) {
        if (result.adjustedDays && result.adjustedDays !== currentDays) {
          adjustments.push({
            type: result.adjustedDays < currentDays ? 'day_reduction' : 'day_increase',
            originalValue: currentDays,
            adjustedValue: result.adjustedDays,
            reason: result.adjustmentReason || 'Constraint violation',
            constraint: constraint.name
          });
          
          currentDays = result.adjustedDays;
          console.log(`🔧 POLICY: ${constraint.name} adjusted days: ${params.requestedDays} → ${currentDays}`);
        }

        if (result.warningMessage) {
          warnings.push(result.warningMessage);
        }

        if (result.errorMessage) {
          isValid = false;
          warnings.push(result.errorMessage);
        }
      }
    }

    console.log(`✅ POLICY: Final planning result:`, {
      originalDays: params.requestedDays,
      finalDays: currentDays,
      adjustments: adjustments.length,
      warnings: warnings.length,
      isValid
    });

    return {
      finalDays: currentDays,
      adjustments,
      warnings,
      isValid
    };
  }

  /**
   * Destination Cities Constraint - Cap days to available major destinations
   */
  private validateDestinationCitiesConstraint(params: PlanningConstraintParams): ConstraintResult {
    if (params.tripStyle !== 'destination-focused') {
      return { isValid: true };
    }

    // Get major destination cities along the route
    const routeStops = params.routeStops || params.availableStops;
    const majorDestinations = this.getMajorDestinationCities(routeStops, params.startLocation, params.endLocation);
    
    console.log(`🏛️ CONSTRAINT: Destination cities analysis:`, {
      requestedDays: params.requestedDays,
      majorDestinations: majorDestinations.length,
      cities: majorDestinations.map(d => `${d.name} (${d.state})`)
    });

    // Maximum days = major destinations + 1 (for travel segments)
    const maxDaysFromDestinations = majorDestinations.length + 1;

    if (params.requestedDays > maxDaysFromDestinations) {
      return {
        isValid: false,
        adjustedDays: maxDaysFromDestinations,
        adjustmentReason: `Limited to ${majorDestinations.length} major Route 66 heritage cities between your start and end points`,
        warningMessage: `Trip automatically adjusted from ${params.requestedDays} to ${maxDaysFromDestinations} days to match available major heritage destinations along your route.`
      };
    }

    return { isValid: true };
  }

  /**
   * Minimum Days Constraint
   */
  private validateMinimumDaysConstraint(params: PlanningConstraintParams): ConstraintResult {
    const minDays = 1;
    
    if (params.requestedDays < minDays) {
      return {
        isValid: false,
        adjustedDays: minDays,
        adjustmentReason: `Minimum trip duration is ${minDays} day`,
        errorMessage: `Trip duration must be at least ${minDays} day`
      };
    }

    return { isValid: true };
  }

  /**
   * Maximum Days Constraint
   */
  private validateMaximumDaysConstraint(params: PlanningConstraintParams): ConstraintResult {
    const maxDays = 14;
    
    if (params.requestedDays > maxDays) {
      return {
        isValid: false,
        adjustedDays: maxDays,
        adjustmentReason: `Maximum supported trip duration is ${maxDays} days`,
        warningMessage: `Trip duration capped at ${maxDays} days for optimal planning`
      };
    }

    return { isValid: true };
  }

  /**
   * Get major destination cities along the route
   */
  private getMajorDestinationCities(stops: TripStop[], startLocation: string, endLocation: string): TripStop[] {
    const majorCities = [
      'Chicago', 'Springfield', 'St. Louis', 'Tulsa', 'Oklahoma City', 
      'Amarillo', 'Santa Fe', 'Albuquerque', 'Flagstaff', 'Los Angeles', 'Santa Monica'
    ];

    return stops.filter(stop => {
      const cityName = stop.city_name || stop.name || '';
      const isDestinationCity = stop.category === 'destination_city' || stop.is_major_stop;
      const isMajorCity = majorCities.some(major => 
        cityName.toLowerCase().includes(major.toLowerCase())
      );

      return (isDestinationCity || isMajorCity) && 
             cityName.toLowerCase() !== startLocation.toLowerCase() &&
             cityName.toLowerCase() !== endLocation.toLowerCase();
    });
  }
}
