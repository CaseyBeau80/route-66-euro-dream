
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteOrderService {
  // CORRECTED Route 66 order - Chicago to Santa Monica (WEST TO EAST CORRECTED)
  private static readonly ROUTE_66_ORDER = [
    'Chicago',         // Starting point - Illinois
    'Joliet',          // Illinois  
    'Wilmington',      // Illinois
    'Braidwood',       // Illinois
    'Pontiac',         // Illinois - CRITICAL: Include Pontiac
    'Bloomington',     // Illinois
    'Springfield_IL',  // Springfield, Illinois (first Springfield)
    'Litchfield',      // Illinois
    'Hamel',           // Illinois
    'St. Louis',       // Missouri border
    'Pacific',         // Missouri
    'Sullivan',        // Missouri
    'Bourbon',         // Missouri
    'Cuba',            // Missouri
    'Rolla',           // Missouri
    'Lebanon',         // Missouri
    'Springfield_MO',  // Springfield, Missouri (second Springfield)
    'Carthage',        // Missouri
    'Joplin',          // Missouri/Kansas border
    'Galena',          // Kansas
    'Riverton',        // Kansas
    'Baxter Springs',  // Kansas
    'Commerce',        // Oklahoma
    'Miami',           // Oklahoma
    'Vinita',          // Oklahoma
    'Chelsea',         // Oklahoma
    'Claremore',       // Oklahoma
    'Catoosa',         // Oklahoma
    'Tulsa',           // Oklahoma
    'Sapulpa',         // Oklahoma
    'Stroud',          // Oklahoma
    'Chandler',        // Oklahoma
    'Arcadia',         // Oklahoma
    'Oklahoma City',   // Oklahoma
    'El Reno',         // Oklahoma
    'Hydro',           // Oklahoma
    'Weatherford',     // Oklahoma
    'Clinton',         // Oklahoma
    'Canute',          // Oklahoma
    'Elk City',        // Oklahoma/Texas border
    'Sayre',           // Oklahoma
    'Erick',           // Oklahoma
    'Texola',          // Oklahoma
    'Shamrock',        // Texas
    'McLean',          // Texas
    'Groom',           // Texas
    'Conway',          // Texas
    'Amarillo',        // Texas
    'Wildorado',       // Texas
    'Vega',            // Texas
    'Adrian',          // Texas
    'Glenrio',         // Texas/New Mexico border
    'San Jon',         // New Mexico
    'Tucumcari',       // New Mexico - BRANCH POINT for Santa Fe
    'Montoya',         // New Mexico
    'Newkirk',         // New Mexico
    'Cuervo',          // New Mexico
    'Santa Rosa',      // BRANCH CONNECTION POINT
    'Romeroville',     // New Mexico (on Santa Fe branch)
    'Pecos',           // New Mexico (on Santa Fe branch)
    'Glorieta',        // New Mexico (on Santa Fe branch)
    'Santa Fe',        // SANTA FE BRANCH - Historical capital
    'La Bajada',       // New Mexico (rejoining route)
    'Santo Domingo',   // New Mexico (rejoining route)
    'Algodones',       // New Mexico (rejoining route)
    'Bernalillo',      // New Mexico (rejoining route)
    'Albuquerque',     // New Mexico - Major junction
    'Los Lunas',       // New Mexico
    'Belen',           // New Mexico
    'Rio Puerco',      // New Mexico
    'Laguna',          // New Mexico
    'Budville',        // New Mexico
    'Cubero',          // New Mexico
    'San Fidel',       // New Mexico
    'McCarty',         // New Mexico
    'Grants',          // New Mexico
    'Milan',           // New Mexico
    'Prewitt',         // New Mexico
    'Thoreau',         // New Mexico
    'Continental Divide', // New Mexico
    'Gallup',          // New Mexico/Arizona border
    'Manuelito',       // New Mexico
    'Lupton',          // Arizona
    'Houck',           // Arizona
    'Sanders',         // Arizona
    'Chambers',        // Arizona
    'Navajo',          // Arizona
    'Joseph City',     // Arizona
    'Holbrook',        // Arizona
    'Sun Valley',      // Arizona
    'Winslow',         // Arizona
    'Winona',          // Arizona
    'Flagstaff',       // Arizona
    'Bellemont',       // Arizona
    'Williams',        // Arizona
    'Ash Fork',        // Arizona
    'Crookton Road',   // Arizona
    'Seligman',        // Arizona
    'Peach Springs',   // Arizona
    'Truxton',         // Arizona
    'Valentine',       // Arizona
    'Hackberry',       // Arizona
    'Kingman',         // Arizona/California border
    'Oatman',          // Arizona
    'Topock',          // Arizona
    'Needles',         // California
    'Goffs',           // California
    'Fenner',          // California
    'Essex',           // California
    'Chambless',       // California
    'Amboy',           // California
    'Bagdad',          // California
    'Ludlow',          // California
    'Newberry Springs', // California
    'Daggett',         // California
    'Barstow',         // California
    'Lenwood',         // California
    'Hodge',           // California
    'Helendale',       // California
    'Oro Grande',      // California
    'Victorville',     // California
    'Cajon Pass',      // California
    'San Bernardino',  // California
    'Rialto',          // California
    'Fontana',         // California
    'Rancho Cucamonga', // California
    'Upland',          // California
    'Claremont',       // California
    'La Verne',        // California
    'San Dimas',       // California
    'Glendora',        // California
    'Azusa',           // California
    'Duarte',          // California
    'Monrovia',        // California
    'Arcadia',         // California
    'Pasadena',        // California
    'Los Angeles',     // California
    'Santa Monica'     // End point - Pacific Ocean
  ];

  static categorizeAndSortCities(cities: DestinationCity[]): {
    mainRouteCities: DestinationCity[];
    santaFeCity: DestinationCity | null;
    albuquerqueCity: DestinationCity | null;
  } {
    console.log('🔧 DEBUG: CORRECTED Route 66 ordering - Chicago to Santa Monica with proper Santa Fe branch');
    console.log('🔧 DEBUG: Input cities:', cities.map(c => `${c.name}, ${c.state}`));
    
    // Find Santa Fe and Albuquerque for reference
    const santaFeCity = cities.find(city => 
      city.name.toLowerCase().includes('santa fe') && city.state === 'NM'
    ) || null;

    const albuquerqueCity = cities.find(city => 
      city.name.toLowerCase().includes('albuquerque') && city.state === 'NM'
    ) || null;

    console.log('🔧 DEBUG: Santa Fe branch cities found:', {
      santaFe: !!santaFeCity,
      albuquerque: !!albuquerqueCity
    });

    // ALL cities are part of the main route
    const mainRouteCandidates = cities;

    // Sort all cities according to CORRECTED Route 66 order
    const orderedMainCities: DestinationCity[] = [];
    const usedCities = new Set<string>();
    
    console.log('🛣️ CORRECTED ROUTE: Chicago → Joliet → Pontiac → Springfield IL → St. Louis → Springfield MO → Joplin → Tulsa → Oklahoma City → Elk City → Amarillo → Tucumcari → Santa Rosa → Santa Fe → Albuquerque → Gallup → Flagstaff → Williams → Kingman → Barstow → San Bernardino → Santa Monica');
    
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
        console.log(`✅ Found ${matchingCity.name} (${matchingCity.state}) for position: ${expectedCityName}`);
        
        // Special logging for Santa Fe branch flow
        if (expectedCityName === 'Santa Rosa') {
          console.log('🔧 DEBUG: Santa Rosa positioned for connection to Santa Fe');
        }
        if (expectedCityName === 'Santa Fe') {
          console.log('🔧 DEBUG: Santa Fe positioned in MAIN ROUTE');
        }
        if (expectedCityName === 'Albuquerque') {
          console.log('🔧 DEBUG: Albuquerque positioned in MAIN ROUTE');
        }
        if (expectedCityName === 'Gallup') {
          console.log('🔧 DEBUG: Gallup positioned after Albuquerque');
        }
      } else {
        console.warn(`⚠️ Could not find city for expected position: ${expectedCityName}`);
      }
    }
    
    console.log('🎯 CORRECTED Route 66 order with proper Chicago to Santa Monica flow');
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
