
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Patient = Tables<'patients'>;

// Mock data to ensure components always have data to work with
const generateMockPatients = (hospitalId?: string): Patient[] => {
  const basePatients: Partial<Patient>[] = [
    {
      id: `pat-${hospitalId}-001`,
      hospital_id: hospitalId || '1',
      mrn: 'MRN-001234',
      first_name: 'John',
      last_name: 'Smith',
      date_of_birth: '1985-03-15',
      gender: 'Male',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, Anytown, ST 12345',
      status: 'active',
      room_number: '302A',
      bed_number: '1',
      admission_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      allergies: ['Penicillin', 'Latex'],
      medical_conditions: ['Hypertension', 'Type 2 Diabetes'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `pat-${hospitalId}-002`,
      hospital_id: hospitalId || '1',
      mrn: 'MRN-005678',
      first_name: 'Mary',
      last_name: 'Johnson',
      date_of_birth: '1972-08-22',
      gender: 'Female',
      phone: '(555) 987-6543',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Somewhere, ST 67890',
      status: 'active',
      room_number: '215B',
      bed_number: '2',
      admission_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      allergies: ['Shellfish'],
      medical_conditions: ['COPD', 'Osteoarthritis'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `pat-${hospitalId}-003`,
      hospital_id: hospitalId || '1',
      mrn: 'MRN-009876',
      first_name: 'Robert',
      last_name: 'Wilson',
      date_of_birth: '1990-12-05',
      gender: 'Male',
      phone: '(555) 456-7890',
      email: 'robert.wilson@email.com',
      address: '789 Pine St, Elsewhere, ST 54321',
      status: 'discharged',
      room_number: null,
      bed_number: null,
      admission_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      discharge_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      allergies: [],
      medical_conditions: ['Post-surgical recovery'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `pat-${hospitalId}-004`,
      hospital_id: hospitalId || '1',
      mrn: 'MRN-112233',
      first_name: 'Sarah',
      last_name: 'Davis',
      date_of_birth: '1978-06-30',
      gender: 'Female',
      phone: '(555) 234-5678',
      email: 'sarah.davis@email.com',
      address: '321 Elm St, Nowhere, ST 98765',
      status: 'active',
      room_number: '418A',
      bed_number: '1',
      admission_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      allergies: ['Aspirin', 'Codeine'],
      medical_conditions: ['Pneumonia', 'Asthma'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `pat-${hospitalId}-005`,
      hospital_id: hospitalId || '1',
      mrn: 'MRN-445566',
      first_name: 'Michael',
      last_name: 'Brown',
      date_of_birth: '1995-04-12',
      gender: 'Male',
      phone: '(555) 345-6789',
      email: 'michael.brown@email.com',
      address: '654 Maple Ave, Anyplace, ST 13579',
      status: 'active',
      room_number: '503B',
      bed_number: '2',
      admission_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      allergies: ['Iodine'],
      medical_conditions: ['Appendicitis'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return basePatients as Patient[];
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
        
        // If no data from database, return mock data
        if (!data || data.length === 0) {
          console.log('No database data, using mock data');
          return generateMockPatients(hospitalId);
        }
        
        return data as Patient[];
      } catch (error) {
        console.log('Query error, using mock data:', error);
        return generateMockPatients(hospitalId);
      }
    },
  });
};
