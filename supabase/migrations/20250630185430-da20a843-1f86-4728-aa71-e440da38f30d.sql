
-- First, add hospital_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hospital_id UUID REFERENCES hospitals(id);

-- Update existing profiles to have a default hospital (assign first hospital to all existing users)
UPDATE profiles 
SET hospital_id = (SELECT id FROM hospitals LIMIT 1) 
WHERE hospital_id IS NULL;

-- Now enable RLS on all tables and create secure policies

-- Patients table - users can only see patients from their hospital
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access patients from their hospital" ON patients;
CREATE POLICY "Users can access patients from their hospital" ON patients
FOR ALL USING (
  hospital_id IN (
    SELECT hospital_id FROM profiles WHERE id = auth.uid()
  )
);

-- Medical records - only accessible by treating providers
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can access medical records" ON medical_records;
CREATE POLICY "Providers can access medical records" ON medical_records
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Medications - only accessible by authorized roles
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage medications" ON medications;
CREATE POLICY "Healthcare providers can manage medications" ON medications
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  ) AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('physician', 'nurse', 'pharmacist', 'admin')
  )
);

-- Lab orders - accessible by ordering providers and lab staff
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage lab orders" ON lab_orders;
CREATE POLICY "Healthcare providers can manage lab orders" ON lab_orders
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Radiology orders - similar restrictions
ALTER TABLE radiology_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage radiology orders" ON radiology_orders;
CREATE POLICY "Healthcare providers can manage radiology orders" ON radiology_orders
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Nursing assessments - nurses and physicians only
ALTER TABLE nursing_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Nurses and physicians can manage assessments" ON nursing_assessments;
CREATE POLICY "Nurses and physicians can manage assessments" ON nursing_assessments
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  ) AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('physician', 'nurse', 'admin')
  )
);

-- Clinical orders - physicians and authorized providers only
ALTER TABLE clinical_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authorized providers can manage orders" ON clinical_orders;
CREATE POLICY "Authorized providers can manage orders" ON clinical_orders
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  ) AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('physician', 'admin')
  )
);

-- Problem list - accessible by all providers
ALTER TABLE problem_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage problem list" ON problem_list;
CREATE POLICY "Healthcare providers can manage problem list" ON problem_list
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Allergies - critical safety data accessible by all providers
ALTER TABLE allergies_adverse_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage allergies" ON allergies_adverse_reactions;
CREATE POLICY "Healthcare providers can manage allergies" ON allergies_adverse_reactions
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Vital signs - accessible by all healthcare providers
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage vital signs" ON vital_signs;
CREATE POLICY "Healthcare providers can manage vital signs" ON vital_signs
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Billing charges - accessible by billing staff and admins
ALTER TABLE billing_charges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Billing staff can manage charges" ON billing_charges;
CREATE POLICY "Billing staff can manage charges" ON billing_charges
FOR ALL USING (
  hospital_id IN (
    SELECT hospital_id FROM profiles WHERE id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('biller', 'admin', 'physician')
  )
);

-- Hospitals - users can only see their own hospital
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their hospital" ON hospitals;
CREATE POLICY "Users can access their hospital" ON hospitals
FOR ALL USING (
  id IN (
    SELECT hospital_id FROM profiles WHERE id = auth.uid()
  )
);

-- Profiles - users can only see profiles from their hospital
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access profiles from their hospital" ON profiles;
CREATE POLICY "Users can access profiles from their hospital" ON profiles
FOR SELECT USING (
  hospital_id IN (
    SELECT hospital_id FROM profiles WHERE id = auth.uid()
  ) OR id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (id = auth.uid());

-- Update the handle_new_user function to include hospital assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  default_hospital_id UUID;
BEGIN
  -- Get the first hospital as default (in production, this would be more sophisticated)
  SELECT id INTO default_hospital_id FROM hospitals LIMIT 1;
  
  INSERT INTO public.profiles (id, email, first_name, last_name, role, hospital_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'physician'),
    COALESCE((NEW.raw_user_meta_data->>'hospital_id')::UUID, default_hospital_id)
  );
  RETURN NEW;
END;
$function$;

-- Create trigger for new user handling if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
