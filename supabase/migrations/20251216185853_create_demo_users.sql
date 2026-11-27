/*
  # Create demo users for testing

  ## Overview
  Creates two demo users:
  1. Admin user: admin@arackibris.com (password: demo123)
  2. Regular user: user@example.com (password: demo123)

  ## Changes
  - Inserts demo users into auth.users
  - Creates corresponding profiles with proper roles
  - Uses pgcrypto extension for password hashing

  ## Important Notes
  - Demo password: demo123
  - Admin user automatically gets is_admin = true via trigger
  - Regular user gets is_admin = false
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user
DO $$
DECLARE
  admin_user_id uuid;
  regular_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@arackibris.com';
  
  IF admin_user_id IS NULL THEN
    -- Create admin user
    admin_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@arackibris.com',
      crypt('demo123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin User"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    
    -- Create profile for admin
    INSERT INTO public.profiles (id, full_name, is_admin)
    VALUES (admin_user_id, 'Admin User', true)
    ON CONFLICT (id) DO UPDATE SET is_admin = true;
  END IF;

  -- Check if regular user already exists
  SELECT id INTO regular_user_id FROM auth.users WHERE email = 'user@example.com';
  
  IF regular_user_id IS NULL THEN
    -- Create regular user
    regular_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      regular_user_id,
      '00000000-0000-0000-0000-000000000000',
      'user@example.com',
      crypt('demo123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Demo User"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    
    -- Create profile for regular user
    INSERT INTO public.profiles (id, full_name, is_admin)
    VALUES (regular_user_id, 'Demo User', false)
    ON CONFLICT (id) DO UPDATE SET is_admin = false;
  END IF;
END $$;