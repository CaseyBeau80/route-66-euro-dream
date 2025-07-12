-- Add 5 new Route 66 hidden gems to the hidden_gems table
-- Migration: Add Mother Road Market, Cattlemen's Steakhouse, Dog House Drive In, Boots Court Motel, and Will Rogers Memorial

INSERT INTO hidden_gems (
  title,
  description,
  city_name,
  latitude,
  longitude,
  image_url,
  thumbnail_url,
  website
) VALUES 

-- Mother Road Market - Tulsa's premier food hall on Route 66
(
  'Mother Road Market',
  'Oklahoma''s premier food hall located in Tulsa, this vibrant gathering place celebrates local entrepreneurs and Route 66 culture. Housed in a beautifully restored building, it offers diverse dining options, unique retail, and serves as a community hub for foodies, artists, musicians, and travelers exploring the Mother Road.',
  'Tulsa',
  36.1441,
  -95.9675,
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://www.motherroadmarket.com/'
),

-- Cattlemen's Steakhouse - Historic Oklahoma City steakhouse
(
  'Cattlemen''s Steakhouse',
  'A legendary Oklahoma City institution since 1910, this historic steakhouse has been serving cowboys, cattlemen, and Route 66 travelers for over a century. Located in the historic Stockyards City, it maintains its authentic Western atmosphere and serves some of the finest beef in the region, making it a true Route 66 dining landmark.',
  'Oklahoma City',
  35.4524,
  -97.5549,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'http://www.cattlemensrestaurant.com/'
),

-- Dog House Drive In - Iconic Albuquerque Route 66 diner
(
  'Dog House Drive In',
  'An iconic Route 66 drive-in diner established in 1948, famous for its neon dachshund sign and legendary chili cheese dogs. This unassuming spot has maintained the same beloved chili recipe for over 50 years and offers authentic car hop service. A true Route 66 experience that has been featured in television shows and remains a favorite among Mother Road enthusiasts.',
  'Albuquerque',
  35.0844,
  -106.6504,
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  NULL
),

-- Boots Court Motel - Historic Carthage, Missouri motor court
(
  'Boots Court Motel',
  'A classic 1940s motor court that epitomizes the golden age of Route 66 travel. This historic motel in Carthage, Missouri, features distinctive Art Deco styling and has been lovingly preserved as a testament to the heyday of motor court culture. Its iconic neon sign and vintage architecture make it a must-see landmark for Route 66 enthusiasts seeking authentic roadside Americana.',
  'Carthage',
  37.1783,
  -94.3143,
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  NULL
),

-- Will Rogers Memorial - Claremore, Oklahoma museum
(
  'Will Rogers Memorial',
  'A tribute to Oklahoma''s favorite son and America''s beloved humorist, Will Rogers. This memorial museum in Claremore houses the largest collection of Will Rogers memorabilia and serves as his final resting place. Located near Route 66, it celebrates the life and legacy of the cowboy philosopher who embodied the spirit of the American West and the open road.',
  'Claremore',
  36.3208,
  -95.6317,
  'https://images.unsplash.com/photo-1594736797933-d0b22a6e6334?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1594736797933-d0b22a6e6334?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://www.willrogers.com/'
);