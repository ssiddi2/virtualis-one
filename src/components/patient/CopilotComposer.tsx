
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
    <div className="space-y-6">
      <Card className="virtualis-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-virtualis-gold" />
            Virtualis Copilot Note Composer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white font-medium">Note Type</Label>
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {noteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white font-medium">Patient ID</Label>
              <div className="h-10 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md flex items-center">
                <span className="text-slate-400">{patientId || "Select patient"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">What happened? (Chief Complaint/Summary)</Label>
            <Textarea
              placeholder="Describe the patient's condition, symptoms, or reason for visit..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateNote}
            disabled={isGenerating || !noteType || !summary.trim()}
            className="virtualis-button w-full md:w-auto"
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
        </CardContent>
      </Card>

      {generatedNote && (
        <Card className="virtualis-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-virtualis-gold" />
              Generated Note Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedNote}
              onChange={(e) => setGeneratedNote(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={saveNote}
                disabled={isSaving}
                className="virtualis-button"
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
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CopilotComposer;
