
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteOrderService {
  // Updated Route 66 order with Santa Fe branch integration - ALBUQUERQUE REMOVED
  private static readonly ROUTE_66_ORDER = [
    'Chicago',         // Starting point - Illinois
    'Joliet',          // Illinois
    'Pontiac',         // CRITICAL: Pontiac, IL must be included
    'Springfield_IL',  // Springfield, Illinois (first Springfield)
    'St. Louis',       // Missouri border
    'Cuba',            // Missouri
    'Springfield_MO',  // Springfield, Missouri (second Springfield)
    'Joplin',          // Missouri/Kansas border
    'Tulsa',           // Oklahoma
    'Oklahoma City',
    'Elk City',        // Oklahoma/Texas border
    'Shamrock',        // Texas
    'Amarillo',
    'Tucumcari',       // New Mexico - BRANCH POINT for Santa Fe
    'Santa Rosa',      // DIRECT CONNECTION - no Albuquerque
    'Gallup',          // New Mexico/Arizona border - SKIP Albuquerque
    'Holbrook',        // Arizona
    'Winslow',
    'Flagstaff',
    'Williams',
    'Seligman',
    'Kingman',         // Arizona/California border
    'Needles',         // California
    'Barstow',
    'San Bernardino',
    'Santa Monica'     // End point
  ];

  static categorizeAndSortCities(cities: DestinationCity[]): {
    mainRouteCities: DestinationCity[];
    santaFeCity: DestinationCity | null;
  } {
    // Find Santa Fe
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    // Get main route cities (excluding Santa Fe)
    const mainRouteCandidates = cities.filter(city => 
      !(city.name.toLowerCase().includes('santa fe') && city.state === 'NM')
    );

    // Sort main route cities according to Route 66 order
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🔍 Available cities for main route matching:', mainRouteCandidates.map(c => `${c.name}, ${c.state}`));
    console.log('🛣️ UPDATED ROUTE: Albuquerque removed, Santa Rosa → Gallup direct connection');
    
    for (const expectedCityName of this.ROUTE_66_ORDER) {
      let matchingCity: DestinationCity | undefined;
      
      // Handle Springfield special cases
      if (expectedCityName === 'Springfield_IL') {
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'IL';
        });
      } else if (expectedCityName === 'Springfield_MO') {
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          return !usedCities.has(cityKey) && 
                 city.name.toLowerCase().includes('springfield') && 
                 city.state === 'MO';
        });
      } else {
        // Find matching city (case insensitive, partial match)
        matchingCity = mainRouteCandidates.find(city => {
          const cityKey = `${city.name}-${city.state}`;
          if (usedCities.has(cityKey)) return false;
          
          const cityName = city.name.toLowerCase();
          const expectedName = expectedCityName.toLowerCase();
          
          return cityName.includes(expectedName) || expectedName.includes(cityName);
        });
      }
      
      if (matchingCity) {
        orderedMainCities.push(matchingCity);
        usedCities.add(`${matchingCity.name}-${matchingCity.state}`);
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for main route position: ${expectedCityName}`);
      }
    }
    
    console.log('🎯 Final route order excludes Albuquerque, connects Santa Rosa → Gallup directly');
    
    return {
      mainRouteCities: orderedMainCities,
      santaFeCity
    };
  }
}
