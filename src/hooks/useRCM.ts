import { useRCM, useRCMOptional } from '@/contexts/RCMContext';

// Re-export the hooks for convenience
export { useRCM, useRCMOptional };

// Additional utility hook for quick billing actions
export const useQuickBilling = () => {
  const rcm = useRCMOptional();

  const quickAnalyze = async (content: string, patientId: string, patientName: string) => {
    if (!rcm) return null;
    return rcm.analyzeDocumentation(content, 'progress_note', patientId, patientName);
  };

  const quickSubmit = async (
    patientId: string,
    patientName: string,
    codes: Array<{ code: string; description: string; type: 'icd10' | 'cpt' }>,
    totalEstimate: number
  ) => {
    if (!rcm) return;
    
    rcm.addPendingCharge({
      patientId,
      patientName,
      codes: codes.map(c => ({ ...c, confidence: 1 })),
      totalEstimate,
      denialRisk: 'low',
      facilityType: rcm.selectedFacilityType,
      documentationType: 'progress_note',
      status: 'pending'
    });
  };

  return {
    isAvailable: !!rcm,
    quickAnalyze,
    quickSubmit,
    openBillingPanel: rcm?.openPanel,
    pendingCount: rcm?.currentSession.pendingCount || 0,
    todayTotal: rcm?.currentSession.totalEstimate || 0
  };
};
