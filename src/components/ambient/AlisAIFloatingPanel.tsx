import { useState, useEffect } from 'react';
import { X, Minus, Maximize2, GripVertical, TestTube, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { AlisAIFloatingButton } from './AlisAIFloatingButton';
import { ConversationThread } from './ConversationThread';
import { StatusBar } from './StatusBar';
import { toast } from '@/hooks/use-toast';

const VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Clear and direct' },
  { id: 'fable', name: 'Fable', description: 'Warm and expressive' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
];

export const AlisAIFloatingPanel = () => {
  const { isActive, isMinimized, isExpanded, currentContext, setActive, setMinimized, setExpanded } = useAlisAI();
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    currentAction,
    stopAmbientMode,
    sendVoiceCommand,
    updateVoice,
    getAvailableCommands,
  } = useAmbientEMR();

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedVoice, setSelectedVoice] = useState('shimmer');

  // Load position and voice from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('alisAIPosition');
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error('Failed to load Alis AI position:', e);
      }
    }

    const savedVoice = localStorage.getItem('alisAIVoice');
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('alisAIPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (!isActive) return null;

  const handleDisconnect = async () => {
    await stopAmbientMode();
    setActive(false);
  };

  const handleTestCommand = () => {
    sendVoiceCommand("Hello Alis, please tell me the current time and confirm you can hear me");
    toast({
      title: "Test Command Sent",
      description: "Testing Alis AI response",
    });
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('alisAIVoice', voice);
    updateVoice(voice);
    toast({
      title: "Voice Updated",
      description: `Alis will now use the ${VOICES.find(v => v.id === voice)?.name} voice`,
    });
  };

  const getStatusType = () => {
    if (!isConnected) return 'disconnected';
    if (currentAction) return 'executing';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'processing';
  };

  const getContextDisplay = () => {
    const parts = currentContext.route.split('/').filter(Boolean);
    if (parts[0] === 'patients' && currentContext.patientName) {
      return `Patient: ${currentContext.patientName}`;
    }
    if (parts[0] === 'cpoe') return 'Order Entry';
    if (parts[0] === 'clinical') return 'Clinical Workflow';
    if (parts[0] === 'dashboard') return 'Dashboard';
    return parts[0] || 'Home';
  };

  // Minimized state - floating button
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }}
        className="cursor-move"
        onMouseDown={handleMouseDown}
      >
        <AlisAIFloatingButton
          isListening={isListening}
          isConnected={isConnected}
          onExpand={() => setMinimized(false)}
          onToggle={handleDisconnect}
        />
      </div>
    );
  }

  // Expanded panel
  return (
    <Card
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        width: isExpanded ? '600px' : '380px',
        maxHeight: isExpanded ? '700px' : '500px',
      }}
      className={cn(
        "backdrop-blur-2xl bg-white/5 dark:bg-black/10 shadow-2xl overflow-hidden animate-scale-in",
        "border border-white/20",
        "relative",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
        isListening && "shadow-[0_0_30px_rgba(var(--primary),0.3)]"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-white/10 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-xl cursor-move relative z-10"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <img src="/lovable-uploads/alis-ai-logo.png" alt="Alis AI" className="h-6 w-6" />
          <div>
            <h3 className="font-semibold text-sm">Alis AI</h3>
            <p className="text-xs text-muted-foreground">{getContextDisplay()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <StatusBar status={getStatusType()} action={currentAction} />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setExpanded(!isExpanded)}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setMinimized(true)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleDisconnect}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="p-3">
          <ConversationThread messages={messages} isExpanded={isExpanded} />
        </TabsContent>

        <TabsContent value="commands" className="p-3 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick Test:</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleTestCommand}
              disabled={!isConnected}
            >
              <TestTube className="mr-2 h-3 w-3" />
              Test Alis Response
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Clinical Commands:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendVoiceCommand('show patient chart')}
                disabled={!isConnected}
              >
                Patient Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendVoiceCommand('create progress note')}
                disabled={!isConnected}
              >
                Progress Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendVoiceCommand('order labs')}
                disabled={!isConnected}
              >
                Order Labs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendVoiceCommand('view medications')}
                disabled={!isConnected}
              >
                Medications
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Available Commands:</p>
            <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md max-h-[200px] overflow-auto">
              {getAvailableCommands()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="control" className="p-3">
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status</span>
                <StatusBar status={getStatusType()} action={currentAction} />
              </div>
              
              {isConnected && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Voice input: Active</p>
                  <p>• Audio output: {isSpeaking ? 'Speaking' : 'Ready'}</p>
                  <p>• Context: {getContextDisplay()}</p>
                </div>
              )}

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleDisconnect}
              >
                Disconnect & Close
              </Button>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Mic2 className="h-4 w-4 text-primary" />
                <Label htmlFor="voice-select" className="text-sm font-medium">Alis Voice</Label>
              </div>
              <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                <SelectTrigger id="voice-select" className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Troubleshooting:</p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md space-y-1 backdrop-blur-sm">
                <p>• Check browser console for audio logs</p>
                <p>• Ensure microphone permissions granted</p>
                <p>• Try the test button in Commands tab</p>
                <p>• Look for "Speaking" status when AI responds</p>
                <p>• If rate limited, wait a few seconds and retry</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
