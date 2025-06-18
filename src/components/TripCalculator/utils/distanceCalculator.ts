
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

// ABSOLUTE 10-HOUR ENFORCEMENT: No drive time can exceed 10 hours - EVER
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚨 ABSOLUTE 10H ENFORCEMENT: Calculating drive time for ${distance.toFixed(1)} miles`);
  
  // ABSOLUTE MAXIMUM: 10 hours - no exceptions
  const ABSOLUTE_MAX_HOURS = 10;
  
  // Handle all edge cases with extreme prejudice
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚨 Invalid distance ${distance}, returning 0.5h`);
    return 0.5;
  }
  
  // For any distance that would result in >10h at reasonable speeds, cap at 10h
  // This means if someone tries to drive 600+ miles in one day, we cap it
  const maxDistanceFor10Hours = 500; // 500 miles = 10 hours at 50mph average
  
  if (distance > maxDistanceFor10Hours) {
    console.warn(`🚨 DISTANCE CAPPED: ${distance.toFixed(1)}mi would exceed 10h - FORCING to exactly 10h`);
    return ABSOLUTE_MAX_HOURS;
  }
  
  let avgSpeed: number;
  let bufferMultiplier: number;
  
  if (distance < 50) {
    avgSpeed = 45;
    bufferMultiplier = 1.2;
  } else if (distance < 150) {
    avgSpeed = 55;
    bufferMultiplier = 1.15;
  } else if (distance < 300) {
    avgSpeed = 65;
    bufferMultiplier = 1.1;
  } else {
    avgSpeed = 70;
    bufferMultiplier = 1.05;
  }
  
  const baseTime = distance / avgSpeed;
  const calculatedTime = baseTime * bufferMultiplier;
  
  // ABSOLUTE ENFORCEMENT: Never exceed 10 hours under any circumstances
  const finalTime = Math.min(calculatedTime, ABSOLUTE_MAX_HOURS);
  
  console.log(`🚨 10H ENFORCEMENT COMPLETE:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    baseTime: baseTime.toFixed(1),
    calculatedTime: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    cappedAt10Hours: calculatedTime > ABSOLUTE_MAX_HOURS,
    absoluteMaxHours: ABSOLUTE_MAX_HOURS,
    guarantee: 'NEVER_EXCEEDS_10_HOURS'
  });
  
  // Ensure minimum time and return
  const result = Math.max(finalTime, 0.5);
  
  // FINAL SAFETY CHECK: If somehow result is still > 10, force it to 10
  if (result > ABSOLUTE_MAX_HOURS) {
    console.error(`🚨 EMERGENCY: Result ${result} > 10h - FORCING TO 10h`);
    return ABSOLUTE_MAX_HOURS;
  }
  
  return result;
};
