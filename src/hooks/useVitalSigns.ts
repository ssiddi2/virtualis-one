import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type VitalSign = Tables<'vital_signs'>;
type VitalSignInsert = TablesInsert<'vital_signs'>;

// Mock vitals for demo
const generateMockVitals = (patientId: string): VitalSign[] => {
  const now = new Date();
  return [
    {
      id: crypto.randomUUID(),
      patient_id: patientId,
      recorded_by: crypto.randomUUID(),
      temperature: 98.6,
      blood_pressure_systolic: 128,
      blood_pressure_diastolic: 82,
      heart_rate: 72,
      respiratory_rate: 16,
      oxygen_saturation: 98,
      weight: 175,
      height: 70,
      bmi: 25.1,
      pain_scale: 3,
      recorded_at: now.toISOString(),
      notes: null
    },
    {
      id: crypto.randomUUID(),
      patient_id: patientId,
      recorded_by: crypto.randomUUID(),
      temperature: 99.1,
      blood_pressure_systolic: 132,
      blood_pressure_diastolic: 85,
      heart_rate: 78,
      respiratory_rate: 18,
      oxygen_saturation: 97,
      weight: 175,
      height: 70,
      bmi: 25.1,
      pain_scale: 4,
      recorded_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      notes: 'Patient reports mild headache'
    }
  ];
};

export const useVitalSigns = (patientId?: string) => {
  return useQuery({
    queryKey: ['vital_signs', patientId],
    queryFn: async () => {
      if (!patientId) return [];
      
      try {
        const { data, error } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('patient_id', patientId)
          .order('recorded_at', { ascending: false });
        
        if (error) {
          return generateMockVitals(patientId);
        }
        
        if (!data || data.length === 0) {
          return generateMockVitals(patientId);
        }
        
        return data as VitalSign[];
      } catch {
        return generateMockVitals(patientId);
      }
    },
    enabled: !!patientId,
  });
};

export const useLatestVitals = (patientId?: string) => {
  const { data: vitals } = useVitalSigns(patientId);
  return vitals?.[0] || null;
};

export const useCreateVitalSigns = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vitals: VitalSignInsert) => {
      const { data, error } = await supabase
        .from('vital_signs')
        .insert(vitals)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vital_signs', variables.patient_id] });
    },
  });
};
