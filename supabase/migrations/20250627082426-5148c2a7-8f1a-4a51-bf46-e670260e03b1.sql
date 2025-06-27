
-- Add comprehensive billing charges for all hospitals to ensure demo data is available
-- Fixed to use only valid status values (submitted, paid, pending, denied)

-- Add billing charges for Denver Health Medical Center (currently missing)
INSERT INTO public.billing_charges (patient_id, hospital_id, charge_code, charge_description, charge_type, amount, units, service_date, status, insurance_claim_number, payment_amount, balance_due) VALUES
-- Denver Health Medical Center claims
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '99213', 'Office visit, established patient', 'professional', 285.00, 1, '2024-01-21', 'submitted', 'CLM-DHM-001', 0.00, 285.00),
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '94060', 'Bronchodilator responsiveness', 'ancillary', 165.00, 1, '2024-01-21', 'paid', 'CLM-DHM-002', 132.00, 33.00),
('a6666662-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '80053', 'Comprehensive metabolic panel', 'ancillary', 95.00, 1, '2024-01-20', 'paid', 'CLM-DHM-003', 95.00, 0.00),
('a6666662-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '36415', 'Venipuncture', 'ancillary', 25.00, 1, '2024-01-20', 'paid', 'CLM-DHM-004', 25.00, 0.00),

-- Miami General Hospital claims
('a7777771-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '59400', 'Obstetric care', 'professional', 3250.00, 1, '2024-01-22', 'submitted', 'CLM-MGH-001', 0.00, 3250.00),
('a7777771-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '36415', 'Blood transfusion', 'ancillary', 450.00, 2, '2024-01-22', 'pending', 'CLM-MGH-002', 0.00, 450.00),
('a7777772-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '99291', 'Critical care, first hour', 'professional', 650.00, 1, '2024-01-21', 'paid', 'CLM-MGH-003', 520.00, 130.00),

-- Seattle Medical Center claims
('a8888881-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '27447', 'Orthopedic surgery', 'professional', 4500.00, 1, '2024-01-19', 'submitted', 'CLM-SMC-001', 0.00, 4500.00),
('a8888881-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '87086', 'Bacterial culture', 'ancillary', 125.00, 1, '2024-01-19', 'paid', 'CLM-SMC-002', 125.00, 0.00),
('a8888882-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '99214', 'Office visit, established patient', 'professional', 425.00, 1, '2024-01-23', 'pending', 'CLM-SMC-003', 0.00, 425.00);

-- Add more comprehensive billing data for existing hospitals to show variety
INSERT INTO public.billing_charges (patient_id, hospital_id, charge_code, charge_description, charge_type, amount, units, service_date, status, insurance_claim_number, payment_amount, balance_due) VALUES
-- Additional Metropolitan General Hospital claims
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '99232', 'Subsequent hospital care', 'professional', 385.00, 1, '2024-01-20', 'paid', 'CLM-MGH-007', 308.00, 77.00),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '94010', 'Spirometry', 'ancillary', 145.00, 1, '2024-01-19', 'submitted', 'CLM-MGH-008', 0.00, 145.00),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '93306', 'Echocardiography', 'ancillary', 485.00, 1, '2024-01-18', 'paid', 'CLM-MGH-009', 388.00, 97.00),

-- Additional Riverside Medical Center claims  
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '70553', 'MRI brain with contrast', 'ancillary', 1250.00, 1, '2024-01-22', 'submitted', 'CLM-RMC-005', 0.00, 1250.00),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '99291', 'Critical care, first hour', 'professional', 650.00, 1, '2024-01-21', 'paid', 'CLM-RMC-006', 520.00, 130.00),

-- Additional Sunset Community Hospital claims
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '77067', 'Screening mammography', 'ancillary', 285.00, 1, '2024-01-19', 'denied', 'CLM-SCH-004', 0.00, 285.00),
('a3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '90834', 'Psychotherapy 45 minutes', 'professional', 180.00, 1, '2024-01-22', 'paid', 'CLM-SCH-005', 144.00, 36.00),

-- Additional Bay Area Medical Complex claims
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '33533', 'Coronary artery bypass', 'professional', 15500.00, 1, '2024-01-20', 'submitted', 'CLM-BAM-003', 0.00, 15500.00),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '87086', 'Blood culture', 'ancillary', 95.00, 1, '2024-01-22', 'paid', 'CLM-BAM-004', 95.00, 0.00),

-- Additional Texas Heart Institute claims
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '93458', 'Cardiac catheterization', 'professional', 1850.00, 1, '2024-01-18', 'paid', 'CLM-THI-003', 1480.00, 370.00),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '33430', 'Mitral valve replacement', 'professional', 18200.00, 1, '2024-01-20', 'submitted', 'CLM-THI-004', 0.00, 18200.00);
