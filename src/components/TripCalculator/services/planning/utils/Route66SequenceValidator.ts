import { DailySegment } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';

export interface SequenceValidationResult {
  isValid: boolean;
  reason: string;
  sequenceGap?: number;
  recommendedAction?: string;
}

export class Route66SequenceValidator {
  /**
   * Validate that a proposed stop maintains proper Route 66 sequence
   */
  static validateSequence(
    currentStop: TripStop,
    proposedStop: TripStop,
    finalDestination: TripStop
  ): SequenceValidationResult {
    // Get sequence orders
    const currentOrder = this.getSequenceOrder(currentStop);
    const proposedOrder = this.getSequenceOrder(proposedStop);
    const finalOrder = this.getSequenceOrder(finalDestination);

    console.log(`🔍 SEQUENCE VALIDATION: Current(${currentOrder}) → Proposed(${proposedOrder}) → Final(${finalOrder})`);

    // Check if we have valid sequence orders
    if (currentOrder === null || proposedOrder === null || finalOrder === null) {
      return {
        isValid: true, // Allow if sequence order is unknown
        reason: 'Unknown sequence order - allowing stop'
      };
    }

    // Determine if we're going east-to-west or west-to-east
    const isEastToWest = finalOrder < currentOrder;
    const expectedDirection = isEastToWest ? 'decreasing' : 'increasing';

    console.log(`🧭 DIRECTION: ${isEastToWest ? 'East-to-West' : 'West-to-East'} (${expectedDirection} sequence)`);

    // Validate sequence progression
    if (isEastToWest) {
      // Going east-to-west: sequence should decrease
      if (proposedOrder > currentOrder) {
        return {
          isValid: false,
          reason: `Backtracking detected: proposed stop (${proposedOrder}) is east of current stop (${currentOrder})`,
          sequenceGap: proposedOrder - currentOrder,
          recommendedAction: 'Skip this stop or find alternative in correct direction'
        };
      }
      
      if (proposedOrder < finalOrder) {
        return {
          isValid: false,
          reason: `Overshooting detected: proposed stop (${proposedOrder}) is west of final destination (${finalOrder})`,
          sequenceGap: finalOrder - proposedOrder,
          recommendedAction: 'Find intermediate stop between current and final destination'
        };
      }
    } else {
      // Going west-to-east: sequence should increase
      if (proposedOrder < currentOrder) {
        return {
          isValid: false,
          reason: `Backtracking detected: proposed stop (${proposedOrder}) is west of current stop (${currentOrder})`,
          sequenceGap: currentOrder - proposedOrder,
          recommendedAction: 'Skip this stop or find alternative in correct direction'
        };
      }
      
      if (proposedOrder > finalOrder) {
        return {
          isValid: false,
          reason: `Overshooting detected: proposed stop (${proposedOrder}) is east of final destination (${finalOrder})`,
          sequenceGap: proposedOrder - finalOrder,
          recommendedAction: 'Find intermediate stop between current and final destination'
        };
      }
    }

    // Calculate sequence gap for progress tracking
    const sequenceGap = Math.abs(proposedOrder - currentOrder);

    return {
      isValid: true,
      reason: `Valid ${expectedDirection} progression: ${currentOrder} → ${proposedOrder}`,
      sequenceGap,
      recommendedAction: sequenceGap > 50 ? 'Consider intermediate stop for better pacing' : undefined
    };
  }

  /**
   * Get the sequence order for a stop
   */
  private static getSequenceOrder(stop: TripStop): number | null {
    if (stop.sequence_order !== undefined && stop.sequence_order !== null) {
      return stop.sequence_order;
    }
    
    // Fallback to approximate sequence based on longitude (Route 66 generally runs east-west)
    if (stop.longitude !== undefined && stop.longitude !== null) {
      // Convert longitude to approximate sequence (higher longitude = further west = higher sequence)
      // This is a rough approximation for stops without explicit sequence_order
      return Math.round((stop.longitude + 100) * 10); // Normalize and scale
    }
    
    return null;
  }

  /**
   * Filter stops to only those that maintain valid sequence
   */
  static filterValidSequenceStops(
    currentStop: TripStop,
    candidateStops: TripStop[],
    finalDestination: TripStop
  ): { validStops: TripStop[]; rejectedStops: Array<{ stop: TripStop; reason: string }> } {
    const validStops: TripStop[] = [];
    const rejectedStops: Array<{ stop: TripStop; reason: string }> = [];

    for (const stop of candidateStops) {
      const validation = this.validateSequence(currentStop, stop, finalDestination);
      
      if (validation.isValid) {
        validStops.push(stop);
      } else {
        rejectedStops.push({ stop, reason: validation.reason });
        console.log(`🚫 SEQUENCE REJECT: ${stop.name} - ${validation.reason}`);
      }
    }

    console.log(`✅ SEQUENCE FILTER: ${validStops.length} valid, ${rejectedStops.length} rejected`);
    return { validStops, rejectedStops };
  }

  /**
   * Check if a sequence of stops maintains proper Route 66 order
   */
  static validateTripSequence(stops: TripStop[]): {
    isValid: boolean;
    violations: Array<{ fromIndex: number; toIndex: number; reason: string }>;
  } {
    const violations: Array<{ fromIndex: number; toIndex: number; reason: string }> = [];

    for (let i = 0; i < stops.length - 1; i++) {
      const currentStop = stops[i];
      const nextStop = stops[i + 1];
      const finalDestination = stops[stops.length - 1];

      const validation = this.validateSequence(currentStop, nextStop, finalDestination);
      
      if (!validation.isValid) {
        violations.push({
          fromIndex: i,
          toIndex: i + 1,
          reason: validation.reason
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
