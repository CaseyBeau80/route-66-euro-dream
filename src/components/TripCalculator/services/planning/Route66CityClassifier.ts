
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';

export interface CityClassification {
  tier: 'major' | 'standard' | 'minor';
  importance: number;
  isHistoric: boolean;
  isRecommended: boolean;
}

export class Route66CityClassifier {
  /**
   * Classify a city based on its properties
   */
  static classifyCity(stop: TripStop): CityClassification {
    // Default classification
    const classification: CityClassification = {
      tier: 'standard',
      importance: 5,
      isHistoric: false,
      isRecommended: false
    };
    
    // Check if it's a destination city
    if (stop.category === 'destination_city') {
      classification.tier = 'major';
      classification.importance = 8;
      classification.isRecommended = true;
      
      // Check for major stops
      if (stop.is_major_stop) {
        classification.importance = 10;
      }
    }
    
    // Check for historic significance
    if (stop.description && 
        (stop.description.toLowerCase().includes('historic') || 
         stop.description.toLowerCase().includes('heritage'))) {
      classification.isHistoric = true;
      classification.importance += 1;
    }
    
    // Check for well-known Route 66 cities
    const cityName = stop.name.toLowerCase();
    if (this.isIconicRoute66City(cityName)) {
      classification.tier = 'major';
      classification.importance += 2;
      classification.isRecommended = true;
    }
    
    // Minor cities
    if (classification.importance < 4) {
      classification.tier = 'minor';
    }
    
    return classification;
  }
  
  /**
   * Check if a city is one of the iconic Route 66 destinations
   */
  private static isIconicRoute66City(cityName: string): boolean {
    const iconicCities = [
      'chicago', 'st. louis', 'springfield', 'tulsa', 
      'oklahoma city', 'amarillo', 'tucumcari', 'santa fe', 
      'albuquerque', 'flagstaff', 'kingman', 'barstow', 
      'san bernardino', 'santa monica'
    ];
    
    return iconicCities.some(city => cityName.includes(city));
  }
  
  /**
   * Get recommended cities for a trip
   */
  static getRecommendedCities(stops: TripStop[], maxCities: number = 5): TripStop[] {
    // Score and sort cities
    const scoredCities = stops
      .map(stop => ({
        stop,
        classification: this.classifyCity(stop),
        score: this.calculateCityScore(stop)
      }))
      .sort((a, b) => b.score - a.score);
    
    // Take top N cities
    return scoredCities
      .slice(0, maxCities)
      .map(item => item.stop);
  }
  
  /**
   * Calculate a score for city selection
   */
  private static calculateCityScore(stop: TripStop): number {
    let score = 0;
    
    // Base score by category
    if (stop.category === 'destination_city') score += 10;
    if (stop.is_major_stop) score += 5;
    
    // Population bonus (if available)
    if (stop.population) {
      if (stop.population > 500000) score += 3;
      else if (stop.population > 100000) score += 2;
      else if (stop.population > 50000) score += 1;
    }
    
    // Iconic city bonus
    if (this.isIconicRoute66City(stop.name.toLowerCase())) {
      score += 4;
    }
    
    return score;
  }
  
  /**
   * Get city tier distribution for a trip plan
   */
  static analyzeCityDistribution(tripPlan: TripPlan): {
    majorCities: number;
    standardCities: number;
    minorCities: number;
    historicCities: number;
  } {
    let majorCities = 0;
    let standardCities = 0;
    let minorCities = 0;
    let historicCities = 0;
    
    // Extract all stops from segments
    const allStops: TripStop[] = [];
    tripPlan.segments?.forEach(segment => {
      if (segment.stops) {
        allStops.push(...segment.stops);
      }
    });
    
    // Classify each stop
    allStops.forEach(stop => {
      const classification = this.classifyCity(stop);
      
      if (classification.tier === 'major') majorCities++;
      else if (classification.tier === 'standard') standardCities++;
      else if (classification.tier === 'minor') minorCities++;
      
      if (classification.isHistoric) historicCities++;
    });
    
    return {
      majorCities,
      standardCities,
      minorCities,
      historicCities
    };
  }

  /**
   * Get iconic pair bonus for consecutive cities
   */
  static getIconicPairBonus(city1: TripStop, city2: TripStop): number {
    const iconicPairs = [
      ['chicago', 'st. louis'],
      ['st. louis', 'tulsa'],
      ['tulsa', 'oklahoma city'],
      ['oklahoma city', 'amarillo'],
      ['amarillo', 'albuquerque'],
      ['albuquerque', 'flagstaff'],
      ['flagstaff', 'kingman'],
      ['kingman', 'barstow'],
      ['barstow', 'santa monica']
    ];

    const city1Name = city1.name.toLowerCase();
    const city2Name = city2.name.toLowerCase();

    for (const [first, second] of iconicPairs) {
      if ((city1Name.includes(first) && city2Name.includes(second)) ||
          (city1Name.includes(second) && city2Name.includes(first))) {
        return 25; // High bonus for iconic pairs
      }
    }

    return 0;
  }

  /**
   * Check if route violates the "three minor towns in a row" rule
   */
  static violatesMinorTownRule(route: TripStop[]): boolean {
    let consecutiveMinorCount = 0;

    for (const stop of route) {
      const classification = this.classifyCity(stop);
      
      if (classification.tier === 'minor') {
        consecutiveMinorCount++;
        if (consecutiveMinorCount >= 3) {
          return true;
        }
      } else {
        consecutiveMinorCount = 0;
      }
    }

    return false;
  }

  /**
   * Get state-specific rules for Route 66 planning
   */
  static getStateRules(state: string): { maxGapHours: number; preferredCities: string[] } {
    const stateRules: Record<string, { maxGapHours: number; preferredCities: string[] }> = {
      'Illinois': { maxGapHours: 6, preferredCities: ['Chicago', 'Springfield'] },
      'Missouri': { maxGapHours: 7, preferredCities: ['St. Louis', 'Joplin'] },
      'Kansas': { maxGapHours: 5, preferredCities: ['Galena'] },
      'Oklahoma': { maxGapHours: 8, preferredCities: ['Tulsa', 'Oklahoma City'] },
      'Texas': { maxGapHours: 9, preferredCities: ['Amarillo', 'Shamrock'] },
      'New Mexico': { maxGapHours: 8, preferredCities: ['Tucumcari', 'Albuquerque', 'Santa Fe'] },
      'Arizona': { maxGapHours: 8, preferredCities: ['Flagstaff', 'Kingman', 'Winslow'] },
      'California': { maxGapHours: 7, preferredCities: ['Barstow', 'San Bernardino', 'Santa Monica'] }
    };

    return stateRules[state] || { maxGapHours: 8, preferredCities: [] };
  }
}
