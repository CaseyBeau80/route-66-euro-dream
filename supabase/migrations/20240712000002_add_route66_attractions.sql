-- Add 4 new Route 66 attractions to the attractions table
-- Migration: Add Blue Hole, Black Mountains, Twin Arrows, and Gateway Arch

INSERT INTO attractions (
  name,
  city_name,
  state,
  latitude,
  longitude,
  description,
  category,
  featured,
  website,
  image_url,
  thumbnail_url
) VALUES 

-- Blue Hole - Santa Rosa, New Mexico
(
  'Blue Hole',
  'Santa Rosa',
  'New Mexico',
  34.9389,
  -104.6831,
  'A natural artesian spring and popular scuba diving destination along Route 66. This crystal-clear, bell-shaped pool maintains a constant temperature of 61°F year-round and reaches depths of 81 feet. The Blue Hole has become an iconic stop for Route 66 travelers seeking a unique natural wonder in the high desert of New Mexico.',
  'Natural Wonder',
  true,
  'https://www.santarosanm.org/blue-hole',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
),

-- Black Mountains - Arizona
(
  'Black Mountains',
  'Oatman',
  'Arizona',
  35.0228,
  -114.3828,
  'A rugged mountain range along the historic Route 66 corridor in western Arizona. The winding road through the Black Mountains offers spectacular desert vistas and leads to the quirky mining town of Oatman. This challenging but rewarding drive showcases the raw beauty of the Mojave Desert and represents one of Route 66''s most scenic and adventurous stretches.',
  'Scenic Drive',
  true,
  'https://www.oatmangoldroad.org/',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
),

-- Twin Arrows - Arizona
(
  'Twin Arrows',
  'Winona',
  'Arizona',
  35.2183,
  -111.2319,
  'An iconic Route 66 landmark featuring two massive concrete arrows pointing skyward. Originally built in the 1950s as a trading post attraction, the Twin Arrows became one of the most photographed roadside curiosities along the Mother Road. Though weathered by time, these towering monuments continue to capture the imagination of Route 66 travelers and represent the golden age of roadside Americana.',
  'Roadside Attraction',
  true,
  NULL,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
),

-- Gateway Arch - Saint Louis, Missouri
(
  'Gateway Arch',
  'Saint Louis',
  'Missouri',
  38.6247,
  -90.1848,
  'America''s tallest man-made monument and the symbolic gateway to the West. This 630-foot stainless steel arch commemorates the westward expansion of the United States and serves as a powerful symbol for Route 66 travelers beginning their journey west. The Gateway Arch National Park offers tram rides to the top, providing spectacular views of the Mississippi River and the city of Saint Louis.',
  'Monument',
  true,
  'https://www.gatewayarch.com/',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
);