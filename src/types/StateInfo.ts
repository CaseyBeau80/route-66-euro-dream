
// Type definitions for Route 66 states information
export type StateInfo = {
  name: string;
  description: string;
  attractions: string[];
  path: string; // SVG path
  color: string; // Default color
  position: {
    x: number;
    y: number;
  }
};

export type Route66StatesType = Record<string, StateInfo>;

export const route66States: Route66StatesType = {
  illinois: {
    name: "Illinois",
    description: "The starting point of Route 66 in Chicago",
    attractions: ["Chicago", "Pontiac", "Springfield"],
    path: "M160,130 L180,110 L190,130 L195,145 L185,160 L165,155 L160,130",
    color: "#D1495B",
    position: { x: 175, y: 130 }
  },
  missouri: {
    name: "Missouri",
    description: "Home to the Gateway Arch and iconic Route 66 stops",
    attractions: ["St. Louis", "Springfield", "Cuba"],
    path: "M165,155 L185,160 L200,185 L175,195 L155,180 L165,155",
    color: "#EDAE49",
    position: { x: 175, y: 175 }
  },
  kansas: {
    name: "Kansas",
    description: "Brief but historic segment through the southeast corner",
    attractions: ["Galena", "Baxter Springs"],
    path: "M155,180 L175,195 L170,205 L150,190 L155,180",
    color: "#00798C",
    position: { x: 162, y: 195 }
  },
  oklahoma: {
    name: "Oklahoma",
    description: "Longest stretch of original Route 66 pavement",
    attractions: ["Tulsa", "Oklahoma City", "Clinton"],
    path: "M150,190 L170,205 L200,210 L220,230 L150,235 L140,205 L150,190",
    color: "#30638E",
    position: { x: 170, y: 215 }
  },
  texas: {
    name: "Texas",
    description: "The Panhandle section with Cadillac Ranch",
    attractions: ["Amarillo", "Cadillac Ranch", "Shamrock"],
    path: "M150,235 L220,230 L225,260 L150,265 L145,240 L150,235",
    color: "#D1495B",
    position: { x: 185, y: 245 }
  },
  newMexico: {
    name: "New Mexico",
    description: "Land of Enchantment with rich indigenous culture",
    attractions: ["Albuquerque", "Santa Fe", "Tucumcari"],
    path: "M150,265 L225,260 L220,305 L145,310 L140,275 L150,265",
    color: "#EDAE49",
    position: { x: 180, y: 285 }
  },
  arizona: {
    name: "Arizona",
    description: "Spectacular desert landscapes and the Painted Desert",
    attractions: ["Flagstaff", "Winslow", "Petrified Forest"],
    path: "M145,310 L220,305 L210,360 L120,350 L130,320 L145,310",
    color: "#00798C",
    position: { x: 175, y: 330 }
  },
  california: {
    name: "California",
    description: "The western terminus at Santa Monica Pier",
    attractions: ["Needles", "Barstow", "Santa Monica"],
    path: "M120,350 L210,360 L200,420 L90,410 L100,360 L120,350",
    color: "#30638E",
    position: { x: 150, y: 380 }
  }
};
