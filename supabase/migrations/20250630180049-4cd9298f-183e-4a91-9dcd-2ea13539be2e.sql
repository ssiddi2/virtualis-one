
-- Phase 1: Core Clinical Workflow Tables

-- Nursing assessments and flowsheets
CREATE TABLE public.nursing_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  nurse_id UUID NOT NULL REFERENCES public.profiles(id),
  assessment_type VARCHAR(100) NOT NULL,
  assessment_data JSONB NOT NULL,
  vital_signs JSONB,
  pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
  mobility_status VARCHAR(50),
  skin_integrity TEXT,
  fall_risk_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medication Administration Record (MAR)
CREATE TABLE public.medication_administration_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id),
  administered_by UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_time TIMESTAMP WITH TIME ZONE,
  dose_given VARCHAR(100),
  route VARCHAR(50),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'given', 'held', 'refused', 'missed')),
  reason_held TEXT,
  witness_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical Orders (CPOE)
CREATE TABLE public.clinical_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  ordering_provider_id UUID NOT NULL REFERENCES public.profiles(id),
  order_type VARCHAR(50) NOT NULL CHECK (order_type IN ('medication', 'lab', 'imaging', 'procedure', 'nursing', 'diet', 'activity')),
  order_details JSONB NOT NULL,
  priority VARCHAR(20) DEFAULT 'routine' CHECK (priority IN ('stat', 'urgent', 'routine')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'discontinued')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  frequency VARCHAR(50),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Problem List with ICD-10
CREATE TABLE public.problem_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  problem_name VARCHAR(255) NOT NULL,
  icd10_code VARCHAR(10),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'inactive')),
  onset_date DATE,
  resolved_date DATE,
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
  provider_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Allergies and Adverse Reactions
CREATE TABLE public.allergies_adverse_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergen VARCHAR(255) NOT NULL,
  reaction_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
  symptoms TEXT,
  onset_date DATE,
  verified_by UUID REFERENCES public.profiles(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immunizations
CREATE TABLE public.immunizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_code VARCHAR(20),
  administration_date DATE NOT NULL,
  dose_number INTEGER,
  series_complete BOOLEAN DEFAULT FALSE,
  lot_number VARCHAR(50),
  manufacturer VARCHAR(100),
  administered_by UUID REFERENCES public.profiles(id),
  site VARCHAR(50),
  route VARCHAR(50),
  reaction TEXT,
  next_due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care Plans
CREATE TABLE public.care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  plan_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  goals JSONB,
  interventions JSONB,
  target_outcomes JSONB,
  start_date DATE NOT NULL,
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical Notes Templates
CREATE TABLE public.clinical_notes_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  note_type VARCHAR(100) NOT NULL,
  template_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Sets
CREATE TABLE public.order_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  diagnosis VARCHAR(255),
  orders JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surgical Cases
CREATE TABLE public.surgical_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  surgeon_id UUID NOT NULL REFERENCES public.profiles(id),
  procedure_name VARCHAR(255) NOT NULL,
  cpt_code VARCHAR(10),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  operating_room VARCHAR(20),
  anesthesia_type VARCHAR(50),
  complications TEXT,
  estimated_blood_loss INTEGER,
  procedure_notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident Reports
CREATE TABLE public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id),
  incident_type VARCHAR(100) NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(100),
  description TEXT NOT NULL,
  contributing_factors TEXT,
  actions_taken TEXT,
  severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'major', 'sentinel')),
  status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discharge Planning
CREATE TABLE public.discharge_planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  discharge_planner_id UUID NOT NULL REFERENCES public.profiles(id),
  estimated_discharge_date DATE,
  discharge_disposition VARCHAR(100),
  discharge_location VARCHAR(255),
  equipment_needs JSONB,
  medication_reconciliation BOOLEAN DEFAULT FALSE,
  follow_up_appointments JSONB,
  patient_education JSONB,
  barriers_to_discharge TEXT,
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'ready', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical Alerts
CREATE TABLE public.clinical_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id),
  alert_type VARCHAR(100) NOT NULL,
  alert_message TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  triggered_by VARCHAR(100),
  acknowledged_by UUID REFERENCES public.profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Metrics
CREATE TABLE public.quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id),
  metric_name VARCHAR(255) NOT NULL,
  metric_category VARCHAR(100),
  metric_value DECIMAL(10,4),
  target_value DECIMAL(10,4),
  measurement_period_start DATE NOT NULL,
  measurement_period_end DATE NOT NULL,
  patient_population INTEGER,
  numerator INTEGER,
  denominator INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointment Schedules
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.profiles(id),
  appointment_type VARCHAR(100) NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  location VARCHAR(100),
  chief_complaint TEXT,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'arrived', 'in-progress', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for all new tables
ALTER TABLE public.nursing_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_administration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies_adverse_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discharge_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be refined later based on role-based access)
CREATE POLICY "Healthcare providers can access nursing assessments" ON public.nursing_assessments FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access MAR" ON public.medication_administration_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access clinical orders" ON public.clinical_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access problem lists" ON public.problem_list FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access allergies" ON public.allergies_adverse_reactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access immunizations" ON public.immunizations FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access care plans" ON public.care_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access note templates" ON public.clinical_notes_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access order sets" ON public.order_sets FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access surgical cases" ON public.surgical_cases FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access incident reports" ON public.incident_reports FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access discharge planning" ON public.discharge_planning FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access clinical alerts" ON public.clinical_alerts FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access quality metrics" ON public.quality_metrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Healthcare providers can access appointments" ON public.appointments FOR ALL TO authenticated USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_nursing_assessments_updated_at BEFORE UPDATE ON public.nursing_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clinical_orders_updated_at BEFORE UPDATE ON public.clinical_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_problem_list_updated_at BEFORE UPDATE ON public.problem_list FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_allergies_adverse_reactions_updated_at BEFORE UPDATE ON public.allergies_adverse_reactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_care_plans_updated_at BEFORE UPDATE ON public.care_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clinical_notes_templates_updated_at BEFORE UPDATE ON public.clinical_notes_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_sets_updated_at BEFORE UPDATE ON public.order_sets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_surgical_cases_updated_at BEFORE UPDATE ON public.surgical_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discharge_planning_updated_at BEFORE UPDATE ON public.discharge_planning FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
