
// Historic Route 66 waypoints following actual highways and real roads
// These follow the genuine historic Route 66 path and modern highways that replaced it
interface HistoricWaypointData {
  lat: number;
  lng: number;
  stopover: boolean;
  description?: string;
  highway?: string; // The actual highway/road this follows
  historicDesignation?: string; // Original Route 66 designation if different
}

export const historicRoute66Waypoints: HistoricWaypointData[] = [
  // Illinois - Following historic US-66, now mostly I-55
  {lat: 41.8781, lng: -87.6298, stopover: true, description: "Chicago, IL - Grant Park (Route 66 Start)", highway: "US-66 Historic", historicDesignation: "US-66"},
  {lat: 41.7500, lng: -87.7500, stopover: false, description: "Cicero, IL", highway: "US-66/Ogden Ave", historicDesignation: "US-66"},
  {lat: 41.5250, lng: -88.0817, stopover: true, description: "Joliet, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 41.3500, lng: -88.4000, stopover: false, description: "Wilmington, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 41.1306, lng: -88.8290, stopover: true, description: "Pontiac, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 40.7500, lng: -89.2000, stopover: false, description: "Normal, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 40.5000, lng: -89.4000, stopover: false, description: "Atlanta, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 40.1164, lng: -89.4089, stopover: false, description: "McLean, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 39.8003, lng: -89.6437, stopover: true, description: "Springfield, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  {lat: 39.4500, lng: -89.8500, stopover: false, description: "Litchfield, IL", highway: "US-66/I-55", historicDesignation: "US-66"},
  
  // Missouri - Following I-44 (historic US-66 corridor)
  {lat: 38.7067, lng: -90.3990, stopover: true, description: "St. Louis, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 38.5500, lng: -90.7500, stopover: false, description: "Eureka, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 38.4000, lng: -91.2000, stopover: false, description: "Sullivan, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 38.3500, lng: -91.5000, stopover: false, description: "Bourbon, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 38.2500, lng: -91.8000, stopover: false, description: "Rolla, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 38.1000, lng: -92.1000, stopover: false, description: "Doolittle, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 37.9500, lng: -92.3500, stopover: false, description: "Lebanon, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 37.7000, lng: -92.8000, stopover: false, description: "Marshfield, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 37.2090, lng: -93.2923, stopover: true, description: "Springfield, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 37.1500, lng: -93.8000, stopover: false, description: "Carthage, MO", highway: "I-44", historicDesignation: "US-66"},
  {lat: 37.0842, lng: -94.5133, stopover: true, description: "Joplin, MO", highway: "I-44", historicDesignation: "US-66"},
  
  // Oklahoma - Following I-44 then I-40
  {lat: 36.9000, lng: -94.8000, stopover: false, description: "Miami, OK", highway: "I-44", historicDesignation: "US-66"},
  {lat: 36.7000, lng: -95.2000, stopover: false, description: "Vinita, OK", highway: "I-44", historicDesignation: "US-66"},
  {lat: 36.1540, lng: -95.9928, stopover: true, description: "Tulsa, OK", highway: "I-44", historicDesignation: "US-66"},
  {lat: 35.9000, lng: -96.4000, stopover: false, description: "Sapulpa, OK", highway: "I-44", historicDesignation: "US-66"},
  {lat: 35.6500, lng: -96.9000, stopover: false, description: "Stroud, OK", highway: "I-44", historicDesignation: "US-66"},
  {lat: 35.4676, lng: -97.5164, stopover: true, description: "Oklahoma City, OK", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.4000, lng: -98.0000, stopover: false, description: "El Reno, OK", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.3500, lng: -98.5000, stopover: false, description: "Weatherford, OK", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.5089, lng: -98.9680, stopover: true, description: "Elk City, OK", highway: "I-40", historicDesignation: "US-66"},
  
  // Texas - Following I-40
  {lat: 35.3000, lng: -100.0000, stopover: false, description: "Shamrock, TX", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.2220, lng: -101.8313, stopover: true, description: "Amarillo, TX", highway: "I-40", historicDesignation: "US-66"},
  
  // New Mexico - Following I-40
  {lat: 35.1245, lng: -103.7207, stopover: true, description: "Tucumcari, NM", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.1000, lng: -104.5000, stopover: false, description: "Santa Rosa, NM", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.0844, lng: -106.6504, stopover: true, description: "Albuquerque, NM", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.0820, lng: -108.7426, stopover: true, description: "Gallup, NM", highway: "I-40", historicDesignation: "US-66"},
  
  // Arizona - Following I-40, then historic US-66
  {lat: 35.0819, lng: -110.0298, stopover: true, description: "Holbrook, AZ", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.1500, lng: -111.0000, stopover: false, description: "Winslow, AZ", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.1983, lng: -111.6513, stopover: true, description: "Flagstaff, AZ", highway: "I-40", historicDesignation: "US-66"},
  {lat: 35.2262, lng: -112.8871, stopover: true, description: "Seligman, AZ", highway: "Historic US-66", historicDesignation: "US-66"},
  {lat: 35.0222, lng: -114.3716, stopover: true, description: "Kingman, AZ", highway: "Historic US-66", historicDesignation: "US-66"},
  
  // California - Following I-40, then I-15, then local historic roads
  {lat: 34.8409, lng: -114.6160, stopover: true, description: "Needles, CA", highway: "I-40", historicDesignation: "US-66"},
  {lat: 34.8987, lng: -117.0178, stopover: true, description: "Barstow, CA", highway: "I-40", historicDesignation: "US-66"},
  {lat: 34.1066, lng: -117.5931, stopover: true, description: "San Bernardino, CA", highway: "I-15/US-66", historicDesignation: "US-66"},
  {lat: 34.0825, lng: -118.0732, stopover: true, description: "Pasadena, CA", highway: "I-210/Historic US-66", historicDesignation: "US-66"},
  {lat: 34.0522, lng: -118.2437, stopover: true, description: "Los Angeles, CA", highway: "US-66 Business Route", historicDesignation: "US-66"},
  {lat: 34.0195, lng: -118.4912, stopover: true, description: "Santa Monica, CA - Santa Monica Pier (Route 66 End)", highway: "Santa Monica Blvd", historicDesignation: "US-66"},
];

// Create highway-specific segments that follow real road networks
export const getHistoricRoute66Segments = (): Array<{start: number, end: number, highway: string, description: string}> => {
  return [
    // Illinois segments following I-55/historic US-66
    {start: 0, end: 4, highway: "I-55", description: "Chicago to Pontiac via I-55 (historic US-66 corridor)"},
    {start: 4, end: 9, highway: "I-55", description: "Pontiac to Springfield via I-55 (historic US-66 corridor)"},
    
    // Missouri segments following I-44
    {start: 9, end: 14, highway: "I-44", description: "Illinois border to Rolla via I-44 (historic US-66)"},
    {start: 14, end: 18, highway: "I-44", description: "Rolla to Springfield via I-44 (historic US-66)"},
    {start: 18, end: 20, highway: "I-44", description: "Springfield to Joplin via I-44 (historic US-66)"},
    
    // Oklahoma segments following I-44 then I-40
    {start: 20, end: 24, highway: "I-44", description: "Missouri border to Oklahoma City via I-44 (historic US-66)"},
    {start: 24, end: 28, highway: "I-40", description: "Oklahoma City to Texas border via I-40 (historic US-66)"},
    
    // Texas segment following I-40
    {start: 28, end: 30, highway: "I-40", description: "Oklahoma border to New Mexico border via I-40 (historic US-66)"},
    
    // New Mexico segments following I-40
    {start: 30, end: 34, highway: "I-40", description: "Texas border to Arizona border via I-40 (historic US-66)"},
    
    // Arizona segments following I-40 and historic US-66
    {start: 34, end: 37, highway: "I-40", description: "New Mexico border to Flagstaff via I-40 (historic US-66)"},
    {start: 37, end: 39, highway: "Historic US-66", description: "Flagstaff to Kingman via Historic US-66"},
    
    // California segments following I-40, I-15, and historic roads
    {start: 39, end: 42, highway: "I-40/I-15", description: "Arizona border to San Bernardino via I-40 and I-15"},
    {start: 42, end: 45, highway: "Historic US-66/Local", description: "San Bernardino to Santa Monica via historic US-66 and local roads"},
  ];
};
