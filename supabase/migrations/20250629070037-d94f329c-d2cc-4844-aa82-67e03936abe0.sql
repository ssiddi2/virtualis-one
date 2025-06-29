
-- First, let's add the missing specialties that aren't already in the system
INSERT INTO public.specialties (name, description) VALUES
('Nephrology', 'Kidney and renal system disorders'),
('Infectious Disease', 'Infectious and communicable diseases'),
('Critical Care', 'Intensive care and critical patients'),
('Primary Care', 'Primary attending physicians'),
('Nocturnist', 'Night shift hospitalist coverage'),
('Psychiatry', 'Mental health and psychiatric care')
ON CONFLICT (name) DO NOTHING;

-- Add more sample physicians for the new specialties
INSERT INTO public.physicians (first_name, last_name, email, phone, specialty_id) VALUES
('Robert', 'Williams', 'robert.williams@hospital.com', '555-0106', (SELECT id FROM public.specialties WHERE name = 'Nephrology')),
('Maria', 'Garcia', 'maria.garcia@hospital.com', '555-0107', (SELECT id FROM public.specialties WHERE name = 'Infectious Disease')),
('James', 'Taylor', 'james.taylor@hospital.com', '555-0108', (SELECT id FROM public.specialties WHERE name = 'Critical Care')),
('Jennifer', 'Martinez', 'jennifer.martinez@hospital.com', '555-0109', (SELECT id FROM public.specialties WHERE name = 'Primary Care')),
('Christopher', 'Brown', 'christopher.brown@hospital.com', '555-0110', (SELECT id FROM public.specialties WHERE name = 'Nocturnist')),
('Amanda', 'Davis', 'amanda.davis@hospital.com', '555-0111', (SELECT id FROM public.specialties WHERE name = 'Surgery')),
('Kevin', 'Wilson', 'kevin.wilson@hospital.com', '555-0112', (SELECT id FROM public.specialties WHERE name = 'Psychiatry')),
('Nicole', 'Moore', 'nicole.moore@hospital.com', '555-0113', (SELECT id FROM public.specialties WHERE name = 'Neurology')),
('Thomas', 'Jackson', 'thomas.jackson@hospital.com', '555-0114', (SELECT id FROM public.specialties WHERE name = 'Cardiology')),
('Rachel', 'White', 'rachel.white@hospital.com', '555-0115', (SELECT id FROM public.specialties WHERE name = 'Pulmonology'));

-- Create comprehensive on-call schedules for all specialties (covering current 24-hour period)
INSERT INTO public.on_call_schedules (physician_id, specialty_id, start_time, end_time, is_primary) VALUES
-- Cardiology
((SELECT id FROM public.physicians WHERE email = 'michael.chen@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Cardiology'), 
 now(), now() + interval '12 hours', true),
((SELECT id FROM public.physicians WHERE email = 'thomas.jackson@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Cardiology'), 
 now() + interval '12 hours', now() + interval '24 hours', false),

-- Pulmonology
((SELECT id FROM public.physicians WHERE email = 'emily.rodriguez@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Pulmonology'), 
 now(), now() + interval '24 hours', true),
((SELECT id FROM public.physicians WHERE email = 'rachel.white@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Pulmonology'), 
 now(), now() + interval '24 hours', false),

-- Neurology
((SELECT id FROM public.physicians WHERE email = 'david.kim@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Neurology'), 
 now(), now() + interval '24 hours', true),
((SELECT id FROM public.physicians WHERE email = 'nicole.moore@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Neurology'), 
 now(), now() + interval '24 hours', false),

-- Emergency Medicine
((SELECT id FROM public.physicians WHERE email = 'sarah.johnson@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Emergency Medicine'), 
 now(), now() + interval '24 hours', true),

-- Internal Medicine
((SELECT id FROM public.physicians WHERE email = 'lisa.anderson@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Internal Medicine'), 
 now(), now() + interval '24 hours', true),

-- Nephrology
((SELECT id FROM public.physicians WHERE email = 'robert.williams@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Nephrology'), 
 now(), now() + interval '24 hours', true),

-- Infectious Disease
((SELECT id FROM public.physicians WHERE email = 'maria.garcia@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Infectious Disease'), 
 now(), now() + interval '24 hours', true),

-- Critical Care
((SELECT id FROM public.physicians WHERE email = 'james.taylor@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Critical Care'), 
 now(), now() + interval '24 hours', true),

-- Primary Care
((SELECT id FROM public.physicians WHERE email = 'jennifer.martinez@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Primary Care'), 
 now(), now() + interval '24 hours', true),

-- Nocturnist (night coverage)
((SELECT id FROM public.physicians WHERE email = 'christopher.brown@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Nocturnist'), 
 now(), now() + interval '24 hours', true),

-- Surgery
((SELECT id FROM public.physicians WHERE email = 'amanda.davis@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Surgery'), 
 now(), now() + interval '24 hours', true),

-- Psychiatry
((SELECT id FROM public.physicians WHERE email = 'kevin.wilson@hospital.com'), 
 (SELECT id FROM public.specialties WHERE name = 'Psychiatry'), 
 now(), now() + interval '24 hours', true);
