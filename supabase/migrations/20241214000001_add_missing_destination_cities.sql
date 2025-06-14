
-- Add missing major Route 66 destination cities
-- This ensures Los Angeles and other key destinations are available for trip planning

INSERT INTO destination_cities (name, state, latitude, longitude, description, featured) VALUES
  ('Los Angeles', 'California', 34.0522, -118.2437, 'The City of Angels and major Route 66 destination with Hollywood, beaches, and endless attractions.', true),
  ('Santa Monica', 'California', 34.0195, -118.4912, 'The official western terminus of Route 66 at the famous Santa Monica Pier on the Pacific Ocean.', true),
  ('San Bernardino', 'California', 34.1083, -117.2898, 'Historic Route 66 city in Southern California at the foot of the San Bernardino Mountains.', false),
  ('Barstow', 'California', 34.8958, -117.0228, 'Major Route 66 stop in the Mojave Desert with historic railroad heritage.', false),
  ('Needles', 'California', 34.8483, -114.6144, 'Desert gateway to California on historic Route 66 at the Arizona border.', false),
  ('Kingman', 'Arizona', 35.1894, -114.0530, 'Heart of Historic Route 66 in Arizona with excellent museums and desert landscapes.', false),
  ('Seligman', 'Arizona', 35.3258, -112.8738, 'Birthplace of the Historic Route 66 movement with classic roadside attractions.', false),
  ('Williams', 'Arizona', 35.2494, -112.1901, 'Gateway to Grand Canyon and last Route 66 town to be bypassed by the interstate.', false),
  ('Flagstaff', 'Arizona', 35.1983, -111.6513, 'Mountain town and Route 66 hub in northern Arizona, gateway to Grand Canyon.', true),
  ('Winslow', 'Arizona', 35.0242, -110.6973, 'Famous for the Eagles song "Take It Easy" and historic downtown charm.', false),
  ('Holbrook', 'Arizona', 34.9025, -110.1665, 'Home to the famous Wigwam Motel and gateway to Petrified Forest National Park.', false),
  ('Gallup', 'New Mexico', 35.5281, -108.7426, 'Trading center and gateway to Native American country with rich cultural heritage.', false),
  ('Albuquerque', 'New Mexico', 35.0844, -106.6504, 'High desert city with vibrant Route 66 culture and southwestern charm.', true),
  ('Santa Fe', 'New Mexico', 35.6870, -105.9378, 'Historic capital city and famous Route 66 branch destination with distinctive architecture.', true),
  ('Tucumcari', 'New Mexico', 35.1719, -103.7249, 'Historic Route 66 town with vintage neon signs and classic roadside motels.', false),
  ('Amarillo', 'Texas', 35.2220, -101.8313, 'Texas Panhandle city famous for Cadillac Ranch and Big Texan Steak Ranch.', true),
  ('Shamrock', 'Texas', 35.2197, -100.2462, 'First major Route 66 stop in Texas with Irish heritage and historic charm.', false),
  ('Oklahoma City', 'Oklahoma', 35.4676, -97.5164, 'Capital city of Oklahoma with Route 66 heritage and vibrant downtown.', true),
  ('Tulsa', 'Oklahoma', 36.1540, -95.9928, 'Oil capital with rich Route 66 history and excellent museums.', true),
  ('Joplin', 'Missouri', 37.0842, -94.5133, 'Historic Route 66 mining town on Missouri-Kansas border with mining heritage.', false),
  ('Springfield', 'Missouri', 37.2153, -93.2982, 'Birthplace of Route 66 and Missouri''s Queen City of the Ozarks.', true),
  ('St. Louis', 'Missouri', 38.6270, -90.1994, 'Gateway to the West with historic Route 66 landmarks and the iconic Gateway Arch.', true),
  ('Springfield', 'Illinois', 39.7817, -89.6501, 'Illinois state capital and major Route 66 destination with Abraham Lincoln heritage.', true),
  ('Chicago', 'Illinois', 41.8781, -87.6298, 'The official starting point of Route 66 at Grant Park in the Windy City.', true)
ON CONFLICT (name, state) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured;
