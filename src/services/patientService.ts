
import { supabase } from '@/lib/supabase';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  chief_complaint?: string;
  medical_history?: string;
  acuity_level: 'low' | 'medium' | 'high';
  status: 'waiting' | 'in-progress' | 'discharge-ready';
  assigned_provider_id?: string;
  hospital_id: string;
  room_number?: string;
  admission_date: string;
  created_at: string;
  updated_at: string;
}

export const getPatients = async (hospitalId?: string): Promise<Patient[]> => {
  let query = supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (hospitalId) {
    query = query.eq('hospital_id', hospitalId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }

  return data || [];
};

export const getPatient = async (id: string): Promise<Patient | null> => {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      medications (*),
      allergies (*),
      clinical_notes (*, user_profiles!clinical_notes_created_by_fkey(full_name))
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Patient not found
    }
    throw new Error(`Failed to fetch patient: ${error.message}`);
  }

  return data;
};

export const createPatient = async (patientData: Partial<Patient>): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create patient: ${error.message}`);
  }

  return data;
};

export const updatePatient = async (id: string, updates: Partial<Patient>): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update patient: ${error.message}`);
  }

  return data;
};

export const getVitalSigns = async (patientId: string) => {
  const { data, error } = await supabase
    .from('vital_signs')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch vital signs: ${error.message}`);
  }

  return data || [];
};

export const addVitalSigns = async (vitalData: any) => {
  const { data, error } = await supabase
    .from('vital_signs')
    .insert([vitalData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add vital signs: ${error.message}`);
  }

  return data;
};
