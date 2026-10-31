ALTER TABLE public.emr_credentials ADD COLUMN IF NOT EXISTS gateway_tenant text;

COMMENT ON COLUMN public.emr_credentials.gateway_tenant IS 'Virtualis FHIR Gateway tenant slug. When set, emr-proxy routes FHIR calls through the gateway and ignores base_url/client_* for this hospital.';