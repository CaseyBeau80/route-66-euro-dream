
// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

// FIXED: Use realistic drive time calculation that matches DriveTimeEnforcementService
export const calculateRealisticDriveTime = (distance: number): number => {
  let avgSpeed: number;
  let bufferMultiplier: number;
  
  if (distance < 50) {
    avgSpeed = 45; // Urban/city driving
    bufferMultiplier = 1.2; // More traffic, lights
  } else if (distance < 150) {
    avgSpeed = 55; // Mixed roads
    bufferMultiplier = 1.15; // Some traffic
  } else if (distance < 300) {
    avgSpeed = 65; // Mostly highway
    bufferMultiplier = 1.1; // Light traffic
  } else {
    avgSpeed = 70; // Long highway stretches
    bufferMultiplier = 1.05; // Minimal stops
  }
  
  const baseTime = distance / avgSpeed;
  return Math.max(baseTime * bufferMultiplier, 0.5); // Minimum 30 minutes
};
