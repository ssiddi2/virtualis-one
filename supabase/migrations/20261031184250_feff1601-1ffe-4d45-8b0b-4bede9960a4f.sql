CREATE OR REPLACE FUNCTION public.audit_phi_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_hospital_id UUID;
  v_patient_id UUID;
  v_row JSONB;
BEGIN
  -- Extract hospital_id and patient_id dynamically, tolerating tables that lack them
  v_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  v_hospital_id := NULLIF(v_row ->> 'hospital_id', '')::UUID;
  v_patient_id := COALESCE(
    NULLIF(v_row ->> 'patient_id', '')::UUID,
    NULLIF(v_row ->> 'id', '')::UUID
  );

  INSERT INTO audit_log (user_id, hospital_id, patient_id, action, resource_type, resource_id, old_values, new_values)
  VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
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