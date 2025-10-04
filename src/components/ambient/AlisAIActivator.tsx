import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { Mic, Sparkles } from 'lucide-react';

export const AlisAIActivator = () => {
  const { isActive, setActive } = useAlisAI();

  if (isActive) return null;

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
          onClick={() => setActive(true)}
          className="w-full"
          size="lg"
        >
          <Mic className="mr-2 h-4 w-4" />
          Activate Alis AI
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Say "Hey Alis" to wake the assistant
        </p>
      </CardContent>
    </Card>
  );
};
