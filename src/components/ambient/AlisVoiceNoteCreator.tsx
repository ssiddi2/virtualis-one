import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Loader2, FileText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAmbientEMR } from "@/hooks/useAmbientEMR";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlisVoiceNoteCreatorProps {
  patientId?: string;
  onNoteCreated?: (note: string, noteType: string) => void;
}

const AlisVoiceNoteCreator = ({ patientId, onNoteCreated }: AlisVoiceNoteCreatorProps) => {
  const { toast } = useToast();
  const {
    isConnected,
    isListening,
    messages,
    startAmbientMode,
    stopAmbientMode,
    sendVoiceCommand,
  } = useAmbientEMR();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [noteType, setNoteType] = useState<string>("");

  useEffect(() => {
    // Process messages for transcripts and function calls
    messages.forEach((msg: any) => {
      if (msg.type === 'conversation.item.input_audio_transcription.completed') {
        setTranscript(prev => prev + " " + (msg.transcript || ''));
      } else if (msg.type === 'response.function_call_arguments.done') {
        if (msg.name === 'create_clinical_note_from_voice') {
          const args = JSON.parse(msg.arguments || '{}');
          handleNoteFinalized(args);
        }
      }
    });
  }, [messages]);

  const startVoiceNote = async () => {
    try {
      await startAmbientMode();
      setIsRecording(true);
      setTranscript("");
      
      // Send command to activate note mode
      setTimeout(() => {
        sendVoiceCommand("Activate clinical documentation mode");
      }, 1000);
      
      toast({
        title: "Voice Note Activated",
        description: "Alis AI is listening. Start speaking your clinical findings.",
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to start voice note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceNote = () => {
    sendVoiceCommand("Finalize clinical note");
    setIsRecording(false);
    
    toast({
      title: "Processing Note",
      description: "Alis AI is structuring your documentation...",
    });
  };

  const handleNoteFinalized = (noteData: any) => {
    const fullNote = `
CHIEF COMPLAINT:
${noteData.chiefComplaint || 'Not documented'}

HISTORY OF PRESENT ILLNESS:
${noteData.hpi || 'Not documented'}

PHYSICAL EXAMINATION:
${noteData.examination || 'Not documented'}

ASSESSMENT:
${noteData.assessment || 'Not documented'}

PLAN:
${noteData.plan || 'Not documented'}
    `.trim();

    setNoteType(noteData.noteType || 'progress_note');
    
    if (onNoteCreated) {
      onNoteCreated(fullNote, noteData.noteType);
    }
    
    stopAmbientMode();
    
    toast({
      title: "Note Created",
      description: "Voice documentation has been structured into a clinical note.",
    });
  };

  const cancelVoiceNote = () => {
    stopAmbientMode();
    setIsRecording(false);
    setTranscript("");
    
    toast({
      title: "Voice Note Cancelled",
      description: "Recording stopped and data cleared.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <Mic className="h-5 w-5 text-virtualis-gold" />
            Alis AI Voice Documentation
          </CardTitle>
          {isConnected && (
            <Badge variant="outline" className="glass-badge success">
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {!isRecording ? (
            <Button
              onClick={startVoiceNote}
              disabled={isConnected && isRecording}
              className="glass-button flex-1"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Voice Note
            </Button>
          ) : (
            <>
              <Button
                onClick={stopVoiceNote}
                className="glass-button flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Finalize Note
              </Button>
              <Button
                onClick={cancelVoiceNote}
                variant="outline"
                className="glass-nav-item border-white/20 hover:border-red-500/50"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>

        {isRecording && (
          <div className="p-4 glass-nav-item animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white tech-font">Recording... Speak naturally about your clinical findings</span>
            </div>
          </div>
        )}

        {transcript && (
          <div className="space-y-2">
            <Label className="text-white font-medium tech-font text-sm">Live Transcript</Label>
            <ScrollArea className="h-[150px] p-3 glass-nav-item">
              <p className="text-white/80 text-sm whitespace-pre-wrap">{transcript}</p>
            </ScrollArea>
          </div>
        )}

        <div className="p-3 glass-nav-item">
          <p className="text-white/70 text-xs tech-font">
            💡 <strong>Tips:</strong> Speak clearly and naturally. Say "Alis, finalize note" when complete, 
            or click the Finalize button. The AI will structure your voice input into a proper clinical note.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlisVoiceNoteCreator;
