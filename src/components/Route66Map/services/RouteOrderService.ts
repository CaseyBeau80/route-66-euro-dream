
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteOrderService {
  // Route 66 order EXCLUDING Albuquerque (it's for Santa Fe branch only)
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
    'Santa Rosa',      // DIRECT CONNECTION to Gallup (NO Albuquerque in main route)
    'Gallup',          // New Mexico/Arizona border - DIRECT from Santa Rosa
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
    albuquerqueCity: DestinationCity | null;
  } {
    console.log('🔧 DEBUG: Starting city categorization - Albuquerque EXCLUDED from main route');
    console.log('🔧 DEBUG: Input cities:', cities.map(c => `${c.name}, ${c.state}`));
    
    // Find Santa Fe
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    // Find Albuquerque (for branch only, NOT main route)
    const albuquerqueCity = cities.find(city => 
      city.name.toLowerCase().includes('albuquerque') && city.state === 'NM'
    ) || null;

    console.log('🔧 DEBUG: Branch cities found:', {
      santaFe: !!santaFeCity,
      albuquerque: !!albuquerqueCity
    });

    // Get main route cities (excluding BOTH Santa Fe AND Albuquerque)
    const mainRouteCandidates = cities.filter(city => {
      const isSantaFe = city.name.toLowerCase().includes('santa fe') && city.state === 'NM';
      const isAlbuquerque = city.name.toLowerCase().includes('albuquerque') && city.state === 'NM';
      
      if (isSantaFe) {
        console.log('🔧 DEBUG: Excluding Santa Fe from main route:', city.name);
      }
      if (isAlbuquerque) {
        console.log('🔧 DEBUG: Excluding Albuquerque from main route:', city.name);
      }
      
      return !isSantaFe && !isAlbuquerque;
    });

    console.log('🔧 DEBUG: Main route candidates after exclusions:', 
      mainRouteCandidates.map(c => `${c.name}, ${c.state}`)
    );

    // Sort main route cities according to Route 66 order
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🛣️ MAIN ROUTE: Santa Rosa → Gallup DIRECT (NO Albuquerque)');
    
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
        
        // Special logging for critical connections
        if (expectedCityName === 'Santa Rosa') {
          console.log('🔧 DEBUG: Santa Rosa positioned for DIRECT connection to Gallup');
        }
        if (expectedCityName === 'Gallup') {
          console.log('🔧 DEBUG: Gallup positioned for DIRECT connection from Santa Rosa');
        }
      } else {
        console.warn(`⚠️ Could not find city for expected position: ${expectedCityName}`);
      }
    }
    
    // Final validation
    const santaRosaIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const gallupIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('gallup')
    );
    
    console.log('🔧 DEBUG: Route validation after ordering:', {
      totalCitiesOrdered: orderedMainCities.length,
      albuquerquePresent: false, // Should be false now
      santaRosaIndex,
      gallupIndex,
      directSantaRosaToGallup: santaRosaIndex !== -1 && gallupIndex !== -1 && Math.abs(gallupIndex - santaRosaIndex) === 1
    });
    
    console.log('🎯 Final route order EXCLUDES Albuquerque (for Santa Fe branch only)');
    console.log('🔧 DEBUG: Final ordered cities:', 
      orderedMainCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
    );
    
    return {
      mainRouteCities: orderedMainCities,
      santaFeCity,
      albuquerqueCity
    };
  }
}
