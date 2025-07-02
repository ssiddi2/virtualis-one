
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
import { useAICopilotContext } from '@/components/ai/AICopilotProvider';

interface CopilotTriggerButtonProps {
  patient?: any;
  context?: any;
  variant?: 'floating' | 'inline';
  className?: string;
}

const CopilotTriggerButton = ({ 
  patient, 
  context, 
  variant = 'inline',
  className = '' 
}: CopilotTriggerButtonProps) => {
  const { openCopilot } = useAICopilotContext();

  const handleClick = () => {
    openCopilot(patient, context);
  };

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleClick}
          className={`
            h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
            hover:from-cyan-600 hover:to-blue-600 border-2 border-white/20 
            shadow-2xl backdrop-blur-sm group relative overflow-hidden
            ${className}
          `}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-md animate-pulse"></div>
          
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white group-hover:animate-spin" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/80 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm whitespace-nowrap">
              AI Co-pilot (Ctrl+Space)
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
            </div>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className={`
        bg-gradient-to-r from-cyan-600/20 to-blue-600/20 
        hover:from-cyan-600/30 hover:to-blue-600/30 
        border border-cyan-400/30 text-white backdrop-blur-sm
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Sparkles className="h-4 w-4" />
          <div className="absolute inset-0 bg-cyan-400/30 blur-sm animate-pulse"></div>
        </div>
        <span>AI Co-pilot</span>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Ctrl+Space
        </Badge>
      </div>
    </Button>
  );
};

export default CopilotTriggerButton;
