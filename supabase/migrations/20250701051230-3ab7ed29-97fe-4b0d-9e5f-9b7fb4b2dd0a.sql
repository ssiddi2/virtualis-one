
-- First, drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can access profiles from their hospital" ON profiles;

-- Create a simple, non-recursive policy for profile access
-- Users can only see their own profile and profiles from their hospital (using a function to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_hospital_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT hospital_id FROM public.profiles WHERE id = user_uuid;
$$;

-- Now create a non-recursive policy for hospital-based access
CREATE POLICY "Users can access profiles from same hospital" ON profiles
FOR SELECT USING (
  hospital_id = public.get_user_hospital_id(auth.uid()) OR 
  id = auth.uid()
);

-- Ensure the "Users can update their own profile" policy exists and is correct
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (id = auth.uid());

-- Also ensure users can insert their own profile (needed for signup)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (id = auth.uid());
