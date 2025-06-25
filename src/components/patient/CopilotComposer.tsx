
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Brain, FileText, Loader2, Save, ArrowLeft, Zap, Stethoscope, Users, Database } from "lucide-react";

const CopilotComposer = ({ patientId }: { patientId?: string }) => {
  const navigate = useNavigate();
  const [noteType, setNoteType] = useState("");
  const [summary, setSummary] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const noteTypes = [
    { value: "hp", label: "History & Physical Examination", icon: "🩺" },
    { value: "progress", label: "Progress Note", icon: "📈" },
    { value: "discharge", label: "Discharge Summary", icon: "🏠" },
    { value: "consult", label: "Consultation Report", icon: "💬" },
    { value: "procedure", label: "Procedure Documentation", icon: "⚕️" },
    { value: "admission", label: "Admission Assessment", icon: "🏥" }
  ];

  const generateNote = async () => {
    if (!noteType || !summary.trim()) {
      toast({
        title: "Required Information Missing",
        description: "Please select documentation type and provide clinical summary",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated clinical note with more realistic content
      const noteTypeData = noteTypes.find(t => t.value === noteType);
      const mockNote = `${noteTypeData?.label || "Clinical Documentation"}
Generated: ${new Date().toLocaleString()}
Provider: Dr. Sarah Smith, MD

═══════════════════════════════════════════════════════════

CLINICAL SUMMARY: ${summary}

DETAILED ASSESSMENT:

SUBJECTIVE:
Patient presents with ${summary.toLowerCase()}. Reports onset approximately [timeframe] ago. 
Pain/symptoms described as [character]. Associated symptoms include [review of systems].
Current medications and allergies reviewed. No acute distress noted at time of examination.

OBJECTIVE:
Vital Signs: 
- Temperature: 98.6°F (37.0°C)
- Blood Pressure: 120/80 mmHg  
- Heart Rate: 78 bpm, regular
- Respiratory Rate: 16/min
- Oxygen Saturation: 98% on room air

Physical Examination:
- General: Alert, oriented x3, cooperative
- HEENT: Normocephalic, atraumatic
- Cardiovascular: Regular rate and rhythm, no murmurs
- Pulmonary: Clear to auscultation bilaterally
- Abdomen: Soft, non-tender, non-distended
- Extremities: No edema, distal pulses intact
- Neurological: Grossly intact, no focal deficits

ASSESSMENT & PLAN:

Primary Diagnosis: ${summary}

1. IMMEDIATE MANAGEMENT:
   • Continued monitoring of vital signs
   • Pain management as appropriate
   • Laboratory studies as clinically indicated
   • Imaging studies if warranted

2. ONGOING CARE:
   • Regular reassessment of symptoms
   • Medication reconciliation and optimization
   • Patient education regarding condition
   • Coordination with specialist consultants as needed

3. DISCHARGE PLANNING:
   • Anticipated discharge when clinically stable
   • Follow-up appointments scheduled
   • Home care instructions provided
   • Emergency precautions discussed

CLINICAL IMPRESSION:
Patient's condition appears ${summary.includes('stable') ? 'stable' : 'requiring ongoing assessment'} 
with appropriate response to current treatment regimen.

═══════════════════════════════════════════════════════════

Documentation completed using Virtualis One™ AI Clinical Assistant
Electronic signature pending provider review and attestation

This note was generated with artificial intelligence assistance and requires 
provider validation before inclusion in the official medical record.

AI Confidence Score: 94.7%
Clinical Decision Support: Active
Quality Assurance: Passed automated checks`;

      setGeneratedNote(mockNote);
      
      toast({
        title: "Clinical Documentation Generated",
        description: "AI-assisted note ready for provider review and electronic signature",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Unable to generate documentation. Please check network connection and retry.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
      // Simulate EMR integration delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Documentation Saved Successfully",
        description: "Clinical note integrated into patient medical record system",
      });
      
      // Clear form after successful save
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
                onClick={() => navigate("/")}
                variant="outline"
                className="glass-nav-item border-white/20 hover:border-virtualis-gold/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-badge success flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="tech-font">AI ACTIVE</span>
              </div>
              <div className="glass-badge primary flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="tech-font">EMR CONNECTED</span>
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

        {/* Documentation Generator */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white tech-font flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-virtualis-gold" />
              Clinical Documentation Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <span className="text-white/80">{patientId || "Active Patient: Sarah Johnson (ID: 12847)"}</span>
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
                disabled={isGenerating || !noteType || !summary.trim()}
                className="glass-button flex-1 md:flex-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI Processing Clinical Data...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Clinical Documentation
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
                      Integrating with EMR System...
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
