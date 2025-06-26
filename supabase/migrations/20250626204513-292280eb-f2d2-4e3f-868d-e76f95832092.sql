
-- Clear all dependent data first to avoid foreign key constraint violations
DELETE FROM public.vital_signs;
DELETE FROM public.ai_insights;
DELETE FROM public.cms_quality_measures;
DELETE FROM public.lab_orders;
DELETE FROM public.radiology_orders;
DELETE FROM public.medications;
DELETE FROM public.medical_records;
DELETE FROM public.billing_charges;
DELETE FROM public.audit_log;

-- Now clear patients and hospitals
DELETE FROM public.patients;
DELETE FROM public.hospitals;

-- Insert comprehensive hospital data with different EMR systems
INSERT INTO public.hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number) VALUES
('11111111-1111-1111-1111-111111111111', 'Metropolitan General Hospital', '1500 Medical Center Drive', 'New York', 'NY', '10001', '(212) 555-0100', 'admin@metrogen.org', 'Epic', 'NY-HOSP-001'),
('22222222-2222-2222-2222-222222222222', 'Riverside Medical Center', '2800 Riverside Boulevard', 'Chicago', 'IL', '60601', '(312) 555-0200', 'info@riverside.org', 'Cerner', 'IL-HOSP-002'),
('33333333-3333-3333-3333-333333333333', 'Sunset Community Hospital', '4200 Sunset Avenue', 'Los Angeles', 'CA', '90028', '(323) 555-0300', 'contact@sunset.org', 'Meditech', 'CA-HOSP-003'),
('44444444-4444-4444-4444-444444444444', 'Bay Area Medical Complex', '3600 Innovation Way', 'San Francisco', 'CA', '94107', '(415) 555-0400', 'help@baymed.org', 'Allscripts', 'CA-HOSP-004'),
('55555555-5555-5555-5555-555555555555', 'Texas Heart Institute', '7200 Medical Plaza', 'Houston', 'TX', '77030', '(713) 555-0500', 'info@texasheart.org', 'Epic', 'TX-HOSP-005'),
('66666666-6666-6666-6666-666666666666', 'Denver Health Medical Center', '777 Bannock Street', 'Denver', 'CO', '80204', '(303) 555-0600', 'contact@denverhealth.org', 'FHIR API', 'CO-HOSP-006'),
('77777777-7777-7777-7777-777777777777', 'Miami General Hospital', '1611 NW 12th Avenue', 'Miami', 'FL', '33136', '(305) 555-0700', 'info@miamigeneral.org', 'Cerner', 'FL-HOSP-007'),
('88888888-8888-8888-8888-888888888888', 'Seattle Medical Center', '1959 NE Pacific Street', 'Seattle', 'WA', '98195', '(206) 555-0800', 'admin@seattlemedical.org', 'Epic', 'WA-HOSP-008');

-- Insert comprehensive patient data for Metropolitan General Hospital (Epic EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH001', 'John', 'Smith', '1975-03-15', 'male', '(555) 123-4567', 'john.smith@email.com', '123 Main St', 'New York', 'NY', '10001', 'O+', ARRAY['Penicillin'], ARRAY['Hypertension', 'Diabetes Type 2'], '2024-01-20 08:30:00', 'active', 'ICU-101', 'A'),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH002', 'Sarah', 'Johnson', '1988-07-22', 'female', '(555) 234-5678', 'sarah.johnson@email.com', '456 Oak Ave', 'New York', 'NY', '10002', 'A-', ARRAY['Shellfish'], ARRAY['Asthma'], '2024-01-19 14:15:00', 'active', 'WARD-205', 'B'),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH003', 'Michael', 'Davis', '1965-11-08', 'male', '(555) 345-6789', 'michael.davis@email.com', '789 Pine St', 'New York', 'NY', '10003', 'B+', ARRAY['Latex'], ARRAY['COPD', 'Coronary Artery Disease'], '2024-01-18 10:00:00', 'active', 'ICU-102', 'A'),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH004', 'Emily', 'Wilson', '1992-05-30', 'female', '(555) 456-7890', 'emily.wilson@email.com', '321 Elm St', 'New York', 'NY', '10004', 'AB+', ARRAY[]::text[], ARRAY['Pregnancy - 32 weeks'], '2024-01-21 16:45:00', 'active', 'WARD-102', 'C'),
('a1111115-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MGH005', 'Robert', 'Miller', '1980-12-03', 'male', '(555) 567-8901', 'robert.miller@email.com', '654 Broadway', 'New York', 'NY', '10005', 'O-', ARRAY['Sulfa'], ARRAY['Pneumonia'], '2024-01-22 09:20:00', 'active', 'WARD-301', 'A');

-- Insert patients for Riverside Medical Center (Cerner EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC001', 'Lisa', 'Brown', '1952-12-10', 'female', '(312) 555-1234', 'lisa.brown@email.com', '100 Lake Shore Dr', 'Chicago', 'IL', '60601', 'O-', ARRAY['Aspirin'], ARRAY['Stroke', 'Atrial Fibrillation'], '2024-01-22 09:15:00', 'active', 'NEURO-301', 'A'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC002', 'Maria', 'Garcia', '1978-04-18', 'female', '(312) 555-2345', 'maria.garcia@email.com', '200 Michigan Ave', 'Chicago', 'IL', '60602', 'A+', ARRAY['Sulfa'], ARRAY['Lupus', 'Kidney Disease'], '2024-01-21 11:30:00', 'active', 'WARD-210', 'B'),
('a2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC003', 'James', 'Taylor', '1985-09-25', 'male', '(312) 555-3456', 'james.taylor@email.com', '300 State St', 'Chicago', 'IL', '60603', 'B-', ARRAY[]::text[], ARRAY['Motorcycle Accident - Multiple Trauma'], '2024-01-23 02:45:00', 'active', 'TRAUMA-401', 'A'),
('a2222224-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'RMC004', 'Jennifer', 'Anderson', '1990-01-12', 'female', '(312) 555-4567', 'jennifer.anderson@email.com', '400 Wacker Dr', 'Chicago', 'IL', '60604', 'AB-', ARRAY['Peanuts'], ARRAY['Bipolar Disorder'], '2024-01-20 15:20:00', 'active', 'PSYCH-501', 'C');

-- Insert patients for Sunset Community Hospital (Meditech EMR)  
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH001', 'David', 'Martinez', '1968-06-14', 'male', '(323) 555-5678', 'david.martinez@email.com', '500 Sunset Blvd', 'Los Angeles', 'CA', '90028', 'O+', ARRAY['Morphine'], ARRAY['Pancreatic Cancer', 'Chronic Pain'], '2024-01-19 13:00:00', 'active', 'ONCO-201', 'A'),
('a3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH002', 'Jessica', 'Lee', '1995-11-03', 'female', '(323) 555-6789', 'jessica.lee@email.com', '600 Hollywood Blvd', 'Los Angeles', 'CA', '90029', 'A-', ARRAY[]::text[], ARRAY['Anorexia Nervosa'], '2024-01-22 10:30:00', 'active', 'PSYCH-301', 'B'),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH003', 'Carlos', 'Rodriguez', '1980-02-28', 'male', '(323) 555-7890', 'carlos.rodriguez@email.com', '700 Vine St', 'Los Angeles', 'CA', '90030', 'B+', ARRAY['Iodine'], ARRAY['Thyroid Cancer'], '2024-01-21 08:45:00', 'active', 'SURG-401', 'A'),
('a3333334-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SCH004', 'Amanda', 'Kim', '1987-08-17', 'female', '(323) 555-8901', 'amanda.kim@email.com', '800 Melrose Ave', 'Los Angeles', 'CA', '90031', 'AB+', ARRAY['Eggs'], ARRAY['Severe Burns - 40% TBSA'], '2024-01-23 06:15:00', 'active', 'BURN-501', 'A');

-- Insert patients for Bay Area Medical Complex (Allscripts EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM001', 'Kevin', 'Chen', '1972-10-05', 'male', '(415) 555-9012', 'kevin.chen@email.com', '900 Market St', 'San Francisco', 'CA', '94107', 'O-', ARRAY['Contrast Dye'], ARRAY['Acute MI', 'Heart Failure'], '2024-01-20 12:00:00', 'active', 'CATH-101', 'A'),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM002', 'Rachel', 'Thompson', '1983-03-22', 'female', '(415) 555-0123', 'rachel.thompson@email.com', '1000 Van Ness Ave', 'San Francisco', 'CA', '94108', 'A+', ARRAY['Codeine'], ARRAY['Pneumonia', 'Sepsis'], '2024-01-22 16:30:00', 'active', 'ICU-201', 'B'),
('a4444443-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'BAM003', 'Tyler', 'White', '1993-12-08', 'male', '(415) 555-1234', 'tyler.white@email.com', '1100 Folsom St', 'San Francisco', 'CA', '94109', 'B-', ARRAY[]::text[], ARRAY['Schizophrenia'], '2024-01-19 20:45:00', 'active', 'PSYCH-301', 'C');

-- Insert patients for Texas Heart Institute (Epic EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI001', 'William', 'Johnson', '1945-05-20', 'male', '(713) 555-3456', 'william.johnson@email.com', '1300 Main St', 'Houston', 'TX', '77030', 'O+', ARRAY['Warfarin'], ARRAY['Triple Vessel CAD', 'Diabetes'], '2024-01-18 07:30:00', 'active', 'CVICU-101', 'A'),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI002', 'Patricia', 'Miller', '1962-09-14', 'female', '(713) 555-4567', 'patricia.miller@email.com', '1400 Texas Ave', 'Houston', 'TX', '77031', 'A-', ARRAY['ACE Inhibitors'], ARRAY['Mitral Valve Stenosis'], '2024-01-20 09:15:00', 'active', 'CVICU-102', 'B'),
('a5555553-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'THI003', 'Richard', 'Wilson', '1958-01-07', 'male', '(713) 555-5678', 'richard.wilson@email.com', '1500 Fannin St', 'Houston', 'TX', '77032', 'B+', ARRAY[]::text[], ARRAY['Aortic Aneurysm', 'Hypertension'], '2024-01-21 11:45:00', 'active', 'VASCULAR-301', 'A');

-- Insert patients for Denver Health Medical Center (FHIR API)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'DHM001', 'Michelle', 'Adams', '1981-03-25', 'female', '(303) 555-9876', 'michelle.adams@email.com', '1414 17th Street', 'Denver', 'CO', '80202', 'A+', ARRAY['Latex'], ARRAY['Severe Asthma', 'Allergic Rhinitis'], '2024-01-21 14:20:00', 'active', 'PULM-201', 'A'),
('a6666662-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'DHM002', 'Christopher', 'Lopez', '1976-07-11', 'male', '(303) 555-8765', 'christopher.lopez@email.com', '1515 Cleveland Place', 'Denver', 'CO', '80202', 'O-', ARRAY['NSAIDs'], ARRAY['Chronic Kidney Disease', 'Hypertension'], '2024-01-20 11:15:00', 'active', 'NEPHRO-301', 'B');

-- Insert patients for Miami General Hospital (Cerner EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a7777771-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'MGH001', 'Isabella', 'Rodriguez', '1989-12-18', 'female', '(305) 555-2468', 'isabella.rodriguez@email.com', '2020 Biscayne Blvd', 'Miami', 'FL', '33137', 'B+', ARRAY['Penicillin'], ARRAY['Postpartum Hemorrhage'], '2024-01-22 18:30:00', 'active', 'L&D-401', 'A'),
('a7777772-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'MGH002', 'Antonio', 'Gonzalez', '1954-06-09', 'male', '(305) 555-1357', 'antonio.gonzalez@email.com', '2121 NW 7th Street', 'Miami', 'FL', '33125', 'AB-', ARRAY['Shellfish'], ARRAY['Diabetic Ketoacidosis', 'Type 1 Diabetes'], '2024-01-21 06:45:00', 'active', 'ICU-301', 'B');

-- Insert patients for Seattle Medical Center (Epic EMR)
INSERT INTO public.patients (id, hospital_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, blood_type, allergies, medical_conditions, admission_date, status, room_number, bed_number) VALUES
('a8888881-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'SMC001', 'Alexander', 'Zhang', '1991-04-14', 'male', '(206) 555-1122', 'alexander.zhang@email.com', '4333 Brooklyn Ave NE', 'Seattle', 'WA', '98105', 'A-', ARRAY['Vancomycin'], ARRAY['Osteomyelitis', 'MRSA Infection'], '2024-01-19 15:30:00', 'active', 'ORTHO-201', 'A'),
('a8888882-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'SMC002', 'Olivia', 'Peterson', '1977-11-28', 'female', '(206) 555-3344', 'olivia.peterson@email.com', '5454 Sand Point Way NE', 'Seattle', 'WA', '98105', 'O+', ARRAY['Morphine'], ARRAY['Fibromyalgia', 'Chronic Fatigue Syndrome'], '2024-01-23 12:15:00', 'active', 'RHEUM-301', 'B');

-- Add AI insights using only valid insight_type values: 'risk_assessment', 'drug_interaction', 'diagnosis_suggestion', 'treatment_recommendation', 'critical_alert'
INSERT INTO public.ai_insights (patient_id, hospital_id, insight_type, severity, title, description, recommendations, confidence_score, status) VALUES
-- Metropolitan General Hospital insights
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'risk_assessment', 'medium', 'Elevated Blood Pressure Trend', 'Patient shows consistent elevation in systolic BP over last 24 hours', ARRAY['Consider medication adjustment', 'Monitor every 4 hours'], 0.85, 'active'),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'drug_interaction', 'high', 'Potential Drug Interaction Alert', 'New medication may interact with existing diabetes medication', ARRAY['Consult pharmacist', 'Monitor blood glucose closely'], 0.92, 'active'),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'diagnosis_suggestion', 'low', 'Consider Pulmonary Function Test', 'Patient history and symptoms suggest possible pulmonary function decline', ARRAY['Schedule PFT', 'Respiratory therapy consult'], 0.67, 'active'),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'treatment_recommendation', 'medium', 'Prenatal Care Monitoring', 'Routine prenatal monitoring shows normal progression', ARRAY['Continue routine monitoring', 'Schedule follow-up'], 0.78, 'active'),
('a1111115-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'critical_alert', 'high', 'Antibiotic Resistance Risk', 'Rising antibiotic resistance markers detected', ARRAY['Culture and sensitivity testing', 'Infectious disease consult'], 0.88, 'active'),

-- Riverside Medical Center insights
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'critical_alert', 'high', 'Stroke Risk Elevation', 'Neurological assessment indicates increased stroke risk', ARRAY['Neurology consult', 'Implement stroke precautions'], 0.91, 'active'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'treatment_recommendation', 'medium', 'Immunosuppression Monitoring', 'Steroid therapy requires careful monitoring', ARRAY['Monitor CBC daily', 'Infection precautions'], 0.83, 'active'),
('a2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'risk_assessment', 'high', 'High Fall Risk Patient', 'Multiple risk factors present for falls', ARRAY['Implement fall precautions', 'PT/OT evaluation'], 0.88, 'active'),
('a2222224-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'treatment_recommendation', 'low', 'Psychiatric Discharge Planning', 'Complex psychiatric needs require specialized discharge planning', ARRAY['Social work consult', 'Psychiatric follow-up'], 0.72, 'active'),

-- Additional insights for other hospitals
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'treatment_recommendation', 'high', 'Pain Management Optimization', 'Current pain management may be suboptimal', ARRAY['Pain management consult', 'Consider multimodal approach'], 0.79, 'active'),
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'critical_alert', 'high', 'Acute Cardiac Event Risk', 'Elevated cardiac enzymes and ECG changes', ARRAY['Cardiology consult', 'Serial enzyme monitoring'], 0.94, 'active'),
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'risk_assessment', 'high', 'Cardiac Decompensation Risk', 'Ejection fraction declining with fluid retention', ARRAY['Cardiology consult', 'Optimize heart failure medications'], 0.90, 'active'),
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'critical_alert', 'medium', 'Respiratory Distress Alert', 'Respiratory function declining despite treatment', ARRAY['Pulmonology consult', 'Bronchodilator optimization'], 0.84, 'active'),
('a7777771-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'critical_alert', 'high', 'Postpartum Complication Risk', 'Postpartum bleeding complications developing', ARRAY['OB/GYN consult', 'Blood transfusion consideration'], 0.89, 'active'),
('a8888881-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'critical_alert', 'high', 'MRSA Infection Control', 'MRSA infection showing resistance to standard treatment', ARRAY['Infectious disease consult', 'Alternative antibiotic therapy'], 0.92, 'active');

-- Add CMS quality measures
INSERT INTO public.cms_quality_measures (hospital_id, measure_id, measure_name, reporting_period, numerator, denominator, performance_rate, benchmark_rate, improvement_target, status) VALUES
('11111111-1111-1111-1111-111111111111', 'CMS-104', 'Anti-Depressant Medication Management', 'Q4 2024', 85, 100, 85.0, 75.0, 90.0, 'completed'),
('11111111-1111-1111-1111-111111111111', 'CMS-122', 'Diabetes: Hemoglobin A1c Poor Control', 'Q4 2024', 12, 50, 24.0, 35.0, 20.0, 'completed'),
('22222222-2222-2222-2222-222222222222', 'CMS-108', 'Venous Thromboembolism Prophylaxis', 'Q4 2024', 95, 100, 95.0, 85.0, 98.0, 'submitted'),
('22222222-2222-2222-2222-222222222222', 'CMS-188', 'National Healthcare Safety Network', 'Q4 2024', 8, 1000, 0.8, 2.5, 0.5, 'completed'),
('33333333-3333-3333-3333-333333333333', 'CMS-177', 'Hospice and Palliative Care', 'Q4 2024', 78, 90, 86.7, 80.0, 90.0, 'in_progress'),
('44444444-4444-4444-4444-444444444444', 'CMS-72', 'Antithrombotic Therapy By End of Hospital Day 2', 'Q4 2024', 92, 100, 92.0, 88.0, 95.0, 'completed'),
('55555555-5555-5555-5555-555555555555', 'CMS-107', 'Stroke Education', 'Q4 2024', 88, 95, 92.6, 85.0, 95.0, 'submitted');
