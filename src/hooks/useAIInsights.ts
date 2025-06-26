
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAIInsights = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['ai-insights', hospitalId],
    queryFn: async () => {
      let query = supabase
        .from('ai_insights')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            mrn
          )
        `)
        .order('created_at', { ascending: false });
      
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching AI insights:', error);
        throw error;
      }
      
      return data;
    },
    enabled: true,
  });
};
