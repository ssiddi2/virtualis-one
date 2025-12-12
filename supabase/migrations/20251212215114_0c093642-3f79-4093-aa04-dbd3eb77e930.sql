-- HIPAA Audit Logging Infrastructure
-- Phase 1: Enhance audit_log table
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS access_reason TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS session_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS is_emergency_access BOOLEAN DEFAULT false;

-- Phase 2: Generic audit trigger function (Security Definer for RLS bypass)
CREATE OR REPLACE FUNCTION audit_phi_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hospital_id UUID;
  v_patient_id UUID;
BEGIN
  -- Extract hospital_id and patient_id dynamically
  v_hospital_id := COALESCE(
    CASE WHEN TG_OP = 'DELETE' THEN (OLD).hospital_id ELSE (NEW).hospital_id END,
    NULL
  );
  v_patient_id := COALESCE(
    CASE WHEN TG_OP = 'DELETE' THEN (OLD).patient_id ELSE (NEW).patient_id END,
    CASE WHEN TG_OP = 'DELETE' THEN (OLD).id ELSE (NEW).id END
  );

  INSERT INTO audit_log (user_id, hospital_id, patient_id, action, resource_type, resource_id, old_values, new_values)
  VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
    v_hospital_id,
    v_patient_id,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(CASE WHEN TG_OP = 'DELETE' THEN (OLD).id ELSE (NEW).id END, NULL),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Phase 3: Apply triggers to all PHI tables
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY['patients','medical_records','medications','lab_orders','radiology_orders','vital_signs','allergies_adverse_reactions','problem_list','nursing_assessments','billing_charges'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_%s_changes ON %I', tbl, tbl);
    EXECUTE format('CREATE TRIGGER audit_%s_changes AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_phi_changes()', tbl, tbl);
  END LOOP;
END;
$$;

-- Phase 4: RLS policies for audit_log (insert allowed for authenticated, select for admins only)
DROP POLICY IF EXISTS "Users can insert audit logs" ON audit_log;
CREATE POLICY "Users can insert audit logs" ON audit_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Healthcare providers can access audit log" ON audit_log;
CREATE POLICY "Admins can view audit logs" ON audit_log FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);