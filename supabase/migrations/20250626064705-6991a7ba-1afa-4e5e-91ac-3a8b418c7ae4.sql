
-- Create comprehensive EMR database schema for production hospital use

-- User profiles for healthcare staff
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'technician', 'pharmacist', 'receptionist')),
  department TEXT,
  license_number TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals/Facilities
CREATE TABLE public.hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  emr_type TEXT NOT NULL,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients
CREATE TABLE public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  mrn TEXT NOT NULL, -- Medical Record Number
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  ssn TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  blood_type TEXT,
  allergies TEXT[],
  medical_conditions TEXT[],
  current_medications TEXT[],
  admission_date TIMESTAMP WITH TIME ZONE,
  discharge_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred', 'deceased')),
  room_number TEXT,
  bed_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hospital_id, mrn)
);

-- Medical Records/Encounters
CREATE TABLE public.medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  provider_id UUID REFERENCES public.profiles(id) NOT NULL,
  encounter_type TEXT NOT NULL CHECK (encounter_type IN ('inpatient', 'outpatient', 'emergency', 'consultation')),
  chief_complaint TEXT,
  history_present_illness TEXT,
  physical_examination TEXT,
  assessment TEXT,
  plan TEXT,
  diagnosis_codes TEXT[], -- ICD-10 codes
  procedure_codes TEXT[], -- CPT codes
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discharge_summary TEXT,
  follow_up_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital Signs
CREATE TABLE public.vital_signs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
  temperature DECIMAL(4,1), -- Fahrenheit
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  oxygen_saturation INTEGER,
  weight DECIMAL(5,2), -- pounds
  height DECIMAL(5,2), -- inches
  bmi DECIMAL(4,1),
  pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Laboratory Orders and Results
CREATE TABLE public.lab_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  ordered_by UUID REFERENCES public.profiles(id) NOT NULL,
  test_name TEXT NOT NULL,
  test_code TEXT,
  priority TEXT DEFAULT 'routine' CHECK (priority IN ('stat', 'urgent', 'routine')),
  status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'collected', 'processing', 'completed', 'cancelled')),
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  collected_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  results JSONB,
  reference_ranges JSONB,
  abnormal_flags TEXT[],
  notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Radiology Orders and Results
CREATE TABLE public.radiology_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  ordered_by UUID REFERENCES public.profiles(id) NOT NULL,
  study_type TEXT NOT NULL,
  body_part TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('CT', 'MRI', 'X-Ray', 'Ultrasound', 'Nuclear Medicine', 'PET')),
  priority TEXT DEFAULT 'routine' CHECK (priority IN ('stat', 'urgent', 'routine')),
  status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  clinical_indication TEXT,
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  performed_at TIMESTAMP WITH TIME ZONE,
  radiologist_id UUID REFERENCES public.profiles(id),
  findings TEXT,
  impression TEXT,
  recommendations TEXT,
  images_url TEXT[],
  ai_analysis JSONB,
  critical_results BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Medications/Prescriptions
CREATE TABLE public.medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  prescribed_by UUID REFERENCES public.profiles(id) NOT NULL,
  medication_name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  route TEXT NOT NULL,
  quantity INTEGER,
  refills INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'completed', 'on_hold')),
  indication TEXT,
  instructions TEXT,
  pharmacy_name TEXT,
  ndc_number TEXT,
  prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_filled TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Billing and Charges
CREATE TABLE public.billing_charges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  medical_record_id UUID REFERENCES public.medical_records(id),
  charge_code TEXT NOT NULL,
  charge_description TEXT NOT NULL,
  charge_type TEXT CHECK (charge_type IN ('professional', 'facility', 'ancillary')),
  amount DECIMAL(10,2) NOT NULL,
  units INTEGER DEFAULT 1,
  service_date DATE NOT NULL,
  billing_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'paid', 'denied', 'partially_paid')),
  insurance_claim_number TEXT,
  payment_amount DECIMAL(10,2) DEFAULT 0,
  adjustment_amount DECIMAL(10,2) DEFAULT 0,
  balance_due DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights and Alerts
CREATE TABLE public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('risk_assessment', 'drug_interaction', 'diagnosis_suggestion', 'treatment_recommendation', 'critical_alert')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendations TEXT[],
  confidence_score DECIMAL(3,2),
  data_sources TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_by UUID REFERENCES public.profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radiology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Hospitals (Admin access)
CREATE POLICY "Authenticated users can view hospitals" ON public.hospitals FOR SELECT TO authenticated USING (true);

-- RLS Policies for Patients (Healthcare providers can access)
CREATE POLICY "Healthcare providers can access patients" ON public.patients FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

-- Similar policies for other tables
CREATE POLICY "Healthcare providers can access medical records" ON public.medical_records FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

CREATE POLICY "Healthcare providers can access vital signs" ON public.vital_signs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

CREATE POLICY "Healthcare providers can access lab orders" ON public.lab_orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

CREATE POLICY "Healthcare providers can access radiology orders" ON public.radiology_orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

CREATE POLICY "Healthcare providers can access medications" ON public.medications FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'pharmacist'))
);

CREATE POLICY "Healthcare providers can access billing" ON public.billing_charges FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist'))
);

CREATE POLICY "Healthcare providers can access AI insights" ON public.ai_insights FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse', 'technician'))
);

CREATE POLICY "Healthcare providers can access audit log" ON public.audit_log FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin'))
);

-- Insert sample hospitals
INSERT INTO public.hospitals (id, name, address, city, state, zip_code, phone, email, emr_type, license_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'St. Mary''s General Hospital', '123 Medical Center Dr', 'San Francisco', 'CA', '94102', '(415) 555-0100', 'admin@stmarys.org', 'Epic', 'CA-HOSP-001'),
('550e8400-e29b-41d4-a716-446655440002', 'Regional Medical Center', '456 Healthcare Blvd', 'Los Angeles', 'CA', '90210', '(213) 555-0200', 'info@regional.org', 'Cerner', 'CA-HOSP-002'),
('550e8400-e29b-41d4-a716-446655440003', 'Children''s Hospital Network', '789 Pediatric Way', 'San Diego', 'CA', '92101', '(619) 555-0300', 'contact@childrens.org', 'Meditech', 'CA-HOSP-003'),
('550e8400-e29b-41d4-a716-446655440004', 'University Medical', '321 Academic Ave', 'Sacramento', 'CA', '95814', '(916) 555-0400', 'help@umedical.edu', 'Allscripts', 'CA-HOSP-004'),
('550e8400-e29b-41d4-a716-446655440005', 'Veterans Affairs Medical', '654 Veterans Dr', 'Oakland', 'CA', '94612', '(510) 555-0500', 'info@va.gov', 'VistA', 'CA-HOSP-005'),
('550e8400-e29b-41d4-a716-446655440006', 'Community Health Network', '987 Community St', 'Fresno', 'CA', '93721', '(559) 555-0600', 'admin@community.org', 'FHIR API', 'CA-HOSP-006');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_patients_hospital_id ON public.patients(hospital_id);
CREATE INDEX idx_patients_mrn ON public.patients(mrn);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX idx_vital_signs_patient_id ON public.vital_signs(patient_id);
CREATE INDEX idx_lab_orders_patient_id ON public.lab_orders(patient_id);
CREATE INDEX idx_radiology_orders_patient_id ON public.radiology_orders(patient_id);
CREATE INDEX idx_medications_patient_id ON public.medications(patient_id);
CREATE INDEX idx_billing_charges_patient_id ON public.billing_charges(patient_id);
CREATE INDEX idx_ai_insights_patient_id ON public.ai_insights(patient_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);
