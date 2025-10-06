import { useState, useEffect } from 'react';
import { X, Minus, Maximize2, GripVertical, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { AlisAIFloatingButton } from './AlisAIFloatingButton';
import { ConversationThread } from './ConversationThread';
import { StatusBar } from './StatusBar';
import { useToast } from '@/components/ui/use-toast';

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
    getAvailableCommands,
  } = useAmbientEMR();
  const { toast } = useToast();

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('alisAIPosition');
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load Alis AI position:', e);
      }
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
      className="backdrop-blur-xl bg-background/80 shadow-2xl border border-white/20 overflow-hidden animate-scale-in"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-white/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm cursor-move"
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
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
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

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Troubleshooting:</p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md space-y-1">
                <p>• Check browser console for audio logs</p>
                <p>• Ensure microphone permissions granted</p>
                <p>• Try the test button in Commands tab</p>
                <p>• Look for "Speaking" status when AI responds</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
