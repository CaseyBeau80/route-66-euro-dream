// Route 66 Centennial 2026 Events Data
// Data sourced from route66centennial.org/calendar
// Last updated: January 18, 2026

export type EventState = 'IL' | 'MO' | 'KS' | 'OK' | 'TX' | 'NM' | 'AZ' | 'CA' | 'national';
export type EventCategory = 'kickoff' | 'parade' | 'festival' | 'car-show' | 'concert' | 'caravan' | 'screening' | 'speaker-series' | 'bicycles' | 'motorcycles' | 'runs' | 'other';

export interface CentennialEvent {
  id: string;
  title: string;
  dateStart: string; // ISO date
  dateEnd?: string;  // For multi-day events
  dateDisplay: string; // Human-readable format
  location: string;
  venue?: string;
  state: EventState;
  description: string;
  category: EventCategory;
  isHighlight?: boolean;
  officialUrl?: string;
  guinnessAttempt?: boolean;
  guinnessNote?: string;
}

export const centennialEvents: CentennialEvent[] = [
  // =====================
  // NATIONAL / MULTI-STATE
  // =====================
  {
    id: 'nat-drive-home-vii',
    title: 'Drive Home VII Caravan',
    dateStart: '2026-01-03',
    dateEnd: '2026-01-12',
    dateDisplay: 'January 3-12, 2026',
    location: 'Santa Monica, CA to Chicago, IL',
    state: 'national',
    description: 'Epic caravan journey from Santa Monica to Chicago, kicking off the centennial year. Join anywhere along the route!',
    category: 'caravan',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/drive-home-vii'
  },
  {
    id: 'nat-april-kickoff',
    title: 'National Kickoff Day',
    dateStart: '2026-04-30',
    dateDisplay: 'April 30, 2026',
    location: 'Springfield, MO (Main) + Satellites',
    state: 'national',
    description: 'The official national kickoff celebration centered in Springfield, MO with satellite events across all 8 states—livestreamed globally.',
    category: 'kickoff',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/national-kickoff'
  },
  {
    id: 'nat-great-race',
    title: 'Route 66 Centennial Great Race',
    dateStart: '2026-06-20',
    dateEnd: '2026-06-28',
    dateDisplay: 'June 20-28, 2026',
    location: 'Chicago, IL to Santa Monica, CA',
    state: 'national',
    description: 'The legendary Great Race follows Route 66 from Chicago to Santa Monica with vintage automobiles competing along the Mother Road.',
    category: 'caravan',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/great-race'
  },
  {
    id: 'nat-main-street-caravan',
    title: 'Main Street of America Caravan',
    dateStart: '2026-09-01',
    dateEnd: '2026-09-14',
    dateDisplay: 'September 1-14, 2026',
    location: 'California to Illinois',
    state: 'national',
    description: 'Join the Main Street of America Caravan from California to Illinois—participants can join at any point along the route.',
    category: 'caravan',
    officialUrl: 'https://route66centennial.org/events/main-street-caravan'
  },
  {
    id: 'nat-documentary-premieres',
    title: 'Rolling Documentary Premieres',
    dateStart: '2026-09-01',
    dateEnd: '2026-12-31',
    dateDisplay: 'September - December 2026',
    location: 'Drive-ins & Theaters Across the Route',
    state: 'national',
    description: '"The Main Street of America" documentary screenings at drive-ins and theaters across all eight Route 66 states.',
    category: 'screening',
    officialUrl: 'https://route66centennial.org/events/documentary'
  },
  {
    id: 'nat-november-anniversary',
    title: 'Official 100th Anniversary',
    dateStart: '2026-11-11',
    dateDisplay: 'November 11, 2026',
    location: 'All 8 Route 66 States',
    state: 'national',
    description: 'The official 100th anniversary of Route 66\'s designation on November 11, 1926. Celebrations across all eight states!',
    category: 'kickoff',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/anniversary'
  },

  // =====================
  // ILLINOIS
  // =====================
  {
    id: 'il-joliet-kickoff',
    title: 'Joliet Prison Satellite Celebration',
    dateStart: '2026-04-30',
    dateDisplay: 'April 30, 2026',
    location: 'Joliet, IL',
    venue: 'Old Joliet Prison',
    state: 'IL',
    description: 'National Kickoff satellite celebration at the historic Old Joliet Prison—a Route 66 landmark and filming location for "The Blues Brothers."',
    category: 'kickoff',
    officialUrl: 'https://route66centennial.org/events/joliet-kickoff'
  },
  {
    id: 'il-statewide-conference',
    title: 'IL Route 66 Statewide Conference',
    dateStart: '2026-11-11',
    dateDisplay: 'November 11, 2026',
    location: 'Springfield, IL',
    state: 'IL',
    description: 'Illinois Route 66 Scenic Byway Statewide Conference & Centennial Celebration—a major gathering with educational and commemorative focus.',
    category: 'festival',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/illinois-conference'
  },

  // =====================
  // MISSOURI (Birthplace of Route 66)
  // =====================
  {
    id: 'mo-springfield-kickoff',
    title: 'Springfield National Kickoff Weekend',
    dateStart: '2026-04-30',
    dateEnd: '2026-05-03',
    dateDisplay: 'April 30 - May 3, 2026',
    location: 'Springfield, MO',
    venue: 'Historic Shrine Mosque & Downtown',
    state: 'MO',
    description: 'The heart of the national kickoff! A-list concert (Apr 30), National Route 66 Centennial Parade (May 1 at 6pm), Classic Car Show, First Friday Artwalk, Jefferson Ave. Footbridge Bash, and 1920s-themed Telegraph Ball gala (May 2).',
    category: 'kickoff',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/springfield-kickoff'
  },

  // =====================
  // KANSAS
  // =====================
  {
    id: 'ks-galena-days',
    title: 'Galena Days Festival',
    dateStart: '2026-06-03',
    dateEnd: '2026-06-06',
    dateDisplay: 'June 3-6, 2026',
    location: 'Galena, KS',
    state: 'KS',
    description: 'Annual Galena Days festival amplified for the centennial with classic car show, parade, and tributes to Route 66 heritage.',
    category: 'festival',
    officialUrl: 'https://route66centennial.org/events/galena-days'
  },

  // =====================
  // OKLAHOMA
  // =====================
  {
    id: 'ok-bristow-neon',
    title: 'Bristow Neon Relight',
    dateStart: '2026-04-11',
    dateDisplay: 'April 11, 2026',
    location: 'Bristow, OK',
    state: 'OK',
    description: 'Historic neon sign restoration celebration in Bristow—watch as classic Route 66 neon is brought back to life!',
    category: 'other',
    officialUrl: 'https://route66centennial.org/events/bristow-neon'
  },
  {
    id: 'ok-big-band-dance',
    title: 'Big Band Hangar Dance',
    dateStart: '2026-04-25',
    dateDisplay: 'April 25, 2026',
    location: 'Weatherford, OK',
    state: 'OK',
    description: '1940s-themed Big Band swing dance in a historic hangar—dress up in vintage attire and dance the night away!',
    category: 'concert',
    officialUrl: 'https://route66centennial.org/events/big-band-dance'
  },
  {
    id: 'ok-capital-cruise',
    title: 'Capital Cruise',
    dateStart: '2026-05-30',
    dateDisplay: 'May 30, 2026',
    location: 'Tulsa, OK',
    state: 'OK',
    description: 'Route 66 birthday bash with a massive classic car parade through downtown Tulsa. Official Guinness World Records™ attempt for the largest classic car parade!',
    category: 'parade',
    isHighlight: true,
    guinnessAttempt: true,
    guinnessNote: 'Official Guinness World Records™ attempt for largest classic car parade',
    officialUrl: 'https://route66centennial.org/events/capital-cruise'
  },
  {
    id: 'ok-okc-birthday-bash',
    title: 'OKC "Kickin\' It" Birthday Bash',
    dateStart: '2026-05-30',
    dateDisplay: 'May 30, 2026',
    location: 'Oklahoma City, OK',
    state: 'OK',
    description: 'Full-day nostalgic and modern celebration of Route 66\'s birthday in Oklahoma City—live music, food trucks, and family fun!',
    category: 'festival',
    officialUrl: 'https://route66centennial.org/events/okc-birthday-bash'
  },
  {
    id: 'ok-road-fest',
    title: 'AAA Route 66 Road Fest',
    dateStart: '2026-06-27',
    dateEnd: '2026-06-28',
    dateDisplay: 'June 27-28, 2026',
    location: 'Tulsa, OK',
    venue: 'SageNet Center',
    state: 'OK',
    description: 'AAA-sponsored signature national event! Two days of car parades, live entertainment, vendors, and Route 66 heritage celebrations at the SageNet Center.',
    category: 'festival',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/road-fest'
  },
  {
    id: 'ok-mural-fest',
    title: 'Oklahoma Route 66 Mural Fest',
    dateStart: '2026-07-18',
    dateDisplay: 'July 18, 2026',
    location: 'Statewide, OK',
    state: 'OK',
    description: 'Mural unveilings across Oklahoma Route 66 towns tied to shopkeepers weekend—celebrate local artists and Route 66 heritage!',
    category: 'festival',
    officialUrl: 'https://route66centennial.org/events/mural-fest'
  },
  {
    id: 'ok-teepee-cars',
    title: 'Tee Pee Drive-In: Cars Screening',
    dateStart: '2026-09-26',
    dateDisplay: 'September 26, 2026',
    location: 'Sapulpa, OK',
    venue: 'Tee Pee Drive-In',
    state: 'OK',
    description: 'Centennial car show followed by a screening of Disney/Pixar\'s "Cars" at the iconic Tee Pee Drive-In theater!',
    category: 'screening',
    officialUrl: 'https://route66centennial.org/events/teepee-cars'
  },
  {
    id: 'ok-tulsa-anniversary',
    title: 'Tulsa November 11 Celebrations',
    dateStart: '2026-11-11',
    dateDisplay: 'November 11, 2026',
    location: 'Tulsa, OK',
    state: 'OK',
    description: 'Official 100th anniversary celebrations in Tulsa—parades, ceremonies, and community gatherings marking the historic day.',
    category: 'kickoff',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/tulsa-anniversary'
  },

  // =====================
  // TEXAS
  // =====================
  {
    id: 'tx-amarillo-festival',
    title: 'Texas Route 66 Festival',
    dateStart: '2026-06-04',
    dateEnd: '2026-06-13',
    dateDisplay: 'June 4-13, 2026',
    location: 'Amarillo, TX',
    state: 'TX',
    description: 'Ten days of Western-themed celebrations including classic car shows, bus tours, cattle drive parade, and Route 66 heritage events.',
    category: 'festival',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/texas-festival'
  },

  // =====================
  // NEW MEXICO
  // =====================
  {
    id: 'nm-albuquerque-kickoff',
    title: 'Albuquerque Satellite Celebration',
    dateStart: '2026-04-30',
    dateDisplay: 'April 30, 2026',
    location: 'Albuquerque, NM',
    venue: 'Historic KiMo Theatre & Downtown',
    state: 'NM',
    description: 'National Kickoff satellite at the historic KiMo Theatre featuring augmented reality "Route 66 Remixed" experience and downtown festivities.',
    category: 'kickoff',
    officialUrl: 'https://route66centennial.org/events/albuquerque-kickoff'
  },
  {
    id: 'nm-speaker-series',
    title: 'NM Centennial Speaker Series',
    dateStart: '2026-01-24',
    dateEnd: '2026-12-26',
    dateDisplay: '4th Saturday, Monthly (2026)',
    location: '12 Locations Across NM',
    state: 'NM',
    description: 'Monthly presentations on Route 66 history and culture at 12 different New Mexico locations throughout the centennial year.',
    category: 'speaker-series',
    officialUrl: 'https://route66centennial.org/events/nm-speakers'
  },

  // =====================
  // ARIZONA
  // =====================
  {
    id: 'az-bike-week',
    title: 'Route 66 Bike Week',
    dateStart: '2026-04-20',
    dateEnd: '2026-04-26',
    dateDisplay: 'April 20-26, 2026',
    location: 'Arizona Route 66 Corridor',
    state: 'AZ',
    description: 'Rolling motorcycle rally with meetups along the Arizona Route 66 corridor—a week of riding, rallies, and camaraderie.',
    category: 'caravan',
    officialUrl: 'https://route66centennial.org/events/bike-week'
  },
  {
    id: 'az-seligman',
    title: 'Seligman Centennial Celebration',
    dateStart: '2026-04-30',
    dateDisplay: 'April 30, 2026',
    location: 'Seligman, AZ',
    state: 'AZ',
    description: 'Monument unveiling and day-long party in the "Birthplace of Historic Route 66"—the town that saved the Mother Road!',
    category: 'kickoff',
    officialUrl: 'https://route66centennial.org/events/seligman'
  },
  {
    id: 'az-fun-run',
    title: 'Route 66 Fun Run',
    dateStart: '2026-05-01',
    dateEnd: '2026-05-03',
    dateDisplay: 'May 1-3, 2026',
    location: 'Seligman to Topock, AZ',
    state: 'AZ',
    description: 'The oldest Route 66 event! Global participants cruise from Seligman through Kingman to Topock with community stops along the way.',
    category: 'caravan',
    isHighlight: true,
    officialUrl: 'https://route66centennial.org/events/fun-run'
  },
  {
    id: 'az-ash-fork',
    title: 'Ash Fork Heritage Day',
    dateStart: '2026-05-16',
    dateDisplay: 'May 16, 2026',
    location: 'Ash Fork, AZ',
    state: 'AZ',
    description: 'Heritage on Route 66 Day featuring parade, classic car show, and chili cookoff in the "Flagstone Capital of the World."',
    category: 'festival',
    officialUrl: 'https://route66centennial.org/events/ash-fork'
  },
  {
    id: 'az-williams-car-show',
    title: 'Williams Car Show',
    dateStart: '2026-06-05',
    dateEnd: '2026-06-06',
    dateDisplay: 'June 5-6, 2026',
    location: 'Williams, AZ',
    state: 'AZ',
    description: 'Annual car show amplified for the centennial—500+ vehicles expected in the "Gateway to the Grand Canyon."',
    category: 'car-show',
    officialUrl: 'https://route66centennial.org/events/williams-car-show'
  },
  {
    id: 'az-flagstaff',
    title: 'Flagstaff Route 66 Celebration',
    dateStart: '2026-06-06',
    dateDisplay: 'June 6, 2026',
    location: 'Flagstaff, AZ',
    state: 'AZ',
    description: 'Classic car show, nostalgic reenactments, chalk art festival, and Route 66 celebrations in historic downtown Flagstaff.',
    category: 'festival',
    officialUrl: 'https://route66centennial.org/events/flagstaff'
  },

  // =====================
  // CALIFORNIA
  // =====================
  {
    id: 'ca-santa-monica-kickoff',
    title: 'Santa Monica Pier Convergence',
    dateStart: '2026-04-30',
    dateDisplay: 'April 30, 2026',
    location: 'Santa Monica, CA',
    venue: 'Santa Monica Pier',
    state: 'CA',
    description: 'The western terminus of Route 66 hosts a convergence celebration for the national kickoff—where the Mother Road meets the Pacific!',
    category: 'kickoff',
    officialUrl: 'https://route66centennial.org/events/santa-monica'
  },
  {
    id: 'ca-january-convergence',
    title: 'California Caravan Convergence',
    dateStart: '2026-01-03',
    dateEnd: '2026-01-05',
    dateDisplay: 'January 3-5, 2026',
    location: 'Santa Monica, CA',
    state: 'CA',
    description: 'Kick off the centennial year as caravans converge in Santa Monica before the Drive Home VII heads east to Chicago.',
    category: 'caravan',
    officialUrl: 'https://route66centennial.org/events/ca-convergence'
  }
];

// State metadata for filtering and display
export const stateMetadata: Record<EventState, { name: string; order: number; color: string }> = {
  'IL': { name: 'Illinois', order: 1, color: 'bg-blue-500' },
  'MO': { name: 'Missouri', order: 2, color: 'bg-red-500' },
  'KS': { name: 'Kansas', order: 3, color: 'bg-yellow-500' },
  'OK': { name: 'Oklahoma', order: 4, color: 'bg-orange-500' },
  'TX': { name: 'Texas', order: 5, color: 'bg-red-600' },
  'NM': { name: 'New Mexico', order: 6, color: 'bg-cyan-500' },
  'AZ': { name: 'Arizona', order: 7, color: 'bg-amber-600' },
  'CA': { name: 'California', order: 8, color: 'bg-yellow-400' },
  'national': { name: 'National', order: 0, color: 'bg-purple-600' }
};

// Category icons/labels
export const categoryMetadata: Record<EventCategory, { label: string; emoji: string }> = {
  'kickoff': { label: 'Kickoff', emoji: '🎉' },
  'parade': { label: 'Parade', emoji: '🚗' },
  'festival': { label: 'Festival', emoji: '🎪' },
  'car-show': { label: 'Car Show', emoji: '🏎️' },
  'concert': { label: 'Concert/Dance', emoji: '🎵' },
  'caravan': { label: 'Caravan', emoji: '🚙' },
  'screening': { label: 'Screening', emoji: '🎬' },
  'speaker-series': { label: 'Speaker Series', emoji: '🎤' },
  'bicycles': { label: 'Bicycles', emoji: '🚴' },
  'motorcycles': { label: 'Motorcycles', emoji: '🏍️' },
  'runs': { label: 'Runs', emoji: '🏃' },
  'other': { label: 'Special Event', emoji: '⭐' }
};

// Data source info
export const dataSourceInfo = {
  source: 'route66centennial.org/calendar',
  lastUpdated: '2026-01-18',
  officialSite: 'https://route66centennial.org'
};
