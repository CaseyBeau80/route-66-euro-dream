-- Create enum types for event state and category
CREATE TYPE event_state AS ENUM ('IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA', 'national');
CREATE TYPE event_category AS ENUM ('kickoff', 'parade', 'festival', 'car-show', 'concert', 'caravan', 'screening', 'speaker-series', 'other');

-- Create the centennial_events table
CREATE TABLE public.centennial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE,
  date_display TEXT NOT NULL,
  location TEXT NOT NULL,
  venue TEXT,
  state event_state NOT NULL,
  description TEXT NOT NULL,
  category event_category NOT NULL,
  is_highlight BOOLEAN DEFAULT false,
  official_url TEXT,
  guinness_attempt BOOLEAN DEFAULT false,
  guinness_note TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_centennial_events_state ON public.centennial_events(state);
CREATE INDEX idx_centennial_events_date_start ON public.centennial_events(date_start);
CREATE INDEX idx_centennial_events_category ON public.centennial_events(category);
CREATE INDEX idx_centennial_events_is_highlight ON public.centennial_events(is_highlight);

-- Enable RLS with public read access
ALTER TABLE public.centennial_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read centennial events"
  ON public.centennial_events
  FOR SELECT
  USING (true);

-- Add helpful comment
COMMENT ON TABLE public.centennial_events IS 'Route 66 2026 Centennial celebration events across all 8 states';

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_centennial_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_centennial_events_updated_at
BEFORE UPDATE ON public.centennial_events
FOR EACH ROW
EXECUTE FUNCTION public.update_centennial_events_updated_at();

-- Seed all 28 events
INSERT INTO public.centennial_events (event_id, title, date_start, date_end, date_display, location, venue, state, description, category, is_highlight, official_url, guinness_attempt, guinness_note) VALUES
-- NATIONAL / MULTI-STATE
('nat-drive-home-vii', 'Drive Home VII Caravan', '2026-01-03', '2026-01-12', 'January 3-12, 2026', 'Santa Monica, CA to Chicago, IL', NULL, 'national', 'Epic caravan journey from Santa Monica to Chicago, kicking off the centennial year. Join anywhere along the route!', 'caravan', true, 'https://route66centennial.org/events/drive-home-vii', false, NULL),
('nat-april-kickoff', 'National Kickoff Day', '2026-04-30', NULL, 'April 30, 2026', 'Springfield, MO (Main) + Satellites', NULL, 'national', 'The official national kickoff celebration centered in Springfield, MO with satellite events across all 8 states—livestreamed globally.', 'kickoff', true, 'https://route66centennial.org/events/national-kickoff', false, NULL),
('nat-great-race', 'Route 66 Centennial Great Race', '2026-06-20', '2026-06-28', 'June 20-28, 2026', 'Chicago, IL to Santa Monica, CA', NULL, 'national', 'The legendary Great Race follows Route 66 from Chicago to Santa Monica with vintage automobiles competing along the Mother Road.', 'caravan', true, 'https://route66centennial.org/events/great-race', false, NULL),
('nat-main-street-caravan', 'Main Street of America Caravan', '2026-09-01', '2026-09-14', 'September 1-14, 2026', 'California to Illinois', NULL, 'national', 'Join the Main Street of America Caravan from California to Illinois—participants can join at any point along the route.', 'caravan', false, 'https://route66centennial.org/events/main-street-caravan', false, NULL),
('nat-documentary-premieres', 'Rolling Documentary Premieres', '2026-09-01', '2026-12-31', 'September - December 2026', 'Drive-ins & Theaters Across the Route', NULL, 'national', '"The Main Street of America" documentary screenings at drive-ins and theaters across all eight Route 66 states.', 'screening', false, 'https://route66centennial.org/events/documentary', false, NULL),
('nat-november-anniversary', 'Official 100th Anniversary', '2026-11-11', NULL, 'November 11, 2026', 'All 8 Route 66 States', NULL, 'national', 'The official 100th anniversary of Route 66''s designation on November 11, 1926. Celebrations across all eight states!', 'kickoff', true, 'https://route66centennial.org/events/anniversary', false, NULL),

-- ILLINOIS
('il-joliet-kickoff', 'Joliet Prison Satellite Celebration', '2026-04-30', NULL, 'April 30, 2026', 'Joliet, IL', 'Old Joliet Prison', 'IL', 'National Kickoff satellite celebration at the historic Old Joliet Prison—a Route 66 landmark and filming location for "The Blues Brothers."', 'kickoff', false, 'https://route66centennial.org/events/joliet-kickoff', false, NULL),
('il-statewide-conference', 'IL Route 66 Statewide Conference', '2026-11-11', NULL, 'November 11, 2026', 'Springfield, IL', NULL, 'IL', 'Illinois Route 66 Scenic Byway Statewide Conference & Centennial Celebration—a major gathering with educational and commemorative focus.', 'festival', true, 'https://route66centennial.org/events/illinois-conference', false, NULL),

-- MISSOURI (Birthplace of Route 66)
('mo-springfield-kickoff', 'Springfield National Kickoff Weekend', '2026-04-30', '2026-05-03', 'April 30 - May 3, 2026', 'Springfield, MO', 'Historic Shrine Mosque & Downtown', 'MO', 'The heart of the national kickoff! A-list concert (Apr 30), National Route 66 Centennial Parade (May 1 at 6pm), Classic Car Show, First Friday Artwalk, Jefferson Ave. Footbridge Bash, and 1920s-themed Telegraph Ball gala (May 2).', 'kickoff', true, 'https://route66centennial.org/events/springfield-kickoff', false, NULL),

-- KANSAS
('ks-galena-days', 'Galena Days Festival', '2026-06-03', '2026-06-06', 'June 3-6, 2026', 'Galena, KS', NULL, 'KS', 'Annual Galena Days festival amplified for the centennial with classic car show, parade, and tributes to Route 66 heritage.', 'festival', false, 'https://route66centennial.org/events/galena-days', false, NULL),

-- OKLAHOMA
('ok-bristow-neon', 'Bristow Neon Relight', '2026-04-11', NULL, 'April 11, 2026', 'Bristow, OK', NULL, 'OK', 'Historic neon sign restoration celebration in Bristow—watch as classic Route 66 neon is brought back to life!', 'other', false, 'https://route66centennial.org/events/bristow-neon', false, NULL),
('ok-big-band-dance', 'Big Band Hangar Dance', '2026-04-25', NULL, 'April 25, 2026', 'Weatherford, OK', NULL, 'OK', '1940s-themed Big Band swing dance in a historic hangar—dress up in vintage attire and dance the night away!', 'concert', false, 'https://route66centennial.org/events/big-band-dance', false, NULL),
('ok-capital-cruise', 'Capital Cruise', '2026-05-30', NULL, 'May 30, 2026', 'Tulsa, OK', NULL, 'OK', 'Route 66 birthday bash with a massive classic car parade through downtown Tulsa. Official Guinness World Records™ attempt for the largest classic car parade!', 'parade', true, 'https://route66centennial.org/events/capital-cruise', true, 'Official Guinness World Records™ attempt for largest classic car parade'),
('ok-okc-birthday-bash', 'OKC "Kickin'' It" Birthday Bash', '2026-05-30', NULL, 'May 30, 2026', 'Oklahoma City, OK', NULL, 'OK', 'Full-day nostalgic and modern celebration of Route 66''s birthday in Oklahoma City—live music, food trucks, and family fun!', 'festival', false, 'https://route66centennial.org/events/okc-birthday-bash', false, NULL),
('ok-road-fest', 'AAA Route 66 Road Fest', '2026-06-27', '2026-06-28', 'June 27-28, 2026', 'Tulsa, OK', 'SageNet Center', 'OK', 'AAA-sponsored signature national event! Two days of car parades, live entertainment, vendors, and Route 66 heritage celebrations at the SageNet Center.', 'festival', true, 'https://route66centennial.org/events/road-fest', false, NULL),
('ok-mural-fest', 'Oklahoma Route 66 Mural Fest', '2026-07-18', NULL, 'July 18, 2026', 'Statewide, OK', NULL, 'OK', 'Mural unveilings across Oklahoma Route 66 towns tied to shopkeepers weekend—celebrate local artists and Route 66 heritage!', 'festival', false, 'https://route66centennial.org/events/mural-fest', false, NULL),
('ok-teepee-cars', 'Tee Pee Drive-In: Cars Screening', '2026-09-26', NULL, 'September 26, 2026', 'Sapulpa, OK', 'Tee Pee Drive-In', 'OK', 'Centennial car show followed by a screening of Disney/Pixar''s "Cars" at the iconic Tee Pee Drive-In theater!', 'screening', false, 'https://route66centennial.org/events/teepee-cars', false, NULL),
('ok-tulsa-anniversary', 'Tulsa November 11 Celebrations', '2026-11-11', NULL, 'November 11, 2026', 'Tulsa, OK', NULL, 'OK', 'Official 100th anniversary celebrations in Tulsa—parades, ceremonies, and community gatherings marking the historic day.', 'kickoff', true, 'https://route66centennial.org/events/tulsa-anniversary', false, NULL),

-- TEXAS
('tx-amarillo-festival', 'Texas Route 66 Festival', '2026-06-04', '2026-06-13', 'June 4-13, 2026', 'Amarillo, TX', NULL, 'TX', 'Ten days of Western-themed celebrations including classic car shows, bus tours, cattle drive parade, and Route 66 heritage events.', 'festival', true, 'https://route66centennial.org/events/texas-festival', false, NULL),

-- NEW MEXICO
('nm-albuquerque-kickoff', 'Albuquerque Satellite Celebration', '2026-04-30', NULL, 'April 30, 2026', 'Albuquerque, NM', 'Historic KiMo Theatre & Downtown', 'NM', 'National Kickoff satellite at the historic KiMo Theatre featuring augmented reality "Route 66 Remixed" experience and downtown festivities.', 'kickoff', false, 'https://route66centennial.org/events/albuquerque-kickoff', false, NULL),
('nm-speaker-series', 'NM Centennial Speaker Series', '2026-01-24', '2026-12-26', '4th Saturday, Monthly (2026)', '12 Locations Across NM', NULL, 'NM', 'Monthly presentations on Route 66 history and culture at 12 different New Mexico locations throughout the centennial year.', 'speaker-series', false, 'https://route66centennial.org/events/nm-speakers', false, NULL),

-- ARIZONA
('az-bike-week', 'Route 66 Bike Week', '2026-04-20', '2026-04-26', 'April 20-26, 2026', 'Arizona Route 66 Corridor', NULL, 'AZ', 'Rolling motorcycle rally with meetups along the Arizona Route 66 corridor—a week of riding, rallies, and camaraderie.', 'caravan', false, 'https://route66centennial.org/events/bike-week', false, NULL),
('az-seligman', 'Seligman Centennial Celebration', '2026-04-30', NULL, 'April 30, 2026', 'Seligman, AZ', NULL, 'AZ', 'Monument unveiling and day-long party in the "Birthplace of Historic Route 66"—the town that saved the Mother Road!', 'kickoff', false, 'https://route66centennial.org/events/seligman', false, NULL),
('az-fun-run', 'Route 66 Fun Run', '2026-05-01', '2026-05-03', 'May 1-3, 2026', 'Seligman to Topock, AZ', NULL, 'AZ', 'The oldest Route 66 event! Global participants cruise from Seligman through Kingman to Topock with community stops along the way.', 'caravan', true, 'https://route66centennial.org/events/fun-run', false, NULL),
('az-ash-fork', 'Ash Fork Heritage Day', '2026-05-16', NULL, 'May 16, 2026', 'Ash Fork, AZ', NULL, 'AZ', 'Heritage on Route 66 Day featuring parade, classic car show, and chili cookoff in the "Flagstone Capital of the World."', 'festival', false, 'https://route66centennial.org/events/ash-fork', false, NULL),
('az-williams-car-show', 'Williams Car Show', '2026-06-05', '2026-06-06', 'June 5-6, 2026', 'Williams, AZ', NULL, 'AZ', 'Annual car show amplified for the centennial—500+ vehicles expected in the "Gateway to the Grand Canyon."', 'car-show', false, 'https://route66centennial.org/events/williams-car-show', false, NULL),
('az-flagstaff', 'Flagstaff Route 66 Celebration', '2026-06-06', NULL, 'June 6, 2026', 'Flagstaff, AZ', NULL, 'AZ', 'Classic car show, nostalgic reenactments, chalk art festival, and Route 66 celebrations in historic downtown Flagstaff.', 'festival', false, 'https://route66centennial.org/events/flagstaff', false, NULL),

-- CALIFORNIA
('ca-santa-monica-kickoff', 'Santa Monica Pier Convergence', '2026-04-30', NULL, 'April 30, 2026', 'Santa Monica, CA', 'Santa Monica Pier', 'CA', 'The western terminus of Route 66 hosts a convergence celebration for the national kickoff—where the Mother Road meets the Pacific!', 'kickoff', false, 'https://route66centennial.org/events/santa-monica', false, NULL),
('ca-january-convergence', 'California Caravan Convergence', '2026-01-03', '2026-01-05', 'January 3-5, 2026', 'Santa Monica, CA', NULL, 'CA', 'Kick off the centennial year as caravans converge in Santa Monica before the Drive Home VII heads east to Chicago.', 'caravan', false, 'https://route66centennial.org/events/ca-convergence', false, NULL);