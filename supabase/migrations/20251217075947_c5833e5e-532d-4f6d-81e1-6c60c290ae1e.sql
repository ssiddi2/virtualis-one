-- ============================================================================
-- VIRTUALIS ONE - COMPLETE DATABASE FIX MIGRATION
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING CONFLICTING POLICIES
-- ============================================================================

-- Profiles policies (the main culprit)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can access profiles from their hospital" ON profiles;
DROP POLICY IF EXISTS "Users can access profiles from same hospital" ON profiles;

-- Hospitals policies
DROP POLICY IF EXISTS "Users can access their hospital" ON hospitals;
DROP POLICY IF EXISTS "Authenticated users can view hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admins can modify hospitals" ON hospitals;
DROP POLICY IF EXISTS "Anyone can view hospitals" ON hospitals;

-- Patients policies
DROP POLICY IF EXISTS "Users can access patients from their hospital" ON patients;
DROP POLICY IF EXISTS "Healthcare providers can access patients" ON patients;

-- Medical records policies
DROP POLICY IF EXISTS "Providers can access medical records" ON medical_records;
DROP POLICY IF EXISTS "Healthcare providers can access medical records" ON medical_records;

-- Vital signs policies
DROP POLICY IF EXISTS "Healthcare providers can manage vital signs" ON vital_signs;
DROP POLICY IF EXISTS "Healthcare providers can access vital signs" ON vital_signs;

-- Lab orders policies
DROP POLICY IF EXISTS "Healthcare providers can manage lab orders" ON lab_orders;
DROP POLICY IF EXISTS "Healthcare providers can access lab orders" ON lab_orders;

-- Radiology orders policies
DROP POLICY IF EXISTS "Healthcare providers can manage radiology orders" ON radiology_orders;
DROP POLICY IF EXISTS "Healthcare providers can access radiology orders" ON radiology_orders;

-- Medications policies
DROP POLICY IF EXISTS "Healthcare providers can manage medications" ON medications;
DROP POLICY IF EXISTS "Healthcare providers can access medications" ON medications;

-- Billing policies
DROP POLICY IF EXISTS "Billing staff can manage charges" ON billing_charges;
DROP POLICY IF EXISTS "Healthcare providers can access billing" ON billing_charges;
DROP POLICY IF EXISTS "Hospital-scoped billing charges" ON billing_charges;

-- AI insights policies
DROP POLICY IF EXISTS "Healthcare providers can access AI insights" ON ai_insights;
DROP POLICY IF EXISTS "Healthcare providers can access ai_insights" ON ai_insights;

-- Audit log policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;
DROP POLICY IF EXISTS "Healthcare providers can access audit log" ON audit_log;
DROP POLICY IF EXISTS "Users can insert audit logs" ON audit_log;

-- Problem list policies
DROP POLICY IF EXISTS "Healthcare providers can manage problem list" ON problem_list;
DROP POLICY IF EXISTS "Hospital-scoped problem list" ON problem_list;

-- Allergies policies
DROP POLICY IF EXISTS "Healthcare providers can manage allergies" ON allergies_adverse_reactions;
DROP POLICY IF EXISTS "Hospital-scoped allergies" ON allergies_adverse_reactions;

-- CMS quality measures policies
DROP POLICY IF EXISTS "Healthcare providers can access cms_quality_measures" ON cms_quality_measures;
DROP POLICY IF EXISTS "Healthcare providers can access quality measures" ON cms_quality_measures;

-- Nursing assessments policies
DROP POLICY IF EXISTS "Hospital-scoped nursing access" ON nursing_assessments;

-- ============================================================================
-- STEP 2: CREATE HELPER FUNCTIONS (Non-recursive)
-- ============================================================================

-- This function safely gets a user's hospital_id without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_hospital_id_safe(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT hospital_id FROM profiles WHERE id = user_uuid LIMIT 1;
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid AND role IN ('admin', 'administrator')
  );
$$;

-- Helper function to check if user is healthcare provider
CREATE OR REPLACE FUNCTION public.is_healthcare_provider(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid 
    AND role IN ('admin', 'administrator', 'physician', 'doctor', 'nurse', 'technician', 'pharmacist', 'receptionist', 'biller')
  );
$$;

-- ============================================================================
-- STEP 3: CREATE NEW CLEAN POLICIES - PROFILES
-- ============================================================================

-- Users can always view their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can insert their own profile (for signup)
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- ============================================================================
-- STEP 4: CREATE NEW CLEAN POLICIES - HOSPITALS
-- ============================================================================

-- CRITICAL FIX: All authenticated users can VIEW all hospitals
CREATE POLICY "hospitals_select_all"
ON hospitals FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert/update/delete hospitals
CREATE POLICY "hospitals_admin_all"
ON hospitals FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================================
-- STEP 5: CREATE NEW CLEAN POLICIES - PATIENTS
-- ============================================================================

-- Healthcare providers can access all patients
CREATE POLICY "patients_provider_access"
ON patients FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- ============================================================================
-- STEP 6: CREATE NEW CLEAN POLICIES - CLINICAL DATA
-- ============================================================================

-- Medical Records
CREATE POLICY "medical_records_provider_access"
ON medical_records FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Vital Signs
CREATE POLICY "vital_signs_provider_access"
ON vital_signs FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Lab Orders
CREATE POLICY "lab_orders_provider_access"
ON lab_orders FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Radiology Orders
CREATE POLICY "radiology_orders_provider_access"
ON radiology_orders FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Medications
CREATE POLICY "medications_provider_access"
ON medications FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Billing Charges
CREATE POLICY "billing_charges_provider_access"
ON billing_charges FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- AI Insights
CREATE POLICY "ai_insights_provider_access"
ON ai_insights FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Problem List
CREATE POLICY "problem_list_provider_access"
ON problem_list FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Allergies
CREATE POLICY "allergies_provider_access"
ON allergies_adverse_reactions FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- CMS Quality Measures
CREATE POLICY "cms_measures_provider_access"
ON cms_quality_measures FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- Nursing Assessments
CREATE POLICY "nursing_assessments_provider_access"
ON nursing_assessments FOR ALL
TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- ============================================================================
-- STEP 7: CREATE NEW CLEAN POLICIES - AUDIT LOG
-- ============================================================================

-- All authenticated users can insert audit logs
CREATE POLICY "audit_log_insert"
ON audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only admins can view audit logs
CREATE POLICY "audit_log_admin_select"
ON audit_log FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- STEP 8: FIX USER PROFILE CREATION TRIGGER
-- ============================================================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create improved function that handles all edge cases
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_hospital_id UUID;
  user_role TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
BEGIN
  -- Get default hospital (first one, or NULL if none exist)
  SELECT id INTO default_hospital_id FROM hospitals ORDER BY name LIMIT 1;
  
  -- Extract user data from metadata with safe defaults
  user_first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'firstName',
    split_part(NEW.email, '@', 1),
    'New'
  );
  
  user_last_name := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'lastName',
    'User'
  );
  
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'physician'
  );
  
  -- Insert the profile
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    hospital_id,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_first_name,
    user_last_name,
    user_role,
    COALESCE(
      (NEW.raw_user_meta_data->>'hospital_id')::UUID,
      default_hospital_id
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 9: CREATE PROFILES FOR EXISTING USERS WHO DON'T HAVE ONE
-- ============================================================================

INSERT INTO profiles (id, email, first_name, last_name, role, hospital_id, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', split_part(au.email, '@', 1), 'New'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'role', 'physician'),
  (SELECT id FROM hospitals ORDER BY name LIMIT 1),
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- ============================================================================
-- STEP 10: ENSURE SAMPLE DATA EXISTS
-- ============================================================================

INSERT INTO hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number)
SELECT 
  '11111111-1111-1111-1111-111111111111'::UUID,
  'Metropolitan General Hospital',
  '1500 Medical Center Drive',
  'New York',
  'NY',
  '10001',
  '(212) 555-0100',
  'admin@metrogen.org',
  'Epic',
  'NY-HOSP-001'
WHERE NOT EXISTS (SELECT 1 FROM hospitals LIMIT 1);

INSERT INTO hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number)
SELECT 
  '22222222-2222-2222-2222-222222222222'::UUID,
  'Riverside Medical Center',
  '2800 Riverside Boulevard',
  'Chicago',
  'IL',
  '60601',
  '(312) 555-0200',
  'info@riverside.org',
  'Cerner',
  'IL-HOSP-002'
WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE id = '22222222-2222-2222-2222-222222222222'::UUID);

INSERT INTO hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number)
SELECT 
  '33333333-3333-3333-3333-333333333333'::UUID,
  'Sunset Community Hospital',
  '4200 Sunset Avenue',
  'Los Angeles',
  'CA',
  '90028',
  '(323) 555-0300',
  'contact@sunset.org',
  'Meditech',
  'CA-HOSP-003'
WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE id = '33333333-3333-3333-3333-333333333333'::UUID);

INSERT INTO hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number)
SELECT 
  '44444444-4444-4444-4444-444444444444'::UUID,
  'Bay Area Medical Complex',
  '3600 Innovation Way',
  'San Francisco',
  'CA',
  '94107',
  '(415) 555-0400',
  'help@baymed.org',
  'Allscripts',
  'CA-HOSP-004'
WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE id = '44444444-4444-4444-4444-444444444444'::UUID);

-- ============================================================================
-- STEP 11: UPDATE EXISTING PROFILES WITH HOSPITAL IF NULL
-- ============================================================================

UPDATE profiles
SET hospital_id = (SELECT id FROM hospitals ORDER BY name LIMIT 1)
WHERE hospital_id IS NULL;

-- ============================================================================
-- STEP 12: GRANT NECESSARY PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_user_hospital_id_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_healthcare_provider(UUID) TO authenticated;