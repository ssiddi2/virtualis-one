CREATE SEQUENCE IF NOT EXISTS public.emr_writeback_seq START 1;

CREATE TABLE public.emr_writebacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid NOT NULL,
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('order', 'note')),
  client_request_id uuid NOT NULL,
  source_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'unavailable')),
  response_status integer,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_request_id)
);

GRANT SELECT ON public.emr_writebacks TO authenticated;
GRANT ALL ON public.emr_writebacks TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.emr_writeback_seq TO service_role;

ALTER TABLE public.emr_writebacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own EMR write-backs"
  ON public.emr_writebacks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.assign_emr_writeback_source_id()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE n text;
BEGIN
  IF NEW.source_id IS NULL OR NEW.source_id = '' THEN
    n := nextval('public.emr_writeback_seq')::text;
    IF length(n) < 6 THEN n := lpad(n, 6, '0'); END IF;
    NEW.source_id := CASE NEW.kind WHEN 'order' THEN 'VO-ORD-' ELSE 'VO-NOTE-' END || n;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER emr_writebacks_source_id
  BEFORE INSERT ON public.emr_writebacks
  FOR EACH ROW EXECUTE FUNCTION public.assign_emr_writeback_source_id();

CREATE OR REPLACE FUNCTION public.touch_emr_writebacks()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

CREATE TRIGGER emr_writebacks_touch
  BEFORE UPDATE ON public.emr_writebacks
  FOR EACH ROW EXECUTE FUNCTION public.touch_emr_writebacks();