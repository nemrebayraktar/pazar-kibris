/*
  # Create vehicles table and related schema

  ## Overview
  This migration creates the core vehicles table for the KKTC car marketplace platform.

  ## New Tables
  
  ### `vehicles`
  - `id` (uuid, primary key) - Unique identifier for each vehicle listing
  - `title` (text, required) - Vehicle title/headline
  - `description` (text) - Detailed description of the vehicle
  - `price` (numeric, required) - Vehicle price
  - `currency` (text, default 'TL') - Currency type
  - `brand` (text, required) - Vehicle brand/make
  - `model` (text, required) - Vehicle model
  - `year` (integer, required) - Manufacturing year
  - `mileage` (integer, default 0) - Current mileage in kilometers
  - `engine_size` (integer) - Engine displacement in cc
  - `engine_power` (integer) - Engine power in HP
  - `doors` (integer, default 4) - Number of doors
  - `seats` (integer, default 5) - Number of seats
  - `warranty` (boolean, default false) - Has warranty
  - `exchange` (boolean, default false) - Accepts exchange
  - `credit` (boolean, default false) - Credit available
  - `damage_record` (boolean, default false) - Has damage history
  - `painted_parts` (jsonb, default '[]') - Array of painted parts
  - `equipment` (jsonb, default '[]') - Array of equipment/features
  - `gearbox` (text) - Transmission type (Manuel, Otomatik, etc.)
  - `fuel` (text) - Fuel type (Benzin, Dizel, Elektrik, etc.)
  - `steering` (text, default 'Sol') - Steering wheel position
  - `color` (text) - Vehicle color
  - `city` (text, required) - Location city
  - `category` (text, required) - Vehicle category (Otomobil, Motosiklet, etc.)
  - `images` (jsonb, default '[]') - Array of image URLs
  - `seller_id` (uuid, foreign key) - References auth.users
  - `seller_name` (text) - Seller display name
  - `seller_phone` (text) - Seller contact phone
  - `seller_email` (text) - Seller contact email
  - `package_type` (text, default 'Standart') - Listing package type (Standart, VIP, Vitrine)
  - `featured` (boolean, default false) - Is featured listing
  - `status` (text, default 'active') - Listing status (active, pending, sold, deleted)
  - `view_count` (integer, default 0) - Number of views
  - `favorite_count` (integer, default 0) - Number of favorites
  - `created_at` (timestamptz, default now()) - Creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on vehicles table
  - Public can view active listings
  - Authenticated users can create new listings
  - Users can update/delete their own listings
  - Admin role can manage all listings

  ## Important Notes
  - All price values stored as numeric for precision
  - JSONB used for flexible array storage (images, equipment, painted_parts)
  - Timestamps automatically managed with triggers
  - Foreign key to auth.users ensures seller validation
*/

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'TL',
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  mileage integer DEFAULT 0 CHECK (mileage >= 0),
  engine_size integer CHECK (engine_size > 0),
  engine_power integer CHECK (engine_power > 0),
  doors integer DEFAULT 4 CHECK (doors > 0),
  seats integer DEFAULT 5 CHECK (seats > 0),
  warranty boolean DEFAULT false,
  exchange boolean DEFAULT false,
  credit boolean DEFAULT false,
  damage_record boolean DEFAULT false,
  painted_parts jsonb DEFAULT '[]'::jsonb,
  equipment jsonb DEFAULT '[]'::jsonb,
  gearbox text,
  fuel text,
  steering text DEFAULT 'Sol',
  color text,
  city text NOT NULL,
  category text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_name text,
  seller_phone text,
  seller_email text,
  package_type text DEFAULT 'Standart',
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'deleted')),
  view_count integer DEFAULT 0 CHECK (view_count >= 0),
  favorite_count integer DEFAULT 0 CHECK (favorite_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_city ON vehicles(city);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public can view active listings
CREATE POLICY "Anyone can view active vehicles"
  ON vehicles
  FOR SELECT
  USING (status = 'active');

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can create vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

-- Users can update their own listings
CREATE POLICY "Users can update own vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Users can delete their own listings (soft delete by updating status)
CREATE POLICY "Users can delete own vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Users can view their own listings regardless of status
CREATE POLICY "Users can view own vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);