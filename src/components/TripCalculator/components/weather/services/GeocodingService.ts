interface Coordinates {
  lat: number;
  lng: number;
}

interface CityCoordinates {
  [key: string]: Coordinates;
}

export class GeocodingService {
  // Comprehensive database of Route 66 cities with their coordinates
  private static readonly ROUTE66_CITY_COORDINATES: CityCoordinates = {
    // Illinois
    'chicago, il': { lat: 41.8781, lng: -87.6298 },
    'joliet, il': { lat: 41.5250, lng: -88.0817 },
    'wilmington, il': { lat: 41.3075, lng: -88.1459 },
    'braidwood, il': { lat: 41.2642, lng: -88.2120 },
    'gardner, il': { lat: 41.1917, lng: -88.3092 },
    'dwight, il': { lat: 41.0958, lng: -88.4284 },
    'odell, il': { lat: 41.0042, lng: -88.5334 },
    'pontiac, il': { lat: 40.8808, lng: -88.6298 },
    'chenoa, il': { lat: 40.7417, lng: -88.7198 },
    'lexington, il': { lat: 40.6411, lng: -88.7834 },
    'normal, il': { lat: 40.5142, lng: -88.9906 },
    'bloomington, il': { lat: 40.4842, lng: -88.9937 },
    'atlanta, il': { lat: 40.2517, lng: -89.2315 },
    'lincoln, il': { lat: 40.1481, lng: -89.3648 },
    'broadwell, il': { lat: 40.0750, lng: -89.4434 },
    'elkhart, il': { lat: 40.0111, lng: -89.4812 },
    'williamsville, il': { lat: 39.9542, lng: -89.5487 },
    'sherman, il': { lat: 39.8989, lng: -89.6029 },
    'springfield, il': { lat: 39.7817, lng: -89.6501 },
    
    // Missouri
    'st. louis, mo': { lat: 38.6270, lng: -90.1994 },
    'saint louis, mo': { lat: 38.6270, lng: -90.1994 },
    'kirkwood, mo': { lat: 38.5834, lng: -90.4068 },
    'pacific, mo': { lat: 38.4812, lng: -90.7404 },
    'gray summit, mo': { lat: 38.4889, lng: -90.8157 },
    'villa ridge, mo': { lat: 38.4578, lng: -90.8679 },
    'stanton, mo': { lat: 38.2689, lng: -91.1007 },
    'sullivan, mo': { lat: 38.2078, lng: -91.1626 },
    'bourbon, mo': { lat: 38.1489, lng: -91.2407 },
    'cuba, mo': { lat: 38.0617, lng: -91.4040 },
    'fanning, mo': { lat: 37.9978, lng: -91.4068 },
    'st. james, mo': { lat: 37.9978, lng: -91.6154 },
    'saint james, mo': { lat: 37.9978, lng: -91.6154 },
    'rolla, mo': { lat: 37.9514, lng: -91.7732 },
    'doolittle, mo': { lat: 37.9067, lng: -91.9254 },
    'arlington, mo': { lat: 37.8667, lng: -92.0354 },
    'devil\'s elbow, mo': { lat: 37.8389, lng: -92.0465 },
    'waynesville, mo': { lat: 37.8289, lng: -92.2007 },
    'laquey, mo': { lat: 37.7978, lng: -92.2521 },
    'lebanon, mo': { lat: 37.6806, lng: -92.6635 },
    'phillipsburg, mo': { lat: 37.6392, lng: -92.7724 },
    'conway, mo': { lat: 37.5903, lng: -92.8449 },
    'marshfield, mo': { lat: 37.3389, lng: -92.9068 },
    'strafford, mo': { lat: 37.2625, lng: -93.1168 },
    'springfield, mo': { lat: 37.2081, lng: -93.2923 },
    'halltown, mo': { lat: 37.1831, lng: -93.6251 },
    'paris springs, mo': { lat: 37.1642, lng: -93.6779 },
    'spencer, mo': { lat: 37.1539, lng: -93.7085 },
    'log city, mo': { lat: 37.1431, lng: -93.7543 },
    'carthage, mo': { lat: 37.1745, lng: -94.3102 },
    'webb city, mo': { lat: 37.1467, lng: -94.4663 },
    'joplin, mo': { lat: 37.0842, lng: -94.5133 },
    
    // Kansas
    'galena, ks': { lat: 37.0761, lng: -94.6397 },
    'riverton, ks': { lat: 37.0967, lng: -94.6922 },
    'baxter springs, ks': { lat: 37.0228, lng: -94.7358 },
    
    // Oklahoma
    'quapaw, ok': { lat: 36.9545, lng: -94.7855 },
    'commerce, ok': { lat: 36.9334, lng: -94.8708 },
    'miami, ok': { lat: 36.8742, lng: -94.8775 },
    'afton, ok': { lat: 36.6934, lng: -95.0138 },
    'vinita, ok': { lat: 36.6387, lng: -95.1539 },
    'white oak, ok': { lat: 36.6178, lng: -95.2347 },
    'chelsea, ok': { lat: 36.5334, lng: -95.4322 },
    'foyil, ok': { lat: 36.4334, lng: -95.5169 },
    'claremore, ok': { lat: 36.3126, lng: -95.6158 },
    'catoosa, ok': { lat: 36.1851, lng: -95.7364 },
    'tulsa, ok': { lat: 36.1539, lng: -95.9928 },
    'sapulpa, ok': { lat: 35.9940, lng: -96.1142 },
    'kellyville, ok': { lat: 35.9467, lng: -96.2111 },
    'bristow, ok': { lat: 35.8312, lng: -96.3903 },
    'depew, ok': { lat: 35.7978, lng: -96.4569 },
    'stroud, ok': { lat: 35.7489, lng: -96.6578 },
    'davenport, ok': { lat: 35.6967, lng: -96.7603 },
    'chandler, ok': { lat: 35.7017, lng: -96.8809 },
    'warwick, ok': { lat: 35.6389, lng: -96.9778 },
    'wellston, ok': { lat: 35.6889, lng: -97.0614 },
    'luther, ok': { lat: 35.6589, lng: -97.1925 },
    'arcadia, ok': { lat: 35.6606, lng: -97.3256 },
    'edmond, ok': { lat: 35.6528, lng: -97.4781 },
    'oklahoma city, ok': { lat: 35.4676, lng: -97.5164 },
    'yukon, ok': { lat: 35.5067, lng: -97.7625 },
    'el reno, ok': { lat: 35.5320, lng: -97.9550 },
    'calumet, ok': { lat: 35.5678, lng: -98.1289 },
    'geary, ok': { lat: 35.6317, lng: -98.3178 },
    'bridgeport, ok': { lat: 35.5612, lng: -98.3870 },
    'hydro, ok': { lat: 35.5464, lng: -98.5781 },
    'weatherford, ok': { lat: 35.5264, lng: -98.7070 },
    'clinton, ok': { lat: 35.5151, lng: -98.9659 },
    'canute, ok': { lat: 35.4423, lng: -99.2759 },
    'elk city, ok': { lat: 35.4118, lng: -99.4043 },
    'sayre, ok': { lat: 35.2889, lng: -99.6401 },
    'erick, ok': { lat: 35.2134, lng: -99.8687 },
    'texola, ok': { lat: 35.2178, lng: -99.9759 },
    
    // Texas
    'shamrock, tx': { lat: 35.2195, lng: -100.2482 },
    'mclean, tx': { lat: 35.2281, lng: -100.5993 },
    'alanreed, tx': { lat: 35.2342, lng: -100.7607 },
    'groom, tx': { lat: 35.2048, lng: -101.1079 },
    'amarillo, tx': { lat: 35.2220, lng: -101.8313 },
    'bushland, tx': { lat: 35.1890, lng: -102.0779 },
    'wildorado, tx': { lat: 35.2234, lng: -102.3043 },
    'vega, tx': { lat: 35.2448, lng: -102.4271 },
    'adrian, tx': { lat: 35.2773, lng: -102.6735 },
    'glenrio, tx': { lat: 35.2890, lng: -103.0407 },
    
    // New Mexico
    'glenrio, nm': { lat: 35.2890, lng: -103.0407 },
    'endee, nm': { lat: 35.2442, lng: -103.3707 },
    'bard, nm': { lat: 35.2281, lng: -103.6193 },
    'san jon, nm': { lat: 35.1139, lng: -103.3307 },
    'tucumcari, nm': { lat: 35.1717, lng: -103.7250 },
    'montoya, nm': { lat: 35.1228, lng: -104.3479 },
    'newkirk, nm': { lat: 35.1089, lng: -104.4293 },
    'cuervo, nm': { lat: 35.0428, lng: -104.7279 },
    'santa rosa, nm': { lat: 34.9386, lng: -104.6822 },
    'romeroville, nm': { lat: 35.1842, lng: -105.2950 },
    'las vegas, nm': { lat: 35.5939, lng: -105.2231 },
    'tecolote, nm': { lat: 35.4606, lng: -105.2250 },
    'bernal, nm': { lat: 35.4367, lng: -105.2607 },
    'san miguel, nm': { lat: 35.4056, lng: -105.3550 },
    'rowe, nm': { lat: 35.3889, lng: -105.4179 },
    'pecos, nm': { lat: 35.3542, lng: -105.6764 },
    'glorieta, nm': { lat: 35.3381, lng: -105.7443 },
    'santa fe, nm': { lat: 35.6870, lng: -105.9378 },
    'santo domingo pueblo, nm': { lat: 35.5150, lng: -106.3864 },
    'cochiti pueblo, nm': { lat: 35.6281, lng: -106.3264 },
    'pena blanca, nm': { lat: 35.5589, lng: -106.3264 },
    'algodones, nm': { lat: 35.5967, lng: -106.4507 },
    'bernalillo, nm': { lat: 35.3042, lng: -106.5478 },
    'albuquerque, nm': { lat: 35.0844, lng: -106.6504 },
    'west albuquerque, nm': { lat: 35.0844, lng: -106.7504 },
    'rio puerco, nm': { lat: 35.1228, lng: -107.0264 },
    'correo, nm': { lat: 35.1167, lng: -107.2521 },
    'budville, nm': { lat: 35.1167, lng: -107.2850 },
    'cubero, nm': { lat: 35.0889, lng: -107.5507 },
    'mccarty\'s, nm': { lat: 35.0567, lng: -107.6007 },
    'grants, nm': { lat: 35.1472, lng: -107.8523 },
    'milan, nm': { lat: 35.1750, lng: -107.9007 },
    'prewitt, nm': { lat: 35.4039, lng: -108.0864 },
    'thoreau, nm': { lat: 35.4111, lng: -108.2207 },
    'continental divide, nm': { lat: 35.4667, lng: -108.2850 },
    'yah-ta-hey, nm': { lat: 35.6542, lng: -108.8007 },
    'gallup, nm': { lat: 35.5281, lng: -108.7426 },
    
    // Arizona
    'lupton, az': { lat: 35.4039, lng: -109.0850 },
    'houck, az': { lat: 35.3639, lng: -109.1850 },
    'sanders, az': { lat: 35.2189, lng: -109.3193 },
    'chambers, az': { lat: 35.1639, lng: -109.4350 },
    'navajo, az': { lat: 35.1139, lng: -109.6764 },
    'joseph city, az': { lat: 35.0228, lng: -110.3357 },
    'holbrook, az': { lat: 34.9028, lng: -110.1593 },
    'sun valley, az': { lat: 34.8639, lng: -110.2850 },
    'winslow, az': { lat: 35.0242, lng: -110.6974 },
    'winona, az': { lat: 35.1639, lng: -111.2350 },
    'flagstaff, az': { lat: 35.1983, lng: -111.6513 },
    'bellemont, az': { lat: 35.2639, lng: -111.8007 },
    'williams, az': { lat: 35.2494, lng: -112.1901 },
    'ash fork, az': { lat: 35.2228, lng: -112.4821 },
    'seligman, az': { lat: 35.3189, lng: -112.8793 },
    'grand canyon caverns, az': { lat: 35.4389, lng: -113.2350 },
    'peach springs, az': { lat: 35.5228, lng: -113.4350 },
    'truxton, az': { lat: 35.4639, lng: -113.5607 },
    'valentine, az': { lat: 35.3889, lng: -113.6350 },
    'hackberry, az': { lat: 35.3639, lng: -113.7607 },
    'kingman, az': { lat: 35.1894, lng: -114.0530 },
    'mcconnico, az': { lat: 35.0639, lng: -114.2607 },
    'yucca, az': { lat: 34.8639, lng: -114.1607 },
    'topock, az': { lat: 34.7228, lng: -114.4878 },
    
    // California
    'needles, ca': { lat: 34.8481, lng: -114.6144 },
    'goffs, ca': { lat: 34.9139, lng: -115.0650 },
    'fenner, ca': { lat: 34.8639, lng: -115.2350 },
    'essex, ca': { lat: 34.7361, lng: -115.2422 },
    'chambless, ca': { lat: 34.6889, lng: -115.3350 },
    'amboy, ca': { lat: 34.5581, lng: -115.7422 },
    'bagdad, ca': { lat: 34.4889, lng: -116.1350 },
    'siberia, ca': { lat: 34.4639, lng: -116.2607 },
    'klondike, ca': { lat: 34.4389, lng: -116.3350 },
    'newberry springs, ca': { lat: 34.7889, lng: -116.6878 },
    'daggett, ca': { lat: 34.8553, lng: -116.8594 },
    'barstow, ca': { lat: 34.8958, lng: -117.0228 },
    'lenwood, ca': { lat: 34.8639, lng: -117.1350 },
    'hodge, ca': { lat: 34.8389, lng: -117.2607 },
    'helendale, ca': { lat: 34.7453, lng: -117.3267 },
    'oro grande, ca': { lat: 34.5989, lng: -117.3350 },
    'victorville, ca': { lat: 34.5362, lng: -117.2911 },
    'cajon, ca': { lat: 34.3639, lng: -117.4607 },
    'san bernardino, ca': { lat: 34.1083, lng: -117.2898 },
    'rialto, ca': { lat: 34.1064, lng: -117.3703 },
    'fontana, ca': { lat: 34.0922, lng: -117.4350 },
    'rancho cucamonga, ca': { lat: 34.1064, lng: -117.5931 },
    'upland, ca': { lat: 34.0975, lng: -117.6484 },
    'claremont, ca': { lat: 34.0969, lng: -117.7198 },
    'la verne, ca': { lat: 34.1089, lng: -117.7681 },
    'san dimas, ca': { lat: 34.1067, lng: -117.8067 },
    'glendora, ca': { lat: 34.1361, lng: -117.8653 },
    'azusa, ca': { lat: 34.1342, lng: -117.9076 },
    'duarte, ca': { lat: 34.1394, lng: -117.9773 },
    'monrovia, ca': { lat: 34.1442, lng: -118.0020 },
    'arcadia, ca': { lat: 34.1397, lng: -118.0353 },
    'pasadena, ca': { lat: 34.1478, lng: -118.1445 },
    'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
    'santa monica, ca': { lat: 34.0194, lng: -118.4912 }
  };

  private static normalizeCityName(cityName: string): string {
    return cityName.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[^\w\s,.-]/g, '')
      .replace(/\b(saint|st\.?)\b/g, 'st.')
      .replace(/\bst\.\s*/g, 'st. ');
  }

  static async getCoordinates(cityName: string): Promise<Coordinates | null> {
    console.log('🗺️ Weather GeocodingService: Getting coordinates for:', cityName);
    
    try {
      // Normalize the city name
      const normalizedName = this.normalizeCityName(cityName);
      console.log('🗺️ Weather GeocodingService: Normalized name:', normalizedName);
      
      // First try exact match
      if (this.ROUTE66_CITY_COORDINATES[normalizedName]) {
        const coords = this.ROUTE66_CITY_COORDINATES[normalizedName];
        console.log('✅ Weather GeocodingService: Found exact match for', normalizedName, coords);
        return coords;
      }
      
      // Try partial matches for cities that might have different formatting
      const cityPart = normalizedName.split(',')[0].trim();
      const statePart = normalizedName.split(',')[1]?.trim();
      
      // Look for cities that start with the same name
      for (const [key, coords] of Object.entries(this.ROUTE66_CITY_COORDINATES)) {
        const keyCity = key.split(',')[0].trim();
        const keyState = key.split(',')[1]?.trim();
        
        if (keyCity === cityPart && (!statePart || keyState === statePart)) {
          console.log('✅ Weather GeocodingService: Found partial match for', cityName, 'using', key, coords);
          return coords;
        }
      }
      
      // Try fuzzy matching for common variations
      const fuzzyMatches = Object.keys(this.ROUTE66_CITY_COORDINATES).filter(key => {
        const keyCity = key.split(',')[0].trim();
        return keyCity.includes(cityPart) || cityPart.includes(keyCity);
      });
      
      if (fuzzyMatches.length > 0) {
        const coords = this.ROUTE66_CITY_COORDINATES[fuzzyMatches[0]];
        console.log('✅ Weather GeocodingService: Found fuzzy match for', cityName, 'using', fuzzyMatches[0], coords);
        return coords;
      }
      
      console.warn('⚠️ Weather GeocodingService: No coordinates found for', cityName);
      return null;
      
    } catch (error) {
      console.error('❌ Weather GeocodingService: Error getting coordinates for', cityName, error);
      return null;
    }
  }
}
