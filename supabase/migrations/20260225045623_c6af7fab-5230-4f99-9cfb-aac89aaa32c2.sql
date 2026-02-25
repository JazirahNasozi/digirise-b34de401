-- Create storage bucket for website images
INSERT INTO storage.buckets (id, name, public) VALUES ('website-images', 'website-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload website images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'website-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own website images"
ON storage.objects FOR DELETE
USING (bucket_id = 'website-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to website images
CREATE POLICY "Website images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

-- Allow users to update their own images
CREATE POLICY "Users can update own website images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'website-images' AND auth.uid()::text = (storage.foldername(name))[1]);