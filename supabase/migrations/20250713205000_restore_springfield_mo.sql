-- Restore Springfield, MO to destination_cities table
-- This city was accidentally removed and is a critical Route 66 destination
INSERT INTO destination_cities (
  id,
  name,
  state,
  latitude,
  longitude,
  description,
  featured,
  population,
  founded_year,
  image_url,
  website,
  created_at,
  updated_at
) VALUES (
  'springfield-mo-restored',
  'Springfield',
  'MO',
  37.2090,
  -93.2923,
  'Known as the birthplace of Route 66, Springfield is where the famous highway was first conceived. This historic Missouri city offers visitors a rich blend of Route 66 heritage, Civil War history, and outdoor recreation opportunities.',
  true,
  169000,
  1838,
  NULL,
  'https://www.springfieldmo.gov/',
  NOW(),
  NOW()
);