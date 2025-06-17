import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeConstraintEnforcer } from './DriveTimeConstraintEnforcer';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';

export interface DestinationFocusedPlanResult {
  segments: DailySegment[];
  isValid: boolean;
  warnings: string[];
  validationResults: any;
}

export class DestinationFocusedPlanningService {
  /**
   * Plan a destination-focused Route 66 trip
   */
  static async planDestinationFocusedTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    allStops: TripStop[]
  ): Promise<DestinationFocusedPlanResult> {
    console.log(`🎯 DESTINATION-FOCUSED TRIP: ${startLocation} to ${endLocation} in ${totalDays} days`);

    const warnings: string[] = [];

    // 1. Find the start and end stops
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

    console.log(`✅ Found start and end stops: ${startStop.name} to ${endStop.name}`);

    // 2. Filter to destination cities only
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    console.log(`✅ Filtered to ${destinationCities.length} destination cities`);

    // 3. Enforce Route 66 sequence direction
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop,
      endStop,
      destinationCities
    );

    const validDestinations = sequenceResult.validStops;
    console.log(`✅ Enforced sequence, ${validDestinations.length} valid destinations`);

    // 4. Select top destinations based on distance from start
    const sortedDestinations = validDestinations.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });

    const selectedDestinations = sortedDestinations.slice(0, totalDays - 1);
    console.log(`✅ Selected ${selectedDestinations.length} destinations`);

    // 5. Build the trip segments
    const segments: DailySegment[] = [];
    let currentStop = startStop;

    for (let i = 0; i < selectedDestinations.length; i++) {
      const nextStop = selectedDestinations[i];
      const day = i + 1;

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.name} to ${nextStop.name}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance,
        approximateMiles: Math.round(distance),
        driveTimeHours: distance / 60, // Example calculation
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || 'Unknown'
        }],
        attractions: [],
        stops: []
      };

      segments.push(segment);
      currentStop = nextStop;
    }

    // Add final segment to the end location
    const lastDay = selectedDestinations.length + 1;
    const lastDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const lastSegment: DailySegment = {
      day: lastDay,
      title: `Day ${lastDay}: ${currentStop.name} to ${endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(currentStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: lastDistance,
      approximateMiles: Math.round(lastDistance),
      driveTimeHours: lastDistance / 60, // Example calculation
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

    segments.push(lastSegment);

    // 6. Validate the trip sequence
    const sequenceValidation = Route66SequenceEnforcer.validateTripSequence(segments);

    if (!sequenceValidation.isValid) {
      warnings.push(...sequenceValidation.violations);
    }

    console.log(`✅ Trip planning complete, ${segments.length} segments, ${warnings.length} warnings`);

    return {
      segments,
      isValid: warnings.length === 0,
      warnings,
      validationResults: {
        sequenceValidation
      }
    };
  }
}
