
-- Add denial management tables
CREATE TABLE public.claim_denials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  billing_charge_id UUID REFERENCES public.billing_charges(id),
  denial_code TEXT NOT NULL,
  denial_reason TEXT NOT NULL,
  denial_date DATE NOT NULL DEFAULT CURRENT_DATE,
  appeal_deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'appealing', 'resolved', 'written_off')),
  appeal_submitted_date DATE,
  resolution_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add prior authorization tracking
CREATE TABLE public.prior_authorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  service_code TEXT NOT NULL,
  service_description TEXT NOT NULL,
  requesting_provider_id UUID,
  insurance_provider TEXT NOT NULL,
  auth_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  approval_date DATE,
  expiration_date DATE,
  denial_reason TEXT,
  estimated_cost NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add payment posting and reconciliation
CREATE TABLE public.payment_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  billing_charge_id UUID REFERENCES public.billing_charges(id),
  payment_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('insurance', 'patient', 'adjustment', 'writeoff')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT,
  payer_name TEXT,
  adjustment_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add revenue cycle analytics table
CREATE TABLE public.revenue_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add AI coding suggestions enhancement
ALTER TABLE public.medical_records 
ADD COLUMN ai_coding_suggestions JSONB,
ADD COLUMN coding_confidence_score NUMERIC,
ADD COLUMN coding_reviewed_by UUID,
ADD COLUMN coding_reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX idx_claim_denials_status ON public.claim_denials(status);
CREATE INDEX idx_prior_auth_status ON public.prior_authorizations(status);
CREATE INDEX idx_payment_postings_date ON public.payment_postings(payment_date);
CREATE INDEX idx_revenue_analytics_period ON public.revenue_analytics(hospital_id, period_start, period_end);

-- Add RLS policies
ALTER TABLE public.claim_denials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prior_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_analytics ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be enhanced based on specific access requirements)
CREATE POLICY "Healthcare providers can manage denials" ON public.claim_denials FOR ALL USING (true);
CREATE POLICY "Healthcare providers can manage prior auths" ON public.prior_authorizations FOR ALL USING (true);
CREATE POLICY "Healthcare providers can manage payments" ON public.payment_postings FOR ALL USING (true);
CREATE POLICY "Healthcare providers can view analytics" ON public.revenue_analytics FOR ALL USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_claim_denials_updated_at
  BEFORE UPDATE ON public.claim_denials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prior_auth_updated_at
  BEFORE UPDATE ON public.prior_authorizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
