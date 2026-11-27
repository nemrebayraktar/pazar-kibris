/*
  # Auto-assign admin role to specific email

  ## Overview
  Updates the profile creation function to automatically set is_admin = true 
  for the admin email address (admin@arackibris.com).

  ## Changes
  - Updates `create_profile_for_user` function to check email
  - If email is admin@arackibris.com, sets is_admin = true
  - Otherwise, keeps default is_admin = false

  ## Important Notes
  - Admin email: admin@arackibris.com
  - Admin users are automatically assigned on signup
*/

-- Update the profile creation function to auto-assign admin role
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;