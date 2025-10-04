import { useState, useEffect } from 'react';
import { X, Minus, Maximize2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAlisAI } from '@/contexts/AlisAIContext';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { AlisAIFloatingButton } from './AlisAIFloatingButton';
import AmbientStatusIndicator from './AmbientStatusIndicator';

export const AlisAIFloatingPanel = () => {
  const { isActive, isMinimized, isExpanded, currentContext, setActive, setMinimized, setExpanded } = useAlisAI();
  const {
    isConnected,
    isListening,
    messages,
    startAmbientMode,
    stopAmbientMode,
    sendVoiceCommand,
    getAvailableCommands,
  } = useAmbientEMR();

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

  const handleToggleConnection = async () => {
    if (isConnected) {
      await stopAmbientMode();
    } else {
      await startAmbientMode();
    }
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
          onToggle={handleToggleConnection}
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
      className="shadow-2xl border-2"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b bg-muted/50 cursor-move"
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
          <AmbientStatusIndicator
            isConnected={isConnected}
            isListening={isListening}
          />
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
            onClick={() => setActive(false)}
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
          <ScrollArea className={cn('w-full', isExpanded ? 'h-[600px]' : 'h-[380px]')}>
            <div className="space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <p>No activity yet</p>
                  <p className="text-xs mt-1">Say "Hey Alis" to start</p>
                </div>
              ) : (
                messages.slice().reverse().map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-2 rounded text-xs',
                      msg.type === 'transcript' && 'bg-primary/10',
                      msg.type === 'function_call' && 'bg-accent/10',
                      msg.type === 'voice_activity' && 'bg-muted/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {msg.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="commands" className="p-3">
          <ScrollArea className={cn('w-full', isExpanded ? 'h-[600px]' : 'h-[380px]')}>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2">
                Available voice commands:
              </div>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                {getAvailableCommands()}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="control" className="p-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ambient Mode</span>
              <Button
                variant={isConnected ? 'destructive' : 'default'}
                size="sm"
                onClick={handleToggleConnection}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick Commands:</p>
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
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
