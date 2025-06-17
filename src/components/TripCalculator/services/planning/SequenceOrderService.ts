
import { TripStop } from '../../types/TripStop';

export class SequenceOrderService {
  /**
   * Get sequence order for a stop, with fallback to longitude-based approximation
   */
  static getSequenceOrder(stop: TripStop): number {
    if (stop.sequence_order !== undefined && stop.sequence_order !== null) {
      return stop.sequence_order;
    }
    
    // Fallback: approximate sequence based on longitude (Route 66 runs east-west)
    // Higher longitude (further west) = higher sequence order
    if (stop.longitude !== undefined && stop.longitude !== null) {
      return Math.round((stop.longitude + 100) * 10);
    }
    
    console.warn(`⚠️ No sequence order or longitude for ${stop.name}`);
    return 0;
  }

  /**
   * Determine trip direction based on start and end sequence orders
   */
  static getTripDirection(startStop: TripStop, endStop: TripStop): 'eastbound' | 'westbound' {
    const startOrder = this.getSequenceOrder(startStop);
    const endOrder = this.getSequenceOrder(endStop);
    
    return endOrder > startOrder ? 'westbound' : 'eastbound';
  }

  /**
   * Filter stops that maintain proper sequence progression
   */
  static filterStopsInSequence(
    currentStop: TripStop,
    candidateStops: TripStop[],
    direction: 'eastbound' | 'westbound'
  ): TripStop[] {
    const currentOrder = this.getSequenceOrder(currentStop);
    
    return candidateStops.filter(stop => {
      const stopOrder = this.getSequenceOrder(stop);
      
      if (direction === 'westbound') {
        // For westbound, only allow stops with higher or equal sequence order
        return stopOrder >= currentOrder;
      } else {
        // For eastbound, only allow stops with lower or equal sequence order
        return stopOrder <= currentOrder;
      }
    });
  }

  /**
   * Sort stops by sequence order for the given direction
   */
  static sortBySequence(stops: TripStop[], direction: 'eastbound' | 'westbound'): TripStop[] {
    const sorted = [...stops].sort((a, b) => {
      const aOrder = this.getSequenceOrder(a);
      const bOrder = this.getSequenceOrder(b);
      
      return direction === 'westbound' ? aOrder - bOrder : bOrder - aOrder;
    });
    
    console.log(`🔄 Sorted ${stops.length} stops for ${direction} travel`);
    return sorted;
  }

  /**
   * Select the next logical stop in sequence
   */
  static selectNextInSequence(
    currentStop: TripStop,
    candidateStops: TripStop[],
    direction: 'eastbound' | 'westbound',
    targetDistance?: number
  ): TripStop | null {
    const validStops = this.filterStopsInSequence(currentStop, candidateStops, direction);
    
    if (validStops.length === 0) {
      console.log(`❌ No valid stops found in ${direction} direction from ${currentStop.name}`);
      return null;
    }

    // Sort by sequence order
    const sortedStops = this.sortBySequence(validStops, direction);
    
    // If no target distance, return the next in sequence
    if (!targetDistance) {
      return sortedStops[0];
    }

    // Find the stop closest to target distance while maintaining sequence
    let bestStop = sortedStops[0];
    let bestScore = Number.MAX_VALUE;

    for (const stop of sortedStops) {
      const distance = this.calculateDistance(currentStop, stop);
      const distanceScore = Math.abs(distance - targetDistance);
      
      if (distanceScore < bestScore) {
        bestScore = distanceScore;
        bestStop = stop;
      }
    }

    console.log(`🎯 Selected ${bestStop.name} (sequence: ${this.getSequenceOrder(bestStop)}) for ${direction} travel`);
    return bestStop;
  }

  /**
   * Validate that a sequence of stops maintains proper progression
   */
  static validateSequenceProgression(stops: TripStop[]): {
    isValid: boolean;
    violations: Array<{ from: string; to: string; reason: string }>;
  } {
    const violations: Array<{ from: string; to: string; reason: string }> = [];
    
    if (stops.length < 2) {
      return { isValid: true, violations: [] };
    }

    const direction = this.getTripDirection(stops[0], stops[stops.length - 1]);
    
    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      
      const currentOrder = this.getSequenceOrder(current);
      const nextOrder = this.getSequenceOrder(next);
      
      let isValidProgression = false;
      
      if (direction === 'westbound') {
        isValidProgression = nextOrder >= currentOrder;
      } else {
        isValidProgression = nextOrder <= currentOrder;
      }
      
      if (!isValidProgression) {
        violations.push({
          from: current.name,
          to: next.name,
          reason: `Invalid ${direction} progression: ${currentOrder} → ${nextOrder}`
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Calculate distance between two stops (helper method)
   */
  private static calculateDistance(stop1: TripStop, stop2: TripStop): number {
    const R = 3958.8; // Earth's radius in miles
    const φ1 = stop1.latitude * Math.PI / 180;
    const φ2 = stop2.latitude * Math.PI / 180;
    const Δφ = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const Δλ = (stop2.longitude - stop1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
