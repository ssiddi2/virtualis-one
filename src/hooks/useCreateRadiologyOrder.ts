import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type RadiologyOrderInsert = TablesInsert<'radiology_orders'>;

export const useCreateRadiologyOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: RadiologyOrderInsert) => {
      const { data, error } = await supabase
        .from('radiology_orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology_orders'] });
    },
  });
};
