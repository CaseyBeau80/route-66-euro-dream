
import { TripStop } from '../../../types/TripStop';
import { StrictDestinationCityEnforcer } from '../../../services/planning/StrictDestinationCityEnforcer';

// STRICT filter function to only allow destination cities
export const isUserRelevantStop = (stop: TripStop): stop is TripStop => {
  if (!stop || typeof stop !== 'object') {
    console.log(`🚫 STRICT FILTER: Invalid stop object`);
    return false;
  }

  console.log(`🔍 STRICT FILTER: Checking ${(stop as TripStop).name} (${(stop as TripStop).category})`);
  const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
  
  if (!isDestCity) {
    console.log(`🚫 STRICT FILTER: Rejected ${(stop as TripStop).name} - not a destination city`);
  } else {
    console.log(`✅ STRICT FILTER: Approved ${(stop as TripStop).name} - destination city`);
  }
  
  return isDestCity;
};

// Additional filter to ensure only destination cities are used
export const isDestinationCity = (stop: TripStop): stop is TripStop => {
  return StrictDestinationCityEnforcer.isDestinationCity(stop);
};

// Legacy support for existing filters but enforce destination city restriction
export const isValidRouteStop = (stop: TripStop): stop is TripStop => {
  if (!stop || typeof stop !== 'object') {
    console.log(`🚫 STRICT VALIDATION: Invalid stop object`);
    return false;
  }

  const isValidData = stop.category === 'destination_city' && 
                     stop.latitude !== undefined && 
                     stop.longitude !== undefined &&
                     stop.name && 
                     stop.name.trim() !== '';
  
  const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
  
  console.log(`🔍 STRICT VALIDATION: ${stop.name} - Valid data: ${isValidData}, Destination city: ${isDestCity}`);
  
  return isValidData && isDestCity;
};

// New function to get only destination cities from an array
export const filterToDestinationCitiesOnly = (stops: TripStop[]): TripStop[] => {
  if (!stops || !Array.isArray(stops)) {
    console.log(`🔒 STRICT FILTERING: Invalid stops array`);
    return [];
  }
  
  console.log(`🔒 STRICT FILTERING: Processing ${stops.length} stops`);
  return StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(stops);
};

// Validation function for trip planning
export const validateStopForTripPlanning = (stop: TripStop, context: string = 'planning'): boolean => {
  if (!stop || typeof stop !== 'object') {
    console.warn(`⚠️ STRICT VALIDATION: Invalid stop object for ${context}`);
    return false;
  }

  console.log(`🛡️ STRICT VALIDATION: Validating ${(stop as TripStop).name} for ${context}`);
  
  if (!StrictDestinationCityEnforcer.isDestinationCity(stop)) {
    console.warn(`⚠️ STRICT VALIDATION: ${(stop as TripStop).name} rejected for ${context} - not a destination city`);
    return false;
  }
  
  console.log(`✅ STRICT VALIDATION: ${(stop as TripStop).name} approved for ${context}`);
  return true;
};
