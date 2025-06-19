
import { TripStop } from '../../../types/TripStop';
import { CanonicalRoute66Cities } from '../CanonicalRoute66Cities';
import { Route66SequenceUtils } from './Route66SequenceUtils';
import { DestinationValidator } from './DestinationValidator';

export class DestinationPrioritizer {
  /**
   * Select optimal cities with canonical prioritization
   */
  static selectOptimalCanonicalCities(
    startStop: TripStop,
    endStop: TripStop,
    canonicalCities: TripStop[],
    neededCities: number
  ): TripStop[] {
    if (neededCities <= 0 || canonicalCities.length === 0) {
      return [];
    }

    // Filter to only cities with valid coordinates
    const validCities = canonicalCities.filter(city => DestinationValidator.isValidTripStop(city));

    if (validCities.length <= neededCities) {
      // Use all available canonical cities, sorted by sequence
      return Route66SequenceUtils.sortBySequence(validCities, this.getTripDirection(startStop, endStop));
    }

    // Prioritize canonical cities by their priority score and sequence position
    const prioritizedCities = validCities.map(city => {
      const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
        city.city_name || city.name,
        city.state
      );
      
      const priorityScore = canonicalInfo ? canonicalInfo.priority : 0;
      const isForcedInclusion = canonicalInfo ? canonicalInfo.forcedInclusion : false;
      const isMajor = canonicalInfo ? canonicalInfo.tier === 'major' : false;
      
      // Calculate sequence position score
      const sequenceInfo = Route66SequenceUtils.getSequenceInfo(city);
      const sequenceScore = sequenceInfo.order !== null ? sequenceInfo.order : 0;
      
      // Combined score: priority + forced inclusion bonus + major tier bonus
      let totalScore = priorityScore;
      if (isForcedInclusion) totalScore += 50;
      if (isMajor) totalScore += 25;
      
      return {
        city,
        priorityScore,
        totalScore,
        isForcedInclusion,
        isMajor,
        sequenceScore
      };
    });

    // Sort by total score (highest first), then by sequence for ties
    prioritizedCities.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.sequenceScore - b.sequenceScore;
    });

    // Select top cities
    const selectedCities = prioritizedCities
      .slice(0, neededCities)
      .map(item => item.city);

    console.log(`🎯 CANONICAL PRIORITIZATION: Selected top ${selectedCities.length} cities by priority`);
    prioritizedCities.slice(0, neededCities).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.city.name} (priority: ${item.priorityScore}, total: ${item.totalScore})`);
    });

    // Sort final selection by sequence order
    return Route66SequenceUtils.sortBySequence(selectedCities, this.getTripDirection(startStop, endStop));
  }

  /**
   * Trim selection to top priority destinations
   */
  static trimToTopPriority(destinations: TripStop[], needed: number): TripStop[] {
    if (destinations.length <= needed) return destinations;
    
    // Sort by canonical priority and take top N
    const prioritized = destinations
      .filter(city => DestinationValidator.isValidTripStop(city))
      .map(city => {
        const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
          city.city_name || city.name,
          city.state
        );
        return {
          city,
          priority: canonicalInfo ? canonicalInfo.priority : 0
        };
      });
    
    prioritized.sort((a, b) => b.priority - a.priority);
    
    const trimmed = prioritized.slice(0, needed).map(item => item.city);
    console.log(`✂️ Trimmed to top ${needed} priority destinations`);
    
    return trimmed;
  }

  /**
   * CRITICAL FIX: Get trip direction with comprehensive null/undefined validation
   */
  private static getTripDirection(startStop: TripStop | null | undefined, endStop: TripStop | null | undefined): 'east-to-west' | 'west-to-east' {
    // CRITICAL: Add null/undefined validation first
    if (!startStop || typeof startStop !== 'object') {
      console.warn('⚠️ DIRECTION: Invalid startStop, defaulting to east-to-west:', { startStop, type: typeof startStop });
      return 'east-to-west';
    }

    if (!endStop || typeof endStop !== 'object') {
      console.warn('⚠️ DIRECTION: Invalid endStop, defaulting to east-to-west:', { endStop, type: typeof endStop });
      return 'east-to-west';
    }

    // Additional validation for TripStop structure
    if (!DestinationValidator.isValidTripStop(startStop) || !DestinationValidator.isValidTripStop(endStop)) {
      console.warn('⚠️ DIRECTION: Invalid TripStop objects, defaulting to east-to-west:', {
        startStopValid: DestinationValidator.isValidTripStop(startStop),
        endStopValid: DestinationValidator.isValidTripStop(endStop)
      });
      return 'east-to-west';
    }

    const startInfo = Route66SequenceUtils.getSequenceInfo(startStop);
    const endInfo = Route66SequenceUtils.getSequenceInfo(endStop);
    
    if (startInfo.order !== null && endInfo.order !== null) {
      const direction = endInfo.order < startInfo.order ? 'east-to-west' : 'west-to-east';
      console.log(`🧭 DIRECTION: ${direction} based on sequence orders (${startInfo.order} → ${endInfo.order})`);
      return direction;
    }
    
    // Fallback to longitude with additional safety checks
    if (startStop.longitude !== undefined && startStop.longitude !== null &&
        endStop.longitude !== undefined && endStop.longitude !== null &&
        typeof startStop.longitude === 'number' && typeof endStop.longitude === 'number') {
      const direction = endStop.longitude < startStop.longitude ? 'east-to-west' : 'west-to-east';
      console.log(`🧭 DIRECTION: ${direction} based on longitude (${startStop.longitude} → ${endStop.longitude})`);
      return direction;
    }

    console.warn('⚠️ DIRECTION: No valid sequence or longitude data, defaulting to east-to-west');
    return 'east-to-west';
  }
}
