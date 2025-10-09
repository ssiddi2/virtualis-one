import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useElevenLabsAmbient } from '@/hooks/useElevenLabsAmbient';
import { Mic, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Default ElevenLabs Agent ID - users can create their own in ElevenLabs dashboard
const DEFAULT_AGENT_ID = 'your-agent-id-here';

export const AlisAIActivator = () => {
  const { isActive, setActive, setMinimized } = useAlisAI();
  const { startAmbientMode } = useElevenLabsAmbient();
  const [isActivating, setIsActivating] = useState(false);
  const [agentId, setAgentId] = useState(() => {
    return localStorage.getItem('elevenLabsAgentId') || DEFAULT_AGENT_ID;
  });

  if (isActive) return null;

  const handleActivate = async () => {
    if (!agentId || agentId === 'your-agent-id-here') {
      toast({
        title: "Agent ID Required",
        description: "Please enter your ElevenLabs Agent ID from the dashboard",
        variant: "destructive",
      });
      return;
    }

    setIsActivating(true);
    try {
      // Save agent ID
      localStorage.setItem('elevenLabsAgentId', agentId);
      
      // Activate the floating panel
      setActive(true);
      setMinimized(false);
      
      // Auto-connect to ambient mode with ElevenLabs
      await startAmbientMode(agentId);
      
      toast({
        title: "Alis AI Activated",
        description: "Voice-controlled clinical assistant is ready with ElevenLabs",
      });
    } catch (error) {
      console.error('Failed to activate Alis AI:', error);
      toast({
        title: "Activation Failed",
        description: error instanceof Error ? error.message : "Could not start ambient mode. Please try again.",
        variant: "destructive",
      });
      setActive(false);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/alis-ai-logo.png" alt="Alis AI" className="h-12 w-12" />
          <div>
            <CardTitle className="flex items-center gap-2">
              Alis AI
              <Sparkles className="h-4 w-4 text-primary" />
            </CardTitle>
            <CardDescription>Powered by ElevenLabs Conversational AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Activate Alis AI for ultra-realistic voice conversations with natural dialogue and low latency responses.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="agent-id" className="text-sm font-medium">
            ElevenLabs Agent ID
          </Label>
          <Input
            id="agent-id"
            type="text"
            placeholder="Enter your agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Create an agent at{' '}
            <a 
              href="https://elevenlabs.io/app/conversational-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              elevenlabs.io/app/conversational-ai
            </a>
          </p>
        </div>

        <Button
          onClick={handleActivate}
          className="w-full"
          size="lg"
          disabled={isActivating}
        >
          {isActivating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Alis...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Alis AI
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Ultra-realistic voice • Natural conversations • Low latency
        </p>
      </CardContent>
    </Card>
  );
};
