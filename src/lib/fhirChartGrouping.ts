// Shapes live FHIR chart data for display: labs grouped into their report panels,
// and imaging studies paired with the radiologist's report that interprets them.

export interface ChartReport {
  id: string;
  kind: 'lab' | 'imaging' | 'other';
  name: string;
  status?: string;
  effectiveDate?: string;
  issuedDate?: string;
  conclusion?: string;
  reportText?: string;
  resultIds: string[];
  imagingStudyIds: string[];
}

export interface LabPanel {
  id: string;
  name: string;
  date?: string;
  status?: string;
  results: any[];
}

const desc = (a?: string, b?: string) => String(b || '').localeCompare(String(a || ''));

export function groupLabsByPanel(labs: any[], reports: ChartReport[]): LabPanel[] {
  const byId = new Map(labs.map((l) => [l.id, l]));
  const used = new Set<string>();
  const panels: LabPanel[] = [];

  for (const r of reports.filter((x) => x.kind === 'lab')) {
    const results = r.resultIds.map((id) => byId.get(id)).filter(Boolean);
    if (!results.length) continue;
    results.forEach((l) => used.add(l.id));
    panels.push({
      id: r.id,
      name: r.name || 'Lab panel',
      date: r.effectiveDate || results[0]?.effectiveDate || r.issuedDate,
      status: r.status,
      results,
    });
  }

  const loose = labs.filter((l) => !used.has(l.id));
  if (loose.length) {
    panels.push({
      id: 'other-results',
      name: 'Other results',
      date: [...loose].sort((a, b) => desc(a.effectiveDate, b.effectiveDate))[0]?.effectiveDate,
      results: loose,
    });
  }

  return panels.sort((a, b) => desc(a.date, b.date));
}

export interface ImagingRow {
  id: string;
  description?: string;
  modality?: string;
  status?: string;
  started?: string;
  report?: ChartReport;
}

export function attachImagingReports(studies: any[], reports: ChartReport[]): ImagingRow[] {
  const imagingReports = reports.filter((r) => r.kind === 'imaging');
  const used = new Set<string>();
  const rows: ImagingRow[] = studies.map((s) => {
    const report = imagingReports.find((r) => r.imagingStudyIds.includes(s.id));
    if (report) used.add(report.id);
    return { ...s, report };
  });
  // Radiology reports whose study wasn't returned still deserve a row.
  for (const r of imagingReports) {
    if (used.has(r.id)) continue;
    rows.push({ id: `report-${r.id}`, description: r.name, status: r.status, started: r.effectiveDate || r.issuedDate, report: r });
  }
  return rows.sort((a, b) => desc(a.started, b.started));
}
