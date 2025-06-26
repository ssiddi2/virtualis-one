
-- Insert comprehensive mock hospital data with realistic information
INSERT INTO public.hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number) VALUES
('11111111-1111-1111-1111-111111111111', 'Metropolitan General Hospital', '1500 Medical Center Drive', 'New York', 'NY', '10001', '(212) 555-0100', 'admin@metrogen.org', 'Epic', 'NY-HOSP-001'),
('22222222-2222-2222-2222-222222222222', 'Riverside Medical Center', '2800 Riverside Boulevard', 'Chicago', 'IL', '60601', '(312) 555-0200', 'info@riverside.org', 'Cerner', 'IL-HOSP-002'),
('33333333-3333-3333-3333-333333333333', 'Sunset Community Hospital', '4200 Sunset Avenue', 'Los Angeles', 'CA', '90028', '(323) 555-0300', 'contact@sunset.org', 'Meditech', 'CA-HOSP-003'),
('44444444-4444-4444-4444-444444444444', 'Bay Area Medical Complex', '3600 Innovation Way', 'San Francisco', 'CA', '94107', '(415) 555-0400', 'help@baymed.org', 'Allscripts', 'CA-HOSP-004'),
('55555555-5555-5555-5555-555555555555', 'Texas Heart Institute', '7200 Medical Plaza', 'Houston', 'TX', '77030', '(713) 555-0500', 'info@texasheart.org', 'Epic', 'TX-HOSP-005'),
('66666666-6666-6666-6666-666666666666', 'Mountain View Regional', '9800 Mountain View Road', 'Denver', 'CO', '80202', '(303) 555-0600', 'admin@mvregional.org', 'VistA', 'CO-HOSP-006'),
('77777777-7777-7777-7777-777777777777', 'Atlantic Medical Center', '5500 Atlantic Avenue', 'Miami', 'FL', '33101', '(305) 555-0700', 'contact@atlantic.org', 'Cerner', 'FL-HOSP-007'),
('88888888-8888-8888-8888-888888888888', 'Desert Springs Hospital', '1200 Desert Springs Drive', 'Phoenix', 'AZ', '85001', '(602) 555-0800', 'info@desertsprings.org', 'FHIR API', 'AZ-HOSP-008');

-- Insert mock patients for realistic data
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MRN001', 'John', 'Smith', '1975-03-15', 'male', '(555) 123-4567', 'john.smith@email.com', '123 Main St', 'New York', 'NY', '10001', 'O+', ARRAY['Penicillin'], ARRAY['Hypertension'], '2024-01-20 08:30:00', 'active', 'ICU-101', 'A'),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'MRN002', 'Sarah', 'Johnson', '1988-07-22', 'female', '(555) 234-5678', 'sarah.johnson@email.com', '456 Oak Ave', 'New York', 'NY', '10002', 'A-', ARRAY['Shellfish'], ARRAY['Diabetes Type 2'], '2024-01-19 14:15:00', 'active', 'WARD-205', 'B'),
('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'MRN003', 'Michael', 'Davis', '1965-11-08', 'male', '(555) 345-6789', 'michael.davis@email.com', '789 Pine St', 'Chicago', 'IL', '60601', 'B+', ARRAY['Latex'], ARRAY['COPD'], '2024-01-18 10:00:00', 'active', 'ICU-301', 'A'),
('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'MRN004', 'Emily', 'Wilson', '1992-05-30', 'female', '(555) 456-7890', 'emily.wilson@email.com', '321 Elm St', 'Los Angeles', 'CA', '90028', 'AB+', ARRAY[]::text[], ARRAY['Asthma'], '2024-01-21 16:45:00', 'active', 'WARD-102', 'C');

-- Insert mock vital signs (using direct inserts to avoid type issues)
INSERT INTO public.vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, recorded_at)
SELECT 
  p.id,
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  v.temperature,
  v.blood_pressure_systolic,
  v.blood_pressure_diastolic,
  v.heart_rate,
  v.respiratory_rate,
  v.oxygen_saturation,
  v.recorded_at
FROM public.patients p
CROSS JOIN (VALUES
  (98.6, 120, 80, 72, 16, 98, NOW() - INTERVAL '1 hour'),
  (99.2, 135, 85, 88, 18, 96, NOW() - INTERVAL '2 hours'),
  (97.8, 110, 70, 65, 14, 99, NOW() - INTERVAL '30 minutes'),
  (98.4, 118, 75, 78, 16, 97, NOW() - INTERVAL '45 minutes')
) AS v(temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, recorded_at)
WHERE p.id IN ('a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444');

-- Insert mock lab orders
INSERT INTO public.lab_orders (patient_id, ordered_by, test_name, test_code, priority, status, ordered_at, results)
VALUES
('a1111111-1111-1111-1111-111111111111', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Complete Blood Count', 'CBC', 'routine', 'completed', NOW() - INTERVAL '6 hours', '{"WBC": "7.2", "RBC": "4.5", "Hemoglobin": "14.2", "Hematocrit": "42.1"}'::jsonb),
('a2222222-2222-2222-2222-222222222222', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Basic Metabolic Panel', 'BMP', 'urgent', 'processing', NOW() - INTERVAL '3 hours', NULL),
('a3333333-3333-3333-3333-333333333333', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Lipid Panel', 'LIPID', 'routine', 'ordered', NOW() - INTERVAL '1 hour', NULL);

-- Insert mock radiology orders
INSERT INTO public.radiology_orders (patient_id, ordered_by, study_type, body_part, modality, priority, status, clinical_indication, ordered_at)
VALUES
('a1111111-1111-1111-1111-111111111111', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Chest X-Ray', 'Chest', 'X-Ray', 'stat', 'completed', 'Rule out pneumonia', NOW() - INTERVAL '4 hours'),
('a2222222-2222-2222-2222-222222222222', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'CT Abdomen', 'Abdomen', 'CT', 'urgent', 'scheduled', 'Abdominal pain evaluation', NOW() - INTERVAL '2 hours'),
('a4444444-4444-4444-4444-444444444444', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'MRI Brain', 'Head', 'MRI', 'routine', 'ordered', 'Headache workup', NOW() - INTERVAL '30 minutes');

-- Insert mock medications
INSERT INTO public.medications (patient_id, prescribed_by, medication_name, generic_name, dosage, frequency, route, start_date, status, indication)
VALUES
('a1111111-1111-1111-1111-111111111111', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Lisinopril', 'lisinopril', '10mg', 'Once daily', 'Oral', CURRENT_DATE, 'active', 'Hypertension'),
('a2222222-2222-2222-2222-222222222222', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Metformin', 'metformin', '500mg', 'Twice daily', 'Oral', CURRENT_DATE - INTERVAL '7 days', 'active', 'Diabetes Type 2'),
('a3333333-3333-3333-3333-333333333333', COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid), 'Albuterol', 'albuterol', '90mcg', 'As needed', 'Inhaled', CURRENT_DATE - INTERVAL '14 days', 'active', 'COPD');

-- Insert mock AI insights
INSERT INTO public.ai_insights (patient_id, hospital_id, insight_type, severity, title, description, recommendations, confidence_score, status) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'risk_assessment', 'medium', 'Elevated Blood Pressure Trend', 'Patient shows consistent elevation in systolic BP over last 24 hours', ARRAY['Consider medication adjustment', 'Monitor every 4 hours'], 0.85, 'active'),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'drug_interaction', 'high', 'Potential Drug Interaction Alert', 'New medication may interact with existing diabetes medication', ARRAY['Consult pharmacist', 'Monitor blood glucose closely'], 0.92, 'active'),
('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'diagnosis_suggestion', 'low', 'Consider Pulmonary Function Test', 'Patient history and symptoms suggest possible pulmonary function decline', ARRAY['Schedule PFT', 'Respiratory therapy consult'], 0.67, 'active');
