import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Radio, User, Loader2, RefreshCw, ChevronDown, ClipboardList, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useMultiHospital } from '@/contexts/MultiHospitalContext';
import { useFhirPatientChart } from '@/hooks/useFhirPatientChart';
import { groupLabsByPanel, attachImagingReports } from '@/lib/fhirChartGrouping';
import { PlaceEmrOrderDialog, WriteEmrNoteDialog } from '@/components/patient/emr/EmrWriteDialogs';

const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtDateTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—';
const ageFrom = (dob?: string) => {
  if (!dob) return null;
  const b = new Date(dob);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
};
const byDateDesc = (key: string) => (a: any, b: any) => String(b[key] || '').localeCompare(String(a[key] || ''));

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen p-6 bg-gradient-to-br from-background via-card to-secondary text-foreground">
    <div className="max-w-7xl mx-auto space-y-6">{children}</div>
  </div>
);

const EmptyRow = ({ cols, text }: { cols: number; text: string }) => (
  <tr><td colSpan={cols} className="text-center text-muted-foreground py-8">{text}</td></tr>
);

const FhirPatientChart = () => {
  const { fhirId: rawId } = useParams<{ fhirId: string }>();
  const fhirId = rawId ? decodeURIComponent(rawId) : undefined;
  const navigate = useNavigate();
  const { activeConnection } = useMultiHospital();
  const hospitalId = activeConnection?.hospitalId;
  const [tab, setTab] = useState('overview');
  const [orderOpen, setOrderOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const { data, isLoading, error, refetch, isFetching } = useFhirPatientChart(hospitalId, fhirId);

  const openStay = useMemo(
    () => (data?.encounters || [])
      .filter((e) => !e.endDate && e.status !== 'finished' && e.status !== 'cancelled')
      .sort(byDateDesc('startDate'))[0],
    [data?.encounters],
  );
  const latestVitals = useMemo(() => {
    const sorted = [...(data?.vitals || [])].sort(byDateDesc('effectiveDate'));
    const seen = new Map<string, any>();
    for (const v of sorted) if (!seen.has(v.name)) seen.set(v.name, v);
    return [...seen.values()];
  }, [data?.vitals]);

  const back = (
    <Button variant="secondary" onClick={() => navigate('/patients')}>
      <ArrowLeft className="h-4 w-4 mr-2" /> Back to patients
    </Button>
  );

  if (!hospitalId) {
    return <Shell>{back}<p className="text-muted-foreground">Pick a hospital first to open a live chart.</p></Shell>;
  }
  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading chart from {activeConnection?.hospitalName} EMR…</p>
        </div>
      </Shell>
    );
  }
  if (error) {
    return (
      <Shell>
        {back}
        <Card className="clinical-card border-critical/40">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-critical" />
              <p>Couldn't load this chart: {(error as Error).message}</p>
            </div>
            <Button size="sm" onClick={() => refetch()}>Try again</Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }
  if (data?.unavailable) {
    return (
      <Shell>
        {back}
        <Card className="clinical-card border-warning/40">
          <CardContent className="p-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p>EMR connection unavailable — the hospital connection is still being set up.</p>
          </CardContent>
        </Card>
      </Shell>
    );
  }
  const p = data?.patient;
  if (!p) {
    return <Shell>{back}<p className="text-muted-foreground">This patient wasn't found in {activeConnection?.hospitalName} EMR.</p></Shell>;
  }

  const age = ageFrom(p.dob);
  const activeAllergies = (data!.allergies || []).filter((a) => !a.clinicalStatus || a.clinicalStatus === 'active');
  const activeConditions = (data!.conditions || []).filter((c) => !c.clinicalStatus || c.clinicalStatus === 'active');
  const activeMeds = (data!.medications || []).filter((m) => ['active', 'on-hold', 'draft'].includes(m.status));
  const labs = [...(data!.labs || [])].sort(byDateDesc('effectiveDate'));
  const abnormalLabs = labs.filter((l) => l.interpretation && !['N', 'normal'].includes(l.interpretation));
  const labPanels = groupLabsByPanel(labs, data!.reports || []);
  const imagingRows = attachImagingReports(data!.imaging || [], data!.reports || []);
  const immunizations = [...(data!.immunizations || [])].sort(byDateDesc('occurrenceDate'));

  return (
    <Shell>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {back}
        <div className="flex items-center gap-2">
          <Badge className="gap-1.5 bg-success text-success-foreground hover:bg-success">
            <Radio className="h-3.5 w-3.5" /> Live from {activeConnection?.hospitalName} EMR
          </Badge>
          <Button size="sm" onClick={() => setOrderOpen(true)}>
            <ClipboardList className="h-4 w-4 mr-1" /> Place order
          </Button>
          <Button size="sm" onClick={() => setNoteOpen(true)}>
            <FileText className="h-4 w-4 mr-1" /> Write note
          </Button>
          <Button size="sm" variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Patient banner */}
      <Card className="clinical-card">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <User className="h-9 w-9 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{p.firstName} {p.lastName}</h1>
                <p className="text-sm text-muted-foreground">
                  MRN: {p.mrn || '—'} • DOB: {fmtDate(p.dob)}{age !== null ? ` • Age: ${age}` : ''} • {p.gender}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">Room: {openStay?.location || 'Not admitted'}</Badge>
              <Badge variant="secondary">Admitted: {openStay ? fmtDate(openStay.startDate) : '—'}</Badge>
            </div>
          </div>
          {activeAllergies.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-critical/40 bg-critical/15 p-3">
              <AlertTriangle className="h-4 w-4 text-critical" />
              <span className="font-semibold">ALLERGIES:</span>
              <span>{activeAllergies.map((a) => a.allergen).join(', ')}</span>
            </div>
          )}
          {data!.failed.length > 0 && (
            <p className="text-sm text-warning">Some sections couldn't load: {data!.failed.join(', ')}.</p>
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="problems">Problems ({data!.conditions.length})</TabsTrigger>
          <TabsTrigger value="medications">Medications ({data!.medications.length})</TabsTrigger>
          <TabsTrigger value="labs">Labs ({labs.length})</TabsTrigger>
          <TabsTrigger value="vitals">Vitals ({data!.vitals.length})</TabsTrigger>
          <TabsTrigger value="imaging">Imaging ({imagingRows.length})</TabsTrigger>
          <TabsTrigger value="immunizations">Immunizations ({immunizations.length})</TabsTrigger>
          <TabsTrigger value="encounters">Visits ({data!.encounters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="clinical-card">
            <CardHeader><CardTitle className="text-lg">Active problems</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {activeConditions.slice(0, 5).map((c) => (
                <div key={c.id || c.name} className="rounded border border-border/40 p-2">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.code}</p>
                </div>
              ))}
              {activeConditions.length === 0 && <p className="text-muted-foreground">No active problems</p>}
            </CardContent>
          </Card>
          <Card className="clinical-card">
            <CardHeader><CardTitle className="text-lg">Latest vitals</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {latestVitals.slice(0, 8).map((v) => (
                <div key={v.name} className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{v.name}</span>
                  <span className="font-medium">{v.value ?? '—'} {v.unit || ''}</span>
                </div>
              ))}
              {latestVitals.length === 0 && <p className="text-muted-foreground">No vitals recorded</p>}
            </CardContent>
          </Card>
          <Card className="clinical-card">
            <CardHeader><CardTitle className="text-lg">Abnormal labs</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {abnormalLabs.slice(0, 8).map((l) => (
                <div key={l.id || `${l.name}-${l.effectiveDate}`} className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{l.name}</span>
                  <span className="font-medium text-critical">{l.value} ({l.interpretation})</span>
                </div>
              ))}
              {abnormalLabs.length === 0 && <p className="text-muted-foreground">No abnormal results</p>}
            </CardContent>
          </Card>
          <Card className="clinical-card md:col-span-3">
            <CardHeader><CardTitle className="text-lg">Active medications ({activeMeds.length})</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {activeMeds.map((m) => <Badge key={m.id || m.name} variant="secondary">{m.name}</Badge>)}
              {activeMeds.length === 0 && <p className="text-muted-foreground">No active medications</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems">
          <Card className="clinical-card"><CardContent className="p-0">
            <table className="epic-lab-table">
              <thead><tr><th>Problem</th><th>ICD-10</th><th>Status</th><th>Recorded</th></tr></thead>
              <tbody>
                {data!.conditions.map((c) => (
                  <tr key={c.id || c.name}>
                    <td className="font-medium">{c.name}</td><td>{c.code || '—'}</td>
                    <td><Badge variant={c.clinicalStatus === 'active' ? 'destructive' : 'secondary'}>{c.clinicalStatus || '—'}</Badge></td>
                    <td>{fmtDate(c.recordedDate || c.onsetDate)}</td>
                  </tr>
                ))}
                {data!.conditions.length === 0 && <EmptyRow cols={4} text="No problems documented" />}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card className="clinical-card"><CardContent className="p-0">
            <table className="epic-lab-table">
              <thead><tr><th>Medication</th><th>Dose</th><th>Reason</th><th>Status</th><th>Ordered</th></tr></thead>
              <tbody>
                {data!.medications.map((m) => (
                  <tr key={m.id || m.name}>
                    <td className="font-medium">{m.name || '—'}</td><td>{m.dosage || '—'}</td><td>{m.reasonCode || '—'}</td>
                    <td><Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge></td>
                    <td>{fmtDateTime(m.authoredOn)}</td>
                  </tr>
                ))}
                {data!.medications.length === 0 && <EmptyRow cols={5} text="No medications" />}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          {labPanels.map((panel) => {
            const flagged = panel.results.filter((l) => l.interpretation && !['N', 'normal'].includes(l.interpretation)).length;
            return (
              <Card key={panel.id} className="clinical-card">
                <CardHeader className="py-3 flex flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="text-base">{panel.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {flagged > 0 && <Badge variant="destructive">{flagged} abnormal</Badge>}
                    <span>{fmtDateTime(panel.date)}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="epic-lab-table">
                    <thead><tr><th>Test</th><th>Result</th><th>Reference</th><th>Flag</th></tr></thead>
                    <tbody>
                      {panel.results.map((l) => {
                        const abnormal = l.interpretation && !['N', 'normal'].includes(l.interpretation);
                        return (
                          <tr key={l.id || `${l.name}-${l.effectiveDate}`}>
                            <td className="font-medium">{l.name}</td>
                            <td className={abnormal ? 'text-critical font-semibold' : ''}>{l.value || '—'}</td>
                            <td>{l.referenceRange || '—'}</td>
                            <td>{l.interpretation || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
          {labPanels.length === 0 && (
            <Card className="clinical-card"><CardContent className="py-8 text-center text-muted-foreground">No lab results</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="vitals">
          <Card className="clinical-card"><CardContent className="p-0">
            <table className="epic-lab-table">
              <thead><tr><th>Measure</th><th>Value</th><th>Taken</th></tr></thead>
              <tbody>
                {[...data!.vitals].sort(byDateDesc('effectiveDate')).map((v, i) => (
                  <tr key={v.id || `${v.name}-${v.effectiveDate}-${i}`}>
                    <td className="font-medium">{v.name}</td><td>{v.value ?? '—'} {v.unit || ''}</td><td>{fmtDateTime(v.effectiveDate)}</td>
                  </tr>
                ))}
                {data!.vitals.length === 0 && <EmptyRow cols={3} text="No vitals recorded" />}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="imaging" className="space-y-4">
          {imagingRows.map((s) => (
            <Card key={s.id} className="clinical-card">
              <CardHeader className="py-3 flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base">{s.description || 'Imaging study'}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {s.modality && <Badge variant="secondary">{s.modality}</Badge>}
                  <span>{fmtDateTime(s.started)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {s.report?.conclusion ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Impression</p>
                    <p className="font-medium">{s.report.conclusion}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{s.report ? 'Report has no impression.' : 'No report yet.'}</p>
                )}
                {s.report?.reportText && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="px-0 group">
                        <ChevronDown className="h-4 w-4 mr-1 transition-transform group-data-[state=open]:rotate-180" />
                        Full report
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="whitespace-pre-wrap font-sans text-sm rounded-md border border-border/40 bg-muted/30 p-3">{s.report.reportText}</pre>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          ))}
          {imagingRows.length === 0 && (
            <Card className="clinical-card"><CardContent className="py-8 text-center text-muted-foreground">No imaging studies</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="immunizations">
          <Card className="clinical-card"><CardContent className="p-0">
            <table className="epic-lab-table">
              <thead><tr><th>Vaccine</th><th>Status</th><th>Given</th></tr></thead>
              <tbody>
                {immunizations.map((im) => (
                  <tr key={im.id || `${im.vaccine}-${im.occurrenceDate}`}>
                    <td className="font-medium">{im.vaccine || '—'}</td>
                    <td><Badge variant={im.status === 'completed' ? 'default' : 'secondary'}>{im.status || '—'}</Badge></td>
                    <td>{fmtDate(im.occurrenceDate)}</td>
                  </tr>
                ))}
                {immunizations.length === 0 && <EmptyRow cols={3} text="No immunizations recorded" />}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="encounters">
          <Card className="clinical-card"><CardContent className="p-0">
            <table className="epic-lab-table">
              <thead><tr><th>Type</th><th>Location</th><th>Status</th><th>Start</th><th>End</th></tr></thead>
              <tbody>
                {[...data!.encounters].sort(byDateDesc('startDate')).map((e) => (
                  <tr key={e.id || e.startDate}>
                    <td className="font-medium">{e.type || (e.class === 'IMP' ? 'Inpatient' : e.class === 'AMB' ? 'Outpatient' : e.class) || '—'}</td>
                    <td>{e.location || '—'}</td><td>{e.status || '—'}</td>
                    <td>{fmtDateTime(e.startDate)}</td><td>{fmtDateTime(e.endDate)}</td>
                  </tr>
                ))}
                {data!.encounters.length === 0 && <EmptyRow cols={5} text="No visits" />}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <PlaceEmrOrderDialog
        open={orderOpen} onOpenChange={setOrderOpen}
        hospitalId={hospitalId} hospitalName={activeConnection?.hospitalName} patient={p}
      />
      <WriteEmrNoteDialog
        open={noteOpen} onOpenChange={setNoteOpen}
        hospitalId={hospitalId} hospitalName={activeConnection?.hospitalName} patient={p}
        location={openStay?.location}
      />
    </Shell>
  );
};

export default FhirPatientChart;
