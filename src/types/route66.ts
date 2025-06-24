
// Route 66 heritage cities and destinations - UPDATED: Using state abbreviations
export interface Route66Town {
  name: string;
  state: string;
  coordinates: { lat: number; lng: number };
  latLng: [number, number]; // Add backward compatibility
}

export const route66Towns: Route66Town[] = [
  { name: 'Chicago', state: 'IL', coordinates: { lat: 41.8781, lng: -87.6298 }, latLng: [41.8781, -87.6298] },
  { name: 'Joliet', state: 'IL', coordinates: { lat: 41.5250, lng: -88.0817 }, latLng: [41.5250, -88.0817] },
  { name: 'Pontiac', state: 'IL', coordinates: { lat: 40.8809, lng: -88.6298 }, latLng: [40.8809, -88.6298] },
  { name: 'Springfield', state: 'IL', coordinates: { lat: 39.7817, lng: -89.6501 }, latLng: [39.7817, -89.6501] },
  { name: 'St. Louis', state: 'MO', coordinates: { lat: 38.6270, lng: -90.1994 }, latLng: [38.6270, -90.1994] },
  { name: 'Springfield', state: 'MO', coordinates: { lat: 37.2431, lng: -93.2983 }, latLng: [37.2431, -93.2983] },
  { name: 'Joplin', state: 'MO', coordinates: { lat: 37.0842, lng: -94.5133 }, latLng: [37.0842, -94.5133] },
  { name: 'Oklahoma City', state: 'OK', coordinates: { lat: 35.4676, lng: -97.5164 }, latLng: [35.4676, -97.5164] },
  { name: 'Elk City', state: 'OK', coordinates: { lat: 35.4120, lng: -99.4043 }, latLng: [35.4120, -99.4043] },
  { name: 'Shamrock', state: 'TX', coordinates: { lat: 35.2034, lng: -100.2468 }, latLng: [35.2034, -100.2468] },
  { name: 'Amarillo', state: 'TX', coordinates: { lat: 35.2220, lng: -101.8313 }, latLng: [35.2220, -101.8313] },
  { name: 'Tucumcari', state: 'NM', coordinates: { lat: 35.1717, lng: -103.7255 }, latLng: [35.1717, -103.7255] },
  { name: 'Santa Rosa', state: 'NM', coordinates: { lat: 34.9381, lng: -104.6828 }, latLng: [34.9381, -104.6828] },
  { name: 'Albuquerque', state: 'NM', coordinates: { lat: 35.0844, lng: -106.6504 }, latLng: [35.0844, -106.6504] },
  { name: 'Santa Fe', state: 'NM', coordinates: { lat: 35.6870, lng: -105.9378 }, latLng: [35.6870, -105.9378] },
  { name: 'Gallup', state: 'NM', coordinates: { lat: 35.5281, lng: -108.7426 }, latLng: [35.5281, -108.7426] },
  { name: 'Holbrook', state: 'AZ', coordinates: { lat: 34.9025, lng: -110.1665 }, latLng: [34.9025, -110.1665] },
  { name: 'Winslow', state: 'AZ', coordinates: { lat: 35.0242, lng: -110.6974 }, latLng: [35.0242, -110.6974] },
  { name: 'Flagstaff', state: 'AZ', coordinates: { lat: 35.1983, lng: -111.6513 }, latLng: [35.1983, -111.6513] },
  { name: 'Williams', state: 'AZ', coordinates: { lat: 35.2494, lng: -112.1901 }, latLng: [35.2494, -112.1901] },
  { name: 'Seligman', state: 'AZ', coordinates: { lat: 35.3261, lng: -112.8755 }, latLng: [35.3261, -112.8755] },
  { name: 'Kingman', state: 'AZ', coordinates: { lat: 35.1894, lng: -114.0530 }, latLng: [35.1894, -114.0530] },
  { name: 'Needles', state: 'CA', coordinates: { lat: 34.8481, lng: -114.6144 }, latLng: [34.8481, -114.6144] },
  { name: 'Barstow', state: 'CA', coordinates: { lat: 34.8958, lng: -117.0228 }, latLng: [34.8958, -117.0228] },
  { name: 'Santa Monica', state: 'CA', coordinates: { lat: 34.0195, lng: -118.4912 }, latLng: [34.0195, -118.4912] }
];

// Export for backward compatibility
export { route66Towns as route66Cities };
