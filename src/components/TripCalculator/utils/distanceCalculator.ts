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

// STRICT 8-HOUR ENFORCEMENT: No drive time can exceed 8 hours for Route 66 trips
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚨 STRICT 8H ENFORCEMENT: Calculating drive time for ${distance.toFixed(1)} miles`);
  
  // ABSOLUTE MAXIMUM: 8 hours for Route 66 trips - no exceptions
  const ABSOLUTE_MAX_HOURS = 8;
  const ABSOLUTE_MAX_DISTANCE = 450; // Maximum miles per day
  
  // Handle all edge cases
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚨 Invalid distance ${distance}, returning 0.5h`);
    return 0.5;
  }
  
  // Cap distance at absolute maximum
  const cappedDistance = Math.min(distance, ABSOLUTE_MAX_DISTANCE);
  const wasDistanceCapped = distance > ABSOLUTE_MAX_DISTANCE;
  
  if (wasDistanceCapped) {
    console.warn(`🚨 DISTANCE CAPPED: ${distance.toFixed(1)}mi capped to ${ABSOLUTE_MAX_DISTANCE}mi`);
  }
  
  // Calculate base drive time with realistic Route 66 speeds
  let avgSpeed: number;
  
  if (cappedDistance < 50) {
    avgSpeed = 45; // City driving, stops
  } else if (cappedDistance < 150) {
    avgSpeed = 50; // Mixed driving
  } else if (cappedDistance < 300) {
    avgSpeed = 55; // Highway driving
  } else {
    avgSpeed = 60; // Long highway stretches
  }
  
  const baseTime = cappedDistance / avgSpeed;
  
  // Add buffer for stops, traffic, etc. (but keep reasonable)
  const bufferMultiplier = 1.1; // Only 10% buffer
  const calculatedTime = baseTime * bufferMultiplier;
  
  // CRITICAL: NEVER exceed 8 hours under any circumstances
  const finalTime = Math.min(calculatedTime, ABSOLUTE_MAX_HOURS);
  
  // If the calculated time would exceed 8 hours, we need to flag this
  if (calculatedTime > ABSOLUTE_MAX_HOURS) {
    console.warn(`🚨 DRIVE TIME CAPPED: ${cappedDistance.toFixed(1)}mi would require ${calculatedTime.toFixed(1)}h - FORCED to ${ABSOLUTE_MAX_HOURS}h`);
  }
  
  console.log(`✅ Drive time calculation complete:`, {
    originalDistance: distance.toFixed(1),
    cappedDistance: cappedDistance.toFixed(1),
    avgSpeed,
    baseTime: baseTime.toFixed(1),
    calculatedTime: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    wasDistanceCapped,
    wasDriveTimeCapped: calculatedTime > ABSOLUTE_MAX_HOURS
  });
  
  // Ensure minimum time and return
  return Math.max(finalTime, 0.5);
};
