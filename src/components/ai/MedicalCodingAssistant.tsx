
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
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Medical Coding Assistant</h1>
          <p className="text-white/70">Intelligent medical coding suggestions powered by AI</p>
        </div>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="h-5 w-5 text-blue-400" />
              AI Medical Coding Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Medical Documentation</Label>
              <Textarea
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                placeholder="Paste medical documentation here for AI coding analysis (diagnosis, procedures, etc.)"
                rows={6}
                className="bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/60"
              />
            </div>

            <Button
              onClick={getCodingSuggestions}
              disabled={isLoading || !documentation.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
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
      </div>
    </div>
  );
};

export default MedicalCodingAssistant;
