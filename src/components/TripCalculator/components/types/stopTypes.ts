
// Define proper types for stops to avoid TypeScript inference issues
export interface ValidatedStop {
  id: string;
  name: string;
  category?: string;
  city_name?: string;
  state?: string;
}

// Type guard to check if an object has the required stop properties
export const isValidStopObject = (stop: any): stop is { 
  name: string; 
  id?: string; 
  category?: string; 
  city_name?: string; 
  state?: string 
} => {
  return stop != null && 
         typeof stop === 'object' && 
         'name' in stop && 
         typeof stop.name === 'string' && 
         stop.name.trim() !== '';
};
