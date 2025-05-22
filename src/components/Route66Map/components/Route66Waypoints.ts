
// Route 66 waypoints defining key historic locations along the route
// These are ordered from Chicago to Los Angeles (east to west)
export const route66Waypoints = [
  // Illinois
  {location: new google.maps.LatLng(41.8781, -87.6298), stopover: true}, // Chicago, IL - Start of Route 66
  {location: new google.maps.LatLng(41.5250, -88.0817), stopover: true}, // Joliet, IL
  {location: new google.maps.LatLng(41.1306, -88.8290), stopover: true}, // Pontiac, IL
  {location: new google.maps.LatLng(39.8003, -89.6437), stopover: true}, // Springfield, IL
  
  // Missouri
  {location: new google.maps.LatLng(38.7067, -90.3990), stopover: true}, // St. Louis, MO
  {location: new google.maps.LatLng(37.2090, -93.2923), stopover: true}, // Springfield, MO
  {location: new google.maps.LatLng(37.0842, -94.5133), stopover: true}, // Joplin, MO
  
  // Oklahoma
  {location: new google.maps.LatLng(36.1540, -95.9928), stopover: true}, // Tulsa, OK
  {location: new google.maps.LatLng(35.4676, -97.5164), stopover: true}, // Oklahoma City, OK
  {location: new google.maps.LatLng(35.5089, -98.9680), stopover: true}, // Elk City, OK
  
  // Texas
  {location: new google.maps.LatLng(35.2220, -101.8313), stopover: true}, // Amarillo, TX
  
  // New Mexico
  {location: new google.maps.LatLng(35.1245, -103.7207), stopover: true}, // Tucumcari, NM
  {location: new google.maps.LatLng(35.0844, -106.6504), stopover: true}, // Albuquerque, NM
  {location: new google.maps.LatLng(35.0820, -108.7426), stopover: true}, // Gallup, NM
  
  // Arizona
  {location: new google.maps.LatLng(35.0819, -110.0298), stopover: true}, // Holbrook, AZ
  {location: new google.maps.LatLng(35.1983, -111.6513), stopover: true}, // Flagstaff, AZ
  {location: new google.maps.LatLng(35.2262, -112.8871), stopover: true}, // Seligman, AZ
  {location: new google.maps.LatLng(35.0222, -114.3716), stopover: true}, // Kingman, AZ
  
  // California
  {location: new google.maps.LatLng(34.8409, -114.6160), stopover: true}, // Needles, CA
  {location: new google.maps.LatLng(34.8987, -117.0178), stopover: true}, // Barstow, CA
  {location: new google.maps.LatLng(34.1066, -117.5931), stopover: true}, // San Bernardino, CA
  {location: new google.maps.LatLng(34.0825, -118.0732), stopover: true}, // Pasadena, CA
  {location: new google.maps.LatLng(34.0522, -118.2437), stopover: true}, // Los Angeles, CA
  {location: new google.maps.LatLng(34.0195, -118.4912), stopover: true}, // Santa Monica, CA - End of Route 66
];
