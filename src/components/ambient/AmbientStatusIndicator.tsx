import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

interface AmbientStatusIndicatorProps {
  isConnected?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  wakeWordActive?: boolean;
  className?: string;
}

const AmbientStatusIndicator = ({ 
  isConnected = false, 
  isListening = false,
  isProcessing = false,
  wakeWordActive = false,
  className = ""
}: AmbientStatusIndicatorProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isListening || isProcessing) {
      setPulse(true);
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setPulse(false);
    }
  }, [isListening, isProcessing]);

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-500/20 text-red-300 border-red-400/30';
    if (isProcessing) return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
    if (isListening) return 'bg-green-500/20 text-green-300 border-green-400/30';
    if (wakeWordActive) return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (isProcessing) return 'Processing';
    if (isListening) return 'Listening';
    if (wakeWordActive) return 'Wake Word Active';
    return 'Ready';
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-3 w-3" />;
    if (isProcessing) return <Volume2 className="h-3 w-3" />;
    if (isListening) return <Mic className="h-3 w-3" />;
    if (wakeWordActive) return <Zap className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className={`
              ${getStatusColor()} 
              ${pulse ? 'animate-pulse' : ''} 
              ${className}
              flex items-center gap-1 transition-all duration-300
            `}
          >
            {getStatusIcon()}
            <span className="text-xs font-medium">{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-600 text-white">
          <div className="space-y-1">
            <p className="font-medium">Ambient EMR Status</p>
            <div className="text-xs space-y-1">
              <p>Connection: {isConnected ? '✓ Connected' : '✗ Disconnected'}</p>
              <p>Wake Word: {wakeWordActive ? '✓ Active' : '✗ Inactive'}</p>
              <p>Voice: {isListening ? '✓ Listening' : '✗ Idle'}</p>
              {isProcessing && <p>🔄 Processing voice command...</p>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AmbientStatusIndicator;