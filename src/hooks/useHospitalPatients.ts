import { useQuery } from '@tanstack/react-query';
import { useMultiHospital } from '@/contexts/MultiHospitalContext';
import { usePatients } from '@/hooks/usePatients';
import { callEmr } from '@/lib/emrProxy';

// Patient row shared by the patient lists, whether it comes from the hospital's
// live EMR (FHIR via the Virtualis gateway) or from local records.
export interface RosterPatient {
  id: string;
  first_name: string;
  last_name: string;
  mrn: string;
  date_of_birth: string;
  gender: string | null;
  room_number: string | null;
  status: string | null;
  admission_date: string | null;
  medical_conditions?: string[] | null;
  source: 'fhir' | 'local';
}

export type RosterSource = 'fhir' | 'local' | 'unavailable' | 'unsupported';

interface CensusPatient {
  id: string; mrn: string; firstName: string; lastName: string; dob: string; gender: string;
  room: string | null; admissionDate: string | null; status: 'active' | 'outpatient';
}

export const chartPathFor = (p: Pick<RosterPatient, 'id' | 'source'>) =>
  p.source === 'fhir' ? `/patient-chart/fhir/${encodeURIComponent(p.id)}` : `/patient-chart/${p.id}`;

export function useHospitalPatients() {
  const { activeConnection } = useMultiHospital();
  const hospitalId = activeConnection?.hospitalId;

  const census = useQuery({
    queryKey: ['fhir-census', hospitalId],
    enabled: !!hospitalId,
    staleTime: 60_000,
    retry: false,
    queryFn: () => callEmr<{ patients: CensusPatient[] }>(hospitalId!, 'get_census'),
  });

  const useLocal = !hospitalId || census.data?.kind === 'not_configured';
  const local = usePatients();

  let source: RosterSource = 'local';
  let patients: RosterPatient[] = [];

  if (census.data?.kind === 'ok') {
    source = 'fhir';
    patients = census.data.data.patients.map((p) => ({
      id: p.id,
      first_name: p.firstName,
      last_name: p.lastName,
      mrn: p.mrn,
      date_of_birth: p.dob,
      gender: p.gender,
      room_number: p.room,
      status: p.status,
      admission_date: p.admissionDate,
      source: 'fhir' as const,
    }));
  } else if (census.data?.kind === 'unavailable') {
    source = 'unavailable';
  } else if (census.data?.kind === 'unsupported') {
    source = 'unsupported';
  } else if (useLocal) {
    patients = (local.data || []).map((p) => ({ ...p, source: 'local' as const }));
  }

  const isLoading = (!!hospitalId && census.isLoading) || (useLocal && local.isLoading);

  return {
    patients,
    source,
    isLoading,
    error: census.error as Error | null,
    hospitalName: activeConnection?.hospitalName,
    refetch: census.refetch,
  };
}
