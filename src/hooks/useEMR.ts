import { useMemo } from 'react';
import { emrManager } from '@/lib/emr';
import type { Order } from '@/lib/emr';

export function useEMR(hospitalId: string) {
  return useMemo(() => ({
    searchPatients: (query: { name?: string; mrn?: string; dob?: string }) =>
      emrManager.get(hospitalId).searchPatients(query),
    getPatient: (id: string) => emrManager.get(hospitalId).getPatient(id),
    createOrder: (order: Order) => emrManager.get(hospitalId).createOrder(order),
    getLabResults: (patientId: string) => emrManager.get(hospitalId).getLabResults(patientId),
    healthCheck: () => emrManager.get(hospitalId).healthCheck(),
  }), [hospitalId]);
}
