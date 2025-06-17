
import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment } from './TripPlanTypes';
import { CityDisplayService } from '../utils/CityDisplayService';

export class BalancedTripPlanningService {
  static async planBalancedTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`⚖️ BALANCED TRIP PLANNING: ${startCityName} to ${endCityName} in ${tripDays} days`);
    
    // Enhanced city finding with multiple strategies
    const startStop = this.findCityInStops(startCityName, allStops);
    const endStop = this.findCityInStops(endCityName, allStops);
    
    if (!startStop) {
      console.error(`❌ Start location "${startCityName}" not found in Route 66 stops`);
      console.log('🏛️ Available cities:', allStops.map(stop => CityDisplayService.getCityDisplayName(stop)));
      throw new Error(`Start location "${startCityName}" not found in Route 66 stops`);
    }
    
    if (!endStop) {
      console.error(`❌ End location "${endCityName}" not found in Route 66 stops`);
      console.log('🏛️ Available cities:', allStops.map(stop => CityDisplayService.getCityDisplayName(stop)));
      throw new Error(`End location "${endCityName}" not found in Route 66 stops`);
    }

    console.log(`✅ Found stops: ${startStop.name} → ${endStop.name}`);

    // Get the sequence order for route planning
    const startSequence = startStop.sequence_order || 0;
    const endSequence = endStop.sequence_order || 0;
    
    // Filter stops between start and end
    const routeStops = allStops
      .filter(stop => {
        const sequence = stop.sequence_order || 0;
        return sequence >= Math.min(startSequence, endSequence) && 
               sequence <= Math.max(startSequence, endSequence);
      })
      .sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

    // If traveling westbound (higher sequence to lower), reverse the order
    if (startSequence > endSequence) {
      routeStops.reverse();
    }

    console.log(`🛣️ Route stops found: ${routeStops.length} cities`);

    // Calculate total distance (rough estimate based on Route 66 total distance)
    const totalDistance = this.calculateTotalDistance(startStop, endStop);
    
    // Distribute stops across days
    const segments = this.distributeStopsAcrossDays(routeStops, tripDays, totalDistance);
    
    return {
      startCity: startCityName,
      endCity: endCityName,
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: segments.reduce((total, seg) => total + seg.driveTimeHours, 0),
      segments,
      lastUpdated: new Date()
    };
  }

  /**
   * Enhanced city finding with multiple matching strategies
   */
  private static findCityInStops(searchTerm: string, allStops: TripStop[]): TripStop | undefined {
    if (!searchTerm || !allStops?.length) return undefined;

    console.log(`🔍 BALANCED SERVICE: Looking for "${searchTerm}" among ${allStops.length} stops`);

    // Strategy 1: Direct exact match on display name (City, State format)
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      if (displayName.toLowerCase().trim() === searchTerm.toLowerCase().trim()) {
        console.log(`✅ BALANCED SERVICE: Direct display name match: ${displayName}`);
        return stop;
      }
    }

    // Strategy 2: Direct exact match on stop name
    for (const stop of allStops) {
      if (stop.name.toLowerCase().trim() === searchTerm.toLowerCase().trim()) {
        console.log(`✅ BALANCED SERVICE: Direct stop name match: ${stop.name}`);
        return stop;
      }
    }

    // Strategy 3: Parse city, state and match components
    const { city: searchCity, state: searchState } = this.parseCityState(searchTerm);
    
    if (searchState) {
      for (const stop of allStops) {
        const stopCityName = stop.city_name || stop.city || stop.name || '';
        const cleanStopCity = stopCityName.replace(/,\s*[A-Z]{2}$/, '').trim();
        
        const cityMatch = cleanStopCity.toLowerCase() === searchCity.toLowerCase();
        const stateMatch = stop.state.toLowerCase() === searchState.toLowerCase();
        
        if (cityMatch && stateMatch) {
          console.log(`✅ BALANCED SERVICE: Component match: ${cleanStopCity}, ${stop.state}`);
          return stop;
        }
      }
    }

    // Strategy 4: City-only match (for cases where state is omitted)
    const cityOnlyMatches = allStops.filter(stop => {
      const stopCityName = stop.city_name || stop.city || stop.name || '';
      const cleanStopCity = stopCityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      return cleanStopCity.toLowerCase() === searchCity.toLowerCase();
    });

    if (cityOnlyMatches.length === 1) {
      console.log(`✅ BALANCED SERVICE: Single city match: ${cityOnlyMatches[0].name}`);
      return cityOnlyMatches[0];
    } else if (cityOnlyMatches.length > 1) {
      // Apply Route 66 preference for ambiguous cities
      const route66Preference = this.getRoute66Preference(searchCity);
      if (route66Preference) {
        const preferredMatch = cityOnlyMatches.find(match => 
          match.state.toUpperCase() === route66Preference.state.toUpperCase()
        );
        if (preferredMatch) {
          console.log(`✅ BALANCED SERVICE: Route 66 preference: ${preferredMatch.name}, ${preferredMatch.state}`);
          return preferredMatch;
        }
      }
      
      // Return first match if no preference found
      console.log(`✅ BALANCED SERVICE: First of multiple matches: ${cityOnlyMatches[0].name}`);
      return cityOnlyMatches[0];
    }

    console.log(`❌ BALANCED SERVICE: No match found for: "${searchTerm}"`);
    return undefined;
  }

  /**
   * Parse city and state from input string
   */
  private static parseCityState(input: string): { city: string; state: string } {
    if (!input) return { city: '', state: '' };
    
    const parts = input.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1]
      };
    }
    
    return {
      city: input.trim(),
      state: ''
    };
  }

  /**
   * Get Route 66 preference for ambiguous cities
   */
  private static getRoute66Preference(cityName: string): { state: string } | null {
    const preferences: Record<string, string> = {
      'chicago': 'IL',
      'springfield': 'IL', // Route 66 starts in Springfield, IL
      'oklahoma city': 'OK',
      'amarillo': 'TX',
      'albuquerque': 'NM',
      'flagstaff': 'AZ'
    };
    
    const normalizedCity = cityName.toLowerCase().trim();
    const preferredState = preferences[normalizedCity];
    
    return preferredState ? { state: preferredState } : null;
  }

  /**
   * Calculate total distance between start and end points
   */
  private static calculateTotalDistance(startStop: TripStop, endStop: TripStop): number {
    // Use Haversine formula for distance calculation
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

  /**
   * Distribute stops across the specified number of days
   */
  private static distributeStopsAcrossDays(
    routeStops: TripStop[], 
    tripDays: number, 
    totalDistance: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const avgDistancePerDay = totalDistance / tripDays;
    
    let currentDay = 1;
    let currentStopIndex = 0;
    
    while (currentDay <= tripDays && currentStopIndex < routeStops.length - 1) {
      const startStop = routeStops[currentStopIndex];
      
      // Calculate how many stops to include for this day
      let endStopIndex = currentStopIndex + 1;
      if (currentDay < tripDays) {
        // For all days except the last, try to distribute evenly
        endStopIndex = Math.min(
          currentStopIndex + Math.ceil((routeStops.length - currentStopIndex) / (tripDays - currentDay + 1)),
          routeStops.length - 1
        );
      } else {
        // Last day - go to the final destination
        endStopIndex = routeStops.length - 1;
      }
      
      const endStop = routeStops[endStopIndex];
      const segmentDistance = this.calculateTotalDistance(startStop, endStop);
      const driveTimeHours = segmentDistance / 50; // Assume 50 mph average
      
      segments.push({
        day: currentDay,
        startCity: startStop.name,
        endCity: endStop.name,
        distance: segmentDistance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        approximateMiles: segmentDistance,
        destination: endStop,
        recommendedStops: routeStops.slice(currentStopIndex + 1, endStopIndex),
        attractions: [],
        notes: `Day ${currentDay}: Travel from ${startStop.name} to ${endStop.name}`,
        recommendations: []
      });
      
      currentStopIndex = endStopIndex;
      currentDay++;
    }
    
    return segments;
  }
}
