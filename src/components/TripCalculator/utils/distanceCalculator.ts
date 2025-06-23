
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
  // Ensure we have a valid number
  const validHours = hours || 0;
  
  if (validHours < 1) {
    const minutes = Math.round(validHours * 60);
    return `${minutes}min`;
  }
  
  const wholeHours = Math.floor(validHours);
  const minutes = Math.round((validHours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}min`;
};

// IMPROVED DRIVE TIME CALCULATION: More realistic and distance-proportional
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚗 IMPROVED CALCULATION: Computing drive time for ${distance.toFixed(1)} miles`);
  
  // Handle edge cases
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚗 Invalid distance ${distance}, returning 1h minimum`);
    return 1;
  }
  
  // Calculate realistic Route 66 speed based on distance and road conditions
  let avgSpeed: number;
  let bufferMultiplier: number;
  
  if (distance < 50) {
    avgSpeed = 35; // Local roads, city driving, frequent stops
    bufferMultiplier = 1.3; // 30% buffer for local attractions and stops
  } else if (distance < 150) {
    avgSpeed = 45; // Mixed driving with some highway
    bufferMultiplier = 1.25; // 25% buffer for stops
  } else if (distance < 300) {
    avgSpeed = 50; // Mostly highway driving
    bufferMultiplier = 1.2; // 20% buffer for Route 66 attractions
  } else if (distance < 500) {
    avgSpeed = 55; // Long highway stretches
    bufferMultiplier = 1.15; // 15% buffer for fuel stops and breaks
  } else {
    avgSpeed = 58; // Very long distances, mostly interstate
    bufferMultiplier = 1.1; // 10% buffer for necessary stops
  }
  
  const baseTime = distance / avgSpeed;
  const calculatedTime = baseTime * bufferMultiplier;
  
  // Ensure minimum meaningful time (30 minutes for any drive)
  const finalTime = Math.max(calculatedTime, 0.5);
  
  // Log calculation details
  console.log(`✅ IMPROVED drive time calculation:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    baseTime: baseTime.toFixed(1),
    bufferMultiplier,
    withBuffer: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    hoursPerMile: (finalTime / distance).toFixed(3)
  });
  
  return finalTime;
};

// Geographic progression validator to prevent ping-ponging
export const validateGeographicProgression = (
  stops: Array<{ latitude: number; longitude: number; name: string }>,
  isEastToWest: boolean
): { isValid: boolean; violations: string[]; recommendation: string } => {
  const violations: string[] = [];
  
  if (stops.length < 2) {
    return { isValid: true, violations: [], recommendation: 'Route has insufficient stops to validate' };
  }
  
  console.log(`🧭 VALIDATING GEOGRAPHIC PROGRESSION: ${isEastToWest ? 'East→West' : 'West→East'}`);
  
  for (let i = 1; i < stops.length; i++) {
    const prevStop = stops[i - 1];
    const currentStop = stops[i];
    
    const longDiff = currentStop.longitude - prevStop.longitude;
    const expectedDirection = isEastToWest ? 1 : -1; // East to West = positive longitude change
    
    // Check if we're moving in the wrong direction (ping-ponging)
    if ((longDiff * expectedDirection) < -0.5) { // Allow small deviations
      const violation = `${prevStop.name} → ${currentStop.name}: Wrong direction (${isEastToWest ? 'going east' : 'going west'})`;
      violations.push(violation);
      console.warn(`⚠️ PING-PONG DETECTED: ${violation}`);
    }
    
    // Check for excessive backtracking (more than 1 degree longitude)
    if (Math.abs(longDiff) > 2 && (longDiff * expectedDirection) < 0) {
      const violation = `${prevStop.name} → ${currentStop.name}: Excessive backtracking (${Math.abs(longDiff).toFixed(1)}° longitude)`;
      violations.push(violation);
      console.error(`❌ EXCESSIVE BACKTRACKING: ${violation}`);
    }
  }
  
  const isValid = violations.length === 0;
  const recommendation = isValid 
    ? 'Geographic progression is logical and follows Route 66'
    : `Fix ${violations.length} routing violations to prevent backtracking and ping-ponging`;
  
  console.log(`${isValid ? '✅' : '❌'} Geographic validation: ${recommendation}`);
  
  return { isValid, violations, recommendation };
};
