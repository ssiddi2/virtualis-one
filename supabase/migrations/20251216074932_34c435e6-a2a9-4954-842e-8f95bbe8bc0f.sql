-- EMR Credentials table with encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.emr_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  vendor TEXT NOT NULL CHECK (vendor IN ('epic', 'cerner', 'meditech', 'allscripts', 'fhir')),
  base_url TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret_encrypted TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['patient/*.read', 'user/*.read'],
  tenant_id TEXT,
  is_active BOOLEAN DEFAULT true,
  last_health_check TIMESTAMPTZ,
  last_health_status TEXT CHECK (last_health_status IN ('healthy', 'degraded', 'down')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(hospital_id, vendor)
);

-- RLS
ALTER TABLE public.emr_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital admins can manage EMR credentials"
ON public.emr_credentials FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND hospital_id = get_user_hospital_id(auth.uid())
);

-- Audit trigger
CREATE TRIGGER audit_emr_credentials
AFTER INSERT OR UPDATE OR DELETE ON public.emr_credentials
FOR EACH ROW EXECUTE FUNCTION audit_phi_changes();

-- Updated_at trigger
CREATE TRIGGER update_emr_credentials_updated_at
BEFORE UPDATE ON public.emr_credentials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to encrypt secrets
CREATE OR REPLACE FUNCTION encrypt_emr_secret(secret TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(secret, current_setting('app.settings.emr_encryption_key', true)), 'base64');
END;
$$;

-- Helper function to decrypt secrets (only callable by service role)
CREATE OR REPLACE FUNCTION decrypt_emr_secret(encrypted TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted, 'base64'), current_setting('app.settings.emr_encryption_key', true));
END;
$$;