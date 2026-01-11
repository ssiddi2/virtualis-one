import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Search, User, Heart, Pill, AlertTriangle, 
  Activity, FileText, CheckCircle, XCircle, Loader2, 
  Stethoscope, TestTube, Radio
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PatientData {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  mrn: string;
  address?: string;
  phone?: string;
}

interface ClinicalData {
  medications: any[];
  allergies: any[];
  conditions: any[];
  observations: any[];
  encounters: any[];
  diagnosticReports: any[];
}

const TEST_PATIENTS = [
  { name: 'Camila Lopez', mrn: 'Z6129', description: 'Adult female patient' },
  { name: 'Derrick Lin', mrn: 'Z6141', description: 'Adult male patient' },
  { name: 'Jason Argonaut', mrn: 'Tbt3KuCY0B5PSrJvCu2j-PlK.aiทdq4gxePfvF5', description: 'Test patient' },
  { name: 'Baby Boy Argonaut', mrn: 'TbxPUo5rhSoiJQQ4CbIZe4A3', description: 'Pediatric patient' },
];

const EpicSandboxTest = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'mrn' | 'name'>('mrn');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingClinical, setIsLoadingClinical] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [clinicalData, setClinicalData] = useState<ClinicalData | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const testConnection = async () => {
    try {
      setConnectionStatus('unknown');
      const { data, error } = await supabase.functions.invoke('emr-proxy', {
        body: { operation: 'health_check' }
      });

      if (error) throw error;
      setConnectionStatus(data?.status === 'healthy' ? 'connected' : 'error');
      toast.success('Epic connection verified!');
    } catch (err: any) {
      setConnectionStatus('error');
      toast.error(`Connection failed: ${err.message}`);
    }
  };

  const searchPatient = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setPatient(null);
    setClinicalData(null);
    setRawResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke('emr-proxy', {
        body: { 
          operation: 'search_patients',
          params: searchType === 'mrn' 
            ? { identifier: searchQuery }
            : { name: searchQuery }
        }
      });

      if (error) throw error;
      
      setRawResponse(data);

      if (data?.patients && data.patients.length > 0) {
        const p = data.patients[0];
        setPatient({
          id: p.id,
          name: p.name || 'Unknown',
          birthDate: p.birthDate || 'Unknown',
          gender: p.gender || 'Unknown',
          mrn: p.mrn || searchQuery,
          address: p.address,
          phone: p.phone
        });
        toast.success(`Found patient: ${p.name}`);
      } else {
        toast.warning('No patients found');
      }
    } catch (err: any) {
      toast.error(`Search failed: ${err.message}`);
      setRawResponse({ error: err.message });
    } finally {
      setIsSearching(false);
    }
  };

  const loadClinicalData = async () => {
    if (!patient?.id) return;

    setIsLoadingClinical(true);
    
    try {
      // Fetch multiple resource types in parallel
      const [medsRes, allergiesRes, conditionsRes, obsRes, encountersRes, reportsRes] = await Promise.all([
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_medications', params: { patientId: patient.id } }
        }),
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_allergies', params: { patientId: patient.id } }
        }),
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_conditions', params: { patientId: patient.id } }
        }),
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_vitals', params: { patientId: patient.id } }
        }),
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_encounters', params: { patientId: patient.id } }
        }),
        supabase.functions.invoke('emr-proxy', {
          body: { operation: 'get_lab_results', params: { patientId: patient.id } }
        }),
      ]);

      setClinicalData({
        medications: medsRes.data?.medications || [],
        allergies: allergiesRes.data?.allergies || [],
        conditions: conditionsRes.data?.conditions || [],
        observations: obsRes.data?.vitals || obsRes.data?.observations || [],
        encounters: encountersRes.data?.encounters || [],
        diagnosticReports: reportsRes.data?.results || reportsRes.data?.reports || [],
      });

      toast.success('Clinical data loaded');
    } catch (err: any) {
      toast.error(`Failed to load clinical data: ${err.message}`);
    } finally {
      setIsLoadingClinical(false);
    }
  };

  const selectTestPatient = (mrn: string) => {
    setSearchQuery(mrn);
    setSearchType('mrn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Epic Sandbox Test</h1>
              <p className="text-white/60">Test FHIR API integration with Epic's sandbox environment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}
              className="flex items-center gap-1"
            >
              {connectionStatus === 'connected' ? (
                <><CheckCircle className="h-3 w-3" /> Connected</>
              ) : connectionStatus === 'error' ? (
                <><XCircle className="h-3 w-3" /> Error</>
              ) : (
                'Not Tested'
              )}
            </Badge>
            <Button onClick={testConnection} variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search & Test Patients */}
          <div className="space-y-6">
            {/* Search Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Patient Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={searchType === 'mrn' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('mrn')}
                    className={searchType === 'mrn' ? '' : 'text-white border-white/20'}
                  >
                    By MRN
                  </Button>
                  <Button
                    variant={searchType === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('name')}
                    className={searchType === 'name' ? '' : 'text-white border-white/20'}
                  >
                    By Name
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={searchType === 'mrn' ? 'Enter MRN (e.g., Z6129)' : 'Enter patient name'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchPatient()}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <Button onClick={searchPatient} disabled={isSearching}>
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Patients Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-sm">Epic Sandbox Test Patients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TEST_PATIENTS.map((tp) => (
                  <button
                    key={tp.mrn}
                    onClick={() => selectTestPatient(tp.mrn)}
                    className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <div className="font-medium text-white">{tp.name}</div>
                    <div className="text-xs text-white/60">MRN: {tp.mrn}</div>
                    <div className="text-xs text-white/40">{tp.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Patient Details & Clinical Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Demographics */}
            {patient && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Demographics
                  </CardTitle>
                  <Button 
                    onClick={loadClinicalData} 
                    disabled={isLoadingClinical}
                    size="sm"
                  >
                    {isLoadingClinical ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                    ) : (
                      <>Load Clinical Data</>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-white/60 text-xs uppercase">Name</div>
                      <div className="text-white font-medium">{patient.name}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs uppercase">MRN</div>
                      <div className="text-white font-medium">{patient.mrn}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs uppercase">Date of Birth</div>
                      <div className="text-white font-medium">{patient.birthDate}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs uppercase">Gender</div>
                      <div className="text-white font-medium capitalize">{patient.gender}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs uppercase">FHIR ID</div>
                      <div className="text-white font-mono text-sm truncate">{patient.id}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clinical Data Tabs */}
            {clinicalData && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <Tabs defaultValue="medications" className="w-full">
                    <TabsList className="bg-white/10 w-full grid grid-cols-6">
                      <TabsTrigger value="medications" className="text-xs">
                        <Pill className="h-3 w-3 mr-1" />
                        Meds ({clinicalData.medications.length})
                      </TabsTrigger>
                      <TabsTrigger value="allergies" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Allergies ({clinicalData.allergies.length})
                      </TabsTrigger>
                      <TabsTrigger value="conditions" className="text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        Conditions ({clinicalData.conditions.length})
                      </TabsTrigger>
                      <TabsTrigger value="vitals" className="text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        Vitals ({clinicalData.observations.length})
                      </TabsTrigger>
                      <TabsTrigger value="labs" className="text-xs">
                        <TestTube className="h-3 w-3 mr-1" />
                        Labs ({clinicalData.diagnosticReports.length})
                      </TabsTrigger>
                      <TabsTrigger value="encounters" className="text-xs">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Visits ({clinicalData.encounters.length})
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-80 mt-4">
                      <TabsContent value="medications" className="space-y-2">
                        {clinicalData.medications.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No medications found</p>
                        ) : (
                          clinicalData.medications.map((med, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="font-medium text-white">{med.name || med.medicationCodeableConcept?.text || 'Unknown'}</div>
                              <div className="text-sm text-white/60">{med.dosage || med.dosageInstruction?.[0]?.text || 'No dosage info'}</div>
                              <div className="text-xs text-white/40 mt-1">Status: {med.status || 'Unknown'}</div>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="allergies" className="space-y-2">
                        {clinicalData.allergies.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No allergies recorded</p>
                        ) : (
                          clinicalData.allergies.map((allergy, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-red-500/30">
                              <div className="font-medium text-red-300">{allergy.substance || allergy.code?.text || 'Unknown allergen'}</div>
                              <div className="text-sm text-white/60">{allergy.reaction || allergy.reaction?.[0]?.manifestation?.[0]?.text || 'No reaction info'}</div>
                              <Badge variant="destructive" className="mt-1 text-xs">
                                {allergy.criticality || allergy.severity || 'Unknown severity'}
                              </Badge>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="conditions" className="space-y-2">
                        {clinicalData.conditions.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No conditions found</p>
                        ) : (
                          clinicalData.conditions.map((cond, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="font-medium text-white">{cond.name || cond.code?.text || 'Unknown condition'}</div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                                  {cond.clinicalStatus || cond.clinicalStatus?.coding?.[0]?.code || 'Unknown status'}
                                </Badge>
                                {cond.onsetDateTime && (
                                  <span className="text-xs text-white/50">Onset: {cond.onsetDateTime}</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="vitals" className="space-y-2">
                        {clinicalData.observations.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No vitals recorded</p>
                        ) : (
                          clinicalData.observations.map((obs, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="font-medium text-white">{obs.name || obs.code?.text || 'Unknown observation'}</div>
                              <div className="text-lg text-cyan-300">
                                {obs.value || obs.valueQuantity?.value} {obs.unit || obs.valueQuantity?.unit || ''}
                              </div>
                              <div className="text-xs text-white/40">
                                {obs.effectiveDateTime || obs.date || 'No date'}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="labs" className="space-y-2">
                        {clinicalData.diagnosticReports.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No lab results found</p>
                        ) : (
                          clinicalData.diagnosticReports.map((report, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="font-medium text-white">{report.name || report.code?.text || 'Unknown test'}</div>
                              <div className="text-sm text-white/60">{report.conclusion || 'No conclusion'}</div>
                              <div className="text-xs text-white/40 mt-1">
                                Status: {report.status || 'Unknown'} | {report.effectiveDateTime || report.date || 'No date'}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="encounters" className="space-y-2">
                        {clinicalData.encounters.length === 0 ? (
                          <p className="text-white/50 text-center py-8">No encounters found</p>
                        ) : (
                          clinicalData.encounters.map((enc, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="font-medium text-white">{enc.type || enc.type?.[0]?.text || 'Unknown encounter'}</div>
                              <div className="text-sm text-white/60">{enc.class || enc.class?.display || 'Unknown class'}</div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                                  {enc.status || 'Unknown status'}
                                </Badge>
                                <span className="text-xs text-white/50">{enc.period?.start || enc.date || 'No date'}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Raw Response Debug */}
            {rawResponse && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Raw API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap">
                      {JSON.stringify(rawResponse, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!patient && !isSearching && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="py-16 text-center">
                  <Radio className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No Patient Selected</h3>
                  <p className="text-white/50 text-sm max-w-md mx-auto">
                    Search for a patient using MRN or name, or select one of the Epic sandbox test patients from the list.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpicSandboxTest;
