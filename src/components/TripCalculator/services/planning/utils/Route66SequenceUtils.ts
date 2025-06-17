
import { TripStop } from '../../types/TripStop';

export interface SequenceInfo {
  order: number | null;
  isKnown: boolean;
  source: 'explicit' | 'longitude' | 'unknown';
}

export class Route66SequenceUtils {
  /**
   * Get detailed sequence information for a stop
   */
  static getSequenceInfo(stop: TripStop): SequenceInfo {
    if (stop.sequence_order !== undefined && stop.sequence_order !== null) {
      return {
        order: stop.sequence_order,
        isKnown: true,
        source: 'explicit'
      };
    }

    if (stop.longitude !== undefined && stop.longitude !== null) {
      // Approximate sequence based on longitude
      const approximateOrder = Math.round((stop.longitude + 100) * 10);
      return {
        order: approximateOrder,
        isKnown: false,
        source: 'longitude'
      };
    }

    return {
      order: null,
      isKnown: false,
      source: 'unknown'
    };
  }

  /**
   * Sort stops by Route 66 sequence order
   */
  static sortBySequence(stops: TripStop[], direction: 'east-to-west' | 'west-to-east' = 'west-to-east'): TripStop[] {
    const sortedStops = [...stops].sort((a, b) => {
      const aInfo = this.getSequenceInfo(a);
      const bInfo = this.getSequenceInfo(b);

      // Prioritize stops with known sequence order
      if (aInfo.isKnown && !bInfo.isKnown) return -1;
      if (!aInfo.isKnown && bInfo.isKnown) return 1;

      // Sort by sequence order
      if (aInfo.order !== null && bInfo.order !== null) {
        return direction === 'east-to-west' ? bInfo.order - aInfo.order : aInfo.order - bInfo.order;
      }

      // Fallback to alphabetical
      return a.name.localeCompare(b.name);
    });

    console.log(`🔄 SEQUENCE SORT: Sorted ${stops.length} stops ${direction}`);
    return sortedStops;
  }

  /**
   * Find the next logical stop in sequence
   */
  static findNextInSequence(
    currentStop: TripStop,
    candidateStops: TripStop[],
    finalDestination: TripStop,
    maxSequenceGap: number = 100
  ): TripStop | null {
    const currentInfo = this.getSequenceInfo(currentStop);
    const finalInfo = this.getSequenceInfo(finalDestination);

    if (currentInfo.order === null || finalInfo.order === null) {
      console.log('⚠️ SEQUENCE: Cannot determine sequence without order information');
      return null;
    }

    const isEastToWest = finalInfo.order < currentInfo.order;
    
    let bestStop: TripStop | null = null;
    let bestSequenceDistance = Number.MAX_VALUE;

    for (const stop of candidateStops) {
      const stopInfo = this.getSequenceInfo(stop);
      
      if (stopInfo.order === null) continue;

      // Check if stop is in the right direction
      const isValidDirection = isEastToWest 
        ? stopInfo.order < currentInfo.order && stopInfo.order >= finalInfo.order
        : stopInfo.order > currentInfo.order && stopInfo.order <= finalInfo.order;

      if (!isValidDirection) continue;

      // Check sequence gap
      const sequenceGap = Math.abs(stopInfo.order - currentInfo.order);
      if (sequenceGap > maxSequenceGap) continue;

      // Find closest in sequence
      if (sequenceGap < bestSequenceDistance) {
        bestSequenceDistance = sequenceGap;
        bestStop = stop;
      }
    }

    if (bestStop) {
      console.log(`🎯 SEQUENCE: Found next stop ${bestStop.name} (gap: ${bestSequenceDistance})`);
    } else {
      console.log('❌ SEQUENCE: No valid next stop found in sequence');
    }

    return bestStop;
  }

  /**
   * Calculate optimal sequence-based spacing for multiple stops
   */
  static calculateOptimalSpacing(
    startStop: TripStop,
    endStop: TripStop,
    intermediateCount: number
  ): number[] {
    const startInfo = this.getSequenceInfo(startStop);
    const endInfo = this.getSequenceInfo(endStop);

    if (startInfo.order === null || endInfo.order === null) {
      console.log('⚠️ SPACING: Cannot calculate without sequence order');
      return [];
    }

    const totalSequenceDistance = Math.abs(endInfo.order - startInfo.order);
    const segmentSize = totalSequenceDistance / (intermediateCount + 1);

    const targetSequences: number[] = [];
    for (let i = 1; i <= intermediateCount; i++) {
      const targetSequence = startInfo.order + (segmentSize * i * (endInfo.order > startInfo.order ? 1 : -1));
      targetSequences.push(Math.round(targetSequence));
    }

    console.log(`📏 SPACING: Calculated ${intermediateCount} target sequences: ${targetSequences.join(', ')}`);
    return targetSequences;
  }

  /**
   * Detect sequence violations in a trip plan
   */
  static detectSequenceViolations(stops: TripStop[]): {
    hasViolations: boolean;
    backtrackingCount: number;
    overshootingCount: number;
    details: Array<{ from: string; to: string; violation: string }>;
  } {
    const details: Array<{ from: string; to: string; violation: string }> = [];
    let backtrackingCount = 0;
    let overshootingCount = 0;

    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      const final = stops[stops.length - 1];

      const currentInfo = this.getSequenceInfo(current);
      const nextInfo = this.getSequenceInfo(next);
      const finalInfo = this.getSequenceInfo(final);

      if (currentInfo.order === null || nextInfo.order === null || finalInfo.order === null) {
        continue;
      }

      const isEastToWest = finalInfo.order < currentInfo.order;

      if (isEastToWest) {
        if (nextInfo.order > currentInfo.order) {
          backtrackingCount++;
          details.push({
            from: current.name,
            to: next.name,
            violation: 'backtracking'
          });
        }
      } else {
        if (nextInfo.order < currentInfo.order) {
          backtrackingCount++;
          details.push({
            from: current.name,
            to: next.name,
            violation: 'backtracking'
          });
        }
      }
    }

    return {
      hasViolations: details.length > 0,
      backtrackingCount,
      overshootingCount,
      details
    };
  }
}
