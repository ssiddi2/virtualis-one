// DiagnosticReport mapping. Lab reports group Observations into panels (via `result`);
// radiology reports carry the radiologist's read (`conclusion` + text in `presentedForm`)
// and point at the ImagingStudy they interpret (via `imagingStudy`).

export type ReportKind = 'lab' | 'imaging' | 'other';

export interface MappedReport {
  id: string;
  kind: ReportKind;
  name: string;
  code?: string;
  status?: string;
  effectiveDate?: string;
  issuedDate?: string;
  conclusion?: string;
  reportText?: string;
  resultIds: string[];
  imagingStudyIds: string[];
}

const IMAGING_CATEGORIES = new Set(['RAD', 'IMG', 'RUS', 'CT', 'MR', 'NMR', 'NMS', 'VUS', 'XR', 'CUS', 'RX', 'imaging', 'radiology']);
const LAB_CATEGORIES = new Set(['LAB', 'HM', 'CH', 'MB', 'SP', 'BLB', 'laboratory']);

function kindOf(fhir: any): ReportKind {
  const codes: string[] = (fhir.category || []).flatMap((c: any) => [
    ...(c.coding || []).map((x: any) => x.code),
    c.text,
  ]).filter(Boolean);
  if (codes.some((c) => IMAGING_CATEGORIES.has(c))) return 'imaging';
  if ((fhir.imagingStudy || []).length) return 'imaging';
  if (codes.some((c) => LAB_CATEGORIES.has(c))) return 'lab';
  if ((fhir.result || []).length) return 'lab';
  return 'other';
}

/** Decodes the first plain-text attachment (base64 UTF-8) of a report. */
export function reportTextOf(fhir: any): string | undefined {
  const form = (fhir.presentedForm || []).find((f: any) => f?.data && (!f.contentType || f.contentType.startsWith('text/')));
  if (!form) return undefined;
  try {
    const bin = atob(form.data);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes).trim();
  } catch {
    return undefined;
  }
}

/** Pulls the "IMPRESSION:" section out of a report body. */
export function impressionFrom(text?: string): string | undefined {
  if (!text) return undefined;
  const m = text.match(/IMPRESSION:\s*([\s\S]*?)(?:\n\s*\n[A-Z][A-Z ]+:|$)/);
  return m?.[1]?.trim() || undefined;
}

const idsFrom = (refs: any[] | undefined, type: string) =>
  (refs || [])
    .map((r: any) => String(r?.reference || ''))
    .filter((r) => r.startsWith(`${type}/`))
    .map((r) => r.slice(type.length + 1));

export function mapDiagnosticReport(fhir: any): MappedReport {
  const reportText = reportTextOf(fhir);
  return {
    id: fhir.id,
    kind: kindOf(fhir),
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    code: fhir.code?.coding?.[0]?.code,
    status: fhir.status,
    effectiveDate: fhir.effectiveDateTime || fhir.effectivePeriod?.start,
    issuedDate: fhir.issued,
    conclusion: fhir.conclusion || impressionFrom(reportText),
    reportText,
    resultIds: idsFrom(fhir.result, 'Observation'),
    imagingStudyIds: idsFrom(fhir.imagingStudy, 'ImagingStudy'),
  };
}
