/*
  # Create Storage Bucket for Vehicle Images

  ## Overview
  This migration creates a storage bucket for vehicle listing images and sets up appropriate access policies.

  ## New Storage Resources
  
  ### Bucket: `vehicle-images`
  - Public bucket for vehicle listing photos
  - Allows users to upload images for their listings
  - Images are publicly accessible for viewing
  
  ## Security
  
  ### Storage Policies
  1. Public read access - Anyone can view vehicle images
  2. Authenticated users can upload images
  3. Users can update/delete their own images
  
  ## Important Notes
  - File size limits and type restrictions should be enforced on the client side
  - Image URLs will be stored in the vehicles.images JSONB field
  - Automatic cleanup of orphaned images can be implemented later
*/

-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images',
  'vehicle-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view vehicle images (public bucket)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

-- Policy: Authenticated users can upload vehicle images
CREATE POLICY "Authenticated users can upload vehicle images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicle-images');

-- Policy: Users can update their own images
CREATE POLICY "Users can update own vehicle images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vehicle-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own vehicle images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vehicle-images' AND auth.uid()::text = (storage.foldername(name))[1]);