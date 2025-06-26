
-- Insert comprehensive mock hospital data with realistic information (keeping only 5 hospitals for better demo)
INSERT INTO public.hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number) VALUES
('11111111-1111-1111-1111-111111111111', 'Metropolitan General Hospital', '1500 Medical Center Drive', 'New York', 'NY', '10001', '(212) 555-0100', 'admin@metrogen.org', 'Epic', 'NY-HOSP-001'),
('22222222-2222-2222-2222-222222222222', 'Riverside Medical Center', '2800 Riverside Boulevard', 'Chicago', 'IL', '60601', '(312) 555-0200', 'info@riverside.org', 'Cerner', 'IL-HOSP-002'),
('33333333-3333-3333-3333-333333333333', 'Sunset Community Hospital', '4200 Sunset Avenue', 'Los Angeles', 'CA', '90028', '(323) 555-0300', 'contact@sunset.org', 'Meditech', 'CA-HOSP-003'),
('44444444-4444-4444-4444-444444444444', 'Bay Area Medical Complex', '3600 Innovation Way', 'San Francisco', 'CA', '94107', '(415) 555-0400', 'help@baymed.org', 'Allscripts', 'CA-HOSP-004'),
('55555555-5555-5555-5555-555555555555', 'Texas Heart Institute', '7200 Medical Plaza', 'Houston', 'TX', '77030', '(713) 555-0500', 'info@texasheart.org', 'Epic', 'TX-HOSP-005');

-- Clear existing patient data
DELETE FROM public.patients;

-- Insert mock patients for Metropolitan General Hospital (Epic EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH001', 'John', 'Smith', '1975-03-15', 'male', '(555) 123-4567', 'john.smith@email.com', '123 Main St', 'New York', 'NY', '10001', 'O+', ARRAY['Penicillin'], ARRAY['Hypertension', 'Diabetes Type 2'], '2024-01-20 08:30:00', 'active', 'ICU-101', 'A'),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH002', 'Sarah', 'Johnson', '1988-07-22', 'female', '(555) 234-5678', 'sarah.johnson@email.com', '456 Oak Ave', 'New York', 'NY', '10002', 'A-', ARRAY['Shellfish'], ARRAY['Asthma'], '2024-01-19 14:15:00', 'active', 'WARD-205', 'B'),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH003', 'Michael', 'Davis', '1965-11-08', 'male', '(555) 345-6789', 'michael.davis@email.com', '789 Pine St', 'New York', 'NY', '10003', 'B+', ARRAY['Latex'], ARRAY['COPD', 'Coronary Artery Disease'], '2024-01-18 10:00:00', 'active', 'ICU-102', 'A'),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH004', 'Emily', 'Wilson', '1992-05-30', 'female', '(555) 456-7890', 'emily.wilson@email.com', '321 Elm St', 'New York', 'NY', '10004', 'AB+', ARRAY[]::text[], ARRAY['Pregnancy - 32 weeks'], '2024-01-21 16:45:00', 'active', 'WARD-102', 'C');

-- Insert mock patients for Riverside Medical Center (Cerner EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC001', 'Robert', 'Brown', '1952-12-10', 'male', '(312) 555-1234', 'robert.brown@email.com', '100 Lake Shore Dr', 'Chicago', 'IL', '60601', 'O-', ARRAY['Aspirin'], ARRAY['Stroke', 'Atrial Fibrillation'], '2024-01-22 09:15:00', 'active', 'NEURO-301', 'A'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC002', 'Maria', 'Garcia', '1978-04-18', 'female', '(312) 555-2345', 'maria.garcia@email.com', '200 Michigan Ave', 'Chicago', 'IL', '60602', 'A+', ARRAY['Sulfa'], ARRAY['Lupus', 'Kidney Disease'], '2024-01-21 11:30:00', 'active', 'WARD-210', 'B'),
('a2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC003', 'James', 'Taylor', '1985-09-25', 'male', '(312) 555-3456', 'james.taylor@email.com', '300 State St', 'Chicago', 'IL', '60603', 'B-', ARRAY[]::text[], ARRAY['Motorcycle Accident - Multiple Trauma'], '2024-01-23 02:45:00', 'active', 'TRAUMA-401', 'A'),
('a2222224-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC004', 'Lisa', 'Anderson', '1990-01-12', 'female', '(312) 555-4567', 'lisa.anderson@email.com', '400 Wacker Dr', 'Chicago', 'IL', '60604', 'AB-', ARRAY['Peanuts'], ARRAY['Bipolar Disorder'], '2024-01-20 15:20:00', 'active', 'PSYCH-501', 'C');

-- Insert mock patients for Sunset Community Hospital (Meditech EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH001', 'David', 'Martinez', '1968-06-14', 'male', '(323) 555-5678', 'david.martinez@email.com', '500 Sunset Blvd', 'Los Angeles', 'CA', '90028', 'O+', ARRAY['Morphine'], ARRAY['Pancreatic Cancer', 'Chronic Pain'], '2024-01-19 13:00:00', 'active', 'ONCO-201', 'A'),
('a3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH002', 'Jennifer', 'Lee', '1995-11-03', 'female', '(323) 555-6789', 'jennifer.lee@email.com', '600 Hollywood Blvd', 'Los Angeles', 'CA', '90029', 'A-', ARRAY[]::text[], ARRAY['Anorexia Nervosa'], '2024-01-22 10:30:00', 'active', 'PSYCH-301', 'B'),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH003', 'Carlos', 'Rodriguez', '1980-02-28', 'male', '(323) 555-7890', 'carlos.rodriguez@email.com', '700 Vine St', 'Los Angeles', 'CA', '90030', 'B+', ARRAY['Iodine'], ARRAY['Thyroid Cancer'], '2024-01-21 08:45:00', 'active', 'SURG-401', 'A'),
('a3333334-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH004', 'Amanda', 'Kim', '1987-08-17', 'female', '(323) 555-8901', 'amanda.kim@email.com', '800 Melrose Ave', 'Los Angeles', 'CA', '90031', 'AB+', ARRAY['Eggs'], ARRAY['Severe Burns - 40% TBSA'], '2024-01-23 06:15:00', 'active', 'BURN-501', 'A');

-- Insert mock patients for Bay Area Medical Complex (Allscripts EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM001', 'Kevin', 'Chen', '1972-10-05', 'male', '(415) 555-9012', 'kevin.chen@email.com', '900 Market St', 'San Francisco', 'CA', '94107', 'O-', ARRAY['Contrast Dye'], ARRAY['Acute MI', 'Heart Failure'], '2024-01-20 12:00:00', 'active', 'CATH-101', 'A'),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM002', 'Rachel', 'Thompson', '1983-03-22', 'female', '(415) 555-0123', 'rachel.thompson@email.com', '1000 Van Ness Ave', 'San Francisco', 'CA', '94108', 'A+', ARRAY['Codeine'], ARRAY['Pneumonia', 'Sepsis'], '2024-01-22 16:30:00', 'active', 'ICU-201', 'B'),
('a4444443-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM003', 'Tyler', 'White', '1993-12-08', 'male', '(415) 555-1234', 'tyler.white@email.com', '1100 Folsom St', 'San Francisco', 'CA', '94109', 'B-', ARRAY[]::text[], ARRAY['Schizophrenia'], '2024-01-19 20:45:00', 'active', 'PSYCH-301', 'C'),
('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM004', 'Sophia', 'Davis', '1989-07-11', 'female', '(415) 555-2345', 'sophia.davis@email.com', '1200 Mission St', 'San Francisco', 'CA', '94110', 'AB-', ARRAY['Shellfish'], ARRAY['Preeclampsia', 'Pregnancy - 38 weeks'], '2024-01-21 14:00:00', 'active', 'L&D-401', 'A');

-- Insert mock patients for Texas Heart Institute (Epic EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI001', 'William', 'Johnson', '1945-05-20', 'male', '(713) 555-3456', 'william.johnson@email.com', '1300 Main St', 'Houston', 'TX', '77030', 'O+', ARRAY['Warfarin'], ARRAY['Triple Vessel CAD', 'Diabetes'], '2024-01-18 07:30:00', 'active', 'CVICU-101', 'A'),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI002', 'Patricia', 'Miller', '1962-09-14', 'female', '(713) 555-4567', 'patricia.miller@email.com', '1400 Texas Ave', 'Houston', 'TX', '77031', 'A-', ARRAY['ACE Inhibitors'], ARRAY['Mitral Valve Stenosis'], '2024-01-20 09:15:00', 'active', 'CVICU-102', 'B'),
('a5555553-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI003', 'Richard', 'Wilson', '1958-01-07', 'male', '(713) 555-5678', 'richard.wilson@email.com', '1500 Fannin St', 'Houston', 'TX', '77032', 'B+', ARRAY[]::text[], ARRAY['Aortic Aneurysm', 'Hypertension'], '2024-01-21 11:45:00', 'active', 'VASCULAR-301', 'A'),
('a5555554-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI004', 'Barbara', 'Moore', '1970-04-30', 'female', '(713) 555-6789', 'barbara.moore@email.com', '1600 Holcombe Blvd', 'Houston', 'TX', '77033', 'AB+', ARRAY['Beta Blockers'], ARRAY['Cardiomyopathy', 'Heart Failure'], '2024-01-22 13:20:00', 'active', 'CVICU-103', 'C');

-- Insert mock vital signs for all patients
INSERT INTO public.vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, recorded_at)
SELECT 
  p.id,
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[98.6, 99.2, 97.8, 98.4])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[100.1, 99.8, 101.2, 98.9])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[99.5, 98.2, 100.8, 99.1])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[97.9, 100.4, 98.7, 99.3])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[98.8, 99.6, 97.5, 98.1])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[140, 135, 110, 125])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[160, 145, 180, 130])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[120, 125, 155, 170])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[185, 140, 115, 145])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[175, 165, 150, 135])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[85, 80, 70, 78])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[95, 88, 100, 82])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[75, 80, 92, 105])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[110, 85, 72, 90])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[102, 98, 88, 85])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' Then (ARRAY[88, 72, 95, 78])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[110, 92, 125, 85])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[65, 88, 102, 115])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[130, 78, 68, 95])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[120, 105, 88, 82])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[18, 16, 20, 16])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[24, 18, 28, 16])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[14, 16, 20, 22])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[26, 16, 14, 18])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[22, 20, 18, 16])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[96, 98, 92, 97])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[88, 94, 85, 96])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[99, 97, 95, 91])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[82, 93, 98, 90])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[86, 89, 92, 94])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  NOW() - INTERVAL '1 hour'
FROM public.patients p;

-- Insert mock lab orders
INSERT INTO public.lab_orders (patient_id, ordered_by, test_name, test_code, priority, status, ordered_at, results)
SELECT 
  p.id,
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Complete Blood Count', 'Basic Metabolic Panel', 'Lipid Panel', 'HbA1c'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Stroke Panel', 'PT/INR', 'Troponin', 'Psychiatric Panel'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Tumor Markers', 'Comprehensive Panel', 'Thyroid Function', 'Burn Panel'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Cardiac Enzymes', 'Blood Cultures', 'Liver Function', 'Pregnancy Test'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Cardiac Cath Labs', 'Echo Markers', 'Vascular Studies', 'Heart Failure Panel'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['CBC', 'BMP', 'LIPID', 'HBA1C'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['STROKE', 'PTINR', 'TROP', 'PSYCH'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['TUMOR', 'CMP', 'TSH', 'BURN'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['CARDIAC', 'CULTURE', 'LFT', 'PREG'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['CATH', 'ECHO', 'VASC', 'HF'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['routine', 'urgent', 'routine', 'routine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['stat', 'urgent', 'stat', 'routine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['urgent', 'routine', 'routine', 'stat'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['stat', 'urgent', 'routine', 'urgent'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['urgent', 'routine', 'routine', 'urgent'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['completed', 'processing', 'ordered', 'completed'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['completed', 'completed', 'processing', 'ordered'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['processing', 'completed', 'completed', 'processing'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['completed', 'processing', 'completed', 'completed'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['processing', 'completed', 'completed', 'processing'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  NOW() - INTERVAL '6 hours',
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN 
      CASE ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)
        WHEN 1 THEN '{"WBC": "7.2", "RBC": "4.5", "Hemoglobin": "14.2", "Hematocrit": "42.1"}'::jsonb
        WHEN 4 THEN '{"HbA1c": "8.2", "Glucose": "180"}'::jsonb
        ELSE NULL
      END
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN 
      CASE ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)
        WHEN 1 THEN '{"D-Dimer": "2.8", "Fibrinogen": "450"}'::jsonb
        WHEN 2 THEN '{"PT": "18.2", "INR": "2.1"}'::jsonb
        ELSE NULL
      END
    ELSE NULL
  END
FROM public.patients p;

-- Insert mock radiology orders
INSERT INTO public.radiology_orders (patient_id, ordered_by, study_type, body_part, modality, priority, status, clinical_indication, ordered_at)
SELECT 
  p.id,
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Chest X-Ray', 'CT Abdomen', 'MRI Brain', 'Echo'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['CT Head', 'MRI Brain', 'CT Chest', 'MRI Spine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['CT Abdomen', 'PET Scan', 'CT Neck', 'MRI Abdomen'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Cardiac Cath', 'Chest X-Ray', 'CT Head', 'Ultrasound'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Cardiac Cath', 'Echo', 'CT Angio', 'Nuclear Stress'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Chest', 'Abdomen', 'Head', 'Heart'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Head', 'Head', 'Chest', 'Spine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Abdomen', 'Whole Body', 'Neck', 'Abdomen'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Heart', 'Chest', 'Head', 'Abdomen'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Heart', 'Heart', 'Vessels', 'Heart'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['X-Ray', 'CT', 'MRI', 'Ultrasound'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['CT', 'MRI', 'CT', 'MRI'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['CT', 'PET', 'CT', 'MRI'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Cath', 'X-Ray', 'CT', 'Ultrasound'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Cath', 'Ultrasound', 'CT', 'Nuclear'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['routine', 'urgent', 'routine', 'urgent'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['stat', 'urgent', 'urgent', 'routine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['urgent', 'routine', 'urgent', 'routine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['stat', 'routine', 'urgent', 'urgent'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['urgent', 'routine', 'urgent', 'routine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['completed', 'scheduled', 'ordered', 'completed'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['completed', 'completed', 'scheduled', 'ordered'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['scheduled', 'completed', 'completed', 'scheduled'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['completed', 'completed', 'scheduled', 'completed'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['scheduled', 'completed', 'completed', 'scheduled'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Rule out pneumonia', 'Abdominal pain evaluation', 'Headache workup', 'Cardiac function assessment'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Acute stroke evaluation', 'Brain lesion assessment', 'Trauma evaluation', 'Back pain workup'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Pancreatic mass evaluation', 'Cancer staging', 'Thyroid nodule assessment', 'Burn depth evaluation'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Acute MI evaluation', 'Pneumonia assessment', 'Psychiatric evaluation', 'Pregnancy monitoring'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Cardiac catheterization', 'Heart function assessment', 'Vascular evaluation', 'Stress testing'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  NOW() - INTERVAL '4 hours'
FROM public.patients p;

-- Insert mock medications
INSERT INTO public.medications (patient_id, prescribed_by, medication_name, generic_name, dosage, frequency, route, start_date, status, indication)
SELECT 
  p.id,
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Lisinopril', 'Metformin', 'Albuterol', 'Folic Acid'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Warfarin', 'Prednisone', 'Morphine', 'Risperidone'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Oxycodone', 'Ondansetron', 'Levothyroxine', 'Silver Sulfadiazine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Aspirin', 'Vancomycin', 'Haloperidol', 'Prenatal Vitamins'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Metoprolol', 'Furosemide', 'Nitroglycerin', 'Digoxin'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['lisinopril', 'metformin', 'albuterol', 'folic acid'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['warfarin', 'prednisone', 'morphine', 'risperidone'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['oxycodone', 'ondansetron', 'levothyroxine', 'silver sulfadiazine'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['aspirin', 'vancomycin', 'haloperidol', 'prenatal vitamins'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['metoprolol', 'furosemide', 'nitroglycerin', 'digoxin'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['10mg', '500mg', '90mcg', '1mg'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['5mg', '20mg', '2mg', '2mg'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['5mg', '4mg', '50mcg', '1%'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['81mg', '1g', '5mg', '1 tablet'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['50mg', '40mg', '0.4mg', '0.25mg'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Once daily', 'Twice daily', 'As needed', 'Once daily'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Once daily', 'Twice daily', 'Every 4 hours', 'Twice daily'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Every 6 hours', 'Every 8 hours', 'Once daily', 'Twice daily'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Once daily', 'Every 8 hours', 'As needed', 'Once daily'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Twice daily', 'Once daily', 'As needed', 'Once daily'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Oral', 'Oral', 'Inhaled', 'Oral'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Oral', 'Oral', 'IV', 'Oral'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Oral', 'IV', 'Oral', 'Topical'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Oral', 'IV', 'Oral', 'Oral'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Oral', 'Oral', 'Sublingual', 'Oral'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CURRENT_DATE - INTERVAL '1 day',
  'active',
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Hypertension', 'Diabetes Type 2', 'Asthma', 'Pregnancy support'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Atrial Fibrillation', 'Lupus', 'Pain management', 'Bipolar Disorder'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Chronic Pain', 'Nausea', 'Hypothyroidism', 'Burn treatment'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Cardiac protection', 'Sepsis', 'Schizophrenia', 'Pregnancy support'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Heart Failure', 'Heart Failure', 'Chest pain', 'Heart Failure'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END
FROM public.patients p;

-- Insert mock AI insights
INSERT INTO public.ai_insights (patient_id, hospital_id, insight_type, severity, title, description, recommendations, confidence_score, status) 
SELECT 
  p.id,
  p.hospital_id,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['risk_assessment', 'drug_interaction', 'diagnosis_suggestion', 'clinical_alert'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['critical_alert', 'medication_review', 'fall_risk', 'discharge_planning'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['pain_management', 'nutrition_alert', 'treatment_response', 'complication_risk'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['cardiac_event', 'infection_risk', 'psychiatric_alert', 'maternal_fetal'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['cardiac_risk', 'fluid_management', 'arrhythmia_alert', 'heart_failure'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['medium', 'high', 'low', 'medium'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['high', 'medium', 'high', 'low'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['high', 'medium', 'medium', 'high'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['high', 'high', 'medium', 'medium'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['high', 'medium', 'high', 'high'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Elevated Blood Pressure Trend', 'Potential Drug Interaction Alert', 'Consider Pulmonary Function Test', 'Prenatal Care Monitoring'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Stroke Risk Elevation', 'Immunosuppression Monitoring', 'High Fall Risk Patient', 'Psychiatric Discharge Planning'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Pain Management Optimization', 'Nutritional Deficiency Risk', 'Treatment Response Assessment', 'Infection Complication Risk'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Acute Cardiac Event Risk', 'Sepsis Progression Alert', 'Psychiatric Medication Review', 'Maternal-Fetal Monitoring'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Cardiac Decompensation Risk', 'Fluid Overload Alert', 'Arrhythmia Detection', 'Heart Failure Exacerbation'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY['Patient shows consistent elevation in systolic BP over last 24 hours', 'New medication may interact with existing diabetes medication', 'Patient history and symptoms suggest possible pulmonary function decline', 'Routine prenatal monitoring shows normal progression'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY['Neurological assessment indicates increased stroke risk', 'Steroid therapy requires careful monitoring', 'Multiple risk factors present for falls', 'Complex psychiatric needs require specialized discharge planning'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY['Current pain management may be suboptimal', 'Decreased oral intake and weight loss noted', 'Thyroid hormone replacement appears effective', 'Burn healing slower than expected with infection risk'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY['Elevated cardiac enzymes and ECG changes', 'Rising inflammatory markers despite antibiotics', 'Medication adherence and dosing concerns', 'Blood pressure elevation requires monitoring'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY['Ejection fraction declining with fluid retention', 'Worsening edema and fluid balance issues', 'Irregular heart rhythm patterns detected', 'Signs of acute heart failure exacerbation'])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[ARRAY['Consider medication adjustment', 'Monitor every 4 hours'], ARRAY['Consult pharmacist', 'Monitor blood glucose closely'], ARRAY['Schedule PFT', 'Respiratory therapy consult'], ARRAY['Continue routine monitoring', 'Schedule follow-up']])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[ARRAY['Neurology consult', 'Implement stroke precautions'], ARRAY['Monitor CBC daily', 'Infection precautions'], ARRAY['Implement fall precautions', 'PT/OT evaluation'], ARRAY['Social work consult', 'Psychiatric follow-up']])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[ARRAY['Pain management consult', 'Consider multimodal approach'], ARRAY['Nutrition consult', 'Supplement recommendations'], ARRAY['Continue current therapy', 'Monitor TSH levels'], ARRAY['Wound care consult', 'Antibiotic review']])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[ARRAY['Cardiology consult', 'Serial enzyme monitoring'], ARRAY['Infectious disease consult', 'Broaden antibiotic coverage'], ARRAY['Psychiatry consult', 'Medication review'], ARRAY['Obstetrics consult', 'Blood pressure monitoring']])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[ARRAY['Cardiology consult', 'Optimize heart failure medications'], ARRAY['Restrict fluids', 'Daily weights'], ARRAY['Cardiology consult', 'Rhythm monitoring'], ARRAY['Diuretic adjustment', 'Close monitoring']])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  CASE 
    WHEN p.hospital_id = '11111111-1111-1111-1111-111111111111' THEN (ARRAY[0.85, 0.92, 0.67, 0.78])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '22222222-2222-2222-2222-222222222222' THEN (ARRAY[0.91, 0.83, 0.88, 0.72])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '33333333-3333-3333-3333-333333333333' THEN (ARRAY[0.79, 0.86, 0.81, 0.89])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    WHEN p.hospital_id = '44444444-4444-4444-4444-444444444444' THEN (ARRAY[0.94, 0.87, 0.76, 0.82])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
    ELSE (ARRAY[0.90, 0.84, 0.92, 0.88])[ROW_NUMBER() OVER (PARTITION BY p.hospital_id ORDER BY p.id)]
  END,
  'active'
FROM public.patients p;
