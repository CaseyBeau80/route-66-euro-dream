
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
  // Using array format to handle duplicate city names in different states
  const cityStateMappings: Array<{ city: string; state: string; aliases?: string[] }> = [
    // Illinois
    { city: 'Chicago', state: 'IL' },
    { city: 'Springfield', state: 'IL' },
    { city: 'Joliet', state: 'IL' },
    { city: 'Pontiac', state: 'IL' },
    { city: 'Bloomington', state: 'IL' },
    { city: 'Normal', state: 'IL' },
    { city: 'McLean', state: 'IL' },
    { city: 'Atlanta', state: 'IL' },
    { city: 'Lincoln', state: 'IL' },
    { city: 'Williamsville', state: 'IL' },
    { city: 'Sherman', state: 'IL' },
    { city: 'Riverton', state: 'IL' },
    { city: 'Chatham', state: 'IL' },
    { city: 'Auburn', state: 'IL' },
    { city: 'Thayer', state: 'IL' },
    { city: 'Virden', state: 'IL' },
    { city: 'Girard', state: 'IL' },
    { city: 'Nilwood', state: 'IL' },
    { city: 'Carlinville', state: 'IL' },
    { city: 'Litchfield', state: 'IL' },
    { city: 'Mount Olive', state: 'IL' },
    { city: 'Staunton', state: 'IL' },
    { city: 'Hamel', state: 'IL' },
    { city: 'Edwardsville', state: 'IL' },
    
    // Missouri
    { city: 'St. Louis', state: 'MO', aliases: ['Saint Louis'] },
    { city: 'Springfield', state: 'MO' },
    { city: 'Joplin', state: 'MO' },
    { city: 'Carthage', state: 'MO' },
    { city: 'Webb City', state: 'MO' },
    { city: 'Halltown', state: 'MO' },
    { city: 'Paris Springs', state: 'MO' },
    { city: 'Log City', state: 'MO' },
    { city: 'Rescue', state: 'MO' },
    { city: 'Plano', state: 'MO' },
    { city: 'Marshfield', state: 'MO' },
    { city: 'Strafford', state: 'MO' },
    { city: 'Lebanon', state: 'MO' },
    { city: 'Phillipsburg', state: 'MO' },
    { city: 'Conway', state: 'MO' },
    { city: 'Niangua', state: 'MO' },
    { city: 'Buffalo', state: 'MO' },
    { city: 'Long Lane', state: 'MO' },
    { city: 'Hazelgreen', state: 'MO' },
    { city: 'Sleeper', state: 'MO' },
    { city: 'Elkland', state: 'MO' },
    { city: 'Rolla', state: 'MO' },
    { city: 'Doolittle', state: 'MO' },
    { city: 'Arlington', state: 'MO' },
    { city: 'Devils Elbow', state: 'MO' },
    { city: 'Hooker', state: 'MO' },
    { city: 'Waynesville', state: 'MO' },
    { city: 'Laquey', state: 'MO' },
    { city: 'Buckhorn', state: 'MO' },
    
    // Kansas (brief stretch)
    { city: 'Galena', state: 'KS' },
    { city: 'Riverton', state: 'KS' },
    { city: 'Baxter Springs', state: 'KS' },
    
    // Oklahoma
    { city: 'Tulsa', state: 'OK' },
    { city: 'Oklahoma City', state: 'OK' },
    { city: 'Sapulpa', state: 'OK' },
    { city: 'Kellyville', state: 'OK' },
    { city: 'Bristow', state: 'OK' },
    { city: 'Depew', state: 'OK' },
    { city: 'Stroud', state: 'OK' },
    { city: 'Davenport', state: 'OK' },
    { city: 'Chandler', state: 'OK' },
    { city: 'Warwick', state: 'OK' },
    { city: 'Luther', state: 'OK' },
    { city: 'Arcadia', state: 'OK' },
    { city: 'Edmond', state: 'OK' },
    { city: 'Bethany', state: 'OK' },
    { city: 'Yukon', state: 'OK' },
    { city: 'El Reno', state: 'OK' },
    { city: 'Calumet', state: 'OK' },
    { city: 'Geary', state: 'OK' },
    { city: 'Hydro', state: 'OK' },
    { city: 'Weatherford', state: 'OK' },
    { city: 'Clinton', state: 'OK' },
    { city: 'Canute', state: 'OK' },
    { city: 'Elk City', state: 'OK' },
    { city: 'Sayre', state: 'OK' },
    { city: 'Erick', state: 'OK' },
    
    // Texas
    { city: 'Amarillo', state: 'TX' },
    { city: 'Shamrock', state: 'TX' },
    { city: 'McLean', state: 'TX' },
    { city: 'Alanreed', state: 'TX' },
    { city: 'Jericho', state: 'TX' },
    { city: 'Groom', state: 'TX' },
    { city: 'Conway', state: 'TX' },
    { city: 'Bushland', state: 'TX' },
    { city: 'Wildorado', state: 'TX' },
    { city: 'Vega', state: 'TX' },
    { city: 'Landergin', state: 'TX' },
    { city: 'Adrian', state: 'TX' },
    { city: 'Glenrio', state: 'TX' },
    
    // New Mexico
    { city: 'Albuquerque', state: 'NM' },
    { city: 'Tucumcari', state: 'NM' },
    { city: 'Santa Rosa', state: 'NM' },
    { city: 'Moriarty', state: 'NM' },
    { city: 'Edgewood', state: 'NM' },
    { city: 'Tijeras', state: 'NM' },
    { city: 'Carnuel', state: 'NM' },
    { city: 'Corrales', state: 'NM' },
    { city: 'Rio Rancho', state: 'NM' },
    { city: 'Bernalillo', state: 'NM' },
    { city: 'Algodones', state: 'NM' },
    { city: 'Budaghers', state: 'NM' },
    { city: 'San Ysidro', state: 'NM' },
    { city: 'Jemez Pueblo', state: 'NM' },
    { city: 'Cuba', state: 'NM' },
    { city: 'Thoreau', state: 'NM' },
    { city: 'Continental Divide', state: 'NM' },
    { city: 'Prewitt', state: 'NM' },
    { city: 'Grants', state: 'NM' },
    { city: 'Milan', state: 'NM' },
    { city: 'Acoma', state: 'NM' },
    { city: 'Paraje', state: 'NM' },
    { city: 'Laguna', state: 'NM' },
    { city: 'Budville', state: 'NM' },
    { city: 'Cubero', state: 'NM' },
    { city: 'Villa de Cubero', state: 'NM' },
    { city: 'McCarty', state: 'NM' },
    { city: 'San Fidel', state: 'NM' },
    { city: 'Gallup', state: 'NM' },
    { city: 'Manuelito', state: 'NM' },
    
    // Arizona
    { city: 'Flagstaff', state: 'AZ' },
    { city: 'Holbrook', state: 'AZ' },
    { city: 'Winslow', state: 'AZ' },
    { city: 'Winona', state: 'AZ' },
    { city: 'Lupton', state: 'AZ' },
    { city: 'Houck', state: 'AZ' },
    { city: 'Sanders', state: 'AZ' },
    { city: 'Chambers', state: 'AZ' },
    { city: 'Navajo', state: 'AZ' },
    { city: 'Joseph City', state: 'AZ' },
    { city: 'Sun Valley', state: 'AZ' },
    { city: 'Woodruff', state: 'AZ' },
    { city: 'Snowflake', state: 'AZ' },
    { city: 'Taylor', state: 'AZ' },
    { city: 'Snowlow', state: 'AZ' },
    { city: 'Leupp Corner', state: 'AZ' },
    { city: 'Walnut', state: 'AZ' },
    { city: 'Bellemont', state: 'AZ' },
    { city: 'Williams', state: 'AZ' },
    { city: 'Ash Fork', state: 'AZ' },
    { city: 'Crookton', state: 'AZ' },
    { city: 'Seligman', state: 'AZ' },
    { city: 'Peach Springs', state: 'AZ' },
    { city: 'Truxton', state: 'AZ' },
    { city: 'Valentine', state: 'AZ' },
    { city: 'Hackberry', state: 'AZ' },
    { city: 'Kingman', state: 'AZ' },
    { city: 'Cool Springs', state: 'AZ' },
    { city: 'Oatman', state: 'AZ' },
    { city: 'Goldroad', state: 'AZ' },
    { city: 'Topock', state: 'AZ' },
    
    // California
    { city: 'Los Angeles', state: 'CA' },
    { city: 'Santa Monica', state: 'CA' },
    { city: 'Needles', state: 'CA' },
    { city: 'Goffs', state: 'CA' },
    { city: 'Fenner', state: 'CA' },
    { city: 'Essex', state: 'CA' },
    { city: 'Chambless', state: 'CA' },
    { city: 'Amboy', state: 'CA' },
    { city: 'Bagdad', state: 'CA' },
    { city: 'Siberia', state: 'CA' },
    { city: 'Klondike', state: 'CA' },
    { city: 'Newberry Springs', state: 'CA' },
    { city: 'Daggett', state: 'CA' },
    { city: 'Barstow', state: 'CA' },
    { city: 'Lenwood', state: 'CA' },
    { city: 'Hodge', state: 'CA' },
    { city: 'Helendale', state: 'CA' },
    { city: 'Oro Grande', state: 'CA' },
    { city: 'Victorville', state: 'CA' },
    { city: 'Cajon', state: 'CA' },
    { city: 'Devore', state: 'CA' },
    { city: 'San Bernardino', state: 'CA' },
    { city: 'Rialto', state: 'CA' },
    { city: 'Fontana', state: 'CA' },
    { city: 'Rancho Cucamonga', state: 'CA' },
    { city: 'Upland', state: 'CA' },
    { city: 'Claremont', state: 'CA' },
    { city: 'La Verne', state: 'CA' },
    { city: 'San Dimas', state: 'CA' },
    { city: 'Glendora', state: 'CA' },
    { city: 'Azusa', state: 'CA' },
    { city: 'Duarte', state: 'CA' },
    { city: 'Monrovia', state: 'CA' },
    { city: 'Arcadia', state: 'CA' },
    { city: 'Pasadena', state: 'CA' },
    { city: 'Hollywood', state: 'CA' },
    { city: 'West Hollywood', state: 'CA' },
    { city: 'Beverly Hills', state: 'CA' }
  ];
  
  // Find the matching city mapping
  const matchedMapping = cityStateMappings.find(mapping => {
    const cityMatch = mapping.city.toLowerCase() === destination.toLowerCase();
    const aliasMatch = mapping.aliases?.some(alias => alias.toLowerCase() === destination.toLowerCase());
    return cityMatch || aliasMatch;
  });
  
  if (matchedMapping) {
    return {
      city: destination,
      state: matchedMapping.state
    };
  }
  
  return {
    city: destination,
    state: ''
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
