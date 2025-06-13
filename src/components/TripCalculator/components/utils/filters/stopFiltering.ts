
import { TripStop } from '../../../types/TripStop';
import { StrictDestinationCityEnforcer } from '../../../services/planning/StrictDestinationCityEnforcer';

// STRICT filter function to only allow destination cities
export const isUserRelevantStop = (stop: TripStop): boolean => {
  console.log(`🔍 STRICT FILTER: Checking ${stop.name} (${stop.category})`);
  const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
  
  if (!isDestCity) {
    console.log(`🚫 STRICT FILTER: Rejected ${stop.name} - not a destination city`);
  } else {
    console.log(`✅ STRICT FILTER: Approved ${stop.name} - destination city`);
  }
  
  return isDestCity;
};

// Additional filter to ensure only destination cities are used
export const isDestinationCity = (stop: TripStop): boolean => {
  return StrictDestinationCityEnforcer.isDestinationCity(stop);
};

// Legacy support for existing filters but enforce destination city restriction
export const isValidRouteStop = (stop: TripStop): boolean => {
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
  console.log(`🔒 STRICT FILTERING: Processing ${stops.length} stops`);
  return StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(stops);
};

// Validation function for trip planning
export const validateStopForTripPlanning = (stop: TripStop, context: string = 'planning'): boolean => {
  console.log(`🛡️ STRICT VALIDATION: Validating ${stop.name} for ${context}`);
  
  if (!StrictDestinationCityEnforcer.isDestinationCity(stop)) {
    console.warn(`⚠️ STRICT VALIDATION: ${stop.name} rejected for ${context} - not a destination city`);
    return false;
  }
  
  console.log(`✅ STRICT VALIDATION: ${stop.name} approved for ${context}`);
  return true;
};
