
export interface StoryMapChapter {
  id: string;
  title: string;
  narration: string;
  pullQuote?: string;
  pullQuoteAuthor?: string;
  mileMarker?: string;
  coordinates: { lat: number; lng: number };
  zoom: number;
  beforeImage?: string;
  streetViewCoords?: { lat: number; lng: number };
  backgroundImage?: string;
  theme: 'dark' | 'light';
}

const SUPABASE_STORAGE_URL = 'https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/storymap';

export const coverData = {
  title: '100 Years of the Mother Road',
  subtitle: 'Route 66 Centennial · 1926–2026',
  narration: 'In the summer of 1926, a dirt trail through eight American states became a highway — and a way of life.',
  stats: [
    { value: '2,448', label: 'Miles' },
    { value: '8', label: 'States' },
    { value: '100', label: 'Years' },
  ],
  backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop',
};

export const storyMapChapters: StoryMapChapter[] = [
  {
    id: 'birth',
    title: 'Birth of the Mother Road',
    narration: 'Route 66 was born not from a single vision, but from the stubborn dreams of thousands who believed a road could stitch a nation together. On November 11, 1926, what had been a patchwork of muddy trails and county roads was christened U.S. Highway 66 — 2,448 miles of possibility stretching from the shores of Lake Michigan to the Pacific coast.',
    pullQuote: 'A road that would stitch a nation together.',
    mileMarker: 'Mile 0 · Chicago, IL',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    zoom: 6,
    beforeImage: `${SUPABASE_STORAGE_URL}/00_opening_route66_sign.jpg`,
    backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop',
    theme: 'dark',
  },
  {
    id: 'great-migration',
    title: 'The Great Migration',
    narration: 'When the Dust Bowl swallowed the Great Plains, Route 66 became something more than a highway. It became the only way out. Families packed everything they owned into battered trucks and headed west, chasing the promise of California. John Steinbeck would call it "the mother road, the road of flight." Three hundred thousand souls traveled this ribbon of concrete between 1930 and 1940, fleeing drought, debt, and despair.',
    pullQuote: 'The mother road, the road of flight.',
    pullQuoteAuthor: 'John Steinbeck, The Grapes of Wrath',
    mileMarker: '1930–1940 · The Dust Bowl',
    coordinates: { lat: 35.4676, lng: -97.5164 },
    zoom: 6,
    beforeImage: `${SUPABASE_STORAGE_URL}/04_oklahoma_dust_bowl.jpg`,
    backgroundImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80&auto=format&fit=crop',
    theme: 'light',
  },
  {
    id: 'illinois',
    title: 'Illinois — Where It All Begins',
    narration: 'The journey starts in Chicago, at the corner of Adams and Michigan, where a small brown sign marks the beginning of something enormous. Three hundred miles of Illinois farmland, small-town diners, and the smell of deep-dish pizza giving way to corn silk and asphalt. Springfield\'s Cozy Dog Drive-In has been serving corn dogs on a stick since 1946 — and they\'ll tell you they invented the thing.',
    pullQuote: 'A small brown sign marks the beginning of something enormous.',
    mileMarker: 'Mile 0–300 · 300 miles',
    coordinates: { lat: 39.7817, lng: -89.6501 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/01_illinois_cozy_dog.jpg`,
    streetViewCoords: { lat: 39.7817, lng: -89.6501 },
    theme: 'dark',
  },
  {
    id: 'missouri',
    title: 'Missouri — Through the Ozarks',
    narration: 'Missouri gives you 317 miles of neon and nostalgia. The Gateway Arch rises over St. Louis like a silver question mark, asking where you\'re headed. Past the city, the road dips into the Ozarks — limestone caves, spring-fed rivers, and motels with vacancy signs that haven\'t changed since Eisenhower was president. The Munger Moss Motel in Lebanon still glows like a beacon for weary travelers.',
    pullQuote: 'The Gateway Arch rises like a silver question mark, asking where you\'re headed.',
    mileMarker: 'Mile 300–617 · 317 miles',
    coordinates: { lat: 37.6459, lng: -92.6632 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/02_missouri_munger_moss.jpg`,
    streetViewCoords: { lat: 37.6459, lng: -92.6632 },
    theme: 'light',
  },
  {
    id: 'kansas',
    title: 'Kansas — Thirteen Miles of Grit',
    narration: 'Kansas gets just thirteen miles of Route 66, and it makes every one of them count. Galena\'s rusted tow truck inspired the character Mater in Pixar\'s Cars. The Rainbow Bridge at Baxter Springs — one of the last original Marsh Arch bridges still standing — curves over a creek like a concrete promise that some things are worth preserving.',
    pullQuote: 'A concrete promise that some things are worth preserving.',
    mileMarker: 'Mile 617–630 · 13 miles',
    coordinates: { lat: 37.0245, lng: -94.9235 },
    zoom: 9,
    beforeImage: `${SUPABASE_STORAGE_URL}/03_kansas_rainbow_bridge.jpg`,
    streetViewCoords: { lat: 37.0245, lng: -94.9235 },
    theme: 'dark',
  },
  {
    id: 'oklahoma',
    title: 'Oklahoma — Heart of the Mother Road',
    narration: 'Oklahoma has more drivable miles of original Route 66 than any other state — four hundred miles of round barns, giant blue whales, and the ghosts of the Dust Bowl. The road passes through Tulsa\'s Art Deco district and the rolling tallgrass prairie where the land seems to breathe. This is Steinbeck country, Woody Guthrie country, the heartland where America\'s story bends but never breaks.',
    pullQuote: 'The heartland where America\'s story bends but never breaks.',
    mileMarker: 'Mile 630–1,030 · 400 miles',
    coordinates: { lat: 35.4676, lng: -97.5164 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/04_oklahoma_dust_bowl.jpg`,
    streetViewCoords: { lat: 35.4676, lng: -97.5164 },
    theme: 'light',
  },
  {
    id: 'texas',
    title: 'Texas — The Panhandle',
    narration: 'The Texas Panhandle is 178 miles of flat-out American spectacle. Ten Cadillacs nose-down in a wheat field at Cadillac Ranch, spray-painted in a hundred layers of road-trip rebellion. The Big Texan in Amarillo dares you to eat a 72-ounce steak for free. Out here, the sky is so wide it makes you feel like the last person on earth — and somehow, that\'s exactly what you needed.',
    pullQuote: 'The sky is so wide it makes you feel like the last person on earth.',
    mileMarker: 'Mile 1,030–1,208 · 178 miles',
    coordinates: { lat: 35.1813, lng: -101.9874 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/05_texas_cadillac_ranch.jpg`,
    streetViewCoords: { lat: 35.1813, lng: -101.9874 },
    theme: 'dark',
  },
  {
    id: 'new-mexico',
    title: 'New Mexico — Land of Enchantment',
    narration: 'New Mexico delivers 487 miles of high desert magic. Tucumcari\'s neon signs glow like a mirage against the mesa sky — "Tucumcari Tonight, 2000 Motel Rooms." The Blue Swallow Motel still rents rooms with garages attached, a relic from the days when your car was your most precious possession. In Albuquerque, Central Avenue hums with the energy of a road that refuses to die.',
    pullQuote: 'Tucumcari Tonight, 2000 Motel Rooms.',
    mileMarker: 'Mile 1,208–1,695 · 487 miles',
    coordinates: { lat: 35.1717, lng: -103.7256 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/06_new_mexico_blue_swallow.jpg`,
    streetViewCoords: { lat: 35.1717, lng: -103.7256 },
    theme: 'light',
  },
  {
    id: 'arizona',
    title: 'Arizona — Desert Cathedral',
    narration: 'Arizona\'s 401 miles are a cathedral of red rock and desert silence. The Painted Desert shifts from lavender to rust as the sun moves. Seligman — where a barber named Angel Delgadillo single-handedly sparked the Route 66 revival in 1987 — still buzzes with the spirit of rebellion. Hackberry General Store sits at the edge of nothing, selling cold soda and warm nostalgia to anyone who pulls off the highway.',
    pullQuote: 'Selling cold soda and warm nostalgia to anyone who pulls off the highway.',
    mileMarker: 'Mile 1,695–2,096 · 401 miles',
    coordinates: { lat: 35.3714, lng: -114.1403 },
    zoom: 7,
    beforeImage: `${SUPABASE_STORAGE_URL}/07_arizona_hackberry.jpg`,
    streetViewCoords: { lat: 35.3714, lng: -114.1403 },
    theme: 'dark',
  },
  {
    id: 'california',
    title: 'California — End of the Trail',
    narration: 'The final 315 miles cross the Mojave Desert — a furnace of Joshua trees and abandoned gas stations — before dropping into the green valleys of San Bernardino. Then the Pacific appears, impossibly blue after two thousand miles of dust and distance. At the Santa Monica Pier, a modest sign reads "End of the Trail." But anyone who\'s driven Route 66 knows: the road never really ends. It just changes you.',
    pullQuote: 'The road never really ends. It just changes you.',
    mileMarker: 'Mile 2,096–2,448 · 315 miles',
    coordinates: { lat: 34.0099, lng: -118.4960 },
    zoom: 8,
    beforeImage: `${SUPABASE_STORAGE_URL}/08_california_end_of_trail.jpg`,
    streetViewCoords: { lat: 34.0099, lng: -118.4960 },
    theme: 'light',
  },
];

export const ctaData = {
  title: 'Your Turn on the Mother Road',
  narration: 'A hundred years of stories, and the road is still writing new ones. The centennial celebrations kick off in 2026 — parades, car shows, festivals, and a coast-to-coast caravan retracing every mile. Will you be there?',
  links: [
    { label: 'Explore the Interactive Map', href: '/', primary: true },
    { label: 'View Centennial Events', href: '/#centennial-events', primary: false },
    { label: 'Read the Blog', href: '/blog', primary: false },
  ],
};
