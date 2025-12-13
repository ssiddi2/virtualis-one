-- Fix remaining function without search_path

-- Fix audit_phi_changes function (already has search_path but re-applying for consistency)
CREATE OR REPLACE FUNCTION public.audit_phi_changes()
RETURNS trigger
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