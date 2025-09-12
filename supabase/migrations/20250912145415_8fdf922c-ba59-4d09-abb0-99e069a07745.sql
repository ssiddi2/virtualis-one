-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  emr_type TEXT NOT NULL,
  license_number TEXT
);

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view hospitals" 
ON public.hospitals 
FOR SELECT 
USING (true);

CREATE POLICY "Users can access their hospital" 
ON public.hospitals 
FOR ALL 
USING (id IN (SELECT hospital_id FROM profiles WHERE id = auth.uid()));

-- Insert some demo hospitals
INSERT INTO public.hospitals (name, address, city, state, zip_code, phone, email, emr_type, license_number) VALUES
('LiveMed General Hospital', '123 Medical Center Dr', 'New York', 'NY', '10001', '(212) 555-0100', 'info@livemedgeneral.com', 'Epic', 'NY-001-2024'),
('St. Mary Medical Center', '456 Healthcare Blvd', 'Los Angeles', 'CA', '90001', '(213) 555-0200', 'contact@stmarymed.com', 'Cerner', 'CA-002-2024'),
('Regional Medical Center', '789 Hospital Way', 'Chicago', 'IL', '60601', '(312) 555-0300', 'info@regionalmed.com', 'Allscripts', 'IL-003-2024');