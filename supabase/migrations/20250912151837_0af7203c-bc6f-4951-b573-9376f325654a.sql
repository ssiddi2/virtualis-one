-- Clean up existing test users
-- This will cascade delete from auth.users due to the foreign key relationship
DELETE FROM public.profiles;

-- Verify the profiles table is empty
SELECT COUNT(*) as remaining_profiles FROM public.profiles;