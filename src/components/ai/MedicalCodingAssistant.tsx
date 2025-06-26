
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { toast } from 'sonner';
import { Brain, Code, Loader2, ClipboardCopy } from 'lucide-react';

const MedicalCodingAssistant = () => {
  const [documentation, setDocumentation] = useState('');
  const [codingSuggestions, setCodingSuggestions] = useState<string | null>(null);
  const { callAI, isLoading } = useAIAssistant();

  const getCodingSuggestions = async () => {
    if (!documentation.trim()) {
      toast.error('Please enter medical documentation for coding analysis');
      return;
    }

    try {
      const result = await callAI({
        type: 'medical_coding',
        data: { 
          diagnosis: documentation,
          context: 'Standard medical encounter'
        }
      });

      setCodingSuggestions(result);
      toast.success('AI coding suggestions generated successfully');
    } catch (error) {
      console.error('Coding AI error:', error);
      toast.error('Failed to generate coding suggestions');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Card className="bg-[#1a2332] border-[#2a3441] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-green-400" />
          AI Medical Coding Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Medical Documentation</Label>
          <Textarea
            value={documentation}
            onChange={(e) => setDocumentation(e.target.value)}
            placeholder="Paste medical documentation here for AI coding analysis (diagnosis, procedures, etc.)"
            rows={6}
            className="bg-[#0f1922] border-[#2a3441] text-white"
          />
        </div>

        <Button
          onClick={getCodingSuggestions}
          disabled={isLoading || !documentation.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Documentation...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Get AI Coding Suggestions
            </>
          )}
        </Button>

        {codingSuggestions && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-green-400">AI Coding Suggestions</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(codingSuggestions)}
                className="border-green-400 text-green-400 hover:bg-green-400/10"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-[#0f1922] rounded-lg border border-green-400/20">
              <pre className="whitespace-pre-wrap text-sm font-mono text-green-100">
                {codingSuggestions}
              </pre>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                ⚠️ Verification Required
              </Badge>
              <span className="text-xs text-white/60">
                Always verify codes with certified medical coders before submission
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalCodingAssistant;
