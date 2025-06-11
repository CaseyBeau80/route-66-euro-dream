
/**
 * Extract city and state from a destination string
 */
export function getDestinationCityWithState(destination: string): { city: string; state: string } {
  if (!destination) {
    return { city: '', state: '' };
  }
  
  // Handle formats like "Chicago, IL" or "St. Louis, MO"
  if (destination.includes(',')) {
    const parts = destination.split(',').map(part => part.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || ''
    };
  }
  
  // Enhanced Route 66 city mapping with complete coverage
  const cityStateMap: Record<string, string> = {
    // Illinois
    'Chicago': 'IL',
    'Springfield': 'IL',
    'Joliet': 'IL',
    'Pontiac': 'IL',
    'Bloomington': 'IL',
    'Normal': 'IL',
    'McLean': 'IL',
    'Atlanta': 'IL',
    'Lincoln': 'IL',
    'Williamsville': 'IL',
    'Sherman': 'IL',
    'Riverton': 'IL',
    'Chatham': 'IL',
    'Auburn': 'IL',
    'Thayer': 'IL',
    'Virden': 'IL',
    'Girard': 'IL',
    'Nilwood': 'IL',
    'Carlinville': 'IL',
    'Litchfield': 'IL',
    'Mount Olive': 'IL',
    'Staunton': 'IL',
    'Hamel': 'IL',
    'Edwardsville': 'IL',
    
    // Missouri
    'St. Louis': 'MO',
    'Saint Louis': 'MO',
    'Springfield': 'MO',
    'Joplin': 'MO',
    'Carthage': 'MO',
    'Webb City': 'MO',
    'Halltown': 'MO',
    'Paris Springs': 'MO',
    'Log City': 'MO',
    'Rescue': 'MO',
    'Plano': 'MO',
    'Marshfield': 'MO',
    'Strafford': 'MO',
    'Lebanon': 'MO',
    'Phillipsburg': 'MO',
    'Conway': 'MO',
    'Niangua': 'MO',
    'Buffalo': 'MO',
    'Long Lane': 'MO',
    'Hazelgreen': 'MO',
    'Sleeper': 'MO',
    'Elkland': 'MO',
    'Conway': 'MO',
    'Marshfield': 'MO',
    'Strafford': 'MO',
    'Rolla': 'MO',
    'Doolittle': 'MO',
    'Arlington': 'MO',
    'Devils Elbow': 'MO',
    'Hooker': 'MO',
    'Waynesville': 'MO',
    'Laquey': 'MO',
    'Buckhorn': 'MO',
    'Hazelgreen': 'MO',
    'Lebanon': 'MO',
    
    // Kansas (brief stretch)
    'Galena': 'KS',
    'Riverton': 'KS',
    'Baxter Springs': 'KS',
    
    // Oklahoma
    'Tulsa': 'OK',
    'Oklahoma City': 'OK',
    'Sapulpa': 'OK',
    'Kellyville': 'OK',
    'Bristow': 'OK',
    'Depew': 'OK',
    'Stroud': 'OK',
    'Davenport': 'OK',
    'Chandler': 'OK',
    'Warwick': 'OK',
    'Luther': 'OK',
    'Arcadia': 'OK',
    'Edmond': 'OK',
    'Bethany': 'OK',
    'Yukon': 'OK',
    'El Reno': 'OK',
    'Calumet': 'OK',
    'Geary': 'OK',
    'Hydro': 'OK',
    'Weatherford': 'OK',
    'Clinton': 'OK',
    'Canute': 'OK',
    'Elk City': 'OK',
    'Sayre': 'OK',
    'Erick': 'OK',
    
    // Texas
    'Amarillo': 'TX',
    'Shamrock': 'TX',
    'McLean': 'TX',
    'Alanreed': 'TX',
    'Jericho': 'TX',
    'Groom': 'TX',
    'Conway': 'TX',
    'Amarillo': 'TX',
    'Bushland': 'TX',
    'Wildorado': 'TX',
    'Vega': 'TX',
    'Landergin': 'TX',
    'Adrian': 'TX',
    'Glenrio': 'TX',
    
    // New Mexico
    'Albuquerque': 'NM',
    'Tucumcari': 'NM',
    'Santa Rosa': 'NM',
    'Moriarty': 'NM',
    'Edgewood': 'NM',
    'Tijeras': 'NM',
    'Carnuel': 'NM',
    'Corrales': 'NM',
    'Rio Rancho': 'NM',
    'Bernalillo': 'NM',
    'Algodones': 'NM',
    'Budaghers': 'NM',
    'San Ysidro': 'NM',
    'Jemez Pueblo': 'NM',
    'Cuba': 'NM',
    'Thoreau': 'NM',
    'Continental Divide': 'NM',
    'Prewitt': 'NM',
    'Grants': 'NM',
    'Milan': 'NM',
    'Acoma': 'NM',
    'Paraje': 'NM',
    'Laguna': 'NM',
    'Budville': 'NM',
    'Cubero': 'NM',
    'Villa de Cubero': 'NM',
    'McCarty': 'NM',
    'San Fidel': 'NM',
    'Gallup': 'NM',
    'Manuelito': 'NM',
    
    // Arizona
    'Flagstaff': 'AZ',
    'Holbrook': 'AZ',
    'Winslow': 'AZ',
    'Winona': 'AZ',
    'Lupton': 'AZ',
    'Houck': 'AZ',
    'Sanders': 'AZ',
    'Chambers': 'AZ',
    'Navajo': 'AZ',
    'Joseph City': 'AZ',
    'Holbrook': 'AZ',
    'Sun Valley': 'AZ',
    'Woodruff': 'AZ',
    'Snowflake': 'AZ',
    'Taylor': 'AZ',
    'Snowlow': 'AZ',
    'Winslow': 'AZ',
    'Leupp Corner': 'AZ',
    'Winona': 'AZ',
    'Walnut': 'AZ',
    'Flagstaff': 'AZ',
    'Bellemont': 'AZ',
    'Williams': 'AZ',
    'Ash Fork': 'AZ',
    'Crookton': 'AZ',
    'Seligman': 'AZ',
    'Peach Springs': 'AZ',
    'Truxton': 'AZ',
    'Valentine': 'AZ',
    'Hackberry': 'AZ',
    'Kingman': 'AZ',
    'Cool Springs': 'AZ',
    'Oatman': 'AZ',
    'Goldroad': 'AZ',
    'Topock': 'AZ',
    
    // California
    'Los Angeles': 'CA',
    'Santa Monica': 'CA',
    'Needles': 'CA',
    'Goffs': 'CA',
    'Fenner': 'CA',
    'Essex': 'CA',
    'Chambless': 'CA',
    'Amboy': 'CA',
    'Bagdad': 'CA',
    'Siberia': 'CA',
    'Klondike': 'CA',
    'Newberry Springs': 'CA',
    'Daggett': 'CA',
    'Barstow': 'CA',
    'Lenwood': 'CA',
    'Hodge': 'CA',
    'Helendale': 'CA',
    'Oro Grande': 'CA',
    'Victorville': 'CA',
    'Cajon': 'CA',
    'Devore': 'CA',
    'San Bernardino': 'CA',
    'Rialto': 'CA',
    'Fontana': 'CA',
    'Rancho Cucamonga': 'CA',
    'Upland': 'CA',
    'Claremont': 'CA',
    'La Verne': 'CA',
    'San Dimas': 'CA',
    'Glendora': 'CA',
    'Azusa': 'CA',
    'Duarte': 'CA',
    'Monrovia': 'CA',
    'Arcadia': 'CA',
    'Pasadena': 'CA',
    'Los Angeles': 'CA',
    'Hollywood': 'CA',
    'West Hollywood': 'CA',
    'Beverly Hills': 'CA',
    'Santa Monica': 'CA'
  };
  
  const state = cityStateMap[destination] || '';
  
  return {
    city: destination,
    state
  };
}

/**
 * Extract just the city name from a destination string or object
 */
export function getDestinationCity(destination: string | { city: string; state?: string; }): string {
  if (!destination) return '';
  
  // If it's already an object with city property, return the city
  if (typeof destination === 'object' && destination.city) {
    return destination.city;
  }
  
  // If it's a string, extract the city using the existing logic
  if (typeof destination === 'string') {
    const { city } = getDestinationCityWithState(destination);
    return city;
  }
  
  return '';
}

/**
 * Format destination with city and state
 */
export function formatDestination(city: string, state: string): string {
  if (!city) return '';
  if (!state) return city;
  return `${city}, ${state}`;
}

/**
 * Check if a destination is a major Route 66 city
 */
export function isMajorRoute66City(city: string): boolean {
  const majorCities = [
    'Chicago',
    'Springfield',
    'St. Louis',
    'Tulsa',
    'Oklahoma City',
    'Amarillo',
    'Albuquerque',
    'Flagstaff',
    'Los Angeles',
    'Santa Monica'
  ];
  
  return majorCities.some(majorCity => 
    city.toLowerCase().includes(majorCity.toLowerCase())
  );
}
