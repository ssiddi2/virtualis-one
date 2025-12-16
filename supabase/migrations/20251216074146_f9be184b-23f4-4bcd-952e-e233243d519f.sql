-- =============================================
-- ENTERPRISE SECURITY HARDENING MIGRATION
-- =============================================

-- 1. Create app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM (
    'admin',
    'physician',
    'nurse',
    'pharmacist',
    'technician',
    'biller',
    'receptionist'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create user_roles table (separate from profiles - prevents privilege escalation)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  hospital_id uuid REFERENCES public.hospitals(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role, hospital_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create SECURITY DEFINER functions (bypass RLS, prevent recursion)

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

-- Check if user belongs to same hospital (for patient-linked tables)
CREATE OR REPLACE FUNCTION public.can_access_patient(_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patients p
    WHERE p.id = _patient_id
      AND p.hospital_id = public.get_user_hospital_id(auth.uid())
  )
$$;

-- 4. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, hospital_id)
SELECT 
  p.id as user_id,
  CASE 
    WHEN p.role = 'admin' THEN 'admin'::app_role
    WHEN p.role = 'physician' THEN 'physician'::app_role
    WHEN p.role = 'doctor' THEN 'physician'::app_role
    WHEN p.role = 'nurse' THEN 'nurse'::app_role
    WHEN p.role = 'pharmacist' THEN 'pharmacist'::app_role
    WHEN p.role = 'technician' THEN 'technician'::app_role
    WHEN p.role = 'biller' THEN 'biller'::app_role
    WHEN p.role = 'receptionist' THEN 'receptionist'::app_role
    ELSE 'physician'::app_role
  END as role,
  p.hospital_id
FROM public.profiles p
WHERE p.id IS NOT NULL
ON CONFLICT (user_id, role, hospital_id) DO NOTHING;

-- 6. Auto-assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_hospital_id UUID;
  user_role app_role;
BEGIN
  SELECT id INTO default_hospital_id FROM public.hospitals LIMIT 1;
  
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'physician'::app_role
  );
  
  INSERT INTO public.user_roles (user_id, role, hospital_id)
  VALUES (NEW.id, user_role, default_hospital_id)
  ON CONFLICT (user_id, role, hospital_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user_role: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for auto-role assignment
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 7. Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_hospital_id ON public.user_roles(hospital_id);

-- =============================================
-- FIX ALL 22 RLS POLICIES WITH HOSPITAL-SCOPED ACCESS
-- =============================================

-- Define healthcare roles array for reuse
-- Clinical roles: admin, physician, nurse, pharmacist, technician
-- Billing roles: admin, biller

-- NURSING_ASSESSMENTS - Drop permissive policy, add hospital-scoped
DROP POLICY IF EXISTS "Healthcare providers can access nursing assessments" ON public.nursing_assessments;
DROP POLICY IF EXISTS "Nurses and physicians can manage assessments" ON public.nursing_assessments;
CREATE POLICY "Hospital-scoped nursing access"
ON public.nursing_assessments FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- CLINICAL_ORDERS
DROP POLICY IF EXISTS "Healthcare providers can access clinical orders" ON public.clinical_orders;
DROP POLICY IF EXISTS "Authorized providers can manage orders" ON public.clinical_orders;
CREATE POLICY "Hospital-scoped clinical orders"
ON public.clinical_orders FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'pharmacist']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Healthcare providers can access appointments" ON public.appointments;
CREATE POLICY "Hospital-scoped appointments"
ON public.appointments FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'receptionist']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- CARE_PLANS
DROP POLICY IF EXISTS "Healthcare providers can access care plans" ON public.care_plans;
CREATE POLICY "Hospital-scoped care plans"
ON public.care_plans FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- DISCHARGE_PLANNING
DROP POLICY IF EXISTS "Healthcare providers can access discharge planning" ON public.discharge_planning;
CREATE POLICY "Hospital-scoped discharge planning"
ON public.discharge_planning FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- MEDICATION_ADMINISTRATION_RECORDS
DROP POLICY IF EXISTS "Healthcare providers can access MAR" ON public.medication_administration_records;
CREATE POLICY "Hospital-scoped MAR"
ON public.medication_administration_records FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'pharmacist']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- CLINICAL_NOTES_TEMPLATES
DROP POLICY IF EXISTS "Healthcare providers can access note templates" ON public.clinical_notes_templates;
CREATE POLICY "Hospital-scoped note templates"
ON public.clinical_notes_templates FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
);

-- ORDER_SETS
DROP POLICY IF EXISTS "Healthcare providers can access order sets" ON public.order_sets;
CREATE POLICY "Hospital-scoped order sets"
ON public.order_sets FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'pharmacist']::app_role[])
);

-- PRIOR_AUTHORIZATIONS
DROP POLICY IF EXISTS "Healthcare providers can manage prior auths" ON public.prior_authorizations;
CREATE POLICY "Hospital-scoped prior auths"
ON public.prior_authorizations FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'biller']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- SURGICAL_CASES
DROP POLICY IF EXISTS "Healthcare providers can access surgical cases" ON public.surgical_cases;
CREATE POLICY "Hospital-scoped surgical cases"
ON public.surgical_cases FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- PAYMENT_POSTINGS
DROP POLICY IF EXISTS "Healthcare providers can manage payments" ON public.payment_postings;
CREATE POLICY "Hospital-scoped payment postings"
ON public.payment_postings FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'biller']::app_role[])
);

-- CLINICAL_ALERTS
DROP POLICY IF EXISTS "Healthcare providers can access clinical alerts" ON public.clinical_alerts;
CREATE POLICY "Hospital-scoped clinical alerts"
ON public.clinical_alerts FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'pharmacist']::app_role[])
  AND (patient_id IS NULL OR public.can_access_patient(patient_id))
);

-- INCIDENT_REPORTS
DROP POLICY IF EXISTS "Healthcare providers can access incident reports" ON public.incident_reports;
CREATE POLICY "Hospital-scoped incident reports"
ON public.incident_reports FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND (patient_id IS NULL OR public.can_access_patient(patient_id))
);

-- IMMUNIZATIONS
DROP POLICY IF EXISTS "Healthcare providers can access immunizations" ON public.immunizations;
CREATE POLICY "Hospital-scoped immunizations"
ON public.immunizations FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- CLAIM_DENIALS
DROP POLICY IF EXISTS "Healthcare providers can manage denials" ON public.claim_denials;
CREATE POLICY "Hospital-scoped claim denials"
ON public.claim_denials FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'biller']::app_role[])
);

-- ALLERGIES_ADVERSE_REACTIONS
DROP POLICY IF EXISTS "Healthcare providers can access allergies" ON public.allergies_adverse_reactions;
DROP POLICY IF EXISTS "Healthcare providers can manage allergies" ON public.allergies_adverse_reactions;
CREATE POLICY "Hospital-scoped allergies"
ON public.allergies_adverse_reactions FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'pharmacist']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- PROBLEM_LIST
DROP POLICY IF EXISTS "Healthcare providers can access problem lists" ON public.problem_list;
DROP POLICY IF EXISTS "Healthcare providers can manage problem list" ON public.problem_list;
CREATE POLICY "Hospital-scoped problem list"
ON public.problem_list FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse']::app_role[])
  AND public.can_access_patient(patient_id)
);

-- BILLING_CHARGES - Update existing policies
DROP POLICY IF EXISTS "Healthcare providers can access billing" ON public.billing_charges;
DROP POLICY IF EXISTS "Billing staff can manage charges" ON public.billing_charges;
CREATE POLICY "Hospital-scoped billing charges"
ON public.billing_charges FOR ALL TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'biller', 'physician']::app_role[])
  AND hospital_id = public.get_user_hospital_id(auth.uid())
);

-- ON_CALL_SCHEDULES
DROP POLICY IF EXISTS "Anyone can view on-call schedules" ON public.on_call_schedules;
CREATE POLICY "Hospital-scoped on-call schedules"
ON public.on_call_schedules FOR SELECT TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'physician', 'nurse', 'receptionist']::app_role[])
);

CREATE POLICY "Admins can manage on-call schedules"
ON public.on_call_schedules FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add comments for documentation
COMMENT ON TABLE public.user_roles IS 'Stores user roles separately from profiles to prevent privilege escalation attacks';
COMMENT ON FUNCTION public.has_role IS 'SECURITY DEFINER function to check user role without RLS recursion';
COMMENT ON FUNCTION public.has_any_role IS 'SECURITY DEFINER function to check if user has any of specified roles';
COMMENT ON FUNCTION public.can_access_patient IS 'SECURITY DEFINER function for hospital-scoped patient access';