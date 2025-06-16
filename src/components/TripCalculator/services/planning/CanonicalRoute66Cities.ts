
import { TripStop } from '../data/SupabaseDataService';

export interface CanonicalDestination {
  name: string;
  state: string;
  tier: 'major' | 'secondary' | 'essential';
  priority: number;
  description: string;
  forcedInclusion: boolean; // Whether this city must be included in destination-focused trips
}

export class CanonicalRoute66Cities {
  /**
   * Canonical Route 66 destination cities ordered by sequence
   */
  private static readonly CANONICAL_DESTINATIONS: CanonicalDestination[] = [
    // Illinois
    { name: 'Chicago', state: 'Illinois', tier: 'major', priority: 100, description: 'The beginning of Route 66', forcedInclusion: true },
    
    // Missouri
    { name: 'Springfield', state: 'Missouri', tier: 'major', priority: 90, description: 'Historic Route 66 hub', forcedInclusion: true },
    { name: 'St. Louis', state: 'Missouri', tier: 'major', priority: 95, description: 'Gateway to the West', forcedInclusion: true },
    
    // Kansas
    { name: 'Baxter Springs', state: 'Kansas', tier: 'secondary', priority: 70, description: 'First Kansas stop', forcedInclusion: false },
    
    // Oklahoma
    { name: 'Tulsa', state: 'Oklahoma', tier: 'major', priority: 85, description: 'Oil capital heritage', forcedInclusion: true },
    { name: 'Oklahoma City', state: 'Oklahoma', tier: 'major', priority: 88, description: 'State capital and Route 66 center', forcedInclusion: true },
    
    // Texas
    { name: 'Amarillo', state: 'Texas', tier: 'major', priority: 82, description: 'Cadillac Ranch and Panhandle culture', forcedInclusion: true },
    
    // New Mexico
    { name: 'Santa Fe', state: 'New Mexico', tier: 'major', priority: 80, description: 'Historic southwestern culture', forcedInclusion: true },
    { name: 'Albuquerque', state: 'New Mexico', tier: 'major', priority: 83, description: 'Breaking Bad fame and Route 66 heritage', forcedInclusion: true },
    
    // Arizona
    { name: 'Flagstaff', state: 'Arizona', tier: 'major', priority: 78, description: 'Grand Canyon gateway', forcedInclusion: true },
    { name: 'Williams', state: 'Arizona', tier: 'secondary', priority: 75, description: 'Gateway to Grand Canyon', forcedInclusion: false },
    
    // California
    { name: 'Barstow', state: 'California', tier: 'secondary', priority: 65, description: 'Desert crossroads', forcedInclusion: false },
    { name: 'Los Angeles', state: 'California', tier: 'major', priority: 98, description: 'The end of Route 66', forcedInclusion: true },
    { name: 'Santa Monica', state: 'California', tier: 'major', priority: 97, description: 'Route 66 terminus at the Pacific', forcedInclusion: true }
  ];

  /**
   * Get all canonical destinations
   */
  static getCanonicalDestinations(): CanonicalDestination[] {
    return [...this.CANONICAL_DESTINATIONS];
  }

  /**
   * Get forced inclusion destinations (must be included in destination-focused trips)
   */
  static getForcedInclusionDestinations(): CanonicalDestination[] {
    return this.CANONICAL_DESTINATIONS.filter(dest => dest.forcedInclusion);
  }

  /**
   * Get major tier destinations
   */
  static getMajorDestinations(): CanonicalDestination[] {
    return this.CANONICAL_DESTINATIONS.filter(dest => dest.tier === 'major');
  }

  /**
   * Check if a city is a canonical destination
   */
  static isCanonicalDestination(cityName: string, state: string): boolean {
    return this.CANONICAL_DESTINATIONS.some(dest => 
      dest.name.toLowerCase().includes(cityName.toLowerCase()) &&
      dest.state.toLowerCase() === state.toLowerCase()
    );
  }

  /**
   * Get canonical destination info for a city
   */
  static getDestinationInfo(cityName: string, state: string): CanonicalDestination | null {
    return this.CANONICAL_DESTINATIONS.find(dest => 
      dest.name.toLowerCase().includes(cityName.toLowerCase()) &&
      dest.state.toLowerCase() === state.toLowerCase()
    ) || null;
  }

  /**
   * Match TripStops to canonical destinations
   */
  static matchStopsToCanonical(stops: TripStop[]): TripStop[] {
    const canonicalStops: TripStop[] = [];
    
    for (const canonical of this.CANONICAL_DESTINATIONS) {
      const matchingStop = stops.find(stop => 
        (stop.name.toLowerCase().includes(canonical.name.toLowerCase()) ||
         stop.city_name.toLowerCase().includes(canonical.name.toLowerCase())) &&
        stop.state.toLowerCase() === canonical.state.toLowerCase()
      );
      
      if (matchingStop) {
        canonicalStops.push(matchingStop);
      }
    }
    
    return canonicalStops;
  }

  /**
   * Force inclusion of priority destinations for destination-focused trips
   */
  static enforceDestinationInclusion(
    selectedStops: TripStop[],
    availableStops: TripStop[],
    maxDays: number
  ): TripStop[] {
    console.log(`🎯 CANONICAL: Enforcing destination inclusion for ${maxDays} days`);
    
    const forcedDestinations = this.getForcedInclusionDestinations();
    const canonicalStops = this.matchStopsToCanonical(availableStops);
    const result: TripStop[] = [...selectedStops];
    
    // Calculate how many forced destinations we can include based on trip days
    const maxForcedInclusions = Math.min(forcedDestinations.length, maxDays - 1);
    const priorityDestinations = forcedDestinations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxForcedInclusions);
    
    console.log(`🎯 CANONICAL: Attempting to include ${priorityDestinations.length} priority destinations`);
    
    for (const canonical of priorityDestinations) {
      // Check if already included
      const alreadyIncluded = result.some(stop => 
        (stop.name.toLowerCase().includes(canonical.name.toLowerCase()) ||
         stop.city_name.toLowerCase().includes(canonical.name.toLowerCase())) &&
        stop.state.toLowerCase() === canonical.state.toLowerCase()
      );
      
      if (!alreadyIncluded) {
        // Find matching stop in available stops
        const matchingStop = canonicalStops.find(stop => 
          (stop.name.toLowerCase().includes(canonical.name.toLowerCase()) ||
           stop.city_name.toLowerCase().includes(canonical.name.toLowerCase())) &&
          stop.state.toLowerCase() === canonical.state.toLowerCase()
        );
        
        if (matchingStop && result.length < maxDays - 1) {
          result.push(matchingStop);
          console.log(`✅ CANONICAL: Forced inclusion of ${canonical.name}, ${canonical.state} (priority: ${canonical.priority})`);
        }
      } else {
        console.log(`✅ CANONICAL: ${canonical.name}, ${canonical.state} already included`);
      }
    }
    
    console.log(`🎯 CANONICAL: Final result includes ${result.length} destinations`);
    return result;
  }

  /**
   * Get priority score for a destination city
   */
  static getPriorityScore(cityName: string, state: string): number {
    const canonical = this.getDestinationInfo(cityName, state);
    return canonical ? canonical.priority : 0;
  }

  /**
   * Get summary of canonical destination coverage
   */
  static getDestinationCoverage(selectedStops: TripStop[]): {
    totalCanonical: number;
    includedCanonical: number;
    majorIncluded: number;
    forcedIncluded: number;
    coverage: number;
  } {
    const canonicalDestinations = this.getCanonicalDestinations();
    const majorDestinations = this.getMajorDestinations();
    const forcedDestinations = this.getForcedInclusionDestinations();
    
    let includedCanonical = 0;
    let majorIncluded = 0;
    let forcedIncluded = 0;
    
    for (const stop of selectedStops) {
      const canonical = this.getDestinationInfo(stop.city_name || stop.name, stop.state);
      if (canonical) {
        includedCanonical++;
        if (canonical.tier === 'major') majorIncluded++;
        if (canonical.forcedInclusion) forcedIncluded++;
      }
    }
    
    const coverage = (includedCanonical / canonicalDestinations.length) * 100;
    
    return {
      totalCanonical: canonicalDestinations.length,
      includedCanonical,
      majorIncluded,
      forcedIncluded,
      coverage: Math.round(coverage)
    };
  }
}
