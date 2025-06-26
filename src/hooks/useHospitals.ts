
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Hospital = Tables<'hospitals'>;

export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Hospital[];
    },
  });
};

export const useHospital = (hospitalId: string) => {
  return useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', hospitalId)
        .single();
      
      if (error) throw error;
      return data as Hospital;
    },
    enabled: !!hospitalId,
  });
};
