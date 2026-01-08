-- Add columns for Epic JWT Bearer authentication
ALTER TABLE emr_credentials ADD COLUMN IF NOT EXISTS private_key_encrypted TEXT;
ALTER TABLE emr_credentials ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'client_secret';

-- Add comment for documentation
COMMENT ON COLUMN emr_credentials.auth_method IS 'Authentication method: client_secret or jwt_bearer';
COMMENT ON COLUMN emr_credentials.private_key_encrypted IS 'Encrypted private key for JWT Bearer authentication (Epic SMART Backend Services)';