
// CORRECTED Route 66 waypoints with proper city sequence following actual highway
export const route66HighwayWaypoints = [
  // Illinois - I-55 corridor (historic US-66) - CORRECTED SEQUENCE
  {lat: 41.8781, lng: -87.6298, description: "Chicago, IL - Route 66 Start"},
  {lat: 41.5250, lng: -88.0817, description: "Joliet, IL"},
  {lat: 41.1306, lng: -88.8290, description: "Pontiac, IL"},
  {lat: 40.4842, lng: -88.9937, description: "Bloomington, IL"},
  {lat: 40.1164, lng: -89.4089, description: "McLean, IL"},
  {lat: 40.0631, lng: -89.4006, description: "Atlanta, IL"},
  {lat: 40.1481, lng: -89.3649, description: "Lincoln, IL"},
  {lat: 39.8003, lng: -89.6437, description: "Springfield, IL - FIRST Springfield on Route 66"},
  {lat: 39.1600, lng: -89.9700, description: "Litchfield, IL"},
  {lat: 38.9500, lng: -90.1000, description: "Edwardsville, IL"},
  
  // Missouri - I-44 corridor (historic US-66) - AFTER Springfield, IL
  {lat: 38.7067, lng: -90.3990, description: "St. Louis, MO - Gateway Arch"},
  {lat: 38.4500, lng: -91.0000, description: "Pacific, MO"},
  {lat: 38.2500, lng: -91.8000, description: "Sullivan, MO"},
  {lat: 38.0890, lng: -91.7624, description: "Rolla, MO"},
  {lat: 37.7500, lng: -92.5000, description: "Lebanon, MO"},
  {lat: 37.2090, lng: -93.2923, description: "Springfield, MO - SECOND Springfield on Route 66"},
  {lat: 37.1500, lng: -93.8000, description: "Carthage, MO"},
  {lat: 37.0842, lng: -94.5133, description: "Joplin, MO"},
  
  // Kansas - Brief stretch through southeast Kansas
  {lat: 37.0764, lng: -94.6294, description: "Galena, KS"},
  {lat: 37.0403, lng: -94.7077, description: "Riverton, KS"},
  {lat: 37.0200, lng: -94.8200, description: "Baxter Springs, KS"},
  
  // Oklahoma - I-44 then I-40
  {lat: 36.9000, lng: -94.8500, description: "Commerce, OK"},
  {lat: 36.8500, lng: -94.9000, description: "Miami, OK"},
  {lat: 36.7279, lng: -95.3414, description: "Tulsa, OK"},
  {lat: 35.6528, lng: -96.7417, description: "Sapulpa, OK"},
  {lat: 35.4676, lng: -97.5164, description: "Oklahoma City, OK"},
  {lat: 35.5089, lng: -98.9680, description: "Elk City, OK"},
  
  // Texas - I-40 through Texas Panhandle
  {lat: 35.3000, lng: -100.0000, description: "Shamrock, TX"},
  {lat: 35.2220, lng: -101.8313, description: "Amarillo, TX"},
  
  // New Mexico - I-40 with Santa Fe branch
  {lat: 35.1677, lng: -103.7044, description: "Tucumcari, NM"},
  {lat: 35.1000, lng: -104.5000, description: "Santa Rosa, NM"},
  {lat: 35.6869, lng: -105.9378, description: "Santa Fe, NM - Historic Branch"},
  {lat: 35.0844, lng: -106.6504, description: "Albuquerque, NM"},
  {lat: 35.0820, lng: -108.7426, description: "Gallup, NM"},
  
  // Arizona - I-40 then Historic US-66
  {lat: 35.0819, lng: -110.0298, description: "Holbrook, AZ"},
  {lat: 35.0242, lng: -110.6973, description: "Winslow, AZ"},
  {lat: 35.1983, lng: -111.6513, description: "Flagstaff, AZ"},
  {lat: 35.2494, lng: -112.1901, description: "Williams, AZ"},
  {lat: 35.2262, lng: -112.8871, description: "Seligman, AZ"},
  {lat: 35.1895, lng: -114.0530, description: "Kingman, AZ"},
  
  // California - Historic Route 66 to Santa Monica
  {lat: 34.8409, lng: -114.6160, description: "Needles, CA"},
  {lat: 34.8987, lng: -117.0178, description: "Barstow, CA"},
  {lat: 34.4208, lng: -117.3103, description: "Victorville, CA"},
  {lat: 34.1066, lng: -117.5931, description: "San Bernardino, CA"},
  {lat: 34.0825, lng: -118.0732, description: "Pasadena, CA"},
  {lat: 34.0522, lng: -118.2437, description: "Los Angeles, CA"},
  {lat: 34.0195, lng: -118.4912, description: "Santa Monica, CA - Route 66 End"},
];

// Export ordered waypoints for proper Route 66 sequence
export const orderedRoute66Waypoints = route66HighwayWaypoints;

// Helper function to get waypoints by state
export const getWaypointsByState = (state: string) => {
  return route66HighwayWaypoints.filter(waypoint => 
    waypoint.description.includes(`, ${state}`)
  );
};

// Helper function to validate Route 66 sequence - CORRECTED
export const validateRoute66Sequence = () => {
  console.log('🛣️ CORRECTED Route 66 Waypoints Validation:');
  console.log('✅ 1. Chicago, IL (Start):', route66HighwayWaypoints[0]);
  console.log('✅ 2. Springfield, IL (FIRST):', route66HighwayWaypoints.find(w => w.description.includes('Springfield, IL')));
  console.log('✅ 3. St. Louis, MO (AFTER Springfield IL):', route66HighwayWaypoints.find(w => w.description.includes('St. Louis')));
  console.log('✅ 4. Springfield, MO (SECOND):', route66HighwayWaypoints.find(w => w.description.includes('Springfield, MO')));
  console.log('✅ 5. Santa Monica, CA (End):', route66HighwayWaypoints[route66HighwayWaypoints.length - 1]);
  
  // Find indices to verify correct order
  const springfieldILIndex = route66HighwayWaypoints.findIndex(w => w.description.includes('Springfield, IL'));
  const stLouisIndex = route66HighwayWaypoints.findIndex(w => w.description.includes('St. Louis'));
  const springfieldMOIndex = route66HighwayWaypoints.findIndex(w => w.description.includes('Springfield, MO'));
  
  console.log('🔄 SEQUENCE ORDER VALIDATION:');
  console.log(`Springfield, IL index: ${springfieldILIndex}`);
  console.log(`St. Louis, MO index: ${stLouisIndex}`);
  console.log(`Springfield, MO index: ${springfieldMOIndex}`);
  console.log(`✅ Correct order: ${springfieldILIndex < stLouisIndex && stLouisIndex < springfieldMOIndex ? 'YES' : 'NO'}`);
  
  return {
    startsInChicago: route66HighwayWaypoints[0].description.includes('Chicago, IL'),
    hasCorrectSpringfieldIL: route66HighwayWaypoints.some(w => w.description.includes('Springfield, IL')),
    hasSpringfieldMO: route66HighwayWaypoints.some(w => w.description.includes('Springfield, MO')),
    endsInSantaMonica: route66HighwayWaypoints[route66HighwayWaypoints.length - 1].description.includes('Santa Monica, CA'),
    correctSequenceOrder: springfieldILIndex < stLouisIndex && stLouisIndex < springfieldMOIndex,
    totalWaypoints: route66HighwayWaypoints.length
  };
};
