
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { toast } from 'sonner';
import { Stethoscope, Brain, Loader2, AlertTriangle } from 'lucide-react';

const DiagnosisSupport = () => {
  const [symptoms, setSymptoms] = useState('');
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const { callAI, isLoading } = useAIAssistant();

  const getDiagnosisSuggestions = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter patient symptoms and findings');
      return;
    }

    try {
      const result = await callAI({
        type: 'diagnosis_support',
        data: { symptoms }
      });

      setSuggestions(result);
      toast.success('Differential diagnosis suggestions generated');
    } catch (error) {
      console.error('Diagnosis AI error:', error);
      toast.error('Failed to generate diagnosis suggestions');
    }
  };

  return (
    <Card className="bg-[#1a2332] border-[#2a3441] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-400" />
          AI Differential Diagnosis Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Patient Symptoms & Findings</Label>
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter patient symptoms, physical findings, lab results, imaging findings, etc."
            rows={6}
            className="bg-[#0f1922] border-[#2a3441] text-white"
          />
        </div>

        <Button
          onClick={getDiagnosisSuggestions}
          disabled={isLoading || !symptoms.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Clinical Data...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Get Differential Diagnosis
            </>
          )}
        </Button>

        {suggestions && (
          <div className="space-y-3">
            <Label className="text-blue-400">AI Differential Diagnosis Suggestions</Label>
            <div className="p-4 bg-[#0f1922] rounded-lg border border-blue-400/20">
              <pre className="whitespace-pre-wrap text-sm text-blue-100">
                {suggestions}
              </pre>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-red-400 text-red-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Clinical Judgment Required
              </Badge>
              <span className="text-xs text-white/60">
                For educational/support purposes only. Final diagnosis must be made by qualified clinicians.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosisSupport;
