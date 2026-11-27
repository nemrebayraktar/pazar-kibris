/*
  # Fix Vehicle Images Storage Policy

  ## Overview
  This migration fixes the INSERT policy for vehicle-images bucket by adding the missing WITH CHECK clause.

  ## Changes
  - Drop and recreate the INSERT policy with proper WITH CHECK clause
  
  ## Security
  - Ensures authenticated users can only upload to the vehicle-images bucket
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;

-- Recreate with proper WITH CHECK
CREATE POLICY "Authenticated users can upload vehicle images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicle-images');