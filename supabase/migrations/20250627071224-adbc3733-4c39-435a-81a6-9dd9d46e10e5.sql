
-- Create specialties table
CREATE TABLE public.specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create physicians table
CREATE TABLE public.physicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialty_id UUID REFERENCES public.specialties(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create on-call schedules table
CREATE TABLE public.on_call_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  physician_id UUID REFERENCES public.physicians(id) NOT NULL,
  specialty_id UUID REFERENCES public.specialties(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultation requests table
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT NOT NULL,
  requesting_physician_id UUID REFERENCES public.physicians(id),
  requested_specialty_id UUID REFERENCES public.specialties(id),
  consulted_physician_id UUID REFERENCES public.physicians(id),
  patient_id TEXT,
  urgency TEXT CHECK (urgency IN ('routine', 'urgent', 'critical')),
  status TEXT CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',
  clinical_question TEXT,
  ai_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.on_call_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Policies for specialties (readable by all authenticated users)
CREATE POLICY "Anyone can view specialties"
  ON public.specialties FOR SELECT
  TO authenticated
  USING (true);

-- Policies for physicians (readable by all authenticated users)
CREATE POLICY "Anyone can view active physicians"
  ON public.physicians FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policies for on-call schedules (readable by all authenticated users)
CREATE POLICY "Anyone can view on-call schedules"
  ON public.on_call_schedules FOR SELECT
  TO authenticated
  USING (true);

-- Policies for consultation requests
CREATE POLICY "Users can view consultation requests they're involved in"
  ON public.consultation_requests FOR SELECT
  TO authenticated
  USING (
    requesting_physician_id IN (SELECT id FROM public.physicians WHERE user_id = auth.uid()) OR
    consulted_physician_id IN (SELECT id FROM public.physicians WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create consultation requests"
  ON public.consultation_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    requesting_physician_id IN (SELECT id FROM public.physicians WHERE user_id = auth.uid())
  );

CREATE POLICY "Consulted physicians can update consultation requests"
  ON public.consultation_requests FOR UPDATE
  TO authenticated
  USING (
    consulted_physician_id IN (SELECT id FROM public.physicians WHERE user_id = auth.uid())
  );

-- Insert sample specialties
INSERT INTO public.specialties (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Pulmonology', 'Lungs and respiratory system'),
('Neurology', 'Brain and nervous system'),
('Oncology', 'Cancer treatment and care'),
('Emergency Medicine', 'Emergency and critical care'),
('Internal Medicine', 'General internal medicine'),
('Surgery', 'General and specialized surgery'),
('Orthopedics', 'Bones, joints, and musculoskeletal system'),
('Psychiatry', 'Mental health and psychiatric care'),
('Radiology', 'Medical imaging and diagnostics');

-- Insert sample physicians
INSERT INTO public.physicians (first_name, last_name, email, phone, specialty_id) VALUES
('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '555-0101', (SELECT id FROM public.specialties WHERE name = 'Emergency Medicine')),
('Michael', 'Chen', 'michael.chen@hospital.com', '555-0102', (SELECT id FROM public.specialties WHERE name = 'Cardiology')),
('Emily', 'Rodriguez', 'emily.rodriguez@hospital.com', '555-0103', (SELECT id FROM public.specialties WHERE name = 'Pulmonology')),
('David', 'Kim', 'david.kim@hospital.com', '555-0104', (SELECT id FROM public.specialties WHERE name = 'Neurology')),
('Lisa', 'Anderson', 'lisa.anderson@hospital.com', '555-0105', (SELECT id FROM public.specialties WHERE name = 'Internal Medicine'));

-- Insert sample on-call schedules (current day)
INSERT INTO public.on_call_schedules (physician_id, specialty_id, start_time, end_time, is_primary) VALUES
((SELECT id FROM public.physicians WHERE email = 'sarah.johnson@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Emergency Medicine'), 
 now(), now() + interval '24 hours', true),
((SELECT id FROM public.physicians WHERE email = 'michael.chen@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Cardiology'), 
 now(), now() + interval '24 hours', true),
((SELECT id FROM public.physicians WHERE email = 'emily.rodriguez@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Pulmonology'), 
 now(), now() + interval '24 hours', true);

-- Add triggers for updated_at
CREATE TRIGGER update_physicians_updated_at
  BEFORE UPDATE ON public.physicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
