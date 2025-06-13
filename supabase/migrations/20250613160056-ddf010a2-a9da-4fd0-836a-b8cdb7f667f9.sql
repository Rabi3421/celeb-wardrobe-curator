
-- Create a table to store multiple media files for outfits
CREATE TABLE public.outfit_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.outfits(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_outfit_media_outfit_id ON public.outfit_media(outfit_id);
CREATE INDEX idx_outfit_media_display_order ON public.outfit_media(outfit_id, display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE public.outfit_media ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since outfits are public)
CREATE POLICY "Allow public read access to outfit media" 
  ON public.outfit_media 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert outfit media
CREATE POLICY "Allow authenticated users to insert outfit media" 
  ON public.outfit_media 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update outfit media
CREATE POLICY "Allow authenticated users to update outfit media" 
  ON public.outfit_media 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete outfit media
CREATE POLICY "Allow authenticated users to delete outfit media" 
  ON public.outfit_media 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Create a storage bucket for outfit media if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'outfit-media', 
  'outfit-media', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the outfit-media bucket
CREATE POLICY "Allow public read access to outfit media bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'outfit-media');

CREATE POLICY "Allow authenticated users to upload outfit media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'outfit-media');

CREATE POLICY "Allow authenticated users to update outfit media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'outfit-media');

CREATE POLICY "Allow authenticated users to delete outfit media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'outfit-media');
