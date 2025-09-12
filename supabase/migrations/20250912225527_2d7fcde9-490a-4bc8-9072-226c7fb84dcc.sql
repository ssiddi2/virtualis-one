-- Update role constraint on public.profiles to support current app roles
-- Safely replace the existing CHECK constraint to include missing roles

-- 1) Drop the old constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2) Recreate with expanded allowed roles
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (
  role = ANY (
    ARRAY[
      'admin'::text,
      'doctor'::text,        -- existing
      'physician'::text,     -- newly added to match UI
      'nurse'::text,         -- existing
      'technician'::text,    -- existing
      'pharmacist'::text,    -- existing
      'receptionist'::text,  -- existing
      'biller'::text         -- newly added to match UI
    ]
  )
);

-- Optional: ensure the column remains NOT NULL (kept as-is)
-- ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
