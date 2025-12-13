-- Fix function search_path for security (HIPAA compliance)

-- 1. Fix get_user_hospital_id function
CREATE OR REPLACE FUNCTION public.get_user_hospital_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hospital_id FROM public.profiles WHERE id = user_uuid;
$$;

-- 2. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Add last_activity column to profiles for server-side session tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT now();

-- 4. Create index for efficient session queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity 
ON public.profiles(last_activity);

-- 5. Add comment for HIPAA compliance documentation
COMMENT ON COLUMN public.profiles.last_activity IS 'Last user activity timestamp for HIPAA session timeout compliance';