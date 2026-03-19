export interface Route66State {
  slug: string;
  name: string;
  abbreviation: string;
  description: string;
  miles: number;
  highlights: string[];
}

export const route66States: Route66State[] = [
  {
    slug: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    description: 'The starting point of Route 66 in Chicago\'s Grant Park. Illinois offers 300 miles of Mother Road history through classic small towns, vintage diners, and roadside oddities.',
    miles: 300,
    highlights: ['Chicago Start Point', 'Pontiac Route 66 Museum', 'Springfield', 'Cahokia Mounds'],
  },
  {
    slug: 'missouri',
    name: 'Missouri',
    abbreviation: 'MO',
    description: 'Missouri\'s 317 miles of Route 66 wind through the Ozarks, past cave systems, neon-lit motels, and the Gateway Arch in St. Louis.',
    miles: 317,
    highlights: ['St. Louis Gateway Arch', 'Meramec Caverns', 'Springfield Birthplace of Route 66'],
  },
  {
    slug: 'kansas',
    name: 'Kansas',
    abbreviation: 'KS',
    description: 'The shortest stretch of Route 66 at just 13 miles, but Kansas packs a punch with mining history, heritage museums, and small-town charm through Galena and Baxter Springs.',
    miles: 13,
    highlights: ['Cars on the Route', 'Baxter Springs Heritage Center', 'Rainbow Curve Bridge'],
  },
  {
    slug: 'oklahoma',
    name: 'Oklahoma',
    abbreviation: 'OK',
    description: 'Oklahoma has more drivable miles of the original Route 66 than any other state — 400 miles of round barns, blue whales, totem pole parks, and the heart of Native American heritage.',
    miles: 400,
    highlights: ['Blue Whale of Catoosa', 'Arcadia Round Barn', 'Oklahoma City', 'Tulsa'],
  },
  {
    slug: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    description: 'The Texas Panhandle delivers 178 miles of wide-open plains, the legendary Cadillac Ranch, the Big Texan Steak Ranch, and some of the most iconic neon signs on the Mother Road.',
    miles: 178,
    highlights: ['Cadillac Ranch', 'Big Texan Steak Ranch', 'U-Drop Inn', 'Devil\'s Rope Museum'],
  },
  {
    slug: 'new-mexico',
    name: 'New Mexico',
    abbreviation: 'NM',
    description: 'New Mexico\'s 487 miles of Route 66 traverse high desert mesas, ancient pueblos, and neon-soaked towns like Tucumcari and Santa Rosa. The Land of Enchantment lives up to its name.',
    miles: 487,
    highlights: ['Blue Hole of Santa Rosa', 'Tucumcari Tonight', 'Albuquerque Central Avenue', 'Blue Swallow Motel'],
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    description: 'Arizona\'s 401 miles feature the Painted Desert, Petrified Forest, the quirky town of Seligman (birthplace of the Route 66 revival), and breathtaking desert landscapes.',
    miles: 401,
    highlights: ['Seligman', 'Petrified Forest', 'Wigwam Motel', 'Oatman Burros'],
  },
  {
    slug: 'california',
    name: 'California',
    abbreviation: 'CA',
    description: 'The final 315 miles of Route 66 cross the Mojave Desert, through San Bernardino, and end at the Santa Monica Pier. The journey\'s grand finale under California sun.',
    miles: 315,
    highlights: ['Santa Monica Pier', 'Roy\'s Motel & Café', 'Elmer\'s Bottle Tree Ranch', 'Bagdad Cafe'],
  },
];

export const stateSlugMap = new Map(route66States.map(s => [s.slug, s]));
export const stateAbbrMap = new Map(route66States.map(s => [s.abbreviation, s]));

export const isValidStateSlug = (slug: string): boolean => stateSlugMap.has(slug);
