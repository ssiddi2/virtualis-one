import { useQuery } from '@tanstack/react-query';
import { callEmr } from '@/lib/emrProxy';
import type { ChartReport } from '@/lib/fhirChartGrouping';

export interface FhirChart {
  unavailable: boolean;
  patient: any | null;
  medications: any[];
  allergies: any[];
  conditions: any[];
  vitals: any[];
  labs: any[];
  encounters: any[];
  imaging: any[];
  reports: ChartReport[];
  immunizations: any[];
  failed: string[]; // sections that could not be loaded
}

const SECTIONS = [
  ['medications', 'get_medications'],
  ['allergies', 'get_allergies'],
  ['conditions', 'get_conditions'],
  ['vitals', 'get_vitals'],
  ['labs', 'get_lab_results'],
  ['encounters', 'get_encounters'],
  ['imaging', 'get_imaging'],
  ['reports', 'get_diagnostic_reports'],
  ['immunizations', 'get_immunizations'],
] as const;

// Reads one patient's chart live from the hospital EMR through the gateway.
export function useFhirPatientChart(hospitalId?: string, fhirId?: string) {
  return useQuery({
    queryKey: ['fhir-chart', hospitalId, fhirId],
    enabled: !!hospitalId && !!fhirId,
    staleTime: 60_000,
    retry: false,
    queryFn: async (): Promise<FhirChart> => {
      const patientRes = await callEmr(hospitalId!, 'get_patient', { id: fhirId });
      const empty: FhirChart = {
        unavailable: false, patient: null, medications: [], allergies: [], conditions: [],
        vitals: [], labs: [], encounters: [], imaging: [], reports: [], immunizations: [], failed: [],
      };
      if (patientRes.kind === 'unavailable') return { ...empty, unavailable: true };
      if (patientRes.kind !== 'ok') return empty;

      const results = await Promise.allSettled(
        SECTIONS.map(([, op]) => callEmr<any[]>(hospitalId!, op, { patientId: fhirId })),
      );
      const chart: FhirChart = { ...empty, patient: patientRes.data };
      results.forEach((r, i) => {
        const key = SECTIONS[i][0];
        if (r.status === 'fulfilled' && r.value.kind === 'ok' && Array.isArray(r.value.data)) {
          (chart as any)[key] = r.value.data;
        } else {
          chart.failed.push(key);
        }
      });
      return chart;
    },
  });
}
