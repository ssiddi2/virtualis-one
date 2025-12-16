
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AITestComponent = () => {
  const [testPrompt, setTestPrompt] = useState('Patient has chest pain and shortness of breath');
  const [result, setResult] = useState('');
  const { callAI, isLoading, error } = useAIAssistant();

  const testAI = async () => {
    try {
      const response = await callAI({
        type: 'clinical_note',
        data: { summary: testPrompt },
        context: 'Test clinical note generation'
      });
      setResult(response);
      toast.success('AI test successful!');
    } catch (err) {
      toast.error('AI test failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Prompt:</label>
          <Textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter a test clinical summary..."
            rows={3}
          />
        </div>

        <Button onClick={testAI} disabled={isLoading || !testPrompt.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing AI...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Test AI Assistant
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            Error: {error}
          </div>
        )}

        {result && (
          <div>
            <label className="block text-sm font-medium mb-2">AI Response:</label>
            <div className="p-3 bg-gray-50 border rounded text-sm whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITestComponent;
