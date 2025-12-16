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
    <div className={cn(
      'flex items-center gap-2 p-2 rounded-full transition-all duration-300',
      'backdrop-blur-2xl bg-white/5 dark:bg-black/10',
      'border border-white/20',
      'shadow-2xl hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]',
      'relative',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-full before:pointer-events-none',
      isListening && 'shadow-[0_0_40px_rgba(var(--primary),0.4)] scale-105',
      className
    )}>
      <img 
        src="/lovable-uploads/alis-ai-logo-new.png" 
        alt="Alis AI" 
        className="h-8 w-auto max-w-[80px] object-contain shadow-lg shadow-primary/30 relative z-10"
      />
      
      <div className="flex items-center gap-1 relative z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                'h-8 w-8 rounded-full transition-all',
                isListening && 'animate-pulse bg-primary/30 shadow-lg shadow-primary/50'
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
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={onExpand}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Expand Panel</TooltipContent>
        </Tooltip>
      </div>

      {isConnected && (
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse relative z-10 shadow-lg shadow-green-500/50" />
      )}
    </div>
  );
};
