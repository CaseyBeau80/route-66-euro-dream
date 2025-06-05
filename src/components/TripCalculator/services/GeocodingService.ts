
// Simple geocoding service for major Route 66 cities
export class GeocodingService {
  private static readonly ROUTE66_CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
    // Illinois
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Joliet': { lat: 41.5250, lng: -88.0817 },
    'Wilmington': { lat: 41.3073, lng: -88.1467 },
    'Dwight': { lat: 41.0957, lng: -88.4284 },
    'Pontiac': { lat: 40.8808, lng: -88.6298 },
    'Normal': { lat: 40.5142, lng: -88.9906 },
    'Atlanta': { lat: 40.2517, lng: -89.2151 },
    'Lincoln': { lat: 40.1481, lng: -89.3651 },
    'Springfield': { lat: 39.7817, lng: -89.6501 },
    'Litchfield': { lat: 39.1753, lng: -89.6543 },
    
    // Missouri
    'St. Louis': { lat: 38.6270, lng: -90.1994 },
    'Eureka': { lat: 38.5023, lng: -90.6268 },
    'Cuba': { lat: 38.0648, lng: -91.4040 },
    'Rolla': { lat: 37.9514, lng: -91.7718 },
    'Lebanon': { lat: 37.6806, lng: -92.6635 },
    'Springfield, MO': { lat: 37.2153, lng: -93.2982 },
    'Carthage': { lat: 37.1745, lng: -94.3102 },
    'Joplin': { lat: 37.0842, lng: -94.5133 },
    
    // Kansas
    'Galena': { lat: 37.0761, lng: -94.6383 },
    'Riverton': { lat: 37.0967, lng: -94.7052 },
    'Baxter Springs': { lat: 37.0226, lng: -94.7357 },
    
    // Oklahoma
    'Quapaw': { lat: 36.9539, lng: -94.7885 },
    'Miami': { lat: 36.8742, lng: -94.8775 },
    'Vinita': { lat: 36.6387, lng: -95.1541 },
    'Claremore': { lat: 36.3126, lng: -95.6160 },
    'Tulsa': { lat: 36.1540, lng: -95.9928 },
    'Sapulpa': { lat: 35.9951, lng: -96.1136 },
    'Stroud': { lat: 35.7487, lng: -96.6575 },
    'Chandler': { lat: 35.7017, lng: -96.8806 },
    'Arcadia': { lat: 35.6567, lng: -97.3228 },
    'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
    'El Reno': { lat: 35.5321, lng: -97.9550 },
    'Hydro': { lat: 35.5398, lng: -98.5798 },
    'Weatherford': { lat: 35.5264, lng: -98.7087 },
    'Clinton': { lat: 35.5151, lng: -98.9687 },
    'Elk City': { lat: 35.4117, lng: -99.4043 },
    'Sayre': { lat: 35.2917, lng: -99.6404 },
    'Erick': { lat: 35.2117, lng: -99.8687 },
    
    // Texas
    'Shamrock': { lat: 35.2098, lng: -100.2465 },
    'McLean': { lat: 35.2340, lng: -100.5992 },
    'Groom': { lat: 35.2017, lng: -101.1079 },
    'Amarillo': { lat: 35.2220, lng: -101.8313 },
    'Vega': { lat: 35.2442, lng: -102.4282 },
    'Adrian': { lat: 35.2745, lng: -102.6740 },
    
    // New Mexico
    'Glenrio': { lat: 35.2889, lng: -103.0382 },
    'Tucumcari': { lat: 35.1717, lng: -103.7253 },
    'Santa Rosa': { lat: 34.9381, lng: -104.6819 },
    'Santa Fe': { lat: 35.6870, lng: -105.9378 },
    'Albuquerque': { lat: 35.0844, lng: -106.6504 },
    'Grants': { lat: 35.1473, lng: -107.8529 },
    'Gallup': { lat: 35.5281, lng: -108.7426 },
    
    // Arizona
    'Lupton': { lat: 35.3948, lng: -109.0865 },
    'Holbrook': { lat: 34.9003, lng: -110.1665 },
    'Winslow': { lat: 35.0242, lng: -110.7073 },
    'Flagstaff': { lat: 35.1983, lng: -111.6513 },
    'Winona': { lat: 35.1656, lng: -111.2390 },
    'Williams': { lat: 35.2494, lng: -112.1901 },
    'Ash Fork': { lat: 35.2242, lng: -112.4829 },
    'Seligman': { lat: 35.3261, lng: -112.8721 },
    'Peach Springs': { lat: 35.5339, lng: -113.4198 },
    'Kingman': { lat: 35.1895, lng: -114.0530 },
    'Oatman': { lat: 35.0258, lng: -114.3957 },
    
    // California
    'Needles': { lat: 34.8481, lng: -114.6144 },
    'Ludlow': { lat: 34.7206, lng: -116.1669 },
    'Newberry Springs': { lat: 34.7981, lng: -116.6867 },
    'Barstow': { lat: 34.8958, lng: -117.0228 },
    'Lenwood': { lat: 34.8850, lng: -117.1189 },
    'Victorville': { lat: 34.5362, lng: -117.2911 },
    'Cajon': { lat: 34.3139, lng: -117.4678 },
    'San Bernardino': { lat: 34.1083, lng: -117.2898 },
    'Rancho Cucamonga': { lat: 34.1064, lng: -117.5931 },
    'Upland': { lat: 34.0975, lng: -117.6484 },
    'Claremont': { lat: 34.0967, lng: -117.7198 },
    'La Verne': { lat: 34.1081, lng: -117.7681 },
    'San Dimas': { lat: 34.1067, lng: -117.8068 },
    'Glendora': { lat: 34.1361, lng: -117.8653 },
    'Azusa': { lat: 34.1336, lng: -117.9076 },
    'Duarte': { lat: 34.1394, lng: -117.9773 },
    'Monrovia': { lat: 34.1442, lng: -118.0020 },
    'Arcadia, CA': { lat: 34.1397, lng: -118.0353 },
    'Pasadena': { lat: 34.1478, lng: -118.1445 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Santa Monica': { lat: 34.0195, lng: -118.4912 }
  };

  static getCoordinatesForCity(cityName: string): { lat: number; lng: number } | null {
    console.log(`🗺️ GeocodingService: Looking up coordinates for "${cityName}"`);
    
    // Try exact match first
    let coordinates = this.ROUTE66_CITY_COORDINATES[cityName];
    
    if (!coordinates) {
      // Try partial matches (case insensitive)
      const normalizedCityName = cityName.toLowerCase().trim();
      const matchingKey = Object.keys(this.ROUTE66_CITY_COORDINATES).find(key => 
        key.toLowerCase().includes(normalizedCityName) || 
        normalizedCityName.includes(key.toLowerCase())
      );
      
      if (matchingKey) {
        coordinates = this.ROUTE66_CITY_COORDINATES[matchingKey];
        console.log(`🗺️ GeocodingService: Found partial match "${matchingKey}" for "${cityName}"`);
      }
    }
    
    if (coordinates) {
      console.log(`✅ GeocodingService: Found coordinates for "${cityName}":`, coordinates);
      return coordinates;
    }
    
    console.warn(`❌ GeocodingService: No coordinates found for "${cityName}"`);
    return null;
  }
}
