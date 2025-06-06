
import { TripStop } from '../data/SupabaseDataService';

export class DestinationCityValidator {
  // Manual exclusion list for cities that shouldn't be treated as major destinations
  private static EXCLUDED_CITIES = new Set([
    'galena',
    'commerce',
    'riverton',
    'baxter springs',
    'quapaw',
    'miami',
    'vinita',
    'afton',
    'chelsea',
    'foyil',
    'claremore',
    'catoosa',
    'verdigris',
    'inola',
    'sequoyah',
    'sallisaw',
    'roland',
    'muldrow',
    'arkoma',
    'spiro',
    'panama',
    'pocola',
    'heavener',
    'howe',
    'poteau',
    'wister',
    'talihina',
    'clayton',
    'daisy',
    'rattan',
    'snow',
    'antlers',
    'sardis',
    'albion',
    'robbers cave',
    'wilburton',
    'hartshorne',
    'mcalester',
    'krebs',
    'pittsburg',
    'kiowa',
    'savoy',
    'crowder',
    'canadian',
    'eufaula',
    'checotah',
    'henryetta',
    'weleetka',
    'okemah',
    'boley',
    'prague',
    'stroud',
    'davenport',
    'chandler',
    'wellston',
    'luther',
    'arcadia',
    'edmond'
  ]);

  // Minimum population threshold for destination cities
  private static MIN_POPULATION = 15000;

  // Known major Route 66 destination cities (manually curated)
  private static MAJOR_DESTINATIONS = new Set([
    'chicago',
    'st. louis',
    'springfield',
    'joplin',
    'tulsa',
    'oklahoma city',
    'amarillo',
    'albuquerque',
    'santa fe',
    'flagstaff',
    'kingman',
    'barstow',
    'san bernardino',
    'los angeles',
    'santa monica',
    'peoria',
    'bloomington',
    'pontiac',
    'joliet',
    'normal',
    'lebanon',
    'rolla',
    'carthage',
    'webb city',
    'sapulpa',
    'stroud',
    'yukon',
    'el reno',
    'clinton',
    'elk city',
    'sayre',
    'shamrock',
    'mclean',
    'groom',
    'panhandle',
    'conway',
    'vega',
    'adrian',
    'tucumcari',
    'santa rosa',
    'las vegas',
    'romeroville',
    'glorieta',
    'lamy',
    'moriarty',
    'tijeras',
    'laguna',
    'grants',
    'gallup',
    'lupton',
    'chambers',
    'holbrook',
    'winslow',
    'winona',
    'two guns',
    'meteor city',
    'diablo canyon',
    'canyon diablo',
    'williams',
    'ash fork',
    'seligman',
    'peach springs',
    'truxton',
    'valentine',
    'hackberry',
    'yucca',
    'topock',
    'golden shores',
    'oatman',
    'needles',
    'goffs',
    'fenner',
    'essex',
    'amboy',
    'bagdad',
    'siberia',
    'klamer',
    'daggett',
    'newberry springs',
    'yermo',
    'oro grande',
    'victorville',
    'hesperia',
    'cajon',
    'devore',
    'rancho cucamonga',
    'upland',
    'claremont',
    'la verne',
    'san dimas',
    'glendora',
    'azusa',
    'duarte',
    'monrovia',
    'arcadia',
    'pasadena'
  ]);

  /**
   * Validate if a stop should be treated as a major destination city
   */
  static isValidDestinationCity(stop: TripStop): boolean {
    const cityName = stop.city_name.toLowerCase().trim();
    const stopName = stop.name.toLowerCase().trim();

    // Check exclusion list first
    if (this.EXCLUDED_CITIES.has(cityName) || this.EXCLUDED_CITIES.has(stopName)) {
      console.log(`🚫 Excluding ${stop.name} from destination cities (in exclusion list)`);
      return false;
    }

    // Check if it's a manually curated major destination
    if (this.MAJOR_DESTINATIONS.has(cityName) || this.MAJOR_DESTINATIONS.has(stopName)) {
      console.log(`✅ ${stop.name} is a validated major destination city`);
      return true;
    }

    // For destination_city category, apply additional validation
    if (stop.category === 'destination_city') {
      // Check population if available (you may need to add this field to your database)
      // For now, we'll use a heuristic based on the exclusion and inclusion lists
      const isSmallTown = this.EXCLUDED_CITIES.has(cityName);
      
      if (isSmallTown) {
        console.log(`🚫 ${stop.name} appears to be a small town, not a major destination`);
        return false;
      }

      console.log(`✅ ${stop.name} validated as destination city`);
      return true;
    }

    return false;
  }

  /**
   * Filter stops to only include valid destination cities
   */
  static filterValidDestinationCities(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => {
      if (stop.category !== 'destination_city') return false;
      return this.isValidDestinationCity(stop);
    });
  }

  /**
   * Get importance score for a destination city (higher = more important)
   */
  static getDestinationImportanceScore(stop: TripStop): number {
    const cityName = stop.city_name.toLowerCase().trim();
    const stopName = stop.name.toLowerCase().trim();

    // Major metropolitan areas get highest scores
    const majorMetros = ['chicago', 'st. louis', 'tulsa', 'oklahoma city', 'amarillo', 'albuquerque', 'flagstaff', 'los angeles', 'santa monica'];
    if (majorMetros.some(metro => cityName.includes(metro) || stopName.includes(metro))) {
      return 100;
    }

    // Important Route 66 cities get high scores
    const importantCities = ['springfield', 'joplin', 'santa fe', 'kingman', 'barstow', 'san bernardino'];
    if (importantCities.some(city => cityName.includes(city) || stopName.includes(city))) {
      return 80;
    }

    // Regional centers get medium scores
    const regionalCenters = ['peoria', 'bloomington', 'pontiac', 'lebanon', 'rolla', 'carthage', 'sapulpa'];
    if (regionalCenters.some(center => cityName.includes(center) || stopName.includes(center))) {
      return 60;
    }

    // Default score for other destination cities
    return 40;
  }
}
