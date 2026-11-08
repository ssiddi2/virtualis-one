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

// The MRN to display for a Patient. When the hospital has an identifier system,
// only an identifier under that system counts (never an internal/EPI id).
// Without a system, fall back to the MR-typed / single / OID identifier.
export function displayMrn(patient: any, system: string | null): string {
  const ids: any[] = Array.isArray(patient?.identifier) ? patient.identifier : [];
  if (system) return String(ids.find((i) => i?.system === system)?.value ?? '');
  const pick =
    ids.find((i) => i?.type?.coding?.[0]?.code === 'MR') ||
    (ids.length === 1 ? ids[0] : ids.find((i) => /^urn:oid:/.test(i?.system || '')));
  return String(pick?.value ?? '');
}
