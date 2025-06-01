
-- Update existing drive-in theaters with detailed historical descriptions
UPDATE hidden_gems 
SET description = 'One of the most iconic Route 66 drive-ins; opened in 1949 and still operating on weekends.'
WHERE title = '66 Drive-In Theatre';

UPDATE hidden_gems 
SET description = 'Featured in The Outsiders and rebuilt after a fire in 2010; a Tulsa landmark.'
WHERE title = 'Admiral Twin Drive-In';

UPDATE hidden_gems 
SET description = 'Restored and reopened in 2023 with retro touches and overnight trailer stays.'
WHERE title = 'Tee Pee Drive-In';

UPDATE hidden_gems 
SET description = 'One of the oldest continuously operating drive-ins on Route 66.'
WHERE title = 'Sky View Drive-In';

UPDATE hidden_gems 
SET description = 'A quieter, local favorite in Springfield, Missouri.'
WHERE title = 'Holiday Drive-In';

UPDATE hidden_gems 
SET description = 'Small-town drive-in that continues to serve Route 66 travelers in Weatherford, OK.'
WHERE title = 'Sho-West Drive-In';
