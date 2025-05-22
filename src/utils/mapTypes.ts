
// mapTypes.ts - Types and data for maps

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
}

// Route 66 towns with proper names
export const route66Towns: Location[] = [
  { latLng: [34.0522, -118.2437], name: "Los Angeles, CA - Route 66 Start Point" },
  { latLng: [35.0845, -106.6511], name: "Albuquerque, NM - Historic Old Town" },
  { latLng: [35.2220, -101.8313], name: "Amarillo, TX - Cadillac Ranch" },
  { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK - Route 66 Museum" },
  { latLng: [36.1540, -95.9928], name: "Tulsa, OK - Blue Dome District" },
  { latLng: [35.2271, -97.4305], name: "Norman, OK - Fred Jones Jr. Museum of Art" },
  { latLng: [37.6872, -97.3301], name: "Wichita, KS - The Keeper of the Plains" },
  { latLng: [36.9948, -94.7404], name: "Joplin, MO - Route 66 Mural Park" },
  { latLng: [38.6273, -90.1979], name: "St. Louis, MO - Gateway Arch" },
  { latLng: [39.7817, -89.6501], name: "Springfield, IL - Abraham Lincoln Sites" },
  { latLng: [41.8781, -87.6298], name: "Chicago, IL - Route 66 End Point" }
];

// Legacy export for backward compatibility
export const locations = route66Towns;
