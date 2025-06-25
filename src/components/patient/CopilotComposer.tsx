
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
    { value: "hp", label: "History & Physical" },
    { value: "progress", label: "Progress Note" },
    { value: "discharge", label: "Discharge Summary" },
    { value: "consult", label: "Consultation Note" },
    { value: "procedure", label: "Procedure Note" },
    { value: "admission", label: "Admission Note" }
  ];

  const generateNote = async () => {
    if (!noteType || !summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a note type and provide a summary",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated note
      const mockNote = `${noteTypes.find(t => t.value === noteType)?.label || "Note"}

CHIEF COMPLAINT: ${summary}

HISTORY OF PRESENT ILLNESS:
The patient presents with ${summary.toLowerCase()}. Detailed assessment reveals...

PHYSICAL EXAMINATION:
Vital Signs: Stable
General: Alert and oriented x3
[AI-generated content based on chief complaint]

ASSESSMENT AND PLAN:
1. ${summary}
   - Continue monitoring
   - Follow up as needed
   - Patient education provided

Plan reviewed with patient. Will monitor closely and adjust treatment as indicated.

Electronically signed by Virtualis One™ Copilot
Generated: ${new Date().toLocaleString()}`;

      setGeneratedNote(mockNote);
      
      toast({
        title: "Note Generated",
        description: "AI has generated your note. Please review and edit as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveNote = async () => {
    if (!generatedNote.trim()) {
      toast({
        title: "No Note to Save",
        description: "Please generate a note first",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call to save note
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Note Saved",
        description: "Note has been saved to the patient chart",
      });
      
      // Clear form
      setNoteType("");
      setSummary("");
      setGeneratedNote("");
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save note. Please try again.",
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
              Virtualis One™ Copilot
            </h1>
          </div>
          <p className="text-white/70 tech-font text-lg">
            AI-Powered Clinical Documentation Assistant
          </p>
        </div>

        <div className="glass-card">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white tech-font flex items-center gap-2">
              <Brain className="h-5 w-5 text-virtualis-gold" />
              Note Composer
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium tech-font">Note Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select note type" />
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
                <Label className="text-white font-medium tech-font">Patient ID</Label>
                <div className="glass-input flex items-center">
                  <span className="text-white/60">{patientId || "Select patient"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium tech-font">What happened? (Chief Complaint/Summary)</Label>
              <Textarea
                placeholder="Describe the patient's condition, symptoms, or reason for visit..."
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
                  Generating Note...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Note
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
                Generated Note Preview
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Chart
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setGeneratedNote("")}
                  className="glass-nav-item text-white hover:bg-white/10"
                >
                  Discard
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
