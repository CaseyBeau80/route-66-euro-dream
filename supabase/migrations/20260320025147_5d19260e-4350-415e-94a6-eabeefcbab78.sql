
-- Create storage bucket for storymap historical photos
INSERT INTO storage.buckets (id, name, public) VALUES ('storymap', 'storymap', true);

-- Allow public read access to storymap images
CREATE POLICY "Storymap images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'storymap');
