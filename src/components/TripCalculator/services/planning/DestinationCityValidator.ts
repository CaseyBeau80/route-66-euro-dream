import { TripStop } from '../../types/TripStop';

export class DestinationCityValidator {
  private static readonly MAJOR_DESTINATION_CITIES = new Set([
    'Chicago', 'St. Louis', 'Oklahoma City', 'Amarillo', 'Albuquerque', 
    'Flagstaff', 'Las Vegas', 'Los Angeles', 'Santa Monica', 'Barstow',
    'Needles', 'Winslow', 'Gallup', 'Santa Fe', 'Tucumcari', 'Elk City',
    'Clinton', 'Joplin', 'Springfield', 'Lebanon', 'Cuba', 'Pontiac',
    'Bloomington', 'Lincoln', 'Litchfield', 'Staunton', 'Edwardsville'
  ]);

  private static readonly IMPORTANCE_SCORES = new Map([
    ['Chicago', 100],
    ['St. Louis', 95],
    ['Oklahoma City', 90],
    ['Amarillo', 85],
    ['Albuquerque', 90],
    ['Flagstaff', 85],
    ['Las Vegas', 80],
    ['Los Angeles', 100],
    ['Santa Monica', 95],
    ['Barstow', 70],
    ['Needles', 65],
    ['Winslow', 75],
    ['Gallup', 70],
    ['Santa Fe', 80],
    ['Tucumcari', 65],
    ['Elk City', 60],
    ['Clinton', 65],
    ['Joplin', 70],
    ['Springfield', 75],
    ['Lebanon', 60],
    ['Cuba', 55],
    ['Pontiac', 70],
    ['Bloomington', 65],
    ['Lincoln', 60],
    ['Litchfield', 55],
    ['Staunton', 55],
    ['Edwardsville', 50]
  ]);

  /**
   * Filter and validate destination cities
   */
  static filterValidDestinationCities(destinationCities: TripStop[]): TripStop[] {
    return destinationCities.filter(city => this.isValidDestinationCity(city));
  }

  /**
   * Check if a city is a valid destination city
   */
  static isValidDestinationCity(city: TripStop): boolean {
    if (!city || !city.name) return false;
    
    // Must be categorized as destination city
    if (city.category !== 'destination_city') return false;
    
    // Must have valid coordinates
    if (!city.latitude || !city.longitude) return false;
    
    // Check if it's a recognized major destination
    const cityName = this.normalizeCityName(city.name);
    
    return this.MAJOR_DESTINATION_CITIES.has(cityName) || 
           city.is_major_stop === true ||
           this.hasHighImportanceIndicators(city);
  }

  /**
   * Get importance score for a destination city
   */
  static getDestinationImportanceScore(city: TripStop): number {
    const cityName = this.normalizeCityName(city.name);
    const baseScore = this.IMPORTANCE_SCORES.get(cityName) || 40;
    
    // Bonuses for additional indicators
    let bonus = 0;
    if (city.is_major_stop) bonus += 20;
    if (city.description?.includes('historic')) bonus += 10;
    if (city.description?.includes('Route 66')) bonus += 15;
    
    return Math.min(100, baseScore + bonus);
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
   * Check for high importance indicators
   */
  private static hasHighImportanceIndicators(city: TripStop): boolean {
    if (!city.description) return false;
    
    const description = city.description.toLowerCase();
    const importanceKeywords = [
      'major city', 'state capital', 'historic route 66', 'mother road',
      'famous', 'iconic', 'legendary', 'birthplace', 'terminus'
    ];
    
    return importanceKeywords.some(keyword => description.includes(keyword));
  }

  /**
   * Sort destination cities by importance and route position
   */
  static sortDestinationCitiesByPriority(
    cities: TripStop[],
    currentStop: TripStop,
    finalDestination: TripStop
  ): TripStop[] {
    return cities
      .map(city => ({
        city,
        importance: this.getDestinationImportanceScore(city),
        // Add geographic sorting logic here if needed
      }))
      .sort((a, b) => b.importance - a.importance)
      .map(item => item.city);
  }
}
