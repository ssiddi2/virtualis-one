
import { useEffect } from "react";
import { AlisAIActivator } from '@/components/ambient/AlisAIActivator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Ambient = () => {
  useEffect(() => {
    document.title = "Ambient AI – Virtualis";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Ambient AI for hands-free clinical workflow and documentation');
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    if (!link.parentNode) document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/lovable-uploads/alis-ai-logo.png" alt="Alis AI" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Alis AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Voice-controlled ambient clinical AI assistant
          </p>
        </div>

        <div className="space-y-6">
          <AlisAIActivator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Getting started with Alis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Activate Alis AI</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Activate" button above to enable the floating assistant panel
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Connect to voice</h4>
                    <p className="text-sm text-muted-foreground">
                      Open the floating panel and click "Connect" to start voice mode
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Use voice commands</h4>
                    <p className="text-sm text-muted-foreground">
                      Say "Hey Alis" followed by commands like "Show patient chart" or "Order labs"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Navigate freely</h4>
                    <p className="text-sm text-muted-foreground">
                      Alis stays with you as you navigate through patient charts, maintaining context
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Example Commands:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Show patient chart for room 312"</li>
                  <li>• "Create a progress note"</li>
                  <li>• "Order CBC and metabolic panel"</li>
                  <li>• "Check medication list"</li>
                  <li>• "View vital signs"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ambient;
