export class GeocodingService {
  private static coordinates: { [key: string]: { lat: number; lng: number } } = {
    // Illinois cities
    'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
    'Joliet, IL': { lat: 41.5250, lng: -88.0817 },
    'Wilmington, IL': { lat: 41.3075, lng: -88.1459 },
    'Braidwood, IL': { lat: 41.2642, lng: -88.2120 },
    'Gardner, IL': { lat: 41.1939, lng: -88.3084 },
    'Dwight, IL': { lat: 41.0956, lng: -88.4259 },
    'Odell, IL': { lat: 41.0042, lng: -88.5120 },
    'Pontiac, IL': { lat: 40.8808, lng: -88.6298 },
    'Chenoa, IL': { lat: 40.7417, lng: -88.7198 },
    'Lexington, IL': { lat: 40.6411, lng: -88.7834 },
    'Normal, IL': { lat: 40.5142, lng: -88.9906 },
    'Bloomington, IL': { lat: 40.4842, lng: -88.9937 },
    'Shirley, IL': { lat: 40.3797, lng: -88.8423 },
    'Funk Grove, IL': { lat: 40.3539, lng: -88.8731 },
    'McLean, IL': { lat: 40.3108, lng: -89.0148 },
    'Atlanta, IL': { lat: 40.2517, lng: -89.2323 },
    'Lawndale, IL': { lat: 40.1928, lng: -89.2912 },
    'Lincoln, IL': { lat: 40.1481, lng: -89.3648 },
    'Elkhart, IL': { lat: 39.9281, lng: -89.4523 },
    'Williamsville, IL': { lat: 39.9447, lng: -89.5459 },
    'Sherman, IL': { lat: 39.8989, lng: -89.6023 },
    'Springfield, IL': { lat: 39.7817, lng: -89.6501 },
    'Chatham, IL': { lat: 39.6731, lng: -89.6934 },
    'Auburn, IL': { lat: 39.5917, lng: -89.7459 },
    'Thayer, IL': { lat: 39.5444, lng: -89.7634 },
    'Virden, IL': { lat: 39.5006, lng: -89.7679 },
    'Girard, IL': { lat: 39.4467, lng: -89.7817 },
    'Nilwood, IL': { lat: 39.4097, lng: -89.7998 },
    'Carlinville, IL': { lat: 39.2781, lng: -89.8817 },
    'Benld, IL': { lat: 39.0906, lng: -89.8020 },
    'Gillespie, IL': { lat: 39.1331, lng: -89.8184 },
    'Eagarville, IL': { lat: 39.1167, lng: -89.8445 },
    'Mount Olive, IL': { lat: 39.0717, lng: -89.7273 },
    'Litchfield, IL': { lat: 39.1753, lng: -89.6542 },
    'Raymond, IL': { lat: 39.3208, lng: -89.5673 },
    'Farmersville, IL': { lat: 39.4444, lng: -89.6506 },
    'Waggoner, IL': { lat: 39.3931, lng: -89.6395 },
    'Divernon, IL': { lat: 39.5664, lng: -89.6531 },
    'Pawnee, IL': { lat: 39.5914, lng: -89.5817 },
    'Tovey, IL': { lat: 39.5906, lng: -89.4598 },
    'Kincaid, IL': { lat: 39.5867, lng: -89.4173 },
    'Morrisonville, IL': { lat: 39.4231, lng: -89.4573 },
    'Palmer, IL': { lat: 39.4556, lng: -89.4084 },
    'Taylorville, IL': { lat: 39.5489, lng: -89.2945 },
    'Owaneco, IL': { lat: 39.4942, lng: -89.2020 },
    'Pana, IL': { lat: 39.3889, lng: -89.0798 },
    'Nokomis, IL': { lat: 39.3006, lng: -89.2851 },
    'Witt, IL': { lat: 39.2556, lng: -89.3484 },
    'Coffeen, IL': { lat: 39.0889, lng: -89.3923 },
    'Fillmore, IL': { lat: 39.1131, lng: -89.2817 },
    'Mulberry Grove, IL': { lat: 38.9370, lng: -89.2640 },
    'Vandalia, IL': { lat: 38.9606, lng: -89.0937 },
    'Ramsey, IL': { lat: 39.1420, lng: -89.1092 },
    'Sorento, IL': { lat: 39.0283, lng: -89.5712 },
    'Hillsboro, IL': { lat: 39.1614, lng: -89.4931 },
    'Butler, IL': { lat: 39.2028, lng: -89.5334 },

    // Missouri cities
    'St. Louis, MO': { lat: 38.6270, lng: -90.1994 },
    'Saint Louis, MO': { lat: 38.6270, lng: -90.1994 },
    'Eureka, MO': { lat: 38.5023, lng: -90.6265 },
    'Pacific, MO': { lat: 38.4814, lng: -90.7409 },
    'Gray Summit, MO': { lat: 38.5125, lng: -90.8176 },
    'Villa Ridge, MO': { lat: 38.4453, lng: -90.8787 },
    'St. Clair, MO': { lat: 38.3470, lng: -90.9798 },
    'Saint Clair, MO': { lat: 38.3470, lng: -90.9798 },
    'Stanton, MO': { lat: 38.2681, lng: -91.1007 },
    'Sullivan, MO': { lat: 38.2081, lng: -91.1626 },
    'Bourbon, MO': { lat: 38.1481, lng: -91.2393 },
    'Cuba, MO': { lat: 38.0617, lng: -91.4040 },
    'Fanning, MO': { lat: 37.9948, lng: -91.3326 },
    'St. James, MO': { lat: 37.9997, lng: -91.6168 },
    'Saint James, MO': { lat: 37.9997, lng: -91.6168 },
    'Rolla, MO': { lat: 37.9514, lng: -91.7732 },
    'Doolittle, MO': { lat: 37.9473, lng: -91.9349 },
    'Arlington, MO': { lat: 37.9045, lng: -91.9254 },
    'Newburg, MO': { lat: 37.9089, lng: -91.8940 },
    'Devil\'s Elbow, MO': { lat: 37.8320, lng: -92.0432 },
    'Devils Elbow, MO': { lat: 37.8320, lng: -92.0432 },
    'Hooker, MO': { lat: 37.8117, lng: -92.0976 },
    'Waynesville, MO': { lat: 37.8289, lng: -92.2007 },
    'Laquey, MO': { lat: 37.8348, lng: -92.2293 },
    'Hazelgreen, MO': { lat: 37.7431, lng: -92.4543 },
    'Lebanon, MO': { lat: 37.6806, lng: -92.6638 },
    'Phillipsburg, MO': { lat: 37.6456, lng: -92.7721 },
    'Conway, MO': { lat: 37.5931, lng: -92.8579 },
    'Marshfield, MO': { lat: 37.3389, lng: -92.9068 },
    'Strafford, MO': { lat: 37.2631, lng: -93.1168 },
    'Springfield, MO': { lat: 37.2081, lng: -93.2923 },
    'Halltown, MO': { lat: 37.1917, lng: -93.6140 },
    'Paris Springs, MO': { lat: 37.1681, lng: -93.7879 },
    'Log City, MO': { lat: 37.1628, lng: -93.8732 },
    'Spencer, MO': { lat: 37.1595, lng: -93.9229 },
    'Rescue, MO': { lat: 37.1534, lng: -93.9751 },
    'Albatross, MO': { lat: 37.1451, lng: -94.0429 },
    'Phelps, MO': { lat: 37.1381, lng: -94.0962 },
    'Avilla, MO': { lat: 37.1923, lng: -94.1346 },
    'Carthage, MO': { lat: 37.1745, lng: -94.3102 },
    'Webb City, MO': { lat: 37.1467, lng: -94.4663 },
    'Joplin, MO': { lat: 37.0842, lng: -94.5133 },

    // Kansas cities
    'Galena, KS': { lat: 37.0759, lng: -94.6369 },
    'Riverton, KS': { lat: 37.0967, lng: -94.6930 },
    'Baxter Springs, KS': { lat: 37.0284, lng: -94.7369 },

    // Oklahoma cities
    'Quapaw, OK': { lat: 36.9584, lng: -94.7894 },
    'Commerce, OK': { lat: 36.9331, lng: -94.8716 },
    'Miami, OK': { lat: 36.8842, lng: -94.8775 },
    'Afton, OK': { lat: 36.6831, lng: -94.9633 },
    'Vinita, OK': { lat: 36.6381, lng: -95.1538 },
    'White Oak, OK': { lat: 36.6542, lng: -95.3371 },
    'Chelsea, OK': { lat: 36.5331, lng: -95.4316 },
    'Bushyhead, OK': { lat: 36.4681, lng: -95.5749 },
    'Foyil, OK': { lat: 36.4331, lng: -95.5316 },
    'Sequoyah, OK': { lat: 36.3581, lng: -95.6927 },
    'Claremore, OK': { lat: 36.3126, lng: -95.6160 },
    'Catoosa, OK': { lat: 36.1898, lng: -95.7449 },
    'Tulsa, OK': { lat: 36.1539, lng: -95.9928 },
    'Sapulpa, OK': { lat: 35.9942, lng: -96.114 },
    'Kellyville, OK': { lat: 35.9381, lng: -96.2138 },
    'Bristow, OK': { lat: 35.8312, lng: -96.3886 },
    'Depew, OK': { lat: 35.7981, lng: -96.4638 },
    'Stroud, OK': { lat: 35.7481, lng: -96.6583 },
    'Davenport, OK': { lat: 35.7031, lng: -96.7686 },
    'Chandler, OK': { lat: 35.7017, lng: -96.8806 },
    'Warwick, OK': { lat: 35.6631, lng: -96.9327 },
    'Wellston, OK': { lat: 35.6881, lng: -97.0583 },
    'Luther, OK': { lat: 35.6631, lng: -97.1916 },
    'Arcadia, OK': { lat: 35.6531, lng: -97.3238 },
    'Edmond, OK': { lat: 35.6528, lng: -97.4781 },
    'Oklahoma City, OK': { lat: 35.4676, lng: -97.5164 },
    'Bethany, OK': { lat: 35.5201, lng: -97.6306 },
    'Yukon, OK': { lat: 35.5067, lng: -97.7625 },
    'El Reno, OK': { lat: 35.5320, lng: -97.9550 },
    'Calumet, OK': { lat: 35.5781, lng: -98.1267 },
    'Geary, OK': { lat: 35.6331, lng: -98.3181 },
    'Hydro, OK': { lat: 35.5631, lng: -98.5786 },
    'Weatherford, OK': { lat: 35.5267, lng: -98.7070 },
    'Clinton, OK': { lat: 35.5148, lng: -98.9681 },
    'Foss, OK': { lat: 35.4681, lng: -99.1870 },
    'Canute, OK': { lat: 35.4381, lng: -99.2881 },
    'Elk City, OK': { lat: 35.4112, lng: -99.4043 },
    'Sayre, OK': { lat: 35.2912, lng: -99.6401 },
    'Erick, OK': { lat: 35.2145, lng: -99.8681 },
    'Texola, OK': { lat: 35.2181, lng: -99.9798 },

    // Texas cities
    'Shamrock, TX': { lat: 35.2181, lng: -100.2462 },
    'McLean, TX': { lat: 35.2381, lng: -100.5998 },
    'Alanreed, TX': { lat: 35.1931, lng: -100.7698 },
    'Groom, TX': { lat: 35.2031, lng: -101.1098 },
    'Conway, TX': { lat: 35.2181, lng: -101.3781 },
    'Amarillo, TX': { lat: 35.2220, lng: -101.8313 },
    'Bushland, TX': { lat: 35.1931, lng: -102.0698 },
    'Wildorado, TX': { lat: 35.2331, lng: -102.1781 },
    'Vega, TX': { lat: 35.2431, lng: -102.4281 },
    'Landergin, TX': { lat: 35.1231, lng: -102.4698 },
    'Adrian, TX': { lat: 35.2731, lng: -102.6698 },
    'Glenrio, TX': { lat: 35.2831, lng: -103.0398 },

    // New Mexico cities
    'Glenrio, NM': { lat: 35.2831, lng: -103.0398 },
    'Endee, NM': { lat: 35.2831, lng: -103.2098 },
    'Bard, NM': { lat: 35.3231, lng: -103.3798 },
    'San Jon, NM': { lat: 35.1131, lng: -103.3298 },
    'Tucumcari, NM': { lat: 35.1719, lng: -103.7250 },
    'Montoya, NM': { lat: 35.1331, lng: -104.3598 },
    'Newkirk, NM': { lat: 35.0931, lng: -104.4798 },
    'Cuervo, NM': { lat: 35.0631, lng: -104.7598 },
    'Santa Rosa, NM': { lat: 34.9331, lng: -104.6798 },
    'Romeroville, NM': { lat: 35.2131, lng: -105.2098 },
    'Las Vegas, NM': { lat: 35.5942, lng: -105.2186 },
    'Tecolotito, NM': { lat: 35.4331, lng: -105.2798 },
    'Bernal, NM': { lat: 35.4131, lng: -105.3198 },
    'San Miguel, NM': { lat: 35.3831, lng: -105.3598 },
    'Rowe, NM': { lat: 35.3531, lng: -105.4098 },
    'Pecos, NM': { lat: 35.5431, lng: -105.6798 },
    'Glorieta, NM': { lat: 35.5731, lng: -105.7598 },
    'Canoncito, NM': { lat: 35.5831, lng: -105.8398 },
    'Santa Fe, NM': { lat: 35.6870, lng: -105.9378 },
    'La Bajada, NM': { lat: 35.4831, lng: -106.1098 },
    'Cochiti, NM': { lat: 35.6231, lng: -106.3298 },
    'Santo Domingo Pueblo, NM': { lat: 35.5131, lng: -106.3698 },
    'San Felipe Pueblo, NM': { lat: 35.4331, lng: -106.4398 },
    'Algodones, NM': { lat: 35.3831, lng: -106.4998 },
    'Bernalillo, NM': { lat: 35.3042, lng: -106.5492 },
    'Alameda, NM': { lat: 35.2831, lng: -106.6098 },
    'Albuquerque, NM': { lat: 35.0844, lng: -106.6504 },
    'Nine Mile Hill, NM': { lat: 35.0331, lng: -106.7898 },
    'Correo, NM': { lat: 34.9331, lng: -106.8598 },
    'Los Lunas, NM': { lat: 34.8131, lng: -106.7331 },
    'Isleta Pueblo, NM': { lat: 34.9131, lng: -106.6698 },
    'Laguna Pueblo, NM': { lat: 35.0331, lng: -107.3798 },
    'Paraje, NM': { lat: 34.9731, lng: -107.4698 },
    'Budville, NM': { lat: 34.9431, lng: -107.5598 },
    'Cubero, NM': { lat: 35.0931, lng: -107.6298 },
    'San Fidel, NM': { lat: 34.9731, lng: -107.6898 },
    'McCartys, NM': { lat: 34.9631, lng: -107.7598 },
    'Grants, NM': { lat: 35.1472, lng: -107.8520 },
    'Milan, NM': { lat: 35.1731, lng: -107.9098 },
    'Prewitt, NM': { lat: 35.3931, lng: -108.0798 },
    'Thoreau, NM': { lat: 35.4131, lng: -108.2298 },
    'Continental Divide, NM': { lat: 35.4331, lng: -108.3598 },
    'Iyanbito, NM': { lat: 35.4731, lng: -108.4898 },
    'Gallup, NM': { lat: 35.5281, lng: -108.7426 },
    'Mentmore, NM': { lat: 35.5431, lng: -108.8398 },
    'Manuelito, NM': { lat: 35.5231, lng: -108.9298 },

    // Arizona cities
    'Lupton, AZ': { lat: 35.3831, lng: -109.0898 },
    'Houck, AZ': { lat: 35.3631, lng: -109.1398 },
    'Sanders, AZ': { lat: 35.2131, lng: -109.3298 },
    'Chambers, AZ': { lat: 35.1431, lng: -109.4698 },
    'Navajo, AZ': { lat: 35.7531, lng: -109.9998 },
    'Joseph City, AZ': { lat: 34.9531, lng: -110.3298 },
    'Holbrook, AZ': { lat: 34.9031, lng: -110.1598 },
    'Sun Valley, AZ': { lat: 34.8831, lng: -109.8798 },
    'Geronimo, AZ': { lat: 34.8731, lng: -109.7598 },
    'Painted Desert, AZ': { lat: 35.0531, lng: -109.7898 },
    'Adamana, AZ': { lat: 34.8231, lng: -109.8098 },
    'Petrified Forest, AZ': { lat: 34.8131, lng: -109.8898 },
    'Goodwater, AZ': { lat: 34.7531, lng: -110.0698 },
    'Holbrook, AZ': { lat: 34.9031, lng: -110.1598 },
    'Joseph City, AZ': { lat: 34.9531, lng: -110.3298 },
    'Jackrabbit, AZ': { lat: 35.0231, lng: -110.4698 },
    'Winslow, AZ': { lat: 35.0242, lng: -110.6973 },
    'Winona, AZ': { lat: 35.1631, lng: -111.2298 },
    'Flagstaff, AZ': { lat: 35.1983, lng: -111.651 },
    'Bellemont, AZ': { lat: 35.2531, lng: -111.8498 },
    'Parks, AZ': { lat: 35.2631, lng: -111.9598 },
    'Riordan, AZ': { lat: 35.2231, lng: -112.1098 },
    'Maine, AZ': { lat: 35.2231, lng: -112.2098 },
    'Ash Fork, AZ': { lat: 35.2231, lng: -112.4831 },
    'Crookton, AZ': { lat: 35.1831, lng: -112.7498 },
    'Seligman, AZ': { lat: 35.3264, lng: -112.8742 },
    'Chino Valley, AZ': { lat: 34.7664, lng: -112.4542 },
    'Paulden, AZ': { lat: 34.8831, lng: -112.4698 },
    'Skull Valley, AZ': { lat: 34.6131, lng: -112.7098 },
    'Kirkland, AZ': { lat: 34.3831, lng: -112.7398 },
    'Yarnell, AZ': { lat: 34.2231, lng: -112.7498 },
    'Congress, AZ': { lat: 34.1731, lng: -112.8698 },
    'Date Creek, AZ': { lat: 34.1031, lng: -113.0098 },
    'Nothing, AZ': { lat: 34.0831, lng: -113.0398 },
    'Alamo, AZ': { lat: 34.2531, lng: -113.5298 },
    'Wikieup, AZ': { lat: 34.6731, lng: -113.5998 },
    'Kingman, AZ': { lat: 35.1895, lng: -114.0530 },
    'Cool Springs, AZ': { lat: 35.2431, lng: -114.3998 },
    'Oatman, AZ': { lat: 35.0231, lng: -114.3898 },
    'Goldroad, AZ': { lat: 35.0031, lng: -114.4198 },
    'Topock, AZ': { lat: 34.7231, lng: -114.4898 },

    // California cities
    'Needles, CA': { lat: 34.8481, lng: -114.6142 },
    'Goffs, CA': { lat: 34.9131, lng: -115.0598 },
    'Fenner, CA': { lat: 34.8431, lng: -115.2598 },
    'Essex, CA': { lat: 34.7331, lng: -115.2398 },
    'Chambless, CA': { lat: 34.6931, lng: -115.3798 },
    'Cadiz, CA': { lat: 34.5131, lng: -115.5198 },
    'Amboy, CA': { lat: 34.5581, lng: -115.7442 },
    'Bagdad, CA': { lat: 34.5431, lng: -115.8798 },
    'Siberia, CA': { lat: 34.5231, lng: -116.0498 },
    'Klondike, CA': { lat: 34.4931, lng: -116.1498 },
    'Newberry Springs, CA': { lat: 34.7931, lng: -116.6898 },
    'Daggett, CA': { lat: 34.8531, lng: -116.8598 },
    'Barstow, CA': { lat: 34.8958, lng: -117.0173 },
    'Lenwood, CA': { lat: 34.8731, lng: -117.0898 },
    'Hodge, CA': { lat: 34.8631, lng: -117.1598 },
    'Helendale, CA': { lat: 34.7431, lng: -117.3398 },
    'Oro Grande, CA': { lat: 34.5931, lng: -117.3498 },
    'Victorville, CA': { lat: 34.5362, lng: -117.2911 },
    'Cajon, CA': { lat: 34.3531, lng: -117.4398 },
    'Devore, CA': { lat: 34.2431, lng: -117.4098 },
    'San Bernardino, CA': { lat: 34.1083, lng: -117.2898 },
    'Rialto, CA': { lat: 34.1064, lng: -117.3703 },
    'Fontana, CA': { lat: 34.0922, lng: -117.4350 },
    'Rancho Cucamonga, CA': { lat: 34.1064, lng: -117.5931 },
    'Upland, CA': { lat: 34.0975, lng: -117.6483 },
    'Claremont, CA': { lat: 34.0969, lng: -117.7198 },
    'La Verne, CA': { lat: 34.1089, lng: -117.7681 },
    'San Dimas, CA': { lat: 34.1067, lng: -117.8067 },
    'Glendora, CA': { lat: 34.1361, lng: -117.8653 },
    'Azusa, CA': { lat: 34.1342, lng: -117.9075 },
    'Duarte, CA': { lat: 34.1394, lng: -117.9773 },
    'Monrovia, CA': { lat: 34.1442, lng: -118.0019 },
    'Arcadia, CA': { lat: 34.1397, lng: -118.0353 },
    'Pasadena, CA': { lat: 34.1478, lng: -118.1445 },
    'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
    'Hollywood, CA': { lat: 34.0928, lng: -118.3287 },
    'West Hollywood, CA': { lat: 34.0900, lng: -118.3617 },
    'Beverly Hills, CA': { lat: 34.0736, lng: -118.4004 },
    'Santa Monica, CA': { lat: 34.0195, lng: -118.4912 },
    'Venice, CA': { lat: 33.9850, lng: -118.4695 },
    'Manhattan Beach, CA': { lat: 33.8847, lng: -118.4109 },
    'Redondo Beach, CA': { lat: 33.8492, lng: -118.3884 },
    'Torrance, CA': { lat: 33.8358, lng: -118.3407 },
    'San Pedro, CA': { lat: 33.7361, lng: -118.2923 }
  };

  static normalizeSearchTerm(cityName: string): string {
    console.log('🗺️ GeocodingService: Normalizing search term:', cityName);
    
    // Convert to lowercase and handle common variations
    let normalized = cityName.toLowerCase().trim();
    
    // Handle Saint/St. variations
    normalized = normalized.replace(/\bsaint\b/g, 'st.');
    normalized = normalized.replace(/\bst\b/g, 'st.');
    
    // Handle Devil's Elbow variations
    normalized = normalized.replace(/devil's elbow/g, 'devils elbow');
    normalized = normalized.replace(/devils elbow/g, 'devil\'s elbow');
    
    // Remove extra spaces and normalize punctuation
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    console.log('🗺️ GeocodingService: Normalized result:', normalized, 'from original:', cityName);
    return normalized;
  }

  static findCoordinateMatch(searchTerm: string): { lat: number; lng: number } | null {
    const normalizedSearch = this.normalizeSearchTerm(searchTerm);
    
    console.log('🗺️ GeocodingService: Searching for coordinates with normalized term:', normalizedSearch);
    console.log('🗺️ GeocodingService: Available keys (first 10):', Object.keys(this.coordinates).slice(0, 10));
    
    // Try exact match first
    for (const [key, coords] of Object.entries(this.coordinates)) {
      if (this.normalizeSearchTerm(key) === normalizedSearch) {
        console.log('✅ GeocodingService: Found exact match:', key, '→', coords);
        return coords;
      }
    }
    
    // Try partial matches (city name without state)
    const cityPart = normalizedSearch.split(',')[0].trim();
    console.log('🗺️ GeocodingService: Trying partial match with city part:', cityPart);
    
    for (const [key, coords] of Object.entries(this.coordinates)) {
      const keyCity = this.normalizeSearchTerm(key).split(',')[0].trim();
      if (keyCity === cityPart) {
        console.log('✅ GeocodingService: Found partial match:', key, '→', coords);
        return coords;
      }
    }
    
    // Try fuzzy matching for common variations
    for (const [key, coords] of Object.entries(this.coordinates)) {
      const keyNormalized = this.normalizeSearchTerm(key);
      if (keyNormalized.includes(cityPart) || cityPart.includes(keyNormalized.split(',')[0].trim())) {
        console.log('✅ GeocodingService: Found fuzzy match:', key, '→', coords);
        return coords;
      }
    }
    
    console.log('❌ GeocodingService: No match found for:', searchTerm);
    return null;
  }

  static getCoordinatesForCity(cityName: string): { lat: number; lng: number } | null {
    console.log('🗺️ GeocodingService: Looking up coordinates for:', JSON.stringify(cityName));
    
    if (!cityName || typeof cityName !== 'string') {
      console.error('❌ GeocodingService: Invalid city name provided:', cityName);
      return null;
    }

    const result = this.findCoordinateMatch(cityName);
    
    if (!result) {
      console.warn('❌ GeocodingService: No coordinates found for:', JSON.stringify(cityName));
      console.log('🗺️ GeocodingService: Suggestion - Available cities containing similar text:');
      
      const cityPart = cityName.toLowerCase().split(',')[0].trim();
      const suggestions = Object.keys(this.coordinates)
        .filter(key => key.toLowerCase().includes(cityPart))
        .slice(0, 5);
      
      console.log('🗺️ GeocodingService: Suggestions:', suggestions);
    } else {
      console.log('✅ GeocodingService: Found coordinates for:', cityName, '→', result);
    }

    return result;
  }

  static getAllAvailableCities(): string[] {
    return Object.keys(this.coordinates);
  }

  static debugSearchTerm(searchTerm: string): void {
    console.log('🔍 GeocodingService Debug for:', searchTerm);
    console.log('🔍 Normalized:', this.normalizeSearchTerm(searchTerm));
    console.log('🔍 Available keys:', Object.keys(this.coordinates).filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }
}
