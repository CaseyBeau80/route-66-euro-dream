import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment, RecommendedStop } from './TripPlanTypes';
import { CityDisplayService } from '../utils/CityDisplayService';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export class BalancedTripPlanningService {
  static async planBalancedTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`⚖️ FIXED BALANCED PLANNING: ${startCityName} to ${endCityName} in ${tripDays} days`);
    
    // Find start and end stops
    const startStop = this.findCityInStops(startCityName, allStops);
    const endStop = this.findCityInStops(endCityName, allStops);
    
    if (!startStop || !endStop) {
      throw new Error(`Could not find start (${startCityName}) or end (${endCityName}) locations`);
    }

    console.log(`✅ FOUND: ${startStop.name} → ${endStop.name}`);

    // Enforce Route 66 sequence
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop, endStop, allStops
    );

    if (!sequenceResult.isValidRoute) {
      throw new Error('Invalid Route 66 sequence');
    }

    // Select intermediate destinations following Route 66 order
    const intermediateDestinations = Route66SequenceEnforcer.selectSequentialDestinations(
      startStop, endStop, sequenceResult.validStops, tripDays - 1
    );

    // Build segments with enforced drive times
    const segments = this.buildEnforcedSegments(
      startStop, endStop, intermediateDestinations, tripDays
    );

    const totalDistance = this.calculateTotalDistance(startStop, endStop);
    const totalDrivingTime = segments.reduce((total, seg) => total + seg.driveTimeHours, 0);

    return {
      id: `trip-${Date.now()}`,
      startCity: startCityName,
      endCity: endCityName,
      startDate: new Date(),
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      lastUpdated: new Date()
    };
  }

  /**
   * Build segments with ENFORCED drive time limits
   */
  private static buildEnforcedSegments(
    startStop: TripStop,
    endStop: TripStop,
    intermediateDestinations: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...intermediateDestinations, endStop];
    
    console.log(`🏗️ BUILDING ENFORCED SEGMENTS: ${allStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;

      const distance = this.calculateTotalDistance(currentStop, nextStop);
      const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(distance);

      console.log(`✅ Day ${day}: ${currentStop.name} → ${nextStop.name} = ${distance.toFixed(0)}mi, ${driveTimeHours.toFixed(1)}h`);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        approximateMiles: Math.round(distance),
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description || `Visit ${nextStop.name}`,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || nextStop.name
        }],
        attractions: [],
        notes: `Day ${day}: Drive from ${currentStop.name} to ${nextStop.name}`,
        recommendations: []
      };

      segments.push(segment);
    }

    return segments;
  }

  private static findCityInStops(searchTerm: string, allStops: TripStop[]): TripStop | undefined {
    if (!searchTerm || !allStops?.length) return undefined;

    console.log(`🔍 Looking for "${searchTerm}" among ${allStops.length} stops`);

    // Strategy 1: Direct exact match on display name
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      if (displayName.toLowerCase().trim() === searchTerm.toLowerCase().trim()) {
        console.log(`✅ Direct display name match: ${displayName}`);
        return stop;
      }
    }

    // Strategy 2: Parse and match components
    const { city: searchCity, state: searchState } = CityDisplayService.parseCityStateInput(searchTerm);
    
    if (searchState) {
      for (const stop of allStops) {
        const stopCityName = stop.city_name || stop.city || stop.name || '';
        const cleanStopCity = stopCityName.replace(/,\s*[A-Z]{2}$/, '').trim();
        
        const cityMatch = cleanStopCity.toLowerCase() === searchCity.toLowerCase();
        const stateMatch = stop.state.toLowerCase() === searchState.toLowerCase();
        
        if (cityMatch && stateMatch) {
          console.log(`✅ Component match: ${cleanStopCity}, ${stop.state}`);
          return stop;
        }
      }
    }

    console.log(`❌ No match found for: "${searchTerm}"`);
    return undefined;
  }

  private static calculateTotalDistance(startStop: TripStop, endStop: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(endStop.latitude - startStop.latitude);
    const dLon = this.toRad(endStop.longitude - startStop.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(startStop.latitude)) * Math.cos(this.toRad(endStop.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
