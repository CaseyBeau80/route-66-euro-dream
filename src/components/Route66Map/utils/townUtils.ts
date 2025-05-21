import { route66Towns } from "@/types/route66";

// The 8 Route 66 states
const route66States = ['IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'];

export const getVisibleTowns = (selectedState: string | null) => {
  // If a state is selected, show only towns in that state
  if (selectedState) {
    return route66Towns.filter(town => 
      town.name.includes(`, ${selectedState}`)
    );
  }
  
  // Otherwise, filter towns to only show those in the 8 Route 66 states
  return route66Towns.filter(town => {
    // Extract state code from town name (format typically "Town, STATE")
    const parts = town.name.split(', ');
    if (parts.length > 1) {
      const stateCode = parts[parts.length - 1];
      return route66States.includes(stateCode);
    }
    return false;
  });
};
