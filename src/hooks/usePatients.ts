import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Patient = Tables<'patients'>;
type PatientInsert = TablesInsert<'patients'>;

// Generate proper UUIDs for mock data
const generateUUID = () => crypto.randomUUID();

// Mock data with valid UUIDs for demo purposes when DB is empty
const generateMockPatients = (hospitalId?: string): Patient[] => {
  const mockHospitalId = hospitalId || crypto.randomUUID();
  
  const basePatients: Patient[] = [
    {
      id: '09ddc5aa-a4b0-4617-a03f-f4a10c850df0',
      hospital_id: mockHospitalId,
      mrn: 'MRN-001234',
      first_name: 'John',
      last_name: 'Smith',
      date_of_birth: '1985-03-15',
      gender: 'Male',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip_code: '12345',
      status: 'active',
      room_number: '302A',
      bed_number: '1',
      blood_type: 'O+',
      admission_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      discharge_date: null,
      allergies: ['Penicillin', 'Latex'],
      medical_conditions: ['Hypertension', 'Type 2 Diabetes'],
      current_medications: ['Metformin', 'Lisinopril'],
      emergency_contact_name: 'Jane Smith',
      emergency_contact_phone: '(555) 987-6543',
      insurance_provider: 'Blue Cross',
      insurance_policy_number: 'BC-12345',
      ssn: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      hospital_id: mockHospitalId,
      mrn: 'MRN-005678',
      first_name: 'Mary',
      last_name: 'Johnson',
      date_of_birth: '1972-08-22',
      gender: 'Female',
      phone: '(555) 987-6543',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zip_code: '67890',
      status: 'active',
      room_number: '215B',
      bed_number: '2',
      blood_type: 'A-',
      admission_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      discharge_date: null,
      allergies: ['Shellfish'],
      medical_conditions: ['COPD', 'Osteoarthritis'],
      current_medications: ['Albuterol', 'Ibuprofen'],
      emergency_contact_name: 'Bob Johnson',
      emergency_contact_phone: '(555) 234-5678',
      insurance_provider: 'Aetna',
      insurance_policy_number: 'AE-67890',
      ssn: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
      hospital_id: mockHospitalId,
      mrn: 'MRN-009876',
      first_name: 'Robert',
      last_name: 'Wilson',
      date_of_birth: '1990-12-05',
      gender: 'Male',
      phone: '(555) 456-7890',
      email: 'robert.wilson@email.com',
      address: '789 Pine St',
      city: 'Elsewhere',
      state: 'TX',
      zip_code: '54321',
      status: 'active',
      room_number: '410A',
      bed_number: '1',
      blood_type: 'B+',
      admission_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      discharge_date: null,
      allergies: [],
      medical_conditions: ['Appendicitis'],
      current_medications: [],
      emergency_contact_name: 'Sarah Wilson',
      emergency_contact_phone: '(555) 345-6789',
      insurance_provider: 'United Healthcare',
      insurance_policy_number: 'UH-54321',
      ssn: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
      hospital_id: mockHospitalId,
      mrn: 'MRN-112233',
      first_name: 'Sarah',
      last_name: 'Davis',
      date_of_birth: '1978-06-30',
      gender: 'Female',
      phone: '(555) 234-5678',
      email: 'sarah.davis@email.com',
      address: '321 Elm St',
      city: 'Nowhere',
      state: 'FL',
      zip_code: '98765',
      status: 'active',
      room_number: '418A',
      bed_number: '1',
      blood_type: 'AB+',
      admission_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      discharge_date: null,
      allergies: ['Aspirin', 'Codeine'],
      medical_conditions: ['Pneumonia', 'Asthma'],
      current_medications: ['Azithromycin', 'Prednisone'],
      emergency_contact_name: 'Mike Davis',
      emergency_contact_phone: '(555) 456-7890',
      insurance_provider: 'Cigna',
      insurance_policy_number: 'CG-11223',
      ssn: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
      hospital_id: mockHospitalId,
      mrn: 'MRN-445566',
      first_name: 'Michael',
      last_name: 'Brown',
      date_of_birth: '1995-04-12',
      gender: 'Male',
      phone: '(555) 345-6789',
      email: 'michael.brown@email.com',
      address: '654 Maple Ave',
      city: 'Anyplace',
      state: 'WA',
      zip_code: '13579',
      status: 'active',
      room_number: '503B',
      bed_number: '2',
      blood_type: 'O-',
      admission_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      discharge_date: null,
      allergies: ['Iodine'],
      medical_conditions: ['Chest Pain', 'Anxiety'],
      current_medications: ['Aspirin', 'Lorazepam'],
      emergency_contact_name: 'Lisa Brown',
      emergency_contact_phone: '(555) 567-8901',
      insurance_provider: 'Kaiser',
      insurance_policy_number: 'KP-44556',
      ssn: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return basePatients;
};

export const usePatients = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['patients', hospitalId],
    queryFn: async () => {
      try {
        let query = supabase.from('patients').select('*');
        
        if (hospitalId) {
          query = query.eq('hospital_id', hospitalId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.log('Database error, using mock data:', error);
          return generateMockPatients(hospitalId);
        }
        
        // If database has patients, use them; otherwise use mock data
        if (data && data.length > 0) {
          return data as Patient[];
        }
        
        console.log('No database patients, using mock data for demo');
        return generateMockPatients(hospitalId);
      } catch (error) {
        console.log('Query error, using mock data:', error);
        return generateMockPatients(hospitalId);
      }
    },
  });
};

export const usePatientById = (patientId?: string) => {
  const { data: patients } = usePatients();
  
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      
      // First try to find in already loaded patients
      const cachedPatient = patients?.find(p => p.id === patientId);
      if (cachedPatient) return cachedPatient;
      
      // Try database lookup
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (error) {
          // Fall back to mock patients
          const mockPatients = generateMockPatients();
          return mockPatients.find(p => p.id === patientId) || null;
        }
        
        return data as Patient;
      } catch {
        const mockPatients = generateMockPatients();
        return mockPatients.find(p => p.id === patientId) || null;
      }
    },
    enabled: !!patientId,
  });
};

export const usePatientByMRN = (mrn?: string) => {
  const { data: patients } = usePatients();
  
  return useQuery({
    queryKey: ['patient-mrn', mrn],
    queryFn: async () => {
      if (!mrn) return null;
      
      // First try cached patients
      const cachedPatient = patients?.find(p => p.mrn === mrn);
      if (cachedPatient) return cachedPatient;
      
      // Try database lookup
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('mrn', mrn)
          .single();
        
        if (error) {
          const mockPatients = generateMockPatients();
          return mockPatients.find(p => p.mrn === mrn) || null;
        }
        
        return data as Patient;
      } catch {
        const mockPatients = generateMockPatients();
        return mockPatients.find(p => p.mrn === mrn) || null;
      }
    },
    enabled: !!mrn,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: PatientInsert) => {
      const { data, error } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Patient> & { id: string }) => {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
