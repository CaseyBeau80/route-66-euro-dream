
import { route66Towns } from "@/types/route66";

export const getVisibleTowns = (selectedState: string | null) => {
  if (selectedState) {
    return route66Towns.filter(town => 
      town.name.includes(`, ${selectedState}`)
    );
  }
  return route66Towns;
};
