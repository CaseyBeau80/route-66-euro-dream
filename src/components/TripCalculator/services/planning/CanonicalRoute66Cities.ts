
import { TripStop } from '../../types/TripStop';

export interface CanonicalDestination {
  name: string;
  state: string;
  tier: 'major' | 'significant' | 'notable';
  priority: number;
  forcedInclusion: boolean;
}

export class CanonicalRoute66Cities {
  private static readonly CANONICAL_DESTINATIONS: CanonicalDestination[] = [
    { name: 'Chicago', state: 'IL', tier: 'major', priority: 100, forcedInclusion: true },
    { name: 'Springfield', state: 'IL', tier: 'significant', priority: 85, forcedInclusion: false },
    { name: 'St. Louis', state: 'MO', tier: 'major', priority: 95, forcedInclusion: true },
    { name: 'Tulsa', state: 'OK', tier: 'significant', priority: 80, forcedInclusion: false },
    { name: 'Oklahoma City', state: 'OK', tier: 'major', priority: 90, forcedInclusion: true },
    { name: 'Amarillo', state: 'TX', tier: 'significant', priority: 85, forcedInclusion: false },
    { name: 'Santa Fe', state: 'NM', tier: 'major', priority: 90, forcedInclusion: true },
    { name: 'Albuquerque', state: 'NM', tier: 'significant', priority: 85, forcedInclusion: false },
    { name: 'Flagstaff', state: 'AZ', tier: 'significant', priority: 80, forcedInclusion: false },
    { name: 'Los Angeles', state: 'CA', tier: 'major', priority: 100, forcedInclusion: true }
  ];

  /**
   * Match available stops to canonical destinations with null safety
   */
  static matchStopsToCanonical(availableStops: TripStop[]): TripStop[] {
    if (!availableStops || !Array.isArray(availableStops)) {
      console.error('❌ CanonicalRoute66Cities: Invalid availableStops parameter');
      return [];
    }

    const canonicalStops: TripStop[] = [];

    for (const canonical of this.CANONICAL_DESTINATIONS) {
      const matchingStop = availableStops.find(stop => {
        if (!stop || !stop.city_name || !stop.state) {
          return false;
        }
        
        return stop.city_name.toLowerCase().includes(canonical.name.toLowerCase()) &&
               stop.state.toUpperCase() === canonical.state.toUpperCase();
      });

      if (matchingStop) {
        canonicalStops.push(matchingStop);
      }
    }

    console.log(`🏛️ CanonicalRoute66Cities: Matched ${canonicalStops.length} canonical destinations`);
    return canonicalStops;
  }

  /**
   * Get destination info for a city with null safety
   */
  static getDestinationInfo(cityName: string, state: string): CanonicalDestination | null {
    if (!cityName || !state) {
      return null;
    }

    return this.CANONICAL_DESTINATIONS.find(dest => 
      cityName.toLowerCase().includes(dest.name.toLowerCase()) &&
      state.toUpperCase() === dest.state.toUpperCase()
    ) || null;
  }

  /**
   * Enforce destination inclusion with safety checks
   */
  static enforceDestinationInclusion(
    currentSelection: TripStop[],
    availableStops: TripStop[],
    maxDestinations: number
  ): TripStop[] {
    if (!currentSelection || !availableStops) {
      console.error('❌ CanonicalRoute66Cities: Invalid parameters for enforceDestinationInclusion');
      return currentSelection || [];
    }

    const enhanced = [...currentSelection];
    const usedIds = new Set(currentSelection.map(stop => stop?.id).filter(Boolean));

    // Add forced inclusion destinations if there's room
    for (const canonical of this.CANONICAL_DESTINATIONS) {
      if (enhanced.length >= maxDestinations) break;
      
      if (canonical.forcedInclusion) {
        const matchingStop = availableStops.find(stop => {
          if (!stop || !stop.city_name || !stop.state || usedIds.has(stop.id)) {
            return false;
          }
          
          return stop.city_name.toLowerCase().includes(canonical.name.toLowerCase()) &&
                 stop.state.toUpperCase() === canonical.state.toUpperCase();
        });

        if (matchingStop) {
          enhanced.push(matchingStop);
          usedIds.add(matchingStop.id);
        }
      }
    }

    return enhanced;
  }
}
