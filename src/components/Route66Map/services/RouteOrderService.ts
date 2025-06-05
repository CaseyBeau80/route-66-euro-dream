
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteOrderService {
  // Route 66 order INCLUDING Albuquerque in main route for Santa Fe branch flow
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
    'Santa Rosa',      // BRANCH CONNECTION POINT
    'Santa Fe',        // INCLUDED in main route for flowing branch
    'Albuquerque',     // INCLUDED in main route for flowing branch
    'Gallup',          // New Mexico/Arizona border - continues from Albuquerque
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
    console.log('🔧 DEBUG: Starting city categorization - Albuquerque INCLUDED in main route for Santa Fe branch flow');
    console.log('🔧 DEBUG: Input cities:', cities.map(c => `${c.name}, ${c.state}`));
    
    // Find Santa Fe and Albuquerque for reference (both will be in main route now)
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    const albuquerqueCity = cities.find(city => 
      city.name.toLowerCase().includes('albuquerque') && city.state === 'NM'
    ) || null;

    console.log('🔧 DEBUG: Santa Fe branch cities found in main route:', {
      santaFe: !!santaFeCity,
      albuquerque: !!albuquerqueCity
    });

    // ALL cities are now part of the main route (no exclusions)
    const mainRouteCandidates = cities;

    console.log('🔧 DEBUG: All cities included in main route for flowing Santa Fe branch:', 
      mainRouteCandidates.map(c => `${c.name}, ${c.state}`)
    );

    // Sort all cities according to Route 66 order (including Santa Fe and Albuquerque)
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🛣️ MAIN ROUTE: Santa Rosa → Santa Fe → Albuquerque → Gallup FLOWING');
    
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
        
        // Special logging for Santa Fe branch flow
        if (expectedCityName === 'Santa Rosa') {
          console.log('🔧 DEBUG: Santa Rosa positioned for FLOWING connection to Santa Fe');
        }
        if (expectedCityName === 'Santa Fe') {
          console.log('🔧 DEBUG: Santa Fe positioned in MAIN ROUTE for flowing branch');
        }
        if (expectedCityName === 'Albuquerque') {
          console.log('🔧 DEBUG: Albuquerque positioned in MAIN ROUTE for flowing branch');
        }
        if (expectedCityName === 'Gallup') {
          console.log('🔧 DEBUG: Gallup positioned for FLOWING connection from Albuquerque');
        }
      } else {
        console.warn(`⚠️ Could not find city for expected position: ${expectedCityName}`);
      }
    }
    
    // Final validation of Santa Fe branch flow
    const santaRosaIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const santaFeIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('santa fe')
    );
    const albuquerqueIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('albuquerque')
    );
    const gallupIndex = orderedMainCities.findIndex(city => 
      city.name.toLowerCase().includes('gallup')
    );
    
    console.log('🔧 DEBUG: Santa Fe branch flow validation:', {
      totalCitiesOrdered: orderedMainCities.length,
      santaRosaIndex,
      santaFeIndex,
      albuquerqueIndex,
      gallupIndex,
      flowingBranch: santaRosaIndex !== -1 && santaFeIndex !== -1 && albuquerqueIndex !== -1 && gallupIndex !== -1 &&
                     santaFeIndex === santaRosaIndex + 1 && albuquerqueIndex === santaFeIndex + 1 && gallupIndex === albuquerqueIndex + 1
    });
    
    console.log('🎯 Final route order INCLUDES Santa Fe branch in main route for continuous flow');
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
