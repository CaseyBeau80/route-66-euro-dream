
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

// CRITICAL FIX: Use realistic drive time calculation with ABSOLUTE hard limits
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚗 ABSOLUTE FIX: Calculating drive time for ${distance.toFixed(1)} miles`);
  
  // ABSOLUTE HARD LIMIT: Never allow more than 10 hours regardless of distance
  const ABSOLUTE_MAX_HOURS = 10;
  
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
  const calculatedTime = baseTime * bufferMultiplier;
  
  // ABSOLUTE CAP: Never exceed 10 hours - this is NON-NEGOTIABLE
  const finalTime = Math.min(calculatedTime, ABSOLUTE_MAX_HOURS);
  
  console.log(`🚗 ABSOLUTE FIX: Drive time calculation ENFORCED:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    bufferMultiplier,
    baseTime: baseTime.toFixed(1),
    calculatedTime: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    wasForciblyCapped: calculatedTime > ABSOLUTE_MAX_HOURS,
    absoluteMaxHours: ABSOLUTE_MAX_HOURS
  });
  
  return Math.max(finalTime, 0.5); // Minimum 30 minutes
};
