/*
  # Create demo users for authentication testing

  ## Overview
  Creates two demo users for testing the application:
  - Admin user: admin@arackibris.com
  - Regular user: user@example.com
  - Both passwords: demo123

  ## Changes
  1. Inserts admin user into auth.users
  2. Inserts regular user into auth.users
  3. Profiles are automatically created via trigger
  4. Admin user automatically gets is_admin = true via trigger

  ## Important Notes
  - Uses bcrypt for password hashing
  - Email confirmation is set to now() for immediate login
  - Profiles are auto-created by the on_auth_user_created trigger
  - Admin role is auto-assigned by email matching in trigger
*/

DO $$
DECLARE
  admin_user_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  regular_user_id uuid := '22222222-2222-2222-2222-222222222222'::uuid;
BEGIN
  -- Insert admin user (profile will be auto-created by trigger)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_user_id,
    'authenticated',
    'authenticated',
    'admin@arackibris.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert regular user (profile will be auto-created by trigger)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    regular_user_id,
    'authenticated',
    'authenticated',
    'user@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo User"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  )
  ON CONFLICT (id) DO NOTHING;
END $$;