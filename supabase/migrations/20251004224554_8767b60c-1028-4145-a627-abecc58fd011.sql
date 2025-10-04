-- Seed 8 comprehensive demo patients with full EMR data (all constraints fixed)
DO $$
DECLARE
  hospital_uuid UUID;
  patient_ids UUID[];
  provider_uuid UUID;
BEGIN
  -- Get first hospital
  SELECT id INTO hospital_uuid FROM hospitals LIMIT 1;
  
  -- Get first provider
  SELECT id INTO provider_uuid FROM profiles WHERE role = 'physician' LIMIT 1;
  
  -- If no provider exists, use the first profile
  IF provider_uuid IS NULL THEN
    SELECT id INTO provider_uuid FROM profiles LIMIT 1;
  END IF;

  -- Insert 8 patients
  WITH inserted_patients AS (
    INSERT INTO patients (hospital_id, mrn, first_name, last_name, date_of_birth, gender, status, room_number, admission_date, blood_type, phone, email, emergency_contact_name, emergency_contact_phone)
    VALUES 
      (hospital_uuid, 'MRN001', 'John', 'Smith', '1965-03-15', 'male', 'active', '301-A', NOW() - INTERVAL '2 days', 'O+', '555-0101', 'john.smith@email.com', 'Jane Smith', '555-0102'),
      (hospital_uuid, 'MRN002', 'Maria', 'Garcia', '1978-07-22', 'female', 'active', '302-B', NOW() - INTERVAL '1 day', 'A+', '555-0103', 'maria.garcia@email.com', 'Carlos Garcia', '555-0104'),
      (hospital_uuid, 'MRN003', 'Robert', 'Johnson', '1952-11-08', 'male', 'active', '303-A', NOW() - INTERVAL '5 days', 'B+', '555-0105', 'robert.j@email.com', 'Linda Johnson', '555-0106'),
      (hospital_uuid, 'MRN004', 'Jennifer', 'Williams', '1985-04-30', 'female', 'active', '304-B', NOW() - INTERVAL '3 days', 'AB+', '555-0107', 'jen.williams@email.com', 'Michael Williams', '555-0108'),
      (hospital_uuid, 'MRN005', 'Michael', 'Brown', '1970-09-12', 'male', 'active', '305-A', NOW() - INTERVAL '1 day', 'O-', '555-0109', 'mbrown@email.com', 'Sarah Brown', '555-0110'),
      (hospital_uuid, 'MRN006', 'Patricia', 'Davis', '1988-06-25', 'female', 'active', '306-B', NOW() - INTERVAL '4 days', 'A-', '555-0111', 'pdavis@email.com', 'James Davis', '555-0112'),
      (hospital_uuid, 'MRN007', 'David', 'Martinez', '1960-12-03', 'male', 'active', '307-A', NOW() - INTERVAL '2 days', 'B-', '555-0113', 'dmartinez@email.com', 'Rosa Martinez', '555-0114'),
      (hospital_uuid, 'MRN008', 'Linda', 'Rodriguez', '1975-08-17', 'female', 'active', '308-B', NOW() - INTERVAL '3 days', 'AB-', '555-0115', 'lrodriguez@email.com', 'Jose Rodriguez', '555-0116')
    RETURNING id
  )
  SELECT array_agg(id) INTO patient_ids FROM inserted_patients;

  -- Insert vital signs for each patient
  INSERT INTO vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, pain_scale, recorded_at)
  SELECT 
    patient_ids[i],
    provider_uuid,
    97.0 + (random() * 2),
    110 + (random() * 30)::integer,
    70 + (random() * 20)::integer,
    60 + (random() * 40)::integer,
    12 + (random() * 8)::integer,
    94 + (random() * 6)::integer,
    (random() * 10)::integer,
    NOW() - (i || ' hours')::interval
  FROM generate_series(1, 8) i;

  -- Insert medications
  INSERT INTO medications (patient_id, prescribed_by, medication_name, dosage, frequency, route, status, start_date, indication)
  SELECT 
    patient_ids[i],
    provider_uuid,
    CASE i 
      WHEN 1 THEN 'Lisinopril'
      WHEN 2 THEN 'Metformin'
      WHEN 3 THEN 'Aspirin'
      WHEN 4 THEN 'Levothyroxine'
      WHEN 5 THEN 'Atorvastatin'
      WHEN 6 THEN 'Omeprazole'
      WHEN 7 THEN 'Amlodipine'
      WHEN 8 THEN 'Gabapentin'
    END,
    CASE i
      WHEN 1 THEN '10mg'
      WHEN 2 THEN '500mg'
      WHEN 3 THEN '81mg'
      WHEN 4 THEN '50mcg'
      WHEN 5 THEN '20mg'
      WHEN 6 THEN '20mg'
      WHEN 7 THEN '5mg'
      WHEN 8 THEN '300mg'
    END,
    'Daily',
    'Oral',
    'active',
    CURRENT_DATE - (i || ' days')::interval,
    CASE i
      WHEN 1 THEN 'Hypertension'
      WHEN 2 THEN 'Type 2 Diabetes'
      WHEN 3 THEN 'Cardiovascular prophylaxis'
      WHEN 4 THEN 'Hypothyroidism'
      WHEN 5 THEN 'Hyperlipidemia'
      WHEN 6 THEN 'GERD'
      WHEN 7 THEN 'Hypertension'
      WHEN 8 THEN 'Neuropathic pain'
    END
  FROM generate_series(1, 8) i;

  -- Insert problem list
  INSERT INTO problem_list (patient_id, problem_name, icd10_code, status, severity, onset_date)
  SELECT 
    patient_ids[i],
    CASE i
      WHEN 1 THEN 'Essential Hypertension'
      WHEN 2 THEN 'Type 2 Diabetes Mellitus'
      WHEN 3 THEN 'Coronary Artery Disease'
      WHEN 4 THEN 'Hypothyroidism'
      WHEN 5 THEN 'Hyperlipidemia'
      WHEN 6 THEN 'GERD'
      WHEN 7 THEN 'Chronic Kidney Disease'
      WHEN 8 THEN 'Peripheral Neuropathy'
    END,
    CASE i
      WHEN 1 THEN 'I10'
      WHEN 2 THEN 'E11.9'
      WHEN 3 THEN 'I25.10'
      WHEN 4 THEN 'E03.9'
      WHEN 5 THEN 'E78.5'
      WHEN 6 THEN 'K21.9'
      WHEN 7 THEN 'N18.3'
      WHEN 8 THEN 'G62.9'
    END,
    'active',
    CASE WHEN i <= 3 THEN 'severe' WHEN i <= 6 THEN 'moderate' ELSE 'mild' END,
    CURRENT_DATE - (i * 30 || ' days')::interval
  FROM generate_series(1, 8) i;

  -- Insert allergies
  INSERT INTO allergies_adverse_reactions (patient_id, allergen, reaction_type, severity, symptoms, status)
  SELECT 
    patient_ids[i],
    CASE i
      WHEN 1 THEN 'Penicillin'
      WHEN 2 THEN 'Sulfa drugs'
      WHEN 3 THEN 'Shellfish'
      WHEN 4 THEN 'Latex'
      WHEN 5 THEN 'Pollen'
      WHEN 6 THEN 'Aspirin'
      WHEN 7 THEN 'Iodine'
      WHEN 8 THEN 'Codeine'
    END,
    'Drug allergy',
    CASE WHEN i <= 2 THEN 'severe' WHEN i <= 5 THEN 'moderate' ELSE 'mild' END,
    CASE i
      WHEN 1 THEN 'Rash, hives'
      WHEN 2 THEN 'Rash, itching'
      WHEN 3 THEN 'Anaphylaxis'
      WHEN 4 THEN 'Contact dermatitis'
      WHEN 5 THEN 'Rhinitis, sneezing'
      WHEN 6 THEN 'GI upset'
      WHEN 7 THEN 'Rash'
      WHEN 8 THEN 'Nausea'
    END,
    'active'
  FROM generate_series(1, 8) i;

  -- Insert lab orders (fixed status values: ordered, in_progress, completed, cancelled)
  INSERT INTO lab_orders (patient_id, ordered_by, test_name, test_code, priority, status, ordered_at)
  SELECT 
    patient_ids[i],
    provider_uuid,
    CASE i
      WHEN 1 THEN 'Complete Blood Count'
      WHEN 2 THEN 'Basic Metabolic Panel'
      WHEN 3 THEN 'Lipid Panel'
      WHEN 4 THEN 'Thyroid Function Tests'
      WHEN 5 THEN 'Hemoglobin A1C'
      WHEN 6 THEN 'Liver Function Tests'
      WHEN 7 THEN 'Renal Function Panel'
      WHEN 8 THEN 'Urinalysis'
    END,
    CASE i
      WHEN 1 THEN 'CBC'
      WHEN 2 THEN 'BMP'
      WHEN 3 THEN 'LIPID'
      WHEN 4 THEN 'TSH'
      WHEN 5 THEN 'HBA1C'
      WHEN 6 THEN 'LFT'
      WHEN 7 THEN 'RFP'
      WHEN 8 THEN 'UA'
    END,
    CASE WHEN i <= 2 THEN 'stat' WHEN i <= 5 THEN 'urgent' ELSE 'routine' END,
    CASE WHEN i <= 4 THEN 'completed' ELSE 'ordered' END,
    NOW() - (i || ' hours')::interval
  FROM generate_series(1, 8) i;

  -- Insert radiology orders (fixed modality values: X-Ray, CT, MRI, Ultrasound, PET, Nuclear)
  INSERT INTO radiology_orders (patient_id, ordered_by, study_type, body_part, modality, priority, status, clinical_indication, ordered_at)
  SELECT 
    patient_ids[i],
    provider_uuid,
    CASE i
      WHEN 1 THEN 'Chest X-Ray'
      WHEN 2 THEN 'CT Abdomen/Pelvis'
      WHEN 3 THEN 'MRI Brain'
      WHEN 4 THEN 'Ultrasound Abdomen'
      WHEN 5 THEN 'CT Chest'
      WHEN 6 THEN 'X-Ray Spine'
      WHEN 7 THEN 'MRI Lumbar Spine'
      WHEN 8 THEN 'Ultrasound Carotid'
    END,
    CASE i
      WHEN 1 THEN 'Chest'
      WHEN 2 THEN 'Abdomen/Pelvis'
      WHEN 3 THEN 'Brain'
      WHEN 4 THEN 'Abdomen'
      WHEN 5 THEN 'Chest'
      WHEN 6 THEN 'Spine'
      WHEN 7 THEN 'Lumbar Spine'
      WHEN 8 THEN 'Carotid'
    END,
    CASE i
      WHEN 1 THEN 'X-Ray'
      WHEN 2 THEN 'CT'
      WHEN 3 THEN 'MRI'
      WHEN 4 THEN 'Ultrasound'
      WHEN 5 THEN 'CT'
      WHEN 6 THEN 'X-Ray'
      WHEN 7 THEN 'MRI'
      WHEN 8 THEN 'Ultrasound'
    END,
    CASE WHEN i <= 2 THEN 'stat' WHEN i <= 5 THEN 'urgent' ELSE 'routine' END,
    CASE WHEN i <= 3 THEN 'completed' ELSE 'scheduled' END,
    CASE i
      WHEN 1 THEN 'Shortness of breath'
      WHEN 2 THEN 'Abdominal pain'
      WHEN 3 THEN 'Headaches'
      WHEN 4 THEN 'RUQ pain'
      WHEN 5 THEN 'Chest pain'
      WHEN 6 THEN 'Back pain'
      WHEN 7 THEN 'Lumbar radiculopathy'
      WHEN 8 THEN 'Carotid stenosis evaluation'
    END,
    NOW() - (i || ' hours')::interval
  FROM generate_series(1, 8) i;

  -- Insert medical records with correct encounter_type
  INSERT INTO medical_records (patient_id, hospital_id, provider_id, encounter_type, chief_complaint, assessment, plan, visit_date)
  SELECT 
    patient_ids[i],
    hospital_uuid,
    provider_uuid,
    CASE WHEN i <= 3 THEN 'inpatient' WHEN i <= 6 THEN 'emergency' ELSE 'outpatient' END,
    CASE i
      WHEN 1 THEN 'Chest pain and shortness of breath'
      WHEN 2 THEN 'Uncontrolled diabetes'
      WHEN 3 THEN 'Acute chest pain'
      WHEN 4 THEN 'Thyroid management'
      WHEN 5 THEN 'Hyperlipidemia follow-up'
      WHEN 6 THEN 'GERD symptoms'
      WHEN 7 THEN 'CKD monitoring'
      WHEN 8 THEN 'Neuropathy evaluation'
    END,
    CASE i
      WHEN 1 THEN 'Acute coronary syndrome, stable'
      WHEN 2 THEN 'Type 2 DM with hyperglycemia'
      WHEN 3 THEN 'CAD, stable angina'
      WHEN 4 THEN 'Hypothyroidism, controlled'
      WHEN 5 THEN 'Hyperlipidemia'
      WHEN 6 THEN 'GERD'
      WHEN 7 THEN 'CKD Stage 3'
      WHEN 8 THEN 'Peripheral neuropathy'
    END,
    CASE i
      WHEN 1 THEN 'Continue current medications, monitor cardiac markers'
      WHEN 2 THEN 'Adjust insulin regimen, diet counseling'
      WHEN 3 THEN 'Cardiac cath scheduled, continue antiplatelet therapy'
      WHEN 4 THEN 'Continue levothyroxine, repeat TSH in 6 weeks'
      WHEN 5 THEN 'Continue statin, lifestyle modifications'
      WHEN 6 THEN 'PPI therapy, dietary modifications'
      WHEN 7 THEN 'Nephrology referral, BP control'
      WHEN 8 THEN 'Continue gabapentin, PT referral'
    END,
    NOW() - (i || ' days')::interval
  FROM generate_series(1, 8) i;

  -- Insert nursing assessments
  INSERT INTO nursing_assessments (patient_id, nurse_id, assessment_type, assessment_data, pain_scale, mobility_status, fall_risk_score)
  SELECT 
    patient_ids[i],
    provider_uuid,
    'Initial Assessment',
    jsonb_build_object(
      'consciousness', 'Alert and oriented',
      'skin_condition', 'Intact',
      'respiratory', 'Clear bilateral breath sounds'
    ),
    (random() * 10)::integer,
    CASE WHEN i <= 3 THEN 'Ambulatory with assistance' WHEN i <= 6 THEN 'Independent' ELSE 'Ambulatory' END,
    CASE WHEN i <= 2 THEN 8 WHEN i <= 5 THEN 4 ELSE 2 END
  FROM generate_series(1, 8) i;

END $$;