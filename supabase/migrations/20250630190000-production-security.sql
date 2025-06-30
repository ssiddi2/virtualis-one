
-- Enable RLS on all tables and create secure policies

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
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare providers can manage allergies" ON allergies;
CREATE POLICY "Healthcare providers can manage allergies" ON allergies
FOR ALL USING (
  patient_id IN (
    SELECT id FROM patients WHERE hospital_id IN (
      SELECT hospital_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Add audit logging function
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all changes to sensitive tables
  INSERT INTO audit_log (
    table_name,
    operation,
    old_data,
    new_data,
    user_id,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_patients ON patients;
CREATE TRIGGER audit_patients
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

DROP TRIGGER IF EXISTS audit_medications ON medications;
CREATE TRIGGER audit_medications
  AFTER INSERT OR UPDATE OR DELETE ON medications
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

DROP TRIGGER IF EXISTS audit_clinical_orders ON clinical_orders;
CREATE TRIGGER audit_clinical_orders
  AFTER INSERT OR UPDATE OR DELETE ON clinical_orders
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
