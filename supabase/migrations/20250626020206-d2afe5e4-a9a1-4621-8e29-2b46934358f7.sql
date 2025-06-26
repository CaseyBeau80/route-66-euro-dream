
-- Create public storage bucket for timeline images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'timeline_images', 
  'timeline_images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policy for public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'timeline_images');

-- Create storage policy for authenticated uploads (for future admin uploads)
CREATE POLICY "Authenticated users can upload timeline images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'timeline_images' AND auth.role() = 'authenticated');

-- Create storage policy for authenticated updates
CREATE POLICY "Authenticated users can update timeline images" ON storage.objects
FOR UPDATE USING (bucket_id = 'timeline_images' AND auth.role() = 'authenticated');

-- Create storage policy for authenticated deletes
CREATE POLICY "Authenticated users can delete timeline images" ON storage.objects
FOR DELETE USING (bucket_id = 'timeline_images' AND auth.role() = 'authenticated');
