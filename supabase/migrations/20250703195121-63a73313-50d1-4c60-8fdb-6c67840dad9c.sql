-- Add optional category and state columns to photo_challenges table
ALTER TABLE public.photo_challenges 
ADD COLUMN category text,
ADD COLUMN state text;

-- Create index for better performance on category queries
CREATE INDEX idx_photo_challenges_category ON public.photo_challenges(category);

-- Create index for better performance on state queries  
CREATE INDEX idx_photo_challenges_state ON public.photo_challenges(state);