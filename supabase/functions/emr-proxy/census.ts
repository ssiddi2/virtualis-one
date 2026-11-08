// Hospital census built from live FHIR reads (Patient + Encounter).
// A patient's current stay is their latest encounter that has not ended.
import { displayMrn } from "./mrnMatch.ts";

const CLOSED = new Set(['finished', 'cancelled', 'entered-in-error']);

export function isOpenEncounter(enc: any): boolean {
  return !!enc && !enc.period?.end && !CLOSED.has(enc.status);
}

// Room/bed for an encounter: the location display when the server provides it,
// otherwise the ward/room/bed hospitalization extensions (IRIS SDA3 style).
export function roomFor(enc: any): string | null {
  const display = (enc?.location || []).map((l: any) => l?.location?.display).find(Boolean);
  if (display) return display;
  const ext: any[] = enc?.hospitalization?.extension || [];
  const val = (suffix: string) => ext.find((e) => String(e?.url || '').endsWith(suffix))?.valueString;
  const ward = val('assigned-ward');
  const room = val('assigned-room');
  const bed = val('assigned-bed');
  if (!room) return null;
  return [ward, bed ? `${room}-${bed}` : room].filter(Boolean).join(' ');
}

function subjectId(enc: any): string | null {
  const ref = enc?.subject?.reference as string | undefined;
  return ref?.startsWith('Patient/') ? ref.slice('Patient/'.length) : null;
}

export interface CensusPatient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  room: string | null;
  admissionDate: string | null;
  encounterClass: string | null;
  status: 'active' | 'outpatient';
}

export function buildCensus(patients: any[], encounters: any[], system: string | null): CensusPatient[] {
  const openByPatient = new Map<string, any>();
  for (const enc of encounters) {
    if (!isOpenEncounter(enc)) continue;
    const pid = subjectId(enc);
    if (!pid) continue;
    const prev = openByPatient.get(pid);
    if (!prev || String(enc.period?.start || '') > String(prev.period?.start || '')) openByPatient.set(pid, enc);
  }

  return patients.map((p) => {
    const name = p.name?.[0] || {};
    const stay = openByPatient.get(p.id);
    return {
      id: p.id,
      mrn: displayMrn(p, system),
      firstName: name.given?.join(' ') || '',
      lastName: name.family || '',
      dob: p.birthDate || '',
      gender: p.gender || 'unknown',
      room: stay ? roomFor(stay) : null,
      admissionDate: stay?.period?.start || null,
      encounterClass: stay?.class?.code || null,
      status: stay ? 'active' : 'outpatient',
    };
  });
}
