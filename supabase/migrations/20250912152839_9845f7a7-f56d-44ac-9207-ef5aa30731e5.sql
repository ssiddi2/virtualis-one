-- Complete cleanup of all data respecting all foreign key constraints
-- Delete in reverse dependency order

-- Delete AI insights first
DELETE FROM public.ai_insights;

-- Delete discharge planning
DELETE FROM public.discharge_planning;

-- Delete incident reports
DELETE FROM public.incident_reports;

-- Delete clinical alerts
DELETE FROM public.clinical_alerts;

-- Delete payment postings
DELETE FROM public.payment_postings;

-- Delete claim denials
DELETE FROM public.claim_denials;

-- Delete prior authorizations
DELETE FROM public.prior_authorizations;

-- Delete surgical cases
DELETE FROM public.surgical_cases;

-- Delete immunizations
DELETE FROM public.immunizations;

-- Delete care plans
DELETE FROM public.care_plans;

-- Delete medication administration records
DELETE FROM public.medication_administration_records;

-- Delete consultation requests
DELETE FROM public.consultation_requests;

-- Delete revenue analytics
DELETE FROM public.revenue_analytics;

-- Delete CMS quality measures
DELETE FROM public.cms_quality_measures;

-- Delete audit log
DELETE FROM public.audit_log;

-- Now delete the main tables
DELETE FROM public.medical_records;
DELETE FROM public.lab_orders;
DELETE FROM public.radiology_orders;
DELETE FROM public.vital_signs;
DELETE FROM public.medications;
DELETE FROM public.allergies_adverse_reactions;
DELETE FROM public.problem_list;
DELETE FROM public.nursing_assessments;
DELETE FROM public.clinical_orders;
DELETE FROM public.billing_charges;
DELETE FROM public.appointments;
DELETE FROM public.patients;

-- Finally delete profiles (this will cascade to auth.users)
DELETE FROM public.profiles;

-- Verify everything is clean
SELECT 'Cleanup complete' as status;