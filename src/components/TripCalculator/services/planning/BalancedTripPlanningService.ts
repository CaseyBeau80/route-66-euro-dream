
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export interface BalancedPlanResult {
  segments: DailySegment[];
  isValid: boolean;
  warnings: string[];
  validationResults: any;
}

export class BalancedTripPlanningService {
  /**
   * Plan a balanced Route 66 trip using the existing segment destination planner
   */
  static async planBalancedTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    allStops: TripStop[]
  ): Promise<BalancedPlanResult> {
    console.log(`⚖️ BALANCED TRIP PLANNING: ${startLocation} to ${endLocation} in ${totalDays} days`);

    const warnings: string[] = [];

    // Find start and end stops
    const startStop = allStops.find(stop =>
      stop.city_name?.toLowerCase().includes(startLocation.toLowerCase()) ||
      stop.name.toLowerCase().includes(startLocation.toLowerCase())
    );

    const endStop = allStops.find(stop =>
      stop.city_name?.toLowerCase().includes(endLocation.toLowerCase()) ||
      stop.name.toLowerCase().includes(endLocation.toLowerCase())
    );

    if (!startStop) {
      throw new Error(`Start location "${startLocation}" not found in Route 66 stops`);
    }

    if (!endStop) {
      throw new Error(`End location "${endLocation}" not found in Route 66 stops`);
    }

    // Filter and enforce sequence
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop,
      endStop,
      destinationCities
    );

    console.log(`✅ Found ${sequenceResult.validStops.length} valid stops in sequence`);

    // Use the existing segment destination planner for balanced approach
    const selectedDestinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      sequenceResult.validStops,
      totalDays
    );

    console.log(`✅ Selected ${selectedDestinations.length} destinations for balanced trip`);

    // Build segments using the selected destinations
    const segments = this.buildSegmentsFromDestinations(
      startStop,
      selectedDestinations,
      endStop
    );

    // Validate sequence
    const sequenceValidation = Route66SequenceEnforcer.validateTripSequence(segments);
    
    if (!sequenceValidation.isValid) {
      warnings.push(...sequenceValidation.violations);
    }

    return {
      segments,
      isValid: warnings.length === 0,
      warnings,
      validationResults: {
        sequenceValidation,
        destinationSelection: SegmentDestinationPlanner.getSelectionSummary(selectedDestinations)
      }
    };
  }

  /**
   * Build segments from selected destinations
   */
  private static buildSegmentsFromDestinations(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    let currentStop = startStop;

    // Create intermediate segments
    destinations.forEach((destination, index) => {
      const segment = this.createDailySegment(
        index + 1,
        currentStop,
        destination
      );
      segments.push(segment);
      currentStop = destination;
    });

    // Create final segment
    const finalSegment = this.createDailySegment(
      destinations.length + 1,
      currentStop,
      endStop
    );
    segments.push(finalSegment);

    return segments;
  }

  /**
   * Create a daily segment
   */
  private static createDailySegment(
    day: number,
    startStop: TripStop,
    endStop: TripStop
  ): DailySegment {
    // This would use the same logic as in other planning services
    // Simplified for now, but should include proper distance calculation
    return {
      day,
      title: `Day ${day}: ${startStop.name} to ${endStop.name}`,
      startCity: `${startStop.city_name || startStop.name}, ${startStop.state}`,
      endCity: `${endStop.city_name || endStop.name}, ${endStop.state}`,
      distance: 200, // Placeholder - should use real calculation
      approximateMiles: 200,
      driveTimeHours: 4,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: [{
        stopId: endStop.id,
        id: endStop.id,
        name: endStop.name,
        description: endStop.description,
        latitude: endStop.latitude,
        longitude: endStop.longitude,
        category: endStop.category,
        city_name: endStop.city_name,
        state: endStop.state,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      attractions: [],
      stops: []
    };
  }
}
