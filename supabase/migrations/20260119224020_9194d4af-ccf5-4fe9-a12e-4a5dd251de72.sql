-- Add new category values to the event_category enum
ALTER TYPE event_category ADD VALUE IF NOT EXISTS 'bicycles';
ALTER TYPE event_category ADD VALUE IF NOT EXISTS 'motorcycles';
ALTER TYPE event_category ADD VALUE IF NOT EXISTS 'runs';