
// Define an interface for our waypoint data structure
interface WaypointData {
  lat: number;
  lng: number;
  stopover: boolean;
  description?: string;
}

// Route 66 waypoints defining key historic locations along the route
// These are ordered from Chicago to Los Angeles (east to west)
export const route66WaypointData: WaypointData[] = [
  // Illinois
  {lat: 41.8781, lng: -87.6298, stopover: true, description: "Chicago, IL - Start of Route 66"}, 
  {lat: 41.5250, lng: -88.0817, stopover: true, description: "Joliet, IL"},
  {lat: 41.1306, lng: -88.8290, stopover: true, description: "Pontiac, IL"},
  {lat: 39.8003, lng: -89.6437, stopover: true, description: "Springfield, IL"},
  
  // Missouri
  {lat: 38.7067, lng: -90.3990, stopover: true, description: "St. Louis, MO"},
  {lat: 37.2090, lng: -93.2923, stopover: true, description: "Springfield, MO"},
  {lat: 37.0842, lng: -94.5133, stopover: true, description: "Joplin, MO"},
  
  // Oklahoma
  {lat: 36.1540, lng: -95.9928, stopover: true, description: "Tulsa, OK"},
  {lat: 35.4676, lng: -97.5164, stopover: true, description: "Oklahoma City, OK"},
  {lat: 35.5089, lng: -98.9680, stopover: true, description: "Elk City, OK"},
  
  // Texas
  {lat: 35.2220, lng: -101.8313, stopover: true, description: "Amarillo, TX"},
  
  // New Mexico
  {lat: 35.1245, lng: -103.7207, stopover: true, description: "Tucumcari, NM"},
  {lat: 35.0844, lng: -106.6504, stopover: true, description: "Albuquerque, NM"},
  {lat: 35.0820, lng: -108.7426, stopover: true, description: "Gallup, NM"},
  
  // Arizona
  {lat: 35.0819, lng: -110.0298, stopover: true, description: "Holbrook, AZ"},
  {lat: 35.1983, lng: -111.6513, stopover: true, description: "Flagstaff, AZ"},
  {lat: 35.2262, lng: -112.8871, stopover: true, description: "Seligman, AZ"},
  {lat: 35.0222, lng: -114.3716, stopover: true, description: "Kingman, AZ"},
  
  // California
  {lat: 34.8409, lng: -114.6160, stopover: true, description: "Needles, CA"},
  {lat: 34.8987, lng: -117.0178, stopover: true, description: "Barstow, CA"},
  {lat: 34.1066, lng: -117.5931, stopover: true, description: "San Bernardino, CA"},
  {lat: 34.0825, lng: -118.0732, stopover: true, description: "Pasadena, CA"},
  {lat: 34.0522, lng: -118.2437, stopover: true, description: "Los Angeles, CA"},
  {lat: 34.0195, lng: -118.4912, stopover: true, description: "Santa Monica, CA - End of Route 66"},
];

// Convert raw data to Google Maps waypoints only when the API is available
export const getGoogleWaypoints = (): google.maps.DirectionsWaypoint[] => {
  if (typeof google === 'undefined') {
    console.error('Google Maps API not loaded yet');
    return [];
  }
  
  return route66WaypointData.map(point => ({
    location: new google.maps.LatLng(point.lat, point.lng),
    stopover: point.stopover
  }));
};

// Get waypoints as simple objects for when Google Maps API isn't available yet
export const getRoute66Coordinates = (): {lat: number, lng: number}[] => {
  return route66WaypointData.map(({lat, lng}) => ({lat, lng}));
};
