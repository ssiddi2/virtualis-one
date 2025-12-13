export type EMRVendor = 'epic' | 'cerner' | 'meditech' | 'allscripts' | 'fhir';

export interface EMRConfig {
  vendor: EMRVendor;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  tenantId?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  phone?: string;
  email?: string;
  allergies?: string[];
  conditions?: string[];
}

export interface Order {
  id?: string;
  patientId: string;
  type: 'lab' | 'radiology' | 'medication' | 'procedure' | 'referral';
  code: string;
  codeSystem: 'LOINC' | 'CPT' | 'SNOMED' | 'RxNorm' | 'ICD10';
  description: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  orderingProvider: string;
}

export interface LabResult {
  id: string;
  orderId: string;
  patientId: string;
  code: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  interpretation: 'normal' | 'abnormal' | 'critical';
  collectedAt: string;
  resultedAt: string;
}
