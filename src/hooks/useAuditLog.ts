import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuditLog = () => {
  const logAccess = useCallback(async (
    patientId: string,
    resourceType: string,
    accessReason?: string,
    isEmergency = false
  ) => {
    try {
      await supabase.functions.invoke('log-phi-access', {
        body: { patient_id: patientId, resource_type: resourceType, access_reason: accessReason, is_emergency: isEmergency }
      });
    } catch (e) {
      console.error('Audit log failed:', e);
    }
  }, []);

  return { logAccess };
};
