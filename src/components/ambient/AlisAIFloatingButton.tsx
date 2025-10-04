import { Mic, MicOff, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AlisAIFloatingButtonProps {
  isListening: boolean;
  isConnected: boolean;
  onExpand: () => void;
  onToggle: () => void;
  className?: string;
}

export const AlisAIFloatingButton = ({
  isListening,
  isConnected,
  onExpand,
  onToggle,
  className,
}: AlisAIFloatingButtonProps) => {
  return (
    <div className={cn('flex items-center gap-2 p-2 bg-background/95 backdrop-blur border rounded-full shadow-lg', className)}>
      <img 
        src="/lovable-uploads/alis-ai-logo.png" 
        alt="Alis AI" 
        className="h-8 w-8"
      />
      
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                'h-8 w-8 rounded-full',
                isListening && 'animate-pulse bg-primary/20'
              )}
              onClick={onToggle}
            >
              {isConnected ? (
                <Mic className={cn('h-4 w-4', isListening && 'text-primary')} />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isConnected ? (isListening ? 'Listening...' : 'Click to activate') : 'Disconnected'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={onExpand}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Expand Panel</TooltipContent>
        </Tooltip>
      </div>

      {isConnected && (
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      )}
    </div>
  );
};
