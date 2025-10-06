import { Badge } from '@/components/ui/badge';
import { Mic, Brain, Volume2, Zap, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusType = 'disconnected' | 'listening' | 'processing' | 'speaking' | 'executing';

interface StatusBarProps {
  status: StatusType;
  action?: string;
}

export const StatusBar = ({ status, action }: StatusBarProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          icon: <Mic className="h-3 w-3 animate-pulse" />,
          label: 'Listening',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
        };
      case 'processing':
        return {
          icon: <Brain className="h-3 w-3 animate-spin" />,
          label: 'Processing',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        };
      case 'speaking':
        return {
          icon: <Volume2 className="h-3 w-3 animate-pulse" />,
          label: 'Speaking',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
        };
      case 'executing':
        return {
          icon: <Zap className="h-3 w-3 animate-pulse" />,
          label: action || 'Executing',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
        };
      default:
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: 'Disconnected',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium transition-all',
        config.color,
        config.bgColor
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
