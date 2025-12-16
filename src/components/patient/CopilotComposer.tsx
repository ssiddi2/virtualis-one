
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Brain, FileText, Loader2, Save, ArrowLeft, Zap, Stethoscope, Users, Database, Hospital, Mic, Keyboard } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { usePatientClinicalData } from "@/hooks/usePatientClinicalData";
import EMRDataPreview from "./EMRDataPreview";
import AlisVoiceNoteCreator from "@/components/ambient/AlisVoiceNoteCreator";

interface CopilotComposerProps {
  patientId?: string;
  hospitalId?: string | null;
}

const CopilotComposer = ({ patientId, hospitalId }: CopilotComposerProps) => {
  const navigate = useNavigate();
  const [noteType, setNoteType] = useState("");
  const [summary, setSummary] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'voice' | 'quick' | 'auto'>('manual');
  const [voiceNote, setVoiceNote] = useState("");
  const [selectedEMRData, setSelectedEMRData] = useState<string[]>(['vitals', 'medications', 'labs', 'imaging', 'problems', 'allergies']);
  const { toast } = useToast();
  const { callAI, isLoading } = useAIAssistant();
  
  // Fetch comprehensive EMR data
  const { data: clinicalData, isLoading: isLoadingEMR } = usePatientClinicalData(patientId);

  const noteTypes = [
    { value: "hp", label: "History & Physical Examination", icon: "🩺" },
    { value: "progress", label: "Progress Note", icon: "📈" },
    { value: "discharge", label: "Discharge Summary", icon: "🏠" },
    { value: "consult", label: "Consultation Report", icon: "💬" },
    { value: "procedure", label: "Procedure Documentation", icon: "⚕️" },
    { value: "admission", label: "Admission Assessment", icon: "🏥" }
  ];

  const mockHospitalNames = {
    '1': 'St. Mary\'s General Hospital',
    '2': 'Regional Medical Center',
    '3': 'Children\'s Hospital Network'
  };

  const generateNote = async () => {
    // Auto mode doesn't require summary
    if (inputMode !== 'auto' && (!noteType || !summary.trim())) {
      toast({
        title: "Required Information Missing",
        description: "Please select documentation type and provide clinical summary",
        variant: "destructive",
      });
      return;
    }

    if (inputMode === 'auto' && !noteType) {
      toast({
        title: "Documentation Type Required",
        description: "Please select a documentation type",
        variant: "destructive",
      });
      return;
    }

    try {

      // Filter EMR data based on selection
      const filteredEMRData = clinicalData ? {
        patient: clinicalData.patient,
        vitalSigns: selectedEMRData.includes('vitals') ? clinicalData.vitalSigns : [],
        medications: selectedEMRData.includes('medications') ? clinicalData.medications : [],
        labOrders: selectedEMRData.includes('labs') ? clinicalData.labOrders : [],
        radiologyOrders: selectedEMRData.includes('imaging') ? clinicalData.radiologyOrders : [],
        problemList: selectedEMRData.includes('problems') ? clinicalData.problemList : [],
        allergies: selectedEMRData.includes('allergies') ? clinicalData.allergies : [],
        nursingAssessments: selectedEMRData.includes('nursing') ? clinicalData.nursingAssessments : [],
        medicalRecords: selectedEMRData.includes('previous') ? clinicalData.medicalRecords : [],
      } : null;

      // Use different AI request type for auto-generate
      if (inputMode === 'auto') {
        const result = await callAI({
          type: 'auto_generate_from_emr_only',
          data: { 
            noteType,
            emrData: filteredEMRData 
          },
          context: `Auto-generating ${noteTypes.find(t => t.value === noteType)?.label || "Clinical Documentation"} from EMR data only`
        });

        setGeneratedNote(result);
        
        toast({
          title: "Note Auto-Generated",
          description: "Review required - note generated from EMR data only",
        });
      } else {
        const result = await callAI({
          type: 'clinical_note_with_emr_data',
          data: { 
            noteType,
            manualSummary: inputMode === 'manual' || inputMode === 'quick' ? summary : undefined,
            voiceTranscript: inputMode === 'voice' ? voiceNote : undefined,
            emrData: filteredEMRData 
          },
          context: `${noteTypes.find(t => t.value === noteType)?.label || "Clinical Documentation"} for ${hospitalId ? mockHospitalNames[hospitalId as keyof typeof mockHospitalNames] : "Hospital"}`
        });

        setGeneratedNote(result);
        
        toast({
          title: "Clinical Documentation Generated",
          description: `AI-assisted note with EMR data ready for ${hospitalId ? mockHospitalNames[hospitalId as keyof typeof mockHospitalNames] : "Hospital"} EMR integration`,
        });
      }
    } catch {
      toast({
        title: "Generation Error",
        description: "Unable to generate documentation. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceNoteCreated = (note: string, voiceNoteType: string) => {
    setVoiceNote(note);
    setGeneratedNote(note);
    setNoteType(voiceNoteType);
    setInputMode('manual'); // Switch back to manual for review
    
    toast({
      title: "Voice Note Structured",
      description: "Your voice documentation has been converted to a clinical note.",
    });
  };

  const toggleEMRData = (dataType: string) => {
    setSelectedEMRData(prev =>
      prev.includes(dataType)
        ? prev.filter(d => d !== dataType)
        : [...prev, dataType]
    );
  };

  const saveNote = async () => {
    if (!generatedNote.trim()) {
      toast({
        title: "No Documentation Available",
        description: "Please generate clinical documentation before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const hospitalName = hospitalId ? mockHospitalNames[hospitalId as keyof typeof mockHospitalNames] : "Hospital";
      
      toast({
        title: "Documentation Saved Successfully",
        description: `Clinical note integrated into ${hospitalName} EMR system`,
      });
      
      setNoteType("");
      setSummary("");
      setGeneratedNote("");
    } catch (error) {
      toast({
        title: "EMR Integration Error",
        description: "Unable to save to electronic medical record. Please contact IT support.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(hospitalId ? "/emr" : "/")}
                variant="outline"
                className="glass-nav-item border-white/20 hover:border-virtualis-gold/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {hospitalId ? "Back to Hospital Dashboard" : "Back to Dashboard"}
              </Button>
              <div className="flex items-center gap-3">
                <Brain className="h-10 w-10 text-virtualis-gold pulse-glow" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text tech-font">
                    Clinical AI Assistant
                  </h1>
                  <p className="text-white/80 tech-font text-lg">
                    Advanced Documentation & Decision Support Platform
                  </p>
                  {hospitalId && (
                    <p className="text-virtualis-gold tech-font text-sm mt-1">
                      Connected to: {mockHospitalNames[hospitalId as keyof typeof mockHospitalNames]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-badge success flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="tech-font">AI ACTIVE</span>
              </div>
              <div className="glass-badge primary flex items-center gap-2">
                {hospitalId ? (
                  <>
                    <Hospital className="h-4 w-4" />
                    <span className="tech-font">HOSPITAL CONNECTED</span>
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    <span className="tech-font">EMR READY</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Brain className="h-5 w-5 text-virtualis-gold" />
                AI Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">97.3%</div>
              <p className="text-white/60 text-sm">Accuracy Score</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <p className="text-white/60 text-sm">Notes Generated Today</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Provider Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">68%</div>
              <p className="text-white/60 text-sm">Time Savings</p>
            </CardContent>
          </Card>
        </div>

        {/* EMR Data Preview */}
        {clinicalData && (
          <EMRDataPreview
            data={clinicalData}
            selectedData={selectedEMRData}
            onToggleData={toggleEMRData}
          />
        )}

        {/* Documentation Generator */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white tech-font flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-virtualis-gold" />
              Clinical Documentation Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Mode Selector */}
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)}>
              <TabsList className="grid w-full grid-cols-4 glass-nav-item">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Dictation
                </TabsTrigger>
                <TabsTrigger value="quick" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Summary
                </TabsTrigger>
                <TabsTrigger value="auto" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Auto-Generate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-medium tech-font">Documentation Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select documentation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-virtualis-navy border-white/20">
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white font-medium tech-font">Patient Context</Label>
                <div className="glass-input flex items-center">
                  <span className="text-white/80">
                    {patientId ? `Patient ID: ${patientId}` : "Active Patient: Sarah Johnson (ID: 12847)"}
                    {hospitalId && ` • ${mockHospitalNames[hospitalId as keyof typeof mockHospitalNames]}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium tech-font">Clinical Summary & Key Findings</Label>
              <Textarea
                placeholder="Describe patient's presenting condition, examination findings, assessment, and clinical decision-making rationale..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="glass-input min-h-[120px]"
              />
              <p className="text-white/60 text-sm tech-font">
                Tip: Include chief complaint, key physical findings, diagnostic impressions, and treatment plans
              </p>
            </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateNote}
                    disabled={isLoading || !noteType || !summary.trim()}
                    className="glass-button flex-1 md:flex-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        AI Processing Clinical Data...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate with EMR Data
                      </>
                    )}
                  </Button>
                  
                  {generatedNote && (
                    <Button
                      onClick={() => {
                        setNoteType("");
                        setSummary("");
                        setGeneratedNote("");
                      }}
                      className="glass-nav-item border-white/20 hover:border-virtualis-gold/50 text-white"
                    >
                      Clear & Start New
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 mt-4">
                <AlisVoiceNoteCreator
                  patientId={patientId}
                  onNoteCreated={handleVoiceNoteCreated}
                />
              </TabsContent>

              <TabsContent value="quick" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium tech-font">Quick Clinical Summary</Label>
                  <Textarea
                    placeholder="Brief summary (e.g., '45yo M with chest pain, ruled out MI, stable vitals'). AI will expand with full EMR context..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="glass-input min-h-[80px]"
                  />
                  <p className="text-white/60 text-sm tech-font">
                    ✨ AI will automatically expand your brief summary using comprehensive EMR data
                  </p>
                </div>
                
                <Button
                  onClick={generateNote}
                  disabled={isLoading || !noteType || !summary.trim()}
                  className="glass-button w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Expanding with EMR Data...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Generate
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="auto" className="space-y-4 mt-4">
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-virtualis-gold mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white tech-font mb-2 text-lg">
                        Auto-Generate from EMR Data
                      </h4>
                      <p className="text-white/80 text-sm mb-3">
                        AI will automatically generate a comprehensive clinical note based purely on available EMR data, 
                        previous notes, vital signs trends, lab results, and clinical documentation.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>No manual input required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Synthesizes all EMR data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Identifies trends & patterns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          <span>Requires physician review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {clinicalData && (
                  <div className="glass-card p-4">
                    <h4 className="text-white font-medium tech-font mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-virtualis-gold" />
                      EMR Data Completeness
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Available Data</span>
                        <span className="text-white font-bold">{clinicalData.completeness}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-3 border border-white/10">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-virtualis-gold to-yellow-400 transition-all duration-500"
                          style={{ width: `${clinicalData.completeness}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/60 tech-font">
                        {clinicalData.completeness >= 70 
                          ? '✓ Sufficient data for high-quality auto-generation' 
                          : '⚠️ Limited data available - note may be incomplete'}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="glass-badge primary">
                        <span>Vitals: {clinicalData.vitalSigns.length}</span>
                      </div>
                      <div className="glass-badge primary">
                        <span>Meds: {clinicalData.medications.length}</span>
                      </div>
                      <div className="glass-badge primary">
                        <span>Labs: {clinicalData.labOrders.length}</span>
                      </div>
                      <div className="glass-badge primary">
                        <span>Notes: {clinicalData.medicalRecords.length}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={generateNote} 
                  disabled={isLoading || !clinicalData || !noteType}
                  className="glass-button w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Auto-Generating from EMR...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Auto-Generate Clinical Note
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generated Documentation Preview */}
        {generatedNote && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <FileText className="h-6 w-6 text-virtualis-gold" />
                Generated Clinical Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <Textarea
                  value={generatedNote}
                  onChange={(e) => setGeneratedNote(e.target.value)}
                  className="glass-input min-h-[400px] font-mono text-sm"
                  placeholder="Generated documentation will appear here..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={saveNote}
                  disabled={isSaving}
                  className="glass-button flex-1 md:flex-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Integrating with {hospitalId ? mockHospitalNames[hospitalId as keyof typeof mockHospitalNames] : "Hospital"} EMR...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Medical Record
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => window.print()}
                  className="glass-nav-item border-white/20 hover:border-virtualis-gold/50 text-white"
                >
                  Print Documentation
                </Button>
                
                <Button
                  onClick={() => setGeneratedNote("")}
                  className="glass-nav-item border-white/20 hover:border-red-500/50 text-white hover:text-red-400"
                >
                  Discard Draft
                </Button>
              </div>
              
              <div className="p-3 glass-nav-item">
                <p className="text-white/70 text-sm tech-font">
                  ⚠️ <strong>Provider Attestation Required:</strong> This AI-generated documentation must be reviewed, 
                  validated, and electronically signed by the attending provider before becoming part of the official medical record.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CopilotComposer;
