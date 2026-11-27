/*
  # Create user profiles table with admin support

  ## Overview
  This migration creates a profiles table to extend auth.users with additional user information.
  Includes automatic admin assignment for admin@arackibris.com email.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users) - User ID
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact phone number
  - `city` (text) - User's city
  - `is_dealer` (boolean, default false) - Whether user is a dealer
  - `is_admin` (boolean, default false) - Whether user is an admin
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz, default now()) - Profile creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on profiles table
  - Public can view basic profile info of other users
  - Users can view their own full profile
  - Users can update their own profile
  - Auto-create profile on user signup
  - Auto-assign admin role to admin@arackibris.com

  ## Important Notes
  - One-to-one relationship with auth.users
  - Automatically created via trigger on auth.users insert
  - Admin email: admin@arackibris.com gets is_admin = true automatically
*/

-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  city text,
  is_dealer boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_dealer ON profiles(is_dealer);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on user signup with admin check
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'admin@arackibris.com' THEN true
      ELSE false
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- RLS Policies

-- Anyone can view basic profile info
CREATE POLICY "Anyone can view profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for edge cases)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);