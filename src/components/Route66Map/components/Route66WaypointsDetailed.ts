
// Enhanced Route 66 waypoints with more detailed points along the historic route
// These follow the actual roads and highways that made up Route 66
interface DetailedWaypointData {
  lat: number;
  lng: number;
  stopover: boolean;
  description?: string;
  highway?: string; // Which highway/road this point follows
}

export const detailedRoute66Waypoints: DetailedWaypointData[] = [
  // Illinois - Following US-66/I-55 corridor
  {lat: 41.8781, lng: -87.6298, stopover: true, description: "Chicago, IL - Start of Route 66", highway: "US-66"},
  {lat: 41.7500, lng: -87.7500, stopover: false, description: "Cicero, IL", highway: "US-66"},
  {lat: 41.5250, lng: -88.0817, stopover: true, description: "Joliet, IL", highway: "US-66"},
  {lat: 41.3500, lng: -88.4000, stopover: false, description: "Elwood, IL", highway: "US-66"},
  {lat: 41.1306, lng: -88.8290, stopover: true, description: "Pontiac, IL", highway: "US-66"},
  {lat: 40.7500, lng: -89.2000, stopover: false, description: "Normal, IL", highway: "US-66"},
  {lat: 40.1164, lng: -89.4089, stopover: false, description: "McLean, IL", highway: "US-66"},
  {lat: 39.8003, lng: -89.6437, stopover: true, description: "Springfield, IL", highway: "US-66"},
  {lat: 39.4500, lng: -89.8500, stopover: false, description: "Litchfield, IL", highway: "US-66"},
  
  // Missouri - Following I-44 corridor (historic US-66)
  {lat: 38.7067, lng: -90.3990, stopover: true, description: "St. Louis, MO", highway: "I-44"},
  {lat: 38.5500, lng: -90.7500, stopover: false, description: "Eureka, MO", highway: "I-44"},
  {lat: 38.4000, lng: -91.2000, stopover: false, description: "Sullivan, MO", highway: "I-44"},
  {lat: 38.2500, lng: -91.8000, stopover: false, description: "Rolla, MO", highway: "I-44"},
  {lat: 37.9500, lng: -92.3500, stopover: false, description: "Lebanon, MO", highway: "I-44"},
  {lat: 37.2090, lng: -93.2923, stopover: true, description: "Springfield, MO", highway: "I-44"},
  {lat: 37.1500, lng: -93.8000, stopover: false, description: "Carthage, MO", highway: "I-44"},
  {lat: 37.0842, lng: -94.5133, stopover: true, description: "Joplin, MO", highway: "I-44"},
  
  // Oklahoma - Following I-44 then I-40
  {lat: 36.9000, lng: -94.8000, stopover: false, description: "Miami, OK", highway: "I-44"},
  {lat: 36.7000, lng: -95.2000, stopover: false, description: "Vinita, OK", highway: "I-44"},
  {lat: 36.1540, lng: -95.9928, stopover: true, description: "Tulsa, OK", highway: "I-44"},
  {lat: 35.9000, lng: -96.4000, stopover: false, description: "Sapulpa, OK", highway: "I-44"},
  {lat: 35.6500, lng: -96.9000, stopover: false, description: "Stroud, OK", highway: "I-44"},
  {lat: 35.4676, lng: -97.5164, stopover: true, description: "Oklahoma City, OK", highway: "I-40"},
  {lat: 35.4000, lng: -98.0000, stopover: false, description: "El Reno, OK", highway: "I-40"},
  {lat: 35.5089, lng: -98.9680, stopover: true, description: "Elk City, OK", highway: "I-40"},
  
  // Texas - Following I-40
  {lat: 35.3000, lng: -100.0000, stopover: false, description: "Shamrock, TX", highway: "I-40"},
  {lat: 35.2220, lng: -101.8313, stopover: true, description: "Amarillo, TX", highway: "I-40"},
  
  // New Mexico - Following I-40
  {lat: 35.1245, lng: -103.7207, stopover: true, description: "Tucumcari, NM", highway: "I-40"},
  {lat: 35.1000, lng: -104.5000, stopover: false, description: "Santa Rosa, NM", highway: "I-40"},
  {lat: 35.0844, lng: -106.6504, stopover: true, description: "Albuquerque, NM", highway: "I-40"},
  {lat: 35.0820, lng: -108.7426, stopover: true, description: "Gallup, NM", highway: "I-40"},
  
  // Arizona - Following I-40
  {lat: 35.0819, lng: -110.0298, stopover: true, description: "Holbrook, AZ", highway: "I-40"},
  {lat: 35.1500, lng: -111.0000, stopover: false, description: "Winslow, AZ", highway: "I-40"},
  {lat: 35.1983, lng: -111.6513, stopover: true, description: "Flagstaff, AZ", highway: "I-40"},
  {lat: 35.2262, lng: -112.8871, stopover: true, description: "Seligman, AZ", highway: "Historic US-66"},
  {lat: 35.0222, lng: -114.3716, stopover: true, description: "Kingman, AZ", highway: "Historic US-66"},
  
  // California - Following I-40 then local roads
  {lat: 34.8409, lng: -114.6160, stopover: true, description: "Needles, CA", highway: "I-40"},
  {lat: 34.8987, lng: -117.0178, stopover: true, description: "Barstow, CA", highway: "I-40"},
  {lat: 34.1066, lng: -117.5931, stopover: true, description: "San Bernardino, CA", highway: "I-210"},
  {lat: 34.0825, lng: -118.0732, stopover: true, description: "Pasadena, CA", highway: "I-210"},
  {lat: 34.0522, lng: -118.2437, stopover: true, description: "Los Angeles, CA", highway: "Local roads"},
  {lat: 34.0195, lng: -118.4912, stopover: true, description: "Santa Monica, CA - End of Route 66", highway: "Local roads"},
];

// Function to get route segments for better road following
export const getRoute66Segments = (): Array<{start: number, end: number, maxWaypoints: number}> => {
  return [
    {start: 0, end: 8, maxWaypoints: 8}, // Illinois
    {start: 8, end: 17, maxWaypoints: 8}, // Missouri  
    {start: 17, end: 22, maxWaypoints: 8}, // Oklahoma
    {start: 22, end: 24, maxWaypoints: 8}, // Texas
    {start: 24, end: 28, maxWaypoints: 8}, // New Mexico
    {start: 28, end: 32, maxWaypoints: 8}, // Arizona
    {start: 32, end: 37, maxWaypoints: 8}, // California
  ];
};
