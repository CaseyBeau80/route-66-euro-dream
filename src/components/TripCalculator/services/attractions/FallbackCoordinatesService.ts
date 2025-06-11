export interface CityCoordinates {
  name: string;
  lat: number;
  lng: number;
  state: string;
  aliases?: string[];
}

export class FallbackCoordinatesService {
  private static readonly ROUTE_66_CITY_COORDINATES: CityCoordinates[] = [
    // Illinois - Enhanced Springfield coverage
    { name: 'chicago', lat: 41.8781, lng: -87.6298, state: 'IL' },
    { name: 'springfield', lat: 39.7817, lng: -89.6501, state: 'IL', aliases: ['springfield il', 'springfield illinois'] },
    { name: 'joliet', lat: 41.5250, lng: -88.0817, state: 'IL' },
    { name: 'pontiac', lat: 40.8808, lng: -88.6298, state: 'IL' },
    { name: 'bloomington', lat: 40.4842, lng: -88.9934, state: 'IL' },
    { name: 'normal', lat: 40.5142, lng: -88.9906, state: 'IL' },
    { name: 'litchfield', lat: 39.1753, lng: -89.6542, state: 'IL' },
    
    // Missouri - Enhanced Springfield coverage to distinguish from IL
    { name: 'st. louis', lat: 38.6270, lng: -90.1994, state: 'MO', aliases: ['saint louis', 'st louis'] },
    { name: 'springfield', lat: 37.2153, lng: -93.2982, state: 'MO', aliases: ['springfield mo', 'springfield missouri'] },
    { name: 'joplin', lat: 37.0842, lng: -94.5133, state: 'MO' },
    { name: 'carthage', lat: 37.1765, lng: -94.3100, state: 'MO' },
    { name: 'webb city', lat: 37.1467, lng: -94.4663, state: 'MO' },
    { name: 'rolla', lat: 37.9514, lng: -91.7735, state: 'MO' },
    { name: 'lebanon', lat: 37.6806, lng: -92.6638, state: 'MO' },
    
    // Kansas
    { name: 'galena', lat: 37.0756, lng: -94.6363, state: 'KS' },
    { name: 'riverton', lat: 37.0967, lng: -94.7052, state: 'KS' },
    { name: 'baxter springs', lat: 37.0267, lng: -94.7360, state: 'KS' },
    
    // Oklahoma
    { name: 'tulsa', lat: 36.1540, lng: -95.9928, state: 'OK' },
    { name: 'oklahoma city', lat: 35.4676, lng: -97.5164, state: 'OK' },
    { name: 'sapulpa', lat: 35.9937, lng: -96.1142, state: 'OK' },
    { name: 'stroud', lat: 35.7487, lng: -96.6572, state: 'OK' },
    { name: 'chandler', lat: 35.7017, lng: -96.8806, state: 'OK' },
    { name: 'arcadia', lat: 35.6576, lng: -97.3239, state: 'OK' },
    { name: 'edmond', lat: 35.6528, lng: -97.4781, state: 'OK' },
    { name: 'bethany', lat: 35.5151, lng: -97.6364, state: 'OK' },
    { name: 'yukon', lat: 35.5067, lng: -97.7625, state: 'OK' },
    { name: 'el reno', lat: 35.5320, lng: -97.9550, state: 'OK' },
    { name: 'clinton', lat: 35.5151, lng: -98.9670, state: 'OK' },
    { name: 'elk city', lat: 35.4112, lng: -99.4043, state: 'OK' },
    { name: 'sayre', lat: 35.2887, lng: -99.6407, state: 'OK' },
    { name: 'erick', lat: 35.2134, lng: -99.8687, state: 'OK' },
    
    // Texas
    { name: 'amarillo', lat: 35.2220, lng: -101.8313, state: 'TX' },
    { name: 'shamrock', lat: 35.2187, lng: -100.2496, state: 'TX' },
    { name: 'mclean', lat: 35.2281, lng: -100.5999, state: 'TX' },
    { name: 'groom', lat: 35.2043, lng: -101.1085, state: 'TX' },
    { name: 'vega', lat: 35.2443, lng: -102.4296, state: 'TX' },
    { name: 'adrian', lat: 35.2742, lng: -102.6769, state: 'TX' },
    { name: 'glenrio', lat: 35.2889, lng: -103.0380, state: 'TX' },
    
    // New Mexico
    { name: 'albuquerque', lat: 35.0844, lng: -106.6504, state: 'NM' },
    { name: 'tucumcari', lat: 35.1719, lng: -103.7249, state: 'NM' },
    { name: 'santa rosa', lat: 34.9387, lng: -104.6819, state: 'NM' },
    { name: 'moriarty', lat: 35.0120, lng: -106.0492, state: 'NM' },
    { name: 'grants', lat: 35.1472, lng: -107.8520, state: 'NM' },
    { name: 'gallup', lat: 35.5281, lng: -108.7426, state: 'NM' },
    
    // Arizona
    { name: 'flagstaff', lat: 35.1983, lng: -111.6513, state: 'AZ' },
    { name: 'holbrook', lat: 34.9011, lng: -110.1662, state: 'AZ' },
    { name: 'winslow', lat: 35.0242, lng: -110.6974, state: 'AZ' },
    { name: 'williams', lat: 35.2494, lng: -112.1910, state: 'AZ' },
    { name: 'ash fork', lat: 35.2242, lng: -112.4829, state: 'AZ' },
    { name: 'seligman', lat: 35.3258, lng: -112.8741, state: 'AZ' },
    { name: 'peach springs', lat: 35.5336, lng: -113.4239, state: 'AZ' },
    { name: 'kingman', lat: 35.1895, lng: -114.0530, state: 'AZ' },
    { name: 'oatman', lat: 35.0239, lng: -114.3825, state: 'AZ' },
    { name: 'topock', lat: 34.7208, lng: -114.4881, state: 'AZ' },
    
    // California
    { name: 'los angeles', lat: 34.0522, lng: -118.2437, state: 'CA' },
    { name: 'santa monica', lat: 34.0089, lng: -118.4973, state: 'CA' },
    { name: 'needles', lat: 34.8481, lng: -114.6147, state: 'CA' },
    { name: 'amboy', lat: 34.5583, lng: -115.7458, state: 'CA' },
    { name: 'barstow', lat: 34.8958, lng: -117.0228, state: 'CA' },
    { name: 'victorville', lat: 34.5362, lng: -117.2911, state: 'CA' },
    { name: 'san bernardino', lat: 34.1083, lng: -117.2898, state: 'CA' },
    { name: 'rialto', lat: 34.1064, lng: -117.3703, state: 'CA' },
    { name: 'fontana', lat: 34.0922, lng: -117.4353, state: 'CA' },
    { name: 'rancho cucamonga', lat: 34.1064, lng: -117.5931, state: 'CA' },
    { name: 'upland', lat: 34.0975, lng: -117.6481, state: 'CA' },
    { name: 'claremont', lat: 34.0967, lng: -117.7197, state: 'CA' },
    { name: 'la verne', lat: 34.1089, lng: -117.7681, state: 'CA' },
    { name: 'san dimas', lat: 34.1067, lng: -117.8067, state: 'CA' },
    { name: 'glendora', lat: 34.1361, lng: -117.8653, state: 'CA' },
    { name: 'azusa', lat: 34.1336, lng: -117.9076, state: 'CA' },
    { name: 'duarte', lat: 34.1394, lng: -117.9773, state: 'CA' },
    { name: 'monrovia', lat: 34.1442, lng: -118.0019, state: 'CA' },
    { name: 'arcadia', lat: 34.1397, lng: -118.0353, state: 'CA' },
    { name: 'pasadena', lat: 34.1478, lng: -118.1445, state: 'CA' }
  ];

  static getFallbackCoordinates(cityName: string, state?: string): { latitude: number; longitude: number } | null {
    const normalizedCity = cityName.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedState = state?.toLowerCase().trim();
    
    console.log(`🔍 Searching fallback coordinates for: "${normalizedCity}" in state: "${normalizedState}"`);

    // First try exact match with state if provided
    if (normalizedState) {
      const coords = this.ROUTE_66_CITY_COORDINATES.find(coord => {
        const nameMatch = coord.name === normalizedCity;
        const aliasMatch = coord.aliases?.some(alias => alias.toLowerCase().replace(/[.,]/g, '') === normalizedCity);
        const stateMatch = coord.state.toLowerCase() === normalizedState;
        
        return (nameMatch || aliasMatch) && stateMatch;
      });
      
      if (coords) {
        console.log(`✅ Found exact fallback coordinates for ${cityName}, ${state}: ${coords.lat}, ${coords.lng}`);
        return { latitude: coords.lat, longitude: coords.lng };
      }
    }

    // Then try name-only match (first result)
    const coords = this.ROUTE_66_CITY_COORDINATES.find(coord => {
      const nameMatch = coord.name === normalizedCity;
      const aliasMatch = coord.aliases?.some(alias => alias.toLowerCase().replace(/[.,]/g, '') === normalizedCity);
      return nameMatch || aliasMatch;
    });
    
    if (coords) {
      console.log(`✅ Found name-only fallback coordinates for ${cityName}: ${coords.lat}, ${coords.lng} (${coords.state})`);
      return { latitude: coords.lat, longitude: coords.lng };
    }
    
    console.warn(`❌ No fallback coordinates found for: "${cityName}", "${state}"`);
    return null;
  }
}
