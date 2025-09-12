-- Clean up all data in the correct order to respect foreign key constraints
-- First delete all dependent records, then profiles, which will cascade to auth.users

-- Delete medical records that reference profiles
DELETE FROM public.medical_records;

-- Delete lab orders
DELETE FROM public.lab_orders;

-- Delete radiology orders  
DELETE FROM public.radiology_orders;

-- Delete vital signs
DELETE FROM public.vital_signs;

-- Delete medications
DELETE FROM public.medications;

-- Delete allergies
DELETE FROM public.allergies_adverse_reactions;

-- Delete problem lists
DELETE FROM public.problem_list;

-- Delete nursing assessments
DELETE FROM public.nursing_assessments;

-- Delete clinical orders
DELETE FROM public.clinical_orders;

-- Delete billing charges
DELETE FROM public.billing_charges;

-- Delete appointments
DELETE FROM public.appointments;

-- Delete all patients
DELETE FROM public.patients;

-- Finally delete all profiles (this will cascade to auth.users)
DELETE FROM public.profiles;

-- Verify cleanup
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as profiles_count,
  (SELECT COUNT(*) FROM public.patients) as patients_count,
  (SELECT COUNT(*) FROM public.medical_records) as records_count;