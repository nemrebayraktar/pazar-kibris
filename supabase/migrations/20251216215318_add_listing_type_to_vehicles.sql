/*
  # Add listing_type column to vehicles table

  1. Changes
    - Add `listing_type` column to `vehicles` table
      - Type: text
      - Values: 'sale' (satılık) or 'rent' (kiralık)
      - Default: 'sale'
      - Not null constraint
    
  2. Data Migration
    - Set all existing vehicles to 'sale' (satılık)
    
  3. Notes
    - This enables filtering vehicles by whether they are for sale or for rent
    - Frontend will need to be updated to set this value when creating/updating vehicles
    - AI chatbot will recognize Turkish keywords: "satılık", "kiralık" etc.
*/

-- Add listing_type column with default value
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'sale';

-- Add check constraint to ensure only valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vehicles_listing_type_check'
  ) THEN
    ALTER TABLE vehicles 
    ADD CONSTRAINT vehicles_listing_type_check 
    CHECK (listing_type IN ('sale', 'rent'));
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_listing_type ON vehicles(listing_type);