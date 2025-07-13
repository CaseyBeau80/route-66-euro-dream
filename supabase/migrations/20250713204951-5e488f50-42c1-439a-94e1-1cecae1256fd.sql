-- Remove duplicate Springfield, MO entry (keeping the older one from June 1st)
DELETE FROM destination_cities 
WHERE id = 'd0df794a-b89e-4cc0-a6b9-abb88907cbfb' 
AND name = 'Springfield' 
AND state = 'MO';