
import { TripStop } from '../../types/TripStop';

export interface CityClassification {
  tier: 'major' | 'secondary' | 'minor';
  importance: number;
  culturalSignificance: number;
  historicalWeight: number;
  stateBonus: number;
}

export interface IconicCityPair {
  city1: string;
  city2: string;
  bonus: number;
  description: string;
}

export class Route66CityClassifier {
  // Major Route 66 destination cities (importance >= 80)
  private static readonly MAJOR_CITIES = new Set([
    'Chicago', 'St. Louis', 'Tulsa', 'Oklahoma City', 'Amarillo', 
    'Albuquerque', 'Flagstaff', 'Las Vegas', 'Los Angeles', 'Santa Monica'
  ]);

  // Secondary cities (importance 60-79)
  private static readonly SECONDARY_CITIES = new Set([
    'Joplin', 'Springfield', 'Clinton', 'Elk City', 'Tucumcari', 
    'Gallup', 'Winslow', 'Barstow', 'Needles', 'Kingman', 'Santa Fe'
  ]);

  // Iconic city pairs that deserve consecutive prioritization
  private static readonly ICONIC_PAIRS: IconicCityPair[] = [
    { city1: 'St. Louis', city2: 'Tulsa', bonus: 60, description: 'Gateway to the West progression' },
    { city1: 'Tulsa', city2: 'Oklahoma City', bonus: 50, description: 'Oklahoma heritage corridor' },
    { city1: 'Oklahoma City', city2: 'Amarillo', bonus: 45, description: 'Great Plains to Panhandle' },
    { city1: 'Amarillo', city2: 'Albuquerque', bonus: 40, description: 'Texas to New Mexico transition' },
    { city1: 'Albuquerque', city2: 'Flagstaff', bonus: 35, description: 'High desert to mountain route' },
    { city1: 'Flagstaff', city2: 'Kingman', bonus: 30, description: 'Arizona mountain corridor' },
    { city1: 'Barstow', city2: 'Los Angeles', bonus: 25, description: 'Final approach to Pacific' }
  ];

  // State-specific bonuses and rules
  private static readonly STATE_RULES = new Map([
    ['TX', { flexibilityBonus: 15, maxGapHours: 12, reason: 'Longer distances between Texas cities' }],
    ['CA', { flexibilityBonus: 10, maxGapHours: 10, reason: 'Modern highway constraints near LA' }],
    ['NM', { santaFeBonus: 20, maxGapHours: 9, reason: 'Santa Fe loop historical significance' }],
    ['AZ', { desertBonus: 12, maxGapHours: 9, reason: 'Desert crossing considerations' }],
    ['OK', { heritageBonus: 18, maxGapHours: 8, reason: 'Heart of Route 66 heritage' }]
  ]);

  /**
   * Classify a city by its Route 66 significance
   */
  static classifyCity(city: TripStop): CityClassification {
    const cityName = this.normalizeCityName(city.name);
    const state = city.state;

    // Determine tier
    let tier: 'major' | 'secondary' | 'minor';
    let baseImportance: number;

    if (this.MAJOR_CITIES.has(cityName)) {
      tier = 'major';
      baseImportance = 85;
    } else if (this.SECONDARY_CITIES.has(cityName)) {
      tier = 'secondary';
      baseImportance = 70;
    } else {
      tier = 'minor';
      baseImportance = 45;
    }

    // Calculate cultural significance
    const culturalSignificance = this.calculateCulturalSignificance(city, cityName);
    
    // Calculate historical weight
    const historicalWeight = this.calculateHistoricalWeight(city, cityName);
    
    // Apply state bonus
    const stateBonus = this.calculateStateBonus(state, cityName);

    // Final importance score
    const importance = Math.min(100, baseImportance + culturalSignificance + historicalWeight + stateBonus);

    return {
      tier,
      importance,
      culturalSignificance,
      historicalWeight,
      stateBonus
    };
  }

  /**
   * Check if two cities form an iconic consecutive pair
   */
  static getIconicPairBonus(city1: TripStop, city2: TripStop): number {
    const name1 = this.normalizeCityName(city1.name);
    const name2 = this.normalizeCityName(city2.name);

    const pair = this.ICONIC_PAIRS.find(p => 
      (p.city1 === name1 && p.city2 === name2) ||
      (p.city1 === name2 && p.city2 === name1)
    );

    return pair ? pair.bonus : 0;
  }

  /**
   * Get state-specific rules for flexibility
   */
  static getStateRules(state: string) {
    return this.STATE_RULES.get(state) || { 
      flexibilityBonus: 0, 
      maxGapHours: 8, 
      reason: 'Standard Route 66 guidelines' 
    };
  }

  /**
   * Check if a sequence violates the "three minor towns in a row" rule
   */
  static violatesMinorTownRule(cities: TripStop[]): boolean {
    if (cities.length < 3) return false;

    for (let i = 0; i <= cities.length - 3; i++) {
      const window = cities.slice(i, i + 3);
      const allMinor = window.every(city => 
        this.classifyCity(city).tier === 'minor'
      );
      
      if (allMinor) {
        console.log(`⚠️ Three minor towns in a row detected: ${window.map(c => c.name).join(' → ')}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Normalize city name for comparison
   */
  private static normalizeCityName(name: string): string {
    return name
      .replace(/,.*$/, '') // Remove state/country part
      .trim()
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Calculate cultural significance score
   */
  private static calculateCulturalSignificance(city: TripStop, cityName: string): number {
    let score = 0;
    const description = (city.description || '').toLowerCase();

    // Major cultural landmarks
    if (['Chicago', 'Los Angeles', 'Santa Fe'].includes(cityName)) score += 15;
    if (['St. Louis', 'Albuquerque', 'Flagstaff'].includes(cityName)) score += 12;
    if (['Tulsa', 'Oklahoma City', 'Amarillo'].includes(cityName)) score += 10;

    // Cultural keywords in description
    const culturalKeywords = ['cultural', 'art', 'music', 'native', 'pueblo', 'trading post'];
    score += culturalKeywords.filter(keyword => description.includes(keyword)).length * 3;

    return Math.min(20, score);
  }

  /**
   * Calculate historical weight score
   */
  private static calculateHistoricalWeight(city: TripStop, cityName: string): number {
    let score = 0;
    const description = (city.description || '').toLowerCase();

    // Historical significance by city
    if (['Chicago', 'Los Angeles'].includes(cityName)) score += 15; // Terminus cities
    if (['St. Louis', 'Oklahoma City'].includes(cityName)) score += 12; // Major historical stops
    if (['Tulsa', 'Amarillo', 'Albuquerque', 'Flagstaff'].includes(cityName)) score += 10;

    // Historical keywords
    const historicalKeywords = ['historic', 'heritage', 'mother road', 'route 66', 'landmark'];
    score += historicalKeywords.filter(keyword => description.includes(keyword)).length * 2;

    // Special Route 66 significance
    if (city.category === 'route66_waypoint') score += 5;
    if (city.is_major_stop) score += 5;

    return Math.min(20, score);
  }

  /**
   * Calculate state-specific bonus
   */
  private static calculateStateBonus(state: string, cityName: string): number {
    const rules = this.STATE_RULES.get(state);
    if (!rules) return 0;

    let bonus = 0;

    // State-specific city bonuses
    if (state === 'NM' && cityName === 'Santa Fe') bonus += rules.santaFeBonus || 0;
    if (state === 'OK' && ['Tulsa', 'Oklahoma City'].includes(cityName)) bonus += rules.heritageBonus || 0;
    if (state === 'TX' && cityName === 'Amarillo') bonus += rules.flexibilityBonus || 0;

    return Math.min(15, bonus);
  }

  /**
   * Get all iconic pairs for reference
   */
  static getIconicPairs(): IconicCityPair[] {
    return [...this.ICONIC_PAIRS];
  }

  /**
   * Generate classification summary for debugging
   */
  static getClassificationSummary(city: TripStop): string {
    const classification = this.classifyCity(city);
    const cityName = this.normalizeCityName(city.name);
    
    return `${cityName}: ${classification.tier.toUpperCase()} (${classification.importance}/100) - ` +
           `Cultural: ${classification.culturalSignificance}, Historical: ${classification.historicalWeight}, ` +
           `State: ${classification.stateBonus}`;
  }
}
