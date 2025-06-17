
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

// NUCLEAR OPTION: Absolutely bulletproof drive time calculation with ZERO exceptions
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚨 NUCLEAR DRIVE TIME CALCULATION: ${distance.toFixed(1)} miles`);
  
  // NUCLEAR ENFORCEMENT: Absolutely no drive time can exceed 8 hours - PERIOD
  const NUCLEAR_MAX_HOURS = 8;
  
  // Handle all edge cases with extreme prejudice
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚨 NUCLEAR: Invalid distance ${distance}, returning 0.5h`);
    return 0.5;
  }
  
  // For any distance over 400 miles, force to 8 hours max
  if (distance > 400) {
    console.warn(`🚨 NUCLEAR: Distance ${distance.toFixed(1)}mi > 400mi - FORCING to 8h limit`);
    return NUCLEAR_MAX_HOURS;
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
  
  // NUCLEAR ENFORCEMENT: Never exceed 8 hours under any circumstances
  const finalTime = Math.min(calculatedTime, NUCLEAR_MAX_HOURS);
  
  console.log(`🚨 NUCLEAR CALCULATION COMPLETE:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    bufferMultiplier,
    baseTime: baseTime.toFixed(1),
    calculatedTime: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    nuclearCapped: calculatedTime > NUCLEAR_MAX_HOURS,
    nuclearMaxHours: NUCLEAR_MAX_HOURS,
    guarantee: 'NEVER_EXCEEDS_8_HOURS'
  });
  
  // Ensure minimum time and return
  const result = Math.max(finalTime, 0.5);
  
  // FINAL SAFETY CHECK: If somehow result is still > 8, force it
  if (result > NUCLEAR_MAX_HOURS) {
    console.error(`🚨 NUCLEAR EMERGENCY: Result ${result} > 8h - FORCING TO 8h`);
    return NUCLEAR_MAX_HOURS;
  }
  
  return result;
};
