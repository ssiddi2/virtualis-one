import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { buildCensus } from "./census.ts";

const SYS = 'urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.14';

const soonJa = {
  resourceType: 'Patient', id: 'MRN-4100217', birthDate: '1957-07-03', gender: 'female',
  name: [{ given: ['Soon-ja'], family: 'Park' }],
  identifier: [{ value: 'E9971', type: { coding: [{ code: 'EPI' }] } }, { system: SYS, value: '4100217', type: { coding: [{ code: 'MR' }] } }],
};
const gerald = {
  resourceType: 'Patient', id: '2624', name: [{ given: ['Gerald', 'Thomas'], family: 'Whitaker' }],
  identifier: [{ system: 'urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.0', value: 'E7724' }, { system: SYS, value: '4100206' }],
};

Deno.test('census shows the MRN under the hospital identifier system, not the internal E-number', () => {
  const [p] = buildCensus([soonJa], [], SYS);
  assertEquals(p.mrn, '4100217');
});

Deno.test('census shows a blank MRN when the patient has none under the hospital system', () => {
  const noMrn = { ...soonJa, identifier: [{ value: 'E9971' }] };
  const [p] = buildCensus([noMrn], [], SYS);
  assertEquals(p.mrn, '');
});

Deno.test('room and admission come from the latest encounter that has not ended', () => {
  const encounters = [
    { subject: { reference: 'Patient/MRN-4100217' }, status: 'unknown', class: { code: 'AMB' }, period: { start: '2026-10-20T09:00:00Z' } },
    { subject: { reference: 'Patient/MRN-4100217' }, status: 'unknown', class: { code: 'IMP' }, period: { start: '2026-11-12T16:10:00Z' },
      hospitalization: { extension: [
        { url: 'http://intersystems.com/fhir/extn/sda3/lib/encounter-assigned-bed', valueString: 'A' },
        { url: 'http://intersystems.com/fhir/extn/sda3/lib/encounter-assigned-room', valueString: '428' },
        { url: 'http://intersystems.com/fhir/extn/sda3/lib/encounter-assigned-ward', valueString: 'SRMC-4W' },
      ] } },
    { subject: { reference: 'Patient/2624' }, status: 'in-progress', class: { code: 'IMP' }, period: { start: '2026-11-12T09:20:00-08:00' },
      location: [{ location: { display: 'SRMC Neuro ICU NI03-A' } }] },
  ];
  const [p, g] = buildCensus([soonJa, gerald], encounters, SYS);
  assertEquals(p.room, 'SRMC-4W 428-A');
  assertEquals(p.admissionDate, '2026-11-12T16:10:00Z');
  assertEquals(p.status, 'active');
  assertEquals(g.room, 'SRMC Neuro ICU NI03-A');
});

Deno.test('a patient whose encounters have all ended has no room and is not shown as admitted', () => {
  const encounters = [
    { subject: { reference: 'Patient/2624' }, status: 'finished', class: { code: 'IMP' }, period: { start: '2026-04-08T09:00:00Z', end: '2026-04-09T09:00:00Z' },
      location: [{ location: { display: 'SRMC Neuro ICU NI03-A' } }] },
  ];
  const [g] = buildCensus([gerald], encounters, SYS);
  assertEquals(g.room, null);
  assertEquals(g.status, 'outpatient');
});
