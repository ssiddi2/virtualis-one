import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Zap, ZapOff } from 'lucide-react';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import { Badge } from '@/components/ui/badge';

const AmbientControlPanel = () => {
  const {
    isConnected,
    isListening,
    messages,
    startAmbientMode,
    stopAmbientMode,
    sendVoiceCommand
  } = useAmbientEMR();

  const quickCommands = [
    { label: "Show Patient Chart", command: "Navigate to patient chart" },
    { label: "Open Lab Results", command: "Show lab results" },
    { label: "Create Progress Note", command: "Create a progress note" },
    { label: "Order Lab Work", command: "I need to order lab work" }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Ambient EMR Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Listening Indicator */}
        {isConnected && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Listening:</span>
            <div className="flex items-center gap-2">
              {isListening ? (
                <Mic className="h-4 w-4 text-green-500 animate-pulse" />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant={isListening ? "default" : "outline"}>
                {isListening ? "Active" : "Waiting"}
              </Badge>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-2">
          {!isConnected ? (
            <Button 
              onClick={startAmbientMode}
              className="w-full"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Ambient Mode
            </Button>
          ) : (
            <Button 
              onClick={stopAmbientMode}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <ZapOff className="h-4 w-4 mr-2" />
              Stop Ambient Mode
            </Button>
          )}
        </div>

        {/* Quick Commands */}
        {isConnected && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Quick Commands:</span>
            <div className="grid grid-cols-2 gap-2">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendVoiceCommand(cmd.command)}
                  className="text-xs h-auto py-2 px-2"
                >
                  {cmd.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {messages.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Recent Activity:</span>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {messages.slice(-3).map((message) => (
                <div key={message.id} className="text-xs p-2 bg-muted rounded text-muted-foreground">
                  <span className="font-medium">{message.type}</span>
                  {message.content && (
                    <div className="truncate">{message.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmbientControlPanel;