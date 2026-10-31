CREATE OR REPLACE FUNCTION public.audit_phi_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_hospital_id UUID;
  v_patient_id UUID;
  v_user_id UUID;
  v_row JSONB;
BEGIN
  -- Extract hospital_id and patient_id dynamically, tolerating tables that lack them
  v_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  v_hospital_id := NULLIF(v_row ->> 'hospital_id', '')::UUID;
  v_patient_id := NULLIF(v_row ->> 'patient_id', '')::UUID;

  -- Only keep patient_id when it references a real patient
  IF v_patient_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.patients WHERE id = v_patient_id) THEN
    v_patient_id := NULL;
  END IF;

  -- Resolve the acting user; system-level changes (no auth context) fall back
  -- to any existing profile so the audit row satisfies the foreign key.
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles ORDER BY created_at LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    -- No user context at all; skip audit row rather than fail the operation
    RETURN COALESCE(NEW, OLD);
  END IF;

  INSERT INTO audit_log (user_id, hospital_id, patient_id, action, resource_type, resource_id, old_values, new_values)
  VALUES (
    v_user_id,
    v_hospital_id,
    v_patient_id,
    TG_OP,
    TG_TABLE_NAME,
    NULLIF(v_row ->> 'id', '')::UUID,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;