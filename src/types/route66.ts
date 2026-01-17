
export interface Route66Town {
  latLng: [number, number]; // Explicitly defining as a tuple with 2 numbers
  name: string;
}

export const route66Towns: Route66Town[] = [
  // CORRECTED Route 66 sequence - Springfield, IL comes BEFORE St. Louis, MO
  { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
  { latLng: [41.5250, -88.0817], name: "Joliet, IL" },
  { latLng: [41.1306, -88.8290], name: "Pontiac, IL" },
  { latLng: [40.4842, -88.9937], name: "Bloomington, IL" },
  { latLng: [40.1164, -89.4089], name: "McLean, IL" },
  { latLng: [40.0631, -89.4006], name: "Atlanta, IL" },
  { latLng: [40.1481, -89.3649], name: "Lincoln, IL" },
  { latLng: [39.8003, -89.6437], name: "Springfield, IL" }, // FIRST Springfield - BEFORE St. Louis
  { latLng: [39.1600, -89.9700], name: "Litchfield, IL" },
  
  // Missouri section - St. Louis comes AFTER Springfield, IL
  { latLng: [38.6272, -90.1978], name: "St. Louis, MO" }, // AFTER Springfield, IL
  { latLng: [38.0890, -91.7624], name: "Rolla, MO" },
  { latLng: [37.2090, -93.2923], name: "Springfield, MO" }, // SECOND Springfield
  { latLng: [37.0947, -94.5133], name: "Joplin, MO" },
  
  // Kansas brief stretch
  { latLng: [37.0764, -94.6294], name: "Galena, KS" },
  
  // Oklahoma
  { latLng: [36.1540, -95.9928], name: "Tulsa, OK" },
  { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
  { latLng: [35.4120, -99.4043], name: "Elk City, OK" },
  
  // Texas
  { latLng: [35.2150, -100.2490], name: "Shamrock, TX" },
  { latLng: [35.2220, -101.8313], name: "Amarillo, TX" },
  
  // New Mexico
  { latLng: [35.1677, -103.7044], name: "Tucumcari, NM" },
  { latLng: [35.0093, -104.6821], name: "Santa Rosa, NM" },
  { latLng: [35.6869, -105.9378], name: "Santa Fe, NM" }, // Branch route
  { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
  { latLng: [35.5280, -108.7426], name: "Gallup, NM" },
  
  // Arizona
  { latLng: [35.0606, -110.6322], name: "Winslow, AZ" },
  { latLng: [34.8397, -110.1543], name: "Holbrook, AZ" },
  { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
  { latLng: [35.2494, -112.1901], name: "Williams, AZ" },
  { latLng: [35.2677, -113.7558], name: "Seligman, AZ" },
  { latLng: [35.1894, -114.0530], name: "Kingman, AZ" },
  
  // California
  { latLng: [34.7361, -116.9954], name: "Needles, CA" },
  { latLng: [34.9983, -117.1858], name: "Barstow, CA" },
  { latLng: [34.0529, -117.1822], name: "San Bernardino, CA" },
  { latLng: [34.1341, -118.3215], name: "Los Angeles, CA" },
  { latLng: [34.0099, -118.4960], name: "Santa Monica, CA" }
];

// Legacy export for backward compatibility
export { route66Towns as locations };

export interface Route66Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  sequence_order: number;
  is_major_stop: boolean | null;
  highway_designation: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseRoute66Props {
  map: google.maps.Map;
}
