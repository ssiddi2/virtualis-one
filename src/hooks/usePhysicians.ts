
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
      const { data, error } = await supabase
        .from('physicians')
        .select(`
          *,
          specialty:specialties(*)
        `)
        .eq('is_active', true)
        .order('last_name');

      if (error) {
        throw error;
      }
      
      return data as Physician[];
    }
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }
      
      return data as Specialty[];
    }
  });
};

export const useOnCallSchedules = () => {
  return useQuery({
    queryKey: ['onCallSchedules'],
    queryFn: async () => {
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
        throw error;
      }
      
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
      const { data, error } = await supabase
        .from('consultation_requests')
        .insert([request])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultationRequests'] });
    }
  });
};
