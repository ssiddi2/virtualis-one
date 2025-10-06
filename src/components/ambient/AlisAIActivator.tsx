import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { Mic, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AlisAIActivator = () => {
  const { isActive, setActive, setMinimized } = useAlisAI();
  const { startAmbientMode } = useAmbientEMR();
  const { toast } = useToast();
  const [isActivating, setIsActivating] = useState(false);

  if (isActive) return null;

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      // Activate the floating panel
      setActive(true);
      setMinimized(false);
      
      // Auto-connect to ambient mode
      await startAmbientMode();
      
      toast({
        title: "Alis AI Activated",
        description: "Voice-controlled clinical assistant is ready",
      });
    } catch (error) {
      console.error('Failed to activate Alis AI:', error);
      toast({
        title: "Activation Failed",
        description: "Could not start ambient mode. Please try again.",
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
            <CardDescription>Your ambient clinical AI assistant</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Activate Alis AI for voice-controlled documentation, real-time clinical support, and ambient order entry.
        </p>
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
          Automatically connects when you activate
        </p>
      </CardContent>
    </Card>
  );
};
