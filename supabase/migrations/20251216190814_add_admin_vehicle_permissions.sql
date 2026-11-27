/*
  # Add admin permissions for vehicle management

  ## Overview
  Grants admin users full access to manage all vehicle listings including:
  - View all listings regardless of status
  - Update any vehicle listing including images
  - Delete any vehicle listing

  ## Changes
  1. Admin can SELECT all vehicles
  2. Admin can UPDATE all vehicles (including images)
  3. Admin can DELETE all vehicles

  ## Security
  - Policies check is_admin flag from profiles table
  - Only users with is_admin = true get these permissions
  - Admin permissions bypass seller_id checks

  ## Important Notes
  - These policies allow admins to modify images, descriptions, and all vehicle data
  - Admin can manage demo vehicles and user-created vehicles
  - Existing user policies remain unchanged
*/

-- Drop existing demo vehicle policy if it exists
DROP POLICY IF EXISTS "Public can insert demo vehicles" ON vehicles;

-- Admin can view all vehicles regardless of status
CREATE POLICY "Admins can view all vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can update all vehicles (including images and all fields)
CREATE POLICY "Admins can update all vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can delete all vehicles
CREATE POLICY "Admins can delete all vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can insert vehicles (for creating demo vehicles)
CREATE POLICY "Admins can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );