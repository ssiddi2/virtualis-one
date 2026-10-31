// Strict MRN matching: a Patient is only returned for an MRN search when its
// identifier list actually contains that MRN (and, if the hospital has an
// identifier system configured, under that system). Anything else = no match.

export function buildMrnIdentifier(mrn: string, system: string | null): string {
  return system ? `${system}|${mrn}` : mrn;
}

export function patientHasMrn(patient: any, mrn: string, system: string | null): boolean {
  const ids: any[] = Array.isArray(patient?.identifier) ? patient.identifier : [];
  return ids.some((i) => String(i?.value ?? '') === String(mrn) && (!system || i?.system === system));
}

export function filterByMrn(patients: any[], mrn: string, system: string | null): any[] {
  return patients.filter((p) => patientHasMrn(p, mrn, system));
}
