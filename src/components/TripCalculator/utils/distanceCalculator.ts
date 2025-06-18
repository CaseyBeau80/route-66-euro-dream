
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

// STRICT DRIVE TIME CALCULATION: Enforces absolute 10-hour maximum
export const calculateRealisticDriveTime = (distance: number): number => {
  console.log(`🚨 STRICT CALCULATION: Computing drive time for ${distance.toFixed(1)} miles with ABSOLUTE 10h limit`);
  
  // Absolute constants - no exceptions
  const ABSOLUTE_MAX_DRIVE_HOURS = 10; // NEVER exceed this
  const RECOMMENDED_MAX_HOURS = 8;     // Comfortable maximum
  const OPTIMAL_MAX_HOURS = 6;         // Ideal range top
  const MIN_MEANINGFUL_HOURS = 2;      // Minimum useful drive time
  
  // Handle edge cases
  if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
    console.log(`🚨 Invalid distance ${distance}, returning 2h minimum`);
    return MIN_MEANINGFUL_HOURS;
  }
  
  // Calculate realistic Route 66 speed based on distance and road conditions
  let avgSpeed: number;
  
  if (distance < 100) {
    avgSpeed = 40; // City driving, frequent stops, tourist areas
  } else if (distance < 200) {
    avgSpeed = 45; // Mixed driving with some highway
  } else if (distance < 300) {
    avgSpeed = 50; // Mostly highway driving
  } else if (distance < 400) {
    avgSpeed = 52; // Long highway stretches
  } else {
    avgSpeed = 55; // Maximum for very long distances
  }
  
  const baseTime = distance / avgSpeed;
  
  // Add realistic buffer for Route 66 experience (stops, sightseeing, traffic)
  const bufferMultiplier = 1.20; // 20% buffer for Route 66 attractions and stops
  const calculatedTime = baseTime * bufferMultiplier;
  
  // ABSOLUTE ENFORCEMENT: Never allow more than 10 hours
  let finalTime = calculatedTime;
  
  if (calculatedTime > ABSOLUTE_MAX_DRIVE_HOURS) {
    console.error(`🚨 CRITICAL: ${calculatedTime.toFixed(1)}h exceeds ABSOLUTE 10h limit - FORCING to 10h`);
    finalTime = ABSOLUTE_MAX_DRIVE_HOURS;
  } else if (calculatedTime > RECOMMENDED_MAX_HOURS) {
    console.warn(`⚠️ LONG DAY: ${calculatedTime.toFixed(1)}h exceeds recommended ${RECOMMENDED_MAX_HOURS}h`);
  }
  
  // Ensure minimum meaningful time
  finalTime = Math.max(finalTime, MIN_MEANINGFUL_HOURS);
  
  // Log calculation details
  console.log(`✅ STRICT drive time calculation:`, {
    distance: distance.toFixed(1),
    avgSpeed,
    baseTime: baseTime.toFixed(1),
    withBuffer: calculatedTime.toFixed(1),
    finalTime: finalTime.toFixed(1),
    wasForced: calculatedTime > ABSOLUTE_MAX_DRIVE_HOURS,
    category: finalTime <= OPTIMAL_MAX_HOURS ? 'optimal' : 
              finalTime <= RECOMMENDED_MAX_HOURS ? 'acceptable' : 
              finalTime < ABSOLUTE_MAX_DRIVE_HOURS ? 'long' : 'maximum'
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
