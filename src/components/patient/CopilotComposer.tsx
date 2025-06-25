
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Brain, FileText, Loader2, Save } from "lucide-react";

const CopilotComposer = ({ patientId }: { patientId?: string }) => {
  const [noteType, setNoteType] = useState("");
  const [summary, setSummary] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const noteTypes = [
    { value: "hp", label: "History & Physical Examination" },
    { value: "progress", label: "Progress Note" },
    { value: "discharge", label: "Discharge Summary" },
    { value: "consult", label: "Consultation Report" },
    { value: "procedure", label: "Procedure Documentation" },
    { value: "admission", label: "Admission Assessment" }
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
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated clinical note
      const mockNote = `${noteTypes.find(t => t.value === noteType)?.label || "Clinical Documentation"}

CHIEF COMPLAINT: ${summary}

HISTORY OF PRESENT ILLNESS:
Patient presents with ${summary.toLowerCase()}. Clinical assessment demonstrates...

PHYSICAL EXAMINATION:
Vital Signs: Within normal limits
General Appearance: Alert, oriented, cooperative
Systematic examination findings documented below...

ASSESSMENT & CLINICAL IMPRESSION:
Primary diagnosis consistent with presenting symptoms and examination findings.

TREATMENT PLAN:
1. ${summary}
   - Continue current therapeutic regimen
   - Monitor clinical response
   - Follow-up care as clinically indicated
   - Patient counseled regarding condition and treatment

Clinical documentation completed using Virtualis One™ AI Assistant
Provider review and attestation required per institutional policy

Generated: ${new Date().toLocaleString()}
Status: Pending Provider Review`;

      setGeneratedNote(mockNote);
      
      toast({
        title: "Clinical Documentation Generated",
        description: "AI-assisted note ready for provider review and attestation",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Unable to generate documentation. Please retry.",
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
        description: "Please generate clinical documentation first",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate EMR integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Documentation Saved",
        description: "Clinical note integrated into patient medical record",
      });
      
      // Clear form
      setNoteType("");
      setSummary("");
      setGeneratedNote("");
    } catch (error) {
      toast({
        title: "Integration Error",
        description: "Unable to save to EMR. Please contact IT support.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-virtualis-navy p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-8 w-8 text-virtualis-gold pulse-glow" />
            <h1 className="text-3xl font-bold text-white brand-font gradient-text">
              Clinical AI Assistant
            </h1>
          </div>
          <p className="text-white/70 tech-font text-lg">
            AI-Powered Clinical Documentation Support System
          </p>
        </div>

        <div className="glass-card">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white tech-font flex items-center gap-2">
              <Brain className="h-5 w-5 text-virtualis-gold" />
              Documentation Assistant
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium tech-font">Documentation Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select documentation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-virtualis-navy border-white/20">
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white font-medium tech-font">Patient Identifier</Label>
                <div className="glass-input flex items-center">
                  <span className="text-white/60">{patientId || "Select active patient"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium tech-font">Clinical Summary (Chief Complaint/Assessment)</Label>
              <Textarea
                placeholder="Describe patient's presenting condition, symptoms, or clinical findings..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="glass-input min-h-[100px]"
              />
            </div>

            <Button
              onClick={generateNote}
              disabled={isGenerating || !noteType || !summary.trim()}
              className="glass-button w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Clinical Documentation...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Documentation
                </>
              )}
            </Button>
          </div>
        </div>

        {generatedNote && (
          <div className="glass-card">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white tech-font flex items-center gap-2">
                <FileText className="h-5 w-5 text-virtualis-gold" />
                Clinical Documentation Preview
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <Textarea
                value={generatedNote}
                onChange={(e) => setGeneratedNote(e.target.value)}
                className="glass-input min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={saveNote}
                  disabled={isSaving}
                  className="glass-button"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Integrating with EMR...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Medical Record
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setGeneratedNote("")}
                  className="glass-nav-item text-white hover:bg-white/10"
                >
                  Discard Draft
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopilotComposer;
