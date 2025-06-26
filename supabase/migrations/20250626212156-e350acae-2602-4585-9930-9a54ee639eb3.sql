
-- Temporarily disable the foreign key constraint for profiles to allow demo data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add the demo data without creating a profile
-- Add billing charges (claims data) with realistic medical codes
INSERT INTO public.billing_charges (patient_id, hospital_id, charge_code, charge_description, charge_type, amount, units, service_date, status, insurance_claim_number, payment_amount, balance_due) VALUES
-- Metropolitan General Hospital claims
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '99233', 'Subsequent hospital care, high complexity', 'professional', 450.00, 1, '2024-01-21', 'submitted', 'CLM-MGH-001', 360.00, 90.00),
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '80053', 'Comprehensive metabolic panel', 'ancillary', 85.00, 1, '2024-01-21', 'paid', 'CLM-MGH-002', 85.00, 0.00),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '94010', 'Spirometry', 'ancillary', 125.00, 1, '2024-01-20', 'denied', 'CLM-MGH-003', 0.00, 125.00),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '93000', 'Electrocardiogram', 'ancillary', 75.00, 1, '2024-01-19', 'paid', 'CLM-MGH-004', 75.00, 0.00),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '76805', 'Obstetric ultrasound', 'ancillary', 250.00, 1, '2024-01-22', 'submitted', 'CLM-MGH-005', 0.00, 250.00),
('a1111115-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '71020', 'Chest X-ray', 'ancillary', 95.00, 1, '2024-01-23', 'paid', 'CLM-MGH-006', 95.00, 0.00),

-- Riverside Medical Center claims
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '70450', 'CT head without contrast', 'ancillary', 875.00, 1, '2024-01-22', 'submitted', 'CLM-RMC-001', 0.00, 875.00),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '85025', 'Complete blood count', 'ancillary', 45.00, 1, '2024-01-21', 'paid', 'CLM-RMC-002', 45.00, 0.00),
('a2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '99291', 'Critical care, first hour', 'professional', 650.00, 1, '2024-01-23', 'submitted', 'CLM-RMC-003', 0.00, 650.00),
('a2222224-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '90834', 'Psychotherapy 45 minutes', 'professional', 180.00, 1, '2024-01-21', 'paid', 'CLM-RMC-004', 144.00, 36.00),

-- Sunset Community Hospital claims
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '77067', 'Screening mammography', 'ancillary', 285.00, 1, '2024-01-20', 'denied', 'CLM-SCH-001', 0.00, 285.00),
('a3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '90837', 'Psychotherapy 60 minutes', 'professional', 220.00, 1, '2024-01-22', 'paid', 'CLM-SCH-002', 176.00, 44.00),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '60240', 'Thyroidectomy', 'professional', 2850.00, 1, '2024-01-21', 'submitted', 'CLM-SCH-003', 0.00, 2850.00),

-- Bay Area Medical Complex claims
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '93458', 'Cardiac catheterization', 'professional', 1850.00, 1, '2024-01-20', 'paid', 'CLM-BAM-001', 1480.00, 370.00),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '71250', 'CT chest with contrast', 'ancillary', 950.00, 1, '2024-01-22', 'submitted', 'CLM-BAM-002', 0.00, 950.00),

-- Texas Heart Institute claims
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '33533', 'Coronary artery bypass', 'professional', 15500.00, 1, '2024-01-19', 'submitted', 'CLM-THI-001', 0.00, 15500.00),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '33430', 'Mitral valve replacement', 'professional', 18200.00, 1, '2024-01-20', 'submitted', 'CLM-THI-002', 0.00, 18200.00);

-- Make ordered_by nullable temporarily for radiology orders
ALTER TABLE public.radiology_orders ALTER COLUMN ordered_by DROP NOT NULL;

-- Add radiology orders with PACS data and AI analysis
INSERT INTO public.radiology_orders (patient_id, ordered_by, study_type, body_part, modality, clinical_indication, status, findings, impression, recommendations, ai_analysis, images_url, critical_results, ordered_at, performed_at) VALUES
-- CT Scans with AI analysis
('a2222221-2222-2222-2222-222222222222', NULL, 'CT Head', 'Head', 'CT', 'Acute stroke symptoms', 'completed', 'Hypodense area in left middle cerebral artery territory consistent with acute infarct. No hemorrhage identified.', 'Acute ischemic stroke, left MCA territory', 'Urgent neurology consultation, consider thrombolytic therapy', '{"ai_confidence": 0.94, "stroke_detected": true, "hemorrhage_present": false, "infarct_volume": "45ml", "alberta_score": 7}', ARRAY['https://pacs.riverside.org/images/ct_head_001.dcm', 'https://pacs.riverside.org/images/ct_head_002.dcm'], true, '2024-01-22 08:50:00', '2024-01-22 09:15:00'),
('a4444442-4444-4444-4444-444444444444', NULL, 'CT Chest', 'Chest', 'CT', 'Pneumonia and sepsis', 'completed', 'Bilateral lower lobe consolidation with air bronchograms. Small bilateral pleural effusions.', 'Bilateral pneumonia with pleural effusions', 'Antibiotic therapy, respiratory support, follow-up imaging', '{"ai_confidence": 0.89, "pneumonia_severity": "moderate", "pleural_effusion": true, "volume_ml": 150}', ARRAY['https://pacs.bayarea.org/images/ct_chest_001.dcm'], false, '2024-01-22 16:35:00', '2024-01-22 17:00:00'),
('a2222223-2222-2222-2222-222222222222', NULL, 'CT Abdomen', 'Abdomen', 'CT', 'Trauma evaluation', 'completed', 'Grade 3 splenic laceration with active extravasation. Free fluid in abdomen.', 'Splenic laceration with active bleeding', 'Immediate surgical consultation, blood transfusion preparation', '{"ai_confidence": 0.96, "trauma_grade": 3, "active_bleeding": true, "surgery_recommended": true}', ARRAY['https://pacs.riverside.org/images/ct_abdomen_001.dcm'], true, '2024-01-23 03:00:00', '2024-01-23 03:25:00'),

-- Cardiac Imaging
('a4444441-4444-4444-4444-444444444444', NULL, 'Cardiac Cath', 'Heart', 'Nuclear Medicine', 'Acute MI', 'completed', '95% stenosis of proximal LAD with TIMI 1 flow. Circumflex and RCA patent.', 'Acute anterior STEMI with LAD occlusion', 'Immediate PCI with stent placement', '{"ai_confidence": 0.98, "vessel_stenosis": {"LAD": 95, "RCA": 10, "LCX": 15}, "timi_flow": 1, "pci_recommended": true}', ARRAY['https://pacs.bayarea.org/images/cath_001.dcm'], true, '2024-01-20 12:05:00', '2024-01-20 12:30:00'),
('a5555551-5555-5555-5555-555555555555', NULL, 'Echocardiogram', 'Heart', 'Ultrasound', 'Heart failure evaluation', 'completed', 'Severely reduced left ventricular ejection fraction (25%). Regional wall motion abnormalities.', 'Ischemic cardiomyopathy with severe systolic dysfunction', 'Heart failure optimization, consider ICD evaluation', '{"ai_confidence": 0.92, "ejection_fraction": 25, "wall_motion": "severely_impaired", "diastolic_function": "grade_3"}', ARRAY['https://pacs.texasheart.org/images/echo_001.dcm'], false, '2024-01-18 08:00:00', '2024-01-18 08:45:00'),

-- Chest X-rays with AI analysis
('a1111115-1111-1111-1111-111111111111', NULL, 'Chest X-ray', 'Chest', 'X-Ray', 'Pneumonia symptoms', 'completed', 'Right lower lobe opacity consistent with pneumonia. Heart size normal.', 'Right lower lobe pneumonia', 'Antibiotic therapy, follow-up imaging in 48-72 hours', '{"ai_confidence": 0.87, "pneumonia_present": true, "location": "right_lower_lobe", "severity": "moderate"}', ARRAY['https://pacs.metro.org/images/cxr_001.dcm'], false, '2024-01-23 09:25:00', '2024-01-23 09:40:00'),
('a1111113-1111-1111-1111-111111111111', NULL, 'Chest X-ray', 'Chest', 'X-Ray', 'COPD exacerbation', 'completed', 'Hyperinflated lungs with flattened diaphragms. Increased AP diameter. No acute infiltrates.', 'COPD changes without acute pneumonia', 'Continue bronchodilator therapy, pulmonary rehabilitation', '{"ai_confidence": 0.91, "copd_changes": true, "hyperinflation": true, "pneumonia_present": false}', ARRAY['https://pacs.metro.org/images/cxr_002.dcm'], false, '2024-01-19 14:30:00', '2024-01-19 14:45:00'),

-- PET scan with AI screening
('a3333331-3333-3333-3333-333333333333', NULL, 'PET Scan', 'Breast', 'PET', 'Cancer staging', 'completed', 'Hypermetabolic activity in right breast mass with SUVmax 8.2. No distant metastatic disease identified.', 'Breast cancer with high metabolic activity, no distant metastases', 'Urgent breast surgery consultation, tissue biopsy recommended', '{"ai_confidence": 0.93, "suv_max": 8.2, "malignancy_risk": "high", "metastases_detected": false}', ARRAY['https://pacs.sunset.org/images/pet_001.dcm'], true, '2024-01-20 13:10:00', '2024-01-20 13:45:00'),

-- MRI with advanced AI analysis
('a6666661-6666-6666-6666-666666666666', NULL, 'Brain MRI', 'Brain', 'MRI', 'Headaches and vision changes', 'completed', 'Multiple hyperintense lesions on T2/FLAIR sequences in periventricular and subcortical white matter.', 'Multiple sclerosis, relapsing-remitting type', 'Neurology consultation, disease-modifying therapy consideration', '{"ai_confidence": 0.88, "lesion_count": 12, "mcdonald_criteria": "met", "disease_activity": "active", "lesion_locations": ["periventricular", "subcortical"]}', ARRAY['https://pacs.denver.org/images/mri_brain_001.dcm'], false, '2024-01-21 15:00:00', '2024-01-21 16:30:00');

-- Add more CMS quality measures with detailed performance data
INSERT INTO public.cms_quality_measures (hospital_id, measure_id, measure_name, reporting_period, numerator, denominator, performance_rate, benchmark_rate, improvement_target, status) VALUES
('66666666-6666-6666-6666-666666666666', 'CMS-134', 'Diabetes: Medical Attention for Nephropathy', 'Q4 2024', 45, 60, 75.0, 70.0, 85.0, 'completed'),
('77777777-7777-7777-7777-777777777777', 'CMS-165', 'Controlling High Blood Pressure', 'Q4 2024', 82, 120, 68.3, 75.0, 80.0, 'in_progress'),
('88888888-8888-8888-8888-888888888888', 'CMS-155', 'Weight Assessment for Children', 'Q4 2024', 95, 100, 95.0, 90.0, 98.0, 'completed'),
('33333333-3333-3333-3333-333333333333', 'CMS-139', 'Falls: Screening for Future Fall Risk', 'Q4 2024', 78, 85, 91.8, 85.0, 95.0, 'submitted'),
('44444444-4444-4444-4444-444444444444', 'CMS-117', 'Childhood Immunization Status', 'Q4 2024', 88, 95, 92.6, 88.0, 95.0, 'completed'),
('55555555-5555-5555-5555-555555555555', 'CMS-90', 'Functional Status Assessment', 'Q4 2024', 67, 75, 89.3, 80.0, 92.0, 'submitted'),
('11111111-1111-1111-1111-111111111111', 'CMS-68', 'Documentation of Current Medications', 'Q4 2024', 92, 95, 96.8, 90.0, 98.0, 'completed'),
('22222222-2222-2222-2222-222222222222', 'CMS-50', 'Closing the Referral Loop', 'Q4 2024', 76, 90, 84.4, 80.0, 90.0, 'in_progress');
