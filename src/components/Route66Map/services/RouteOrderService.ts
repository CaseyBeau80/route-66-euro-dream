import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteOrderService {
  // Route 66 order including Albuquerque for Santa Fe branch connection
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
    'Santa Rosa',      // DIRECT CONNECTION to Gallup
    'Albuquerque',     // Available for Santa Fe branch connection
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
  } {
    console.log('🔧 DEBUG: Starting city categorization with Albuquerque included for Santa Fe branch');
    console.log('🔧 DEBUG: Input cities:', cities.map(c => `${c.name}, ${c.state}`));
    
    // Find Santa Fe
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    console.log('🔧 DEBUG: Santa Fe search result:', {
      found: !!santaFeCity,
      name: santaFeCity?.name,
      state: santaFeCity?.state,
      coordinates: santaFeCity ? `${santaFeCity.latitude}, ${santaFeCity.longitude}` : 'N/A'
    });

    // Get main route cities (excluding only Santa Fe, keeping Albuquerque for branch connection)
    const mainRouteCandidates = cities.filter(city => {
      const isSantaFe = city.name.toLowerCase().includes('santa fe') && city.state === 'NM';
      
      if (isSantaFe) {
        console.log('🔧 DEBUG: Excluding Santa Fe from main route:', city.name);
      }
      
      return !isSantaFe;
    });

    console.log('🔧 DEBUG: Main route candidates after Santa Fe exclusion:', 
      mainRouteCandidates.map(c => `${c.name}, ${c.state}`)
    );

    // Sort main route cities according to Route 66 order
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🔍 Available cities for main route matching:', mainRouteCandidates.map(c => `${c.name}, ${c.state}`));
    console.log('🛣️ UPDATED ROUTE: Albuquerque included for Santa Fe branch connection');
    
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
        if (expectedCityName === 'Albuquerque') {
          console.log('🔧 DEBUG: Albuquerque available for Santa Fe branch connection');
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
    const albuquerqueIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('albuquerque')
    );
    
    console.log('🔧 DEBUG: Route validation after ordering:', {
      totalCitiesOrdered: orderedMainCities.length,
      albuquerquePresent: albuquerqueIndex !== -1,
      santaRosaIndex,
      gallupIndex,
      albuquerqueIndex,
      directSantaRosaToGallup: santaRosaIndex !== -1 && gallupIndex !== -1 && Math.abs(gallupIndex - santaRosaIndex) === 1
    });
    
    console.log('🎯 Final route order includes Albuquerque for Santa Fe branch connection');
    console.log('🔧 DEBUG: Final ordered cities:', 
      orderedMainCities.map((city, index) => `${index + 1}. ${city.name}, ${city.state}`)
    );
    
    return {
      mainRouteCities: orderedMainCities,
      santaFeCity
    };
  }
}
