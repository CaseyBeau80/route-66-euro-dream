
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

// BALANCED DRIVE TIME CALCULATION: Ensures realistic and safe daily drives
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚨 BALANCED CALCULATION: Computing drive time for ${distance.toFixed(1)} miles`);
  
  // Constants for balanced trip planning
  const MIN_DAILY_DISTANCE = 150; // Minimum for meaningful progress
  const MAX_DAILY_DISTANCE = 400; // Maximum for safety and enjoyment
  const PREFERRED_DAILY_DISTANCE = 300; // Sweet spot for Route 66
  const MAX_DRIVE_HOURS = 8; // Absolute maximum per day
  
  // Handle edge cases
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚨 Invalid distance ${distance}, returning 0.5h`);
    return 0.5;
  }
  
  // Warn about distances outside preferred range
  if (distance < MIN_DAILY_DISTANCE) {
    console.warn(`⚠️ SHORT DAY: ${distance.toFixed(1)}mi is below recommended minimum ${MIN_DAILY_DISTANCE}mi`);
  } else if (distance > MAX_DAILY_DISTANCE) {
    console.warn(`⚠️ LONG DAY: ${distance.toFixed(1)}mi exceeds recommended maximum ${MAX_DAILY_DISTANCE}mi`);
  }
  
  // Calculate realistic Route 66 speed based on distance
  let avgSpeed: number;
  
  if (distance < 100) {
    avgSpeed = 40; // City driving, frequent stops
  } else if (distance < 200) {
    avgSpeed = 45; // Mixed driving
  } else if (distance < 300) {
    avgSpeed = 50; // Mostly highway
  } else {
    avgSpeed = 55; // Long highway stretches
  }
  
  const baseTime = distance / avgSpeed;
  
  // Add realistic buffer for Route 66 experience (stops, sightseeing, photos)
  const bufferMultiplier = 1.15; // 15% buffer for Route 66 attractions
  const calculatedTime = baseTime * bufferMultiplier;
  
  // Never exceed maximum safe drive time
  const finalTime = Math.min(calculatedTime, MAX_DRIVE_HOURS);
  
  // Log calculation details
  console.log(`✅ Balanced drive time calculation:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    baseTime: baseTime.toFixed(1),
    withBuffer: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    wasCapped: calculatedTime > MAX_DRIVE_HOURS,
    category: distance < MIN_DAILY_DISTANCE ? 'short' : 
              distance > MAX_DAILY_DISTANCE ? 'long' : 'balanced'
  });
  
  // Ensure minimum time and return
  return Math.max(finalTime, 0.5);
};
