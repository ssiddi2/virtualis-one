
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCMSQualityMeasures = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['cms-quality-measures', hospitalId],
    queryFn: async () => {
      let query = supabase
        .from('cms_quality_measures')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching CMS quality measures:', error);
        throw error;
      }
      
      return data;
    },
    enabled: true,
  });
};
