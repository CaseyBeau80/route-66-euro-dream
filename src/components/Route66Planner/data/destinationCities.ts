
export interface DestinationCity {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description: string;
  attractions: string[];
  isStartEndOption: boolean;
}

export const ROUTE_66_DESTINATION_CITIES: DestinationCity[] = [
  {
    id: 'chicago-il',
    name: 'Chicago',
    state: 'Illinois',
    latitude: 41.8781,
    longitude: -87.6298,
    description: 'The starting point of the historic Route 66',
    attractions: ['Willis Tower', 'Millennium Park', 'Route 66 Begin Sign'],
    isStartEndOption: true
  },
  {
    id: 'springfield-il',
    name: 'Springfield',
    state: 'Illinois',
    latitude: 39.7817,
    longitude: -89.6501,
    description: 'Land of Lincoln and Route 66 history',
    attractions: ['Abraham Lincoln Presidential Library', 'Cozy Dog Drive In'],
    isStartEndOption: false
  },
  {
    id: 'st-louis-mo',
    name: 'St. Louis',
    state: 'Missouri',
    latitude: 38.6270,
    longitude: -90.1994,
    description: 'Gateway to the West',
    attractions: ['Gateway Arch', 'City Museum', 'Ted Drewes Frozen Custard'],
    isStartEndOption: true
  },
  {
    id: 'springfield-mo',
    name: 'Springfield',
    state: 'Missouri',
    latitude: 37.2153,
    longitude: -93.2982,
    description: 'Birthplace of Route 66',
    attractions: ['Wild Animal Safari', 'Fantastic Caverns'],
    isStartEndOption: false
  },
  {
    id: 'tulsa-ok',
    name: 'Tulsa',
    state: 'Oklahoma',
    latitude: 36.1540,
    longitude: -95.9928,
    description: 'Oil Capital of the World',
    attractions: ['Philbrook Museum', 'Gathering Place', 'Golden Driller'],
    isStartEndOption: true
  },
  {
    id: 'oklahoma-city-ok',
    name: 'Oklahoma City',
    state: 'Oklahoma',
    latitude: 35.4676,
    longitude: -97.5164,
    description: 'Capital city with Route 66 heritage',
    attractions: ['National Cowboy Museum', 'Bricktown', 'Oklahoma City Memorial'],
    isStartEndOption: true
  },
  {
    id: 'amarillo-tx',
    name: 'Amarillo',
    state: 'Texas',
    latitude: 35.2220,
    longitude: -101.8313,
    description: 'Heart of the Texas Panhandle',
    attractions: ['Cadillac Ranch', 'Big Texan Steak Ranch', 'Palo Duro Canyon'],
    isStartEndOption: true
  },
  {
    id: 'albuquerque-nm',
    name: 'Albuquerque',
    state: 'New Mexico',
    latitude: 35.0844,
    longitude: -106.6504,
    description: 'High Desert Route 66 stop',
    attractions: ['Old Town Plaza', 'Sandia Peak Tramway', 'Route 66 Casino'],
    isStartEndOption: true
  },
  {
    id: 'santa-fe-nm',
    name: 'Santa Fe',
    state: 'New Mexico',
    latitude: 35.6870,
    longitude: -105.9378,
    description: 'Art and culture capital',
    attractions: ['Plaza', 'Georgia O\'Keeffe Museum', 'Loretto Chapel'],
    isStartEndOption: false
  },
  {
    id: 'flagstaff-az',
    name: 'Flagstaff',
    state: 'Arizona',
    latitude: 35.1983,
    longitude: -111.6513,
    description: 'Gateway to the Grand Canyon',
    attractions: ['Lowell Observatory', 'Historic Downtown', 'Museum of Northern Arizona'],
    isStartEndOption: true
  },
  {
    id: 'williams-az',
    name: 'Williams',
    state: 'Arizona',
    latitude: 35.2492,
    longitude: -112.1901,
    description: 'Gateway to the Grand Canyon',
    attractions: ['Grand Canyon Railway', 'Historic Route 66', 'Bearizona'],
    isStartEndOption: false
  },
  {
    id: 'kingman-az',
    name: 'Kingman',
    state: 'Arizona',
    latitude: 35.1894,
    longitude: -114.0531,
    description: 'Heart of historic Route 66',
    attractions: ['Route 66 Museum', 'Mohave Museum', 'Historic Downtown'],
    isStartEndOption: false
  },
  {
    id: 'barstow-ca',
    name: 'Barstow',
    state: 'California',
    latitude: 34.8958,
    longitude: -117.0228,
    description: 'Desert crossroads',
    attractions: ['Route 66 Mother Road Museum', 'Calico Ghost Town'],
    isStartEndOption: false
  },
  {
    id: 'san-bernardino-ca',
    name: 'San Bernardino',
    state: 'California',
    latitude: 34.1083,
    longitude: -117.2898,
    description: 'Historic Route 66 endpoint region',
    attractions: ['Original McDonald\'s Museum', 'Route 66 Rendezvous'],
    isStartEndOption: false
  },
  {
    id: 'los-angeles-ca',
    name: 'Los Angeles',
    state: 'California',
    latitude: 34.0522,
    longitude: -118.2437,
    description: 'The western terminus of Route 66',
    attractions: ['Santa Monica Pier', 'Hollywood Sign', 'Griffith Observatory'],
    isStartEndOption: true
  },
  {
    id: 'santa-monica-ca',
    name: 'Santa Monica',
    state: 'California',
    latitude: 34.0195,
    longitude: -118.4912,
    description: 'The official end of Route 66',  
    attractions: ['Santa Monica Pier', 'Third Street Promenade', 'Route 66 End Sign'],
    isStartEndOption: true
  }
];
