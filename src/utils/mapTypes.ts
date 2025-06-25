
// mapTypes.ts - Types and data for maps

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
}

// CORRECTED Route 66 DESTINATION CITIES with proper sequence
export const route66Towns: Location[] = [
  { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
  { latLng: [39.8003, -89.6437], name: "Springfield, IL" }, // FIRST Springfield - BEFORE St. Louis
  { latLng: [38.6273, -90.1979], name: "St. Louis, MO" }, // AFTER Springfield, IL
  { latLng: [37.2090, -93.2923], name: "Springfield, MO" }, // SECOND Springfield - AFTER St. Louis
  { latLng: [37.0842, -94.5133], name: "Joplin, MO" },
  { latLng: [36.1540, -95.9928], name: "Tulsa, OK" },
  { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
  { latLng: [35.2220, -101.8313], name: "Amarillo, TX" },
  { latLng: [35.1719, -103.7249], name: "Tucumcari, NM" },
  { latLng: [35.6870, -105.9378], name: "Santa Fe, NM" },
  { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
  { latLng: [35.5281, -108.7426], name: "Gallup, NM" },
  { latLng: [35.0242, -110.6973], name: "Winslow, AZ" },
  { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
  { latLng: [35.2494, -112.1901], name: "Williams, AZ" },
  { latLng: [35.1895, -114.0530], name: "Kingman, AZ" },
  { latLng: [34.8958, -117.0228], name: "Barstow, CA" },
  { latLng: [34.1083, -117.2898], name: "San Bernardino, CA" },
  { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
  { latLng: [34.0195, -118.4912], name: "Santa Monica, CA" }
];

// Legacy export for backward compatibility
export const locations = route66Towns;
