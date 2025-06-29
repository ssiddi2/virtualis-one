
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Physician {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  specialty?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface OnCallSchedule {
  id: string;
  physician_id: string;
  specialty_id: string;
  start_time: string;
  end_time: string;
  is_primary: boolean;
  created_at: string;
  physician: Physician;
  specialty: Specialty;
}

export const usePhysicians = () => {
  return useQuery({
    queryKey: ['physicians'],
    queryFn: async () => {
      console.log('Fetching physicians...');
      const { data, error } = await supabase
        .from('physicians')
        .select(`
          *,
          specialty:specialties(*)
        `)
        .eq('is_active', true)
        .order('last_name');

      if (error) {
        console.error('Error fetching physicians:', error);
        throw error;
      }
      
      console.log('Physicians fetched:', data);
      return data as Physician[];
    }
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      console.log('Fetching specialties...');
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching specialties:', error);
        throw error;
      }
      
      console.log('Specialties fetched:', data);
      return data as Specialty[];
    }
  });
};

export const useOnCallSchedules = () => {
  return useQuery({
    queryKey: ['onCallSchedules'],
    queryFn: async () => {
      console.log('Fetching on-call schedules...');
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('on_call_schedules')
        .select(`
          *,
          physician:physicians(*),
          specialty:specialties(*)
        `)
        .lte('start_time', now)
        .gte('end_time', now)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Error fetching on-call schedules:', error);
        throw error;
      }
      
      console.log('On-call schedules fetched:', data);
      return data as OnCallSchedule[];
    }
  });
};

export const useCreateConsultationRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: {
      message_id: string;
      requesting_physician_id?: string;
      requested_specialty_id?: string;
      consulted_physician_id?: string;
      patient_id?: string;
      urgency: 'routine' | 'urgent' | 'critical';
      clinical_question: string;
      ai_recommendation?: string;
    }) => {
      console.log('Creating consultation request:', request);
      
      const { data, error } = await supabase
        .from('consultation_requests')
        .insert([request])
        .select()
        .single();

      if (error) {
        console.error('Error creating consultation request:', error);
        throw error;
      }

      console.log('Consultation request created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultationRequests'] });
    }
  });
};
