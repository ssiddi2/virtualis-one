import { useState, useEffect } from 'react';
import { X, Minus, Maximize2, GripVertical, TestTube, Mic2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useElevenLabsAmbient } from '@/hooks/useElevenLabsAmbient';
import { AlisAIFloatingButton } from './AlisAIFloatingButton';
import { ConversationThread } from './ConversationThread';
import { StatusBar } from './StatusBar';
import { toast } from '@/hooks/use-toast';

export const AlisAIFloatingPanel = () => {
  const { isActive, isMinimized, isExpanded, currentContext, setActive, setMinimized, setExpanded } = useAlisAI();
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    stopAmbientMode,
    setVolume: setAudioVolume,
  } = useElevenLabsAmbient();

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [volume, setVolume] = useState(0.8);

  // Load position and volume from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('alisAIPosition');
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error('Failed to load Alis AI position:', e);
      }
    }

    const savedVolume = localStorage.getItem('alisAIVolume');
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem('alisAIVolume', newVolume.toString());
    setAudioVolume(newVolume);
  };

  const getStatusType = () => {
    if (!isConnected) return 'disconnected';
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
          <img 
            src="/lovable-uploads/alis-ai-logo.png" 
            alt="Alis AI" 
            className="h-10 w-10 rounded-full shadow-lg shadow-primary/20 ring-2 ring-primary/10" 
          />
          <div>
            <h3 className="font-semibold text-sm">Alis AI</h3>
            <p className="text-xs text-muted-foreground">{getContextDisplay()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <StatusBar status={getStatusType()} action={null} />
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
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="p-3">
          <ConversationThread messages={messages} isExpanded={isExpanded} />
        </TabsContent>

        <TabsContent value="control" className="p-3">
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status</span>
                <StatusBar status={getStatusType()} action={null} />
              </div>
              
              {isConnected && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Voice input: Active</p>
                  <p>• Audio output: {isSpeaking ? 'Speaking' : 'Ready'}</p>
                  <p>• Context: {getContextDisplay()}</p>
                  <p>• Powered by: ElevenLabs</p>
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
                <Volume2 className="h-4 w-4 text-primary" />
                <Label htmlFor="volume-slider" className="text-sm font-medium">Volume</Label>
                <span className="text-xs text-muted-foreground ml-auto">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                id="volume-slider"
                value={[volume]}
                onValueChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">About ElevenLabs:</p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md space-y-1 backdrop-blur-sm">
                <p>• Ultra-realistic voice quality</p>
                <p>• Natural conversation flow</p>
                <p>• Low latency responses</p>
                <p>• Context-aware assistance</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Troubleshooting:</p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md space-y-1 backdrop-blur-sm">
                <p>• Check browser console for logs</p>
                <p>• Ensure microphone permissions granted</p>
                <p>• Look for "Speaking" status when AI responds</p>
                <p>• Adjust volume if audio is too quiet/loud</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
