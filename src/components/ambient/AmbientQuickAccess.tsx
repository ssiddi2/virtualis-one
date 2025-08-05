import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, Mic, Brain, Settings, HelpCircle, Play, Square } from 'lucide-react';
import AmbientControlPanel from './AmbientControlPanel';
import AmbientStatusIndicator from './AmbientStatusIndicator';

interface AmbientQuickAccessProps {
  className?: string;
}

const AmbientQuickAccess = ({ className = "" }: AmbientQuickAccessProps) => {
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  
  // Mock ambient state - in real app this would come from useAmbientEMR
  const ambientState = {
    isConnected: true,
    isListening: false,
    wakeWordActive: true,
    isProcessing: false
  };

  const quickCommands = [
    { label: "Start Listening", icon: Mic, action: () => setIsAmbientActive(true) },
    { label: "Open Controls", icon: Settings, action: () => setShowControlPanel(true) },
    { label: "Quick Help", icon: HelpCircle, action: () => {} },
  ];

  return (
    <>
      <Card className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/30 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Zap className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <CardTitle className="text-white text-sm">Ambient EMR</CardTitle>
                <p className="text-slate-400 text-xs">Voice-controlled clinical workflow</p>
              </div>
            </div>
            <AmbientStatusIndicator 
              isConnected={ambientState.isConnected}
              isListening={ambientState.isListening}
              isProcessing={ambientState.isProcessing}
              wakeWordActive={ambientState.wakeWordActive}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Quick Start Button */}
          <Button
            onClick={() => setIsAmbientActive(!isAmbientActive)}
            className={`w-full ${
              isAmbientActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
            } text-white transition-all duration-300`}
          >
            {isAmbientActive ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Ambient Mode
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Ambient Mode
              </>
            )}
          </Button>

          {/* Quick Commands */}
          <div className="grid grid-cols-3 gap-2">
            {quickCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={command.action}
                className="flex flex-col items-center gap-1 h-auto py-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <command.icon className="h-3 w-3" />
                <span className="text-xs">{command.label}</span>
              </Button>
            ))}
          </div>

          {/* Status Info */}
          {isAmbientActive && (
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                Say "Hey Virtualis" to activate voice commands
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Available commands: Navigate, Create notes, Place orders, Get insights
              </div>
            </div>
          )}

          {/* AI Features Badge */}
          <div className="flex justify-center">
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered Clinical Assistant
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel Dialog */}
      <Dialog open={showControlPanel} onOpenChange={setShowControlPanel}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Ambient EMR Control Panel
            </DialogTitle>
          </DialogHeader>
          <AmbientControlPanel />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AmbientQuickAccess;